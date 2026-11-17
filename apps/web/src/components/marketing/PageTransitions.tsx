import { useCallback, useEffect, useState, type ReactNode } from 'react';
import '../../styles/page-transitions.css';

const sessionKey = 'syntaflow-intro-seen';
function shouldShowIntro() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (/bot|crawl|spider|lighthouse/i.test(navigator.userAgent)) return false;
  try { return sessionStorage.getItem(sessionKey) !== 'yes'; } catch { return false; }
}

export function RoutePending() {
  return <div className="route-skeleton" role="status" aria-label="Loading page content"><span /><span /><span /></div>;
}

export function PageTransitions({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(shouldShowIntro);
  const finish = useCallback(() => {
    setVisible(false);
    document.documentElement.dataset.pageReveal = 'ready';
    window.dispatchEvent(new Event('syntaflow:page-reveal'));
  }, []);
  useEffect(() => {
    if (!visible) {
      document.documentElement.dataset.pageReveal = 'ready';
      return;
    }
    try { sessionStorage.setItem(sessionKey, 'yes'); } catch { /* Storage may be disabled. */ }
    document.documentElement.dataset.pageReveal = 'loading';
    const deadline = setTimeout(finish, 1050);
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onPreference = () => { if (preference.matches) finish(); };
    preference.addEventListener('change', onPreference);
    return () => { clearTimeout(deadline); preference.removeEventListener('change', onPreference); };
  }, [visible, finish]);
  return <>
    <div className="site-route-content">{children}</div>
    {visible && <><div className="page-curtain" aria-label="Syntaflow introduction" onAnimationEnd={(event) => { if (event.target === event.currentTarget) finish(); }}>
      <div className="page-curtain__identity"><img src="/brand/syntaflow-mark.webp" width="64" height="64" alt="" /><span>FROM CONTEXT<br />TO ACTION.</span></div>
    </div><button className="page-curtain__skip" type="button" onClick={finish}>Skip intro</button></>}
  </>;
}
