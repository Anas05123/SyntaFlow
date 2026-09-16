/**
 * Syntaflow Settings Shell.
 * Dedicated workspace shell with clean single top bar, window controls, and 220px vertical navigation.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Icon, type IconName } from '../../ui/Icon';
import { WindowControls } from '../../ui/WindowChrome';

export type SettingsSectionId =
  | 'general'
  | 'appearance'
  | 'notifications'
  | 'workspace'
  | 'client-access'
  | 'integrations'
  | 'ai'
  | 'security'
  | 'account'
  | 'advanced';

export interface NavItemConfig {
  id: SettingsSectionId;
  label: string;
  icon: IconName;
  badge?: string | number;
  badgeType?: 'accent' | 'ok' | 'default';
  keywords: string[];
}

export interface NavGroupConfig {
  group: string;
  items: NavItemConfig[];
}

export const SETTINGS_NAV_GROUPS: NavGroupConfig[] = [
  {
    group: 'GENERAL',
    items: [
      {
        id: 'general',
        label: 'General',
        icon: 'settings',
        keywords: ['language', 'locale', 'date', 'time', 'format', 'startup', 'tray', 'window', 'defaults'],
      },
      {
        id: 'appearance',
        label: 'Appearance',
        icon: 'sun',
        keywords: ['theme', 'dark', 'light', 'system', 'density', 'compact', 'comfortable', 'motion', 'accent', 'wallpaper'],
      },
      {
        id: 'notifications',
        label: 'Notifications',
        icon: 'bell',
        keywords: ['alerts', 'projects', 'tasks', 'reviews', 'approvals', 'email', 'digest', 'milestones'],
      },
    ],
  },
  {
    group: 'WORKSPACE',
    items: [
      {
        id: 'workspace',
        label: 'Workspace',
        icon: 'building',
        keywords: ['workspace', 'organization', 'name', 'timezone', 'services', 'fee items', 'proposals', 'defaults'],
      },
      {
        id: 'client-access',
        label: 'Client Access',
        icon: 'users',
        keywords: ['grants', 'permissions', 'guest', 'reviewer', 'viewer', 'share', 'links', 'expiry', 'revoke'],
      },
    ],
  },
  {
    group: 'SYSTEM',
    items: [
      {
        id: 'integrations',
        label: 'Integrations',
        icon: 'grid',
        keywords: ['gmail', 'google calendar', 'google drive', 'github', 'slack', 'notion', 'figma', 'outlook', 'dropbox'],
      },
      {
        id: 'ai',
        label: 'AI & Models',
        icon: 'sparkle',
        keywords: ['ollama', 'local ai', 'models', 'llama', 'qwen', 'mistral', 'prompt', 'task router'],
      },
      {
        id: 'security',
        label: 'Security',
        icon: 'shield',
        keywords: ['authentication', 'session', 'storage', 'contextisolation', 'sandbox', 'permissions', 'password'],
      },
    ],
  },
  {
    group: 'ACCOUNT',
    items: [
      {
        id: 'account',
        label: 'Account',
        icon: 'user',
        keywords: ['profile', 'owner', 'email', 'name', 'password', 'sign out', 'session'],
      },
      {
        id: 'advanced',
        label: 'Advanced',
        icon: 'dots',
        keywords: ['danger zone', 'database', 'sqlite', 'export data', 'reset demo', 'purge cache', 'sync', 'ics', 'csv'],
      },
    ],
  },
];

/* Search index entries */
interface SearchIndexEntry {
  section: SettingsSectionId;
  category: string;
  title: string;
  desc: string;
  keywords: string[];
}

