/**
 * Launches the CoreDesk desktop runtime.
 *
 * Resolves the Electron binary without downloading a second copy: this
 * workspace vendors Electron 44 at the monorepo root, and `electron`'s
 * index.js reads `path.txt` from whichever install it is required from. A local
 * install, if present, is preferred automatically.
 *
 * Usage:
 *   node electron/start.mjs
 *   node electron/start.mjs --mode dev --routes "#/auth|a01-ready"
 *   node electron/start.mjs --width 1280 --height 800
 */

import { spawn, execFileSync } from 'node:child_process';
import { existsSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, '..');
const workspaceRoot = path.resolve(appRoot, '../..');

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

/** The states that make up Phase 1's A01 review set, plus the screens it touches. */
const DEFAULT_ROUTES = [
  '#/auth|a01-ready',
  '#/auth?state=loading|a01-loading',
  '#/auth?state=unavailable|a01-unavailable',
  '#/auth?state=returning|a01-returning',
  '#/signup|a03-stub',
  '#/home|rail-mark-home',
].join(',');

/** Candidate Electron installs, local first, then root monorepo, then vendored. */
const CANDIDATES = [
  path.join(appRoot, 'node_modules', 'electron'),
  path.join(path.resolve(appRoot, '..'), 'node_modules', 'electron'),
  path.join(workspaceRoot, 'node_modules', 'electron'),
];

function resolveElectronBinary() {
  for (const pkg of CANDIDATES) {
    const marker = path.join(pkg, 'path.txt');
    const dist = path.join(pkg, 'dist');
    if (!existsSync(marker) || !existsSync(dist)) continue;
    try {
      /* realpathSync also guards against a developer junctioning the binary in. */
      const rel = execFileSync(
        process.execPath,
        ['-p', `require('fs').readFileSync(${JSON.stringify(marker)},'utf8')`],
        { encoding: 'utf8' }
      ).trim();
      const exe = path.join(dist, rel);
      if (existsSync(exe)) return { exe: realpathSync(exe), pkg };
    } catch {
      /* fall through to the next candidate */
    }
  }
  return null;
}

const found = resolveElectronBinary();
if (!found) {
  console.error(
    'No Electron binary found.\nLooked in:\n' +
      CANDIDATES.map((c) => `  ${c}`).join('\n') +
      '\nInstall it with:  cd electron && npm install'
  );
  process.exit(2);
}

const mode = arg('mode', 'built');
const routes = arg('routes', DEFAULT_ROUTES);
const interactive = process.argv.includes('--show');

if (mode === 'built' && !existsSync(path.join(appRoot, 'dist', 'index.html'))) {
  console.error('No build found at dist/index.html — run `npm run build` first.');
  process.exit(2);
}

console.log(`electron  ${found.exe}`);
console.log(`mode      ${mode}`);
if (interactive) console.log(`opening   ${arg('route', '#/auth')}   (close the window to exit)`);
console.log('');

