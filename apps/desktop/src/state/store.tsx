/**
 * Workspace store.
 *
 * A single reducer-backed store persisted to localStorage, so every screen
 * reads and writes the same records and state survives a reload. This is the
 * frontend's data layer — it is not a backend, and it makes no network calls.
 */

import {
  createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState,
  type Dispatch, type ReactNode,
} from 'react';

import {
  seedActivity, seedClients, seedDeliveries, seedDocuments, seedFiles, seedGrants,
  seedProjects, seedReviews, seedTasks, seedWorkspace,
} from '../domain/seed';
import type {
  AccessGrant, ActivityEvent, Client, DeliveryPackage, DocumentRecord, DocumentWithContext,
  ProjectFile, GrantState, Project, ProjectWithContext, Review, Task, TaskAttention, TaskStatus,
  TaskWithContext, Workspace,
} from '../domain/types';
import { daysUntil, initials, nowIso } from '../domain/dates';

const STORAGE_KEY = 'coredesk.workspace.v1';

export interface WorkspaceState {
  workspace: Workspace;
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  documents: DocumentRecord[];
  reviews: Review[];
  files: ProjectFile[];
  deliveries: DeliveryPackage[];
  grants: AccessGrant[];
  activity: ActivityEvent[];
}

export const initialState: WorkspaceState = {
  workspace: seedWorkspace,
  clients: seedClients,
  projects: seedProjects,
  tasks: seedTasks,
  documents: seedDocuments,
  reviews: seedReviews,
  files: seedFiles,
  deliveries: seedDeliveries,
  grants: seedGrants,
  activity: seedActivity,
};

/* -------------------------------------------------------------------------- */
/* Actions                                                                     */
/* -------------------------------------------------------------------------- */

export type Action =
  | { type: 'reset' }
  | { type: 'workspace/patch'; patch: Partial<Workspace> }
  | { type: 'client/add'; client: Client }
  | { type: 'client/patch'; id: string; patch: Partial<Client> }
  | { type: 'project/add'; project: Project }
  | { type: 'project/patch'; id: string; patch: Partial<Project> }
  | { type: 'project/acceptScope'; id: string; date: string }
  | { type: 'project/toggleMilestone'; projectId: string; milestoneId: string }
  | { type: 'project/placeHold'; id: string; onHold: boolean }
  | { type: 'task/add'; task: Task }
  | { type: 'task/patch'; id: string; patch: Partial<Task> }
  | { type: 'task/toggle'; id: string }
  | { type: 'task/status'; id: string; status: TaskStatus }
  | { type: 'task/addDependency'; taskId: string; dependsOnTaskId: string }
  | { type: 'task/removeDependency'; taskId: string; dependsOnTaskId: string }
  | { type: 'task/reorder'; orderedTaskIds: string[] }
  | { type: 'task/postpone'; id: string }
  | { type: 'task/toggleChecklist'; taskId: string; itemId: string }
  | { type: 'task/delete'; id: string }
  | { type: 'document/add'; document: DocumentRecord }
  | { type: 'document/patch'; id: string; patch: Partial<DocumentRecord> }
  | { type: 'document/submitVersion'; id: string; note: string }
  | { type: 'review/add'; review: Review }
  | { type: 'review/comment'; id: string; comment: string; actor: string }
  | { type: 'review/decide'; id: string; decision: 'approved' | 'changes'; comment: string; actor: string }
  | { type: 'review/withdraw'; id: string }
  | { type: 'delivery/patch'; id: string; patch: Partial<DeliveryPackage> }
  | { type: 'delivery/toggleFile'; id: string; fileId: string }
  | { type: 'grant/add'; grant: AccessGrant }
  | { type: 'grant/state'; id: string; state: GrantState }
  | { type: 'activity/add'; event: ActivityEvent }
  | { type: 'activity/read'; id: string }
  | { type: 'activity/readAll' }
  | { type: 'activity/readForTarget'; targetLabel: string };

