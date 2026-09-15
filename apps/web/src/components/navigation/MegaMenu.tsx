import React, { useRef, useEffect } from 'react';
import { Link } from '../../router/Router';
import { StatusBadge } from '../ui/StatusBadge';
import type { NavItem } from '../../content/navData';

interface MegaMenuProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ items, isOpen, onClose, title }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      role="region"
      aria-label={`${title} navigation panel`}
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(720px, calc(100vw - 32px))',
        backgroundColor: 'var(--material-menu)',
        backdropFilter: 'var(--material-blur)',
        WebkitBackdropFilter: 'var(--material-blur)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 'var(--space-4)',
          marginBottom: 'var(--space-4)',
          borderBottom: '1px solid var(--color-border-subtle)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--color-cyan)',
          }}
        >
          {title} Architecture
        </span>
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-text-tertiary)',
          }}
        >
          Press ESC to close
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-3)',
        }}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'transparent',
              border: '1px solid transparent',
              transition: 'all var(--duration-fast) var(--ease-spring)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
              e.currentTarget.style.borderColor = 'var(--color-border-bright)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                }}
              >
                {item.label}
              </span>
              {item.badge && <StatusBadge status={item.badge} size="sm" />}
            </div>
            <p
              style={{
                fontSize: '0.8125rem',
                lineHeight: '1.45',
                color: 'var(--color-text-secondary)',
                margin: 0,
              }}
            >
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};
