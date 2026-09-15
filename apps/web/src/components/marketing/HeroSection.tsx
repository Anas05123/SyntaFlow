import React from 'react';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { DesktopCockpitSimulator } from './DesktopCockpitSimulator';
import { HeroFlowDiagram } from '../diagrams/HeroFlowDiagram';

export const HeroSection: React.FC = () => {
  return (
    <section
      className="sf-section"
      style={{
        paddingTop: 'clamp(3rem, 6vw, 5.5rem)',
        paddingBottom: 'var(--space-24)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient Halo Spotlight */}
      <div className="sf-halo-spotlight" aria-hidden="true" />

      <Container>
        {/* Centered Hero Typography */}
        <div
          style={{
            maxWidth: '920px',
            margin: '0 auto clamp(2.5rem, 5vw, 4rem) auto',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Release Badge with Pulse Dot */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.375rem 1rem',
              backgroundColor: 'rgba(37, 99, 235, 0.12)',
              border: '1px solid rgba(37, 99, 235, 0.35)',
              borderRadius: 'var(--radius-full)',
              marginBottom: 'var(--space-6)',
              boxShadow: '0 0 20px rgba(37, 99, 235, 0.15)',
            }}
          >
            <span className="sf-pulse-dot" />
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
              Desktop Release v0.1 • Windows 10/11 Enclave
            </span>
          </div>

          {/* Master Headline (Section 8) */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-hero)',
              lineHeight: 'var(--lh-hero)',
              fontWeight: 800,
              letterSpacing: '-0.035em',
              marginBottom: 'var(--space-6)',
            }}
          >
            <span className="text-gradient">Intelligence that keeps </span>
            <span className="text-gradient-cyan">work moving.</span>
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
              marginBottom: 'var(--space-4)',
            }}
          >
            <Button href="/download" variant="primary" size="lg">
              Download Preview (Windows)
            </Button>
            <Button href="/product" variant="secondary" size="lg">
              Explore Architecture
            </Button>
          </div>

          {/* Micro Trust Signal */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-text-tertiary)',
            }}
          >
            Local SQLite • Zero cloud telemetry • Free during public preview
          </div>
        </div>

        {/* Centerpiece: The Product is the Demo Interactive Cockpit Simulator */}
        <div style={{ maxWidth: '1080px', margin: '0 auto var(--space-16) auto', position: 'relative', zIndex: 2 }}>
          <DesktopCockpitSimulator />
        </div>

        {/* Supporting Architectural Flow Diagram */}
        <div style={{ marginTop: 'var(--space-12)' }}>
          <HeroFlowDiagram />
        </div>
      </Container>
    </section>
  );
};
