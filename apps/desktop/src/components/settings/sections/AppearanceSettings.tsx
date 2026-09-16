import { useState, useEffect } from 'react';
import { useAppearance, type ThemeMode } from '../../../ui/useAppearance';
import { useOverlay } from '../../../ui/overlay';
import {
  SettingsPage,
  SettingsSection,
  SettingsRow,
} from '../SettingsPrimitives';

export function AppearanceSettings() {
  const { appearance, patch } = useAppearance();
  const { mode, accent, background } = appearance;
  const overlay = useOverlay();

  // Density state
  const [density, setDensity] = useState<'comfortable' | 'compact'>(() => {
    return (typeof localStorage !== 'undefined' &&
      (localStorage.getItem('syntaflow.density') as 'comfortable' | 'compact')) ||
      'comfortable';
  });

  // Motion state
  const [motion, setMotion] = useState<'full' | 'reduced'>(() => {
    return (typeof localStorage !== 'undefined' &&
      (localStorage.getItem('syntaflow.motion') as 'full' | 'reduced')) ||
      'full';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-density', density);
    try {
      localStorage.setItem('syntaflow.density', density);
    } catch {
      /* ignore */
    }
  }, [density]);

  useEffect(() => {
    document.documentElement.setAttribute('data-motion', motion);
    try {
      localStorage.setItem('syntaflow.motion', motion);
    } catch {
      /* ignore */
    }
  }, [motion]);

  const ACCENT_PRESETS = [
    { hex: '#2F6FEB', name: 'Harbor Cobalt (Primary)' },
    { hex: '#3FA66B', name: 'Signal Green' },
    { hex: '#D49A3A', name: 'Amber' },
    { hex: '#14181C', name: 'Graphite' },
  ];

  return (
    <SettingsPage
      title="Appearance"
      description="Tailor the desktop environment, typography scale, information density, and presentation colors."
    >
      {/* Theme Selection */}
      <SettingsSection
        title="Interface Theme"
        description="Choose the visual brightness mode for the desktop application window."
      >
        <SettingsRow
          label="Color theme"
          sub="Syntaflow is optimized for dark graphite environments to reduce eye strain during extended operational sessions."
          control={
            <div className="row" style={{ gap: 8 }}>
              {[
                { id: 'dark', label: 'Dark' },
                { id: 'light', label: 'Light' },
                { id: 'system', label: 'System' },
              ].map((t) => {
                const isSelected = mode === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={`cd-settings-btn ${isSelected ? 'primary' : 'secondary'}`}
                    style={{ minWidth: 84 }}
                    onClick={() => {
                      patch({ mode: t.id as ThemeMode });
                      overlay.toast('Theme updated', `${t.label} mode active.`, 'default');
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          }
        />
      </SettingsSection>

      {/* Density & Ergonomics */}
      <SettingsSection
        title="Layout Density & Motion"
        description="Adjust list row heights, table spacing, and interface transition speeds."
      >
        <SettingsRow
          label="Interface density"
          sub="Compact density reduces row padding across the Tasks board and Client Access tables for higher data visibility."
          control={
            <div className="row" style={{ gap: 8 }}>
              <button
                type="button"
                className={`cd-settings-btn ${density === 'comfortable' ? 'primary' : 'secondary'}`}
                onClick={() => {
                  setDensity('comfortable');
                  overlay.toast('Density updated', 'Comfortable density set.', 'default');
                }}
              >
                Comfortable
              </button>
              <button
                type="button"
                className={`cd-settings-btn ${density === 'compact' ? 'primary' : 'secondary'}`}
                onClick={() => {
                  setDensity('compact');
                  overlay.toast('Density updated', 'Compact high-density active.', 'default');
                }}
              >
                Compact
              </button>
            </div>
          }
        />

        <SettingsRow
          label="Interface motion"
          sub="Reduced motion minimizes sliding animations, panel transitions, and progress bar animations."
          control={
            <div className="row" style={{ gap: 8 }}>
              <button
                type="button"
                className={`cd-settings-btn ${motion === 'full' ? 'primary' : 'secondary'}`}
                onClick={() => {
                  setMotion('full');
                  overlay.toast('Motion updated', 'Full transitions enabled.', 'default');
                }}
              >
                Full motion
              </button>
              <button
                type="button"
                className={`cd-settings-btn ${motion === 'reduced' ? 'primary' : 'secondary'}`}
                onClick={() => {
                  setMotion('reduced');
                  overlay.toast('Motion updated', 'Reduced motion active.', 'default');
                }}
              >
                Reduced motion
              </button>
            </div>
          }
        />
      </SettingsSection>

      {/* Document Branding Colors */}
      <SettingsSection
        title="Document Accent Color"
        description="Primary highlight tone used on proposal covers, executive summaries, and presentation headers."
      >
        <SettingsRow
          label="Accent palette"
          sub="Select a calibrated tone for client-facing documents. Applied to new drafts only."
          control={
            <div className="row row-wrap" style={{ gap: 8 }}>
              {ACCENT_PRESETS.map((c) => {
                const isSelected = accent.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.hex}
                    type="button"
                    className="cd-settings-btn secondary"
                    style={{
                      borderColor: isSelected ? 'var(--accent, #2563eb)' : undefined,
                      background: isSelected ? 'var(--raised, #161922)' : undefined,
                      padding: '0 10px',
                    }}
                    onClick={() => {
                      patch({ accent: c.hex });
                      overlay.toast('Accent updated', `${c.name} selected for new documents.`, 'ok');
                    }}
                    aria-label={`Select ${c.name}`}
                  >
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 3,
                        background: c.hex,
                        display: 'inline-block',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    />
                    <span style={{ fontSize: 12.5 }}>{c.name}</span>
                  </button>
                );
              })}
            </div>
          }
        />

        <SettingsRow
          label="Ambient wallpaper"
          sub="Control workspace wallpaper behind translucent sidebars and command overlays."
          control={
            <div className="row" style={{ gap: 8 }}>
              <button
                type="button"
                className={`cd-settings-btn ${background === 'none' ? 'primary' : 'secondary'}`}
                onClick={() => {
                  patch({ background: 'none' });
                  overlay.toast('Wallpaper updated', 'Solid desktop background.', 'default');
                }}
              >
                Solid (Default)
              </button>
              <button
                type="button"
                className={`cd-settings-btn ${background === 'image' ? 'primary' : 'secondary'}`}
                onClick={() => {
                  patch({ background: 'image' });
                  overlay.toast('Wallpaper updated', 'Environmental wallpaper enabled.', 'default');
                }}
              >
                Environmental
              </button>
            </div>
          }
        />
      </SettingsSection>
    </SettingsPage>
  );
}
