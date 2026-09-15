import React, { useState } from 'react';
import { Card } from '../ui/Card';

export const LocalEnclaveInspector: React.FC = () => {
  const [saved, setSaved] = useState(false);

  return (
    <Card padding="lg" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Machine Sovereignty & Telemetry Inspector
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '0.25rem' }}>
              Your confidential client data never leaves your computer
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setSaved(!saved)}
            style={{
              padding: '0.375rem 0.875rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-cobalt)',
              color: '#FFFFFF',
              border: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {saved ? 'Simulate Another Save' : 'Simulate Document Save'}
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, maxWidth: '720px', lineHeight: 1.6 }}>
          Client retainer numbers, contract terms, and draft deliverables are privileged business property. Compare how a standard browser SaaS handles your data versus Syntaflow:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
          {/* Cloud SaaS Box */}
          <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-status-risk)', fontWeight: 700 }}>
                STANDARD CLOUD SAAS
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>Remote Multi-Tenant</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>Outbound HTTP Requests:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-status-risk)', fontWeight: 700 }}>{saved ? '18 calls' : 'Idle'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>Third-Party Trackers:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-status-risk)' }}>Segment, Mixpanel, Datadog</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>Data Storage Location:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>Shared US-East Multi-Tenant DB</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>Offline Operation:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-status-risk)' }}>Broken / Read-Only</span>
              </div>
            </div>
          </div>

          {/* Syntaflow Local Enclave Box */}
          <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-raised)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 700 }}>
                SYNTAFLOW DESKTOP ENCLAVE
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-status-active)', fontWeight: 600 }}>100% Sovereign</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>Outbound HTTP Requests:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-status-active)', fontWeight: 700 }}>0 BYTES (Zero packets)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>Third-Party Trackers:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-status-active)' }}>0 (Zero telemetry)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>Data Storage Location:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan)' }}>Local SQLite on your SSD</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>Disk Write Latency:</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{saved ? '1.2ms' : '< 2ms'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
