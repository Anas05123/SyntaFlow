/**
 * Application shell.
 *
 * Four structural regions: left navigation rail, top command bar, main
 * workspace, and the account / create popovers that hang off the first two.
 * The shell owns the viewport height so only the work region scrolls.
 *
 * Two tracks of progressive disclosure:
 *   - the rail brand is the account/workspace trigger
 *   - the command bar's Create control opens the four creation actions
 * Both are popovers over the same surface, so nothing that used to sit
 * permanently in the chrome needs to any more.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';

import { useStore } from '../state/store';
import { navigate, projectUrl, documentUrl, useHistory, type RouteInfo } from './router';
import { Icon, type IconName } from '../ui/Icon';
import { BrandMark, BrandLogo } from '../ui/BrandMark';
import { WindowControls } from '../ui/WindowChrome';
import { Button, IconButton } from '../ui/primitives';
import { Popover, type AnchorRect } from '../ui/Popover';
import { AccountMenu } from '../components/AccountMenu';
import { CreateMenu } from '../components/CreateMenu';
import { AppearancePopover } from '../components/AppearancePopover';
import { TeamsMenu } from '../components/TeamsMenu';
import { useAppearance } from '../ui/useAppearance';

/* -------------------------------------------------------------------------- */
/* Navigation model                                                            */
/* -------------------------------------------------------------------------- */

interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: IconName;
  badge?: 'tasks' | 'clients' | 'projects' | 'activity';
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

/**
 * Navigation structure (Section 14: Sidebar):
 * HOME: Home
 * WORK: Clients, Projects, Tasks, Documents
 * RECORD: Activity, Archive
 */
const NAV: NavGroup[] = [
  {
    group: 'HOME',
    items: [
      { id: 'home', href: '#/home', label: 'Home', icon: 'home' },
    ],
  },
  {
    group: 'WORK',
    items: [
      { id: 'clients', href: '#/clients', label: 'Clients', icon: 'clients' },
      { id: 'projects', href: '#/projects', label: 'Projects', icon: 'projects' },
      { id: 'tasks', href: '#/tasks', label: 'Tasks', icon: 'tasks', badge: 'tasks' },
      { id: 'documents', href: '#/documents', label: 'Documents', icon: 'documents' },
    ],
  },
  {
    group: 'RECORD',
    items: [
      { id: 'activity', href: '#/activity', label: 'Activity', icon: 'activity', badge: 'activity' },
      { id: 'archive', href: '#/archive', label: 'Archive', icon: 'archive' },
    ],
  },
];

/** Route roots that make up the owner workspace. */
export const OWNER_ROOTS = new Set([
  'home', 'clients', 'projects', 'documents', 'tasks', 'activity', 'archive',
  'settings', 'new-project', 'share', 'work', 'first-run', 'preview',
]);

/* -------------------------------------------------------------------------- */
/* Rail                                                                        */
/* -------------------------------------------------------------------------- */

function RailBadge({ kind }: { kind: NonNullable<NavItem['badge']> }) {
  const { derived } = useStore();

  if (kind === 'tasks') {
    const overdue = derived.overdueTasks.length;
    if (overdue > 0) return <span className="rail-count alert">{overdue}</span>;
    return derived.openTasks.length > 0 ? <span className="rail-count">{derived.openTasks.length}</span> : null;
  }
  if (kind === 'clients') {
    return derived.activeClientCount > 0 ? <span className="rail-count">{derived.activeClientCount}</span> : null;
  }
  if (kind === 'projects') {
    return derived.activeProjectCount > 0 ? <span className="rail-count">{derived.activeProjectCount}</span> : null;
  }
  if (kind === 'activity') {
    return derived.unreadActivity > 0 ? <span className="rail-count">{derived.unreadActivity}</span> : null;
  }
  return null;
}

