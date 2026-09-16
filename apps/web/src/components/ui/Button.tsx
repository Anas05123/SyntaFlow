import React from 'react';
import { Link } from './Link';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  style = {},
}) => {
  const getPaddingAndHeight = () => {
    switch (size) {
      case 'sm':
        return { height: '36px', padding: '0 14px', fontSize: '13.5px' };
      case 'lg':
        return { height: '48px', padding: '0 24px', fontSize: '16px' };
      case 'md':
      default:
        return { height: '40px', padding: '0 18px', fontSize: '14.5px' };
    }
  };

  const dims = getPaddingAndHeight();

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text)',
          border: '1px solid var(--edge)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-muted)',
          border: '1px solid transparent',
        };
      case 'primary':
      default:
        return {
          backgroundColor: 'var(--cobalt)',
          color: '#FFFFFF',
          border: '1px solid var(--cobalt)',
        };
    }
  };

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    height: dims.height,
    padding: dims.padding,
    fontSize: dims.fontSize,
    fontFamily: 'var(--font-body)',
    fontWeight: 550,
    lineHeight: 1,
    borderRadius: 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    textDecoration: 'none',
    transition: 'background-color var(--transition-fast), border-color var(--transition-fast), opacity var(--transition-fast)',
    ...getVariantStyles(),
    ...style,
  };

  if (href && !disabled) {
    return (
      <Link href={href} className={`btn btn-${variant} ${className}`} style={baseStyles} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      style={baseStyles}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
