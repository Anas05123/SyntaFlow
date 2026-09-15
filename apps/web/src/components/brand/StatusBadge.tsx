import React from 'react';

export type CapabilityStatus = 'AVAILABLE NOW' | 'IN DEVELOPMENT' | 'PLANNED';

interface StatusBadgeProps {
  status: CapabilityStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getStyle = () => {
    switch (status) {
      case 'AVAILABLE NOW':
        return {
          bg: 'var(--active-subtle)',
          color: 'var(--active)',
          border: '1px solid rgba(63, 166, 107, 0.3)',
          dot: 'var(--active)',
        };
      case 'IN DEVELOPMENT':
        return {
          bg: 'var(--waiting-subtle)',
          color: 'var(--waiting)',
          border: '1px solid rgba(212, 154, 58, 0.3)',
          dot: 'var(--waiting)',
        };
      case 'PLANNED':
      default:
        return {
          bg: 'var(--surface-subtle)',
          color: 'var(--cyan)',
          border: '1px solid var(--cyan-border)',
          dot: 'var(--cyan)',
        };
    }
  };

  const style = getStyle();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: size === 'sm' ? '2px 8px' : '4px 10px',
        borderRadius: 'var(--radius-xs)',
        fontSize: size === 'sm' ? '10.5px' : '12px',
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        letterSpacing: '0.04em',
        backgroundColor: style.bg,
        color: style.color,
        border: style.border,
        lineHeight: 1.2,
        textTransform: 'uppercase',
      }}
    >
      <span
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          backgroundColor: style.dot,
        }}
      />
      {status}
    </span>
  );
};
