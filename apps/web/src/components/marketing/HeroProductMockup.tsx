import React, { useState } from 'react';

export const HeroProductMockup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'review' | 'tasks' | 'gate'>('review');
  const [isApproved, setIsApproved] = useState(false);

  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--edge)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Desktop Window Titlebar Chrome */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: '1px solid var(--divider)',
          backgroundColor: 'var(--surface-subtle)',
          fontSize: '12px',
          color: 'var(--text-metadata)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B', display: 'inline-block' }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
          </div>
          <span style={{ marginLeft: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            Syntaflow Desktop — Northlight Studio / Web Platform Engagement
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--active)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--active)' }} />
            LOCAL ENCLAVE
          </span>
        </div>
      </div>

      {/* Mockup Workspace Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '12px 20px',
          borderBottom: '1px solid var(--divider)',
          backgroundColor: 'var(--surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('review')}
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 550,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'review' ? 'var(--surface-raised)' : 'transparent',
              color: activeTab === 'review' ? 'var(--text)' : 'var(--text-metadata)',
            }}
          >
            Review Surface
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 550,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'tasks' ? 'var(--surface-raised)' : 'transparent',
              color: activeTab === 'tasks' ? 'var(--text)' : 'var(--text-metadata)',
            }}
          >
            Dual-Density Tasks
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gate')}
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 550,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: activeTab === 'gate' ? 'var(--surface-raised)' : 'transparent',
              color: activeTab === 'gate' ? 'var(--text)' : 'var(--text-metadata)',
            }}
          >
            Delivery Gate
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: 'var(--text-metadata)' }}>RECORD #ENG-2026-08</span>
          <span style={{ color: 'var(--edge)' }}>|</span>
          <span style={{ color: 'var(--cyan)' }}>COMMITTED $24,500</span>
        </div>
      </div>

      {/* Mockup Active Content Area */}
      <div style={{ minHeight: '340px', padding: '24px', backgroundColor: 'var(--canvas)' }}>
        {activeTab === 'review' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '20px' }}>
            {/* Left: Document Reading Canvas */}
            <div
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--edge)',
                borderRadius: 'var(--radius-sm)',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase' }}>
                  IMMUTABLE SNAPSHOT · DOCVERSION v2.0
                </span>
                <span style={{ fontSize: '11.5px', color: 'var(--text-metadata)', fontFamily: 'var(--font-mono)' }}>
                  SHA-256: 8f4e9a...c120
                </span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                Architecture & Design Deliverable Package
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                Final implementation spec for Northlight Studio web platform. Includes component library tokens, interactive client review gates, and production handover requirements.
              </p>
              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--surface-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  borderLeft: '3px solid var(--cobalt)',
                  fontSize: '12.5px',
                  color: 'var(--text-muted)',
                }}
              >
                &ldquo;All prerequisite design system assets and typography scales have been verified against WCAG AA standards.&rdquo;
              </div>
            </div>

            {/* Right: Review Decision Rail */}
            <div
              style={{
                backgroundColor: 'var(--surface-subtle)',
                border: '1px solid var(--edge)',
                borderRadius: 'var(--radius-sm)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', marginBottom: '12px' }}>
                  REVIEW DECISION BINDING
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text)', marginBottom: '6px', fontWeight: 550 }}>
                  Decision Authority: Elena Vance (Managing Director)
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-metadata)', marginBottom: '16px' }}>
                  Turnaround SLA: 48 Hours (Committed)
                </div>

                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isApproved ? 'var(--active-subtle)' : 'var(--waiting-subtle)',
                    border: isApproved ? '1px solid rgba(63, 166, 107, 0.4)' : '1px solid rgba(212, 154, 58, 0.4)',
                    color: isApproved ? 'var(--active)' : 'var(--waiting)',
                    fontSize: '12.5px',
                    fontWeight: 500,
                    marginBottom: '16px',
                  }}
                >
                  {isApproved ? '✓ Version Approved — Decision Snapshot Locked' : 'Pending Client Review & Sign-Off'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsApproved(!isApproved)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    backgroundColor: isApproved ? 'var(--surface-raised)' : 'var(--cobalt)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {isApproved ? 'Reset Demonstration' : 'Simulate Client Sign-Off'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {/* To Do Column */}
              <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--edge)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
                <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>SPECIFICATION</span>
                  <span>1</span>
                </div>
                <div style={{ backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--edge)', padding: '12px', borderRadius: '4px', fontSize: '13px', color: 'var(--text)' }}>
                  Sign-off on localized SQLite persistence schema
                </div>
              </div>

              {/* In Progress Column */}
              <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--edge)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
                <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>IN PROGRESS</span>
                  <span>2</span>
                </div>
                <div style={{ backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--edge)', padding: '12px', borderRadius: '4px', fontSize: '13px', color: 'var(--text)', marginBottom: '8px' }}>
                  Design System tokens implementation
                </div>
                <div style={{ backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--edge)', padding: '12px', borderRadius: '4px', fontSize: '13px', color: 'var(--text)' }}>
                  Editorial reading canvas responsive constraints
                </div>
              </div>

              {/* Approved Column */}
              <div style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--edge)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
                <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--active)', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>APPROVED GATES</span>
                  <span>3</span>
                </div>
                <div style={{ backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--edge)', padding: '12px', borderRadius: '4px', fontSize: '13px', color: 'var(--text)' }}>
                  Commercial Engagement Agreement v1.0
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gate' && (
          <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', padding: '24px 0' }}>
            <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--cobalt-subtle)', color: 'var(--cobalt)', fontSize: '11.5px', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>
              CANONICAL INVARIANT: DELIVERY GATE ENFORCEMENT
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
              Deliverable Handover Strictly Bound to Version Approval
            </h4>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              Syntaflow prevents final assets or invoices from discharging until all prerequisite document milestones are signed off. No unverified drafts leave your machine.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '12.5px', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: 'var(--active)' }}>✓ Brief Approved</span>
              <span style={{ color: 'var(--active)' }}>✓ Scope v2 Locked</span>
              <span style={{ color: 'var(--waiting)' }}>⏳ Client Review Active</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
