import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType>({
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

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [path, setPath] = useState<string>(getCleanPath);

  useEffect(() => {
    const onLocationChange = () => {
      setPath(getCleanPath());
    };

    window.addEventListener('popstate', onLocationChange);
    window.addEventListener('hashchange', onLocationChange);
    return () => {
      window.removeEventListener('popstate', onLocationChange);
      window.removeEventListener('hashchange', onLocationChange);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    if (typeof window === 'undefined') return;
    const target = to.startsWith('/') ? to : `/${to}`;

    // Handle hash anchor on current page
    if (target.includes('#')) {
      const [newPath, hash] = target.split('#');
      if (newPath === getCleanPath() || !newPath) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
    }

    if (getCleanPath() !== target) {
      window.history.pushState({}, '', target);
      setPath(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  return useContext(RouterContext);
}

export function usePath(): string {
  return useContext(RouterContext).path;
}

export function Link({
  href,
  children,
  className = '',
  target,
  rel,
  onClick,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented) return;

    const isExternal = href.startsWith('http') || href.startsWith('mailto:') || target === '_blank';
    if (!isExternal && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}
