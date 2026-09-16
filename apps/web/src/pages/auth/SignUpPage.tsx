import React, { useState, useEffect } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BrandMark } from '../../components/brand/BrandMark';
import { Link } from '../../components/ui/Link';
import { useAuth } from '../../services/auth/AuthContext';
import { sanitizeInternalRedirect } from '../../utils/urlSecurity';

export const SignUpPage: React.FC = () => {
  const { signup, loginWithGoogle, isAuthenticated, isLoading: authLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [returnTo] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const rawReturnTo = searchParams.get('returnTo');
      if (rawReturnTo) {
        return sanitizeInternalRedirect(rawReturnTo, '/account');
      }
    }
    return '/account';
  });

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      window.location.href = returnTo;
    }
  }, [isAuthenticated, authLoading, returnTo]);

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
      window.location.href = returnTo;
    } else {
      setErrorMessage(result.error || 'Registration failed. Please check your information.');
    }
  };

  const handleGoogleSignUp = () => {
    const successUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${returnTo}`
      : 'https://syntaflow.tech/account';
    const failureUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/signup?error=oauth&returnTo=${encodeURIComponent(returnTo)}`
      : 'https://syntaflow.tech/signup?error=oauth';

    loginWithGoogle(successUrl, failureUrl);
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'var(--space-48)',
        paddingBottom: 'var(--space-64)',
        overflow: 'hidden',
      }}
    >
      <SEOHead path="/signup" />

      {/* Ambient Lighting Backdrop */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1000px',
          height: '500px',
          background: 'radial-gradient(ellipse at 50% 20%, rgba(37, 99, 235, 0.14) 0%, rgba(6, 182, 212, 0.06) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ maxWidth: '440px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-28)' }}>
          <div style={{ display: 'inline-block', marginBottom: 'var(--space-16)' }}>
            <Link href="/" aria-label="Syntaflow Home">
              <BrandMark variant="full" size="lg" />
            </Link>
          </div>
          <h1
            className="heading-1"
            style={{
              fontSize: '26px',
              color: 'var(--text)',
              marginBottom: '6px',
              letterSpacing: '-0.02em',
            }}
          >
            Create your account
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0 }}>
            Start with the Preview plan ($0) for complete local-first client workflows.
          </p>
        </div>

        <Card
          variant="raised"
          style={{
            padding: 'var(--space-32)',
            backgroundColor: 'var(--surface-raised)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.8), 0 0 28px -6px rgba(6, 182, 212, 0.1)',
            borderRadius: '12px',
          }}
        >
          {errorMessage && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                color: '#F87171',
                fontSize: '13px',
                marginBottom: 'var(--space-20)',
                lineHeight: 1.45,
              }}
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          {/* Google Sign-Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '11px 18px',
              borderRadius: '6px',
              backgroundColor: '#131314',
              color: '#E3E3E3',
              border: '1px solid #8E918F',
              fontSize: '14px',
              fontWeight: 500,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              marginBottom: 'var(--space-20)',
              transition: 'background-color 0.15s ease, border-color 0.15s ease',
            }}
            className="interactive-lift"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853" />
              <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.347 2.825.957 4.039l3.007-2.332z" fill="#FBBC05" />
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-20)' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-metadata)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              or register with email
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="signup-name" style={{ display: 'block', fontSize: '12.5px', color: 'var(--text)', marginBottom: '6px', fontWeight: 500 }}>
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '14px',
                  backgroundColor: 'var(--surface-sunken)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  color: 'var(--text)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label htmlFor="signup-email" style={{ display: 'block', fontSize: '12.5px', color: 'var(--text)', marginBottom: '6px', fontWeight: 500 }}>
                Work Email
              </label>
              <input
                id="signup-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '14px',
                  backgroundColor: 'var(--surface-sunken)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  color: 'var(--text)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label htmlFor="signup-password" style={{ display: 'block', fontSize: '12.5px', color: 'var(--text)', marginBottom: '6px', fontWeight: 500 }}>
                Password (min. 8 characters)
              </label>
              <input
                id="signup-password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '14px',
                  backgroundColor: 'var(--surface-sunken)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  color: 'var(--text)',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !name || !email || !password}
              style={{ width: '100%', textAlign: 'center', marginTop: '4px', padding: '11px' }}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Switch to Sign In */}
          <div
            style={{
              marginTop: 'var(--space-20)',
              paddingTop: 'var(--space-16)',
              borderTop: '1px solid var(--border)',
              textAlign: 'center',
              fontSize: '13px',
              color: 'var(--text-muted)',
            }}
          >
            Already have an account?{' '}
            <Link
              href={returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : '/login'}
              style={{ color: 'var(--cyan)', fontWeight: 500, textDecoration: 'none' }}
            >
              Sign in
            </Link>
          </div>
        </Card>

        <div style={{ marginTop: 'var(--space-20)', textAlign: 'center', fontSize: '11.5px', color: 'var(--text-metadata)', lineHeight: 1.5 }}>
          By creating an account, you agree to our{' '}
          <Link href="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>Terms</Link> and{' '}
          <Link href="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
};
