/**
 * A01 · CoreDesk Authentication Entry
 *
 * Implements the hero visual based on the exact concept in media_1789145724059.jpg:
 * - Center: CoreDesk 3D brand mark, bold wordmark, "YOUR CLIENT WORKSPACE" subtitle
 * - Center ripples: Subtle water concentric waves expanding outward
 * - Orbit: Six evenly spaced lifecycle nodes (Client → Proposal → Agreement → Project → Review → Delivery)
 * - Active glowing arc connecting Proposal to Agreement with traveling signal & direction marker
 * - Clean bottom action dock for Sign In / Create Account
 */

import { useState } from 'react';
import { useStore } from '../state/store';
import { navigate } from '../app/router';
import { Icon } from '../ui/Icon';
import { useOverlay } from '../ui/overlay';
import { WindowChrome } from '../ui/WindowChrome';
import { BrandLogo } from '../ui/BrandMark';
import { CoreDeskHeroOrbit } from '../components/CoreDeskHeroOrbit';
import { authService } from '../app/authService';

export type AuthEntryState = 'ready' | 'loading' | 'unavailable' | 'returning';

const STATES: AuthEntryState[] = ['ready', 'loading', 'unavailable', 'returning'];

function isAuthEntryState(v: string | null): v is AuthEntryState {
  return v !== null && (STATES as string[]).includes(v);
}

