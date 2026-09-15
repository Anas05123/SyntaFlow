import React, { useState } from 'react';
import { Button } from '../ui/Button';

interface LifecycleStage {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  invariant: string;
  inputs: string[];
  deliverable: string;
  routeLink: string;
}

const STAGES: LifecycleStage[] = [
  {
    step: '01',
    title: 'Request & Intake',
    subtitle: 'Client Discovery',
    description: 'Capture initial inquiry, commercial constraints, budget thresholds, and primary decision-makers into an active client record.',
    invariant: 'Client context is established once and persists across all future engagements.',
    inputs: ['Brand / Organization Details', 'Commercial Scope Requirements', 'Decision-Maker Contact & SLA'],
    deliverable: 'Active Client Record with Historical Context',
    routeLink: '/product/client-operations',
  },
  {
    step: '02',
    title: 'Proposal & Scoping',
    subtitle: 'Blueprint Architecture',
    description: 'Select pre-packaged scoping blueprints (Brand Identity, Web Experience, Strategic Advisory) with transparent commercial models (Fixed, Retainer, Hourly).',
    invariant: 'Scope cannot enter execution without explicit commercial agreement parameters.',
    inputs: ['Scoping Blueprint Selection', 'Milestone Schedule & Target Dates', 'Billing Structure & SLA Expectations'],
    deliverable: 'Structured Proposal Document & Scoped Milestones',
    routeLink: '/product/client-operations',
  },
  {
    step: '03',
    title: 'Agreement & Terms',
    subtitle: 'Contractual Baseline',
    description: 'Formalize terms, service levels, and scope boundaries before active work begins. Preserves exact commercial agreements directly inside the client workspace.',
    invariant: 'Commercial terms remain permanently accessible alongside working execution records.',
    inputs: ['Confirmed Scope Schedule', 'Payment Schedule & Retainer Cycles', 'Authorized Client Signatures'],
    deliverable: 'Binding Commercial Baseline',
    routeLink: '/product/client-operations',
  },
  {
    step: '04',
    title: 'Work & Tasks',
    subtitle: 'High-Density Execution',
    description: 'Execute milestones across responsive Board and List task views. Decouples production stage (To Do / In Progress / Done) from operational attention (Waiting / Blocked / Overdue).',
    invariant: 'Decoupled 3D status prevents blocked tasks from being misrepresented as merely in progress.',
    inputs: ['Milestone Tasks & Deliverable Bindings', 'Prerequisite Task Dependencies', 'Operational Attention Flags'],
    deliverable: 'Scoped Execution Board with Dependency Enforcement',
    routeLink: '/product/projects-tasks',
  },
  {
    step: '05',
    title: 'Document Studio',
    subtitle: 'Continuous Editorial Canvas',
    description: 'Draft strategy, briefs, proposals, and deliverables on a unified 3-column desktop studio with continuous reading hierarchy and live dirty/saving state indicators.',
    invariant: 'Submitted document versions (DocVersion) are strictly immutable snapshots.',
    inputs: ['Working Section Drafts', 'Internal Team Review Notes', 'Presentation Template Selection'],
    deliverable: 'Immutable Snapshot Version (v1.0, v1.1)',
    routeLink: '/product/documents-reviews',
  },
  {
    step: '06',
    title: 'Review & Revision',
    subtitle: 'Transmission Studio',
    description: 'Submit immutable version snapshots to clients with cover letters, turnaround SLAs, and three distinct presentation templates (Executive Editorial, Modern Studio, Enterprise Formal).',
    invariant: 'Review decisions bind strictly to exact version snapshots, never to mutable drafts.',
    inputs: ['Version Snapshot Confirmation', 'Turnaround SLA Chip', 'Client Feedback & Decision Log'],
    deliverable: 'Formal Review Package with Decision Audit Trail',
    routeLink: '/product/documents-reviews',
  },
  {
    step: '07',
    title: 'Approval & Delivery',
    subtitle: 'Gate Enforcement & Handover',
    description: 'Final delivery packages enforce prerequisite approval gates. Every required milestone document must be formally approved by the client before handover completion.',
    invariant: 'Delivery gates cannot be bypassed; final packages enforce 100% deliverable sign-off.',
    inputs: ['All Prerequisite Deliverable Approvals', 'Client Sign-Off Record', 'Exported Artifact Package'],
    deliverable: 'Closed Engagement Package with Complete Decision History',
    routeLink: '/product/delivery-approvals',
  },
];

