import React, { useState, useEffect, useRef } from 'react';
import { BrandMark } from '../brand/BrandMark';
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

  // Prevent background scroll when mobile nav is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isDocsHost = typeof window !== 'undefined' && window.location.hostname === 'docs.syntaflow.tech';
  const mainSiteBase = isDocsHost ? 'https://syntaflow.tech' : '';

  // Clean, minimal IA: Features, Integrations, Pricing
  const navLinks = [
    { label: 'Features', href: `${mainSiteBase}/product`, active: currentPath.startsWith('/product') },
    { label: 'Integrations', href: `${mainSiteBase}/integrations`, active: currentPath.startsWith('/integrations') },
    { label: 'Pricing', href: `${mainSiteBase}/pricing`, active: currentPath.startsWith('/pricing') },
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
        backgroundColor: 'rgba(247, 249, 253, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          <Link href={isDocsHost ? 'https://syntaflow.tech' : '/'} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} aria-label="Syntaflow Home">
            <BrandMark variant="full" size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '32px',
            }}
            className="desktop-nav"
          >
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  fontSize: '14.5px',
                  fontWeight: item.active ? 600 : 500,
                  color: item.active ? 'var(--cobalt)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  transition: 'color var(--transition-fast)',
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Actions: ONE Dominant Action */}
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
                    gap: '10px',
                    padding: '6px 14px 6px 8px',
                    borderRadius: 'var(--radius-button)',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px',
                    fontWeight: 500,
                    transition: 'all var(--transition-fast)',
                  }}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--cobalt-subtle)',
                      border: '1px solid var(--cobalt-border)',
                      color: 'var(--cobalt)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {userInitial}
                  </div>
                  <span>{displayName}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginLeft: '2px' }}>▾</span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '230px',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      padding: '8px 0',
                      zIndex: 110,
                      animation: 'fadeIn 0.15s ease',
                    }}
                  >
                    <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.name || 'Syntaflow Operator'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.email}
                      </div>
                    </div>

                    <Link
                      href={typeof window !== 'undefined' && window.location.hostname.includes('syntaflow.tech') ? 'https://app.syntaflow.tech' : '/account'}
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        fontSize: '13.5px',
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                      }}
                      className="nav-dropdown-item"
                    >
                      <span>Open Account Portal</span>
                    </Link>

                    <Link
                      href={typeof window !== 'undefined' && window.location.hostname.includes('syntaflow.tech') ? 'https://app.syntaflow.tech/downloads' : '/account/downloads'}
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        fontSize: '13.5px',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                      }}
                      className="nav-dropdown-item"
                    >
                      <span>Downloads & Desktop</span>
                    </Link>

                    <div style={{ height: '1px', backgroundColor: 'var(--divider)', margin: '6px 0' }} />

                    <button
                      type="button"
                      onClick={handleSignOut}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        padding: '10px 16px',
                        fontSize: '13.5px',
                        color: 'var(--risk)',
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
              /* Single Dominant Sign In Action */
              <Link
                href={isDocsHost ? 'https://syntaflow.tech/login' : '/login'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 20px',
                  borderRadius: 'var(--radius-button)',
                  backgroundColor: 'var(--cobalt)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(47, 107, 250, 0.25)',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--cobalt-hover)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--cobalt)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-nav-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div
          id="mobile-nav-drawer"
          style={{
            position: 'fixed',
            top: 'var(--header-height)',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(247, 249, 253, 0.98)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            zIndex: 99,
            animation: 'fadeIn 0.2s ease',
            borderTop: '1px solid var(--border)',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: item.active ? 'var(--cobalt)' : 'var(--text-primary)',
                  textDecoration: 'none',
                  padding: '8px 0',
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {isAuthenticated ? (
              <>
                <Link
                  href={typeof window !== 'undefined' && window.location.hostname.includes('syntaflow.tech') ? 'https://app.syntaflow.tech' : '/account'}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    borderRadius: 'var(--radius-button)',
                    backgroundColor: 'var(--cobalt)',
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(47, 107, 250, 0.25)',
                  }}
                >
                  Open Account Portal
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-button)',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    color: 'var(--risk)',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href={isDocsHost ? 'https://syntaflow.tech/login' : '/login'}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  borderRadius: 'var(--radius-button)',
                  backgroundColor: 'var(--cobalt)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(47, 107, 250, 0.25)',
                }}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Responsive media query styles */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-nav-toggle { display: none !important; }
        }
        .nav-dropdown-item:hover {
          background-color: rgba(255, 255, 255, 0.06);
        }
      `}</style>
    </header>
  );
};
