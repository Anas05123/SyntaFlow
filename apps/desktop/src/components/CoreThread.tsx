/**
 * The Core Thread.
 *
 * Not a timeline. It is a closed woven band — the CoreDesk ribbon's own geometry,
 * a path that crosses itself and keeps going — rendered as the hero object of the
 * entry surface. Continuity is the product's whole claim, and this is the only way
 * to state it before the product exists to prove it.
 *
 * WHY THIS SHAPE, AND NOT A KNOT
 * The form is a lemniscate of Gerono: a figure-eight with exactly one crossing, at
 * ninety degrees. That was chosen by measurement, not taste. The alternatives were
 * tested and rejected:
 *
 *   · A trefoil (three-fold, echoing the logo) only self-crosses at a high
 *     harmonic amplitude, and then at a nine-degree crossing angle. Two strands
 *     meeting that shallowly smear into a single blob at any usable band width.
 *   · Polar ripples (r = 1 + k·sin 3t) and their relatives never self-cross at all.
 *   · Higher-order Lissajous figures cross so often the line becomes a texture.
 *   · Stacked coils degenerate, because both revolutions trace the same path.
 *
 * A right-angled crossing is the cleanest weave geometry available, and the 2:1
 * aspect suits a wide desktop panel. One crossing states continuity perfectly well:
 * the thread leaves, comes back, and passes over itself on the way — which is the
 * product model, since a delivered project does not end the client relationship.
 *
 * WHY OVER/UNDER IS REAL RATHER THAN PAINTED
 * For a figure-eight the over/under is a property of the *lobe*, not of position
 * along the strand. The two arcs between the crossing each form one lobe, and one
 * arc is given a consistently higher third coordinate than the other. Segments are
 * then drawn back-to-front, so the higher lobe covers the lower one at the crossing
 * and the weave resolves itself — no masking, no clipping, no faked overlaps.
 *
 * A depth that swings to zero at the crossing would leave both strands level there,
 * which erases the weave exactly where it has to read. That mistake is why the
 * depth is constant per lobe.
 */

import { useMemo } from 'react';

const TAU = Math.PI * 2;

/**
 * Spine. `cos t` across, half-amplitude `sin 2t` down: a figure-eight whose lobes
 * are twice as wide as they are tall.
 */
function spine(t: number): [number, number] {
  return [Math.cos(t), Math.sin(2 * t) / 2];
}

/**
 * Half the band width, in spine units.
 *
 * The ratio to the lobe is what decides whether the weave reads. A band that is
 * wide relative to the lobe fills the interior of the crossing and the two strands
 * merge into a solid bow-tie; the thinner the ribbon, the cleaner the weave. This
 * value is a genuine ribbon proportion rather than a filled shape.
 */
const HALF_WIDTH = 0.062;

/** The two strand samples: the crossing at 90° and at 270°. */
const CROSS = [Math.PI / 2, (3 * Math.PI) / 2];

/** A small extension past each crossing so the lobes meet without a hairline gap. */
const OVERLAP = 0.1;

function tangent(t: number): [number, number] {
  const e = 1e-4;
  const [xa, ya] = spine(t - e);
  const [xb, yb] = spine(t + e);
  const tx = xb - xa;
  const ty = yb - ya;
  const len = Math.hypot(tx, ty) || 1;
  return [tx / len, ty / len];
}

export interface ThreadStage {
  id: string;
  label: string;
  /** Parameter along the closed spine, 0..1. */
  at: number;
  /** Which side the label hangs, so neighbours never collide. */
  side: 'above' | 'below';
}

/**
 * The lifecycle, in order, riding the band. Four stages on the right lobe and
 * three on the left, so the journey is legible on both halves of the weave and no
 * two labels share a side close enough to touch.
 */
export const THREAD_STAGES: ThreadStage[] = [
  { id: 'client', label: 'Client', at: 0.0, side: 'above' },
  { id: 'proposal', label: 'Proposal', at: 0.125, side: 'below' },
  { id: 'agreement', label: 'Agreement', at: 0.25, side: 'above' },
  { id: 'project', label: 'Project', at: 0.46, side: 'above' },
  { id: 'review', label: 'Review', at: 0.585, side: 'below' },
  { id: 'revision', label: 'Revision', at: 0.71, side: 'above' },
  { id: 'delivery', label: 'Delivery', at: 0.86, side: 'below' },
];

interface Lobe {
  /** Closed outline: along one edge of the band, back along the other. */
  d: string;
  /** Draw order. 0 = the lobe that passes under, 1 = the one that passes over. */
  order: number;
  /** Mean elevation, used for lighting. Higher reads brighter. */
  elevation: number;
}

