/**
 * Client Access Settings Section.
 * Comprehensive management of object-scoped guest access grants, verification status, and permissions.
 */

import { useState, useMemo } from 'react';
import { useStore } from '../../../state/store';
import { useOverlay } from '../../../ui/overlay';
import { navigate } from '../../../app/router';
import { formatShortDate, initials, relative } from '../../../domain/dates';
import { Icon } from '../../../ui/Icon';
import { Chip } from '../../../ui/primitives';
import {
  SettingsPage,
  SettingsSection,
  SettingsCard,
} from '../SettingsPrimitives';

export function ClientAccessSettings() {
  const { state, dispatch } = useStore();
  const overlay = useOverlay();

  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'revoked'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGrants = useMemo(() => {
    return state.grants.filter((g) => {
      // Status filter
      if (filter === 'active' && g.state !== 'active' && g.state !== 'verified') return false;
      if (filter === 'pending' && g.state !== 'invited') return false;
      if (filter === 'revoked' && g.state !== 'revoked' && g.state !== 'expired') return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = g.recipient.name.toLowerCase().includes(q);
        const matchEmail = g.recipient.email.toLowerCase().includes(q);
        const matchObj = g.objectLabel.toLowerCase().includes(q);
        return matchName || matchEmail || matchObj;
      }
      return true;
    });
  }, [state.grants, filter, searchQuery]);

  const activeCount = state.grants.filter((g) => g.state === 'active' || g.state === 'verified').length;
  const pendingCount = state.grants.filter((g) => g.state === 'invited').length;

  const handleCopyLink = (grantId: string) => {
    try {
      const url = `${window.location.origin}/#/guest/shared?grant=${grantId}`;
      navigator.clipboard.writeText(url);
      overlay.toast('Access link copied', 'Single-use secure access link copied to clipboard.', 'ok');
    } catch {
      overlay.toast('Access link generated', 'Grant token ready.', 'default');
    }
  };

  return (
    <SettingsPage
      title="Client Access"
      description="Manage object-level guest access grants. Clients only see documents and versions explicitly shared with them."
      actions={
        <button
          type="button"
          className="cd-settings-btn primary"
          onClick={() => navigate('#/share')}
        >
          <Icon name="mail" size={14} />
          <span>Invite recipient</span>
        </button>
      }
    >
      {/* Principle Banner */}
      <div
        style={{
          background: 'var(--raised, #13161c)',
          border: '1px solid var(--divider, rgba(255, 255, 255, 0.08))',
          borderLeft: '3px solid var(--accent, #2563eb)',
          borderRadius: 'var(--r-control, 8px)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text, #fff)' }}>
            Access is granted per object, never per relationship.
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--muted, #64748b)', marginTop: 2 }}>
            An invitation never gives workspace-wide access. Sibling projects, internal operator notes, and drafts remain strictly private.
          </div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted, #94a3b8)', whiteSpace: 'nowrap' }}>
          {activeCount} active · {pendingCount} pending
        </div>
      </div>

      {/* Directory Section with Filters */}
      <SettingsSection
        title="Access Grants Directory"
        description="Active and pending links with granular permission scopes and expiration times."
      >
        {/* Filters and Search Bar */}
        <div className="cd-settings-filters" style={{ justifyContent: 'space-between' }}>
          <div className="row" style={{ gap: 6 }}>
            {[
              { id: 'all', label: `All (${state.grants.length})` },
              { id: 'active', label: `Active (${activeCount})` },
              { id: 'pending', label: `Pending (${pendingCount})` },
              { id: 'revoked', label: 'Expired / Revoked' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                className={`cd-settings-filter-btn ${filter === f.id ? 'is-active' : ''}`}
                onClick={() => setFilter(f.id as any)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            className="cd-settings-input"
            style={{ height: 30, width: 220, fontSize: 12 }}
            placeholder="Filter by contact or object..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Filter grants"
          />
        </div>

        {/* Grants Table */}
        <div className="table-wrap" style={{ border: '1px solid var(--divider, rgba(255,255,255,0.08))', borderRadius: 'var(--r-control, 8px)' }}>
          <table className="data" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--raised, #13161c)', borderBottom: '1px solid var(--divider, rgba(255,255,255,0.08))' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted, #94a3b8)' }}>Recipient</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted, #94a3b8)' }}>Role</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted, #94a3b8)' }}>Scope / Shared Object</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted, #94a3b8)' }}>Last Activity</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--muted, #94a3b8)' }}>Status</th>
                <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'var(--muted, #94a3b8)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrants.length > 0 ? (
                filteredGrants.map((g) => {
                  const isActive = g.state === 'active' || g.state === 'verified';
                  const isInvited = g.state === 'invited';

                  return (
                    <tr
                      key={g.id}
                      style={{ borderBottom: '1px solid var(--divider-subtle, rgba(255,255,255,0.04))' }}
                    >
                      <td style={{ padding: '12px 14px' }}>
                        <div className="row" style={{ gap: 10 }}>
                          <span
                            className="avatar"
                            style={{ width: 28, height: 28, fontSize: 11, background: 'var(--raised, #1b202c)' }}
                          >
                            {initials(g.recipient.name)}
                          </span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text, #fff)' }}>
                              {g.recipient.name}
                            </div>
                            <div style={{ fontSize: 11.5, color: 'var(--muted, #64748b)' }}>
                              {g.recipient.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px 14px', fontSize: 12.5, color: 'var(--text, #fff)' }}>
                        {g.role}
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text, #fff)' }}>
                          {g.objectLabel}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--muted, #64748b)' }}>
                          {g.objectType} · {g.permissions.length} rights
                        </div>
                      </td>

                      <td style={{ padding: '12px 14px', fontSize: 12, color: 'var(--muted, #94a3b8)' }}>
                        {g.lastActivity ? relative(g.lastActivity) : `Invited ${formatShortDate(g.invited)}`}
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <Chip
                          state={isActive ? 'active' : isInvited ? 'pending' : g.state}
                          label={isActive ? 'Active' : isInvited ? 'Invited' : g.state}
                        />
                      </td>

                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <div className="row" style={{ justifyContent: 'flex-end', gap: 6 }}>
                          <button
                            type="button"
                            className="cd-settings-btn ghost"
                            style={{ height: 28, padding: '0 8px', fontSize: 11.5 }}
                            onClick={() => handleCopyLink(g.id)}
                            title="Copy single-use access link"
                          >
                            <Icon name="link" size={13} />
                            <span>Copy link</span>
                          </button>

                          {isActive || isInvited ? (
                            <button
                              type="button"
                              className="cd-settings-btn danger"
                              style={{ height: 28, padding: '0 8px', fontSize: 11.5 }}
                              onClick={() => {
                                dispatch({ type: 'grant/state', id: g.id, state: 'revoked' });
                                overlay.toast('Access revoked', `Access terminated for ${g.recipient.name}.`, 'warn');
                              }}
                            >
                              Revoke
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="cd-settings-btn secondary"
                              style={{ height: 28, padding: '0 8px', fontSize: 11.5 }}
                              onClick={() => {
                                dispatch({ type: 'grant/state', id: g.id, state: 'invited' });
                                overlay.toast('Invitation re-sent', 'New access token generated.', 'ok');
                              }}
                            >
                              Re-invite
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '28px 14px', textAlign: 'center', color: 'var(--muted, #64748b)', fontSize: 13 }}>
                    No access grants matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SettingsSection>

      {/* Role Capabilities Matrix */}
      <SettingsSection
        title="Role Capability Matrix"
        description="Formal permissions enforced across guest preview portals."
      >
        <div className="grid grid-2" style={{ gap: 16 }}>
          <SettingsCard>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text, #fff)', marginBottom: 8 }}>
              Guest Reviewer
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--muted, #64748b)', lineHeight: 1.45, margin: '0 0 12px 0' }}>
              Designated client stakeholders authorized to decide on specific document versions.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
              <div className="row" style={{ gap: 8, color: '#34d399' }}>
                <Icon name="check" size={14} />
                <span>Read submitted version snapshots</span>
              </div>
              <div className="row" style={{ gap: 8, color: '#34d399' }}>
                <Icon name="check" size={14} />
                <span>Submit decision: Approve or Request Changes</span>
              </div>
              <div className="row" style={{ gap: 8, color: '#34d399' }}>
                <Icon name="check" size={14} />
                <span>Download authorized release packages</span>
              </div>
              <div className="row" style={{ gap: 8, color: 'var(--muted, #64748b)' }}>
                <Icon name="close" size={14} />
                <span>Cannot see workspace notes, tasks, or other clients</span>
              </div>
            </div>
          </SettingsCard>

          <SettingsCard>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text, #fff)', marginBottom: 8 }}>
              Guest Viewer
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--muted, #64748b)', lineHeight: 1.45, margin: '0 0 12px 0' }}>
              Read-only external stakeholders who inspect agreed documents without review authority.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
              <div className="row" style={{ gap: 8, color: '#34d399' }}>
                <Icon name="check" size={14} />
                <span>Read granted versions and presentation decks</span>
              </div>
              <div className="row" style={{ gap: 8, color: '#34d399' }}>
                <Icon name="check" size={14} />
                <span>Download permitted release attachments</span>
              </div>
              <div className="row" style={{ gap: 8, color: 'var(--muted, #64748b)' }}>
                <Icon name="close" size={14} />
                <span>Cannot approve or request revisions</span>
              </div>
              <div className="row" style={{ gap: 8, color: 'var(--muted, #64748b)' }}>
                <Icon name="close" size={14} />
                <span>Cannot invite secondary recipients</span>
              </div>
            </div>
          </SettingsCard>
        </div>
      </SettingsSection>
    </SettingsPage>
  );
}
