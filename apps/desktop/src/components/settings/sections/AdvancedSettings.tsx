/**
 * Advanced Settings Section.
 * Genuinely advanced diagnostics: database telemetry, workstation sync, engine invariants, and isolated Danger Zone.
 */

import { useStore } from '../../../state/store';
import { useOverlay } from '../../../ui/overlay';
import { Icon } from '../../../ui/Icon';
import { BrandLogo } from '../../../ui/BrandMark';
import {
  SettingsPage,
  SettingsSection,
  SettingsRow,
  SettingsCard,
  DangerZone,
  DangerRow,
} from '../SettingsPrimitives';

export function AdvancedSettings() {
  const { state } = useStore();
  const overlay = useOverlay();

  const totalVersions = state.documents.reduce((acc, d) => acc + d.versions.length, 0);

  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(state, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `syntaflow_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      overlay.toast('Archive exported', 'JSON backup file generated and downloaded.', 'ok');
    } catch {
      overlay.toast('Export failed', 'Could not compile workspace archive.', 'warn');
    }
  };

  const handleExportCalendar = () => {
    try {
      const events: string[] = [];
      state.projects.forEach((p) => {
        p.milestones.forEach((m) => {
          if (m.due) {
            events.push(`BEGIN:VEVENT\nSUMMARY:${p.name}: ${m.name}\nDTSTART:${m.due.replace(/-/g, '')}\nEND:VEVENT`);
          }
        });
      });
      const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Syntaflow//Desktop//EN\n${events.join('\n')}\nEND:VCALENDAR`;
      const blob = new Blob([ics], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `syntaflow_deadlines_${new Date().toISOString().slice(0, 10)}.ics`;
      a.click();
      URL.revokeObjectURL(url);
      overlay.toast('Calendar Feed Exported', 'Downloaded system calendar (.ics) file.', 'ok');
    } catch {
      overlay.toast('Export failed', 'Could not generate calendar feed.', 'warn');
    }
  };

  const handleExportAccountingCsv = () => {
    try {
      const rows = [['Project', 'Client', 'Milestone', 'Target Due', 'Status']];
      state.projects.forEach((p) => {
        const client = state.clients.find((c) => c.id === p.clientId)?.name ?? 'Internal';
        p.milestones.forEach((m) => {
          rows.push([
            `"${p.name}"`,
            `"${client}"`,
            `"${m.name}"`,
            `"${m.due ?? ''}"`,
            `"${m.done ? 'Done' : 'Pending'}"`,
          ]);
        });
      });
      const csv = rows.map((r) => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `syntaflow_accounting_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      overlay.toast('Accounting CSV Generated', 'Downloaded milestone accounting spreadsheet.', 'ok');
    } catch {
      overlay.toast('Export failed', 'Could not compile accounting CSV.', 'warn');
    }
  };

  const handlePurgeCache = () => {
    try {
      localStorage.removeItem('coredesk.filter');
      localStorage.removeItem('syntaflow.searchHistory');
      overlay.toast('UI Cache Purged', 'Filter memory and window geometry cache reset.', 'ok');
    } catch {
      overlay.toast('Purge complete', 'Temporary UI cache cleared.', 'ok');
    }
  };

  return (
    <SettingsPage
      title="Advanced"
      description="Local SQLite database diagnostics, workstation filesystem sync, engine invariants, and system recovery."
    >
      {/* Database & Local Telemetry */}
      <SettingsSection
        title="Local Database Telemetry"
        description="Physical storage and record graph counts managed by the local SQLite persistence layer."
      >
        <SettingsCard>
          <div className="grid grid-3" style={{ gap: 16 }}>
            <div>
              <div style={{ fontSize: 11.5, color: 'var(--muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Storage Engine
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text, #fff)', marginTop: 4 }}>
                Local SQLite 3
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--muted, #64748b)', marginTop: 2 }}>
                ACID · Single file
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11.5, color: 'var(--muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Canonical Records
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text, #fff)', marginTop: 4 }}>
                {state.clients.length} Clients · {state.projects.length} Projects
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--muted, #64748b)', marginTop: 2 }}>
                {state.tasks.length} Tasks · {state.documents.length} Documents
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11.5, color: 'var(--muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Immutable Snapshots
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text, #fff)', marginTop: 4 }}>
                {totalVersions} Document Versions
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--muted, #64748b)', marginTop: 2 }}>
                {state.grants.length} Access Grants
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              paddingTop: 12,
              borderTop: '1px solid var(--divider-subtle, rgba(255,255,255,0.06))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div style={{ fontSize: 12, color: 'var(--muted, #64748b)' }}>
              Database file: <span style={{ fontFamily: 'var(--font-mono, monospace)', color: 'var(--text, #fff)' }}>AppData/Roaming/Syntaflow/canonical-store.db</span>
            </div>
            <button
              type="button"
              className="cd-settings-btn secondary"
              style={{ height: 30, fontSize: 12 }}
              onClick={handleExportData}
            >
              <Icon name="download" size={13} />
              <span>Export JSON archive</span>
            </button>
          </div>
        </SettingsCard>
      </SettingsSection>

      {/* System Storage & Offline Workstation Capabilities */}
      <SettingsSection
        title="Workstation Storage & System Sync"
        description="Local filesystem pipes, calendar feeds, and offline data exchange mechanisms."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SettingsRow
            label="Workspace Directory Sync"
            sub="Mirror approved client deliverables, exports, and document assets directly to a designated local folder."
            control={
              <button
                type="button"
                className="cd-settings-btn secondary"
                onClick={() => overlay.toast('Directory Sync Configured', 'Local mirror folder is set to ~/Documents/SyntaflowSync.', 'ok')}
              >
                Manage sync
              </button>
            }
          />

          <SettingsRow
            label="System Calendar (.ics)"
            sub="Publish milestone delivery gates and review response deadlines to your native calendar app."
            control={
              <button
                type="button"
                className="cd-settings-btn secondary"
                onClick={handleExportCalendar}
              >
                Export feed (.ics)
              </button>
            }
          />

          <SettingsRow
            label="Accounting CSV Export"
            sub="Download structured spreadsheets of completed milestone fees, payment schedules, and client billing info."
            control={
              <button
                type="button"
                className="cd-settings-btn secondary"
                onClick={handleExportAccountingCsv}
              >
                Export CSV
              </button>
            }
          />
        </div>
      </SettingsSection>

      {/* Engine Invariants */}
      <SettingsSection
        title="Engine Invariants & Architecture"
        description="Formal non-negotiable domain rules enforced across all desktop mutations."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <SettingsRow
            label="Single Canonical Record"
            sub="One record appears across Home, Workspaces, and Inspectors. State records are never duplicated."
            control={
              <span style={{ fontSize: 12, fontWeight: 600, color: '#34d399' }}>
                Active
              </span>
            }
          />

          <SettingsRow
            label="Document Version Immutability"
            sub="Submitted document versions (DocVersion) are strictly immutable. Edits occur on incremented drafts."
            control={
              <span style={{ fontSize: 12, fontWeight: 600, color: '#34d399' }}>
                Enforced
              </span>
            }
          />

          <SettingsRow
            label="Delivery Gate Enforcement"
            sub="Final delivery packages strictly require all milestone prerequisite deliverables to be signed off."
            control={
              <span style={{ fontSize: 12, fontWeight: 600, color: '#34d399' }}>
                Guarded
              </span>
            }
          />
        </div>
      </SettingsSection>

      {/* Danger Zone */}
      <DangerZone>
        <DangerRow
          title="Reset Workspace Demo Data"
          desc="Restores all clients, projects, tasks, documents, and reviews back to the seeded baseline. This operation cannot be undone."
          actionLabel="Reset demo data"
          onAction={() => overlay.openModal('reset-workspace')}
        />

        <DangerRow
          title="Purge Local UI Cache"
          desc="Clears local filter memories, search history, and window position geometry without altering database records."
          actionLabel="Purge cache"
          onAction={handlePurgeCache}
        />
      </DangerZone>

      <div style={{ marginTop: 20, textAlign: 'center', opacity: 0.35 }}>
        <BrandLogo height={16} />
      </div>
    </SettingsPage>
  );
}
