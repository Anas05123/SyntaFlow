/**
 * Status vocabulary.
 *
 * One place that maps every domain state to the tone class and human label used
 * by <Chip>. Colour is never the only carrier — every chip renders a label.
 */

import { daysUntil } from './dates';

export type Tone = 'active' | 'waiting' | 'risk' | 'accent' | 'neutral';

export interface ChipSpec {
  tone: Tone;
  label: string;
  /** Whether the chip renders the 6px status dot. */
  dot: boolean;
}

const SPECS: Record<string, ChipSpec> = {
  /* Client relationship */
  prospect: { tone: 'accent', label: 'Prospect', dot: true },
  active: { tone: 'active', label: 'Active', dot: true },
  inactive: { tone: 'neutral', label: 'Inactive', dot: false },
  archived: { tone: 'neutral', label: 'Archived', dot: false },

  /* Project stage */
  draft: { tone: 'neutral', label: 'Draft', dot: false },
  planned: { tone: 'neutral', label: 'Planned', dot: false },
  'on-hold': { tone: 'waiting', label: 'On hold', dot: true },
  'in-review': { tone: 'waiting', label: 'In review', dot: true },
  delivered: { tone: 'active', label: 'Delivered', dot: true },
  closed: { tone: 'neutral', label: 'Closed', dot: false },
  cancelled: { tone: 'neutral', label: 'Cancelled', dot: false },
  'at-risk': { tone: 'risk', label: 'At risk', dot: true },

  /* Task */
  todo: { tone: 'neutral', label: 'To do', dot: false },
  'in-progress': { tone: 'waiting', label: 'In progress', dot: true },
  waiting: { tone: 'waiting', label: 'Waiting', dot: true },
  done: { tone: 'active', label: 'Done', dot: true },
  overdue: { tone: 'risk', label: 'Overdue', dot: true },
  blocked: { tone: 'risk', label: 'Blocked', dot: true },

  /* Review */
  none: { tone: 'neutral', label: 'Not requested', dot: false },
  pending: { tone: 'waiting', label: 'Pending', dot: true },
  'changes-requested': { tone: 'waiting', label: 'Changes requested', dot: true },
  approved: { tone: 'active', label: 'Approved', dot: true },
  withdrawn: { tone: 'neutral', label: 'Withdrawn', dot: false },
  superseded: { tone: 'neutral', label: 'Superseded', dot: false },

  /* Visibility and delivery */
  private: { tone: 'neutral', label: 'Private', dot: false },
  shared: { tone: 'accent', label: 'Shared', dot: false },
  ready: { tone: 'active', label: 'Ready', dot: true },
  'missing-approval': { tone: 'risk', label: 'Missing approval', dot: true },
  revoked: { tone: 'risk', label: 'Revoked', dot: true },
  expired: { tone: 'neutral', label: 'Expired', dot: false },
  met: { tone: 'active', label: 'Met', dot: true },
  open: { tone: 'neutral', label: 'Open', dot: false },
  healthy: { tone: 'active', label: 'Healthy', dot: true },

  /* Access lifecycle */
  invited: { tone: 'waiting', label: 'Invited', dot: true },
  verified: { tone: 'active', label: 'Verified', dot: true },
};

export function chipSpec(state: string, overrideLabel?: string): ChipSpec {
  const spec = SPECS[state] ?? { tone: 'neutral' as Tone, label: state, dot: false };
  return overrideLabel ? { ...spec, label: overrideLabel } : spec;
}

/** Project stage labels, where the display label differs from the state key. */
export const STAGE_LABEL: Record<string, string> = {
  draft: 'Draft',
  planned: 'Planned',
  active: 'Active',
  'on-hold': 'On hold',
  'in-review': 'In review',
  delivered: 'Delivered',
  closed: 'Closed',
  cancelled: 'Cancelled',
};

/**
 * Attention flags.
 *
 * These are never stages. The HoneyBook research note in the design file is
 * explicit: use clear manual project stages in V1, and keep overdue and waiting
 * as attention flags.
 */
export function projectAttention(overdueTasks: number, waitingReviews: number): 'risk' | 'waiting' | null {
  if (overdueTasks > 0) return 'risk';
  if (waitingReviews > 0) return 'waiting';
  return null;
}

/**
 * Task attention flags ('blocked' | 'waiting' | 'overdue' | null).
 * Attention flags are never lifecycle statuses — they surface operational flags.
 */
export function taskAttention(
  task: { due: string; status: string; attention?: string | null; dependencies?: string[]; blockedByTaskId?: string },
  isPrerequisiteBlocked?: boolean
): 'blocked' | 'waiting' | 'overdue' | null {
  if (task.status === 'done' || task.status === 'cancelled') return null;
  if (isPrerequisiteBlocked || task.attention === 'blocked') return 'blocked';
  if (task.attention === 'waiting') return 'waiting';
  const diff = daysUntil(task.due);
  if (diff !== null && diff < 0) return 'overdue';
  return null;
}

