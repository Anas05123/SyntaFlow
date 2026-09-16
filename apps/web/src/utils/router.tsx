import { useState, useEffect } from 'react';
export { Link } from '../components/ui/Link';

export function getCleanPath(): string {
  if (typeof window === 'undefined') return '/';
  const hash = window.location.hash.replace(/^#/, '');
  if (hash && hash !== '/') {
    // If a hash route is detected, normalize it
    return hash.replace(/\/+$/, '') || '/';
  }
  const pathname = window.location.pathname;
  if (pathname && pathname !== '/' && pathname !== '/index.html') {
    return pathname.replace(/\/+$/, '');
  }
  return '/';
}

export function navigateTo(newPath: string): void {
  if (typeof window === 'undefined') return;
  const clean = newPath.replace(/^#/, '') || '/';
  if (window.location.pathname !== clean) {
    window.history.pushState(null, '', clean);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
  window.scrollTo(0, 0);
}

export function usePath(): [string, (path: string) => void] {
  const [path, setPath] = useState<string>(getCleanPath());

  useEffect(() => {
    const handleNavigation = () => {
      setPath(getCleanPath());
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleNavigation);
    window.addEventListener('popstate', handleNavigation);
    return () => {
      window.removeEventListener('hashchange', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  return [path, navigateTo];
}
