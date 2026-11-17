import React, { useEffect } from 'react';
import { SEOHead } from '../components/ui/SEOHead';
import { Link } from '../components/ui/Link';
import '../styles/docs-redesign.css';

const topics = [
  { id: 'start', number: '01', title: 'Get started', summary: 'Install the preview and open your first workspace.', steps: ['Access the Windows preview from your account download page.', 'Install the desktop app, then choose Sign in with browser.', 'Create a client and a project to give the work a place.'] },
  { id: 'day', number: '02', title: 'Start with Home', summary: 'Find work that needs a response.', steps: ['Open Home to see today’s attention view.', 'Follow an item into its client or project.', 'Return to Home when you need the wider picture.'] },
  { id: 'project', number: '03', title: 'Run a project', summary: 'Keep tasks and work with the engagement.', steps: ['Open the client record and its project.', 'Add work items and keep their status current.', 'Use the project view to see what is waiting.'] },
  { id: 'client-update', number: '04', title: 'Understand a client update', summary: 'Keep feedback and its source in the same project.', steps: ['In Project Overview, find Project updates and paste the client’s update.', 'Choose Understand update. Read the interpretation and the original excerpt.', 'Review any possible scope change against your agreement before committing to the extra work.'] },
  { id: 'review', number: '04', title: 'Review a version', summary: 'Keep feedback attached to what was submitted.', steps: ['Submit the version you want reviewed.', 'Read comments and the decision beside that version.', 'Create a new review when a later version needs its own decision.'] },
  { id: 'delivery', number: '05', title: 'Check delivery', summary: 'Know what is approved before external handoff.', steps: ['Open the project delivery view.', 'Resolve items still waiting for approval.', 'Record the external handoff when the work is ready. Syntaflow does not send files automatically.'] },
  { id: 'flow', number: '06', title: 'Use Flow', summary: 'Ask for help from the current work context.', steps: ['Open Flow from the desktop workspace.', 'Review its result before you use it.', 'Keep project decisions in the project record.'] },
] as const;

export const DocsPage: React.FC = () => {
  useEffect(() => {
    const anchor = window.location.hash.slice(1);
    if (topics.some((topic) => topic.id === anchor)) {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'instant' });
    }
  }, []);
  return <div className="docs-new">
  <SEOHead path="/docs" />
  <section className="docs-new__hero"><div className="container"><span className="outcome-eyebrow">Syntaflow guide</span><h1>From first project to handoff.</h1><p>Short, practical guides for the current desktop preview. Start where you are in the engagement.</p></div></section>
  <div className="container docs-new__layout"><nav aria-label="Guide topics"><span>On this page</span>{topics.map(topic => <a key={topic.id} href={'#' + topic.id}>{topic.title}</a>)}<Link href="/download">Get the preview</Link></nav><div className="docs-new__articles">{topics.map(topic => <section id={topic.id} key={topic.id}><h2>{topic.title}</h2><p>{topic.summary}</p><ol>{topic.steps.map(step => <li key={step}>{step}</li>)}</ol></section>)}<aside><h2>Need more help?</h2><p>Tell us what you were trying to do and where you got stuck.</p><Link href="/contact">Contact Syntaflow</Link></aside></div></div>
</div>;
};
