import React, { useState } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BrandMark } from '../../components/brand/BrandMark';
import { Link } from '../../components/ui/Link';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 600);
  };

  const handleGoogleSignIn = () => {
    alert('Google Sign-In initiates OAuth 2.0 PKCE authentication with verified scopes under Google Limited Use guidelines.');
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 'var(--space-48)',
        paddingBottom: 'var(--space-64)',
        overflow: 'hidden',
      }}
    >
      <SEOHead path="/login" />

      {/* Ambient Lighting Backdrop */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1200px',
          height: '600px',
          background: 'radial-gradient(ellipse at 50% 20%, rgba(37, 99, 235, 0.15) 0%, rgba(6, 182, 212, 0.07) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ maxWidth: '1120px', position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 1fr',
            gap: 'var(--space-48)',
            alignItems: 'center',
          }}
          className="login-split-grid"
        >
          {/* Left Column: Product Proof & Credibility Showcase */}
          <div>
            <div style={{ marginBottom: 'var(--space-20)' }}>
              <BrandMark size="lg" />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px',
                borderRadius: '100px',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.28)',
                marginBottom: 'var(--space-16)',
              }}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--cyan)' }} className="pulse-glow" />
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                CLIENT OPERATING SYSTEM // DESKTOP PREVIEW
              </span>
            </div>

            <h1
              className="heading-1"
              style={{
                fontSize: 'clamp(28px, 3.8vw, 42px)',
                lineHeight: 1.15,
                color: 'var(--text)',
                marginBottom: 'var(--space-16)',
                letterSpacing: '-0.025em',
              }}
            >
              The workspace where client context stays intact.
            </h1>

            <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-32)', maxWidth: '520px' }}>
              Syntaflow connects commercial scoping, dual-density task boards, typographic documents, and legally defensible review sign-offs into a single local-first desktop runtime.
            </p>

            {/* Product Proof Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)', maxWidth: '540px' }}>
              {[
                {
                  icon: '⚡',
                  title: 'Local-First SQLite Sovereignty',
                  desc: 'Zero cloud database mirroring. All client rates, blueprints, and records live physically on your workstation.',
                },
                {
                  icon: '🔒',
                  title: 'Immutable Review Snapshots',
                  desc: 'Version-bound client sign-offs prevent scope disputes. Revisions occur only on explicit branches.',
                },
                {
                  icon: '🛡',
                  title: 'OS Keychain & Zero-Knowledge Vault',
                  desc: 'OAuth tokens encrypted via Windows DPAPI and native secure storage. Strictly zero behavioral tracking.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '14px 18px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(22, 27, 34, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    backdropFilter: 'blur(10px)',
                  }}
                  className="interactive-lift"
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(6, 182, 212, 0.1)',
                      border: '1px solid rgba(6, 182, 212, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)', marginBottom: '3px' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginTop: 'var(--space-28)',
                paddingTop: 'var(--space-16)',
                borderTop: '1px solid var(--border)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-metadata)',
              }}
            >
              <span>✓ RFC 8252 Loopback</span>
              <span>·</span>
              <span>✓ Google Limited Use</span>
              <span>·</span>
              <span>✓ AES-256 GCM</span>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div>
            <Card
              variant="raised"
              style={{
                padding: 'var(--space-40)',
                backgroundColor: 'var(--surface-raised)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.8), 0 0 28px -6px rgba(6, 182, 212, 0.12)',
                borderRadius: '14px',
                maxWidth: '460px',
                margin: '0 auto',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-24)' }}>
                <h2 className="heading-2" style={{ fontSize: '24px', color: 'var(--text)', marginBottom: '6px' }}>
                  Sign in to Syntaflow
                </h2>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: 0 }}>
                  Access your web workspace and authenticate your desktop client.
                </p>
              </div>

              {/* Official Google Sign-In Button (Google Identity Branding Guidelines) */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
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
                  transition: 'background-color 0.15s ease, border-color 0.15s ease, transform 0.1s ease',
                }}
                className="interactive-lift"
              >
                {/* Official Google "G" Logo SVG */}
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z" fill="#4285F4" />
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853" />
                  <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.347 2.825.957 4.039l3.007-2.332z" fill="#FBBC05" />
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335" />
                </svg>
                <span>Sign in with Google</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-20)' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
                <span style={{ fontSize: '11.5px', color: 'var(--text-metadata)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  or continue with email
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
              </div>

              {isSent ? (
                <div
                  style={{
                    padding: 'var(--space-20)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    borderRadius: '8px',
                    color: '#34D399',
                    fontSize: '13.5px',
                    textAlign: 'center',
                    lineHeight: 1.5,
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>✓</div>
                  Verification link transmitted to <strong>{email}</strong>. Check your inbox to complete sign-in.
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label htmlFor="login-email" style={{ display: 'block', fontSize: '12.5px', color: 'var(--text)', marginBottom: '6px', fontWeight: 500 }}>
                      Work Email
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        fontSize: '14px',
                        backgroundColor: 'var(--surface-sunken)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        color: 'var(--text)',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.15s ease',
                      }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label htmlFor="login-password" style={{ fontSize: '12.5px', color: 'var(--text)', fontWeight: 500 }}>
                        Password
                      </label>
                      <span style={{ fontSize: '12px', color: 'var(--cyan)', cursor: 'pointer' }}>
                        Forgot?
                      </span>
                    </div>
                    <input
                      id="login-password"
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        fontSize: '14px',
                        backgroundColor: 'var(--surface-sunken)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        color: 'var(--text)',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.15s ease',
                      }}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading || !email}
                    style={{ width: '100%', textAlign: 'center', marginTop: '4px', padding: '12px' }}
                  >
                    {isLoading ? 'Verifying...' : 'Continue to Workspace'}
                  </Button>
                </form>
              )}

              {/* Desktop Auth Connection Link */}
              <div
                style={{
                  marginTop: 'var(--space-24)',
                  paddingTop: 'var(--space-16)',
                  borderTop: '1px solid var(--border)',
                  textAlign: 'center',
                  fontSize: '12.5px',
                  color: 'var(--text-muted)',
                }}
              >
                Launching from the desktop app?{' '}
                <Link href="/auth/desktop" style={{ color: 'var(--cyan)', textDecoration: 'underline', fontWeight: 500 }}>
                  Authorize Local Bridge &rarr;
                </Link>
              </div>

              <div style={{ marginTop: 'var(--space-16)', textAlign: 'center', fontSize: '11.5px', color: 'var(--text-metadata)', lineHeight: 1.5 }}>
                Protected by local cryptographic vaults.
                <br />
                By signing in, you agree to our{' '}
                <Link href="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>Terms</Link> and{' '}
                <Link href="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'underline' }}>Privacy Policy</Link>.
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
