/**
 * Account & workspace menu.
 *
 * One compact popover that owns everything that previously sat permanently in the
 * sidebar foot: the owner, the workspace, the account and application routes,
 * and the session. Progressive disclosure — the sidebar shows one trigger, and
 * the popover carries the full identity surface.
 */

import { useStore } from '../state/store';
import { navigate } from '../app/router';
import { Icon, type IconName } from '../ui/Icon';
import { initials } from '../domain/dates';
import { authService } from '../app/authService';

interface MenuItem {
  id: string;
  label: string;
  icon: IconName;
  href?: string;
  onSelect?: () => void;
  danger?: boolean;
}

export function AccountMenu({ onClose }: { onClose: () => void }) {
  const { state } = useStore();
  const ws = state.workspace;

  const go = (href: string) => {
    navigate(href);
    onClose();
  };

  const signOut = async () => {
    onClose();
    await authService.signOut();
    navigate('#/auth');
  };

  const profileItems: MenuItem[] = [
    { id: 'profile', label: 'Professional Profile', icon: 'building', href: '#/settings/defaults' },
    { id: 'workspace', label: 'Workspace Settings', icon: 'settings', href: '#/settings/account' },
  ];

  const systemItems: MenuItem[] = [
    { id: 'engine', label: 'Local AI / Engine', icon: 'sparkle', href: '#/settings/account' },
    { id: 'integrations', label: 'Integrations', icon: 'share', href: '#/settings/account' },
  ];

  const appItems: MenuItem[] = [
    { id: 'updates', label: 'Check for Updates', icon: 'refresh', onSelect: () => alert('CoreDesk is up to date (v1.0.0 Local Engine)') },
    { id: 'about', label: 'About CoreDesk', icon: 'info', onSelect: () => alert('CoreDesk — Precision Client Work Workspace\nv1.0.0 Offline-First') },
  ];

  return (
    <div style={{ minWidth: 230 }}>
      {/* Identity: Owner */}
      <div className="cd-menu-identity">
        <span className="avatar">{initials(ws.ownerName)}</span>
        <div className="cd-menu-identity-text">
          <div className="cd-menu-identity-name">{ws.ownerName}</div>
          <div className="cd-menu-identity-role">Owner</div>
        </div>
      </div>

      {/* Workspace & Plan info */}
      <div className="cd-menu-workspace-box">
        <div className="row-between">
          <span className="cd-menu-workspace-title">{ws.name}</span>
          <span className="cd-plan-badge">CoreDesk Pro</span>
        </div>
        <div className="cd-menu-engine-row mt-4">
          <span className="cd-engine-dot" />
          <span>Local Engine · Offline-First</span>
        </div>
      </div>

      <div className="cd-menu-divider" />

      <div className="cd-menu-group">
        {profileItems.map((item) => (
          <button
            type="button"
            role="menuitem"
            key={item.id}
            className="cd-menu-item"
            onClick={() => (item.href ? go(item.href) : item.onSelect?.())}
          >
            <Icon name={item.icon} size={15} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="cd-menu-divider" />

      <div className="cd-menu-group">
        {systemItems.map((item) => (
          <button
            type="button"
            role="menuitem"
            key={item.id}
            className="cd-menu-item"
            onClick={() => (item.href ? go(item.href) : item.onSelect?.())}
          >
            <Icon name={item.icon} size={15} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="cd-menu-divider" />

      <div className="cd-menu-group">
        {appItems.map((item) => (
          <button
            type="button"
            role="menuitem"
            key={item.id}
            className="cd-menu-item"
            onClick={() => (item.href ? go(item.href) : item.onSelect?.())}
          >
            <Icon name={item.icon} size={15} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="cd-menu-divider" />

      <div className="cd-menu-group">
        <button type="button" role="menuitem" className="cd-menu-item is-danger" onClick={signOut}>
          <Icon name="close" size={15} />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="cd-menu-foot">
        CoreDesk v1.0.0 · Local Engine
      </div>
    </div>
  );
}
