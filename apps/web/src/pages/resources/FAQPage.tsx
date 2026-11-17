import React, { useState } from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Link } from '../../components/ui/Link';
import '../../styles/trust-redesign.css';

const questions = [
  { q: 'What is Syntaflow?', a: 'A Windows desktop workspace for client projects, work, submitted-version reviews, approval state, and delivery records.' },
  { q: 'Can I see it before downloading?', a: 'Yes. The browser prototype lets you try sample actions, and it shows real desktop captures for comparison. It is not a working account.' },
  { q: 'Is the preview free?', a: 'Preview access does not require a payment method. Sign in to check the Windows installer status on your account download page.' },
  { q: 'Does Syntaflow automatically send approved files?', a: 'No. The delivery view helps you check approval state and record an external handoff. It does not send files or prove receipt.' },
  { q: 'Are reviews tied to a version?', a: 'The current desktop review view shows a submitted version with its comments and decision. A later version needs its own review.' },
  { q: 'Which integrations are shown?', a: 'The current desktop build includes connector types for Gmail, Google Calendar, Google Drive, GitHub, Notion, and Linear. Connection and available actions depend on your provider account and permissions.' },
  { q: 'What does Flow do?', a: 'Flow is an optional contextual operator surface inside the desktop app. Review its suggestions before using them.' },
  { q: 'Where is my workspace data?', a: 'The desktop workspace keeps project records on the device. Account access and optional connected tools have separate data flows; see the privacy policy for details.' },
] as const;

export const FAQPage: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);
  return <div className="trust-new faq-new"><SEOHead path="/faq" /><section className="trust-new__hero"><div className="container"><span className="outcome-eyebrow">Questions</span><h1>Clear answers before you start.</h1><p>What the current preview does, what the tour shows, and where to go next.</p></div></section><section className="faq-new__list"><div className="container">{questions.map((item,index) => <article key={item.q}><button type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? null : index)}><span>{item.q}</span><b aria-hidden="true">{open === index ? '−' : '+'}</b></button>{open === index && <p>{item.a}</p>}</article>)}<div className="faq-new__more"><p>Still need help with your setup?</p><Link href="/contact">Contact Syntaflow →</Link></div></div></section></div>;
};
