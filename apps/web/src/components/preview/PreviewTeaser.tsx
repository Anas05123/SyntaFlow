import React, { useState } from 'react';
import { m, useReducedMotion } from 'motion/react';
import { ProductImage } from '../marketing/ProductImage';
import type { ProductImageName } from '../marketing/product-images';
import { Link } from '../ui/Link';
import { SiteIcon } from '../ui/SiteIcon';
import '../../styles/preview-teaser.css';

const views = [
  { label: 'Project', image: 'project' as ProductImageName, caption: 'See the next milestone and the review that is waiting.' },
  { label: 'Review', image: 'review' as ProductImageName, caption: 'Keep the discussion with the submitted version.' },
  { label: 'Delivery', image: 'delivery' as ProductImageName, caption: 'See the files still blocking handoff.' },
] as const;

export const PreviewTeaser: React.FC = () => {
  const [active, setActive] = useState(0);
  const view = views[active];
  const reduceMotion = useReducedMotion();
  return <section className="sf-play" id="guided-preview" aria-labelledby="sf-play-title" data-mood="18">
    <div className="sf-container sf-play__layout">
      <div className="sf-play__copy" data-story-reveal>
        <span className="sf-section-label">Take a closer look</span>
        <h2 id="sf-play-title">The whole story, in one place.</h2>
        <p>Follow Harbor &amp; Finch’s identity project across three real desktop screens. Then try the workflow yourself in the browser.</p>
        <Link href="/preview" className="sf-play__action">Open the playable sample <SiteIcon name="arrow-small-right" size={19} /></Link>
      </div>
      <div className="sf-play__gallery">
        <div className="sf-play__switch" role="group" aria-label="Desktop screen preview">
          {views.map((item, index) => <button key={item.label} type="button" onClick={() => setActive(index)} aria-pressed={index === active}>{item.label}</button>)}
        </div>
        <figure className="sf-play__screen">
          <div className="sf-play__media">
            <ProductImage name={view.image} animated />
          </div>
          <figcaption aria-live="polite">{view.caption}</figcaption>
        </figure>
        <div className="sf-play__controls">
          <span aria-live="polite">0{active + 1} / 0{views.length}</span>
          <m.button type="button" whileTap={reduceMotion ? undefined : { scale: .9 }} onClick={() => setActive((active - 1 + views.length) % views.length)} aria-label="Previous screen"><SiteIcon name="arrow-small-right" /></m.button>
          <m.button type="button" whileTap={reduceMotion ? undefined : { scale: .9 }} onClick={() => setActive((active + 1) % views.length)} aria-label="Next screen"><SiteIcon name="arrow-small-right" /></m.button>
        </div>
      </div>
    </div>
  </section>;
};
