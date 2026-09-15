import React from 'react';
import type { CapabilityStatus } from '../../content/navData';

export interface StatusBadgeProps {
  status: CapabilityStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  className = '',
}) => {
  let dotColor = 'var(--color-status-active)';
  let bg = 'var(--color-status-active-bg)';
  let textColor = 'var(--color-status-active)';
  let border = '1px solid rgba(16, 185, 129, 0.25)';

  if (status === 'IN DEVELOPMENT') {
    dotColor = 'var(--color-cobalt)';
    bg = 'rgba(37, 99, 235, 0.12)';
    textColor = 'var(--color-cobalt-hover)';
    border = '1px solid rgba(37, 99, 235, 0.3)';
  } else if (status === 'PLANNED DIRECTION') {
    dotColor = 'var(--color-status-planned)';
    bg = 'var(--color-status-planned-bg)';
    textColor = '#A78BFA';
    border = '1px solid rgba(139, 92, 246, 0.3)';
  }

  const isSm = size === 'sm';

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: isSm ? '0.125rem 0.5rem' : '0.25rem 0.625rem',
        fontSize: isSm ? '0.6875rem' : '0.75rem',
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        borderRadius: 'var(--radius-full)',
        backgroundColor: bg,
        color: textColor,
        border,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          boxShadow: `0 0 6px ${dotColor}`,
        }}
      />
      <span>{status}</span>
    </span>
  );
};
