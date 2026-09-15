import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';

export const TermsPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Terms of Service (Draft) — Syntaflow"
        description="Draft Terms of Service for Syntaflow desktop software and web services."
        path="/terms"
      />

      <PageHero
        eyebrow="Legal // Draft Structure"
        title="Terms of Service"
        description="Last updated: September 2026. This document represents a transparent draft framework for preview access."
      />

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <Card variant="raised" style={{ padding: 'var(--space-20)', marginBottom: 'var(--space-32)', borderLeft: '4px solid var(--waiting)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--waiting)', textTransform: 'uppercase', marginBottom: '4px' }}>
              LEGAL NOTICE // DRAFT STATUS
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
              This draft outline is provided for informational clarity during the Syntaflow Desktop Preview. Formal terms of service will be finalized by legal counsel prior to commercial release.
            </p>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-32)', fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            <div>
              <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                1. Software License Grant
              </h2>
              <p>
                During the Desktop Preview phase, Syntaflow grants you a revocable, non-exclusive, non-transferable license to install and execute the desktop application on compatible Windows workstations for professional and personal evaluation.
              </p>
            </div>

            <div>
              <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                2. Data Sovereignty & Customer Content
              </h2>
              <p>
                You retain complete, unencumbered ownership of all client records, proposals, agreements, tasks, and deliverables created within the application. Syntaflow claims zero intellectual property rights over any customer data processed through the software.
              </p>
            </div>

            <div>
              <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                3. Preview Software Disclaimer
              </h2>
              <p>
                The software is provided &ldquo;as is&rdquo; without warranty of any kind, either express or implied. While we strive for architectural resilience and data integrity, you are advised to maintain independent backups of your local SQLite databases.
              </p>
            </div>

            <div>
              <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                4. Governing Law & Contact
              </h2>
              <p>
                For questions regarding licensing or commercial contracts, contact us at <a href="mailto:legal@syntaflow.tech" style={{ color: 'var(--cyan)' }}>legal@syntaflow.tech</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
