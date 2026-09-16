import React from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PRICING_PLANS, PRICING_FAQS } from '../content/pricing';

export const PricingPage: React.FC = () => {
  return (
    <div style={{ paddingBottom: 'var(--space-64)' }}>
      <SEOHead
        title="Pricing — Syntaflow"
        description="Transparent pricing for Syntaflow. Free during desktop preview with unconstrained local features. Explore upcoming Pro and Studio tiers."
        path="/pricing"
      />

      {/* Header */}
      <section className="section" style={{ paddingTop: 'var(--space-48)', paddingBottom: 'var(--space-24)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '100px', backgroundColor: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)', marginBottom: 'var(--space-16)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              TRANSPARENT COMMERCIAL STRUCTURE
            </span>
          </div>

          <h1 className="heading-1" style={{ fontSize: 'clamp(32px, 5vw, 46px)', color: 'var(--text)', marginBottom: 'var(--space-16)' }}>
            Simple, honest pricing.
          </h1>

          <p style={{ fontSize: '17px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto' }}>
            Syntaflow is currently <strong>100% free during the Desktop Preview</strong>. No forced subscriptions, no artificial lock-in, and your data stays on your machine forever.
          </p>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="section" style={{ paddingTop: 'var(--space-24)', paddingBottom: 'var(--space-48)' }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-24)',
              alignItems: 'stretch',
            }}
          >
            {PRICING_PLANS.map((plan) => {
              const isHighlight = plan.highlighted;
              return (
                <Card
                  key={plan.id}
                  variant={isHighlight ? 'raised' : 'default'}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: 'var(--space-32)',
                    position: 'relative',
                    borderColor: isHighlight ? 'var(--cyan)' : 'var(--border)',
                    boxShadow: isHighlight ? '0 0 24px -6px rgba(6, 182, 212, 0.15)' : 'none',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-12)' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)' }}>
                        {plan.name}
                      </h3>
                      {plan.badge && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: isHighlight ? 'rgba(6, 182, 212, 0.15)' : 'var(--surface-sunken)',
                            color: isHighlight ? 'var(--cyan)' : 'var(--text-muted)',
                            border: `1px solid ${isHighlight ? 'rgba(6, 182, 212, 0.3)' : 'var(--border)'}`,
                          }}
                        >
                          {plan.badge}
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: 'var(--space-20)', minHeight: '38px', lineHeight: 1.5 }}>
                      {plan.tagline}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: 'var(--space-24)', paddingBottom: 'var(--space-20)', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                          / {plan.period}
                        </span>
                      )}
                    </div>

                    <div style={{ marginBottom: 'var(--space-24)' }}>
                      <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text)', marginBottom: 'var(--space-12)', letterSpacing: '0.04em' }}>
                        Includes:
                      </div>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0, listStyle: 'none' }}>
                        {plan.features.map((feat) => (
                          <li key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: 'var(--text-muted)' }}>
                            <span style={{ color: isHighlight ? 'var(--cyan)' : 'var(--text-muted)', fontSize: '14px', lineHeight: 1.2 }}>✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div style={{ marginTop: 'var(--space-16)' }}>
                    <Button
                      variant={isHighlight ? 'primary' : 'secondary'}
                      href={plan.ctaHref}
                      style={{ width: '100%', textAlign: 'center' }}
                    >
                      {plan.ctaLabel}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing FAQ */}
      <section className="section" style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-48)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-36)' }}>
            <h2 className="heading-2" style={{ fontSize: '26px', color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
              Frequently Asked Questions About Pricing
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
              Direct answers to questions regarding our preview model and future licensing.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
            {PRICING_FAQS.map((faq) => (
              <Card key={faq.question} variant="default" style={{ padding: 'var(--space-24)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                  {faq.question}
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
