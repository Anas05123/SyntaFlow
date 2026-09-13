/**
 * The Thread — CoreDesk's ambient background art.
 *
 * The tagline is "your client work, in one continuous thread", so the screen
 * shows exactly that and nothing more: one thin gradient line drifting across
 * the canvas with a single glowing pulse travelling along it. No nodes, no
 * chevrons, no second motion cue competing for attention. It is a persistent
 * idle surface, so the loop has to stay cheap and quiet indefinitely.
 *
 * SCALING
 * The line is one SVG path with a fixed viewBox and `preserveAspectRatio="none"`.
 * Non-uniform stretch is deliberate here: the curve keeps its full-bleed reach at
 * any window size without the stroke thickness distorting, because the geometry
 * is a shallow bezier whose tangent never approaches vertical. Everything else on
 * the screen is ordinary flow layout, so only the art scales.
 *
 * MOTION
 * The pulse is a head plus a stack of trailing capsules, all animated with
 * `offset-path` / `offset-distance`. That is the cheapest reliable way to move
 * something along a curve — no layout, no repaint of the path itself — and it
 * means the trail is geometrically incapable of drifting off the line, because it
 * and the line are generated from the same function.
 *
 * Each trailing capsule carries `offset-rotate: auto`, so it aligns itself to the
 * curve's tangent, and a gradient running from its leading edge to fully
 * transparent. Stacked with successive negative delays, that produces one soft
 * tapering tail rather than a row of separate dots.
 *
 * `prefers-reduced-motion` stops the pulse. The thread stays, because the thread
 * is the design; only the movement is decorative.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/* -------------------------------------------------------------------------- */
/* Geometry                                                                    */
/* -------------------------------------------------------------------------- */

/** Design-space canvas. Any window size stretches this; nothing else scales. */
const VIEW_W = 1440;
const VIEW_H = 900;

/**
 * One smooth sweep: enters low on the left, rises across the middle, crests
 * under the content, and falls away before the right edge. Deliberately not
 * symmetric — a perfectly mirrored S reads as a diagram, and this should read as
 * a drawn line.
 */
const THREAD_D =
  'M -120 604 C 172 566 372 586 574 512 C 786 434 934 288 1116 244 C 1266 208 1392 232 1560 194';

/** Pulse cycle. Slow: this is a screen someone sits in front of for hours. */
const CYCLE_S = 26;

/** The seven lifecycle stages, as even arc-length stops along the thread. */
const STAGE_COUNT = 7;

/**
 * The tail. Each entry is one capsule: its length, its thickness, its opacity,
 * and how far behind the head it sits as a fraction of the cycle.
 *
 * Eight overlapping capsules rather than one long shape, because a single
 * gradient stroke along a curve cannot taper — its width is constant by
 * definition. Stacking falling opacities is what produces the fade.
 */
const TRAIL = [
  { len: 150, w: 3.2, o: 0.5, at: -0.012 },
  { len: 132, w: 3.0, o: 0.36, at: -0.024 },
  { len: 114, w: 2.8, o: 0.26, at: -0.036 },
  { len: 96, w: 2.6, o: 0.185, at: -0.048 },
  { len: 78, w: 2.4, o: 0.13, at: -0.06 },
  { len: 60, w: 2.2, o: 0.09, at: -0.072 },
  { len: 44, w: 2.0, o: 0.06, at: -0.084 },
  { len: 30, w: 1.8, o: 0.04, at: -0.096 },
].map((t) => ({ ...t, delay: Math.round(t.at * CYCLE_S * 1000) }));

export interface ThreadBackdropProps {
  /** Set false to freeze the pulse (used by busy states and reduced motion). */
  animate?: boolean;
  /**
   * Lifecycle ticks along the thread. Near-invisible at rest, brightening on
   * hover. Off by default: it is an easter egg, not information the screen needs.
   */
  ticks?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

export function ThreadBackdrop({ animate = true, ticks = false }: ThreadBackdropProps) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const [tickPoints, setTickPoints] = useState<{ x: number; y: number; a: number }[]>([]);

