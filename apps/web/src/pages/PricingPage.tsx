import React, { useState } from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { Container } from '../components/ui/Container';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Accordion } from '../components/ui/Accordion';
import { EngagementCostCalculator } from '../components/pricing/EngagementCostCalculator';
import { PRICING_TIERS, FEATURE_COMPARISON, PRICING_FAQS } from '../content/pricingData';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly' | 'perpetual'>('annual');

  return (
    <>
      <SEOHead
        title="Pricing & Economic Model — Software You Actually Own"
        description="Transparent, anti-hype pricing for Syntaflow. Free during public preview. Zero per-seat penalties on client reviewers. Local SQLite sovereignty."
      />

      {/* Hero Section */}
      <section className="sf-section" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-12)' }}>
        <Container>
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.3125rem 0.875rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-cobalt-subtle)',
                border: '1px solid rgba(37, 99, 235, 0.3)',
                color: '#60A5FA',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-4)',
              }}
            >
              <span>●</span> Transparent Economic Architecture
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--fs-h1)',
                lineHeight: 'var(--lh-h1)',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.025em',
                marginBottom: 'var(--space-4)',
              }}
            >
              Software you actually own. No per-seat tax on growth.
            </h1>

            <p
              style={{
                fontSize: 'var(--fs-body-lg)',
                lineHeight: 'var(--lh-body-lg)',
                color: 'var(--color-text-secondary)',
                maxWidth: '680px',
                margin: '0 auto var(--space-8) auto',
              }}
            >
              Most project management software penalizes you for hiring contractors and charging client retainers. Syntaflow runs on your physical hardware. Pay once or pay a flat studio fee — zero per-seat extortion.
            </p>

            {/* Billing Cycle Toggle */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                gap: '0.25rem',
              }}
            >
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                style={{
                  padding: '0.375rem 0.875rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: billingCycle === 'annual' ? 'var(--color-cobalt)' : 'transparent',
                  color: billingCycle === 'annual' ? '#FFFFFF' : 'var(--color-text-secondary)',
                  border: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Annual Billing (Save 20%)
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                style={{
                  padding: '0.375rem 0.875rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: billingCycle === 'monthly' ? 'var(--color-cobalt)' : 'transparent',
                  color: billingCycle === 'monthly' ? '#FFFFFF' : 'var(--color-text-secondary)',
                  border: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Monthly Billing
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle('perpetual')}
                style={{
                  padding: '0.375rem 0.875rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: billingCycle === 'perpetual' ? 'var(--color-cobalt)' : 'transparent',
                  color: billingCycle === 'perpetual' ? '#FFFFFF' : 'var(--color-text-secondary)',
                  border: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Perpetual License
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Pricing Cards */}
      <section style={{ paddingBottom: 'var(--space-16)' }}>
        <Container>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
            {PRICING_TIERS.map((tier) => {
              let displayPrice = `$${tier.pricePerpetual}`;
              let periodLabel = 'perpetual license';

              if (tier.id === 'studio') {
                if (billingCycle === 'annual') {
                  displayPrice = `$${tier.priceAnnualMonthly}`;
                  periodLabel = '/ seat / month (billed annually)';
                } else if (billingCycle === 'monthly') {
                  displayPrice = `$${tier.priceMonthly}`;
                  periodLabel = '/ seat / month';
                } else {
                  displayPrice = `$${tier.pricePerpetual}`;
                  periodLabel = 'perpetual license + $79/yr updates';
                }
              } else if (tier.id === 'enclave') {
                displayPrice = `$${tier.pricePerpetual}`;
                periodLabel = 'one-time studio buyout';
              }

              return (
                <Card
                  key={tier.id}
                  padding="lg"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: tier.highlighted ? '2px solid var(--color-cobalt)' : '1px solid var(--color-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                  }}
                >
                  {tier.badge && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '24px',
                        padding: '0.25rem 0.625rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-cobalt)',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {tier.badge}
                    </div>
                  )}

                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
                      {tier.name}
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '0.25rem' }}>
                      {tier.tagline}
                    </h3>

                    {/* Pricing Box */}
                    <div style={{ margin: 'var(--space-4) 0' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                          {displayPrice}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                          {periodLabel}
                        </span>
                      </div>

                      {tier.previewNotice && (
                        <div
                          style={{
                            display: 'inline-block',
                            marginTop: '0.5rem',
                            padding: '0.25rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--color-status-active-bg)',
                            border: '1px solid rgba(63, 166, 107, 0.3)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            color: 'var(--color-status-active)',
                          }}
                        >
                          {tier.previewNotice}
                        </div>
                      )}
                    </div>

                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-6)' }}>
                      {tier.description}
                    </p>

                    {/* Features List */}
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {tier.features.map((feat, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                          <span style={{ color: 'var(--color-cobalt)', fontWeight: 700 }}>✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ marginTop: 'var(--space-8)' }}>
                    <Button
                      href={tier.ctaHref}
                      variant={tier.highlighted ? 'primary' : 'secondary'}
                      size="md"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {tier.ctaText}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Interactive Tool Consolidation Calculator */}
      <section style={{ paddingBottom: 'var(--space-24)' }}>
        <Container>
          <EngagementCostCalculator />
        </Container>
      </section>

      {/* Deep Feature Comparison Table */}
      <section style={{ paddingBottom: 'var(--space-24)' }}>
        <Container>
          <SectionHeading
            eyebrow="DETAILED SPECIFICATION"
            title="Complete Capability Matrix"
            description="Clear, honest feature breakdown. Every tier includes 100% offline capability and full local SQLite sovereignty."
            align="center"
          />

          <div style={{ marginTop: 'var(--space-8)', overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.875rem',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
              }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-raised)' }}>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Capability</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', width: '20%' }}>Solo Practitioner</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', width: '20%' }}>Studio Team</th>
                  <th style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', width: '20%' }}>Studio Enclave</th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_COMPARISON.map((group, groupIdx) => (
                  <React.Fragment key={groupIdx}>
                    <tr style={{ backgroundColor: 'var(--color-surface-raised)', borderTop: groupIdx > 0 ? '1px solid var(--color-border)' : 'none' }}>
                      <td colSpan={4} style={{ padding: '0.75rem 1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-cyan)', textTransform: 'uppercase' }}>
                        {group.category}
                      </td>
                    </tr>
                    {group.items.map((item, itemIdx) => (
                      <tr key={itemIdx} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '0.875rem 1.25rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                          {item.name}
                        </td>
                        <td style={{ padding: '0.875rem 1.25rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                          {item.solo === true ? <span style={{ color: 'var(--color-status-active)' }}>✓ Included</span> : item.solo === false ? <span style={{ color: 'var(--color-text-disabled)' }}>—</span> : item.solo}
                        </td>
                        <td style={{ padding: '0.875rem 1.25rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                          {item.studio === true ? <span style={{ color: 'var(--color-status-active)' }}>✓ Included</span> : item.studio === false ? <span style={{ color: 'var(--color-text-disabled)' }}>—</span> : item.studio}
                        </td>
                        <td style={{ padding: '0.875rem 1.25rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                          {item.enclave === true ? <span style={{ color: 'var(--color-status-active)' }}>✓ Included</span> : item.enclave === false ? <span style={{ color: 'var(--color-text-disabled)' }}>—</span> : item.enclave}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* Transparent Pricing FAQ */}
      <section style={{ paddingBottom: 'var(--space-24)' }}>
        <Container>
          <SectionHeading
            eyebrow="DIRECT ANSWERS"
            title="Frequently Asked Questions About Pricing"
            description="Honest answers to the hard questions about licenses, client access, and local data rights."
            align="center"
          />

          <div style={{ maxWidth: '800px', margin: 'var(--space-8) auto 0 auto' }}>
            <Accordion
              items={PRICING_FAQS.map((faq, index) => ({
                id: `pricing-faq-${index}`,
                title: faq.question,
                content: <p style={{ margin: 0, lineHeight: 1.6, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{faq.answer}</p>,
              }))}
            />
          </div>
        </Container>
      </section>
    </>
  );
};
