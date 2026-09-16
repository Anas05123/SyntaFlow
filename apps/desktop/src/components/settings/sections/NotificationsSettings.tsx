/**
 * Notifications Settings Section.
 * Desktop notifications organized by reviews, tasks, projects, client delivery, and system activity.
 */

import { useState } from 'react';
import { useOverlay } from '../../../ui/overlay';
import {
  SettingsPage,
  SettingsSection,
  SettingsToggleRow,
} from '../SettingsPrimitives';

interface NotificationState {
  reviewRequested: boolean;
  reviewApproved: boolean;
  changesRequested: boolean;
  taskAssigned: boolean;
  overdueAlert: boolean;
  blockerAlert: boolean;
  milestoneMet: boolean;
  scopeAccepted: boolean;
  deliveryDownloaded: boolean;
  grantVerified: boolean;
  weeklyDigest: boolean;
  soundAlerts: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationState = {
  reviewRequested: true,
  reviewApproved: true,
  changesRequested: true,
  taskAssigned: true,
  overdueAlert: true,
  blockerAlert: true,
  milestoneMet: true,
  scopeAccepted: true,
  deliveryDownloaded: true,
  grantVerified: true,
  weeklyDigest: false,
  soundAlerts: false,
};

export function NotificationsSettings() {
  const overlay = useOverlay();

  const [prefs, setPrefs] = useState<NotificationState>(() => {
    if (typeof localStorage === 'undefined') return DEFAULT_NOTIFICATIONS;
    try {
      const stored = localStorage.getItem('syntaflow.notifications');
      return stored ? { ...DEFAULT_NOTIFICATIONS, ...JSON.parse(stored) } : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  const [isDirty, setIsDirty] = useState(false);

  const toggle = (key: keyof NotificationState, val: boolean) => {
    setPrefs((p) => ({ ...p, [key]: val }));
    setIsDirty(true);
  };

  const handleSave = () => {
    try {
      localStorage.setItem('syntaflow.notifications', JSON.stringify(prefs));
      setIsDirty(false);
      overlay.toast('Notification preferences saved', 'Desktop alert rules updated.', 'ok');
    } catch {
      overlay.toast('Save failed', 'Local storage error.', 'warn');
    }
  };

  return (
    <SettingsPage
      title="Notifications"
      description="Configure real-time desktop banner alerts and operational updates across all client projects."
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
      {/* Reviews & Client Approvals */}
      <SettingsSection
        title="Reviews & Client Approvals"
        description="Immediate notifications when client stakeholders review or decide on document deliverables."
      >
        <SettingsToggleRow
          id="notif-review-req"
          label="Review requested"
          sub="Notify when an internal document version is dispatched to a designated client reviewer."
          checked={prefs.reviewRequested}
          onChange={(val) => toggle('reviewRequested', val)}
        />

        <SettingsToggleRow
          id="notif-review-appr"
          label="Review approved"
          sub="Instant alert when a client reviewer formally approves a submitted document version."
          checked={prefs.reviewApproved}
          onChange={(val) => toggle('reviewApproved', val)}
        />

        <SettingsToggleRow
          id="notif-changes-req"
          label="Changes requested"
          sub="Alert when client comments indicate revisions or scope adjustments are required."
          checked={prefs.changesRequested}
          onChange={(val) => toggle('changesRequested', val)}
        />
      </SettingsSection>

      {/* Tasks & Operational Attention */}
      <SettingsSection
        title="Tasks & Operational Attention"
        description="Stay notified about task dependencies, overdue gates, and blocker conditions."
      >
        <SettingsToggleRow
          id="notif-overdue"
          label="Overdue task warnings"
          sub="Banner alert when a task passes its scheduled completion date without being marked done."
          checked={prefs.overdueAlert}
          onChange={(val) => toggle('overdueAlert', val)}
        />

        <SettingsToggleRow
          id="notif-blocker"
          label="Dependency blocker alerts"
          sub="Notify when an active task is blocked by an incomplete upstream prerequisite."
          checked={prefs.blockerAlert}
          onChange={(val) => toggle('blockerAlert', val)}
        />

        <SettingsToggleRow
          id="notif-assigned"
          label="Task delegation & assignments"
          sub="Receive alerts when workspace tasks are assigned or delegated to your queue."
          checked={prefs.taskAssigned}
          onChange={(val) => toggle('taskAssigned', val)}
        />
      </SettingsSection>

      {/* Projects & Client Delivery */}
      <SettingsSection
        title="Projects & Delivery Activity"
        description="Telemetry on client downloads, access verifications, and milestone progression."
      >
        <SettingsToggleRow
          id="notif-delivery-dl"
          label="Delivered package downloaded"
          sub="Alert as soon as an authorized client downloads an approved delivery ZIP or file bundle."
          checked={prefs.deliveryDownloaded}
          onChange={(val) => toggle('deliveryDownloaded', val)}
        />

        <SettingsToggleRow
          id="notif-grant-verif"
          label="Client access link verified"
          sub="Notify when a client contact activates their secure single-use guest link."
          checked={prefs.grantVerified}
          onChange={(val) => toggle('grantVerified', val)}
        />

        <SettingsToggleRow
          id="notif-milestone"
          label="Milestone gate unlocked"
          sub="Notification when all required stage deliverables for a project milestone are approved."
          checked={prefs.milestoneMet}
          onChange={(val) => toggle('milestoneMet', val)}
        />
      </SettingsSection>

      {/* System & Audio */}
      <SettingsSection
        title="System Audio & Summaries"
        description="Audio cues and scheduled operational briefs."
      >
        <SettingsToggleRow
          id="notif-weekly"
          label="Weekly open work summary"
          sub="Show a Monday morning overview of upcoming milestone deadlines and review queues."
          checked={prefs.weeklyDigest}
          onChange={(val) => toggle('weeklyDigest', val)}
        />

        <SettingsToggleRow
          id="notif-sound"
          label="Desktop audio chime"
          sub="Play a restrained system audio cue when a client approves a delivery or submits feedback."
          checked={prefs.soundAlerts}
          onChange={(val) => toggle('soundAlerts', val)}
        />
      </SettingsSection>
    </SettingsPage>
  );
}