  /* Stage ticks are placed by arc length, not by parameter. A cubic bezier's
     parameter is not proportional to distance, so evenly spaced t values bunch
     the marks together wherever the curve moves fastest. getPointAtLength is the
     correct basis, and it needs the rendered path — hence a layout effect rather
     than a render-time computation. */
  useLayoutEffect(() => {
    if (!ticks) return;
    const path = pathRef.current;
    if (!path || typeof path.getTotalLength !== 'function') return;
    const total = path.getTotalLength();
    if (!total) return;

    const points: { x: number; y: number; a: number }[] = [];
    for (let i = 0; i < STAGE_COUNT; i += 1) {
      const at = (i / STAGE_COUNT) * total;
      const p = path.getPointAtLength(at);
      const q = path.getPointAtLength(Math.min(total, at + 1));
      /* Store the tangent so each tick can be drawn across the thread rather
         than always upright — an upright tick on a steep section looks detached
         from the line it is meant to be marking. */
      points.push({ x: p.x, y: p.y, a: (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI });
    }
    setTickPoints(points);
  }, [ticks]);

  /* Reduced-motion is read here rather than only in CSS so the trail elements
     are not mounted at all. A running animation that is merely invisible still
     costs frames on an idle screen. */
  const [motionOk, setMotionOk] = useState(true);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMotionOk(!mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const pulse = animate && motionOk;
  const cycle = `${CYCLE_S}s`;

  return (
    <svg
      className="cd-thread-art"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      /* Stretch, don't letterbox: the line must always reach the edges of the
         window. See the note on scaling above. */
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* The brand ramp, running along the direction of travel. */}
        <linearGradient id="cdth-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#25B7F3" stopOpacity="0.05" />
          <stop offset="26%" stopColor="#2F6FEB" stopOpacity="0.26" />
          <stop offset="62%" stopColor="#25B7F3" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2F6FEB" stopOpacity="0.04" />
        </linearGradient>

        {/* Tail fade: opaque at the leading edge, gone at the trailing edge. */}
        <linearGradient id="cdth-tail" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#8FE4FF" stopOpacity="1" />
          <stop offset="38%" stopColor="#3D9BFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#2F6FEB" stopOpacity="0" />
        </linearGradient>

        {/* Head bloom. A radial fill on the dot itself — no filter, no blur, so
            it costs nothing to composite on an idle screen. */}
        <radialGradient id="cdth-bloom">
          <stop offset="0%" stopColor="#DFF3FF" stopOpacity="1" />
          <stop offset="34%" stopColor="#7FD2FF" stopOpacity="0.75" />
          <stop offset="70%" stopColor="#2F8BF5" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2F6FEB" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* The thread itself. Always present, in every state. */}
      <path
        ref={pathRef}
        className="cdth-line"
        d={THREAD_D}
        fill="none"
        stroke="url(#cdth-line)"
        strokeWidth="1.35"
      />

      {/* Lifecycle ticks. Near-invisible at rest; brighten on hover. */}
      {ticks && tickPoints.length ? (
        <g className="cdth-ticks">
          {tickPoints.map((p, i) => (
            <line
              key={i}
              className="cdth-tick"
              x1={p.x - 7}
              y1={p.y}
              x2={p.x + 7}
              y2={p.y}
              transform={`rotate(${p.a.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)})`}
            />
          ))}
        </g>
      ) : null}

      {/* The pulse. Suppressed entirely when motion is not welcome. */}
      {pulse ? (
        <g className="cdth-pulse" style={{ ['--cycle' as string]: cycle }}>
          {TRAIL.map((t) => (
            <rect
              key={t.at}
              className="cdth-tail"
              x={-t.len}
              y={-t.w / 2}
              width={t.len}
              height={t.w}
              rx={t.w / 2}
              fill="url(#cdth-tail)"
              opacity={t.o}
              /* The capsule's own origin sits at the head's position; it extends
                 backwards from there. */
              style={{
                animationDelay: `${t.delay}ms`,
                offsetPath: `path("${THREAD_D}")`,
                offsetRotate: 'auto',
              }}
            />
          ))}
          <circle
            className="cdth-head"
            r="9"
            fill="url(#cdth-bloom)"
            style={{ offsetPath: `path("${THREAD_D}")`, offsetRotate: '0deg' }}
          />
        </g>
      ) : null}
    </svg>
  );
}