const SEARCH_INDEX: SearchIndexEntry[] = [
  { section: 'general', category: 'General', title: 'Language & Locale', desc: 'Display language and regional options', keywords: ['language', 'english', 'region', 'locale'] },
  { section: 'general', category: 'General', title: 'Date & Time Formatting', desc: 'Configure short dates, relative dates, and 24-hour clock', keywords: ['time', 'date', '24h', 'clock', 'iso'] },
  { section: 'general', category: 'General', title: 'Default Startup View', desc: 'Screen shown when opening Syntaflow', keywords: ['startup', 'home', 'tasks', 'projects'] },
  { section: 'general', category: 'General', title: 'Window & System Tray', desc: 'Minimize to tray on window close', keywords: ['tray', 'window', 'close'] },

  { section: 'appearance', category: 'Appearance', title: 'Interface Theme', desc: 'Dark, Light, or System sync mode', keywords: ['dark', 'light', 'theme', 'color'] },
  { section: 'appearance', category: 'Appearance', title: 'UI Density', desc: 'Comfortable or Compact layout mode', keywords: ['density', 'compact', 'comfortable', 'spacing'] },
  { section: 'appearance', category: 'Appearance', title: 'Motion & Animations', desc: 'Full animations or reduced motion', keywords: ['motion', 'reduced motion', 'animations'] },
  { section: 'appearance', category: 'Appearance', title: 'Document Accent Color', desc: 'Palette used on proposals and presentation covers', keywords: ['accent', 'cobalt', 'green', 'amber', 'graphite'] },

  { section: 'notifications', category: 'Notifications', title: 'Review & Approval Alerts', desc: 'Notifications for review decisions and revisions', keywords: ['reviews', 'approval', 'changes requested'] },
  { section: 'notifications', category: 'Notifications', title: 'Task Reminders', desc: 'Alerts for overdue tasks and blocker assignments', keywords: ['tasks', 'overdue', 'blocker'] },
  { section: 'notifications', category: 'Notifications', title: 'Client & Delivery Activity', desc: 'Notifications when client downloads packages', keywords: ['client', 'delivery', 'downloads'] },

  { section: 'workspace', category: 'Workspace', title: 'Workspace Identity', desc: 'Organization name, timezone, and business registry', keywords: ['workspace', 'organization', 'name', 'timezone'] },
  { section: 'workspace', category: 'Workspace', title: 'Services & Default Fee Items', desc: 'Catalog pre-filling client proposals', keywords: ['services', 'fees', 'rates', 'pricing'] },
  { section: 'workspace', category: 'Workspace', title: 'Proposal Cover Defaults', desc: 'Include fee table, assumptions, and payment terms', keywords: ['proposal', 'fee table', 'assumptions', 'terms'] },

  { section: 'client-access', category: 'Client Access', title: 'Access Grants Directory', desc: 'Manage scoped guest reviewer and viewer grants', keywords: ['grants', 'client access', 'guests', 'permissions'] },
  { section: 'client-access', category: 'Client Access', title: 'Invite Recipient', desc: 'Create a new object-scoped grant', keywords: ['invite', 'share', 'grant'] },

  { section: 'integrations', category: 'Integrations', title: 'Integrations Marketplace', desc: 'Connect third-party tools (Gmail, Calendar, GitHub, Figma, Slack, Notion)', keywords: ['integrations', 'gmail', 'calendar', 'github', 'slack', 'figma', 'notion', 'drive', 'outlook', 'dropbox'] },

  { section: 'ai', category: 'AI & Models', title: 'Local AI Engine (Ollama)', desc: 'Configure local endpoint, test connection, and select model', keywords: ['ollama', 'local ai', 'endpoint', 'llama', 'qwen'] },
  { section: 'ai', category: 'AI & Models', title: 'Local Privacy Guarantee', desc: 'Offline-first zero telemetry execution verification', keywords: ['privacy', 'offline', 'telemetry', 'data'] },

  { section: 'security', category: 'Security', title: 'Authentication & Credentials', desc: 'Local password security and owner session', keywords: ['password', 'auth', 'credentials'] },
  { section: 'security', category: 'Security', title: 'Active Session & Device', desc: 'Inspect current device login and sign out', keywords: ['session', 'device', 'sign out'] },
  { section: 'security', category: 'Security', title: 'Runtime Isolation & Sandboxing', desc: 'Electron contextIsolation and typed IPC boundaries', keywords: ['sandbox', 'contextisolation', 'electron', 'security'] },

  { section: 'account', category: 'Account', title: 'Owner Profile', desc: 'Full name, email address, and personal avatar', keywords: ['profile', 'name', 'email', 'owner'] },
  { section: 'account', category: 'Account', title: 'Sign Out', desc: 'Terminate active local session safely', keywords: ['sign out', 'logout'] },

  { section: 'advanced', category: 'Advanced', title: 'Workstation Storage & System Sync', desc: 'Local filesystem sync, .ics calendar export, accounting CSV export', keywords: ['sync', 'calendar', 'ics', 'csv', 'accounting', 'filesystem'] },
  { section: 'advanced', category: 'Advanced', title: 'Database Diagnostics', desc: 'SQLite canonical store location and record counts', keywords: ['database', 'sqlite', 'records', 'storage'] },
  { section: 'advanced', category: 'Advanced', title: 'Data Export Archive', desc: 'Export full JSON backup of workspace records', keywords: ['export', 'backup', 'json'] },
  { section: 'advanced', category: 'Advanced', title: 'Danger Zone', desc: 'Reset demo data or purge local UI cache', keywords: ['reset', 'danger', 'purge', 'cache'] },
];

