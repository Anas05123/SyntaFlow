/**
 * Hash router.
 *
 * Routes follow the destinations in the IA page of the design file:
 *   /home /clients/:client /projects/:project /tasks /documents/:document
 *   /activity /settings/* /archive
 * The guest surface is a separate tree under /guest/* — guests never inherit
 * the owner navigation.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

export interface RouteInfo {
  path: string;
  segments: string[];
  params: Record<string, string>;
  query: URLSearchParams;
}

function parse(hash: string): RouteInfo {
  const raw = hash.replace(/^#/, '') || '/home';
  const [pathPart, queryPart] = raw.split('?');
  const segments = pathPart.split('/').filter(Boolean);
  const query = new URLSearchParams(queryPart ?? '');
  const params: Record<string, string> = {};

  /* Named segments by position, per route family. */
  if (segments[0] === 'clients' && segments[1]) params.client = segments[1];
  if (segments[0] === 'projects' && segments[1]) params.project = segments[1];
  if (segments[0] === 'documents' && segments[1]) params.document = segments[1];
  if (segments[0] === 'settings' && segments[1]) params.section = segments[1];
  if (segments[0] === 'guest' && segments[1]) params.guest = segments[1];
  if (segments[0] === 'preview' && segments[1]) params.preview = segments[1];
  if (segments[0] === 'preview' && segments[2]) params.previewId = segments[2];

  return { path: pathPart || '/home', segments, params, query };
}

import { recordWorkspaceContext } from './workspaceContext';

export function useRoute(): RouteInfo {
  const [hash, setHash] = useState(() => window.location.hash || '#/home');

  useEffect(() => {
    const onChange = () => {
      const current = window.location.hash || '#/home';
      setHash(current);
      recordWorkspaceContext(parse(current));
    };
    recordWorkspaceContext(parse(window.location.hash || '#/home'));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return useMemo(() => parse(hash), [hash]);
}

// Application history stack (Section 8: History Controls)
let historyStack: string[] = typeof window !== 'undefined' ? [window.location.hash || '#/home'] : ['#/home'];
let historyIndex = 0;
let isNavigatingHistory = false;

export function navigate(to: string): void {
  const next = to.startsWith('#') ? to : `#${to}`;
  if (typeof window === 'undefined') return;
  if (window.location.hash === next) return;
  if (!isNavigatingHistory) {
    historyStack = historyStack.slice(0, historyIndex + 1);
    historyStack.push(next);
    historyIndex = historyStack.length - 1;
  }
  window.location.hash = next;
}

export function goBack(): void {
  if (typeof window === 'undefined') return;
  if (historyIndex > 0) {
    historyIndex -= 1;
    isNavigatingHistory = true;
    window.location.hash = historyStack[historyIndex];
    isNavigatingHistory = false;
  }
}

export function goForward(): void {
  if (typeof window === 'undefined') return;
  if (historyIndex < historyStack.length - 1) {
    historyIndex += 1;
    isNavigatingHistory = true;
    window.location.hash = historyStack[historyIndex];
    isNavigatingHistory = false;
  }
}

export function useHistory() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const onHash = () => setTick((t) => t + 1);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return {
    canGoBack: historyIndex > 0,
    canGoForward: historyIndex < historyStack.length - 1,
    goBack,
    goForward,
  };
}

export function useNavigate() {
  return useCallback((to: string) => navigate(to), []);
}

/** Build a project-workspace URL for a given tab. */
export function projectUrl(projectId: string, tab?: string): string {
  return tab ? `#/projects/${projectId}?tab=${tab}` : `#/projects/${projectId}`;
}

/** Build a document URL for a given view. */
export function documentUrl(documentId: string, view?: string): string {
  return view ? `#/documents/${documentId}?view=${view}` : `#/documents/${documentId}`;
}
