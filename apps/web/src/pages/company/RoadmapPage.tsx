import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Link } from '../../components/ui/Link';
import '../../styles/trust-redesign.css';

export const RoadmapPage: React.FC = () => <div className="trust-new">
  <SEOHead path="/roadmap" />
  <section className="trust-new__hero"><div className="container"><span className="outcome-eyebrow">Direction</span><h1>What we are working to make clearer.</h1><p>The Windows preview is the current product. These are areas of exploration, not shipping dates or promises of availability.</p></div></section>
  <section className="trust-new__facts"><div className="container">
    <article><span>01</span><div><h2>Review without guesswork</h2><p>Make version, feedback, and decision state easier to understand for every engagement.</p></div></article>
    <article><span>02</span><div><h2>Connected context</h2><p>Improve how optional provider references appear beside the project, with clear permission boundaries.</p></div></article>
    <article><span>03</span><div><h2>Reliable handoff</h2><p>Make the approval gate and external delivery record easier to inspect and explain.</p></div></article>
    <article><span>04</span><div><h2>Platform reach</h2><p>Other desktop platforms remain under consideration. The current preview targets Windows 10/11.</p></div></article>
  </div></section>
  <section className="trust-new__close"><div className="container"><h2>See what exists today.</h2><div><Link href="/preview">Try the sample project</Link><Link href="/download">Check Windows preview</Link></div></div></section>
</div>;
