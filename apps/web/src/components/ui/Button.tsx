import React from 'react';
import { Link } from './Link';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'contrast';
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
        return { height: '36px', padding: '0 14px', fontSize: '13px' };
      case 'lg':
        return { height: '48px', padding: '0 24px', fontSize: '15.5px' };
      case 'md':
      default:
        return { height: '42px', padding: '0 18px', fontSize: '14px' };
    }
  };

  const dims = getPaddingAndHeight();

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'contrast':
        return {
          backgroundColor: '#FFFFFF',
          color: '#0C1220',
          border: '1px solid #FFFFFF',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
        };
      case 'secondary':
        return {
          backgroundColor: '#FFFFFF',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          boxShadow: '0 1px 2px rgba(12, 18, 32, 0.04)',
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
          boxShadow: '0 2px 8px rgba(47, 107, 250, 0.25)',
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
    borderRadius: 'var(--radius-button)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    textDecoration: 'none',
    transition: 'background-color var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast), opacity var(--transition-fast)',
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
