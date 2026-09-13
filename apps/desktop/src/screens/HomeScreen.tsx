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
  const { state, dispatch } = useStore();
  const overlay = useOverlay();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState<PillarFilter>('all');
  const [isClientDrawerOpen, setIsClientDrawerOpen] = useState(false);

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
              All Pillars
            </button>
            <button
              type="button"
              className={`segmented-btn ${activeFilter === 'blockers' ? 'is-active' : ''}`}
              onClick={() => setActiveFilter('blockers')}
            >
              Blockers ({cockpit.blockers.length})
            </button>
            <button
              type="button"
              className={`segmented-btn ${activeFilter === 'focus' ? 'is-active' : ''}`}
              onClick={() => setActiveFilter('focus')}
            >
              Focus ({cockpit.focusQueue.length})
            </button>
            <button
              type="button"
              className={`segmented-btn ${activeFilter === 'clients' ? 'is-active' : ''}`}
              onClick={() => setActiveFilter('clients')}
            >
              Pulse ({cockpit.clientPulse.length})
            </button>
          </div>

          <Button
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

      {/* 2. The 3 Operator Pillars */}
      <div className="cd-cockpit-grid">
        {/* Pillar 1: External Blockers & Approvals Gate */}
        {(activeFilter === 'all' || activeFilter === 'blockers') && (
          <section className="cd-pillar" aria-label="External Blockers & Approvals">
            <div className="cd-pillar-head">
              <div className="cd-pillar-badge-title">
                <Icon name="clock" size={15} />
                <span className="cd-pillar-title">Client Approvals & Blockers</span>
              </div>
              <span className={`cd-pillar-count ${cockpit.blockers.length > 0 ? 'alert' : ''}`}>
                {cockpit.blockers.length} waiting
              </span>
            </div>

            <div className="cd-pillar-body">
              {cockpit.blockers.length === 0 ? (
                <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--metadata)', fontSize: 13 }}>
                  <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>✓</span>
                  No external blockers. All client gates are clear.
                </div>
              ) : (
                cockpit.blockers.map((b) => (
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
                ))
              )}
            </div>
          </section>
        )}

        {/* Pillar 2: Today's Focus Production Queue */}
        {(activeFilter === 'all' || activeFilter === 'focus') && (
          <section className="cd-pillar" aria-label="Today's Focus Production Queue">
            <div className="cd-pillar-head">
              <div className="cd-pillar-badge-title">
                <Icon name="check" size={15} />
                <span className="cd-pillar-title">Today’s Focus Queue</span>
              </div>
              <div className="row" style={{ gap: 6, alignItems: 'center' }}>
                <span className="cd-pillar-count accent">{cockpit.focusQueue.length} queue</span>
                <button
                  type="button"
                  className="cd-focus-jump-btn"
                  onClick={() => setIsAddingTask(!isAddingTask)}
                  aria-label="Add task"
                >
                  + Add
                </button>
              </div>
            </div>

            <div className="cd-pillar-body">
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
                        <span>•</span>
                        <span>~{task.estimatedMinutes}m</span>
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

        {/* Pillar 3: Client Pulse & Commercial Runway */}
        {(activeFilter === 'all' || activeFilter === 'clients') && (
          <section className="cd-pillar" aria-label="Client Pulse & Commercial Pipeline">
            <div className="cd-pillar-head">
              <div className="cd-pillar-badge-title">
                <Icon name="activity" size={15} />
                <span className="cd-pillar-title">Client Pulse & Runway</span>
              </div>
              <span className="cd-pillar-count">{cockpit.clientPulse.length} clients</span>
            </div>

            <div className="cd-pillar-body">
              {cockpit.clientPulse.map((client) => (
                <a
                  key={client.id}
                  href={`#/clients/${client.id}`}
                  className="cd-pulse-item"
                >
                  <div className="cd-pulse-head">
                    <div className="cd-pulse-client">
                      <div
                        className="cd-pulse-avatar"
                        style={{ background: client.brandColor }}
                      >
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="cd-pulse-name">{client.name}</span>
                    </div>
                    <span className="cd-pulse-phase-pill">{client.currentPhase}</span>
                  </div>

                  <div className="cd-pulse-metric-row">
                    <span>{client.tier} • {client.activeProjectsCount} Active Workstreams</span>
                    <span className="cd-pulse-metric-val">{client.totalBilledFormatted}</span>
                  </div>

                  <div className="cd-pulse-milestone">
                    Target: {client.nextMilestone}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Onboarding Studio Slide-Over Drawer */}
      <ClientStudioDrawer
        isOpen={isClientDrawerOpen}
        onClose={() => setIsClientDrawerOpen(false)}
      />
    </div>
  );
}
