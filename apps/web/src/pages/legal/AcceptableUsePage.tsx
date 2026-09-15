import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';

export const AcceptableUsePage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Acceptable Use Policy (Draft) — Syntaflow"
        description="Draft Acceptable Use Policy outlining guidelines for Syntaflow desktop and web services."
        path="/acceptable-use"
      />

      <PageHero
        eyebrow="Legal // Draft Structure"
        title="Acceptable Use Policy"
        description="Last updated: September 2026. Guidelines for lawful and responsible use of Syntaflow."
      />

      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <Card variant="raised" style={{ padding: 'var(--space-20)', marginBottom: 'var(--space-32)', borderLeft: '4px solid var(--waiting)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--waiting)', textTransform: 'uppercase', marginBottom: '4px' }}>
              LEGAL NOTICE // DRAFT STATUS
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)' }}>
              This document outlines standard acceptable use principles during the preview release.
            </p>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-32)', fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            <div>
              <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                1. Permitted Uses
              </h2>
              <p>
                Syntaflow is designed for lawful professional services, commercial operations, project scoping, and client deliverable handovers.
              </p>
            </div>

            <div>
              <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                2. Prohibited Activities
              </h2>
              <p>
                You may not use Syntaflow to transmit deceptive, fraudulent, or malicious materials, compromise system security, or violate applicable intellectual property and privacy laws.
              </p>
            </div>

            <div>
              <h2 className="heading-3" style={{ color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                3. Reporting Violations
              </h2>
              <p>
                To report suspected violations or security incidents, please email <a href="mailto:security@syntaflow.tech" style={{ color: 'var(--cyan)' }}>security@syntaflow.tech</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