function Rail({
  activeId,
  collapsed,
  onToggleAccount,
  onToggleTeam,
  ownerRef,
  brandRef,
  teamRef,
  onToggleRail,
  isAccountOpen,
  isTeamOpen,
  accountSource,
}: {
  activeId: string | null;
  collapsed: boolean;
  onToggleAccount: (source: 'brand' | 'owner') => void;
  onToggleTeam: () => void;
  ownerRef: React.RefObject<HTMLButtonElement | null>;
  brandRef: React.RefObject<HTMLButtonElement | null>;
  teamRef: React.RefObject<HTMLButtonElement | null>;
  onToggleRail: () => void;
  isAccountOpen: boolean;
  isTeamOpen: boolean;
  accountSource: 'brand' | 'owner' | null;
}) {
  const { state } = useStore();

  return (
    <aside className="rail">
      {/* Top Header: Syntaflow Brand (with App Menu) & Sidebar Toggle */}
      <div className="rail-head">
        {collapsed ? (
          <button
            type="button"
            className="rail-brand-trigger is-collapsed"
            onClick={onToggleRail}
            title="Expand sidebar (hover to reveal)"
            aria-label="Expand sidebar"
          >
            <span className="rail-brand-icon-normal">
              <BrandMark size={24} variant="wbg" className="rail-brand-collapsed" />
            </span>
            <span className="rail-brand-icon-hover" aria-hidden="true">
              <Icon name="sidebar" size={17} />
            </span>
          </button>
        ) : (
          <>
            <button
              type="button"
              ref={brandRef}
              className={`rail-brand-trigger ${isAccountOpen && accountSource === 'brand' ? 'is-active' : ''}`}
              onClick={() => onToggleAccount('brand')}
              title="Syntaflow — Workspace & Identity"
              aria-expanded={isAccountOpen && accountSource === 'brand'}
            >
              <BrandLogo height={30} className="rail-brand-logo" />
              <Icon name="chevronDown" size={13} className="rail-brand-chevron" />
            </button>

            <button
              type="button"
              className="rail-toggle-btn"
              onClick={onToggleRail}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <Icon name="sidebar" size={16} />
            </button>
          </>
        )}
      </div>

      {/* Figma-Style Teams Switcher (Northlight Studio) */}
      <div className="rail-team-wrap">
        <button
          type="button"
          ref={teamRef}
          className={`rail-team-btn ${isTeamOpen ? 'is-active' : ''}`}
          onClick={onToggleTeam}
          title={`Team: ${state.workspace.name} (Click to switch or invite)`}
          aria-expanded={isTeamOpen}
        >
          <span className="rail-team-avatar">
            {state.workspace.name.charAt(0).toUpperCase()}
          </span>
          <span className="rail-team-info">
            <span className="rail-team-name">{state.workspace.name}</span>
            <span className="rail-team-meta">Pro Team · 3 members</span>
          </span>
          <Icon name="chevronDown" size={13} className="rail-team-chevron" />
        </button>
      </div>

      <nav className="rail-nav" aria-label="Primary">
        {NAV.map((group) => (
          <div key={group.group}>
            <div className="rail-group-label">{group.group}</div>
            {group.items.map((item) => (
              <a
                key={item.id}
                className="rail-item"
                href={item.href}
                aria-current={activeId === item.id ? 'page' : undefined}
                title={collapsed ? item.label : undefined}
              >
                <Icon name={item.icon} size={20} />
                <span className="rail-item-label">{item.label}</span>
                {item.badge ? <RailBadge kind={item.badge} /> : null}
              </a>
            ))}
          </div>
        ))}
      </nav>

      {/* One profile trigger at foot: [avatar AA] Anas Ayari / Owner ⋯ */}
      <div className="rail-foot">
        <button
          type="button"
          ref={ownerRef}
          className={`rail-owner ${isAccountOpen && accountSource === 'owner' ? 'is-active' : ''}`}
          onClick={() => onToggleAccount('owner')}
          title={collapsed ? state.workspace.ownerName : undefined}
          aria-expanded={isAccountOpen && accountSource === 'owner'}
        >
          <span className="avatar">{initialsOf(state.workspace.ownerName)}</span>
          <span className="rail-owner-text">
            <span className="rail-owner-name">{state.workspace.ownerName}</span>
            <span className="rail-owner-role">Owner</span>
          </span>
          <Icon name="dots" size={15} className="rail-owner-dots" />
        </button>
      </div>
    </aside>
  );
}

function initialsOf(name: string): string {
  return name
    .replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();
}

/* -------------------------------------------------------------------------- */
/* Topbar                                                                      */
/* -------------------------------------------------------------------------- */

export interface Crumb {
  label: string;
  href?: string;
}

