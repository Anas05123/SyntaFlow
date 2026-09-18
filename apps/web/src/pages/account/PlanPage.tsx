import React, { useEffect, useState } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Button } from '../../components/ui/Button';
import { PRICING_TIERS } from '../../content/pricingConfig';
import { useAuth } from '../../services/auth/AuthContext';
import { PayPalSubscriptionModal } from '../../components/billing/PayPalSubscriptionModal';

interface WorkspaceBillingData {
  plan: 'preview' | 'pro';
  status: string;
  isProActive: boolean;
  renewalDate: string | null;
  subscription: any;
}

export const PlanPage: React.FC = () => {
  const { user } = useAuth();
  const [billingData, setBillingData] = useState<WorkspaceBillingData | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<string | null>(null);
  const [notifiedTier, setNotifiedTier] = useState<string | null>(null);

  const fetchBilling = async () => {
    try {
      const res = await fetch('/api/billing/subscription', {
        headers: {
          'Authorization': user ? `Bearer ${user.userId}` : '',
          'X-Syntaflow-User-Id': user ? user.userId : 'usr_default',
        },
      });
      if (res.ok) {
        const data = await res.json();
        setBillingData(data);
      }
    } catch (_err) {
      // Backend not running or offline, fallback to preview
    }
  };

  useEffect(() => {
    fetchBilling();
  }, [user]);

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your Syntaflow Pro subscription on PayPal?')) {
      return;
    }

    setIsCancelling(true);
    setCancelMessage(null);
    try {
      const res = await fetch('/api/billing/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user ? `Bearer ${user.userId}` : '',
          'X-Syntaflow-User-Id': user ? user.userId : 'usr_default',
        },
        body: JSON.stringify({
          reason: 'User cancelled via Account Plan page',
        }),
      });

      if (res.ok) {
        setCancelMessage('✓ Subscription cancelled successfully on PayPal Sandbox.');
        await fetchBilling();
      } else {
        const errorJson = await res.json().catch(() => ({}));
        setCancelMessage(`❌ Cancellation failed: ${errorJson.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      setCancelMessage(`❌ Cancellation error: ${err.message || 'Network error'}`);
    } finally {
      setIsCancelling(false);
    }
  };

  const isPro = Boolean(billingData?.isProActive || billingData?.plan === 'pro');

  return (
    <div>
      <SEOHead
        title="Plan & Billing — Syntaflow Account"
        description="View your active Syntaflow license tier and pro subscription capabilities."
        path="/account/plan"
        indexable={false}
      />

      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#ffffff', margin: '0 0 0.5rem 0' }}>
          Plan & Billing
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
          Manage your Syntaflow software license and PayPal Sandbox test subscriptions.
        </p>
      </div>

      {cancelMessage && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: cancelMessage.startsWith('✓') ? 'rgba(94, 214, 166, 0.15)' : 'rgba(240, 109, 102, 0.15)',
            border: cancelMessage.startsWith('✓') ? '1px solid #5ED6A6' : '1px solid #F06D66',
            color: cancelMessage.startsWith('✓') ? '#5ED6A6' : '#F06D66',
            fontSize: '13.5px',
            marginBottom: '2rem',
          }}
        >
          {cancelMessage}
        </div>
      )}

      {/* Active Subscription Overview Card */}
      {isPro && (
        <div
          style={{
            padding: '1.75rem 2rem',
            borderRadius: '16px',
            backgroundColor: 'rgba(12, 18, 32, 0.95)',
            border: '1px solid #2F6BFA',
            boxShadow: '0 8px 30px rgba(47, 107, 250, 0.12)',
            marginBottom: '2.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#2F6BFA', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Current Active Plan
                </span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(94, 214, 166, 0.2)',
                    color: '#5ED6A6',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  ● {billingData?.status?.toUpperCase() || 'ACTIVE'}
                </span>
              </div>

              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff' }}>
                Syntaflow Pro ($19.00 / month)
              </div>

              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Provider: <strong>PayPal (Sandbox Test)</strong>
                {billingData?.renewalDate && (
                  <span style={{ marginLeft: '1rem' }}>
                    Next renewal: {new Date(billingData.renewalDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                style={{
                  borderColor: 'rgba(240, 109, 102, 0.4)',
                  color: '#F06D66',
                }}
              >
                {isCancelling ? 'Cancelling…' : 'Cancel Subscription'}
              </Button>
            </div>
          </div>
        </div>
      )}

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
          const isActive = isPro ? tier.id === 'pro' : tier.id === 'preview';
          return (
            <div
              key={tier.id}
              style={{
                padding: '2rem',
                borderRadius: '16px',
                backgroundColor: isActive ? 'rgba(17, 20, 26, 0.95)' : 'rgba(17, 20, 26, 0.6)',
                border: isActive ? '1px solid #2F6BFA' : '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: isActive ? '0 12px 35px rgba(47, 107, 250, 0.1)' : 'none',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: '12px',
                    backgroundColor: isActive ? 'rgba(47, 107, 250, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                    color: isActive ? '#2F6BFA' : 'var(--text-tertiary)',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {isActive ? 'Current Plan' : tier.badge}
                </span>

                {isActive && (
                  <span style={{ fontSize: '12px', color: '#5ED6A6', fontWeight: 600 }}>
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
                      <span style={{ color: isActive ? '#2F6BFA' : 'var(--text-tertiary)' }}>✓</span>
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
                    Active Plan
                  </div>
                ) : tier.id === 'pro' ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={() => setIsCheckoutOpen(true)}
                    style={{ width: '100%' }}
                  >
                    Upgrade with PayPal
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => {
                      setNotifiedTier(tier.id);
                      setTimeout(() => setNotifiedTier(null), 3000);
                    }}
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

      <PayPalSubscriptionModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={() => {
          fetchBilling();
          setIsCheckoutOpen(false);
        }}
      />
    </div>
  );
};
