/**
 * W02 · Tasks Workspace — Board, List, Dynamic Grouping & Drag-and-Drop.
 *
 * CoreDesk precision operational workboard:
 * - Dual Views: [ Board ] (default) and [ List ] with persistent preference
 * - Dynamic Grouping: Status (default), Priority, Milestone, Project
 * - Drag and Drop Engine: Reorder within column & move across groups with drag-safety rules
 * - Desktop-Anchored Task Inspector integration (side-by-side on wide screens)
 * - Accessible fallback context actions
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { useStore } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { daysUntil, dueLabel, formatDate } from '../domain/dates';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/primitives';
import type { Task, TaskPriority, TaskStatus, TaskWithContext } from '../domain/types';

type ViewMode = 'board' | 'list';
type GroupBy = 'status' | 'attention' | 'priority' | 'milestone' | 'project';
type FilterOption = 'all' | 'attention' | 'overdue' | 'today' | 'high-priority';
type SortOption = 'manual' | 'due' | 'priority' | 'title';

interface GroupColumn {
  id: string;
  title: string;
  key: string;
  tasks: TaskWithContext[];
}

export function TasksScreen() {
  const { state, dispatch, derived } = useStore();
  const overlay = useOverlay();

  // 1. View & Grouping Preferences (Persisted)
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      return (localStorage.getItem('coredesk.tasks.view') as ViewMode) || 'board';
    } catch {
      return 'board';
    }
  });

  const [groupBy, setGroupBy] = useState<GroupBy>('status');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('manual');

  // Context Menu State
  const [menuTaskId, setMenuTaskId] = useState<string | null>(null);
  const [menuAnchorPos, setMenuAnchorPos] = useState<{ x: number; y: number } | null>(null);

  // Drag & Drop State
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);

  // Quick inline add state per column
  const [inlineAddColId, setInlineAddColId] = useState<string | null>(null);
  const [inlineTaskTitle, setInlineTaskTitle] = useState('');

  const workspaceRef = useRef<HTMLDivElement>(null);

  // 2. Measure Available Workspace Width (Independent of Viewport Breakpoints)
  const [availableWidth, setAvailableWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useEffect(() => {
    const el = workspaceRef.current;
    if (!el) return;
    const target = el.parentElement || el;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setAvailableWidth(entry.contentRect.width);
        }
      }
    });
    ro.observe(target);
    return () => ro.disconnect();
  }, []);

  // Section 30: Measured Responsive Density Modes based on available workspace width
  const densityMode =
    availableWidth > 1450 ? 'wide' : availableWidth >= 1100 ? 'regular' : 'compact';

  const isInspectorOpen = Boolean(overlay.panelTaskId);
  // Section 3A & 30: Side-by-side mode requires Regular/Wide available workspace width (>= 1100px)
  // Preserves overlay at 1280px (usable width ~976px in compact mode), side-by-side at 1440px and wide desktop
  const isSideBySide = isInspectorOpen && availableWidth >= 1100;

  useEffect(() => {
    overlay.setIsPanelSideBySide(isSideBySide);
    if (isSideBySide) {
      document.body.classList.add('tasks-side-by-side');
    } else {
      document.body.classList.remove('tasks-side-by-side');
    }
    return () => {
      overlay.setIsPanelSideBySide(false);
      document.body.classList.remove('tasks-side-by-side');
    };
  }, [isSideBySide, overlay]);

  // Persist View Mode
  useEffect(() => {
    try {
      localStorage.setItem('coredesk.tasks.view', viewMode);
    } catch {}
  }, [viewMode]);

  // Close context menu on window click
  useEffect(() => {
    const handleGlobalClick = () => setMenuTaskId(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  // Filter Tasks
  const filteredTasks = useMemo(() => {
    let list = [...derived.tasksWithContext];

    if (filterBy === 'attention') {
      list = list.filter((t) => derived.getTaskAttention(t) !== null);
    } else if (filterBy === 'overdue') {
      list = list.filter((t) => derived.getTaskAttention(t) === 'overdue');
    } else if (filterBy === 'today') {
      list = list.filter((t) => t.status !== 'done' && (daysUntil(t.due) ?? 99) <= 0);
    } else if (filterBy === 'high-priority') {
      list = list.filter((t) => t.priority === 'urgent' || t.priority === 'blocker' || t.priority === 'high');
    }

    // Sorting
    if (sortBy === 'due') {
      list.sort((a, b) => (daysUntil(a.due) ?? 99) - (daysUntil(b.due) ?? 99));
    } else if (sortBy === 'priority') {
      const pWeight: Record<TaskPriority, number> = { blocker: 0, urgent: 1, high: 2, medium: 3, low: 4 };
      list.sort((a, b) => (pWeight[a.priority] ?? 3) - (pWeight[b.priority] ?? 3));
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Manual / natural order
      list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    return list;
  }, [derived.tasksWithContext, filterBy, sortBy, derived]);

  // Generate Columns Based on Active Grouping
  const columns = useMemo<GroupColumn[]>(() => {
    // 1. Group by Status: To Do, In Progress, Done (3 canonical statuses only)
    if (groupBy === 'status') {
      return [
        {
          id: 'todo',
          title: 'To Do',
          key: 'todo',
          tasks: filteredTasks.filter((t) => t.status === 'todo'),
        },
        {
          id: 'in-progress',
          title: 'In Progress',
          key: 'in-progress',
          tasks: filteredTasks.filter((t) => t.status === 'in-progress'),
        },
        {
          id: 'done',
          title: 'Done',
          key: 'done',
          tasks: filteredTasks.filter((t) => t.status === 'done'),
        },
      ];
    }

    // 2. Group by Attention: Blocked, Waiting, Overdue, Clear
    if (groupBy === 'attention') {
      return [
        {
          id: 'blocked',
          title: 'Blocked',
          key: 'blocked',
          tasks: filteredTasks.filter((t) => derived.getTaskAttention(t) === 'blocked'),
        },
        {
          id: 'waiting',
          title: 'Waiting',
          key: 'waiting',
          tasks: filteredTasks.filter((t) => derived.getTaskAttention(t) === 'waiting'),
        },
        {
          id: 'overdue',
          title: 'Overdue',
          key: 'overdue',
          tasks: filteredTasks.filter((t) => derived.getTaskAttention(t) === 'overdue'),
        },
        {
          id: 'clear',
          title: 'Clear / In Track',
          key: 'clear',
          tasks: filteredTasks.filter((t) => !derived.getTaskAttention(t)),
        },
      ];
    }

    // 3. Group by Priority: Normalized Blocker, Urgent, High, Medium, Low
    if (groupBy === 'priority') {
      return [
        {
          id: 'blocker',
          title: 'Blocker',
          key: 'blocker',
          tasks: filteredTasks.filter((t) => t.priority === 'blocker'),
        },
        {
          id: 'urgent',
          title: 'Urgent',
          key: 'urgent',
          tasks: filteredTasks.filter((t) => t.priority === 'urgent'),
        },
        {
          id: 'high',
          title: 'High',
          key: 'high',
          tasks: filteredTasks.filter((t) => t.priority === 'high'),
        },
        {
          id: 'medium',
          title: 'Medium',
          key: 'medium',
          tasks: filteredTasks.filter((t) => t.priority === 'medium'),
        },
        {
          id: 'low',
          title: 'Low',
          key: 'low',
          tasks: filteredTasks.filter((t) => t.priority === 'low'),
        },
      ];
    }

    if (groupBy === 'project') {
      const projs = state.projects.filter((p) => p.stage !== 'closed' && p.stage !== 'cancelled');
      const cols: GroupColumn[] = projs.map((p) => ({
        id: p.id,
        title: p.name,
        key: p.id,
        tasks: filteredTasks.filter((t) => t.projectId === p.id),
      }));

      // Internal / unassigned
      const unassigned = filteredTasks.filter((t) => !t.projectId);
      if (unassigned.length > 0) {
        cols.push({
          id: 'unassigned',
          title: 'General / Internal',
          key: 'unassigned',
          tasks: unassigned,
        });
      }
      return cols;
    }

    // Milestone Grouping
    const allMilestones: { id: string; name: string; projectId: string }[] = [];
    state.projects.forEach((p) => {
      p.milestones.forEach((m) => allMilestones.push({ id: m.id, name: `${p.name}: ${m.name}`, projectId: p.id }));
    });

    const mCols: GroupColumn[] = allMilestones.map((m) => ({
      id: m.id,
      title: m.name,
      key: m.id,
      tasks: filteredTasks.filter((t) => t.milestoneId === m.id),
    }));

    mCols.push({
      id: 'no-milestone',
      title: 'No Milestone',
      key: 'no-milestone',
      tasks: filteredTasks.filter((t) => !t.milestoneId),
    });

    return mCols;
  }, [filteredTasks, groupBy, state.projects]);

  // --- Drag and Drop Handlers with Domain Safety Rules ---
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggingTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOverColumn = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumnId !== columnId) {
      setDragOverColumnId(columnId);
    }
  };

  const handleDragOverCard = (e: React.DragEvent, targetCardId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverCardId !== targetCardId) {
      setDragOverCardId(targetCardId);
    }
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
    setDragOverColumnId(null);
    setDragOverCardId(null);
  };

  const handleDrop = (e: React.DragEvent, destColumnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggingTaskId;
    if (!taskId) return;

    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;

    // --- Domain Drag Safety Check ---
    if ((groupBy === 'status' && destColumnId === 'done') || destColumnId === 'done') {
      if (derived.isTaskBlocked(task)) {
        overlay.toast(
          'Move Blocked',
          'This task is blocked by prerequisite tasks. Complete them first.',
          'warn'
        );
        handleDragEnd();
        return;
      }
    }

    // Execute Legal Drop
    if (groupBy === 'status') {
      const newStatus = destColumnId as TaskStatus;
      if (task.status !== newStatus) {
        dispatch({ type: 'task/status', id: taskId, status: newStatus });
      }
    } else if (groupBy === 'priority') {
      const newPriority = destColumnId as TaskPriority;
      if (task.priority !== newPriority) {
        dispatch({ type: 'task/patch', id: taskId, patch: { priority: newPriority } });
      }
    } else if (groupBy === 'attention') {
      if (destColumnId === 'waiting') {
        dispatch({ type: 'task/patch', id: taskId, patch: { attention: 'waiting' } });
      } else if (destColumnId === 'clear') {
        dispatch({ type: 'task/patch', id: taskId, patch: { attention: null } });
      }
    } else if (groupBy === 'project') {
      const newProjectId = destColumnId === 'unassigned' ? null : destColumnId;
      const targetProj = state.projects.find((p) => p.id === newProjectId);
      dispatch({
        type: 'task/patch',
        id: taskId,
        patch: {
          projectId: newProjectId,
          clientId: targetProj ? targetProj.clientId : task.clientId,
          milestoneId: null,
        },
      });
    } else if (groupBy === 'milestone') {
      const newMilestoneId = destColumnId === 'no-milestone' ? null : destColumnId;
      dispatch({ type: 'task/patch', id: taskId, patch: { milestoneId: newMilestoneId } });
    }

    // Update intra-column reordering index if dropped over another card
    if (dragOverCardId && dragOverCardId !== taskId) {
      const col = columns.find((c) => c.id === destColumnId);
      if (col) {
        const currentIds = col.tasks.map((t) => t.id).filter((id) => id !== taskId);
        const targetIdx = currentIds.indexOf(dragOverCardId);
        if (targetIdx !== -1) {
          currentIds.splice(targetIdx, 0, taskId);
          dispatch({ type: 'task/reorder', orderedTaskIds: currentIds });
        }
      }
    }

    overlay.toast('Board Updated', `“${task.title}” moved successfully.`, 'ok');
    handleDragEnd();
  };

  // Quick Inline Task Creator per Column
  const handleInlineAddSubmit = (e: React.FormEvent, col: GroupColumn) => {
    e.preventDefault();
    if (!inlineTaskTitle.trim()) return;

    const firstActiveProj = state.projects.find((p) => p.stage === 'active');
    const newTaskId = `tsk-${Date.now()}`;

    const newTask: Task = {
      id: newTaskId,
      title: inlineTaskTitle.trim(),
      projectId: groupBy === 'project' && col.id !== 'unassigned' ? col.id : firstActiveProj ? firstActiveProj.id : null,
      clientId: firstActiveProj ? firstActiveProj.clientId : null,
      milestoneId: groupBy === 'milestone' && col.id !== 'no-milestone' ? col.id : null,
      due: new Date().toISOString().split('T')[0],
      status: groupBy === 'status' ? (col.id as TaskStatus) : 'todo',
      priority: groupBy === 'priority' ? (col.id as TaskPriority) : 'high',
      note: '',
      checklist: [],
      kind: 'drafting',
      estimatedMinutes: 30,
    };

    dispatch({ type: 'task/add', task: newTask });
    setInlineTaskTitle('');
    setInlineAddColId(null);
    overlay.toast('Task Added', `Added to ${col.title}.`, 'ok');
  };

  // Card Context Menu
  const handleOpenContextMenu = (e: React.MouseEvent, tId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setMenuTaskId(tId);
    setMenuAnchorPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className={`cd-tasks-workspace ${isInspectorOpen ? 'has-inspector' : ''} ${isSideBySide ? 'side-by-side-mode' : 'overlay-mode'}`}
      data-density={densityMode}
      ref={workspaceRef}
      aria-label="Tasks Workspace"
    >
      {/* 1. Precision Desktop Toolbar */}
      <div className="cd-tasks-toolbar">
        <div className="cd-tasks-toolbar-left">
          <div className="cd-tasks-title-badge">
            <h1 className="cd-tasks-title">Tasks</h1>
            <span className="cd-tasks-count-pill">{filteredTasks.length} records</span>
          </div>

          {/* View Switcher [ Board | List ] */}
          <div className="segmented" role="tablist" aria-label="Task view mode">
            <button
              type="button"
              className={`segmented-btn ${viewMode === 'board' ? 'is-active' : ''}`}
              onClick={() => setViewMode('board')}
            >
              <Icon name="grid" size={13} />
              <span>Board</span>
            </button>
            <button
              type="button"
              className={`segmented-btn ${viewMode === 'list' ? 'is-active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <Icon name="list" size={13} />
              <span>List</span>
            </button>
          </div>

          {/* Grouping Selector */}
          <div className="row" style={{ gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11.5, color: 'var(--metadata)', fontWeight: 600 }}>Group:</span>
            <select
              className="cd-tasks-select-trigger"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupBy)}
              aria-label="Group tasks by"
            >
              <option value="status">Status</option>
              <option value="attention">Attention</option>
              <option value="priority">Priority</option>
              <option value="milestone">Milestone</option>
              <option value="project">Project</option>
            </select>
          </div>

          {/* Filter Dropdown */}
          <div className="row" style={{ gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11.5, color: 'var(--metadata)', fontWeight: 600 }}>Filter:</span>
            <select
              className="cd-tasks-select-trigger"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
              aria-label="Filter tasks"
            >
              <option value="all">All Tasks</option>
              <option value="attention">Needs Attention</option>
              <option value="overdue">Overdue Attention</option>
              <option value="today">Due Today</option>
              <option value="high-priority">Urgent & Blocker</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="row" style={{ gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11.5, color: 'var(--metadata)', fontWeight: 600 }}>Sort:</span>
            <select
              className="cd-tasks-select-trigger"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort tasks"
            >
              <option value="manual">Manual Order</option>
              <option value="due">Target Date</option>
              <option value="priority">Priority Rank</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="cd-tasks-toolbar-right">
          <Button
            variant="primary"
            icon="plus"
            className="btn-apple"
            onClick={() => overlay.openModal('new-task')}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* 2. Main Workspace Surface: BOARD VIEW */}
      {viewMode === 'board' ? (
        <div className="cd-tasks-board-wrap" role="region" aria-label="Tasks board columns">
          {columns.map((col) => {
            const isColTarget = dragOverColumnId === col.id;
            return (
              <div
                key={col.id}
                className={`cd-board-column ${isColTarget ? 'is-drop-target' : ''}`}
                onDragOver={(e) => handleDragOverColumn(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column Header */}
                <div className="cd-board-column-head">
                  <div className="cd-board-column-title-wrap">
                    <span className="cd-board-column-title">{col.title}</span>
                    <span className="cd-board-column-count">{col.tasks.length}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setInlineAddColId(inlineAddColId === col.id ? null : col.id)}
                    aria-label={`Add task to ${col.title}`}
                    style={{ background: 'transparent', border: 'none', color: 'var(--metadata)', cursor: 'pointer', padding: 2 }}
                  >
                    <Icon name="plus" size={13} />
                  </button>
                </div>

                {/* Inline Quick Add Form */}
                {inlineAddColId === col.id && (
                  <form onSubmit={(e) => handleInlineAddSubmit(e, col)} style={{ padding: '8px 10px', background: 'var(--surface-subtle)', borderBottom: '1px solid var(--divider)' }}>
                    <input
                      type="text"
                      value={inlineTaskTitle}
                      onChange={(e) => setInlineTaskTitle(e.target.value)}
                      placeholder="Task title… (Enter to add)"
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: 6,
                        border: '1px solid var(--accent)',
                        background: 'var(--surface)',
                        fontSize: 12.5,
                        color: 'var(--text)',
                        outline: 'none',
                      }}
                      onBlur={() => {
                        if (!inlineTaskTitle.trim()) setInlineAddColId(null);
                      }}
                    />
                  </form>
                )}

                {/* Cards Container */}
                <div className="cd-board-cards-scroll">
                  {col.tasks.length === 0 ? (
                    <div className="cd-board-empty-col">No tasks in this group</div>
                  ) : (
                    col.tasks.map((task) => {
                      const isDragging = draggingTaskId === task.id;
                      const isSelected = overlay.panelTaskId === task.id;
                      const overdue = (daysUntil(task.due) ?? 0) < 0 && task.status !== 'done';

                      return (
                        <div key={task.id}>
                          {dragOverCardId === task.id && draggingTaskId !== task.id && (
                            <div className="cd-board-drop-indicator" />
                          )}

                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onDragOver={(e) => handleDragOverCard(e, task.id)}
                            onDragEnd={handleDragEnd}
                            onClick={() => overlay.openTask(task.id)}
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && overlay.openTask(task.id)}
                            className={`cd-board-card ${isDragging ? 'is-dragging' : ''} ${isSelected ? 'is-active' : ''} ${task.status === 'done' ? 'is-done' : ''}`}
                            aria-label={`Task: ${task.title}`}
                          >
                            <div className="cd-board-card-head">
                              <div className="cd-board-card-title-row">
                                <input
                                  type="checkbox"
                                  className="cd-board-card-checkbox"
                                  checked={task.status === 'done'}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={() => {
                                    if (derived.isTaskBlocked(task) && task.status !== 'done') {
                                      overlay.toast('Task Blocked', 'Prerequisite tasks must be completed first.', 'warn');
                                      return;
                                    }
                                    dispatch({ type: 'task/toggle', id: task.id });
                                  }}
                                  aria-label={`Complete ${task.title}`}
                                />
                                <span className="cd-board-card-title">{task.title}</span>
                              </div>

                              <button
                                type="button"
                                className="cd-board-card-menu-btn"
                                onClick={(e) => handleOpenContextMenu(e, task.id)}
                                aria-label="Task options"
                              >
                                <Icon name="dots" size={13} />
                              </button>
                            </div>

                            <div className="cd-board-card-sub">
                              {task.projectName ?? 'General'} · {task.clientName}
                            </div>

                            <div className="cd-board-card-meta">
                              <div className="row" style={{ gap: 4, alignItems: 'center' }}>
                                <span className={`cd-priority-pill ${task.priority}`}>
                                  {task.priority.toUpperCase()}
                                </span>
                                {derived.getTaskAttention(task) === 'blocked' && (
                                  <span className="cd-priority-pill blocker">BLOCKED</span>
                                )}
                                {derived.getTaskAttention(task) === 'waiting' && (
                                  <span className="cd-priority-pill" style={{ background: 'color-mix(in srgb, var(--amber) 16%, transparent)', color: 'var(--amber)' }}>
                                    WAITING
                                  </span>
                                )}
                                {derived.getTaskAttention(task) === 'overdue' && (
                                  <span className="cd-priority-pill blocker">OVERDUE</span>
                                )}
                              </div>
                              <span className={overdue ? 'mark-risk' : ''} style={{ fontSize: 11 }}>
                                {dueLabel(task.due)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Column Quick Bottom Add */}
                <button
                  type="button"
                  className="cd-board-add-btn"
                  onClick={() => setInlineAddColId(col.id)}
                >
                  <Icon name="plus" size={12} />
                  <span>Add task</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* 3. Main Workspace Surface: COMPACT LIST VIEW */
        <div className="cd-tasks-list-wrap">
          <table className="cd-tasks-list-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Task Title</th>
                <th>Project · Client</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Target Date</th>
                <th>Milestone</th>
                <th style={{ width: 60 }}><span className="visually-hidden">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--metadata)' }}>
                    No tasks match the active filters.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const isSelected = overlay.panelTaskId === task.id;
                  const isDragging = draggingTaskId === task.id;
                  const overdue = (daysUntil(task.due) ?? 0) < 0 && task.status !== 'done';
                  const proj = task.projectId ? derived.projectById(task.projectId) : null;
                  const milestone = proj && task.milestoneId ? proj.milestones.find((m) => m.id === task.milestoneId) : null;

                  return (
                    <tr
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => overlay.openTask(task.id)}
                      className={`cd-tasks-list-row ${isSelected ? 'is-active' : ''} ${isDragging ? 'is-dragging' : ''}`}
                    >
                      <td onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="cd-board-card-checkbox"
                          checked={task.status === 'done'}
                          onChange={() => {
                            if (derived.isTaskBlocked(task) && task.status !== 'done') {
                              overlay.toast('Task Blocked', 'Prerequisite tasks must be completed first.', 'warn');
                              return;
                            }
                            dispatch({ type: 'task/toggle', id: task.id });
                          }}
                        />
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, textDecoration: task.status === 'done' ? 'line-through' : 'none', opacity: task.status === 'done' ? 0.6 : 1 }}>
                          {task.title}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: 11.5, color: 'var(--metadata)' }}>
                          {task.projectName ?? 'General'} · {task.clientName}
                        </span>
                      </td>
                      <td>
                        <div className="row" style={{ gap: 6, alignItems: 'center' }}>
                          <span className={`chip tone-${task.status === 'done' ? 'active' : task.status === 'in-progress' ? 'waiting' : 'neutral'}`} style={{ fontSize: 11 }}>
                            {task.status.replace('-', ' ')}
                          </span>
                          {derived.getTaskAttention(task) === 'blocked' && (
                            <span className="cd-priority-pill blocker" style={{ fontSize: 9.5 }}>BLOCKED</span>
                          )}
                          {derived.getTaskAttention(task) === 'waiting' && (
                            <span className="cd-priority-pill" style={{ fontSize: 9.5, background: 'color-mix(in srgb, var(--amber) 16%, transparent)', color: 'var(--amber)' }}>WAITING</span>
                          )}
                          {derived.getTaskAttention(task) === 'overdue' && (
                            <span className="cd-priority-pill blocker" style={{ fontSize: 9.5 }}>OVERDUE</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`cd-priority-pill ${task.priority}`}>
                          {task.priority.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className={overdue ? 'mark-risk' : 'meta'} style={{ fontSize: 11.5 }}>
                          {formatDate(task.due)} ({dueLabel(task.due)})
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: 11.5, color: 'var(--metadata)' }}>
                          {milestone ? milestone.name : '—'}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="cd-board-card-menu-btn"
                          style={{ opacity: 1 }}
                          onClick={(e) => handleOpenContextMenu(e, task.id)}
                          aria-label="Actions"
                        >
                          <Icon name="dots" size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Accessible Context Menu Popover */}
      {menuTaskId && menuAnchorPos && (
        <div
          className="cd-card-context-menu"
          style={{ top: menuAnchorPos.y, left: Math.min(menuAnchorPos.x, window.innerWidth - 180), position: 'fixed' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="cd-context-item"
            onClick={() => {
              overlay.openTask(menuTaskId);
              setMenuTaskId(null);
            }}
          >
            <Icon name="edit" size={13} />
            <span>Open Inspector</span>
          </button>

          <button
            type="button"
            className="cd-context-item"
            onClick={() => {
              dispatch({ type: 'task/toggle', id: menuTaskId });
              setMenuTaskId(null);
              overlay.toast('Task Toggled', undefined, 'ok');
            }}
          >
            <Icon name="check" size={13} />
            <span>Toggle Complete</span>
          </button>

          <button
            type="button"
            className="cd-context-item"
            onClick={() => {
              dispatch({ type: 'task/postpone', id: menuTaskId });
              setMenuTaskId(null);
              overlay.toast('Task Postponed 1 Day', undefined, 'warn');
            }}
          >
            <Icon name="clock" size={13} />
            <span>Postpone 1 Day</span>
          </button>

          <div style={{ height: 1, background: 'var(--divider)', margin: '3px 0' }} />

          <button
            type="button"
            className="cd-context-item danger"
            onClick={() => {
              dispatch({ type: 'task/delete', id: menuTaskId });
              setMenuTaskId(null);
              overlay.toast('Task Deleted', undefined, 'bad');
            }}
          >
            <Icon name="trash" size={13} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}
