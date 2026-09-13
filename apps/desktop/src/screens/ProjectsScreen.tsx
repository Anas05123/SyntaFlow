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
import { Banner, Button, Chip, PageHead } from '../ui/primitives';
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

      <div className="cd-projects-inventory">
        <div style={{ overflowX: 'auto' }}>
          <table className="cd-projects-table">
            <thead>
              <tr>
                <th>Project & Client</th>
                <th>Stage & Attention</th>
                <th>Next Milestone</th>
                <th>Target Due Date</th>
                <th>Review Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {derived.projectsWithContext.map((p) => {
                const attention = projectAttention(p.overdueTaskCount, p.openReviewCount);
                return (
                  <tr key={p.id} onClick={() => navigate(`#/projects/${p.id}`)}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>
                          {p.name}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--metadata)' }}>
                          {p.clientName} · {p.outcome}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="row" style={{ gap: 6, alignItems: 'center' }}>
                        <Chip state={p.stage} />
                        {attention ? <Chip state={attention} /> : null}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ color: 'var(--text)', fontSize: 13, fontWeight: 500 }}>
                          {p.nextMilestone}
                        </span>
                        <span style={{ fontSize: 11.5, color: p.nextActionTone === 'risk' ? 'var(--risk)' : p.nextActionTone === 'waiting' ? 'var(--waiting)' : 'var(--metadata)' }}>
                          {p.nextAction}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ color: 'var(--text)' }}>
                          {dueLabel(p.due)}
                        </span>
                        {p.overdueTaskCount > 0 ? (
                          <span style={{ fontSize: 11, color: 'var(--risk)', fontWeight: 600 }}>
                            {p.overdueTaskCount} overdue task{p.overdueTaskCount === 1 ? '' : 's'}
                          </span>
                        ) : (
                          <span style={{ fontSize: 11, color: 'var(--metadata)' }}>
                            {formatShortDate(p.due)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: 12.5, color: p.openReviewCount > 0 ? 'var(--waiting)' : 'var(--metadata)' }}>
                        {p.openReviewCount > 0 ? `${p.openReviewCount} awaiting review` : 'Up to date'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`#/projects/${p.id}`);
                        }}
                      >
                        Open Workspace →
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
