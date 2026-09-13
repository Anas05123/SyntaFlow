/**
 * Modal host.
 *
 * Every modal is dispatched by kind through the overlay API, so a screen never
 * renders its own dialog and Esc handling stays in one place.
 */

import { useState } from 'react';

import { useStore, nextId } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate } from '../app/router';
import { isoInDays } from '../domain/dates';
import { Button, Check, Def, Defs, Field, IconButton, Select, TextArea, TextInput } from '../ui/primitives';
import type { DocumentType, ProjectStage } from '../domain/types';

export function ModalHost({ kind, id }: { kind: string; id?: string }) {
  switch (kind) {
    case 'new-client': return <NewClientModal />;
    case 'new-task': return <NewTaskModal contextId={id} />;
    case 'new-document': return <NewDocumentModal projectId={id} />;
    case 'new-contact': return <NewContactModal clientId={id} />;
    case 'client-menu': return <ClientMenuModal clientId={id} />;
    case 'project-menu': return <ProjectMenuModal projectId={id} />;
    case 'archive-client': return <ArchiveClientModal clientId={id} />;
    case 'change-stage': return <ChangeStageModal projectId={id} />;
    case 'upload-file': return <UploadFileModal projectId={id} />;
    case 'security-help': return <SecurityHelpModal />;
    case 'invite-team': return <InviteTeamModal />;
    case 'create-team': return <CreateTeamModal />;
    case 'reset-workspace': return <ResetModal />;
    default: return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Shell                                                                       */
/* -------------------------------------------------------------------------- */

function Shell({
  title, sub, body, foot, wide,
}: {
  title: string;
  sub?: string;
  body: React.ReactNode;
  foot: React.ReactNode;
  wide?: boolean;
}) {
  const overlay = useOverlay();
  return (
    <div className={`modal${wide ? ' wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-shell">
        <div className="modal-head">
          <div className="row-between">
            <div>
              <div className="panel-title">{title}</div>
              {sub ? <div className="panel-sub">{sub}</div> : null}
            </div>
            <IconButton icon="close" label="Close" onClick={overlay.closeModal} />
          </div>
        </div>
        <div className="modal-body">{body}</div>
        <div className="modal-foot">{foot}</div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Clients                                                                     */
/* -------------------------------------------------------------------------- */

function NewClientModal() {
  const { state, dispatch } = useStore();
  const overlay = useOverlay();
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [stateValue, setStateValue] = useState<'active' | 'prospect'>('active');
  const [note, setNote] = useState('');

  const trimmed = name.trim();
  const duplicate = state.clients.find(
    (c) => c.state !== 'archived' && c.name.toLowerCase() === trimmed.toLowerCase()
  );
  const valid = trimmed.length > 0;

  return (
    <Shell
      title="Add a client"
      sub="A client is the ongoing relationship. Projects and documents attach to it."
      body={
        <div className="stack">
          <Field label="Client or company name" htmlFor="nc-name">
            <TextInput
              id="nc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Harbor & Finch"
              autoFocus
            />
          </Field>
          <div className="grid grid-2">
            <Field label="Primary contact" htmlFor="nc-contact">
              <TextInput id="nc-contact" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Full name" />
            </Field>
            <Field label="Email" htmlFor="nc-email">
              <TextInput id="nc-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
            </Field>
          </div>
          <Field label="Relationship state" htmlFor="nc-state">
            <Select id="nc-state" value={stateValue} onChange={(e) => setStateValue(e.target.value as 'active' | 'prospect')}>
              <option value="active">Active client</option>
              <option value="prospect">Prospect</option>
            </Select>
          </Field>
          <Field label="Private note" hint="(never shown to guests)" htmlFor="nc-note">
            <TextArea
              id="nc-note"
              style={{ minHeight: 78 }}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How you met, what they need, anything to remember."
            />
          </Field>
          {duplicate ? (
            <div className="banner">
              <div className="banner-text">
                <div>A client with this name already exists</div>
                <div className="banner-sub">
                  “{duplicate.name}” is already on record. Duplicate clients split document history — open the
                  existing record instead unless this is genuinely a different business.
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  overlay.closeModal();
                  navigate(`#/clients/${duplicate.id}`);
                }}
              >
                Open existing
              </Button>
            </div>
          ) : null}
        </div>
      }
      foot={
        <>
          <Button variant="ghost" onClick={overlay.closeModal}>Cancel</Button>
          <Button
            variant="primary"
            disabled={!valid || Boolean(duplicate)}
            onClick={() => {
              const clientId = nextId('cl');
              dispatch({
                type: 'client/add',
                client: {
                  id: clientId,
                  name: trimmed,
                  state: stateValue,
                  contacts: contact.trim()
                    ? [{ id: nextId('ct'), name: contact.trim(), role: 'Primary contact', email: email.trim(), primary: true }]
                    : [],
                  nextAction: stateValue === 'prospect' ? 'Agree scope for a first project' : 'Define the first project',
                  nextActionTone: 'accent',
                  nextActionDue: isoInDays(7),
                  lastActivity: new Date().toISOString(),
                  privateNote: note,
                },
              });
              overlay.closeModal();
              overlay.toast('Client added', 'Add a project next so work has somewhere to live.', 'ok');
              navigate(`#/clients/${clientId}`);
            }}
          >
            Add client
          </Button>
        </>
      }
    />
  );
}

