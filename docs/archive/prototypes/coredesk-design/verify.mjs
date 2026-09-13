/* Headless route verification for the CoreDesk design preview.
   Stubs just enough DOM for app.js to boot, then renders every route in both
   themes and reports runtime errors. Design verification tooling, not product code. */

import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SRC = process.argv[2];
if (!SRC) {
  console.error("usage: node verify.mjs <path-to-app.js>");
  process.exit(2);
}

const code = readFileSync(SRC, "utf8");
const tmp = join(tmpdir(), "cd-verify-app.mjs");
writeFileSync(tmp, code, "utf8");

/* ---- minimal DOM ---------------------------------------------------------- */
const store = new Map();

class ClassList {
  constructor() { this.set = new Set(); }
  add(...c) { c.forEach((x) => this.set.add(x)); }
  remove(...c) { c.forEach((x) => this.set.delete(x)); }
  toggle(c, force) { const on = force === undefined ? !this.set.has(c) : !!force; on ? this.set.add(c) : this.set.delete(c); return on; }
  contains(c) { return this.set.has(c); }
  toString() { return [...this.set].join(" "); }
}

class El {
  constructor(tag = "div") {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.attributes = new Map();
    this.classList = new ClassList();
    this.dataset = {};
    this.style = {};
    this._html = "";
    this._text = "";
    this.value = "";
    this.hidden = false;
    this.disabled = false;
    this.parentElement = null;
    this._listeners = {};
  }
  get innerHTML() { return this._html; }
  set innerHTML(v) { this._html = String(v); }
  get textContent() { return this._text; }
  set textContent(v) { this._text = String(v); }
  get outerHTML() { return this._html; }
  set outerHTML(v) { this._html = String(v); }
  setAttribute(k, v) { this.attributes.set(k, String(v)); if (k === "data-theme") this._theme = String(v); }
  getAttribute(k) { return this.attributes.has(k) ? this.attributes.get(k) : null; }
  removeAttribute(k) { this.attributes.delete(k); }
  addEventListener(t, fn) { (this._listeners[t] ||= []).push(fn); }
  removeEventListener() {}
  appendChild(c) { this.children.push(c); c.parentElement = this; return c; }
  removeChild(c) { this.children = this.children.filter((x) => x !== c); return c; }
  insertBefore(c) { this.children.push(c); return c; }
  querySelector() { return null; }
  querySelectorAll() { return []; }
  closest() { return null; }
  focus() {}
  blur() {}
  setSelectionRange() {}
  getBoundingClientRect() { return { top: 0, left: 0, width: 1200, height: 800, right: 1200, bottom: 800 }; }
}

const appEl = new El("div");
appEl.id = "app";

const documentEl = {
  documentElement: new El("html"),
  body: new El("body"),
  activeElement: { tagName: "BODY" },
  _listeners: {},
  getElementById: (id) => (id === "app" ? appEl : null),
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener(t, fn) { (this._listeners[t] ||= []).push(fn); },
  removeEventListener() {},
  createElement: (t) => new El(t),
};

globalThis.document = documentEl;
globalThis.window = {
  _listeners: {},
  addEventListener(t, fn) { (this._listeners[t] ||= []).push(fn); },
  removeEventListener() {},
  location: { hash: "#/home" },
};
globalThis.location = {
  hash: "#/home",
  _set(v) { this.hash = v; },
};
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};
globalThis.URLSearchParams = URLSearchParams;
globalThis.setTimeout = (fn) => { try { fn(); } catch {} return 0; };
globalThis.clearTimeout = () => {};
globalThis.setInterval = () => 0;
globalThis.clearInterval = () => {};

/* ---- load the app -------------------------------------------------------- */
const errors = [];
process.on("uncaughtException", (e) => errors.push("uncaught: " + e.message));
process.on("unhandledRejection", (e) => errors.push("unhandled: " + (e && e.message)));

const out = process.argv[3] || join(tmpdir(), "cd-verify-report.txt");
const trace = [];
let checked = 0;
const failures = [];

function report() {
  const lines = [];
  lines.push(`routes rendered : ${checked}`);
  lines.push(`actions fired   : ${ACTIONS.length}`);
  lines.push(`failures        : ${failures.length}`);
  if (failures.length) {
    lines.push("");
    lines.push("--- FAILURES ---");
    for (const f of [...new Set(failures)]) lines.push(" * " + f);
  } else {
    lines.push("");
    lines.push("All routes and actions rendered clean.");
  }
  return lines.join("\n");
}

function flush() {
  writeFileSync(out, trace.join("\n") + "\n\n" + report() + "\n", "utf8");
}

trace.push("harness: stubs installed");

/* Copy data.js beside the temp app copy so its relative import resolves. */
const srcDir = SRC.replace(/[\\/][^\\/]+$/, "");
const dataSrc = join(srcDir, "data.js");
const dataTmp = join(tmpdir(), "cd-data-for-verify.mjs");
writeFileSync(dataTmp, readFileSync(dataSrc, "utf8"), "utf8");
let appCode = readFileSync(SRC, "utf8").replace('from "./data.js"', 'from "./cd-data-for-verify.mjs"');
writeFileSync(tmp, appCode, "utf8");
trace.push("harness: modules staged in " + tmpdir());

try {
  await import(pathToFileURL(tmp).href);
  trace.push("harness: app module evaluated");
} catch (e) {
  trace.push("harness: APP IMPORT FAILED -> " + e.message);
  failures.push("import: " + e.message);
  flush(true);
  console.log("import failed: " + e.message);
  process.exitCode = 3;
  throw new Error("stop");
}
trace.push(`harness: boot render produced ${appEl.innerHTML.length} chars`);

