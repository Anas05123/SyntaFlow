import React, { useState } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { PageHero } from '../../components/marketing/PageHero';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { getRouteMetadata } from '../../seo/seoConfig';

interface Channel {
  name: string;
  email?: string;
  url?: string;
  purpose: string;
  sla: string;
}

const OFFICIAL_CHANNELS: Channel[] = [
  {
    name: 'General Inquiries & Partnerships',
    email: 'contact@syntaflow.tech',
    purpose: 'General questions, commercial partnerships, and media inquiries.',
    sla: '1-2 business days',
  },
  {
    name: 'Privacy & Data Governance',
    email: 'privacy@syntaflow.tech',
    purpose: 'Inquiries regarding our Privacy Policy, data access requests, or Google API OAuth compliance.',
    sla: 'Within 48 business hours',
  },
  {
    name: 'Security & Vulnerability Disclosures',
    email: 'security@syntaflow.tech',
    purpose: 'Responsible security vulnerability reports and cryptographic inquiries.',
    sla: 'Within 24-48 business hours',
  },
  {
    name: 'Product Support & Assistance',
    email: 'support@syntaflow.tech',
    purpose: 'Desktop application setup, migration assistance, and technical troubleshooting.',
    sla: '1-2 business days',
  },
  {
    name: 'GitHub Issues & Community',
    url: 'https://github.com/syntaflow/syntaflow',
    purpose: 'Public bug tracking, developer discussions, and feature feedback.',
    sla: 'Community / Asynchronous',
  },
];

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    topic: 'contact@syntaflow.tech',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const meta = getRouteMetadata('/contact');

  const getTopicSubject = () => {
    switch (formData.topic) {
      case 'privacy@syntaflow.tech':
        return 'Privacy & Data Governance Inquiry';
      case 'security@syntaflow.tech':
        return 'Security Vulnerability / Disclosure';
      case 'support@syntaflow.tech':
        return 'Desktop Support Inquiry';
      default:
        return 'General Syntaflow Inquiry';
    }
  };

  const getComposedBody = () => {
    return `Name: ${formData.name || 'Not provided'}\nEmail: ${formData.email || 'Not provided'}\nOrganization: ${formData.company || 'Individual'}\n\nMessage:\n${formData.message}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please provide your name, email address, and message.');
      return;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError(null);
    setSubmitted(true);

    // Launch real mailto client with pre-filled content
    const subject = encodeURIComponent(getTopicSubject() + ` - from ${formData.name}`);
    const body = encodeURIComponent(getComposedBody());
    const mailtoUrl = `mailto:${formData.topic}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getComposedBody());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ paddingBottom: 'var(--space-64)' }}>
      <SEOHead path="/contact" />

      <PageHero
        breadcrumbs={meta.breadcrumbs}
        eyebrow="Company // Contact Channels"
        title="Direct communication. No support tickets."
        description="We believe in transparent, direct communication. Reach our team directly through our public, verified channels below."
      />

      <section className="section" style={{ paddingTop: 'var(--space-36)' }}>
        <div className="container" style={{ maxWidth: '1040px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-32)' }}>
            
            {/* Form / Direct Dispatch Column */}
            <Card variant="default" style={{ padding: 'var(--space-32)' }}>
              <div style={{ marginBottom: 'var(--space-20)' }}>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  COMPOSE INQUIRY
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)', marginTop: '4px' }}>
                  Send a Direct Message
                </h2>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: '4px' }}>
                  Draft your inquiry below to launch your default email client with verified routing headers.
                </p>
              </div>

              {submitted ? (
                <div style={{ padding: 'var(--space-20) 0' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                      color: '#10B981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 'var(--space-16)',
                      fontSize: '22px',
                    }}
                  >
                    ✓
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                    Email Draft Prepared
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-16)' }}>
                    Your system email client was triggered to send to <strong style={{ color: 'var(--cyan)' }}>{formData.topic}</strong>. If your email client did not open automatically, you can copy the draft below:
                  </p>

                  <div style={{ padding: '14px', backgroundColor: 'var(--surface-sunken)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text)', whiteSpace: 'pre-wrap', marginBottom: 'var(--space-16)' }}>
                    {getComposedBody()}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button variant="primary" onClick={copyToClipboard} size="sm">
                      {copied ? 'Copied to Clipboard!' : 'Copy Message Body'}
                    </Button>
                    <Button variant="secondary" onClick={() => setSubmitted(false)} size="sm">
                      Edit Draft
                    </Button>
                  </div>
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
                      Your Email Address <span style={{ color: 'var(--risk)' }}>*</span>
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
                    <label htmlFor="topic" style={{ display: 'block', fontSize: '13px', fontWeight: 550, color: 'var(--text)', marginBottom: '6px' }}>
                      Destination Channel
                    </label>
                    <select
                      id="topic"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
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
                      <option value="contact@syntaflow.tech">contact@syntaflow.tech — General Inquiries & Partnerships</option>
                      <option value="privacy@syntaflow.tech">privacy@syntaflow.tech — Privacy & Google OAuth Compliance</option>
                      <option value="security@syntaflow.tech">security@syntaflow.tech — Security & Vulnerability Disclosures</option>
                      <option value="support@syntaflow.tech">support@syntaflow.tech — Product Support & Bug Reports</option>
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
                      placeholder="Describe your inquiry, project, or technical question..."
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
                    Compose Email to {formData.topic} &rarr;
                  </Button>
                </form>
              )}
            </Card>

            {/* Official Public Channels List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  DIRECT PUBLIC CHANNELS
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginTop: '4px' }}>
                  Official Contact Points
                </h3>
              </div>

              {OFFICIAL_CHANNELS.map((ch) => (
                <Card key={ch.name} variant="subtle" style={{ padding: 'var(--space-20)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                      {ch.name}
                    </h4>
                    <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {ch.sla}
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0, marginBottom: '10px' }}>
                    {ch.purpose}
                  </p>

                  {ch.email && (
                    <a
                      href={`mailto:${ch.email}`}
                      style={{ fontSize: '13.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textDecoration: 'none', fontWeight: 500 }}
                    >
                      {ch.email} &rarr;
                    </a>
                  )}

                  {ch.url && (
                    <a
                      href={ch.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '13.5px', fontFamily: 'var(--font-mono)', color: 'var(--cyan)', textDecoration: 'none', fontWeight: 500 }}
                    >
                      github.com/syntaflow/syntaflow &rarr;
                    </a>
                  )}
                </Card>
              ))}

              <Card variant="subtle" style={{ padding: 'var(--space-20)', borderLeft: '3px solid var(--cyan)' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                  Canonical Identity Verification
                </h4>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  All authentic communications from Syntaflow originate strictly from verified addresses ending in <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>@syntaflow.tech</code>.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
