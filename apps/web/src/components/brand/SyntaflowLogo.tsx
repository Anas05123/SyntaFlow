import React from 'react';
import { Link } from '../../router/Router';

interface SyntaflowLogoProps {
  className?: string;
  variant?: 'color' | 'white';
  height?: number;
  showTagline?: boolean;
}

export const SyntaflowLogo: React.FC<SyntaflowLogoProps> = ({
  className = '',
  variant = 'white',
  height = 32,
  showTagline = false,
}) => {
  const logoSrc = variant === 'color' ? '/brand/logo-full-color.png' : '/brand/logo-full.png';

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-cobalt rounded-md ${className}`}
      aria-label="Syntaflow — Return to homepage"
      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
    >
      <img
        src={logoSrc}
        alt="Syntaflow"
        height={height}
        style={{ height: `${height}px`, width: 'auto', objectFit: 'contain' }}
        onError={(e) => {
          // Fallback if image path fails to load: render SVG mark + text
          const target = e.currentTarget;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      <div
        style={{
          display: 'none',
          alignItems: 'center',
          gap: '0.625rem',
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--color-text-primary)',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" stroke="url(#logo_grad)" strokeWidth="3" fill="#080B0F" />
          <path d="M10 16C10 12.6863 12.6863 10 16 10C19.3137 10 22 12.6863 22 16" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M10 16C10 19.3137 12.6863 22 16 22C19.3137 22 22 19.3137 22 16" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round" />
          <defs>
            <linearGradient id="logo_grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" />
              <stop offset="1" stopColor="#00D4FF" />
            </linearGradient>
          </defs>
        </svg>
        <span>Syntaflow</span>
      </div>
      {showTagline && (
        <span
          style={{
            borderLeft: '1px solid var(--color-border)',
            paddingLeft: '0.75rem',
            fontSize: 'var(--fs-meta)',
            color: 'var(--color-text-tertiary)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          From context to action
        </span>
      )}
    </Link>
  );
};
