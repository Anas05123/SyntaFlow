import React, { useState } from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Link } from '../components/ui/Link';
import { PRICING_TIERS, PRICING_FAQ } from '../content/pricingConfig';

export const PricingPage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div style={{ paddingBottom: '6rem', fontFamily: 'var(--font-body)', backgroundColor: 'var(--canvas)', color: 'var(--text)' }}>
      <SEOHead path="/pricing" />

      {/* Header */}
      <section style={{ paddingTop: 'clamp(3.5rem, 6vw, 5rem)', paddingBottom: 'clamp(2.5rem, 5vw, 3.5rem)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <div className="editorial-eyebrow" style={{ marginBottom: '1.5rem' }}>
            <span className="dot" />
            <span>TRANSPARENT COMMERCIAL STRUCTURE</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: 700,
              letterSpacing: '-0.035em',
              color: 'var(--text)',
              lineHeight: 1.1,
              marginBottom: '1.25rem',
            }}
          >
            Simple, honest pricing.
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.62, maxWidth: '680px', margin: '0 auto' }}>
            Syntaflow is currently <strong>100% free during the Desktop Preview ($0)</strong>. No forced subscriptions, no artificial lock-in, and your client records stay on your physical machine forever.
          </p>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section style={{ paddingBottom: '4rem' }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
              alignItems: 'stretch',
              marginBottom: '4.5rem',
            }}
          >
            {PRICING_TIERS.map((tier) => {
              const isPreview = tier.id === 'preview';
              return (
                <div
                  key={tier.id}
                  className="paper-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '2.5rem 2.25rem',
                    borderRadius: 'var(--radius-card)',
                    backgroundColor: 'var(--surface)',
                    border: isPreview ? '2px solid var(--cobalt)' : '1px solid var(--border)',
                    boxShadow: isPreview ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                    position: 'relative',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span
                        className={isPreview ? 'status-chip status-chip-cobalt' : 'status-chip'}
                        style={{
                          backgroundColor: isPreview ? 'var(--cobalt-subtle)' : 'var(--surface-subtle)',
                          color: isPreview ? 'var(--cobalt)' : 'var(--text-metadata)',
                        }}
                      >
                        {tier.badge}
                      </span>
                    </div>

                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 0.5rem 0' }}>
                      {tier.name}
                    </h2>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1rem' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)' }}>
                        {tier.priceLabel}
                      </span>
                      <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>/ {tier.periodLabel}</span>
                    </div>

                    <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '1.75rem' }}>
                      {tier.description}
                    </p>

                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                      <div style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                        Includes:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {tier.features.map((feature, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text)', lineHeight: 1.4 }}>
                            <span style={{ color: isPreview ? 'var(--cobalt)' : 'var(--text-tertiary)', fontWeight: 700 }}>✓</span>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    {isPreview ? (
                      <Link
                        href="/login"
                        style={{
                          display: 'block',
                          textAlign: 'center',
                          padding: '12px',
                          borderRadius: 'var(--radius-button)',
                          backgroundColor: 'var(--cobalt)',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: 600,
                          textDecoration: 'none',
                          boxShadow: '0 2px 8px rgba(47, 107, 250, 0.25)',
                        }}
                      >
                        Get Free Preview →
                      </Link>
                    ) : (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '12px',
                          borderRadius: 'var(--radius-button)',
                          backgroundColor: 'var(--surface-subtle)',
                          color: 'var(--text-tertiary)',
                          fontSize: '13px',
                          border: '1px solid var(--border)',
                        }}
                      >
                        Announced before GA
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing FAQ */}
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.85rem',
                fontWeight: 700,
                color: 'var(--text)',
                textAlign: 'center',
                marginBottom: '2rem',
                letterSpacing: '-0.025em',
              }}
            >
              Pricing FAQ
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PRICING_FAQ.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="paper-card"
                    style={{
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      style={{
                        width: '100%',
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text)',
                        fontSize: '15px',
                        fontWeight: 600,
                        textAlign: 'left',
                      }}
                    >
                      <span>{faq.question}</span>
                      <span style={{ color: 'var(--cobalt)', fontSize: '18px', marginLeft: '1rem', fontWeight: 700 }}>
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>

                    {isOpen && (
                      <div style={{ padding: '0 1.5rem 1.25rem', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
