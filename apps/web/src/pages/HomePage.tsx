import React from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Button } from '../components/ui/Button';
import { HeroProductMockup } from '../components/marketing/HeroProductMockup';
import { ProblemSection } from '../components/marketing/ProblemSection';
import { CoreIdeaSection } from '../components/marketing/CoreIdeaSection';
import { ProductWorkflow } from '../components/marketing/ProductWorkflow';
import { HumanControlSection } from '../components/marketing/HumanControlSection';
import { SecuritySummarySection } from '../components/marketing/SecuritySummarySection';
import { CTASection } from '../components/marketing/CTASection';

export const HomePage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Syntaflow — From Context to Action"
        description="Syntaflow is a desktop-first client engagement environment that keeps one continuous, connected record of every client relationship — from first contact through final delivery."
        path="/"
      />

      {/* Hero Section */}
      <section style={{ paddingTop: 'clamp(48px, 8vw, 96px)', paddingBottom: 'clamp(48px, 6vw, 80px)' }}>
        <div className="container">
          <div style={{ maxWidth: '860px', marginBottom: 'var(--space-48)' }}>
            <div className="eyebrow">Desktop-First Client Operations</div>
            <h1 className="display-hero hero-kinetic" style={{ marginBottom: 'var(--space-24)' }}>
              Intelligence that keeps work moving.
            </h1>
            <p className="body-large" style={{ fontSize: '20px', lineHeight: 1.55, maxWidth: '720px', marginBottom: 'var(--space-32)' }}>
              Syntaflow keeps the context, history, and decisions behind every client engagement in one continuous record — from first contact to final delivery.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-16)', alignItems: 'center' }}>
              <Button href="#/product" variant="primary" size="lg">
                Explore Syntaflow
              </Button>
              <Button href="#/product/documents-reviews" variant="secondary" size="lg">
                See How Reviews Work
              </Button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: 'var(--space-24)', fontSize: '12.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>
              <span>✓ Windows Desktop Preview</span>
              <span>✓ 100% Local SQLite Data</span>
              <span>✓ Zero Cloud Surveillance</span>
            </div>
          </div>

          {/* Real Product Snapshot Mockup */}
          <div className="scroll-reveal" style={{ marginTop: 'var(--space-24)' }}>
            <HeroProductMockup />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <ProblemSection />

      {/* Core Idea Section */}
      <CoreIdeaSection />

      {/* Product Workflow Section (The Strongest Section) */}
      <ProductWorkflow />

      {/* Human Control Section */}
      <HumanControlSection />

      {/* Security Summary Section */}
      <SecuritySummarySection />

      {/* Bottom CTA */}
      <CTASection
        title="Stop losing the thread of client work."
        description="Run your client engagements inside an environment built for focus, data sovereignty, and unalterable review records."
        primaryLabel="Explore Desktop Preview"
        primaryHref="#/product"
        secondaryLabel="Explore All Solutions"
        secondaryHref="#/solutions/freelancers"
      />
    </div>
  );
};
