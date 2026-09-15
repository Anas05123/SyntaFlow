import React, { useState } from 'react';
import { Card } from '../ui/Card';

interface WorkflowStage {
  id: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  invariant: string;
  screenSnippet: {
    statusBadge: string;
    headline: string;
    details: string[];
    actionLabel: string;
  };
}

const STAGES: WorkflowStage[] = [
  {
    id: 'request',
    number: '01',
    name: 'Request',
    tagline: 'Inbound client context and primary decision-maker identification.',
    description: 'Every engagement begins with structured client context: commercial terms, primary contact identity, and organizational brief.',
    invariant: 'Identity Anchoring: Key decisions bind directly to authorized client contacts.',
    screenSnippet: {
      statusBadge: 'NEW REQUEST',
      headline: 'Vance Capital // Brand Architecture & Portal',
      details: ['Contact: Elena Vance (Managing Director)', 'Budget Model: Fixed Commercial Engagement ($32,000)', 'Target Launch: Q3 Milestone Target'],
      actionLabel: 'Convert to Scoped Proposal →',
    },
  },
  {
    id: 'proposal',
    number: '02',
    name: 'Proposal',
    tagline: 'Structured blueprint scoping and commercial milestones.',
    description: 'Assemble multi-step project blueprints with explicit deliverables, turnaround SLAs, and payment schedules.',
    invariant: 'Blueprint Scoping: Estimates originate from structured operational templates.',
    screenSnippet: {
      statusBadge: 'DRAFT PROPOSAL',
      headline: 'Commercial Scope Package v1.0',
      details: ['Scope: 3 Core Deliverables, 12 Atomic Tasks', 'Turnaround SLA: 48-Hour Decision Window', 'Payment Gate: 50% Upfront, 50% on Handover'],
      actionLabel: 'Transmit Agreement to Client →',
    },
  },
  {
    id: 'agreement',
    number: '03',
    name: 'Agreement',
    tagline: 'Mutual commercial commitment and workspace initialization.',
    description: 'Signed agreements immediately initialize the project cockpit, establishing the canonical record for all downstream work.',
    invariant: 'Single Canonical Record: Project initialization binds directly to agreed terms.',
    screenSnippet: {
      statusBadge: 'COMMITTED AGREEMENT',
      headline: 'Contract #ENG-2026-08 Executed',
      details: ['Status: Active Commercial Project', 'Retainer Hours: 60 Monthly Allocated', 'Workspace Route: #/workspace/vance-capital'],
      actionLabel: 'Launch Project Workspace →',
    },
  },
  {
    id: 'work',
    number: '04',
    name: 'Work',
    tagline: 'Dual-density task execution and milestone tracking.',
    description: 'Execute deliverables with responsive list and board views, tracking production stage, blocker risk, and client wait states.',
    invariant: 'Decoupled 3D Status: Production stage and operational attention stay separate.',
    screenSnippet: {
      statusBadge: 'IN PRODUCTION',
      headline: 'Active Sprint // Design Tokens & Typography',
      details: ['Board View: 14 Active Tasks across 3 Columns', 'Attention Flag: 1 Client Blocker Resolved', 'Density Mode: High-Density 1440px Table View'],
      actionLabel: 'Compile Document Version →',
    },
  },
  {
    id: 'review',
    number: '05',
    name: 'Review',
    tagline: 'Immutable DocVersion transmission via the editorial guest surface.',
    description: 'Package deliverable drafts into strictly immutable DocVersion snapshots, served via executive editorial presentation shells.',
    invariant: 'Document Version Immutability: Submitted versions are frozen against revision.',
    screenSnippet: {
      statusBadge: 'TRANSMISSION ACTIVE',
      headline: 'Design System Documentation v2.0',
      details: ['Presentation Shell: Executive Editorial', 'Transmission Cover Letter: Included', 'Guest Link: Secure token-bound portal route'],
      actionLabel: 'Submit for Client Sign-Off →',
    },
  },
  {
    id: 'approval',
    number: '06',
    name: 'Approval',
    tagline: 'Client feedback capture and decision snapshot locking.',
    description: 'Clients review clean editorial pages without installing software. Approvals or revisions bind permanently to that specific version SHA.',
    invariant: 'Exact Version Review: Sign-off binds strictly to the immutable snapshot.',
    screenSnippet: {
      statusBadge: 'SIGNED OFF',
      headline: 'Client Decision Locked // Elena Vance',
      details: ['Decision: Approved without Revisions', 'Timestamp: 2026-09-15 14:32:10 UTC', 'Audit Anchor: Cryptographic state hash verified'],
      actionLabel: 'Unlock Final Delivery Gate →',
    },
  },
  {
    id: 'delivery',
    number: '07',
    name: 'Delivery',
    tagline: 'Enforced delivery gate handover and permanent project archive.',
    description: 'Final assets and invoices cannot be released until all prerequisite deliverables have passed approval gates.',
    invariant: 'Delivery Gate Enforcement: Final packages require all prerequisites approved.',
    screenSnippet: {
      statusBadge: 'DELIVERED & ARCHIVED',
      headline: 'Project Handover Complete',
      details: ['Prerequisites: 3/3 Deliverables Approved', 'Delivery Gate: Unlocked and Discharged', 'Archive: Preserved in local SQLite database'],
      actionLabel: 'View Archived Engagement Record →',
    },
  },
];

