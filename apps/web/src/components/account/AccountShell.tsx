import React, { useState } from 'react';
import { BrandMark } from '../brand/BrandMark';
import { Link } from '../ui/Link';
import { useAuth } from '../../services/auth/AuthContext';

interface AccountShellProps {
  currentSubpath: string;
  children: React.ReactNode;
}

export const AccountShell: React.FC<AccountShellProps> = ({ currentSubpath, children }) => {
  const { user, plan, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await logout();
    window.location.href = '/login';
  };

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Home', href: '/account', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { label: 'Profile', href: '/account/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { label: 'Plan & Billing', href: '/account/plan', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
        { label: 'Active Sessions', href: '/account/sessions', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
      ],
    },
    {
      title: 'PRODUCT',
      items: [
        { label: 'Downloads', href: '/account/downloads', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' },
        { label: 'Desktop Connection', href: '/account/desktop', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
      ],
    },
    {
      title: 'RESOURCES',
      items: [
        { label: 'Documentation', href: '/docs', external: true, icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
        { label: 'Tutorials', href: '/account/tutorials', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
      ],
    },
  ];

  const userInitial = (user?.name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#08090b',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
      }}
    >
      {/* Mobile Top Header */}
      <div
        className="account-mobile-topbar"
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          backgroundColor: '#0d0f13',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          zIndex: 50,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
        }}
      >
        <Link href="/account" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <BrandMark variant="full" size="sm" />
        </Link>

        <button
          type="button"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            padding: '8px',
            cursor: 'pointer',
          }}
          aria-label="Toggle navigation menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Account Sidebar (Modeled after user reference image) */}
      <aside
        className={`account-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}
        style={{
          width: '260px',
          backgroundColor: '#0b0d10',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 40,
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.25rem 1.25rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }} title="Return to syntaflow.tech">
            <BrandMark variant="full" size="sm" />
          </Link>
        </div>

        {/* Navigation Categories */}
        <nav style={{ flex: 1, padding: '0.75rem 0.75rem', overflowY: 'auto' }}>
          {navSections.map((section) => (
            <div key={section.title} style={{ marginBottom: '1.25rem' }}>
              <div
                style={{
                  fontSize: '10.5px',
                  fontWeight: 600,
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '0 0.625rem 0.375rem',
                }}
              >
                {section.title}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {section.items.map((item) => {
                  const isActive = currentSubpath === item.href || (item.href !== '/account' && currentSubpath.startsWith(item.href));
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '7px 10px',
                        borderRadius: '8px',
                        fontSize: '13.5px',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#ffffff' : 'var(--text-secondary)',
                        backgroundColor: isActive ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
                        border: isActive ? '1px solid rgba(0, 242, 254, 0.3)' : '1px solid transparent',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={isActive ? '#00f2fe' : 'currentColor'}
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d={item.icon} />
                      </svg>
                      <span>{item.label}</span>
                      {item.external && <span style={{ fontSize: '11px', opacity: 0.6, marginLeft: 'auto' }}>↗</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Desktop Teaser Card in Sidebar */}
        <div style={{ padding: '0 0.75rem 0.75rem' }}>
          <div
            style={{
              padding: '12px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(0, 242, 254, 0.08)',
                  border: '1px solid rgba(0, 242, 254, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 0 12px rgba(0, 242, 254, 0.2)',
                }}
              >
                <img
                  src="/brand/LogoIcon_WBG.png"
                  alt="Syntaflow Desktop"
                  style={{
                    width: '22px',
                    height: '22px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 2px 6px rgba(0, 242, 254, 0.4))',
                  }}
                />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', lineHeight: 1.2 }}>
                  Syntaflow Desktop
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  Windows 10 / 11 Preview
                </div>
              </div>
            </div>
            <Link
              href="/account/downloads"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '9999px',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span>↓</span>
              <span>Download</span>
            </Link>
          </div>
        </div>

        {/* Bottom User Profile Widget (Modeled after user reference) */}
        <div
          style={{
            padding: '0.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
          }}
        >
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: userMenuOpen ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background-color 0.15s ease',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 242, 254, 0.15)',
                border: '1px solid rgba(0, 242, 254, 0.4)',
                color: '#00f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12.5px',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {userInitial}
            </div>

            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'Operator'}
              </div>
              <div style={{ fontSize: '11px', color: '#93c5fd' }}>
                {plan?.planId === 'preview' ? 'Preview Plan' : 'Free Tier'}
              </div>
            </div>

            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', flexShrink: 0 }}>
              {userMenuOpen ? '▲' : '▼'}
            </span>
          </button>

          {/* User Popover Menu */}
          {userMenuOpen && (
            <div
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 6px)',
                left: '0.75rem',
                right: '0.75rem',
                backgroundColor: '#11141a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.8)',
                padding: '6px 0',
                zIndex: 60,
                animation: 'fadeIn 0.15s ease',
              }}
            >
              <div style={{ padding: '8px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Signed in as</div>
                <div style={{ fontSize: '12.5px', fontWeight: 500, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email}
                </div>
              </div>

              <Link
                href="/account/profile"
                onClick={() => setUserMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '8px 14px',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                }}
              >
                Profile & Security
              </Link>

              <Link
                href="/account/plan"
                onClick={() => setUserMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '8px 14px',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                }}
              >
                Plan & Usage
              </Link>

              <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '4px 0' }} />

              <button
                type="button"
                onClick={handleSignOut}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  padding: '8px 14px',
                  fontSize: '13px',
                  color: '#f87171',
                  cursor: 'pointer',
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        <main
          className="account-main-content"
          style={{
            flex: 1,
            padding: '2.5rem 3rem',
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .account-mobile-topbar { display: flex !important; }
          .account-sidebar {
            position: fixed !important;
            top: 60px !important;
            left: -260px !important;
            height: calc(100vh - 60px) !important;
            transition: left 0.25s ease !important;
          }
          .account-sidebar.mobile-open {
            left: 0 !important;
          }
          .account-main-content {
            padding: 5rem 1.25rem 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};