/* -------------------------------------------------------------------------- */
/* Reducer                                                                     */
/* -------------------------------------------------------------------------- */

let idCounter = 0;
export function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}${idCounter.toString(36)}`;
}

export function reducer(state: WorkspaceState, action: Action): WorkspaceState {
  switch (action.type) {
    case 'reset':
      return initialState;

    case 'workspace/patch':
      return { ...state, workspace: { ...state.workspace, ...action.patch } };

    case 'client/add':
      return { ...state, clients: [action.client, ...state.clients] };

    case 'client/patch':
      return {
        ...state,
        clients: state.clients.map((c) => (c.id === action.id ? { ...c, ...action.patch } : c)),
      };

    case 'project/add':
      return { ...state, projects: [action.project, ...state.projects] };

    case 'project/patch':
      return {
        ...state,
        projects: state.projects.map((p) => (p.id === action.id ? { ...p, ...action.patch } : p)),
      };

    case 'project/acceptScope':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.id ? { ...p, scopeAccepted: true, scopeAcceptedOn: action.date, stage: 'active' } : p
        ),
      };

    case 'project/toggleMilestone':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.projectId
            ? {
                ...p,
                milestones: p.milestones.map((m) => (m.id === action.milestoneId ? { ...m, done: !m.done } : m)),
              }
            : p
        ),
      };

    case 'project/placeHold':
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.id ? { ...p, stage: action.onHold ? 'on-hold' : 'active' } : p
        ),
      };

    case 'task/add':
      return { ...state, tasks: [action.task, ...state.tasks] };

    case 'task/patch':
      return { ...state, tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, ...action.patch } : t)) };

    case 'task/toggle': {
      const prev = state.tasks.find((t) => t.id === action.id);
      if (!prev) return state;
      const nextStatus: TaskStatus = prev.status === 'done' ? 'todo' : 'done';
      const updatedTasks = state.tasks.map((t) =>
        t.id === action.id ? { ...t, status: nextStatus } : t
      );
      let activity = state.activity;
      if (nextStatus === 'done' && prev.status !== 'done') {
        activity = [
          {
            id: nextId('ev'),
            type: 'approved',
            actor: state.workspace.ownerName,
            date: nowIso(),
            title: `completed task "${prev.title}"`,
            targetLabel: prev.title,
            targetHref: '#/tasks',
            read: false,
            resolves: 'Task marked completed.',
          },
          ...state.activity,
        ];
      }
      return { ...state, tasks: updatedTasks, activity };
    }

    case 'task/status': {
      const prev = state.tasks.find((t) => t.id === action.id);
      if (!prev || prev.status === action.status) return state;
      const updatedTasks = state.tasks.map((t) =>
        t.id === action.id ? { ...t, status: action.status } : t
      );
      let activity = state.activity;
      if (action.status === 'done' && prev.status !== 'done') {
        activity = [
          {
            id: nextId('ev'),
            type: 'approved',
            actor: state.workspace.ownerName,
            date: nowIso(),
            title: `completed task "${prev.title}"`,
            targetLabel: prev.title,
            targetHref: '#/tasks',
            read: false,
            resolves: 'Task marked completed.',
          },
          ...state.activity,
        ];
      }
      return { ...state, tasks: updatedTasks, activity };
    }

    case 'task/addDependency':
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id !== action.taskId) return t;
          const deps = t.dependencies ? [...t.dependencies] : [];
          if (!deps.includes(action.dependsOnTaskId)) deps.push(action.dependsOnTaskId);
          return { ...t, dependencies: deps, blockedByTaskId: deps[0] };
        }),
      };

    case 'task/removeDependency':
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id !== action.taskId) return t;
          const deps = (t.dependencies || []).filter((d) => d !== action.dependsOnTaskId);
          return {
            ...t,
            dependencies: deps,
            blockedByTaskId: deps.length > 0 ? deps[0] : undefined,
          };
        }),
      };

    case 'task/reorder':
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          const idx = action.orderedTaskIds.indexOf(t.id);
          if (idx !== -1) {
            return { ...t, order: idx * 10 };
          }
          return t;
        }),
      };

    case 'task/postpone':
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id !== action.id) return t;
          const d = new Date(`${t.due}T00:00:00`);
          d.setDate(d.getDate() + 1);
          return { ...t, due: d.toISOString().slice(0, 10) };
        }),
      };

    case 'task/toggleChecklist':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? {
                ...t,
                checklist: t.checklist.map((c) => (c.id === action.itemId ? { ...c, done: !c.done } : c)),
              }
            : t
        ),
      };

    case 'task/delete':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) };

    case 'document/add':
      return { ...state, documents: [action.document, ...state.documents] };

    case 'document/patch':
      return {
        ...state,
        documents: state.documents.map((d) => (d.id === action.id ? { ...d, ...action.patch } : d)),
      };

    /**
     * Submitting freezes a numbered version. A submitted version is never
     * overwritten — a new working draft copies forward instead.
     */
    case 'document/submitVersion':
      return {
        ...state,
        documents: state.documents.map((d) => {
          if (d.id !== action.id) return d;
          const submitted = d.submittedVersion + 1;
          return {
            ...d,
            submittedVersion: submitted,
            workingVersion: submitted + 1,
            reviewState: 'waiting',
            versions: [
              {
                n: submitted,
                author: state.workspace.ownerName,
                date: nowIso(),
                decision: null,
                note: action.note || 'Submitted for review.',
              },
              ...d.versions,
            ],
          };
        }),
      };

    case 'review/add':
      return { ...state, reviews: [action.review, ...state.reviews] };

    case 'review/comment': {
      const targetReview = state.reviews.find((r) => r.id === action.id);
      if (!targetReview || !action.comment.trim()) return state;
      const newComment = {
        id: nextId('cm'),
        author: action.actor,
        date: nowIso(),
        body: action.comment.trim(),
        internal: false,
      };
      const doc = state.documents.find((d) => d.id === targetReview.documentId);
      return {
        ...state,
        reviews: state.reviews.map((r) =>
          r.id === action.id ? { ...r, comments: [...r.comments, newComment] } : r
        ),
        activity: [
          {
            id: nextId('ev'),
            type: 'feedback',
            actor: action.actor,
            date: nowIso(),
            title: `left feedback on ${doc?.title ?? 'Document'} (v${targetReview.version})`,
            targetLabel: doc?.title ?? 'Document',
            targetHref: '#/activity',
            read: false,
            resolves: 'Review feedback added.',
          },
          ...state.activity,
        ],
      };
    }

    case 'review/decide':
      return {
        ...state,
        reviews: state.reviews.map((r) =>
          r.id === action.id
            ? {
                ...r,
                state: action.decision === 'approved' ? 'approved' : 'changes-requested',
                outcome: action.decision,
                closedOn: nowIso(),
                comments: action.comment
                  ? [
                      ...r.comments,
                      {
                        id: nextId('cm'),
                        author: action.actor,
                        date: nowIso(),
                        body: action.comment,
                        internal: false,
                      },
                    ]
                  : r.comments,
              }
            : r
        ),
        documents: state.documents.map((d) => {
          const review = state.reviews.find((r) => r.id === action.id);
          if (!review || d.id !== review.documentId) return d;
          return {
            ...d,
            reviewState: action.decision === 'approved' ? 'approved' : 'changes-requested',
            versions: d.versions.map((v) =>
              v.n === review.version ? { ...v, decision: action.decision } : v
            ),
          };
        }),
        activity: [
          {
            id: nextId('ev'),
            type: action.decision === 'approved' ? 'approved' : 'changes',
            actor: action.actor,
            date: nowIso(),
            title:
              action.decision === 'approved'
                ? `approved a version via guest review`
                : `requested changes via guest review`,
            targetLabel: state.documents.find((d) => d.id === state.reviews.find((r) => r.id === action.id)?.documentId)?.title ?? 'Document',
            targetHref: '#/activity',
            read: false,
            resolves:
              action.decision === 'approved'
                ? 'The owner can prepare delivery for this version.'
                : 'A revision is required before resubmission.',
          },
          ...state.activity,
        ],
      };

    case 'review/withdraw':
      return {
        ...state,
        reviews: state.reviews.map((r) => (r.id === action.id ? { ...r, state: 'withdrawn' } : r)),
        documents: state.documents.map((d) => {
          const review = state.reviews.find((r) => r.id === action.id);
          if (!review || d.id !== review.documentId) return d;
          return { ...d, reviewState: 'withdrawn' };
        }),
      };

    case 'delivery/patch':
      return {
        ...state,
        deliveries: state.deliveries.map((d) => (d.id === action.id ? { ...d, ...action.patch } : d)),
      };

    case 'delivery/toggleFile':
      return {
        ...state,
        deliveries: state.deliveries.map((d) =>
          d.id === action.id
            ? {
                ...d,
                fileIds: d.fileIds.includes(action.fileId)
                  ? d.fileIds.filter((f) => f !== action.fileId)
                  : [...d.fileIds, action.fileId],
              }
            : d
        ),
      };

    case 'grant/add':
      return { ...state, grants: [action.grant, ...state.grants] };

    case 'grant/state':
      return {
        ...state,
        grants: state.grants.map((g) => (g.id === action.id ? { ...g, state: action.state } : g)),
      };

    case 'activity/add':
      return { ...state, activity: [action.event, ...state.activity] };

    case 'activity/read':
      return {
        ...state,
        activity: state.activity.map((e) => (e.id === action.id ? { ...e, read: true } : e)),
      };

    case 'activity/readAll':
      return { ...state, activity: state.activity.map((e) => ({ ...e, read: true })) };

    case 'activity/readForTarget':
      return {
        ...state,
        activity: state.activity.map((e) =>
          e.targetLabel === action.targetLabel ? { ...e, read: true } : e
        ),
      };

    default:
      return state;
  }
}

/* -------------------------------------------------------------------------- */
/* Persistence                                                                 */
/* -------------------------------------------------------------------------- */

function loadState(): WorkspaceState {
  if (typeof localStorage === 'undefined') return initialState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<WorkspaceState>;
    /* Merge onto initialState so a seed addition never breaks a stored state. */
    const merged = { ...initialState, ...parsed };
    if (merged.workspace && (merged.workspace.ownerName === 'Nadia Rahman' || !merged.workspace.ownerName)) {
      merged.workspace = { ...merged.workspace, ownerName: 'Anas Ayari', ownerEmail: 'anas@northlight.studio' };
    }
    if (merged.tasks) {
      merged.tasks = merged.tasks.map((t) => {
        let status = t.status;
        let attention = t.attention;
        if ((status as string) === 'waiting') {
          status = 'in-progress';
          attention = 'waiting';
        }
        const deps = t.dependencies ? [...t.dependencies] : [];
        if (t.blockedByTaskId && !deps.includes(t.blockedByTaskId)) {
          deps.push(t.blockedByTaskId);
        }
        return {
          ...t,
          status,
          attention,
          dependencies: deps,
        };
      });
    }
    return merged;
  } catch {
    return initialState;
  }
}

/* -------------------------------------------------------------------------- */
/* Selectors                                                                   */
/* -------------------------------------------------------------------------- */

export interface DerivedData {
  clientById: (id: string | null) => Client | null;
  projectById: (id: string | null) => Project | null;
  documentById: (id: string | null) => DocumentRecord | null;
  taskById: (id: string | null) => Task | null;
  reviewById: (id: string | null) => Review | null;
  deliveryById: (id: string | null) => DeliveryPackage | null;
  fileById: (id: string | null) => ProjectFile | null;

  projectsOfClient: (clientId: string) => Project[];
  documentsOfProject: (projectId: string) => DocumentRecord[];
  tasksOfProject: (projectId: string) => Task[];
  tasksOfClient: (clientId: string) => Task[];
  reviewsOfProject: (projectId: string) => Review[];
  reportsOfDocument: (documentId: string) => Review[];
  deliveryOfProject: (projectId: string) => DeliveryPackage | null;
  filesOfProject: (projectId: string) => ProjectFile[];
  activeReviewOfDocument: (documentId: string) => Review | null;
  grantsOfObject: (objectLabel: string) => AccessGrant[];

  tasksWithContext: TaskWithContext[];
  documentsWithContext: DocumentWithContext[];
  projectsWithContext: ProjectWithContext[];

  openTasks: TaskWithContext[];
  overdueTasks: TaskWithContext[];
  unreadActivity: number;
  waitingReviews: Review[];
  activeClientCount: number;
  activeProjectCount: number;

  getTaskDependencies: (task: Task) => Task[];
  isTaskBlocked: (task: Task) => boolean;
  getTaskAttention: (task: Task) => TaskAttention | null;
}

export function useDerived(state: WorkspaceState): DerivedData {
  const { clients, projects, tasks, documents, reviews, deliveries, files, grants, activity } = state;

  return useMemo(() => {
    const clientById = (id: string | null) => (id ? clients.find((c) => c.id === id) ?? null : null);
    const projectById = (id: string | null) => (id ? projects.find((p) => p.id === id) ?? null : null);
    const documentById = (id: string | null) => (id ? documents.find((d) => d.id === id) ?? null : null);
    const taskById = (id: string | null) => (id ? tasks.find((t) => t.id === id) ?? null : null);
    const reviewById = (id: string | null) => (id ? reviews.find((r) => r.id === id) ?? null : null);
    const deliveryById = (id: string | null) => (id ? deliveries.find((d) => d.id === id) ?? null : null);
    const fileById = (id: string | null) => (id ? files.find((f) => f.id === id) ?? null : null);

    const projectsOfClient = (clientId: string) => projects.filter((p) => p.clientId === clientId);
    const documentsOfProject = (projectId: string) => documents.filter((d) => d.projectId === projectId);
    const tasksOfProject = (projectId: string) => tasks.filter((t) => t.projectId === projectId);
    const tasksOfClient = (clientId: string) => {
      const ids = projectsOfClient(clientId).map((p) => p.id);
      return tasks.filter((t) => ids.includes(t.projectId ?? '') || t.clientId === clientId);
    };
    const reviewsOfProject = (projectId: string) => reviews.filter((r) => r.projectId === projectId);
    const reportsOfDocument = (documentId: string) => reviews.filter((r) => r.documentId === documentId);
    const deliveryOfProject = (projectId: string) => deliveries.find((d) => d.projectId === projectId) ?? null;
    const filesOfProject = (projectId: string) => files.filter((f) => f.projectId === projectId);
    const activeReviewOfDocument = (documentId: string) =>
      reviews.find((r) => r.documentId === documentId && r.state === 'waiting') ?? null;
    const grantsOfObject = (objectLabel: string) => grants.filter((g) => g.objectLabel === objectLabel);

    /* Context-aware view models. Every list item names its client and project,
     * which is a stated requirement of the workspace page contracts. */
    const tasksWithContext: TaskWithContext[] = tasks.map((t) => {
      const project = t.projectId ? projectById(t.projectId) : null;
      const client = project ? clientById(project.clientId) : clientById(t.clientId);
      return {
        ...t,
        projectName: project?.name ?? null,
        clientName: client?.name ?? 'Unassigned',
        contextLabel: project ? `${project.name} · ${client?.name ?? ''}`.trim() : `${client?.name ?? 'Unassigned'} · no project yet`,
        contextHref: project ? `#/projects/${project.id}?tab=work` : `#/clients/${client?.id ?? ''}`,
      };
    });

    const documentsWithContext: DocumentWithContext[] = documents.map((d) => ({
      ...d,
      clientName: clientById(d.clientId)?.name ?? '—',
      projectName: projectById(d.projectId)?.name ?? '—',
      activeReview: activeReviewOfDocument(d.id),
    }));

    const projectsWithContext: ProjectWithContext[] = projects.map((p) => {
      const pTasks = tasksOfProject(p.id);
      const pReviews = reviewsOfProject(p.id);
      return {
        ...p,
        clientName: clientById(p.clientId)?.name ?? '—',
        tasksDone: pTasks.filter((t) => t.status === 'done').length,
        tasksTotal: pTasks.length,
        openReviewCount: pReviews.filter((r) => r.state === 'waiting').length,
        overdueTaskCount: pTasks.filter((t) => t.status !== 'done' && t.status !== 'cancelled' && (daysUntil(t.due) ?? 0) < 0).length,
        delivery: deliveryOfProject(p.id),
      };
    });

    const openTasks = tasksWithContext.filter((t) => t.status !== 'done' && t.status !== 'cancelled');
    const overdueTasks = openTasks.filter((t) => (daysUntil(t.due) ?? 0) < 0);

    const getTaskDependencies = (task: Task): Task[] => {
      const depIds: string[] = [];
      if (task.dependencies && Array.isArray(task.dependencies)) {
        depIds.push(...task.dependencies);
      }
      if (task.blockedByTaskId && !depIds.includes(task.blockedByTaskId)) {
        depIds.push(task.blockedByTaskId);
      }
      return depIds.map((id) => tasks.find((t) => t.id === id)).filter(Boolean) as Task[];
    };

    const isTaskBlocked = (task: Task): boolean => {
      const deps = getTaskDependencies(task);
      if (deps.length === 0) return false;
      return deps.some((dep) => dep.status !== 'done');
    };

    const getTaskAttention = (task: Task): TaskAttention | null => {
      if (task.status === 'done' || task.status === 'cancelled') return null;
      if (isTaskBlocked(task) || task.attention === 'blocked') return 'blocked';
      if (task.attention === 'waiting') return 'waiting';
      const diff = daysUntil(task.due);
      if (diff !== null && diff < 0) return 'overdue';
      return null;
    };

    return {
      clientById, projectById, documentById, taskById, reviewById, deliveryById, fileById,
      projectsOfClient, documentsOfProject, tasksOfProject, tasksOfClient, reviewsOfProject,
      reportsOfDocument, deliveryOfProject, filesOfProject, activeReviewOfDocument, grantsOfObject,
      tasksWithContext, documentsWithContext, projectsWithContext,
      openTasks, overdueTasks,
      unreadActivity: activity.filter((e) => !e.read).length,
      waitingReviews: reviews.filter((r) => r.state === 'waiting'),
      activeClientCount: clients.filter((c) => c.state === 'active').length,
      activeProjectCount: projects.filter((p) => p.stage !== 'closed' && p.stage !== 'cancelled').length,
      getTaskDependencies,
      isTaskBlocked,
      getTaskAttention,
    };
  }, [clients, projects, tasks, documents, reviews, deliveries, files, grants, activity]);
}

/* -------------------------------------------------------------------------- */
/* Context                                                                     */
/* -------------------------------------------------------------------------- */

interface StoreValue {
  state: WorkspaceState;
  dispatch: Dispatch<Action>;
  derived: DerivedData;
  /** Act as the guest reviewer or as the owner. */
  actor: string;
  setActor: (name: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const derived = useDerived(state);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* Storage full or unavailable — the app still works in memory. */
    }
  }, [state]);

  const [actor, setActor] = useState(state.workspace.ownerName);
  const value = useMemo<StoreValue>(
    () => ({ state, dispatch, derived, actor, setActor }),
    [state, derived, actor]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}

/** Convenience: the current workspace identity, for avatars and authorship. */
export function useIdentity() {
  const { state } = useStore();
  return {
    name: state.workspace.ownerName,
    email: state.workspace.ownerEmail,
    initials: initials(state.workspace.ownerName),
    workspaceName: state.workspace.name,
  };
}

export function useResetWorkspace() {
  const { dispatch } = useStore();
  return useCallback(() => dispatch({ type: 'reset' }), [dispatch]);
}