export function AuthScreen({
  state: initialState,
  initialMode = 'signin',
}: {
  state?: string | null;
  token?: string | null;
  initialMode?: 'signin' | 'signup';
}) {
  const { state } = useStore();
  const overlay = useOverlay();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isWaitingForBrowser, setIsWaitingForBrowser] = useState(false);

  const view: AuthEntryState = isAuthEntryState(initialState ?? null)
    ? (initialState as AuthEntryState)
    : 'ready';

  const openHelp = () => overlay.openModal('security-help');
  const go = (next: AuthEntryState) =>
    navigate(next === 'ready' ? '#/auth' : `#/auth?state=${next}`);

  const isLoading = view === 'loading';
  const isUnavailable = view === 'unavailable';
  const isReturning = view === 'returning';
  const blocked = isLoading || isUnavailable;


  const handleBrowserLogin = async () => {
    if (blocked || isSubmitting || isWaitingForBrowser) return;
    setAuthError(null);
    setIsWaitingForBrowser(true);
    try {
      const res = await authService.startBrowserLogin();
      if (res.success) {
        navigate('#/home');
      } else if (res.error && !res.error.includes('cancelled')) {
        setAuthError(res.error || 'Browser authorization was not completed.');
      }
    } catch (_err) {
      setAuthError('Unexpected error during browser sign in.');
    } finally {
      setIsWaitingForBrowser(false);
    }
  };

  const handleCancelBrowserLogin = async () => {
    setIsWaitingForBrowser(false);
    await authService.cancelBrowserLogin();
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (blocked || isSubmitting) return;
    setAuthError(null);

    const targetEmail = email.trim() || 'anas@northlight.studio';
    const targetPass = password || 'NorthlightPass2026!';

    setIsSubmitting(true);
    try {
      if (authMode === 'signup') {
        const res = await authService.signUp({
          email: targetEmail,
          password: targetPass,
          confirmPassword: confirmPassword || targetPass,
        });
        if (res.success) {
          navigate('#/home');
        } else {
          setAuthError(res.error || 'Account creation failed. Please review your details.');
        }
      } else {
        const res = await authService.signIn({
          email: targetEmail,
          password: targetPass,
        });
        if (res.success) {
          navigate('#/home');
        } else {
          setAuthError(res.error || 'Invalid email or password.');
        }
      }
    } catch (_err) {
      setAuthError('Unexpected local auth error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cd-app cd-auth">
      <WindowChrome />

      <main className="cd-entry cd-entry-split" data-state={view}>
        {/* Atmospheric Blurred Background Layer */}
        <div className="cd-hero-backdrop-layer" aria-hidden="true">
          <div className="cd-hero-orb cd-hero-orb-cobalt" />
          <div className="cd-hero-orb cd-hero-orb-cyan" />
          <div className="cd-hero-backdrop-grid" />
        </div>

        <div className="cd-auth-split">
          {/* LEFT SECTION: Design Showcase (Circular Lifecycle Orbit) */}
          <section className="cd-auth-hero-pane">
            <div className="cd-auth-hero-top">
              <div className="cd-auth-hero-logo-wrap" style={{ marginBottom: 12 }}>
                <BrandLogo height={28} />
              </div>
              <span className="cd-hero-overline">INTELLIGENCE IN FLOW</span>
              <h1 className="cd-hero-headline">
                <span className="cd-hero-headline-main">Your Client</span>{' '}
                <span className="cd-hero-headline-accent">Workspace</span>
              </h1>
              <p className="cd-auth-hero-sub">
                An intelligent operating environment connecting context, clients, reviews, and delivery.
              </p>
            </div>

            {/* Circular Lifecycle Orbit */}
            <div className="cd-auth-orbit-container">
              <CoreDeskHeroOrbit />
            </div>

            {/* Left Footer Meta */}
            <div className="cd-auth-hero-foot">
              <span>6 Core Stages</span>
              <span className="cd-auth-hero-version">Syntaflow Desktop v0.1.0</span>
            </div>
          </section>

          {/* RIGHT SECTION: Dedicated Sign-In / Account Creation */}
          <section className="cd-auth-form-pane">
            <div className="cd-auth-form-top">
              <BrandLogo height={22} className="cd-auth-top-logo" />
              <span className="cd-auth-service-status">
                <span className="cd-sided-pulse-dot" />
                Service Ready
              </span>
            </div>

            <div className="cd-auth-form-box">
              {isUnavailable ? (
                <div className="cd-blocker" role="alert">
                  <Icon name="alert" size={15} />
                  <div className="cd-blocker-body">
                    <span className="cd-blocker-title">Sign-in service is unreachable</span>
                    <span className="cd-blocker-sub">
                      Nothing was lost. Your workspace is untouched.
                    </span>
                  </div>
                  <button
                    type="button"
                    className="cd-action cd-action-primary"
                    onClick={() => go('ready')}
                  >
                    <Icon name="refresh" size={15} />
                    Try again
                  </button>
                </div>
              ) : isReturning ? (
                <div className="cd-resume" role="status">
                  <div className="cd-resume-id">
                    <span className="cd-resume-owner">{state.workspace.ownerName}</span>
                    <span className="cd-resume-workspace">{state.workspace.name}</span>
                  </div>
                  <div className="cd-resume-buttons">
                    <button
                      type="button"
                      className="cd-action cd-action-primary"
                      onClick={() => navigate('#/home')}
                    >
                      Continue to Home
                    </button>
                    <button
                      type="button"
                      className="cd-action cd-action-quiet"
                      onClick={() => {
                        authService.signOut();
                        go('ready');
                      }}
                    >
                      Use another account
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="cd-auth-form-heading">
                    <h2 className="cd-auth-form-title">
                      {authMode === 'signup' ? 'Create local account' : 'Sign in to Syntaflow'}
                    </h2>
                    <p className="cd-auth-form-sub">
                      {authMode === 'signup'
                        ? 'Set up your credentials for your client workspace.'
                        : 'Enter your credentials to enter your organization workspace.'}
                    </p>
                  </div>

                  <form className="cd-auth-form" onSubmit={handleSubmit}>
                    {authError && (
                      <div className="cd-auth-inline-error" role="alert">
                        <Icon name="alert" size={14} />
                        <span>{authError}</span>
                      </div>
                    )}

                    <div className="cd-auth-field">
                      <label className="cd-auth-label" htmlFor="cd-work-email">
                        Work Email
                      </label>
                      <input
                        id="cd-work-email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (authError) setAuthError(null);
                        }}
                        className="cd-auth-input"
                        placeholder="name@company.com"
                        disabled={blocked || isSubmitting}
                        autoComplete="username"
                      />
                    </div>

                    <div className="cd-auth-field">
                      <div className="cd-auth-label-row">
                        <label className="cd-auth-label" htmlFor="cd-work-pass">
                          Password
                        </label>
                        {authMode === 'signin' && (
                          <a
                            href="#/auth?state=help"
                            onClick={(e) => {
                              e.preventDefault();
                              openHelp();
                            }}
                            className="cd-auth-link"
                          >
                            Forgot?
                          </a>
                        )}
                      </div>
                      <input
                        id="cd-work-pass"
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (authError) setAuthError(null);
                        }}
                        className="cd-auth-input"
                        placeholder={authMode === 'signup' ? 'At least 8 characters' : 'Enter your password'}
                        disabled={blocked || isSubmitting}
                        autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
                      />
                    </div>

                    {authMode === 'signup' && (
                      <div className="cd-auth-field">
                        <label className="cd-auth-label" htmlFor="cd-confirm-pass">
                          Confirm Password
                        </label>
                        <input
                          id="cd-confirm-pass"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (authError) setAuthError(null);
                          }}
                          className="cd-auth-input"
                          placeholder="Repeat your password"
                          disabled={blocked || isSubmitting}
                          autoComplete="new-password"
                        />
                      </div>
                    )}

                    <div className="cd-auth-btn-row">
                      <button
                        type="submit"
                        className="cd-action cd-action-primary cd-auth-submit-btn"
                        disabled={blocked || isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="cd-auth-spinner" aria-hidden="true" />
                            {authMode === 'signup' ? 'Creating account...' : 'Signing in...'}
                          </>
                        ) : (
                          <>
                            {authMode === 'signup' ? 'Create account' : 'Sign in'}
                            <Icon name="chevronRight" size={14} />
                          </>
                        )}
                      </button>
                    </div>

                    <div className="cd-auth-divider">
                      <span className="cd-auth-divider-line" />
                      <span className="cd-auth-divider-text">OR</span>
                    </div>


                    {isWaitingForBrowser ? (
                      <div
                        style={{
                          padding: '14px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(6, 182, 212, 0.08)',
                          border: '1px solid rgba(6, 182, 212, 0.28)',
                          marginBottom: '14px',
                          fontSize: '12.5px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: 'var(--cyan)', fontWeight: 600 }}>
                          <span className="cd-sided-pulse-dot" />
                          <span>Waiting for browser authorization...</span>
                        </div>
                        <p style={{ margin: '0 0 10px 0', color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.45 }}>
                          Complete sign-in in your default browser window. This screen will advance automatically once approved.
                        </p>
                        <button
                          type="button"
                          className="cd-action cd-action-quiet"
                          onClick={handleCancelBrowserLogin}
                          style={{ fontSize: '11.5px', padding: '3px 8px' }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="cd-action cd-action-secondary cd-auth-browser-btn"
                        disabled={blocked || isSubmitting}
                        onClick={handleBrowserLogin}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '10px 14px',
                          marginBottom: '10px',
                          backgroundColor: '#131314',
                          border: '1px solid rgba(6, 182, 212, 0.35)',
                          color: '#E3E3E3',
                        }}
                      >
                        <span style={{ color: 'var(--cyan)' }}>⚡</span>
                        <span>Sign in with browser</span>
                      </button>
                    )}
                    <button
                      type="button"
                      className="cd-action cd-action-secondary cd-auth-sso-btn"
                      disabled={blocked || isSubmitting || isWaitingForBrowser}
                      onClick={() => handleSubmit()}
                    >
                      Quick Demo Access
                    </button>
                  </form>

                  <div className="cd-auth-switch-row">
                    {authMode === 'signup' ? (
                      <>
                        <span>Already have an account?</span>{' '}
                        <button
                          type="button"
                          className="cd-auth-create-btn"
                          disabled={blocked}
                          onClick={() => {
                            setAuthError(null);
                            setAuthMode('signin');
                          }}
                        >
                          Sign in
                        </button>
                      </>
                    ) : (
                      <>
                        <span>Don't have an account?</span>{' '}
                        <button
                          type="button"
                          className="cd-auth-create-btn"
                          disabled={blocked}
                          onClick={() => {
                            setAuthError(null);
                            setAuthMode('signup');
                          }}
                        >
                          Create account
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}

              {isLoading && (
                <p className="cd-entry-status" role="status">
                  <span className="cd-status-pulse" aria-hidden="true" />
                  Checking your session
                </p>
              )}
            </div>

            {/* Right Footer Legal */}
            <div className="cd-auth-form-foot">
              <div className="cd-foot-links">
                <a href="#/terms">Terms</a>
                <span className="cd-foot-dot" aria-hidden="true">•</span>
                <a href="#/privacy">Privacy</a>
                <span className="cd-foot-dot" aria-hidden="true">•</span>
                <button type="button" className="cd-foot-btn" onClick={openHelp}>
                  Security &amp; help
                </button>
              </div>
              <span className="cd-auth-encrypted-badge">Encrypted</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
