/* ==========================================================================
   CoreDesk — Precision Workspace : screen implementation
   Every screen is built to a page-inventory contract from the Figma planning
   file. Screen IDs in comments map to that inventory:
     A01-A08 auth · W01-W05 owner workspace · C01-C02 clients
     P01-P06 projects · D01-D05 documents · G01-G04 guest · S01-S03 settings
   ========================================================================== */

import {
  workspace, clients, projects, tasks, documents, reviews, activity, deliveries, grants,
  client, project, documentRecord, task, review, delivery,
  projectsOfClient, documentsOfProject, tasksOfProject, tasksOfClient,
  reviewsOfProject, deliveryOfProject, grantsOf,
  daysUntil, dueLabel, formatDate, formatShortDate, formatTime, relative, initials,
  countTasks, TODAY,
} from "./data.js";

/* -------------------------------------------------------------------------- */
/* Icons                                                                       */
/* -------------------------------------------------------------------------- */

const P = {
  home: '<path d="M3.5 10.2 10 4.6l6.5 5.6V17a1 1 0 0 1-1 1h-3v-5h-5v5h-3a1 1 0 0 1-1-1z"/>',
  clients: '<path d="M7.2 9.3a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z"/><path d="M2.8 16.4c0-2.5 2-4.2 4.4-4.2s4.4 1.7 4.4 4.2"/><path d="M13.4 9.1a2.3 2.3 0 1 0 0-4.6"/><path d="M13.9 12.3c1.9.2 3.3 1.7 3.3 4.1"/>',
  projects: '<path d="M3 6.2A1.2 1.2 0 0 1 4.2 5h3.1l1.5 1.8h6A1.2 1.2 0 0 1 16 8v6.8A1.2 1.2 0 0 1 14.8 16H4.2A1.2 1.2 0 0 1 3 14.8z"/>',
  tasks: '<rect x="3.2" y="3.6" width="13.6" height="12.8" rx="1.8"/><path d="m6.6 10 2.2 2.2 4.6-4.6"/>',
  documents: '<path d="M5.4 3h5.2l4 4v10a1 1 0 0 1-1 1H5.4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M10.4 3v4.2h4.2"/><path d="M7.2 11.4h6M7.2 14.2h4"/>',
  activity: '<path d="M10 3.4v3.2M10 13.4v3.2M3.4 10h3.2M13.4 10h3.2"/><circle cx="10" cy="10" r="2.4"/>',
  archive: '<rect x="3" y="4.2" width="14" height="3.4" rx="1"/><path d="M4.3 7.6V16h11.4V7.6"/><path d="M8.2 11.2h3.6"/>',
  settings: '<circle cx="10" cy="10" r="2.6"/><path d="M10 2.6v2.1M10 15.3v2.1M3.8 6.3l1.8 1M14.4 12.7l1.8 1M3.8 13.7l1.8-1M14.4 7.3l1.8-1"/>',
  search: '<circle cx="9" cy="9" r="4.6"/><path d="m12.6 12.6 3.4 3.4"/>',
  plus: '<path d="M10 4.6v10.8M4.6 10h10.8"/>',
  bell: '<path d="M6 8.2a4 4 0 0 1 8 0c0 3.2 1.1 4.3 1.1 4.3H4.9S6 11.4 6 8.2Z"/><path d="M8.6 15.2a1.7 1.7 0 0 0 2.8 0"/>',
  sun: '<circle cx="10" cy="10" r="3.1"/><path d="M10 2.8v1.6M10 15.6v1.6M3.4 10h1.6M15 10h1.6M5.3 5.3l1.1 1.1M13.6 13.6l1.1 1.1M5.3 14.7l1.1-1.1M13.6 6.4l1.1-1.1"/>',
  moon: '<path d="M15.4 11.6A5.8 5.8 0 0 1 8.4 4.6a5.9 5.9 0 1 0 7 7Z"/>',
  chevronRight: '<path d="m8 5.6 4.4 4.4L8 14.4"/>',
  chevronDown: '<path d="m5.6 8 4.4 4.4L14.4 8"/>',
  chevronLeft: '<path d="M12 5.6 7.6 10l4.4 4.4"/>',
  dots: '<circle cx="5" cy="10" r="1.2"/><circle cx="10" cy="10" r="1.2"/><circle cx="15" cy="10" r="1.2"/>',
  close: '<path d="m5.6 5.6 8.8 8.8M14.4 5.6l-8.8 8.8"/>',
  external: '<path d="M11.6 4.4H16v4.4"/><path d="M16 4.4 9.4 11"/><path d="M13.4 11.4V15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7.6a1 1 0 0 1 1-1h3.6"/>',
  download: '<path d="M10 3.6v8.2"/><path d="m6.6 8.8 3.4 3.4 3.4-3.4"/><path d="M4.2 15.6h11.6"/>',
  clock: '<circle cx="10" cy="10" r="6.4"/><path d="M10 6.4V10l2.6 1.6"/>',
  alert: '<path d="M10 3.4 17 16H3z"/><path d="M10 8v3.4M10 13.6v.1"/>',
  check: '<path d="m4.8 10.4 3.4 3.4 7-7"/>',
  checkCircle: '<circle cx="10" cy="10" r="6.6"/><path d="m7.2 10.2 2 2 3.6-3.8"/>',
  message: '<path d="M4.2 5.4A1.2 1.2 0 0 1 5.4 4.2h9.2A1.2 1.2 0 0 1 15.8 5.4v6a1.2 1.2 0 0 1-1.2 1.2H8.6L5 15.4v-2.8H5.4a1.2 1.2 0 0 1-1.2-1.2z"/>',
  link: '<path d="M8.6 11.4 11.4 8.6"/><path d="M9.6 6.4 11 5a3 3 0 0 1 4.2 4.2l-1.4 1.4"/><path d="M10.4 13.6 9 15a3 3 0 0 1-4.2-4.2l1.4-1.4"/>',
  eye: '<path d="M2.6 10S5.2 5.6 10 5.6 17.4 10 17.4 10 14.8 14.4 10 14.4 2.6 10 2.6 10Z"/><circle cx="10" cy="10" r="2.2"/>',
  edit: '<path d="M12.8 4.2 15.8 7.2 8.4 14.6H5.4v-3z"/>',
  trash: '<path d="M4.6 6.4h10.8"/><path d="M6.2 6.4V16h7.6V6.4"/><path d="M8.2 6.4V4.4h3.6v2"/>',
  calendar: '<rect x="3.4" y="4.8" width="13.2" height="11.2" rx="1.4"/><path d="M3.4 8.6h13.2M7.4 3.4v2.6M12.6 3.4v2.6"/>',
  lock: '<rect x="4.6" y="8.8" width="10.8" height="7" rx="1.4"/><path d="M7.2 8.8V6.8a2.8 2.8 0 0 1 5.6 0v2"/>',
  mail: '<rect x="3" y="4.8" width="14" height="10.4" rx="1.4"/><path d="m3.6 6 6.4 4.6L16.4 6"/>',
  send: '<path d="M16.6 3.6 9.2 11"/><path d="M16.6 3.6 11.6 16.4l-2.4-5.4-5.4-2.4z"/>',
  refresh: '<path d="M16.2 10a6.2 6.2 0 1 1-1.9-4.4"/><path d="M16.4 3.6v3.6H12.8"/>',
  filter: '<path d="M3.6 5.4h12.8L11.6 11v4.4l-3.2 1.4V11z"/>',
  upload: '<path d="M10 16.2V7.8"/><path d="m6.6 11 3.4-3.4L13.4 11"/><path d="M4.2 4.6h11.6"/>',
  file: '<path d="M5.4 3h5.2l4 4v10a1 1 0 0 1-1 1H5.4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M10.4 3v4.2h4.2"/>',
  package: '<path d="M10 2.8 16.8 6v8L10 17.2 3.2 14V6z"/><path d="M3.2 6 10 9.2 16.8 6M10 9.2v8"/>',
  shield: '<path d="M10 3.2 15.6 5v4.6c0 3.2-2.2 5.6-5.6 6.8-3.4-1.2-5.6-3.6-5.6-6.8V5z"/>',
  history: '<path d="M3.6 10a6.4 6.4 0 1 0 2-4.7"/><path d="M3.4 3.6v3.8h3.8"/><path d="M10 6.8V10l2.6 1.6"/>',
  arrowLeft: '<path d="M16 10H4.6"/><path d="m9.4 4.6-5.4 5.4 5.4 5.4"/>',
  grid: '<rect x="3.4" y="3.4" width="5.4" height="5.4" rx="1"/><rect x="11.2" y="3.4" width="5.4" height="5.4" rx="1"/><rect x="3.4" y="11.2" width="5.4" height="5.4" rx="1"/><rect x="11.2" y="11.2" width="5.4" height="5.4" rx="1"/>',
  list: '<path d="M6.6 5.4h9.8M6.6 10h9.8M6.6 14.6h9.8"/><circle cx="3.8" cy="5.4" r="1"/><circle cx="3.8" cy="10" r="1"/><circle cx="3.8" cy="14.6" r="1"/>',
  sparkle: '<path d="M10 3.2l1.5 4.3 4.3 1.5-4.3 1.5L10 14.8l-1.5-4.3L4.2 9l4.3-1.5z"/>',
  undo: '<path d="M7.6 5.6 4 9.2l3.6 3.6"/><path d="M4 9.2h7.2a4 4 0 0 1 0 8H8"/>',
};

function icon(name, size = 16) {
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 20 20" fill="none"
    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${P[name] || P.file}</svg>`;
}

/* -------------------------------------------------------------------------- */
/* Small render helpers                                                        */
/* -------------------------------------------------------------------------- */

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const STATE_CHIP = {
  active: ["active", "Active"], approved: ["approved", "Approved"], waiting: ["waiting", "Waiting"],
  "changes-requested": ["changes-requested", "Changes requested"], "at-risk": ["at-risk", "At risk"],
  blocked: ["blocked", "Blocked"], overdue: ["overdue", "Overdue"], delivered: ["delivered", "Delivered"],
  ready: ["ready", "Ready"], pending: ["pending", "Pending"], revoked: ["revoked", "Revoked"],
  expired: ["neutral", "Expired"], archived: ["archived", "Archived"], draft: ["draft", "Draft"],
  superseded: ["superseded", "Superseded"], cancelled: ["cancelled", "Cancelled"],
  "on-hold": ["on-hold", "On hold"], prospect: ["accent", "Prospect"], inactive: ["neutral", "Inactive"],
  closed: ["neutral", "Closed"], planned: ["neutral", "Planned"], "in-review": ["waiting", "In review"],
  todo: ["neutral", "To do"], "in-progress": ["in-progress", "In progress"], done: ["done", "Done"],
  shared: ["accent", "Shared"], private: ["neutral", "Private"], none: ["neutral", "Not requested"],
};

function chip(state, overrideLabel) {
  const [cls, label] = STATE_CHIP[state] || ["neutral", state];
  const text = overrideLabel || label;
  const showDot = ["active", "approved", "waiting", "at-risk", "blocked", "overdue", "delivered",
    "pending", "revoked", "in-progress", "done", "changes-requested", "expired", "prospect"].includes(state);
  return `<span class="chip ${cls}">${showDot ? '<span class="dot"></span>' : ""}${esc(text)}</span>`;
}

function progressBar(done, total) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const cls = total > 0 && done === total ? "progress-fill ok" : "progress-fill";
  return `<div class="progress">
    <div class="progress-track"><div class="${cls}" style="width:${pct}%"></div></div>
    <span class="progress-label">${done} / ${total}</span>
  </div>`;
}

function pageHead({ eyebrow, title, sub, actions }) {
  return `<div class="page-head">
    <div class="page-head-text">
      ${eyebrow ? `<div class="eyebrow">${esc(eyebrow)}</div>` : ""}
      <h1>${esc(title)}</h1>
      ${sub ? `<p class="page-sub">${sub}</p>` : ""}
    </div>
    ${actions ? `<div class="page-actions">${actions}</div>` : ""}
  </div>`;
}

function emptyState({ iconName = "file", title, text, primary, secondary, tone = "" }) {
  return `<div class="state ${tone}">
    <span class="state-icon">${icon(iconName, 20)}</span>
    <div class="state-title">${esc(title)}</div>
    <p class="state-text">${text}</p>
    ${primary || secondary ? `<div class="state-actions">
      ${secondary ? `<button class="btn btn-secondary" data-act="${esc(secondary.act)}">${esc(secondary.label)}</button>` : ""}
      ${primary ? `<button class="btn btn-primary" data-act="${esc(primary.act)}">${esc(primary.label)}</button>` : ""}
    </div>` : ""}
  </div>`;
}

function errorState(text = "The workspace could not load this record. Your data is untouched.") {
  return `<div class="state error">
    <span class="state-icon">${icon("alert", 20)}</span>
    <div class="state-title">Something went wrong</div>
    <p class="state-text">${esc(text)}</p>
    <div class="state-actions">
      <button class="btn btn-secondary" data-act="retry">${icon("refresh")} Retry</button>
    </div>
  </div>`;
}

function skeletonTable(rows = 5) {
  return `<div class="card"><div class="card-body flush">${Array.from({ length: rows })
    .map(
      () => `<div class="skel-row">
        <div class="skeleton" style="width:22px;height:22px;border-radius:5px"></div>
        <div class="skeleton" style="width:26%"></div>
        <div class="skeleton" style="width:14%"></div>
        <div class="skeleton grow"></div>
        <div class="skeleton" style="width:70px"></div>
      </div>`
    )
    .join("")}</div></div>`;
}

const banner = (text, sub, tone = "", action = "") =>
  `<div class="banner ${tone}">
    <div class="banner-text"><div>${text}</div>${sub ? `<div class="banner-sub">${sub}</div>` : ""}</div>
    ${action}
  </div>`;

/* -------------------------------------------------------------------------- */
/* Shell — rail + topbar                                                       */
/* -------------------------------------------------------------------------- */

const NAV = [
  { group: "Work", items: [
    { id: "home", route: "#/home", label: "Home", icon: "home" },
    { id: "tasks", route: "#/tasks", label: "Tasks", icon: "tasks" },
    { id: "clients", route: "#/clients", label: "Clients", icon: "clients" },
    { id: "projects", route: "#/projects", label: "Projects", icon: "projects" },
    { id: "documents", route: "#/documents", label: "Documents", icon: "documents" },
    { id: "activity", route: "#/activity", label: "Activity", icon: "activity" },
  ]},
  { group: "Records", items: [
    { id: "archive", route: "#/archive", label: "Archive", icon: "archive" },
    { id: "settings", route: "#/settings", label: "Settings", icon: "settings" },
  ]},
];

const openTaskCount = () => tasks.filter((t) => t.status !== "done").length;
const overdueCount = () => tasks.filter((t) => t.status !== "done" && daysUntil(t.due) < 0).length;
const unreadCount = () => activity.filter((e) => !e.read).length;

function rail(activeId) {
  return `<aside class="rail">
    <div class="rail-brand">
      <span class="brand-mark">CD</span>
      <div class="brand-text">
        <div class="brand-name">CoreDesk</div>
        <div class="brand-workspace">${esc(workspace.name)}</div>
      </div>
    </div>
    <nav class="rail-nav" aria-label="Primary">
      ${NAV.map(
        (g) => `<div class="rail-group-label">${g.group}</div>
        ${g.items
          .map((it) => {
            let badge = "";
            if (it.id === "tasks") {
              const od = overdueCount();
              badge = od > 0
                ? `<span class="rail-count alert">${od}</span>`
                : `<span class="rail-count">${openTaskCount()}</span>`;
            }
            if (it.id === "activity") {
              const un = unreadCount();
              if (un > 0) badge = `<span class="rail-count">${un}</span>`;
            }
            if (it.id === "clients") badge = `<span class="rail-count">${clients.filter((c) => c.state === "active").length}</span>`;
            if (it.id === "projects") badge = `<span class="rail-count">${projects.filter((p) => !["closed"].includes(p.stage)).length}</span>`;
            return `<a class="rail-item ${activeId === it.id ? "active" : ""}" href="${it.route}"
              data-nav="${it.id}" ${activeId === it.id ? 'aria-current="page"' : ""}>
              ${icon(it.icon, 17)}<span class="rail-item-label">${it.label}</span>${badge}
            </a>`;
          })
          .join("")}`
      ).join("")}
    </nav>
    <div class="rail-foot">
      <button class="rail-owner" data-act="open-settings-account">
        <span class="avatar">${esc(workspace.initials)}</span>
        <span class="rail-owner-text">
          <span class="rail-owner-name">${esc(workspace.owner)}</span>
          <span class="rail-owner-role">Owner</span>
        </span>
      </button>
    </div>
  </aside>`;
}

function topbar(crumbs, options = {}) {
  const theme = document.documentElement.getAttribute("data-theme") || "dark";
  return `<header class="topbar">
    <div class="topbar-left">
      <button class="icon-btn" data-act="toggle-rail" aria-label="Toggle navigation" title="Toggle navigation">${icon("list", 17)}</button>
      ${crumbs ? `<nav class="crumbs" aria-label="Breadcrumb">${crumbs}</nav>` : ""}
    </div>
    <div class="topbar-right">
      <button class="search-trigger" data-act="open-search" aria-label="Search workspace">
        ${icon("search", 16)}<span>Search clients, projects, documents…</span><span class="kbd">⌘K</span>
      </button>
      <button class="icon-btn ${options.notify ? "bordered" : ""}" data-act="go-activity" aria-label="Activity (${unreadCount()} unread)" title="Activity">
        ${icon("bell", 17)}${options.notify ? '<span class="dot" style="background:var(--accent);width:6px;height:6px;border-radius:50%;position:absolute;transform:translate(7px,-7px)"></span>' : ""}
      </button>
      <button class="icon-btn bordered" data-act="toggle-theme" aria-label="Switch theme" title="Switch light / dark">
        ${icon(theme === "dark" ? "sun" : "moon", 17)}
      </button>
    </div>
  </header>`;
}

const crumb = (items) => items.map((it, i) =>
  `${i > 0 ? '<span class="sep">/</span>' : ""}${
    it.href && i < items.length - 1
      ? `<a href="${it.href}">${esc(it.label)}</a>`
      : `<span class="here">${esc(it.label)}</span>`
  }`).join("");

/* -------------------------------------------------------------------------- */
/* W01 · Home                                                                  */
/* -------------------------------------------------------------------------- */

function actionQueue() {
  const rows = [];

  tasks
    .filter((t) => t.status !== "done" && daysUntil(t.due) <= 1)
    .forEach((t) => {
      const d = daysUntil(t.due);
      rows.push({
        tone: d < 0 ? "risk" : "accent",
        rank: d,
        kind: "Task",
        title: t.title,
        context: t.projectId ? project(t.projectId).name : client(t.clientId).name,
        contextHref: t.projectId ? `#/projects/${t.projectId}?tab=work` : `#/clients/${t.clientId}`,
        due: dueLabel(t.due),
        dueTone: d < 0 ? "risk" : "accent",
        act: "open-task",
        actData: t.id,
        actionLabel: "Open",
      });
    });

  reviews
    .filter((r) => r.state === "waiting")
    .forEach((r) => {
      const doc = documentRecord(r.documentId);
      const d = daysUntil(r.due);
      rows.push({
        tone: d < 0 ? "risk" : "waiting",
        rank: d - 0.5,
        kind: "Awaiting client",
        title: `${r.reviewer.name} has not decided on ${doc.title} v${r.version}`,
        context: project(r.projectId).name,
        contextHref: `#/projects/${r.projectId}?tab=reviews`,
        due: dueLabel(r.due),
        dueTone: d < 0 ? "risk" : "waiting",
        act: "open-review",
        actData: r.id,
        actionLabel: "Inspect",
      });
    });

  clients
    .filter((c) => c.nextActionTone === "risk")
    .forEach((c) => {
      rows.push({
        tone: "risk",
        rank: daysUntil(c.nextActionDue) - 1,
        kind: "Client action",
        title: c.nextAction,
        context: c.name,
        contextHref: `#/clients/${c.id}`,
        due: dueLabel(c.nextActionDue),
        dueTone: "risk",
        act: "open-client",
        actData: c.id,
        actionLabel: "Open",
      });
    });

  projects
    .filter((p) => p.stage === "blocked")
    .forEach((p) => {
      rows.push({
        tone: "waiting",
        rank: 3,
        kind: "Blocked project",
        title: p.nextAction,
        context: `${p.name} · ${client(p.clientId).name}`,
        contextHref: `#/projects/${p.id}`,
        due: dueLabel(p.nextMilestoneDue),
        dueTone: "waiting",
        act: "open-project",
        actData: p.id,
        actionLabel: "Open",
      });
    });

  return rows.sort((a, b) => a.rank - b.rank);
}

