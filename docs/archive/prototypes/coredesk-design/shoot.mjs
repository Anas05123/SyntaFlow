/* Capture every CoreDesk design screen for visual review.
   Run from the design folder with the local server on :4173.
   Playwright is resolved by absolute path because ESM ignores NODE_PATH. */

import { mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";

const PW = process.env.CD_PLAYWRIGHT
  || "C:/Users/Anas/Desktop/CoreDesk/project-atlas/node_modules/playwright/index.mjs";
const { chromium } = await import(pathToFileURL(PW).href);

const BASE = process.env.CD_BASE || "http://127.0.0.1:4173/index.html";
const OUT = process.env.CD_OUT || ".shots";
mkdirSync(OUT, { recursive: true });

const SHOTS = [
  ["02-tasks", "#/tasks", "dark"],
  ["03-clients", "#/clients", "dark"],
  ["04-client-detail", "#/clients/cl-harbor", "dark"],
  ["05-project-overview", "#/projects/pr-identity", "dark"],
  ["06-project-work", "#/projects/pr-identity?tab=work", "dark"],
  ["07-project-delivery-blocked", "#/projects/pr-identity?tab=delivery", "dark"],
  ["08-documents", "#/documents", "dark"],
  ["09-document-workspace", "#/documents/doc-guidelines", "dark"],
  ["10-version-history", "#/documents/doc-guidelines?view=history", "dark"],
  ["11-preview-export", "#/documents/doc-guidelines?view=preview", "dark"],
  ["12-activity", "#/activity", "dark"],
  ["13-settings-access", "#/settings/access", "dark"],
  ["14-states", "#/states", "dark"],
  ["15-light-clients", "#/clients", "light"],
  ["16-light-document", "#/documents/doc-guidelines", "light"],
  ["17-create-project", "#/new-project", "dark"],
  ["18-share-setup", "#/share", "dark"],
  ["19-guest-review", "#/guest/review", "dark"],
  ["20-guest-delivery", "#/guest/delivery", "light"],
  ["21-auth", "#/auth", "dark"],
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

const problems = [];
page.on("pageerror", (e) => problems.push("pageerror: " + e.message));
page.on("console", (m) => {
  if (m.type() === "error") problems.push("console.error: " + m.text());
});

for (const [name, hash, theme] of SHOTS) {
  await page.goto(BASE + hash, { waitUntil: "load" });
  await page.evaluate((t) => {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("coredesk-theme", t);
  }, theme);
  await page.waitForTimeout(320);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  /* Any layout that overflows the viewport horizontally is a defect. */
  const over = await page.evaluate(() => ({
    docW: document.documentElement.scrollWidth,
    winW: window.innerWidth,
    bodyH: document.body.scrollHeight,
  }));
  if (over.docW > over.winW + 2) {
    problems.push(`${name}: horizontal overflow ${over.docW} > ${over.winW}`);
  }
  process.stdout.write(`captured ${name}\n`);
}

/* Interaction checks: does the UI actually respond? */
await page.goto(BASE + "#/tasks", { waitUntil: "load" });
await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
await page.click('[data-act="open-task"]');
await page.waitForTimeout(250);
const panelOpen = await page.locator(".panel").count();
await page.screenshot({ path: `${OUT}/22-task-panel.png` });
if (!panelOpen) problems.push("task detail panel did not open");

await page.keyboard.press("Escape");
await page.waitForTimeout(150);
await page.keyboard.press("Control+k");
await page.waitForTimeout(250);
const paletteOpen = await page.locator(".palette").count();
await page.keyboard.type("harbor");
await page.waitForTimeout(350);
await page.screenshot({ path: `${OUT}/23-search.png` });
const resultCount = await page.locator(".palette-item").count();
if (!paletteOpen) problems.push("search palette did not open on Ctrl+K");
if (resultCount === 0) problems.push("search returned no results for 'harbor'");

await page.keyboard.press("Escape");
await page.goto(BASE + "#/home", { waitUntil: "load" });
await page.click('[data-act="new-client"]');
await page.waitForTimeout(250);
const modalOpen = await page.locator(".modal").count();
await page.screenshot({ path: `${OUT}/24-new-client-modal.png` });
if (!modalOpen) problems.push("new client modal did not open");

await browser.close();

console.log("\n=== VISUAL CHECK ===");
console.log(`screens captured : ${SHOTS.length + 3}`);
console.log(`search results   : ${resultCount}`);
console.log(`problems         : ${problems.length}`);
for (const p of [...new Set(problems)]) console.log(" * " + p);
process.exitCode = problems.length ? 1 : 0;
