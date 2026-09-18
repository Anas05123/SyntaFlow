import React, { useState } from 'react';

export const LivingEngagementPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'docversion' | 'gate'>('timeline');
  const [isSignedOff, setIsSignedOff] = useState<boolean>(false);

  return (
    <div
      className="paper-card"
      style={{
        width: '100%',
        maxWidth: '540px',
        margin: '0 auto',
        borderRadius: 'var(--radius-card)',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
        textAlign: 'left',
        position: 'relative',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--surface-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: isSignedOff ? 'var(--mint)' : 'var(--amber)',
              boxShadow: isSignedOff ? '0 0 8px var(--mint)' : '0 0 8px var(--amber)',
            }}
          />
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: 650, color: 'var(--text)', lineHeight: 1.2 }}>
              Northstar Studio
            </div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
              Brand & Web Platform // ENG-2026-08
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            className={isSignedOff ? 'status-chip status-chip-mint' : 'status-chip status-chip-amber'}
            style={{ fontSize: '10.5px' }}
          >
            {isSignedOff ? '✓ APPROVED & READY' : '● AWAITING SIGN-OFF'}
          </span>
        </div>
      </div>

      {/* Commercial Terms Summary */}
      <div
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--text-secondary)',
        }}
      >
        <span>$18,500 Milestone Scope</span>
        <span style={{ fontFamily: 'var(--font-mono)' }}>SLA: 14h 20m remaining</span>
      </div>

      {/* Tab Switcher */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--surface-subtle)',
          padding: '0 12px',
          gap: '4px',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          style={{
            padding: '10px 14px',
            fontSize: '12.5px',
            fontWeight: activeTab === 'timeline' ? 600 : 500,
            color: activeTab === 'timeline' ? 'var(--cobalt)' : 'var(--text-muted)',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'timeline' ? '2px solid var(--cobalt)' : '2px solid transparent',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          Timeline & State
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('docversion')}
          style={{
            padding: '10px 14px',
            fontSize: '12.5px',
            fontWeight: activeTab === 'docversion' ? 600 : 500,
            color: activeTab === 'docversion' ? 'var(--cobalt)' : 'var(--text-muted)',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'docversion' ? '2px solid var(--cobalt)' : '2px solid transparent',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          DocVersion v3.2
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gate')}
          style={{
            padding: '10px 14px',
            fontSize: '12.5px',
            fontWeight: activeTab === 'gate' ? 600 : 500,
            color: activeTab === 'gate' ? 'var(--cobalt)' : 'var(--text-muted)',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'gate' ? '2px solid var(--cobalt)' : '2px solid transparent',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          Delivery Gate
        </button>
      </div>

      {/* Tab Body */}
      <div style={{ padding: '20px', minHeight: '220px' }}>
        {activeTab === 'timeline' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--mint-subtle)',
                  color: '#15803D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                ✓
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                  Scoping Blueprint Locked
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  4 deliverables, 3 milestones agreed with client sponsor.
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--mint-subtle)',
                  color: '#15803D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                ✓
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                  Task Execution & Doc Drafting
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  14/16 tasks closed · Specification snapshot compiled.
                </div>
              </div>
            </div>

            {/* Step 3 (Active) */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: isSignedOff ? 'var(--mint-subtle)' : 'var(--amber-subtle)',
                  color: isSignedOff ? '#15803D' : '#B45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                {isSignedOff ? '✓' : '●'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                  Client Review Transmission
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {isSignedOff
                    ? 'Signed off by Sarah Lin (Client Lead) via tokenized link.'
                    : 'Transmitted to Sarah Lin (Client Lead) — SLA pending.'}
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', opacity: isSignedOff ? 1 : 0.65 }}>
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: isSignedOff ? 'var(--cobalt-subtle)' : 'var(--surface-subtle)',
                  color: isSignedOff ? 'var(--cobalt)' : 'var(--text-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                4
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                  Final Handover Package Gate
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {isSignedOff ? 'Gate unlocked! Handover archive generated.' : 'Enforced lock — unlocks upon client sign-off.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'docversion' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'var(--surface-subtle)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11.5px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ color: 'var(--text)' }}>DocVersion: v3.2-final</span>
              <span style={{ color: 'var(--mint)' }}>SHA-256: 7f9c4b01...</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Submitted document versions are strictly immutable. Review comments bind to this exact cryptographic snapshot, preventing scope drift or retroactive alterations.
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <span className="status-chip status-chip-cobalt">Continuous Canvas</span>
              <span className="status-chip status-chip-mint">Zero Telemetry</span>
            </div>
          </div>
        )}

        {activeTab === 'gate' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isSignedOff ? 'var(--mint-subtle)' : 'var(--amber-subtle)',
                border: isSignedOff ? '1px solid var(--mint-border)' : '1px solid var(--amber-border)',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 650, color: isSignedOff ? '#15803D' : '#B45309', marginBottom: '4px' }}>
                {isSignedOff ? 'Delivery Gate: UNLOCKED' : 'Delivery Gate: ENFORCED LOCK'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {isSignedOff
                  ? 'All prerequisite milestone approvals recorded. Final handover bundle ready for export.'
                  : 'Syntaflow prevents accidental premature delivery. Client approval on DocVersion v3.2 is required.'}
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              Audit rule: GateRule_RequireAllMilestonesSigned
            </div>
          </div>
        )}
      </div>

      {/* Interactive Trigger in Footer */}
      <div
        style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border)',
          backgroundColor: 'var(--surface-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
          Interactive Demonstration
        </span>
        <button
          type="button"
          onClick={() => setIsSignedOff(!isSignedOff)}
          style={{
            padding: '6px 14px',
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: 'var(--radius-button)',
            backgroundColor: isSignedOff ? 'var(--surface)' : 'var(--cobalt)',
            color: isSignedOff ? 'var(--text)' : '#FFFFFF',
            border: isSignedOff ? '1px solid var(--border)' : '1px solid var(--cobalt)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            boxShadow: isSignedOff ? 'none' : '0 2px 6px rgba(47, 107, 250, 0.25)',
          }}
        >
          {isSignedOff ? 'Reset Simulation ↺' : 'Simulate Client Sign-off ✓'}
        </button>
      </div>
    </div>
  );
};