function renderHome() {
  const queue = actionQueue();
  const activeProjects = projects.filter((p) => !["closed"].includes(p.stage));
  const awaiting = reviews.filter((r) => r.state === "waiting").length;
  const overdue = overdueCount();

  const body = `
    ${pageHead({
      eyebrow: "Wednesday 10 September",
      title: `Good morning, ${workspace.owner.split(" ")[0]}`,
      sub: "Everything that needs you today, in the order it needs you. Each item names the client or project it belongs to.",
      actions: `<button class="btn btn-secondary" data-act="new-client">${icon("plus")} New client</button>
                <button class="btn btn-primary" data-act="new-project">${icon("plus")} New project</button>`,
    })}

    ${overdue > 0 ? `<div class="mb-20">${banner(
      `<span class="mark-risk">${overdue} item${overdue > 1 ? "s" : ""} past due.</span> Two of them block other people.`,
      "Verity Health cannot move until the revised proposal goes out.",
      "bad",
      `<button class="btn btn-secondary btn-sm" data-act="filter-overdue">Show overdue</button>`
    )}</div>` : ""}

    <div class="grid grid-4 mb-20">
      <div class="metric ${overdue > 0 ? "is-risk" : ""}">
        <span class="metric-label">Needs you today</span>
        <span class="metric-value">${queue.length}</span>
        <span class="metric-foot">${overdue} past due · ${queue.length - overdue} due today or tomorrow</span>
      </div>
      <div class="metric ${awaiting > 0 ? "is-waiting" : ""}">
        <span class="metric-label">Awaiting client</span>
        <span class="metric-value">${awaiting}</span>
        <span class="metric-foot">Designated approver has not decided</span>
      </div>
      <div class="metric">
        <span class="metric-label">Active projects</span>
        <span class="metric-value">${activeProjects.length}</span>
        <span class="metric-foot">${clients.filter((c) => c.state === "active").length} active client relationships</span>
      </div>
      <div class="metric">
        <span class="metric-label">Open tasks</span>
        <span class="metric-value">${openTaskCount()}</span>
        <span class="metric-foot">Across all projects and clients</span>
      </div>
    </div>

    <div class="split splot">
      <div class="stack">
        <section class="card">
          <div class="card-head">
            <div class="card-head-text">
              <div class="card-title">Next actions</div>
              <div class="card-desc">Ordered by consequence. Overdue work first, then work that unblocks someone else.</div>
            </div>
            <button class="btn btn-ghost btn-sm" data-act="go-tasks">All tasks ${icon("chevronRight", 14)}</button>
          </div>
          <div class="card-body flush">
            ${queue.length === 0
              ? emptyState({ iconName: "checkCircle", title: "You are clear", text: "Nothing is overdue and nothing is waiting on a client decision. New work will appear here the moment it needs you." })
              : queue.map((r) => `
              <div class="item-row">
                <span class="chip ${r.tone === "risk" ? "at-risk" : r.tone === "waiting" ? "waiting" : "accent"}" style="flex:0 0 auto">${esc(r.kind)}</span>
                <div class="item-main">
                  <div class="item-title">${esc(r.title)}</div>
                  <div class="item-sub"><a href="${r.contextHref}">${esc(r.context)}</a></div>
                </div>
                <div class="item-side">
                  <span class="${r.dueTone === "risk" ? "mark-risk" : r.dueTone === "waiting" ? "mark-wait" : "meta"}">${esc(r.due)}</span>
                </div>
                <div class="item-actions">
                  <button class="btn btn-secondary btn-sm" data-act="${r.act}" data-id="${r.actData}">${esc(r.actionLabel)}</button>
                </div>
              </div>`).join("")}
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <div class="card-head-text">
              <div class="card-title">Current work</div>
              <div class="card-desc">Open projects with their real counted progress and the next thing that moves each one.</div>
            </div>
            <button class="btn btn-ghost btn-sm" data-act="go-projects">All projects ${icon("chevronRight", 14)}</button>
          </div>
          <div class="card-body flush">
            ${activeProjects.map((p) => {
              const c = client(p.clientId);
              const counted = countTasks(p.id);
              return `<div class="item-row">
                <div class="item-main">
                  <div class="item-title"><a href="#/projects/${p.id}" style="color:inherit">${esc(p.name)}</a></div>
                  <div class="item-sub">${esc(c.name)} · next: ${esc(p.nextAction)}</div>
                  <div style="margin-top:9px;max-width:280px">${progressBar(counted.done, counted.total)}</div>
                </div>
                <div class="item-side">
                  ${chip(p.stage, p.stageLabel)}
                  <span class="meta">${esc(dueLabel(p.due))}</span>
                </div>
              </div>`;
            }).join("")}
          </div>
        </section>
      </div>

      <div class="stack">
        <section class="card">
          <div class="card-head">
            <div class="card-head-text">
              <div class="card-title">Recently opened</div>
            </div>
          </div>
          <div class="card-body flush">
            ${["doc-guidelines", "pr-identity", "cl-harbor", "doc-proposal-verity"].map((id) => {
              if (id.startsWith("doc")) {
                const d = documentRecord(id);
                return `<a class="item-row" href="#/documents/${d.id}">
                  <span class="state-icon" style="width:30px;height:30px;border-radius:6px">${icon("documents", 15)}</span>
                  <div class="item-main">
                    <div class="item-title">${esc(d.title)}</div>
                    <div class="item-sub">${esc(d.type)} · v${d.workingVersion} · ${esc(relative(d.modified))}</div>
                  </div>
                </a>`;
              }
              if (id.startsWith("pr")) {
                const p = project(id);
                return `<a class="item-row" href="#/projects/${p.id}">
                  <span class="state-icon" style="width:30px;height:30px;border-radius:6px">${icon("projects", 15)}</span>
                  <div class="item-main">
                    <div class="item-title">${esc(p.name)}</div>
                    <div class="item-sub">${esc(client(p.clientId).name)} · ${esc(p.stageLabel)}</div>
                  </div>
                </a>`;
              }
              const c = client(id);
              return `<a class="item-row" href="#/clients/${c.id}">
                <span class="state-icon" style="width:30px;height:30px;border-radius:6px">${icon("clients", 15)}</span>
                <div class="item-main">
                  <div class="item-title">${esc(c.name)}</div>
                  <div class="item-sub">${esc(c.contact.name)} · ${esc(relative(c.lastActivity))}</div>
                </div>
              </a>`;
            }).join("")}
          </div>
        </section>

        <section class="card">
          <div class="card-head">
            <div class="card-head-text">
              <div class="card-title">Latest decisions</div>
              <div class="card-desc">Review outcomes only — comments are shown but never counted as decisions.</div>
            </div>
          </div>
          <div class="card-body flush">
            ${reviews.filter((r) => r.outcome).slice(0, 3).map((r) => {
              const d = documentRecord(r.documentId);
              return `<a class="item-row" href="#/documents/${d.id}?view=history">
                <span class="state-icon" style="width:30px;height:30px;border-radius:6px;color:${r.outcome === "approved" ? "var(--active)" : "var(--waiting)"}">
                  ${icon(r.outcome === "approved" ? "checkCircle" : "message", 15)}</span>
                <div class="item-main">
                  <div class="item-title">${esc(d.title)} v${r.version}</div>
                  <div class="item-sub">${esc(r.outcome === "approved" ? "Approved" : "Changes requested")} by ${esc(r.reviewer.name)} · ${esc(relative(r.closedOn))}</div>
                </div>
              </a>`;
            }).join("")}
          </div>
          <div class="card-foot">
            <button class="btn btn-ghost btn-sm" data-act="go-activity">Open activity ${icon("chevronRight", 14)}</button>
          </div>
        </section>

        <section class="card">
          <div class="card-body">
            <div class="row-between">
              <div>
                <div class="card-title">Local workspace</div>
                <div class="card-desc mt-4">Offline-first. Nothing leaves this machine unless you share it.</div>
              </div>
              ${chip("active", "Healthy")}
            </div>
            <div class="defs mt-16">
              <div class="def"><span class="def-key">Last backup</span><span class="def-val">Today, 08:12 · local</span></div>
              <div class="def"><span class="def-key">Guest access</span><span class="def-val">${grants.filter((g) => g.state === "active").length} active grants</span></div>
            </div>
          </div>
        </section>
      </div>
    </div>`;

  return { active: "home", crumbs: crumb([{ label: "Home" }]), body };
}

/* First-run variant, to demonstrate the W01 first-run state. */
function renderHomeFirstRun() {
  const body = `
    <div style="max-width:660px;margin:6vh auto 0">
      <div class="eyebrow">First run</div>
      <h1>Let's get your first client in.</h1>
      <p class="page-sub mt-12">CoreDesk is a workspace for one professional running client work. Start with a client — projects, documents and reviews all hang off that relationship.</p>
      <div class="steps mt-24" style="max-width:420px">
        <div class="step current"><div class="step-bar"></div><div class="step-label">Client</div></div>
        <div class="step"><div class="step-bar"></div><div class="step-label">Project</div></div>
        <div class="step"><div class="step-bar"></div><div class="step-label">Document</div></div>
        <div class="step"><div class="step-bar"></div><div class="step-label">Review</div></div>
      </div>
      <div class="card mt-16">
        <div class="card-body stack">
          <div class="field">
            <label class="field-label" for="fr-client">Client or company name</label>
            <input class="input" id="fr-client" placeholder="Harbor & Finch" value="Harbor & Finch">
          </div>
          <div class="grid grid-2">
            <div class="field">
              <label class="field-label" for="fr-contact">Primary contact</label>
              <input class="input" id="fr-contact" placeholder="Full name" value="Marta Velasco">
            </div>
            <div class="field">
              <label class="field-label" for="fr-email">Email</label>
              <input class="input" id="fr-email" placeholder="name@company.com" value="marta@harborfinch.com">
            </div>
          </div>
          <div class="field">
            <label class="field-label" for="fr-note">Private note <span class="field-hint">(only you see this)</span></label>
            <textarea class="textarea" id="fr-note" style="min-height:88px" placeholder="How you met, what they need, anything to remember."></textarea>
          </div>
        </div>
        <div class="card-foot row-between">
          <span class="meta">You can add projects and documents later.</span>
          <div class="row">
            <button class="btn btn-ghost" data-act="home">Skip for now</button>
            <button class="btn btn-primary" data-act="first-run-create">Create client</button>
          </div>
        </div>
      </div>
      <p class="meta mt-16">Optional setup — workspace name, timezone and document defaults — lives in Settings.</p>
    </div>`;
  return { active: "home", crumbs: crumb([{ label: "Home" }]), body };
}

/* -------------------------------------------------------------------------- */
/* W02 · Tasks                                                                 */
/* -------------------------------------------------------------------------- */

let taskFilter = "today";

function taskBuckets() {
  const open = tasks.filter((t) => t.status !== "done");
  return {
    today: open.filter((t) => daysUntil(t.due) <= 0),
    upcoming: open.filter((t) => daysUntil(t.due) > 0),
    waiting: open.filter((t) => t.status === "waiting"),
    done: tasks.filter((t) => t.status === "done"),
  };
}

function taskRow(t) {
  const d = daysUntil(t.due);
  const overdue = d < 0 && t.status !== "done";
  const proj = t.projectId ? project(t.projectId) : null;
  const cl = proj ? client(proj.clientId) : client(t.clientId);
  const context = proj ? `${proj.name} · ${cl.name}` : `${cl.name} · no project yet`;
  const done = t.status === "done";
  return `<div class="item-row ${done ? "completed" : ""}" data-act="open-task" data-id="${t.id}">
    <button class="tick" role="checkbox" aria-checked="${done}" data-act="toggle-task" data-id="${t.id}"
      aria-label="${done ? "Reopen" : "Complete"} ${esc(t.title)}">${done ? icon("check", 12) : ""}</button>
    <div class="item-main">
      <div class="item-title">${esc(t.title)}</div>
      <div class="item-sub">${esc(context)}${t.priority === "high" ? ' · <span class="mark-risk">High priority</span>' : ""}</div>
    </div>
    <div class="item-side">
      <span class="${overdue ? "mark-risk" : d <= 1 ? "mark-wait" : "meta"}">${esc(dueLabel(t.due))}</span>
      ${t.status === "waiting" ? chip("waiting", "Waiting") : ""}
    </div>
    <div class="item-actions">
      <button class="icon-btn" data-act="postpone-task" data-id="${t.id}" title="Postpone one day" aria-label="Postpone">${icon("calendar", 15)}</button>
      <button class="icon-btn" data-act="open-task" data-id="${t.id}" title="Open task" aria-label="Open task">${icon("chevronRight", 15)}</button>
    </div>
  </div>`;
}

function renderTasks() {
  const b = taskBuckets();
  const list = b[taskFilter] || [];
  const filters = [
    ["today", "Today", b.today.length],
    ["upcoming", "Upcoming", b.upcoming.length],
    ["waiting", "Waiting", b.waiting.length],
    ["done", "Done", b.done.length],
  ];

  const body = `
    ${pageHead({
      eyebrow: "Work",
      title: "Tasks",
      sub: "Every task belongs to a project and a client. Tasks created here ask which project they belong to — a task is never orphaned.",
      actions: `<button class="btn btn-secondary" data-act="filter-open">${icon("filter")} Filters</button>
                <button class="btn btn-primary" data-act="new-task">${icon("plus")} Add task</button>`,
    })}

    <div class="split">
      <section class="card">
        <div class="card-head" style="padding-bottom:0;border-bottom:0">
          <div class="segmented" role="tablist" aria-label="Task filters">
            ${filters.map(([id, label, n]) => `<button role="tab" data-act="task-filter" data-id="${id}"
              aria-selected="${taskFilter === id}">${label} <span class="tab-count">${n}</span></button>`).join("")}
          </div>
          <button class="btn btn-ghost btn-sm" data-act="toggle-task-density">${icon("list", 15)} Group by project</button>
        </div>
        <div class="card-body flush" style="border-top:1px solid var(--divider)">
          ${list.length === 0
            ? emptyState({
                iconName: "checkCircle",
                title: taskFilter === "today" ? "Nothing due today" : "Nothing here",
                text: taskFilter === "today"
                  ? "No overdue or same-day tasks. Upcoming work is one tab away."
                  : "This filter is empty. Adjust the filter or add a task.",
                primary: { label: "Add task", act: "new-task" },
              })
            : list.map(taskRow).join("")}
        </div>
      </section>

      <div class="stack">
        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">By project</div></div></div>
          <div class="card-body flush">
            ${projects.filter((p) => !["closed"].includes(p.stage)).map((p) => {
              const counted = countTasks(p.id);
              const od = tasksOfProject(p.id).filter((t) => t.status !== "done" && daysUntil(t.due) < 0).length;
              return `<a class="item-row" href="#/projects/${p.id}?tab=work">
                <div class="item-main">
                  <div class="item-title">${esc(p.name)}</div>
                  <div class="item-sub">${od > 0 ? `<span class="mark-risk">${od} overdue</span> · ` : ""}${esc(client(p.clientId).name)}</div>
                </div>
                <span class="meta nowrap">${counted.done}/${counted.total}</span>
              </a>`;
            }).join("")}
          </div>
        </section>

        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Status legend</div>
            <div class="card-desc">V1 uses three statuses plus cancelled. Nothing else is inferred.</div></div></div>
          <div class="card-body stack-tight">
            ${chip("todo")} ${chip("in-progress")} ${chip("done")} ${chip("cancelled")}
          </div>
        </section>
      </div>
    </div>`;

  return { active: "tasks", crumbs: crumb([{ label: "Tasks" }]), body };
}

/* Task detail panel — shared by W02 and P03, per the inventory contract. */
function taskPanel(id) {
  const t = task(id);
  if (!t) return "";
  const proj = t.projectId ? project(t.projectId) : null;
  const cl = proj ? client(proj.clientId) : client(t.clientId);
  const milestone = proj && t.milestoneId ? proj.milestones.find((m) => m.id === t.milestoneId) : null;

  return `<div class="panel" role="dialog" aria-modal="true" aria-label="Task detail">
    <div class="panel-head">
      <div>
        <div class="panel-sub">${esc(proj ? proj.name : cl.name)}${milestone ? " · " + esc(milestone.name) : ""}</div>
        <div class="panel-title mt-4">${esc(t.title)}</div>
        <div class="row mt-8">${chip(t.status)} ${t.priority === "high" ? chip("at-risk", "High priority") : ""}</div>
      </div>
      <button class="icon-btn" data-act="close-panel" aria-label="Close">${icon("close")}</button>
    </div>
    <div class="panel-body">
      <div class="panel-section">
        <div class="panel-section-title">Details</div>
        <div class="defs">
          <div class="def"><span class="def-key">Project</span><span class="def-val">${proj ? `<a href="#/projects/${proj.id}?tab=work">${esc(proj.name)}</a>` : "Not yet assigned"}</span></div>
          <div class="def"><span class="def-key">Client</span><span class="def-val"><a href="#/clients/${cl.id}">${esc(cl.name)}</a></span></div>
          <div class="def"><span class="def-key">Due date</span><span class="def-val ${daysUntil(t.due) < 0 && t.status !== "done" ? "mark-risk" : ""}">${esc(formatDate(t.due))} · ${esc(dueLabel(t.due))}</span></div>
          <div class="def"><span class="def-key">Milestone</span><span class="def-val">${milestone ? esc(milestone.name) : "None"}</span></div>
          <div class="def"><span class="def-key">Owner</span><span class="def-val">${esc(workspace.owner)}</span></div>
        </div>
      </div>

      <div class="panel-section">
        <div class="panel-section-title">Description</div>
        <p class="muted" style="line-height:1.6">${t.note ? esc(t.note) : '<span class="meta">No description yet.</span>'}</p>
      </div>

      ${t.checklist.length ? `<div class="panel-section">
        <div class="panel-section-title">Checklist ${t.checklist.filter((c) => c.done).length}/${t.checklist.length}</div>
        <div class="stack-tight">
          ${t.checklist.map((c) => `<div class="row">
            <button class="tick" role="checkbox" aria-checked="${c.done}" aria-label="${esc(c.text)}">${c.done ? icon("check", 12) : ""}</button>
            <span style="font-size:var(--fs-label);${c.done ? "color:var(--metadata);text-decoration:line-through" : ""}">${esc(c.text)}</span>
          </div>`).join("")}
        </div>
      </div>` : ""}

      ${t.links.length ? `<div class="panel-section">
        <div class="panel-section-title">Links</div>
        <div class="stack-tight">
          ${t.links.map((l) => `<a class="row" href="${l.href}" style="font-size:var(--fs-label)">${icon("link", 15)}${esc(l.label)}</a>`).join("")}
        </div>
      </div>` : ""}

      <div class="panel-section">
        <div class="panel-section-title">Activity</div>
        <div class="comment">
          <span class="avatar">${esc(workspace.initials)}</span>
          <div>
            <div class="comment-head"><span class="comment-author">${esc(workspace.owner)}</span><span class="meta">created this task · ${esc(relative("2026-09-01T09:00:00"))}</span></div>
            <div class="comment-body">Linked to ${proj ? esc(proj.name) : esc(cl.name)}.</div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel-foot">
      <button class="btn btn-ghost" data-act="delete-task" data-id="${t.id}">Delete</button>
      <span class="grow"></span>
      <button class="btn btn-secondary" data-act="postpone-task" data-id="${t.id}">Postpone 1 day</button>
      <button class="btn btn-primary" data-act="complete-task" data-id="${t.id}">
        ${t.status === "done" ? "Reopen" : "Mark complete"}</button>
    </div>
  </div>`;
}

/* -------------------------------------------------------------------------- */
/* C01 · Clients                                                               */
/* -------------------------------------------------------------------------- */

