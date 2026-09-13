/**
 * D02-D04 · Document Workspace.
 *
 * A document is more than an editor: write, preview & export, and version
 * history are three views of one record. The save-state contract
 * (dirty / saving / saved / failed) is surfaced inline.
 */

import { useState } from 'react';

import { useStore } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate } from '../app/router';
import { formatDate, formatShortDate, initials, relative } from '../domain/dates';
import {
  Banner, Button, Card, CardBody, CardFoot, CardHead, Chip, Def, Defs, EmptyState,
  SaveStateIndicator, TabLink, Tabs, type SaveState,
} from '../ui/primitives';
import { Icon } from '../ui/Icon';
import { NotFound } from '../app/Shell';

type View = 'editor' | 'preview' | 'history';

const SECTION_BODY: Record<string, React.ReactNode> = {
  Positioning: (
    <>
      <p className="doc-p">
        Harbor &amp; Finch supply specialty ingredients to independent kitchens. The identity has to read as{' '}
        <strong>precise and generous</strong> at the same time — a supplier you trust with a signature dish, not a
        commodity line.
      </p>
      <p className="doc-p">
        The wordmark carries the weight. Everything else is a support system that lets the wordmark work at any size,
        in any medium, without supervision.
      </p>
    </>
  ),
  Wordmark: (
    <>
      <p className="doc-p">
        The wordmark is set in a modified grotesque with a horizontal stress on the ampersand. Two lockups are
        approved: horizontal for wide formats, stacked for square formats.
      </p>
      <ul className="doc-list">
        <li>Horizontal lockup — primary, used wherever width allows</li>
        <li>Stacked lockup — packaging, social avatars, stamps</li>
        <li>Mark only — favicons and physical embossing, minimum 8 mm</li>
      </ul>
    </>
  ),
  'Clear space and minimum size': (
    <>
      <p className="doc-p">
        Clear space equals the height of the lowercase <strong>h</strong> on all four sides. Nothing enters this
        field — no rules, no photography edges, no other logos.
      </p>
      <div className="doc-block" style={{ height: 150, marginTop: 16 }}>Clear-space diagram · image block</div>
      <p className="doc-p">Minimum sizes: 24 px digital, 18 mm print for the horizontal lockup.</p>
    </>
  ),
  Colour: (
    <>
      <p className="doc-p">
        The palette is built from a graphite structure with cobalt as a signature. Cobalt identifies action and
        state, never decoration.
      </p>
      <table className="doc-table">
        <thead>
          <tr><th>Role</th><th>Hex</th><th>Use</th></tr>
        </thead>
        <tbody>
          <tr><td>Harbor Cobalt</td><td>#2F6FEB</td><td>Primary action, active state</td></tr>
          <tr><td>Graphite</td><td>#14181C</td><td>Primary text, structure</td></tr>
          <tr><td>Bone</td><td>#F4F6F8</td><td>Reversed surfaces</td></tr>
          <tr><td>Signal Green</td><td>#3FA66B</td><td>Approved, complete</td></tr>
        </tbody>
      </table>
      <p className="doc-p">Reversed wordmarks require a background luminance below 45% or a solid scrim at 60% opacity.</p>
    </>
  ),
  Typography: (
    <p className="doc-p">
      One family, Inter, across every application. Hierarchy comes from size and weight, not from additional
      typefaces.
    </p>
  ),
  Applications: (
    <p className="doc-p">
      Packaging, trade stand and stationery applications are shown at working scale. The reversed logo over
      photography section is still under review.
    </p>
  ),
  Contact: <p className="doc-p">Direct brand questions to Northlight Studio. Response within one working day.</p>,
};

const SAVE_CYCLE: SaveState[] = ['saved', 'dirty', 'saving', 'failed'];

