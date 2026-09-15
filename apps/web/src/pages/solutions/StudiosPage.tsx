import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { CTASection } from '../../components/marketing/CTASection';

const STUDIO_BENEFITS = [
  {
    title: 'Brand & Technical Blueprints',
    description: 'Deploy pre-packaged scoping templates for Brand Identity Systems, Design Systems & Web Platforms, and Production Sprints.',
  },
  {
    title: 'Studio Showcase Attachments',
    description: 'Attach studio case studies, visual hero assets, and design metrics directly to review transmissions, framing deliverable quality with executive prestige.',
  },
  {
    title: 'Immutable Version Snapshots',
    description: 'Eliminate confusion over &ldquo;Final_v2_FINAL.pdf&rdquo;. Every transmission is bound to an immutable DocVersion with exact byte-level verification.',
  },
  {
    title: 'Gated Handover Packaging',
    description: 'Lock delivery bundles until all prerequisite client approvals are recorded, protecting studio IP from premature uncompensated release.',
  },
];

export const StudiosPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Syntaflow for Studios & Production Practices"
        description="Design studios and technical practices. Blueprints, showcase attachments, immutable version snapshots, and gated production handovers."
        path="/solutions/studios"
      />

      <PageHero
        eyebrow="Solutions // Studios & Production"
        title="Engineered for practices where domain craft matters."
        description="High-end studios don&apos;t compromise on design craft. Syntaflow provides an executive desktop workspace that treats client deliverables with the respect they deserve."
        status="AVAILABLE NOW"
      />

      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-24)',
            }}
          >
            {STUDIO_BENEFITS.map((b) => (
              <Card key={b.title} variant="default" style={{ padding: 'var(--space-28)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {b.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Elevate your studio&apos;s client delivery."
        description="Run production handovers that reflect your standards of design and technical excellence."
        primaryLabel="Explore Delivery & Approvals"
        primaryHref="#/product/delivery-approvals"
      />
    </div>
  );
};
