/**
 * W01 · Operator Cockpit (Home) — The Owner's Operational Command Center.
 *
 * Designed as a high-density, action-first desktop engine:
 * 1. Omnipresent Universal Search & Quick Action Header
 * 2. Pillar 1: External Blockers & Client Sign-Off Gate
 * 3. Pillar 2: Today's Focus Queue (interactive 1-click completion & deep jumps)
 * 4. Pillar 3: Client Pulse & Commercial Pipeline Runway
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate } from '../app/router';
import { CoreDeskDatabase, type SearchResult } from '../state/db';
import { ClientStudioDrawer } from '../components/ClientStudioDrawer';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/primitives';

type PillarFilter = 'all' | 'blockers' | 'focus' | 'clients';

export function HomeScreen() {
  const { state, dispatch, derived } = useStore();
  const overlay = useOverlay();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState<PillarFilter>('all');
  const [isClientDrawerOpen, setIsClientDrawerOpen] = useState(false);
  const newClientBtnRef = useRef<HTMLButtonElement>(null);

  // Quick Task Inline Add
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute Cockpit Data from Database Engine
  const cockpit = useMemo(() => {
    return CoreDeskDatabase.getOperatorCockpit(state);
  }, [state]);

  // Universal Search Results
  const searchHits = useMemo<SearchResult[]>(() => {
    if (!searchQuery.trim()) return [];
    return CoreDeskDatabase.search(state, searchQuery);
  }, [state, searchQuery]);

  // Complete Task Action
  const handleToggleTask = (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    dispatch({
      type: 'task/status',
      id: taskId,
      status: newStatus as any,
    });
    if (newStatus === 'done') {
      overlay.toast('Task Completed', 'Focus queue updated.', 'ok');
    }
  };

  // Quick Inline Add Task
  const handleCreateQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;

    const firstActiveProj = state.projects.find((p) => p.stage === 'active');

    dispatch({
      type: 'task/add',
      task: {
        id: `tsk-${Date.now()}`,
        title: quickTaskTitle.trim(),
        projectId: firstActiveProj ? firstActiveProj.id : null,
        clientId: firstActiveProj ? firstActiveProj.clientId : null,
        milestoneId: null,
        note: 'Quick task from Focus Queue',
        checklist: [],
        status: 'todo',
        priority: 'high',
        kind: 'drafting',
        due: new Date().toISOString().split('T')[0],
        estimatedMinutes: 30,
      },
    });

    setQuickTaskTitle('');
    setIsAddingTask(false);
    overlay.toast('Task Added', 'Task added directly to today’s focus queue.', 'ok');
  };

  // Ping client reminder
  const handlePingClient = (blockerTitle: string, clientName: string) => {
    overlay.toast('Follow-Up Triggered', `Reminder queued for ${clientName} on “${blockerTitle}”.`, 'ok');
  };

  // Filtered views
  const overdueTasks = useMemo(() => {
    return cockpit.focusQueue.filter((t) => t.isOverdue || t.priority === 'urgent' || t.priority === 'blocker');
  }, [cockpit.focusQueue]);

  const activeProject = useMemo(() => {
    return state.projects.find((p) => p.stage === 'active') ?? state.projects[0] ?? null;
  }, [state.projects]);

  const activeDocument = useMemo(() => {
    return state.documents.find((d) => d.reviewState === 'waiting' || d.reviewState === 'none') ?? state.documents[0] ?? null;
  }, [state.documents]);

  const waitingItems = useMemo(() => {
    return cockpit.blockers.filter((b) => b.waitingOn);
  }, [cockpit.blockers]);

  return (
    <div className="cd-cockpit-container">
      {/* 1. Universal Search & Action Bar */}
      <div className="cd-cockpit-top">
        <div className="cd-cockpit-search-box" ref={searchBoxRef}>
          <span className="cd-search-icon-left">
            <Icon name="search" size={16} />
          </span>
          <input
            type="text"
            className="cd-cockpit-search-input"
            placeholder="Search clients, projects, tasks, or deliverables (⌘K)…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            aria-label="Omnipresent Search"
          />
          {searchQuery && (
            <button
              type="button"
              className="cd-search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear Search"
            >
              <Icon name="close" size={14} />
            </button>
          )}

          {/* Search Results Dropdown */}
          {isSearchFocused && searchQuery.trim() && (
            <div className="cd-cockpit-search-results">
              {searchHits.length === 0 ? (
                <div style={{ padding: '12px 14px', fontSize: 12.5, color: 'var(--metadata)' }}>
                  No matches found for “{searchQuery}”
                </div>
              ) : (
                searchHits.map((hit) => (
                  <a
                    key={hit.id}
                    href={hit.href}
                    className="cd-search-hit-row"
                    onClick={() => setIsSearchFocused(false)}
                  >
                    <div className="cd-search-hit-info">
                      <span className="cd-search-hit-title">{hit.title}</span>
                      <span className="cd-search-hit-sub">{hit.subtitle}</span>
                    </div>
                    {hit.badge && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 4,
                          background:
                            hit.badgeTone === 'ok'
                              ? 'color-mix(in srgb, var(--green) 15%, transparent)'
                              : hit.badgeTone === 'risk'
                              ? 'color-mix(in srgb, var(--red) 15%, transparent)'
                              : 'var(--surface-subtle)',
                          color:
                            hit.badgeTone === 'ok'
                              ? 'var(--green)'
                              : hit.badgeTone === 'risk'
                              ? 'var(--red)'
                              : 'var(--muted)',
                        }}
                      >
                        {hit.badge}
                      </span>
                    )}
                  </a>
                ))
              )}
            </div>
          )}
        </div>

        {/* View Filter Switcher & Quick Launch Buttons */}
        <div className="row" style={{ gap: 10, alignItems: 'center' }}>
          <div className="segmented" role="tablist" aria-label="Cockpit Filter">
            <button
              type="button"
              className={`segmented-btn ${activeFilter === 'all' ? 'is-active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Priorities
            </button>
            <button
              type="button"
              className={`segmented-btn ${activeFilter === 'blockers' ? 'is-active' : ''}`}
              onClick={() => setActiveFilter('blockers')}
            >
              Needs Attention ({cockpit.blockers.length + overdueTasks.length})
            </button>
            <button
              type="button"
              className={`segmented-btn ${activeFilter === 'focus' ? 'is-active' : ''}`}
              onClick={() => setActiveFilter('focus')}
            >
              Resume ({cockpit.focusQueue.length})
            </button>
            <button
              type="button"
              className={`segmented-btn ${activeFilter === 'clients' ? 'is-active' : ''}`}
              onClick={() => setActiveFilter('clients')}
            >
              Waiting ({waitingItems.length})
            </button>
          </div>

          <Button
            ref={newClientBtnRef}
            variant="primary"
            icon="plus"
            className="btn-apple"
            onClick={() => setIsClientDrawerOpen(true)}
          >
            New Client
          </Button>

          <Button
            variant="secondary"
            icon="folder"
            onClick={() => navigate('#/new-project')}
          >
            New Project
          </Button>
        </div>
      </div>

      {/* 2. Hierarchical Operating Surface (Section 8) */}
      {(activeFilter === 'all' || activeFilter === 'blockers' || activeFilter === 'focus' || activeFilter === 'clients') && (
        <div className="cd-cockpit-grid">
          {/* Pillar 1: Needs Attention (Left / Primary) */}
          {(activeFilter === 'all' || activeFilter === 'blockers') && (
            <section className="cd-pillar cd-pillar-attention" aria-label="Needs Attention">
              <div className="cd-pillar-head">
                <div className="cd-pillar-badge-title">
                  <Icon name="alert" size={15} />
                  <span className="cd-pillar-title">Needs Attention</span>
                </div>
                <span className={`cd-pillar-count ${cockpit.blockers.length + overdueTasks.length > 0 ? 'alert' : ''}`}>
                  {cockpit.blockers.length + overdueTasks.length} urgent
                </span>
              </div>

              <div className="cd-pillar-body">
                {cockpit.blockers.length === 0 && overdueTasks.length === 0 ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--metadata)', fontSize: 13 }}>
                    <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>✓</span>
                    No urgent blockers. All client gates and milestones are on schedule.
                  </div>
                ) : (
                  <>
                    {overdueTasks.map((t) => (
                      <div key={t.id} className="cd-blocker-item" style={{ borderLeftColor: 'var(--risk)' }}>
                        <div className="cd-blocker-top">
                          <span className="cd-blocker-client">{t.clientName}</span>
                          <span className="cd-blocker-tag">{t.dueLabel}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <span className="cd-blocker-title">{t.title}</span>
                          {t.directLinkUrl && (
                            <button
                              type="button"
                              className="cd-focus-jump-btn"
                              onClick={() => navigate(t.directLinkUrl!)}
                            >
                              Resolve →
                            </button>
                          )}
                        </div>
                        <div className="cd-blocker-consequence">
                          Overdue operational task requiring immediate intervention.
                        </div>
                      </div>
                    ))}

                    {cockpit.blockers.map((b) => (
                      <div key={b.id} className="cd-blocker-item">
                        <div className="cd-blocker-top">
                          <span className="cd-blocker-client">{b.clientName}</span>
                          <span className="cd-blocker-tag">{b.dueLabel}</span>
                        </div>

                        <a href={b.targetHref} className="cd-blocker-title" style={{ textDecoration: 'none' }}>
                          {b.title}
                        </a>

                        <div className="cd-blocker-consequence">
                          {b.consequence}
                        </div>

                        <div className="cd-blocker-foot">
                          <span className="cd-blocker-person">
                            <Icon name="user" size={12} />
                            Waiting on {b.waitingOn} ({b.daysWaiting}d)
                          </span>
                          <button
                            type="button"
                            className="cd-focus-jump-btn"
                            onClick={() => handlePingClient(b.title, b.clientName)}
                            title="Ping client for update"
                          >
                            Ping
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </section>
          )}

          {/* Pillar 2: Resume (Center / Primary) */}
          {(activeFilter === 'all' || activeFilter === 'focus') && (
            <section className="cd-pillar cd-pillar-resume" aria-label="Resume Work">
              <div className="cd-pillar-head">
                <div className="cd-pillar-badge-title">
                  <Icon name="arrowRight" size={15} />
                  <span className="cd-pillar-title">Resume Active Work</span>
                </div>
                <div className="row" style={{ gap: 6, alignItems: 'center' }}>
                  <span className="cd-pillar-count accent">{cockpit.focusQueue.length} queue</span>
                  <button
                    type="button"
                    className="cd-focus-jump-btn"
                    onClick={() => setIsAddingTask(!isAddingTask)}
                    aria-label="Add task"
                  >
                    + Task
                  </button>
                </div>
              </div>

              <div className="cd-pillar-body">
                {/* Active Project Resume Banner */}
                {activeProject && (
                  <div className="cd-resume-card-box">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Current Project
                      </span>
                      <button
                        type="button"
                        className="cd-focus-jump-btn"
                        onClick={() => navigate(`#/projects/${activeProject.id}`)}
                      >
                        Resume →
                      </button>
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>
                      {activeProject.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--metadata)' }}>
                      {derived.clientById(activeProject.clientId)?.name ?? 'Client'} · Next: {activeProject.nextMilestone}
                    </div>
                  </div>
                )}

                {/* Active Document Draft Resume */}
                {activeDocument && (
                  <div className="cd-resume-card-box" style={{ background: 'var(--surface)', borderColor: 'var(--divider)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Document in Progress
                      </span>
                      <button
                        type="button"
                        className="cd-focus-jump-btn"
                        onClick={() => navigate(`#/documents/${activeDocument.id}`)}
                      >
                        Edit →
                      </button>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                      {activeDocument.title} (v{activeDocument.workingVersion})
                    </div>
                  </div>
                )}

                {/* Quick Inline Task Input */}
                {isAddingTask && (
                  <form onSubmit={handleCreateQuickTask} style={{ padding: '8px 10px', background: 'var(--surface-subtle)', borderRadius: 8 }}>
                    <input
                      type="text"
                      value={quickTaskTitle}
                      onChange={(e) => setQuickTaskTitle(e.target.value)}
                      placeholder="Enter urgent task & press Enter…"
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '7px 10px',
                        borderRadius: 6,
                        border: '1px solid var(--divider)',
                        background: 'var(--surface)',
                        fontSize: 13,
                        color: 'var(--text)',
                        outline: 'none',
                      }}
                    />
                  </form>
                )}

                {/* Focus Tasks List */}
                {cockpit.focusQueue.length === 0 ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--metadata)', fontSize: 13 }}>
                    <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>☕</span>
                    Focus queue is empty. Ready for the next project milestone.
                  </div>
                ) : (
                  cockpit.focusQueue.map((task) => (
                    <div key={task.id} className="cd-focus-item">
                      <input
                        type="checkbox"
                        className="cd-focus-checkbox"
                        checked={task.status === 'done'}
                        onChange={() => handleToggleTask(task.id, task.status)}
                        aria-label={`Mark ${task.title} as completed`}
                      />

                      <div className="cd-focus-content">
                        <span
                          className="cd-focus-task-title"
                          style={{
                            textDecoration: task.status === 'done' ? 'line-through' : 'none',
                            opacity: task.status === 'done' ? 0.6 : 1,
                          }}
                        >
                          {task.title}
                        </span>

                        <div className="cd-focus-meta">
                          <span>{task.clientName}</span>
                          <span>•</span>
                          <span>{task.projectName}</span>
                          <span>•</span>
                          <span className={`cd-focus-meta-badge ${task.priority}`}>
                            {task.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {task.directLinkUrl && (
                        <button
                          type="button"
                          className="cd-focus-jump-btn"
                          onClick={() => navigate(task.directLinkUrl!)}
                          title="Jump to work context"
                        >
                          Open →
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* Pillar 3: Waiting (Right / Supporting) */}
          {(activeFilter === 'all' || activeFilter === 'clients') && (
            <section className="cd-pillar cd-pillar-waiting" aria-label="Waiting on Others">
              <div className="cd-pillar-head">
                <div className="cd-pillar-badge-title">
                  <Icon name="clock" size={15} />
                  <span className="cd-pillar-title">Waiting on Others</span>
                </div>
                <span className="cd-pillar-count">{waitingItems.length} pending</span>
              </div>

              <div className="cd-pillar-body">
                {waitingItems.length === 0 ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--metadata)', fontSize: 13 }}>
                    <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>✓</span>
                    Nothing currently awaiting client responses or external reviews.
                  </div>
                ) : (
                  waitingItems.map((item) => (
                    <div key={item.id} className="cd-waiting-item">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--waiting)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {item.kind} Sign-Off
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--metadata)' }}>
                          {item.daysWaiting}d waiting
                        </span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                        Waiting on {item.waitingOn} ({item.clientName})
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                        <button
                          type="button"
                          className="cd-focus-jump-btn"
                          onClick={() => handlePingClient(item.title, item.clientName)}
                        >
                          Ping Stakeholder
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </div>
      )}

      {/* 3. Below: Client Pulse & Commercial Runway (Supporting Context) */}
      <section className="cd-pulse-section mt-16" aria-label="Client Pulse & Commercial Runway">
        <div className="cd-pillar-head">
          <div className="cd-pillar-badge-title">
            <Icon name="activity" size={15} />
            <span className="cd-pillar-title">Client Pulse & Commercial Runway</span>
          </div>
          <span className="cd-pillar-count">{cockpit.clientPulse.length} active relationships</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="cd-pulse-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Relationship Tier</th>
                <th>Active Workstreams</th>
                <th>Target Milestone</th>
                <th>Total Value</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cockpit.clientPulse.map((client) => (
                <tr key={client.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div
                        className="cd-pulse-avatar"
                        style={{ background: client.brandColor }}
                      >
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{client.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="cd-pulse-phase-pill">{client.tier}</span>
                  </td>
                  <td>{client.activeProjectsCount} Active</td>
                  <td style={{ color: 'var(--muted)' }}>{client.nextMilestone}</td>
                  <td style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    {client.totalBilledFormatted}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`#/clients/${client.id}`)}
                    >
                      Dossier →
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Onboarding Studio Slide-Over Drawer */}
      <ClientStudioDrawer
        isOpen={isClientDrawerOpen}
        onClose={() => setIsClientDrawerOpen(false)}
        triggerRef={newClientBtnRef}
      />
    </div>
  );
}
