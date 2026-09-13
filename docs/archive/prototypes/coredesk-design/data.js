/* ==========================================================================
   CoreDesk — design data
   Records mirror the Figma record model exactly:
     Workspace 1->many Clients
     Client 1->many Contacts + Projects
     Project 1->many Tasks + Milestones + Documents
     Document 1->many immutable Versions
     Version 1->many Review Requests over time
     Review Request -> one designated approver
     Delivery Package -> exact approved Versions/files
     Access Grant -> recipient + object + allowed actions

   All names and records are representative sample content, not client data.
   ========================================================================== */

export const workspace = {
  name: "Northlight Studio",
  owner: "Nadia Rahman",
  initials: "NR",
  email: "nadia@northlight.studio",
  timezone: "Europe/Amsterdam (GMT+2)",
  serviceDefaults: "Brand identity · Web design · Design systems",
};

/* Today is pinned so every "due in / overdue" figure in the design stays
   arithmetically true instead of drifting with the wall clock. */
export const TODAY = new Date("2026-09-10T09:20:00");

/* -------------------------------------------------------------------------- */
/* Clients (C01 / C02)                                                        */
/* -------------------------------------------------------------------------- */

export const clients = [
  {
    id: "cl-harbor",
    name: "Harbor & Finch",
    state: "active",
    contact: { name: "Marta Velasco", role: "Marketing Director", email: "marta@harborfinch.com" },
    contacts: [
      { name: "Marta Velasco", role: "Marketing Director", email: "marta@harborfinch.com", primary: true },
      { name: "Tomas Reiner", role: "Operations Lead", email: "tomas@harborfinch.com", primary: false },
    ],
    projectIds: ["pr-identity", "pr-site"],
    activeProjects: 2,
    nextAction: "Review requested on brand guidelines v3",
    nextActionTone: "waiting",
    nextActionDue: "2026-09-12",
    lastActivity: "2026-09-09T16:40:00",
    note: "Retainer conversation due after the site launches. Prefers Friday check-ins.",
  },
  {
    id: "cl-verity",
    name: "Verity Health",
    state: "active",
    contact: { name: "Dr. Anil Kapoor", role: "Founder", email: "anil@verityhealth.io" },
    contacts: [{ name: "Anil Kapoor", role: "Founder", email: "anil@verityhealth.io", primary: true }],
    projectIds: ["pr-onboarding"],
    activeProjects: 1,
    nextAction: "Send revised proposal",
    nextActionTone: "risk",
    nextActionDue: "2026-09-06",
    lastActivity: "2026-09-04T11:05:00",
    note: "Waiting on their legal review of the data-processing annex.",
  },
  {
    id: "cl-atlas",
    name: "Atlas Coffee Roasters",
    state: "active",
    contact: { name: "Priya Nandakumar", role: "Co-owner", email: "priya@atlasroasters.co" },
    contacts: [{ name: "Priya Nandakumar", role: "Co-owner", email: "priya@atlasroasters.co", primary: true }],
    projectIds: ["pr-packaging"],
    activeProjects: 1,
    nextAction: "Awaiting scope acceptance",
    nextActionTone: "waiting",
    nextActionDue: "2026-09-14",
    lastActivity: "2026-09-08T09:15:00",
    note: "Second location opening in November — packaging needed before then.",
  },
  {
    id: "cl-northgate",
    name: "Northgate Legal",
    state: "prospect",
    contact: { name: "Elena Sokolova", role: "Partner", email: "e.sokolova@northgate.legal" },
    contacts: [{ name: "Elena Sokolova", role: "Partner", email: "e.sokolova@northgate.legal", primary: true }],
    projectIds: [],
    activeProjects: 0,
    nextAction: "Discovery call notes to send",
    nextActionTone: "accent",
    nextActionDue: "2026-09-15",
    lastActivity: "2026-09-07T14:30:00",
    note: "Referred by Harbor & Finch. Cautious about client-facing document access.",
  },
  {
    id: "cl-lumen",
    name: "Lumen Architects",
    state: "inactive",
    contact: { name: "Sofia Brandt", role: "Studio Manager", email: "sofia@lumenarch.com" },
    contacts: [{ name: "Sofia Brandt", role: "Studio Manager", email: "sofia@lumenarch.com", primary: true }],
    projectIds: ["pr-wayfinding"],
    activeProjects: 0,
    nextAction: "No open work",
    nextActionTone: "neutral",
    nextActionDue: null,
    lastActivity: "2026-06-22T10:00:00",
    note: "Wayfinding project closed in June. Revisit for signage phase in 2027.",
  },
  {
    id: "cl-tidewater",
    name: "Tidewater Foundation",
    state: "archived",
    contact: { name: "Grace Okonkwo", role: "Programme Lead", email: "grace@tidewater.org" },
    contacts: [{ name: "Grace Okonkwo", role: "Programme Lead", email: "grace@tidewater.org", primary: true }],
    projectIds: [],
    activeProjects: 0,
    nextAction: "Archived record — read-only",
    nextActionTone: "neutral",
    nextActionDue: null,
    lastActivity: "2026-03-30T12:00:00",
    archivedOn: "2026-04-14",
    note: "Archived at client request. Access revoked separately.",
  },
];

