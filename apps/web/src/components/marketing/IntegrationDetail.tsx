import React from 'react';
import { SEOHead } from '../ui/SEOHead';
import { Link } from '../ui/Link';
import { ServiceLogo } from '../brand/ServiceLogos';
import '../../styles/integration-detail.css';

export const IntegrationDetail: React.FC<{ path: string; id: string; name: string; purpose: string; context: string; caveat: string }> = ({ path, id, name, purpose, context, caveat }) => <div className="integration-detail">
  <SEOHead path={path} />
  <section className="integration-detail__hero"><div className="container"><Link href="/integrations" className="integration-detail__back">All integrations</Link><div className="integration-detail__mark"><ServiceLogo name={id} size={42} /></div><span className="outcome-eyebrow">Desktop connector</span><h1>{name} in the project context.</h1><p>{purpose}</p><Link href="/download" className="outcome-action-primary">Check desktop preview</Link></div></section>
  <section className="integration-detail__body"><div className="container"><div><span className="outcome-eyebrow">How it fits</span><h2>Bring the useful reference closer to the work.</h2></div><div><p>{context}</p><p>{caveat}</p><p>Set up the connection in the desktop app with your own provider account. Available actions depend on the permissions granted and the current connector build.</p></div></div></section>
  <section className="integration-detail__close"><div className="container"><h2>See the engagement first.</h2><Link href="/preview">Try the sample project</Link></div></section>
</div>;
