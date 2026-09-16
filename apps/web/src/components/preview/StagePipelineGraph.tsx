import React, { useState } from 'react';
import { Card } from '../ui/Card';

interface StageNode {
  id: string;
  num: string;
  name: string;
  category: string;
  status: string;
  statusColor: string;
  icon: string;
  headline: string;
  inputs: string[];
  engineAction: string;
  outputs: string[];
  studioStory: string;
  simulatorTab: 'cockpit' | 'blueprints' | 'tasks' | 'documents' | 'reviews' | 'gate';
}

const STAGES: StageNode[] = [
  {
    id: 'request',
    num: '01',
    name: 'Request',
    category: 'CLIENT OPS',
    status: 'INGESTED',
    statusColor: '#06B6D4',
    icon: '✉',
    headline: 'Inbound requests and client briefs attached directly to the engagement record.',
    inputs: ['Client Gmail thread', 'Commercial budget constraint ($36k)', 'Decision maker (VP Brand)'],
    engineAction: 'Local contextual parser indexes key goals without cloud data leakage.',
    outputs: ['Client Relationship Record', 'Scoping parameters draft'],
    studioStory: 'Sarah Jenkins sends email request with 3 deliverables. Syntaflow creates the client container directly from the thread.',
    simulatorTab: 'cockpit',
  },
  {
    id: 'proposal',
    num: '02',
    name: 'Proposal',
    category: 'COMMERCIAL',
    status: 'STRUCTURED',
    statusColor: '#3B82F6',
    icon: '§',
    headline: 'Commercial terms and milestones committed without SaaS fragmentation.',
    inputs: ['Client Record', 'Fixed budget & billing terms'],
    engineAction: 'Calculates milestone runways and embeds acceptable use conditions.',
    outputs: ['Signed Engagement Agreement', 'Blueprint scoping template'],
    studioStory: 'Retainer scope agreed. Terms bind directly into the project blueprint—no orphaned spreadsheets.',
    simulatorTab: 'blueprints',
  },
  {
    id: 'project',
    num: '03',
    name: 'Project',
    category: 'ORCHESTRATION',
    status: 'ACTIVE',
    statusColor: '#8B5CF6',
    icon: '◫',
    headline: 'Scoping blueprints and dual-density task boards linked to the client record.',
    inputs: ['Signed Proposal', 'Milestone dates'],
    engineAction: 'Instantiates 3-phase milestone graph and populates operational task items.',
    outputs: ['Dual-Density Kanban Board', 'Deliverable checklist manifests'],
    studioStory: '12 tasks spawned across 3 milestones. Task cards maintain 3D decoupled state (Stage, Attention, Security).',
    simulatorTab: 'tasks',
  },
  {
    id: 'review',
    num: '04',
    name: 'Review',
    category: 'STUDIO DOCS',
    status: 'IMMUTABLE',
    statusColor: '#EC4899',
    icon: '▤',
    headline: 'Distraction-free paper studio generating frozen DocVersion snapshots.',
    inputs: ['Task specifications', 'Design token schema'],
    engineAction: 'Renders physical 780px paper document and freezes SHA256 snapshot hash upon transmission.',
    outputs: ['Immutable DocVersion v03.0', 'Cryptographic snapshot hash'],
    studioStory: 'Specification written on typographic paper. Submitting freezes v03.0 into an unalterable review record.',
    simulatorTab: 'documents',
  },
  {
    id: 'approval',
    num: '05',
    name: 'Approval',
    category: 'APPROVALS',
    status: 'SIGNED',
    statusColor: '#F59E0B',
    icon: '✓',
    headline: 'Client reviews and decisions bind strictly to exact version snapshots.',
    inputs: ['DocVersion v03.0 snapshot', 'Client access token'],
    engineAction: 'Records timestamped decision with decision-maker identity and audit trail.',
    outputs: ['Legally defensible sign-off record', 'Prerequisite gate clearance'],
    studioStory: 'Sarah Jenkins approves v03.0. Approval is immutably sealed against snapshot hash #9c8cf98f.',
    simulatorTab: 'reviews',
  },
  {
    id: 'delivery',
    num: '06',
    name: 'Delivery',
    category: 'GOVERNANCE',
    status: 'UNLOCKED',
    statusColor: '#10B981',
    icon: '🔒',
    headline: 'Delivery gate enforcement prevents release until all prerequisites pass.',
    inputs: ['All milestone approvals', 'Verified asset bundle', 'Final invoice payment'],
    engineAction: 'Evaluates logical gate preconditions. Unlocks production handover package upon 100% pass.',
    outputs: ['Sealed Production Release Bundle', 'Archived Engagement Manifest'],
    studioStory: 'Prerequisites 1, 2, and 3 validated. Gate opens and production package is marked ready for release.',
    simulatorTab: 'gate',
  },
];

interface Props {
  onSelectSimulatorView?: (view: 'cockpit' | 'blueprints' | 'tasks' | 'documents' | 'reviews' | 'gate') => void;
}

