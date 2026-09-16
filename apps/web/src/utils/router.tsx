import { useState, useEffect } from 'react';

export function usePath(): [string, (path: string) => void] {
  const getPath = () => {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash) return hash;
    const pathname = window.location.pathname;
    if (pathname && pathname !== '/' && pathname !== '/index.html') {
      return pathname.replace(/\/+$/, '');
    }
    return '/';
  };

  const [path, setPath] = useState<string>(getPath());

  useEffect(() => {
    const handleNavigation = () => {
      setPath(getPath());
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleNavigation);
    window.addEventListener('popstate', handleNavigation);
    return () => {
      window.removeEventListener('hashchange', handleNavigation);
      window.removeEventListener('popstate', handleNavigation);
    };
  }, []);

  const navigate = (newPath: string) => {
    window.location.hash = newPath;
  };

  return [path, navigate];
}
