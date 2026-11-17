import React, { useState } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Link } from '../../components/ui/Link';
import '../../styles/contact-redesign.css';

const destinations = [
  { label: 'General', email: 'contact@syntaflow.tech', purpose: 'Product and partnership questions' },
  { label: 'Support', email: 'support@syntaflow.tech', purpose: 'Help with the desktop preview' },
  { label: 'Privacy', email: 'privacy@syntaflow.tech', purpose: 'Privacy and data questions' },
  { label: 'Security', email: 'security@syntaflow.tech', purpose: 'Vulnerability reports' },
] as const;

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', organization: '', destination: destinations[0].email as string, message: '' });
  const [prepared, setPrepared] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const body = `Name: ${form.name}\nEmail: ${form.email}\nOrganization: ${form.organization || 'Not provided'}\n\n${form.message}`;
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || !form.message.trim()) {
      setError('Add your name, a valid email address, and a message.');
      return;
    }
    setError('');
    setPrepared(true);
    window.location.href = `mailto:${form.destination}?subject=${encodeURIComponent('Syntaflow inquiry from ' + form.name)}&body=${encodeURIComponent(body)}`;
  };
  const copy = async () => { await navigator.clipboard.writeText(body); setCopied(true); };
  return <div className="contact-new">
    <SEOHead path="/contact" />
    <section className="contact-new__hero"><div className="container"><span className="outcome-eyebrow">Contact</span><h1>Tell us what you need.</h1><p>Questions about the preview, your account, privacy, or security? Compose an email here or use one of the addresses below.</p></div></section>
    <section className="contact-new__body"><div className="container contact-new__grid">
      <div className="contact-new__form"><h2>Compose an email.</h2><p>This opens your email app with a draft. Check and send it there; this website does not send the message.</p>
        {prepared && <div className="contact-new__prepared" role="status"><strong>Draft prepared for {form.destination}.</strong><span>If your email app did not open, copy the message and send it manually.</span><button type="button" onClick={copy}>{copied ? 'Copied' : 'Copy message'}</button><button type="button" onClick={() => setPrepared(false)}>Edit draft</button></div>}
        <form onSubmit={submit}>
          <label htmlFor="contact-name">Name</label><input id="contact-name" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} autoComplete="name" required />
          <label htmlFor="contact-email">Email</label><input id="contact-email" type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} autoComplete="email" required />
          <label htmlFor="contact-org">Organization <span>(optional)</span></label><input id="contact-org" value={form.organization} onChange={event => setForm({ ...form, organization: event.target.value })} autoComplete="organization" />
          <label htmlFor="contact-destination">Topic</label><select id="contact-destination" value={form.destination} onChange={event => setForm({ ...form, destination: event.target.value })}>{destinations.map(item => <option key={item.email} value={item.email}>{item.label}</option>)}</select>
          <label htmlFor="contact-message">Message</label><textarea id="contact-message" rows={6} value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} required />
          {error && <p role="alert" className="contact-new__error">{error}</p>}
          <button type="submit" className="outcome-action-primary">Open email draft <span aria-hidden="true">↗</span></button>
        </form>
      </div>
      <aside className="contact-new__channels"><span className="outcome-eyebrow">Direct addresses</span>{destinations.map((item,index) => <div key={item.email}><small>{String(index+1).padStart(2,'0')} / {item.label}</small><h3>{item.purpose}</h3><a href={`mailto:${item.email}`}>{item.email}</a></div>)}<p>New to the product? <Link href="/preview">Try the sample project</Link></p></aside>
    </div></section>
  </div>;
};