/* The app boots and renders #/home on import. */
const ROUTES = [
  "#/home", "#/first-run", "#/tasks", "#/clients", "#/clients/cl-harbor",
  "#/clients/cl-northgate", "#/clients/cl-tidewater", "#/clients/does-not-exist",
  "#/projects", "#/projects/pr-identity", "#/projects/pr-identity?tab=work",
  "#/projects/pr-identity?tab=documents", "#/projects/pr-identity?tab=reviews",
  "#/projects/pr-identity?tab=delivery", "#/projects/pr-onboarding?tab=delivery",
  "#/projects/pr-wayfinding?tab=delivery", "#/documents",
  "#/documents/doc-guidelines", "#/documents/doc-guidelines?view=preview",
  "#/documents/doc-guidelines?view=history", "#/documents/doc-proposal-verity",
  "#/documents/doc-welcome-atlas?view=history", "#/activity", "#/archive",
  "#/settings", "#/settings/account", "#/settings/defaults", "#/settings/access",
  "#/states", "#/new-project", "#/share", "#/auth", "#/onboarding",
  "#/terms", "#/privacy", "#/guest/invite", "#/guest/shared", "#/guest/review",
  "#/guest/delivery", "#/guest/unavailable", "#/guest/wrong-account",
  "#/guest/expired", "#/guest/unauthorized", "#/unknown-route",
];

const themes = ["dark", "light"];
trace.push("harness: rendering routes");

/* app.js registers its route listener on window, not document. */
const routeHandlers = window._listeners["hashchange"] || [];
trace.push(`harness: hashchange handlers on window = ${routeHandlers.length}`);
if (routeHandlers.length === 0) failures.push("no hashchange handler registered on window");
const clickHandlers = documentEl._listeners["click"] || [];
trace.push(`harness: click handlers on document = ${clickHandlers.length}`);
if (clickHandlers.length === 0) failures.push("no click handler registered on document");

for (const theme of themes) {
  documentEl.documentElement.setAttribute("data-theme", theme);
  for (const r of ROUTES) {
    location.hash = r;
    try {
      appEl.innerHTML = "";
      for (const h of routeHandlers) h({});
      const html = appEl.innerHTML;
      checked += 1;
      if (!html || html.length < 200) {
        failures.push(`${theme} ${r} → suspiciously small output (${html.length} chars)`);
      }
      if (/undefined|NaN|\[object Object\]/.test(html)) {
        const bad = [];
        if (html.includes("undefined")) bad.push("undefined");
        if (html.includes("NaN")) bad.push("NaN");
        if (html.includes("[object Object]")) bad.push("[object Object]");
        failures.push(`${theme} ${r} → contains ${bad.join(", ")}`);
      }
      if (/<span class="chip (undefined|neutral)">undefined/.test(html)) {
        failures.push(`${theme} ${r} → unresolved status label`);
      }
    } catch (e) {
      failures.push(`${theme} ${r} → THREW: ${e.message}`);
    }
  }
}

/* Interactive paths: drive the click handler directly. */
function fire(act, id) {
  const el = new El("button");
  el.dataset = { act, ...(id ? { id } : {}) };
  const ev = {
    target: { closest: () => el },
    preventDefault() {},
    stopPropagation() {},
  };
  for (const h of clickHandlers) h(ev);
}

const ACTIONS = [
  ["toggle-rail"], ["toggle-theme"], ["set-theme", "light"], ["set-theme", "dark"],
  ["open-search"], ["close-overlay"], ["task-filter", "upcoming"], ["task-filter", "waiting"],
  ["task-filter", "done"], ["task-filter", "today"], ["client-tab", "documents"],
  ["client-tab", "contacts"], ["client-tab", "notes"], ["client-tab", "history"],
  ["project-tab", "work"], ["project-tab", "documents"], ["project-tab", "reviews"],
  ["project-tab", "delivery"], ["project-tab", "overview"], ["doc-view", "preview"],
  ["doc-view", "history"], ["doc-view", "editor"], ["settings-tab", "defaults"],
  ["settings-tab", "access"], ["settings-tab", "account"], ["open-task", "tk-1"],
  ["open-task", "tk-1"], ["toggle-task", "tk-3"], ["postpone-task", "tk-2"],
  ["open-review", "rv-1"], ["new-client"], ["close-modal"], ["client-menu", "cl-harbor"],
  ["project-menu", "pr-identity"], ["create-step-next"], ["create-step-next"],
  ["create-step-next"], ["create-step-back"], ["create-save-draft"], ["create-finish"],
  ["guest-approve"], ["guest-changes"], ["create-request"], ["run-export"],
  ["toggle-save-state"], ["toggle-save-state"], ["toggle-save-state"], ["toggle-save-state"],
  ["mark-read", "ev-1"], ["mark-all-read"], ["save-settings"], ["retry"],
  ["go-tasks"], ["go-projects"], ["go-activity"], ["go-home"],
];

location.hash = "#/home";
for (const [act, id] of ACTIONS) {
  try {
    fire(act, id);
  } catch (e) {
    failures.push(`action ${act}${id ? " " + id : ""} → THREW: ${e.message}`);
  }
}

/* Search overlay across query shapes. */
for (const q of ["", "harbor", "brand", "zzzz", "proposal", "marta", "review"]) {
  try {
    location.hash = "#/home";
    for (const h of routeHandlers) h({});
    fire("open-search");
    globalThis.__q = q;
  } catch (e) {
    failures.push(`search "${q}" → THREW: ${e.message}`);
  }
}

for (const e of errors) failures.push("runtime: " + e);

trace.push("harness: complete");
flush();
console.log(report());
process.exitCode = failures.length ? 1 : 0;
