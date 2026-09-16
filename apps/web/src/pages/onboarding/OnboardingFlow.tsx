import React, { useState, useEffect } from 'react';
import { BrandMark } from '../../components/brand/BrandMark';
import { Button } from '../../components/ui/Button';
import { SEOHead } from '../../components/ui/SEOHead';
import { useAuth } from '../../services/auth/AuthContext';

type StepId = 1 | 2 | 3 | 4 | 5;

interface RoleOption {
  id: string;
  title: string;
  description: string;
}

const ROLES: RoleOption[] = [
  { id: 'freelancer', title: 'Freelancer', description: 'Independent specialist managing direct client engagements' },
  { id: 'agency', title: 'Agency', description: 'Boutique design, engineering, or digital marketing agency' },
  { id: 'consultant', title: 'Consultant', description: 'Strategic advisory, technical auditing, and fractional leadership' },
  { id: 'studio', title: 'Studio', description: 'Creative direction, architecture, media, and production studio' },
  { id: 'team', title: 'Professional Team', description: 'In-house delivery team coordinating external stakeholders' },
];

const WORK_TYPES = [
  'Design & UI/UX',
  'Software Development',
  'Strategic Consulting',
  'Brand & Creative Direction',
  'Content & Media',
  'Architecture & 3D',
];

