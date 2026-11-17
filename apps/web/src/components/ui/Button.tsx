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
  const classes = `btn btn-${variant} sf-web-button sf-web-button--${variant} sf-web-button--${size} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={classes} style={style} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