const child = spawn(found.exe, [path.join(here, 'main.cjs')], {
  cwd: appRoot,
  env: {
    ...process.env,
    CD_ELECTRON_MODE: mode,
    CD_ROUTES: routes,
    CD_INTERACTIVE: interactive ? '1' : '0',
    CD_ROUTE: arg('route', '#/auth'),
    CD_OUT: arg('out', path.join(appRoot, '.shots', 'electron')),
    CD_WIDTH: arg('width', '1440'),
    CD_HEIGHT: arg('height', '940'),
    ELECTRON_DISABLE_SECURITY_WARNINGS: '1',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});

/* Interactive mode has no report to parse — the window is the deliverable, so
   stream child output straight through and skip the survey report handling
   below entirely. */
if (interactive) {
  child.stdout.on('data', (b) => process.stdout.write(b));
  child.stderr.on('data', (b) => {
    const text = b.toString();
    if (!/DevTools|Security Warning|^\s*$/.test(text)) process.stderr.write(text);
  });
  child.on('exit', (code) => {
    console.log('CoreDesk window closed.');
    process.exit(code ?? 0);
  });
} else {

let report = null;
const stderr = [];

child.stdout.on('data', (buf) => {
  for (const line of buf.toString().split(/\r?\n/)) {
    if (line.startsWith('CD_ELECTRON_REPORT ')) {
      report = JSON.parse(line.slice('CD_ELECTRON_REPORT '.length));
    } else if (line.trim()) {
      console.log(`[main] ${line}`);
    }
  }
});

child.stderr.on('data', (buf) => stderr.push(buf.toString()));

child.on('exit', (code) => {
  const noise = stderr
    .join('')
    .split(/\r?\n/)
    .filter((l) => l.trim() && !/DevTools|Electron Security Warning|^\s*$/.test(l));

  if (!report) {
    console.error('Electron produced no report.');
    console.error(`exit code: ${code}`);
    if (noise.length) console.error(noise.join('\n'));
    process.exit(1);
  }

  if (report.fatal) {
    console.error('Electron runtime threw:\n');
    console.error(report.fatal);
    process.exit(1);
  }

  const problems = [];

  for (const r of report.results) {
    const o = r.observed;
    console.log(`── ${r.shot}   ${r.route}`);
    if (!o) {
      console.log(`   FAILED TO LOAD — ${r.loadError ?? 'no observation'}`);
      if (r.failures.length) console.log(`   ${r.failures.join('\n   ')}`);
      problems.push(`${r.shot}: ${r.loadError ?? 'no observation'}`);
      console.log('');
      continue;
    }
    problems.push(...r.failures.map((f) => `${r.shot}: load failed: ${f}`));

    console.log(`   content      ${o.inner[0]}x${o.inner[1]}  dpr ${o.dpr}  text ${o.bodyText} chars`);
    console.log(`   type         ${o.headlineFamily} ${o.headlineFont}  headline ${o.headlineLines} line(s)`);
    console.log(`   thread       ${o.stations} station(s), path ${o.threadPathLen}px`);
    if (o.markCount === 0 || o.markNatural) {
      console.log(`   brand mark   ${o.markNatural ? `${o.markNatural.join('x')} natural -> ${o.markBox.join('x')} box` : 'absent'}`);
    }
    console.log(`   canvas       ${o.canvasBg}   body ${o.bodyBg}`);
    console.log(`   isolation    window.require ${o.hasNodeRequire}   bridge ${o.bridgeRuntime ?? 'absent'}`);
    console.log(`   focusables   ${o.focusables.length}: ${o.focusables.slice(0, 6).join(' → ')}`);

    if (o.leaked.length) problems.push(`${r.shot}: leaked ${o.leaked.join(', ')}`);
    if (!o.interLoaded) problems.push(`${r.shot}: Inter did not load — type metrics invalid`);
    if (o.headlineLines > 2) problems.push(`${r.shot}: headline orphaned to ${o.headlineLines} lines`);
    if (o.hasNodeRequire) problems.push(`${r.shot}: window.require leaked into the renderer`);
    if (o.bridgeRuntime !== 'electron') problems.push(`${r.shot}: preload bridge not exposed`);
    if (o.scrollW > o.inner[0] + 2) problems.push(`${r.shot}: horizontal overflow ${o.scrollW} > ${o.inner[0]}`);
    if (o.canvasBg.toLowerCase() !== '#0b0d0f') problems.push(`${r.shot}: --canvas is ${o.canvasBg}`);
    if (o.markNatural && o.markNatural[0] === 0) problems.push(`${r.shot}: brand mark failed to load (${o.markSrc})`);
    if (o.markBox && o.markBox[0] === 0) problems.push(`${r.shot}: brand mark collapsed to zero width`);
    /* A01 is under active redesign by another writer, so these assertions
       deliberately check OUTCOMES (a screen rendered, it has entry actions, it
       is inside the CoreDesk frame) rather than specific class names. Asserting
       the markup of a screen someone else is mid-edit on makes this harness fail
       for reasons that are not defects, which is worse than not checking at all
       — a failing check that means nothing trains you to ignore the check. */
    if (r.route.includes('/auth')) {
      if (o.actionCount < 1) problems.push(`${r.shot}: no entry actions rendered`);
      if (o.bodyText < 60) problems.push(`${r.shot}: screen is nearly empty (${o.bodyText} chars)`);
      if (!o.insideAppFrame) problems.push(`${r.shot}: not rendered inside the CoreDesk window frame`);
    }
    console.log('');
  }

  console.log('── runtime ──');
  console.log(`electron   ${report.versions.electron}  (chromium ${report.versions.chrome}, node ${report.versions.node})`);
  console.log(`mode       ${report.mode}`);
  console.log(`icon       ${report.icon || 'default'}`);
  console.log(`display    ${report.display.count} display(s), scale ${report.display.scaleFactor}, work area ${report.display.workArea.join('x')}`);
  console.log(`screens    ${report.outDir}`);
  console.log('');

  if (noise.length) {
    console.log('── stderr ──');
    console.log(noise.slice(0, 10).join('\n'));
    console.log('');
  }

  if (problems.length) {
    console.log('── PROBLEMS ──');
    for (const p of [...new Set(problems)]) console.log(`  ${p}`);
    process.exit(1);
  }
  console.log('Desktop runtime clean.');
});

}
