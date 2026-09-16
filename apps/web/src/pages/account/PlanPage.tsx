import React, { useState } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Button } from '../../components/ui/Button';
import { PRICING_TIERS } from '../../content/pricingConfig';

export const PlanPage: React.FC = () => {
  const [notifiedTier, setNotifiedTier] = useState<string | null>(null);

  const handleNotifyMe = (tierId: string) => {
    setNotifiedTier(tierId);
    setTimeout(() => setNotifiedTier(null), 3000);
  };

  return (
    <div>
      <SEOHead
        title="Plan & Billing — Syntaflow Account"
        description="View your active Syntaflow license tier and upcoming pro subscription capabilities."
        path="/account/plan"
        indexable={false}
      />

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#ffffff', margin: '0 0 0.5rem 0' }}>
          Plan & Capabilities
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
          Syntaflow is currently in free public Desktop Preview. All core local-first features are fully unlocked.
        </p>
      </div>

      {notifiedTier && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(0, 242, 254, 0.1)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            color: '#00f2fe',
            fontSize: '13.5px',
            marginBottom: '2rem',
          }}
        >
          ✓ You will be notified when this tier becomes available for early upgrade.
        </div>
      )}

      {/* Plan Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}
      >
        {PRICING_TIERS.map((tier) => {
          const isActive = tier.id === 'preview';
          return (
            <div
              key={tier.id}
              style={{
                padding: '2rem',
                borderRadius: '16px',
                backgroundColor: isActive ? 'rgba(17, 20, 26, 0.95)' : 'rgba(17, 20, 26, 0.6)',
                border: isActive ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isActive ? '0 12px 35px rgba(0, 242, 254, 0.08)' : 'none',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: '12px',
                    backgroundColor: isActive ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                    color: isActive ? '#00f2fe' : 'var(--text-tertiary)',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {isActive ? 'Current Plan' : tier.badge}
                </span>

                {isActive && (
                  <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 600 }}>
                    ● Active
                  </span>
                )}
              </div>

              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                {tier.name}
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{tier.priceLabel}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>/ {tier.periodLabel}</span>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem', flexGrow: 0 }}>
                {tier.description}
              </p>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem', marginBottom: '1.5rem', flexGrow: 1 }}>
                <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                  Includes:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {tier.features.map((feature, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      <span style={{ color: isActive ? '#00f2fe' : 'var(--text-tertiary)' }}>✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {isActive ? (
                  <div
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-secondary)',
                      fontSize: '13px',
                      fontWeight: 600,
                      textAlign: 'center',
                    }}
                  >
                    Active Plan ($0 during preview)
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => handleNotifyMe(tier.id)}
                    style={{ width: '100%' }}
                  >
                    Notify Me on Launch
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