export const OnboardingFlow: React.FC = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<StepId>(1);
  const [selectedRole, setSelectedRole] = useState<string>('agency');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Design & UI/UX', 'Software Development']);
  const [workspaceName, setWorkspaceName] = useState<string>(() => {
    return user?.name ? `${user.name.split(' ')[0]} Studio` : 'Syntaflow Studio';
  });
  const [downloadInitiated, setDownloadInitiated] = useState(false);

  // Keyboard navigation support (Arrow keys or Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && step < 5) {
        setStep((prev) => (prev + 1) as StepId);
      } else if (e.key === 'ArrowLeft' && step > 1) {
        setStep((prev) => (prev - 1) as StepId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step]);

  const toggleWorkType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('syntaflow_onboarding_completed', 'true');
      localStorage.setItem(
        'syntaflow_workspace_prefs',
        JSON.stringify({ role: selectedRole, types: selectedTypes, workspaceName })
      );
      window.location.href = '/account';
    }
  };

  const stepTitles = [
    'Welcome',
    'Practice',
    'Workspace',
    'Desktop',
    'Ready',
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#07080a',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
      }}
    >
      <SEOHead
        title="Welcome to Syntaflow — Onboarding"
        description="Configure your workspace and get Syntaflow Desktop."
        path="/onboarding"
        indexable={false}
      />

      {/* Atmospheric corner lighting */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Top Header with Progress Bar (Modeled after user reference image) */}
      <header
        style={{
          padding: '1.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxWidth: '850px',
          width: '100%',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BrandMark variant="full" size="sm" />
          </div>

          <div style={{ fontSize: '12.5px', color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
            {stepTitles[step - 1]} <span style={{ color: '#ffffff', fontWeight: 600 }}>{step}</span> / 5
          </div>
        </div>

        {/* Progress Track */}
        <div
          style={{
            width: '100%',
            height: '3px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(step / 5) * 100}%`,
              background: 'linear-gradient(90deg, #2563eb 0%, #00f2fe 100%)',
              borderRadius: '2px',
              transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative',
            }}
          >
            {/* White dot indicator at the tip of progress bar */}
            <div
              style={{
                position: 'absolute',
                right: '-3px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                boxShadow: '0 0 8px #00f2fe',
              }}
            />
          </div>
        </div>
      </header>

      {/* Center Onboarding Container */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
          position: 'relative',
          zIndex: 5,
        }}
      >
        <div
          style={{
            maxWidth: '680px',
            width: '100%',
            textAlign: 'center',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ marginBottom: '2rem' }}>
                <BrandMark variant="icon" size="lg" />
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  marginBottom: '1rem',
                  lineHeight: 1.15,
                }}
              >
                Welcome to Syntaflow
              </h1>

              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  maxWidth: '520px',
                  marginBottom: '2.5rem',
                }}
              >
                Syntaflow is the connected operating environment for client work. A few quick steps will configure your workspace and prepare your Windows desktop app.
              </p>

              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '13px 32px',
                  borderRadius: '9999px',
                  backgroundColor: '#ffffff',
                  color: '#08090b',
                  fontSize: '15px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  boxShadow: '0 8px 25px rgba(255, 255, 255, 0.15)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <span>Get Started</span>
                <span>→</span>
              </button>

              <div style={{ marginTop: '2.5rem', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                Use <kbd style={{ padding: '2px 6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px' }}>←</kbd> <kbd style={{ padding: '2px 6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px' }}>→</kbd> to navigate
              </div>
            </div>
          )}

          {/* STEP 2: ABOUT YOU */}
          {step === 2 && (
            <div style={{ textAlign: 'left' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                  What best describes your practice?
                </h1>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
                  We tune default blueprint scopes and review authorities to your workflow.
                </p>
              </div>

              {/* Roles List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.75rem' }}>
                {ROLES.map((role) => {
                  const isSelected = selectedRole === role.id;
                  return (
                    <div
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      style={{
                        padding: '14px 18px',
                        borderRadius: '12px',
                        backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected ? '1px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '14.5px', fontWeight: 600, color: isSelected ? '#ffffff' : 'var(--text-primary)', marginBottom: '2px' }}>
                          {role.title}
                        </div>
                        <div style={{ fontSize: '12.5px', color: isSelected ? '#93c5fd' : 'var(--text-secondary)' }}>
                          {role.description}
                        </div>
                      </div>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: isSelected ? '5px solid #00f2fe' : '2px solid rgba(255, 255, 255, 0.2)',
                          backgroundColor: isSelected ? '#08090b' : 'transparent',
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Work Types Tag Selection */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  What client services do you provide? (Select all that apply)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {WORK_TYPES.map((type) => {
                    const active = selectedTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleWorkType(type)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '12.5px',
                          fontWeight: 500,
                          backgroundColor: active ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                          border: active ? '1px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.1)',
                          color: active ? '#00f2fe' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '13.5px' }}
                >
                  ← Back
                </button>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '13.5px' }}
                  >
                    Skip
                  </button>
                  <Button variant="primary" size="md" onClick={() => setStep(3)} style={{ backgroundColor: 'var(--cobalt)' }}>
                    Continue →
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: YOUR WORKSPACE */}
          {step === 3 && (
            <div style={{ textAlign: 'left', maxWidth: '540px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                  Name your client workspace
                </h1>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
                  This will be the home for your client terms, scopes, and immutable reviews.
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label
                  htmlFor="workspace-name"
                  style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}
                >
                  Workspace Name
                </label>
                <input
                  id="workspace-name"
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="e.g. Northlight Studio"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#00f2fe')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)')}
                />
                <span style={{ display: 'block', marginTop: '6px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  You can change this anytime from your workspace settings.
                </span>
              </div>

              {/* Navigation controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '13.5px' }}
                >
                  ← Back
                </button>
                <Button variant="primary" size="md" onClick={() => setStep(4)} style={{ backgroundColor: 'var(--cobalt)' }}>
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: GET SYNTAFLOW DESKTOP */}
          {step === 4 && (
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                Get Syntaflow for Desktop
              </h1>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 2rem' }}>
                Syntaflow is a high-speed, local-first desktop application. Your work is saved locally in an encrypted SQLite database.
              </p>

              {/* Windows Platform Card */}
              <div
                style={{
                  padding: '2rem',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(17, 20, 26, 0.85)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  boxShadow: '0 0 35px rgba(0, 242, 254, 0.08)',
                  maxWidth: '520px',
                  margin: '0 auto 2rem',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(0, 242, 254, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 0 15px rgba(0, 242, 254, 0.2)',
                      }}
                    >
                      <img
                        src="/brand/LogoIcon_WBG.png"
                        alt="Syntaflow Logo"
                        style={{
                          width: '28px',
                          height: '28px',
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 2px 8px rgba(0, 242, 254, 0.45))',
                        }}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff' }}>Syntaflow for Windows</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Windows 10 / 11 x64 · 84 MB</div>
                    </div>
                  </div>

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
                    }}
                  >
                    Preview
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  Includes the Operator Cockpit, Blueprint Scoping Studio, Typographic Paper Canvas, and native DPAPI Vault.
                </p>

                <a
                  href="/download"
                  onClick={() => setDownloadInitiated(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--cobalt)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '14px',
                    textDecoration: 'none',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download Syntaflow (.exe)</span>
                </a>

                {downloadInitiated && (
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#34d399', textAlign: 'center' }}>
                    ✓ Download started. Run the installer when complete.
                  </div>
                )}
              </div>

              {/* Navigation controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '520px', margin: '0 auto' }}>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '13.5px' }}
                >
                  ← Back
                </button>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '13.5px' }}
                  >
                    I'll do this later
                  </button>
                  <Button variant="primary" size="md" onClick={() => setStep(5)} style={{ backgroundColor: 'var(--cobalt)' }}>
                    Continue →
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: READY & COMPLETE */}
          {step === 5 && (
            <div style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34d399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  margin: '0 auto 1.5rem',
                }}
              >
                ✓
              </div>

              <h1 style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                You're all set.
              </h1>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                Your account is verified and your workspace <strong>{workspaceName}</strong> is prepared. You can now explore your account portal or launch the desktop application.
              </p>

              {/* Checklist */}
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  textAlign: 'left',
                  marginBottom: '2rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '13.5px' }}>
                  <span style={{ color: '#34d399' }}>✓</span>
                  <span>Syntaflow account established</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', fontSize: '13.5px' }}>
                  <span style={{ color: '#34d399' }}>✓</span>
                  <span>Workspace <strong>{workspaceName}</strong> configured</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
                  <span style={{ color: '#34d399' }}>✓</span>
                  <span>Free Desktop Preview license unlocked</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleComplete}
                  style={{ width: '100%', backgroundColor: 'var(--cobalt)', borderRadius: '8px', fontSize: '15px' }}
                >
                  Open Account Portal →
                </Button>

                <a
                  href="/docs"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    padding: '8px',
                  }}
                >
                  Explore Documentation ↗
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
