import React from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Link } from '../components/ui/Link';
import { useAuth } from '../services/auth/AuthContext';
import '../styles/catalog-redesign.css';
import '../styles/catalog-polish.css';

export const DownloadPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const href = isAuthenticated ? '/account/downloads' : '/login?returnTo=/account/downloads';
  return <div className="download-new">
    <SEOHead path="/download" />
    <section className="download-new__hero"><div className="container download-new__grid"><div><span className="outcome-eyebrow">Windows desktop preview</span><h1>Bring the next client project into focus.</h1><p>Try the sample project in your browser. When you are ready, sign in to check whether the Windows installer is available.</p><div className="outcome-actions"><Link href="/preview" className="outcome-action-primary">Try the sample project</Link><Link href={href} className="outcome-action-secondary">Check download access</Link></div></div><figure className="download-new__screen"><img src="/product-screens/current/home.png" alt="Current Syntaflow Home screen with the Harbor and Finch sample client project" /><figcaption>Home in the current desktop build, using sample data</figcaption></figure></div></section>
    <section className="download-new__steps"><div className="container"><h2>From sample to desktop.</h2><ol><li><strong>Try the sample.</strong><span>Open the client, project, review, and delivery gate in the browser prototype.</span></li><li><strong>Check the installer.</strong><span>Your account download area shows whether the Windows build is published.</span></li><li><strong>Start in desktop.</strong><span>When available, install the app and sign in from your browser.</span></li></ol><p>Sample actions do not change an account. Real desktop captures are shown alongside the prototype.</p></div></section>
  </div>;
};
