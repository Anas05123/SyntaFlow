import { useState, useEffect } from 'react';

export function usePath(): [string, (path: string) => void] {
  const getPath = () => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || '/';
  };

  const [path, setPath] = useState<string>(getPath());

  useEffect(() => {
    const handleHashChange = () => {
      setPath(getPath());
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (newPath: string) => {
    window.location.hash = newPath;
  };

  return [path, navigate];
}
