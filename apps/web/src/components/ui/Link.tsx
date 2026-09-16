import React from 'react';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  className?: string;
  children?: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ href, onClick, children, ...rest }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    // Allow default browser behavior for modifier keys, right clicks, or external URLs
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      rest.target === '_blank'
    ) {
      return;
    }

    // Handle internal routes
    if (href.startsWith('/') && !href.startsWith('//')) {
      e.preventDefault();
      if (window.location.pathname !== href) {
        window.history.pushState(null, '', href);
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.scrollTo(0, 0);
      }
    } else if (href.startsWith('#/')) {
      // Cleanly normalize legacy hash links to clean pathname
      e.preventDefault();
      const cleanPath = href.replace(/^#/, '');
      window.history.pushState(null, '', cleanPath);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo(0, 0);
    }
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};
