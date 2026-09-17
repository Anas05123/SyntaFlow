import React, { useState, useEffect } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Button } from '../../components/ui/Button';
import { Link } from '../../components/ui/Link';
import { useAuth } from '../../services/auth/AuthContext';
import { sanitizeInternalRedirect } from '../../utils/urlSecurity';
import { AuthLayout } from './AuthLayout';

export const LoginPage: React.FC = () => {
  const { login, loginWithGoogle, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [returnTo] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const rawReturnTo = searchParams.get('returnTo');
      const defaultDest = window.location.hostname.includes('syntaflow.tech')
        ? 'https://app.syntaflow.tech'
        : '/account';

      if (rawReturnTo) {
        const sanitized = sanitizeInternalRedirect(rawReturnTo, defaultDest);
        if (window.location.hostname.includes('syntaflow.tech')) {
          if (sanitized === '/account') {
            return 'https://app.syntaflow.tech';
          }
          if (sanitized.startsWith('/account/')) {
            return `https://app.syntaflow.tech${sanitized.replace(/^\/account/, '')}`;
          }
        }
        return sanitized;
      }
      return defaultDest;
    }
    return 'https://app.syntaflow.tech';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('error') === 'oauth') {
        setErrorMessage('Google Sign-In could not be completed. Please try again or sign in with email.');
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      window.location.href = returnTo;
    }
  }, [isAuthenticated, authLoading, returnTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMessage(null);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      window.location.href = returnTo;
    } else {
      setErrorMessage(result.error || 'Invalid email or password.');
    }
  };

  const handleGoogleSignIn = () => {
    const successUrl = returnTo.startsWith('http')
      ? returnTo
      : typeof window !== 'undefined'
        ? (window.location.hostname.includes('syntaflow.tech') ? `https://app.syntaflow.tech${returnTo === '/account' ? '' : returnTo}` : `${window.location.origin}${returnTo}`)
        : 'https://app.syntaflow.tech';
    const failureUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/login?error=oauth&returnTo=${encodeURIComponent(returnTo)}`
      : 'https://syntaflow.tech/login?error=oauth';

    loginWithGoogle(successUrl, failureUrl);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Syntaflow workspace account."
    >
      <SEOHead
        title="Log In | Syntaflow"
        description="Sign in to your Syntaflow account to access your workspace, downloads, and active desktop sessions."
        path="/login"
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

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '11px 16px',
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          color: 'var(--text-primary)',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          marginBottom: '1.5rem',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.09)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Divider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)' }}>
          or with email
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label
            htmlFor="login-email"
            style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}
          >
            Work Email
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            placeholder="operator@studio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.15s ease',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#00f2fe')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label
              htmlFor="login-password"
              style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              style={{ fontSize: '12px', color: '#00f2fe', textDecoration: 'none' }}
            >
              Forgot?
            </Link>
          </div>
          <input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.15s ease',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#00f2fe')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
          style={{ width: '100%', marginTop: '0.5rem', backgroundColor: 'var(--cobalt)', borderRadius: '8px' }}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      {/* Footer link to Signup */}
      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
        New to Syntaflow?{' '}
        <Link href="/signup" style={{ color: '#00f2fe', textDecoration: 'none', fontWeight: 500 }}>
          Create account
        </Link>
      </div>
    </AuthLayout>
  );
};
