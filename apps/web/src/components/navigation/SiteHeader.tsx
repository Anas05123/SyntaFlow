import React, { useState, useEffect, useRef } from 'react';
import { Link, usePath } from '../../router/Router';
import { SyntaflowLogo } from '../brand/SyntaflowLogo';
import { Button } from '../ui/Button';
import { MegaMenu } from './MegaMenu';
import { MobileNav } from './MobileNav';
import { PRODUCT_NAV, SOLUTIONS_NAV, COMPANY_NAV, RESOURCES_NAV } from '../../content/navData';

export const SiteHeader: React.FC = () => {
  const path = usePath();
  const [activeMenu, setActiveMenu] = useState<'product' | 'solutions' | 'company' | 'resources' | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on path change
  useEffect(() => {
    setActiveMenu(null);
    setMobileNavOpen(false);
  }, [path]);

  const toggleMenu = (menu: 'product' | 'solutions' | 'company' | 'resources') => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <header
      ref={navContainerRef}
      role="banner"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        height: 'var(--header-height)',
        backgroundColor: scrolled ? 'var(--material-header)' : 'rgba(8, 11, 15, 0.65)',
        backdropFilter: 'var(--material-blur)',
        WebkitBackdropFilter: 'var(--material-blur)',
        borderBottom: `1px solid ${scrolled ? 'var(--color-border)' : 'transparent'}`,
        transition: 'all var(--duration-fast) var(--ease-spring)',
      }}
    >
      <div
        className="sf-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        {/* Left: Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <SyntaflowLogo height={30} />

          {/* Center/Left: Primary Desktop Navigation */}
          <nav
            role="navigation"
            aria-label="Main Navigation"
            className="sf-desktop-nav"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            {/* Product Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                aria-expanded={activeMenu === 'product'}
                onClick={() => toggleMenu('product')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.5rem 0.875rem',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: activeMenu === 'product' || path.startsWith('/product') ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'color var(--duration-fast) var(--ease-spring)',
                  cursor: 'pointer',
                }}
              >
                <span>Product</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    transform: activeMenu === 'product' ? 'rotate(180deg)' : 'none',
                    transition: 'transform var(--duration-fast)',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <MegaMenu
                items={PRODUCT_NAV}
                isOpen={activeMenu === 'product'}
                onClose={() => setActiveMenu(null)}
                title="Product"
              />
            </div>

            {/* Solutions Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                aria-expanded={activeMenu === 'solutions'}
                onClick={() => toggleMenu('solutions')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.5rem 0.875rem',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: activeMenu === 'solutions' || path.startsWith('/solutions') ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'color var(--duration-fast) var(--ease-spring)',
                  cursor: 'pointer',
                }}
              >
                <span>Solutions</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    transform: activeMenu === 'solutions' ? 'rotate(180deg)' : 'none',
                    transition: 'transform var(--duration-fast)',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <MegaMenu
                items={SOLUTIONS_NAV}
                isOpen={activeMenu === 'solutions'}
                onClose={() => setActiveMenu(null)}
                title="Solutions"
              />
            </div>

            {/* Security Direct Link */}
            <Link
              href="/security"
              style={{
                padding: '0.5rem 0.875rem',
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: path.startsWith('/security') || path === '/privacy' || path === '/data-handling' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                borderRadius: 'var(--radius-md)',
                transition: 'color var(--duration-fast)',
              }}
            >
              Security
            </Link>

            {/* Resources Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                aria-expanded={activeMenu === 'resources'}
                onClick={() => toggleMenu('resources')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.5rem 0.875rem',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: activeMenu === 'resources' || path === '/faq' || path === '/changelog' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'color var(--duration-fast) var(--ease-spring)',
                  cursor: 'pointer',
                }}
              >
                <span>Resources</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    transform: activeMenu === 'resources' ? 'rotate(180deg)' : 'none',
                    transition: 'transform var(--duration-fast)',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <MegaMenu
                items={RESOURCES_NAV}
                isOpen={activeMenu === 'resources'}
                onClose={() => setActiveMenu(null)}
                title="Resources"
              />
            </div>

            {/* Company Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                aria-expanded={activeMenu === 'company'}
                onClick={() => toggleMenu('company')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.5rem 0.875rem',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: activeMenu === 'company' || path === '/about' || path === '/roadmap' || path === '/contact' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'color var(--duration-fast) var(--ease-spring)',
                  cursor: 'pointer',
                }}
              >
                <span>Company</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    transform: activeMenu === 'company' ? 'rotate(180deg)' : 'none',
                    transition: 'transform var(--duration-fast)',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <MegaMenu
                items={COMPANY_NAV}
                isOpen={activeMenu === 'company'}
                onClose={() => setActiveMenu(null)}
                title="Company"
              />
            </div>
          </nav>
        </div>

        {/* Right side: Desktop CTA */}
        <div
          className="sf-desktop-cta"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <Button href="/contact" variant="ghost" size="sm">
            Contact
          </Button>
          <Button
            href="/download"
            variant="primary"
            size="sm"
            icon={
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            }
          >
            Get Desktop App
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          aria-label="Open mobile navigation"
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen(true)}
          className="sf-mobile-trigger"
          style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-surface-raised)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <style>{`
        @media (max-width: 960px) {
          .sf-desktop-nav, .sf-desktop-cta {
            display: none !important;
          }
          .sf-mobile-trigger {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};
