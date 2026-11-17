import React from 'react';
import { SEOHead } from '../../components/ui/SEOHead';
import { Link } from '../../components/ui/Link';
import '../../styles/trust-redesign.css';

export const DataHandlingPage: React.FC = () => <div className="trust-new">
  <SEOHead path="/data-handling" />
  <section className="trust-new__hero"><div className="container"><span className="outcome-eyebrow">Data handling</span><h1>Know which part stays local.</h1><p>Project work in the desktop preview is stored on the device. Sign-in and optional integrations have separate data flows that are described in the privacy policy.</p></div></section>
  <section className="trust-new__facts"><div className="container">
    <article><span>01</span><div><h2>Workspace records</h2><p>Clients, projects, tasks, versions, and delivery records belong to the desktop workspace state.</p></div></article>
    <article><span>02</span><div><h2>Account access</h2><p>Your website account provides download and desktop authorization access. Account status is not a copy of every local project.</p></div></article>
    <article><span>03</span><div><h2>External tools</h2><p>Connected providers remain optional. Their permissions and data access depend on the provider setup you choose.</p></div></article>
    <article><span>04</span><div><h2>Backups</h2><p>Keep independent copies of important work while using preview software. Check the current app's export and backup options before relying on them.</p></div></article>
  </div></section>
  <section className="trust-new__close"><div className="container"><h2>Need the full policy?</h2><div><Link href="/privacy">Read privacy →</Link><Link href="/download">Preview desktop →</Link></div></div></section>
</div>;
