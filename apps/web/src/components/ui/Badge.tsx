import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'cobalt' | 'cyan' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  const getStyles = (): React.CSSProperties => {
    const isSm = size === 'sm';
    const padding = isSm ? '0.125rem 0.5rem' : '0.25rem 0.75rem';
    const fontSize = isSm ? '0.75rem' : '0.8125rem';

    let bg = 'rgba(255, 255, 255, 0.06)';
    let color = 'var(--color-text-secondary)';
    let border = '1px solid var(--color-border)';

    if (variant === 'cobalt') {
      bg = 'rgba(37, 99, 235, 0.12)';
      color = 'var(--color-cobalt)';
      border = '1px solid rgba(37, 99, 235, 0.3)';
    } else if (variant === 'cyan') {
      bg = 'rgba(0, 212, 255, 0.1)';
      color = 'var(--color-cyan)';
      border = '1px solid rgba(0, 212, 255, 0.25)';
    }

    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding,
      fontSize,
      fontWeight: 500,
      fontFamily: 'var(--font-mono)',
      borderRadius: 'var(--radius-full)',
      backgroundColor: bg,
      color,
      border,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
      lineHeight: 1.4,
    };
  };

  return (
    <span style={getStyles()} className={className}>
      {children}
    </span>
  );
};
