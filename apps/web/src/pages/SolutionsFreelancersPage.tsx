import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { PageHero } from '../components/marketing/PageHero';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { CTASection } from '../components/marketing/CTASection';

export const SolutionsFreelancersPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Syntaflow for Freelancers — Run Engagements Without Tool Chaos"
        description="Run $5k–$25k solo client engagements with complete rigor. Stop losing context across six disconnected apps and present corporate-grade proposals."
      />

      <PageHero
        eyebrow="Solutions for Freelancers"
        title="Run solo engagements with enterprise rigor."
        description="You do the work of a partner, account manager, and executive producer all by yourself. Syntaflow keeps the entire client relationship in one continuous desktop record so you stop losing billable hours to tool fragmentation."
        primaryCta={{ label: 'Get Desktop App (v0.1)', href: '/download' }}
        secondaryCta={{ label: 'See Client Operations', href: '/product/client-operations' }}
      />

      <section className="sf-section">
        <Container>
          <div style={{ marginBottom: 'var(--space-12)' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-h2)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-3)',
              }}
            >
              The solo operator's operational advantage.
            </h2>
            <p style={{ fontSize: 'var(--fs-body-lg)', color: 'var(--color-text-secondary)', maxWidth: '720px' }}>
              Big agencies win clients on presentation and rigor. Syntaflow equips independent operators with the exact same level of institutional precision.
            </p>
          </div>

          <div className="sf-grid-3" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-16)' }}>
            <Card padding="lg">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                NO MORE 6-APP JUGGLING
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                One Living Record
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
                Replace your fragile chain of Notion notes, Trello boards, Google Docs, email folders, and Slack threads with one living desktop record that preserves full context.
              </p>
            </Card>

            <Card padding="lg">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cobalt-hover)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                COMMERCIAL CLARITY
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                Pre-Packaged Blueprints
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
                Scope brand systems, websites, or advisory retainers in minutes with pre-configured milestone structures and explicit commercial terms.
              </p>
            </Card>

            <Card padding="lg">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-status-active)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                PREVENT SCOPE CREEP
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                Exact Snapshot Reviews
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
                When clients request revisions, they review immutable DocVersion snapshots. No disputes over which version was submitted or when feedback was received.
              </p>
            </Card>
          </div>

          {/* Workflow comparison banner */}
          <div
            style={{
              padding: 'var(--space-8)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }} className="sf-grid-2">
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--color-status-risk)', marginBottom: 'var(--space-3)' }}>
                  Without Syntaflow:
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  <li>• Digging through 40-message email chains to find client constraints</li>
                  <li>• Editing draft documents while client reviews outdated attachments</li>
                  <li>• Handing over final assets without signed sign-off, risking unpaid invoices</li>
                </ul>
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: 'var(--color-status-active)', marginBottom: 'var(--space-3)' }}>
                  With Syntaflow:
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                  <li>✓ Complete client terms, decision-maker, and history in one cockpit</li>
                  <li>✓ Exact version snapshots bound to turnaround SLA chips</li>
                  <li>✓ Enforced delivery gates ensuring sign-off before final archive</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
};
