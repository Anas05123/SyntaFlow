import React from 'react';
import { StatusBadge, type CapabilityStatus } from '../brand/StatusBadge';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  status?: CapabilityStatus;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  status,
  align = 'left',
  className = '',
}) => {
  return (
    <div
      className={`section-heading ${className}`}
      style={{
        textAlign: align,
        maxWidth: align === 'center' ? '760px' : '840px',
        marginLeft: align === 'center' ? 'auto' : undefined,
        marginRight: align === 'center' ? 'auto' : undefined,
        marginBottom: 'var(--space-48)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-12)',
          justifyContent: align === 'center' ? 'center' : 'flex-start',
          marginBottom: 'var(--space-8)',
        }}
      >
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        {status && <StatusBadge status={status} size="sm" />}
      </div>
      <h2 className="heading-2" style={{ marginBottom: 'var(--space-16)' }}>
        {title}
      </h2>
      {description && <p className="body-large">{description}</p>}
    </div>
  );
};
