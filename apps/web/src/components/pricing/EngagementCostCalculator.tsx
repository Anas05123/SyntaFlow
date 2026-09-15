import React, { useState, useId } from 'react';
import { Card } from '../ui/Card';

export const EngagementCostCalculator: React.FC = () => {
  const [clients, setClients] = useState<number>(6);
  const [seats, setSeats] = useState<number>(3);
  const clientsId = useId();
  const seatsId = useId();

  // Typical fragmented stack: Notion ($10) + Asana ($25) + PandaDoc ($35) + Harvest ($12) = $82/seat/month
  const saasMonthlyPerSeat = 82;
  const annualSaas = seats * saasMonthlyPerSeat * 12;

  // Syntaflow Studio: $19/seat/mo * 12
  const annualSyntaflow = seats * 19 * 12;
  const annualSavings = annualSaas - annualSyntaflow;
  const hoursSavedPerMonth = Math.round(clients * 2.5);

  return (
    <Card padding="lg" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Tool Consolidation & Economic Calculator
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '0.25rem' }}>
              See what SaaS fragmentation costs your practice
            </h3>
          </div>
          <div style={{ padding: '0.25rem 0.625rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            Local SQLite vs Multi-SaaS
          </div>
        </div>

        {/* Controls and Output Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-8)', alignItems: 'center' }}>
          {/* Left: Interactive Sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                <label htmlFor={clientsId} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Active Client Engagements:
                </label>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: 'var(--color-cyan)' }}>
                  {clients} {clients === 1 ? 'client' : 'clients'}
                </span>
              </div>
              <input
                id={clientsId}
                type="range"
                min="1"
                max="25"
                value={clients}
                onChange={(e) => setClients(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: 'var(--color-cobalt)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-tertiary)', marginTop: '0.25rem' }}>
                <span>1 solo retainer</span>
                <span>12 boutique</span>
                <span>25 active studio</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                <label htmlFor={seatsId} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Team & Collaborator Seats:
                </label>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: '#60A5FA' }}>
                  {seats} {seats === 1 ? 'operator' : 'operators'}
                </span>
              </div>
              <input
                id={seatsId}
                type="range"
                min="1"
                max="15"
                value={seats}
                onChange={(e) => setSeats(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: 'var(--color-cobalt)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-tertiary)', marginTop: '0.25rem' }}>
                <span>1 solo practitioner</span>
                <span>5 small studio</span>
                <span>15 full team</span>
              </div>
            </div>

            <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Replaces these fragmented per-seat subscriptions:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                <div>✓ Notion ($10/seat)</div>
                <div>✓ Asana ($25/seat)</div>
                <div>✓ PandaDoc ($35/seat)</div>
                <div>✓ Harvest ($12/seat)</div>
              </div>
            </div>
          </div>

          {/* Right: Real-time Cost Comparison */}
          <div style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.75rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                  DISCONNECTED SAAS STACK
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-disabled)', marginTop: '0.125rem' }}>
                  4 tools × {seats} seats × 12 months
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-status-risk)' }}>
                ${annualSaas.toLocaleString()}/yr
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.75rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 600 }}>
                  SYNTAFLOW STUDIO (FLAT)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.125rem' }}>
                  Local SQLite + Web Guest Portals
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-status-active)' }}>
                ${annualSyntaflow.toLocaleString()}/yr
              </div>
            </div>

            {/* Savings Callout */}
            <div style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-status-active-bg)', border: '1px solid rgba(63, 166, 107, 0.3)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-status-active)', textTransform: 'uppercase' }}>
                Annual Economic Gain
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '0.25rem' }}>
                You reclaim ${annualSavings.toLocaleString()}/year
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                Plus ~{hoursSavedPerMonth} hours/month saved by eliminating file, scope, and review context sync across fragmented apps.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
