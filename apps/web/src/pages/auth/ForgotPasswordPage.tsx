import React, { useState } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Button } from '../../components/ui/Button';
import { Link } from '../../components/ui/Link';
import { sendPasswordRecovery, completePasswordRecovery } from '../../services/auth/appwriteClient';
import { AuthLayout } from './AuthLayout';

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
      setSuccessMessage(`Password recovery link sent to ${email}. Check your inbox.`);
    } else {
      setErrorMessage(res.error || 'Failed to send recovery email. Please check your address.');
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
      setErrorMessage(res.error || 'Password reset link is invalid or has expired.');
    }
  };

  const isResetting = Boolean(userId && secret);

  return (
    <AuthLayout
      title={isResetting ? 'Set new password' : 'Reset password'}
      subtitle={
        isResetting
          ? 'Enter a new secure password for your Syntaflow account.'
          : 'Enter your email address and we will send you a link to reset your password.'
      }
    >
      <SEOHead
        title="Reset Password — Syntaflow"
        description="Reset your Syntaflow account password securely."
        path="/forgot-password"
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

      {successMessage && (
        <div
          role="status"
          style={{
            padding: '12px 14px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            color: '#34d399',
            fontSize: '13px',
            marginBottom: '1.25rem',
            lineHeight: 1.4,
          }}
        >
          {successMessage}
        </div>
      )}

      {isSubmitted && !isResetting ? (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 20px',
              borderRadius: '8px',
              backgroundColor: 'var(--cobalt)',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            Return to Sign in
          </Link>
        </div>
      ) : isSubmitted && isResetting ? (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            href="/login"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 20px',
              borderRadius: '8px',
              backgroundColor: 'var(--cobalt)',
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            Sign in with new password
          </Link>
        </div>
      ) : isResetting ? (
        <form onSubmit={handleCompleteReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label
              htmlFor="new-password"
              style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}
            >
              New Password (min. 8 characters)
            </label>
            <input
              id="new-password"
              type="password"
              required
              placeholder="••••••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}
            >
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                boxSizing: 'border-box',
              }}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            style={{ width: '100%', marginTop: '0.5rem', backgroundColor: 'var(--cobalt)', borderRadius: '8px' }}
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRequestReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label
              htmlFor="reset-email"
              style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}
            >
              Account Email
            </label>
            <input
              id="reset-email"
              type="email"
              required
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
                boxSizing: 'border-box',
              }}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            style={{ width: '100%', marginTop: '0.5rem', backgroundColor: 'var(--cobalt)', borderRadius: '8px' }}
          >
            {isLoading ? 'Sending...' : 'Send Recovery Link'}
          </Button>
        </form>
      )}

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
        Remember your password?{' '}
        <Link href="/login" style={{ color: '#00f2fe', textDecoration: 'none', fontWeight: 500 }}>
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
};
