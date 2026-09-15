import React, { useState } from 'react';
import { Card } from '../ui/Card';

export const DeliveryGateSimulator: React.FC = () => {
  const [hasAmendment, setHasAmendment] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [attemptedRelease, setAttemptedRelease] = useState(false);

  const isGateOpen = isApproved && hasAmendment;

  const handleAttemptRelease = () => {
    setAttemptedRelease(true);
  };

  const handleReset = () => {
    setHasAmendment(false);
    setIsApproved(false);
    setAttemptedRelease(false);
  };

  return (
    <Card padding="lg" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cobalt)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Interactive Operational Simulator
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '0.25rem' }}>
              How Syntaflow delivery gates stop scope drift in client work
            </h3>
          </div>
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '0.25rem 0.625rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-surface-raised)',
              border: '1px solid var(--color-border)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--color-text-tertiary)',
              cursor: 'pointer',
            }}
          >
            Reset Simulator
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, maxWidth: '720px', lineHeight: 1.6 }}>
          In email and Slack, clients casually ask for "just one more feature" and assume it is included. At handover, disputes happen. Try the simulation below to see how Syntaflow enforces immutable version gates.
        </p>

        {/* Interactive Scenario Board */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
          {/* Step A: Scope Status */}
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>
                STAGE 01 // ACTIVE BLUEPRINT
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Nexus E-Commerce Re-platforming
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                Agreed Budget: $18,500 • 3 Milestones
              </div>

              {hasAmendment && (
                <div style={{ marginTop: '0.75rem', padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(212, 154, 58, 0.1)', border: '1px solid rgba(212, 154, 58, 0.3)', fontSize: '0.75rem', color: '#D49A3A' }}>
                  <strong>Scope Change Added:</strong> Custom B2B Portal (+$3,200)
                </div>
              )}
            </div>

            {!hasAmendment ? (
              <button
                type="button"
                onClick={() => setHasAmendment(true)}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem 0.875rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-cobalt-subtle)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  color: '#60A5FA',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                + Client Requests Scope Change (+$3,200)
              </button>
            ) : (
              <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--color-status-active)', fontFamily: 'var(--font-mono)' }}>
                ✓ Scope amendment logged into client timeline
              </div>
            )}
          </div>

          {/* Step B: Client Sign-off */}
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>
                STAGE 05 // DOCVERSION SNAPSHOT
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Amendment Approval (DocVersion v1.1)
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                {isApproved ? 'Client sign-off recorded: Elena Rostova (CTO)' : 'Status: Pending client review & acceptance'}
              </div>
            </div>

            <button
              type="button"
              disabled={!hasAmendment || isApproved}
              onClick={() => setIsApproved(true)}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 0.875rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: !hasAmendment ? 'var(--color-surface)' : isApproved ? 'var(--color-status-active-bg)' : 'var(--color-cobalt)',
                border: `1px solid ${isApproved ? 'var(--color-status-active)' : 'var(--color-border)'}`,
                color: isApproved ? 'var(--color-status-active)' : !hasAmendment ? 'var(--color-text-disabled)' : '#FFFFFF',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: !hasAmendment || isApproved ? 'default' : 'pointer',
                textAlign: 'center',
              }}
            >
              {isApproved ? '✓ Client Signed & Sealed (SHA-256)' : hasAmendment ? 'Simulate Client Web Sign-Off →' : 'Requires Step 1 (Scope Change)'}
            </button>
          </div>

          {/* Step C: Final Delivery Gate */}
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-raised)', border: `1px solid ${isGateOpen ? 'var(--color-status-active)' : attemptedRelease && !isGateOpen ? 'var(--color-status-risk)' : 'var(--color-border)'}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-tertiary)', marginBottom: '0.5rem' }}>
                STAGE 06 // DELIVERY GATEKEEPER
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isGateOpen ? 'var(--color-status-active)' : 'var(--color-status-risk)' }} />
                <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: isGateOpen ? 'var(--color-status-active)' : 'var(--color-status-risk)' }}>
                  {isGateOpen ? 'GATE UNLOCKED // READY' : 'GATE LOCKED // BLOCKED'}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
                {isGateOpen ? (
                  <span style={{ color: 'var(--color-status-active)' }}>All deliverables approved. Cryptographic handover receipt generated.</span>
                ) : (
                  <span>Prerequisite deliverables or signed scope amendments are missing. Handover is blocked.</span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAttemptRelease}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 0.875rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isGateOpen ? 'var(--color-status-active)' : 'var(--color-surface)',
                border: `1px solid ${isGateOpen ? 'var(--color-status-active)' : 'var(--color-border)'}`,
                color: isGateOpen ? '#FFFFFF' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {isGateOpen ? '✓ Release Delivery Package to Client' : 'Attempt Final Handover Release'}
            </button>
          </div>
        </div>

        {/* Warning banner on blocked release */}
        {attemptedRelease && !isGateOpen && (
          <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-status-risk-bg)', border: '1px solid rgba(214, 90, 90, 0.3)', color: 'var(--color-status-risk)', fontSize: '0.8125rem' }}>
            <strong>⛔ Handover Halted by Syntaflow Gatekeeper:</strong> You cannot release final delivery while client amendments remain unapproved. This prevents unbilled scope or disputed deliverable claims.
          </div>
        )}
      </div>
    </Card>
  );
};
