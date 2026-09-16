import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { CTASection } from '../../components/marketing/CTASection';
import { getRouteMetadata } from '../../seo/seoConfig';

export const AboutPage: React.FC = () => {
  const meta = getRouteMetadata('/about');

  return (
    <div>
      <SEOHead path="/about" />

      <PageHero
        breadcrumbs={meta.breadcrumbs}
        eyebrow="Company // About Us"
        title="Reduce the distance between intention and execution."
        description="Syntaflow was founded on a simple observation: modern software has made client work more fragmented, not less. We are building technology that connects context with outcome."
      />

      <section className="section">
        <div className="container" style={{ maxWidth: '840px' }}>
          {/* Narrative Chapter 1 */}
          <div style={{ marginBottom: 'var(--space-48)' }}>
            <div className="eyebrow">The Origin</div>
            <h2 className="heading-2" style={{ marginBottom: 'var(--space-16)' }}>
              The Great SaaS Fragmentation
            </h2>
            <p className="body-large" style={{ marginBottom: 'var(--space-16)' }}>
              Over the last decade, professional service tools fractured into specialized silos: one tool for email, another for task tracking, another for shared documents, another for electronic signatures, and another for storage.
            </p>
            <p className="body-large">
              Each tool promised productivity, but the cost was devastating: professionals now spend half their working day copying context, pasting links, reconnecting threads, and apologizing for lost decisions.
            </p>
          </div>

          {/* Narrative Chapter 2 */}
          <div style={{ marginBottom: 'var(--space-48)' }}>
            <div className="eyebrow">The Philosophy</div>
            <h2 className="heading-2" style={{ marginBottom: 'var(--space-16)' }}>
              Synthesis + Flow = Syntaflow
            </h2>
            <p className="body-large" style={{ marginBottom: 'var(--space-16)' }}>
              Our name comes from two foundational concepts:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-20)', margin: 'var(--space-24) 0' }}>
              <Card variant="default" style={{ padding: 'var(--space-20)' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--cobalt)', marginBottom: 'var(--space-8)' }}>
                  SYNTHESIS
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  Connecting fragmented client artifacts into one coherent, unified operational record.
                </p>
              </Card>
              <Card variant="default" style={{ padding: 'var(--space-20)' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--cobalt)', marginBottom: 'var(--space-8)' }}>
                  FLOW
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  The psychological state of uninterrupted focus when software does not get in your way.
                </p>
              </Card>
            </div>
            <p className="body-large">
              When synthesis and flow exist simultaneously, work ceases to feel like bureaucratic tracking and returns to the joy of professional craft.
            </p>
          </div>

          {/* Narrative Chapter 3 */}
          <div style={{ marginBottom: 'var(--space-48)' }}>
            <div className="eyebrow">The Conviction</div>
            <h2 className="heading-2" style={{ marginBottom: 'var(--space-16)' }}>
              Increase human agency through intelligent software.
            </h2>
            <p className="body-large" style={{ marginBottom: 'var(--space-16)' }}>
              We reject the premise that technology should replace human discernment with black-box chatbots. True intelligence in software means eliminating administrative friction so humans can focus on high-craft judgment, strategic insight, and authentic client partnerships.
            </p>
            <p className="body-large">
              Syntaflow is engineered for operators who value precision, privacy, and sovereignty. We build software you physically own, running on your machine, protecting your business.
            </p>
          </div>
        </div>
      </section>

      <CTASection
        title="Never lose the thread again."
        description="Experience client operations built for focus and craft."
        primaryLabel="Explore Product"
        primaryHref="/product"
      />
    </div>
  );
};
