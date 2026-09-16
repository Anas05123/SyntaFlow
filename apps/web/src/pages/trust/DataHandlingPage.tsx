import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { CTASection } from '../../components/marketing/CTASection';
import { getRouteMetadata } from '../../seo/seoConfig';

const DATA_HANDLING_PILLARS = [
  {
    title: 'Physical Storage Location',
    description: 'All workspace state records reside on your local disk in the application’s designated userData storage directory. Your files never touch a remote shared database.',
  },
  {
    title: 'Instant Portability & Export',
    description: 'Your data is never trapped in proprietary silos. Syntaflow supports clean JSON and raw SQLite file exports, enabling complete portability to standard database tools.',
  },
  {
    title: 'Local Backup & Restore',
    description: 'Backups are simple filesystem copies. You can snapshot your database file to an external SSD, Time Machine, or encrypted personal cloud backup with zero tool lock-in.',
  },
  {
    title: 'True Deletion Without Remnants',
    description: 'When you delete a client profile or archived project, the records are wiped from local storage. There are no delayed cloud tombstones or hidden soft-deletes.',
  },
];

export const DataHandlingPage: React.FC = () => {
  const meta = getRouteMetadata('/data-handling');

  return (
    <div>
      <SEOHead path="/data-handling" />

      <PageHero
        breadcrumbs={meta.breadcrumbs}
        eyebrow="Trust // Data Handling"
        title="Physical ownership of your client database."
        description="In an era of disappearing SaaS startups and unpredictable price hikes, Syntaflow ensures your business records belong to you forever."
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
            {DATA_HANDLING_PILLARS.map((p) => (
              <Card key={p.title} variant="default" style={{ padding: 'var(--space-28)' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {p.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Experience true software ownership."
        description="Download the Syntaflow desktop preview for Windows."
        primaryLabel="Explore Desktop Preview"
        primaryHref="/download"
      />
    </div>
  );
};
