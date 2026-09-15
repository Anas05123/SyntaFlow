import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'raised';
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  interactive = false,
  className = '',
  style = {},
  onClick,
}) => {
  const getBg = () => {
    switch (variant) {
      case 'subtle':
        return 'var(--surface-subtle)';
      case 'raised':
        return 'var(--surface-raised)';
      case 'default':
      default:
        return 'var(--surface)';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`card ${interactive ? 'card-interactive' : ''} ${className}`}
      style={{
        backgroundColor: getBg(),
        border: '1px solid var(--edge)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-24)',
        position: 'relative',
        transition: interactive ? 'border-color var(--transition-fast), transform var(--transition-fast)' : undefined,
        cursor: interactive ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
