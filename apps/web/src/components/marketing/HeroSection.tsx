import React from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { DesktopCockpitSimulator } from './DesktopCockpitSimulator';

export const HeroSection: React.FC = () => {
  return (
    <section
      className="sf-section"
      style={{
        paddingTop: 'clamp(2.5rem, 5vw, 4.5rem)',
        paddingBottom: 'var(--space-16)',
        position: 'relative',
      }}
    >
      <Container>
        {/* Centered Hero Header */}
        <div
          style={{
            maxWidth: '880px',
            margin: '0 auto clamp(2rem, 4vw, 3.5rem) auto',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Release Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.3125rem 0.875rem',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-full)',
              marginBottom: 'var(--space-4)',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-status-active)' }} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Desktop Client v0.1 • Windows 10/11 • 100% Offline
            </span>
          </div>

          {/* Master Headline - Direct, Anti-Hype */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-hero)',
              lineHeight: 'var(--lh-hero)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-4)',
            }}
          >
            The client operations desktop environment for freelancers, agencies, and studios.
          </h1>

          {/* Supporting Copy */}
          <p
            style={{
              fontSize: 'var(--fs-body-lg)',
              lineHeight: 'var(--lh-body-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: '740px',
              margin: '0 auto var(--space-8) auto',
            }}
          >
            Stop losing client context across disconnected Slack threads, Google Docs drafts, and unbilled scope changes. Syntaflow maintains one continuous, encrypted local record from initial proposal to final approved handover.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: 'var(--space-4)',
            }}
          >
            <Button href="/download" variant="primary" size="lg">
              Download Free Preview (Windows)
            </Button>
            <Button href="/pricing" variant="secondary" size="lg">
              Pricing & Economics
            </Button>
          </div>

          {/* Pragmatic Proof Points */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-text-tertiary)',
            }}
          >
            Runs on your hardware • Local SQLite • Zero cloud telemetry • Free during public preview
          </div>
        </div>

        {/* Centerpiece: Interactive Cockpit Simulator */}
        <div style={{ maxWidth: '1040px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <DesktopCockpitSimulator />
        </div>
      </Container>
    </section>
  );
};
