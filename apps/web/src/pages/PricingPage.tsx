import React from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Link } from '../components/ui/Link';
import { PRICING_TIERS, PRICING_FAQ } from '../content/pricingConfig';

export const PricingPage: React.FC = () => {
  return (
    <div style={{ paddingBottom: '5rem', fontFamily: 'var(--font-sans, -apple-system, sans-serif)' }}>
      <SEOHead path="/pricing" />

      {/* Header */}
      <section style={{ paddingTop: '4rem', paddingBottom: '2.5rem', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(0, 242, 254, 0.08)',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              marginBottom: '1.25rem',
            }}
          >
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
              TRANSPARENT COMMERCIAL STRUCTURE
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.25rem)', fontWeight: 700, letterSpacing: '-0.03em', color: '#ffffff', marginBottom: '1rem' }}>
            Simple, honest pricing.
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto' }}>
            Syntaflow is currently <strong>100% free during the Desktop Preview</strong>. No forced subscriptions, no artificial lock-in, and your data stays on your machine forever.
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
              gap: '1.5rem',
              alignItems: 'stretch',
              marginBottom: '4rem',
            }}
          >
            {PRICING_TIERS.map((tier) => {
              const isPreview = tier.id === 'preview';
              return (
                <div
                  key={tier.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '2.25rem',
                    borderRadius: '16px',
                    backgroundColor: isPreview ? 'rgba(17, 20, 26, 0.95)' : 'rgba(17, 20, 26, 0.6)',
                    border: isPreview ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isPreview ? '0 16px 40px rgba(0, 242, 254, 0.08)' : 'none',
                    position: 'relative',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: '12px',
                          backgroundColor: isPreview ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                          color: isPreview ? '#00f2fe' : 'var(--text-tertiary)',
                          fontSize: '11px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {tier.badge}
                      </span>
                    </div>

                    <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.5rem 0' }}>
                      {tier.name}
                    </h2>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff' }}>{tier.priceLabel}</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>/ {tier.periodLabel}</span>
                    </div>

                    <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.75rem' }}>
                      {tier.description}
                    </p>

                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem', marginBottom: '1.75rem' }}>
                      <div style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                        Includes:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {tier.features.map((feature, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                            <span style={{ color: isPreview ? '#00f2fe' : 'var(--text-tertiary)' }}>✓</span>
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
                          borderRadius: '8px',
                          backgroundColor: 'var(--cobalt)',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        Get Free Preview →
                      </Link>
                    ) : (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '12px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          color: 'var(--text-tertiary)',
                          fontSize: '13px',
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
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', textAlign: 'center', marginBottom: '2rem' }}>
              Pricing FAQ
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {PRICING_FAQ.map((faq, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(17, 20, 26, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem' }}>
                    {faq.question}
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
