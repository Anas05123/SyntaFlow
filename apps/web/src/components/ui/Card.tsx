import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  glow?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  interactive = false,
  glow = false,
  padding = 'md',
  className = '',
  style,
  ...props
}) => {
  let padValue = 'var(--space-6)';
  if (padding === 'sm') padValue = 'var(--space-4)';
  if (padding === 'lg') padValue = 'var(--space-8)';

  return (
    <div
      className={`sf-card ${interactive ? 'sf-card-interactive' : ''} ${className}`}
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: padValue,
        boxShadow: glow ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
        transition: 'all var(--duration-fast) var(--ease-spring)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
