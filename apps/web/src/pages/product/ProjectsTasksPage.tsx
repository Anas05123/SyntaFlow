import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { CTASection } from '../../components/marketing/CTASection';

const PROJECT_FEATURES = [
  {
    title: 'Blueprint Scoping Studio',
    description: 'Launch client engagements using validated project blueprints: Brand Identity Systems, Digital Product & Web Experiences, or Advisory Retainers.',
    code: 'FEATURE // 01',
  },
  {
    title: 'Dual-Density Task Views',
    description: 'Switch seamlessly between an executive kanban Board and a dense tabular List. Responsive density modes adapt cleanly from laptop displays to 1920px ultrawide displays.',
    code: 'FEATURE // 02',
  },
  {
    title: 'Decoupled 3D Status Model',
    description: 'Track production stage (To Do, In Progress, Done) independently from operational attention (Waiting on Client, Blocked, Review Active). Never confuse a stage with an attention alert.',
    code: 'FEATURE // 03',
  },
  {
    title: 'Unified Task Detail Inspector',
    description: 'Flyout task inspector with route-aware lifecycle, keyboard shortcuts (Escape stack, focus restoration), and direct linkage to deliverable document versions.',
    code: 'FEATURE // 04',
  },
];

export const ProjectsTasksPage: React.FC = () => {
  return (
    <div>
      <SEOHead
        title="Projects & Tasks — Syntaflow"
        description="Scoping blueprints, dual-density task boards, decoupled 3D status tracking, and deliverable linkage in a high-density desktop environment."
        path="/product/projects-tasks"
      />

      <PageHero
        eyebrow="Product // Projects & Tasks"
        title="Execute deliverables with engineered clarity."
        description="Stop fighting generic project boards that hide client scope. Syntaflow connects every task directly to milestone deliverables, signed briefs, and client review states."
        status="AVAILABLE NOW"
      />

      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-24)',
              marginBottom: 'var(--space-64)',
            }}
          >
            {PROJECT_FEATURES.map((f) => (
              <Card key={f.title} variant="default" style={{ padding: 'var(--space-28)' }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', marginBottom: 'var(--space-12)' }}>
                  {f.code}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {f.description}
                </p>
              </Card>
            ))}
          </div>

          <Card variant="raised" style={{ padding: 'var(--space-32)', borderLeft: '4px solid var(--cyan)' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 'var(--space-8)' }}>
              CORE ARCHITECTURAL INVARIANT
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
              Decoupled Production Stage and Operational Attention
            </h4>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              In standard project software, a task marked &ldquo;Waiting on Client&rdquo; gets shoved into a fake status column that hides whether it is half-completed or blocked. In Syntaflow, production progress (`stage`) and workflow friction (`attention`) are orthogonal dimensions.
            </p>
          </Card>
        </div>
      </section>

      <CTASection
        title="Experience task execution tied to real deliverables."
        description="See how document versions and client reviews are born directly out of project tasks."
        primaryLabel="Explore Documents & Reviews"
        primaryHref="#/product/documents-reviews"
      />
    </div>
  );
};
