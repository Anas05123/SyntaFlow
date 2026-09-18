import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../services/auth/AuthContext';
import { Button } from '../ui/Button';

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PayPalSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type CheckoutPhase = 'loading' | 'ready' | 'approving' | 'confirming' | 'active' | 'pending' | 'failed' | 'error';

export const PayPalSubscriptionModal: React.FC<PayPalSubscriptionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [phase, setPhase] = useState<CheckoutPhase>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [config, setConfig] = useState<{ clientId: string; proMonthlyPlanId: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRenderedRef = useRef(false);

  // Fetch billing config
  useEffect(() => {
    if (!isOpen) return;
    setPhase('loading');
    setErrorMessage(null);
    buttonsRenderedRef.current = false;

    fetch('/api/billing/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.clientId) {
          setConfig({
            clientId: data.clientId,
            proMonthlyPlanId: data.proMonthlyPlanId || 'P-SANDBOX-PRO-MONTHLY',
          });
        } else {
          // Fallback if config endpoint is unavailable
          setConfig({
            clientId: 'sb', // PayPal sandbox test client
            proMonthlyPlanId: 'P-SANDBOX-PRO-MONTHLY',
          });
        }
      })
      .catch((_err) => {
        setConfig({
          clientId: 'sb',
          proMonthlyPlanId: 'P-SANDBOX-PRO-MONTHLY',
        });
      });
  }, [isOpen]);

  // Load PayPal SDK and render buttons
  useEffect(() => {
    if (!isOpen || !config || buttonsRenderedRef.current) return;

    const scriptId = 'paypal-sdk-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const renderButtons = () => {
      if (!window.paypal || !containerRef.current || buttonsRenderedRef.current) return;

      try {
        containerRef.current.innerHTML = '';
        buttonsRenderedRef.current = true;
        setPhase('ready');

        window.paypal
          .Buttons({
            style: {
              shape: 'rect',
              color: 'blue',
              layout: 'vertical',
              label: 'subscribe',
            },
            createSubscription: (_data: any, actions: any) => {
              return actions.subscription.create({
                plan_id: config.proMonthlyPlanId,
              });
            },
            onApprove: async (data: any) => {
              setPhase('approving');
              try {
                // Post subscription ID to Syntaflow backend
                const res = await fetch('/api/billing/paypal/subscription', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': user ? `Bearer ${user.userId}` : '',
                    'X-Syntaflow-User-Id': user ? user.userId : 'usr_default',
                  },
                  body: JSON.stringify({
                    subscriptionId: data.subscriptionID,
                  }),
                });

                if (!res.ok) {
                  const errorData = await res.json().catch(() => ({}));
                  throw new Error(errorData.error || 'Failed to record subscription.');
                }

                setPhase('confirming');
                // Poll subscription status
                checkSubscriptionStatus();
              } catch (err: any) {
                console.error('[PayPal onApprove Error]', err);
                setErrorMessage(err.message || 'Subscription confirmation failed.');
                setPhase('error');
              }
            },
            onCancel: () => {
              // Buyer closed or pressed cancel; do not update plan
              console.log('[PayPal] Buyer cancelled checkout.');
              onClose();
            },
            onError: (err: any) => {
              console.error('[PayPal Buttons Error]', err);
              setErrorMessage('PayPal encountered an error during checkout. Please try again.');
              setPhase('error');
            },
          })
          .render(containerRef.current);
      } catch (err: any) {
        console.error('[PayPal Render Error]', err);
        setErrorMessage('Failed to initialize PayPal button container.');
        setPhase('error');
      }
    };

    if (window.paypal) {
      renderButtons();
    } else {
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
          config.clientId
        )}&vault=true&intent=subscription`;
        script.async = true;
        script.onload = () => renderButtons();
        script.onerror = () => {
          setErrorMessage('Could not load PayPal SDK. Please check your network connection.');
          setPhase('error');
        };
        document.head.appendChild(script);
      } else {
        script.onload = () => renderButtons();
      }
    }
  }, [isOpen, config, user, onClose]);

  const checkSubscriptionStatus = async () => {
    try {
      const res = await fetch('/api/billing/subscription', {
        headers: {
          'Authorization': user ? `Bearer ${user.userId}` : '',
          'X-Syntaflow-User-Id': user ? user.userId : 'usr_default',
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'active' || data.isProActive) {
          setPhase('active');
          if (onSuccess) onSuccess();
        } else {
          setPhase('pending');
        }
      } else {
        setPhase('pending');
      }
    } catch (_e) {
      setPhase('pending');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(12, 18, 32, 0.72)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1.5rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && phase !== 'approving') {
          onClose();
        }
      }}
    >
      <div
        className="paper-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-card)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-float)',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <span
              className="status-chip status-chip-cobalt"
              style={{ marginBottom: '0.5rem', display: 'inline-flex' }}
            >
              PAYPAL SANDBOX TEST
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: 'var(--ink)' }}>
              Syntaflow Pro
            </h2>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--cobalt)' }}>
              $19.00 USD <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 400 }}>/ month</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--muted)',
              fontSize: '1.5rem',
              lineHeight: 1,
              padding: '4px',
            }}
          >
            ×
          </button>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '1.75rem' }}>
          Recurring monthly test subscription. No real charges are made in Sandbox mode.
        </p>

        {/* Phase States */}
        {phase === 'loading' && (
          <div style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--muted)', fontSize: '0.95rem' }}>
            Preparing secure PayPal checkout…
          </div>
        )}

        {phase === 'approving' && (
          <div style={{ padding: '2rem 0', textAlign: 'center' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem' }}>
              Confirming your subscription…
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
              PayPal approved the subscription. Contacting Syntaflow backend…
            </p>
          </div>
        )}

        {phase === 'confirming' && (
          <div style={{ padding: '2rem 0', textAlign: 'center' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem' }}>
              Confirming your subscription…
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
              Awaiting authoritative activation from PayPal…
            </p>
            <Button variant="secondary" size="sm" onClick={checkSubscriptionStatus}>
              Refresh Status
            </Button>
          </div>
        )}

        {phase === 'pending' && (
          <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.5rem' }}>
              Subscription Recorded
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
              PayPal approved the subscription. We're confirming it now.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Button variant="secondary" size="sm" onClick={checkSubscriptionStatus}>
                Refresh Status
              </Button>
              <Button variant="primary" size="sm" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        )}

        {phase === 'active' && (
          <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
            <div style={{ color: 'var(--mint)', fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem' }}>
              You're now on Syntaflow Pro.
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
              Your Pro monthly subscription is active in the PayPal Sandbox environment.
            </p>
            <Button variant="primary" size="md" onClick={() => (window.location.href = '/account/plan')} style={{ width: '100%' }}>
              View in Account Dashboard
            </Button>
          </div>
        )}

        {phase === 'error' && (
          <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
            <div style={{ color: 'var(--coral)', fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Checkout Issue
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
              {errorMessage || "We couldn't confirm the subscription."}
            </p>
            <Button variant="secondary" size="sm" onClick={() => setPhase('ready')}>
              Try Again
            </Button>
          </div>
        )}

        {/* PayPal SDK Button Container */}
        <div
          ref={containerRef}
          style={{
            display: phase === 'ready' ? 'block' : 'none',
            minHeight: '45px',
          }}
        />

        <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-metadata)' }}>
            🔒 PayPal Sandbox Encrypted Test Gateway · No Real Money
          </span>
        </div>
      </div>
    </div>
  );
};
