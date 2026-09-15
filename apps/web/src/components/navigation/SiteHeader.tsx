import React, { useState, useEffect, useRef } from 'react';
import { BrandMark } from '../brand/BrandMark';
import { Button } from '../ui/Button';
import { PRIMARY_NAV } from '../../content/navData';
import { MobileNav } from './MobileNav';

interface SiteHeaderProps {
  currentPath: string;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ currentPath }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
        setMobileOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header
      ref={navRef}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: 'var(--header-height)',
        backgroundColor: 'var(--surface-glass)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--edge)',
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
        {/* Brand Mark */}
        <a href="#/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} aria-label="Syntaflow Home">
          <BrandMark variant="full" size="md" />
        </a>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-8)',
          }}
          className="desktop-nav"
          aria-label="Main Navigation"
        >
          {PRIMARY_NAV.map((group) => {
            const hasItems = Boolean(group.items && group.items.length > 0);
            const isOpen = activeMenu === group.label;
            const isCurrent = currentPath.startsWith(group.href || '');

            if (!hasItems) {
              return (
                <a
                  key={group.label}
                  href={`#${group.href}`}
                  style={{
                    padding: '8px 14px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: isCurrent ? 'var(--text)' : 'var(--text-muted)',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'color var(--transition-fast)',
                  }}
                  className="nav-link"
                >
                  {group.label}
                </a>
              );
            }

            return (
              <div key={group.label} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setActiveMenu(isOpen ? null : group.label)}
                  aria-expanded={isOpen}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '8px 14px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: isOpen || isCurrent ? 'var(--text)' : 'var(--text-muted)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'color var(--transition-fast)',
                  }}
                  className="nav-link"
                >
                  {group.label}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform var(--transition-fast)',
                    }}
                  >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: 0,
                      width: '320px',
                      backgroundColor: 'var(--surface-raised)',
                      border: '1px solid var(--edge)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      padding: 'var(--space-8)',
                      zIndex: 110,
                    }}
                  >
                    {group.items?.map((item) => (
                      <a
                        key={item.href}
                        href={`#${item.href}`}
                        onClick={() => setActiveMenu(null)}
                        style={{
                          display: 'block',
                          padding: '10px 12px',
                          borderRadius: 'var(--radius-sm)',
                          textDecoration: 'none',
                          transition: 'background-color var(--transition-fast)',
                        }}
                        className="dropdown-item"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)' }}>
                            {item.label}
                          </span>
                          {item.tag && (
                            <span
                              style={{
                                fontSize: '9.5px',
                                fontFamily: 'var(--font-mono)',
                                color: item.tag === 'PLANNED' ? 'var(--cyan)' : 'var(--text-metadata)',
                                border: '1px solid var(--edge)',
                                padding: '1px 5px',
                                borderRadius: '3px',
                              }}
                            >
                              {item.tag}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <div style={{ fontSize: '12px', color: 'var(--text-metadata)', lineHeight: 1.4 }}>
                            {item.description}
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-12)' }}>
          <Button href="#/product" variant="primary" size="sm">
            Download Preview
          </Button>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close Navigation' : 'Open Navigation'}
            style={{
              display: 'none',
              padding: '8px',
              backgroundColor: 'transparent',
              border: '1px solid var(--edge)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text)',
              cursor: 'pointer',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {mobileOpen ? (
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Embedded Component Styles */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: inline-flex !important;
          }
        }
        .nav-link:hover {
          color: var(--text) !important;
        }
        .dropdown-item:hover {
          background-color: var(--surface-subtle) !important;
        }
      `}</style>
    </header>
  );
};
