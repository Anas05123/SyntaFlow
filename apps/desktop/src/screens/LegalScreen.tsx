/**
 * A07-A08 · Terms and Privacy.
 *
 * The page contract is explicit: these need actual approved copy, not
 * placeholder legal claims. So the screen renders an unpublished state with a
 * recovery route instead of inventing legal language.
 */

import { useStore } from '../state/store';
import { useOverlay } from '../ui/overlay';
import { navigate } from '../app/router';
import { Banner, Button, Card, CardBody, Chip, Def, Defs } from '../ui/primitives';

export function LegalScreen({ kind }: { kind: 'terms' | 'privacy' }) {
  const { state } = useStore();
  const overlay = useOverlay();
  const title = kind === 'terms' ? 'Terms' : 'Privacy';

  return (
    <div className="legal-wrap">
      <Button variant="ghost" size="sm" icon="arrowLeft" className="mb-16" onClick={() => navigate('#/auth')}>
        Back
      </Button>

      <div className="eyebrow">{title} · {kind === 'terms' ? 'A07' : 'A08'}</div>
      <h1>{title}</h1>

      <Card className="mt-20">
        <CardBody>
          <Banner
            tone="bad"
            title="Owner-supplied copy is required before release."
            sub="This surface renders the workspace owner's own terms. Nothing here is placeholder legal language and no claim is made on their behalf."
            action={<Button size="sm" onClick={() => navigate('#/settings/account')}>Edit in Settings</Button>}
          />

          <Defs>
            <Def k="Version">Not yet published</Def>
            <Def k="Effective date">Not yet set</Def>
            <Def k="Contact route">{state.workspace.ownerEmail}</Def>
            <Def k="Status"><Chip state="draft" label="Awaiting copy" /></Def>
          </Defs>

          <div className="field mt-20">
            <label className="field-label" htmlFor="legal-copy">{title} copy</label>
            <textarea
              className="textarea"
              id="legal-copy"
              style={{ minHeight: 180 }}
              placeholder={`Paste the approved ${title.toLowerCase()} copy here. This is a release dependency, not a placeholder.`}
            />
            <span className="field-hint">
              Both pages are reachable from the auth screens and from Settings.
            </span>
          </div>

          <Button
            variant="primary"
            className="mt-16"
            onClick={() =>
              overlay.toast(`${title} saved`, 'The published copy version and effective date are recorded with it.', 'ok')
            }
          >
            Save {title.toLowerCase()}
          </Button>
        </CardBody>
      </Card>

      <p className="meta mt-16">
        If content is unavailable, a recovery route is shown rather than an empty page.
      </p>
    </div>
  );
}
