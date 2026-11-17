import React from 'react';
import { SEOHead } from '../ui/SEOHead';
import { Link } from '../ui/Link';
import '../../styles/outcome-pages.css';
import '../../styles/outcome-polish.css';

export type OutcomePageProps = {
  path: string;
  eyebrow: string;
  title: string;
  intro: string;
  result: string;
  image: string;
  imageAlt: string;
  imageNote: string;
  points: { title: string; body: string }[];
  next?: { label: string; href: string };
};

export const OutcomePage: React.FC<OutcomePageProps> = ({ path, eyebrow, title, intro, result, image, imageAlt, imageNote, points, next }) => (
  <div className={`outcome-page ${/projects|agencies|consultants|google/.test(path) ? 'outcome-page--reverse' : ''} ${/reviews|ai-workspace|studios/.test(path) ? 'outcome-page--deep' : ''}`}>
    <SEOHead path={path} />
    <section className="outcome-hero">
      <div className="container outcome-hero__grid">
        <div className="outcome-hero__copy">
          <span className="outcome-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{intro}</p>
          <div className="outcome-actions">
            <Link href="/download" className="outcome-action-primary">Preview desktop</Link>
            <Link href="/preview" className="outcome-action-secondary">Try the sample project</Link>
          </div>
        </div>
        <figure className="outcome-image">
          <img src={image} alt={imageAlt} />
          <figcaption><span>{imageNote}</span><Link href={image} target="_blank" rel="noopener noreferrer">View full screen</Link></figcaption>
        </figure>
      </div>
    </section>
    <section className="outcome-result">
      <div className="container outcome-result__grid">
        <div><span className="outcome-eyebrow">The result</span><h2>{result}</h2></div>
        <div className="outcome-points">{points.map((point) => <article key={point.title}><div><h3>{point.title}</h3><p>{point.body}</p></div></article>)}</div>
      </div>
    </section>
    <section className="outcome-next"><div className="container"><p>See how the pieces work together.</p><div><Link href={next?.href || '/product'}>{next?.label || 'Explore the product'}</Link><Link href="/download">Get the preview</Link></div></div></section>
  </div>
);
