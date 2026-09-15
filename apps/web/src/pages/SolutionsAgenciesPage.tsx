import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { PageHero } from '../components/marketing/PageHero';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { CTASection } from '../components/marketing/CTASection';

export const SolutionsAgenciesPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Syntaflow for Boutique Agencies — Deliver Multi-Client Rigor"
        description="Keep boutique client rosters, deliverables, and team context connected. Eliminate scope creep and delivery drift across active agency accounts."
      />

      <PageHero
        eyebrow="Solutions for Agencies"
        title="Run boutique agency accounts with zero delivery drift."
        description="Managing multiple high-stakes client relationships requires shared operational memory. Syntaflow provides agency leads and producers with one unified desktop cockpit across every active engagement."
        primaryCta={{ label: 'Get Desktop App (v0.1)', href: '/download' }}
        secondaryCta={{ label: 'Explore Projects & Tasks', href: '/product/projects-tasks' }}
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
              Built for high-craft client rosters.
            </h2>
            <p style={{ fontSize: 'var(--fs-body-lg)', color: 'var(--color-text-secondary)', maxWidth: '720px' }}>
              Boutique agencies win by being faster, sharper, and more attentive than legacy holding companies. Syntaflow is your operational edge.
            </p>
          </div>

          <div className="sf-grid-3" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-16)' }}>
            <Card padding="lg">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                PORTFOLIO PULSE
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                Multi-Client Cockpit
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
                Instant visibility into upcoming milestones, unreviewed client packages, and blocked deliverables across your entire account roster from the Operator Home screen.
              </p>
            </Card>

            <Card padding="lg">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cobalt-hover)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                SCOPE PROTECTION
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                Milestone Dependencies
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
                Enforce prerequisite task dependencies. Prevent developers or designers from starting sprint phases until prerequisite briefs and approvals are formally locked.
              </p>
            </Card>

            <Card padding="lg">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-status-active)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                EXECUTIVE PACKAGING
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                Client Presentation Studio
              </h3>
              <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', margin: 0 }}>
                Deliver presentations, strategy decks, and brand books with Executive Editorial or Modern Studio styling. Attach agency case studies to reinforce ongoing value.
              </p>
            </Card>
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
};
