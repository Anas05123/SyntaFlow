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
    <div className={`section-heading ${className}`} style={{ textAlign: align, maxWidth: align === 'center' ? '760px' : '840px', marginLeft: align === 'center' ? 'auto' : undefined, marginRight: align === 'center' ? 'auto' : undefined }}>
      <div className="section-heading__meta" style={{ justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        {status && <StatusBadge status={status} size="sm" />}
      </div>
      <h2 className="heading-2 section-heading__title">
        {title}
      </h2>
      {description && <p className="body-large section-heading__description">{description}</p>}
    </div>
  );
};
