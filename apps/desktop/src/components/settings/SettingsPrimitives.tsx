/**
 * Syntaflow Settings UI Primitives.
 * Reusable layout building blocks for professional desktop settings.
 */

import { type ReactNode } from 'react';
import { Icon, type IconName } from '../../ui/Icon';

/* -------------------------------------------------------------------------- */
/* Page & Section Primitives                                                  */
/* -------------------------------------------------------------------------- */

export interface SettingsPageProps {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function SettingsPage({ title, description, actions, children }: SettingsPageProps) {
  return (
    <div className="cd-settings-pane">
      <header className="cd-settings-page-head">
        <div>
          <h1 className="cd-settings-page-title">{title}</h1>
          <p className="cd-settings-page-desc">{description}</p>
        </div>
        {actions ? <div className="cd-settings-page-actions">{actions}</div> : null}
      </header>
      {children}
    </div>
  );
}

export interface SettingsSectionProps {
  title: string;
  description?: string;
  badge?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}

export function SettingsSection({ title, description, badge, action, children }: SettingsSectionProps) {
  return (
    <section className="cd-settings-section">
      <div className="cd-settings-section-head">
        <div>
          <h2 className="cd-settings-section-title">
            <span>{title}</span>
            {badge}
          </h2>
          {description ? <p className="cd-settings-section-desc">{description}</p> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      <div>{children}</div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Row Primitives                                                             */
/* -------------------------------------------------------------------------- */

export interface SettingsRowProps {
  label: string;
  sub?: ReactNode;
  htmlFor?: string;
  control?: ReactNode;
  stacked?: boolean;
  children?: ReactNode;
}

export function SettingsRow({ label, sub, htmlFor, control, stacked, children }: SettingsRowProps) {
  return (
    <div className={`cd-settings-row ${stacked ? 'cd-settings-row-stacked' : ''}`}>
      <div className="cd-settings-row-main">
        {htmlFor ? (
          <label htmlFor={htmlFor} className="cd-settings-row-label">
            {label}
          </label>
        ) : (
          <div className="cd-settings-row-label">{label}</div>
        )}
        {sub ? <div className="cd-settings-row-sub">{sub}</div> : null}
        {children ? <div className="mt-12">{children}</div> : null}
      </div>
      {control ? <div className="cd-settings-row-control">{control}</div> : null}
    </div>
  );
}

export interface SettingsToggleRowProps {
  id: string;
  label: string;
  sub?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function SettingsToggleRow({ id, label, sub, checked, onChange, disabled }: SettingsToggleRowProps) {
  return (
    <div className="cd-settings-row">
      <div className="cd-settings-row-main">
        <label htmlFor={id} className="cd-settings-row-label" style={{ cursor: disabled ? 'default' : 'pointer' }}>
          {label}
        </label>
        {sub ? <div className="cd-settings-row-sub">{sub}</div> : null}
      </div>
      <div className="cd-settings-row-control">
        <label className="cd-settings-switch">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            aria-label={label}
          />
          <span className="cd-settings-slider" />
        </label>
      </div>
    </div>
  );
}

export interface SettingsActionRowProps {
  label: string;
  sub?: ReactNode;
  actionLabel: string;
  onAction: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: IconName;
  disabled?: boolean;
}

export function SettingsActionRow({
  label,
  sub,
  actionLabel,
  onAction,
  variant = 'secondary',
  icon,
  disabled,
}: SettingsActionRowProps) {
  return (
    <div className="cd-settings-row">
      <div className="cd-settings-row-main">
        <div className="cd-settings-row-label">{label}</div>
        {sub ? <div className="cd-settings-row-sub">{sub}</div> : null}
      </div>
      <div className="cd-settings-row-control">
        <button
          type="button"
          className={`cd-settings-btn ${variant}`}
          onClick={onAction}
          disabled={disabled}
        >
          {icon ? <Icon name={icon} size={15} /> : null}
          <span>{actionLabel}</span>
        </button>
      </div>
    </div>
  );
}

export interface SettingsFieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function SettingsField({ label, htmlFor, hint, error, required, children }: SettingsFieldProps) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={htmlFor}>
        {label}
        {required ? <span style={{ color: 'var(--accent, #3b82f6)', marginLeft: 4 }}>*</span> : null}
      </label>
      {children}
      {hint && !error ? <div className="field-hint">{hint}</div> : null}
      {error ? <div className="field-error">{error}</div> : null}
    </div>
  );
}

export function SettingsCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={className ? `cd-settings-card ${className}` : 'cd-settings-card'}
      style={{
        background: 'var(--raised, #13161c)',
        border: '1px solid var(--divider, rgba(255, 255, 255, 0.08))',
        borderRadius: 'var(--r-control, 8px)',
        padding: '18px 20px',
      }}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Integration Card Primitive                                                 */
/* -------------------------------------------------------------------------- */

export interface IntegrationCardProps {
  title: string;
  category: string;
  description: string;
  icon?: IconName;
  status: 'connected' | 'configured' | 'coming-soon';
  onAction?: () => void;
  actionLabel?: string;
}

export function IntegrationCard({
  title,
  category,
  description,
  icon = 'grid',
  status,
  onAction,
  actionLabel,
}: IntegrationCardProps) {
  const isComingSoon = status === 'coming-soon';

  return (
    <div className="cd-integration-card">
      <div className="cd-integration-card-head">
        <div className="cd-integration-card-meta">
          <div className="cd-integration-card-cat">{category}</div>
          <h3 className="cd-integration-card-title">{title}</h3>
        </div>
        <div style={{ color: 'var(--muted, #64748b)' }}>
          <Icon name={icon} size={18} />
        </div>
      </div>

      <p className="cd-integration-card-desc">{description}</p>

      <div className="cd-integration-card-foot">
        <div className={`cd-integration-status ${status}`}>
          {status === 'connected' ? (
            <>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
              <span>Connected</span>
            </>
          ) : status === 'configured' ? (
            <>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#60a5fa' }} />
              <span>Configured</span>
            </>
          ) : (
            <span>Coming soon</span>
          )}
        </div>

        {!isComingSoon ? (
          <button
            type="button"
            className="cd-settings-btn secondary"
            style={{ height: 28, fontSize: 11.5, padding: '0 10px' }}
            onClick={onAction}
          >
            {actionLabel || (status === 'connected' ? 'Manage' : 'Configure')}
          </button>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Danger Zone Primitive                                                      */
/* -------------------------------------------------------------------------- */

export interface DangerZoneProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export function DangerZone({
  title = 'Danger Zone',
  description = 'Irreversible actions that affect your local workspace database and cached state.',
  children,
}: DangerZoneProps) {
  return (
    <div className="cd-settings-danger-zone">
      <div className="cd-settings-danger-head">
        <Icon name="alert" size={18} />
        <div>
          <h3 className="cd-settings-danger-title">{title}</h3>
          <p className="cd-settings-danger-desc">{description}</p>
        </div>
      </div>
      <div className="cd-settings-danger-body">{children}</div>
    </div>
  );
}

export function DangerRow({
  title,
  desc,
  actionLabel,
  onAction,
}: {
  title: string;
  desc: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="cd-settings-danger-row">
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text, #fff)' }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--muted, #94a3b8)', marginTop: 2 }}>{desc}</div>
      </div>
      <button
        type="button"
        className="cd-settings-btn danger"
        style={{ height: 32, fontSize: 12 }}
        onClick={onAction}
      >
        <Icon name="trash" size={14} />
        <span>{actionLabel}</span>
      </button>
    </div>
  );
}
