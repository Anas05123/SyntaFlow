import { useEffect, useRef, useState, type RefObject } from 'react';
import { m, useReducedMotion } from 'motion/react';

const homeSections = [
  ['product', 'Welcome'], ['problem', 'The problem'], ['features', 'What you can do'],
  ['community', 'The people'], ['guided-preview', 'The product'], ['how-it-works', 'How it works'],
  ['questions', 'Questions'], ['early-access', 'Early access'],
] as const;

export function HomeExperience({ root }: { root: RefObject<HTMLDivElement | null> }) {
  const [active, setActive] = useState('product');
  const background = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const page = root.current;
    if (!page) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const nativeProgress = CSS.supports('animation-timeline: scroll()');
    let frame = 0;
    let bounds: { top: number; hue: number }[] = [];
    let maximum = 1;
    const measure = () => {
      bounds = [...page.querySelectorAll<HTMLElement>('[data-mood]')].map((section) => ({ top: section.getBoundingClientRect().top + scrollY, hue: Number(section.dataset.mood) }));
      maximum = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      schedule();
    };
    const update = () => {
      frame = 0;
      if ((!nativeProgress || preference.matches) && progress.current) progress.current.style.transform = `scaleX(${Math.min(1, scrollY / maximum)})`;
      if (!background.current || preference.matches) return;
      let current = 0;
      while (current + 1 < bounds.length && bounds[current + 1].top <= scrollY + innerHeight * .35) current += 1;
      const start = bounds[current];
      const next = bounds[current + 1];
      if (!start) return;
      const fraction = next ? Math.min(1, Math.max(0, (scrollY + innerHeight * .35 - start.top) / (next.top - start.top))) : 0;
      const hue = start.hue + ((next?.hue ?? start.hue) - start.hue) * fraction;
      background.current.style.filter = `blur(var(--ambient-blur)) hue-rotate(${hue.toFixed(1)}deg)`;
    };
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    const onVisibility = () => {
      if (background.current) background.current.dataset.paused = String(document.hidden);
      if (!document.hidden) schedule();
    };
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    for (const [id] of homeSections) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    const resize = new ResizeObserver(measure);
    resize.observe(page);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    document.addEventListener('visibilitychange', onVisibility);
    preference.addEventListener('change', measure);
    measure();
    onVisibility();
    return () => {
      observer.disconnect();
      resize.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      document.removeEventListener('visibilitychange', onVisibility);
      preference.removeEventListener('change', measure);
    };
  }, [root]);

  return <>
    <div className="story-ambient" aria-hidden="true"><div className="story-aurora" ref={background}><span /><span /><span /></div><div className="story-grain" /></div>
    <div className="story-progress" ref={progress} aria-hidden="true" />
    <nav className="story-dots" aria-label="Page sections">
      {homeSections.map(([id, label]) => <a href={`#${id}`} key={id} aria-label={label} aria-current={id === active ? 'location' : undefined}><span className="story-dots__label">{label}</span><i /></a>)}
    </nav>
  </>;
}

const phrases = ['clear context.', 'versioned feedback.', 'approved files.'];

export function SentenceRotation() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(!document.hidden);
  const element = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (element.current) observer.observe(element.current);
    const visibility = () => setTabVisible(!document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => {
    if (paused || reduced || !visible || !tabVisible) return;
    const timer = setInterval(() => setIndex((current) => (current + 1) % phrases.length), 4000);
    return () => clearInterval(timer);
  }, [paused, reduced, visible, tabVisible]);
  return <div className="story-sentence" ref={element}>
    <span className="story-visually-hidden">Move work forward with clear context, versioned feedback and approved files.</span>
    <div aria-hidden="true"><span>Move work forward with</span><m.strong key={index} initial={reduced ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .35 }}>{phrases[index]}</m.strong></div>
    {!reduced && <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Resume rotating text' : 'Pause rotating text'} aria-pressed={paused}>{paused ? 'Play' : 'Pause'}</button>}
  </div>;
}
