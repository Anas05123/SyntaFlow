import React from 'react';
import { usePath } from './router/Router';
import { SiteHeader } from './components/navigation/SiteHeader';
import { SiteFooter } from './components/navigation/SiteFooter';
import { SEOHead } from './components/seo/SEOHead';
import { Container } from './components/ui/Container';
import { Button } from './components/ui/Button';
import { StatusBadge } from './components/ui/StatusBadge';

export const App: React.FC = () => {
  const path = usePath();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SEOHead
        title="Connected Intelligence That Moves Work Forward"
        description="Syntaflow is a desktop-first client engagement environment that keeps one continuous, connected record of every client relationship — from first contact to final delivery."
      />
      <SiteHeader />
      
      <main id="content" style={{ flex: 1 }}>
        <section className="sf-section" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-24)' }}>
          <Container>
            <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', gap: '0.5rem', marginBottom: 'var(--space-4)' }}>
                <StatusBadge status="AVAILABLE NOW" />
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--fs-hero)',
                  lineHeight: 'var(--lh-hero)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  marginBottom: 'var(--space-6)',
                }}
              >
                Intelligence that keeps work moving.
              </h1>
              <p
                style={{
                  fontSize: 'var(--fs-body-lg)',
                  lineHeight: 'var(--lh-body-lg)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-8)',
                }}
              >
                Syntaflow keeps the context, history, and decisions behind every client engagement in one continuous record — from first contact to final delivery.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button href="/product" variant="primary" size="lg">
                  Explore Syntaflow
                </Button>
                <Button href="/solutions/freelancers" variant="secondary" size="lg">
                  See How It Works
                </Button>
              </div>

              <div
                style={{
                  marginTop: 'var(--space-16)',
                  padding: 'var(--space-6)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Active Route: <span style={{ color: 'var(--color-cyan)' }}>{path}</span> • Framework: <span style={{ color: 'var(--color-text-primary)' }}>React 19 + Vite + TypeScript</span>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};