function renderClients() {
  const body = `
    ${pageHead({
      eyebrow: "Relationships",
      title: "Clients",
      sub: "A client is the ongoing relationship, not one job. Card order and field placement stay identical on every row.",
      actions: `<button class="btn btn-primary" data-act="new-client">${icon("plus")} Add client</button>`,
    })}

    <div class="row row-wrap mb-16">
      <input class="input" style="max-width:300px" placeholder="Search clients…" data-act="client-search">
      <div class="segmented">
        <button aria-pressed="true">All (${clients.filter((c) => c.state !== "archived").length})</button>
        <button>Active (${clients.filter((c) => c.state === "active").length})</button>
        <button>Prospects (${clients.filter((c) => c.state === "prospect").length})</button>
      </div>
      <span class="grow"></span>
      <button class="btn btn-secondary btn-sm" data-act="filter-open">${icon("filter")} More filters</button>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr>
              <th>Client</th><th>Relationship</th><th>Primary contact</th>
              <th>Active projects</th><th>Next action</th><th>Last activity</th>
              <th><span class="visually-hidden">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            ${clients.filter((c) => c.state !== "archived").map((c) => `
              <tr>
                <td>
                  <a class="row-link" href="#/clients/${c.id}">
                    <div class="cell-primary">${esc(c.name)}</div>
                    <div class="cell-sub">${c.activeProjects} project${c.activeProjects === 1 ? "" : "s"} on record</div>
                  </a>
                </td>
                <td>${chip(c.state)}</td>
                <td>
                  <div>${esc(c.contact.name)}</div>
                  <div class="cell-sub">${esc(c.contact.role)}</div>
                </td>
                <td class="num">${c.activeProjects}</td>
                <td>
                  <div class="${c.nextActionTone === "risk" ? "mark-risk" : c.nextActionTone === "waiting" ? "mark-wait" : ""}">${esc(c.nextAction)}</div>
                  <div class="cell-sub">${esc(dueLabel(c.nextActionDue))}</div>
                </td>
                <td class="num"><span class="meta">${esc(relative(c.lastActivity))}</span></td>
                <td class="cell-actions">
                  <button class="icon-btn" data-act="client-menu" data-id="${c.id}" aria-label="Client actions">${icon("dots", 16)}</button>
                </td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div class="grid grid-3 mt-16">
      <div class="card"><div class="card-body">
        <div class="card-title">Prospect with no work yet</div>
        <div class="card-desc mt-4">Northgate Legal has a contact but no project. The relationship can hold tasks before any project exists.</div>
        <div class="mt-12">${chip("prospect")}</div>
      </div></div>
      <div class="card"><div class="card-body">
        <div class="card-title">Archived, not deleted</div>
        <div class="card-desc mt-4">Tidewater Foundation sits in Archive as a read-only record. Archiving a client never archives its project history silently.</div>
        <div class="mt-12"><a class="btn btn-secondary btn-sm" href="#/archive">Open archive</a></div>
      </div></div>
      <div class="card"><div class="card-body">
        <div class="card-title">Access is separate</div>
        <div class="card-desc mt-4">Being a client grants no content access. Every guest sees only what was explicitly granted.</div>
        <div class="mt-12"><a class="btn btn-secondary btn-sm" href="#/settings/access">Review access</a></div>
      </div></div>
    </div>`;

  return { active: "clients", crumbs: crumb([{ label: "Clients" }]), body };
}

/* C02 · Client Detail */
let clientTab = "projects";

function renderClientDetail(id) {
  const c = client(id);
  if (!c) return notFound("client");

  const cProjects = projectsOfClient(c.id);
  const cDocs = documents.filter((d) => d.clientId === c.id);
  const cTasks = tasksOfClient(c.id);
  const tabs = [["projects", "Projects", cProjects.length], ["documents", "Documents", cDocs.length],
    ["contacts", "Contacts", c.contacts.length], ["notes", "Private notes", null], ["history", "History", null]];

  let tabBody = "";
  if (clientTab === "projects") {
    tabBody = cProjects.length === 0
      ? emptyState({
          iconName: "projects",
          title: c.state === "prospect" ? "No project yet — this is still a relationship" : "No projects on record",
          text: c.state === "prospect"
            ? "Northgate Legal is a prospect. Keep notes and tasks on the client record until a scoped engagement is agreed."
            : "This client has no projects. Add one to start tracking work, documents and reviews.",
          primary: { label: "Add project", act: "new-project" },
        })
      : `<div class="card"><div class="card-body flush">
          ${cProjects.map((p) => {
            const counted = countTasks(p.id);
            const revs = reviewsOfProject(p.id);
            return `<div class="item-row">
              <div class="item-main">
                <div class="item-title"><a href="#/projects/${p.id}" style="color:inherit">${esc(p.name)}</a></div>
                <div class="item-sub">${esc(p.outcome)}</div>
                <div style="margin-top:9px;max-width:300px">${progressBar(counted.done, counted.total)}</div>
              </div>
              <div class="item-side">
                ${chip(p.stage, p.stageLabel)}
                <span class="meta">${revs.length ? `${revs.filter((r) => r.state === "approved").length}/${revs.length} reviews approved` : "No reviews requested"}</span>
                <span class="meta">${esc(dueLabel(p.due))}</span>
              </div>
            </div>`;
          }).join("")}
        </div></div>`;
  } else if (clientTab === "documents") {
    tabBody = cDocs.length === 0
      ? emptyState({ iconName: "documents", title: "No documents", text: "Documents belong to a project. Create one inside a project so its client context stays unambiguous." })
      : `<div class="card"><div class="card-body flush">
          ${cDocs.map((d) => `<a class="item-row" href="#/documents/${d.id}">
            <span class="state-icon" style="width:30px;height:30px;border-radius:6px">${icon("documents", 15)}</span>
            <div class="item-main">
              <div class="item-title">${esc(d.title)}</div>
              <div class="item-sub">${esc(d.type)} · working v${d.workingVersion}${d.submittedVersion ? ` · submitted v${d.submittedVersion}` : " · never submitted"}</div>
            </div>
            <div class="item-side">${chip(d.reviewState)} ${chip(d.visibility)}</div>
          </a>`).join("")}
        </div></div>`;
  } else if (clientTab === "contacts") {
    tabBody = `<div class="card"><div class="card-body flush">
      ${c.contacts.map((ct) => `<div class="item-row">
        <span class="avatar">${esc(initials(ct.name))}</span>
        <div class="item-main">
          <div class="item-title">${esc(ct.name)} ${ct.primary ? '<span class="chip accent" style="margin-left:6px">Primary</span>' : ""}</div>
          <div class="item-sub">${esc(ct.role)} · ${esc(ct.email)}</div>
        </div>
        <div class="item-actions">
          <button class="btn btn-secondary btn-sm" data-act="invite-contact">Invite to review</button>
        </div>
      </div>`).join("")}
      </div></div>`;
  } else if (clientTab === "notes") {
    tabBody = `<div class="card"><div class="card-head">
        <div class="card-head-text"><div class="card-title">Private notes</div>
        <div class="card-desc">Client-level notes live on the client record. Guests never see this surface.</div></div>
        <button class="btn btn-secondary btn-sm" data-act="edit-notes">${icon("edit", 15)} Edit</button>
      </div>
      <div class="card-body">
        <div class="banner ok" style="margin-bottom:14px">
          <div class="banner-text">Saved to this device<div class="banner-sub">Last edited ${esc(relative(c.lastActivity))}</div></div>
        </div>
        <p style="line-height:1.7">${esc(c.note)}</p>
        <div class="defs mt-16">
          <div class="def"><span class="def-key">Relationship state</span><span class="def-val">${chip(c.state)}</span></div>
          <div class="def"><span class="def-key">Referred by</span><span class="def-val">${c.id === "cl-northgate" ? "Harbor & Finch" : "—"}</span></div>
        </div>
      </div></div>`;
  } else {
    tabBody = `<section class="card">
      <div class="card-head"><div class="card-head-text"><div class="card-title">Relationship history</div>
      <div class="card-desc">Every record linked to this client, newest first.</div></div></div>
      <div class="card-body flush timeline">
        ${[
          ...cProjects.map((p) => ({ date: p.startedOn || p.scopeAcceptedOn, title: `Project created — ${p.name}`, meta: `Scope ${p.scopeAccepted ? "accepted " + formatShortDate(p.scopeAcceptedOn) : "not yet accepted"}`, icon: "projects" })),
          ...cDocs.map((d) => ({ date: d.modified, title: `Document updated — ${d.title}`, meta: `Working v${d.workingVersion}`, icon: "documents" })),
          ...cTasks.slice(0, 3).map((t) => ({ date: t.due, title: `Task — ${t.title}`, meta: dueLabel(t.due), icon: "tasks" })),
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8).map((e) => `
          <div class="event">
            <span class="event-mark">${icon(e.icon, 14)}</span>
            <div>
              <div class="event-title">${esc(e.title)}</div>
              <div class="event-meta"><span>${esc(e.meta)}</span><span>·</span><span>${esc(formatDate(e.date))}</span></div>
            </div>
          </div>`).join("")}
      </div>
    </section>`;
  }

  const body = `
    ${pageHead({
      eyebrow: "Client",
      title: c.name,
      sub: c.nextActionTone === "risk"
        ? `<span class="mark-risk">${esc(c.nextAction)}</span> — ${esc(dueLabel(c.nextActionDue))}.`
        : esc(c.nextAction) + " — " + esc(dueLabel(c.nextActionDue)) + ".",
      actions: `<button class="btn btn-secondary" data-act="client-menu" data-id="${c.id}">${icon("dots")} Actions</button>
                <button class="btn btn-primary" data-act="new-project" data-id="${c.id}">${icon("plus")} Add project</button>`,
    })}

    <div class="grid grid-4 mb-20">
      <div class="metric"><span class="metric-label">Relationship</span>
        <span class="metric-value" style="font-size:20px">${chip(c.state)}</span>
        <span class="metric-foot">Since ${esc(formatDate(c.lastActivity))}</span></div>
      <div class="metric"><span class="metric-label">Active projects</span>
        <span class="metric-value">${c.activeProjects}</span>
        <span class="metric-foot">${cProjects.length} total on record</span></div>
      <div class="metric"><span class="metric-label">Open tasks</span>
        <span class="metric-value">${cTasks.filter((t) => t.status !== "done").length}</span>
        <span class="metric-foot">${cTasks.filter((t) => t.status !== "done" && daysUntil(t.due) < 0).length} overdue</span></div>
      <div class="metric"><span class="metric-label">Documents</span>
        <span class="metric-value">${cDocs.length}</span>
        <span class="metric-foot">${cDocs.filter((d) => d.visibility === "shared").length} shared with client</span></div>
    </div>

    <div class="tabs mb-20" role="tablist">
      ${tabs.map(([id, label, n]) => `<button class="tab" role="tab" data-act="client-tab" data-id="${id}"
        aria-selected="${clientTab === id}">${label}${n !== null ? `<span class="tab-count">${n}</span>` : ""}</button>`).join("")}
    </div>

    <div class="split">
      <div>${tabBody}</div>
      <div class="stack">
        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Primary contact</div></div></div>
          <div class="card-body">
            <div class="row mb-16">
              <span class="avatar">${esc(initials(c.contact.name))}</span>
              <div class="col">
                <span class="strong">${esc(c.contact.name)}</span>
                <span class="meta">${esc(c.contact.role)}</span>
              </div>
            </div>
            <div class="defs">
              <div class="def"><span class="def-key">Email</span><span class="def-val">${esc(c.contact.email)}</span></div>
              <div class="def"><span class="def-key">Guest access</span><span class="def-val">${grants.filter((g) => g.recipient.email === c.contact.email && g.state === "active").length ? chip("active", "Active grant") : '<span class="meta">None</span>'}</span></div>
              <div class="def"><span class="def-key">Last activity</span><span class="def-val">${esc(relative(c.lastActivity))}</span></div>
            </div>
            <button class="btn btn-secondary btn-block mt-16" data-act="invite-contact">${icon("mail", 15)} Invite to review</button>
          </div>
        </section>

        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Next action</div>
            <div class="card-desc">One clear next step per relationship.</div></div></div>
          <div class="card-body">
            <div class="banner ${c.nextActionTone === "risk" ? "bad" : c.nextActionTone === "waiting" ? "" : "ok"}">
              <div class="banner-text">${esc(c.nextAction)}<div class="banner-sub">${esc(dueLabel(c.nextActionDue))}</div></div>
            </div>
            <button class="btn btn-secondary btn-block mt-12" data-act="open-task-form">${icon("plus", 15)} Add task for this client</button>
          </div>
        </section>

        ${c.state === "archived" ? `<section class="card"><div class="card-body">
          <div class="card-title">Archived record</div>
          <div class="card-desc mt-4">Read-only. Restoring is an owner action and does not reinstate guest access.</div>
          <button class="btn btn-secondary btn-block mt-12" data-act="restore-client" data-id="${c.id}">Restore client</button>
        </div></section>` : `<section class="card"><div class="card-body">
          <div class="card-title">Danger zone</div>
          <div class="card-desc mt-4">Archiving keeps all history and revokes nothing on its own. Access changes are made in Settings → Client access.</div>
          <button class="btn btn-danger btn-block mt-12" data-act="archive-client" data-id="${c.id}">Archive ${esc(c.name)}</button>
        </div></section>`}
      </div>
    </div>`;

  return { active: "clients", crumbs: crumb([{ label: "Clients", href: "#/clients" }, { label: c.name }]), body };
}

/* -------------------------------------------------------------------------- */
/* P01 · Projects                                                              */
/* -------------------------------------------------------------------------- */

function renderProjects() {
  const body = `
    ${pageHead({
      eyebrow: "Delivery",
      title: "Projects",
      sub: "One scoped engagement with an outcome. Every project belongs to exactly one client.",
      actions: `<button class="btn btn-secondary" data-act="filter-open">${icon("filter")} Filter</button>
                <button class="btn btn-primary" data-act="new-project">${icon("plus")} New project</button>`,
    })}

    ${banner(
      "<strong>Sequencing matters.</strong> Website design is deliberately held until the identity system is approved.",
      "Creating a project requires a client, a brief and dates — an incomplete draft cannot be shared.",
      "",
      `<button class="btn btn-secondary btn-sm" data-act="new-project">Start create flow</button>`
    )}

    <div class="grid grid-2 mt-16">
      ${projects.map((p) => {
        const c = client(p.clientId);
        const counted = countTasks(p.id);
        const revs = reviewsOfProject(p.id);
        const dl = deliveryOfProject(p.id);
        const od = tasksOfProject(p.id).filter((t) => t.status !== "done" && daysUntil(t.due) < 0).length;
        return `<section class="card">
          <div class="card-head">
            <div class="card-head-text">
              <div class="card-title"><a href="#/projects/${p.id}" style="color:inherit">${esc(p.name)}</a></div>
              <div class="card-desc">${esc(c.name)} · ${esc(p.outcome)}</div>
            </div>
            ${chip(p.stage, p.stageLabel)}
          </div>
          <div class="card-body">
            <div class="defs">
              <div class="def"><span class="def-key">Next milestone</span><span class="def-val">${esc(p.nextMilestone)} · ${esc(formatShortDate(p.nextMilestoneDue))}</span></div>
              <div class="def"><span class="def-key">Next action</span><span class="def-val ${p.nextActionTone === "risk" ? "mark-risk" : p.nextActionTone === "waiting" ? "mark-wait" : ""}">${esc(p.nextAction)}</span></div>
              <div class="def"><span class="def-key">Due</span><span class="def-val ${daysUntil(p.due) < 0 ? "mark-risk" : ""}">${esc(formatDate(p.due))}${od ? ` · <span class="mark-risk">${od} overdue</span>` : ""}</span></div>
              <div class="def"><span class="def-key">Review progress</span><span class="def-val">${esc(p.reviewProgress)}</span></div>
              ${dl ? `<div class="def"><span class="def-key">Delivery</span><span class="def-val">${chip(dl.state, dl.stateLabel)}</span></div>` : ""}
            </div>
            <div class="mt-16">${progressBar(counted.done, counted.total)}</div>
          </div>
          <div class="card-foot row-between">
            <span class="meta">${revs.length} review request${revs.length === 1 ? "" : "s"} on record</span>
            <a class="btn btn-secondary btn-sm" href="#/projects/${p.id}">Open workspace</a>
          </div>
        </section>`;
      }).join("")}
    </div>`;

  return { active: "projects", crumbs: crumb([{ label: "Projects" }]), body };
}

/* P02-P06 · Project Workspace */
let projectTab = "overview";

function renderProjectWorkspace(id) {
  const p = project(id);
  if (!p) return notFound("project");
  const c = client(p.clientId);
  const counted = countTasks(p.id);
  const pDocs = documentsOfProject(p.id);
  const pTasks = tasksOfProject(p.id);
  const pRevs = reviewsOfProject(p.id);
  const dl = deliveryOfProject(p.id);

  const tabs = [
    ["overview", "Overview", null],
    ["work", "Work", pTasks.length],
    ["documents", "Documents & Files", pDocs.length],
    ["reviews", "Reviews", pRevs.length],
    ["delivery", "Delivery", dl ? 1 : 0],
  ];

  /* ---- shared context header: identity stays visible on every tab ---- */
  const contextHeader = `
    <div class="card mb-16">
      <div class="card-body">
        <div class="row-between row-wrap">
          <div class="row row-wrap">
            <div>
              <div class="row" style="gap:9px">
                <h2>${esc(p.name)}</h2>${chip(p.stage, p.stageLabel)}
              </div>
              <div class="meta mt-4">
                <a href="#/clients/${c.id}">${esc(c.name)}</a> · scope ${p.scopeAccepted ? `accepted ${esc(formatDate(p.scopeAcceptedOn))}` : '<span class="mark-wait">not yet accepted</span>'} · started ${p.startedOn ? esc(formatDate(p.startedOn)) : "not started"}
              </div>
            </div>
          </div>
          <div class="row">
            <button class="btn btn-ghost btn-sm" data-act="copy-link">${icon("link", 15)} Copy link</button>
            <div class="menu-wrap">
              <button class="btn btn-secondary btn-sm" data-act="project-menu" data-id="${p.id}">${icon("dots", 15)} Actions</button>
            </div>
          </div>
        </div>
        <div class="grid grid-4 mt-16">
          <div><div class="metric-label">Next action</div><div class="mt-4 ${p.nextActionTone === "risk" ? "mark-risk" : "strong"}" style="font-size:var(--fs-label)">${esc(p.nextAction)}</div></div>
          <div><div class="metric-label">Next milestone</div><div class="mt-4 strong" style="font-size:var(--fs-label)">${esc(p.nextMilestone)}</div><div class="meta">${esc(formatShortDate(p.nextMilestoneDue))}</div></div>
          <div><div class="metric-label">Task progress</div><div class="mt-8">${progressBar(counted.done, counted.total)}</div></div>
          <div><div class="metric-label">Reviews</div><div class="mt-4 strong" style="font-size:var(--fs-label)">${pRevs.filter((r) => r.state === "approved").length} approved · ${pRevs.filter((r) => r.state === "waiting").length} waiting</div></div>
        </div>
      </div>
    </div>`;

  let tabBody = "";

  /* ---- P02 Overview ---- */
  if (projectTab === "overview") {
    tabBody = `<div class="split">
      <div class="stack">
        <section class="card">
          <div class="card-head">
            <div class="card-head-text"><div class="card-title">Brief</div>
              <div class="card-desc">The purpose this project exists to serve.</div></div>
            <button class="btn btn-ghost btn-sm" data-act="edit-scope">${icon("edit", 15)} Edit</button>
          </div>
          <div class="card-body"><p style="line-height:1.7">${esc(p.brief)}</p></div>
        </section>

        <section class="card">
          <div class="card-head">
            <div class="card-head-text"><div class="card-title">Scope</div>
              <div class="card-desc">Changes after acceptance are recorded, never silently applied.</div></div>
            ${p.scopeAccepted ? chip("approved", "Accepted") : chip("waiting", "Awaiting acceptance")}
          </div>
          <div class="card-body">
            <div class="grid grid-2">
              <div>
                <div class="panel-section-title">In scope</div>
                <ul class="doc-list" style="margin-top:0">
                  ${p.inScope.map((s) => `<li>${esc(s)}</li>`).join("")}
                </ul>
              </div>
              <div>
                <div class="panel-section-title">Out of scope</div>
                <ul class="doc-list" style="margin-top:0;color:var(--metadata)">
                  ${p.outOfScope.map((s) => `<li>${esc(s)}</li>`).join("")}
                </ul>
              </div>
            </div>
            ${p.scopeAccepted ? `<div class="banner mt-16">
              <div class="banner-text">Scope accepted ${esc(formatDate(p.scopeAcceptedOn))}
                <div class="banner-sub">Recorded by ${esc(workspace.owner)}. Any later change is logged as a scope change.</div></div>
              <button class="btn btn-secondary btn-sm" data-act="record-scope-change">Record change</button>
            </div>` : `<div class="banner mt-16">
              <div class="banner-text">Scope has not been accepted
                <div class="banner-sub">Work can continue, but delivery stays blocked until acceptance is recorded.</div></div>
              <button class="btn btn-primary btn-sm" data-act="accept-scope">Record acceptance</button>
            </div>`}
          </div>
        </section>

        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Key links and documents</div></div>
            <a class="btn btn-ghost btn-sm" href="#/projects/${p.id}?tab=documents">All documents ${icon("chevronRight", 14)}</a></div>
          <div class="card-body flush">
            ${pDocs.length === 0
              ? `<div class="card-body"><p class="meta">No documents yet. Create one inside this project so its client context stays unambiguous.</p>
                 <button class="btn btn-secondary btn-sm mt-12" data-act="new-document">${icon("plus", 15)} Create document</button></div>`
              : pDocs.map((d) => `<a class="item-row" href="#/documents/${d.id}">
                  <span class="state-icon" style="width:30px;height:30px;border-radius:6px">${icon("documents", 15)}</span>
                  <div class="item-main">
                    <div class="item-title">${esc(d.title)}</div>
                    <div class="item-sub">${esc(d.type)} · working v${d.workingVersion}${d.submittedVersion ? ` · submitted v${d.submittedVersion}` : ""}</div>
                  </div>
                  <div class="item-side">${chip(d.reviewState)} ${chip(d.visibility)}</div>
                </a>`).join("")}
          </div>
        </section>
      </div>

      <div class="stack">
        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Milestones</div></div></div>
          <div class="card-body flush">
            ${p.milestones.map((m) => `<div class="item-row">
              <span class="tick" role="checkbox" aria-checked="${m.done}">${m.done ? icon("check", 12) : ""}</span>
              <div class="item-main">
                <div class="item-title" style="${m.done ? "color:var(--metadata);text-decoration:line-through" : ""}">${esc(m.name)}</div>
                <div class="item-sub">${esc(formatDate(m.due))}${!m.done && daysUntil(m.due) < 0 ? ' · <span class="mark-risk">overdue</span>' : ""}</div>
              </div>
            </div>`).join("")}
          </div>
        </section>

        <section class="card">
          <div class="card-body">
            <div class="card-title">Record details</div>
            <div class="defs mt-12">
              <div class="def"><span class="def-key">Client</span><span class="def-val"><a href="#/clients/${c.id}">${esc(c.name)}</a></span></div>
              <div class="def"><span class="def-key">Owner</span><span class="def-val">${esc(workspace.owner)}</span></div>
              <div class="def"><span class="def-key">Start</span><span class="def-val">${p.startedOn ? esc(formatDate(p.startedOn)) : "Not started"}</span></div>
              <div class="def"><span class="def-key">Target delivery</span><span class="def-val">${esc(formatDate(p.due))}</span></div>
              <div class="def"><span class="def-key">Stage</span><span class="def-val">${chip(p.stage, p.stageLabel)}</span></div>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Project controls</div></div></div>
          <div class="card-body stack-tight">
            <button class="btn btn-secondary btn-block" data-act="place-hold">${icon("clock", 15)} ${p.stage === "blocked" ? "Resume project" : "Place on hold"}</button>
            <button class="btn btn-secondary btn-block" data-act="change-stage">${icon("refresh", 15)} Change stage</button>
            ${p.stage === "closed" ? "" : `<button class="btn btn-danger btn-block" data-act="close-project">${icon("checkCircle", 15)} Close project</button>`}
            <p class="meta mt-8">Closing a project does not archive its client, and never revokes access on its own.</p>
          </div>
        </section>
      </div>
    </div>`;
  }

  /* ---- P03 Work ---- */
  if (projectTab === "work") {
    const byMilestone = p.milestones.map((m) => ({
      m,
      list: pTasks.filter((t) => t.milestoneId === m.id),
    })).filter((g) => g.list.length > 0);
    const loose = pTasks.filter((t) => !t.milestoneId);

    tabBody = pTasks.length === 0
      ? emptyState({
          iconName: "tasks",
          title: "No tasks yet",
          text: "Break the scope into tasks and group them under milestones. Progress is counted from real completed tasks.",
          primary: { label: "Add first task", act: "new-task" },
        })
      : `<div class="card">
          <div class="card-head">
            <div class="card-head-text"><div class="card-title">Work breakdown</div>
              <div class="card-desc">Grouped by milestone. The same task detail panel is used here and in the global Tasks view.</div></div>
            <div class="row">
              <span class="meta">${counted.done} of ${counted.total} complete</span>
              <button class="btn btn-primary btn-sm" data-act="new-task">${icon("plus", 14)} Add task</button>
            </div>
          </div>
          <div class="card-body flush">
            ${byMilestone.map((g) => `
              <div class="milestone-head">
                <div class="row">
                  <span class="milestone-name">${esc(g.m.name)}</span>
                  ${g.m.done ? chip("done", "Milestone met") : daysUntil(g.m.due) < 0 ? chip("overdue", "Milestone overdue") : `<span class="meta">${esc(formatDate(g.m.due))}</span>`}
                </div>
                <span class="meta">${g.list.filter((t) => t.status === "done").length}/${g.list.length}</span>
              </div>
              ${g.list.map(taskRow).join("")}
            `).join("")}
            ${loose.length ? `<div class="milestone-head">
                <span class="milestone-name">Not assigned to a milestone</span>
                <span class="meta">${loose.length}</span>
              </div>
              ${loose.map(taskRow).join("")}` : ""}
          </div>
        </div>`;
  }

  /* ---- P04 Documents & Files ---- */
  if (projectTab === "documents") {
    const files = [
      { name: "harbor-finch-logo-package.zip", meta: "ZIP · 18.4 MB · uploaded 12 Aug", kind: "zip" },
      { name: "packaging-artwork-press.pdf", meta: "PDF · 42.1 MB · uploaded 9 Sep", kind: "pdf" },
    ];
    tabBody = `<div class="stack">
      <div class="card">
        <div class="card-head">
          <div class="card-head-text"><div class="card-title">Documents</div>
            <div class="card-desc">A document is a versioned piece of work. Files are private until explicitly shared.</div></div>
          <div class="row">
            <button class="btn btn-secondary btn-sm" data-act="upload-file">${icon("upload", 14)} Upload file</button>
            <button class="btn btn-primary btn-sm" data-act="new-document">${icon("plus", 14)} Create document</button>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data">
            <thead><tr><th>Title</th><th>Type</th><th>Latest submitted</th><th>Review state</th><th>Visibility</th><th>Modified</th></tr></thead>
            <tbody>
              ${pDocs.length === 0 ? `<tr><td colspan="6"><p class="meta">No documents in this project yet.</p></td></tr>`
                : pDocs.map((d) => `<tr>
                  <td><a class="row-link" href="#/documents/${d.id}"><div class="cell-primary">${esc(d.title)}</div>
                    <div class="cell-sub">working copy v${d.workingVersion}</div></a></td>
                  <td>${esc(d.type)}</td>
                  <td>${d.submittedVersion ? `v${d.submittedVersion}` : '<span class="meta">Never submitted</span>'}</td>
                  <td>${chip(d.reviewState)}</td>
                  <td>${chip(d.visibility)}</td>
                  <td class="num"><span class="meta">${esc(relative(d.modified))}</span></td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-head"><div class="card-head-text"><div class="card-title">Files</div>
          <div class="card-desc">Uploaded assets attached to this project. Replacing a file cannot alter an already delivered package.</div></div></div>
        <div class="card-body flush">
          ${files.map((f) => `<div class="item-row">
            <span class="package-badge ${f.kind}">${f.kind.toUpperCase()}</span>
            <div class="item-main"><div class="item-title">${esc(f.name)}</div><div class="item-sub">${esc(f.meta)}</div></div>
            <div class="item-side">${chip("private")}</div>
            <div class="item-actions">
              <button class="icon-btn" data-act="download" aria-label="Download">${icon("download", 16)}</button>
            </div>
          </div>`).join("")}
        </div>
        <div class="card-foot">
          <div class="banner" style="border:0;background:none;padding:0;border-left:0">
            <div class="banner-text">Upload progress and failures appear inline here
              <div class="banner-sub">An unsupported file is named explicitly rather than silently ignored.</div></div>
          </div>
        </div>
      </div>
    </div>`;
  }

  /* ---- P05 Reviews ---- */
  if (projectTab === "reviews") {
    tabBody = `<div class="card">
      <div class="card-head">
        <div class="card-head-text"><div class="card-title">Review requests</div>
          <div class="card-desc">One open request per deliverable in V1. Withdrawing closes the request; it never deletes the version.</div></div>
        <button class="btn btn-primary btn-sm" data-act="open-review-setup" data-id="${p.id}">${icon("send", 14)} Request review</button>
      </div>
      <div class="card-body flush">
        ${pRevs.length === 0
          ? emptyState({ iconName: "send", title: "No review requested", text: "Request a review on an exact submitted version. The recipient is the only person who can decide." })
          : pRevs.map((r) => {
              const d = documentRecord(r.documentId);
              const overdue = r.state === "waiting" && daysUntil(r.due) < 0;
              return `<div class="review-card">
                <div>
                  <div class="row" style="gap:9px">
                    <span class="strong">${esc(d.title)} · v${r.version}</span>
                    ${chip(r.state)}
                  </div>
                  <div class="meta mt-4">
                    Reviewer <strong>${esc(r.reviewer.name)}</strong> (${esc(r.reviewer.role)}) ·
                    requested ${esc(formatDate(r.requestedOn))} ·
                    ${r.due ? `due <span class="${overdue ? "mark-risk" : ""}">${esc(formatDate(r.due))}</span>` : "no due date"}
                  </div>
                  ${r.comments.length ? `<div class="mt-12">
                    ${r.comments.map((cm) => `<div class="comment">
                      <span class="avatar">${esc(initials(cm.author))}</span>
                      <div>
                        <div class="comment-head"><span class="comment-author">${esc(cm.author)}</span>
                          <span class="meta">${esc(formatDate(cm.date))}</span></div>
                        <div class="comment-body">${esc(cm.body)}</div>
                      </div>
                    </div>`).join("")}
                  </div>` : ""}
                </div>
                <div class="item-side" style="align-items:flex-end">
                  <a class="btn btn-secondary btn-sm" href="#/documents/${d.id}?view=history">${icon("history", 14)} Version history</a>
                  ${r.state === "waiting" ? `<button class="btn btn-ghost btn-sm" data-act="withdraw-review" data-id="${r.id}">Withdraw</button>` : ""}
                  ${r.outcome === "changes" ? `<button class="btn btn-primary btn-sm" data-act="create-revision" data-id="${r.id}">Create revision</button>` : ""}
                  ${r.outcome === "approved" ? `<button class="btn btn-secondary btn-sm" data-act="go-delivery" data-id="${p.id}">Prepare delivery</button>` : ""}
                </div>
              </div>`;
            }).join("")}
      </div>
    </div>`;
  }

  /* ---- P06 Delivery ---- */
  if (projectTab === "delivery") {
    tabBody = dl
      ? `<div class="stack">
          ${dl.state === "blocked" ? `<div>${banner(
            "<strong>Final delivery is blocked.</strong> Brand guidelines v3 has no approved version.",
            "Select only approved versions. Missing approval or a missing file blocks delivery by design.",
            "bad",
            `<button class="btn btn-secondary btn-sm" data-act="open-review" data-id="rv-1">Inspect review</button>`
          )}</div>` : ""}
          <div class="split">
            <section class="card">
              <div class="card-head">
                <div class="card-head-text"><div class="card-title">${esc(dl.title)}</div>
                  <div class="card-desc">Recipient ${esc(dl.recipient.name)} · ${esc(dl.recipient.email)}</div></div>
                ${chip(dl.state, dl.stateLabel)}
              </div>
              <div class="card-body flush">
                ${dl.files.map((f) => `<div class="package-row">
                  <span class="package-badge ${f.kind}">${f.kind.toUpperCase()}</span>
                  <div class="item-main">
                    <div class="item-title">${esc(f.name)}</div>
                    <div class="item-sub">${esc(f.meta)}</div>
                  </div>
                  <div class="item-side">${f.approved ? chip("approved") : chip("blocked", "Not approved")}</div>
                </div>`).join("")}
              </div>
              <div class="card-foot">
                <div class="row-between row-wrap">
                  <span class="meta">Changing this package creates a new package revision.</span>
                  <div class="row">
                    <button class="btn btn-secondary btn-sm" data-act="preview-as-client" data-id="${dl.id}">${icon("eye", 14)} Preview as client</button>
                    <button class="btn btn-primary btn-sm" data-act="share-package" data-id="${dl.id}"
                      ${dl.state === "blocked" ? 'aria-disabled="true"' : ""}>${icon("send", 14)} Share package</button>
                  </div>
                </div>
              </div>
            </section>

            <div class="stack">
              <section class="card">
                <div class="card-head"><div class="card-head-text"><div class="card-title">Handoff notes</div></div></div>
                <div class="card-body"><p class="muted" style="line-height:1.6">${esc(dl.notes)}</p></div>
              </section>
              <section class="card">
                <div class="card-head"><div class="card-head-text"><div class="card-title">Delivery record</div>
                  <div class="card-desc">Acknowledgment is recorded separately from delivery.</div></div></div>
                <div class="card-body">
                  <div class="defs">
                    <div class="def"><span class="def-key">Delivered</span><span class="def-val">${dl.deliveredOn ? esc(formatDate(dl.deliveredOn)) : '<span class="meta">Not delivered</span>'}</span></div>
                    <div class="def"><span class="def-key">Method</span><span class="def-val">${dl.deliveredOn ? "CoreDesk guest link" : "—"}</span></div>
                    <div class="def"><span class="def-key">Acknowledged</span><span class="def-val">${dl.acknowledgedOn ? esc(formatDate(dl.acknowledgedOn)) : '<span class="meta">Pending</span>'}</span></div>
                  </div>
                  ${!dl.deliveredOn ? `<button class="btn btn-secondary btn-block mt-12" data-act="record-external">${icon("check", 15)} Record external handoff</button>` : ""}
                </div>
              </section>
            </div>
          </div>
        </div>`
      : emptyState({
          iconName: "package",
          title: "No delivery package yet",
          text: "A package collects the exact approved versions and immutable file revisions. It can only be built from approved work.",
          primary: pRevs.some((r) => r.state === "approved") ? { label: "Create delivery package", act: "create-delivery" } : null,
        });
  }

  const body = `
    ${contextHeader}
    <div class="tabs mb-20" role="tablist" aria-label="Project workspace">
      ${tabs.map(([id, label, n]) => `<button class="tab" role="tab" data-act="project-tab" data-id="${id}"
        aria-selected="${projectTab === id}">${label}${n !== null ? `<span class="tab-count">${n}</span>` : ""}</button>`).join("")}
    </div>
    ${tabBody}`;

  return {
    active: "projects",
    crumbs: crumb([
      { label: "Projects", href: "#/projects" },
      { label: c.name, href: `#/clients/${c.id}` },
      { label: p.name },
    ]),
    body,
  };
}

/* -------------------------------------------------------------------------- */
/* D01 · Documents                                                             */
/* -------------------------------------------------------------------------- */

function renderDocuments() {
  const body = `
    ${pageHead({
      eyebrow: "Deliverables",
      title: "Documents",
      sub: "One document system for proposals, briefs, agreement records, welcome packs and deliverables. A document belongs to exactly one project.",
      actions: `<button class="btn btn-primary" data-act="new-document">${icon("plus")} Create document</button>`,
    })}

    <div class="row row-wrap mb-16">
      <input class="input" style="max-width:300px" placeholder="Search documents…" >
      <select class="select" style="max-width:190px">
        <option>All types</option><option>Proposal</option><option>Brief</option>
        <option>Agreement record</option><option>Welcome pack</option><option>Deliverable</option>
      </select>
      <select class="select" style="max-width:200px">
        <option>All review states</option><option>Waiting</option><option>Changes requested</option>
        <option>Approved</option><option>Never submitted</option>
      </select>
      <span class="grow"></span>
      <div class="segmented">
        <button aria-pressed="true">${icon("list", 14)} List</button>
        <button>${icon("grid", 14)} Grid</button>
      </div>
    </div>

    <div class="card">
      <div class="table-wrap">
        <table class="data">
          <thead>
            <tr><th>Title</th><th>Type</th><th>Client / Project</th><th>Working</th><th>Submitted</th>
              <th>Review state</th><th>Visibility</th><th>Reviewer</th><th>Modified</th></tr>
          </thead>
          <tbody>
            ${documents.map((d) => {
              const proj = project(d.projectId);
              const cl = client(d.clientId);
              return `<tr>
                <td><a class="row-link" href="#/documents/${d.id}"><div class="cell-primary">${esc(d.title)}</div>
                  <div class="cell-sub">${d.sections.length} sections</div></a></td>
                <td>${esc(d.type)}</td>
                <td><div>${esc(cl.name)}</div><div class="cell-sub">${proj ? esc(proj.name) : "—"}</div></td>
                <td class="num">v${d.workingVersion}</td>
                <td class="num">${d.submittedVersion ? `v${d.submittedVersion}` : '<span class="meta">—</span>'}</td>
                <td>${chip(d.reviewState)}</td>
                <td>${chip(d.visibility)}</td>
                <td>${d.reviewer ? esc(d.reviewer) : '<span class="meta">—</span>'}</td>
                <td class="num"><span class="meta">${esc(relative(d.modified))}</span></td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>

    <div class="grid grid-3 mt-16">
      <div class="card"><div class="card-body">
        <div class="card-title">A submitted version is immutable</div>
        <div class="card-desc mt-4">Version history keeps every submitted version. A new draft copies forward; it never overwrites.</div>
        <a class="btn btn-secondary btn-sm mt-12" href="#/documents/doc-guidelines?view=history">See version history</a>
      </div></div>
      <div class="card"><div class="card-body">
        <div class="card-title">Sharing is never a side effect</div>
        <div class="card-desc mt-4">Previewing a document does not share it. Sharing happens only in Review &amp; share setup.</div>
        <button class="btn btn-secondary btn-sm mt-12" data-act="open-review-setup" data-id="pr-identity">Open share setup</button>
      </div></div>
      <div class="card"><div class="card-body">
        <div class="card-title">Agreement evidence</div>
        <div class="card-desc mt-4">An agreement record links an external contract and its acceptance evidence. Approval is a review decision, not a signature.</div>
        <span class="chip neutral mt-12">Later scope: e-signing</span>
      </div></div>
    </div>`;

  return { active: "documents", crumbs: crumb([{ label: "Documents" }]), body };
}

/* -------------------------------------------------------------------------- */
/* D02 / D03 / D04 · Document Workspace                                        */
/* -------------------------------------------------------------------------- */

let docView = "editor";
let saveState = "saved";

function renderDocumentWorkspace(id) {
  const d = documentRecord(id);
  if (!d) return notFound("document");
  const proj = project(d.projectId);
  const cl = client(d.clientId);
  const activeReview = reviews.find((r) => r.documentId === d.id && r.state === "waiting");
  const latest = d.versions[0] || null;

  const tabs = [
    ["editor", "Write", null],
    ["preview", "Preview & export", null],
    ["history", "Version history", d.versions.length],
  ];

  const saveLabel = {
    saved: ["saved", "All changes saved"],
    dirty: ["dirty", "Unsaved changes"],
    saving: ["saving", "Saving…"],
    failed: ["failed", "Save failed — your text is kept"],
  }[saveState];

  const contextHeader = `
    <div class="card mb-16"><div class="card-body">
      <div class="row-between row-wrap">
        <div>
          <div class="row" style="gap:9px">
            <h2>${esc(d.title)}</h2>
            ${chip(d.reviewState)} ${chip(d.visibility)}
          </div>
          <div class="meta mt-4">
            ${esc(d.type)} ·
            <a href="#/clients/${cl.id}">${esc(cl.name)}</a> ·
            <a href="#/projects/${proj.id}">${esc(proj.name)}</a> ·
            working v${d.workingVersion}${d.submittedVersion ? ` · submitted v${d.submittedVersion}` : " · never submitted"}
          </div>
        </div>
        <div class="row row-wrap">
          <span class="save-state ${saveLabel[0]}" data-save-state><span class="dot"></span>${esc(saveLabel[1])}</span>
          <button class="btn btn-secondary btn-sm" data-act="toggle-save-state" title="Cycle the save-state contract">${icon("refresh", 14)} Simulate state</button>
        </div>
      </div>
    </div></div>`;

  const docTabs = `<div class="tabs mb-20" role="tablist">
    ${tabs.map(([tid, label, n]) => `<button class="tab" role="tab" data-act="doc-view" data-id="${tid}"
      aria-selected="${docView === tid}">${label}${n !== null ? `<span class="tab-count">${n}</span>` : ""}</button>`).join("")}
  </div>`;

  /* ---- editor ---- */
  if (docView === "editor") {
    const sectionsHTML = {
      "Positioning": `<p class="doc-p">Harbor &amp; Finch supply specialty ingredients to independent kitchens. The identity has to read as <strong>precise and generous</strong> at the same time — a supplier you trust with a signature dish, not a commodity line.</p>
        <p class="doc-p">The wordmark carries the weight. Everything else is a support system that lets the wordmark work at any size, in any medium, without supervision.</p>`,
      "Wordmark": `<p class="doc-p">The wordmark is set in a modified grotesque with a horizontal stress on the ampersand. Two lockups are approved: horizontal for wide formats, stacked for square formats.</p>
        <ul class="doc-list"><li>Horizontal lockup — primary, used wherever width allows</li>
        <li>Stacked lockup — packaging, social avatars, stamps</li>
        <li>Mark only — favicons and physical embossing, minimum 8 mm</li></ul>`,
      "Clear space and minimum size": `<p class="doc-p">Clear space equals the height of the lowercase <strong>h</strong> on all four sides. Nothing enters this field — no rules, no photography edges, no other logos.</p>
        <p class="doc-p">Minimum sizes: 24 px digital, 18 mm print for the horizontal lockup. Below these sizes use the mark only.</p>`,
      "Colour": `<p class="doc-p">The palette is built from a graphite structure with cobalt as a signature. Cobalt is used to identify action and state, never as decoration.</p>
        <table class="doc-table">
          <thead><tr><th>Role</th><th>Hex</th><th>Use</th></tr></thead>
          <tbody>
            <tr><td>Harbor Cobalt</td><td>#2F6FEB</td><td>Primary action, active state</td></tr>
            <tr><td>Graphite</td><td>#14181C</td><td>Primary text, structure</td></tr>
            <tr><td>Bone</td><td>#F4F6F8</td><td>Reversed surfaces</td></tr>
            <tr><td>Signal Green</td><td>#3FA66B</td><td>Approved, complete</td></tr>
          </tbody>
        </table>
        <p class="doc-p">Reversed wordmarks require a background luminance below 45% or a solid scrim at 60% opacity.</p>`,
      "Typography": `<p class="doc-p">One family, Inter, across every application. Hierarchy comes from size and weight, not from additional typefaces.</p>`,
      "Applications": `<p class="doc-p">Packaging, trade stand and stationery applications are shown at working scale. The reversed logo over photography section is still under review.</p>`,
      "Contact": `<p class="doc-p">Direct brand questions to Northlight Studio. Response within one working day.</p>`,
    };

    return {
      active: "documents",
      crumbs: crumb([{ label: "Documents", href: "#/documents" }, { label: cl.name, href: `#/clients/${cl.id}` }, { label: d.title }]),
      body: contextHeader + docTabs,
      flushLayout: `
        <div class="doc-layout">
          <aside class="doc-outline">
            <div class="panel-section-title">Sections</div>
            ${d.sections.map((s, i) => `<button class="outline-item ${i === 0 ? "active" : ""}">${esc(s)}</button>`).join("")}
            <button class="outline-item" style="color:var(--metadata)">${icon("plus", 14)} Add section</button>
            <div class="divider-h" style="margin:16px 0"></div>
            <div class="panel-section-title">Formatting</div>
            <p class="meta" style="line-height:1.6;padding:0 9px">V1 blocks: text, headings, lists, image and a simple table. Nothing else is available by design.</p>
          </aside>

          <div class="doc-body-col">
            <article class="doc-page">
              <div class="eyebrow">${esc(d.type)} · ${esc(cl.name)}</div>
              <h1 class="doc-h1">${esc(d.title)}</h1>
              <p class="meta mt-8">Working draft v${d.workingVersion} · ${esc(workspace.owner)} · last saved ${esc(relative(d.modified))}</p>

              ${d.sections.map((s) => `<section class="doc-section" id="sec-${esc(s.replace(/\s+/g, "-").toLowerCase())}">
                <h2 class="doc-h2">${esc(s)}</h2>
                ${sectionsHTML[s] || '<p class="doc-p">This section is empty. Write the first paragraph.</p>'}
              </section>`).join("")}
            </article>
          </div>

          <aside class="doc-rail">
            <div class="panel-section-title">Current version</div>
            <div class="immutable">
              <div>
                <div class="strong" style="font-size:var(--fs-label)">Working draft v${d.workingVersion}</div>
                <div class="meta">${d.submittedVersion ? `Submitted: v${d.submittedVersion}` : "Never submitted"}</div>
              </div>
            </div>

            <div class="panel-section" >
              <div class="panel-section-title">Internal notes</div>
              <p class="meta" style="line-height:1.6">${d.internalNote ? esc(d.internalNote) : "No internal notes."}</p>
              <p class="meta mt-8" style="color:var(--metadata)">${icon("lock", 12)} Never visible to guests.</p>
            </div>

            ${activeReview ? `<div class="panel-section">
              <div class="panel-section-title">Open review request</div>
              <div class="banner">
                <div class="banner-text">Awaiting ${esc(activeReview.reviewer.name)}
                  <div class="banner-sub">v${activeReview.version} · due ${esc(formatShortDate(activeReview.due))}</div></div>
              </div>
              <button class="btn btn-secondary btn-block mt-12" data-act="open-review" data-id="${activeReview.id}">Inspect request</button>
            </div>` : ""}

            <div class="panel-section">
              <div class="panel-section-title">Client feedback</div>
              ${latest && latest.decision === "changes" ? `<div class="comment">
                <span class="avatar">MV</span>
                <div>
                  <div class="comment-head"><span class="comment-author">Marta Velasco</span><span class="meta">${esc(formatDate(latest.date))}</span></div>
                  <div class="comment-body">We need a wider secondary colour range for the trade-stand work, and the reversed logo needs its own section.</div>
                </div>
              </div>` : `<p class="meta">No client feedback yet.</p>`}
            </div>

            <div class="panel-section">
              <div class="panel-section-title">Actions</div>
              <div class="stack-tight">
                <button class="btn btn-primary btn-block" data-act="open-review-setup" data-id="${proj.id}">${icon("send", 15)} Request review</button>
                <button class="btn btn-secondary btn-block" data-act="doc-view" data-id="preview">${icon("eye", 15)} Preview &amp; export</button>
                <button class="btn btn-secondary btn-block" data-act="doc-view" data-id="history">${icon("history", 15)} Version history</button>
              </div>
              <p class="meta mt-12">Submitting requires a saved draft. Unsaved or failed-save content cannot be submitted.</p>
            </div>
          </aside>
        </div>`,
    };
  }

  /* ---- preview & export ---- */
  if (docView === "preview") {
    return {
      active: "documents",
      crumbs: crumb([{ label: "Documents", href: "#/documents" }, { label: cl.name, href: `#/clients/${cl.id}` }, { label: d.title }, { label: "Preview & export" }]),
      body: contextHeader + docTabs + `
        <div class="split">
          <section class="card">
            <div class="card-head">
              <div class="card-head-text"><div class="card-title">Paginated preview</div>
                <div class="card-desc">Page 1 of 24 · identifies its version on every page.</div></div>
              <div class="row">
                <select class="select" style="max-width:190px"><option>Working draft v${d.workingVersion}</option>
                  ${d.versions.map((v) => `<option>Submitted v${v.n}</option>`).join("")}</select>
              </div>
            </div>
            <div class="card-body" style="background:var(--canvas)">
              <div style="background:var(--surface);border:1px solid var(--divider);border-radius:4px;margin:0 auto;max-width:560px;padding:38px 40px;box-shadow:var(--shadow-overlay)">
                <div class="row-between">
                  <span class="eyebrow" style="margin:0">${esc(d.title)}</span>
                  <span class="meta">v${d.workingVersion} · page 1</span>
                </div>
                <h2 class="mt-16" style="font-size:24px">${esc(d.sections[0])}</h2>
                <p class="doc-p">Harbor &amp; Finch supply specialty ingredients to independent kitchens. The identity has to read as precise and generous at the same time.</p>
                <div class="doc-table" style="margin-top:18px">
                  <div style="background:var(--raised);border:1px solid var(--divider);border-radius:4px;height:120px;display:grid;place-items:center">
                    <span class="meta">Wordmark lockups · image block</span>
                  </div>
                </div>
                <div class="divider-h" style="margin:24px 0 10px"></div>
                <div class="row-between"><span class="meta">${esc(cl.name)}</span><span class="meta">Prepared by ${esc(workspace.owner)}</span></div>
              </div>
            </div>
            <div class="card-foot">
              <div class="banner ok" style="border:0;background:none;padding:0">
                <div class="banner-text">Export ready
                  <div class="banner-sub">The PDF identifies its version. Previewing never counts as sharing.</div></div>
              </div>
            </div>
          </section>

          <div class="stack">
            <section class="card">
              <div class="card-head"><div class="card-head-text"><div class="card-title">Export</div></div></div>
              <div class="card-body stack">
                <div class="field">
                  <label class="field-label">Brand / template</label>
                  <select class="select"><option>Northlight Studio — default</option><option>Client brand override</option></select>
                </div>
                <div class="field">
                  <label class="field-label">Include</label>
                  <div class="stack-tight">
                    <label class="check"><input type="checkbox" checked><span class="check-text">Section outline</span></label>
                    <label class="check"><input type="checkbox" checked><span class="check-text">Version identifier on every page</span></label>
                    <label class="check"><input type="checkbox"><span class="check-text">Internal notes <span class="meta">(never exported by default)</span></span></label>
                  </div>
                </div>
                <button class="btn btn-primary btn-block" data-act="run-export">${icon("download", 15)} Export PDF</button>
                <div class="banner" data-export-progress hidden>
                  <div class="banner-text">Rendering PDF…<div class="banner-sub" data-export-detail>Preparing 24 pages</div>
                    <div class="progress-track mt-8"><div class="progress-fill" style="width:0%"></div></div></div>
                </div>
              </div>
            </section>

            <section class="card">
              <div class="card-head"><div class="card-head-text"><div class="card-title">Next step</div></div></div>
              <div class="card-body">
                <p class="meta" style="line-height:1.6">Previewing is not sharing. To let the client decide, open Review &amp; share setup and grant access to one exact version.</p>
                <button class="btn btn-primary btn-block mt-12" data-act="open-review-setup" data-id="${proj.id}">${icon("send", 15)} Request review</button>
              </div>
            </section>
          </div>
        </div>`,
    };
  }

  /* ---- version history ---- */
  return {
    active: "documents",
    crumbs: crumb([{ label: "Documents", href: "#/documents" }, { label: cl.name, href: `#/clients/${cl.id}` }, { label: d.title }, { label: "Version history" }]),
    body: contextHeader + docTabs + `
      <div class="split">
        <section class="card">
          <div class="card-head">
            <div class="card-head-text"><div class="card-title">Submitted versions</div>
              <div class="card-desc">Numbered, immutable, and never overwritten. A new draft copies forward from any version.</div></div>
          </div>
          <div class="card-body flush">
            ${d.versions.length === 0
              ? emptyState({ iconName: "history", title: "No submitted version", text: "This document has never been submitted for review. Submitting freezes a numbered version." })
              : `<div class="stack" style="gap:0">
                  <div class="version current">
                    <span class="version-mark">v${d.workingVersion}</span>
                    <div>
                      <div class="version-title">Working draft v${d.workingVersion} <span class="chip accent" style="margin-left:6px">Current</span></div>
                      <div class="version-meta">Editable · based on v${d.submittedVersion || d.workingVersion - 1} · last saved ${esc(relative(d.modified))}</div>
                    </div>
                    <div class="item-side"><button class="btn btn-secondary btn-sm" data-act="doc-view" data-id="editor">Open editor</button></div>
                  </div>
                  ${d.versions.map((v) => {
                    const rv = reviews.find((r) => r.documentId === d.id && r.version === v.n);
                    const state = rv ? rv.state : (v.decision === "approved" ? "approved" : v.decision === "changes" ? "changes-requested" : "superseded");
                    const deliveredTo = deliveries.filter((dl) => dl.projectId === d.projectId && dl.files.some((f) => f.name.toLowerCase().includes(d.title.split(" ")[0].toLowerCase())));
                    return `<div class="version">
                      <span class="version-mark">v${v.n}</span>
                      <div>
                        <div class="version-title">${esc(v.label)} ${chip(state)}</div>
                        <div class="version-meta">${esc(v.author)} · ${esc(formatDate(v.date))} · ${esc(v.note)}</div>
                        ${rv && rv.comments.length ? `<div class="comment" style="padding-bottom:0">
                          <span class="avatar">${esc(initials(rv.comments[0].author))}</span>
                          <div><div class="comment-head"><span class="comment-author">${esc(rv.comments[0].author)}</span>
                            <span class="meta">${esc(formatDate(rv.comments[0].date))}</span></div>
                            <div class="comment-body">${esc(rv.comments[0].body)}</div></div>
                        </div>` : ""}
                        ${deliveredTo.length ? `<div class="row mt-8" style="gap:6px">
                          ${icon("package", 13)}<span class="meta">Referenced by delivery package “${esc(deliveredTo[0].title)}”</span>
                        </div>` : ""}
                      </div>
                      <div class="item-side">
                        <button class="btn btn-secondary btn-sm" data-act="copy-to-draft" data-id="${v.n}">Copy to new draft</button>
                        <button class="btn btn-ghost btn-sm" data-act="inspect-version" data-id="${v.n}">Inspect</button>
                      </div>
                    </div>`;
                  }).join("")}
                </div>`}
          </div>
        </section>

        <div class="stack">
          <section class="card">
            <div class="card-head"><div class="card-head-text"><div class="card-title">Version rules</div></div></div>
            <div class="card-body">
              <ul class="doc-list" style="margin-top:0">
                <li>A submitted version is never overwritten.</li>
                <li>Approving a stale or withdrawn request is rejected.</li>
                <li>Repeated submit clicks do not duplicate events.</li>
                <li>Every event records actor, time, version and outcome.</li>
              </ul>
            </div>
          </section>
          <section class="card">
            <div class="card-head"><div class="card-head-text"><div class="card-title">This document</div></div></div>
            <div class="card-body">
              <div class="defs">
                <div class="def"><span class="def-key">Type</span><span class="def-val">${esc(d.type)}</span></div>
                <div class="def"><span class="def-key">Visibility</span><span class="def-val">${chip(d.visibility)}</span></div>
                <div class="def"><span class="def-key">Reviewer</span><span class="def-val">${d.reviewer ? esc(d.reviewer) : "Not designated"}</span></div>
                <div class="def"><span class="def-key">Versions</span><span class="def-val">${d.versions.length} submitted</span></div>
              </div>
            </div>
          </section>
        </div>
      </div>`,
  };
}

