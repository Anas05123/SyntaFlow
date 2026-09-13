/**
 * UI primitives.
 *
 * Small, unopinionated components that carry the design system. Every button is
 * a solid fill or a plain surface — there are no bright-outline buttons, per the
 * Foundations rules.
 */

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

import { chipSpec, type Tone } from '../domain/status';
import { Icon, type IconName } from './Icon';

/* -------------------------------------------------------------------------- */
/* Chip                                                                        */
/* -------------------------------------------------------------------------- */

export function Chip({ state, label }: { state: string; label?: string }) {
  const spec = chipSpec(state, label);
  return (
    <span className={`chip tone-${spec.tone}`}>
      {spec.dot ? <span className="dot" /> : null}
      {spec.label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Buttons                                                                     */
/* -------------------------------------------------------------------------- */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  icon?: IconName;
  iconRight?: IconName;
  children?: ReactNode;
}

export function Button({
  variant = 'secondary', size = 'md', block, icon, iconRight, children, className, ...rest
}: ButtonProps) {
  const classes = [
    'btn', `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '',
    block ? 'btn-block' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <button type="button" className={classes} {...rest}>
      {icon ? <Icon name={icon} size={size === 'sm' ? 14 : 15} /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size={size === 'sm' ? 14 : 15} /> : null}
    </button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  label: string;
  bordered?: boolean;
}

export function IconButton({ icon, label, bordered, className, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      className={['icon-btn', bordered ? 'bordered' : '', className ?? ''].filter(Boolean).join(' ')}
      aria-label={label}
      title={label}
      {...rest}
    >
      <Icon name={icon} size={16} />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Cards                                                                       */
/* -------------------------------------------------------------------------- */

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={['card', className ?? ''].filter(Boolean).join(' ')}>{children}</section>;
}

export function CardHead({
  title, desc, action, children,
}: { title?: string; desc?: string; action?: ReactNode; children?: ReactNode }) {
  return (
    <div className="card-head">
      <div className="card-head-text">
        {title ? <div className="card-title">{title}</div> : null}
        {desc ? <div className="card-desc">{desc}</div> : null}
        {children}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ children, flush }: { children: ReactNode; flush?: boolean }) {
  return <div className={flush ? 'card-body flush' : 'card-body'}>{children}</div>;
}

export function CardFoot({ children }: { children: ReactNode }) {
  return <div className="card-foot">{children}</div>;
}

/* -------------------------------------------------------------------------- */
/* Page header                                                                 */
/* -------------------------------------------------------------------------- */

export function PageHead({
  eyebrow, title, sub, actions,
}: { eyebrow?: string; title: string; sub?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="page-head">
      <div className="page-head-text">
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h1>{title}</h1>
        {sub ? <p className="page-sub">{sub}</p> : null}
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Metric                                                                      */
/* -------------------------------------------------------------------------- */

export function Metric({
  label, value, foot, tone,
}: { label: string; value: ReactNode; foot?: string; tone?: 'risk' | 'waiting' }) {
  return (
    <div className={['metric', tone ? `is-${tone}` : ''].filter(Boolean).join(' ')}>
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value}</span>
      {foot ? <span className="metric-foot">{foot}</span> : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Progress                                                                    */
/* -------------------------------------------------------------------------- */

export function Progress({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const complete = total > 0 && done === total;
  return (
    <div className="progress">
      <div className="progress-track">
        <div className={complete ? 'progress-fill ok' : 'progress-fill'} style={{ width: `${pct}%` }} />
      </div>
      <span className="progress-label">{done} / {total}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Banner                                                                      */
/* -------------------------------------------------------------------------- */

export function Banner({
  tone, title, sub, action,
}: { tone?: 'ok' | 'warn' | 'bad'; title: ReactNode; sub?: ReactNode; action?: ReactNode }) {
  return (
    <div className={['banner', tone ?? ''].filter(Boolean).join(' ')}>
      <div className="banner-text">
        <div>{title}</div>
        {sub ? <div className="banner-sub">{sub}</div> : null}
      </div>
      {action}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty / error states                                                        */
/* -------------------------------------------------------------------------- */

export function EmptyState({
  icon = 'file', title, text, tone, primary, secondary,
}: {
  icon?: IconName;
  title: string;
  text?: ReactNode;
  tone?: 'error' | 'blocked';
  primary?: ReactNode;
  secondary?: ReactNode;
}) {
  return (
    <div className={['state', tone ?? ''].filter(Boolean).join(' ')}>
      <span className="state-icon"><Icon name={icon} size={20} /></span>
      <div className="state-title">{title}</div>
      {text ? <p className="state-text">{text}</p> : null}
      {primary || secondary ? (
        <div className="state-actions">
          {secondary}
          {primary}
        </div>
      ) : null}
    </div>
  );
}

export function SkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card">
      <div className="card-body flush">
        {Array.from({ length: rows }, (_, i) => (
          <div className="skel-row" key={i}>
            <div className="skeleton" style={{ width: 22, height: 22, borderRadius: 5 }} />
            <div className="skeleton" style={{ width: '26%' }} />
            <div className="skeleton" style={{ width: '14%' }} />
            <div className="skeleton grow" />
            <div className="skeleton" style={{ width: 70 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Fields                                                                      */
/* -------------------------------------------------------------------------- */

interface FieldWrapProps {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}

export function Field({ label, hint, error, htmlFor, children }: FieldWrapProps) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={htmlFor}>
        {label}
        {hint ? <span className="field-hint"> {hint}</span> : null}
      </label>
      {children}
      {error ? <span className="field-error">{error}</span> : null}
    </div>
  );
}

export function TextInput({ invalid, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return <input className={['input', invalid ? 'invalid' : '', className ?? ''].filter(Boolean).join(' ')} {...rest} />;
}

export function TextArea({ invalid, className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return <textarea className={['textarea', invalid ? 'invalid' : '', className ?? ''].filter(Boolean).join(' ')} {...rest} />;
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={['select', className ?? ''].filter(Boolean).join(' ')} {...rest}>
      {children}
    </select>
  );
}

export function Check({ label, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode }) {
  return (
    <label className="check">
      <input type="checkbox" {...rest} />
      <span className="check-text">{label}</span>
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/* Segmented control and tabs                                                  */
/* -------------------------------------------------------------------------- */

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

export function Segmented<T extends string>({
  options, value, onChange, ariaLabel,
}: { options: SegmentOption<T>[]; value: T; onChange: (v: T) => void; ariaLabel: string }) {
  return (
    <div className="segmented" role="tablist" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
          {typeof o.count === 'number' ? <span className="tab-count">{o.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

export function TabLink({
  href, label, count, selected, onClick,
}: { href?: string; label: string; count?: number; selected: boolean; onClick?: () => void }) {
  const content = (
    <>
      {label}
      {typeof count === 'number' ? <span className="tab-count">{count}</span> : null}
    </>
  );

  if (href) {
    return (
      <a className="tab" href={href} role="tab" aria-selected={selected}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className="tab" role="tab" aria-selected={selected} onClick={onClick}>
      {content}
    </button>
  );
}

export function Tabs({ children }: { children: ReactNode }) {
  return <div className="tabs" role="tablist">{children}</div>;
}

/* -------------------------------------------------------------------------- */
/* Definition rows                                                             */
/* -------------------------------------------------------------------------- */

export function Defs({ children }: { children: ReactNode }) {
  return <div className="defs">{children}</div>;
}

export function Def({ k, children }: { k: string; children: ReactNode }) {
  return (
    <div className="def">
      <span className="def-key">{k}</span>
      <span className="def-val">{children}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Ticks and save state                                                        */
/* -------------------------------------------------------------------------- */

export function Tick({
  checked, onToggle, label,
}: { checked: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      className="tick"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
    >
      {checked ? <Icon name="check" size={12} /> : null}
    </button>
  );
}

export type SaveState = 'saved' | 'dirty' | 'saving' | 'failed';

export function SaveStateIndicator({ state }: { state: SaveState }) {
  const label: Record<SaveState, string> = {
    saved: 'All changes saved',
    dirty: 'Unsaved changes',
    saving: 'Saving…',
    failed: 'Save failed — your text is kept',
  };
  return (
    <span className={`save-state ${state}`}>
      <span className="dot" />
      {label[state]}
    </span>
  );
}

/** A labelled tone for inline emphasis on due dates. */
export function Tone({ tone, children }: { tone: Tone; children: ReactNode }) {
  const cls = tone === 'risk' ? 'mark-risk' : tone === 'waiting' ? 'mark-wait' : tone === 'active' ? 'mark-ok' : '';
  return cls ? <span className={cls}>{children}</span> : <>{children}</>;
}
