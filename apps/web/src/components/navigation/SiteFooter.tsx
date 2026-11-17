import React from 'react';
import { BrandMark } from '../brand/BrandMark';
import { Link } from '../ui/Link';

export const SiteFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const docsHref = typeof window !== 'undefined' && window.location.hostname.includes('syntaflow.tech')
    ? 'https://docs.syntaflow.tech'
    : '/docs';

  const footerGroups = [
    {
      title: 'Product',
      links: [
        ['Try the sample', '/preview'],
        ['How it works', '/#how-it-works'],
        ['Product overview', '/product'],
        ['Client workspace', '/product/client-management'],
        ['Projects & tasks', '/product/projects'],
        ['Reviews & delivery', '/product/reviews-approvals'],
        ['Flow', '/product/ai-workspace'],
        ['Integrations', '/integrations'],
      ],
    },
    {
      title: 'Resources',
      links: [
        ['Preview & download', '/download'],
        ['Pricing', '/pricing'],
        ['Documentation', docsHref],
        ['FAQ', '/faq'],
        ['Changelog', '/changelog'],
        ['Sign in', '/login'],
      ],
    },
    {
      title: 'Company & legal',
      links: [
        ['About', '/about'],
        ['Roadmap', '/roadmap'],
        ['Contact', '/contact'],
        ['Security', '/security'],
        ['Privacy', '/privacy'],
        ['Terms', '/terms'],
      ],
    },
  ];

  return (
    <footer className="site-footer">
      <div className="container site-footer__container">
        <div className="site-footer__lead">
          <div className="site-footer__statement">
            <div className="site-footer__brand">
              <Link href="/" aria-label="Syntaflow Home">
                <BrandMark variant="full" size="md" textColor="var(--text-contrast)" />
              </Link>
            </div>
            <h2>From context to action.</h2>
            <p>
              A clearer picture of the people, projects and decisions behind your work.
            </p>
          </div>

          <aside className="site-footer__preview" aria-label="Syntaflow desktop preview">
            <span className="site-footer__preview-label">Desktop preview</span>
            <h3>Try a sample project before you download.</h3>
            <p>Explore the browser prototype beside real screens from the desktop app.</p>
            <Link href="/preview" className="site-footer__cta">Open the sample</Link>
          </aside>
        </div>

        <nav className="site-footer__navigation" aria-label="Footer navigation">
          {footerGroups.map((group) => (
            <div className="site-footer__group" key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.links.map(([label, href]) => (
                  <li key={label}><Link href={href}>{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="site-footer__bottom">
          <span>© {currentYear} Syntaflow. All rights reserved.</span>
          <span>Uicons by <a href="https://www.flaticon.com/uicons">Flaticon</a></span>
        </div>
      </div>
    </footer>
  );
};
