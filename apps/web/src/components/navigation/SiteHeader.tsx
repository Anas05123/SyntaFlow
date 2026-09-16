import React, { useState } from 'react';
import { BrandMark } from '../brand/BrandMark';
import { Button } from '../ui/Button';

interface SiteHeaderProps {
  currentPath: string;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ currentPath }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Product', href: '#/product', active: currentPath.startsWith('/product') },
    { label: 'Integrations', href: '#/integrations', active: currentPath.startsWith('/integrations') },
    { label: 'Security', href: '#/security', active: currentPath.startsWith('/security') },
    { label: 'Pricing', href: '#/pricing', active: currentPath.startsWith('/pricing') },
    { label: 'Docs', href: '#/docs', active: currentPath.startsWith('/docs') },
    { label: 'FAQ', href: '#/faq', active: currentPath.startsWith('/faq') },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: 'var(--header-height)',
        backgroundColor: 'rgba(11, 13, 15, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        {/* Left: Brand Mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="#/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} aria-label="Syntaflow Home">
            <BrandMark variant="full" size="md" />
          </a>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '24px',
            }}
            className="desktop-nav"
          >
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  fontSize: '13.5px',
                  fontWeight: 500,
                  color: item.active ? 'var(--cyan)' : 'var(--text-muted)',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'none', alignItems: 'center', gap: '16px' }} className="desktop-actions">
            <a
              href="#/login"
              style={{
                fontSize: '13.5px',
                fontWeight: 500,
                color: currentPath === '/login' ? 'var(--cyan)' : 'var(--text-muted)',
                textDecoration: 'none',
              }}
            >
              Log in
            </a>
            <a
              href="#/download"
              style={{
                fontSize: '13.5px',
                fontWeight: 500,
                color: currentPath === '/download' ? 'var(--cyan)' : 'var(--text-muted)',
                textDecoration: 'none',
              }}
            >
              Download
            </a>
            <Button variant="primary" href="#/download" style={{ padding: '8px 16px', fontSize: '13px' }}>
              Get Syntaflow
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '5px',
              width: '36px',
              height: '36px',
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '8px',
              cursor: 'pointer',
            }}
            className="mobile-toggle"
          >
            <span style={{ width: '100%', height: '1.5px', backgroundColor: 'var(--text)', transition: 'all 0.2s ease' }} />
            <span style={{ width: '100%', height: '1.5px', backgroundColor: 'var(--text)', transition: 'all 0.2s ease' }} />
            <span style={{ width: '100%', height: '1.5px', backgroundColor: 'var(--text)', transition: 'all 0.2s ease' }} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Slide-down */}
      {mobileOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'var(--header-height)',
            left: 0,
            right: 0,
            backgroundColor: 'var(--canvas)',
            borderBottom: '1px solid var(--border)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 16px 32px rgba(0, 0, 0, 0.5)',
          }}
        >
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: '16px',
                fontWeight: 500,
                color: item.active ? 'var(--cyan)' : 'var(--text)',
                textDecoration: 'none',
                padding: '8px 0',
                borderBottom: '1px solid var(--surface-sunken)',
              }}
            >
              {item.label}
            </a>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
            <Button variant="secondary" href="#/login" onClick={() => setMobileOpen(false)} style={{ width: '100%', textAlign: 'center' }}>
              Log in
            </Button>
            <Button variant="primary" href="#/download" onClick={() => setMobileOpen(false)} style={{ width: '100%', textAlign: 'center' }}>
              Get Syntaflow
            </Button>
          </div>
        </div>
      )}

      {/* Responsive Inline Media Queries */}
      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};
