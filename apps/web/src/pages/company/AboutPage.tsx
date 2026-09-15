import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { CTASection } from '../../components/marketing/CTASection';

export const AboutPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="About Syntaflow — Intelligence in Flow"
        description="Our mission: reduce the distance between intention and execution. Learn the story, principles, and team behind Syntaflow."
        path="/about"
      />

      <PageHero
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-20)', margin: 'var(--space-24) 0' }}>
              <Card variant="subtle" style={{ padding: 'var(--space-24)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--cyan)', fontWeight: 700, marginBottom: '8px' }}>
                  SYNTA // SYNTHESIS
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Bringing client context, agreed terms, execution tasks, and document versions into one unified living record.
                </p>
              </Card>
              <Card variant="subtle" style={{ padding: 'var(--space-24)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--cobalt)', fontWeight: 700, marginBottom: '8px' }}>
                  FLOW // MOVEMENT
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Continuous, uninterrupted progression from initial client contact through signed deliverable handover.
                </p>
              </Card>
            </div>
          </div>

          {/* Narrative Chapter 3 */}
          <div>
            <div className="eyebrow">Our Purpose</div>
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
        primaryHref="#/product"
      />
    </div>
  );
};
