import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { PageHero } from '../components/marketing/PageHero';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SOLUTIONS_NAV } from '../content/navData';
import { CTASection } from '../components/marketing/CTASection';

export const SolutionsOverviewPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Solutions for Client Services & Knowledge Workers — Syntaflow"
        description="Tailored client engagement workflows for freelancers, boutique agencies, strategic consultants, and design studios."
      />

      <PageHero
        eyebrow="Solutions Architecture"
        title="Tailored for serious client engagements."
        description="Whether you run solo $10k advisory retainers or coordinate a boutique 15-person creative agency, Syntaflow adapts to your operational scale without sacrificing domain rigor."
        primaryCta={{ label: 'Get Desktop App (v0.1)', href: '/download' }}
        secondaryCta={{ label: 'Explore Product Pillars', href: '/product' }}
      />

      <section className="sf-section">
        <Container>
          <div className="sf-grid-2" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-16)' }}>
            {SOLUTIONS_NAV.map((sol) => (
              <Card key={sol.href} padding="lg" interactive>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {sol.label}
                  </h3>
                  {sol.badge && <StatusBadge status={sol.badge} size="sm" />}
                </div>
                <p style={{ fontSize: '0.9375rem', lineHeight: '1.6', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
                  {sol.description}
                </p>
                <Button href={sol.href} variant="outline" size="sm">
                  View {sol.label} Workflows →
                </Button>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
};
