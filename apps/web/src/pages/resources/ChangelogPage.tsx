import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Link } from '../../components/ui/Link';
import '../../styles/trust-redesign.css';

export const ChangelogPage: React.FC = () => <div className="trust-new">
  <SEOHead path="/changelog" />
  <section className="trust-new__hero"><div className="container"><span className="outcome-eyebrow">Preview notes · September 2026</span><h1>What you can see in the current build.</h1><p>These notes describe the desktop screens captured for this site. They are a snapshot of the preview, not a promise about future releases.</p></div></section>
  <section className="trust-new__facts"><div className="container">
    <article><span>01</span><div><h2>Home and project context</h2><p>Home shows work that needs attention. The sample project keeps its work and waiting review in view.</p></div></article>
    <article><span>02</span><div><h2>Version-specific review</h2><p>The review screen presents the submitted version and its decision together.</p></div></article>
    <article><span>03</span><div><h2>Delivery status</h2><p>The sample delivery view shows two files that still need approval before an external handoff can be recorded.</p></div></article>
    <article><span>04</span><div><h2>Flow and connectors</h2><p>Flow appears as a contextual operator screen. The desktop build includes connector types for six providers; authorization depends on setup.</p></div></article>
  </div></section>
  <section className="trust-new__close"><div className="container"><h2>Explore the current build.</h2><div><Link href="/preview">Try the sample project</Link><Link href="/download">Windows preview</Link></div></div></section>
</div>;
