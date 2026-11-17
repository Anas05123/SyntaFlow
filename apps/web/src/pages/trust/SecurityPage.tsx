import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Link } from '../../components/ui/Link';
import '../../styles/trust-redesign.css';

export const SecurityPage: React.FC = () => <div className="trust-new">
  <SEOHead path="/security" />
  <section className="trust-new__hero"><div className="container"><span className="outcome-eyebrow">Security and boundaries</span><h1>Understand where the work lives.</h1><p>Syntaflow is a desktop workspace with local project records and separate account and integration services. The details below describe the current implementation at a high level.</p></div></section>
  <section className="trust-new__facts"><div className="container">
    <article><span>01</span><div><h2>Desktop workspace</h2><p>The current app keeps its workspace state on the device. Your account and optional connected tools still use network services where needed.</p></div></article>
    <article><span>02</span><div><h2>Browser authorization</h2><p>Desktop sign-in uses a browser handoff and a local callback. The account service remains separate from the project workspace.</p></div></article>
    <article><span>03</span><div><h2>Optional connections</h2><p>Each provider connection requires its own authorization or credentials. Review its requested permissions before connecting.</p></div></article>
    <article><span>04</span><div><h2>Review and delivery</h2><p>Reviews refer to submitted versions. The delivery view shows approval state and records an external handoff; it does not prove a recipient received files.</p></div></article>
  </div></section>
  <section className="trust-new__close"><div className="container"><h2>Read the policy and see the product.</h2><div><Link href="/privacy">Privacy policy</Link><Link href="/preview">Try the sample project</Link></div></div></section>
</div>;