export const ProductWorkflow: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const stage = STAGES[activeStageIndex];

  return (
    <section className="section scroll-reveal" style={{ borderTop: '1px solid var(--edge)' }}>
      <div className="container">
        <div style={{ maxWidth: '820px', marginBottom: 'var(--space-40)' }}>
          <div className="eyebrow">The 7-Stage Commercial Lifecycle</div>
          <h2 className="heading-1" style={{ marginBottom: 'var(--space-16)' }}>
            From first contact to final delivery.
          </h2>
          <p className="body-large">
            Syntaflow doesn&apos;t treat work as random to-do lists. It guides client engagements through seven rigorous operational gates, preserving full context at every handoff.
          </p>
        </div>

        {/* Interactive Step Navigator Bar */}
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '8px',
            paddingBottom: '16px',
            marginBottom: 'var(--space-32)',
            borderBottom: '1px solid var(--edge)',
            scrollbarWidth: 'none',
          }}
        >
          {STAGES.map((s, idx) => {
            const isActive = idx === activeStageIndex;
            return (
              <button
                key={s.id}
                type="button"
                data-stage-id={s.id}
                onClick={() => setActiveStageIndex(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  backgroundColor: isActive ? 'var(--surface-raised)' : 'transparent',
                  border: isActive ? '1px solid var(--cobalt)' : '1px solid var(--edge)',
                  borderRadius: 'var(--radius-sm)',
                  color: isActive ? 'var(--text)' : 'var(--text-muted)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: isActive ? 'var(--cyan)' : 'var(--text-metadata)',
                  }}
                >
                  {s.number}
                </span>
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Inspector Canvas */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-32)',
            alignItems: 'stretch',
          }}
        >
          {/* Left Explanation Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-16)' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--cyan)',
                }}
              >
                STAGE {stage.number} OF 07
              </span>
              <span style={{ height: '1px', flex: 1, backgroundColor: 'var(--divider)' }} />
            </div>

            <h3 className="heading-2" style={{ marginBottom: 'var(--space-16)' }}>
              {stage.name}: {stage.tagline}
            </h3>

            <p className="body-large" style={{ marginBottom: 'var(--space-24)' }}>
              {stage.description}
            </p>

            <div
              style={{
                padding: '16px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--edge)',
                borderRadius: 'var(--radius-sm)',
                borderLeft: '3px solid var(--cyan)',
                marginBottom: 'var(--space-32)',
              }}
            >
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '4px' }}>
                CANONICAL INVARIANT
              </div>
              <div style={{ fontSize: '13.5px', color: 'var(--text)', fontWeight: 500 }}>
                {stage.invariant}
              </div>
            </div>

            {/* Stepper Controls */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setActiveStageIndex(Math.max(0, activeStageIndex - 1))}
                disabled={activeStageIndex === 0}
                style={{
                  padding: '8px 18px',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--edge)',
                  borderRadius: 'var(--radius-sm)',
                  color: activeStageIndex === 0 ? 'var(--text-disabled)' : 'var(--text)',
                  cursor: activeStageIndex === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '13.5px',
                  fontWeight: 500,
                }}
              >
                ← Previous Stage
              </button>
              <button
                type="button"
                onClick={() => setActiveStageIndex(Math.min(STAGES.length - 1, activeStageIndex + 1))}
                disabled={activeStageIndex === STAGES.length - 1}
                style={{
                  padding: '8px 18px',
                  backgroundColor: activeStageIndex === STAGES.length - 1 ? 'transparent' : 'var(--cobalt)',
                  border: activeStageIndex === STAGES.length - 1 ? '1px solid var(--edge)' : '1px solid var(--cobalt)',
                  borderRadius: 'var(--radius-sm)',
                  color: activeStageIndex === STAGES.length - 1 ? 'var(--text-disabled)' : '#FFFFFF',
                  cursor: activeStageIndex === STAGES.length - 1 ? 'not-allowed' : 'pointer',
                  fontSize: '13.5px',
                  fontWeight: 500,
                }}
              >
                Next Stage ({STAGES[Math.min(STAGES.length - 1, activeStageIndex + 1)].name}) →
              </button>
            </div>
          </div>

          {/* Right Live Simulation Card */}
          <Card variant="raised" style={{ padding: 'var(--space-32)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-20)' }}>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'var(--cobalt-subtle)',
                    color: 'var(--cobalt)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  {stage.screenSnippet.statusBadge}
                </span>
                <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>
                  SYNTAFLOW LOCAL ENGINE
                </span>
              </div>

              <h4 style={{ fontSize: '19px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-16)' }}>
                {stage.screenSnippet.headline}
              </h4>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: 'var(--space-24)' }}>
                {stage.screenSnippet.details.map((detail) => (
                  <li
                    key={detail}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '13.5px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--cyan)' }} />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                paddingTop: 'var(--space-16)',
                borderTop: '1px solid var(--divider)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '12.5px', color: 'var(--text-metadata)', fontFamily: 'var(--font-mono)' }}>
                GATE STATUS: PASSING
              </span>
              <span style={{ fontSize: '12.5px', color: 'var(--cyan)', fontWeight: 600 }}>
                {stage.screenSnippet.actionLabel}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
