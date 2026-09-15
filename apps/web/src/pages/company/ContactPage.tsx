import React, { useState } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    reason: 'general',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in your name, email address, and message.');
      return;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <div>
      <SEOHead
        title="Contact Us — Syntaflow"
        description="Get in touch with the Syntaflow team for inquiries, desktop preview feedback, and security disclosures."
        path="/contact"
      />

      <PageHero
        eyebrow="Company // Contact"
        title="Get in touch with our team."
        description="Have a question about the desktop preview, want to report a security issue, or want to share feedback on our architecture? Reach out directly."
      />

      <section className="section">
        <div className="container" style={{ maxWidth: '840px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-32)' }}>
            {/* Form Column */}
            <Card variant="default" style={{ padding: 'var(--space-32)' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-32) 0' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--active-subtle)',
                      color: 'var(--active)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto var(--space-16) auto',
                      fontSize: '20px',
                    }}
                  >
                    ✓
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-8)' }}>
                    Message Prepared
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-20)' }}>
                    Thank you for reaching out. In this static preview build, please forward your message directly to{' '}
                    <a href="mailto:contact@syntaflow.tech" style={{ color: 'var(--cyan)' }}>
                      contact@syntaflow.tech
                    </a>.
                  </p>
                  <Button variant="secondary" onClick={() => setSubmitted(false)} size="sm">
                    Submit Another Inquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
                  {error && (
                    <div
                      style={{
                        padding: '10px 14px',
                        backgroundColor: 'var(--risk-subtle)',
                        border: '1px solid rgba(214, 90, 90, 0.4)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--risk)',
                        fontSize: '13px',
                      }}
                    >
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="name" style={{ display: 'block', fontSize: '13px', fontWeight: 550, color: 'var(--text)', marginBottom: '6px' }}>
                      Your Name <span style={{ color: 'var(--risk)' }}>*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: 'var(--surface-subtle)',
                        border: '1px solid var(--edge)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text)',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" style={{ display: 'block', fontSize: '13px', fontWeight: 550, color: 'var(--text)', marginBottom: '6px' }}>
                      Email Address <span style={{ color: 'var(--risk)' }}>*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@studio.com"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: 'var(--surface-subtle)',
                        border: '1px solid var(--edge)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text)',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="company" style={{ display: 'block', fontSize: '13px', fontWeight: 550, color: 'var(--text)', marginBottom: '6px' }}>
                      Organization / Practice (Optional)
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Acme Design Co."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: 'var(--surface-subtle)',
                        border: '1px solid var(--edge)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text)',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="reason" style={{ display: 'block', fontSize: '13px', fontWeight: 550, color: 'var(--text)', marginBottom: '6px' }}>
                      Inquiry Topic
                    </label>
                    <select
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: 'var(--surface-subtle)',
                        border: '1px solid var(--edge)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text)',
                        fontSize: '14px',
                      }}
                    >
                      <option value="general">General Inquiry</option>
                      <option value="feedback">Desktop Preview Feedback</option>
                      <option value="security">Security / Vulnerability Disclosure</option>
                      <option value="partnership">Studio / Commercial Partnership</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" style={{ display: 'block', fontSize: '13px', fontWeight: 550, color: 'var(--text)', marginBottom: '6px' }}>
                      Message <span style={{ color: 'var(--risk)' }}>*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what you're working on or how we can help..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        backgroundColor: 'var(--surface-subtle)',
                        border: '1px solid var(--edge)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text)',
                        fontSize: '14px',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  <Button type="submit" variant="primary" style={{ marginTop: 'var(--space-8)' }}>
                    Send Message
                  </Button>
                </form>
              )}
            </Card>

            {/* Direct Channels Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-20)' }}>
              <Card variant="subtle" style={{ padding: 'var(--space-24)' }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  DIRECT CHANNELS
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                  Electronic Mail
                </h4>
                <div style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  General Inquiries:{' '}
                  <a href="mailto:contact@syntaflow.tech" style={{ color: 'var(--cyan)' }}>
                    contact@syntaflow.tech
                  </a>
                  <br />
                  Security Disclosures:{' '}
                  <a href="mailto:security@syntaflow.tech" style={{ color: 'var(--cyan)' }}>
                    security@syntaflow.tech
                  </a>
                </div>
              </Card>

              <Card variant="subtle" style={{ padding: 'var(--space-24)' }}>
                <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-metadata)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  OPERATIONAL LOCATION
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                  Domain Identity
                </h4>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Syntaflow operations operate under the verified domain <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>syntaflow.tech</code>.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
