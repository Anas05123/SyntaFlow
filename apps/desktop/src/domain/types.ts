/**
 * CoreDesk domain model.
 *
 * The record graph is taken from the FigJam boards:
 *   CoreDesk -> Core Workspace -> { Projects, Documents, Portfolio, Professional Profile }
 * and from the IA page of the design file:
 *   Workspace 1-many Clients
 *   Client    1-many Contacts + Projects
 *   Project   1-many Tasks + Milestones + Documents + Files
 *   Document  1-many immutable Versions
 *   Version   1-many Review Requests over time
 *   Review Request -> one designated approver
 *   Delivery Package -> exact approved Versions/files
 *   Access Grant -> recipient + object + permissions + expiry
 */

/* -------------------------------------------------------------------------- */
/* Identifiers                                                                 */
/* -------------------------------------------------------------------------- */

export type ClientId = string;
export type ProjectId = string;
export type DocumentId = string;
export type TaskId = string;
export type ReviewId = string;
export type DeliveryId = string;
export type GrantId = string;
export type MilestoneId = string;
export type FileId = string;

/* -------------------------------------------------------------------------- */
/* Shared vocabulary                                                           */
/* -------------------------------------------------------------------------- */

/** Relationship state of the client record (C01 / C02). */
export type ClientState = 'prospect' | 'active' | 'inactive' | 'archived';

/** Project stage. Manual stages only in V1 — the HoneyBook research note says
 *  overdue and waiting are attention flags, never stages. */
export type ProjectStage = 'draft' | 'planned' | 'active' | 'on-hold' | 'in-review' | 'delivered' | 'closed' | 'cancelled';

/** Task status. Canonical statuses: To Do, In Progress, Done (and cancelled).
 *  Attention flags (waiting, blocked, overdue) are separate from status. */
export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'cancelled';

/** Attention flags for tasks. Computed or flagged separately from status. */
export type TaskAttention = 'waiting' | 'blocked' | 'overdue';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent' | 'blocker';

export type TaskType = 'drafting' | 'review' | 'comms' | 'delivery' | 'admin';

/** A document is a versioned piece of work. Types come from the document
 *  requirements section of the page inventory. */
export type DocumentType = 'Proposal' | 'Brief' | 'Agreement record' | 'Welcome pack' | 'Scope / Report' | 'Notes' | 'Deliverable';

export type ReviewState = 'none' | 'draft' | 'waiting' | 'changes-requested' | 'approved' | 'withdrawn' | 'superseded';

export type Visibility = 'private' | 'shared';

export type Decision = 'approved' | 'changes';

/**
 * Access lifecycle, from the Lifecycles & access page:
 *   Invited -> Verified/Active -> Expired or Revoked
 * A grant carries its own object, permissions and expiry, and no grant is
 * inherited by a sibling project or document.
 */
export type GrantState = 'invited' | 'active' | 'verified' | 'expired' | 'revoked';

export type GrantRole = 'Guest reviewer' | 'Guest viewer';

export type DeliveryState = 'missing-approval' | 'ready' | 'delivered' | 'revoked';

export type MilestoneState = 'open' | 'met' | 'overdue';

/* -------------------------------------------------------------------------- */
/* Records                                                                     */
/* -------------------------------------------------------------------------- */

export interface Workspace {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  timezone: string;
  /** Professional profile / settings from the architecture board. */
  services: ServiceDefault[];
  business: {
    website: string;
    registration: string;
    logoLabel: string;
    accent: string;
  };
  proposalDefaults: {
    includeFeeTable: boolean;
    includeAssumptions: boolean;
    includePaymentTerms: boolean;
  };
}

export interface ServiceDefault {
  id: string;
  name: string;
  basis: 'Fixed fee' | 'Day rate' | 'Hourly';
  amount: number;
  currency: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  primary: boolean;
}

export interface Client {
  id: ClientId;
  name: string;
  state: ClientState;
  contacts: Contact[];
  nextAction: string;
  nextActionTone: 'risk' | 'waiting' | 'accent' | 'ok' | 'neutral';
  nextActionDue: string | null;
  lastActivity: string;
  /** Private by default. Never visible to a guest. */
  privateNote: string;
  archivedOn?: string;
  brandColor?: string;
  website?: string;
  industry?: string;
  tier?: 'retainer' | 'fixed' | 'hourly';
  totalBilled?: number;
  currency?: string;
  portalSlug?: string;
}

export interface Milestone {
  id: MilestoneId;
  name: string;
  due: string;
  done: boolean;
}

