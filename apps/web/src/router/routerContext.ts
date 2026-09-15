import { createContext, useContext } from 'react';

export interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
}

export const RouterContext = createContext<RouterContextType>({
  path: '/',
  navigate: () => {},
});

export function getCleanPath(): string {
  if (typeof window === 'undefined') return '/';
  // Support hash routes for static fallback (e.g., #/security)
  if (window.location.hash.startsWith('#/')) {
    return window.location.hash.slice(1).split('?')[0];
  }
  return window.location.pathname || '/';
}

export function useRouter(): RouterContextType {
  return useContext(RouterContext);
}

export function usePath(): string {
  return useContext(RouterContext).path;
}
