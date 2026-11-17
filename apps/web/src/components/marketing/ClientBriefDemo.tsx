import { useRef, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { SiteIcon } from '../ui/SiteIcon';

const details = [
  { field: 'Deliverables', value: 'Brand guidelines PDF and logo exports', state: 'Confirmed', source: '“Let’s go ahead with the brand guidelines PDF and logo exports.”' },
  { field: 'Deadline', value: 'Friday, for the guidelines PDF', state: 'Confirmed', source: '“Could you send the PDF by Friday?” The export deadline is unspecified.' },
  { field: 'Revision limit', value: 'One round on the guidelines', state: 'Confirmed', source: '“One round of revisions on the guidelines works for us.”' },
  { field: 'Social templates', value: 'Likely separate from the original brief', state: 'Inferred', source: 'The agreed deliverables name only the PDF and logo exports. Confirm before quoting.' },
  { field: 'Budget', value: 'Ask the client to confirm', state: 'Unknown', source: 'No amount appears in these sample messages.' },
] as const;

export function ClientBriefDemo() {
  const [view, setView] = useState<'message' | 'brief' | 'scope'>('message');
  const [analyzed, setAnalyzed] = useState(false);
  const clientRequest = useRef<HTMLButtonElement>(null);
  const focusBrief = useRef(false);
  const reduceMotion = useReducedMotion();

  const analyze = () => {
    focusBrief.current = true;
    setAnalyzed(true);
    setView('brief');
  };

  const reset = () => {
    clientRequest.current?.focus({ preventScroll: true });
    setAnalyzed(false);
    setView('message');
  };

  return (
    <div className="story-demo" id="brief-demo" aria-label="Interactive client brief example">
      <div className="story-demo__bar">
        <span><SiteIcon name="folder" size={17} /> Harbor &amp; Finch</span>
        <span>Sample data</span>
      </div>
      <div className="story-demo__nav" role="group" aria-label="Example views">
        <button ref={clientRequest} type="button" aria-pressed={view === 'message'} onClick={() => setView('message')}>Client request</button>
        <button type="button" disabled={!analyzed} aria-pressed={view === 'brief'} onClick={() => setView('brief')}>Project brief</button>
        <button type="button" disabled={!analyzed} aria-pressed={view === 'scope'} onClick={() => setView('scope')}>Scope check</button>
      </div>
      <AnimatePresence initial={false} mode="wait">
        <m.div
          key={view}
          className="story-demo__body"
          initial={reduceMotion ? false : { opacity: 0, y: 7 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.17 }}
        >
          {view === 'message' && <>
            <h3>Brand identity project</h3>
            <div className="story-demo__messages">
              <blockquote><span>Original request</span>“Let’s go ahead with the brand guidelines PDF and logo exports. Could you send the PDF by Friday? One round of revisions on the guidelines works for us.”</blockquote>
              <blockquote><span>Follow-up</span>“Could you also make three social templates for launch?”</blockquote>
            </div>
            <m.button type="button" className="story-action" whileTap={reduceMotion ? undefined : { scale: 0.97 }} onClick={analyze}>
              <SiteIcon name="sparkles" size={17} /> Analyze sample
            </m.button>
          </>}
          {view === 'brief' && <>
            <h3 tabIndex={-1} ref={(element) => {
              if (!element || !focusBrief.current) return;
              focusBrief.current = false;
              if (document.activeElement === document.body) element.focus({ preventScroll: true });
            }}>What we know so far</h3>
            <p>Open any row to inspect its source.</p>
            <div className="story-demo__evidence">
              {details.map((item) => (
                <details key={item.field}>
                  <summary><span><strong>{item.field}</strong>{item.value}</span><small>{item.state}</small><SiteIcon name="angle-small-down" size={17} /></summary>
                  <p>{item.source}</p>
                </details>
              ))}
            </div>
          </>}
          {view === 'scope' && <>
            <h3>Three social templates</h3>
            <div className="story-demo__scope">
              <p><SiteIcon name="shield-check" /> <strong>Possible addition to scope</strong></p>
              <dl>
                <div><dt>Originally agreed</dt><dd>Brand guidelines PDF and logo exports</dd></div>
                <div><dt>New request</dt><dd>Three social templates for launch</dd></div>
              </dl>
            </div>
            <details className="story-demo__reply">
              <summary>See a suggested reply <SiteIcon name="angle-small-down" size={18} /></summary>
              <blockquote>“I can help with the three templates. They’re separate from the PDF and logo exports we agreed on. Could you confirm the formats and launch date so I can estimate the work?”</blockquote>
            </details>
          </>}
        </m.div>
      </AnimatePresence>
      <div className="story-demo__foot">
        <span>Prepared example. No live AI or client data.</span>
        {analyzed && <button type="button" onClick={reset}>Reset example</button>}
      </div>
      <p className="story-visually-hidden" role="status">{analyzed ? `Example ready. Showing ${view === 'brief' ? 'project brief' : view === 'scope' ? 'scope check' : 'client request'}.` : ''}</p>
    </div>
  );
}