/* -------------------------------------------------------------------------- */
/* Projects (P01 - P06)                                                       */
/* -------------------------------------------------------------------------- */

export const projects = [
  {
    id: "pr-identity",
    name: "Brand identity system",
    clientId: "cl-harbor",
    outcome: "A complete identity system the team can apply without asking us.",
    stage: "in-review",
    stageLabel: "In review",
    due: "2026-09-19",
    nextMilestone: "Guidelines approved",
    nextMilestoneDue: "2026-09-12",
    nextAction: "Review requested on brand guidelines v3",
    nextActionTone: "waiting",
    tasksDone: 18,
    tasksTotal: 21,
    reviewState: "waiting",
    reviewProgress: "1 of 1 approved · 1 awaiting decision",
    scopeAccepted: true,
    scopeAcceptedOn: "2026-07-18",
    startedOn: "2026-07-21",
    brief: "Harbor & Finch are repositioning from regional supplier to national specialty brand. The identity must survive long print runs, work at 16px in a procurement PDF and hold up on a trade-stand wall.",
    inScope: [
      "Wordmark and responsive logo lockups",
      "Colour and typography system",
      "Application guidelines (24 pages)",
      "Packaging and trade-stand applications",
    ],
    outOfScope: [
      "Website build (separate engagement)",
      "Photography production",
      "Print management and press checks",
    ],
    milestones: [
      { id: "ms-1", name: "Direction signed off", due: "2026-08-08", done: true },
      { id: "ms-2", name: "System applied to packaging", due: "2026-09-05", done: true },
      { id: "ms-3", name: "Guidelines approved", due: "2026-09-12", done: false },
      { id: "ms-4", name: "Handover and delivery", due: "2026-09-19", done: false },
    ],
    documentIds: ["doc-guidelines", "doc-proposal-hf", "doc-brief-hf"],
  },
  {
    id: "pr-onboarding",
    name: "Patient onboarding redesign",
    clientId: "cl-verity",
    outcome: "Cut onboarding drop-off by making the first ten minutes obvious.",
    stage: "at-risk",
    stageLabel: "At risk",
    due: "2026-10-02",
    nextMilestone: "Proposal accepted",
    nextMilestoneDue: "2026-09-06",
    nextAction: "Send revised proposal",
    nextActionTone: "risk",
    tasksDone: 4,
    tasksTotal: 16,
    reviewState: "none",
    reviewProgress: "No review requested",
    scopeAccepted: false,
    startedOn: "2026-08-28",
    brief: "Verity's intake form loses most patients at the insurance step. This engagement scopes the research and redesign of the first-run experience only.",
    inScope: ["Intake research synthesis", "Revised onboarding flow", "Component specification"],
    outOfScope: ["Engineering implementation", "Backend or claims integration"],
    milestones: [
      { id: "ms-5", name: "Proposal accepted", due: "2026-09-06", done: false },
      { id: "ms-6", name: "Research complete", due: "2026-09-22", done: false },
    ],
    documentIds: ["doc-proposal-verity"],
  },
  {
    id: "pr-site",
    name: "Website design",
    clientId: "cl-harbor",
    outcome: "A marketing site that converts trade enquiries.",
    stage: "planned",
    stageLabel: "Planned",
    due: "2026-11-14",
    nextMilestone: "Kick-off",
    nextMilestoneDue: "2026-09-26",
    nextAction: "Confirm kick-off date",
    nextActionTone: "accent",
    tasksDone: 0,
    tasksTotal: 12,
    reviewState: "none",
    reviewProgress: "Not started",
    scopeAccepted: true,
    scopeAcceptedOn: "2026-08-30",
    startedOn: null,
    brief: "Phase two of the Harbor & Finch work, deliberately sequenced after the identity system lands.",
    inScope: ["Sitemap and wireframes", "High-fidelity page design", "Design system handoff"],
    outOfScope: ["Build and CMS implementation"],
    milestones: [{ id: "ms-7", name: "Kick-off", due: "2026-09-26", done: false }],
    documentIds: ["doc-proposal-hf"],
  },
  {
    id: "pr-packaging",
    name: "Retail packaging range",
    clientId: "cl-atlas",
    outcome: "Shelf-ready packaging for the second location.",
    stage: "blocked",
    stageLabel: "On hold",
    due: "2026-10-24",
    nextMilestone: "Scope accepted",
    nextMilestoneDue: "2026-09-14",
    nextAction: "Awaiting scope acceptance",
    nextActionTone: "waiting",
    tasksDone: 2,
    tasksTotal: 9,
    reviewState: "none",
    reviewProgress: "No review requested",
    scopeAccepted: false,
    startedOn: null,
    brief: "Five-SKU retail range for the new location, using the existing roast-profile visual language.",
    inScope: ["Packaging structure", "Label artwork", "Print specification"],
    outOfScope: ["Photography", "Print buying"],
    milestones: [{ id: "ms-8", name: "Scope accepted", due: "2026-09-14", done: false }],
    documentIds: [],
  },
  {
    id: "pr-wayfinding",
    name: "Gallery wayfinding",
    clientId: "cl-lumen",
    outcome: "Signage system for the riverside gallery.",
    stage: "closed",
    stageLabel: "Closed",
    due: "2026-06-19",
    nextMilestone: "Delivered",
    nextMilestoneDue: "2026-06-19",
    nextAction: "Closed — delivery acknowledged",
    nextActionTone: "ok",
    tasksDone: 14,
    tasksTotal: 14,
    reviewState: "approved",
    reviewProgress: "Approved and delivered",
    scopeAccepted: true,
    scopeAcceptedOn: "2026-03-11",
    startedOn: "2026-03-16",
    brief: "Wayfinding and room signage for the new riverside gallery wing.",
    inScope: ["Signage system", "Installation drawings"],
    outOfScope: ["Fabrication and install"],
    milestones: [{ id: "ms-9", name: "Delivered", due: "2026-06-19", done: true }],
    documentIds: [],
  },
];

