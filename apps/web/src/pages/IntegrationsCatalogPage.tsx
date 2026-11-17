import React from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Link } from '../components/ui/Link';
import { ServiceLogo } from '../components/brand/ServiceLogos';
import '../styles/catalog-redesign.css';
import '../styles/catalog-polish.css';

const providers = [
  { id: 'gmail', name: 'Gmail', href: '/integrations/gmail', group: 'Communication', copy: 'Bring relevant email context into the client engagement.' },
  { id: 'google-calendar', name: 'Google Calendar', href: '/integrations/google-calendar', group: 'Schedule', copy: 'See calendar context while planning client work.' },
  { id: 'google-drive', name: 'Google Drive', href: '/integrations/google-drive', group: 'Files', copy: 'Connect selected Drive files to the project record.' },
  { id: 'github', name: 'GitHub', href: '/integrations/github', group: 'Development', copy: 'Keep repository references alongside project work.' },
  { id: 'notion', name: 'Notion', href: '/integrations/notion', group: 'Knowledge', copy: 'Connect pages you choose to share with the integration.' },
  { id: 'linear', name: 'Linear', href: '/integrations/linear', group: 'Development', copy: 'Relate issue context to the client project.' },
] as const;

export const IntegrationsCatalogPage: React.FC = () => <div className="catalog-page">
  <SEOHead path="/integrations" />
  <section className="catalog-hero"><div className="container"><span className="outcome-eyebrow">Connected tools</span><h1>Your tools can keep their place in the work.</h1><p>Syntaflow includes desktop connectors for these six providers. Connection and available actions depend on your credentials and each provider's permissions.</p></div></section>
  <section className="catalog-list"><div className="container">
    <div className="catalog-list__head"><h2>Explore the current connectors.</h2><p>Connect a provider from desktop settings. You control which account and data it can access.</p></div>
    <div className="catalog-grid">{providers.map((provider) => <Link href={provider.href} className="catalog-provider" key={provider.id}><span className="catalog-provider__logo"><ServiceLogo name={provider.id} size={28} /></span><span className="catalog-provider__body"><small>{provider.group}</small><strong>{provider.name}</strong><span>{provider.copy}</span></span></Link>)}</div>
    <p className="catalog-availability">These are connector types in the current desktop build. A listed connector is not a promise that your particular account is connected or that every provider action is available.</p>
  </div></section>
  <section className="catalog-close"><div className="container"><h2>Start with the project. Add a tool when it helps.</h2><Link href="/preview">Try the sample project</Link></div></section>
</div>;
