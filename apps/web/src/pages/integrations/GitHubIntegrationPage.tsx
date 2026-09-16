import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Link } from '../../components/ui/Link';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ServiceLogo } from '../../components/brand/ServiceLogos';

export const GitHubIntegrationPage: React.FC = () => {
  return (
    <div style={{ paddingBottom: 'var(--space-80)' }}>
      <SEOHead path="/integrations/github" />

      {/* Breadcrumb Navigation */}
      <section className="section" style={{ paddingTop: 'var(--space-32)', paddingBottom: 'var(--space-16)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/integrations" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Integrations</Link>
            <span>/</span>
            <span style={{ color: 'var(--cyan)', fontWeight: 500 }}>GitHub</span>
          </div>
        </div>
      </section>

      {/* Hero Header */}
      <section className="section" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-36)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: 'var(--space-20)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ServiceLogo name="github" size={30} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                DEVELOPMENT WORKFLOW // STATUS: AVAILABLE
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>● PRODUCTION READY</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>· MCP & REST API · Local Vault</span>
              </div>
            </div>
          </div>

          <h1 className="heading-1" style={{ fontSize: 'clamp(32px, 5vw, 46px)', color: 'var(--text)', marginBottom: 'var(--space-16)', letterSpacing: '-0.02em' }}>
            Connect development work to the client engagement.
          </h1>

          <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '780px', margin: 0 }}>
            Syntaflow anchors technical repositories, issues, pull requests, and releases directly to commercial client deliverables, bridging the gap between engineering progress and client sign-offs.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: 'var(--space-24)' }}>
            <Button variant="primary" href="/download">
              Connect in Syntaflow Desktop &rarr;
            </Button>
            <Button variant="secondary" href="/product/projects">
              Explore Project Blueprints
            </Button>
          </div>
        </div>
      </section>

      {/* Technical Capabilities */}
      <section className="section" style={{ paddingTop: 0, paddingBottom: 'var(--space-48)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-24)' }}>
            
            <Card variant="default" style={{ padding: 'var(--space-28)' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 'var(--space-12)' }}>
                CAPABILITIES
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                Repository Sync & Issue Tracking
              </h3>
              <ul style={{ paddingLeft: '18px', margin: 0, color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7 }}>
                <li><strong>Milestone Binding:</strong> Link GitHub milestones directly to Syntaflow client project phases.</li>
                <li><strong>Issue Synchronization:</strong> Read and update technical tickets directly from dual-density task boards.</li>
                <li><strong>PR & Release Audits:</strong> Verify merged pull requests and tagged releases before unlocking formal delivery gates.</li>
                <li><strong>Multi-Repo Architecture:</strong> Associate different repositories with separate client retainers.</li>
              </ul>
            </Card>

            <Card variant="default" style={{ padding: 'var(--space-28)' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 'var(--space-12)' }}>
                AUTHENTICATION
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-12)' }}>
                Token Security & Scope Limits
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                GitHub connections use fine-grained Personal Access Tokens (PAT) or standard OAuth grants. Tokens are stored encrypted in the native OS vault.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ backgroundColor: 'var(--surface-sunken)', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                  <code style={{ fontSize: '12px', color: 'var(--cyan)' }}>repo</code> — Read and write issues and status checks.
                </div>
                <div style={{ backgroundColor: 'var(--surface-sunken)', padding: '8px 10px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                  <code style={{ fontSize: '12px', color: 'var(--cyan)' }}>read:user</code> — Verify GitHub username for audit trails.
                </div>
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* Cross-Link Footer */}
      <section className="section" style={{ paddingTop: 'var(--space-32)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13.5px' }}>
              <Link href="/privacy" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link href="/security" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>Security Architecture</Link>
              <Link href="/product/projects" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>Projects & Tasks</Link>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Related: <Link href="/integrations/linear" style={{ color: 'var(--text-muted)' }}>Linear (TEST)</Link> · <Link href="/integrations/notion" style={{ color: 'var(--text-muted)' }}>Notion (TEST)</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
