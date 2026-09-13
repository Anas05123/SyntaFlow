/**
 * G04 · Delivery — the guest package view.
 *
 * Only permitted files appear. Acknowledgment confirms receipt and is separate
 * from approval; it never retroactively approves work.
 */

import { useState } from 'react';

import { GuestBar, GuestShell } from '../../app/Shell';
import { useStore } from '../../state/store';
import { useOverlay } from '../../ui/overlay';
import { formatDate } from '../../domain/dates';
import { Button, Card, CardBody, CardHead, Chip } from '../../ui/primitives';

export function GuestDeliveryScreen() {
  const { state, derived } = useStore();
  const overlay = useOverlay();
  const [acknowledged, setAcknowledged] = useState(false);

  const delivery = state.deliveries.find((d) => d.deliveredOn) ?? state.deliveries[0];
  const files = delivery ? delivery.fileIds.map((id) => derived.fileById(id)).filter(Boolean) : [];

  if (!delivery) {
    return (
      <GuestShell>
        <GuestBar title={state.workspace.name} sub="Nothing delivered" />
        <div className="guest-wrap narrow" style={{ paddingTop: '8vh' }}>
          <Card>
            <CardBody>
              <div className="state">
                <div className="state-title">Nothing has been delivered to you yet</div>
                <p className="state-text">
                  When the workspace owner shares a package, it will appear here with the exact approved versions.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </GuestShell>
    );
  }

  return (
    <GuestShell>
      <GuestBar
        title="Delivery package"
        sub={state.workspace.name}
        initialsText="SB"
      />
      <div className="guest-wrap">
        <div className="eyebrow">Delivery · G04</div>
        <h1>{delivery.title}</h1>
        <p className="page-sub mt-8">
          Delivered {formatDate(delivery.deliveredOn)} by {state.workspace.ownerName}. These are the exact approved
          versions.
        </p>

        <Card className="mt-20">
          <CardHead
            title="Included files"
            desc="Only files you are permitted to download appear here."
            action={<Chip state="delivered" />}
          />
          <CardBody flush>
            {files.map((f) =>
              f ? (
                <div className="package-row" key={f.id}>
                  <span className={`package-badge ${f.kind}`}>{f.kind.toUpperCase()}</span>
                  <div className="item-main">
                    <div className="item-title">{f.name}</div>
                    <div className="item-sub">{f.meta}</div>
                  </div>
                  <Button
                    size="sm"
                    icon="download"
                    onClick={() => overlay.toast('Download started', f.name, 'ok')}
                  >
                    Download
                  </Button>
                </div>
              ) : null
            )}
          </CardBody>
        </Card>

        <Card className="mt-16">
          <CardHead title="Handoff notes" />
          <CardBody>
            <p className="muted" style={{ lineHeight: 1.65 }}>{delivery.notes}</p>
          </CardBody>
        </Card>

        <div className="decision-bar mt-16">
          <div>
            <div className="strong">{acknowledged ? 'Receipt acknowledged' : 'Acknowledge receipt'}</div>
            <div className="meta mt-4">
              {acknowledged
                ? `Recorded ${formatDate('2026-09-10')}. This confirms receipt only, not approval of the work.`
                : 'Optional. Acknowledgment confirms you received the package — it does not approve the work retroactively.'}
            </div>
          </div>
          <Button
            variant="primary"
            icon="check"
            disabled={acknowledged}
            onClick={() => {
              setAcknowledged(true);
              overlay.toast('Receipt acknowledged', 'This confirms receipt only, not approval of the work.', 'ok');
            }}
          >
            {acknowledged ? 'Acknowledged' : 'Acknowledge receipt'}
          </Button>
        </div>

        <div className="guest-note">
          Access to this package can be revoked by {state.workspace.name} at any time. If a file becomes
          unavailable, you will see a clear message with a way to request renewed access.
        </div>
      </div>
    </GuestShell>
  );
}
