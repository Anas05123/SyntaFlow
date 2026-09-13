import { describe, expect, it } from 'vitest';
import {
  extractSafeContext,
  resolveSafeWorkspaceRoute,
  SAFE_ROOTS,
  UNSAFE_ROOTS,
  type LastWorkspaceContext,
} from '../../apps/desktop/src/app/workspaceContext';
import type { RouteInfo } from '../../apps/desktop/src/app/router';

function mockRoute(hash: string): RouteInfo {
  const raw = hash.replace(/^#/, '') || '/home';
  const [pathPart, queryPart] = raw.split('?');
  const segments = pathPart.split('/').filter(Boolean);
  const query = new URLSearchParams(queryPart ?? '');
  const params: Record<string, string> = {};

  if (segments[0] === 'clients' && segments[1]) params.client = segments[1];
  if (segments[0] === 'projects' && segments[1]) params.project = segments[1];
  if (segments[0] === 'documents' && segments[1]) params.document = segments[1];
  if (segments[0] === 'settings' && segments[1]) params.section = segments[1];

  return { path: pathPart || '/home', segments, params, query };
}

describe('Workspace Session Context Restoration', () => {
  const mockState = {
    clients: [{ id: 'cl-harbor' }, { id: 'cl-northgate' }],
    projects: [{ id: 'pr-identity' }, { id: 'pr-website' }],
    documents: [{ id: 'doc-guidelines' }, { id: 'doc-proposal' }],
  };

  it('identifies safe roots vs unsafe ephemeral routes', () => {
    expect(SAFE_ROOTS.has('home')).toBe(true);
    expect(SAFE_ROOTS.has('projects')).toBe(true);
    expect(SAFE_ROOTS.has('documents')).toBe(true);
    expect(SAFE_ROOTS.has('tasks')).toBe(true);

    expect(UNSAFE_ROOTS.has('auth')).toBe(true);
    expect(UNSAFE_ROOTS.has('signup')).toBe(true);
    expect(UNSAFE_ROOTS.has('new-project')).toBe(true);
    expect(UNSAFE_ROOTS.has('share')).toBe(true);
    expect(UNSAFE_ROOTS.has('guest')).toBe(true);
  });

  it('extracts safe context for persistent routes', () => {
    const route = mockRoute('#/projects/pr-identity?tab=work');
    const ctx = extractSafeContext(route);

    expect(ctx).not.toBeNull();
    expect(ctx?.root).toBe('projects');
    expect(ctx?.objectId).toBe('pr-identity');
    expect(ctx?.subview).toBe('work');
  });

  it('rejects unsafe routes from being saved into session memory', () => {
    expect(extractSafeContext(mockRoute('#/auth'))).toBeNull();
    expect(extractSafeContext(mockRoute('#/signup'))).toBeNull();
    expect(extractSafeContext(mockRoute('#/new-project'))).toBeNull();
    expect(extractSafeContext(mockRoute('#/share?document=doc-1'))).toBeNull();
    expect(extractSafeContext(mockRoute('#/guest/review?token=xyz'))).toBeNull();
  });

  it('restores valid referenced project and document routes', () => {
    const projCtx: LastWorkspaceContext = {
      route: '#/projects/pr-identity?tab=documents',
      root: 'projects',
      objectId: 'pr-identity',
      subview: 'documents',
    };
    expect(resolveSafeWorkspaceRoute(projCtx, mockState)).toBe('#/projects/pr-identity?tab=documents');

    const docCtx: LastWorkspaceContext = {
      route: '#/documents/doc-guidelines?view=history',
      root: 'documents',
      objectId: 'doc-guidelines',
      subview: 'history',
    };
    expect(resolveSafeWorkspaceRoute(docCtx, mockState)).toBe('#/documents/doc-guidelines?view=history');
  });

  it('falls back safely when referenced object was deleted or does not exist', () => {
    // Project was deleted by another action or corrupted
    const deletedProjCtx: LastWorkspaceContext = {
      route: '#/projects/pr-deleted?tab=work',
      root: 'projects',
      objectId: 'pr-deleted',
      subview: 'work',
    };
    expect(resolveSafeWorkspaceRoute(deletedProjCtx, mockState)).toBe('#/projects');

    // Document was deleted
    const deletedDocCtx: LastWorkspaceContext = {
      route: '#/documents/doc-vanished',
      root: 'documents',
      objectId: 'doc-vanished',
    };
    expect(resolveSafeWorkspaceRoute(deletedDocCtx, mockState)).toBe('#/documents');

    // Null or corrupted context falls back to #/home
    expect(resolveSafeWorkspaceRoute(null, mockState)).toBe('#/home');
  });
});
