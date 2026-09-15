import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { PageHero } from '../components/marketing/PageHero';
import { Container } from '../components/ui/Container';
import { FeatureRail } from '../components/marketing/FeatureRail';
import { CTASection } from '../components/marketing/CTASection';

export const ProductProjectsTasksPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Projects & Tasks Workspace — Syntaflow"
        description="Structured desktop project inventory tables, blueprint scoping studios, responsive dual Board/List views, and decoupled 3D task dimensions."
      />

      <PageHero
        eyebrow="Product Pillar"
        title="Projects & Tasks"
        description="Scoped execution with blueprint architectures, responsive task boards, and decoupled status, attention, and priority dimensions."
        primaryCta={{ label: 'Explore Documents & Reviews', href: '/product/documents-reviews' }}
        secondaryCta={{ label: 'Get Desktop App', href: '/download' }}
      />

      <section className="sf-section">
        <Container>
          {/* Feature 1: Structured Projects Table */}
          <FeatureRail
            tag="PROJECTS INVENTORY"
            title="Desktop inventory without artificial progress bars."
            description="Traditional tools invent artificial percentage bars (e.g. '68% complete') that provide false confidence. Syntaflow replaces them with structured inventory tables: stage chips, operational attention, next upcoming milestone, target delivery date, and review state."
            invariant="Stage, Attention, and Security Access are three separate dimensions and never collapse into a single status field."
            bullets={[
              'Stage dimension: Intake → Active → Review → Delivery → Completed',
              'Attention dimension: On Track, Waiting on Client, Blocked, or Overdue',
              'Instant jump to scoped workspace tabs: Scope, Milestones, Tasks, Documents, Deliverables',
            ]}
            visual={
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                <div style={{ color: 'var(--color-cyan)', marginBottom: '0.5rem', fontWeight: 600 }}>// STRUCTURED INVENTORY ROW</div>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-surface-raised)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Acme Corp Rebrand</span>
                    <span style={{ color: 'var(--color-status-waiting)' }}>[Waiting on Client]</span>
                  </div>
                  <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem' }}>
                    Next Milestone: Brand Guidelines v1.0 • Due Sep 24 • Review: Pending Owner Approval
                  </div>
                </div>
              </div>
            }
          />

          {/* Feature 2: Blueprint Scoping Studio */}
          <FeatureRail
            reversed
            tag="SCOPING STUDIO"
            title="Pre-packaged scoping blueprints."
            description="Eliminate blank-slate proposal writing. Syntaflow includes specialized scoping blueprints tailored for professional client engagements: Brand Identity System, Design System & Web Experience, and Strategic Advisory Retainer."
            invariant="Blueprints auto-populate prerequisite deliverables, milestone dependencies, and review turnaround SLAs."
            bullets={[
              'Brand Identity System: Research, identity directions, asset delivery packages',
              'Design System & Web Experience: Information architecture, design tokens, component library',
              'Strategic Advisory Retainer: Recurring monthly milestones, decision audit logs, SLA check-ins',
            ]}
            visual={
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                <div style={{ color: 'var(--color-cobalt-hover)', marginBottom: '0.5rem', fontWeight: 600 }}>// SCOPING BLUEPRINT SELECTION</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'rgba(37,99,235,0.12)', borderLeft: '3px solid var(--color-cobalt)', borderRadius: '4px' }}>
                    <span style={{ color: '#fff', fontWeight: 600 }}>Design System & Web Experience</span>
                    <div style={{ color: 'var(--color-text-tertiary)', fontSize: '0.75rem' }}>4 Milestones • 12 Pre-configured Deliverables • Dual Gate Sign-off</div>
                  </div>
                </div>
              </div>
            }
          />

          {/* Feature 3: Tasks Workspace & Responsive Density */}
          <FeatureRail
            tag="TASK EXECUTION"
            title="Dual Board and List with responsive density."
            description="Seamlessly toggle between Kanban Board and dense Inventory List views. Responsive density automatically calibrates to your display width: compact under 1100px, regular up to 1450px, and wide on multi-monitor setups."
            invariant="Dedicated horizontal scroll wrap prevents column clipping; side-by-side inspector engages at >= 1100px."
            bullets={[
              'Dual views: [ Board ] for visual pipeline flow and [ List ] for high-density audits',
              'Side-by-side Task Panel inspector with full Escape key stack and guaranteed focus return',
              'Task dependencies enforce prerequisite order before deliverables can be submitted',
            ]}
            visual={
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                <div style={{ color: 'var(--color-status-active)', marginBottom: '0.5rem', fontWeight: 600 }}>// 3D TASK DIMENSIONS</div>
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-surface-raised)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>Refine Primary Mark Geometry</div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ padding: '2px 6px', backgroundColor: 'rgba(37,99,235,0.2)', color: 'var(--color-cobalt-hover)', borderRadius: '4px', fontSize: '0.6875rem' }}>Stage: In Progress</span>
                    <span style={{ padding: '2px 6px', backgroundColor: 'rgba(239,68,68,0.2)', color: 'var(--color-status-risk)', borderRadius: '4px', fontSize: '0.6875rem' }}>Attention: Blocked (Waiting Assets)</span>
                    <span style={{ padding: '2px 6px', backgroundColor: 'rgba(255,255,255,0.08)', color: 'var(--color-text-secondary)', borderRadius: '4px', fontSize: '0.6875rem' }}>Priority: Urgent</span>
                  </div>
                </div>
              </div>
            }
          />
        </Container>
      </section>

      <CTASection />
    </>
  );
};
