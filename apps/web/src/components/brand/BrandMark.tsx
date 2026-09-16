import React from 'react';

interface BrandMarkProps {
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  src?: string;
  className?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({
  variant = 'full',
  size = 'md',
  src = '/brand/LogoIcon_WBG.png',
  className = '',
}) => {
  const heights = {
    sm: variant === 'full' ? 24 : 24,
    md: variant === 'full' ? 32 : 32,
    lg: variant === 'full' ? 42 : 42,
  };

  const currentHeight = heights[size];

  if (variant === 'icon') {
    return (
      <img
        src={src}
        alt="Syntaflow Mark"
        height={currentHeight}
        width={currentHeight}
        style={{ height: `${currentHeight}px`, width: 'auto', objectFit: 'contain' }}
        className={className}
      />
    );
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }} className={className}>
      <img
        src={src}
        alt="Syntaflow Logo"
        height={currentHeight}
        width={currentHeight}
        style={{ height: `${currentHeight}px`, width: 'auto', objectFit: 'contain' }}
      />
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: size === 'lg' ? '22px' : size === 'md' ? '18px' : '15px',
          letterSpacing: '-0.025em',
          color: 'var(--text)',
        }}
      >
        Syntaflow
      </span>
    </div>
  );
};
