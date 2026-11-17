import { lazy, Suspense, useEffect, useRef, useState, type FormEvent } from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Link } from '../components/ui/Link';
import { SiteIcon, type SiteIconName } from '../components/ui/SiteIcon';
import { ClientBriefDemo } from '../components/marketing/ClientBriefDemo';
import { ProductImage } from '../components/marketing/ProductImage';
import { HomeExperience, SentenceRotation } from '../components/marketing/HomeExperience';
import { PreviewTeaser } from '../components/preview/PreviewTeaser';
import '../styles/home-story.css';

const HomeMotion = lazy(() => import('../components/marketing/HomeMotion').then(({ HomeMotion }) => ({ default: HomeMotion })));
const features: { icon: SiteIconName; tag: string; title: string; copy: string; href: string; detail: string }[] = [
  { icon: 'users-alt', tag: 'The relationship', title: 'Know the people behind the project.', copy: 'Keep client contacts and their project history together. Pick up the relationship with its context in view.', href: '/product/client-management', detail: 'Clients · Contacts · Projects' },
  { icon: 'folder', tag: 'The work', title: 'Give every request a place to go.', copy: 'Keep the brief, tasks and files with the project. Turn a scattered update into something you can act on.', href: '#brief-demo', detail: 'Brief · Tasks · Files' },
  { icon: 'comment', tag: 'The conversation', title: 'Keep feedback on the right version.', copy: 'Review the submitted version, follow its comments and record the decision against those exact files.', href: '/product/reviews-approvals', detail: 'Version · Feedback · Decision' },
  { icon: 'check-circle', tag: 'The handoff', title: 'Finish with the agreement in view.', copy: 'See which required files still need approval before recording the final handoff.', href: '/product/documents', detail: 'Approval · Delivery record' },
];
const steps = [
  ['Bring in the context', 'Start with a client, a project and the request. Keep the source close.'],
  ['Make the next move clear', 'Review the brief, organize the tasks and check what needs an answer.'],
  ['Carry the decision forward', 'Review the exact version and check approvals before handoff.'],
] as const;

function EarlyAccess() {
  const [email, setEmail] = useState('');
  const [draft, setDraft] = useState('');
  const prepare = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent('Syntaflow early access');
    const body = encodeURIComponent(`Hi Syntaflow,\n\nI’d like to hear about early access.\n\nMy email: ${email.trim()}`);
    setDraft(`mailto:contact@syntaflow.tech?subject=${subject}&body=${body}`);
  };
  return <section className="story-section story-close" id="early-access" aria-labelledby="early-title" data-mood="0">
    <div className="container story-close__layout">
      <div data-story-reveal><span className="story-kicker">Make room for good work</span><h2 id="early-title">Bring your next<br />chapter into focus.</h2><p>We’re building Syntaflow with independent creatives. Be part of what comes next.</p><span className="story-pill">In Preview</span></div>
      <div className="story-close__actions" data-story-reveal>
        <form onSubmit={prepare}>
          <label htmlFor="early-email">Your email</label>
          <input id="early-email" type="email" autoComplete="email" maxLength={254} value={email} onChange={(event) => { setEmail(event.target.value); setDraft(''); }} required placeholder="you@example.com" />
          <button className="story-action" type="submit">Prepare early access request</button>
        </form>
        <p role="status">{draft ? 'Draft ready. Open it in your email app to send your request.' : 'This prepares an email draft for you to send.'}</p>
        {draft && <a className="story-inline" href={draft}>Open email draft</a>}
        <Link className="story-inline" href="/download">Check the Windows preview</Link>
      </div>
    </div>
  </section>;
}