export const StagePipelineGraph: React.FC<Props> = ({ onSelectSimulatorView }) => {
  const [activeStageIndex, setActiveStageIndex] = useState(2); // Blueprint default
  const active = STAGES[activeStageIndex];

  return (
    <div style={{ width: '100%', fontFamily: 'var(--font-body)' }}>
      {/* 1. HORIZONTAL PIPELINE GRAPH VISUALIZER */}
      <div
        style={{
          position: 'relative',
          backgroundColor: 'var(--surface-raised)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '24px 20px',
          marginBottom: '24px',
          overflowX: 'auto',
        }}
      >
        {/* Subtle Background Circuit Lines (SVG) */}
        <div style={{ position: 'relative', minWidth: '780px' }}>
          {/* Connecting Circuit Cable */}
          <div
            style={{
              position: 'absolute',
              top: '28px',
              left: '40px',
              right: '40px',
              height: '3px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              zIndex: 0,
            }}
          >
            {/* Animated Signal Flow on active segment */}
            <div
              style={{
                height: '100%',
                width: `${(activeStageIndex / (STAGES.length - 1)) * 100}%`,
                background: 'linear-gradient(90deg, #2563EB, #06B6D4, #10B981)',
                transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 0 12px rgba(6, 182, 212, 0.6)',
              }}
            />
          </div>

          {/* Nodes Row */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${STAGES.length}, 1fr)`, gap: '12px', position: 'relative', zIndex: 1 }}>
            {STAGES.map((st, idx) => {
              const isSelected = idx === activeStageIndex;
              const isPassed = idx <= activeStageIndex;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setActiveStageIndex(idx);
                    if (onSelectSimulatorView) onSelectSimulatorView(st.simulatorTab);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    outline: 'none',
                  }}
                >
                  {/* Node Circle */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? 'var(--canvas)' : (isPassed ? '#181E24' : '#101316'),
                      border: '2px solid',
                      borderColor: isSelected ? 'var(--cyan)' : (isPassed ? 'rgba(6, 182, 212, 0.5)' : 'rgba(255, 255, 255, 0.1)'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      color: isSelected ? 'var(--cyan)' : (isPassed ? 'var(--text)' : 'var(--text-disabled)'),
                      boxShadow: isSelected ? '0 0 20px 2px rgba(6, 182, 212, 0.4)' : 'none',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      marginBottom: '10px',
                    }}
                    className={isSelected ? 'pulse-glow' : ''}
                  >
                    <span>{st.icon}</span>
                  </div>

                  {/* Stage Number & Title */}
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: isSelected ? 'var(--cyan)' : 'var(--text-metadata)', fontWeight: 600 }}>
                    STAGE {st.num}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: isSelected ? 600 : 500, color: isSelected ? 'var(--text)' : 'var(--text-muted)', marginTop: '2px' }}>
                    {st.name}
                  </span>

                  {/* Status Pill */}
                  <span
                    style={{
                      marginTop: '6px',
                      fontSize: '9.5px',
                      fontFamily: 'var(--font-mono)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: isSelected ? `${st.statusColor}25` : 'rgba(255,255,255,0.04)',
                      color: isSelected ? st.statusColor : 'var(--text-disabled)',
                      border: '1px solid',
                      borderColor: isSelected ? `${st.statusColor}50` : 'transparent',
                    }}
                  >
                    {st.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE STAGE INSPECTOR */}
      <Card
        variant="raised"
        style={{
          padding: '28px',
          backgroundColor: '#101316',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: active.statusColor, padding: '2px 8px', backgroundColor: `${active.statusColor}18`, borderRadius: '4px', border: `1px solid ${active.statusColor}40` }}>
                STAGE {active.num} // {active.category}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-metadata)' }}>
                Step {activeStageIndex + 1} of 6
              </span>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
              {active.headline}
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {activeStageIndex > 0 && (
              <button
                type="button"
                onClick={() => setActiveStageIndex(activeStageIndex - 1)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  backgroundColor: '#181C20',
                  color: 'var(--text-muted)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                &larr; Previous Stage
              </button>
            )}
            {activeStageIndex < STAGES.length - 1 && (
              <button
                type="button"
                onClick={() => setActiveStageIndex(activeStageIndex + 1)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(6, 182, 212, 0.15)',
                  color: 'var(--cyan)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Next Stage &rarr;
              </button>
            )}
          </div>
        </div>

        {/* 3-Column Data Transformation Pipeline */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          {/* Input Packet */}
          <div style={{ backgroundColor: '#15191E', borderRadius: '8px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', textTransform: 'uppercase', marginBottom: '8px' }}>
              INPUT ARTIFACTS
            </div>
            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12.5px', color: 'var(--text)', lineHeight: 1.6 }}>
              {active.inputs.map((inp, i) => (
                <li key={i}>{inp}</li>
              ))}
            </ul>
          </div>

          {/* Engine Processing */}
          <div style={{ backgroundColor: '#15191E', borderRadius: '8px', padding: '16px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
            <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '8px' }}>
              LOCAL SYNTAFLOW ACTION
            </div>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {active.engineAction}
            </p>
          </div>

          {/* Output Packet */}
          <div style={{ backgroundColor: '#15191E', borderRadius: '8px', padding: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: '#10B981', textTransform: 'uppercase', marginBottom: '8px' }}>
              OUTPUT COMMITMENT
            </div>
            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12.5px', color: 'var(--text)', lineHeight: 1.6 }}>
              {active.outputs.map((out, i) => (
                <li key={i}>{out}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Real-world Studio Scenario */}
        <div style={{ padding: '14px 16px', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text)' }}>Real Studio Context:</strong> {active.studioStory}
          </div>
        </div>
      </Card>
    </div>
  );
};
