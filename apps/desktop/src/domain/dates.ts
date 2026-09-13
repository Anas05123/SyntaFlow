/**
 * Date helpers.
 *
 * The demo workspace pins "today" so every due-in / overdue figure in the UI is
 * arithmetically true instead of drifting with the wall clock. Set
 * COREDESK_LIVE_DATES to use the real current date.
 */

export const TODAY: Date = new Date('2026-09-10T09:20:00');

function parse(value: string): Date {
  return new Date(value.length <= 10 ? `${value}T00:00:00` : value);
}

/** Whole days from today to the given date. Negative means past due. */
export function daysUntil(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const then = parse(dateStr);
  const base = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
  const target = new Date(then.getFullYear(), then.getMonth(), then.getDate());
  return Math.round((target.getTime() - base.getTime()) / 86_400_000);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  return parse(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatShortDate(value: string | null | undefined): string {
  if (!value) return '—';
  return parse(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function formatTime(value: string | null | undefined): string {
  if (!value) return '';
  return parse(value).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function dueLabel(dateStr: string | null | undefined): string {
  const d = daysUntil(dateStr);
  if (d === null) return 'No date';
  if (d === 0) return 'Due today';
  if (d === 1) return 'Due tomorrow';
  if (d === -1) return '1 day overdue';
  if (d < 0) return `${Math.abs(d)} days overdue`;
  if (d < 7) return `Due in ${d} days`;
  return `Due ${formatDate(dateStr)}`;
}

export function isOverdue(dateStr: string | null | undefined): boolean {
  const d = daysUntil(dateStr);
  return d !== null && d < 0;
}

export function relative(value: string | null | undefined): string {
  if (!value) return '—';
  const d = parse(value);
  const mins = Math.round((TODAY.getTime() - d.getTime()) / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.round(days / 7)}w ago`;
  return formatDate(value);
}

export function initials(name: string): string {
  return name
    .replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s+/i, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();
}

/** ISO string for N days from today, for creating records in the UI. */
export function isoInDays(days: number): string {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function nowIso(): string {
  return TODAY.toISOString();
}
