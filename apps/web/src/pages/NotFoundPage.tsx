import React from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Link } from '../components/ui/Link';

export const NotFoundPage: React.FC = () => (
  <main className="sf-not-found">
    <SEOHead title="Page Not Found | Syntaflow" description="Find your way back to Syntaflow." path="/404" indexable={false} />
    <div className="container">
      <p className="sf-not-found__hint">That page is not here</p>
      <h1>Let’s get you back on track.</h1>
      <p>The link may have changed. You can return to the product, browse the guide, or start from the homepage.</p>
      <div className="sf-not-found__links">
        <Link href="/" className="sf-not-found__primary">Go to homepage</Link>
        <Link href="/product">Explore the product</Link>
        <Link href="/docs">Read the guide</Link>
      </div>
    </div>
  </main>
);