function Topbar({
  crumbs,
  onOpenSearch,
  onToggleCreate,
  onToggleAppearance,
  createRef,
  appearanceRef,
  isCreateOpen,
  isAppearanceOpen,
}: {
  crumbs: Crumb[] | null;
  onOpenSearch: () => void;
  onToggleCreate: () => void;
  onToggleAppearance: () => void;
  createRef: React.RefObject<HTMLButtonElement | null>;
  appearanceRef: React.RefObject<HTMLButtonElement | null>;
  isCreateOpen: boolean;
  isAppearanceOpen: boolean;
}) {
  const { derived } = useStore();
  const { canGoBack, canGoForward, goBack, goForward } = useHistory();
  const { resolvedTheme } = useAppearance();

  return (
    <header className="topbar">
      {/* Left Control Island: History Navigation */}
      <div className="topbar-island topbar-island-left">
        <div className="topbar-history">
          <button
            type="button"
            className={`topbar-history-btn ${!canGoBack ? 'is-disabled' : ''}`}
            onClick={goBack}
            disabled={!canGoBack}
            title="Navigate Back"
            aria-label="Back"
          >
            <Icon name="arrowLeft" size={14} />
          </button>
          <button
            type="button"
            className={`topbar-history-btn ${!canGoForward ? 'is-disabled' : ''}`}
            onClick={goForward}
            disabled={!canGoForward}
            title="Navigate Forward"
            aria-label="Forward"
          >
            <Icon name="arrowRight" size={14} />
          </button>
        </div>
      </div>

      {/* Center Context Island: Where user is (1-2 levels max) */}
      <div className="topbar-island topbar-island-center">
        {crumbs && crumbs.length > 0 ? (
          <nav className="crumbs" aria-label="Current Context">
            {crumbs.slice(-2).map((c, i, arr) => (
              <span key={`${c.label}-${i}`} style={{ display: 'contents' }}>
                {i > 0 ? <span className="sep">/</span> : null}
                {c.href && i < arr.length - 1 ? (
                  <a href={c.href}>{c.label}</a>
                ) : (
                  <span className="here">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <span className="here">Home</span>
        )}
      </div>

      {/* Right Control Island: [ ⌕ Search Ctrl K ]  [ + Create ]  [ ◐ ]  [ 🔔 ]  — □ ✕ */}
      <div className="topbar-island topbar-island-right">
        <button type="button" className="search-trigger" onClick={onOpenSearch} aria-label="Search workspace">
          <Icon name="search" size={15} />
          <span>Search</span>
          <span className="kbd">Ctrl K</span>
        </button>

        <button
          type="button"
          ref={createRef}
          className={`create-trigger ${isCreateOpen ? 'is-active' : ''}`}
          onClick={onToggleCreate}
          aria-label="Create"
          aria-expanded={isCreateOpen}
        >
          <Icon name="plus" size={15} />
          <span>Create</span>
        </button>

        <button
          type="button"
          ref={appearanceRef}
          className={`topbar-appearance-btn ${isAppearanceOpen ? 'is-active' : ''}`}
          onClick={onToggleAppearance}
          title={`Appearance (${resolvedTheme === 'dark' ? 'Dark' : 'Light'})`}
          aria-label="Appearance & Theme"
          aria-expanded={isAppearanceOpen}
        >
          <Icon name={resolvedTheme === 'light' ? 'sun' : 'moon'} size={15} />
        </button>

        <IconButton
          icon="bell"
          label={`Activity${derived.unreadActivity ? ` (${derived.unreadActivity} unread)` : ''}`}
          bordered={derived.unreadActivity > 0}
          onClick={() => navigate('#/activity')}
        />

        <WindowControls />
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Shell                                                                       */
/* -------------------------------------------------------------------------- */

export function Shell({
  activeId, crumbs, children, flush, onOpenSearch,
}: {
  activeId: string | null;
  crumbs: Crumb[] | null;
  children: ReactNode;
  flush?: boolean;
  onOpenSearch: () => void;
}) {
  const [collapsed, setCollapsed] = useState(
    () => (typeof localStorage !== 'undefined' && localStorage.getItem('coredesk.rail') === 'collapsed')
  );
  const [accountAnchor, setAccountAnchor] = useState<AnchorRect | null>(null);
  const [accountSource, setAccountSource] = useState<'brand' | 'owner' | null>(null);
  const [teamAnchor, setTeamAnchor] = useState<AnchorRect | null>(null);
  const [createAnchor, setCreateAnchor] = useState<AnchorRect | null>(null);
  const [appearanceAnchor, setAppearanceAnchor] = useState<AnchorRect | null>(null);

  const brandRef = useRef<HTMLButtonElement | null>(null);
  const teamRef = useRef<HTMLButtonElement | null>(null);
  const ownerRef = useRef<HTMLButtonElement | null>(null);
  const createRef = useRef<HTMLButtonElement | null>(null);
  const appearanceRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('coredesk.rail', collapsed ? 'collapsed' : 'full');
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  const getRect = (el: HTMLElement | null): AnchorRect | null => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width };
  };

  const closeAll = () => {
    setAccountAnchor(null);
    setAccountSource(null);
    setTeamAnchor(null);
    setCreateAnchor(null);
    setAppearanceAnchor(null);
  };

  const handleToggleAccount = (source: 'brand' | 'owner') => {
    if (accountAnchor && accountSource === source) {
      setAccountAnchor(null);
      setAccountSource(null);
    } else {
      const el = source === 'brand' ? brandRef.current : ownerRef.current;
      const rect = getRect(el);
      if (rect) {
        closeAll();
        setAccountAnchor(rect);
        setAccountSource(source);
      }
    }
  };

  const handleToggleTeam = () => {
    if (teamAnchor) {
      setTeamAnchor(null);
    } else {
      const rect = getRect(teamRef.current);
      if (rect) {
        closeAll();
        setTeamAnchor(rect);
      }
    }
  };

  const handleToggleCreate = () => {
    if (createAnchor) {
      setCreateAnchor(null);
    } else {
      const rect = getRect(createRef.current);
      if (rect) {
        closeAll();
        setCreateAnchor(rect);
      }
    }
  };

  const handleToggleAppearance = () => {
    if (appearanceAnchor) {
      setAppearanceAnchor(null);
    } else {
      const rect = getRect(appearanceRef.current);
      if (rect) {
        closeAll();
        setAppearanceAnchor(rect);
      }
    }
  };

  if (activeId === 'settings') {
    return (
      <div className="shell shell-settings">
        <main className="work-settings">{children}</main>
      </div>
    );
  }

  return (
    <div className="shell" data-rail={collapsed ? 'collapsed' : 'full'}>
      <div className="shell-backdrop" aria-hidden="true">
        <div className="shell-wallpaper" />
        <div className="shell-scrim" />
      </div>
      <Rail
        activeId={activeId}
        collapsed={collapsed}
        onToggleAccount={handleToggleAccount}
        onToggleTeam={handleToggleTeam}
        ownerRef={ownerRef}
        brandRef={brandRef}
        teamRef={teamRef}
        onToggleRail={() => setCollapsed((c) => !c)}
        isAccountOpen={Boolean(accountAnchor)}
        isTeamOpen={Boolean(teamAnchor)}
        accountSource={accountSource}
      />
      <div className="workspace">
        <Topbar
          crumbs={crumbs}
          onOpenSearch={onOpenSearch}
          onToggleCreate={handleToggleCreate}
          onToggleAppearance={handleToggleAppearance}
          createRef={createRef}
          appearanceRef={appearanceRef}
          isCreateOpen={Boolean(createAnchor)}
          isAppearanceOpen={Boolean(appearanceAnchor)}
        />
        <main className={flush ? 'work flush' : 'work'}>{children}</main>
      </div>

      <Popover
        anchor={accountAnchor}
        onClose={() => {
          setAccountAnchor(null);
          setAccountSource(null);
        }}
        returnFocus={accountSource === 'owner' ? ownerRef : brandRef}
        triggerRef={[brandRef, ownerRef]}
        align="start"
        label="Account and workspace"
      >
        <AccountMenu onClose={() => {
          setAccountAnchor(null);
          setAccountSource(null);
        }} />
      </Popover>

      <Popover
        anchor={teamAnchor}
        onClose={() => setTeamAnchor(null)}
        returnFocus={teamRef}
        triggerRef={teamRef}
        align="start"
        label="Teams and workspaces"
      >
        <TeamsMenu onClose={() => setTeamAnchor(null)} />
      </Popover>

      <Popover
        anchor={createAnchor}
        onClose={() => setCreateAnchor(null)}
        returnFocus={createRef}
        triggerRef={createRef}
        align="end"
        label="Create"
      >
        <CreateMenu onClose={() => setCreateAnchor(null)} />
      </Popover>

      <Popover
        anchor={appearanceAnchor}
        onClose={() => setAppearanceAnchor(null)}
        returnFocus={appearanceRef}
        triggerRef={appearanceRef}
        align="end"
        label="Appearance"
      >
        <AppearancePopover onClose={() => setAppearanceAnchor(null)} />
      </Popover>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Guest chrome — a separate, quieter surface                               */
/* -------------------------------------------------------------------------- */

export function GuestBar({ title, sub, initialsText }: { title: string; sub: string; initialsText?: string }) {
  const { state } = useStore();
  return (
    <div className="guest-bar">
      <div className="guest-brand">
        <BrandMark size={28} />
        <div>
          <div className="brand-name">{title}</div>
          <div className="meta">{sub}</div>
        </div>
      </div>
      {initialsText ? <span className="avatar">{initialsText}</span> : <span className="meta">{state.workspace.name}</span>}
    </div>
  );
}

export function GuestShell({ children }: { children: ReactNode }) {
  return <div className="guest">{children}</div>;
}

/** Shared empty-route fallback. */
export function NotFound({ kind, onHome }: { kind: string; onHome: () => void }) {
  return (
    <div className="card">
      <div className="state">
        <span className="state-icon"><Icon name="alert" size={20} /></span>
        <div className="state-title">That {kind} does not exist</div>
        <p className="state-text">
          The record may have been deleted, or the link may be mistyped. Your other work is unaffected.
        </p>
        <div className="state-actions">
          <Button variant="primary" onClick={onHome}>Back to Home</Button>
        </div>
      </div>
    </div>
  );
}

export { projectUrl, documentUrl };
export type { RouteInfo };