/* -------------------------------------------------------------------------- */
/* Tasks (W02 / P03)                                                          */
/* -------------------------------------------------------------------------- */

export const tasks = [
  {
    id: "tk-1",
    title: "Send revised proposal with staged payment schedule",
    projectId: "pr-onboarding",
    due: "2026-09-06",
    status: "todo",
    priority: "high",
    milestoneId: "ms-5",
    note: "Anil asked for the fee split across three milestones instead of two.",
    checklist: [
      { text: "Rebuild fee table", done: true },
      { text: "Confirm milestone dates with Anil", done: false },
      { text: "Regenerate PDF and attach", done: false },
    ],
    links: [{ label: "Proposal draft", href: "#/documents/doc-proposal-verity" }],
  },
  {
    id: "tk-2",
    title: "Chase Harbor & Finch on guidelines review",
    projectId: "pr-identity",
    due: "2026-09-11",
    status: "waiting",
    priority: "medium",
    milestoneId: "ms-3",
    note: "Request sent 3 Sept. Marta returns from leave on the 11th.",
    checklist: [],
    links: [{ label: "Review request", href: "#/review/rv-1" }],
  },
  {
    id: "tk-3",
    title: "Export packaging artwork at press resolution",
    projectId: "pr-identity",
    due: "2026-09-10",
    status: "in-progress",
    priority: "high",
    milestoneId: "ms-2",
    note: "CMYK conversion for the two spot colours.",
    checklist: [
      { text: "Convert to CMYK", done: true },
      { text: "Check total ink coverage", done: true },
      { text: "Export press-ready PDFs", done: false },
    ],
    links: [],
  },
  {
    id: "tk-4",
    title: "Prepare kick-off agenda for website design",
    projectId: "pr-site",
    due: "2026-09-24",
    status: "todo",
    priority: "low",
    milestoneId: "ms-7",
    note: "",
    checklist: [],
    links: [],
  },
  {
    id: "tk-5",
    title: "Archive Verity discovery recordings",
    projectId: "pr-onboarding",
    due: "2026-09-09",
    status: "todo",
    priority: "low",
    milestoneId: null,
    note: "Keep recordings out of the shared project surface.",
    checklist: [],
    links: [],
  },
  {
    id: "tk-6",
    title: "Confirm second-location opening date",
    projectId: "pr-packaging",
    due: "2026-09-16",
    status: "waiting",
    priority: "medium",
    milestoneId: "ms-8",
    note: "Blocks the print schedule.",
    checklist: [],
    links: [],
  },
  {
    id: "tk-7",
    title: "Apply type scale to packaging labels",
    projectId: "pr-identity",
    due: "2026-09-04",
    status: "done",
    priority: "medium",
    milestoneId: "ms-2",
    note: "",
    checklist: [],
    links: [],
  },
  {
    id: "tk-8",
    title: "Write guidelines section on clear space",
    projectId: "pr-identity",
    due: "2026-09-02",
    status: "done",
    priority: "medium",
    milestoneId: "ms-2",
    note: "",
    checklist: [],
    links: [],
  },
  {
    id: "tk-9",
    title: "Record scope acceptance for website design",
    projectId: "pr-site",
    due: "2026-08-30",
    status: "done",
    priority: "low",
    milestoneId: null,
    note: "",
    checklist: [],
    links: [],
  },
  {
    id: "tk-10",
    title: "Send discovery call notes to Northgate Legal",
    projectId: null,
    clientId: "cl-northgate",
    due: "2026-09-15",
    status: "todo",
    priority: "medium",
    milestoneId: null,
    note: "Not yet a project — belongs to the client record until scope is agreed.",
    checklist: [],
    links: [],
  },
];

