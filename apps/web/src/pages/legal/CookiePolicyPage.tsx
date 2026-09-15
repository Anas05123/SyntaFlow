import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';

export const CookiePolicyPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Cookie Policy — Syntaflow"
        description="Our policy regarding cookies: Syntaflow uses zero tracking or behavioral cookies."
        path="/cookies"
      />

      <PageHero
        eyebrow="Legal // Transparency"
        title="Cookie Policy"
        description="Last updated: September 2026. A plain-English explanation of how cookies are treated on syntaflow.tech."
      />

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <Card variant="raised" style={{ padding: 'var(--space-20)', marginBottom: 'var(--space-32)', borderLeft: '4px solid var(--active)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--active)', textTransform: 'uppercase', marginBottom: '4px' }}>
              ZERO-TRACKING DECLARATION
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
              Syntaflow does not set advertising, cross-site tracking, or behavioral profiling cookies.
            </p>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-32)', fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            <div>
              <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                1. What Are Cookies?
              </h2>
              <p>
                Cookies are small text files stored on your device by a web browser. Websites commonly use cookies for session persistence, authentication, or advertising analytics.
              </p>
            </div>

            <div>
              <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                2. How We Use Cookies
              </h2>
              <p>
                The Syntaflow marketing website at <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>syntaflow.tech</code> does not use non-essential or third-party tracking cookies. The desktop application uses local operating system storage and does not rely on web cookies for state.
              </p>
            </div>

            <div>
              <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                3. Managing Browser Storage
              </h2>
              <p>
                You may clear browser local storage at any time through your browser settings without impacting your access to our public documentation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
