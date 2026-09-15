import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { PageHero } from '../components/marketing/PageHero';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { CTASection } from '../components/marketing/CTASection';

export const PrivacyPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Privacy Commitment & Zero Telemetry — Syntaflow"
        description="Syntaflow operates with complete data sovereignty. Zero telemetry, zero analytics tracking, and physical machine isolation for your client records."
      />

      <PageHero
        eyebrow="Security & Trust"
        title="Your work remains yours. Completely."
        description="We believe professional client work should never be mined, monetized, or observed by software vendors. Syntaflow is engineered with a strict zero-telemetry guarantee."
        primaryCta={{ label: 'Review Security Model', href: '/security' }}
        secondaryCta={{ label: 'Data Handling Specifications', href: '/data-handling' }}
      />

      <section className="sf-section">
        <Container>
          <div className="sf-grid-3" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-16)' }}>
            <Card padding="lg">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                ZERO TELEMETRY
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                No Usage Tracking
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
                Syntaflow does not bundle Google Analytics, Mixpanel, PostHog, or any user tracking SDKs. We do not track which features you use, how long you work, or what you click.
              </p>
            </Card>

            <Card padding="lg">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cobalt-hover)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                ZERO DATA MINING
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                Zero LLM Scraping
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
                Your proposals, client feedback, invoices, and strategy briefs never train commercial AI models. Your intellectual property and client confidentiality remain intact.
              </p>
            </Card>

            <Card padding="lg">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-status-active)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                OFFLINE FREEDOM
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                100% Offline Capability
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
                Syntaflow operates fully disconnected from the internet. You can draft proposals, organize tasks, and review milestone records on an airplane with zero latency.
              </p>
            </Card>
          </div>

          {/* Privacy Comparison Table */}
          <div
            style={{
              padding: 'var(--space-8)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-6)',
              }}
            >
              How Syntaflow Compares to Cloud SaaS
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Dimension</th>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Syntaflow Desktop</th>
                    <th style={{ padding: '0.75rem 1rem', color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Typical Cloud SaaS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Data Location</td>
                    <td style={{ padding: '1rem', color: 'var(--color-status-active)' }}>Your physical hard drive</td>
                    <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>Multi-tenant cloud server</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Telemetry & Analytics</td>
                    <td style={{ padding: '1rem', color: 'var(--color-status-active)' }}>Zero trackers bundled</td>
                    <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>Extensive behavioral tracking</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Offline Access</td>
                    <td style={{ padding: '1rem', color: 'var(--color-status-active)' }}>Full functionality offline</td>
                    <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>Broken or read-only without web</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Vendor Access</td>
                    <td style={{ padding: '1rem', color: 'var(--color-status-active)' }}>Zero employee access to your files</td>
                    <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>Support staff database access</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
};
