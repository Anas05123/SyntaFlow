import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Link } from '../../components/ui/Link';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ServiceLogo } from '../../components/brand/ServiceLogos';

export const LinearIntegrationPage: React.FC = () => {
  return (
    <div style={{ paddingBottom: 'var(--space-80)' }}>
      <SEOHead path="/integrations/linear" />

      <section className="section" style={{ paddingTop: 'var(--space-32)', paddingBottom: 'var(--space-16)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/integrations" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Integrations</Link>
            <span>/</span>
            <span style={{ color: 'var(--cyan)', fontWeight: 500 }}>Linear</span>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-36)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 'var(--space-20)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ServiceLogo name="linear" size={30} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ISSUE TRACKING // STATUS: TEST
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', color: 'var(--cyan)', fontWeight: 600 }}>● IN ACTIVE TESTING</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>· GraphQL API & Remote MCP</span>
              </div>
            </div>
          </div>

          <h1 className="heading-1" style={{ fontSize: 'clamp(32px, 5vw, 46px)', color: 'var(--text)', marginBottom: 'var(--space-16)', letterSpacing: '-0.02em' }}>
            Connect sprint cycles to client milestones.
          </h1>

          <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '780px', margin: 0 }}>
            Syntaflow bridges Linear engineering cycles and issues with commercial client milestones, keeping client expectations aligned with technical execution.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: 'var(--space-24)' }}>
            <Button variant="primary" href="/download">
              Test in Syntaflow Desktop &rarr;
            </Button>
            <Button variant="secondary" href="/product/projects">
              Explore Task Boards
            </Button>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0, paddingBottom: 'var(--space-48)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <Card variant="default" style={{ padding: 'var(--space-28)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
              Test Phase Details & Capabilities
            </h3>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
              The Linear integration is currently in <strong>TEST</strong> status. It implements two-way ticket synchronization, team issue inspection, and status updates via Linear&rsquo;s GraphQL API and official Model Context Protocol server.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};