/* -------------------------------------------------------------------------- */
/* W04 · Activity                                                              */
/* -------------------------------------------------------------------------- */

const EVENT_ICON = { feedback: "message", approved: "checkCircle", changes: "undo", delivered: "package", waiting: "clock" };

function renderActivity() {
  const body = `
    ${pageHead({
      eyebrow: "Record",
      title: "Activity",
      sub: "Review requests, feedback, approvals and delivery events. Reading an event does not resolve the work it refers to.",
      actions: `<button class="btn btn-secondary" data-act="mark-all-read">${icon("check", 15)} Mark all read</button>`,
    })}

    <div class="row row-wrap mb-16">
      <div class="segmented">
        <button aria-pressed="true">Unread (${unreadCount()})</button>
        <button>All (${activity.length})</button>
      </div>
      <span class="grow"></span>
      <select class="select" style="max-width:220px">
        <option>All clients</option><option>Harbor &amp; Finch</option><option>Verity Health</option><option>Lumen Architects</option>
      </select>
    </div>

    <div class="split">
      <section class="card">
        <div class="card-body flush timeline">
          ${activity.map((e) => `
            <div class="event ${e.tone} ${e.read ? "" : "unread"}">
              <span class="event-mark">${icon(EVENT_ICON[e.type] || "activity", 14)}</span>
              <div>
                <div class="event-title"><span class="actor">${esc(e.actor)}</span> ${esc(e.title)}</div>
                <div class="event-meta">
                  <span>${esc(formatDate(e.date))} · ${esc(formatTime(e.date))}</span>
                  <span>·</span>
                  <a href="${e.target.href}">${esc(e.target.label)}</a>
                  ${!e.read ? '· <span class="chip accent">Unread</span>' : ""}
                </div>
                <div class="meta mt-8" style="line-height:1.6">${esc(e.resolves)}</div>
                <div class="row mt-12">
                  <a class="btn btn-secondary btn-sm" href="${e.target.href}">${icon("external", 14)} Open source</a>
                  ${!e.read ? `<button class="btn btn-ghost btn-sm" data-act="mark-read" data-id="${e.id}">Mark read</button>` : ""}
                </div>
              </div>
            </div>`).join("")}
        </div>
      </section>

      <div class="stack">
        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Why this matters</div></div></div>
          <div class="card-body">
            <p class="meta" style="line-height:1.65">A comment is not a decision. Activity shows what happened; the review request holds what is still owed.</p>
            <div class="defs mt-12">
              <div class="def"><span class="def-key">Waiting</span><span class="def-val">${reviews.filter((r) => r.state === "waiting").length} reviews</span></div>
              <div class="def"><span class="def-key">Changes owed</span><span class="def-val">${reviews.filter((r) => r.state === "changes-requested").length} documents</span></div>
              <div class="def"><span class="def-key">Acknowledgments</span><span class="def-val">${deliveries.filter((d) => d.acknowledgedOn).length} of ${deliveries.length} deliveries</span></div>
            </div>
          </div>
        </section>
        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Unavailable target</div>
            <div class="card-desc">If a linked record was deleted or access was revoked, the event stays with a recovery route.</div></div></div>
          <div class="card-body">
            ${banner("Delivery for Gallery wayfinding is no longer available to its recipient.", "Access was revoked on 15 Aug 2026. The record itself is intact.", "bad",
              `<button class="btn btn-secondary btn-sm" data-act="retry">Retry</button>`)}
          </div>
        </section>
      </div>
    </div>`;

  return { active: "activity", crumbs: crumb([{ label: "Activity" }]), body };
}

