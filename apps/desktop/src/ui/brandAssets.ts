/**
 * Brand assets, resolved once.
 *
 * WHY THIS MODULE EXISTS
 * The mark's path used to be a literal `./coredesk-mark.png` written out at each
 * use site. That has two failure modes, both silent:
 *
 *   1. A relative URL is only correct while the document base happens to be the
 *      application root. Today the router is hash-based (`#/clients/…`), so the
 *      base never moves and the literal works. The moment anything switches to
 *      path-based routing, or a `<base>` tag appears, every copy of the literal
 *      resolves somewhere else and the mark renders as a broken-image icon —
 *      with no console error, because a 404 on an <img> is not an error the page
 *      reports.
 *
 *   2. Two literals drift. One gets fixed, the other does not, and the bug looks
 *      intermittent depending on which screen you are on.
 *
 * So the asset is imported as a module and its final URL is produced by the
 * bundler. That is base-agnostic (Vite's `base: './'` emits a relative URL and
 * resolves it correctly under both http and file://), it is a single source, and
 * a missing file becomes a build failure rather than a broken icon.
 *
 * The load check below is the second half of that: it catches the one case a
 * bundler cannot — a file that builds fine but is not copied into the packaged
 * app.
 */

import iconUrl from '../assets/syntaflow-icon.png';
import iconWbgUrl from '../assets/syntaflow-icon-wbg.png';
import fullLogoUrl from '../assets/syntaflow-full.png';

/** The Syntaflow symbol mark (logo icon). Real artwork, never a substituted glyph. */
export const BRAND_MARK_SRC: string = iconUrl;
/** The Syntaflow symbol mark with background (LogoIcon_WBG.png), used for collapsed sidebar. */
export const BRAND_MARK_WBG_SRC: string = iconWbgUrl;
export const BRAND_ICON_SRC: string = iconUrl;

/** The full horizontal Syntaflow logo (logo 4) with symbol and wordmark. */
export const BRAND_LOGO_FULL_SRC: string = fullLogoUrl;

/**
 * True once the mark has been observed to have non-zero natural dimensions.
 *
 * A broken `<img>` still occupies its layout box, so width and visibility prove
 * nothing — `naturalWidth` is the only honest signal, and it is what the
 * Electron harness asserts on.
 */
export function isMarkLoaded(img: HTMLImageElement | null): boolean {
  return Boolean(img && img.complete && img.naturalWidth > 0);
}
