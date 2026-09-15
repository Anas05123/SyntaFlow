import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Privacy Policy (Draft) — Syntaflow"
        description="Draft Privacy Policy outlining our zero-telemetry architecture and local data handling."
        path="/privacy-policy"
      />

      <PageHero
        eyebrow="Legal // Draft Structure"
        title="Privacy Policy"
        description="Last updated: September 2026. This policy describes how Syntaflow treats personal data across our website and desktop application."
      />

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <Card variant="raised" style={{ padding: 'var(--space-20)', marginBottom: 'var(--space-32)', borderLeft: '4px solid var(--waiting)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--waiting)', textTransform: 'uppercase', marginBottom: '4px' }}>
              LEGAL NOTICE // DRAFT STATUS
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
              This document represents our plain-language privacy architecture draft. Formal privacy terms will be reviewed and finalized by legal counsel prior to commercial release.
            </p>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-32)', fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            <div>
              <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                1. Information We Do Not Collect
              </h2>
              <p>
                Syntaflow does not collect, transmit, or store your client records, financial terms, proposals, tasks, or document contents on remote servers. All operational data remains strictly on your physical machine.
              </p>
            </div>

            <div>
              <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                2. Information You Voluntarily Provide
              </h2>
              <p>
                If you submit an inquiry through our Contact page, we collect your name, email address, organization name, and message content solely to respond to your request. We do not sell or rent this contact information to third parties.
              </p>
            </div>

            <div>
              <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                3. Tracking & Cookies
              </h2>
              <p>
                Our marketing website uses zero tracking cookies, advertising pixels, or third-party behavioral analytics.
              </p>
            </div>

            <div>
              <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                4. Privacy Contact
              </h2>
              <p>
                For privacy inquiries or data requests, contact us at <a href="mailto:privacy@syntaflow.tech" style={{ color: 'var(--cyan)' }}>privacy@syntaflow.tech</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
