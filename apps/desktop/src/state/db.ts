/**
 * CoreDesk Database & Query Engine.
 *
 * Provides relational query resolution, full-text multi-entity search,
 * and data modeling for the Operator Cockpit and Client Dossiers.
 */

import type { Client, Project, Task, DocumentRecord, Review } from '../domain/types';
import type { WorkspaceState } from './store';
import { daysUntil } from '../domain/dates';

export interface SearchResult {
  id: string;
  type: 'client' | 'project' | 'task' | 'document';
  title: string;
  subtitle: string;
  badge?: string;
  badgeTone?: 'risk' | 'waiting' | 'accent' | 'ok' | 'neutral';
  href: string;
}

export interface CockpitBlocker {
  id: string;
  kind: 'Review' | 'Agreement' | 'Milestone';
  clientName: string;
  clientId: string;
  title: string;
  consequence: string;
  waitingOn: string;
  daysWaiting: number;
  dueLabel: string;
  actionType: 'ping' | 'review' | 'proposal';
  targetHref: string;
}

export interface CockpitFocusTask {
  id: string;
  title: string;
  projectName: string;
  projectId: string;
  clientName: string;
  priority: 'blocker' | 'urgent' | 'high' | 'medium' | 'low';
  kind: 'drafting' | 'review' | 'comms' | 'delivery' | 'admin';
  dueLabel: string;
  isOverdue: boolean;
  estimatedMinutes: number;
  directLinkUrl?: string;
  status: Task['status'];
}

export interface CockpitClientPulse {
  id: string;
  name: string;
  brandColor: string;
  tier: string;
  activeProjectsCount: number;
  currentPhase: string;
  nextMilestone: string;
  nextAction: string;
  nextActionTone: 'risk' | 'waiting' | 'accent' | 'ok' | 'neutral';
  totalBilledFormatted: string;
}

export interface ClientDossier {
  client: Client;
  projects: Project[];
  tasks: Task[];
  documents: DocumentRecord[];
  reviews: Review[];
  totalPipelineValue: number;
  pendingReviewsCount: number;
  activeDeliverablesCount: number;
}

export class CoreDeskDatabase {
  /**
   * Universal multi-entity search across clients, projects, tasks, and documents.
   */
  static search(state: WorkspaceState, query: string): SearchResult[] {
    const q = query.trim().toLowerCase();
    const results: SearchResult[] = [];

    // Search Clients
    state.clients.forEach((c) => {
      if (c.state === 'archived') return;
      if (q === '' || c.name.toLowerCase().includes(q) || (c.industry && c.industry.toLowerCase().includes(q))) {
        results.push({
          id: `client-${c.id}`,
          type: 'client',
          title: c.name,
          subtitle: `${c.industry ?? 'Client'} · ${c.contacts[0]?.name ?? 'No contact'}`,
          badge: c.state.toUpperCase(),
          badgeTone: c.state === 'active' ? 'ok' : 'neutral',
          href: `#/clients/${c.id}`,
        });
      }
    });

    // Search Projects
    state.projects.forEach((p) => {
      if (p.stage === 'closed' || p.stage === 'cancelled') return;
      const client = state.clients.find((c) => c.id === p.clientId);
      if (q === '' || p.name.toLowerCase().includes(q) || (p.code && p.code.toLowerCase().includes(q))) {
        results.push({
          id: `project-${p.id}`,
          type: 'project',
          title: p.name,
          subtitle: `${client?.name ?? 'Project'} · ${p.outcome}`,
          badge: p.stage.toUpperCase(),
          badgeTone: p.stage === 'active' ? 'accent' : 'neutral',
          href: `#/projects/${p.id}`,
        });
      }
    });

    // Search Tasks
    state.tasks.forEach((t) => {
      if (t.status === 'done' || t.status === 'cancelled') return;
      const proj = state.projects.find((p) => p.id === t.projectId);
      if (q === '' || t.title.toLowerCase().includes(q)) {
        results.push({
          id: `task-${t.id}`,
          type: 'task',
          title: t.title,
          subtitle: proj ? `Project: ${proj.name}` : 'Workspace Task',
          badge: t.priority.toUpperCase(),
          badgeTone: t.priority === 'high' || t.priority === 'urgent' ? 'risk' : 'neutral',
          href: proj ? `#/projects/${proj.id}?tab=work` : '#/tasks',
        });
      }
    });

    return results.slice(0, 12);
  }

