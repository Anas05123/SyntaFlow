import type { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function HomeMotion({ root }: { root: RefObject<HTMLDivElement | null> }) {
  useGSAP(() => {
    const page = root.current;
    if (!page) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const reveals = gsap.context(() => {}, page);
      ScrollTrigger.batch('[data-story-reveal]', {
        start: 'top 94%', once: true,
        onEnter: (elements) => { reveals.add(() => gsap.fromTo(elements, { opacity: 0, y: 35 }, { opacity: 1, y: 0, duration: .75, stagger: .08, ease: 'power3.out' })); },
      });
      const gallery = page.querySelector('.sf-play__gallery');
      if (gallery) gsap.fromTo(gallery, { y: 38 }, { y: -15, ease: 'none', scrollTrigger: { trigger: gallery, start: 'top bottom', end: 'bottom top', scrub: .7 } });
      const line = page.querySelector('[data-story-timeline]');
      if (line) gsap.fromTo(line, { '--line-progress': 0 }, { '--line-progress': 1, ease: 'none', scrollTrigger: { trigger: line, start: 'top 86%', end: 'bottom 45%', scrub: .5 } });
      const cards = [...page.querySelectorAll<HTMLElement>('[data-spotlight]')];
      let pointerFrame = 0;
      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        cancelAnimationFrame(pointerFrame);
        pointerFrame = requestAnimationFrame(() => {
          const card = (event.target as Element).closest<HTMLElement>('[data-spotlight]');
          if (!card) return;
          const box = card.getBoundingClientRect();
          card.style.setProperty('--spot-x', `${event.clientX - box.left}px`);
          card.style.setProperty('--spot-y', `${event.clientY - box.top}px`);
        });
      };
      if (cards.length) page.addEventListener('pointermove', move, { passive: true });
      return () => {
        reveals.revert();
        page.removeEventListener('pointermove', move);
        cancelAnimationFrame(pointerFrame);
      };
    });
    const resize = new ResizeObserver(() => ScrollTrigger.refresh());
    resize.observe(page);
    return () => { media.revert(); resize.disconnect(); };
  }, { scope: root });
  return null;
}
