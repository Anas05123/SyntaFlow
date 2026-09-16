import React, { useState } from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Link } from '../components/ui/Link';
import { INTEGRATIONS_LIST, type IntegrationMeta } from '../content/integrationsData';
import { Card } from '../components/ui/Card';
import { ServiceLogo } from '../components/brand/ServiceLogos';

type IntegrationCategory = IntegrationMeta['category'];

export const IntegrationsCatalogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<IntegrationCategory | 'All'>('All');
  const [activeModal, setActiveModal] = useState<IntegrationMeta | null>(null);

  const categories: (IntegrationCategory | 'All')[] = [
    'All',
    'Communication',
    'Calendar',
    'Files',
    'Development',
    'Design',
    'Knowledge',
  ];

  const filteredIntegrations =
    selectedCategory === 'All'
      ? INTEGRATIONS_LIST
      : INTEGRATIONS_LIST.filter((item) => item.category === selectedCategory);

  return (
    <div style={{ paddingBottom: 'var(--space-64)' }}>
      <SEOHead path="/integrations" />

      {/* Header */}
      <section className="section" style={{ paddingTop: 'var(--space-48)', paddingBottom: 'var(--space-24)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: 'var(--space-12)' }}>
            <Link href="/" style={{ fontSize: '12.5px', color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/</span>
            <span style={{ fontSize: '12.5px', color: 'var(--cyan)', fontWeight: 500 }}>Integrations</span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '100px', backgroundColor: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.25)', marginBottom: 'var(--space-16)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              EXTERNAL TOOLS // CONNECTED CLIENT WORKSPACE
            </span>
          </div>

          <h1 className="heading-1" style={{ fontSize: 'clamp(32px, 5vw, 46px)', color: 'var(--text)', marginBottom: 'var(--space-16)', letterSpacing: '-0.02em' }}>
            Your tools. One working context.
          </h1>

          <p style={{ fontSize: '17px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto' }}>
            Syntaflow connects external email, calendars, cloud storage, repositories, and issue trackers directly into the active client engagement without data centralization or secret leakage.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="section" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-24)' }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontFamily: 'var(--font-mono)',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: active ? 'var(--cyan)' : 'var(--border)',
                    backgroundColor: active ? 'rgba(6, 182, 212, 0.12)' : 'var(--surface-sunken)',
                    color: active ? 'var(--cyan)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section" style={{ paddingTop: 'var(--space-8)' }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 'var(--space-20)',
            }}
          >
            {filteredIntegrations.map((item) => {
              const isAvailable = item.status === 'AVAILABLE';
              const isTest = item.status === 'TEST';
              const badgeColor = isAvailable ? '#10B981' : isTest ? 'var(--cyan)' : 'var(--text-muted)';
              const badgeBg = isAvailable ? 'rgba(16, 185, 129, 0.12)' : isTest ? 'rgba(6, 182, 212, 0.12)' : 'var(--surface-sunken)';

              return (
                <Card
                  key={item.id}
                  variant="default"
                  style={{
                    padding: 'var(--space-24)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '210px',
                    transition: 'border-color 0.15s ease, transform 0.15s ease',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-16)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <ServiceLogo name={item.id} size={22} />
                        </div>
                        <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                          {item.name}
                        </h3>
                      </div>
                      <span
                        style={{
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: badgeBg,
                          color: badgeColor,
                          border: `1px solid ${badgeColor}33`,
                          letterSpacing: '0.04em',
                        }}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0, marginBottom: 'var(--space-16)' }}>
                      {item.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-12)' }}>
                    <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {item.category}
                    </span>

                    {item.dedicatedPage ? (
                      <Link
                        href={item.dedicatedPage}
                        style={{
                          fontSize: '12.5px',
                          color: 'var(--cyan)',
                          textDecoration: 'none',
                          fontWeight: 500,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        Explore Integration &rarr;
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveModal(item)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          fontSize: '12px',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                        }}
                      >
                        View Scopes &rarr;
                      </button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust & Governance Summary Banner */}
      <section className="section" style={{ paddingTop: 'var(--space-36)' }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <Card variant="raised" style={{ padding: 'var(--space-28)', backgroundColor: 'var(--surface-raised)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-24)', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  DATA GOVERNANCE & INTEGRATION INTEGRITY
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: 600, color: 'var(--text)', margin: '0 0 8px 0' }}>
                  Local Credentials. Zero Cloud Intermediary.
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  OAuth tokens and API credentials are saved exclusively in your operating system keychain (Windows DPAPI, macOS Keychain). Third-party data is retrieved ephemerally on demand and never sold, shared, or used to train public models.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link href="/privacy" style={{ fontSize: '13.5px', color: 'var(--cyan)', textDecoration: 'none' }}>
                  &rarr; Read Official Privacy Policy & Google User Data Disclosures
                </Link>
                <Link href="/security" style={{ fontSize: '13.5px', color: 'var(--cyan)', textDecoration: 'none' }}>
                  &rarr; Inspect Local-First Security Architecture
                </Link>
                <Link href="/contact" style={{ fontSize: '13.5px', color: 'var(--cyan)', textDecoration: 'none' }}>
                  &rarr; Contact Security & Compliance Team
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Integration Detail Modal */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveModal(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--surface-raised)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              maxWidth: '640px',
              width: '100%',
              padding: 'var(--space-32)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-16)' }}>
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase' }}>
                  {activeModal.category} // {activeModal.status}
                </span>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text)', marginTop: '4px', margin: 0 }}>
                  {activeModal.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-20)' }}>
              {activeModal.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-16)' }}>
              <div>
                <h4 style={{ fontSize: '12.5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text)', marginBottom: '6px' }}>
                  Data Accessed
                </h4>
                <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13.5px', color: 'var(--text-muted)' }}>
                  {activeModal.dataAccessed.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>

              {activeModal.scopes && activeModal.scopes.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '12.5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text)', marginBottom: '6px' }}>
                    Requested OAuth Scopes
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {activeModal.scopes.map((s) => (
                      <code key={s} style={{ fontSize: '11.5px', padding: '4px 8px', backgroundColor: 'var(--surface-sunken)', borderRadius: '4px', color: 'var(--cyan)' }}>
                        {s}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ padding: '12px', backgroundColor: 'rgba(37, 99, 235, 0.08)', borderRadius: '6px', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                <h4 style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: '#60A5FA', margin: '0 0 4px 0' }}>
                  Privacy & Limited Use Commitment
                </h4>
                <p style={{ fontSize: '12.5px', color: '#CBD5E1', lineHeight: 1.5, margin: 0 }}>
                  {activeModal.inAppPrivacyNote}
                </p>
              </div>

              <div style={{ textAlign: 'right', marginTop: 'var(--space-8)' }}>
                <Link href="/privacy" style={{ fontSize: '12.5px', color: 'var(--cyan)', textDecoration: 'underline' }}>
                  Read full Google User Data & Privacy Policy &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