  /**
   * Resolves the 3 Operator Pillars for the Homepage.
   */
  static getOperatorCockpit(state: WorkspaceState) {
    // 1. External Blockers & Approvals
    const blockers: CockpitBlocker[] = [];

    state.reviews.forEach((r) => {
      if (r.outcome) return;
      const doc = state.documents.find((d) => d.id === r.documentId);
      const proj = state.projects.find((p) => p.id === r.projectId);
      const client = proj ? state.clients.find((c) => c.id === proj.clientId) : null;
      const d = daysUntil(r.due) ?? 0;

      blockers.push({
        id: `rev-${r.id}`,
        kind: 'Review',
        clientName: client?.name ?? 'Client',
        clientId: client?.id ?? '',
        title: `${doc?.title ?? 'Deliverable'} v${r.version}`,
        consequence: 'Approval gate: client sign-off required to unlock delivery',
        waitingOn: r.reviewer.name,
        daysWaiting: Math.abs(d) + 1,
        dueLabel: d < 0 ? `${Math.abs(d)}d overdue` : `Due in ${d}d`,
        actionType: 'ping',
        targetHref: `#/projects/${r.projectId}?tab=reviews`,
      });
    });

    state.clients
      .filter((c) => c.state !== 'archived' && (c.nextActionTone === 'risk' || c.nextActionTone === 'waiting'))
      .forEach((c) => {
        const d = daysUntil(c.nextActionDue) ?? 0;
        blockers.push({
          id: `cli-${c.id}`,
          kind: 'Agreement',
          clientName: c.name,
          clientId: c.id,
          title: c.nextAction,
          consequence: 'Relationship milestone action required',
          waitingOn: c.contacts[0]?.name ?? 'Primary Contact',
          daysWaiting: Math.abs(d),
          dueLabel: d < 0 ? `${Math.abs(d)}d overdue` : `Due in ${d}d`,
          actionType: 'proposal',
          targetHref: `#/clients/${c.id}`,
        });
      });

    // 2. Today's Focus Tasks Queue
    const focusQueue: CockpitFocusTask[] = [];

    state.tasks
      .filter((t) => t.status !== 'done' && t.status !== 'cancelled')
      .forEach((t) => {
        const d = daysUntil(t.due) ?? 99;
        const proj = state.projects.find((p) => p.id === t.projectId);
        const client = proj ? state.clients.find((c) => c.id === proj.clientId) : null;

        // Tasks due soon or marked urgent/high
        if (d <= 2 || t.priority === 'high' || t.priority === 'urgent' || t.priority === 'blocker') {
          focusQueue.push({
            id: t.id,
            title: t.title,
            projectName: proj?.name ?? 'General',
            projectId: proj?.id ?? '',
            clientName: client?.name ?? 'Internal',
            priority: (t.priority as any) ?? 'normal',
            kind: t.kind ?? 'drafting',
            dueLabel: d < 0 ? `${Math.abs(d)}d overdue` : d === 0 ? 'Due Today' : `Due in ${d}d`,
            isOverdue: d < 0,
            estimatedMinutes: t.estimatedMinutes ?? (t.priority === 'high' ? 45 : 30),
            directLinkUrl: proj ? `#/projects/${proj.id}?tab=work` : undefined,
            status: t.status,
          });
        }
      });

    // 3. Client Pulse (Live pipeline status)
    const clientPulse: CockpitClientPulse[] = state.clients
      .filter((c) => c.state !== 'archived')
      .map((c) => {
        const clientProjects = state.projects.filter((p) => p.clientId === c.id && p.stage !== 'closed' && p.stage !== 'cancelled');
        const activeProj = clientProjects[0];
        return {
          id: c.id,
          name: c.name,
          brandColor: c.brandColor ?? '#3b82f6',
          tier: c.tier === 'retainer' ? 'Retainer' : c.tier === 'hourly' ? 'Hourly' : 'Milestone',
          activeProjectsCount: clientProjects.length,
          currentPhase: activeProj ? activeProj.stage.toUpperCase() : c.state === 'prospect' ? 'SCOPING' : 'STANDBY',
          nextMilestone: activeProj?.nextMilestone ?? 'Kickoff scheduled',
          nextAction: c.nextAction,
          nextActionTone: c.nextActionTone,
          totalBilledFormatted: c.totalBilled ? `$${c.totalBilled.toLocaleString()}` : '$0',
        };
      });

    return {
      blockers,
      focusQueue,
      clientPulse,
    };
  }

  /**
   * Deep Relational Dossier for a Client.
   */
  static getClientDossier(state: WorkspaceState, clientId: string): ClientDossier | null {
    const client = state.clients.find((c) => c.id === clientId);
    if (!client) return null;

    const projects = state.projects.filter((p) => p.clientId === clientId);
    const projectIds = new Set(projects.map((p) => p.id));
    const tasks = state.tasks.filter((t) => (t.clientId === clientId) || (t.projectId && projectIds.has(t.projectId)));
    const documents = state.documents.filter((d) => d.clientId === clientId || projectIds.has(d.projectId));
    const reviews = state.reviews.filter((r) => projectIds.has(r.projectId));

    const totalPipelineValue = projects.reduce((acc, p) => acc + (p.budget ?? 0), client.totalBilled ?? 0);
    const pendingReviewsCount = reviews.filter((r) => !r.outcome).length;
    const activeDeliverablesCount = documents.filter((d) => d.type === 'Deliverable' || d.type === 'Scope / Report').length;

    return {
      client,
      projects,
      tasks,
      documents,
      reviews,
      totalPipelineValue,
      pendingReviewsCount,
      activeDeliverablesCount,
    };
  }
}
