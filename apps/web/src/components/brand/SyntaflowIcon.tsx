import React from 'react';

interface SyntaflowIconProps {
  size?: number;
  className?: string;
}

export const SyntaflowIcon: React.FC<SyntaflowIconProps> = ({ size = 32, className = '' }) => {
  return (
    <img
      src="/brand/logo-icon.png"
      alt="Syntaflow Icon Mark"
      width={size}
      height={size}
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain',
        display: 'inline-block',
      }}
    />
  );
};