export interface Project {
  id: ProjectId;
  name: string;
  clientId: ClientId;
  outcome: string;
  stage: ProjectStage;
  due: string;
  nextMilestone: string;
  nextMilestoneDue: string;
  nextAction: string;
  nextActionTone: 'risk' | 'waiting' | 'accent' | 'ok' | 'neutral';
  brief: string;
  inScope: string[];
  outOfScope: string[];
  scopeAccepted: boolean;
  scopeAcceptedOn: string | null;
  startedOn: string | null;
  milestones: Milestone[];
  code?: string;
  type?: string;
  budget?: number;
  currency?: string;
  progressPercent?: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface TaskDependency {
  id: string;
  taskId: TaskId;
  dependsOnTaskId: TaskId;
}

export interface Task {
  id: TaskId;
  title: string;
  projectId: ProjectId | null;
  /** Tasks can belong to a client before any project exists (client-lifecycle
   *  board: "Lead / New Client" precedes "Project Created"). */
  clientId: ClientId | null;
  due: string;
  status: TaskStatus;
  priority: TaskPriority;
  milestoneId: MilestoneId | null;
  note: string;
  checklist: ChecklistItem[];
  kind?: TaskType;
  estimatedMinutes?: number;
  /** Legacy single blocker reference */
  blockedByTaskId?: string;
  /** Canonical many-to-many prerequisite dependencies */
  dependencies?: TaskId[];
  /** Explicit attention flag (e.g. 'waiting') */
  attention?: TaskAttention | null;
  directLinkUrl?: string;
  order?: number;
}

export interface DocVersion {
  n: number;
  author: string;
  date: string;
  decision: Decision | null;
  note: string;
}

export interface DocumentRecord {
  id: DocumentId;
  title: string;
  type: DocumentType;
  clientId: ClientId;
  projectId: ProjectId;
  workingVersion: number;
  submittedVersion: number;
  reviewState: ReviewState;
  visibility: Visibility;
  sections: string[];
  /** Internal notes are private by default and never become client-visible. */
  internalNote: string;
  modified: string;
  versions: DocVersion[];
}

export interface ReviewComment {
  id: string;
  author: string;
  date: string;
  body: string;
  internal: boolean;
}

export interface Review {
  id: ReviewId;
  documentId: DocumentId;
  projectId: ProjectId;
  version: number;
  reviewer: { name: string; email: string; role: 'Approver' | 'Viewer' };
  requestedOn: string;
  due: string;
  state: ReviewState;
  outcome: Decision | null;
  closedOn?: string;
  supersededBy?: ReviewId;
  comments: ReviewComment[];
}

export interface ProjectFile {
  id: FileId;
  projectId: ProjectId;
  name: string;
  kind: 'pdf' | 'zip' | 'png' | 'doc';
  meta: string;
  uploaded: string;
  approved: boolean;
}

export interface DeliveryPackage {
  id: DeliveryId;
  projectId: ProjectId;
  title: string;
  recipient: { name: string; email: string };
  state: DeliveryState;
  deliveredOn: string | null;
  acknowledgedOn: string | null;
  method: string | null;
  notes: string;
  fileIds: FileId[];
}

export interface AccessGrant {
  id: GrantId;
  recipient: { name: string; email: string };
  role: GrantRole;
  objectLabel: string;
  objectType: 'Review request' | 'Delivery package' | 'Project summary' | 'Invitation';
  permissions: string[];
  state: GrantState;
  invited: string;
  lastActivity: string | null;
  expires: string | null;
  revokedOn?: string;
}

export type ActivityType = 'review-requested' | 'feedback' | 'approved' | 'changes' | 'delivered' | 'acknowledged' | 'access' | 'created';

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  actor: string;
  date: string;
  title: string;
  targetLabel: string;
  targetHref: string;
  read: boolean;
  /** What this event does and does not resolve. Reading an event never
   *  resolves the work it refers to. */
  resolves: string;
}

/* -------------------------------------------------------------------------- */
/* Derived view models                                                         */
/* -------------------------------------------------------------------------- */

export interface TaskWithContext extends Task {
  contextLabel: string;
  contextHref: string;
  projectName: string | null;
  clientName: string;
}

export interface DocumentWithContext extends DocumentRecord {
  clientName: string;
  projectName: string;
  activeReview: Review | null;
}

export interface ProjectWithContext extends Project {
  clientName: string;
  tasksDone: number;
  tasksTotal: number;
  openReviewCount: number;
  overdueTaskCount: number;
  delivery: DeliveryPackage | null;
}
