import React, { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import { SEOHead } from '../components/ui/SEOHead';
import { Link } from '../components/ui/Link';
import '../styles/preview-page.css';

type Stage = 'client' | 'project' | 'work' | 'review' | 'approval' | 'delivery';
type Decision = 'waiting' | 'approved' | 'changes';
const stages: { id: Stage; label: string; image: string; proof: string }[] = [
  { id: 'client', label: 'Client', image: '/product-screens/current/client.png', proof: 'Client record in the current desktop build' },
  { id: 'project', label: 'Project', image: '/product-screens/current/project-crop.png', proof: 'Project overview in the current desktop build' },
  { id: 'work', label: 'Work', image: '/product-screens/current/work-crop.png', proof: 'Project tasks in the current desktop build' },
  { id: 'review', label: 'Review', image: '/product-screens/current/review-detail-crop.png', proof: 'Submitted review in the current desktop build' },
  { id: 'approval', label: 'Approval', image: '/product-screens/current/approval-crop.png', proof: 'An earlier approved brief in the current desktop build' },
  { id: 'delivery', label: 'Delivery', image: '/product-screens/current/delivery-crop.png', proof: 'Delivery gate in the current desktop build' },
];
const stageIndex = (stage: Stage) => stages.findIndex((item) => item.id === stage);
const guideUrl = import.meta.env.VITE_TOUR_GUIDE_URL as string | undefined;

export const PreviewPage: React.FC = () => {
  const [stage, setStage] = useState<Stage>('client');
  const [taskDone, setTaskDone] = useState(false);
  const [decision, setDecision] = useState<Decision>('waiting');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const [flowOpen, setFlowOpen] = useState(false);
  const [intent, setIntent] = useState('');
  const [guideMessage, setGuideMessage] = useState('');
  const [guiding, setGuiding] = useState(false);
  const [proofOpen, setProofOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const current = stages[stageIndex(stage)];

  useEffect(() => {
    if (!flowOpen && !proofOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = document.querySelector<HTMLElement>(flowOpen ? '.preview-flow' : '.preview-lightbox');
    dialog?.querySelector<HTMLElement>('button')?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setFlowOpen(false); setProofOpen(false); return; }
      if (event.key !== 'Tab' || !dialog) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>('button, a, input, textarea'));
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKey); previous?.focus(); };
  }, [flowOpen, proofOpen]);

  const reset = () => {
    setStage('client'); setTaskDone(false); setDecision('waiting'); setComment('');
    setComments([]); setFlowOpen(false); setGuideMessage('Sample restored to its starting state.');
  };

  const suggest = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = intent.trim();
    if (!value || !guideUrl) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 7000);
    setGuiding(true); setGuideMessage('');
    try {
      const response = await fetch(guideUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ intent: value.slice(0, 180) }), signal: controller.signal });
      if (!response.ok) throw new Error('Guide unavailable');
      const result: { stage?: string; confident?: boolean } = await response.json();
      const match = stages.find((item) => item.id === result.stage);
      if (!match || result.confident !== true) throw new Error('No clear match');
      setStage(match.id);
      setGuideMessage(`Start with ${match.label.toLowerCase()}. Every screen remains available.`);
    } catch {
      setGuideMessage('No suggestion right now. Choose a screen directly.');
    } finally {
      window.clearTimeout(timeout); setGuiding(false);
    }
  };

  const addComment = (event: React.FormEvent) => {
    event.preventDefault();
    const value = comment.trim();
    if (!value) return;
    setComments((items) => [...items, value.slice(0, 280)]);
    setComment('');
  };

  return <MotionConfig reducedMotion="user">
    <div className="preview-page">
      <SEOHead path="/preview" />
      <section className="preview-intro">
        <div className="container preview-intro__grid">
          <div><span className="preview-label">Interactive sample</span><h1>Try a client project before you download.</h1><p>Open a real sample engagement, move through its work, and see why a review decision does not automatically make every file ready for delivery.</p><div className="preview-intro__actions"><a href="#sample-workspace" className="preview-primary">Open the sample</a><Link href="/download" className="preview-text-link">Check Windows preview</Link></div></div>
          <div className="preview-intro__note"><strong>A prototype, with real app proof</strong><p>The interactive workspace below is a browser simulation based on Syntaflow’s sample records. The capture beside each screen comes from the actual desktop renderer. Nothing you try here changes an account.</p></div>
        </div>
      </section>

      <section className="preview-experience" id="sample-workspace" aria-labelledby="preview-title">
        <div className="container">
          <div className="preview-experience__heading"><div><span className="preview-label">Harbor & Finch</span><h2 id="preview-title">Brand identity system</h2><p>One client, one project, and the decisions around it.</p></div><button type="button" className="preview-reset" onClick={reset}>Reset sample</button></div>
          {guideUrl && <form className="preview-guide" onSubmit={suggest}><label htmlFor="preview-intent">Where would you start?</label><div><input id="preview-intent" value={intent} onChange={(event) => setIntent(event.target.value)} maxLength={180} placeholder="For example, I need to check a client review" /><button type="submit" disabled={guiding || intent.trim().length < 3}>{guiding ? 'Finding a screen…' : 'Suggest a screen'}</button></div><p role="status">{guideMessage || 'Optional guide. You can choose any screen below.'}</p></form>}
          {!guideUrl && <p className="preview-guide-status" role="status">{guideMessage}</p>}

          <div className="preview-app" aria-label="Sample Syntaflow workspace">
            <div className="preview-app__bar"><span className="preview-app__brand">Syntaflow</span><span>Sample workspace</span><span className="preview-app__badge">Prototype</span></div>
            <div className="preview-app__body">
              <nav className="preview-app__rail" aria-label="Sample engagement screens">{stages.map((item) => <button key={item.id} type="button" onClick={() => setStage(item.id)} aria-current={stage === item.id ? 'page' : undefined} className={stage === item.id ? 'is-active' : ''}>{item.label}</button>)}<button type="button" onClick={() => setFlowOpen(true)}>Flow</button></nav>
              <div className="preview-app__main">
                <div className="preview-app__crumb">Harbor & Finch <span>/</span> Brand identity system <span>/</span> {current.label}</div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={stage} className="preview-view" initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
                    {stage === 'client' && <><div className="preview-view__top"><div><span className="preview-kicker">Client record</span><h3>Harbor & Finch</h3><p>Retail & lifestyle · Active client</p></div><span className="preview-status preview-status--mint">Active</span></div><div className="preview-summary"><div><span>Next action</span><strong>Review requested on brand guidelines v3</strong></div><div><span>Primary contact</span><strong>Marta Velasco</strong><small>Marketing Director</small></div></div><div className="preview-list"><div><span>Project</span><strong>Brand identity system</strong><button type="button" onClick={() => setStage('project')}>Open project</button></div><div><span>Waiting on client</span><strong>Brand guidelines version 3</strong><button type="button" onClick={() => setStage('review')}>Open review</button></div></div></>}
                    {stage === 'project' && <><div className="preview-view__top"><div><span className="preview-kicker">Project workspace</span><h3>Brand identity system</h3><p>A complete identity system the team can apply without asking us.</p></div><span className="preview-status preview-status--amber">In review</span></div><div className="preview-summary preview-summary--three"><div><span>Do next</span><strong>Review requested on brand guidelines v3</strong></div><div><span>Next milestone</span><strong>Guidelines approved</strong></div><div><span>Waiting on client</span><strong>One review decision</strong></div></div><div className="preview-shortcuts"><button type="button" onClick={() => setStage('work')}>Open work</button><button type="button" onClick={() => setStage('review')}>Open review</button><button type="button" onClick={() => setStage('delivery')}>Check delivery</button></div></>}
                    {stage === 'work' && <><div className="preview-view__top"><div><span className="preview-kicker">Project work</span><h3>What is moving?</h3><p>Tasks stay attached to this project, even when a review is waiting.</p></div><span className="preview-status">{taskDone ? '3 of 4 done' : '2 of 4 done'}</span></div><div className="preview-list preview-tasks"><label><input type="checkbox" checked={taskDone} onChange={(event) => setTaskDone(event.target.checked)} /><span><strong>Export packaging artwork at press resolution</strong><small>High priority · Sample action</small></span></label><div><span>Waiting</span><strong>Chase Harbor & Finch on guidelines review</strong><small>Depends on the client’s decision</small></div><div><span>Done</span><strong>Apply type scale to packaging labels</strong></div><div><span>Done</span><strong>Write guidelines section on clear space</strong></div></div><button type="button" className="preview-inline-action" onClick={() => setStage('review')}>Continue to the submitted review</button></>}
                    {stage === 'review' && <><div className="preview-view__top"><div><span className="preview-kicker">Exact-version review</span><h3>Brand guidelines <span>v3</span></h3><p>Submitted to Marta Velasco. Working draft v4 is separate.</p></div><span className={`preview-status ${decision === 'approved' ? 'preview-status--mint' : 'preview-status--amber'}`}>{decision === 'waiting' ? 'Waiting for decision' : decision === 'approved' ? 'Sample approved' : 'Sample changes requested'}</span></div><div className="preview-review"><div className="preview-document"><span>Submitted snapshot · version 3</span><h4>Brand guidelines</h4><p>Positioning · Wordmark · Clear space and minimum size · Colour · Typography · Applications</p><div className="preview-document__rule" /><small>Later edits belong to another draft.</small></div><div className="preview-comments"><strong>Discussion on v3</strong><p>“The clear-space rule reads much better. Is there a minimum contrast rule for the reversed wordmark over photography?”</p>{comments.map((item, index) => <p key={`${index}-${item}`} className="preview-comments__added">Sample note: {item}</p>)}<form onSubmit={addComment}><label htmlFor="preview-comment">Add a sample note</label><textarea id="preview-comment" value={comment} maxLength={280} onChange={(event) => setComment(event.target.value)} rows={2} placeholder="Your note stays in this browser session" /><button type="submit" disabled={!comment.trim()}>Add note</button></form></div></div><div className="preview-decision"><span>Try a sample decision for v3</span><button type="button" onClick={() => { setDecision('approved'); setStage('approval'); }}>Approve sample version</button><button type="button" onClick={() => { setDecision('changes'); setStage('approval'); }}>Request changes</button></div></>}
                    {stage === 'approval' && <><div className="preview-view__top"><div><span className="preview-kicker">Decision record</span><h3>Which version was accepted?</h3><p>Approval belongs to the exact submitted version, not to every future change.</p></div></div><div className="preview-list"><div><span>Project brief · v1</span><strong>Approved at kick-off</strong><small>Existing sample record, approved by Marta Velasco</small></div><div><span>Brand guidelines · v3</span><strong>{decision === 'waiting' ? 'Awaiting a decision' : decision === 'approved' ? 'Approved in this sample' : 'Changes requested in this sample'}</strong><small>{decision === 'waiting' ? 'The desktop sample starts with this review waiting.' : 'This trial decision exists only in the browser prototype.'}</small></div></div><button type="button" className="preview-inline-action" onClick={() => setStage('delivery')}>Check the handoff gate</button></>}
                    {stage === 'delivery' && <><div className="preview-view__top"><div><span className="preview-kicker">Delivery gate</span><h3>Check the files before handoff.</h3><p>Identity system handover for Marta Velasco.</p></div><span className="preview-status preview-status--amber">Blocked</span></div><div className="preview-gate"><strong>Two files still need approval</strong><p>The captured desktop delivery view reports 2 approvals outstanding. A trial decision here does not change that captured state, and no handoff can be recorded in this prototype.</p></div><div className="preview-list"><div><span>Approved</span><strong>harbor-finch-logo-package.zip</strong></div><div><span>Needs approval</span><strong>packaging-artwork-press.pdf</strong></div><div><span>Approved</span><strong>colour-specification-v1.pdf</strong></div></div><button type="button" className="preview-inline-action" onClick={() => setStage('review')}>Return to review</button></>}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="preview-proof"><div><span className="preview-label">Compare with the desktop app</span><h3>{current.proof}</h3><p>Captured from Syntaflow’s desktop renderer with the same sample engagement. This image is product evidence; the interactive view above is a prototype.</p></div><figure><img src={current.image} alt={current.proof} loading="lazy" /><figcaption>{current.proof}</figcaption></figure><button type="button" onClick={() => setProofOpen(true)}>View real screen larger</button></div>
        </div>
      </section>

      {flowOpen && <div className="preview-overlay" role="presentation" onMouseDown={() => setFlowOpen(false)}><div className="preview-flow" role="dialog" aria-modal="true" aria-label="Sample Flow context" onMouseDown={(event) => event.stopPropagation()}><button type="button" onClick={() => setFlowOpen(false)}>Close</button><span className="preview-kicker">Flow · sample context</span><h2>Brand identity system</h2><p>Flow works from the open project. In this prototype, the suggested next steps are fixed sample content.</p><ul><li>Summarize the waiting review</li><li>Prepare a client follow-up draft</li><li>Inspect delivery blockers</li></ul><button type="button" onClick={() => { setFlowOpen(false); setStage('delivery'); }}>Inspect delivery blockers</button></div></div>}
      {proofOpen && <div className="preview-overlay" role="presentation" onMouseDown={() => setProofOpen(false)}><div className="preview-lightbox" role="dialog" aria-modal="true" aria-label={`${current.label} desktop capture`} onMouseDown={(event) => event.stopPropagation()}><button type="button" onClick={() => setProofOpen(false)}>Close</button><img src={current.image} alt={current.proof} /></div></div>}
    </div>
  </MotionConfig>;
};
