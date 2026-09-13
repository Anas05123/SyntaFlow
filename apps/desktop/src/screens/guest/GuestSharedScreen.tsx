/**
 * G02 · Shared Project.
 *
 * Only explicitly granted objects appear. Internal notes, owner tasks and
 * unshared files are excluded by design, and the exclusion is stated.
 */

import { GuestBar, GuestShell } from '../../app/Shell';
import { useStore } from '../../state/store';
import { formatDate, initials } from '../../domain/dates';
import { Button, Card, CardBody, CardHead, Chip, Def, Defs } from '../../ui/primitives';

export function GuestSharedScreen() {
  const { state, derived } = useStore();

  const grant = state.grants.find((g) => g.state === 'active' || g.state === 'verified');
  const review = derived.waitingReviews[0] ?? state.reviews[0];
  const doc = review ? derived.documentById(review.documentId) : null;
  const project = review ? derived.projectById(review.projectId) : null;
  const delivery = state.deliveries.find((d) => d.deliveredOn);

  return (
    <GuestShell>
      <GuestBar
        title={state.workspace.name}
        sub="Shared project summary"
        initialsText={grant ? initials(grant.recipient.name) : undefined}
      />
      <div className="guest-wrap">
        <div className="eyebrow">Shared project · G02</div>
        <h1>{project?.name ?? 'Shared work'}</h1>
        <p className="page-sub mt-8">
          Only what was explicitly shared with you appears here. Internal notes, owner tasks and unshared files are
          excluded by design.
        </p>

        <div className="grid grid-2 mt-24">
          <Card>
            <CardHead title="Waiting on you" desc="Requested action with its due date." />
            <CardBody flush>
              {review && doc ? (
                <div className="item-row">
                  <div className="item-main">
                    <div className="item-title">Review {doc.title} v{review.version}</div>
                    <div className="item-sub">
                      Requested by {state.workspace.ownerName} · due {formatDate(review.due)}
                    </div>
                  </div>
                  <div className="item-side"><Chip state={review.state} /></div>
                  <div className="item-actions">
                    <Button size="sm" variant="primary" onClick={() => { window.location.hash = '#/guest/review'; }}>
                      Open review
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="card-body"><p className="meta">Nothing is waiting on you.</p></div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHead title="Delivered to you" desc="Packages you can download." />
            <CardBody flush>
              {delivery ? (
                <div className="item-row">
                  <div className="item-main">
                    <div className="item-title">{delivery.title}</div>
                    <div className="item-sub">
                      {delivery.fileIds.length} file{delivery.fileIds.length === 1 ? '' : 's'} · delivered{' '}
                      {formatDate(delivery.deliveredOn)}
                    </div>
                  </div>
                  <div className="item-side"><Chip state="delivered" /></div>
                  <div className="item-actions">
                    <Button size="sm" onClick={() => { window.location.hash = '#/guest/delivery'; }}>Open</Button>
                  </div>
                </div>
              ) : (
                <div className="card-body"><p className="meta">Nothing has been delivered yet.</p></div>
              )}
            </CardBody>
          </Card>
        </div>

        <Card className="mt-16">
          <CardHead title="Progress you can see" desc="A shared summary, not the owner's task list." />
          <CardBody>
            <Defs>
              <Def k="Project">{project?.name ?? '—'}</Def>
              <Def k="Next milestone">
                {project ? `${project.nextMilestone} · due ${formatDate(project.nextMilestoneDue)}` : '—'}
              </Def>
              <Def k="Last shared">{doc ? formatDate(doc.modified) : '—'}</Def>
              <Def k="Your access">
                <Chip state="active" label={`Active${grant?.expires ? ` until ${formatDate(grant.expires)}` : ''}`} />
              </Def>
            </Defs>
          </CardBody>
        </Card>

        <div className="guest-note">
          Excluded from this view: internal notes, owner tasks, unshared documents and the rest of the workspace.
        </div>
      </div>
    </GuestShell>
  );
}
