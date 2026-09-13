/**
 * G01 · Invite & Verify.
 *
 * An invitation is for one person and one object. It never opens the rest of
 * the workspace, and the identity check happens before anything is revealed.
 */

import { GuestBar, GuestShell } from '../../app/Shell';
import { useStore } from '../../state/store';
import { navigate } from '../../app/router';
import { Button, Card, CardBody, Def, Defs, Field, TextInput } from '../../ui/primitives';

export function GuestInviteScreen() {
  const { state } = useStore();
  const grant = state.grants.find((g) => g.state === 'invited') ?? state.grants[0];

  return (
    <GuestShell>
      <GuestBar
        title={state.workspace.name}
        sub={`Shared with you by ${state.workspace.ownerName}`}
      />
      <div className="guest-wrap narrow" style={{ paddingTop: '8vh' }}>
        <div className="eyebrow">Invitation · G01</div>
        <h1>Verify to open your review</h1>
        <p className="page-sub mt-8">
          This invitation is for one person and one piece of work. It does not open the rest of the workspace.
        </p>

        <Card className="mt-24">
          <CardBody>
            <Defs>
              <Def k="Invited">{maskEmail(grant?.recipient.email ?? 'guest@example.com')}</Def>
              <Def k="Work">{grant?.objectLabel ?? '—'}</Def>
              <Def k="Role">{grant?.role ?? 'Guest reviewer'} — you can approve or request changes</Def>
              <Def k="Expires">{grant?.expires ?? 'Not set'}</Def>
            </Defs>

            <div className="stack mt-20">
              <Field label="Confirm your email" htmlFor="g-email">
                <TextInput id="g-email" type="email" defaultValue={grant?.recipient.email ?? ''} />
              </Field>
              <Button variant="primary" size="lg" block onClick={() => navigate('#/guest/shared')}>
                Open my review
              </Button>
              <p className="meta" style={{ textAlign: 'center' }}>
                Not you? <a href="#/guest/wrong-account">Switch account</a>
              </p>
            </div>
          </CardBody>
        </Card>

        <div className="guest-note">
          This link is transactional. {state.workspace.name} can revoke it at any time, and it never grants access
          to other projects or documents.
        </div>
      </div>
    </GuestShell>
  );
}

function maskEmail(email: string): string {
  const [user, domain] = email.split('@');
  if (!domain) return '—';
  const head = user.slice(0, 1);
  return `${head}${'•'.repeat(Math.max(user.length - 1, 3))}@${domain}`;
}