export const LifecycleStepper: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const active = STAGES[selectedIdx];

  return (
    <div
      role="region"
      aria-label="Interactive 7-stage client lifecycle explorer"
      style={{
        width: '100%',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Horizontal Step Buttons */}
      <div
        role="tablist"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface-raised)',
        }}
        className="sf-lifecycle-tabs"
      >
        {STAGES.map((s, idx) => {
          const isCurrent = idx === selectedIdx;
          return (
            <button
              key={s.step}
              role="tab"
              aria-selected={isCurrent}
              onClick={() => setSelectedIdx(idx)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: 'var(--space-4)',
                backgroundColor: isCurrent ? 'var(--color-surface)' : 'transparent',
                border: 'none',
                borderBottom: isCurrent ? '2px solid var(--color-cobalt)' : '2px solid transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--duration-fast)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: isCurrent ? 'var(--color-cyan)' : 'var(--color-text-tertiary)',
                  marginBottom: '0.25rem',
                }}
              >
                {s.step}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.875rem',
                  fontWeight: isCurrent ? 600 : 500,
                  color: isCurrent ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                }}
              >
                {s.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Step Detail Panel */}
      <div
        style={{
          padding: 'var(--space-8)',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 'var(--space-8)',
          alignItems: 'center',
        }}
        className="sf-lifecycle-detail"
      >
        {/* Left: Narrative & Description */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'var(--space-3)' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                color: 'var(--color-cyan)',
                fontWeight: 600,
              }}
            >
              STAGE {active.step} OF 07
            </span>
            <span style={{ color: 'var(--color-border-bright)' }}>•</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-tertiary)' }}>{active.subtitle}</span>
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--fs-h3)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-4)',
            }}
          >
            {active.title}
          </h3>

          <p
            style={{
              fontSize: 'var(--fs-body)',
              lineHeight: '1.65',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-6)',
            }}
          >
            {active.description}
          </p>

          <div
            style={{
              padding: 'var(--space-4)',
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              borderLeft: '3px solid var(--color-cobalt)',
              borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              marginBottom: 'var(--space-6)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--color-cobalt-hover)',
                fontWeight: 600,
                textTransform: 'uppercase',
                marginBottom: '0.25rem',
              }}
            >
              System Invariant
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', lineHeight: '1.5' }}>
              {active.invariant}
            </div>
          </div>

          <Button href={active.routeLink} variant="outline" size="sm">
            Learn More About {active.title} →
          </Button>
        </div>

        {/* Right: Technical Anatomy Card */}
        <div
          style={{
            backgroundColor: 'var(--color-canvas)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 'var(--space-4)',
              paddingBottom: 'var(--space-2)',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}
          >
            Stage Inputs & Requirements
          </div>

          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: 'var(--space-6)' }}>
            {active.inputs.map((inp, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                <span style={{ color: 'var(--color-cyan)', fontSize: '0.75rem' }}>✓</span>
                <span>{inp}</span>
              </li>
            ))}
          </ul>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 'var(--space-2)',
            }}
          >
            Verified Canonical Output
          </div>
          <div
            style={{
              padding: 'var(--space-3) var(--space-4)',
              backgroundColor: 'var(--color-surface-raised)',
              border: '1px solid var(--color-border-bright)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}
          >
            {active.deliverable}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .sf-lifecycle-tabs {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .sf-lifecycle-detail {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 560px) {
          .sf-lifecycle-tabs {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};