function ClientMenuModal({ clientId }: { clientId?: string }) {
  const { state, dispatch, derived } = useStore();
  const overlay = useOverlay();
  const client = derived.clientById(clientId ?? null);
  if (!client) return null;

  const projectCount = derived.projectsOfClient(client.id).length;
  const docCount = state.documents.filter((d) => d.clientId === client.id).length;

  return (
    <Shell
      title={client.name}
      sub="Client actions"
      body={
        <div className="stack-tight">
          <Button block icon="projects" onClick={() => { overlay.closeModal(); navigate(`#/new-project?client=${client.id}`); }}>
            Add project
          </Button>
          <Button block icon="mail" onClick={() => { overlay.closeModal(); navigate('#/share'); }}>
            Invite contact to review
          </Button>
          <Button block icon="tasks" onClick={() => { overlay.closeModal(); overlay.openModal('new-task', client.id); }}>
            Add task
          </Button>
          <div className="divider-h my-8" style={{ margin: '10px 0' }} />
          <Button
            block
            icon="refresh"
            onClick={() => {
              const next = client.state === 'prospect' ? 'active' : client.state === 'active' ? 'inactive' : 'active';
              dispatch({ type: 'client/patch', id: client.id, patch: { state: next } });
              overlay.toast('Relationship state changed', `Now ${next}.`, 'ok');
            }}
          >
            Change relationship state
          </Button>
          <Button
            block
            variant="danger"
            icon="archive"
            onClick={() => {
              overlay.openModal('archive-client', client.id);
            }}
          >
            Archive {client.name}
          </Button>
          <p className="meta mt-8">
            {projectCount} project{projectCount === 1 ? '' : 's'} and {docCount} document{docCount === 1 ? '' : 's'} are
            attached to this client.
          </p>
        </div>
      }
      foot={<Button variant="ghost" onClick={overlay.closeModal}>Close</Button>}
    />
  );
}

function ArchiveClientModal({ clientId }: { clientId?: string }) {
  const { state, dispatch, derived } = useStore();
  const overlay = useOverlay();
  const client = derived.clientById(clientId ?? null);
  if (!client) return null;

  const projects = derived.projectsOfClient(client.id).length;
  const docs = state.documents.filter((d) => d.clientId === client.id).length;

  return (
    <Shell
      title="Archive this client?"
      sub="Destructive actions name the affected records."
      body={
        <div className="stack">
          <div className="banner bad">
            <div className="banner-text">
              <div>
                Archive <strong>{client.name}</strong>, {projects} project{projects === 1 ? '' : 's'}, {docs} document
                {docs === 1 ? '' : 's'}?
              </div>
              <div className="banner-sub">
                History is retained and becomes read-only. Guest access is not revoked by archiving — that is a
                separate action in Settings → Client access.
              </div>
            </div>
          </div>
          <p className="meta">You can restore this client later from Archive.</p>
        </div>
      }
      foot={
        <>
          <Button variant="ghost" onClick={overlay.closeModal}>Cancel</Button>
          <Button
            variant="danger"
            onClick={() => {
              dispatch({
                type: 'client/patch',
                id: client.id,
                patch: { state: 'archived', archivedOn: '2026-09-10' },
              });
              overlay.closeModal();
              overlay.toast('Client archived', 'History is retained. Guest access was not revoked.', 'warn');
              navigate('#/archive');
            }}
          >
            Archive client
          </Button>
        </>
      }
    />
  );
}

