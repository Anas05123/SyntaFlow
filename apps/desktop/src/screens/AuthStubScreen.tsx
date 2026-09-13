/**
 * A02 / A03 · Sign in and Sign up — not yet designed.
 *
 * These are honest placeholders, not screens. They exist so A01's entry actions
 * are never dead ends. They carry the same window frame as A01 — chrome, canvas
 * and light — because the surface should never fall out of the CoreDesk window,
 * even when the screen itself is not drawn yet.
 *
 * They deliberately contain no form: a half-drawn form is worse than an explicit
 * statement that the screen is not built, and these are separate phases.
 */

import { navigate } from '../app/router';
import { WindowChrome } from '../ui/WindowChrome';

export function AuthStubScreen() {
  return (
    <div className="cd-app">
      <WindowChrome />

      <main className="cd-stub">
        <div className="cd-stub-light" aria-hidden="true" />

        <div className="cd-stub-body">
          <h1 className="cd-stub-title">This screen is scheduled, not drawn.</h1>
          <p className="cd-stub-text">
            Account creation and sign-in are their own phases. Nothing here is a rejected or
            superseded attempt — the surface simply has not been designed.
          </p>

          <dl className="cd-stub-defs">
            <div>
              <dt>A01 · Auth entry</dt>
              <dd>Built — the screen you came from</dd>
            </div>
            <div>
              <dt>A02 · Sign in</dt>
              <dd>Next phase · credentials, recovery, retained destination</dd>
            </div>
            <div>
              <dt>A03 · Sign up</dt>
              <dd>Later phase · account creation and verification</dd>
            </div>
          </dl>

          <button
            type="button"
            className="cd-action cd-action-secondary"
            onClick={() => navigate('#/auth')}
          >
            Back to entry
          </button>
        </div>
      </main>
    </div>
  );
}
