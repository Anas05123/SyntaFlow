import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { CTASection } from '../../components/marketing/CTASection';

const FREELANCER_BENEFITS = [
  {
    title: 'Zero SaaS Subscription Tax',
    description: 'Stop paying $20/mo each to Notion, Asana, DocuSign, and Harvest. Syntaflow is a high-performance desktop application with local data persistence.',
  },
  {
    title: 'One Record per Client',
    description: 'No more switching tabs between client emails, task lists, and file folders. Proposal, tasks, documents, and sign-offs exist in one continuous thread.',
  },
  {
    title: 'Bulletproof Scope Boundaries',
    description: 'When clients request &ldquo;quick changes,&rdquo; Syntaflow shows exactly what was approved in the immutable DocVersion snapshot, keeping boundaries firm.',
  },
  {
    title: '100% Offline Resilience',
    description: 'Work anywhere without an internet connection. Your clients, tasks, and documents live on your physical machine in high-speed local storage.',
  },
];

export const FreelancersPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Syntaflow for Freelancers & Solos"
        description="Stop paying for fragmented cloud tools. Syntaflow provides independent operators with a unified, offline-first client operations cockpit."
        path="/solutions/freelancers"
      />

      <PageHero
        eyebrow="Solutions // Freelancers & Solos"
        title="Run your entire client practice from one desktop window."
        description="You didn&apos;t go independent to spend your evenings stitching together five subscription tools. Syntaflow keeps your client proposals, project tasks, and approved deliverables in one unified record."
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
            {FREELANCER_BENEFITS.map((b) => (
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
        title="Reclaim your working focus."
        description="Download the Syntaflow desktop preview and run your independent engagements with calm precision."
        primaryLabel="Download Desktop Preview"
        primaryHref="#/product"
      />
    </div>
  );
};