/* -------------------------------------------------------------------------- */
/* Settings Search Component                                                   */
/* -------------------------------------------------------------------------- */

function SettingsSearch({ onSelect }: { onSelect: (section: SettingsSectionId) => void }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SEARCH_INDEX.filter((entry) => {
      return (
        entry.title.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q) ||
        entry.desc.toLowerCase().includes(q) ||
        entry.keywords.some((k) => k.includes(q))
      );
    }).slice(0, 7);
  }, [query]);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Universal Escape key behavior */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div className="cd-settings-search-wrap" ref={wrapRef}>
      <span className="cd-settings-search-icon" aria-hidden="true">
        <Icon name="search" size={14} />
      </span>
      <input
        type="text"
        className="cd-settings-search-input"
        placeholder="Search settings..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (query.trim()) setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        aria-label="Search settings"
      />
      {query ? (
        <button
          type="button"
          className="cd-settings-search-clear"
          onClick={() => {
            setQuery('');
            setIsOpen(false);
          }}
          aria-label="Clear search"
        >
          <Icon name="close" size={12} />
        </button>
      ) : null}

      {isOpen && query.trim() ? (
        <div className="cd-settings-search-results" role="listbox">
          {results.length > 0 ? (
            results.map((r, idx) => (
              <button
                key={`${r.section}-${idx}`}
                type="button"
                className="cd-settings-search-result-item"
                onClick={() => {
                  onSelect(r.section);
                  setIsOpen(false);
                  setQuery('');
                }}
              >
                <span className="cd-settings-search-result-category">{r.category}</span>
                <span className="cd-settings-search-result-title">{r.title}</span>
                <span className="cd-settings-search-result-desc">{r.desc}</span>
              </button>
            ))
          ) : (
            <div className="cd-settings-search-empty">No settings found for "{query}"</div>
          )}
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Settings Shell Component                                                   */
/* -------------------------------------------------------------------------- */

export interface SettingsShellProps {
  activeSection: SettingsSectionId;
  onSelectSection: (section: SettingsSectionId) => void;
  onBack: () => void;
  grantsCount?: number;
  children: React.ReactNode;
}

export function SettingsShell({
  activeSection,
  onSelectSection,
  onBack,
  grantsCount = 0,
  children,
}: SettingsShellProps) {
  const activeLabel = useMemo(() => {
    for (const group of SETTINGS_NAV_GROUPS) {
      const match = group.items.find((it) => it.id === activeSection);
      if (match) return match.label;
    }
    return 'General';
  }, [activeSection]);

  return (
    <div className="cd-settings-workspace">
      {/* Top Header Bar */}
      <header className="cd-settings-header">
        <div className="cd-settings-header-left">
          <button
            type="button"
            className="cd-settings-back-btn"
            onClick={onBack}
            title="Return to workspace"
            aria-label="Back to workspace"
          >
            <Icon name="arrowLeft" size={14} />
            <span>Back</span>
          </button>

          <div className="cd-settings-title-group">
            <span className="cd-settings-title">Settings</span>
            {activeLabel !== 'General' ? (
              <>
                <span className="cd-settings-title-sep">/</span>
                <span className="cd-settings-subtitle">{activeLabel}</span>
              </>
            ) : null}
          </div>
        </div>

        <div className="cd-settings-header-right">
          <SettingsSearch onSelect={onSelectSection} />
          <WindowControls />
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <div className="cd-settings-body">
        {/* Left Vertical Navigation */}
        <nav className="cd-settings-nav" aria-label="Settings navigation">
          {SETTINGS_NAV_GROUPS.map((grp) => (
            <div className="cd-settings-nav-group" key={grp.group}>
              <div className="cd-settings-nav-label">{grp.group}</div>
              {grp.items.map((item) => {
                const isActive = activeSection === item.id;
                const dynamicBadge = item.id === 'client-access' && grantsCount > 0 ? grantsCount : undefined;

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`cd-settings-nav-item ${isActive ? 'is-active' : ''}`}
                    onClick={() => onSelectSection(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <div className="cd-settings-nav-item-left">
                      <Icon name={item.icon} size={15} />
                      <span>{item.label}</span>
                    </div>

                    {dynamicBadge ? (
                      <span className="cd-settings-nav-badge">
                        {dynamicBadge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Right Scrollable Content Pane */}
        <main className="cd-settings-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
