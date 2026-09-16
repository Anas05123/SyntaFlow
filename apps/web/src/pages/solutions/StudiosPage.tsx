import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { CTASection } from '../../components/marketing/CTASection';
import { getRouteMetadata } from '../../seo/seoConfig';

const STUDIO_BENEFITS = [
  {
    title: 'Executive Visual Artifacts',
    description: 'Present deliverable milestones with design fidelity. Attach rich media, typography previews, and interaction specifications directly to DocVersions.',
  },
  {
    title: 'Dual-Density Kanban & Tables',
    description: 'Switch between an aesthetic visual kanban and a dense, keyboard-driven production table during complex sprint phases.',
  },
  {
    title: 'Client Review Snapshots',
    description: 'Transmit clean, branded review links to clients without requiring them to install software. Collect timestamped sign-offs on frozen version states.',
  },
  {
    title: 'Gated Handover Packaging',
    description: 'Ensure deliverables, assets, and design system tokens are only transferred once milestone invoices and approvals are recorded.',
  },
];

export const StudiosPage: React.FC = () => {
  const meta = getRouteMetadata('/solutions/studios');

  return (
    <div>
      <SEOHead path="/solutions/studios" />

      <PageHero
        breadcrumbs={meta.breadcrumbs}
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
        primaryHref="/product/delivery-approvals"
      />
    </div>
  );
};
