import React, { useState, useEffect } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Button } from '../../components/ui/Button';
import { Link } from '../../components/ui/Link';
import { useAuth } from '../../services/auth/AuthContext';
import { isValidLoopbackRedirect, isSafeCustomProtocol } from '../../utils/urlSecurity';
import { createDesktopAuthCode } from '../../services/auth/appwriteClient';
import { AuthLayout } from './AuthLayout';

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

    try {
      const callbackUrl = new URL(params.redirectUri);
      callbackUrl.searchParams.set('code', code);
      if (params.state) {
        callbackUrl.searchParams.set('state', params.state);
      }
      // Attempt loopback redirection
      window.location.href = callbackUrl.toString();
    } catch {
      // Loopback blocked or manual copy required
    }
  };

  const handleCopy = () => {
    if (authCode) {
      navigator.clipboard.writeText(authCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <AuthLayout
      title="Authorize Syntaflow Desktop"
      subtitle="Connect your desktop app to your authenticated workspace session."
    >
      <SEOHead
        title="Authorize Desktop — Syntaflow"
        description="Authorize Syntaflow Desktop to securely connect to your account."
        path="/auth/desktop"
        indexable={false}
      />

      {errorMessage && (
        <div
          role="alert"
          style={{
            padding: '12px 14px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#f87171',
            fontSize: '13px',
            marginBottom: '1.25rem',
            lineHeight: 1.4,
          }}
        >
          {errorMessage}
        </div>
      )}

      {authorized ? (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              padding: '16px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '8px',
              color: '#34d399',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            ✓ Authorization token generated. Returning to Syntaflow Desktop...
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            If your desktop client does not resume automatically, copy this one-time token into the desktop prompt:
          </p>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              readOnly
              value={authCode || ''}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#00f2fe',
                fontSize: '12px',
                fontFamily: 'monospace',
                outline: 'none',
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              style={{ whiteSpace: 'nowrap' }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <Link
              href="/account"
              style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              Return to Account Portal
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Authenticated user indicator */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 242, 254, 0.15)',
                color: '#00f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user?.name || 'Syntaflow Operator'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                {user?.email}
              </div>
            </div>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Syntaflow Desktop is requesting permission to link with your account. This will allow the desktop app to sync your workspace profile and preview license.
          </div>

          <Button
            type="button"
            variant="primary"
            size="lg"
            disabled={isAuthorizing}
            onClick={handleAuthorize}
            style={{ width: '100%', backgroundColor: 'var(--cobalt)', borderRadius: '8px' }}
          >
            {isAuthorizing ? 'Authorizing...' : 'Approve Desktop Connection'}
          </Button>

          <div style={{ textAlign: 'center' }}>
            <Link
              href="/account"
              style={{ fontSize: '13px', color: 'var(--text-tertiary)', textDecoration: 'none' }}
            >
              Cancel and return to Account
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};
