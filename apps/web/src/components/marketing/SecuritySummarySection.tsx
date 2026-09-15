import React from 'react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const SecuritySummarySection: React.FC = () => {
  return (
    <section
      className="sf-section"
      style={{
        backgroundColor: 'var(--color-canvas-subtle)',
        borderTop: '1px solid var(--color-border-subtle)',
      }}
    >
      <Container>
        <SectionHeading
          eyebrow="Security & Trust"
          title="Built for work that matters."
          description="Security designed into the desktop architecture — verifiable code and physical machine isolation, with zero inflated certification claims."
        />

        <div className="sf-grid-3" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-12)' }}>
          <Card padding="lg">
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-cobalt-hover)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--space-3)',
              }}
            >
              PROCESS ISOLATION
            </div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              Renderer Sandboxing
            </h4>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
              The UI renderer executes inside an isolated browser sandbox with zero Node.js integration and zero direct filesystem or database handles. All interaction routes through typed IPC contracts.
            </p>
          </Card>

          <Card padding="lg">
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-cyan)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--space-3)',
              }}
            >
              DATA SOVEREIGNTY
            </div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              Local-First Persistence
            </h4>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
              Your client records, document drafts, and financial numbers live physically on your hardware. No third-party SaaS databases holds your work hostage.
            </p>
          </Card>

          <Card padding="lg">
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-status-active)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 'var(--space-3)',
              }}
            >
              CREDENTIAL PROTECTION
            </div>
            <h4
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              scrypt & safeStorage
            </h4>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
              Local password authentication uses scrypt hashing with timing-safe verification. Session tokens are encrypted using OS-native encryption (Windows DPAPI / Electron safeStorage).
            </p>
          </Card>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button href="/security" variant="outline" size="md">
            Explore Full Security Architecture & Threat Model →
          </Button>
        </div>
      </Container>
    </section>
  );
};
