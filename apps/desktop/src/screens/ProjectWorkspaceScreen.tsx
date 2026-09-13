/**
 * P02-P06 · Project Workspace.
 *
 * The identity and context header is shared by every tab, as the page contract
 * requires: "Keep its identity and context visible throughout."
 * Tabs: Overview, Work, Documents & Files, Reviews, Delivery.
 */

import { useState } from 'react';

import { useStore } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate } from '../app/router';
import { dueLabel, formatDate, formatShortDate, initials, relative } from '../domain/dates';
import {
  Banner, Button, Card, CardBody, CardFoot, CardHead, Chip, Def, Defs, EmptyState,
  IconButton, Progress, TabLink, Tabs, TextInput, Tick,
} from '../ui/primitives';
import { Icon } from '../ui/Icon';
import { NotFound } from '../app/Shell';
import { TaskRow } from '../components/TaskRow';
import type { ProjectStage } from '../domain/types';

type Tab = 'overview' | 'work' | 'documents' | 'reviews' | 'delivery';

const TABS: Tab[] = ['overview', 'work', 'documents', 'reviews', 'delivery'];

export function ProjectWorkspaceScreen({ projectId, tab }: { projectId: string; tab: string | null }) {
  const { state, dispatch, derived } = useStore();
  const overlay = useOverlay();
  const [scopeDraft, setScopeDraft] = useState(false);

  const active: Tab = TABS.includes((tab ?? 'overview') as Tab) ? ((tab ?? 'overview') as Tab) : 'overview';

  const project = derived.projectById(projectId);
  if (!project) return <NotFound kind="project" onHome={() => navigate('#/home')} />;

  const client = derived.clientById(project.clientId);
  const pTasks = derived.tasksOfProject(project.id);
  const done = pTasks.filter((t) => t.status === 'done').length;
  const pDocs = derived.documentsOfProject(project.id);
  const pReviews = derived.reviewsOfProject(project.id);
  const delivery = derived.deliveryOfProject(project.id);
  const pFiles = derived.filesOfProject(project.id);

  const tabHref = (t: Tab) => `#/projects/${project.id}?tab=${t}`;

  return (
    <>
      {/* ---- shared context header ---- */}
      <Card className="context-head">
        <CardBody>
          <div className="row-between row-wrap">
            <div style={{ minWidth: 0 }}>
              <div className="row" style={{ gap: 9 }}>
                <h2>{project.name}</h2>
                <Chip state={project.stage} />
              </div>
              <div className="meta mt-4">
                <a href={`#/clients/${client?.id}`}>{client?.name}</a> · scope{' '}
                {project.scopeAccepted ? (
                  <>accepted {formatDate(project.scopeAcceptedOn)}</>
                ) : (
                  <span className="mark-wait">not yet accepted</span>
                )}{' '}
                · started {project.startedOn ? formatDate(project.startedOn) : 'not started'}
              </div>
            </div>
            <div className="row">
              <Button
                size="sm"
                variant="ghost"
                icon="link"
                onClick={() => overlay.toast('Link copied', 'Only people with a grant can open it.', 'ok')}
              >
                Copy link
              </Button>
              <IconButton
                icon="dots"
                label="Project actions"
                bordered
                onClick={() => overlay.openModal('project-menu', project.id)}
              />
            </div>
          </div>

          <div className="context-grid">
            <div>
              <div className="metric-label">Next action</div>
              <div className={`mt-4 ${project.nextActionTone === 'risk' ? 'mark-risk' : 'strong'}`} style={{ fontSize: 'var(--fs-label)' }}>
                {project.nextAction}
              </div>
            </div>
            <div>
              <div className="metric-label">Next milestone</div>
              <div className="mt-4 strong" style={{ fontSize: 'var(--fs-label)' }}>{project.nextMilestone}</div>
              <div className="meta">{formatShortDate(project.nextMilestoneDue)}</div>
            </div>
            <div>
              <div className="metric-label">Task progress</div>
              <div className="mt-8"><Progress done={done} total={pTasks.length} /></div>
            </div>
            <div>
              <div className="metric-label">Reviews</div>
              <div className="mt-4 strong" style={{ fontSize: 'var(--fs-label)' }}>
                {pReviews.filter((r) => r.state === 'approved').length} approved · {pReviews.filter((r) => r.state === 'waiting').length} waiting
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="mb-20">
        <Tabs>
          <TabLink href={tabHref('overview')} label="Overview" selected={active === 'overview'} />
          <TabLink href={tabHref('work')} label="Work" count={pTasks.length} selected={active === 'work'} />
          <TabLink href={tabHref('documents')} label="Documents & Files" count={pDocs.length + pFiles.length} selected={active === 'documents'} />
          <TabLink href={tabHref('reviews')} label="Reviews" count={pReviews.length} selected={active === 'reviews'} />
          <TabLink href={tabHref('delivery')} label="Delivery" count={delivery ? 1 : 0} selected={active === 'delivery'} />
        </Tabs>
      </div>

      {/* ---- P02 Overview ---- */}
      {active === 'overview' ? (
        <div className="split">
          <div className="stack">
            <Card>
              <CardHead
                title="Brief"
                desc="The purpose this project exists to serve."
                action={
                  <Button size="sm" variant="ghost" icon="edit" onClick={() => setScopeDraft((v) => !v)}>
                    {scopeDraft ? 'Close' : 'Edit'}
                  </Button>
                }
              />
              <CardBody>
                {scopeDraft ? (
                  <div className="field">
                    <label className="field-label" htmlFor="brief">Brief</label>
                    <TextInput
                      id="brief"
                      defaultValue={project.brief}
                      onBlur={(e) => {
                        dispatch({ type: 'project/patch', id: project.id, patch: { brief: e.target.value } });
                        overlay.toast('Brief updated', undefined, 'ok');
                      }}
                    />
                    <span className="field-hint">Saves when you leave the field.</span>
                  </div>
                ) : (
                  <p style={{ lineHeight: 1.7 }}>{project.brief}</p>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHead
                title="Scope"
                desc="Changes after acceptance are recorded, never silently applied."
                action={project.scopeAccepted ? <Chip state="approved" label="Accepted" /> : <Chip state="waiting" label="Awaiting acceptance" />}
              />
              <CardBody>
                <div className="grid grid-2">
                  <div>
                    <div className="panel-section-title">In scope</div>
                    <ul className="doc-list" style={{ marginTop: 0 }}>
                      {project.inScope.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="panel-section-title">Out of scope</div>
                    <ul className="doc-list" style={{ marginTop: 0, color: 'var(--metadata)' }}>
                      {project.outOfScope.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="mt-16">
                  {project.scopeAccepted ? (
                    <Banner
                      title={`Scope accepted ${formatDate(project.scopeAcceptedOn)}`}
                      sub={`Recorded by ${state.workspace.ownerName}. Any later change is logged as a scope change.`}
                      action={
                        <Button
                          size="sm"
                          onClick={() => overlay.toast('Scope change recorded', 'The original accepted scope stays visible next to the change.', 'ok')}
                        >
                          Record change
                        </Button>
                      }
                    />
                  ) : (
                    <Banner
                      tone="bad"
                      title="Scope has not been accepted"
                      sub="Work can continue, but delivery stays blocked until acceptance is recorded."
                      action={
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => {
                            dispatch({ type: 'project/acceptScope', id: project.id, date: '2026-09-10' });
                            overlay.toast('Scope acceptance recorded', 'Dated and attributed. Delivery is no longer blocked by scope.', 'ok');
                          }}
                        >
                          Record acceptance
                        </Button>
                      }
                    />
                  )}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHead
                title="Key documents"
                action={<a className="btn btn-sm btn-ghost" href={tabHref('documents')}>All documents <Icon name="chevronRight" size={14} /></a>}
              />
              <CardBody flush>
                {pDocs.length === 0 ? (
                  <div className="card-body">
                    <p className="meta">
                      No documents yet. Create one inside this project so its client context stays unambiguous.
                    </p>
                    <Button size="sm" className="mt-12" icon="plus" onClick={() => overlay.openModal('new-document', project.id)}>
                      Create document
                    </Button>
                  </div>
                ) : (
                  pDocs.map((d) => (
                    <a className="item-row" href={`#/documents/${d.id}`} key={d.id}>
                      <span className="state-icon" style={{ width: 30, height: 30, borderRadius: 6 }}>
                        <Icon name="documents" size={15} />
                      </span>
                      <div className="item-main">
                        <div className="item-title">{d.title}</div>
                        <div className="item-sub">
                          {d.type} · working v{d.workingVersion}
                          {d.submittedVersion ? ` · submitted v${d.submittedVersion}` : ''}
                        </div>
                      </div>
                      <div className="item-side">
                        <Chip state={d.reviewState} />
                        <Chip state={d.visibility} />
                      </div>
                    </a>
                  ))
                )}
              </CardBody>
            </Card>
          </div>

          <div className="stack">
            <Card>
              <CardHead title="Milestones" desc="Grouping for the work below." />
              <CardBody flush>
                {project.milestones.map((m) => (
                  <div className="item-row" key={m.id}>
                    <Tick
                      checked={m.done}
                      label={m.name}
                      onToggle={() => dispatch({ type: 'project/toggleMilestone', projectId: project.id, milestoneId: m.id })}
                    />
                    <div className="item-main">
                      <div
                        className="item-title"
                        style={m.done ? { color: 'var(--metadata)', textDecoration: 'line-through' } : undefined}
                      >
                        {m.name}
                      </div>
                      <div className="item-sub">
                        {formatDate(m.due)}
                        {!m.done && dueLabel(m.due).includes('overdue') ? <> · <span className="mark-risk">overdue</span></> : null}
                      </div>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="card-title">Record details</div>
                <Defs>
                  <Def k="Client">{client ? <a href={`#/clients/${client.id}`}>{client.name}</a> : '—'}</Def>
                  <Def k="Owner">{state.workspace.ownerName}</Def>
                  <Def k="Start">{project.startedOn ? formatDate(project.startedOn) : 'Not started'}</Def>
                  <Def k="Target delivery">{formatDate(project.due)}</Def>
                  <Def k="Stage"><Chip state={project.stage} /></Def>
                </Defs>
              </CardBody>
            </Card>

            <Card>
              <CardHead title="Project controls" />
              <CardBody>
                <div className="stack-tight">
                  <Button
                    block
                    icon="clock"
                    onClick={() => {
                      const onHold = project.stage !== 'on-hold';
                      dispatch({ type: 'project/placeHold', id: project.id, onHold });
                      overlay.toast(onHold ? 'Project placed on hold' : 'Project resumed', onHold ? 'No reviews or deliveries can be started while on hold.' : undefined, 'warn');
                    }}
                  >
                    {project.stage === 'on-hold' ? 'Resume project' : 'Place on hold'}
                  </Button>
                  <Button
                    block
                    icon="refresh"
                    onClick={() => overlay.openModal('change-stage', project.id)}
                  >
                    Change stage
                  </Button>
                  {project.stage !== 'closed' ? (
                    <Button
                      block
                      variant="danger"
                      icon="checkCircle"
                      onClick={() => {
                        dispatch({ type: 'project/patch', id: project.id, patch: { stage: 'closed' as ProjectStage } });
                        overlay.toast('Project closed', 'Its client is not archived, and access is not revoked.', 'ok');
                      }}
                    >
                      Close project
                    </Button>
                  ) : null}
                </div>
                <p className="meta mt-8">
                  Closing a project does not archive its client, and never revokes access on its own.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      ) : null}

      {/* ---- P03 Work ---- */}
      {active === 'work' ? (
        pTasks.length === 0 ? (
          <Card>
            <EmptyState
              icon="tasks"
              title="No tasks yet"
              text="Break the scope into tasks and group them under milestones. Progress is counted from real completed tasks."
              primary={<Button variant="primary" onClick={() => overlay.openModal('new-task', project.id)}>Add first task</Button>}
            />
          </Card>
        ) : (
          <Card>
            <CardHead
              title="Work breakdown"
              desc="Grouped by milestone. The same task detail panel is used here and in the global Tasks view."
              action={
                <div className="row">
                  <span className="meta">{done} of {pTasks.length} complete</span>
                  <Button size="sm" variant="primary" icon="plus" onClick={() => overlay.openModal('new-task', project.id)}>
                    Add task
                  </Button>
                </div>
              }
            />
            <CardBody flush>
              {project.milestones
                .map((m) => ({ milestone: m, list: pTasks.filter((t) => t.milestoneId === m.id) }))
                .filter((g) => g.list.length > 0)
                .map((g) => (
                  <div key={g.milestone.id}>
                    <div className="milestone-head">
                      <div className="row">
                        <span className="milestone-name">{g.milestone.name}</span>
                        {g.milestone.done ? (
                          <Chip state="done" label="Milestone met" />
                        ) : dueLabel(g.milestone.due).includes('overdue') ? (
                          <Chip state="overdue" label="Milestone overdue" />
                        ) : (
                          <span className="meta">{formatDate(g.milestone.due)}</span>
                        )}
                      </div>
                      <span className="meta">
                        {g.list.filter((t) => t.status === 'done').length}/{g.list.length}
                      </span>
                    </div>
                    {g.list.map((t) => {
                      const withCtx = derived.tasksWithContext.find((x) => x.id === t.id);
                      if (!withCtx) return null;
                      return (
                        <TaskRow
                          key={t.id}
                          task={withCtx}
                          showContext={false}
                          onOpen={() => overlay.openTask(t.id)}
                          onToggle={() => dispatch({ type: 'task/toggle', id: t.id })}
                          onPostpone={() => dispatch({ type: 'task/postpone', id: t.id })}
                        />
                      );
                    })}
                  </div>
                ))}
              {pTasks.filter((t) => !t.milestoneId).length > 0 ? (
                <div>
                  <div className="milestone-head">
                    <span className="milestone-name">Not assigned to a milestone</span>
                    <span className="meta">{pTasks.filter((t) => !t.milestoneId).length}</span>
                  </div>
                  {pTasks
                    .filter((t) => !t.milestoneId)
                    .map((t) => {
                      const withCtx = derived.tasksWithContext.find((x) => x.id === t.id);
                      if (!withCtx) return null;
                      return (
                        <TaskRow
                          key={t.id}
                          task={withCtx}
                          showContext={false}
                          onOpen={() => overlay.openTask(t.id)}
                          onToggle={() => dispatch({ type: 'task/toggle', id: t.id })}
                          onPostpone={() => dispatch({ type: 'task/postpone', id: t.id })}
                        />
                      );
                    })}
                </div>
              ) : null}
            </CardBody>
          </Card>
        )
      ) : null}

      {/* ---- P04 Documents & Files ---- */}
      {active === 'documents' ? (
        <div className="stack">
          <Card>
            <CardHead
              title="Documents"
              desc="A document is a versioned piece of work. Files are private until explicitly shared."
              action={
                <div className="row">
                  <Button size="sm" icon="upload" onClick={() => overlay.openModal('upload-file', project.id)}>Upload file</Button>
                  <Button size="sm" variant="primary" icon="plus" onClick={() => overlay.openModal('new-document', project.id)}>
                    Create document
                  </Button>
                </div>
              }
            />
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Title</th><th>Type</th><th>Latest submitted</th><th>Review state</th>
                    <th>Visibility</th><th>Modified</th><th><span className="visually-hidden">Open</span></th>
                  </tr>
                </thead>
                <tbody>
                  {pDocs.length === 0 ? (
                    <tr><td colSpan={7}><p className="meta" style={{ padding: 8 }}>No documents in this project yet.</p></td></tr>
                  ) : (
                    pDocs.map((d) => (
                      <tr key={d.id}>
                        <td>
                          <a className="row-link" href={`#/documents/${d.id}`}>
                            <div className="cell-primary">{d.title}</div>
                            <div className="cell-sub">working copy v{d.workingVersion}</div>
                          </a>
                        </td>
                        <td>{d.type}</td>
                        <td>{d.submittedVersion ? `v${d.submittedVersion}` : <span className="meta">Never submitted</span>}</td>
                        <td><Chip state={d.reviewState} /></td>
                        <td><Chip state={d.visibility} /></td>
                        <td className="num"><span className="meta">{relative(d.modified)}</span></td>
                        <td className="cell-actions">
                          <IconButton
                            icon="send"
                            label="Request review"
                            onClick={() => navigate(`#/share?document=${d.id}`)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card>
            <CardHead
              title="Files"
              desc="Uploaded assets attached to this project. Replacing a file cannot alter an already delivered package."
            />
            <CardBody flush>
              {pFiles.length === 0 ? (
                <div className="card-body"><p className="meta">No files uploaded.</p></div>
              ) : (
                pFiles.map((f) => (
                  <div className="item-row" key={f.id}>
                    <span className={`package-badge ${f.kind}`}>{f.kind.toUpperCase()}</span>
                    <div className="item-main">
                      <div className="item-title">{f.name}</div>
                      <div className="item-sub">{f.meta} · uploaded {formatDate(f.uploaded)}</div>
                    </div>
                    <div className="item-side">
                      {f.approved ? <Chip state="approved" /> : <Chip state="private" label="Not approved" />}
                    </div>
                    <div className="item-actions">
                      <IconButton icon="download" label={`Download ${f.name}`} onClick={() => overlay.toast('Download started', f.name, 'ok')} />
                    </div>
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </div>
      ) : null}

      {/* ---- P05 Reviews ---- */}
      {active === 'reviews' ? (
        <Card>
          <CardHead
            title="Review requests"
            desc="One open request per deliverable in V1. Withdrawing closes the request; it never deletes the version."
            action={
              <Button size="sm" variant="primary" icon="send" onClick={() => navigate('#/share')}>
                Request review
              </Button>
            }
          />
          <CardBody flush>
            {pReviews.length === 0 ? (
              <EmptyState
                icon="send"
                title="No review requested"
                text="Request a review on an exact submitted version. The recipient is the only person who can decide."
              />
            ) : (
              pReviews.map((r) => {
                const doc = derived.documentById(r.documentId);
                const overdue = r.state === 'waiting' && dueLabel(r.due).includes('overdue');
                return (
                  <div className="review-card" key={r.id}>
                    <div style={{ minWidth: 0 }}>
                      <div className="row" style={{ gap: 9 }}>
                        <span className="strong">{doc?.title} · v{r.version}</span>
                        <Chip state={r.state} />
                      </div>
                      <div className="meta mt-4">
                        Reviewer <strong>{r.reviewer.name}</strong> ({r.reviewer.role}) · requested {formatDate(r.requestedOn)} ·{' '}
                        {r.due ? <>due <span className={overdue ? 'mark-risk' : undefined}>{formatDate(r.due)}</span></> : 'no due date'}
                      </div>
                      {r.comments.length > 0 ? (
                        <div className="mt-12">
                          {r.comments.map((cm) => (
                            <div className="comment" key={cm.id}>
                              <span className="avatar">{initials(cm.author)}</span>
                              <div>
                                <div className="comment-head">
                                  <span className="comment-author">{cm.author}</span>
                                  <span className="meta">{formatDate(cm.date)}</span>
                                </div>
                                <div className="comment-body">{cm.body}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="item-side" style={{ alignItems: 'flex-end' }}>
                      <Button
                        size="sm"
                        variant="primary"
                        icon="eye"
                        onClick={() => navigate(`#/documents/${r.documentId}?view=guest-preview&review=${r.id}`)}
                      >
                        Open preview
                      </Button>
                      <Button size="sm" icon="history" onClick={() => navigate(`#/documents/${r.documentId}?view=history`)}>
                        Version history
                      </Button>
                      {r.state === 'waiting' ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            dispatch({ type: 'review/withdraw', id: r.id });
                            overlay.toast('Review request withdrawn', 'The version is retained. No decision can be recorded against it now.', 'warn');
                          }}
                        >
                          Withdraw
                        </Button>
                      ) : null}
                      {r.outcome === 'changes' ? (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => {
                            dispatch({ type: 'document/submitVersion', id: r.documentId, note: 'Revision created from client feedback.' });
                            overlay.toast('Revision started', 'A new draft was copied forward from the submitted version.', 'ok');
                            navigate(`#/documents/${r.documentId}`);
                          }}
                        >
                          Create revision
                        </Button>
                      ) : null}
                      {r.outcome === 'approved' ? (
                        <Button size="sm" onClick={() => navigate(`#/projects/${project.id}?tab=delivery`)}>
                          Prepare delivery
                        </Button>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </CardBody>
        </Card>
      ) : null}

      {/* ---- P06 Delivery ---- */}
      {active === 'delivery' ? (
        delivery ? (
          <div className="stack">
            {delivery.state === 'missing-approval' ? (
              <Banner
                tone="bad"
                title={<><strong>Final delivery is blocked.</strong> Brand guidelines v3 has no approved version.</>}
                sub="Select only approved versions. Missing approval or a missing file blocks delivery by design."
                action={
                  <Button size="sm" onClick={() => {
                    const waiting = pReviews.find((r) => r.state === 'waiting');
                    if (waiting) navigate(`#/documents/${waiting.documentId}?view=guest-preview&review=${waiting.id}`);
                  }}>
                    Inspect review
                  </Button>
                }
              />
            ) : null}

            <div className="split">
              <Card>
                <CardHead
                  title={delivery.title}
                  desc={`Recipient ${delivery.recipient.name} · ${delivery.recipient.email}`}
                  action={<Chip state={delivery.state} />}
                />
                <CardBody flush>
                  {delivery.fileIds.map((fid) => {
                    const f = derived.fileById(fid);
                    if (!f) return null;
                    return (
                      <div className="package-row" key={fid}>
                        <span className={`package-badge ${f.kind}`}>{f.kind.toUpperCase()}</span>
                        <div className="item-main">
                          <div className="item-title">{f.name}</div>
                          <div className="item-sub">{f.meta}</div>
                        </div>
                        <div className="item-side">
                          {f.approved ? <Chip state="approved" /> : <Chip state="blocked" label="Not approved" />}
                        </div>
                      </div>
                    );
                  })}
                </CardBody>
                <CardFoot>
                  <div className="row-between row-wrap">
                    <span className="meta">Changing this package creates a new package revision.</span>
                    <div className="row">
                      <Button size="sm" icon="eye" onClick={() => navigate('#/guest/delivery')}>Preview as client</Button>
                      <Button
                        size="sm"
                        variant="primary"
                        icon="send"
                        disabled={delivery.state === 'missing-approval'}
                        onClick={() => {
                          dispatch({
                            type: 'delivery/patch',
                            id: delivery.id,
                            patch: { state: 'delivered', deliveredOn: '2026-09-10T12:00:00', method: 'CoreDesk guest link' },
                          });
                          overlay.toast('Package delivered', 'Acknowledgment is recorded separately.', 'ok');
                        }}
                      >
                        Share package
                      </Button>
                    </div>
                  </div>
                </CardFoot>
              </Card>

              <div className="stack">
                <Card>
                  <CardHead title="Handoff notes" />
                  <CardBody><p className="muted" style={{ lineHeight: 1.6 }}>{delivery.notes}</p></CardBody>
                </Card>
                <Card>
                  <CardHead title="Delivery record" desc="Acknowledgment is recorded separately from delivery." />
                  <CardBody>
                    <Defs>
                      <Def k="Delivered">{delivery.deliveredOn ? formatDate(delivery.deliveredOn) : <span className="meta">Not delivered</span>}</Def>
                      <Def k="Method">{delivery.method ?? '—'}</Def>
                      <Def k="Acknowledged">{delivery.acknowledgedOn ? formatDate(delivery.acknowledgedOn) : <span className="meta">Pending</span>}</Def>
                    </Defs>
                    {!delivery.deliveredOn ? (
                      <Button
                        block
                        className="mt-12"
                        icon="check"
                        onClick={() => {
                          dispatch({
                            type: 'delivery/patch',
                            id: delivery.id,
                            patch: { state: 'delivered', deliveredOn: '2026-09-10T12:00:00', method: 'External handoff' },
                          });
                          overlay.toast('External handoff recorded', 'Delivery date and method recorded. Acknowledgment stays separate.', 'ok');
                        }}
                      >
                        Record external handoff
                      </Button>
                    ) : null}
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <Card>
            <EmptyState
              icon="package"
              title="No delivery package yet"
              text="A package collects the exact approved versions and immutable file revisions. It can only be built from approved work."
              primary={
                pReviews.some((r) => r.state === 'approved') ? (
                  <Button variant="primary" onClick={() => overlay.toast('Delivery package started', 'Only approved versions can be added.', 'ok')}>
                    Create delivery package
                  </Button>
                ) : undefined
              }
            />
          </Card>
        )
      ) : null}
    </>
  );
}