export function HomePage() {
  const root = useRef<HTMLDivElement>(null);
  const [motionReady, setMotionReady] = useState(false);
  useEffect(() => {
    const enableScrollMotion = () => {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setMotionReady(true);
    };
    window.addEventListener('scroll', enableScrollMotion, { once: true, passive: true });
    return () => window.removeEventListener('scroll', enableScrollMotion);
  }, []);
  useEffect(() => {
    const destination = window.location.hash.slice(1) || (new URLSearchParams(window.location.search).has('tour') ? 'guided-preview' : '');
    if (!destination) return;
    const frame = requestAnimationFrame(() => document.getElementById(destination)?.scrollIntoView({ behavior: 'instant' }));
    return () => cancelAnimationFrame(frame);
  }, []);
  return <div className="story-home" ref={root}>
    <SEOHead path="/" />
    <HomeExperience root={root} />
    {motionReady && <Suspense fallback={null}><HomeMotion root={root} /></Suspense>}
    <section className="story-hero" id="product" aria-labelledby="story-title" data-mood="0">
      <div className="container">
        <div className="story-hero__top" data-hero-enter><span className="story-kicker">FROM CONTEXT TO ACTION.</span><span className="story-pill">Desktop preview</span></div>
        <h1 id="story-title"><span className="hero-line-mask"><span data-hero-line>Your people.</span></span><span className="hero-line-mask"><span data-hero-line>Your work, <em>together.</em></span></span></h1>
        <div className="story-hero__bottom">
          <div className="story-hero__copy" data-hero-enter><p>A desktop space for the people and decisions behind your work. Keep client relationships, project context and versioned reviews together.</p><div className="story-actions"><Link className="story-action" href="/preview">Try the sample <SiteIcon name="arrow-small-right" size={19} /></Link><a className="story-action story-action--quiet" href="#how-it-works">See how it works</a></div><p className="story-hero__availability">For freelancers and small creative teams. In Preview.</p></div>
          <figure className="story-hero__proof" data-hero-proof><ProductImage name="home" priority /><figcaption>See what needs your attention.</figcaption></figure>
        </div>
      </div>
    </section>
    <section className="story-section story-problem story-light" id="problem" aria-labelledby="problem-title" data-mood="15">
      <div className="container story-split"><div data-story-reveal><span className="story-kicker">The work is rarely the hard part</span><h2 id="problem-title">Losing the thread?<br />That’s the hard part.</h2></div><div className="story-problem__copy" data-story-reveal><p>A client’s request is in one thread. The feedback is in another. The decision you need is somewhere in between.</p><p>Syntaflow gives the relationship a home, so the context can travel with the work.</p><div className="story-fragments" aria-label="Context that belongs together"><span className="story-pill">The original brief</span><span className="story-pill">The latest feedback</span><span className="story-pill">The agreed version</span></div></div></div>
    </section>
    <section className="story-section story-features" id="features" aria-labelledby="features-title" data-mood="48">
      <div className="container">
        <div className="story-section__intro" data-story-reveal><span className="story-kicker">A clearer way through</span><h2 id="features-title">Less chasing.<br />More moving forward.</h2></div>
        <SentenceRotation />
        <div className="story-feature__list">{features.map((feature) => <article className="story-feature" data-spotlight data-story-reveal key={feature.tag}>
          <div className="story-feature__top"><span className="story-pill">{feature.tag}</span><SiteIcon name={feature.icon} size={29} /></div><h3>{feature.title}</h3><p>{feature.copy}</p><span className="story-feature__detail">{feature.detail}</span><Link className="story-inline" href={feature.href}>Explore this example <span className="story-visually-hidden">{feature.tag}</span></Link>
        </article>)}</div>
      </div>
    </section>
    <section className="story-section story-community" id="community" aria-labelledby="community-title" data-mood="125">
      <span id="roadmap" className="story-anchor" aria-hidden="true" />
      <div className="container story-split">
        <div data-story-reveal><span className="story-kicker">People make the work</span><h2 id="community-title">Every project<br />is a relationship.</h2><p>A client, a creative, a shared direction. Keep the people, project history and review decisions connected in your workspace.</p><p>We’re shaping Syntaflow with independent creatives, starting with a desktop preview and the work they do every day.</p><a href="#early-access" className="story-inline">Help shape what comes next</a></div>
        <div className="community-map" data-story-reveal role="img" aria-label="Concept illustration linking a creative, client context and review history around one project. Placeholder avatars represent roles.">
          <span className="community-map__orbit" /><span className="community-map__orbit community-map__orbit--inner" />
          <div className="community-map__center"><img src="/brand/syntaflow-mark.webp" width="58" height="58" alt="" /><strong>The project</strong><span>One shared picture</span></div>
          <div className="community-person community-person--you"><i aria-hidden="true">Y</i><span>Your perspective</span></div><div className="community-person community-person--client"><i aria-hidden="true">C</i><span>Client context</span></div><div className="community-person community-person--review"><i aria-hidden="true"><SiteIcon name="check-circle" /></i><span>Review history</span></div><span className="community-map__label">A concept of connected context</span>
        </div>
      </div>
    </section>
    <PreviewTeaser />
    <section className="story-section story-solution" id="how-it-works" aria-labelledby="solution-title" data-mood="26">
      <div className="container">
        <div className="story-section__intro" data-story-reveal><span className="story-kicker">From context to action</span><h2 id="solution-title">Start with a request.<br />Leave with a next step.</h2></div>
        <ol className="story-workflow__line" data-story-timeline>{steps.map(([title, copy], index) => <li key={title} data-story-reveal><span>{index + 1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
        <div className="story-split story-demo-layout"><div data-story-reveal><span className="story-pill">Try a prepared example</span><h3>A request. A brief.<br />A clearer conversation.</h3><p>Read the client’s update, explore the evidence and see what still needs an answer.</p><p className="story-small">This example uses prepared sample data.</p></div><ClientBriefDemo /></div>
      </div>
    </section>
    <section className="story-section story-questions story-light" id="questions" aria-labelledby="story-questions-title" data-mood="8">
      <div className="container story-split"><div data-story-reveal><span className="story-kicker">Before you join in</span><h2 id="story-questions-title">Good questions.<br />Clear answers.</h2></div>
        <div className="story-questions__list" data-story-reveal>
          <details><summary>Can I try it in the browser?<SiteIcon name="angle-small-down" /></summary><p>Yes. Follow a sample client project, review a version and see what blocks delivery. <Link href="/preview">Open the sample</Link>.</p></details>
          <details><summary>What does community mean here?<SiteIcon name="angle-small-down" /></summary><p>We’re building around the relationships behind client work and inviting creatives to shape its direction. Today, client records, projects and review history live in your desktop workspace.</p></details>
          <details><summary>Do I need a Windows installer?<SiteIcon name="angle-small-down" /></summary><p>The browser sample needs no installation. Your account shows current Windows preview availability. <Link href="/download">Check download access</Link>.</p></details>
          <details><summary>Can I use my own messages?<SiteIcon name="angle-small-down" /></summary><p>The website uses prepared data. The desktop guide explains how to add a client update to a project. <Link href="/docs#client-update">Read the guide</Link>.</p></details>
        </div>
      </div>
    </section>
    <EarlyAccess />
  </div>;
}
