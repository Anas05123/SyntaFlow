/**
 * The CoreDesk mark.
 *
 * The brand symbol is a four-lobed interwoven ribbon loop — a continuous path
 * that crosses itself. It is the product's central metaphor: client work stays
 * on one thread. The asset is the real mark (a transparent PNG derived from the
 * supplied IconLogo), never a substituted glyph.
 *
 * `plate` supplies environmental light behind the mark. The mark's own lobes
 * are cobalt at the darkest end of the brand ramp, so on a near-black canvas
 * they lose their edge without some light around them. A cobalt/cyan wash
 * restores depth without bloom — glow and glassmorphism are excluded by the
 * Foundations rules.
 */

import { useEffect, useRef, useState } from 'react';

import { BRAND_MARK_SRC, isMarkLoaded } from './brandAssets';

export interface BrandMarkProps {
  /** Rendered size in px. */
  size?: number;
  /** Paints environmental light behind the mark. Colour identity use. */
  plate?: boolean;
  className?: string;
}

export function BrandMark({ size = 30, plate = false, className }: BrandMarkProps) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [failed, setFailed] = useState(false);

  /* Report a mark that did not load, once. A 404 on an <img> is not an error the
     page surfaces on its own, so a missing asset would otherwise ship as a broken
     icon and nothing else. In development this makes the cause immediate. */
  useEffect(() => {
    const img = ref.current;
    if (!img || isMarkLoaded(img)) return;
    const check = () => {
      if (!isMarkLoaded(img)) {
        setFailed(true);
        if (import.meta.env?.DEV) {
          console.error(
            `[CoreDesk] brand mark failed to load from "${BRAND_MARK_SRC}". ` +
              'Check that src/assets/coredesk-mark.png exists and is copied into the build.'
          );
        }
      }
    };
    img.addEventListener('error', check);
    return () => img.removeEventListener('error', check);
  }, []);

  return (
    <span
      className={className ? `brand-mark ${className}` : 'brand-mark'}
      data-plate={plate ? 'true' : undefined}
      data-mark-failed={failed ? 'true' : undefined}
      style={{ ['--mark-size' as string]: `${size}px` }}
    >
      <span className="brand-mark-glow" aria-hidden="true" />
      {/* The URL comes from the bundler via brandAssets, never a literal path:
          a relative literal is only correct while the document base is the app
          root, and it silently breaks the day that stops being true. */}
      <img ref={ref} src={BRAND_MARK_SRC} alt="" draggable={false} decoding="async" />
    </span>
  );
}