/* -------------------------------------------------------------------------- */
/* W05 · Archive                                                               */
/* -------------------------------------------------------------------------- */

function renderArchive() {
  const archivedClients = clients.filter((c) => c.state === "archived");
  const body = `
    ${pageHead({
      eyebrow: "Record",
      title: "Archive",
      sub: "Archived records are read-only and keep their prior context. Restoring is owner-only, and access revocation is always separate.",
    })}

    <div class="row row-wrap mb-16">
      <input class="input" style="max-width:300px" placeholder="Search the archive…">
      <select class="select" style="max-width:200px"><option>All record types</option><option>Clients</option><option>Projects</option><option>Documents</option></select>
      <span class="grow"></span>
      <span class="meta">${archivedClients.length} archived record${archivedClients.length === 1 ? "" : "s"}</span>
    </div>

    ${archivedClients.length === 0
      ? `<div class="card">${emptyState({ iconName: "archive", title: "Nothing archived", text: "Archived clients, projects and documents appear here with the date they were archived and their prior context." })}</div>`
      : archivedClients.map((c) => `<section class="card mb-16">
          <div class="card-head">
            <div class="card-head-text">
              <div class="card-title">${esc(c.name)}</div>
              <div class="card-desc">Client relationship · archived ${esc(formatDate(c.archivedOn))}</div>
            </div>
            ${chip("archived")}
          </div>
          <div class="card-body">
            <div class="defs">
              <div class="def"><span class="def-key">Primary contact</span><span class="def-val">${esc(c.contact.name)} · ${esc(c.contact.email)}</span></div>
              <div class="def"><span class="def-key">Projects</span><span class="def-val">${c.projectIds.length} on record (retained)</span></div>
              <div class="def"><span class="def-key">Last activity</span><span class="def-val">${esc(formatDate(c.lastActivity))}</span></div>
              <div class="def"><span class="def-key">Guest access</span><span class="def-val">${grants.filter((g) => g.recipient.email === c.contact.email).length === 0 ? '<span class="meta">No grants on record</span>' : "Grants remain as recorded — revocation is separate from archiving"}</span></div>
            </div>
            <div class="banner mt-16">
              <div class="banner-text">Restore conflict check
                <div class="banner-sub">If a record with the same name was created after archiving, restore asks you to confirm which one keeps the name.</div></div>
            </div>
          </div>
          <div class="card-foot row-between">
            <span class="meta">Read-only · history is intact</span>
            <div class="row">
              <button class="btn btn-secondary btn-sm" data-act="inspect-archive" data-id="${c.id}">Inspect history</button>
              <button class="btn btn-primary btn-sm" data-act="restore-client" data-id="${c.id}">${icon("undo", 14)} Restore</button>
            </div>
          </div>
        </section>`).join("")}`;

  return { active: "archive", crumbs: crumb([{ label: "Archive" }]), body };
}

/* -------------------------------------------------------------------------- */
/* S01-S03 · Settings                                                          */
/* -------------------------------------------------------------------------- */

let settingsTab = "account";

