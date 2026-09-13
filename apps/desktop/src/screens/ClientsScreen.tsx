/**
 * C01 · Clients Workspace — Master-Detail Dossier Architecture.
 *
 * Left: Scannable relationship master list with revenue metrics and brand indicators.
 * Right: Deep commercial and execution dossier with instant project launching,
 * key stakeholder contacts, and pending deliverables.
 */

import { useState, useMemo } from 'react';
import { useStore } from '../state/store';
import { navigate } from '../app/router';
import { CoreDeskDatabase } from '../state/db';
import { ClientStudioDrawer } from '../components/ClientStudioDrawer';
import { Icon } from '../ui/Icon';
import { Button, Chip } from '../ui/primitives';
import type { ClientState } from '../domain/types';

type FilterTab = 'all' | 'active' | 'prospect';

export function ClientsScreen() {
  const { state } = useStore();

  const [filter, setFilter] = useState<FilterTab>('all');
  const [query, setQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>(() => {
    // Default to first active client
    const firstActive = state.clients.find((c) => c.state === 'active');
    return firstActive ? firstActive.id : state.clients[0]?.id ?? '';
  });
  const [isStudioDrawerOpen, setIsStudioDrawerOpen] = useState(false);

  // Filter clients
  const filteredClients = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.clients
      .filter((c) => c.state !== 'archived')
      .filter((c) => (filter === 'all' ? true : c.state === (filter as ClientState)))
      .filter((c) => {
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          (c.industry && c.industry.toLowerCase().includes(q)) ||
          c.contacts.some((ct) => ct.name.toLowerCase().includes(q) || ct.email.toLowerCase().includes(q))
        );
      });
  }, [state.clients, filter, query]);

  // Selected Client Dossier
  const selectedDossier = useMemo(() => {
    if (!selectedClientId) return null;
    return CoreDeskDatabase.getClientDossier(state, selectedClientId);
  }, [state, selectedClientId]);

  const counts = {
    all: state.clients.filter((c) => c.state !== 'archived').length,
    active: state.clients.filter((c) => c.state === 'active').length,
    prospect: state.clients.filter((c) => c.state === 'prospect').length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      {/* Top Controls Header */}
      <div className="cd-section-controls" style={{ marginBottom: 0 }}>
        <div className="cd-section-controls-left">
          <span className="eyebrow">Directory</span>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            Client Relationships
          </h1>
        </div>

        <div className="cd-section-controls-right">
          <Button
            variant="primary"
            icon="plus"
            className="btn-apple"
            onClick={() => setIsStudioDrawerOpen(true)}
          >
            New Client
          </Button>
        </div>
      </div>

      {/* Master-Detail Split Workspace */}
      <div className="cd-master-detail-wrap">
        {/* Left: Master Relationship List */}
        <div className="cd-client-master-pane">
          <div className="cd-client-master-head">
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--metadata)', pointerEvents: 'none' }}>
                <Icon name="search" size={13} />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter clients or contacts…"
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 30px',
                  borderRadius: 7,
                  border: '1px solid var(--divider)',
                  background: 'var(--surface)',
                  fontSize: 12.5,
                  color: 'var(--text)',
                  outline: 'none',
                }}
              />
            </div>

            {/* Filter Tabs */}
            <div className="segmented" role="tablist" style={{ width: '100%' }}>
              <button
                type="button"
                className={`segmented-btn ${filter === 'all' ? 'is-active' : ''}`}
                onClick={() => setFilter('all')}
                style={{ flex: 1, fontSize: 11.5 }}
              >
                All ({counts.all})
              </button>
              <button
                type="button"
                className={`segmented-btn ${filter === 'active' ? 'is-active' : ''}`}
                onClick={() => setFilter('active')}
                style={{ flex: 1, fontSize: 11.5 }}
              >
                Active ({counts.active})
              </button>
              <button
                type="button"
                className={`segmented-btn ${filter === 'prospect' ? 'is-active' : ''}`}
                onClick={() => setFilter('prospect')}
                style={{ flex: 1, fontSize: 11.5 }}
              >
                Prospects ({counts.prospect})
              </button>
            </div>
          </div>

          {/* Scrollable Client Items */}
          <div className="cd-client-list-scroll">
            {filteredClients.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--metadata)', fontSize: 12.5 }}>
                No clients match your filter.
              </div>
            ) : (
              filteredClients.map((client) => {
                const isSelected = client.id === selectedClientId;
                const activeProjCount = state.projects.filter(
                  (p) => p.clientId === client.id && p.stage !== 'closed' && p.stage !== 'cancelled'
                ).length;

                return (
                  <button
                    key={client.id}
                    type="button"
                    className={`cd-client-list-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedClientId(client.id)}
                  >
                    <div className="cd-client-list-item-left">
                      <div
                        className="cd-client-dot-avatar"
                        style={{ background: client.brandColor ?? '#3b82f6' }}
                      >
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="cd-client-list-meta">
                        <span className="cd-client-list-name">{client.name}</span>
                        <span className="cd-client-list-sub">
                          {activeProjCount} active {activeProjCount === 1 ? 'project' : 'projects'}
                        </span>
                      </div>
                    </div>

                    <div className="cd-client-list-item-right">
                      <span className="cd-client-list-revenue">
                        {client.totalBilled ? `$${(client.totalBilled / 1000).toFixed(0)}k` : '$0'}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: client.state === 'active' ? 'var(--green)' : 'var(--metadata)',
                        }}
                      >
                        {client.state}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Deep Relationship Dossier */}
        <div className="cd-client-detail-pane">
          {!selectedDossier ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--metadata)' }}>
              Select a client to view their relationship dossier.
            </div>
          ) : (
            <>
              {/* Dossier Header */}
              <div className="cd-dossier-header">
                <div className="cd-dossier-identity">
                  <div
                    className="cd-dossier-avatar-large"
                    style={{ background: selectedDossier.client.brandColor ?? '#3b82f6' }}
                  >
                    {selectedDossier.client.name.substring(0, 2).toUpperCase()}
                  </div>

                  <div className="cd-dossier-titles">
                    <h2 className="cd-dossier-name">{selectedDossier.client.name}</h2>
                    <div className="cd-dossier-tags">
                      <Chip state={selectedDossier.client.state} />
                      <span className="cd-pulse-phase-pill">
                        {selectedDossier.client.tier ? selectedDossier.client.tier.toUpperCase() : 'STANDARD'}
                      </span>
                      {selectedDossier.client.website && (
                        <a
                          href={selectedDossier.client.website}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}
                        >
                          {selectedDossier.client.website.replace('https://', '')} ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row" style={{ gap: 8 }}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="btn-apple"
                    onClick={() => navigate('#/new-project')}
                  >
                    + New Project
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`#/clients/${selectedDossier.client.id}`)}
                  >
                    Full Profile →
                  </Button>
                </div>
              </div>

              {/* Stat Summary Strip */}
              <div className="cd-dossier-stats-strip">
                <div className="cd-dossier-stat-box">
                  <span className="cd-dossier-stat-label">Total Value</span>
                  <span className="cd-dossier-stat-value">
                    ${selectedDossier.totalPipelineValue.toLocaleString()}
                  </span>
                </div>
                <div className="cd-dossier-stat-box">
                  <span className="cd-dossier-stat-label">Active Workstreams</span>
                  <span className="cd-dossier-stat-value">
                    {selectedDossier.projects.filter((p) => p.stage === 'active').length}
                  </span>
                </div>
                <div className="cd-dossier-stat-box">
                  <span className="cd-dossier-stat-label">Pending Sign-Offs</span>
                  <span className="cd-dossier-stat-value" style={{ color: selectedDossier.pendingReviewsCount > 0 ? 'var(--red)' : 'inherit' }}>
                    {selectedDossier.pendingReviewsCount}
                  </span>
                </div>
                <div className="cd-dossier-stat-box">
                  <span className="cd-dossier-stat-label">Open Tasks</span>
                  <span className="cd-dossier-stat-value">
                    {selectedDossier.tasks.filter((t) => t.status !== 'done').length}
                  </span>
                </div>
              </div>

              {/* Dossier Body Content */}
              <div className="cd-dossier-body">
                {/* Section 1: Active Workstreams & Projects */}
                <div className="cd-dossier-section">
                  <div className="cd-dossier-section-head">
                    <span className="cd-dossier-section-title">
                      Projects & Workstreams ({selectedDossier.projects.length})
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate('#/new-project')}
                    >
                      + Launch
                    </Button>
                  </div>

                  {selectedDossier.projects.length === 0 ? (
                    <div style={{ padding: '16px', background: 'var(--surface-subtle)', borderRadius: 8, fontSize: 12.5, color: 'var(--metadata)' }}>
                      No projects linked yet. Launch the initial project scope above.
                    </div>
                  ) : (
                    <div className="stack" style={{ gap: 8 }}>
                      {selectedDossier.projects.map((proj) => (
                        <a
                          key={proj.id}
                          href={`#/projects/${proj.id}`}
                          className="cd-dossier-project-card"
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>
                              {proj.name}
                            </span>
                            <span style={{ fontSize: 11.5, color: 'var(--metadata)' }}>
                              {proj.outcome}
                            </span>
                          </div>

                          <div className="row" style={{ gap: 12, alignItems: 'center' }}>
                            <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: 'var(--surface-subtle)', color: 'var(--muted)' }}>
                              {proj.stage.toUpperCase()}
                            </span>
                            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)' }}>
                              {proj.budget ? `$${proj.budget.toLocaleString()}` : 'Fixed'}
                            </span>
                            <span style={{ color: 'var(--muted)', fontSize: 12 }}>→</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 2: Key Stakeholders & Contacts */}
                <div className="cd-dossier-section">
                  <div className="cd-dossier-section-head">
                    <span className="cd-dossier-section-title">
                      Key Decision-Makers & Stakeholders ({selectedDossier.client.contacts.length})
                    </span>
                  </div>

                  <div className="cd-dossier-contacts-grid">
                    {selectedDossier.client.contacts.map((contact) => (
                      <div key={contact.id} className="cd-dossier-contact-card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span className="cd-contact-name">{contact.name}</span>
                          {contact.primary && (
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', background: 'color-mix(in srgb, var(--accent) 12%, transparent)', padding: '1px 5px', borderRadius: 3 }}>
                              LEAD
                            </span>
                          )}
                        </div>
                        <span className="cd-contact-role">{contact.role}</span>
                        {contact.email && (
                          <a href={`mailto:${contact.email}`} className="cd-contact-email">
                            {contact.email}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Pending Tasks & Deliverables */}
                <div className="cd-dossier-section">
                  <div className="cd-dossier-section-head">
                    <span className="cd-dossier-section-title">
                      Pending Work & Deliverables ({selectedDossier.tasks.filter((t) => t.status !== 'done').length})
                    </span>
                  </div>

                  {selectedDossier.tasks.filter((t) => t.status !== 'done').length === 0 ? (
                    <div style={{ padding: '14px', background: 'var(--surface-subtle)', borderRadius: 8, fontSize: 12.5, color: 'var(--metadata)' }}>
                      All tasks and milestone deliverables for this client are up to date.
                    </div>
                  ) : (
                    <div className="stack" style={{ gap: 6 }}>
                      {selectedDossier.tasks
                        .filter((t) => t.status !== 'done')
                        .slice(0, 5)
                        .map((task) => (
                          <div
                            key={task.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              background: 'var(--surface)',
                              border: '1px solid var(--divider)',
                              borderRadius: 6,
                              fontSize: 12.5,
                            }}
                          >
                            <span style={{ fontWeight: 500, color: 'var(--text)' }}>
                              {task.title}
                            </span>
                            <span
                              style={{
                                fontSize: 10.5,
                                fontWeight: 600,
                                padding: '1px 6px',
                                borderRadius: 4,
                                background:
                                  task.priority === 'urgent' || task.priority === 'blocker'
                                    ? 'color-mix(in srgb, var(--red) 14%, transparent)'
                                    : 'var(--surface-subtle)',
                                color:
                                  task.priority === 'urgent' || task.priority === 'blocker'
                                    ? 'var(--red)'
                                    : 'var(--muted)',
                              }}
                            >
                              {task.priority.toUpperCase()}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Onboarding Studio Slide-Over Drawer */}
      <ClientStudioDrawer
        isOpen={isStudioDrawerOpen}
        onClose={() => setIsStudioDrawerOpen(false)}
        onClientCreated={(newId) => setSelectedClientId(newId)}
      />
    </div>
  );
}
