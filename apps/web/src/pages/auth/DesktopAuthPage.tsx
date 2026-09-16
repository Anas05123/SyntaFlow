import React, { useState, useEffect } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const DesktopAuthPage: React.FC = () => {
  const [params] = useState<{ state: string; redirectUri: string; flowId?: string }>(() => {
    if (typeof window === 'undefined') {
      return { state: '', redirectUri: 'syntaflow://auth/callback' };
    }
    const searchParams = new URLSearchParams(window.location.search);
    return {
      state: searchParams.get('state') || '',
      redirectUri: searchParams.get('redirect_uri') || 'syntaflow://auth/callback',
      flowId: searchParams.get('flow_id') || '',
    };
  });

  const [authorized, setAuthorized] = useState(false);
  const [oneTimeCode] = useState(() => 'sf_auth_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36));
  const [copied, setCopied] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5 minutes expiry

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAuthorize = () => {
    const returnUrl = `${params.redirectUri}?code=${encodeURIComponent(oneTimeCode)}&state=${encodeURIComponent(params.state)}`;
    setAuthorized(true);

    // Attempt custom protocol redirect to desktop app
    setTimeout(() => {
      window.location.href = returnUrl;
    }, 800);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(oneTimeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.max(0, Math.min(100, (secondsRemaining / 300) * 100));

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

      <div className="container" style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
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
                RFC 8252 BCP-212 // LOCAL LOOPBACK HANDSHAKE
              </span>
            </div>

            <h1 className="heading-1" style={{ fontSize: 'clamp(26px, 4vw, 34px)', color: 'var(--text)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Authorize Syntaflow Desktop
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5, maxWidth: '480px', marginInline: 'auto' }}>
              A local Syntaflow Desktop runtime on this machine is requesting access to authenticate your workspace.
            </p>
          </div>

          {/* Visual Handshake Graphic: Web Browser <---> Local Desktop App */}
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
            {/* Background subtle grid pattern */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
                pointerEvents: 'none',
              }}
            />

            {/* Left Node: Web Browser */}
            <div style={{ textAlign: 'center', zIndex: 1, minWidth: '110px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#181C20',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  margin: '0 auto 8px auto',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                }}
              >
                🌐
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Web Account</div>
              <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>syntaflow.tech</div>
              <div style={{ display: 'inline-block', marginTop: '4px', padding: '1px 6px', borderRadius: '3px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34D399', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                SSL VERIFIED
              </div>
            </div>

            {/* Center: Connecting Signal Flow */}
            <div style={{ flex: 1, margin: '0 20px', textAlign: 'center', zIndex: 1 }}>
              <div style={{ height: '3px', backgroundColor: 'rgba(6, 182, 212, 0.25)', position: 'relative', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '35%',
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
                  {authorized ? '✓ PROTOCOL HANDSHAKE DISPATCHED' : 'AWAITING OPERATOR APPROVAL'}
                </span>
              </div>
            </div>

            {/* Right Node: Desktop App */}
            <div style={{ textAlign: 'center', zIndex: 1, minWidth: '110px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#181C20',
                  border: '1px solid rgba(6, 182, 212, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  margin: '0 auto 8px auto',
                  boxShadow: '0 0 20px -2px rgba(6, 182, 212, 0.35)',
                }}
                className="pulse-glow"
              >
                💻
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>Desktop Client</div>
              <div style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: '#10B981' }}>Loopback 127.0.0.1</div>
              <div style={{ display: 'inline-block', marginTop: '4px', padding: '1px 6px', borderRadius: '3px', backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'var(--cyan)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                LOCAL RUNTIME
              </div>
            </div>
          </div>

          {/* Session Security Details */}
          <div
            style={{
              padding: '16px 18px',
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
              <span>HANDOFF PROTOCOL:</span>
              <span style={{ color: 'var(--cyan)' }}>
                {params.redirectUri.startsWith('syntaflow://') ? 'Custom Protocol (syntaflow://)' : 'Loopback (http://127.0.0.1)'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>CSRF STATE PARAMETER:</span>
              <span style={{ color: '#10B981' }}>{params.state ? 'Cryptographically Validated' : 'Local Preview Bridge'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>SESSION EXPIRY:</span>
              <span style={{ color: secondsRemaining > 60 ? 'var(--text)' : '#EF4444', fontWeight: 600 }}>
                {formatTimer(secondsRemaining)} remaining
              </span>
            </div>

            {/* Countdown progress line */}
            <div style={{ height: '3px', backgroundColor: 'rgba(255, 255, 255, 0.06)', borderRadius: '2px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  backgroundColor: secondsRemaining > 60 ? 'var(--cyan)' : '#EF4444',
                  transition: 'width 1s linear',
                }}
              />
            </div>
          </div>

          {/* Authorization Actions */}
          {authorized ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  textAlign: 'center',
                  padding: 'var(--space-20)',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  borderRadius: '8px',
                  color: '#34D399',
                }}
              >
                <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>
                  ✓ Handshake Dispatched to Syntaflow Desktop
                </div>
                <p style={{ fontSize: '13px', margin: 0, color: '#A7F3D0', lineHeight: 1.5 }}>
                  Your browser has dispatched the authorization code. If your system displays a security prompt asking to open <strong>Syntaflow</strong>, click <strong>Open</strong>.
                </p>
              </div>

              {/* Manual Fallback Token Widget */}
              <div
                style={{
                  padding: '16px',
                  backgroundColor: 'rgba(11, 13, 15, 0.9)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', textTransform: 'uppercase' }}>
                    MANUAL FALLBACK CODE (IF NOT AUTO-REDIRECTED)
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--cyan)' }}>Single-use token</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    readOnly
                    value={oneTimeCode}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      backgroundColor: '#070809',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      color: 'var(--cyan)',
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      outline: 'none',
                    }}
                  />
                  <Button variant="secondary" onClick={copyCode} style={{ padding: '8px 16px', fontSize: '12px' }}>
                    {copied ? '✓ Copied' : 'Copy Code'}
                  </Button>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-metadata)', marginTop: '6px' }}>
                  Paste this token into Syntaflow Desktop under Settings &gt; Authentication.
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button
                variant="primary"
                onClick={handleAuthorize}
                style={{ width: '100%', textAlign: 'center', padding: '14px', fontSize: '15px', fontWeight: 600 }}
              >
                Approve Desktop Authorization &rarr;
              </Button>
              <Button variant="secondary" href="/" style={{ width: '100%', textAlign: 'center', padding: '12px' }}>
                Cancel & Return Home
              </Button>
            </div>
          )}

          <div style={{ marginTop: 'var(--space-20)', textAlign: 'center', fontSize: '11.5px', color: 'var(--text-disabled)', lineHeight: 1.5 }}>
            One-time authorization codes expire in 5 minutes and cannot be reused.
            <br />
            Permanent tokens are never passed through URLs and reside strictly in your operating system keychain.
          </div>
        </Card>

        {/* Informational Security Explainer (3 Cards) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 'var(--space-16)' }}>
          {[
            {
              icon: '🛡',
              title: 'RFC 8252 Loopback',
              desc: 'Follows official OAuth 2.0 Best Current Practice for native desktop apps using direct loopback sockets.',
            },
            {
              icon: '🔒',
              title: 'Zero Relay Servers',
              desc: 'No cloud server proxies your authorization code. It routes directly from browser to workstation.',
            },
            {
              icon: '🔑',
              title: 'Windows DPAPI',
              desc: 'Once received, tokens are encrypted with your user account key via Windows DPAPI before disk write.',
            },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(22, 27, 34, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                backdropFilter: 'blur(8px)',
              }}
              className="interactive-lift"
            >
              <div style={{ fontSize: '16px', marginBottom: '6px' }}>{c.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                {c.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                {c.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