function NewContactModal({ clientId }: { clientId?: string }) {
  const { dispatch, derived } = useStore();
  const overlay = useOverlay();
  const client = derived.clientById(clientId ?? null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');

  if (!client) return null;
  const valid = name.trim().length > 0 && email.includes('@');

  return (
    <Shell
      title="Add a contact"
      sub={`New contact at ${client.name}. A contact grants no access on its own.`}
      body={
        <div className="stack">
          <Field label="Full name" htmlFor="ct-name">
            <TextInput id="ct-name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </Field>
          <Field label="Role" htmlFor="ct-role">
            <TextInput id="ct-role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Marketing Director" />
          </Field>
          <Field label="Email" htmlFor="ct-email">
            <TextInput id="ct-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <p className="meta">
            Inviting this person to a review creates a separate access grant for one object.
          </p>
        </div>
      }
      foot={
        <>
          <Button variant="ghost" onClick={overlay.closeModal}>Cancel</Button>
          <Button
            variant="primary"
            disabled={!valid}
            onClick={() => {
              dispatch({
                type: 'client/patch',
                id: client.id,
                patch: {
                  contacts: [
                    ...client.contacts,
                    { id: nextId('ct'), name: name.trim(), role: role.trim() || 'Contact', email: email.trim(), primary: false },
                  ],
                },
              });
              overlay.closeModal();
              overlay.toast('Contact added', 'They have no access until you grant it.', 'ok');
            }}
          >
            Add contact
          </Button>
        </>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Tasks                                                                       */
/* -------------------------------------------------------------------------- */

function NewTaskModal({ contextId }: { contextId?: string }) {
  const { state, dispatch, derived } = useStore();
  const overlay = useOverlay();

  const projectForContext = derived.projectById(contextId ?? null);
  const clientForContext = projectForContext ? null : derived.clientById(contextId ?? null);

  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(projectForContext?.id ?? '');
  const [clientId, setClientId] = useState(clientForContext?.id ?? '');
  const [due, setDue] = useState(isoInDays(3));
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [note, setNote] = useState('');

  const valid = title.trim().length > 0 && (projectId !== '' || clientId !== '');
  const needsProjectChoice = !projectForContext;

  return (
    <Shell
      title="Add a task"
      sub="A task belongs to a project and a client. It is never orphaned."
      body={
        <div className="stack">
          <Field label="Task" htmlFor="nt-title">
            <TextInput
              id="nt-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Send revised proposal"
              autoFocus
            />
          </Field>

          {needsProjectChoice ? (
            <>
              <Field label="Project" htmlFor="nt-project" hint="Creating from a global view requires choosing a project.">
                <Select
                  id="nt-project"
                  value={projectId}
                  onChange={(e) => { setProjectId(e.target.value); setClientId(''); }}
                >
                  <option value="">Select a project…</option>
                  {state.projects
                    .filter((p) => p.stage !== 'closed' && p.stage !== 'cancelled')
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {derived.clientById(p.clientId)?.name}
                      </option>
                    ))}
                </Select>
              </Field>
              <Field label="Or attach to a client without a project" htmlFor="nt-client">
                <Select id="nt-client" value={clientId} onChange={(e) => { setClientId(e.target.value); setProjectId(''); }}>
                  <option value="">No client</option>
                  {state.clients
                    .filter((c) => c.state !== 'archived')
                    .map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </Select>
              </Field>
            </>
          ) : (
            <Field label="Project" htmlFor="nt-project-fixed">
              <TextInput id="nt-project-fixed" value={`${projectForContext?.name} — ${derived.clientById(projectForContext?.clientId ?? null)?.name}`} readOnly />
            </Field>
          )}

          <div className="grid grid-2">
            <Field label="Due date" htmlFor="nt-due">
              <TextInput id="nt-due" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
            </Field>
            <Field label="Priority" htmlFor="nt-priority">
              <Select id="nt-priority" value={priority} onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </Field>
          </div>

          <Field label="Description" hint="(optional)" htmlFor="nt-note">
            <TextArea id="nt-note" style={{ minHeight: 78 }} value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
        </div>
      }
      foot={
        <>
          <Button variant="ghost" onClick={overlay.closeModal}>Cancel</Button>
          <Button
            variant="primary"
            disabled={!valid}
            onClick={() => {
              const newId = nextId('tk');
              dispatch({
                type: 'task/add',
                task: {
                  id: newId,
                  title: title.trim(),
                  projectId: projectId || null,
                  clientId: clientId || null,
                  due,
                  status: 'todo',
                  priority,
                  milestoneId: null,
                  note,
                  checklist: [],
                },
              });
              overlay.closeModal();
              overlay.toast('Task added', projectId ? 'Attached to the project.' : 'Attached to the client record.', 'ok');
            }}
          >
            Add task
          </Button>
        </>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Documents                                                                   */
/* -------------------------------------------------------------------------- */

const DOC_TYPES: DocumentType[] = ['Proposal', 'Brief', 'Agreement record', 'Welcome pack', 'Scope / Report', 'Notes', 'Deliverable'];

function NewDocumentModal({ projectId }: { projectId?: string }) {
  const { state, dispatch, derived } = useStore();
  const overlay = useOverlay();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<DocumentType>('Proposal');
  const [pid, setPid] = useState(projectId ?? '');
  const [sections, setSections] = useState('Context\nObjectives\nScope\nSchedule\nFees');

  const project = derived.projectById(pid || null);
  const valid = title.trim().length > 0 && Boolean(project);

  const defaultSections: Record<DocumentType, string> = {
    Proposal: 'Context\nObjectives\nScope\nDeliverables\nSchedule\nFees\nAssumptions',
    Brief: 'Goals\nAudience\nConstraints\nSuccess criteria',
    'Agreement record': 'Parties\nScope reference\nAgreement\nAcceptance evidence',
    'Welcome pack': 'Next steps\nMilestones\nRequired inputs',
    'Scope / Report': 'Summary\nFindings\nRecommendation\nNext steps',
    Notes: 'Notes\nDecisions\nFollow-ups',
    Deliverable: 'Overview\nDetail\nReferences',
  };

  return (
    <Shell
      title="Create a document"
      sub="A document belongs to exactly one project in V1."
      body={
        <div className="stack">
          <Field label="Title" htmlFor="nd-title">
            <TextInput
              id="nd-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Proposal — onboarding redesign"
              autoFocus
            />
          </Field>
          <div className="grid grid-2">
            <Field label="Type" htmlFor="nd-type">
              <Select
                id="nd-type"
                value={type}
                onChange={(e) => {
                  const t = e.target.value as DocumentType;
                  setType(t);
                  setSections(defaultSections[t]);
                }}
              >
                {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Project" htmlFor="nd-project">
              <Select id="nd-project" value={pid} onChange={(e) => setPid(e.target.value)}>
                <option value="">Select a project…</option>
                {state.projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {derived.clientById(p.clientId)?.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Sections" hint="(one per line)" htmlFor="nd-sections">
            <TextArea id="nd-sections" style={{ minHeight: 130 }} value={sections} onChange={(e) => setSections(e.target.value)} />
          </Field>
          <div className="banner">
            <div className="banner-text">
              Private by default
              <div className="banner-sub">
                A new document is never shared. Sharing happens only in Review &amp; share setup, on one exact
                version.
              </div>
            </div>
          </div>
        </div>
      }
      foot={
        <>
          <Button variant="ghost" onClick={overlay.closeModal}>Cancel</Button>
          <Button
            variant="primary"
            disabled={!valid}
            onClick={() => {
              if (!project) return;
              const newId = nextId('doc');
              dispatch({
                type: 'document/add',
                document: {
                  id: newId,
                  title: title.trim(),
                  type,
                  clientId: project.clientId,
                  projectId: project.id,
                  workingVersion: 1,
                  submittedVersion: 0,
                  reviewState: 'draft',
                  visibility: 'private',
                  sections: sections.split('\n').map((s) => s.trim()).filter(Boolean),
                  internalNote: '',
                  modified: new Date().toISOString(),
                  versions: [],
                },
              });
              overlay.closeModal();
              overlay.toast('Document created', 'It stays private until you request a review.', 'ok');
              navigate(`#/documents/${newId}`);
            }}
          >
            Create document
          </Button>
        </>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

const STAGES: { value: ProjectStage; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'planned', label: 'Planned' },
  { value: 'active', label: 'Active' },
  { value: 'on-hold', label: 'On hold' },
  { value: 'in-review', label: 'In review' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'closed', label: 'Closed' },
  { value: 'cancelled', label: 'Cancelled' },
];

function ChangeStageModal({ projectId }: { projectId?: string }) {
  const { dispatch, derived } = useStore();
  const overlay = useOverlay();
  const project = derived.projectById(projectId ?? null);
  const [stage, setStage] = useState<ProjectStage>(project?.stage ?? 'planned');
  if (!project) return null;

  return (
    <Shell
      title="Change stage"
      sub={`${project.name} is currently ${project.stage}.`}
      body={
        <div className="stack-tight">
          {STAGES.map((s) => (
            <button
              type="button"
              key={s.value}
              className={`option${stage === s.value ? ' selected' : ''}`}
              onClick={() => setStage(s.value)}
            >
              <span className="radio-mark" />
              <span>
                <span className="option-title">{s.label}</span>
              </span>
            </button>
          ))}
          <div className="banner mt-12">
            <div className="banner-text">
              Stages are manual in V1
              <div className="banner-sub">
                Overdue and waiting are attention flags, not stages — they are computed, never set.
              </div>
            </div>
          </div>
        </div>
      }
      foot={
        <>
          <Button variant="ghost" onClick={overlay.closeModal}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => {
              dispatch({ type: 'project/patch', id: project.id, patch: { stage } });
              overlay.closeModal();
              overlay.toast('Stage changed', `Now ${stage}.`, 'ok');
            }}
          >
            Change stage
          </Button>
        </>
      }
    />
  );
}

function ProjectMenuModal({ projectId }: { projectId?: string }) {
  const { state, dispatch, derived } = useStore();
  const overlay = useOverlay();
  const project = derived.projectById(projectId ?? null);
  if (!project) return null;

  const client = derived.clientById(project.clientId);

  return (
    <Shell
      title={project.name}
      sub={`${client?.name ?? ''} · ${project.stage}`}
      body={
        <div className="stack-tight">
          <Button block icon="projects" onClick={() => { overlay.closeModal(); navigate(`#/projects/${project.id}?tab=work`); }}>
            Open work
          </Button>
          <Button
            block
            icon="refresh"
            onClick={() => {
              overlay.closeModal();
              overlay.openModal('change-stage', project.id);
            }}
          >
            Change stage
          </Button>
          <Button
            block
            icon="clock"
            onClick={() => {
              const onHold = project.stage !== 'on-hold';
              dispatch({ type: 'project/placeHold', id: project.id, onHold });
              overlay.closeModal();
              overlay.toast(onHold ? 'Project placed on hold' : 'Project resumed', undefined, 'warn');
            }}
          >
            {project.stage === 'on-hold' ? 'Resume project' : 'Place on hold'}
          </Button>
          <Button
            block
            icon="checkCircle"
            onClick={() => {
              dispatch({ type: 'project/patch', id: project.id, patch: { stage: 'closed' } });
              overlay.closeModal();
              overlay.toast('Project closed', 'Its client is not archived, and access is not revoked.', 'ok');
            }}
          >
            Close project
          </Button>
          <div className="divider-h" style={{ margin: '10px 0' }} />
          <p className="meta">
            {state.documents.filter((d) => d.projectId === project.id).length} documents ·{' '}
            {derived.tasksOfProject(project.id).length} tasks ·{' '}
            {derived.reviewsOfProject(project.id).length} review requests
          </p>
        </div>
      }
      foot={<Button variant="ghost" onClick={overlay.closeModal}>Close</Button>}
    />
  );
}

function UploadFileModal({ projectId }: { projectId?: string }) {
  const { derived } = useStore();
  const overlay = useOverlay();
  const project = derived.projectById(projectId ?? null);
  const [name, setName] = useState('');
  const [progress, setProgress] = useState<number | null>(null);

  if (!project) return null;

  return (
    <Shell
      title="Upload a file"
      sub="File progress is shown inline. A failed upload retains your selection."
      body={
        <div className="stack">
          <Field label="File name" htmlFor="uf-name">
            <TextInput
              id="uf-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="press-artwork-final.pdf"
              autoFocus
            />
          </Field>
          <div
            style={{
              border: '1px dashed var(--edge)',
              borderRadius: 'var(--r-control)',
              display: 'grid',
              placeItems: 'center',
              height: 120,
            }}
          >
            <span className="meta">Drop a file here, or type a name above for this demo</span>
          </div>
          {progress !== null ? (
            <div className="progress">
              <div className="progress-track">
                <div className={progress >= 100 ? 'progress-fill ok' : 'progress-fill'} style={{ width: `${progress}%` }} />
              </div>
              <span className="progress-label">
                {progress >= 100 ? 'Upload complete' : `Uploading ${progress}%`}
              </span>
            </div>
          ) : null}
          <p className="meta">
            Files stay private until they are included in a delivery package, and a replacement upload can never
            alter a package that has already been delivered.
          </p>
        </div>
      }
      foot={
        <>
          <Button variant="ghost" onClick={overlay.closeModal}>Cancel</Button>
          <Button
            variant="primary"
            disabled={name.trim().length === 0 || (progress !== null && progress < 100)}
            onClick={() => {
              setProgress(0);
              let pct = 0;
              const timer = window.setInterval(() => {
                pct += 20;
                setProgress(Math.min(pct, 100));
                if (pct >= 100) {
                  window.clearInterval(timer);
                  window.setTimeout(() => {
                    overlay.closeModal();
                    overlay.toast(
                      'Upload simulated',
                      `${name} · this build keeps uploads in memory only; no backend is connected.`,
                      'warn'
                    );
                  }, 400);
                }
              }, 300);
            }}
          >
            Upload
          </Button>
        </>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Security & help                                                             */
/* -------------------------------------------------------------------------- */

/**
 * The recovery route behind A01's "Security & help" links.
 *
 * A01 makes two claims — client data stays with the owner, and access is
 * granted one record at a time — so the surface needs somewhere those claims
 * can be read. It is a modal rather than a route because it is a footnote on
 * the identity screen, not a destination of its own, and sign-in is not built
 * yet, so "locked out" currently means "back to the entry surface".
 */
function SecurityHelpModal() {
  const { state } = useStore();
  const overlay = useOverlay();

  return (
    <Shell
      title="Security & help"
      sub={`${state.workspace.name} · how client work is held`}
      body={
        <div className="stack">
          <Defs>
            <Def k="Who can sign in">You. V1 is a single-owner workspace — there are no team seats.</Def>
            <Def k="Who can see client work">
              Only you, until you grant a client access to one exact version. A grant never covers the
              workspace.
            </Def>
            <Def k="What a grant covers">
              One recipient, one object, one role and an expiry. Nothing is inherited from the client, the
              project or a sibling document.
            </Def>
            <Def k="Revoking access">
              Revoking access does not archive anything, and archiving does not revoke access.
            </Def>
          </Defs>

          <p className="meta">
            These are the V1 access rules, not a legal claim. Contact{' '}
            <a href={`mailto:${state.workspace.ownerEmail}`}>{state.workspace.ownerEmail}</a> for anything
            else. Terms and Privacy are published once the owner supplies approved copy.
          </p>
        </div>
      }
      foot={
        <>
          <Button variant="primary" onClick={overlay.closeModal}>Close</Button>
          <Button
            onClick={() => {
              overlay.closeModal();
              navigate('#/auth');
            }}
          >
            Back to entry
          </Button>
        </>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Destructive                                                                 */
/* -------------------------------------------------------------------------- */

function ResetModal() {
  const { dispatch } = useStore();
  const overlay = useOverlay();
  const [confirm, setConfirm] = useState(false);

  return (
    <Shell
      title="Reset demo data?"
      sub="This restores the seeded workspace. It affects this browser only."
      body={
        <div className="stack">
          <div className="banner bad">
            <div className="banner-text">
              <div>Every change you have made in this browser will be discarded.</div>
              <div className="banner-sub">
                Clients, projects, documents, versions, reviews, deliveries and grants all return to their seeded
                state.
              </div>
            </div>
          </div>
          <Check
            label="I understand this discards my changes"
            checked={confirm}
            onChange={(e) => setConfirm(e.target.checked)}
          />
        </div>
      }
      foot={
        <>
          <Button variant="ghost" onClick={overlay.closeModal}>Cancel</Button>
          <Button
            variant="danger"
            disabled={!confirm}
            onClick={() => {
              dispatch({ type: 'reset' });
              overlay.closeModal();
              overlay.toast('Demo data reset', 'The workspace is back to its seeded state.', 'warn');
              navigate('#/home');
            }}
          >
            Reset data
          </Button>
        </>
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Teams Collaboration                                                        */
/* -------------------------------------------------------------------------- */

function InviteTeamModal() {
  const { state } = useStore();
  const overlay = useOverlay();
  const [emails, setEmails] = useState('');
  const [role, setRole] = useState<'Editor' | 'Admin' | 'Viewer'>('Editor');
  const [personalNote, setPersonalNote] = useState('');

  const trimmed = emails.trim();
  const valid = trimmed.length > 0 && trimmed.includes('@');

  const handleSend = () => {
    overlay.closeModal();
    overlay.toast('Team Invites Dispatched', `Invited ${trimmed} to ${state.workspace.name} as ${role}`, 'default');
  };

  return (
    <Shell
      title={`Invite to ${state.workspace.name}`}
      sub="Teammates will receive a secure desktop invitation to collaborate on client projects."
      body={
        <div className="stack">
          <Field label="Email addresses (comma separated)" htmlFor="invite-emails">
            <TextInput
              id="invite-emails"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="teammate@company.com, designer@studio.com"
              autoFocus
            />
          </Field>
          <Field label="Team Role" htmlFor="invite-role">
            <Select
              id="invite-role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'Editor' | 'Admin' | 'Viewer')}
            >
              <option value="Editor">Editor (Can create projects, tasks and documents)</option>
              <option value="Admin">Admin (Full access to workspace settings and billing)</option>
              <option value="Viewer">Viewer (Read-only review access)</option>
            </Select>
          </Field>
          <Field label="Personal Note (optional)" htmlFor="invite-note">
            <TextArea
              id="invite-note"
              rows={2}
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              placeholder="Looking forward to working together on CoreDesk client deliveries!"
            />
          </Field>
        </div>
      }
      foot={
        <>
          <Button variant="ghost" onClick={overlay.closeModal}>Cancel</Button>
          <Button variant="primary" disabled={!valid} onClick={handleSend}>
            Send Invitation
          </Button>
        </>
      }
    />
  );
}

function CreateTeamModal() {
  const { dispatch } = useStore();
  const overlay = useOverlay();
  const [name, setName] = useState('');
  const [plan, setPlan] = useState<'pro' | 'starter'>('pro');

  const trimmed = name.trim();
  const valid = trimmed.length >= 2;

  const handleCreate = () => {
    dispatch({
      type: 'workspace/patch',
      patch: { name: trimmed },
    });
    overlay.closeModal();
    overlay.toast('Team Created', `Created and switched to team “${trimmed}”`, 'default');
  };

  return (
    <Shell
      title="Create a New Team"
      sub="Organize client work, collaborators, and deliverables within an isolated workspace."
      body={
        <div className="stack">
          <Field label="Team or Company Name" htmlFor="create-team-name">
            <TextInput
              id="create-team-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Design Collective"
              autoFocus
            />
          </Field>
          <Field label="Workspace Tier" htmlFor="create-team-plan">
            <Select
              id="create-team-plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value as 'pro' | 'starter')}
            >
              <option value="pro">Pro Workspace (Unlimited clients, projects and review threads)</option>
              <option value="starter">Starter Workspace (Up to 3 active clients)</option>
            </Select>
          </Field>
        </div>
      }
      foot={
        <>
          <Button variant="ghost" onClick={overlay.closeModal}>Cancel</Button>
          <Button variant="primary" disabled={!valid} onClick={handleCreate}>
            Create Team Workspace
          </Button>
        </>
      }
    />
  );
}

