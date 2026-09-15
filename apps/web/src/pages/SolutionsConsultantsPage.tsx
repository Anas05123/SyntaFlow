import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { PageHero } from '../components/marketing/PageHero';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { CTASection } from '../components/marketing/CTASection';

export const SolutionsConsultantsPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Syntaflow for Strategic Consultants — Protect Retainers & Decisions"
        description="Strategic advisory retainers, documented decision logs, milestone turnaround SLAs, and executive editorial presentation templates."
      />

      <PageHero
        eyebrow="Solutions for Consultants"
        title="Institutional memory for high-value advisory retainers."
        description="Consulting value is built on judgment, clarity, and trust. Syntaflow preserves the strategic rationale, executive decisions, and milestone sign-offs behind your advisory engagements."
        primaryCta={{ label: 'Get Desktop App (v0.1)', href: '/download' }}
        secondaryCta={{ label: 'See Documents & Reviews', href: '/product/documents-reviews' }}
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
              Why senior consultants choose Syntaflow.
            </h2>
            <p style={{ fontSize: 'var(--fs-body-lg)', color: 'var(--color-text-secondary)', maxWidth: '720px' }}>
              When clients pay $10k–$50k/month for strategic counsel, they expect seamless accountability. Syntaflow ensures no verbal agreement or decision is forgotten.
            </p>
          </div>

          <div className="sf-grid-3" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-16)' }}>
            <Card padding="lg">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                AUDIT TRAIL
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                Decision Logging
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
                Every advisory session produces strategic decisions. Record authorized signers, agreed next steps, and turnaround SLAs directly beside working documentation.
              </p>
            </Card>

            <Card padding="lg">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cobalt-hover)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                EXECUTIVE FORMATTING
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                Executive Editorial Canvas
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
                Present strategic memos, quarterly audit reports, and roadmap assessments with typographic elegance calibrated for C-suite reading habits.
              </p>
            </Card>

            <Card padding="lg">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-status-active)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                CONFIDENTIALITY
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                Physical Machine Sovereignty
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
                Client acquisition terms, competitive strategy, and NDA-protected data stay on your local SSD. No third-party LLMs train on your private advisory memos.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
};
