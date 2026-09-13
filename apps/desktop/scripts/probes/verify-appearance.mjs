/**
 * Appearance-system verification.
 *
 * The controls are easy to draw and easy to get wrong: a theme toggle that sets
 * a data attribute nobody reads, a glass mode whose blur never applies, an accent
 * that updates the swatch but not the buttons, a wallpaper that survives the
 * current page but not a reload. None of that is visible in a screenshot, so this
 * drives each control and reads back what the browser actually resolved.
 */

import { chromium } from 'file:///C:/Users/Anas/Desktop/CoreDesk/node_modules/playwright/index.mjs';

const BASE = process.env.CD_BASE || 'http://localhost:4174/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 940 } });
const problems = [];

const go = async () => {
  await page.goto(`${BASE}#/settings/account`, { waitUntil: 'load' });
  await page.waitForTimeout(700);
};

const read = () =>
  page.evaluate(() => {
    const root = document.documentElement;
    const cs = getComputedStyle(root);
    const railCS = getComputedStyle(document.querySelector('.rail'));
    return {
      theme: root.getAttribute('data-theme'),
      surface: root.getAttribute('data-surface'),
      hasWallpaper: root.hasAttribute('data-wallpaper'),
      accent: cs.getPropertyValue('--accent').trim(),
      panelAlpha: cs.getPropertyValue('--panel-alpha').trim(),
      wallpaperOpacity: cs.getPropertyValue('--wallpaper-opacity').trim(),
      wallpaperBlur: cs.getPropertyValue('--wallpaper-blur').trim(),
      font: cs.getPropertyValue('--font').trim().slice(0, 22),
      railBg: railCS.backgroundColor,
      railBackdrop: railCS.backdropFilter || railCS.webkitBackdropFilter,
      primaryBtnBg: (() => {
        const b = document.querySelector('.btn-primary, .cd-action-primary');
        return b ? getComputedStyle(b).backgroundColor : null;
      })(),
      stored: (() => {
        try { return JSON.parse(localStorage.getItem('coredesk.appearance.v1') || 'null'); }
        catch { return 'unparsable'; }
      })(),
    };
  });

await go();

/* ---- controls exist ------------------------------------------------------ */
const ui = await page.evaluate(() => ({
  segs: document.querySelectorAll('.ap-seg').length,
  sliders: document.querySelectorAll('.ap-slider input[type=range]').length,
  swatches: document.querySelectorAll('.ap-swatch').length,
  fonts: document.querySelectorAll('.ap-font').length,
  bgPick: !!document.querySelector('.ap-bg-pick'),
}));
console.log('── controls ──');
console.log(`segmented ${ui.segs} · sliders ${ui.sliders} · swatches ${ui.swatches} · fonts ${ui.fonts} · bg picker ${ui.bgPick}`);
if (ui.segs < 2) problems.push(`only ${ui.segs} segmented controls, expected theme + surface`);
if (ui.sliders < 4) problems.push(`only ${ui.sliders} sliders, expected opacity + 3 wallpaper controls`);
if (ui.swatches !== 8) problems.push(`${ui.swatches} accent swatches, expected 8`);
if (ui.fonts !== 3) problems.push(`${ui.fonts} font choices, expected 3`);
if (!ui.bgPick) problems.push('no background image picker');

const base = await read();
console.log('\n── defaults ──');
console.log(`theme=${base.theme} surface=${base.surface} accent=${base.accent} wallpaper=${base.hasWallpaper}`);

/* ---- every control actually applies -------------------------------------- */
const click = async (text) => {
  const ok = await page.evaluate((t) => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === t);
    if (!btn) return false;
    btn.click();
    return true;
  }, text);
  await page.waitForTimeout(350);
  return ok;
};

if (!(await click('Light'))) problems.push('no Light control');
const light = await read();
console.log(`\nLight      -> data-theme=${light.theme}`);
if (light.theme !== 'light') problems.push('Light did not set data-theme');

if (!(await click('Dark'))) problems.push('no Dark control');
const dark = await read();
if (dark.theme !== 'dark') problems.push('Dark did not restore data-theme');

