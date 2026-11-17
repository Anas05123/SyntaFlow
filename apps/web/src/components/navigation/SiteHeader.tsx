import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { BrandMark } from '../brand/BrandMark';
import { Link } from '../ui/Link';
import { SiteIcon } from '../ui/SiteIcon';
import { useAuth } from '../../services/auth/AuthContext';

const sections = ['early-access', 'how-it-works', 'guided-preview', 'community', 'features', 'product'];

export function SiteHeader({ currentPath }: { currentPath: string }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState('product');
  const accountRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const isDocsHost = window.location.hostname === 'docs.syntaflow.tech';
  const home = currentPath === '/' && !isDocsHost;
  const siteBase = isDocsHost ? 'https://syntaflow.tech' : '';
  const accountHref = window.location.hostname.includes('syntaflow.tech') ? 'https://app.syntaflow.tech' : '/account';
  const homeAnchor = (id: string) => home ? `#${id}` : `${siteBase}/#${id}`;
  const links = [
    { label: 'Product', href: home ? '#product' : `${siteBase}/product`, active: home ? section === 'product' : currentPath.startsWith('/product') },
    { label: 'How it works', href: homeAnchor('how-it-works'), active: home && section === 'how-it-works' },
    { label: 'Features', href: homeAnchor('features'), active: home && section === 'features' },
    { label: 'Showcase', href: homeAnchor('guided-preview'), active: home && section === 'guided-preview' },
    { label: 'Community', href: homeAnchor('community'), active: home && section === 'community' },
    { label: 'About', href: `${siteBase}/about`, active: currentPath === '/about' },
  ];

  useEffect(() => {
    let frame = 0;
    const update = () => {
      setScrolled(window.scrollY > 12);
      if (home) {
        const active = sections.find((id) => {
          const element = document.getElementById(id);
          return element && element.getBoundingClientRect().top <= 120;
        });
        setSection(active ?? 'product');
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [home]);

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [currentPath]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && mobileOpen) {
        const last = document.querySelector<HTMLElement>('#sf-mobile-menu__last');
        if (event.shiftKey && document.activeElement === toggleRef.current) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          toggleRef.current?.focus();
        }
      }
      if (event.key !== 'Escape') return;
      if (mobileOpen) toggleRef.current?.focus();
      if (accountOpen) accountRef.current?.querySelector('button')?.focus();
      setMobileOpen(false);
      setAccountOpen(false);
    };
    const onClick = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) setAccountOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 921px)');
    const closeOnDesktop = () => { if (desktop.matches) setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    desktop.addEventListener('change', closeOnDesktop);
    const overflow = document.body.style.overflow;
    if (mobileOpen) document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
      desktop.removeEventListener('change', closeOnDesktop);
      if (mobileOpen) document.body.style.overflow = overflow;
    };
  }, [mobileOpen, accountOpen]);

  const signOut = async () => {
    setAccountOpen(false);
    await logout();
    window.location.href = '/';
  };

  const showLinks = (mobile: boolean) => links.map((item) => (
    <Link key={item.label} href={item.href} onClick={mobile ? () => setMobileOpen(false) : undefined}
      aria-current={item.active ? (home ? 'location' : 'page') : undefined}>{item.label}</Link>
  ));

  return (
    <header className={`sf-site-header${scrolled ? ' sf-site-header--scrolled' : ''}`}>
      <a className="sf-skip-link" href="#site-main">Skip to content</a>
      <div className="container sf-site-header__inner">
        <Link href={siteBase || '/'} className="sf-site-header__brand" aria-label="Syntaflow home"><BrandMark variant="full" size="md" textColor="var(--text-contrast)" /></Link>
        <nav className="sf-site-header__nav" aria-label="Main navigation">{showLinks(false)}</nav>
        <div className="sf-site-header__actions">
          {isAuthenticated ? (
            <div className="sf-site-header__account" ref={accountRef}>
              <button type="button" onClick={() => setAccountOpen(!accountOpen)} aria-expanded={accountOpen} aria-controls="sf-account-links">
                {user?.name?.split(' ')[0] || 'Account'} <SiteIcon name="angle-small-down" size={16} />
              </button>
              <AnimatePresence>
                {accountOpen && <m.div id="sf-account-links" className="sf-site-header__account-menu"
                  initial={reduceMotion ? false : { opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.15 }}>
                  <Link href={accountHref} onClick={() => setAccountOpen(false)}>Open account</Link>
                  <Link href={`${accountHref}/downloads`} onClick={() => setAccountOpen(false)}>Desktop downloads</Link>
                  <button type="button" onClick={signOut}>Sign out</button>
                </m.div>}
              </AnimatePresence>
            </div>
          ) : <Link href={`${siteBase}/login`} className="sf-site-header__signin">Sign in</Link>}
          <Link href={homeAnchor('early-access')} className="sf-site-header__cta">Get early access</Link>
        </div>
        <button ref={toggleRef} type="button" className="sf-site-header__toggle"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-controls="sf-mobile-menu"
          aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>
          <SiteIcon name={mobileOpen ? 'cross' : 'menu-burger'} />
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && <m.nav id="sf-mobile-menu" className="sf-mobile-menu" aria-label="Mobile navigation"
          initial={reduceMotion ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.17 }}>
          {showLinks(true)}
          <div className="sf-mobile-menu__actions">
            <Link href={isAuthenticated ? accountHref : `${siteBase}/login`} onClick={() => setMobileOpen(false)}>{isAuthenticated ? 'Open account' : 'Sign in'}</Link>
            <Link id="sf-mobile-menu__last" href={homeAnchor('early-access')} onClick={() => setMobileOpen(false)}>Get early access</Link>
          </div>
        </m.nav>}
      </AnimatePresence>
    </header>
  );
}
