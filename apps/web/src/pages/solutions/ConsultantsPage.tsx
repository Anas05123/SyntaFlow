import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { CTASection } from '../../components/marketing/CTASection';

const CONSULTANT_BENEFITS = [
  {
    title: 'Advisory Retainer Management',
    description: 'Track monthly advisory allocations, recurring client engagements, and scope utilization directly within the client profile.',
  },
  {
    title: 'Executive Paper Reading Studio',
    description: 'Draft strategic recommendations, diagnostic memos, and governance specs in a distraction-free editorial studio with continuous typographic reading canvas.',
  },
  {
    title: 'Complete Client Confidentiality',
    description: 'Sensitive board decks, financial restructuring notes, and executive memos remain on your physical machine with zero cloud surveillance or third-party AI scraping.',
  },
  {
    title: 'Signed Decision Audit Trails',
    description: 'Maintain an unalterable chronological record of board approvals and client feedback with cryptographic version snapshots.',
  },
];

export const ConsultantsPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Syntaflow for Consultants & Advisors"
        description="Strategic advisory operations. Manage retainers, draft executive memos, and preserve absolute client confidentiality with local-first desktop persistence."
        path="/solutions/consultants"
      />

      <PageHero
        eyebrow="Solutions // Consultants & Advisors"
        title="Advisory operations with uncompromising confidentiality."
        description="Strategic consultants handle enterprise secrets and high-stakes decisions. Syntaflow provides an executive desktop environment that keeps client data strictly in your possession."
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
            {CONSULTANT_BENEFITS.map((b) => (
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
        title="Protect your advisory practice."
        description="Maintain pristine records of client advice, board sign-offs, and retainer commitments."
        primaryLabel="Review Security Model"
        primaryHref="#/security"
      />
    </div>
  );
};
