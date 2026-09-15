import React from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { HeroFlowDiagram } from '../diagrams/HeroFlowDiagram';

export const HeroSection: React.FC = () => {
  return (
    <section
      className="sf-section"
      style={{
        paddingTop: 'var(--space-16)',
        paddingBottom: 'var(--space-24)',
        position: 'relative',
      }}
    >
      <Container>
        {/* Centered Hero Typography */}
        <div
          style={{
            maxWidth: '880px',
            margin: '0 auto var(--space-16) auto',
            textAlign: 'center',
          }}
        >
          {/* Release Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.3125rem 0.875rem',
              backgroundColor: 'rgba(37, 99, 235, 0.12)',
              border: '1px solid rgba(37, 99, 235, 0.3)',
              borderRadius: 'var(--radius-full)',
              marginBottom: 'var(--space-6)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-cyan)',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Desktop Release v0.1 • Windows 10/11
            </span>
          </div>

          {/* Master Headline (Section 8) */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-hero)',
              lineHeight: 'var(--lh-hero)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-6)',
            }}
          >
            Intelligence that keeps work moving.
          </h1>

          {/* Supporting Copy (Section 8) */}
          <p
            style={{
              fontSize: 'var(--fs-body-lg)',
              lineHeight: 'var(--lh-body-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '720px',
              margin: '0 auto var(--space-8) auto',
            }}
          >
            Syntaflow keeps the context, history, and decisions behind every client engagement in one continuous record — from first contact to final delivery.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <Button href="/product" variant="primary" size="lg">
              Explore Syntaflow
            </Button>
            <Button href="#workflow" variant="secondary" size="lg">
              See How It Works
            </Button>
          </div>
        </div>

        {/* Hero Flow Visualizer */}
        <HeroFlowDiagram />
      </Container>
    </section>
  );
};
