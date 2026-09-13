/**
 * CoreDesk Workspace Context Memory
 *
 * Persists and validates the last meaningful workspace context across sessions.
 *
 * Rules:
 * - Only safe, non-transient destinations are saved (Home, Clients, Projects, Tasks, Documents, Activity, Archive, Settings).
 * - Never persists unsafe/temporary states:
 *   - auth / sign-in / sign-up screens
 *   - new-project or review & share setup forms halfway through draft creation
 *   - guest reviews or preview links
 *   - destructive modals or temporary popups
 * - Validates referenced objects (client, project, document) against hydrated store state.
 * - If the referenced object was deleted or is invalid, falls back safely to #/home.
 */

import type { RouteInfo } from './router';

export interface LastWorkspaceContext {
  route: string;
  root: string;
  objectId?: string;
  subview?: string;
  timestamp?: number;
}

const STORAGE_KEY = 'coredesk.workspace.last-context.v1';

export const SAFE_ROOTS = new Set([
  'home',
  'tasks',
  'clients',
  'projects',
  'documents',
  'activity',
  'archive',
  'settings',
]);

export const UNSAFE_ROOTS = new Set([
  'auth',
  'signin',
  'signup',
  'first-run',
  'new-project',
  'share',
  'guest',
  'preview',
  'terms',
  'privacy',
  'onboarding',
]);

/**
 * Extracts a safe context descriptor from the current route info, or returns null if unsafe.
 */
export function extractSafeContext(route: RouteInfo): LastWorkspaceContext | null {
  const root = route.segments[0] || 'home';

  if (UNSAFE_ROOTS.has(root) || !SAFE_ROOTS.has(root)) {
    return null;
  }

  // Document guest preview inside owner workspace is considered guest/ephemeral
  if (root === 'documents' && route.query.get('view') === 'guest-preview') {
    return null;
  }

  let objectId: string | undefined;
  let subview: string | undefined;

  if (root === 'clients') {
    objectId = route.params.client;
  } else if (root === 'projects') {
    objectId = route.params.project;
    subview = route.query.get('tab') || undefined;
  } else if (root === 'documents') {
    objectId = route.params.document;
    subview = route.query.get('view') || undefined;
  } else if (root === 'settings') {
    subview = route.params.section || undefined;
  }

  const rawRoute = typeof window !== 'undefined' ? window.location.hash || '#/home' : '#/home';

  return {
    route: rawRoute,
    root,
    objectId,
    subview,
    timestamp: Date.now(),
  };
}

/**
 * Saves safe workspace context to local storage.
 */
export function recordWorkspaceContext(route: RouteInfo): void {
  if (typeof window === 'undefined') return;
  const context = extractSafeContext(route);
  if (!context) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
  } catch (_e) {}
}

/**
 * Loads the stored workspace context if present.
 */
export function loadStoredWorkspaceContext(): LastWorkspaceContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.route === 'string' && typeof parsed.root === 'string') {
      return parsed;
    }
  } catch (_e) {}
  return null;
}

/**
 * Minimal state shape required to validate existence of referenced records.
 */
export interface RecordValidatorState {
  clients?: Array<{ id: string }>;
  projects?: Array<{ id: string }>;
  documents?: Array<{ id: string }>;
}

/**
 * Validates the last workspace context against the active store records.
 * If valid, returns the target route. If the object was deleted or invalid, returns fallback #/home.
 */
export function resolveSafeWorkspaceRoute(
  context: LastWorkspaceContext | null,
  state: RecordValidatorState
): string {
  if (!context || !context.route || !context.root) {
    return '#/home';
  }

  const { root, objectId, subview, route } = context;

  if (!SAFE_ROOTS.has(root) || UNSAFE_ROOTS.has(root)) {
    return '#/home';
  }

  // Validate client record
  if (root === 'clients' && objectId) {
    const exists = Array.isArray(state.clients) && state.clients.some((c) => c.id === objectId);
    return exists ? route : '#/clients';
  }

  // Validate project record
  if (root === 'projects' && objectId) {
    const exists = Array.isArray(state.projects) && state.projects.some((p) => p.id === objectId);
    if (!exists) return '#/projects';
    return subview ? `#/projects/${objectId}?tab=${subview}` : `#/projects/${objectId}`;
  }

  // Validate document record
  if (root === 'documents' && objectId) {
    const exists = Array.isArray(state.documents) && state.documents.some((d) => d.id === objectId);
    if (!exists) return '#/documents';
    return subview ? `#/documents/${objectId}?view=${subview}` : `#/documents/${objectId}`;
  }

  return route;
}
