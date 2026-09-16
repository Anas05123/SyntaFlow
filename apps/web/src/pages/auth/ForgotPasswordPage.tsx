import React, { useState } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BrandMark } from '../../components/brand/BrandMark';
import { Link } from '../../components/ui/Link';
import { sendPasswordRecovery, completePasswordRecovery } from '../../services/auth/appwriteClient';

export const ForgotPasswordPage: React.FC = () => {
  const [recoveryParams] = useState<{ userId: string | null; secret: string | null }>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      return {
        userId: searchParams.get('userId'),
        secret: searchParams.get('secret'),
      };
    }
    return { userId: null, secret: null };
  });

  const userId = recoveryParams.userId;
  const secret = recoveryParams.secret;

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMessage(null);

    const res = await sendPasswordRecovery(email);
    setIsLoading(false);

    if (res.success) {
      setIsSubmitted(true);
      setSuccessMessage(`Password recovery instructions sent to ${email}. Please check your inbox.`);
    } else {
      setErrorMessage(res.error || 'Failed to send recovery email. Please check the address and try again.');
    }
  };

  const handleCompleteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !secret) return;

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await completePasswordRecovery(userId, secret, newPassword);
    setIsLoading(false);

    if (res.success) {
      setIsSubmitted(true);
      setSuccessMessage('Your password has been successfully updated. You can now sign in.');
    } else {
      setErrorMessage(res.error || 'Password reset token is invalid or expired.');
    }
  };

  const isResetMode = Boolean(userId && secret);

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
      <SEOHead path="/forgot-password" />

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
            {isResetMode ? 'Choose new password' : 'Reset your password'}
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0 }}>
            {isResetMode
              ? 'Enter a new secure password for your Syntaflow account.'
              : 'Enter your email address and we will send you a recovery link.'}
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

          {successMessage && (
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '6px',
                color: '#34D399',
                fontSize: '13.5px',
                marginBottom: 'var(--space-20)',
                lineHeight: 1.5,
                textAlign: 'center',
              }}
              role="status"
            >
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>✓</div>
              {successMessage}
            </div>
          )}

          {!isSubmitted ? (
            isResetMode ? (
              /* Reset Password Form */
              <form onSubmit={handleCompleteReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label htmlFor="new-password" style={{ display: 'block', fontSize: '12.5px', color: 'var(--text)', marginBottom: '6px', fontWeight: 500 }}>
                    New Password (min. 8 characters)
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
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
                  <label htmlFor="confirm-new-password" style={{ display: 'block', fontSize: '12.5px', color: 'var(--text)', marginBottom: '6px', fontWeight: 500 }}>
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-new-password"
                    type="password"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
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
                  disabled={isLoading || !newPassword || !confirmPassword}
                  style={{ width: '100%', textAlign: 'center', marginTop: '4px', padding: '11px' }}
                >
                  {isLoading ? 'Updating password...' : 'Update Password'}
                </Button>
              </form>
            ) : (
              /* Request Recovery Link Form */
              <form onSubmit={handleRequestReset} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label htmlFor="recovery-email" style={{ display: 'block', fontSize: '12.5px', color: 'var(--text)', marginBottom: '6px', fontWeight: 500 }}>
                    Work Email
                  </label>
                  <input
                    id="recovery-email"
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

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading || !email}
                  style={{ width: '100%', textAlign: 'center', marginTop: '4px', padding: '11px' }}
                >
                  {isLoading ? 'Sending recovery link...' : 'Send Recovery Link'}
                </Button>
              </form>
            )
          ) : (
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <Link href="/login" style={{ color: 'var(--cyan)', fontWeight: 500, textDecoration: 'none' }}>
                Return to Sign in &rarr;
              </Link>
            </div>
          )}

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
            Remembered your password?{' '}
            <Link href="/login" style={{ color: 'var(--cyan)', fontWeight: 500, textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