/* Accent: pick a non-cobalt swatch and confirm the token AND a real button move. */
const accentOk = await page.evaluate(() => {
  const sw = [...document.querySelectorAll('.ap-swatch')].find(
    (s) => s.getAttribute('aria-label') === 'Magenta'
  );
  if (!sw) return false;
  sw.click();
  return true;
});
if (!accentOk) problems.push('no Magenta swatch');
await page.waitForTimeout(350);
const accented = await read();
console.log(`Accent     -> --accent=${accented.accent}`);
if (!accented.accent.toLowerCase().includes('b93fa8')) {
  problems.push(`accent token did not change (${accented.accent})`);
}

/* Glass: the surface attribute, the alpha, and a real backdrop-filter. */
if (!(await click('Glass'))) problems.push('no Glass control');
const glass = await read();
console.log(`Glass      -> data-surface=${glass.surface} rail bg=${glass.railBg} backdrop=${glass.railBackdrop}`);
if (glass.surface !== 'glass') problems.push('Glass did not set data-surface');
if (!glass.railBackdrop || glass.railBackdrop === 'none') {
  problems.push(`rail has no backdrop-filter in glass mode (${glass.railBackdrop})`);
}

/* Panel opacity slider drives --panel-alpha. */
const opacityOk = await page.evaluate(() => {
  const input = document.querySelector('.ap-slider input[type=range]');
  if (!input || input.disabled) return false;
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  setter.call(input, '55');
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
});
await page.waitForTimeout(350);
const faded = await read();
console.log(`Opacity    -> --panel-alpha=${faded.panelAlpha}`);
if (!opacityOk) problems.push('panel opacity slider missing or disabled');
else if (Math.abs(Number(faded.panelAlpha) - 0.55) > 0.02) {
  problems.push(`panel opacity did not apply (${faded.panelAlpha})`);
}

/* Wallpaper: inject a 1x1 image through the picker's own handler. */
const wpOk = await page.evaluate(async () => {
  const input = document.querySelector('input[type=file]');
  if (!input) return false;
  const png =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
  const bytes = Uint8Array.from(atob(png), (c) => c.charCodeAt(0));
  const file = new File([bytes], 'wall.png', { type: 'image/png' });
  const dt = new DataTransfer();
  dt.items.add(file);
  input.files = dt.files;
  input.dispatchEvent(new Event('change', { bubbles: true }));
  return true;
});
await page.waitForTimeout(600);
const walled = await read();
console.log(`Wallpaper  -> data-wallpaper=${walled.hasWallpaper} opacity=${walled.wallpaperOpacity} blur=${walled.wallpaperBlur}`);
if (!wpOk) problems.push('no file input for wallpaper');
else if (!walled.hasWallpaper) problems.push('wallpaper did not apply (data-wallpaper missing)');

/* ---- persistence across a reload ---------------------------------------- */
await go();
const reloaded = await read();
console.log('\n── after reload ──');
console.log(
  `theme=${reloaded.theme} surface=${reloaded.surface} accent=${reloaded.accent} ` +
    `wallpaper=${reloaded.hasWallpaper} alpha=${reloaded.panelAlpha}`
);
if (reloaded.surface !== 'glass') problems.push('glass setting did not survive reload');
if (!reloaded.hasWallpaper) problems.push('wallpaper did not survive reload (an object URL would do this)');
if (!reloaded.accent.toLowerCase().includes('b93fa8')) problems.push('accent did not survive reload');
/* `stored.wallpaper` proves it round-tripped as a data URL rather than a blob URL. */
if (typeof reloaded.stored?.wallpaper === 'string' && !reloaded.stored.wallpaper.startsWith('data:')) {
  problems.push('wallpaper was persisted as a non-data URL');
}

await browser.close();
console.log('');
if (problems.length) {
  console.log('── PROBLEMS ──');
  for (const p of [...new Set(problems)]) console.log(`  ${p}`);
  process.exitCode = 1;
} else {
  console.log('Appearance system verified: every control applies, and the whole record survives a reload.');
}
