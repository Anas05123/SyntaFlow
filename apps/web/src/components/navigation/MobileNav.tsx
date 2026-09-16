import React from 'react';
import { PRIMARY_NAV } from '../../content/navData';
import { Button } from '../ui/Button';
import { Link } from '../ui/Link';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 'var(--header-height)',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--canvas)',
        borderTop: '1px solid var(--edge)',
        zIndex: 99,
        padding: 'var(--space-24)',
        overflowY: 'auto',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-24)' }}>
        {PRIMARY_NAV.map((group) => (
          <div key={group.label} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            <div
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-metadata)',
                paddingBottom: '4px',
                borderBottom: '1px solid var(--edge-subtle)',
              }}
            >
              {group.label}
            </div>

            {group.items ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', paddingLeft: '8px' }}>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      fontSize: '14.5px',
                      color: 'var(--text)',
                      textDecoration: 'none',
                    }}
                  >
                    <span>{item.label}</span>
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
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                href={group.href || '/'}
                onClick={onClose}
                style={{
                  padding: '8px 0 8px 8px',
                  fontSize: '14.5px',
                  color: 'var(--text)',
                  textDecoration: 'none',
                }}
              >
                {group.label}
              </Link>
            )}
          </div>
        ))}

        <div style={{ paddingTop: 'var(--space-16)', borderTop: '1px solid var(--edge)' }}>
          <Button href="/download" variant="primary" style={{ width: '100%' }} onClick={onClose}>
            Download Preview
          </Button>
        </div>
      </div>
    </div>
  );
};
