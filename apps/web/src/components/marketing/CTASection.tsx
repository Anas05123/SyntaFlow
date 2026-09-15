import React from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';

export const CTASection: React.FC = () => {
  return (
    <section
      className="sf-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.18) 0%, rgba(0, 212, 255, 0.05) 50%, transparent 75%)',
          pointerEvents: 'none',
        }}
      />

      <Container>
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--color-cyan)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'inline-block',
              marginBottom: 'var(--space-3)',
            }}
          >
            INTELLIGENCE IN FLOW
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-h1)',
              lineHeight: 'var(--lh-h1)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-4)',
            }}
          >
            Never lose the thread.
          </h2>

          <p
            style={{
              fontSize: 'var(--fs-body-lg)',
              lineHeight: 'var(--lh-body-lg)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-8)',
              maxWidth: '640px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Experience a continuous client-engagement operating environment designed for rigor, clarity, and control.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Button
              href="/download"
              variant="primary"
              size="lg"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              }
            >
              Get Syntaflow Desktop (v0.1)
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Talk to Our Team
            </Button>
          </div>

          <div
            style={{
              marginTop: 'var(--space-6)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-text-tertiary)',
            }}
          >
            Windows 10/11 64-bit • Free preview standalone release • No cloud account required
          </div>
        </div>
      </Container>
    </section>
  );
};
