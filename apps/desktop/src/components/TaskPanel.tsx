/**
 * Task Detail Inspector — Desktop Anchored Spatial Architecture.
 *
 * Attaches cleanly to the right edge below the floating topbar:
 * - Editable title & compact header with canonical status, normalized priority, and attention badge
 * - Execution state (Status = To Do / In Progress / Done / Cancelled; Attention = Waiting / Blocked / Overdue)
 * - Canonical prerequisite dependencies management (add, list, remove, blocker alerts)
 * - Metadata grid (Project, Client, Milestone, Due, Owner) with canonical record links
 * - Inline auto-saving description
 * - Interactive checklist with progress counter and inline item creator
 * - Chronological activity history
 * - Sticky, always-reachable desktop footer (Delete, Postpone, Complete with prerequisite safety)
 */

import { useState, useEffect } from 'react';
import { useStore, nextId } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate, projectUrl } from '../app/router';
import { daysUntil, dueLabel, formatDate } from '../domain/dates';
import { Button, Def, Defs, IconButton, Select } from '../ui/primitives';
import { Icon } from '../ui/Icon';
import type { TaskPriority, TaskStatus, ChecklistItem } from '../domain/types';

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To do' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'blocker', label: 'Blocker' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function TaskPanel({ taskId }: { taskId: string }) {
  const { state, dispatch, derived } = useStore();
  const overlay = useOverlay();

  const task = derived.taskById(taskId);

  // Local state for inline editable fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newChecklistText, setNewChecklistText] = useState('');
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [selectedNewDepId, setSelectedNewDepId] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.note || '');
      setSelectedNewDepId('');
    }
  }, [task?.id, task?.title, task?.note]);

  if (!task) {
    return (
      <aside className="task-inspector" role="dialog" aria-modal="true" aria-label="Task detail">
        <div className="panel-head">
          <div className="panel-title">Task not found</div>
          <IconButton icon="close" label="Close" onClick={overlay.closePanel} />
        </div>
        <div className="panel-body">
          <p className="meta">This task was deleted or does not exist. The workspace remains unchanged.</p>
        </div>
      </aside>
    );
  }

  const project = task.projectId ? derived.projectById(task.projectId) : null;
  const client = project ? derived.clientById(project.clientId) : derived.clientById(task.clientId);
  const milestone = project && task.milestoneId ? project.milestones.find((m) => m.id === task.milestoneId) : null;
  const overdue = (daysUntil(task.due) ?? 0) < 0 && task.status !== 'done';

  const dependencies = derived.getTaskDependencies(task);
  const isBlocked = derived.isTaskBlocked(task);
  const attention = derived.getTaskAttention(task);

  // Potential prerequisites to add (exclude self and existing prerequisites)
  const availablePrerequisites = state.tasks.filter(
    (t) => t.id !== task.id && !dependencies.some((d) => d.id === t.id)
  );

  // Save Title
  const handleTitleBlur = () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== task.title) {
      dispatch({ type: 'task/patch', id: task.id, patch: { title: trimmed } });
    } else {
      setTitle(task.title);
    }
  };

  // Save Description
  const handleDescBlur = () => {
    if (description !== (task.note || '')) {
      dispatch({ type: 'task/patch', id: task.id, patch: { note: description } });
    }
  };

  // Status Change
  const handleStatusChange = (newStatus: TaskStatus) => {
    if (newStatus === 'done' && isBlocked) {
      overlay.toast('Cannot Complete', 'Prerequisite tasks must be completed first.', 'warn');
      return;
    }
    dispatch({ type: 'task/status', id: task.id, status: newStatus });
    overlay.toast('Status Updated', `Task moved to ${STATUS_OPTIONS.find((s) => s.value === newStatus)?.label}.`, 'ok');
  };

  // Priority Change
  const handlePriorityChange = (newPriority: TaskPriority) => {
    dispatch({ type: 'task/patch', id: task.id, patch: { priority: newPriority } });
    overlay.toast('Priority Updated', `Priority set to ${newPriority.toUpperCase()}.`, 'default');
  };

  // Attention Flag Toggle (Waiting / None)
  const handleAttentionChange = (newAttention: string) => {
    const flag = newAttention === 'waiting' ? 'waiting' : null;
    dispatch({ type: 'task/patch', id: task.id, patch: { attention: flag } });
  };

  // Add Checklist Item
  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;

    const newItem: ChecklistItem = {
      id: nextId('chk'),
      text: newChecklistText.trim(),
      done: false,
    };

    const updatedChecklist = [...(task.checklist || []), newItem];
    dispatch({ type: 'task/patch', id: task.id, patch: { checklist: updatedChecklist } });
    setNewChecklistText('');
    setIsAddingChecklist(false);
  };

  // Toggle Checklist Item
  const handleToggleChecklist = (itemId: string) => {
    dispatch({ type: 'task/toggleChecklist', taskId: task.id, itemId });
  };

  // Delete Checklist Item
  const handleDeleteChecklistItem = (itemId: string) => {
    const updatedChecklist = task.checklist.filter((c) => c.id !== itemId);
    dispatch({ type: 'task/patch', id: task.id, patch: { checklist: updatedChecklist } });
  };

  // Add Prerequisite Dependency
  const handleAddDependency = (depTaskId: string) => {
    if (!depTaskId) return;
    dispatch({ type: 'task/addDependency', taskId: task.id, dependsOnTaskId: depTaskId });
    setSelectedNewDepId('');
    overlay.toast('Dependency Added', 'Prerequisite dependency registered.', 'ok');
  };

  // Remove Prerequisite Dependency
  const handleRemoveDependency = (depTaskId: string) => {
    dispatch({ type: 'task/removeDependency', taskId: task.id, dependsOnTaskId: depTaskId });
    overlay.toast('Dependency Removed', 'Prerequisite requirement cleared.', 'default');
  };

  const completedChecklistCount = task.checklist.filter((c) => c.done).length;

  return (
    <aside className="task-inspector" role="dialog" aria-modal="true" aria-label="Task detail inspector">
      {/* 1. Header */}
      <div className="panel-head">
        <div style={{ flex: 1, minWidth: 0 }}>
          <span className="eyebrow" style={{ fontSize: 10.5, letterSpacing: '0.04em' }}>Task Inspector</span>
          <input
            type="text"
            className="panel-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            aria-label="Task title"
          />
          <div className="row mt-4" style={{ gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className={`chip tone-${task.status === 'done' ? 'done' : task.status === 'in-progress' ? 'in-progress' : 'neutral'}`}>
              {task.status === 'done' ? <span className="dot" /> : null}
              {STATUS_OPTIONS.find((s) => s.value === task.status)?.label ?? task.status}
            </span>
            <span className={`cd-priority-pill ${task.priority}`}>
              {task.priority.toUpperCase()}
            </span>
            {attention === 'blocked' && (
              <span className="cd-priority-pill blocker">BLOCKED</span>
            )}
            {attention === 'waiting' && (
              <span className="cd-priority-pill" style={{ background: 'color-mix(in srgb, var(--amber) 16%, transparent)', color: 'var(--amber)' }}>
                WAITING
              </span>
            )}
            {attention === 'overdue' && (
              <span className="cd-priority-pill blocker">OVERDUE</span>
            )}
          </div>
        </div>
        <IconButton icon="close" label="Close inspector" onClick={overlay.closePanel} />
      </div>

      {/* 2. Scrollable Body Content */}
      <div className="panel-body">
        {/* Blocked Alert Banner if Prerequisite Uncompleted */}
        {isBlocked && (
          <div style={{ padding: '10px 12px', borderRadius: 7, background: 'color-mix(in srgb, var(--red) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--red) 30%, transparent)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="alert" size={13} />
              BLOCKED BY PREREQUISITE
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--text)', marginTop: 4 }}>
              One or more prerequisite tasks must be marked Done before this task can be completed.
            </div>
          </div>
        )}

        {/* Section: Status, Attention & Priority Controls */}
        <div className="panel-section">
          <div className="panel-section-title">Execution State</div>
          <div className="grid grid-2" style={{ gap: 10 }}>
            <div className="field">
              <label className="field-label" htmlFor="task-status-select">Status</label>
              <Select
                id="task-status-select"
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                aria-label="Change status"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </Select>
            </div>

            <div className="field">
              <label className="field-label" htmlFor="task-priority-select">Priority</label>
              <Select
                id="task-priority-select"
                value={task.priority}
                onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
                aria-label="Change priority"
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="field mt-8">
            <label className="field-label" htmlFor="task-attention-select">Attention Flag</label>
            <Select
              id="task-attention-select"
              value={task.attention === 'waiting' ? 'waiting' : isBlocked ? 'blocked' : 'none'}
              onChange={(e) => handleAttentionChange(e.target.value)}
              aria-label="Change attention flag"
            >
              <option value="none">None (Standard operational flow)</option>
              <option value="waiting">Waiting on external / client feedback</option>
              {isBlocked && <option value="blocked" disabled>Blocked by prerequisites (automated)</option>}
            </Select>
          </div>
        </div>

        {/* Section: Prerequisites & Canonical Dependencies */}
        <div className="panel-section">
          <div className="panel-section-title">
            <span>Prerequisites & Dependencies</span>
            <span style={{ fontSize: 11, color: 'var(--metadata)' }}>
              {dependencies.length} {dependencies.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {dependencies.length > 0 ? (
            <div className="stack" style={{ gap: 6 }}>
              {dependencies.map((dep) => (
                <div
                  key={dep.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 10px',
                    background: 'var(--surface-subtle)',
                    borderRadius: 6,
                    border: '1px solid var(--divider)',
                    fontSize: 12,
                    gap: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
                    <span
                      className={`chip tone-${dep.status === 'done' ? 'done' : 'neutral'}`}
                      style={{ fontSize: 10, padding: '1px 5px', flexShrink: 0 }}
                    >
                      {dep.status === 'done' ? 'Done' : 'Open'}
                    </span>
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        textDecoration: dep.status === 'done' ? 'line-through' : 'none',
                        color: dep.status === 'done' ? 'var(--metadata)' : 'var(--text)',
                      }}
                      title={dep.title}
                    >
                      {dep.title}
                    </span>
                  </div>
                  <IconButton
                    icon="close"
                    label="Remove prerequisite"
                    onClick={() => handleRemoveDependency(dep.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 11.5, color: 'var(--metadata)', fontStyle: 'italic', marginBottom: 4 }}>
              No prerequisite tasks assigned.
            </div>
          )}

          {availablePrerequisites.length > 0 && (
            <div className="row mt-8" style={{ gap: 8 }}>
              <Select
                value={selectedNewDepId}
                onChange={(e) => {
                  setSelectedNewDepId(e.target.value);
                  if (e.target.value) {
                    handleAddDependency(e.target.value);
                  }
                }}
                aria-label="Add prerequisite task"
              >
                <option value="">+ Add Prerequisite Dependency…</option>
                {availablePrerequisites.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.status})
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>

        {/* Section: Details & Context */}
        <div className="panel-section">
          <div className="panel-section-title">Context & Relationships</div>
          <Defs>
            <Def k="Project">
              {project ? (
                <button
                  type="button"
                  onClick={() => {
                    overlay.closePanel();
                    navigate(projectUrl(project.id));
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'var(--accent)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 'inherit',
                    textAlign: 'left',
                  }}
                >
                  {project.name} ↗
                </button>
              ) : (
                <span className="meta">No project assigned</span>
              )}
            </Def>
            <Def k="Client">
              {client ? (
                <button
                  type="button"
                  onClick={() => {
                    overlay.closePanel();
                    navigate(`#/clients/${client.id}`);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'var(--accent)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 'inherit',
                    textAlign: 'left',
                  }}
                >
                  {client.name} ↗
                </button>
              ) : (
                <span className="meta">—</span>
              )}
            </Def>
            <Def k="Milestone">
              {milestone ? milestone.name : <span className="meta">General workstream</span>}
            </Def>
            <Def k="Target Date">
              <span className={overdue ? 'mark-risk' : undefined}>
                {formatDate(task.due)} · {dueLabel(task.due)}
              </span>
            </Def>
            <Def k="Owner">
              <span>{state.workspace.ownerName}</span>
            </Def>
          </Defs>
        </div>

        {/* Section: Description */}
        <div className="panel-section">
          <div className="panel-section-title">Description</div>
          <textarea
            className="panel-editable-desc"
            placeholder="Add context, acceptance notes, or requirements (auto-saves on blur)…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescBlur}
            aria-label="Task description"
          />
        </div>

        {/* Section: Checklist */}
        <div className="panel-section">
          <div className="panel-section-title">
            <span>Checklist</span>
            <span style={{ fontSize: 11, color: 'var(--metadata)', fontVariantNumeric: 'tabular-nums' }}>
              {completedChecklistCount} / {task.checklist.length}
            </span>
          </div>

          <div className="stack" style={{ gap: 4 }}>
            {task.checklist.map((item) => (
              <div key={item.id} className="checklist-item-row" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                <input
                  type="checkbox"
                  className="checklist-checkbox"
                  checked={item.done}
                  onChange={() => handleToggleChecklist(item.id)}
                  aria-label={`Checklist item: ${item.text}`}
                />
                <span className={`checklist-item-text ${item.done ? 'is-done' : ''}`} style={{ flex: 1, textDecoration: item.done ? 'line-through' : 'none', color: item.done ? 'var(--metadata)' : 'var(--text)', fontSize: 12 }}>
                  {item.text}
                </span>
                <IconButton
                  icon="close"
                  label="Delete item"
                  onClick={() => handleDeleteChecklistItem(item.id)}
                />
              </div>
            ))}

            {isAddingChecklist ? (
              <form onSubmit={handleAddChecklist} className="row mt-4" style={{ gap: 6 }}>
                <input
                  type="text"
                  className="input"
                  style={{
                    flex: 1,
                    padding: '5px 8px',
                    fontSize: 12.5,
                    borderRadius: 6,
                    border: '1px solid var(--accent)',
                    background: 'var(--surface)',
                    color: 'var(--text)',
                    outline: 'none',
                  }}
                  placeholder="Checklist item text…"
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  autoFocus
                  onBlur={() => {
                    if (!newChecklistText.trim()) setIsAddingChecklist(false);
                  }}
                />
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingChecklist(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '6px 8px',
                  borderRadius: 5,
                  textAlign: 'left',
                  width: 'fit-content',
                  fontFamily: 'inherit',
                  marginTop: 2,
                }}
              >
                + Add checklist item
              </button>
            )}
          </div>
        </div>

        {/* Section: Linked Records */}
        <div className="panel-section">
          <div className="panel-section-title">Linked Records</div>
          <div className="stack" style={{ gap: 6 }}>
            {project && (
              <a
                href={`#/projects/${project.id}?tab=work`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  borderRadius: 6,
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--divider)',
                  fontSize: 12,
                  color: 'var(--text)',
                  textDecoration: 'none',
                }}
              >
                <Icon name="folder" size={14} />
                <span style={{ fontWeight: 600 }}>Project:</span> {project.name}
              </a>
            )}
            {client && (
              <a
                href={`#/clients/${client.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  borderRadius: 6,
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--divider)',
                  fontSize: 12,
                  color: 'var(--text)',
                  textDecoration: 'none',
                }}
              >
                <Icon name="building" size={14} />
                <span style={{ fontWeight: 600 }}>Client:</span> {client.name}
              </a>
            )}
            {milestone && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 10px',
                  borderRadius: 6,
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--divider)',
                  fontSize: 12,
                  color: 'var(--text)',
                }}
              >
                <Icon name="clock" size={14} />
                <span style={{ fontWeight: 600 }}>Milestone:</span> {milestone.name}
              </div>
            )}
          </div>
        </div>

        {/* Section: Chronological Activity */}
        <div className="panel-section">
          <div className="panel-section-title">Recent Activity</div>
          <div className="stack" style={{ gap: 8 }}>
            <div className="panel-activity-row">
              <span className="panel-activity-dot" />
              <div className="panel-activity-main">
                <span className="panel-activity-text">
                  Status is {STATUS_OPTIONS.find((s) => s.value === task.status)?.label}
                </span>
                <span className="panel-activity-time">Current lifecycle state</span>
              </div>
            </div>
            <div className="panel-activity-row">
              <span className="panel-activity-dot" style={{ background: 'var(--muted)' }} />
              <div className="panel-activity-main">
                <span className="panel-activity-text">
                  Priority set to {task.priority.toUpperCase()}
                </span>
                <span className="panel-activity-time">Focus queue ranking</span>
              </div>
            </div>
            <div className="panel-activity-row">
              <span className="panel-activity-dot" style={{ background: 'var(--metadata)' }} />
              <div className="panel-activity-main">
                <span className="panel-activity-text">Task created in {project ? project.name : 'Workspace'}</span>
                <span className="panel-activity-time">Recorded by {state.workspace.ownerName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sticky Desktop Footer (Always reachable) */}
      <div className="panel-foot">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            dispatch({ type: 'task/delete', id: task.id });
            overlay.closePanel();
            overlay.toast('Task Deleted', 'Removed from workspace and project history.', 'bad');
          }}
          style={{ color: 'var(--red)' }}
        >
          Delete
        </Button>

        <div className="row" style={{ gap: 8, alignItems: 'center' }}>
          <Button
            size="sm"
            onClick={() => {
              dispatch({ type: 'task/postpone', id: task.id });
              overlay.toast('Task Postponed', 'Due date moved forward by 1 day.', 'warn');
            }}
          >
            Postpone 1d
          </Button>

          <Button
            size="sm"
            variant="primary"
            className="btn-apple"
            onClick={() => {
              if (isBlocked && task.status !== 'done') {
                overlay.toast('Cannot Complete', 'Prerequisite tasks must be completed first.', 'warn');
                return;
              }
              dispatch({ type: 'task/toggle', id: task.id });
              overlay.toast(
                task.status === 'done' ? 'Task Reopened' : 'Task Completed',
                task.status === 'done' ? 'Returned to To do.' : 'Workspace progress updated.',
                'ok'
              );
            }}
          >
            {task.status === 'done' ? 'Reopen' : 'Mark Complete'}
          </Button>
        </div>
      </div>
    </aside>
  );
}

/** Used where a task is referenced from a document or review. */
export function TaskLink({ taskId, label }: { taskId: string; label: string }) {
  const overlay = useOverlay();
  return (
    <button type="button" className="row" style={{ fontSize: 'var(--fs-label)' }} onClick={() => overlay.openTask(taskId)}>
      <Icon name="tasks" size={15} /> {label}
    </button>
  );
}
