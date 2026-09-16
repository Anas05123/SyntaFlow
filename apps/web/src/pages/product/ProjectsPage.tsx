import React, { useState } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from '../../components/ui/Link';
import { CTASection } from '../../components/marketing/CTASection';
import { getRouteMetadata } from '../../seo/seoConfig';

export const ProjectsPage: React.FC = () => {
  const meta = getRouteMetadata('/product/projects');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  const projectFeatures = [
    {
      title: 'Scoping Blueprints',
      badge: 'ORCHESTRATION',
      problem: 'Starting projects from scratch leads to forgotten deliverables and chaotic estimation.',
      solution: 'Deploy battle-tested scoping blueprints for design systems, web platforms, and retainer sprints. Work packages spawn with predefined milestone dependencies.',
      action: 'Select a blueprint template during project initialization. Tasks, required document schemas, and review milestones populate automatically.',
    },
    {
      title: 'Dual-Density Task Boards',
      badge: 'EXECUTION',
      problem: 'Standard task managers force you into one view—either too cluttered or lacking spatial context.',
      solution: 'Toggle instantly between a compact, high-velocity List density for rapid triage and an expansive spatial Kanban Board for milestone tracking.',
      action: 'Switch views with a single keystroke. Tasks preserve decoupled 3D state: Lifecycle Stage (Todo, Doing, Review, Done), Operational Attention (Urgent, Waiting, Blocked), and Security Access.',
    },
    {
      title: 'Direct Document & Deliverable Binding',
      badge: 'CONTEXT',
      problem: 'Task cards lack connection to actual deliverable drafts, forcing teams to search cloud folders.',
      solution: 'Tasks in Syntaflow link directly to active document drafts on the typographic paper canvas. When work completes, the task marks done and references the frozen version snapshot.',
      action: 'Open associated specifications or design documents straight from the task card. Trace exact commit hashes and Google Drive asset links in the task thread.',
    },
    {
      title: 'Milestone Delivery Gates',
      badge: 'GOVERNANCE',
      problem: 'Teams close projects without formal sign-offs, causing payment disputes and scope debates.',
      solution: 'Milestones enforce delivery gates. Tasks assigned to a milestone cannot clear the gate until all prerequisite client approvals are cryptographically verified.',
      action: 'Track gate status in real-time. Review approvals feed directly into milestone completion metrics, giving clients and team members transparent delivery certainty.',
    },
  ];

  return (
    <div>
      <SEOHead path="/product/projects" />

      <PageHero
        breadcrumbs={meta.breadcrumbs}
        eyebrow="Product // Projects & Tasks"
        title="Projects with the context attached."
        description="Syntaflow client project management software brings scoping blueprints, dual-density task boards, milestone tracking, and deliverable review links into one continuous operational thread."
        status="AVAILABLE NOW"
      >
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <Button href="/download" variant="primary">
            Download Syntaflow Preview &rarr;
          </Button>
          <Button href="/product/documents" variant="secondary">
            Inspect Document Workflows &rarr;
          </Button>
        </div>
      </PageHero>

      {/* 1. ARCHITECTURAL DISTINCTION: CONTEXT ATTACHED */}
      <section className="section" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-48)' }}>
        <div className="container" style={{ maxWidth: '980px' }}>
          <Card variant="raised" style={{ padding: 'clamp(24px, 4vw, 36px)', backgroundColor: 'var(--surface-raised)', borderLeft: '4px solid #3B82F6' }}>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#3B82F6', textTransform: 'uppercase', marginBottom: '8px' }}>
              CONTEXT-FIRST PROJECT MANAGEMENT
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>
              Why task cards cannot exist in isolation.
            </h3>
            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
              Generic project tools treat tasks as isolated cards detached from the commercial agreement, client communications, and deliverable files. Syntaflow grounds every task in client context: scoping blueprints define work packages from signed agreements, tasks link directly to typographic document snapshots, and milestone clearance binds directly to client sign-off records.
            </p>
          </Card>
        </div>
      </section>

      {/* 2. DUAL-DENSITY INTERFACE PREVIEW */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)', backgroundColor: 'var(--canvas)' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-32)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              DUAL-DENSITY WORKSPACE PREVIEW
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(26px, 3.8vw, 36px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              Engineered for velocity and spatial clarity.
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto var(--space-24) auto' }}>
              Toggle between high-density list rows for rapid batch management and visual Kanban columns for milestone status.
            </p>

            {/* Toggle View Mode */}
            <div style={{ display: 'inline-flex', gap: '4px', padding: '4px', backgroundColor: 'var(--surface-raised)', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={() => setViewMode('board')}
                style={{
                  padding: '6px 16px',
                  borderRadius: '4px',
                  fontSize: '12.5px',
                  fontFamily: 'var(--font-mono)',
                  border: 'none',
                  backgroundColor: viewMode === 'board' ? 'var(--cyan)' : 'transparent',
                  color: viewMode === 'board' ? '#000' : 'var(--text-muted)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                KANBAN BOARD VIEW
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                style={{
                  padding: '6px 16px',
                  borderRadius: '4px',
                  fontSize: '12.5px',
                  fontFamily: 'var(--font-mono)',
                  border: 'none',
                  backgroundColor: viewMode === 'list' ? 'var(--cyan)' : 'transparent',
                  color: viewMode === 'list' ? '#000' : 'var(--text-muted)',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                COMPACT LIST DENSITY
              </button>
            </div>
          </div>

          {/* Interactive UI Representation */}
          <div
            style={{
              backgroundColor: '#0B0D0F',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
            }}
          >
            {viewMode === 'board' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ color: 'var(--text-metadata)', fontSize: '11px', marginBottom: '12px' }}>01 // IN PROGRESS (2)</div>
                  <div style={{ padding: '12px', backgroundColor: 'var(--surface-raised)', borderRadius: '6px', border: '1px solid var(--border)', marginBottom: '8px' }}>
                    <div style={{ color: '#F8FAFC', fontWeight: 600 }}>Synthesize client brief from thread</div>
                    <div style={{ color: 'var(--cyan)', fontSize: '11px', marginTop: '4px' }}>Acme Corp · Gmail Ref #491</div>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: 'var(--surface-raised)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                    <div style={{ color: '#F8FAFC', fontWeight: 600 }}>Implement design tokens schema</div>
                    <div style={{ color: '#60A5FA', fontSize: '11px', marginTop: '4px' }}>Northlight · Figma Token Ref</div>
                  </div>
                </div>

                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ color: 'var(--cyan)', fontSize: '11px', marginBottom: '12px' }}>02 // UNDER REVIEW (1)</div>
                  <div style={{ padding: '12px', backgroundColor: 'var(--surface-raised)', borderRadius: '6px', border: '1px solid var(--cyan)', marginBottom: '8px' }}>
                    <div style={{ color: '#F8FAFC', fontWeight: 600 }}>Brand Architecture v03.0</div>
                    <div style={{ color: '#10B981', fontSize: '11px', marginTop: '4px' }}>DocVersion Snapshot #9c8cf98f</div>
                  </div>
                </div>

                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ color: '#10B981', fontSize: '11px', marginBottom: '12px' }}>03 // CLEARED FOR GATE (2)</div>
                  <div style={{ padding: '12px', backgroundColor: 'var(--surface-raised)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '8px' }}>
                    <div style={{ color: '#F8FAFC', fontWeight: 600 }}>Engagement Proposal Signed</div>
                    <div style={{ color: 'var(--text-metadata)', fontSize: '11px', marginTop: '4px' }}>Signed by VP Brand · Sealed</div>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: 'var(--surface-raised)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    <div style={{ color: '#F8FAFC', fontWeight: 600 }}>Milestone 1 Scope Clearance</div>
                    <div style={{ color: 'var(--text-metadata)', fontSize: '11px', marginTop: '4px' }}>Gate Check: PASSED</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { id: 'TSK-101', title: 'Synthesize client brief from attached Gmail thread', client: 'Acme Corp', stage: 'DOING', attention: 'URGENT', deliverable: 'Brief v01.2' },
                  { id: 'TSK-102', title: 'Render typographic paper canvas for Brand Guidelines', client: 'Acme Corp', stage: 'REVIEW', attention: 'NORMAL', deliverable: 'DocVersion v03.0' },
                  { id: 'TSK-103', title: 'Implement design token schema for Web Studio', client: 'Northlight', stage: 'DOING', attention: 'WAITING', deliverable: 'Tokens Repo' },
                  { id: 'TSK-104', title: 'Verify prerequisite sign-offs on Delivery Gate bundle', client: 'Vertex Labs', stage: 'TODO', attention: 'BLOCKED', deliverable: 'Handover Package' },
                  { id: 'TSK-105', title: 'Engagement Proposal & Retainer Commercial Terms', client: 'Acme Corp', stage: 'DONE', attention: 'SEALED', deliverable: 'Agreement v01.0' },
                ].map((row) => (
                  <div key={row.id} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'var(--surface-raised)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: 'var(--cyan)', fontSize: '11.5px' }}>{row.id}</span>
                      <span style={{ color: '#F8FAFC', fontWeight: 500 }}>{row.title}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11.5px' }}>
                      <span style={{ color: 'var(--text-metadata)' }}>{row.client}</span>
                      <span style={{ color: '#60A5FA' }}>{row.deliverable}</span>
                      <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: row.stage === 'DONE' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.15)', color: row.stage === 'DONE' ? '#10B981' : 'var(--cyan)' }}>
                        {row.stage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE PROJECT CAPABILITIES */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-48)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              PROJECT CAPABILITIES
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(26px, 3.8vw, 36px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              Full project lifecycle with zero context loss.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-24)' }}>
            {projectFeatures.map((f) => (
              <Card key={f.title} variant="default" style={{ padding: 'var(--space-28)', backgroundColor: 'var(--surface-raised)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {f.badge}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginTop: '8px', marginBottom: 'var(--space-12)' }}>
                    {f.title}
                  </h3>

                  <div style={{ marginBottom: 'var(--space-16)' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#EF4444', textTransform: 'uppercase', marginBottom: '4px' }}>
                      THE PROBLEM
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                      {f.problem}
                    </p>
                  </div>

                  <div style={{ marginBottom: 'var(--space-16)' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#10B981', textTransform: 'uppercase', marginBottom: '4px' }}>
                      HOW SYNTAFLOW HELPS
                    </div>
                    <p style={{ fontSize: '13.5px', color: 'var(--text)', lineHeight: 1.5, margin: 0 }}>
                      {f.solution}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '12px 14px', backgroundColor: 'var(--surface-sunken)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    WHAT YOU ACTUALLY DO
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {f.action}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. NATURAL CROSS-LINKS */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-48)', paddingBottom: 'var(--space-48)', backgroundColor: 'var(--canvas)' }}>
        <div className="container" style={{ maxWidth: '980px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-20)' }}>
            Connected workflows that extend beyond project boards
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', fontSize: '14px' }}>
            <Link href="/product/documents" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Inspect Typographic Document Canvas &rarr;
            </Link>
            <Link href="/product/reviews-approvals" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Explore Review & Approval Governance &rarr;
            </Link>
            <Link href="/integrations" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Connect Gmail, Drive & GitHub &rarr;
            </Link>
            <Link href="/product/client-management" style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>
              Command Client Accounts & Retainers &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title="Stop managing client projects with detached task cards."
        description="Experience scoping blueprints and dual-density boards with client context permanently attached."
        primaryLabel="Download Syntaflow Preview"
        primaryHref="/download"
        secondaryLabel="Inspect Document Workflows"
        secondaryHref="/product/documents"
      />
    </div>
  );
};
