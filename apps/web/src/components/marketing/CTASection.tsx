import React from 'react';
import { Button } from '../ui/Button';

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  title = 'One continuous working context. Built for your machine.',
  description = 'Experience client operations designed for clarity, version integrity, and zero cloud lock-in. Available as an offline-first Windows desktop preview.',
  primaryLabel = 'Explore Desktop Preview',
  primaryHref = '#/product',
  secondaryLabel = 'Review Security Model',
  secondaryHref = '#/security',
}) => {
  return (
    <section className="section scroll-reveal">
      <div className="container">
        <div
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--edge)',
            borderRadius: 'var(--radius-lg)',
            padding: 'clamp(32px, 5vw, 64px)',
            textAlign: 'center',
            maxWidth: '960px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <div className="eyebrow" style={{ justifyContent: 'center' }}>
            Desktop-First Operating Environment
          </div>
          <h2 className="heading-2" style={{ marginBottom: 'var(--space-16)' }}>
            {title}
          </h2>
          <p
            className="body-large"
            style={{
              maxWidth: '680px',
              margin: '0 auto var(--space-32) auto',
            }}
          >
            {description}
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 'var(--space-16)',
            }}
          >
            <Button href={primaryHref} variant="primary" size="lg">
              {primaryLabel}
            </Button>
            {secondaryLabel && (
              <Button href={secondaryHref} variant="secondary" size="lg">
                {secondaryLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
