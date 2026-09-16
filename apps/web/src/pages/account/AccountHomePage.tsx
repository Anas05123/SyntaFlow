import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Link } from '../../components/ui/Link';
import { useAuth } from '../../services/auth/AuthContext';

export const AccountHomePage: React.FC = () => {
  const { user, plan } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Operator';

  const onboardingPrefs = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('syntaflow_workspace_prefs') || '{}')
    : {};
  const workspaceName = onboardingPrefs.workspaceName || 'Syntaflow Workspace';

  const checklist = [
    {
      id: 1,
      title: 'Download Syntaflow for Windows',
      detail: 'Install the local-first desktop application on your Windows 10/11 x64 machine.',
      done: true,
      actionText: 'Downloads',
      actionHref: '/account/downloads',
    },
    {
      id: 2,
      title: 'Sign into Syntaflow Desktop',
      detail: 'Click "Sign in with browser" inside the desktop app to authorize your session.',
      done: false,
      actionText: 'Connect Guide',
      actionHref: '/account/desktop',
    },
    {
      id: 3,
      title: 'Configure Your Scoping Blueprint',
      detail: 'Define commercial milestone gates and delivery review requirements.',
      done: false,
      actionText: 'Read Tutorial',
      actionHref: '/account/tutorials',
    },
    {
      id: 4,
      title: 'Connect Client Integrations',
      detail: 'Securely link Gmail, Google Drive, or GitHub via native OS-level DPAPI vault.',
      done: false,
      actionText: 'Integrations',
      actionHref: '/integrations',
    },
  ];

  return (
    <div>
      <SEOHead
        title="Workspace Overview — Syntaflow Account"
        description="Syntaflow account overview and getting started checklist."
        path="/account"
        indexable={false}
      />

      {/* Top Welcome Banner */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: '12px',
              backgroundColor: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              color: '#00f2fe',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {plan?.planId === 'preview' ? 'Desktop Preview Active' : 'Free Account'}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
            Workspace: <strong style={{ color: '#ffffff' }}>{workspaceName}</strong>
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: '#ffffff',
            margin: '0 0 0.5rem 0',
          }}
        >
          Welcome, {firstName}.
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
          Your local-first operating environment for connected client projects, immutable reviews, and delivery gates.
        </p>
      </div>

      {/* Quick Action Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Card 1: Windows Download */}
        <div
          style={{
            padding: '1.5rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(17, 20, 26, 0.85)',
            border: '1px solid rgba(0, 242, 254, 0.2)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(0, 242, 254, 0.2)',
                  flexShrink: 0,
                }}
              >
                <img
                  src="/brand/LogoIcon_WBG.png"
                  alt="Syntaflow Logo"
                  style={{
                    width: '22px',
                    height: '22px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 2px 6px rgba(0, 242, 254, 0.4))',
                  }}
                />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>Syntaflow for Windows</div>
            </div>
            <span style={{ fontSize: '11px', color: '#00f2fe', fontWeight: 600 }}>v0.1.0-preview.4</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            Install the desktop application on Windows 10/11 x64. Local SQLite persistence with zero cloud tracking.
          </p>
          <Link
            href="/account/downloads"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: 'var(--cobalt)',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <span>Download Desktop</span>
            <span>↓</span>
          </Link>
        </div>

        {/* Card 2: Desktop Connection */}
        <div
          style={{
            padding: '1.5rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(17, 20, 26, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>Desktop Connection</div>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>PKCE Protected</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            Pair your local desktop app with your account identity for preview license verification.
          </p>
          <Link
            href="/account/desktop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <span>Connect Desktop</span>
            <span>→</span>
          </Link>
        </div>

        {/* Card 3: Tutorials */}
        <div
          style={{
            padding: '1.5rem',
            borderRadius: '14px',
            backgroundColor: 'rgba(17, 20, 26, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>Operator Guides</div>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>4 Step Guides</span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            Learn how to scope client blueprints, draft in the Paper Canvas, and build immutable delivery gates.
          </p>
          <Link
            href="/account/tutorials"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <span>Explore Tutorials</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Getting Started Checklist */}
      <div
        style={{
          padding: '2rem',
          borderRadius: '16px',
          backgroundColor: 'rgba(17, 20, 26, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#ffffff', margin: '0 0 0.25rem 0' }}>
              Getting Started with Syntaflow
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Follow these recommended milestones to set up your full client operating workflow.
            </div>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            1 of 4 completed
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {checklist.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: '10px',
                backgroundColor: item.done ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                border: item.done ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255, 255, 255, 0.06)',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: item.done ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                    color: item.done ? '#34d399' : 'var(--text-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {item.done ? '✓' : item.id}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: item.done ? '#ffffff' : 'var(--text-primary)' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    {item.detail}
                  </div>
                </div>
              </div>

              <Link
                href={item.actionHref}
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: item.done ? '#34d399' : '#00f2fe',
                  textDecoration: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                }}
              >
                {item.actionText} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