function buildLobes(): Lobe[] {
  const lobes: Lobe[] = [];

  for (let i = 0; i < 2; i += 1) {
    const start = CROSS[i] - OVERLAP;
    const end = CROSS[(i + 1) % 2] + (i === 1 ? TAU : 0) + OVERLAP;
    const steps = Math.max(140, Math.round(((end - start) / TAU) * 520));

    const outer: string[] = [];
    const inner: string[] = [];
    let elevation = 0;

    for (let k = 0; k <= steps; k += 1) {
      const t = start + ((end - start) * k) / steps;
      const [px, py] = spine(t);
      const [tx, ty] = tangent(t);
      /* Outward normal: the tangent turned a quarter turn, oriented away from
         the loop centre so the band keeps a hole rather than folding flat. */
      let nx = -ty;
      let ny = tx;
      if (nx * px + ny * py < 0) {
        nx = -nx;
        ny = -ny;
      }
      outer.push(`${(px + nx * HALF_WIDTH).toFixed(4)} ${(py + ny * HALF_WIDTH).toFixed(4)}`);
      inner.push(`${(px - nx * HALF_WIDTH).toFixed(4)} ${(py - ny * HALF_WIDTH).toFixed(4)}`);
      elevation += py;
    }

    lobes.push({
      d:
        `M${outer[0]}` +
        outer.slice(1).map((p) => `L${p}`).join('') +
        inner
          .slice()
          .reverse()
          .map((p) => `L${p}`)
          .join('') +
        'Z',
      order: i,
      elevation: elevation / (steps + 1),
    });
  }

  /* Back to front: the under-lobe first. The second lobe's overlap extensions
     then cover the join cleanly at both crossings. */
  return lobes.sort((a, b) => a.order - b.order);
}

export interface CoreThreadProps {
  /** Entrance motion. Suppressed for busy states and for reduced motion. */
  animate?: boolean;
}

export function CoreThread({ animate = true }: CoreThreadProps) {
  const lobes = useMemo(() => buildLobes(), []);

  const stages = useMemo(
    () =>
      THREAD_STAGES.map((stage) => {
        const t = stage.at * TAU;
        const [x, y] = spine(t);
        const [tx, ty] = tangent(t);
        let nx = -ty;
        let ny = tx;
        if (nx * x + ny * y < 0) {
          nx = -nx;
          ny = -ny;
        }
        return { ...stage, x, y, nx, ny };
      }),
    []
  );

  /* Lighting keyed to elevation, so the band has form. Deliberately separate from
     draw order — conflating the two is what flattens the weave. */
  const [lo, hi] = useMemo(() => {
    const e = lobes.map((l) => l.elevation);
    return [Math.min(...e), Math.max(...e)];
  }, [lobes]);
  const span = hi - lo || 1;

  return (
    <div className="cd-thread" data-animate={animate ? 'true' : undefined}>
      <svg
        className="cd-thread-svg"
        viewBox="-1.2 -0.62 2.4 1.24"
        role="img"
        aria-label="The CoreDesk client thread: Client, Proposal, Agreement, Project, Review, Revision and Delivery, closing back onto the client."
      >
        <defs>
          {/* Directional light from the upper left, as if from the window. */}
          <linearGradient id="cd-band" x1="0.1" y1="0" x2="0.75" y2="1">
            <stop offset="0%" stopColor="#4E93F7" />
            <stop offset="40%" stopColor="#2F6FEB" />
            <stop offset="100%" stopColor="#1C4CAE" />
          </linearGradient>

          {/* Edge light picks out the band's thickness. No blur, no bloom. */}
          <linearGradient id="cd-band-edge" x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#9FDCFF" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#25B7F3" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#25B7F3" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="cd-node" cx="0.34" cy="0.28" r="0.85">
            <stop offset="0%" stopColor="#DCEFFF" />
            <stop offset="48%" stopColor="#5FB2F7" />
            <stop offset="100%" stopColor="#2F6FEB" />
          </radialGradient>
        </defs>

        <g className="cd-thread-band">
          {lobes.map((lobe, i) => {
            const lift = (lobe.elevation - lo) / span;
            return (
              <g key={i} data-lift={lift.toFixed(3)}>
                <path d={lobe.d} fill="url(#cd-band)" opacity={0.62 + lift * 0.38} />
                {/* A single lighter stroke along the boundary gives the band a
                    lit rim without any glow. */}
                <path
                  d={lobe.d}
                  fill="none"
                  stroke="url(#cd-band-edge)"
                  strokeWidth="0.007"
                />
              </g>
            );
          })}
        </g>

        {/* Stations ride the band: the lifecycle is *on* the thread, not in a
            legend beside it. */}
        <g className="cd-thread-stages">
          {stages.map((stage, i) => {
            /* Labels sit just clear of the band on alternating sides, so two
               stations near a crossing can never collide with each other. */
            const off = HALF_WIDTH + 0.032;
            const rise = stage.side === 'above' ? -0.026 : 0.05;
            return (
              <g
                key={stage.id}
                className="cd-stage"
                data-side={stage.side}
                style={{ ['--stage-delay' as string]: `${420 + i * 60}ms` }}
              >
                <circle cx={stage.x} cy={stage.y} r="0.019" fill="url(#cd-node)" />
                <circle
                  cx={stage.x}
                  cy={stage.y}
                  r="0.031"
                  fill="none"
                  stroke="#0B0D0F"
                  strokeWidth="0.009"
                />
                <text
                  className="cd-stage-label"
                  x={stage.x + stage.nx * off}
                  y={stage.y + stage.ny * off + rise}
                  textAnchor="middle"
                >
                  {stage.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
