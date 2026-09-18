import React, { useState, useEffect } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Button } from '../../components/ui/Button';
import { Link } from '../../components/ui/Link';
import { useAuth } from '../../services/auth/AuthContext';
import { AuthLayout } from './AuthLayout';

export const SignUpPage: React.FC = () => {
  const { signup, loginWithGoogle, isAuthenticated, isLoading: authLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      window.location.href = typeof window !== 'undefined' && window.location.hostname.includes('syntaflow.tech')
        ? 'https://app.syntaflow.tech'
        : '/account';
    }
  }, [isAuthenticated, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const result = await signup(email, password, name);
    setIsLoading(false);

    if (result.success) {
      // NEW users go through onboarding first
      if (typeof window !== 'undefined') {
        localStorage.setItem('syntaflow_onboarding_completed', 'false');
      }
      window.location.href = '/onboarding';
    } else {
      setErrorMessage(result.error || 'Registration failed. Please check your information.');
    }
  };

  const handleGoogleSignUp = () => {
    // New Google signups also route to onboarding
    const successUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/onboarding`
      : 'https://syntaflow.tech/onboarding';
    const failureUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/signup?error=oauth`
      : 'https://syntaflow.tech/signup?error=oauth';

    loginWithGoogle(successUrl, failureUrl);
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start using Syntaflow with your local-first client workspace."
    >
      <SEOHead
        title="Create Account — Syntaflow"
        description="Create your Syntaflow account to get the Windows desktop preview and start managing connected client work."
        path="/signup"
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
        onClick={handleGoogleSignUp}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '11px 16px',
          borderRadius: 'var(--radius-button)',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--surface-subtle)';
          e.currentTarget.style.borderColor = 'var(--edge-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--surface)';
          e.currentTarget.style.borderColor = 'var(--border)';
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
        <span>Sign up with Google</span>
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
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--divider)' }} />
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)' }}>
          or with email
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--divider)' }} />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label
            htmlFor="signup-name"
            style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px' }}
          >
            Full Name
          </label>
          <input
            id="signup-name"
            type="text"
            required
            autoComplete="name"
            placeholder="Anas Ayari"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color var(--transition-fast)',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--cobalt)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        <div>
          <label
            htmlFor="signup-email"
            style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px' }}
          >
            Work Email
          </label>
          <input
            id="signup-email"
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
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color var(--transition-fast)',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--cobalt)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        <div>
          <label
            htmlFor="signup-password"
            style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px' }}
          >
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            minLength={8}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color var(--transition-fast)',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--cobalt)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isLoading}
          style={{ width: '100%', marginTop: '0.5rem', borderRadius: 'var(--radius-button)' }}
        >
          {isLoading ? 'Creating account...' : 'Create Workspace Account'}
        </Button>
      </form>

      {/* Footer link to Login */}
      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <Link
          href="/login"
          style={{ color: 'var(--cobalt)', textDecoration: 'none', fontWeight: 600 }}
        >
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
};
