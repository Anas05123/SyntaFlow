import React, { useState } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from '../../components/ui/Link';
import { CTASection } from '../../components/marketing/CTASection';
import { getRouteMetadata } from '../../seo/seoConfig';

interface EngagementLayer {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  whatYouDo: string[];
  linkHref: string;
  linkText: string;
}

const ENGAGEMENT_LAYERS: EngagementLayer[] = [
  {
    id: 'clients',
    name: 'Clients & Contacts',
    badge: 'RELATIONSHIP LAYER',
    tagline: 'Commercial terms, contacts, and context live in one persistent record.',
    description: 'Stop scattering client agreements across CRM spreadsheets and email threads. Every client in Syntaflow has an operational relationship record tracking active retainers, billing models, designated sign-off authorities, and engagement history.',
    whatYouDo: [
      'Designate primary decision authorities to prevent conflicting stakeholder edits',
      'Track commercial retainers, billing models (fixed, retainer, hourly), and SLA terms',
      'Inspect complete engagement history across proposals, active projects, and past sign-offs',
    ],
    linkHref: '/product/client-management',
    linkText: 'Explore client management workspace →',
  },
  {
    id: 'projects',
    name: 'Projects & Tasks',
    badge: 'ORCHESTRATION LAYER',
    tagline: 'Scoping blueprints and dual-density task boards tied directly to client scope.',
    description: 'Projects in Syntaflow begin with battle-tested scoping blueprints rather than blank task lists. Tasks inherit commercial constraints and link directly to concrete deliverables with decoupled Stage, Attention, and Security states.',
    whatYouDo: [
      'Instantiate scoping blueprints for design systems, web platforms, and advisory sprints',
      'Switch dynamically between compact high-velocity list density and spatial Kanban boards',
      'Attach client correspondence and Drive files directly to active tasks without cloud leakage',
    ],
    linkHref: '/product/projects',
    linkText: 'Explore client project management →',
  },
  {
    id: 'documents',
    name: 'Documents & Versions',
    badge: 'STUDIO LAYER',
    tagline: 'Typographic paper studio producing immutable DocVersion snapshots.',
    description: 'Compose proposals, technical briefs, and scopes of work on a focused 780px paper canvas. When submitted, document drafts freeze into unalterable, SHA-256 hashed DocVersion snapshots that prevent accidental or silent revisions.',
    whatYouDo: [
      'Draft in a typographic environment styled for client readability and visual hierarchy',
      'Freeze submitted drafts into immutable DocVersion snapshots (v01.0, v02.0) with cryptographic hashes',
      'Inspect visual side-by-side diffs between any two version snapshots to verify changes',
    ],
    linkHref: '/product/documents',
    linkText: 'Explore document workflow & versions →',
  },
  {
    id: 'reviews',
    name: 'Reviews & Approvals',
    badge: 'GOVERNANCE LAYER',
    tagline: 'Feedback, decisions, and sign-offs bind to the exact version snapshot.',
    description: 'Eliminate scope disputes and ambiguous approvals. Review requests link directly to immutable snapshots, ensuring client feedback and approvals are permanently anchored to the exact deliverable reviewed.',
    whatYouDo: [
      'Dispatch cryptographic review tokens to designated client decision-makers',
      'Anchor structured comments and annotations directly to specific version paragraphs',
      'Record timestamped approval decisions in a tamper-evident audit trail',
    ],
    linkHref: '/product/reviews-approvals',
    linkText: 'Explore reviews & approvals software →',
  },
  {
    id: 'delivery',
    name: 'Delivery Gates',
    badge: 'RELEASE LAYER',
    tagline: 'Enforce prerequisite sign-offs before production handover.',
    description: 'Syntaflow delivery gates ensure that no final code, assets, or production invoices leave your workstation until all prerequisite milestone approvals have cleared. Gate logic protects agency margins and eliminates premature releases.',
    whatYouDo: [
      'Define logical gate prerequisites (e.g., DocVersion sign-off + invoice clearance)',
      'Automate gate evaluation to lock releases until all conditions are satisfied',
      'Generate sealed handover manifests containing all approved artifacts and audit records',
    ],
    linkHref: '/product/reviews-approvals',
    linkText: 'Inspect delivery gate enforcement →',
  },
  {
    id: 'integrations',
    name: 'Connected Tools',
    badge: 'INTEGRATIONS LAYER',
    tagline: 'Surface external communications, files, and calendars in client context.',
    description: 'Integrate external tools directly into the client engagement without giving third parties access to your workstation. OAuth tokens are encrypted in OS-backed keychains, querying only threads relevant to active client projects.',
    whatYouDo: [
      'Pull relevant Gmail message threads directly into active project correspondence',
      'Sync Google Calendar milestones and review deadlines with local schedules',
      'Attach Google Drive assets and GitHub commits directly to task deliverables',
    ],
    linkHref: '/integrations',
    linkText: 'Explore connected tools catalog →',
  },
  {
    id: 'ai',
    name: 'AI-Assisted Workflows',
    badge: 'INTELLIGENCE LAYER',
    tagline: 'Synthesize briefs, tasks, and proposals using real work context.',
    description: 'Syntaflow routes requests through local LLMs (via Ollama) or private endpoints using the context already attached to your client record. AI never trains on your data, and critical actions require manual operator confirmation.',
    whatYouDo: [
      'Generate initial scoping drafts and task breakdowns from client brief emails',
      'Synthesize review summaries and change logs across version iterations',
      'Operate locally with zero cloud data exposure or model training leakage',
    ],
    linkHref: '/product/ai-workspace',
    linkText: 'Explore context-aware AI workspace →',
  },
];

