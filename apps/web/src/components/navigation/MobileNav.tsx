import React, { useEffect, useState } from 'react';
import { Link } from '../../router/Router';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { PRODUCT_NAV, SOLUTIONS_NAV, COMPANY_NAV } from '../../content/navData';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        backgroundColor: 'var(--color-canvas)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        padding: 'var(--space-6)',
      }}
    >
      {/* Top bar with Close */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 'var(--space-6)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
          }}
        >
          Menu
        </span>
        <button
          onClick={onClose}
          aria-label="Close navigation drawer"
          style={{
            display: 'flex',
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Nav List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-6)' }}>
        {/* Product Accordion */}
        <div>
          <button
            onClick={() => toggleSection('product')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-4) 0',
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              textAlign: 'left',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <span>Product</span>
            <span>{expandedSection === 'product' ? '−' : '+'}</span>
          </button>
          {expandedSection === 'product' && (
            <div style={{ padding: 'var(--space-3) 0 var(--space-4) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {PRODUCT_NAV.map((item) => (
                <Link key={item.href} href={item.href} onClick={onClose} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.label}</span>
                    {item.badge && <StatusBadge status={item.badge} size="sm" />}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0 }}>{item.description}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Solutions Accordion */}
        <div>
          <button
            onClick={() => toggleSection('solutions')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-4) 0',
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              textAlign: 'left',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <span>Solutions</span>
            <span>{expandedSection === 'solutions' ? '−' : '+'}</span>
          </button>
          {expandedSection === 'solutions' && (
            <div style={{ padding: 'var(--space-3) 0 var(--space-4) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {SOLUTIONS_NAV.map((item) => (
                <Link key={item.href} href={item.href} onClick={onClose} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.label}</span>
                    {item.badge && <StatusBadge status={item.badge} size="sm" />}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0 }}>{item.description}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Direct Links */}
        <Link
          href="/pricing"
          onClick={onClose}
          style={{
            padding: 'var(--space-4) 0',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}
        >
          Pricing & Economics
        </Link>

        <Link
          href="/security"
          onClick={onClose}
          style={{
            padding: 'var(--space-4) 0',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}
        >
          Security & Trust
        </Link>

        <Link
          href="/faq"
          onClick={onClose}
          style={{
            padding: 'var(--space-4) 0',
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}
        >
          FAQ
        </Link>

        {/* Company Accordion */}
        <div>
          <button
            onClick={() => toggleSection('company')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-4) 0',
              fontSize: '1.125rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              textAlign: 'left',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            <span>Company</span>
            <span>{expandedSection === 'company' ? '−' : '+'}</span>
          </button>
          {expandedSection === 'company' && (
            <div style={{ padding: 'var(--space-3) 0 var(--space-4) var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {COMPANY_NAV.map((item) => (
                <Link key={item.href} href={item.href} onClick={onClose} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.label}</span>
                    {item.badge && <StatusBadge status={item.badge} size="sm" />}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0 }}>{item.description}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action CTAs */}
      <div style={{ marginTop: 'auto', paddingTop: 'var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Button href="/download" variant="primary" size="lg" fullWidth onClick={onClose}>
          Download Desktop App (v0.1)
        </Button>
        <Button href="/contact" variant="secondary" size="md" fullWidth onClick={onClose}>
          Contact & Inquiries
        </Button>
      </div>
    </div>
  );
};