function renderSettings(section) {
  if (section) settingsTab = section;
  const tabs = [["account", "Account & workspace"], ["defaults", "Professional defaults"], ["access", "Client access"]];

  let body2 = "";

  if (settingsTab === "account") {
    body2 = `<div class="split">
      <div class="stack">
        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Your account</div>
            <div class="card-desc">V1 has exactly one owner. Member management arrives with team seats.</div></div></div>
          <div class="card-body">
            <div class="grid grid-2">
              <div class="field"><label class="field-label">Full name</label><input class="input" value="${esc(workspace.owner)}"></div>
              <div class="field"><label class="field-label">Email</label><input class="input" value="${esc(workspace.email)}"></div>
            </div>
            <div class="field mt-16"><label class="field-label">Password</label>
              <div class="row"><input class="input" type="password" value="••••••••••••" style="max-width:260px">
                <button class="btn btn-secondary">Change</button></div>
              <span class="field-hint">Changing your password signs out other sessions.</span>
            </div>
            <div class="field mt-16"><label class="field-label">Active session</label>
              <div class="service-row">This device · ${esc(workspace.timezone)} <span class="meta">Last active now</span></div>
            </div>
            <div class="row mt-20">
              <button class="btn btn-primary" data-act="save-settings">Save changes</button>
              <button class="btn btn-secondary" data-act="sign-out">Sign out</button>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Workspace</div></div></div>
          <div class="card-body">
            <div class="grid grid-2">
              <div class="field"><label class="field-label">Workspace name</label><input class="input" value="${esc(workspace.name)}"></div>
              <div class="field"><label class="field-label">Timezone</label>
                <select class="select"><option>${esc(workspace.timezone)}</option><option>Europe/London (GMT+1)</option><option>America/New_York (GMT-4)</option></select></div>
            </div>
            <div class="panel-section">
              <div class="panel-section-title">Notifications</div>
              <div class="stack-tight">
                <label class="check"><input type="checkbox" checked><span class="check-text">Tell me when a review is decided</span></label>
                <label class="check"><input type="checkbox" checked><span class="check-text">Tell me when a guest downloads a delivered file</span></label>
                <label class="check"><input type="checkbox"><span class="check-text">Weekly summary of open work</span></label>
              </div>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Your data</div>
            <div class="card-desc">Offline-first: the workspace lives on this machine. Export and deletion are owner actions.</div></div></div>
          <div class="card-body">
            <div class="defs">
              <div class="def"><span class="def-key">Storage</span><span class="def-val">Local database · last backup today 08:12</span></div>
              <div class="def"><span class="def-key">Data location</span><span class="def-val">%~/CoreDesk/workspace.db</span></div>
            </div>
            <div class="row mt-16 row-wrap">
              <button class="btn btn-secondary" data-act="export-data">${icon("download", 15)} Request data export</button>
              <button class="btn btn-danger" data-act="delete-data">${icon("trash", 15)} Request deletion</button>
            </div>
            <div class="row mt-20" style="gap:16px">
              <a href="#/terms">Terms</a><a href="#/privacy">Privacy</a>
            </div>
          </div>
        </section>
      </div>

      <div class="stack">
        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Appearance</div>
            <div class="card-desc">Graphite structure with cobalt as a signature. Both themes ship.</div></div></div>
          <div class="card-body">
            <div class="grid grid-2">
              <button class="option selected" data-act="set-theme" data-id="dark">
                <span class="radio-mark"></span>
                <span><span class="option-title">Precision dark</span>
                  <span class="option-sub">Graphite canvas #0B0D0F. The canonical workspace.</span></span>
              </button>
              <button class="option" data-act="set-theme" data-id="light">
                <span class="radio-mark"></span>
                <span><span class="option-title">Precision light</span>
                  <span class="option-sub">Derived inversion, cobalt held constant.</span></span>
              </button>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Design rules in force</div>
            <div class="card-desc">From the Foundations frame. These are constraints, not preferences.</div></div></div>
          <div class="card-body">
            <div class="stack-tight">
              ${["No glow or glassmorphism", "No bright-outline buttons", "No gradient cards", "No pill-heavy navigation",
                 "Use dividers, rails and work surfaces", "Primary controls: 40–44 px"].map((r) => `
                <div class="row" style="gap:9px">${icon("check", 15)}<span style="font-size:var(--fs-label)">${esc(r)}</span></div>`).join("")}
            </div>
          </div>
        </section>
      </div>
    </div>`;
  }

  if (settingsTab === "defaults") {
    body2 = `<div class="split">
      <div class="stack">
        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Business identity</div>
            <div class="card-desc">Applies to new documents only. Historical versions stay exactly as submitted.</div></div></div>
          <div class="card-body">
            <div class="grid grid-2">
              <div class="field"><label class="field-label">Business name</label><input class="input" value="${esc(workspace.name)}"></div>
              <div class="field"><label class="field-label">Contact email</label><input class="input" value="${esc(workspace.email)}"></div>
              <div class="field"><label class="field-label">Website</label><input class="input" value="northlight.studio"></div>
              <div class="field"><label class="field-label">Registration / VAT</label><input class="input" placeholder="Optional"></div>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Services and default fee items</div>
            <div class="card-desc">Used to pre-fill proposals. Editable per document.</div></div>
            <button class="btn btn-secondary btn-sm" data-act="add-fee-item">${icon("plus", 14)} Add item</button></div>
          <div class="card-body flush">
            ${[["Brand identity system", "Fixed fee", "€ 12,400"], ["Website design", "Fixed fee", "€ 9,800"],
               ["Design system", "Day rate", "€ 780 / day"], ["Consultation", "Hourly", "€ 120 / hour"]].map(([n, k, v]) => `
              <div class="item-row">
                <div class="item-main"><div class="item-title">${esc(n)}</div><div class="item-sub">${esc(k)}</div></div>
                <div class="item-side"><span class="strong num">${esc(v)}</span></div>
                <div class="item-actions"><button class="icon-btn" data-act="edit-fee-item">${icon("edit", 15)}</button></div>
              </div>`).join("")}
          </div>
        </section>

        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Document branding</div></div></div>
          <div class="card-body">
            <div class="grid grid-2">
              <div>
                <div class="panel-section-title">Logo</div>
                <div style="border:1px dashed var(--edge);border-radius:var(--r-control);display:grid;place-items:center;height:110px">
                  <span class="meta">logo-primary.svg · click to replace</span>
                </div>
              </div>
              <div>
                <div class="panel-section-title">Document accent</div>
                <div class="row row-wrap">
                  ${["#2F6FEB", "#3FA66B", "#D49A3A", "#14181C"].map((h, i) => `
                    <button class="option ${i === 0 ? "selected" : ""}" style="width:auto;padding:8px" data-act="pick-accent">
                      <span style="background:${h};border-radius:4px;height:26px;width:26px;display:inline-block;border:1px solid var(--divider)"></span>
                    </button>`).join("")}
                </div>
                <div class="field mt-16">
                  <label class="field-label">Proposal defaults</label>
                  <div class="stack-tight">
                    <label class="check"><input type="checkbox" checked><span class="check-text">Include fee table</span></label>
                    <label class="check"><input type="checkbox" checked><span class="check-text">Include assumptions section</span></label>
                    <label class="check"><input type="checkbox"><span class="check-text">Include payment terms page</span></label>
                  </div>
                </div>
              </div>
            </div>
            <div class="row mt-20">
              <button class="btn btn-primary" data-act="save-settings">Save defaults</button>
              <button class="btn btn-secondary" data-act="preview-defaults">${icon("eye", 15)} Preview on a document</button>
              <button class="btn btn-ghost" data-act="restore-defaults">Restore defaults</button>
            </div>
          </div>
        </section>
      </div>

      <div class="stack">
        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Live preview</div>
            <div class="card-desc">A proposal cover with current defaults.</div></div></div>
          <div class="card-body">
            <div style="background:var(--surface);border:1px solid var(--divider);border-radius:4px;padding:22px">
              <div class="row-between">
                <span class="brand-mark">CD</span><span class="meta">${esc(formatDate("2026-09-10"))}</span>
              </div>
              <h3 class="mt-20">Proposal</h3>
              <p class="meta mt-4">Onboarding redesign · Verity Health</p>
              <div class="divider-h" style="margin:18px 0"></div>
              <div class="meta" style="line-height:1.7">
                Prepared by ${esc(workspace.owner)}<br>${esc(workspace.name)}<br>${esc(workspace.email)}
              </div>
              <div style="border-top:3px solid var(--accent);margin-top:18px;padding-top:10px">
                <span class="meta">Fee table · 3 milestones</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>`;
  }

  if (settingsTab === "access") {
    body2 = `
      ${banner(
        "<strong>Access is granted per object, never per relationship.</strong> A client contact with no grant sees nothing.",
        "An invitation never gives workspace-wide access, and no grant is inherited by sibling projects or documents.",
        "",
        `<button class="btn btn-primary btn-sm" data-act="invite-contact">${icon("mail", 14)} Invite recipient</button>`
      )}

      <div class="card mt-16">
        <div class="card-head"><div class="card-head-text"><div class="card-title">Access grants</div>
          <div class="card-desc">Recipient + object + permissions + expiry. Revoking is immediate and separate from archiving.</div></div>
          <div class="segmented">
            <button aria-pressed="true">All (${grants.length})</button><button>Active (${grants.filter((g) => g.state === "active").length})</button>
            <button>Pending (${grants.filter((g) => g.state === "pending").length})</button>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data">
            <thead><tr><th>Recipient</th><th>Role</th><th>Object</th><th>Permissions</th><th>Invited</th><th>Last activity</th><th>State</th><th></th></tr></thead>
            <tbody>
              ${grants.map((g) => `<tr>
                <td><div class="row"><span class="avatar">${esc(initials(g.recipient.name))}</span>
                  <div><div class="cell-primary">${esc(g.recipient.name)}</div><div class="cell-sub">${esc(g.recipient.email)}</div></div></div></td>
                <td>${esc(g.role)}</td>
                <td><div>${esc(g.object)}</div><div class="cell-sub">${esc(g.objectType)}</div></td>
                <td><span class="meta">${g.permissions.length} permission${g.permissions.length === 1 ? "" : "s"}</span></td>
                <td class="num"><span class="meta">${esc(formatShortDate(g.invited))}</span></td>
                <td class="num"><span class="meta">${g.lastActivity ? esc(relative(g.lastActivity)) : "Never"}</span></td>
                <td>${chip(g.state)}</td>
                <td class="cell-actions">
                  ${g.state === "active" || g.state === "pending"
                    ? `<button class="btn btn-ghost btn-sm" data-act="revoke-grant" data-id="${g.id}">Revoke</button>` : ""}
                  ${g.state === "expired" || g.state === "revoked"
                    ? `<button class="btn btn-secondary btn-sm" data-act="resend-invite" data-id="${g.id}">Re-invite</button>` : ""}
                </td>
              </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid grid-3 mt-16">
        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Guest reviewer</div>
            <div class="card-desc">Can read the granted version, comment, and decide — only when designated.</div></div></div>
          <div class="card-body stack-tight">
            ${["Read granted version", "Comment", "Approve or request changes", "Download permitted files"].map((p) => `
              <div class="row" style="gap:9px">${icon("check", 15)}<span style="font-size:var(--fs-label)">${esc(p)}</span></div>`).join("")}
            <div class="divider-h" style="margin:12px 0"></div>
            ${["Cannot see internal notes", "Cannot search the workspace", "Cannot edit drafts", "Cannot invite others"].map((p) => `
              <div class="row" style="gap:9px;color:var(--metadata)">${icon("close", 15)}<span style="font-size:var(--fs-label)">${esc(p)}</span></div>`).join("")}
          </div>
        </section>

        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Guest viewer</div>
            <div class="card-desc">Reads and downloads granted content. Cannot approve or manage access.</div></div></div>
          <div class="card-body">
            ${banner("Tomas Reiner holds viewer access on the shared project summary.", "It expired on 16 Aug. Re-inviting creates a new grant rather than reviving the old one.", "", "")}
          </div>
        </section>

        <section class="card">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Access lifecycle</div></div></div>
          <div class="card-body">
            <div class="row row-wrap" style="gap:8px">
              ${chip("neutral", "Invited")}${icon("chevronRight", 14)}${chip("active", "Verified")}${icon("chevronRight", 14)}${chip("neutral", "Expired")}${icon("chevronRight", 14)}${chip("revoked")}
            </div>
            <div class="defs mt-16">
              <div class="def"><span class="def-key">Preview parity</span><span class="def-val">Owner preview uses the real guest surface, not a mock</span></div>
              <div class="def"><span class="def-key">Wrong account</span><span class="def-val">Identity can be switched without revealing content</span></div>
              <div class="def"><span class="def-key">Revoked link</span><span class="def-val">Shows a clear unavailable state, never a broken page</span></div>
            </div>
          </div>
        </section>
      </div>`;
  }

  const body = `
    ${pageHead({
      eyebrow: "Workspace",
      title: "Settings",
      sub: "One owner, one workspace. Everything a guest can reach is controlled here.",
    })}
    <div class="tabs mb-20" role="tablist">
      ${tabs.map(([id, label]) => `<button class="tab" role="tab" data-act="settings-tab" data-id="${id}"
        aria-selected="${settingsTab === id}">${label}</button>`).join("")}
    </div>
    ${body2}`;

  return { active: "settings", crumbs: crumb([{ label: "Settings" }]), body };
}

/* -------------------------------------------------------------------------- */
/* UI states board — the shared V1 state contract made visible                 */
/* -------------------------------------------------------------------------- */

function renderStates() {
  const body = `
    ${pageHead({
      eyebrow: "Design review",
      title: "State contract",
      sub: "From the page inventory: every surface covers loading, empty, failure/retry, unauthorized and unavailable records. Editing covers dirty / saving / failed save. These are the states, rendered.",
    })}

    <div class="grid grid-2">
      <section class="card">
        <div class="card-head"><div class="card-head-text"><div class="card-title">Loading</div>
          <div class="card-desc">Skeleton rows hold the real column rhythm, so nothing jumps when data lands.</div></div></div>
        <div class="card-body flush">${skeletonTable(4)}</div>
      </section>

      <section class="card">
        <div class="card-head"><div class="card-head-text"><div class="card-title">Empty — first run</div>
          <div class="card-desc">Names the first useful action instead of describing the absence.</div></div></div>
        <div class="card-body flush">${emptyState({
          iconName: "clients", title: "No clients yet",
          text: "Start with a client. Projects, documents and reviews all belong to a client relationship.",
          primary: { label: "Add your first client", act: "new-client" },
        })}</div>
      </section>

      <section class="card">
        <div class="card-head"><div class="card-head-text"><div class="card-title">Empty — filter</div>
          <div class="card-desc">A filtered empty is not a first run. It offers the way back.</div></div></div>
        <div class="card-body flush">${emptyState({
          iconName: "filter", title: "No overdue documents",
          text: "Five documents exist, none matching this filter.",
          secondary: { label: "Clear filter", act: "clear-filter" },
        })}</div>
      </section>

      <section class="card">
        <div class="card-head"><div class="card-head-text"><div class="card-title">Failure with retry</div>
          <div class="card-desc">States what happened, what is safe, and what to do next.</div></div></div>
        <div class="card-body flush">${errorState()}</div>
      </section>

      <section class="card">
        <div class="card-head"><div class="card-head-text"><div class="card-title">Partial failure</div>
          <div class="card-desc">Part of the page loaded. Working regions stay usable.</div></div></div>
        <div class="card-body">${banner(
          "Activity could not be refreshed.",
          "Tasks, documents and reviews are current as of 09:18.",
          "bad",
          `<button class="btn btn-secondary btn-sm" data-act="retry">Retry</button>`
        )}</div>
      </section>

      <section class="card">
        <div class="card-head"><div class="card-head-text"><div class="card-title">Unauthorized</div>
          <div class="card-desc">The record may exist. This identity may not see it.</div></div></div>
        <div class="card-body flush">${emptyState({
          iconName: "lock", title: "You do not have access to this record",
          text: "The link is valid but this account was never granted access to it. Ask the workspace owner for a new invitation.",
          secondary: { label: "Return to your work", act: "go-home" },
        })}</div>
      </section>

      <section class="card">
        <div class="card-head"><div class="card-head-text"><div class="card-title">Unavailable record</div>
          <div class="card-desc">The target was archived, deleted or revoked. The reference stays honest.</div></div></div>
        <div class="card-body flush">${emptyState({
          iconName: "archive", title: "This delivery is no longer available",
          text: "Access was revoked on 15 Aug 2026. If you still need these files, request renewed access.",
          tone: "blocked",
          secondary: { label: "Request renewed access", act: "request-access" },
        })}</div>
      </section>

      <section class="card">
        <div class="card-head"><div class="card-head-text"><div class="card-title">Editing states</div>
          <div class="card-desc">Dirty, saving, saved and failed save. A failed save retains your input.</div></div></div>
        <div class="card-body stack">
          <div class="row row-wrap" style="gap:22px">
            <span class="save-state dirty"><span class="dot"></span>Unsaved changes</span>
            <span class="save-state saving"><span class="dot"></span>Saving…</span>
            <span class="save-state saved"><span class="dot"></span>All changes saved</span>
          </div>
          ${banner("Save failed — your text is kept.",
            "The workspace could not write to the local database. Nothing was lost; retry when ready.",
            "bad",
            `<button class="btn btn-secondary btn-sm" data-act="retry">Retry save</button>`)}
        </div>
      </section>

      <section class="card">
        <div class="card-head"><div class="card-head-text"><div class="card-title">Blocked action</div>
          <div class="card-desc">Disabled controls state the unblocking condition instead of silently doing nothing.</div></div></div>
        <div class="card-body">
          <button class="btn btn-primary" aria-disabled="true" disabled>Share package</button>
          <p class="meta mt-12">Blocked: Brand guidelines v3 has no approved version. Approve or replace it to continue.</p>
        </div>
      </section>

      <section class="card">
        <div class="card-head"><div class="card-head-text"><div class="card-title">Destructive naming</div>
          <div class="card-desc">Destructive actions name the affected record and offer restore.</div></div></div>
        <div class="card-body">
          <div class="banner bad">
            <div class="banner-text">Archive <strong>Harbor &amp; Finch</strong>, 2 projects, 5 documents?
              <div class="banner-sub">History is retained and read-only. Guest access is not revoked by archiving.</div></div>
          </div>
          <div class="row mt-12"><button class="btn btn-secondary">Cancel</button>
            <button class="btn btn-danger">Archive client</button></div>
        </div>
      </section>

      <section class="card">
        <div class="card-head"><div class="card-head-text"><div class="card-title">Progress</div>
          <div class="card-desc">Every loading operation shows progress, including background work.</div></div></div>
        <div class="card-body stack">
          <div class="progress"><div class="progress-track"><div class="progress-fill" style="width:64%"></div></div>
            <span class="progress-label">Exporting 16 of 24 pages</span></div>
          <div class="progress"><div class="progress-track"><div class="progress-fill" style="width:100%"></div></div>
            <span class="progress-label">Upload complete</span></div>
          <div class="progress"><div class="progress-track"><div class="progress-fill ok" style="width:100%"></div></div>
            <span class="progress-label">All checks passed</span></div>
        </div>
      </section>

      <section class="card">
        <div class="card-head"><div class="card-head-text"><div class="card-title">Component tokens</div>
          <div class="card-desc">Every value read from the Foundations frame, not estimated.</div></div></div>
        <div class="card-body">
          <div class="stack-tight">
            ${[["Canvas", "--canvas", "#0B0D0F"], ["Sidebar", "--sidebar", "#0F1215"], ["Surface", "--surface", "#12161A"],
               ["Raised", "--raised", "#171C21"], ["Divider", "--divider", "#262C33"], ["CoreDesk blue", "--accent", "#2F6FEB"],
               ["Primary text", "--text", "#F4F6F8"], ["Muted", "--muted", "#A8B0BA"], ["Active", "--active", "#3FA66B"],
               ["Waiting", "--waiting", "#D49A3A"], ["At risk", "--risk", "#D65A5A"]].map(([n, v, h]) => `
              <div class="row-between" style="border-bottom:1px solid var(--divider);padding:8px 0">
                <div class="row"><span style="background:${h};border:1px solid var(--divider);border-radius:4px;height:18px;width:18px;display:inline-block"></span>
                  <span style="font-size:var(--fs-label)">${esc(n)}</span></div>
                <span class="meta num">${esc(h)} · var(${esc(v)})</span>
              </div>`).join("")}
          </div>
          <div class="defs mt-16">
            <div class="def"><span class="def-key">Card radius</span><span class="def-val">9 px</span></div>
            <div class="def"><span class="def-key">Control radius</span><span class="def-val">7 px</span></div>
            <div class="def"><span class="def-key">Primary control</span><span class="def-val">40–44 px height</span></div>
            <div class="def"><span class="def-key">Type family</span><span class="def-val">Inter — 30 / 20 / 16 / 14 / 13 / 12</span></div>
          </div>
        </div>
      </section>
    </div>`;

  return { active: null, crumbs: crumb([{ label: "Design review" }, { label: "State contract" }]), body };
}

/* -------------------------------------------------------------------------- */
/* Flows — P01 create, D05 share, A01-A06 auth, G01-G04 guest                  */
/* -------------------------------------------------------------------------- */

let createStep = 1;
let createDraft = { clientId: "cl-harbor", name: "", outcome: "", brief: "", startDate: "", dueDate: "" };
let shareDraft = { documentId: "doc-guidelines", version: 4, recipient: "", role: "Guest reviewer", due: "", note: "", permissions: true };

const CREATE_STEPS = ["Client", "Brief & scope", "Dates", "Summary"];

function renderCreateProject() {
  const pickedClient = client(createDraft.clientId);
  const stepsHTML = `<div class="steps">
    ${CREATE_STEPS.map((s, i) => `<div class="step ${i + 1 < createStep ? "done" : i + 1 === createStep ? "current" : ""}">
      <div class="step-bar"></div><div class="step-label">${i + 1}. ${s}</div></div>`).join("")}
  </div>`;

  let stepBody = "";
  if (createStep === 1) {
    stepBody = `
      <div class="field">
        <label class="field-label">Which client is this project for?</label>
        <span class="field-hint">A project always belongs to exactly one client.</span>
      </div>
      <div class="stack-tight mt-12">
        ${clients.filter((c) => c.state !== "archived").map((c) => `
          <button class="option ${createDraft.clientId === c.id ? "selected" : ""}" data-act="create-pick-client" data-id="${c.id}">
            <span class="radio-mark"></span>
            <span><span class="option-title">${esc(c.name)}</span>
              <span class="option-sub">${esc(c.contact.name)} · ${c.activeProjects} active project${c.activeProjects === 1 ? "" : "s"}</span></span>
          </button>`).join("")}
        <button class="option" data-act="create-new-client">
          <span class="radio-mark"></span>
          <span><span class="option-title">+ Add a new client</span>
            <span class="option-sub">Creates the client first, then returns here with it selected.</span></span>
        </button>
      </div>`;
  } else if (createStep === 2) {
    stepBody = `
      <div class="field">
        <label class="field-label" for="cp-name">Project name</label>
        <input class="input" id="cp-name" data-field="name" value="${esc(createDraft.name)}" placeholder="Brand identity system">
        ${!createDraft.name ? `<span class="field-error">A project needs a name before it can be saved as a draft.</span>` : ""}
      </div>
      <div class="field mt-16">
        <label class="field-label" for="cp-outcome">Outcome — what exists at the end?</label>
        <input class="input" id="cp-outcome" data-field="outcome" value="${esc(createDraft.outcome)}" placeholder="A complete identity system the team can apply without asking us.">
      </div>
      <div class="field mt-16">
        <label class="field-label" for="cp-brief">Brief</label>
        <textarea class="textarea" id="cp-brief" data-field="brief" placeholder="Context, constraints and what success looks like.">${esc(createDraft.brief)}</textarea>
      </div>
      <div class="banner mt-16">
        <div class="banner-text">Scope can be refined later
          <div class="banner-sub">Recording scope acceptance happens on the project Overview tab, so the accepted version is dated and attributed.</div></div>
      </div>`;
  } else if (createStep === 3) {
    stepBody = `
      <div class="grid grid-2">
        <div class="field">
          <label class="field-label" for="cp-start">Start date</label>
          <input class="input" id="cp-start" type="date" data-field="startDate" value="${esc(createDraft.startDate)}">
        </div>
        <div class="field">
          <label class="field-label" for="cp-due">Target delivery</label>
          <input class="input" id="cp-due" type="date" data-field="dueDate" value="${esc(createDraft.dueDate)}">
        </div>
      </div>
      <div class="banner mt-16">
        <div class="banner-text">Dates are commitments, not estimates
          <div class="banner-sub">Changing a date after scope acceptance is logged as a change.</div></div>
      </div>`;
  } else {
    stepBody = `
      <div class="summary">
        <div class="defs">
          <div class="def"><span class="def-key">Client</span><span class="def-val">${esc(pickedClient.name)}</span></div>
          <div class="def"><span class="def-key">Project</span><span class="def-val">${esc(createDraft.name || '<span class="mark-risk">Not yet named</span>')}</span></div>
          <div class="def"><span class="def-key">Outcome</span><span class="def-val">${esc(createDraft.outcome || "—")}</span></div>
          <div class="def"><span class="def-key">Starts</span><span class="def-val">${createDraft.startDate ? esc(formatDate(createDraft.startDate)) : "Not set"}</span></div>
          <div class="def"><span class="def-key">Target</span><span class="def-val">${createDraft.dueDate ? esc(formatDate(createDraft.dueDate)) : "Not set"}</span></div>
          <div class="def"><span class="def-key">Scope</span><span class="def-val">${chip("waiting", "Not yet accepted")}</span></div>
        </div>
      </div>
      <div class="banner mt-16">
        <div class="banner-text">What happens next
          <div class="banner-sub">The project opens on its Overview tab. You can add tasks, create a brief document and request a review from there. Nothing is shared with the client by creating a project.</div></div>
      </div>`;
  }

  return `
    <div class="guest-wrap narrow">
      <a class="btn btn-ghost btn-sm" href="#/projects" style="margin-bottom:18px">${icon("arrowLeft", 15)} Back to projects</a>
      <div class="eyebrow">New project · ${createStep} of ${CREATE_STEPS.length}</div>
      <h1>${createStep === 1 ? "Who is this for?" : createStep === CREATE_STEPS.length ? "Review and create" : "Define the engagement"}</h1>
      <p class="page-sub mt-8">A project needs a client, a brief and dates. Until then it stays a draft and cannot be shared.</p>
      <div class="mt-24">${stepsHTML}</div>
      <div class="card"><div class="card-body">${stepBody}</div>
        <div class="card-foot row-between">
          <button class="btn btn-ghost" data-act="create-step-back" ${createStep === 1 ? "disabled" : ""}>Back</button>
          <div class="row">
            <button class="btn btn-secondary" data-act="create-save-draft">Save draft</button>
            ${createStep === CREATE_STEPS.length
              ? `<button class="btn btn-primary" data-act="create-finish">Create project</button>`
              : `<button class="btn btn-primary" data-act="create-step-next" ${!createDraft.name && createStep >= 2 ? "disabled" : ""}>
                   Continue ${icon("chevronRight", 15)}</button>`}
          </div>
        </div>
      </div>
    </div>`;
}

function renderShareSetup() {
  const d = documentRecord(shareDraft.documentId);
  const cl = client(d.clientId);
  const existing = reviews.find((r) => r.documentId === d.id && r.state === "waiting");
  const missingRecipient = !shareDraft.recipient;
  const unsaved = saveState !== "saved";

  return `
    <div class="guest-wrap">
      <a class="btn btn-ghost btn-sm" href="#/documents/${d.id}" style="margin-bottom:18px">${icon("arrowLeft", 15)} Back to document</a>
      <div class="eyebrow">Review &amp; share setup · D05</div>
      <h1>Share one exact version</h1>
      <p class="page-sub mt-8">The recipient is the only person who can decide. A working draft can never be shared by accident, and previewing is not sharing.</p>

      <div class="split mt-24">
        <div class="stack">
          ${existing ? `<div>${banner(
            "<strong>A review request is already open for this document.</strong>",
            `v${existing.version} is with ${existing.reviewer.name}, due ${formatDate(existing.due)}. V1 allows one open request per deliverable — withdraw it, or wait for the decision.`,
            "bad",
            `<button class="btn btn-secondary btn-sm" data-act="withdraw-review" data-id="${existing.id}">Withdraw request</button>`
          )}</div>` : ""}

          ${unsaved ? `<div>${banner(
            "<strong>This document has unsaved changes.</strong>",
            "A version is frozen from a saved draft. Save first, then submit.",
            "bad",
            `<button class="btn btn-secondary btn-sm" data-act="save-now">Save now</button>`
          )}</div>` : ""}

          <section class="card">
            <div class="card-head"><div class="card-head-text"><div class="card-title">1 · Choose the exact version</div>
              <div class="card-desc">Submitting freezes a numbered version. It is never overwritten afterwards.</div></div></div>
            <div class="card-body stack-tight">
              <button class="option selected" data-act="share-pick-version" data-id="draft">
                <span class="radio-mark"></span>
                <span><span class="option-title">Working draft v${d.workingVersion} <span class="chip accent">New version</span></span>
                  <span class="option-sub">Freezes as v${d.workingVersion + 1} when you create the request.</span></span>
              </button>
              ${d.versions.map((v) => `<button class="option" data-act="share-pick-version" data-id="${v.n}">
                <span class="radio-mark"></span>
                <span><span class="option-title">Submitted v${v.n}</span>
                  <span class="option-sub">${esc(formatDate(v.date))} · ${esc(v.decision === "approved" ? "approved" : v.decision === "changes" ? "changes requested" : "open")}</span></span>
              </button>`).join("")}
            </div>
          </section>

          <section class="card">
            <div class="card-head"><div class="card-head-text"><div class="card-title">2 · Recipient and role</div>
              <div class="card-desc">Access is granted to a person and an object, never to a whole client.</div></div></div>
            <div class="card-body">
              <div class="grid grid-2">
                <div class="field">
                  <label class="field-label" for="sh-recipient">Recipient email</label>
                  <input class="input ${missingRecipient ? "invalid" : ""}" id="sh-recipient" data-field="recipient"
                    value="${esc(shareDraft.recipient)}" placeholder="marta@harborfinch.com">
                  ${missingRecipient ? `<span class="field-error">A verified recipient is required before access can be granted.</span>` : ""}
                </div>
                <div class="field">
                  <label class="field-label" for="sh-role">Role</label>
                  <select class="select" id="sh-role" data-field="role">
                    <option ${shareDraft.role === "Guest reviewer" ? "selected" : ""}>Guest reviewer</option>
                    <option ${shareDraft.role === "Guest viewer" ? "selected" : ""}>Guest viewer</option>
                  </select>
                  <span class="field-hint">Only a reviewer can approve or request changes.</span>
                </div>
              </div>
              <div class="grid grid-2 mt-16">
                <div class="field">
                  <label class="field-label" for="sh-due">Review due date</label>
                  <input class="input" id="sh-due" type="date" data-field="due" value="${esc(shareDraft.due)}">
                </div>
                <div class="field">
                  <label class="field-label">Known contacts at ${esc(cl.name)}</label>
                  <div class="stack-tight">
                    ${cl.contacts.map((ct) => `<button class="option" data-act="share-pick-contact" data-id="${esc(ct.email)}">
                      <span class="radio-mark"></span>
                      <span><span class="option-title">${esc(ct.name)}</span><span class="option-sub">${esc(ct.email)}</span></span>
                    </button>`).join("")}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="card">
            <div class="card-head"><div class="card-head-text"><div class="card-title">3 · Permissions</div></div></div>
            <div class="card-body">
              <div class="stack-tight">
                <label class="check"><input type="checkbox" checked disabled><span class="check-text">Read the granted version only</span></label>
                <label class="check"><input type="checkbox" checked disabled><span class="check-text">Comment on the version</span></label>
                <label class="check"><input type="checkbox" checked><span class="check-text">Decide — approve or request changes</span></label>
                <label class="check"><input type="checkbox"><span class="check-text">Download permitted files</span></label>
              </div>
              <div class="field mt-16">
                <label class="field-label" for="sh-note">Optional note in the access email</label>
                <textarea class="textarea" id="sh-note" data-field="note" style="min-height:80px"
                  placeholder="One or two lines of context. The email itself is transactional — there is no general composer in V1.">${esc(shareDraft.note)}</textarea>
              </div>
            </div>
          </section>
        </div>

        <div class="stack">
          <section class="card">
            <div class="card-head"><div class="card-head-text"><div class="card-title">What the guest will see</div>
              <div class="card-desc">Preview parity: this is the real surface, not a mock.</div></div></div>
            <div class="card-body">
              <div style="background:var(--canvas);border:1px solid var(--divider);border-radius:var(--r-control);padding:14px">
                <div class="row-between">
                  <span class="strong" style="font-size:var(--fs-label)">${esc(d.title)}</span>
                  <span class="chip accent">v${d.workingVersion + 1}</span>
                </div>
                <p class="meta mt-8">${esc(cl.name)} · review requested by ${esc(workspace.owner)}</p>
                <div class="divider-h" style="margin:12px 0"></div>
                <p class="meta" style="line-height:1.6">Immutable version · comment · approve or request changes</p>
                <div class="row mt-12" style="gap:6px;color:var(--metadata)">
                  ${icon("lock", 13)}<span class="meta">Internal notes are excluded</span>
                </div>
              </div>
              <button class="btn btn-secondary btn-block mt-12" data-act="preview-as-guest" data-id="${d.id}">${icon("external", 15)} Open guest preview</button>
            </div>
          </section>

          <section class="card">
            <div class="card-head"><div class="card-head-text"><div class="card-title">Transition guards</div></div></div>
            <div class="card-body">
              <div class="stack-tight">
                ${[["Unsaved or failed-save content cannot be submitted", unsaved],
                   ["One open request per deliverable", !!existing],
                   ["A verified recipient is required", missingRecipient],
                   ["Approving a stale or withdrawn request is rejected", false]].map(([label, bad]) => `
                  <div class="row" style="gap:9px;color:${bad ? "var(--risk)" : "var(--muted)"}">
                    ${icon(bad ? "alert" : "check", 15)}<span style="font-size:var(--fs-label)">${esc(label)}</span></div>`).join("")}
              </div>
            </div>
            <div class="card-foot">
              <button class="btn btn-primary btn-block" data-act="create-request"
                ${missingRecipient || existing || unsaved ? 'aria-disabled="true"' : ""}>${icon("send", 15)} Create review request</button>
              <p class="meta mt-8">${missingRecipient ? "Blocked: add a recipient." : existing ? "Blocked: an open request already exists." : unsaved ? "Blocked: save the draft first." : "Ready to send."}</p>
            </div>
          </section>
        </div>
      </div>
    </div>`;
}

function renderAuthEntry() {
  return `
    <div class="guest-wrap narrow" style="padding-top:9vh">
      <div class="row" style="gap:11px;margin-bottom:26px">
        <span class="brand-mark" style="height:34px;width:34px;font-size:14px">CD</span>
        <div><div class="brand-name" style="font-size:16px">CoreDesk</div>
        <div class="meta">Precision workspace for client work</div></div>
      </div>
      <h1>A focused workspace for independent professionals.</h1>
      <p class="page-sub mt-12">Manage a client relationship, run a project, write its documents, collect a decision and deliver the right version. Offline-first, on your machine.</p>
      <div class="card mt-24"><div class="card-body stack">
        <div class="field">
          <label class="field-label" for="a-email">Email</label>
          <input class="input" id="a-email" type="email" value="nadia@northlight.studio">
        </div>
        <div class="field">
          <label class="field-label" for="a-pass">Password</label>
          <input class="input" id="a-pass" type="password" value="••••••••••••">
        </div>
        <div class="row-between">
          <label class="check"><input type="checkbox" checked><span class="check-text">Keep me signed in</span></label>
          <a href="#/auth" style="font-size:var(--fs-label)">Recover access</a>
        </div>
        <button class="btn btn-primary btn-lg btn-block" data-act="sign-in">Sign in</button>
        <div class="divider-h"></div>
        <p class="meta" style="text-align:center">New here? <a href="#/auth">Create an account</a></p>
        <p class="meta" style="text-align:center">Google SSO is shown only once implemented. It is not in V1.</p>
      </div></div>
      <p class="meta mt-20" style="text-align:center">
        <a href="#/terms">Terms</a> · <a href="#/privacy">Privacy</a> · <a href="#/onboarding">Onboarding</a> ·
        <a href="#/guest/shared">Guest example</a>
      </p>
    </div>`;
}

function renderOnboarding() {
  return `
    <div class="guest-wrap narrow" style="padding-top:7vh">
      <div class="eyebrow">Account &amp; first value · A06</div>
      <h1>Set up your workspace</h1>
      <p class="page-sub mt-8">Three fields, then your first client. Progress is saved as you go — you can leave and resume.</p>
      <div class="steps mt-24" style="max-width:400px">
        <div class="step done"><div class="step-bar"></div><div class="step-label">Owner</div></div>
        <div class="step current"><div class="step-bar"></div><div class="step-label">Workspace</div></div>
        <div class="step"><div class="step-bar"></div><div class="step-label">First client</div></div>
      </div>
      <div class="card"><div class="card-body stack">
        <div class="grid grid-2">
          <div class="field"><label class="field-label">Your name</label><input class="input" value="${esc(workspace.owner)}"></div>
          <div class="field"><label class="field-label">Workspace name</label><input class="input" value="${esc(workspace.name)}"></div>
        </div>
        <div class="field"><label class="field-label">Timezone</label>
          <select class="select"><option>${esc(workspace.timezone)}</option><option>Europe/London (GMT+1)</option></select>
          <span class="field-hint">Used for due dates on reviews and deliveries.</span>
        </div>
        <div class="field"><label class="field-label">Brand and service defaults <span class="field-hint">(optional)</span></label>
          <input class="input" value="${esc(workspace.serviceDefaults)}">
          <span class="field-hint">Pre-fills new proposals. Editable later in Settings.</span>
        </div>
        <div class="banner ok">
          <div class="banner-text">Progress saved<div class="banner-sub">You can close this and resume from Home.</div></div>
        </div>
      </div>
      <div class="card-foot row-between">
        <button class="btn btn-ghost" data-act="onboard-skip">Skip optional setup</button>
        <button class="btn btn-primary" data-act="onboard-next">Continue to first client</button>
      </div></div>
    </div>`;
}

function legalPage(kind) {
  const title = kind === "terms" ? "Terms" : "Privacy";
  return `
    <div class="guest-wrap narrow">
      <a class="btn btn-ghost btn-sm" href="#/auth" style="margin-bottom:16px">${icon("arrowLeft", 15)} Back</a>
      <div class="eyebrow">${esc(title)} · A0${kind === "terms" ? "7" : "8"}</div>
      <h1>${esc(title)}</h1>
      <div class="card mt-20"><div class="card-body">
        ${banner(
          "Owner-supplied copy is required before release.",
          "This surface renders the workspace owner's own terms. Nothing here is placeholder legal language and no claim is made on their behalf.",
          "bad",
          `<button class="btn btn-secondary btn-sm" data-act="go-settings">Edit in Settings</button>`
        )}
        <div class="defs mt-20">
          <div class="def"><span class="def-key">Version</span><span class="def-val">Not yet published</span></div>
          <div class="def"><span class="def-key">Effective date</span><span class="def-val">Not yet set</span></div>
          <div class="def"><span class="def-key">Contact route</span><span class="def-val">${esc(workspace.email)}</span></div>
        </div>
        <p class="meta mt-20" style="line-height:1.7">Both pages are reachable from the auth screens and from Settings. If content is unavailable, a recovery route is shown rather than an empty page.</p>
      </div></div>
    </div>`;
}

/* ---- Guest surface ---- */

let guestDecision = null;

function renderGuestInvite() {
  return `
    <div class="guest">
      <div class="guest-bar">
        <div class="guest-brand"><span class="brand-mark">CD</span>
          <div><div class="brand-name">${esc(workspace.name)}</div>
          <div class="meta">Shared with you by ${esc(workspace.owner)}</div></div></div>
        <span class="meta">Secure review access</span>
      </div>
      <div class="guest-wrap narrow" style="padding-top:8vh">
        <div class="eyebrow">Invitation · G01</div>
        <h1>Verify to open your review</h1>
        <p class="page-sub mt-8">This invitation is for one person and one piece of work. It does not open the rest of the workspace.</p>
        <div class="card mt-24"><div class="card-body">
          <div class="defs">
            <div class="def"><span class="def-key">Invited</span><span class="def-val">m••••@harborfinch.com</span></div>
            <div class="def"><span class="def-key">Work</span><span class="def-val">Brand identity system · Brand guidelines v3</span></div>
            <div class="def"><span class="def-key">Role</span><span class="def-val">Guest reviewer — you can approve or request changes</span></div>
            <div class="def"><span class="def-key">Expires</span><span class="def-val">19 Sep 2026</span></div>
          </div>
          <div class="stack mt-20">
            <div class="field"><label class="field-label">Confirm your email</label>
              <input class="input" value="marta@harborfinch.com"></div>
            <button class="btn btn-primary btn-lg btn-block" data-act="guest-enter">Open my review</button>
            <p class="meta" style="text-align:center">Not you? <a href="#/guest/wrong-account">Switch account</a></p>
          </div>
        </div></div>
        <div class="guest-note">This link is transactional. ${esc(workspace.name)} can revoke it at any time, and it never grants access to other projects or documents.</div>
      </div>
    </div>`;
}

function renderGuestShared() {
  return `
    <div class="guest">
      <div class="guest-bar">
        <div class="guest-brand"><span class="brand-mark">CD</span>
          <div><div class="brand-name">${esc(workspace.name)}</div>
          <div class="meta">Shared project summary</div></div></div>
        <span class="avatar">MV</span>
      </div>
      <div class="guest-wrap">
        <div class="eyebrow">Shared project · G02</div>
        <h1>Brand identity system</h1>
        <p class="page-sub mt-8">Only what was explicitly shared with you appears here. Internal notes, owner tasks and unshared files are excluded by design.</p>

        <div class="grid grid-2 mt-24">
          <section class="card">
            <div class="card-head"><div class="card-head-text"><div class="card-title">Waiting on you</div>
              <div class="card-desc">Requested action with its due date.</div></div></div>
            <div class="card-body flush">
              <div class="item-row">
                <div class="item-main">
                  <div class="item-title">Review Brand guidelines v3</div>
                  <div class="item-sub">Requested by ${esc(workspace.owner)} · due 12 Sep 2026</div>
                </div>
                <div class="item-side">${chip("waiting")}</div>
                <div class="item-actions"><a class="btn btn-primary btn-sm" href="#/guest/review">Open review</a></div>
              </div>
            </div>
          </section>

          <section class="card">
            <div class="card-head"><div class="card-head-text"><div class="card-title">Delivered to you</div>
              <div class="card-desc">Packages you can download.</div></div></div>
            <div class="card-body flush">
              <div class="item-row">
                <div class="item-main">
                  <div class="item-title">Logo package v2</div>
                  <div class="item-sub">ZIP · 18.4 MB · delivered 19 Jun 2026</div>
                </div>
                <div class="item-side">${chip("delivered")}</div>
                <div class="item-actions"><a class="btn btn-secondary btn-sm" href="#/guest/delivery">Open</a></div>
              </div>
            </div>
          </section>
        </div>

        <section class="card mt-16">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Progress you can see</div>
            <div class="card-desc">A shared summary, not the owner's task list.</div></div></div>
          <div class="card-body">
            <div class="defs">
              <div class="def"><span class="def-key">Milestone</span><span class="def-val">Guidelines approved · due 12 Sep</span></div>
              <div class="def"><span class="def-key">Last shared</span><span class="def-val">3 Sep 2026</span></div>
              <div class="def"><span class="def-key">Access</span><span class="def-val">${chip("active", "Active until 19 Sep")}</span></div>
            </div>
          </div>
        </section>

        <div class="guest-note">Excluded from this view: internal notes, owner tasks, unshared documents and the rest of the workspace.</div>
      </div>
    </div>`;
}

function renderGuestReview() {
  const decided = guestDecision;
  return `
    <div class="guest">
      <div class="guest-bar">
        <div class="guest-brand"><span class="brand-mark">CD</span>
          <div><div class="brand-name">Brand guidelines</div><div class="meta">${esc(workspace.name)} · v3</div></div></div>
        <span class="avatar">MV</span>
      </div>
      <div class="guest-wrap">
        <div class="immutable">
          <div class="row" style="gap:9px">${icon("lock", 15)}
            <span style="font-size:var(--fs-label)">You are reading v3 — the exact version sent for review. It cannot change under you.</span></div>
          <span class="meta">Submitted 3 Sep 2026</span>
        </div>

        <div class="split mt-16">
          <div class="stack">
            <section class="card">
              <div class="card-head"><div class="card-head-text"><div class="card-title">Positioning</div></div></div>
              <div class="card-body">
                <p class="doc-p" style="margin-top:0">Harbor &amp; Finch supply specialty ingredients to independent kitchens. The identity has to read as <strong>precise and generous</strong> at the same time.</p>
                <p class="doc-p">The wordmark carries the weight. Everything else is a support system.</p>
              </div>
            </section>
            <section class="card">
              <div class="card-head"><div class="card-head-text"><div class="card-title">Clear space and minimum size</div></div></div>
              <div class="card-body">
                <p class="doc-p" style="margin-top:0">Clear space equals the height of the lowercase <strong>h</strong> on all four sides.</p>
                <div style="background:var(--raised);border:1px solid var(--divider);border-radius:var(--r-control);display:grid;place-items:center;height:150px;margin-top:14px">
                  <span class="meta">Clear-space diagram · image block</span>
                </div>
              </div>
            </section>

            <section class="card">
              <div class="card-head"><div class="card-head-text"><div class="card-title">Your comments</div>
                <div class="card-desc">Comments are not a decision. The decision is recorded separately below.</div></div></div>
              <div class="card-body">
                <div class="comment" style="padding-top:0">
                  <span class="avatar">MV</span>
                  <div><div class="comment-head"><span class="comment-author">You</span><span class="meta">5 Sep 2026</span></div>
                    <div class="comment-body">The clear-space rule reads much better. One question on the reversed wordmark over photography — is there a minimum contrast rule?</div></div>
                </div>
                <div class="field mt-16">
                  <label class="field-label" for="g-comment">Add a comment</label>
                  <textarea class="textarea" id="g-comment" style="min-height:88px" placeholder="Ask a question or describe what needs to change."></textarea>
                </div>
              </div>
            </section>
          </div>

          <div class="stack">
            <section class="card">
              <div class="card-head"><div class="card-head-text"><div class="card-title">Your decision</div>
                <div class="card-desc">You are the designated reviewer. Only you can decide.</div></div></div>
              <div class="card-body">
                ${decided === "approved" ? `<div class="banner ok">
                    <div class="banner-text">Approved v3<div class="banner-sub">Recorded 10 Sep 2026. The owner has been notified and can prepare delivery.</div></div>
                  </div>
                  <a class="btn btn-secondary btn-block mt-12" href="#/guest/shared">Back to shared project</a>`
                : decided === "changes" ? `<div class="banner">
                    <div class="banner-text">Changes requested<div class="banner-sub">Your comment was attached. The owner will revise and send a new version — this version stays unchanged.</div></div>
                  </div>
                  <a class="btn btn-secondary btn-block mt-12" href="#/guest/shared">Back to shared project</a>`
                : `<p class="meta" style="line-height:1.65">Approving accepts this version as it stands. Requesting changes requires a comment so the revision has a reason attached.</p>
                  <div class="stack-tight mt-16">
                    <button class="btn btn-primary btn-block" data-act="guest-approve">${icon("checkCircle", 15)} Approve v3</button>
                    <button class="btn btn-secondary btn-block" data-act="guest-changes">${icon("message", 15)} Request changes</button>
                  </div>
                  <div class="defs mt-16">
                    <div class="def"><span class="def-key">Due</span><span class="def-val">12 Sep 2026</span></div>
                    <div class="def"><span class="def-key">Reviewer</span><span class="def-val">You (Guest reviewer)</span></div>
                    <div class="def"><span class="def-key">Covers</span><span class="def-val">v3 only</span></div>
                  </div>`}
              </div>
            </section>

            <section class="card">
              <div class="card-body">
                <div class="panel-section-title">Your access</div>
                <p class="meta" style="line-height:1.6">You can read v3, comment and decide. You cannot see internal notes, search the workspace, edit drafts or invite anyone else.</p>
                <a class="btn btn-ghost btn-sm mt-12" href="#/guest/unavailable">What if my link stops working?</a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>`;
}

function renderGuestDelivery() {
  return `
    <div class="guest">
      <div class="guest-bar">
        <div class="guest-brand"><span class="brand-mark">CD</span>
          <div><div class="brand-name">Delivery package</div><div class="meta">${esc(workspace.name)}</div></div></div>
        <span class="avatar">SB</span>
      </div>
      <div class="guest-wrap">
        <div class="eyebrow">Delivery · G04</div>
        <h1>Wayfinding signage system</h1>
        <p class="page-sub mt-8">Delivered 19 June 2026 by ${esc(workspace.owner)}. These are the exact approved versions.</p>

        <section class="card mt-20">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Included files</div>
            <div class="card-desc">Only files you are permitted to download appear here.</div></div></div>
          <div class="card-body flush">
            ${[["Signage system v4", "PDF · 12.1 MB"], ["Installation drawings v2", "PDF · 8.6 MB"]].map(([n, m]) => `
              <div class="package-row">
                <span class="package-badge pdf">PDF</span>
                <div class="item-main"><div class="item-title">${esc(n)}</div><div class="item-sub">${esc(m)}</div></div>
                <button class="btn btn-secondary btn-sm" data-act="guest-download">${icon("download", 14)} Download</button>
              </div>`).join("")}
          </div>
        </section>

        <section class="card mt-16">
          <div class="card-head"><div class="card-head-text"><div class="card-title">Handoff notes</div></div></div>
          <div class="card-body"><p class="muted" style="line-height:1.65">Installation drawings are at 1:20. Fabricator contact details are included in the appendix.</p></div>
        </section>

        <div class="decision-bar mt-16">
          <div>
            <div class="strong">Acknowledge receipt</div>
            <div class="meta mt-4">Optional. Acknowledgment confirms you received the package — it does not approve the work retroactively.</div>
          </div>
          <button class="btn btn-primary" data-act="guest-acknowledge">${icon("check", 15)} Acknowledge receipt</button>
        </div>

        <div class="guest-note">Access to this package can be revoked by ${esc(workspace.name)} at any time. If a file becomes unavailable, you will see a clear message with a way to request renewed access.</div>
      </div>
    </div>`;
}

function guestNotice(kind) {
  const map = {
    "wrong-account": {
      title: "This invitation is for a different email",
      text: "You are signed in as another account. Switching identity will not reveal any content from this workspace.",
      action: "Switch account",
      tone: "blocked", iconName: "lock",
    },
    unavailable: {
      title: "This link is no longer available",
      text: "Access was revoked on 15 Aug 2026, or the link has expired. The record itself is intact.",
      action: "Request renewed access",
      tone: "blocked", iconName: "alert",
    },
    expired: {
      title: "This invitation has expired",
      text: "Invitations expire so old links cannot be reused. Ask the workspace owner for a new one.",
      action: "Request a new invitation",
      tone: "blocked", iconName: "clock",
    },
    unauthorized: {
      title: "You do not have access to this record",
      text: "The link is valid, but this account was never granted access to this work.",
      action: "Return to sign in",
      tone: "error", iconName: "lock",
    },
  }[kind] || { title: "Unavailable", text: "", action: "Go back", tone: "", iconName: "alert" };

  return `
    <div class="guest">
      <div class="guest-bar"><div class="guest-brand"><span class="brand-mark">CD</span>
        <div><div class="brand-name">${esc(workspace.name)}</div></div></div></div>
      <div class="guest-wrap narrow" style="padding-top:7vh">
        <div class="card">
          ${emptyState({ iconName: map.iconName, title: map.title, text: map.text, tone: map.tone,
            primary: { label: map.action, act: "guest-request-access" },
            secondary: { label: "Open the invitation again", act: "go-guest-invite" } })}
        </div>
        <div class="guest-note">Nothing about the record has been revealed by this page. Access failures never leak content.</div>
      </div>
    </div>`;
}

/* -------------------------------------------------------------------------- */
/* Search overlay (W03)                                                        */
/* -------------------------------------------------------------------------- */

function searchResults(q) {
  const query = (q || "").trim().toLowerCase();
  const groups = [];

  const cHits = clients.filter((c) => c.state !== "archived" &&
    (c.name.toLowerCase().includes(query) || c.contact.name.toLowerCase().includes(query)));
  if (cHits.length) groups.push(["Clients", cHits.map((c) => ({
    title: c.name, sub: `${c.contact.name} · ${c.activeProjects} active project${c.activeProjects === 1 ? "" : "s"}`,
    href: `#/clients/${c.id}`, icon: "clients",
  }))]);

  const pHits = projects.filter((p) => p.name.toLowerCase().includes(query) || p.outcome.toLowerCase().includes(query));
  if (pHits.length) groups.push(["Projects", pHits.map((p) => ({
    title: p.name, sub: `${client(p.clientId).name} · ${p.stageLabel}`, href: `#/projects/${p.id}`, icon: "projects",
  }))]);

  const dHits = documents.filter((d) => d.title.toLowerCase().includes(query));
  if (dHits.length) groups.push(["Documents", dHits.map((d) => ({
    title: d.title, sub: `${d.type} · working v${d.workingVersion}`, href: `#/documents/${d.id}`, icon: "documents",
  }))]);

  const tHits = tasks.filter((t) => t.title.toLowerCase().includes(query));
  if (tHits.length) groups.push(["Tasks", tHits.slice(0, 5).map((t) => ({
    title: t.title, sub: t.projectId ? project(t.projectId).name : client(t.clientId).name,
    href: `#/tasks`, icon: "tasks", taskId: t.id,
  }))]);

  return groups;
}