export const ProductOverviewPage: React.FC = () => {
  const meta = getRouteMetadata('/product');
  const [activeLayerId, setActiveLayerId] = useState<string>('clients');
  const activeLayer = ENGAGEMENT_LAYERS.find((l) => l.id === activeLayerId) || ENGAGEMENT_LAYERS[0];

  return (
    <div>
      <SEOHead path="/product" />

      <PageHero
        breadcrumbs={meta.breadcrumbs}
        eyebrow="Product // System Overview"
        title="One workspace for the complete client engagement."
        description="Syntaflow is client work management software engineered for professional clarity. From inbound request to delivery gate sign-off, every document, task, integration, and AI-assisted workflow stays connected to the client engagement."
        status="AVAILABLE NOW"
      >
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <Button href="/download" variant="primary">
            Download Syntaflow Preview &rarr;
          </Button>
          <Button href="/product/reviews-approvals" variant="secondary">
            Inspect Reviews & Approvals &rarr;
          </Button>
        </div>
      </PageHero>

      {/* 1. INTERACTIVE ENGAGEMENT ARCHITECTURE SWITCHER */}
      <section className="section" style={{ paddingTop: 'var(--space-24)', paddingBottom: 'var(--space-64)' }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-40)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              UNIFIED OPERATING LAYERS
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(26px, 3.8vw, 36px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              How Syntaflow connects the complete client engagement.
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
              Select an operational layer below to see how context flows seamlessly across every stage of client delivery.
            </p>
          </div>

          {/* Navigation Pill Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: 'var(--space-32)' }}>
            {ENGAGEMENT_LAYERS.map((layer) => {
              const active = layer.id === activeLayerId;
              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => setActiveLayerId(layer.id)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontFamily: 'var(--font-mono)',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: active ? 'var(--cyan)' : 'var(--border)',
                    backgroundColor: active ? 'rgba(6, 182, 212, 0.12)' : 'var(--surface-sunken)',
                    color: active ? 'var(--cyan)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {layer.name}
                </button>
              );
            })}
          </div>

          {/* Detailed Active Layer Display */}
          <Card variant="raised" style={{ padding: 'clamp(24px, 4vw, 40px)', backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: 'var(--space-16)' }}>
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {activeLayer.badge}
                </span>
                <h3 style={{ fontSize: '26px', fontWeight: 600, color: 'var(--text)', marginTop: '4px', margin: 0 }}>
                  {activeLayer.name}
                </h3>
              </div>
              <Link
                href={activeLayer.linkHref}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(37, 99, 235, 0.1)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  color: '#60A5FA',
                  fontSize: '13px',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                {activeLayer.linkText}
              </Link>
            </div>

            <p style={{ fontSize: '17px', color: 'var(--text)', lineHeight: 1.6, marginBottom: 'var(--space-16)', fontWeight: 500 }}>
              {activeLayer.tagline}
            </p>

            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 'var(--space-28)' }}>
              {activeLayer.description}
            </p>

            <div style={{ backgroundColor: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: '8px', padding: 'var(--space-20)' }}>
              <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', textTransform: 'uppercase', marginBottom: '12px' }}>
                WHAT YOU ACTUALLY DO IN THIS LAYER
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeLayer.whatYouDo.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: 'var(--text-muted)' }}>
                    <span style={{ color: 'var(--cyan)', marginTop: '2px' }}>›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </section>

      {/* 2. THE COMPLETE ENGAGEMENT LIFECYCLE (Brief to Delivery) */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)', backgroundColor: 'var(--canvas)' }}>
        <div className="container" style={{ maxWidth: '1080px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-48)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              END-TO-END WORKFLOW
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(26px, 3.8vw, 36px)', color: 'var(--text)', marginTop: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
              From initial brief to sealed delivery handover.
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto' }}>
              Unlike task trackers that abandon you when deliverables need client review, Syntaflow covers every milestone of client operations.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-20)',
            }}
          >
            <Card variant="default" style={{ padding: 'var(--space-28)', backgroundColor: 'var(--surface-raised)' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase' }}>
                01 // COMMERCIAL SCOPING
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginTop: '8px', marginBottom: '8px' }}>
                Contractual Scope & Blueprint Launch
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-16)' }}>
                Client engagements begin by defining commercial terms (fixed, retainer, hourly), billing milestones, and launching battle-tested scoping blueprints.
              </p>
              <Link href="/product/projects" style={{ fontSize: '13px', color: 'var(--cyan)' }}>
                Explore scoping blueprints &rarr;
              </Link>
            </Card>

            <Card variant="default" style={{ padding: 'var(--space-28)', backgroundColor: 'var(--surface-raised)' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase' }}>
                02 // EXECUTION & SPECIFICATION
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginTop: '8px', marginBottom: '8px' }}>
                Dual-Density Tasks & Paper Studio
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-16)' }}>
                Coordinate work packages with decoupled Stage, Attention, and Security states. Draft specifications and deliverables on a 780px typographic canvas.
              </p>
              <Link href="/product/documents" style={{ fontSize: '13px', color: 'var(--cyan)' }}>
                Inspect typographic paper canvas &rarr;
              </Link>
            </Card>

            <Card variant="default" style={{ padding: 'var(--space-28)', backgroundColor: 'var(--surface-raised)' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase' }}>
                03 // EXACT VERSION REVIEW
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginTop: '8px', marginBottom: '8px' }}>
                Immutable Snapshots & Decision Binding
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-16)' }}>
                Submitted drafts freeze into immutable DocVersion snapshots. Client review feedback, annotations, and formal approvals bind permanently to the snapshot hash.
              </p>
              <Link href="/product/reviews-approvals" style={{ fontSize: '13px', color: 'var(--cyan)' }}>
                Inspect review & approval workflows &rarr;
              </Link>
            </Card>

            <Card variant="default" style={{ padding: 'var(--space-28)', backgroundColor: 'var(--surface-raised)' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase' }}>
                04 // DELIVERY HANDOVER
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginTop: '8px', marginBottom: '8px' }}>
                Prerequisite Gates & Release Bundles
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-16)' }}>
                Delivery gates enforce that no final release bundle or production invoice is unlocked until 100% of prerequisite milestone approvals are verified.
              </p>
              <Link href="/product/reviews-approvals" style={{ fontSize: '13px', color: 'var(--cyan)' }}>
                Review delivery gate governance &rarr;
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT PAGES NAVIGATION DIRECTORY */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-64)', paddingBottom: 'var(--space-64)' }}>
        <div className="container" style={{ maxWidth: '1040px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-44)' }}>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              PRODUCT DIRECTORY
            </span>
            <h2 className="heading-2" style={{ fontSize: 'clamp(24px, 3.5vw, 32px)', color: 'var(--text)', marginTop: 'var(--space-12)' }}>
              Explore specific product capabilities.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-16)' }}>
            <Card variant="default" style={{ padding: 'var(--space-20)' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', margin: '0 0 6px 0' }}>Client Management</h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>Contacts, commercial retainers, and history.</p>
              <Link href="/product/client-management" style={{ fontSize: '12.5px', color: 'var(--cyan)' }}>Inspect Client Workspace &rarr;</Link>
            </Card>

            <Card variant="default" style={{ padding: 'var(--space-20)' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', margin: '0 0 6px 0' }}>Projects & Tasks</h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>Blueprints and dual-density task boards.</p>
              <Link href="/product/projects" style={{ fontSize: '12.5px', color: 'var(--cyan)' }}>Inspect Project Systems &rarr;</Link>
            </Card>

            <Card variant="default" style={{ padding: 'var(--space-20)' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', margin: '0 0 6px 0' }}>Documents & Versions</h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>Typographic canvas and immutable snapshots.</p>
              <Link href="/product/documents" style={{ fontSize: '12.5px', color: 'var(--cyan)' }}>Inspect Paper Studio &rarr;</Link>
            </Card>

            <Card variant="default" style={{ padding: 'var(--space-20)' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', margin: '0 0 6px 0' }}>Reviews & Approvals</h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>Snapshot binding and delivery gate enforcement.</p>
              <Link href="/product/reviews-approvals" style={{ fontSize: '12.5px', color: 'var(--cyan)' }}>Inspect Review Systems &rarr;</Link>
            </Card>

            <Card variant="default" style={{ padding: 'var(--space-20)' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', margin: '0 0 6px 0' }}>Context-Aware AI</h4>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>Local TaskRouter without cloud training leaks.</p>
              <Link href="/product/ai-workspace" style={{ fontSize: '12.5px', color: 'var(--cyan)' }}>Inspect AI Engine &rarr;</Link>
            </Card>
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to run client engagements in one unified workspace?"
        description="Experience client operations designed for version integrity, transparent reviews, and zero SaaS lock-in."
        primaryLabel="Download Syntaflow Preview"
        primaryHref="/download"
        secondaryLabel="View Solutions by Role"
        secondaryHref="/solutions"
      />
    </div>
  );
};
