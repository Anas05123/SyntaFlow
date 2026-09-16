import React, { useState, useEffect } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Link } from '../../components/ui/Link';
import { useAuth } from '../../services/auth/AuthContext';
import { isValidLoopbackRedirect, isSafeCustomProtocol } from '../../utils/urlSecurity';
import { createDesktopAuthCode } from '../../services/auth/appwriteClient';

export const DesktopAuthPage: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [params] = useState<{ state: string; redirectUri: string; flowId?: string }>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      return {
        state: searchParams.get('state') || '',
        redirectUri: searchParams.get('redirect_uri') || 'http://127.0.0.1:5173/callback',
        flowId: searchParams.get('flow_id') || '',
      };
    }
    return {
      state: '',
      redirectUri: 'http://127.0.0.1:5173/callback',
      flowId: '',
    };
  });

  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      const currentUrl = typeof window !== 'undefined'
        ? window.location.pathname + window.location.search
        : '/auth/desktop';
      window.location.href = `/login?returnTo=${encodeURIComponent(currentUrl)}`;
    }
  }, [authLoading, isAuthenticated]);

  const isValidRedirect = isValidLoopbackRedirect(params.redirectUri) || isSafeCustomProtocol(params.redirectUri);

  const handleAuthorize = async () => {
    if (!isValidRedirect) {
      setErrorMessage('The requested redirect URI is not a permitted local loopback or custom desktop protocol.');
      return;
    }

    setIsAuthorizing(true);
    setErrorMessage(null);

    const tokenRes = await createDesktopAuthCode();
    setIsAuthorizing(false);

    if (!tokenRes.success || !tokenRes.code) {
      setErrorMessage(tokenRes.error || 'Failed to generate desktop session token.');
      return;
    }

    const code = tokenRes.code;
    setAuthCode(code);
    setAuthorized(true);

    // Build return redirect URL
    const sep = params.redirectUri.includes('?') ? '&' : '?';
    const returnUrl = `${params.redirectUri}${sep}code=${encodeURIComponent(code)}&state=${encodeURIComponent(params.state)}`;

    // Dispatch redirect to desktop loopback listener
    setTimeout(() => {
      window.location.href = returnUrl;
    }, 600);
  };

  const copyCode = () => {
    if (!authCode) return;
    navigator.clipboard.writeText(authCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '2px solid var(--border)',
            borderTopColor: 'var(--cyan)',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'var(--space-48)',
        paddingBottom: 'var(--space-80)',
        overflow: 'hidden',
        fontFamily: 'var(--font-body)',
      }}
    >
      <SEOHead path="/auth/desktop" />

      {/* Ambient Lighting Backdrop */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1100px',
          height: '550px',
          background: 'radial-gradient(ellipse at 50% 30%, rgba(37, 99, 235, 0.16) 0%, rgba(6, 182, 212, 0.08) 38%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ maxWidth: '640px', position: 'relative', zIndex: 1 }}>
        <Card
          variant="raised"
          style={{
            padding: 'var(--space-40)',
            backgroundColor: 'var(--surface-raised)',
            border: '1px solid rgba(6, 182, 212, 0.28)',
            boxShadow: '0 24px 64px -12px rgba(0, 0, 0, 0.8), 0 0 32px -6px rgba(6, 182, 212, 0.14)',
            borderRadius: '16px',
            marginBottom: 'var(--space-32)',
          }}
        >
          {/* Header Eyebrow */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-28)' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 14px',
                borderRadius: '100px',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                marginBottom: 'var(--space-14)',
              }}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--cyan)' }} className="pulse-glow" />
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                RFC 8252 // DESKTOP LOOPBACK HANDSHAKE
              </span>
            </div>

            <h1 className="heading-1" style={{ fontSize: 'clamp(24px, 4vw, 32px)', color: 'var(--text)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Authorize Syntaflow Desktop
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5, maxWidth: '480px', marginInline: 'auto' }}>
              A local Syntaflow Desktop runtime on this machine is requesting authorization for your workspace.
            </p>
          </div>

          {errorMessage && (
            <div
              style={{
                padding: '12px 16px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '8px',
                color: '#F87171',
                fontSize: '13px',
                marginBottom: 'var(--space-24)',
                lineHeight: 1.45,
              }}
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          {/* Handshake Graphic */}
          <div
            style={{
              padding: '24px',
              backgroundColor: 'rgba(11, 13, 15, 0.8)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-24)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Left Node: Web Browser */}
            <div style={{ textAlign: 'center', zIndex: 1, minWidth: '110px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#181C20',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  margin: '0 auto 8px auto',
                }}
              >
                🌐
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                {user?.name || 'Syntaflow Account'}
              </div>
              <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>
                {user?.email || 'syntaflow.tech'}
              </div>
            </div>

            {/* Signal Flow */}
            <div style={{ flex: 1, margin: '0 20px', textAlign: 'center', zIndex: 1 }}>
              <div style={{ height: '3px', backgroundColor: 'rgba(6, 182, 212, 0.25)', position: 'relative', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '40%',
                    height: '100%',
                    backgroundColor: 'var(--cyan)',
                    boxShadow: '0 0 10px var(--cyan)',
                    animation: 'shimmer 1.8s infinite linear',
                  }}
                />
              </div>

              <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: authorized ? '#10B981' : 'var(--cyan)' }} className="pulse-glow" />
                <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: authorized ? '#34D399' : 'var(--cyan)', letterSpacing: '0.04em' }}>
                  {authorized ? '✓ PROTOCOL HANDSHAKE DISPATCHED' : 'AWAITING APPROVAL'}
                </span>
              </div>
            </div>

            {/* Right Node: Desktop App */}
            <div style={{ textAlign: 'center', zIndex: 1, minWidth: '110px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#181C20',
                  border: '1px solid rgba(6, 182, 212, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  margin: '0 auto 8px auto',
                }}
              >
                💻
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Desktop Client</div>
              <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: '#10B981' }}>127.0.0.1 Loopback</div>
            </div>
          </div>

          {/* Session Security Details */}
          <div
            style={{
              padding: '14px 18px',
              backgroundColor: 'rgba(18, 21, 25, 0.9)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              marginBottom: 'var(--space-24)',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>CALLBACK TARGET:</span>
              <span style={{ color: 'var(--cyan)' }}>
                {params.redirectUri}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>ACTIVE USER:</span>
              <span style={{ color: 'var(--text)' }}>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>LOCAL ENCRYPTION:</span>
              <span style={{ color: '#10B981' }}>Electron safeStorage (DPAPI)</span>
            </div>
          </div>

          {!authorized ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button
                variant="primary"
                onClick={handleAuthorize}
                disabled={isAuthorizing || !isValidRedirect}
                style={{
                  width: '100%',
                  padding: '13px',
                  fontSize: '14.5px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {isAuthorizing ? 'Generating session...' : 'Authorize Desktop Client'}
              </Button>

              <div style={{ textAlign: 'center' }}>
                <Link href="/account" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                  Cancel and return to Account
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  borderRadius: '8px',
                  color: '#34D399',
                  textAlign: 'center',
                  marginBottom: 'var(--space-16)',
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>✓ Handshake Transmitted</div>
                <div style={{ fontSize: '13px', color: 'var(--text)' }}>
                  You can now return to Syntaflow Desktop. If the app did not focus automatically, use the code below.
                </div>
              </div>

              {authCode && (
                <div style={{ marginBottom: 'var(--space-16)' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    One-Time Authorization Code:
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      readOnly
                      value={authCode}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        backgroundColor: 'var(--surface-sunken)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        color: 'var(--text)',
                      }}
                    />
                    <Button variant="secondary" onClick={copyCode} style={{ padding: '8px 16px', fontSize: '12.5px' }}>
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
              )}

              <div style={{ textAlign: 'center', marginTop: 'var(--space-16)' }}>
                <Link href="/account" style={{ fontSize: '13px', color: 'var(--cyan)', textDecoration: 'none' }}>
                  Go to Account Dashboard &rarr;
                </Link>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
