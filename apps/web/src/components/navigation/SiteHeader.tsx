import React, { useState, useEffect, useRef } from 'react';
import { BrandMark } from '../brand/BrandMark';
import { Button } from '../ui/Button';
import { Link } from '../ui/Link';
import { useAuth } from '../../services/auth/AuthContext';

interface SiteHeaderProps {
  currentPath: string;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ currentPath }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile nav and dropdown on Escape key press (WCAG 2.1)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const navLinks = [
    { label: 'Product', href: '/product', active: currentPath.startsWith('/product') },
    { label: 'Integrations', href: '/integrations', active: currentPath.startsWith('/integrations') },
    { label: 'Security', href: '/security', active: currentPath.startsWith('/security') },
    { label: 'Pricing', href: '/pricing', active: currentPath.startsWith('/pricing') },
    { label: 'Docs', href: '/docs', active: currentPath.startsWith('/docs') },
    { label: 'FAQ', href: '/faq', active: currentPath.startsWith('/faq') },
  ];

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await logout();
    window.location.href = '/';
  };

  const userInitial = (user?.name || user?.email || 'U').charAt(0).toUpperCase();
  const displayName = user?.name ? user.name.split(' ')[0] : 'Account';

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
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} aria-label="Syntaflow Home">
            <BrandMark variant="full" size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '24px',
            }}
            className="desktop-nav"
          >
            {navLinks.map((item) => (
              <Link
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
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'none', alignItems: 'center', gap: '16px' }} className="desktop-actions">
            {isAuthenticated ? (
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '5px 12px 5px 6px',
                    borderRadius: '20px',
                    backgroundColor: 'var(--surface-raised)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    color: 'var(--text)',
                    fontSize: '13px',
                    fontWeight: 500,
                  }}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(6, 182, 212, 0.2)',
                      border: '1px solid rgba(6, 182, 212, 0.4)',
                      color: 'var(--cyan)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    {userInitial}
                  </div>
                  <span>{displayName}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '2px' }}>▼</span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '220px',
                      backgroundColor: 'var(--surface-raised)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6)',
                      padding: '8px 0',
                      zIndex: 110,
                    }}
                  >
                    <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.name || 'Syntaflow Operator'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.email}
                      </div>
                    </div>

                    <Link
                      href="/account"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'block',
                        padding: '8px 16px',
                        fontSize: '13px',
                        color: 'var(--text)',
                        textDecoration: 'none',
                      }}
                      className="nav-dropdown-item"
                    >
                      Account & Settings
                    </Link>

                    <Link
                      href="/download"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'block',
                        padding: '8px 16px',
                        fontSize: '13px',
                        color: 'var(--text)',
                        textDecoration: 'none',
                      }}
                      className="nav-dropdown-item"
                    >
                      Downloads & Desktop
                    </Link>

                    <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '4px 0' }} />

                    <button
                      type="button"
                      onClick={handleSignOut}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        padding: '8px 16px',
                        fontSize: '13px',
                        color: '#F87171',
                        cursor: 'pointer',
                      }}
                      className="nav-dropdown-item"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    fontSize: '13.5px',
                    fontWeight: 500,
                    color: currentPath === '/login' ? 'var(--cyan)' : 'var(--text-muted)',
                    textDecoration: 'none',
                  }}
                >
                  Log in
                </Link>
                <Link
                  href="/download"
                  style={{
                    fontSize: '13.5px',
                    fontWeight: 500,
                    color: currentPath === '/download' ? 'var(--cyan)' : 'var(--text-muted)',
                    textDecoration: 'none',
                  }}
                >
                  Download
                </Link>
                <Button variant="primary" href="/download" style={{ padding: '8px 16px', fontSize: '13px' }}>
                  Get Syntaflow
                </Button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
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
          id="mobile-navigation"
          role="navigation"
          aria-label="Mobile Navigation"
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
            <Link
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
            </Link>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
            {isAuthenticated ? (
              <>
                <Button variant="secondary" href="/account" onClick={() => setMobileOpen(false)} style={{ width: '100%', textAlign: 'center' }}>
                  Account & Settings
                </Button>
                <Button variant="secondary" onClick={handleSignOut} style={{ width: '100%', textAlign: 'center', color: '#F87171' }}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" href="/login" onClick={() => setMobileOpen(false)} style={{ width: '100%', textAlign: 'center' }}>
                  Log in
                </Button>
                <Button variant="primary" href="/download" onClick={() => setMobileOpen(false)} style={{ width: '100%', textAlign: 'center' }}>
                  Get Syntaflow
                </Button>
              </>
            )}
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
        .nav-dropdown-item:hover {
          background-color: var(--surface-sunken);
        }
      `}</style>
    </header>
  );
};
