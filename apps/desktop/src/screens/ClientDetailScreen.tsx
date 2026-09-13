/**
 * C02 · Client Detail — sections of one record, not duplicate apps.
 *
 * Projects, Documents, Contacts and private notes are tabs of this page. The
 * client-level private note lives here and is never client-visible.
 */

import { useState } from 'react';

import { useStore } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate } from '../app/router';
import { dueLabel, formatDate, initials, relative } from '../domain/dates';
import {
  Button, Card, CardBody, CardHead, Chip, Def, Defs, EmptyState,
  Metric, PageHead, Progress, TabLink, Tabs, TextArea,
} from '../ui/primitives';
import { NotFound } from '../app/Shell';
import { Icon } from '../ui/Icon';

type Tab = 'projects' | 'documents' | 'contacts' | 'notes' | 'history';

export function ClientDetailScreen({ clientId }: { clientId: string }) {
  const { state, dispatch, derived } = useStore();
  const overlay = useOverlay();
  const [tab, setTab] = useState<Tab>('projects');
  const [noteDraft, setNoteDraft] = useState<string | null>(null);

  const client = derived.clientById(clientId);
  if (!client) return <NotFound kind="client" onHome={() => navigate('#/home')} />;

  const cProjects = derived.projectsOfClient(client.id);
  const cDocs = state.documents.filter((d) => d.clientId === client.id);
  const cTasks = derived.tasksOfClient(client.id);
  const openTasks = cTasks.filter((t) => t.status !== 'done' && t.status !== 'cancelled');
  const primary = client.contacts.find((c) => c.primary) ?? client.contacts[0];

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'projects', label: 'Projects', count: cProjects.length },
    { id: 'documents', label: 'Documents', count: cDocs.length },
    { id: 'contacts', label: 'Contacts', count: client.contacts.length },
    { id: 'notes', label: 'Private notes' },
    { id: 'history', label: 'History' },
  ];

  return (
    <>
      <PageHead
        eyebrow="Client"
        title={client.name}
        sub={
          client.nextActionTone === 'risk' ? (
            <><span className="mark-risk">{client.nextAction}</span> — {dueLabel(client.nextActionDue)}.</>
          ) : (
            <>{client.nextAction} — {dueLabel(client.nextActionDue)}.</>
          )
        }
        actions={
          <>
            <Button icon="dots" onClick={() => overlay.openModal('client-menu', client.id)}>Actions</Button>
            <Button variant="primary" icon="plus" onClick={() => navigate(`#/new-project?client=${client.id}`)}>
              Add project
            </Button>
          </>
        }
      />

      <div className="grid grid-4 mb-20">
        <Metric label="Relationship" value={<Chip state={client.state} />} foot={`Last activity ${relative(client.lastActivity)}`} />
        <Metric
          label="Active projects"
          value={cProjects.filter((p) => p.stage !== 'closed' && p.stage !== 'cancelled').length}
          foot={`${cProjects.length} total on record`}
        />
        <Metric
          label="Open tasks"
          value={openTasks.length}
          tone={openTasks.some((t) => dueLabel(t.due).includes('overdue')) ? 'risk' : undefined}
          foot={`${openTasks.filter((t) => dueLabel(t.due).includes('overdue')).length} overdue`}
        />
        <Metric
          label="Documents"
          value={cDocs.length}
          foot={`${cDocs.filter((d) => d.visibility === 'shared').length} shared with client`}
        />
      </div>

      <div className="mb-20">
        <Tabs>
          {tabs.map((t) => (
            <TabLink
              key={t.id}
              label={t.label}
              count={t.count}
              selected={tab === t.id}
              onClick={() => setTab(t.id)}
            />
          ))}
        </Tabs>
      </div>

      <div className="split">
        <div className="stack">
          {tab === 'projects' ? (
            cProjects.length === 0 ? (
              <Card>
                <EmptyState
                  icon="projects"
                  title={client.state === 'prospect' ? 'No project yet — this is still a relationship' : 'No projects on record'}
                  text={
                    client.state === 'prospect'
                      ? 'A prospect keeps notes and tasks on the client record until a scoped engagement is agreed.'
                      : 'This client has no projects. Add one to start tracking work, documents and reviews.'
                  }
                  primary={
                    <Button variant="primary" onClick={() => navigate(`#/new-project?client=${client.id}`)}>
                      Add project
                    </Button>
                  }
                />
              </Card>
            ) : (
              cProjects.map((p) => {
                const pTasks = derived.tasksOfProject(p.id);
                const done = pTasks.filter((t) => t.status === 'done').length;
                const revs = derived.reviewsOfProject(p.id);
                return (
                  <Card key={p.id}>
                    <CardBody>
                      <div className="row-between row-wrap">
                        <div style={{ minWidth: 0 }}>
                          <div className="card-title">
                            <a href={`#/projects/${p.id}`} style={{ color: 'inherit' }}>{p.name}</a>
                          </div>
                          <div className="card-desc">{p.outcome}</div>
                        </div>
                        <Chip state={p.stage} />
                      </div>
                      <div className="mt-16" style={{ maxWidth: 300 }}>
                        <Progress done={done} total={pTasks.length} />
                      </div>
                      <Defs>
                        <Def k="Reviews">{revs.length ? `${revs.filter((r) => r.state === 'approved').length}/${revs.length} approved` : 'No reviews requested'}</Def>
                        <Def k="Due">{formatDate(p.due)}</Def>
                        <Def k="Next action">{p.nextAction}</Def>
                      </Defs>
                    </CardBody>
                  </Card>
                );
              })
            )
          ) : null}

          {tab === 'documents' ? (
            cDocs.length === 0 ? (
              <Card>
                <EmptyState
                  icon="documents"
                  title="No documents"
                  text="Documents belong to a project. Create one inside a project so its client context stays unambiguous."
                />
              </Card>
            ) : (
              <Card>
                <CardBody flush>
                  {cDocs.map((d) => (
                    <a className="item-row" href={`#/documents/${d.id}`} key={d.id}>
                      <span className="state-icon" style={{ width: 30, height: 30, borderRadius: 6 }}>
                        <Icon name="documents" size={15} />
                      </span>
                      <div className="item-main">
                        <div className="item-title">{d.title}</div>
                        <div className="item-sub">
                          {d.type} · working v{d.workingVersion}
                          {d.submittedVersion ? ` · submitted v${d.submittedVersion}` : ' · never submitted'}
                        </div>
                      </div>
                      <div className="item-side">
                        <Chip state={d.reviewState} />
                        <Chip state={d.visibility} />
                      </div>
                    </a>
                  ))}
                </CardBody>
              </Card>
            )
          ) : null}

          {tab === 'contacts' ? (
            <Card>
              <CardHead
                title="Contacts"
                desc="A contact is a person. Being a contact grants no access — grants are made per object."
                action={
                  <Button size="sm" icon="plus" onClick={() => overlay.openModal('new-contact', client.id)}>
                    Add contact
                  </Button>
                }
              />
              <CardBody flush>
                {client.contacts.map((ct) => {
                  const cGrants = state.grants.filter((g) => g.recipient.email === ct.email);
                  return (
                    <div className="item-row" key={ct.id}>
                      <span className="avatar">{initials(ct.name)}</span>
                      <div className="item-main">
                        <div className="item-title">
                          {ct.name}
                          {ct.primary ? <span className="chip tone-accent" style={{ marginLeft: 6 }}>Primary</span> : null}
                        </div>
                        <div className="item-sub">{ct.role} · {ct.email}</div>
                      </div>
                      <div className="item-side">
                        {cGrants.length > 0 ? (
                          <Chip state={cGrants[0].state} />
                        ) : (
                          <span className="meta">No access grant</span>
                        )}
                      </div>
                      <div className="item-actions">
                        <Button size="sm" onClick={() => navigate('#/share')}>Invite to review</Button>
                      </div>
                    </div>
                  );
                })}
              </CardBody>
            </Card>
          ) : null}

          {tab === 'notes' ? (
            <Card>
              <CardHead
                title="Private notes"
                desc="Client-level notes live on the client record. Guests never see this surface."
                action={
                  noteDraft === null ? (
                    <Button size="sm" icon="edit" onClick={() => setNoteDraft(client.privateNote)}>Edit</Button>
                  ) : (
                    <div className="row">
                      <Button size="sm" variant="ghost" onClick={() => setNoteDraft(null)}>Cancel</Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          dispatch({ type: 'client/patch', id: client.id, patch: { privateNote: noteDraft } });
                          setNoteDraft(null);
                          overlay.toast('Note saved', 'Saved to this device only.', 'ok');
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  )
                }
              />
              <CardBody>
                {noteDraft === null ? (
                  <>
                    <div className="banner ok mb-16">
                      <div className="banner-text">
                        Saved to this device
                        <div className="banner-sub">
                          <Icon name="lock" size={12} /> Never visible to guests. Last edited {relative(client.lastActivity)}
                        </div>
                      </div>
                    </div>
                    <p style={{ lineHeight: 1.7 }}>
                      {client.privateNote || <span className="meta">No note yet.</span>}
                    </p>
                  </>
                ) : (
                  <div className="field">
                    <label className="field-label" htmlFor="client-note">Private note</label>
                    <TextArea
                      id="client-note"
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      placeholder="How you met, what they need, anything to remember."
                    />
                    <span className="field-hint">Never exported and never shared with a guest.</span>
                  </div>
                )}
                <Defs>
                  <Def k="Relationship state"><Chip state={client.state} /></Def>
                  <Def k="Referred by">{client.id === 'cl-northgate' ? 'Harbor & Finch' : '—'}</Def>
                  <Def k="Documents">{cDocs.length}</Def>
                </Defs>
              </CardBody>
            </Card>
          ) : null}

          {tab === 'history' ? (
            <Card>
              <CardHead title="Relationship history" desc="Every record linked to this client, newest first." />
              <CardBody flush>
                {[
                  ...cProjects.map((p) => ({
                    date: p.startedOn ?? p.scopeAcceptedOn ?? p.due,
                    title: `Project — ${p.name}`,
                    meta: p.scopeAccepted ? `Scope accepted ${formatDate(p.scopeAcceptedOn)}` : 'Scope not yet accepted',
                    icon: 'projects' as const,
                  })),
                  ...cDocs.map((d) => ({
                    date: d.modified,
                    title: `Document — ${d.title}`,
                    meta: `Working v${d.workingVersion}`,
                    icon: 'documents' as const,
                  })),
                  ...cTasks.slice(0, 4).map((t) => ({
                    date: t.due,
                    title: `Task — ${t.title}`,
                    meta: dueLabel(t.due),
                    icon: 'tasks' as const,
                  })),
                ]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((e, i) => (
                    <div className="event" key={`${e.title}-${i}`}>
                      <span className="event-mark"><Icon name={e.icon} size={14} /></span>
                      <div>
                        <div className="event-title">{e.title}</div>
                        <div className="event-meta">
                          <span>{e.meta}</span>
                          <span>·</span>
                          <span>{formatDate(e.date)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardBody>
            </Card>
          ) : null}
        </div>

        <div className="stack">
          <Card>
            <CardHead title="Primary contact" />
            <CardBody>
              {primary ? (
                <>
                  <div className="row mb-16">
                    <span className="avatar">{initials(primary.name)}</span>
                    <div className="col">
                      <span className="strong">{primary.name}</span>
                      <span className="meta">{primary.role}</span>
                    </div>
                  </div>
                  <Defs>
                    <Def k="Email">{primary.email}</Def>
                    <Def k="Guest access">
                      {state.grants.some((g) => g.recipient.email === primary.email && (g.state === 'active' || g.state === 'verified')) ? (
                        <Chip state="active" label="Active grant" />
                      ) : (
                        <span className="meta">None</span>
                      )}
                    </Def>
                    <Def k="Last activity">{relative(client.lastActivity)}</Def>
                  </Defs>
                  <Button block className="mt-16" icon="mail" onClick={() => navigate('#/share')}>
                    Invite to review
                  </Button>
                </>
              ) : (
                <p className="meta">No contact on record.</p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHead title="Next action" desc="One clear next step per relationship." />
            <CardBody>
              <div className={`banner ${client.nextActionTone === 'risk' ? 'bad' : client.nextActionTone === 'waiting' ? '' : 'ok'}`}>
                <div className="banner-text">
                  <div>{client.nextAction}</div>
                  <div className="banner-sub">{dueLabel(client.nextActionDue)}</div>
                </div>
              </div>
              <Button block className="mt-12" icon="plus" onClick={() => overlay.openModal('new-task', client.id)}>
                Add task for this client
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="card-title">{client.state === 'archived' ? 'Archived record' : 'Danger zone'}</div>
              <div className="card-desc mt-4">
                {client.state === 'archived'
                  ? 'Read-only. Restoring is an owner action and does not reinstate guest access.'
                  : 'Archiving keeps all history and revokes nothing on its own. Access changes are made in Settings → Client access.'}
              </div>
              {client.state === 'archived' ? (
                <Button
                  block
                  className="mt-12"
                  onClick={() => {
                    dispatch({ type: 'client/patch', id: client.id, patch: { state: 'inactive' } });
                    overlay.toast('Client restored', 'Guest access was not reinstated automatically.', 'ok');
                  }}
                >
                  Restore client
                </Button>
              ) : (
                <Button
                  block
                  variant="danger"
                  className="mt-12"
                  onClick={() => overlay.openModal('archive-client', client.id)}
                >
                  Archive {client.name}
                </Button>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
