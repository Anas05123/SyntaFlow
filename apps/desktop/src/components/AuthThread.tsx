/**
 * The Core Thread.
 *
 * A single continuous line drawing the journey the product exists to protect:
 * client → proposal → agreement → project → review → delivery. It is the
 * logo's ribbon unrolled, and it is the one place on the entry surface where
 * the brand gradient carries meaning rather than decoration: the stroke ramps
 * cobalt → cyan along its length, so the line itself reads as progression, and
 * the stations step from metadata grey to full text as the journey advances.
 *
 * It is deliberately not a flowchart — no arrows, no boxes, no branch logic.
 * Each station is a name for work CoreDesk holds, not a step to complete.
 *
 * Geometry is measured in real pixels from the container so the path and the
 * station anchors always agree at any window size, and so the stroke gaps that
 * let the line pass beneath each station stay perfectly circular.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ThreadStation {
  id: string;
  label: string;
  note: string;
  /** 0 → 1 along the client lifecycle. Drives stroke colour and emphasis. */
  progress: number;
}

/** The six stages of the V1 lifecycle, in order. */
export const THREAD_STATIONS: ThreadStation[] = [
  { id: 'client', label: 'Client', note: 'New client', progress: 0 },
  { id: 'proposal', label: 'Proposal', note: 'Scoped and sent', progress: 0.2 },
  { id: 'agreement', label: 'Agreement', note: 'Accepted', progress: 0.4 },
  { id: 'project', label: 'Project', note: 'Work in flight', progress: 0.6 },
  { id: 'review', label: 'Review', note: 'Decision', progress: 0.8 },
  { id: 'delivery', label: 'Delivery', note: 'Exact version', progress: 1 },
];

/** Padding from the panel edges, in px, so stations never touch the frame. */
const PAD = 8;
/** Half-gap left in the stroke so it passes cleanly beneath a station dot. */
const GAP = 9;

/* -------------------------------------------------------------------------- */
/* Curve construction                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Catmull-Rom through the station points, emitted as cubic Béziers so the
 * thread flows continuously instead of meeting at visible corners.
 */
function threadPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  const at = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  let d = `M${at(0).x.toFixed(2)} ${at(0).y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d +=
      `C${c1x.toFixed(2)} ${c1y.toFixed(2)} ` +
      `${c2x.toFixed(2)} ${c2y.toFixed(2)} ` +
      `${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

interface Size {
  w: number;
  h: number;
}

export function AuthThread({ animate = true }: { animate?: boolean }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [size, setSize] = useState<Size>({ w: 0, h: 0 });
  const [gapEls, setGapEls] = useState<{ x: number; y: number }[]>([]);
  const [length, setLength] = useState(0);

  const measure = useCallback(() => {
    const el = hostRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setSize((prev) =>
      Math.abs(prev.w - r.width) < 0.5 && Math.abs(prev.h - r.height) < 0.5
        ? prev
        : { w: r.width, h: r.height }
    );
  }, []);

  useEffect(() => {
    measure();
    const el = hostRef.current;
    if (!el || typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  /* Station anchors, in panel pixels. The line rises through the engagement
     and settles at delivery — continuity, not a trend. */
  const pts = THREAD_STATIONS.map((_, i) => ({
    x: PAD + (i * (size.w - PAD * 2)) / (THREAD_STATIONS.length - 1),
    y: size.h * 0.5 + Math.sin((i / (THREAD_STATIONS.length - 1)) * Math.PI) * size.h * 0.11,
  }));

  const d = size.w > 0 ? threadPath(pts) : '';

  /* The stroke is split so it stops short of each station. Resolve the exact
     points by walking the rendered path — no geometry duplicated. */
  useEffect(() => {
    const p = pathRef.current;
    if (!p || !d) {
      setGapEls([]);
      setLength(0);
      return;
    }
    const total = p.getTotalLength();
    setLength(total);
    setGapEls(THREAD_STATIONS.map((s) => p.getPointAtLength(total * s.progress)));
  }, [d]);

  const ready = size.w > 0 && size.h > 0 && d !== '';

  return (
    <div className="auth-thread" ref={hostRef} aria-hidden="true" data-ready={ready ? 'true' : undefined}>
      {ready ? (
        <svg
          className="auth-thread-svg"
          width={size.w}
          height={size.h}
          viewBox={`0 0 ${size.w} ${size.h}`}
          data-animate={animate ? 'true' : undefined}
        >
          <defs>
            <linearGradient id="cd-thread" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2F6FEB" stopOpacity="0.16" />
              <stop offset="38%" stopColor="#2F6FEB" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#25B7F3" stopOpacity="1" />
            </linearGradient>
          </defs>

          <path
            ref={pathRef}
            className="auth-thread-path"
            d={d}
            fill="none"
            stroke="url(#cd-thread)"
            strokeWidth={1.75}
            strokeLinecap="round"
            style={{ ['--thread-len' as string]: `${length}px` }}
          />

          {gapEls.map((g, i) => (
            <circle
              key={THREAD_STATIONS[i].id}
              cx={g.x}
              cy={g.y}
              r={GAP}
              stroke="none"
              style={{ fill: 'var(--canvas)' }}
            />
          ))}
        </svg>
      ) : null}

      <ol className="auth-stations">
        {THREAD_STATIONS.map((s, i) => (
          <li
            key={s.id}
            className="auth-station"
            style={{
              left: ready ? `${(pts[i].x / size.w) * 100}%` : '50%',
              top: ready ? `${(pts[i].y / size.h) * 100}%` : '50%',
              opacity: ready ? 1 : 0,
            }}
            data-progress={s.progress}
          >
            <span className="auth-station-dot" />
            <span className="auth-station-text">
              <span className="auth-station-label">{s.label}</span>
              <span className="auth-station-note">{s.note}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
