import React from 'react';
import { Link } from '../../router/Router';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'cyan';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  target?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  target,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  className = '',
  disabled,
  style,
  ...props
}) => {
  // Styles based on variant
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--color-cobalt)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          boxShadow: '0 2px 10px rgba(37, 99, 235, 0.35)',
        };
      case 'cyan':
        return {
          backgroundColor: 'rgba(0, 212, 255, 0.12)',
          color: 'var(--color-cyan)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--color-surface-raised)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border-bright)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-text-secondary)',
          border: '1px solid transparent',
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          height: '36px',
          padding: '0 0.875rem',
          fontSize: '0.875rem',
          borderRadius: 'var(--radius-sm)',
        };
      case 'md':
        return {
          height: '44px', // WCAG AAA hit target
          padding: '0 1.25rem',
          fontSize: '0.9375rem',
          borderRadius: 'var(--radius-md)',
        };
      case 'lg':
        return {
          height: '52px',
          padding: '0 1.75rem',
          fontSize: '1rem',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
        };
    }
  };

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: 500,
    fontFamily: 'var(--font-sans)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all var(--duration-fast) var(--ease-spring)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    width: fullWidth ? '100%' : 'auto',
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
  };

  const content = (
    <>
      {icon && iconPosition === 'left' && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span style={{ display: 'inline-flex' }}>{icon}</span>}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} target={target} style={baseStyles} className={`sf-button ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button disabled={disabled} style={baseStyles} className={`sf-button ${className}`} {...props}>
      {content}
    </button>
  );
};