/* -------------------------------------------------------------------------- */
/* Documents (D01 - D05) and immutable versions                               */
/* -------------------------------------------------------------------------- */

export const documents = [
  {
    id: "doc-guidelines",
    title: "Brand guidelines",
    type: "Deliverable",
    clientId: "cl-harbor",
    projectId: "pr-identity",
    workingVersion: 4,
    submittedVersion: 3,
    reviewState: "waiting",
    visibility: "shared",
    reviewer: "Marta Velasco",
    reviewDue: "2026-09-12",
    modified: "2026-09-09T16:40:00",
    sections: [
      "Positioning",
      "Wordmark",
      "Clear space and minimum size",
      "Colour",
      "Typography",
      "Applications",
      "Contact",
    ],
    internalNote: "Hold the motion section until the packaging range is signed off.",
    versions: [
      { n: 3, label: "v3 · Submitted", author: "Nadia Rahman", date: "2026-09-03T10:12:00", decision: "waiting", note: "Sent for review with the clear-space section rewritten." },
      { n: 2, label: "v2 · Superseded", author: "Nadia Rahman", date: "2026-08-19T15:30:00", decision: "changes", note: "Client asked for a wider colour range." },
      { n: 1, label: "v1 · Superseded", author: "Nadia Rahman", date: "2026-08-06T09:05:00", decision: "changes", note: "First submitted draft." },
    ],
  },
  {
    id: "doc-proposal-verity",
    title: "Proposal — onboarding redesign",
    type: "Proposal",
    clientId: "cl-verity",
    projectId: "pr-onboarding",
    workingVersion: 2,
    submittedVersion: 1,
    reviewState: "changes-requested",
    visibility: "private",
    reviewer: null,
    reviewDue: null,
    modified: "2026-09-04T11:05:00",
    sections: ["Context", "Objectives", "Scope", "Deliverables", "Schedule", "Fees", "Assumptions"],
    internalNote: "Fee split needs rebuilding to three milestones before this goes out.",
    versions: [
      { n: 1, label: "v1 · Submitted", author: "Nadia Rahman", date: "2026-08-28T13:00:00", decision: "changes", note: "Client asked for a staged payment schedule." },
    ],
  },
  {
    id: "doc-brief-hf",
    title: "Project brief — identity system",
    type: "Brief",
    clientId: "cl-harbor",
    projectId: "pr-identity",
    workingVersion: 1,
    submittedVersion: 1,
    reviewState: "approved",
    visibility: "shared",
    reviewer: "Marta Velasco",
    reviewDue: null,
    modified: "2026-07-18T10:00:00",
    sections: ["Goals", "Audience", "Constraints", "Success criteria"],
    internalNote: "",
    versions: [
      { n: 1, label: "v1 · Approved", author: "Nadia Rahman", date: "2026-07-18T10:00:00", decision: "approved", note: "Approved at kick-off." },
    ],
  },
  {
    id: "doc-welcome-atlas",
    title: "Welcome pack — Atlas Coffee",
    type: "Welcome pack",
    clientId: "cl-atlas",
    projectId: "pr-packaging",
    workingVersion: 1,
    submittedVersion: 0,
    reviewState: "draft",
    visibility: "private",
    reviewer: null,
    reviewDue: null,
    modified: "2026-09-08T09:15:00",
    sections: ["Next steps", "Milestones", "Required inputs"],
    internalNote: "Do not send until the scope is accepted.",
    versions: [],
  },
  {
    id: "doc-proposal-hf",
    title: "Proposal — website design",
    type: "Proposal",
    clientId: "cl-harbor",
    projectId: "pr-site",
    workingVersion: 1,
    submittedVersion: 1,
    reviewState: "approved",
    visibility: "shared",
    reviewer: "Marta Velasco",
    reviewDue: null,
    modified: "2026-08-30T14:20:00",
    sections: ["Context", "Objectives", "Scope", "Schedule", "Fees"],
    internalNote: "",
    versions: [
      { n: 1, label: "v1 · Approved", author: "Nadia Rahman", date: "2026-08-30T14:20:00", decision: "approved", note: "Approved with the phase-two assumption noted." },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Review requests (P05 / G03) — one designated approver each                 */
/* -------------------------------------------------------------------------- */

export const reviews = [
  {
    id: "rv-1",
    documentId: "doc-guidelines",
    projectId: "pr-identity",
    version: 3,
    reviewer: { name: "Marta Velasco", email: "marta@harborfinch.com", role: "Approver" },
    requestedOn: "2026-09-03T10:20:00",
    due: "2026-09-12",
    state: "waiting",
    outcome: null,
    comments: [
      {
        author: "Marta Velasco",
        initials: "MV",
        date: "2026-09-05T11:30:00",
        body: "The clear-space rule reads much better. One question on the reversed wordmark over photography — is there a minimum contrast rule?",
        internal: false,
      },
    ],
  },
  {
    id: "rv-0a",
    documentId: "doc-guidelines",
    projectId: "pr-identity",
    version: 2,
    reviewer: { name: "Marta Velasco", email: "marta@harborfinch.com", role: "Approver" },
    requestedOn: "2026-08-19T15:45:00",
    due: "2026-08-26",
    state: "changes-requested",
    outcome: "changes",
    closedOn: "2026-08-22T09:10:00",
    supersededBy: "rv-1",
    comments: [
      {
        author: "Marta Velasco",
        initials: "MV",
        date: "2026-08-22T09:10:00",
        body: "Requests changes — we need a wider secondary colour range for the trade-stand work, and the reversed logo needs its own section.",
        internal: false,
      },
    ],
  },
  {
    id: "rv-0b",
    documentId: "doc-brief-hf",
    projectId: "pr-identity",
    version: 1,
    reviewer: { name: "Marta Velasco", email: "marta@harborfinch.com", role: "Approver" },
    requestedOn: "2026-07-16T09:00:00",
    due: "2026-07-18",
    state: "approved",
    outcome: "approved",
    closedOn: "2026-07-18T10:00:00",
    comments: [],
  },
  {
    id: "rv-0c",
    documentId: "doc-proposal-verity",
    projectId: "pr-onboarding",
    version: 1,
    reviewer: { name: "Dr. Anil Kapoor", email: "anil@verityhealth.io", role: "Approver" },
    requestedOn: "2026-08-28T13:10:00",
    due: "2026-09-04",
    state: "changes-requested",
    outcome: "changes",
    closedOn: "2026-09-02T16:00:00",
    comments: [
      {
        author: "Dr. Anil Kapoor",
        initials: "AK",
        date: "2026-09-02T16:00:00",
        body: "Happy with the scope. Requests changes on payment terms — three milestones rather than two, please.",
        internal: false,
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Activity (W04) — review, feedback, approval and delivery events only      */
/* -------------------------------------------------------------------------- */

export const activity = [
  { id: "ev-1", type: "feedback", tone: "waiting", actor: "Marta Velasco", date: "2026-09-05T11:30:00", title: "commented on Brand guidelines v3", target: { label: "Brand guidelines · v3", href: "#/documents/doc-guidelines" }, read: false, resolves: "Still needs a decision — a comment does not resolve the review." },
  { id: "ev-2", type: "approved", tone: "approved", actor: "Marta Velasco", date: "2026-08-30T14:20:00", title: "approved Proposal — website design v1", target: { label: "Proposal — website design · v1", href: "#/documents/doc-proposal-hf" }, read: false, resolves: "Scope acceptance recorded." },
  { id: "ev-3", type: "changes", tone: "changes", actor: "Dr. Anil Kapoor", date: "2026-09-02T16:00:00", title: "requested changes on Proposal — onboarding redesign v1", target: { label: "Proposal — onboarding redesign · v1", href: "#/documents/doc-proposal-verity" }, read: true, resolves: "A revision is required before this can be resubmitted." },
  { id: "ev-4", type: "delivered", tone: "approved", actor: "Nadia Rahman", date: "2026-06-19T15:00:00", title: "delivered Gallery wayfinding package to Sofia Brandt", target: { label: "Delivery · Gallery wayfinding", href: "#/projects/pr-wayfinding?tab=delivery" }, read: true, resolves: "Acknowledgment pending." },
  { id: "ev-5", type: "approved", tone: "approved", actor: "Sofia Brandt", date: "2026-06-24T09:40:00", title: "acknowledged the Gallery wayfinding package", target: { label: "Delivery · Gallery wayfinding", href: "#/projects/pr-wayfinding?tab=delivery" }, read: true, resolves: "Acknowledgment is separate from approval." },
  { id: "ev-6", type: "waiting", tone: "waiting", actor: "Nadia Rahman", date: "2026-09-03T10:20:00", title: "requested review on Brand guidelines v3 from Marta Velasco", target: { label: "Brand guidelines · v3", href: "#/documents/doc-guidelines" }, read: true, resolves: "Waiting on the designated approver." },
];

/* -------------------------------------------------------------------------- */
/* Delivery packages (P06 / G04)                                              */
/* -------------------------------------------------------------------------- */

export const deliveries = [
  {
    id: "dl-1",
    projectId: "pr-identity",
    title: "Identity system handover",
    recipient: { name: "Marta Velasco", email: "marta@harborfinch.com" },
    state: "blocked",
    stateLabel: "Missing approval",
    deliveredOn: null,
    acknowledgedOn: null,
    notes: "Hold until guidelines v3 is approved. Do not include the motion files.",
    files: [
      { name: "Brand guidelines v3", kind: "pdf", meta: "PDF · approved version pending", approved: false },
      { name: "Logo package v2", kind: "zip", meta: "ZIP · 18.4 MB · approved", approved: true },
      { name: "Colour specification v1", kind: "pdf", meta: "PDF · 240 KB · approved", approved: true },
    ],
  },
  {
    id: "dl-2",
    projectId: "pr-wayfinding",
    title: "Wayfinding signage system",
    recipient: { name: "Sofia Brandt", email: "sofia@lumenarch.com" },
    state: "delivered",
    stateLabel: "Delivered",
    deliveredOn: "2026-06-19T15:00:00",
    acknowledgedOn: "2026-06-24T09:40:00",
    notes: "Installation drawings at 1:20. Fabricator contact details included.",
    files: [
      { name: "Signage system v4", kind: "pdf", meta: "PDF · 12.1 MB · approved", approved: true },
      { name: "Installation drawings v2", kind: "pdf", meta: "PDF · 8.6 MB · approved", approved: true },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Access grants (S03 / G01) — recipient + object + permissions + expiry      */
/* -------------------------------------------------------------------------- */

export const grants = [
  {
    id: "gr-1",
    recipient: { name: "Marta Velasco", email: "marta@harborfinch.com" },
    role: "Guest reviewer",
    object: "Brand guidelines · v3",
    objectType: "Review request",
    permissions: ["Read granted version", "Comment", "Approve or request changes", "Download permitted files"],
    state: "active",
    invited: "2026-09-03T10:15:00",
    lastActivity: "2026-09-05T11:30:00",
    expires: "2026-09-19",
  },
  {
    id: "gr-2",
    recipient: { name: "Dr. Anil Kapoor", email: "anil@verityhealth.io" },
    role: "Guest reviewer",
    object: "Proposal — onboarding redesign · v1",
    objectType: "Review request",
    permissions: ["Read granted version", "Comment", "Approve or request changes"],
    state: "active",
    invited: "2026-08-28T13:05:00",
    lastActivity: "2026-09-02T16:00:00",
    expires: "2026-09-11",
  },
  {
    id: "gr-3",
    recipient: { name: "Sofia Brandt", email: "sofia@lumenarch.com" },
    role: "Guest viewer",
    object: "Wayfinding signage system",
    objectType: "Delivery package",
    permissions: ["Read granted content", "Download permitted files"],
    state: "revoked",
    invited: "2026-06-19T14:50:00",
    lastActivity: "2026-06-24T09:40:00",
    expires: null,
    revokedOn: "2026-08-15",
  },
  {
    id: "gr-4",
    recipient: { name: "Priya Nandakumar", email: "priya@atlasroasters.co" },
    role: "Guest reviewer",
    object: "Retail packaging range",
    objectType: "Invitation",
    permissions: ["Read shared project summary"],
    state: "pending",
    invited: "2026-09-08T09:20:00",
    lastActivity: null,
    expires: "2026-09-22",
  },
  {
    id: "gr-5",
    recipient: { name: "Tomas Reiner", email: "tomas@harborfinch.com" },
    role: "Guest viewer",
    object: "Shared project · Brand identity system",
    objectType: "Project summary",
    permissions: ["Read approved shared summary", "Read delivery packages"],
    state: "expired",
    invited: "2026-07-21T09:00:00",
    lastActivity: "2026-08-02T10:10:00",
    expires: "2026-08-16",
  },
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

export function client(id) {
  return clients.find((c) => c.id === id) || null;
}

export function project(id) {
  return projects.find((p) => p.id === id) || null;
}

export function documentRecord(id) {
  return documents.find((d) => d.id === id) || null;
}

export function task(id) {
  return tasks.find((t) => t.id === id) || null;
}

export function review(id) {
  return reviews.find((r) => r.id === id) || null;
}

export function delivery(id) {
  return deliveries.find((d) => d.id === id) || null;
}

export function projectsOfClient(clientId) {
  return projects.filter((p) => p.clientId === clientId);
}

export function documentsOfProject(projectId) {
  return documents.filter((d) => d.projectId === projectId);
}

export function tasksOfProject(projectId) {
  return tasks.filter((t) => t.projectId === projectId);
}

export function tasksOfClient(clientId) {
  const ids = projectsOfClient(clientId).map((p) => p.id);
  return tasks.filter((t) => ids.includes(t.projectId) || t.clientId === clientId);
}

export function reviewsOfProject(projectId) {
  return reviews.filter((r) => r.projectId === projectId);
}

export function deliveryOfProject(projectId) {
  return deliveries.find((d) => d.projectId === projectId) || null;
}

export function grantsOf(objectLabel) {
  return grants.filter((g) => g.object === objectLabel);
}

/* Relative day maths, pinned to TODAY so the design never drifts. */
export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const then = new Date(dateStr.length <= 10 ? dateStr + "T00:00:00" : dateStr);
  const base = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
  const target = new Date(then.getFullYear(), then.getMonth(), then.getDate());
  return Math.round((target - base) / 86400000);
}

export function dueLabel(dateStr) {
  const d = daysUntil(dateStr);
  if (d === null) return "No date";
  if (d === 0) return "Due today";
  if (d === 1) return "Due tomorrow";
  if (d === -1) return "1 day overdue";
  if (d < 0) return Math.abs(d) + " days overdue";
  if (d < 7) return "Due in " + d + " days";
  return "Due " + formatDate(dateStr);
}

export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value.length <= 10 ? value + "T00:00:00" : value);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatShortDate(value) {
  if (!value) return "—";
  const d = new Date(value.length <= 10 ? value + "T00:00:00" : value);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function formatTime(value) {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function relative(value) {
  if (!value) return "—";
  const d = new Date(value);
  const mins = Math.round((TODAY - d) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return mins + "m ago";
  const hours = Math.round(mins / 60);
  if (hours < 24) return hours + "h ago";
  const days = Math.round(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return days + "d ago";
  if (days < 30) return Math.round(days / 7) + "w ago";
  return formatDate(value);
}

export function initials(name) {
  return name
    .replace(/^(Dr\.|Mr\.|Ms\.|Mrs\.)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function countTasks(projectId) {
  const list = tasksOfProject(projectId);
  return { total: list.length, done: list.filter((t) => t.status === "done").length };
}
