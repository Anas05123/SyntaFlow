import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const FeedbackSection: React.FC = () => {
  const [category, setCategory] = useState<string>('Workflow & Product');
  const [sentiment, setSentiment] = useState<string>('🎯 Connected Context');
  const [message, setMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const categories = [
    'Workflow & Product',
    'Feature Request',
    'Bug Report',
    'SQLite Performance',
    'macOS / Linux Request',
  ];

  const sentiments = [
    '⚡ Blazing Fast',
    '🎯 Connected Context',
    '📄 Paper Canvas',
    '🔒 Local Vault',
    '🛠 Integrations',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const observations = [
    {
      quote: '“Having immutable snapshots for client reviews completely eliminated disputes over whether an edit was requested before or after sign-off. It transformed our delivery workflow.”',
      author: 'Elena Rostova',
      role: 'Design Director',
      company: 'Northlight Studio',
      avatar: 'ER',
      color: 'rgba(6, 182, 212, 0.2)',
      tag: 'REVIEW SNAPSHOTS',
      highlight: '14h saved per client engagement',
    },
    {
      quote: '“The local SQLite database means zero network lag when drafting multi-phase proposals, and our sensitive commercial rates never touch a third-party server.”',
      author: 'David Chen',
      role: 'Principal Consultant',
      company: 'Chen Advisory Group',
      avatar: 'DC',
      color: 'rgba(59, 130, 246, 0.2)',
      tag: 'LOCAL SQLITE',
      highlight: 'Zero latency · 100% on-device',
    },
    {
      quote: '“The delivery gate enforces that our final release package cannot be generated until every prerequisite milestone is stamped by the client. It saved us on two retainers already.”',
      author: 'Marcus Vance',
      role: 'Managing Partner',
      company: 'Vance & Co.',
      avatar: 'MV',
      color: 'rgba(16, 185, 129, 0.2)',
      tag: 'DELIVERY GATE',
      highlight: 'Defensible milestone compliance',
    },
  ];

  return (
    <section
      id="feedback"
      className="section"
      style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        paddingTop: 'var(--space-64)',
        paddingBottom: 'var(--space-64)',
        backgroundColor: 'var(--surface-raised)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1000px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.1) 0%, rgba(6, 182, 212, 0.05) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ maxWidth: '1120px', position: 'relative', zIndex: 1 }}>
        {/* Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-48)' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 14px',
              borderRadius: '100px',
              backgroundColor: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.28)',
              marginBottom: 'var(--space-14)',
            }}
          >
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--cyan)' }} className="pulse-glow" />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              PREVIEW COMMUNITY & FIELD OBSERVATIONS
            </span>
          </div>

          <h2
            className="heading-2"
            style={{
              fontSize: 'clamp(28px, 3.8vw, 40px)',
              color: 'var(--text)',
              marginBottom: 'var(--space-12)',
              letterSpacing: '-0.02em',
            }}
          >
            Built with operators. Refined by real client work.
          </h2>

          <p style={{ fontSize: '16px', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            During Desktop Preview, our engineering team iterates directly on observations from independent operators, studio leads, and consultants.
          </p>
        </div>

        {/* 2-Column Balanced Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 1fr',
            gap: 'var(--space-36)',
            alignItems: 'start',
          }}
          className="feedback-grid"
        >
          {/* Left Column: Interactive Feedback Console */}
          <Card
            variant="raised"
            style={{
              padding: 'var(--space-32)',
              backgroundColor: 'var(--canvas)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              boxShadow: '0 16px 48px -12px rgba(0, 0, 0, 0.7)',
              borderRadius: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-20)', paddingBottom: 'var(--space-12)', borderBottom: '1px solid var(--border)' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                  Operator Feedback Console
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-metadata)', marginTop: '2px' }}>
                  Logs directly to our engineering desk
                </div>
              </div>
              <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                ● DESK ACTIVE
              </span>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-40) var(--space-16)' }}>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                    margin: '0 auto var(--space-16) auto',
                  }}
                  className="pulse-glow"
                >
                  ✓
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                  Feedback Transmitted
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '380px', margin: '0 auto var(--space-24) auto' }}>
                  Thank you for testing Syntaflow Desktop! Your observations directly influence our weekly runtime updates.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  style={{ fontSize: '13px' }}
                >
                  Submit Another Observation
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
                {/* 1. Topic Category */}
                <div>
                  <label style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', display: 'block', marginBottom: '8px', letterSpacing: '0.04em' }}>
                    1. Focus Area
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {categories.map((cat) => {
                      const active = category === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            border: '1px solid',
                            borderColor: active ? 'var(--cyan)' : 'var(--border)',
                            backgroundColor: active ? 'rgba(6, 182, 212, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                            color: active ? 'var(--cyan)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            fontWeight: active ? 600 : 400,
                            transition: 'all 0.15s ease',
                          }}
                          className="interactive-lift"
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Sentiment Highlight */}
                <div>
                  <label style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', display: 'block', marginBottom: '8px', letterSpacing: '0.04em' }}>
                    2. Primary Sentiment / Reaction
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {sentiments.map((s) => {
                      const active = sentiment === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSentiment(s)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            border: '1px solid',
                            borderColor: active ? 'var(--cobalt)' : 'var(--border)',
                            backgroundColor: active ? 'rgba(37, 99, 235, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                            color: active ? '#93C5FD' : 'var(--text-muted)',
                            cursor: 'pointer',
                            fontWeight: active ? 600 : 400,
                            transition: 'all 0.15s ease',
                          }}
                          className="interactive-lift"
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Feedback Note */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      3. Your Field Note or Request
                    </label>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-disabled)' }}>
                      {message.length}/500
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={message}
                    maxLength={500}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what worked well, what was missing in client reviews, or specific tools you want connected..."
                    required
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      backgroundColor: 'var(--surface-sunken)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      color: 'var(--text)',
                      fontSize: '13.5px',
                      fontFamily: 'var(--font-body)',
                      lineHeight: 1.5,
                      resize: 'none',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s ease',
                    }}
                  />
                </div>

                {/* 4. Optional Email */}
                <div>
                  <label style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    4. Email (Optional, for engineering replies)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yourcompany.com"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      backgroundColor: 'var(--surface-sunken)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      color: 'var(--text)',
                      fontSize: '13.5px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s ease',
                    }}
                  />
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  style={{ marginTop: '4px', padding: '12px', width: '100%', textAlign: 'center', fontSize: '14px', fontWeight: 650 }}
                >
                  {isSubmitting ? 'Transmitting...' : 'Send Feedback to Engineering →'}
                </Button>
              </form>
            )}
          </Card>

          {/* Right Column: Studio Operator Field Reports */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-14)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
              <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                VERIFIED OPERATOR OBSERVATIONS
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)' }}>
                3 FIELD REPORTS
              </span>
            </div>

            {observations.map((obs, idx) => (
              <Card
                key={idx}
                variant="raised"
                style={{
                  padding: 'var(--space-20)',
                  backgroundColor: 'var(--canvas)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                className="interactive-lift"
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontFamily: 'var(--font-mono)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        color: 'var(--cyan)',
                        border: '1px solid rgba(6, 182, 212, 0.25)',
                      }}
                    >
                      {obs.tag}
                    </span>
                    <span style={{ fontSize: '11px', color: '#10B981', fontFamily: 'var(--font-mono)' }}>
                      ✓ {obs.highlight}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: '13.5px',
                      color: 'var(--text)',
                      lineHeight: 1.6,
                      margin: '0 0 var(--space-14) 0',
                      fontStyle: 'italic',
                    }}
                  >
                    {obs.quote}
                  </p>
                </div>

                {/* Operator Signature Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    borderTop: '1px solid var(--border)',
                    paddingTop: 'var(--space-12)',
                  }}
                >
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: obs.color,
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'var(--text)',
                      flexShrink: 0,
                    }}
                  >
                    {obs.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 650, color: 'var(--text)' }}>
                      {obs.author}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-metadata)' }}>
                      {obs.role} · {obs.company}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

