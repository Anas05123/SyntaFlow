/**
 * Account Settings Section.
 * Personal profile details, identity authorship, password updates, and session termination.
 */

import { useState } from 'react';
import { useStore } from '../../../state/store';
import { useOverlay } from '../../../ui/overlay';
import { navigate } from '../../../app/router';
import { initials } from '../../../domain/dates';
import {
  SettingsPage,
  SettingsSection,
  SettingsRow,
  SettingsCard,
} from '../SettingsPrimitives';

export function AccountSettings() {
  const { state, dispatch } = useStore();
  const overlay = useOverlay();
  const ws = state.workspace;

  const [ownerName, setOwnerName] = useState(ws.ownerName);
  const [ownerEmail, setOwnerEmail] = useState(ws.ownerEmail);
  const [isDirty, setIsDirty] = useState(false);

  const markDirty = () => setIsDirty(true);

  const handleSave = () => {
    dispatch({
      type: 'workspace/patch',
      patch: {
        ownerName,
        ownerEmail,
      },
    });
    setIsDirty(false);
    overlay.toast('Profile updated', 'Personal details saved.', 'ok');
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem('coredesk.session');
      localStorage.removeItem('syntaflow.session');
      overlay.toast('Signed out', 'Session cleared. Local database remains intact.', 'ok');
      navigate('#/auth');
    } catch {
      navigate('#/auth');
    }
  };

  return (
    <SettingsPage
      title="Account"
      description="Manage your personal profile, authorship initials, contact address, and local device authentication."
      actions={
        <button
          type="button"
          className="cd-settings-btn primary"
          disabled={!isDirty}
          onClick={handleSave}
        >
          Save changes
        </button>
      }
    >
      {/* Personal Profile */}
      <SettingsSection
        title="Personal Profile"
        description="Your name and email appear as the author on generated documents and review requests."
      >
        <SettingsRow
          label="Profile avatar"
          sub="Generated from your initials or operating system identity."
          control={
            <div className="row" style={{ gap: 14 }}>
              <span
                className="avatar"
                style={{
                  width: 44,
                  height: 44,
                  fontSize: 16,
                  fontWeight: 600,
                  background: 'var(--raised, #161922)',
                  border: '1px solid var(--divider, rgba(255,255,255,0.1))',
                  color: 'var(--text, #fff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                }}
              >
                {initials(ownerName)}
              </span>
              <button
                type="button"
                className="cd-settings-btn secondary"
                onClick={() => overlay.toast('Initials Avatar', 'Derived dynamically from full name.', 'default')}
              >
                Change photo
              </button>
            </div>
          }
        />

        <SettingsRow
          label="Full name"
          sub="Legal or professional name printed in proposal signatures and review dispatches."
          htmlFor="acc-name"
          control={
            <input
              id="acc-name"
              type="text"
              className="cd-settings-input"
              style={{ width: 260 }}
              value={ownerName}
              onChange={(e) => {
                setOwnerName(e.target.value);
                markDirty();
              }}
            />
          }
        />

        <SettingsRow
          label="Email address"
          sub="Primary address receiving client response confirmations and notifications."
          htmlFor="acc-email"
          control={
            <input
              id="acc-email"
              type="email"
              className="cd-settings-input"
              style={{ width: 260 }}
              value={ownerEmail}
              onChange={(e) => {
                setOwnerEmail(e.target.value);
                markDirty();
              }}
            />
          }
        />
      </SettingsSection>

      {/* Session Management */}
      <SettingsSection
        title="Device Session"
        description="Local desktop application session on this workstation."
      >
        <SettingsCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text, #fff)' }}>
                Primary Workstation · {ws.timezone}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted, #64748b)', marginTop: 2 }}>
                Logged in as {ws.ownerEmail} · Offline-first local store
              </div>
            </div>

            <button
              type="button"
              className="cd-settings-btn secondary"
              onClick={handleSignOut}
            >
              Sign out of this device
            </button>
          </div>
        </SettingsCard>
      </SettingsSection>
    </SettingsPage>
  );
}
