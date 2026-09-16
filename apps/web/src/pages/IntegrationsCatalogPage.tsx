import React, { useState } from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Card } from '../components/ui/Card';
import { INTEGRATIONS_LIST, type IntegrationMeta } from '../content/integrationsData';

export const IntegrationsCatalogPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [activeModal, setActiveModal] = useState<IntegrationMeta | null>(null);

  const categories = ['ALL', 'Communication', 'Calendar', 'Files', 'Development', 'Design', 'Knowledge'];

  const filtered = selectedFilter === 'ALL'
    ? INTEGRATIONS_LIST
    : INTEGRATIONS_LIST.filter((i) => i.category === selectedFilter);

  return (
    <div style={{ paddingBottom: 'var(--space-64)' }}>
      <SEOHead
        title="Integrations Catalog — Syntaflow"
        description="Explore supported tools connected to the Syntaflow client engagement environment: Gmail, Google Calendar, Google Drive, GitHub, Figma, Notion, Slack, and Linear."
        path="/integrations"
      />

      {/* Header */}
      <section className="section" style={{ paddingTop: 'var(--space-48)', paddingBottom: 'var(--space-24)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '100px', backgroundColor: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.25)', marginBottom: 'var(--space-16)' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              EXTERNAL TOOLS // ONE WORKING CONTEXT
            </span>
          </div>

          <h1 className="heading-1" style={{ fontSize: 'clamp(32px, 5vw, 46px)', color: 'var(--text)', marginBottom: 'var(--space-16)' }}>
            Your tools. Connected to the engagement.
          </h1>

          <p style={{ fontSize: '17px', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto' }}>
            Syntaflow integrates external communications, calendars, storage, and tickets directly into the client record without centralizing or compromising your credentials.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="section" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-24)' }}>
        <div className="container" style={{ maxWidth: '1120px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {categories.map((cat) => {
              const active = selectedFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedFilter(cat)}
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
            {filtered.map((item) => {
              const isAvailable = item.status === 'AVAILABLE';
              const isTest = item.status === 'TEST';
              const badgeColor = isAvailable ? '#10B981' : isTest ? 'var(--cyan)' : 'var(--text-muted)';
              const badgeBg = isAvailable ? 'rgba(16, 185, 129, 0.12)' : isTest ? 'rgba(6, 182, 212, 0.12)' : 'var(--surface-sunken)';

              return (
                <Card
                  key={item.id}
                  variant="default"
                  onClick={() => setActiveModal(item)}
                  style={{
                    padding: 'var(--space-24)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '180px',
                    transition: 'border-color 0.15s ease, transform 0.15s ease',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-12)' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                        {item.name}
                      </h3>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: badgeBg,
                          color: badgeColor,
                          border: `1px solid ${badgeColor}33`,
                        }}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0, marginBottom: 'var(--space-16)' }}>
                      {item.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-12)' }}>
                    <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--cyan)' }}>
                      Inspect scopes & privacy &rarr;
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
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
                <a href="#/privacy" style={{ fontSize: '12.5px', color: 'var(--cyan)', textDecoration: 'underline' }}>
                  Read full Google User Data & Privacy Policy &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
