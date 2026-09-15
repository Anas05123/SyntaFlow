import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { PageHero } from '../components/marketing/PageHero';
import { Container } from '../components/ui/Container';
import { ContactForm } from '../components/forms/ContactForm';
import { Card } from '../components/ui/Card';

export const ContactPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Contact Syntaflow — Engineering & Operations Team"
        description="Direct communication channels for product feedback, agency partnership inquiries, and responsible security disclosures."
      />

      <PageHero
        eyebrow="Company"
        title="Get in touch with our team."
        description="Whether you have questions about desktop architecture, want to test an enterprise workflow, or need to report a security finding, we respond directly."
      />

      <section className="sf-section">
        <Container>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr',
              gap: 'var(--space-12)',
              alignItems: 'flex-start',
            }}
            className="sf-grid-2"
          >
            {/* Left: Contact Form */}
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--fs-h3)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                Send a Message
              </h2>
              <ContactForm />
            </div>

            {/* Right: Direct Inquiries & Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <Card padding="md">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 600, marginBottom: '0.25rem' }}>
                  GENERAL & PRODUCT
                </div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                  contact@syntaflow.tech
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  For general questions, release feedback, and feature requests.
                </p>
              </Card>

              <Card padding="md">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cobalt-hover)', fontWeight: 600, marginBottom: '0.25rem' }}>
                  SECURITY & DISCLOSURE
                </div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                  security@syntaflow.tech
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  Dedicated channel for vulnerability reporting and coordinated disclosures. 48-hour response target.
                </p>
              </Card>

              <Card padding="md">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-status-active)', fontWeight: 600, marginBottom: '0.25rem' }}>
                  PARTNERSHIPS & PRESS
                </div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                  press@syntaflow.tech
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  For press inquiries, brand assets, and technology ecosystem collaborations.
                </p>
              </Card>

              <div
                style={{
                  padding: 'var(--space-4)',
                  backgroundColor: 'rgba(8, 11, 15, 0.5)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-tertiary)',
                  lineHeight: '1.5',
                }}
              >
                Official Domain: <span style={{ color: 'var(--color-text-primary)' }}>syntaflow.tech</span> • Registered Software Identity: Syntaflow
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};
