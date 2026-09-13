/**
 * G01-G04 failure paths.
 *
 * Expired invite, wrong account, revoked link and unauthorized access. None of
 * these reveal anything about the record — an access failure never leaks content.
 */

import { GuestBar, GuestShell } from '../../app/Shell';
import { useStore } from '../../state/store';
import { useOverlay } from '../../ui/overlay';
import { Button, Card } from '../../ui/primitives';
import { Icon, type IconName } from '../../ui/Icon';

interface Notice {
  title: string;
  text: string;
  action: string;
  icon: IconName;
  tone?: 'error' | 'blocked';
}

const NOTICES: Record<string, Notice> = {
  'wrong-account': {
    title: 'This invitation is for a different email',
    text: 'You are signed in as another account. Switching identity will not reveal any content from this workspace.',
    action: 'Switch account',
    icon: 'lock',
    tone: 'blocked',
  },
  unavailable: {
    title: 'This link is no longer available',
    text: 'Access was revoked on 15 Aug 2026, or the link has expired. The record itself is intact.',
    action: 'Request renewed access',
    icon: 'alert',
    tone: 'blocked',
  },
  expired: {
    title: 'This invitation has expired',
    text: 'Invitations expire so old links cannot be reused. Ask the workspace owner for a new one.',
    action: 'Request a new invitation',
    icon: 'clock',
    tone: 'blocked',
  },
  unauthorized: {
    title: 'You do not have access to this record',
    text: 'The link is valid, but this account was never granted access to this work.',
    action: 'Return to sign in',
    icon: 'lock',
    tone: 'error',
  },
};

export function GuestNoticeScreen({ kind }: { kind: string }) {
  const { state } = useStore();
  const overlay = useOverlay();
  const notice = NOTICES[kind] ?? {
    title: 'Unavailable',
    text: 'This page could not be opened.',
    action: 'Request access',
    icon: 'alert' as IconName,
  };

  return (
    <GuestShell>
      <GuestBar title={state.workspace.name} sub="Secure access" />
      <div className="guest-wrap narrow" style={{ paddingTop: '7vh' }}>
        <Card>
          <div className={`state ${notice.tone ?? ''}`}>
            <span className="state-icon"><Icon name={notice.icon} size={20} /></span>
            <div className="state-title">{notice.title}</div>
            <p className="state-text">{notice.text}</p>
            <div className="state-actions">
              <Button
                onClick={() => {
                  window.location.hash = '#/guest/invite';
                }}
              >
                Open the invitation again
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  overlay.toast('Renewed access requested', 'The workspace owner has been asked to issue a new invitation.', 'ok');
                }}
              >
                {notice.action}
              </Button>
            </div>
          </div>
        </Card>
        <div className="guest-note">
          Nothing about the record has been revealed by this page. Access failures never leak content.
        </div>
      </div>
    </GuestShell>
  );
}
