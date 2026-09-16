import React, { useState } from 'react';

interface FlowNode {
  id: string;
  label: string;
  sublabel: string;
  detail: string;
  color: string;
  activePulse?: boolean;
}

const FLOW_NODES: FlowNode[] = [
  {
    id: 'client',
    label: 'Client Account',
    sublabel: 'Commercial Terms',
    detail: 'Legal terms, billing rates, and authorized signatories locked into workspace context.',
    color: '#3b82f6',
  },
  {
    id: 'project',
    label: 'Project Scoping',
    sublabel: 'Blueprint Studio',
    detail: 'Milestones, dual-density task boards, and automated resource budget allocations.',
    color: '#00f2fe',
  },
  {
    id: 'document',
    label: 'Document Studio',
    sublabel: 'Paper Canvas',
    detail: 'Typographic drafting with local-first version snapshots and contextual AI synthesis.',
    color: '#38bdf8',
  },
  {
    id: 'review',
    label: 'Client Review',
    sublabel: 'Immutable Packages',
    detail: 'Version-locked review bundles with cryptographic hash stamps and audit trails.',
    color: '#6366f1',
    activePulse: true,
  },
  {
    id: 'approval',
    label: 'Gate Sign-Off',
    sublabel: 'Approval Authority',
    detail: 'Strict multi-party sign-offs preventing premature deliveries and unvetted releases.',
    color: '#10b981',
  },
  {
    id: 'delivery',
    label: 'Handover Package',
    sublabel: 'Verified Delivery',
    detail: 'Complete package archive generated directly from verified milestones to the client.',
    color: '#00f2fe',
  },
];

export const FlowCanvas: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<FlowNode>(FLOW_NODES[3]);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '250px',
          background: 'radial-gradient(ellipse at center, rgba(0, 242, 254, 0.12) 0%, rgba(37, 99, 235, 0.08) 50%, transparent 75%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Main interactive pipeline container */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '2rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(180deg, rgba(17, 20, 26, 0.85) 0%, rgba(10, 12, 16, 0.95) 100%)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Top Header Label */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#00f2fe',
                boxShadow: '0 0 12px #00f2fe',
                animation: 'pulse 2s infinite',
              }}
            />
            <span style={{ fontSize: '0.8125rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
              Live Workspace Pipeline // Continuous Context Flow
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Click any stage to inspect context</span>
          </div>
        </div>

        {/* Nodes Grid / Flow line */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem',
            position: 'relative',
            marginBottom: '2rem',
          }}
        >
          {FLOW_NODES.map((node, index) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                type="button"
                style={{
                  background: isSelected
                    ? 'linear-gradient(180deg, rgba(37, 99, 235, 0.15) 0%, rgba(0, 242, 254, 0.08) 100%)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: isSelected ? '1px solid rgba(0, 242, 254, 0.5)' : '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '1rem 0.75rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  boxShadow: isSelected ? '0 0 20px rgba(0, 242, 254, 0.15)' : 'none',
                }}
              >
                {/* Step number */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.6875rem', fontFamily: 'monospace', color: isSelected ? '#00f2fe' : 'var(--text-tertiary)' }}>
                    0{index + 1}
                  </span>
                  {node.activePulse && (
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#00f2fe',
                        boxShadow: '0 0 8px #00f2fe',
                      }}
                    />
                  )}
                </div>

                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: isSelected ? '#ffffff' : 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {node.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: isSelected ? '#93c5fd' : 'var(--text-tertiary)' }}>
                  {node.sublabel}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Node Detail Panel */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderRadius: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Stage Details:
              </span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {selectedNode.label} ({selectedNode.sublabel})
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', maxWidth: '750px', lineHeight: 1.5 }}>
              {selectedNode.detail}
            </p>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.375rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(0, 242, 254, 0.08)',
              border: '1px solid rgba(0, 242, 254, 0.2)',
              fontSize: '0.75rem',
              color: '#00f2fe',
              fontWeight: 500,
            }}
          >
            <span>Connected to Local SQLite</span>
          </div>
        </div>
      </div>
    </div>
  );
};
