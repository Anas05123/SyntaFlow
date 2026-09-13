/**
 * P01 · Projects — one scoped engagement with an outcome.
 *
 * Every project belongs to exactly one client. Stage is manual; overdue and
 * waiting surface as attention flags rather than stages.
 */

import { useStore } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate } from '../app/router';
import { dueLabel, formatShortDate } from '../domain/dates';
import { Banner, Button, Card, CardBody, CardFoot, CardHead, Chip, PageHead, Progress } from '../ui/primitives';
import { projectAttention } from '../domain/status';

export function ProjectsScreen() {
  const { derived } = useStore();
  const overlay = useOverlay();

  return (
    <>
      <PageHead
        eyebrow="Delivery"
        title="Projects"
        sub="One scoped engagement with an outcome. Every project belongs to exactly one client."
      />

      <div className="cd-section-controls">
        <div className="cd-section-controls-left">
          <Button icon="filter" onClick={() => overlay.toast('Filters', 'Filter by client, stage or attention flag.', 'default')}>
            Filter
          </Button>
        </div>
        <div className="cd-section-controls-right">
          <Button variant="primary" icon="plus" className="btn-apple" onClick={() => navigate('#/new-project')}>
            New Project
          </Button>
        </div>
      </div>

      <div className="mb-16">
        <Banner
          title={<><strong>Sequencing matters.</strong> Website design is deliberately held until the identity system is approved.</>}
          sub="Creating a project requires a client, a brief and dates — an incomplete draft cannot be shared."
          action={<Button size="sm" className="btn-apple" onClick={() => navigate('#/new-project')}>Start create flow</Button>}
        />
      </div>

      <div className="grid grid-2">
        {derived.projectsWithContext.map((p) => {
          const attention = projectAttention(p.overdueTaskCount, p.openReviewCount);
          return (
            <Card key={p.id}>
              <CardHead
                title={p.name}
                desc={`${p.clientName} · ${p.outcome}`}
                action={
                  <div className="row" style={{ gap: 6 }}>
                    {attention ? <Chip state={attention} /> : null}
                    <Chip state={p.stage} />
                  </div>
                }
              />
              <CardBody>
                <div className="defs">
                  <div className="def">
                    <span className="def-key">Next milestone</span>
                    <span className="def-val">{p.nextMilestone} · {formatShortDate(p.nextMilestoneDue)}</span>
                  </div>
                  <div className="def">
                    <span className="def-key">Next action</span>
                    <span className={`def-val ${p.nextActionTone === 'risk' ? 'mark-risk' : p.nextActionTone === 'waiting' ? 'mark-wait' : ''}`}>
                      {p.nextAction}
                    </span>
                  </div>
                  <div className="def">
                    <span className="def-key">Due</span>
                    <span className="def-val">
                      {dueLabel(p.due)}
                      {p.overdueTaskCount > 0 ? <> · <span className="mark-risk">{p.overdueTaskCount} overdue</span></> : null}
                    </span>
                  </div>
                  <div className="def">
                    <span className="def-key">Reviews</span>
                    <span className="def-val">
                      {p.openReviewCount > 0 ? `${p.openReviewCount} awaiting decision` : 'Nothing awaiting a decision'}
                    </span>
                  </div>
                  {p.delivery ? (
                    <div className="def">
                      <span className="def-key">Delivery</span>
                      <span className="def-val"><Chip state={p.delivery.state} /></span>
                    </div>
                  ) : null}
                </div>
                <div className="mt-16">
                  <Progress done={p.tasksDone} total={p.tasksTotal} />
                </div>
              </CardBody>
              <CardFoot>
                <div className="row-between">
                  <span className="meta">
                    {p.tasksTotal} task{p.tasksTotal === 1 ? '' : 's'} · {p.milestones.length} milestone{p.milestones.length === 1 ? '' : 's'}
                  </span>
                  <Button size="sm" onClick={() => navigate(`#/projects/${p.id}`)}>Open workspace</Button>
                </div>
              </CardFoot>
            </Card>
          );
        })}
      </div>
    </>
  );
}
