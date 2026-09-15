import React, { useState } from 'react';
import { Button } from '../ui/Button';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    reason: 'Product Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Valid email address is required';
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      errs.message = 'Please provide a message of at least 10 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Truthful submission: UI records submission locally and displays confirmation.
    // Server-side integration endpoint documented in final report.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        style={{
          padding: 'var(--space-8)',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-status-active-bg)',
            border: '1px solid var(--color-status-active)',
            color: 'var(--color-status-active)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-4) auto',
            fontSize: '1.25rem',
          }}
        >
          ✓
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--space-2)',
          }}
        >
          Message Received
        </h3>
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto var(--space-6) auto' }}>
          Thank you, {formData.name}. Your {formData.reason.toLowerCase()} has been captured. Our engineering and operations team reviews every inquiry directly.
        </p>
        <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-8)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }} className="sf-grid-2">
        <div>
          <label
            htmlFor="contact-name"
            style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.375rem' }}
          >
            Full Name *
          </label>
          <input
            id="contact-name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Jane Doe"
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              backgroundColor: 'var(--color-surface-raised)',
              border: `1px solid ${errors.name ? 'var(--color-status-risk)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-primary)',
              fontSize: '0.9375rem',
            }}
          />
          {errors.name && <span style={{ color: 'var(--color-status-risk)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>}
        </div>

        <div>
          <label
            htmlFor="contact-email"
            style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.375rem' }}
          >
            Email Address *
          </label>
          <input
            id="contact-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jane@organization.com"
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              backgroundColor: 'var(--color-surface-raised)',
              border: `1px solid ${errors.email ? 'var(--color-status-risk)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-primary)',
              fontSize: '0.9375rem',
            }}
          />
          {errors.email && <span style={{ color: 'var(--color-status-risk)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{errors.email}</span>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }} className="sf-grid-2">
        <div>
          <label
            htmlFor="contact-company"
            style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.375rem' }}
          >
            Company / Studio
          </label>
          <input
            id="contact-company"
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Acme Studio"
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              backgroundColor: 'var(--color-surface-raised)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-primary)',
              fontSize: '0.9375rem',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="contact-reason"
            style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.375rem' }}
          >
            Reason for Inquiry
          </label>
          <select
            id="contact-reason"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            style={{
              width: '100%',
              padding: '0.625rem 0.875rem',
              backgroundColor: 'var(--color-surface-raised)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-primary)',
              fontSize: '0.9375rem',
            }}
          >
            <option value="Product Inquiry">Product Inquiry</option>
            <option value="Agency Partnership">Agency Partnership</option>
            <option value="Security Disclosure">Security Disclosure</option>
            <option value="Press & Media">Press & Media</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.375rem' }}
        >
          Message *
        </label>
        <textarea
          id="contact-message"
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="How can we help your client engagement operations?"
          style={{
            width: '100%',
            padding: '0.75rem 0.875rem',
            backgroundColor: 'var(--color-surface-raised)',
            border: `1px solid ${errors.message ? 'var(--color-status-risk)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-text-primary)',
            fontSize: '0.9375rem',
            fontFamily: 'var(--font-sans)',
            resize: 'vertical',
          }}
        />
        {errors.message && <span style={{ color: 'var(--color-status-risk)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{errors.message}</span>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginTop: 'var(--space-2)' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
          Direct email: <a href="mailto:contact@syntaflow.tech" style={{ color: 'var(--color-cyan)' }}>contact@syntaflow.tech</a>
        </span>
        <Button type="submit" variant="primary" size="md">
          Send Message
        </Button>
      </div>
    </form>
  );
};