export function DocumentWorkspaceScreen({ documentId, view }: { documentId: string; view: string | null }) {
  const { state, dispatch, derived } = useStore();
  const overlay = useOverlay();
  const [save, setSave] = useState<SaveState>('saved');
  const [activeSection, setActiveSection] = useState(0);
  const [exportPct, setExportPct] = useState<number | null>(null);

  const active: View = view === 'preview' || view === 'history' ? view : 'editor';

  const doc = derived.documentById(documentId);
  if (!doc) return <NotFound kind="document" onHome={() => navigate('#/home')} />;

  const client = derived.clientById(doc.clientId);
  const project = derived.projectById(doc.projectId);
  const activeReview = derived.activeReviewOfDocument(doc.id);
  const versions = derived.reportsOfDocument(doc.id);
  const latest = doc.versions[0] ?? null;

  const header = (
    <Card className="context-head">
      <CardBody>
        <div className="row-between row-wrap">
          <div style={{ minWidth: 0 }}>
            <div className="row" style={{ gap: 9 }}>
              <h2>{doc.title}</h2>
              <Chip state={doc.reviewState} />
              <Chip state={doc.visibility} />
            </div>
            <div className="meta mt-4">
              {doc.type} · <a href={`#/clients/${client?.id}`}>{client?.name}</a> ·{' '}
              <a href={`#/projects/${project?.id}`}>{project?.name}</a> · working v{doc.workingVersion}
              {doc.submittedVersion ? ` · submitted v${doc.submittedVersion}` : ' · never submitted'}
            </div>
          </div>
          <div className="row row-wrap">
            <SaveStateIndicator state={save} />
            <Button
              size="sm"
              icon="refresh"
              onClick={() => setSave(SAVE_CYCLE[(SAVE_CYCLE.indexOf(save) + 1) % SAVE_CYCLE.length])}
              title="Cycle the save-state contract"
            >
              Simulate state
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  const tabs = (
    <div className="mb-20">
      <Tabs>
        <TabLink href={`#/documents/${doc.id}`} label="Write" selected={active === 'editor'} />
        <TabLink href={`#/documents/${doc.id}?view=preview`} label="Preview & export" selected={active === 'preview'} />
        <TabLink href={`#/documents/${doc.id}?view=history`} label="Version history" count={doc.versions.length} selected={active === 'history'} />
        {activeReview ? (
          <TabLink href={`#/documents/${doc.id}?view=guest-preview&review=${activeReview.id}`} label="Guest preview" selected={false} />
        ) : null}
      </Tabs>
    </div>
  );

  /* ---- D02 Write ---- */
  if (active === 'editor') {
    return (
      <div style={{ padding: 'var(--pad-page) var(--pad-page) 0' }}>
        {header}
        {tabs}
        <div className="doc-layout">
          <aside className="doc-outline">
            <div className="panel-section-title">Sections</div>
            {doc.sections.map((s, i) => (
              <button
                key={s}
                type="button"
                className={`outline-item${activeSection === i ? ' active' : ''}`}
                onClick={() => setActiveSection(i)}
              >
                {s}
              </button>
            ))}
            <div className="divider-h" style={{ margin: '16px 0' }} />
            <div className="panel-section-title">Formatting</div>
            <p className="meta" style={{ lineHeight: 1.6, padding: '0 9px' }}>
              V1 blocks: text, headings, lists, image and a simple table. Nothing else is available by design.
            </p>
          </aside>

          <div className="doc-body-col">
            <article className="doc-page">
              <div className="eyebrow">{doc.type} · {client?.name}</div>
              <h1 className="doc-h1">{doc.title}</h1>
              <p className="meta mt-8">
                Working draft v{doc.workingVersion} · {state.workspace.ownerName} · last saved {relative(doc.modified)}
              </p>

              {doc.sections.map((s) => (
                <section className="doc-section" key={s}>
                  <h2 className="doc-h2">{s}</h2>
                  {SECTION_BODY[s] ?? <p className="doc-p">This section is empty. Write the first paragraph.</p>}
                </section>
              ))}
            </article>
          </div>

          <aside className="doc-rail">
            <div className="panel-section-title">Current version</div>
            <div className="immutable">
              <div>
                <div className="strong" style={{ fontSize: 'var(--fs-label)' }}>
                  Working draft v{doc.workingVersion}
                </div>
                <div className="meta">
                  {doc.submittedVersion ? `Submitted: v${doc.submittedVersion}` : 'Never submitted'}
                </div>
              </div>
            </div>

            <div className="panel-section">
              <div className="panel-section-title">Internal notes</div>
              <p className="meta" style={{ lineHeight: 1.6 }}>
                {doc.internalNote || 'No internal notes.'}
              </p>
              <p className="meta mt-8">
                <Icon name="lock" size={12} /> Never visible to guests.
              </p>
            </div>

            {activeReview ? (
              <div className="panel-section">
                <div className="panel-section-title">Open review request</div>
                <Banner
                  title={`Awaiting ${activeReview.reviewer.name}`}
                  sub={`v${activeReview.version} · due ${formatShortDate(activeReview.due)}`}
                />
                <div className="stack-tight mt-12">
                  <Button
                    block
                    variant="primary"
                    icon="external"
                    onClick={() => navigate(`#/documents/${doc.id}?view=guest-preview&review=${activeReview.id}`)}
                  >
                    Open guest preview
                  </Button>
                </div>
              </div>
            ) : null}

            <div className="panel-section">
              <div className="panel-section-title">Client feedback</div>
              {latest && latest.decision === 'changes' ? (
                <div className="comment">
                  <span className="avatar">MV</span>
                  <div>
                    <div className="comment-head">
                      <span className="comment-author">Marta Velasco</span>
                      <span className="meta">{formatDate(latest.date)}</span>
                    </div>
                    <div className="comment-body">
                      We need a wider secondary colour range for the trade-stand work, and the reversed logo needs its
                      own section.
                    </div>
                  </div>
                </div>
              ) : (
                <p className="meta">No client feedback yet.</p>
              )}
            </div>

            <div className="panel-section">
              <div className="panel-section-title">Actions</div>
              <div className="stack-tight">
                <Button
                  block
                  variant="primary"
                  icon="send"
                  disabled={save !== 'saved'}
                  onClick={() => navigate(`#/share?document=${doc.id}`)}
                >
                  Request review
                </Button>
                <Button block icon="eye" onClick={() => navigate(`#/documents/${doc.id}?view=preview`)}>
                  Preview &amp; export
                </Button>
                <Button block icon="history" onClick={() => navigate(`#/documents/${doc.id}?view=history`)}>
                  Version history
                </Button>
              </div>
              <p className="meta mt-12">
                {save === 'saved'
                  ? 'Submitting freezes a numbered version. It is never overwritten afterwards.'
                  : 'A review request needs a saved draft. Resolve the save state first.'}
              </p>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  /* ---- D03 Preview & export ---- */
  if (active === 'preview') {
    return (
      <div style={{ padding: 'var(--pad-page) var(--pad-page) 40px' }}>
        {header}
        {tabs}
        <div className="split">
          <Card>
            <CardHead
              title="Paginated preview"
              desc={`Page 1 of 24 · identifies its version on every page.`}
              action={<Chip state="neutral" label={`v${doc.workingVersion}`} />}
            />
            <CardBody>
              <div style={{ background: 'var(--canvas)', border: '1px solid var(--divider)', borderRadius: 4, margin: '0 auto', maxWidth: 560, padding: '38px 40px' }}>
                <div className="row-between">
                  <span className="eyebrow" style={{ margin: 0 }}>{doc.title}</span>
                  <span className="meta">v{doc.workingVersion} · page 1</span>
                </div>
                <h2 className="mt-16" style={{ fontSize: 24 }}>{doc.sections[0]}</h2>
                <p className="doc-p">{SECTION_BODY[doc.sections[0]] ?? 'Preview content.'}</p>
                <div className="divider-h" style={{ margin: '24px 0 10px' }} />
                <div className="row-between">
                  <span className="meta">{client?.name}</span>
                  <span className="meta">Prepared by {state.workspace.ownerName}</span>
                </div>
              </div>
            </CardBody>
            <CardFoot>
              <div className="row-between row-wrap">
                <span className="meta">The PDF identifies its version. Previewing never counts as sharing.</span>
                <Button
                  variant="primary"
                  icon="download"
                  disabled={exportPct !== null && exportPct < 100}
                  onClick={() => {
                    setExportPct(0);
                    let pct = 0;
                    const timer = window.setInterval(() => {
                      pct += 8;
                      setExportPct(Math.min(pct, 100));
                      if (pct >= 100) {
                        window.clearInterval(timer);
                        window.setTimeout(() => {
                          setExportPct(null);
                          overlay.toast('Export complete', `${doc.title.toLowerCase().replace(/\s+/g, '-')}-v${doc.workingVersion}.pdf · 24 pages`, 'ok');
                        }, 700);
                      }
                    }, 220);
                  }}
                >
                  Export PDF
                </Button>
              </div>
              {exportPct !== null ? (
                <div style={{ marginTop: 14 }}>
                  <div className="progress">
                    <div className="progress-track">
                      <div className={exportPct >= 100 ? 'progress-fill ok' : 'progress-fill'} style={{ width: `${exportPct}%` }} />
                    </div>
                    <span className="progress-label">
                      {exportPct >= 100 ? 'Export complete' : `Rendering ${Math.round((exportPct / 100) * 24)} of 24 pages`}
                    </span>
                  </div>
                </div>
              ) : null}
            </CardFoot>
          </Card>

          <div className="stack">
            <Card>
              <CardHead title="Export settings" />
              <CardBody>
                <div className="stack">
                  <div className="field">
                    <label className="field-label" htmlFor="template">Brand / template</label>
                    <select className="select" id="template" defaultValue="default">
                      <option value="default">{state.workspace.name} — default</option>
                      <option value="client">Client brand override</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">Include</label>
                    <div className="stack-tight">
                      <label className="check"><input type="checkbox" defaultChecked /><span className="check-text">Section outline</span></label>
                      <label className="check"><input type="checkbox" defaultChecked /><span className="check-text">Version identifier on every page</span></label>
                      <label className="check"><input type="checkbox" /><span className="check-text">Internal notes <span className="meta">(never exported by default)</span></span></label>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHead title="Next step" />
              <CardBody>
                <p className="meta" style={{ lineHeight: 1.6 }}>
                  Previewing is not sharing. To let the client decide, open Review &amp; share setup and grant access
                  to one exact version.
                </p>
                <Button block variant="primary" className="mt-12" icon="send" onClick={() => navigate(`#/share?document=${doc.id}`)}>
                  Request review
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  /* ---- D04 Version history ---- */
  return (
    <div style={{ padding: 'var(--pad-page) var(--pad-page) 40px' }}>
      {header}
      {tabs}
      <div className="split">
        <Card>
          <CardHead
            title="Submitted versions"
            desc="Numbered, immutable, and never overwritten. A new draft copies forward from any version."
          />
          <CardBody flush>
            {doc.versions.length === 0 ? (
              <EmptyState
                icon="history"
                title="No submitted version"
                text="This document has never been submitted for review. Submitting freezes a numbered version."
              />
            ) : (
              <>
                <div className="version current">
                  <span className="version-mark">v{doc.workingVersion}</span>
                  <div>
                    <div className="version-title">
                      Working draft v{doc.workingVersion}{' '}
                      <span className="chip tone-accent" style={{ marginLeft: 6 }}>Current</span>
                    </div>
                    <div className="version-meta">
                      Editable · based on v{Math.max(doc.submittedVersion, 1)} · last saved {relative(doc.modified)}
                    </div>
                  </div>
                  <div className="item-side">
                    <Button size="sm" onClick={() => navigate(`#/documents/${doc.id}`)}>Open editor</Button>
                  </div>
                </div>

                {doc.versions.map((v) => {
                  const rv = versions.find((r) => r.version === v.n);
                  const deliveredTo = state.deliveries.find(
                    (d) => d.projectId === doc.projectId && d.fileIds.length > 0 && d.deliveredOn
                  );
                  const stateKey = rv
                    ? rv.state
                    : v.decision === 'approved'
                      ? 'approved'
                      : v.decision === 'changes'
                        ? 'changes-requested'
                        : 'superseded';
                  return (
                    <div className="version" key={v.n}>
                      <span className="version-mark">v{v.n}</span>
                      <div style={{ minWidth: 0 }}>
                        <div className="version-title">
                          Submitted v{v.n} <Chip state={stateKey} />
                        </div>
                        <div className="version-meta">
                          {v.author} · {formatDate(v.date)} · {v.note}
                        </div>
                        {rv && rv.comments.length > 0 ? (
                          <div className="comment" style={{ paddingBottom: 0 }}>
                            <span className="avatar">{initials(rv.comments[0].author)}</span>
                            <div>
                              <div className="comment-head">
                                <span className="comment-author">{rv.comments[0].author}</span>
                                <span className="meta">{formatDate(rv.comments[0].date)}</span>
                              </div>
                              <div className="comment-body">{rv.comments[0].body}</div>
                            </div>
                          </div>
                        ) : null}
                        {deliveredTo ? (
                          <div className="row mt-8" style={{ gap: 6 }}>
                            <Icon name="package" size={13} />
                            <span className="meta">Referenced by delivery package “{deliveredTo.title}”</span>
                          </div>
                        ) : null}
                      </div>
                      <div className="item-side" style={{ display: 'flex', gap: 6 }}>
                        {rv ? (
                          <Button
                            size="sm"
                            icon="eye"
                            onClick={() => navigate(`#/documents/${doc.id}?view=guest-preview&review=${rv.id}`)}
                            title={`Preview guest review for v${v.n}`}
                          >
                            Guest preview
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          onClick={() => {
                            dispatch({ type: 'document/submitVersion', id: doc.id, note: `Copied forward from v${v.n}.` });
                            overlay.toast('Draft created', `A new working draft was copied forward from v${v.n}.`, 'ok');
                          }}
                        >
                          Copy to new draft
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </CardBody>
        </Card>

        <div className="stack">
          <Card>
            <CardHead title="Version rules" />
            <CardBody>
              <ul className="doc-list" style={{ marginTop: 0 }}>
                <li>A submitted version is never overwritten.</li>
                <li>Approving a stale or withdrawn request is rejected.</li>
                <li>Repeated submit clicks do not duplicate events.</li>
                <li>Every event records actor, time, version and outcome.</li>
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardHead title="This document" />
            <CardBody>
              <Defs>
                <Def k="Type">{doc.type}</Def>
                <Def k="Visibility"><Chip state={doc.visibility} /></Def>
                <Def k="Reviewer">{activeReview ? activeReview.reviewer.name : 'Not designated'}</Def>
                <Def k="Versions">{doc.versions.length} submitted</Def>
              </Defs>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
