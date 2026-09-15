import React from 'react';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  badge?: string;
  className?: string;
  maxWidth?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = 'center',
  badge,
  className = '',
  maxWidth = '760px',
}) => {
  const isCenter = align === 'center';

  return (
    <div
      className={`sf-section-heading ${className}`}
      style={{
        textAlign: isCenter ? 'center' : 'left',
        maxWidth,
        marginLeft: isCenter ? 'auto' : '0',
        marginRight: isCenter ? 'auto' : '0',
        marginBottom: 'var(--space-12)',
      }}
    >
      {(eyebrow || badge) && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: 'var(--space-3)',
          }}
        >
          {eyebrow && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-cyan)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {eyebrow}
            </span>
          )}
          {badge && (
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                padding: '0.125rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(37, 99, 235, 0.15)',
                color: 'var(--color-cobalt-hover)',
                border: '1px solid rgba(37, 99, 235, 0.3)',
              }}
            >
              {badge}
            </span>
          )}
        </div>
      )}

      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--fs-h2)',
          lineHeight: 'var(--lh-h2)',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: description ? 'var(--space-4)' : 0,
        }}
      >
        {title}
      </h2>

      {description && (
        <p
          style={{
            fontSize: 'var(--fs-body-lg)',
            lineHeight: 'var(--lh-body-lg)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
};
