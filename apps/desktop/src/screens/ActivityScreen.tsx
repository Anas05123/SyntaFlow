/**
 * W04 · Activity — review requests, feedback, approvals, delivery and access.
 *
 * Reading an event does not resolve the work it refers to, so each event states
 * what is still owed.
 */

import { useState } from 'react';

import { useStore } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { formatDate, formatTime } from '../domain/dates';
import { Banner, Button, Card, CardBody, CardHead, PageHead, Segmented } from '../ui/primitives';
import { Icon, type IconName } from '../ui/Icon';
import type { ActivityType } from '../domain/types';

const EVENT_ICON: Record<ActivityType, IconName> = {
  'review-requested': 'send',
  feedback: 'message',
  approved: 'checkCircle',
  changes: 'undo',
  delivered: 'package',
  acknowledged: 'check',
  access: 'shield',
  created: 'plus',
};

const EVENT_TONE: Record<ActivityType, string> = {
  'review-requested': 'waiting',
  feedback: 'waiting',
  approved: 'approved',
  changes: 'changes',
  delivered: 'approved',
  acknowledged: 'approved',
  access: 'neutral',
  created: 'neutral',
};

export function ActivityScreen() {
  const { state, dispatch, derived } = useStore();
  const overlay = useOverlay();
  const [filter, setFilter] = useState<'unread' | 'all'>('unread');

  const unread = derived.unreadActivity;
  const list = filter === 'unread' ? state.activity.filter((e) => !e.read) : state.activity;

  return (
    <>
      <PageHead
        eyebrow="Record"
        title="Activity"
        sub="Review requests, feedback, approvals and delivery events. Reading an event does not resolve the work it refers to."
        actions={
          <Button
            icon="check"
            onClick={() => {
              dispatch({ type: 'activity/readAll' });
              overlay.toast('All activity marked read', 'Marking read does not resolve the work it refers to.', 'ok');
            }}
          >
            Mark all read
          </Button>
        }
      />

      <div className="row row-wrap mb-16">
        <Segmented
          ariaLabel="Activity filter"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'unread', label: 'Unread', count: unread },
            { value: 'all', label: 'All', count: state.activity.length },
          ]}
        />
      </div>

      <div className="split">
        <Card>
          <CardBody flush>
            {list.length === 0 ? (
              <div className="state">
                <span className="state-icon"><Icon name="checkCircle" size={20} /></span>
                <div className="state-title">Nothing unread</div>
                <p className="state-text">
                  You are up to date. Switch to All to review the full history.
                </p>
                <div className="state-actions">
                  <Button onClick={() => setFilter('all')}>Show all activity</Button>
                </div>
              </div>
            ) : (
              list.map((e) => (
                <div className={`event tone-${EVENT_TONE[e.type]}${e.read ? '' : ' unread'}`} key={e.id}>
                  <span className="event-mark"><Icon name={EVENT_ICON[e.type]} size={14} /></span>
                  <div style={{ minWidth: 0 }}>
                    <div className="event-title">
                      <span className="actor">{e.actor}</span> {e.title}
                    </div>
                    <div className="event-meta">
                      <span>{formatDate(e.date)} · {formatTime(e.date)}</span>
                      <span>·</span>
                      <a href={e.targetHref}>{e.targetLabel}</a>
                      {!e.read ? <span className="chip tone-accent">Unread</span> : null}
                    </div>
                    <div className="meta mt-8" style={{ lineHeight: 1.6 }}>{e.resolves}</div>
                    <div className="row mt-12">
                      <a className="btn btn-sm btn-secondary" href={e.targetHref}>
                        <Icon name="external" size={14} /> Open source
                      </a>
                      {!e.read ? (
                        <Button size="sm" variant="ghost" onClick={() => dispatch({ type: 'activity/read', id: e.id })}>
                          Mark read
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        <div className="stack">
          <Card>
            <CardHead title="Why this matters" />
            <CardBody>
              <p className="meta" style={{ lineHeight: 1.65 }}>
                A comment is not a decision. Activity shows what happened; the review request holds what is still
                owed.
              </p>
              <div className="defs mt-12">
                <div className="def"><span className="def-key">Waiting</span><span className="def-val">{derived.waitingReviews.length} reviews</span></div>
                <div className="def">
                  <span className="def-key">Changes owed</span>
                  <span className="def-val">{state.reviews.filter((r) => r.state === 'changes-requested').length} documents</span>
                </div>
                <div className="def">
                  <span className="def-key">Acknowledgments</span>
                  <span className="def-val">
                    {state.deliveries.filter((d) => d.acknowledgedOn).length} of {state.deliveries.length} deliveries
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHead
              title="Unavailable target"
              desc="If a linked record was deleted or access was revoked, the event stays with a recovery route."
            />
            <CardBody>
              <Banner
                tone="bad"
                title="Delivery for Gallery wayfinding is no longer available to its recipient."
                sub="Access was revoked on 15 Aug 2026. The record itself is intact."
                action={<Button size="sm" onClick={() => overlay.toast('Retrying…', 'The event stays until the target is reachable.', 'default')}>Retry</Button>}
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
