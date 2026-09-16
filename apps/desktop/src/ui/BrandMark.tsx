/**
 * The Syntaflow brand marks.
 *
 * - BrandMark: Compact symbol mark (`logo icon`), used for app icon, collapsed sidebar,
 *   window chrome, compact headers, and startup mark.
 * - BrandLogo: Full horizontal logo (`logo 4`) with symbol and wordmark, used for
 *   expanded sidebar, auth pages, settings/about header, and branded showcases.
 */

import { useEffect, useRef, useState } from 'react';

import { BRAND_LOGO_FULL_SRC, BRAND_MARK_SRC, isMarkLoaded } from './brandAssets';

export interface BrandMarkProps {
  /** Rendered size in px. */
  size?: number;
  /** Paints environmental light behind the mark. Colour identity use. */
  plate?: boolean;
  className?: string;
  alt?: string;
}

export function BrandMark({ size = 30, plate = false, className, alt = 'Syntaflow' }: BrandMarkProps) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [failed, setFailed] = useState(false);

  /* Report a mark that did not load, once. */
  useEffect(() => {
    const img = ref.current;
    if (!img || isMarkLoaded(img)) return;
    const check = () => {
      if (!isMarkLoaded(img)) {
        setFailed(true);
        if (import.meta.env?.DEV) {
          console.error(
            `[Syntaflow] brand mark failed to load from "${BRAND_MARK_SRC}". ` +
              'Check that src/assets/syntaflow-icon.png exists and is copied into the build.'
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
      <img ref={ref} src={BRAND_MARK_SRC} alt={alt} draggable={false} decoding="async" />
    </span>
  );
}

export interface BrandLogoProps {
  /** Rendered height in px. Defaults to 24px. */
  height?: number;
  className?: string;
  alt?: string;
}

/**
 * The full Syntaflow logo (logo 4) with symbol mark and wordmark.
 * Uses object-fit: contain to preserve aspect ratio and avoid any stretching.
 */
export function BrandLogo({ height = 24, className, alt = 'Syntaflow' }: BrandLogoProps) {
  return (
    <span
      className={className ? `brand-logo ${className}` : 'brand-logo'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: `${height}px`,
        flex: '0 0 auto',
      }}
    >
      <img
        src={BRAND_LOGO_FULL_SRC}
        alt={alt}
        draggable={false}
        decoding="async"
        style={{
          height: '100%',
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </span>
  );
}