function renderSearchOverlay(q) {
  const query = (q || "").trim();
  const groups = query ? searchResults(query) : [];
  const total = groups.reduce((n, g) => n + g[1].length, 0);

  let body;
  if (!query) {
    const recent = [
      { title: "Brand guidelines", sub: "Document · opened 2h ago", href: "#/documents/doc-guidelines", icon: "documents" },
      { title: "Brand identity system", sub: "Project · opened yesterday", href: "#/projects/pr-identity", icon: "projects" },
      { title: "Harbor & Finch", sub: "Client · opened yesterday", href: "#/clients/cl-harbor", icon: "clients" },
      { title: "Send revised proposal with staged payment schedule", sub: "Task · opened 3d ago", href: "#/tasks", icon: "tasks", taskId: "tk-1" },
    ];
    body = `<div class="palette-results">
      <div class="palette-group-label">Recent</div>
      ${recent.map((r, i) => paletteItem(r, i === 0)).join("")}
      <div class="palette-group-label">Jump to</div>
      ${NAV.flatMap((g) => g.items).map((it, i) => paletteItem(
        { title: it.label, sub: "Workspace", href: it.route, icon: it.icon }, false)).join("")}
    </div>`;
  } else if (total === 0) {
    body = `<div class="palette-results">
      ${emptyState({
        iconName: "search", title: "No results", text: `Nothing in your workspace matches “${esc(query)}”. Archived records are excluded unless you opt in.`,
        secondary: { label: "Include archive", act: "search-include-archive" },
      })}
    </div>`;
  } else {
    body = `<div class="palette-results">
      ${groups.map(([label, items]) => `
        <div class="palette-group-label">${esc(label)} · ${items.length}</div>
        ${items.map((it, i) => paletteItem(it, false)).join("")}`).join("")}
    </div>`;
  }

  return `<div class="overlay-center">
    <div class="palette" role="dialog" aria-modal="true" aria-label="Search workspace">
      <div class="field-search">
        ${icon("search", 18)}
        <input id="search-input" value="${esc(query)}" placeholder="Search clients, projects, documents, tasks…" autocomplete="off">
        <span class="kbd">Esc</span>
      </div>
      ${body}
      <div class="palette-foot">
        <span><span class="kbd">↑</span><span class="kbd">↓</span> navigate</span>
        <span><span class="kbd">↵</span> open</span>
        <span class="grow"></span>
        <span>Only authorized records appear</span>
      </div>
    </div>
  </div>`;
}

function paletteItem(it, selected) {
  return `<button class="palette-item" aria-selected="${selected ? "true" : "false"}"
    data-act="palette-open" data-href="${it.href}" ${it.taskId ? `data-task="${it.taskId}"` : ""}>
    ${icon(it.icon, 17)}
    <span class="palette-item-text">
      <span class="palette-item-title">${esc(it.title)}</span>
      <span class="palette-item-sub">${esc(it.sub)}</span>
    </span>
    ${icon("chevronRight", 15)}
  </button>`;
}

/* -------------------------------------------------------------------------- */
/* Small overlays                                                              */
/* -------------------------------------------------------------------------- */

function renderNewClientModal() {
  return `<div class="modal" role="dialog" aria-modal="true" aria-label="Add client">
    <div class="modal-shell">
      <div class="modal-head">
        <div class="panel-title">Add a client</div>
        <div class="panel-sub">A client is the ongoing relationship. Projects and documents attach to it.</div>
      </div>
      <div class="modal-body stack">
        <div class="field">
          <label class="field-label" for="nc-name">Client or company name</label>
          <input class="input" id="nc-name" placeholder="Harbor &amp; Finch" autofocus>
        </div>
        <div class="grid grid-2">
          <div class="field"><label class="field-label" for="nc-contact">Primary contact</label>
            <input class="input" id="nc-contact" placeholder="Full name"></div>
          <div class="field"><label class="field-label" for="nc-email">Email</label>
            <input class="input" id="nc-email" placeholder="name@company.com"></div>
        </div>
        <div class="field">
          <label class="field-label" for="nc-state">Relationship state</label>
          <select class="select" id="nc-state"><option>Active client</option><option>Prospect</option></select>
        </div>
        <div class="field">
          <label class="field-label" for="nc-note">Private note <span class="field-hint">(never shown to guests)</span></label>
          <textarea class="textarea" id="nc-note" style="min-height:78px" placeholder="How you met, what they need, anything to remember."></textarea>
        </div>
        <div class="banner" id="nc-dupe" hidden>
          <div class="banner-text">A client with a similar name already exists
            <div class="banner-sub">“Harbor &amp; Finch” is already on record. Duplicate clients split document history — open the existing record instead unless this is genuinely a different business.</div></div>
          <button class="btn btn-secondary btn-sm" data-act="open-existing-client">Open existing</button>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" data-act="close-modal">Cancel</button>
        <button class="btn btn-primary" data-act="create-client">Add client</button>
      </div>
    </div>
  </div>`;
}

