/**
 * General Settings Section.
 * Desktop system options: language, date/time formatting, startup view, and window behavior.
 */

import { useState } from 'react';
import { useOverlay } from '../../../ui/overlay';
import {
  SettingsPage,
  SettingsSection,
  SettingsRow,
  SettingsToggleRow,
} from '../SettingsPrimitives';

export function GeneralSettings() {
  const overlay = useOverlay();

  // Local preferences backed by localStorage
  const [language, setLanguage] = useState(() => {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem('syntaflow.language') || 'en-GB'
      : 'en-GB';
  });

  const [dateFormat, setDateFormat] = useState(() => {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem('syntaflow.dateFormat') || 'DD_MMM_YYYY'
      : 'DD_MMM_YYYY';
  });

  const [time24h, setTime24h] = useState(() => {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem('syntaflow.time24h') !== 'false'
      : true;
  });

  const [relativeDates, setRelativeDates] = useState(() => {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem('syntaflow.relativeDates') !== 'false'
      : true;
  });

  const [startupView, setStartupView] = useState(() => {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem('syntaflow.startupView') || 'home'
      : 'home';
  });

  const [launchOnStartup, setLaunchOnStartup] = useState(() => {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem('syntaflow.launchOnStartup') === 'true'
      : false;
  });

  const [closeToTray, setCloseToTray] = useState(() => {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem('syntaflow.closeToTray') !== 'false'
      : true;
  });

  const [isDirty, setIsDirty] = useState(false);

  const markDirty = () => setIsDirty(true);

  const handleSave = () => {
    try {
      localStorage.setItem('syntaflow.language', language);
      localStorage.setItem('syntaflow.dateFormat', dateFormat);
      localStorage.setItem('syntaflow.time24h', String(time24h));
      localStorage.setItem('syntaflow.relativeDates', String(relativeDates));
      localStorage.setItem('syntaflow.startupView', startupView);
      localStorage.setItem('syntaflow.launchOnStartup', String(launchOnStartup));
      localStorage.setItem('syntaflow.closeToTray', String(closeToTray));
      setIsDirty(false);
      overlay.toast('General settings saved', 'Preferences applied immediately.', 'ok');
    } catch {
      overlay.toast('Failed to save', 'Local storage unavailable.', 'warn');
    }
  };

  return (
    <SettingsPage
      title="General"
      description="Configure language, regional conventions, date formatting, and application startup behavior."
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
      {/* Regional & Language */}
      <SettingsSection
        title="Language & Regional Formats"
        description="Choose how text, numbers, and dates are presented across client workspaces."
      >
        <SettingsRow
          label="Display language"
          sub="Interface language for application menus, navigation, and system notifications."
          htmlFor="pref-lang"
          control={
            <select
              id="pref-lang"
              className="cd-settings-select"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                markDirty();
              }}
            >
              <option value="en-GB">English (United Kingdom)</option>
              <option value="en-US">English (United States)</option>
              <option value="fr-FR">Français (France)</option>
              <option value="de-DE">Deutsch (Deutschland)</option>
            </select>
          }
        />

        <SettingsRow
          label="Date format"
          sub="Standard layout for timestamps in activity logs, reviews, and delivery receipts."
          htmlFor="pref-date-fmt"
          control={
            <select
              id="pref-date-fmt"
              className="cd-settings-select"
              value={dateFormat}
              onChange={(e) => {
                setDateFormat(e.target.value);
                markDirty();
              }}
            >
              <option value="DD_MMM_YYYY">15 Sep 2026 (Standard)</option>
              <option value="YYYY_MM_DD">2026-09-15 (ISO 8601)</option>
              <option value="MM_DD_YYYY">09/15/2026 (US Format)</option>
            </select>
          }
        />

        <SettingsToggleRow
          id="pref-time-24h"
          label="24-hour clock"
          sub="Display timestamps as 14:30 instead of 2:30 PM."
          checked={time24h}
          onChange={(val) => {
            setTime24h(val);
            markDirty();
          }}
        />

        <SettingsToggleRow
          id="pref-relative-dates"
          label="Relative timestamps"
          sub="Display friendly relative times like '10m ago' or 'due in 2d' with exact tooltip on hover."
          checked={relativeDates}
          onChange={(val) => {
            setRelativeDates(val);
            markDirty();
          }}
        />
      </SettingsSection>

      {/* Startup & Navigation */}
      <SettingsSection
        title="Startup & Navigation"
        description="Configure which view is loaded when opening Syntaflow and window lifecycle behavior."
      >
        <SettingsRow
          label="Default startup view"
          sub="Initial destination when launching the desktop app or restarting a session."
          htmlFor="pref-startup"
          control={
            <select
              id="pref-startup"
              className="cd-settings-select"
              value={startupView}
              onChange={(e) => {
                setStartupView(e.target.value);
                markDirty();
              }}
            >
              <option value="home">Home (Command Center)</option>
              <option value="tasks">Tasks Board</option>
              <option value="projects">Projects List</option>
              <option value="documents">Documents Studio</option>
            </select>
          }
        />

        <SettingsToggleRow
          id="pref-launch-startup"
          label="Launch on system login"
          sub="Automatically start Syntaflow in the background when logging into Windows."
          checked={launchOnStartup}
          onChange={(val) => {
            setLaunchOnStartup(val);
            markDirty();
          }}
        />

        <SettingsToggleRow
          id="pref-close-tray"
          label="Minimize to notification area on close"
          sub="Closing the window keeps Syntaflow active in the background tray for instant restoration."
          checked={closeToTray}
          onChange={(val) => {
            setCloseToTray(val);
            markDirty();
          }}
        />
      </SettingsSection>
    </SettingsPage>
  );
}
