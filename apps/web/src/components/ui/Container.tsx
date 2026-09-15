import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide';
  style?: React.CSSProperties;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  size = 'default',
  style,
}) => {
  let maxWidth = 'var(--container-max)';
  if (size === 'narrow') maxWidth = '840px';
  if (size === 'wide') maxWidth = '1400px';

  return (
    <div
      className={`sf-container ${className}`}
      style={{
        maxWidth,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: 'var(--container-pad)',
        paddingRight: 'var(--container-pad)',
        width: '100%',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
