/* Build the CoreDesk mark as FOUR ribbon folds around a hollow diamond, with a
   real over/under weave. Earlier attempts copied the mark's four-fold symmetry
   but the mark's actual mechanism is one band folding over itself, so that is
   what has to be reproduced: adjacent folds must cross at the corners.

   Geometry is generated so the shape stays symmetric and can be tuned. */
import { writeFileSync } from 'node:fs';

const K = 0.62;   // corner control pull toward the outer tip (roundness)
const A = 0.34;   // hollow diamond half-diagonal
const W = 0.27;   // ribbon width at the fold
const OUT = 1.02; // outer control radius
const INN = 0.30; // inner control radius

/* Fold corners sit on the diagonals. */
const FOLD = [
  [Math.SQRT1_2 * A, Math.SQRT1_2 * A],
  [-Math.SQRT1_2 * A, Math.SQRT1_2 * A],
  [-Math.SQRT1_2 * A, -Math.SQRT1_2 * A],
  [Math.SQRT1_2 * A, -Math.SQRT1_2 * A],
];

/* Perpendicular to the diagonal, pointing away from the fold: this is the
   ribbon's width direction, and it is what makes neighbouring folds overlap
   instead of merely touching. */
function tangent(i) {
  const a = (Math.PI / 4) + i * (Math.PI / 2);
  return [Math.cos(a), Math.sin(a)];
}

const loopCtrl = (i, r) => {
  const a = -Math.PI / 4 + i * (Math.PI / 2);
  return [Math.cos(a) * r, Math.sin(a) * r];
};

function arm(i) {
  const c1 = FOLD[i];
  const c2 = FOLD[(i + 1) % 4];
  const t1 = tangent(i);
  const t2 = tangent((i + 1) % 4);
  const [o1x, o1y] = loopCtrl(i, OUT);
  const [o2x, o2y] = loopCtrl((i + 1) % 4, OUT);
  const [n1x, n1y] = loopCtrl(i, INN);
  const [n2x, n2y] = loopCtrl((i + 1) % 4, INN);
  const f = (v) => v.toFixed(3);

  /* Outer edge: leave the fold, sweep out, arrive at the next fold. */
  const outer =
    `M ${f(c1[0])} ${f(c1[1])} ` +
    `C ${f(c1[0] + t1[0] * W * K + o1x * (1 - K))} ${f(c1[1] + t1[1] * W * K + o1y * (1 - K))} ` +
    `${f(o1x)} ${f(o1y)} ${f(o1x)} ${f(o1y)} ` +
    `C ${f(o2x)} ${f(o2y)} ` +
    `${f(c2[0] - t2[0] * W * K + o2x * (1 - K))} ${f(c2[1] - t2[1] * W * K + o2y * (1 - K))} ` +
    `${f(c2[0])} ${f(c2[1])}`;
  /* Inner edge: back across the inside of the fold, forming the hollow. */
  const inner =
    `C ${f(n2x)} ${f(n2y)} ${f(n1x)} ${f(n1y)} ${f(c1[0])} ${f(c1[1])} Z`;
  return outer + ' ' + inner;
}

const paths = [0, 1, 2, 3].map(arm);
const body = paths
  .map((d, i) => `<path d="${d}" fill="#2F6FEB" opacity="${0.62 + i * 0.12}" stroke="#9FDCFF" stroke-width="0.006" stroke-opacity="0.5"/>`)
  .join('\n');

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1.25 -1.25 2.5 2.5" width="640" height="640">` +
  `<rect x="-2" y="-2" width="4" height="4" fill="#0B0D0F"/>${body}</svg>`;
writeFileSync('coredesk-app/.shots/mark-test.svg', svg);

console.log('fold corners:');
FOLD.forEach((f, i) => console.log(`  ${i}: (${f[0].toFixed(3)}, ${f[1].toFixed(3)})  tangent (${tangent(i)[0].toFixed(2)}, ${tangent(i)[1].toFixed(2)})`));
console.log('\npath lengths:');
paths.forEach((d, i) => console.log(`  arm ${i}: ${d.length} chars`));
console.log('\nwrote .shots/mark-test.svg');