function renderReviewModal(id) {
  const r = review(id);
  if (!r) return "";
  const d = documentRecord(r.documentId);
  return `<div class="modal" role="dialog" aria-modal="true" aria-label="Review request">
    <div class="modal-shell">
      <div class="modal-head">
        <div class="row-between">
          <div><div class="panel-title">Review request · v${r.version}</div>
            <div class="panel-sub">${esc(d.title)} · ${esc(client(d.clientId).name)}</div></div>
          ${chip(r.state)}
        </div>
      </div>
      <div class="modal-body stack">
        <div class="defs">
          <div class="def"><span class="def-key">Reviewer</span><span class="def-val">${esc(r.reviewer.name)} · ${esc(r.reviewer.email)}</span></div>
          <div class="def"><span class="def-key">Designated role</span><span class="def-val">${esc(r.reviewer.role)} — the only person who can decide</span></div>
          <div class="def"><span class="def-key">Requested</span><span class="def-val">${esc(formatDate(r.requestedOn))}</span></div>
          <div class="def"><span class="def-key">Due</span><span class="def-val ${r.state === "waiting" && daysUntil(r.due) < 0 ? "mark-risk" : ""}">${r.due ? esc(formatDate(r.due)) : "—"} · ${esc(dueLabel(r.due))}</span></div>
          <div class="def"><span class="def-key">Covers</span><span class="def-val">v${r.version} only — later edits cannot alter it</span></div>
        </div>

        <div class="panel-section">
          <div class="panel-section-title">Feedback and decision</div>
          ${r.comments.length === 0 ? `<p class="meta">No comments yet. A comment is not a decision.</p>`
            : r.comments.map((cm) => `<div class="comment">
              <span class="avatar">${esc(initials(cm.author))}</span>
              <div><div class="comment-head"><span class="comment-author">${esc(cm.author)}</span>
                <span class="meta">${esc(formatDate(cm.date))}</span>${cm.internal ? '<span class="comment-tag">Internal</span>' : ""}</div>
                <div class="comment-body">${esc(cm.body)}</div></div>
            </div>`).join("")}
        </div>

        <div class="panel-section">
          <div class="panel-section-title">Access grant</div>
          <div class="immutable">
            <div><div class="strong" style="font-size:var(--fs-label)">${esc(r.reviewer.email)}</div>
              <div class="meta">Read v${r.version} · comment · decide</div></div>
            <button class="btn btn-ghost btn-sm" data-act="revoke-grant" data-id="gr-1">Revoke</button>
          </div>
        </div>
      </div>
      <div class="modal-foot split">
        <button class="btn btn-ghost" data-act="preview-as-guest" data-id="${d.id}">${icon("eye", 15)} Preview as client</button>
        <div class="row">
          <button class="btn btn-ghost" data-act="close-modal">Close</button>
          ${r.state === "waiting" ? `<button class="btn btn-danger" data-act="withdraw-review" data-id="${r.id}">Withdraw request</button>` : ""}
          ${r.outcome === "changes" ? `<button class="btn btn-primary" data-act="create-revision" data-id="${r.id}">Create revision</button>` : ""}
        </div>
      </div>
    </div>
  </div>`;
}

/* -------------------------------------------------------------------------- */
/* Menus (rendered as small fixed panels when triggered)                       */
/* -------------------------------------------------------------------------- */

function renderProjectMenu(p) {
  return `<div class="menu" style="position:fixed;right:calc(var(--pad-page));top:150px">
    <button class="menu-item" data-act="edit-scope">${icon("edit", 15)} Edit brief and scope</button>
    <button class="menu-item" data-act="record-scope-change">${icon("refresh", 15)} Record scope change</button>
    <button class="menu-item" data-act="copy-link">${icon("link", 15)} Copy project link</button>
    <div class="menu-sep"></div>
    <button class="menu-item" data-act="place-hold">${icon("clock", 15)} ${p.stage === "blocked" ? "Resume project" : "Place on hold"}</button>
    <button class="menu-item" data-act="close-project">${icon("checkCircle", 15)} Close project</button>
    <div class="menu-sep"></div>
    <button class="menu-item danger" data-act="archive-project">${icon("archive", 15)} Archive project</button>
  </div>`;
}

function renderClientMenu(c) {
  return `<div class="menu" style="position:fixed;right:calc(var(--pad-page));top:210px">
    <button class="menu-item" data-act="new-project" data-id="${c.id}">${icon("projects", 15)} Add project</button>
    <button class="menu-item" data-act="invite-contact">${icon("mail", 15)} Invite contact to review</button>
    <button class="menu-item" data-act="open-task-form">${icon("tasks", 15)} Add task</button>
    <div class="menu-sep"></div>
    <button class="menu-item" data-act="change-client-state">${icon("refresh", 15)} Change relationship state</button>
    <button class="menu-item danger" data-act="archive-client" data-id="${c.id}">${icon("archive", 15)} Archive ${esc(c.name)}</button>
  </div>`;
}

/* -------------------------------------------------------------------------- */
/* Not found / unauthorized route handling                                     */
/* -------------------------------------------------------------------------- */

function notFound(kind) {
  return {
    active: null,
    crumbs: crumb([{ label: "Not found" }]),
    body: `<div class="card">${emptyState({
      iconName: "alert", title: `That ${kind} does not exist`,
      text: "The record may have been deleted, or the link may be mistyped. Your other work is unaffected.",
      secondary: { label: "Back to Home", act: "go-home" },
      primary: { label: "Search instead", act: "open-search" },
    })}</div>`,
  };
}

/* -------------------------------------------------------------------------- */
/* Router                                                                      */
/* -------------------------------------------------------------------------- */

function route() {
  const raw = (location.hash || "#/home").replace(/^#/, "");
  const [pathPart, queryPart] = raw.split("?");
  const params = new URLSearchParams(queryPart || "");
  const segs = pathPart.split("/").filter(Boolean);
  const root = segs[0] || "home";
  const sub = segs[1];
  const tab = params.get("tab");
  const view = params.get("view");

  if (tab && ["overview", "work", "documents", "reviews", "delivery"].includes(tab)) projectTab = tab;
  if (view && ["editor", "preview", "history"].includes(view)) docView = view;

  switch (root) {
    case "home": return renderHome();
    case "first-run": return renderHomeFirstRun();
    case "tasks": return renderTasks();
    case "clients": return sub ? renderClientDetail(sub) : renderClients();
    case "projects": return sub ? renderProjectWorkspace(sub) : renderProjects();
    case "documents": return sub ? renderDocumentWorkspace(sub) : renderDocuments();
    case "activity": return renderActivity();
    case "archive": return renderArchive();
    case "settings": return renderSettings(sub);
    case "states": return renderStates();
    case "new-project": return { active: "projects", crumbs: crumb([{ label: "Projects", href: "#/projects" }, { label: "New project" }]), body: renderCreateProject(), guest: true };
    case "share": return { active: "documents", crumbs: crumb([{ label: "Documents", href: "#/documents" }, { label: "Review & share setup" }]), body: renderShareSetup(), guest: true };
    case "auth": return { active: null, crumbs: null, body: renderAuthEntry(), guest: true };
    case "onboarding": return { active: null, crumbs: null, body: renderOnboarding(), guest: true };
    case "terms": return { active: null, crumbs: null, body: legalPage("terms"), guest: true };
    case "privacy": return { active: null, crumbs: null, body: legalPage("privacy"), guest: true };
    case "guest": {
      if (sub === "invite") return { body: renderGuestInvite(), guest: true };
      if (sub === "shared") return { body: renderGuestShared(), guest: true };
      if (sub === "review") return { body: renderGuestReview(), guest: true };
      if (sub === "delivery") return { body: renderGuestDelivery(), guest: true };
      return { body: guestNotice(sub || "unavailable"), guest: true };
    }
    default: return notFound("page");
  }
}

/* -------------------------------------------------------------------------- */
/* Render loop                                                                 */
/* -------------------------------------------------------------------------- */

const app = document.getElementById("app");
let railCollapsed = false;
let overlay = null;      // "search" | null
let panelId = null;      // task panel
let modal = null;        // { kind, id }
let menu = null;         // { kind, id }
let toasts = [];
let searchQuery = "";

function render() {
  const r = route();

  if (r.guest) {
    app.innerHTML = `<div class="guest">${r.body}</div>
      ${overlay === "search" ? '<div class="scrim" data-act="close-overlay"></div>' + renderSearchOverlay(searchQuery) : ""}
      <div class="toasts">${toastsHTML()}</div>`;
    wireSearch();
    return;
  }

  app.innerHTML = `<div class="shell" data-rail="${railCollapsed ? "collapsed" : "full"}">
    ${rail(r.active)}
    <div class="workspace">
      ${topbar(r.crumbs, { notify: unreadCount() > 0 })}
      <main class="work ${r.flushLayout ? "flush" : ""}" id="work">
        ${r.flushLayout ? `<div style="padding:var(--pad-page) var(--pad-page) 0">${r.body}</div>${r.flushLayout}` : r.body}
      </main>
    </div>
  </div>
  ${menu ? (menu.kind === "project" ? renderProjectMenu(project(menu.id)) : renderClientMenu(client(menu.id))) : ""}
  ${panelId ? '<div class="scrim soft" data-act="close-panel"></div>' + taskPanel(panelId) : ""}
  ${modal ? '<div class="scrim" data-act="close-modal"></div>' + modalHTML() : ""}
  ${overlay === "search" ? '<div class="scrim" data-act="close-overlay"></div>' + renderSearchOverlay(searchQuery) : ""}
  <div class="toasts">${toastsHTML()}</div>`;

  wireSearch();
}

function modalHTML() {
  if (!modal) return "";
  if (modal.kind === "new-client") return renderNewClientModal();
  if (modal.kind === "review") return renderReviewModal(modal.id);
  return "";
}

function toastsHTML() {
  return toasts.map((t) => `<div class="toast ${t.tone || ""}">
    <span style="flex:0 0 auto;color:${t.tone === "ok" ? "var(--active)" : t.tone === "bad" ? "var(--risk)" : t.tone === "warn" ? "var(--waiting)" : "var(--accent)"}">
      ${icon(t.tone === "ok" ? "checkCircle" : t.tone === "bad" ? "alert" : "clock", 17)}</span>
    <div class="grow">
      <div class="toast-title">${esc(t.title)}</div>
      ${t.body ? `<div class="toast-body">${esc(t.body)}</div>` : ""}
    </div>
    <button class="icon-btn" data-act="dismiss-toast" data-id="${t.id}" aria-label="Dismiss">${icon("close", 15)}</button>
  </div>`).join("");
}

let toastSeq = 0;
function toast(title, body, tone = "") {
  const id = ++toastSeq;
  toasts = [...toasts, { id, title, body, tone }];
  render();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    render();
  }, 5200);
}

function wireSearch() {
  const input = document.getElementById("search-input");
  if (input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
    input.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      const r = route();
      const host = document.querySelector(".overlay-center");
      if (host) host.outerHTML = renderSearchOverlay(searchQuery);
      wireSearch();
    });
  }
}

/* -------------------------------------------------------------------------- */
/* Event handling                                                              */
/* -------------------------------------------------------------------------- */

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]");
  if (!el) return;
  const act = el.dataset.act;
  const id = el.dataset.id;

  /* Let real links work */
  if (el.tagName === "A" && el.getAttribute("href") && act !== "palette-open") return;

  e.preventDefault();
  e.stopPropagation();

  switch (act) {
    case "toggle-rail": railCollapsed = !railCollapsed; render(); break;
    case "toggle-theme": {
      const next = (document.documentElement.getAttribute("data-theme") || "dark") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("coredesk-theme", next);
      render();
      break;
    }
    case "set-theme":
      document.documentElement.setAttribute("data-theme", id);
      localStorage.setItem("coredesk-theme", id);
      render();
      toast(id === "dark" ? "Precision dark applied" : "Precision light applied",
        "Both themes use the same tokens — cobalt is held constant.", "ok");
      break;

    case "open-search": overlay = "search"; render(); break;
    case "close-overlay": overlay = null; searchQuery = ""; render(); break;
    case "palette-open":
      overlay = null; searchQuery = "";
      if (el.dataset.task) { panelId = el.dataset.task; }
      location.hash = el.dataset.href;
      render();
      break;
    case "search-include-archive": toast("Archive included", "Archived records will appear in results.", "ok"); break;

    case "go-tasks": location.hash = "#/tasks"; break;
    case "go-projects": location.hash = "#/projects"; break;
    case "go-activity": location.hash = "#/activity"; break;
    case "go-home": location.hash = "#/home"; break;
    case "go-delivery": projectTab = "delivery"; location.hash = `#/projects/${id}?tab=delivery`; break;
    case "go-settings": location.hash = "#/settings/account"; break;

    case "task-filter": taskFilter = id; render(); break;
    case "client-tab": clientTab = id; render(); break;
    case "project-tab": projectTab = id; render(); break;
    case "doc-view": docView = id; render(); break;
    case "settings-tab": settingsTab = id; location.hash = `#/settings/${id}`; render(); break;

    case "open-task":
      if (panelId === id) { panelId = null; } else { panelId = id; }
      render();
      break;
    case "close-panel": panelId = null; render(); break;
    case "toggle-task": {
      const t = task(id);
      t.status = t.status === "done" ? "todo" : "done";
      toast(t.status === "done" ? "Task completed" : "Task reopened",
        t.status === "done" ? "Progress counts update immediately." : "Returned to To do.", "ok");
      break;
    }
    case "complete-task": {
      const t = task(id);
      t.status = t.status === "done" ? "todo" : "done";
      toast(t.status === "done" ? "Task completed" : "Task reopened", "", "ok");
      break;
    }
    case "postpone-task": {
      const t = task(id);
      const d = new Date(t.due + "T00:00:00");
      d.setDate(d.getDate() + 1);
      t.due = d.toISOString().slice(0, 10);
      toast("Task postponed by one day", `Now due ${formatDate(t.due)}.`, "warn");
      break;
    }
    case "delete-task":
      toast("Task deleted", "The task was removed. Its project and documents are unchanged.", "bad");
      panelId = null;
      render();
      break;

    case "new-client": modal = { kind: "new-client" }; render(); break;
    case "create-client":
      modal = null;
      toast("Client added", "Add a project next so work has somewhere to live.", "ok");
      break;
    case "open-existing-client": location.hash = "#/clients/cl-harbor"; modal = null; render(); break;
    case "close-modal": modal = null; render(); break;

    case "client-menu": menu = menu && menu.id === id ? null : { kind: "client", id }; render(); break;
    case "project-menu": menu = menu && menu.id === id ? null : { kind: "project", id }; render(); break;

    case "open-review": modal = { kind: "review", id }; render(); break;
    case "withdraw-review":
      toast("Review request withdrawn", "The version is retained. No decision can be recorded against it now.", "warn");
      modal = null;
      render();
      break;
    case "create-revision":
      toast("Revision started", "A new draft was copied forward from the submitted version.", "ok");
      modal = null;
      location.hash = "#/documents/doc-guidelines";
      render();
      break;

    case "new-project": location.hash = "#/new-project"; createStep = 1; render(); break;
    case "create-pick-client": createDraft.clientId = id; render(); break;
    case "create-step-next":
      if (createStep < CREATE_STEPS.length) { createStep += 1; render(); }
      break;
    case "create-step-back":
      if (createStep > 1) { createStep -= 1; render(); }
      break;
    case "create-save-draft":
      toast("Draft saved", "The project stays a draft and cannot be shared until it has a name and a client.", "warn");
      break;
    case "create-finish":
      toast("Project created", "Opening the Overview tab. Nothing has been shared with the client.", "ok");
      location.hash = "#/projects/pr-identity";
      render();
      break;
    case "first-run-create":
      toast("Client created", "Now add a project so the relationship has work attached.", "ok");
      location.hash = "#/home";
      render();
      break;

    case "open-review-setup": shareDraft.documentId = "doc-guidelines"; location.hash = "#/share"; render(); break;
    case "share-pick-contact": shareDraft.recipient = id; render(); break;
    case "share-pick-version": render(); break;
    case "create-request":
      toast("Review request created", "Access granted to v4 only. The recipient has been emailed a transactional link.", "ok");
      location.hash = "#/documents/doc-guidelines";
      render();
      break;
    case "save-now": saveState = "saved"; toast("Draft saved", "You can submit a review request now.", "ok"); break;
    case "toggle-save-state": {
      const order = ["saved", "dirty", "saving", "failed"];
      saveState = order[(order.indexOf(saveState) + 1) % order.length];
      render();
      break;
    }
    case "preview-as-guest": location.hash = "#/guest/review"; render(); break;
    case "preview-as-client": location.hash = "#/guest/delivery"; render(); break;

    case "run-export": {
      const box = document.querySelector("[data-export-progress]");
      if (box) {
        box.hidden = false;
        let pct = 0;
        const fill = box.querySelector(".progress-fill");
        const detail = box.querySelector("[data-export-detail]");
        const timer = setInterval(() => {
          pct += 8;
          if (fill) fill.style.width = Math.min(pct, 100) + "%";
          if (detail) detail.textContent = `Rendering ${Math.min(Math.round((pct / 100) * 24), 24)} of 24 pages`;
          if (pct >= 100) {
            clearInterval(timer);
            toast("Export complete", "brand-guidelines-v4.pdf · 24 pages · version identified on every page.", "ok");
          }
        }, 260);
        toast("Export started", "Background work never blocks the interface.", "");
      } else {
        toast("Export started", "Rendering in the background — you can keep working.", "");
      }
      break;
    }

    case "save-settings": toast("Settings saved", "Applied to new documents. Historical versions are unchanged.", "ok"); break;
    case "restore-defaults": toast("Defaults restored", "Your previous values were kept in history.", "warn"); break;
    case "add-fee-item": toast("Fee item added", "Pre-fills new proposals only.", "ok"); break;
    case "invite-contact": location.hash = "#/share"; render(); break;
    case "revoke-grant":
      toast("Access revoked", "The recipient can no longer read the granted object. The record itself is unchanged.", "warn");
      modal = null;
      render();
      break;
    case "resend-invite": toast("Invitation re-sent", "A new grant is created rather than reviving the expired one.", "ok"); break;
    case "mark-read": {
      const ev = activity.find((x) => x.id === id);
      if (ev) ev.read = true;
      render();
      break;
    }
    case "mark-all-read":
      activity.forEach((ev) => { ev.read = true; });
      toast("All activity marked read", "Marking read does not resolve the work it refers to.", "ok");
      break;
    case "archive-client":
      toast("Archive requires confirmation", "Naming the affected records: 2 projects, 5 documents. History is retained.", "warn");
      menu = null;
      render();
      break;
    case "restore-client":
      toast("Client restored", "Guest access was not reinstated automatically.", "ok");
      break;
    case "retry": toast("Retrying…", "If this keeps failing, the local database may be locked by another process.", ""); break;
    case "dismiss-toast": toasts = toasts.filter((t) => t.id !== id); render(); break;
    case "copy-link": toast("Link copied", "Only people with a grant can open it.", "ok"); break;
    case "record-scope-change": toast("Scope change recorded", "The original accepted scope stays visible next to the change.", "ok"); break;
    case "accept-scope": toast("Scope acceptance recorded", "Dated and attributed. Delivery is no longer blocked by scope.", "ok"); break;
    case "place-hold": toast("Project placed on hold", "No reviews or deliveries can be started while on hold.", "warn"); break;
    case "close-project": toast("Project closed", "Its client is not archived, and access is not revoked.", "ok"); break;
    case "create-delivery": toast("Delivery package started", "Only approved versions can be added.", "ok"); break;
    case "share-package": toast("Delivery blocked", "Brand guidelines v3 has no approved version. Resolve the review first.", "bad"); break;
    case "record-external": toast("External handoff recorded", "Delivery date and method recorded. Acknowledgment stays separate.", "ok"); break;
    case "upload-file": toast("Upload started", "Progress shows inline. A failed upload retains your file selection.", ""); break;
    case "sign-in": toast("Signed in", "Retaining your intended destination.", "ok"); break;
    case "sign-out": toast("Signed out", "Local data stays on this machine.", "ok"); break;
    case "onboard-next": location.hash = "#/clients"; render(); break;
    case "onboard-skip": location.hash = "#/home"; render(); break;

    case "guest-enter": location.hash = "#/guest/shared"; render(); break;
    case "guest-approve":
      guestDecision = "approved";
      toast("Approved v3", "Recorded with your name and the time. The owner can now prepare delivery.", "ok");
      render();
      break;
    case "guest-changes":
      guestDecision = "changes";
      toast("Changes requested", "A comment is required — your reason is attached to the request.", "warn");
      render();
      break;
    case "guest-acknowledge": toast("Receipt acknowledged", "This confirms receipt only, not approval of the work.", "ok"); break;
    case "guest-download": toast("Download started", "Only files you are permitted to download appear here.", ""); break;
    case "guest-request-access": toast("Renewed access requested", "The workspace owner has been asked to issue a new invitation.", "ok"); break;
    case "go-guest-invite": location.hash = "#/guest/invite"; render(); break;

    case "open-settings-account": location.hash = "#/settings/account"; break;
    default:
      toast("Design note", "This control is specified in the page inventory but not interactive in this design preview.", "");
      break;
  }
});

/* Live field binding for the create and share flows. */
document.addEventListener("input", (e) => {
  const f = e.target.dataset ? e.target.dataset.field : null;
  if (!f) return;
  if (location.hash.startsWith("#/new-project")) {
    createDraft[f] = e.target.value;
    if (f === "name") {
      const btn = document.querySelector('[data-act="create-step-next"]');
      if (btn) btn.disabled = !e.target.value;
    }
  }
  if (location.hash.startsWith("#/share")) {
    shareDraft[f] = e.target.value;
    if (f === "recipient") {
      const input = e.target;
      const block = input.parentElement.querySelector(".field-error");
      const wrap = input.closest(".modal, .card, .guest-wrap");
      clearTimeout(input._t);
      input._t = setTimeout(() => {
        const missing = !input.value.trim();
        input.classList.toggle("invalid", missing);
        const btn = document.querySelector('[data-act="create-request"]');
        if (btn) btn.setAttribute("aria-disabled", missing ? "true" : "false");
        const hint = document.querySelector(".card-foot .meta");
        if (hint && hint.textContent.startsWith("Blocked: add a recipient")) {
          hint.textContent = missing ? "Blocked: add a recipient." : "Ready to send.";
        }
      }, 400);
    }
  }
});

/* Keyboard contract: ⌘K search, Esc to close, arrows in the palette. */
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    overlay = overlay === "search" ? null : "search";
    render();
    return;
  }
  if (e.key === "Escape") {
    if (overlay) { overlay = null; searchQuery = ""; render(); return; }
    if (modal) { modal = null; render(); return; }
    if (panelId) { panelId = null; render(); return; }
    if (menu) { menu = null; render(); return; }
  }
  if (e.key === "/" && !overlay && !modal && document.activeElement.tagName !== "INPUT"
      && document.activeElement.tagName !== "TEXTAREA") {
    e.preventDefault();
    overlay = "search";
    render();
  }
});

/* Route changes re-render, and reset transient menus. */
window.addEventListener("hashchange", () => {
  menu = null;
  panelId = null;
  modal = null;
  render();
});

/* Boot: restore theme, then draw. */
const savedTheme = localStorage.getItem("coredesk-theme");
document.documentElement.setAttribute("data-theme", savedTheme || "dark");
if (!location.hash) location.hash = "#/home";
render();
