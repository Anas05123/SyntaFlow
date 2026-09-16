/**
 * CoreDesk window chrome — the top row of the frameless desktop window.
 *
 * The whole window is one surface, so this is not a "title bar" bolted onto a
 * page. It is the first band of the composition: identity on the left, window
 * controls on the right, and a drag region across the middle that lets the user
 * move the window from anywhere that is not an interactive control.
 *
 * Drag rules that Electron actually enforces:
 *   - `-webkit-app-region: drag` makes a region move the window, and it swallows
 *     clicks. Anything interactive inside must opt back out with `no-drag`.
 *   - Drag regions also swallow double-click-to-maximize unless the region itself
 *     is draggable, which it is — Electron handles that natively.
 *   - Text inside a drag region cannot be selected. That is correct for chrome
 *     and wrong for content, so content never sits in here.
 *
 * In the browser preview there is no main process, so the controls are omitted
 * rather than rendered dead.
 */

import { BrandMark } from './BrandMark';
import { useDesktopWindow } from './useDesktopWindow';

/**
 * The window controls, exported on their own.
 *
 * CoreDesk's window is frameless, so minimize / maximize / close have to be drawn
 * by the renderer. They belong in the application's own top bar rather than in a
 * separate chrome strip above it — two stacked bars wastes a whole row of a
 * 900px window, and the reference for this screen puts them at the right of the
 * command bar, where a desktop application keeps them.
 */
export function WindowControls() {
  const win = useDesktopWindow();
  if (!win.isDesktop) return null;

  return (
    <div className="cd-controls" role="group" aria-label="Window controls">
      <button
        type="button"
        className="cd-control"
        onClick={win.minimize}
        aria-label="Minimize"
        title="Minimize"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M0 5h10" stroke="currentColor" strokeWidth="1" />
        </svg>
      </button>

      <button
        type="button"
        className="cd-control"
        onClick={win.toggleMaximize}
        aria-label={win.maximized ? 'Restore' : 'Maximize'}
        title={win.maximized ? 'Restore' : 'Maximize'}
      >
        {win.maximized ? (
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" fill="none">
            <path d="M2.5 2.5V.5h7v7h-2" stroke="currentColor" strokeWidth="1" />
            <rect x=".5" y="2.5" width="7" height="7" stroke="currentColor" strokeWidth="1" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" fill="none">
            <rect x=".5" y=".5" width="9" height="9" stroke="currentColor" strokeWidth="1" />
          </svg>
        )}
      </button>

      <button
        type="button"
        className="cd-control cd-control-close"
        onClick={win.close}
        aria-label="Close"
        title="Close"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M0 0l10 10M10 0L0 10" stroke="currentColor" strokeWidth="1" />
        </svg>
      </button>
    </div>
  );
}

export interface WindowChromeProps {
  /** Shown beside the mark. A record name, or the product name. */
  label?: string;
  /** Quiet second line, e.g. the workspace. */
  sub?: string;
  /** Rendered between identity and controls, inside the drag region. */
  children?: React.ReactNode;
}

export function WindowChrome({ label = 'Syntaflow', sub, children }: WindowChromeProps) {
  const win = useDesktopWindow();

  return (
    <header className="cd-chrome" data-desktop={win.isDesktop ? 'true' : 'false'}>
      {/* Identity. Non-draggable so the mark can carry a tooltip or menu later. */}
      <div className="cd-chrome-id">
        <BrandMark size={22} />
        <span className="cd-chrome-label">{label}</span>
        {sub ? <span className="cd-chrome-sub">{sub}</span> : null}
      </div>

      {/* The drag region. Empty middle band, exactly as a title bar should be. */}
      <div className="cd-chrome-drag" aria-hidden="true" />

      {children ? <div className="cd-chrome-slot">{children}</div> : null}

      <WindowControls />
    </header>
  );
}
