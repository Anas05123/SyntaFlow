import React from 'react';
import { Container } from '../ui/Container';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import type { CapabilityStatus } from '../../content/navData';

export interface PageHeroProps {
  eyebrow?: string;
  badge?: CapabilityStatus;
  title: string;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  children?: React.ReactNode;
}

export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  badge = 'AVAILABLE NOW',
  title,
  description,
  primaryCta,
  secondaryCta,
  children,
}) => {
  return (
    <div
      style={{
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-16)',
        borderBottom: '1px solid var(--color-border-subtle)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          right: '10%',
          width: '500px',
          height: '300px',
          background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container>
        <div style={{ maxWidth: '840px' }}>
          {(eyebrow || badge) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'var(--space-4)' }}>
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
              {badge && <StatusBadge status={badge} />}
            </div>
          )}

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-h1)',
              lineHeight: 'var(--lh-h1)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-4)',
            }}
          >
            {title}
          </h1>

          <p
            style={{
              fontSize: 'var(--fs-body-lg)',
              lineHeight: 'var(--lh-body-lg)',
              color: 'var(--color-text-secondary)',
              marginBottom: primaryCta || secondaryCta ? 'var(--space-6)' : 0,
            }}
          >
            {description}
          </p>

          {(primaryCta || secondaryCta) && (
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {primaryCta && (
                <Button href={primaryCta.href} variant="primary" size="md">
                  {primaryCta.label}
                </Button>
              )}
              {secondaryCta && (
                <Button href={secondaryCta.href} variant="secondary" size="md">
                  {secondaryCta.label}
                </Button>
              )}
            </div>
          )}

          {children}
        </div>
      </Container>
    </div>
  );
};
