# CoreDesk — Product Context

**Status:** PHASE 0 output. Stable reference. Revised only by explicit instruction.
**Derived from:** four Figma sources listed in §0. Nothing here is invented; proposals are labelled **[PROPOSED]**.

---

## 0. Sources and their authority

| # | Source | Kind | What it is authoritative for |
|---|---|---|---|
| S1 | `CoreDesk Client Lifecycle` (FigJam board) | Flow diagram | The end-to-end commercial journey and its ordering |
| S2 | `CoreDesk Product Architecture` (FigJam board) | Tree diagram | Capability decomposition, sub-app boundaries, Home/Client groupings |
| S3 | `CoreDesk Product Roadmap` (link supplied) | — | **Not retrievable.** See §8, Conflict C1 |
| S4 | `CoreDesk — Product UI Exploration` (Figma design) | 6 planning sheets + Foundations frame | Tokens, page contracts, IA, lifecycle rules, release boundaries |

**Authority ranking when sources disagree:**

1. **S4 planning sheets** (brief, IA, lifecycles, page inventory, roadmap, validation) — most recent, most specific, self-describes as *"a proposed baseline, not a claim that features already exist."*
2. **S4 Foundations frame** `[3:9]` — the only source of concrete visual tokens.
3. **S1 / S2 boards** — earlier ideation. Broader than V1. Useful for flow order and grouping names; **not** authoritative on scope.
4. **S3** — unavailable.

S4 carries the banner *"PROPOSED SCOPE — NOT THE PRINCIPAL PRODUCT DIRECTION"* on every sheet. It is a proposal to be ratified, not shipped truth. Where it conflicts with the user's phase brief, **the user's brief wins**.

---

## 1. Understanding of CoreDesk

### 1.1 One-sentence product
A desktop workspace in which one independent professional runs a client relationship end to end — proposal, agreement, onboarding, project, work, review, revision, approval, delivery, history — without the context scattering across separate tools.

### 1.2 The problem it exists to solve
In a solo practice the work is not hard; **the bookkeeping of the work is hard.** The proposal is in one tool, the brief in another, the file versions in a folder, the approval in an email thread, the delivery link in a chat message. Six months later nobody can answer *"which version did they approve, and what did we actually send?"*

CoreDesk's whole value is that this question always has one answer, in one place.

### 1.3 The organising belief
> **The product is the loop, not the screens.**

S4's feature map states it directly: *"A complete client-work loop is the product."* V1 is not a set of features; it is one continuous path from first contact to final delivery with no context loss at any hop. Every design decision is judged by whether it protects that continuity.

### 1.4 The second belief: context is a first-class object
The reason client work fragments is that tools store *documents* but not *the relationship between documents*. CoreDesk's differentiator is persistent Client → Project → Document context. A screen that shows a task without saying whose project it belongs to has failed, regardless of how it looks.

### 1.5 The three records, and why the distinction is load-bearing
S4's brief is emphatic that three things that look similar are structurally different:

- **CLIENT** — the *ongoing relationship*. Outlives any engagement.
- **PROJECT** — *one scoped engagement* with an outcome.
- **DOCUMENT** — a *versioned piece of work*.

Consequences that follow, and that the UI must never violate:
- Finishing a project **does not** archive its client (S4 lifecycles, stated twice).
- Archiving a client **does not** reopen or close projects; open projects must be resolved first.
- Deleting a project must never delete the relationship history attached to the client.
- No single project stage may stand in for the health of the whole relationship (S4, C02: *"No single linear project stage stands in for the whole relationship"*).

### 1.6 Who it is for
V1 assumes **one workspace owner** — a freelancer or solo agency principal — running their own business, plus **external clients who enter a small invite-only review surface.** Internal team seats, roles, and multi-workspace management are explicitly later.

### 1.7 What V1 must make true
From S4's validation sheet, the five acceptance gates:

1. **First meaningful work** — owner creates client + project + first task in ≤5 min unaided; the same task appears once across project work, global tasks and Home.
2. **Review and revision integrity** — v1 submitted, changes requested, v2 approved; v1 content, feedback and outcome stay readable.
3. **Access isolation** — Guest A cannot reach Client B by navigation, search or direct link.
4. **Delivery correctness** — package holds the *exact approved versions*; unapproved required work blocks delivery.
5. **Recovery and history** — failed save/export/upload retains recoverable input; repeated clicks do not duplicate events; archive/restore preserves links.

### 1.8 What CoreDesk is not
Generic CRM · generic SaaS dashboard · Notion clone · Trello clone · AI chatbot with a sidebar · a collection of unrelated cards · an IDE in V1 · a finance suite in V1.

The sharpest formulation of the anti-pattern is S4's own scope rule: *"A new specialist application does not enter V1 by becoming another sidebar item."*

---

## 2. Canonical object model

### 2.1 Ownership hierarchy

```
Workspace (1)
 ├─ Professional Profile / Settings (1)      ← business identity, defaults
 ├─ Clients (many)
 │   ├─ Contacts (many)
 │   ├─ Private Notes (many)
 │   ├─ Relationship History (events)
 │   └─ Projects (many)
 │       ├─ Milestones (many)
 │       ├─ Tasks (many)
 │       ├─ Documents (many)
 │       │   └─ Document Versions (many, immutable once submitted)
 │       │       └─ Review Requests (many over time, one open at a time)
 │       ├─ Files / References (many)
 │       ├─ Delivery Packages (many)
 │       └─ Activity (events)
 ├─ Inbox (derived)                          ← S2 only
 ├─ Access Grants (many)                     ← recipients × objects × actions
 └─ Activity (events)
```

### 2.2 Cardinality rules (S4 IA — normative)

| Relation | Cardinality | Rule |
|---|---|---|
| Workspace → Client | 1 : many | — |
| Client → Contact | 1 : many | One is designated **primary contact** |
| Client → Project | 1 : many | Active **and** past projects both live on the client |
| Project → Task | 1 : many | **One project owns each task** |
| Project → Milestone | 1 : many | Tasks group under milestones |
| Project → Document | 1 : many | **A document belongs to exactly one project in V1** |
| Document → Version | 1 : many | Versions are **immutable** once submitted |
| Version → Review Request | 1 : many | Over time; **one open request per deliverable in V1** |
| Review Request → Approver | 1 : 1 | **One designated approver per request** |
| Delivery Package → Version/File | many : many | Pins **exact approved versions + immutable file revisions** |
| Access Grant → Recipient + Object | 1 : 1 : 1 | Grant = recipient + object + permissions + expiry |

### 2.3 The eleven record types

| Record | Definition | Lifecycle states |
|---|---|---|
| **Client** | The ongoing business relationship | Prospect → Active → Inactive → Archived |
| **Contact** | A person at the client | — (no lifecycle) |
| **Project** | One scoped engagement with an outcome | Draft → Planned → Active → In review → Ready to deliver → Delivered → Closed → Archived |
| **Milestone** | A dated checkpoint inside a project | — |
| **Task** | One actionable unit of work owned by a project | To do → In progress → Done; Cancelled |
| **Document** | A versioned piece of client/project work | Working draft → Submitted → Approved → (in delivery) → Archived |
| **Document Version** | Immutable submitted/saved milestone snapshot | v1, v2, v3… each: Submitted → Approved / Changes requested → Superseded |
| **Review Request** | A request for a decision on one exact version | Pending → Approved / Changes requested / Withdrawn / Superseded |
| **Delivery Package** | The exact approved versions/files handed to the client | Draft → Ready → Delivered → (new revision on change) |
| **Access Grant** | Entitlement for one recipient to one object | Invited → Verified/Active → Expired / Revoked |
| **Activity Event** | A recorded actor/time/object/outcome fact | Immutable |

### 2.4 Three dimensions that must never be collapsed

S4's lifecycles sheet is explicit: **lifecycle state, attention flags, and access are different dimensions.** Collapsing them is the single most likely modelling error.

- **Lifecycle state** — where the record is in its own progression. One value.
- **Attention flag** — Overdue · Waiting on client · Blocked. **Not stages.** Orthogonal, and multiple can be true at once. Each must show *responsible person, reason, and due date*.
- **Access** — who may see it. Independent of both. Archiving does not revoke access; revoking access does not archive.

> A project can be `Active` + `Blocked` + `client can see zero documents` simultaneously. Any UI that models these as one enum is wrong.

### 2.5 Identity resolution rule (anti-duplication)

S4 is unambiguous: **Tasks and Documents are global views of project-owned records.**

- Home, Tasks and Project Work show **the same task record**, not copies.
- The Documents library and Project → Documents show **the same document record**.
- Creating from a global view requires **selecting a project first**.
- *"A reference link does not duplicate ownership."*
- Client-level notes live in **C02 only**.
- **Client Kit is a filtered document set, not an entity.**

### 2.6 Version immutability rules

1. **Never overwrite a submitted version.** Ever.
2. Submitting **freezes** version + assets + reviewer + due date together.
3. Comments and decisions **belong to that version and that request.**
4. **Approval never transfers to a new revision.** A revision without a decision is unapproved.
5. A newer draft **does not replace** the version under review.
6. A new submission **closes/supersedes** the prior pending request.
7. Withdrawing closes the request; **history remains.**
8. Superseded versions are **marked, not erased.**
9. Selecting a revised version as required delivery **invalidates Ready status** until approved. *Creating a private draft alone does not.*

---

## 3. Client-work lifecycle

### 3.1 The master journey

Synthesised from S1 (board), S4 inventory, and S4 lifecycles. Stages are the *owner's* mental model; the bracketed items are the records that carry them.

**Relationship arc**
```
Lead / new client
  → Client Profile                    [Client: Prospect]
  → Proposal created · templated · previewed · sent   [Document: Proposal]
  → Accepted
  → Agreement                          [Document: Agreement record]
  → Welcome pack                       [Document: Welcome pack]
  → Questionnaire                      [Document / File]
  → Assets & access received           [Files, Access]
  → Kickoff                            [Milestone]
  → Project created                    [Project: Planned → Active]
```

**Engagement arc**
```
Project created
  → Brief · scope · milestones · tasks · files        [Project Overview / Work]
  → Document work · drafts · autosave                  [Document: Working draft]
  → Submit for review → freeze numbered version        [Version v1: Submitted]
  → Client review → Approve | Request changes          [Review Request]
       ├─ Changes requested → new draft v2 → submit v2 → client decision
       └─ Approved
  → Delivery package of exact approved versions        [Package]
  → Client download + optional acknowledgment
  → Completion report
  → Close project → Archive → History
  → Ongoing relationship (client returns to Active)
```

**Deferred from S1:** `AI Draft + Edit` → later (see C3). `Invoice / Receipt` → V2 Finance. `Client Portal / Ongoing Relationship` → the V2/ongoing notion; V1 has the frozen guest surface. `Automations`, `Scraping`, `Growth` → later sub-apps.

### 3.2 Client states (relational)

| Transition | Trigger / rule |
|---|---|
| Prospect → Active | **First scope acceptance is recorded** |
| Active → Inactive | **No open engagement remains** |
| Inactive → Active | A new engagement starts |
| → Archived | Resolve or move open projects first; history preserved |
| Restore | **Reopens the relationship record, not old projects** |

### 3.3 Project states (transactional)

| State | Entered when |
|---|---|
| Draft | Capture client, outcome, scope, owner |
| Planned | Owner records **accepted scope + date + evidence** |
| Active | Work begins |
| In review | Owner submits required deliverables |
| Ready to deliver | **All required deliverables have approved versions** |
| Delivered | Package sharing **or** external handoff recorded |
| Closed | Owner confirms completion |
| Archived | Read-only history, restorable |

**Exceptions:** `On hold` stores reason + previous state (Resume returns there) · `Cancelled` preserves work, closes pending reviews · Changes requested returns *In review → Active* · Reopening Delivered/Closed → Active creates a **new work cycle** while **prior delivery stays immutable**.

### 3.4 Document + review states

```
Working draft → Submitted v1 → Approved v1
                            ↘ Changes requested
New draft v2 → Submitted v2 → Approved v2
Approved version → included in Delivery → Archived
```

### 3.5 Delivery rules

- Package = **exact approved required versions + immutable supporting file revisions**.
- Name package, recipient, handoff notes → preview contents → share **or** record external handoff.
- Record **delivered date and method**.
- Guest downloads; **acknowledgment is separate and optional.**
- **Missing approvals or missing files block final delivery.**
- Changing a package **creates a new package revision.** Replacing an upload **cannot alter a delivered package.**
- **Acknowledgment does not retroactively approve work.**

### 3.6 Transition guards (S4 access sheet — testable, not advisory)

1. Unsaved / failed-save content **cannot** be submitted.
2. **One open request per deliverable** in V1.
3. Approving a **stale or withdrawn** request is rejected.
4. Repeated submit/decision clicks **do not duplicate events**.
5. Reassigning a reviewer **closes the old request and creates a new one**.
6. Every event records **actor, time, version, outcome**.
7. "Changes requested" **requires a comment**.
8. **Only the designated reviewer** can decide.

> These eight are the highest-value prototype wiring in the product. If a build permits a wrong outcome, the build is wrong.

---

## 4. V1 navigation

### 4.1 Owner workspace — persistent navigation

Per S4 IA. **Eight destinations, no more.**

| Nav item | Route | Screen contract |
|---|---|---|
| **Home** | `/home` | W01 |
| **Clients** | `/clients` | C01 |
| **Projects** | `/projects` | P01 |
| **Tasks** | `/tasks` | W02 |
| **Documents** | `/documents` | D01 |
| **Activity** | `/activity` | W04 |
| **Archive** | `/archive` | W05 |
| **Settings** | `/settings/*` | S01–S03 |

**Global search (W03)** is **one overlay**, not a nav item. Keyboard-first (`Ctrl/⌘+K`, `/`).

### 4.2 Nested routes — surfaces inside objects, not new nav items

```
/clients/:client                          C02 Client Detail
   sections: Overview · Projects · Documents · Journey · Communication · Notes · History

/projects/:project                        Project Workspace
   tabs: Overview [P02] · Work [P03] · Documents & Files [P04]
         Reviews [P05] · Delivery [P06]

/documents/:document                      D02 Document Workspace
   views: structure · editor · preview [D03] · history [D04] · review status · export
```

**Rule:** these are *tabs/views of one workspace*, not duplicate applications. Client tabs are **sections of C02**. Project tabs **share one context header**.

### 4.3 Public / entry routes

```
/                        A01 Auth Entry
   ├─ /signin            A02 Sign In
   ├─ /signup            A03 Sign Up
   ├─ /verify            A04 Verify Email
   └─ /recover           A05 Recover Access (two steps)
/setup                   A06 Onboarding
/terms  /privacy         A07–A08 (publicly reachable at all times)
```

### 4.4 Guest surface — deliberately separate

```
/review-access/:invite   G01 Invite & Verify
/shared/:project         G02 Shared Project
/review/:request         G03 Review Version
/delivery/:package       G04 Delivery
```

**Guests never inherit the owner navigation.** Guest routes expose only explicitly granted objects. *"An invitation never gives workspace-wide access."*

### 4.5 Navigation rules

- **Breadcrumb:** `Client → Project → Document`. Final segment is primary text and non-interactive.
- **Back** returns to prior view **including filters and selection**.
- **App switcher appears only when a second app ships.** No inactive future-app links in V1 nav.
- **Cross-navigation consistency:** every tab can open its source document/task. Review and delivery **never create parallel copies.**

---

## 5. V1 scope boundary

### 5.1 In V1

**Auth / Entry (A01–A08)** — Auth entry · Sign in · Sign up · Email verification · Password recovery · First-run onboarding · Terms · Privacy.

**Workspace (W01–W05)** — Home · Tasks (+ detail panel) · Global search overlay · Activity · Archive.

**Clients (C01–C02)** — Client library · Client detail · Contacts · Private notes · Relationship history · Client's projects · Next client action.

**Projects (P01–P06)** — Projects library · Create flow (client → brief/scope → dates → summary) · Project workspace with Overview / Work / Documents & Files / Reviews / Delivery / Activity.

**Documents (D01–D05)** — Documents library · Document workspace · Proposal · Agreement record · Welcome/onboarding documents · Project brief · Scope · Deliverable documents · Structured section editing · Autosave/recovery · Preview · PDF export · Version history · Immutable submitted versions. **V1 block set: text, headings, lists, image, simple table.**

**Client review (G01–G04)** — Invite-only guest access · Client verification · Shared project · Document review · Comments · Request changes · Approve exact version · Delivery access.

**Settings (S01–S03)** — Account & workspace · Professional defaults · Client access.

**System** — Scoped permissions · Private by default · Activity logging · Archive/restore · In-app notification states · Transactional invite/access email.

### 5.2 Out of V1

| Tier | Items |
|---|---|
| **V1.1** | Internal team seats & roles · multiple reviewers · reusable custom templates · import/export improvements · email/calendar connections · reminders · automations · optional AI drafting · local/cloud AI controls · approval workflow (reviewer lists/order) |
| **V2** | **Portfolio** (case studies, editor, publish) · **Finance** (estimates, invoices, payments, expenses, reports) — native e-sign and payment providers need separate discovery |
| **V3** | **Developer** (Overview, Code, CLI, Agents) — separate workbench, own discovery |

**Also explicitly excluded from V1 documents:** AI generation · template builder · real-time coediting · electronic signing · integrated email sending. **V1 approval is a review decision, not a legal signature.**

**Board-only items with no V1 contract:** Inbox · Growth (Discovery, Campaigns, Opportunities, Scraping) · Analytics/Runs · Client Portal/Email actions · Document reminders. Not in S4's V1 inventory; treat as later or superseded.

### 5.3 Never in V1 navigation

Portfolio · Finance · Developer · members/roles · templates · connections · automations · AI settings. *"No inactive future-app links in the V1 navigation."*

---

## 6. Page contracts — required content, actions, states

Condensed from S4's six inventory sheets. **These are contracts, not wireframes.**

| ID | Screen | Must contain | Primary actions | Essential states |
|---|---|---|---|---|
| **A01** | Auth Entry | Identity, short promise, Sign in, Create account, Terms, Privacy | Choose entry path | loading · service unavailable · already signed in |
| **A02** | Sign In | Email, password, recovery link, sign-up link | Sign in; **retain intended destination** | invalid credentials · verification needed · rate limit · network failure · expired session |
| **A03** | Sign Up | Name, email, password requirements, Terms/Privacy acknowledgment | Create account → verification | existing email · weak password · validation & submission failure |
| **A04** | Verify Email | Masked address, instructions, resend cooldown | Verify · resend · correct email | pending · success · expired/used link · retry |
| **A05** | Recover Access | Step 1 email request; step 2 new password + confirmation | Request reset · save new password | generic receipt · invalid/expired token · mismatch · success · network retry |
| **A06** | Onboarding | Owner name, workspace name, timezone, optional brand/service defaults; **first-client step** | Save workspace · create first client or skip | progress saved · resume · validation · failure |
| **A07/A08** | Terms / Privacy | Version + effective date, owner-supplied copy, contact route, return link | Read and return | content unavailable with recovery route |
| **W01** | Home | Due/overdue work, awaiting client, new decisions, next actions, recently opened; **each item names its client/project** | Resume · open item · create client/project | first run · all clear · loading · partial failure |
| **W02** | Tasks | Title, project/client, due, status, priority, milestone, owner; Today/Upcoming/Waiting/Done filters | Add · edit · complete · postpone · open project | empty / filter-empty · overdue · blocked · save failure |
| **W03** | Search | Query, grouped client/project/document/task results, context, recents | Keyboard select · open · clear · close | no query · searching · no results · failure |
| **W04** | Activity | Review requests, feedback, approval, delivery events; unread/all; actor, time, linked record | Open source · mark read · filter | empty · deleted/unavailable target · retry |
| **W05** | Archive | Clients/projects/documents, archive date, prior context, search | Inspect history · restore · filter | empty · missing parent · restore conflict |
| **C01** | Clients | Name, relationship state, primary contact, active project count, next action, last activity | Add · search/filter · open | no clients · filter-empty · **duplicate warning** |
| **C02** | Client Detail | Profile/contacts; active & past projects; document set; private notes; relationship history; next action | Edit contact · add project · open documents · change state · archive/restore | prospect/no projects · inactive · archived |
| **P01** | Projects | Name, client, outcome, stage, due, next milestone, next action, review progress | Create · filter · sort · open | empty · incomplete draft · overdue · on hold |
| **P02** | Project Overview | Brief, scope/out-of-scope, owner, client, dates, stage, milestones, key links, next action, recent history | Edit scope/dates · record scope acceptance · change stage · hold | draft/planned · active · blocked · cancelled · closed |
| **P03** | Project Work | Tasks, milestone grouping, due dates, status, **readable progress count** | Add/reorder · edit milestone · complete | no tasks · completed · overdue · on hold |
| **P04** | Documents & Files | Title, type, latest draft/submitted version, review state, visibility, modified; file name/size | Create doc · upload · attach link · open | empty · upload progress/failure · unsupported file · unavailable link |
| **P05** | Reviews | Requested version, designated reviewer, due date, outcome, comments, pending action | Request · open feedback · withdraw · create revision | none pending · waiting · overdue · changes requested · approved · superseded |
| **P06** | Delivery | Exact approved versions/files, package title, recipient, handoff notes, delivery date, acknowledgment | Preview as client · share · copy link · record external handoff · close project | missing approval/file · ready · delivered · access revoked |
| **D01** | Documents | Title/type, client/project, **working and submitted version**, review state, visibility, reviewer, due | Filter/search · open · create in project | empty · filter-empty · archived · load failure |
| **D02** | Document Workspace | Title/type, client/project, section outline, body, save status, current version, internal notes, **separate client feedback** | Edit · reorder · save · preview · submit · revise · export | unsaved/saving/saved · failed save · conflicting edit · read-only shared version · missing assets |
| **D03** | Preview & Export | Paginated preview, title/version, brand/template choice, export status | Return to edit · export PDF · open review setup | overflow issue · rendering · export failure · success |
| **D04** | Version History | Numbered submitted versions, author/date, decision status, delivery references | Inspect old version · **copy to a new draft** | no submitted version · current · superseded |
| **D05** | Review & Share Setup | Exact version preview, verified recipient, role, due date, permissions, optional note | Preview as guest · grant/request access · copy link · revoke/withdraw | missing recipient · saving draft · conflicting open request · success/failure |
| **G01** | Invite & Verify | Business identity, masked recipient, project context, access instructions | Verify identity · enter assigned work | expired/revoked invite · wrong account · resend · unavailable |
| **G02** | Shared Project | Approved shared summary, review requests, delivery packages, requested action/date | Open assigned review or delivery | no shared work · waiting · complete · revoked |
| **G03** | Review Version | Immutable version, brief/context, reviewer, due date, client comments, decision, receipt | Comment · approve · request changes | pending · submitting · already decided · withdrawn/superseded · unauthorized |
| **G04** | Delivery | Package, exact versions/files, handoff notes, sender/date, permitted downloads | Download · acknowledge receipt | unavailable file · failure · revoked access |
| **S01** | Account & Workspace | Name/email, password/session, workspace name/timezone, notification prefs, Terms/Privacy links | Update · sign out · request data export/deletion | validation · pending verification · failure |
| **S02** | Professional Defaults | Business/contact details, services, default fee items, document logo/colors, proposal defaults | Update · preview · restore defaults | unsaved · invalid asset/value · saved |
| **S03** | Client Access | Recipients, project/document grants, reviewer role, invitation state, last activity | Invite · resend · revoke · inspect guest preview | pending · active · expired · revoked |

**Document type requirements:** *Proposal* = context, objectives, scope, deliverables, schedule, fee table, assumptions. *Agreement record* = parties, scope reference, uploaded/external agreement, acceptance evidence. *Brief* = goals, audience, constraints, success criteria. *Welcome pack* = next steps, milestones, required inputs. *Notes/deliverable* = free body, attachments, handoff.

### 6.1 Shared V1 state contract

Every surface covers **loading, empty, failure/retry, unauthorized, unavailable record** where relevant. Editing covers **dirty / saving / failed save, safe navigation, stale updates.** Destructive actions **name affected records**; archive offers **restore**. Guest work is **usable on mobile and keyboard.**

### 6.2 Access model

| Principal | May |
|---|---|
| **Owner** | Create/edit all Core records; control sharing, review requests, delivery, archive, restore. Internal notes and working drafts private by default. |
| **Guest reviewer** | Read granted versions + shared project context; comment; approve or request changes **only when designated**; download permitted files. **Cannot** see internal notes, search the workspace, edit drafts, or invite others. |
| **Guest viewer** | Read/download explicitly granted content. **Cannot** approve or manage access. |

Grant = **recipient + object + permissions + expiry.** No inherited access to sibling projects/documents. **Client membership alone grants no content.** **Preview must match the real guest experience.**

---

## 7. Visual foundation (Foundations frame `[3:9]` — the only token source)

**Positioning line:** *"Desktop-first. Graphite structure. Cobalt as a signature, not decoration."*

### 7.1 Colour

| Token | Hex | Role |
|---|---|---|
| `canvas` | `#0B0D0F` | Application background |
| `sidebar` | `#0F1215` | Navigation rail |
| `surface` | `#12161A` | Panels, work surfaces |
| `raised` | `#171C21` | Nested rows, controls, inputs |
| `divider` | `#262C33` | Every 1px separator |
| `edge` | `#323A43` | Control outlines, modal edges |
| `text` | `#F4F6F8` | Headings and body |
| `muted` | `#A8B0BA` | Secondary copy |
| `metadata` | `#737D88` | Timestamps, hints, counts |
| `accent` | `#2F6FEB` | Primary action, active state |
| `active` | `#3FA66B` | Active, approved, delivered, complete |
| `waiting` | `#D49A3A` | Waiting, pending, in progress, changes requested |
| `risk` | `#D65A5A` | At risk, overdue, blocked, revoked |

Tints at 10–12% opacity. **Light theme exists only as a derived palette — it is not approved in Figma.**

### 7.2 Type — Inter only

| Style | Size / line | Weight |
|---|---|---|
| display/page | 30 / 36 | 700 |
| title/section | 20 / 24 | 700 |
| title/card | 16 / 19 | 600 |
| body/default | 14 / 17 | 400 |
| body/strong | 14 / 17 | 600 |
| label/default | 13 / 16 | 500 |
| meta/default | 12 / 15 | 500 |
| label/eyebrow | 11 / 14 | 600, 0.08em, uppercase |

### 7.3 Geometry

Card radius **9** · Control radius **7** · Primary control height **40–44** · Divider **1px** · Sidebar **236px** · Page padding **28px** · Card padding **20px** · Grid gap **16px**. Elevation: overlay `0 12px 32px rgba(0,0,0,.34)`, modal `0 24px 64px rgba(0,0,0,.44)`. **No shadows on cards.**

### 7.4 The six rules (constraints, not suggestions)

1. No glow or glassmorphism — **amended, see §7.8**
2. No bright-outline buttons
3. No gradient cards
4. No pill-heavy navigation
5. Use dividers, rails and work surfaces
6. Primary controls: 40–44 px

**Derived and non-negotiable:** cobalt is a signature — **one filled primary per view** · active nav = **surface change + 2px cobalt rail mark**, never a pill · **status is never carried by colour alone** — every chip carries a text label · **every measured value uses tabular numerals.**

### 7.5 Brand identity (preserved, explicitly not to be replaced)

- **Symbol:** four-lobed interwoven ribbon loop, hollow diamond centre. Reads as a continuous path crossing itself — the loop that CoreDesk exists to protect.
- **Gradient:** `#2F6FEB → #25B7F3`. **Preserved and licensed product-wide** — see §7.6.
- **Wordmark:** `CoreDesk`, geometric sans, regular-to-medium weight.
- Note: `fullLogo.png` renders its "Core" in white and is therefore light-background-only; `IconLogo.png` carries an opaque background. **The real mark must be kept — no substitute glyph.**

### 7.6 The gradient licence (approved rule)

The CoreDesk blue → cyan gradient is **a licensed product-wide asset**, not an auth-only decoration. It may appear **only** when it is communicating one of these six things:

1. **Brand identity**
2. **Environmental light / spatial depth**
3. **Active or selected context**
4. **Progress / lifecycle continuity**
5. **Document branding**
6. **Significant focus moments**

It must **never** be used as:

- random gradient cards
- glowing borders
- gradient-outline buttons
- decorative SaaS neon
- every-section decoration

**The interface stays predominantly graphite and neutral.** The gradient is the exception that proves the restraint — its rarity is what gives it meaning. The six permitted uses are, in effect, the *only* six reasons a gradient may ever appear.

This also settles the "Core Thread" question: the thread is a **continuity** device, so it falls under permitted use 4 and may carry the gradient where it represents lifecycle progression — and only there.


---

## 8. Contradictions and unclear areas

### Conflicts

**C1 — Roadmap board unavailable.** Of the four supplied sources, the Figma **Product Roadmap** board (`77R2VYxWkkKbKW7ridDCXW`) could not be read: no cached capture exists in `.figma-read/`, and there is no Figma credential in the environment. Three of four sources were read in full. S4 does contain an equivalent **"PHASED ROADMAP / DEPENDENCY ORDER"** sheet (P0–P7) and a **"Start here / Phased roadmap"** preview frame, both read completely — so the roadmap *content* is covered. **The dedicated board may still hold detail.** → **Needs decision.**

**C2 — The architecture board is much larger than V1.** S2 shows Portfolio, Finance, Developer, Growth (Discovery/Campaigns/Opportunities/Scraping), Analytics, Automations, Client Portal and Inbox. S4 calls these *"later sub-applications"* and *"proposed scope — not the principal product direction."* S4's own rule resolves it: *"A new specialist application does not enter V1 by becoming another sidebar item."* → **Resolved in favour of S4.** §5.2 records the board-only items.

**C3 — `AI Draft + Edit` appears in the V1 lifecycle board.** S1 shows an explicit `AI Draft + Edit` step inside *Proposal* creation. S4 lists **AI generation** under *"Explicit later scope"* for documents, and AI drafting under V1.1. → **Direct conflict.** This matters because it sits on the *critical path of the very first journey*. Recommendation: S4 wins (AI drafting is V1.1); S1's step becomes plain authoring. → **Needs decision.**

**C4 — "Guest reviewer" vs "Guest viewer".** S4's access sheet defines *both* roles. The page inventory only ever exercises a review experience. The S4 build plan flags this exact question as unresolved. → **Needs decision:** is `viewer` in V1?

**C5 — The logo gradient is preserved but unused.** The S4 "Preserved brand references" frame keeps `#2F6FEB → #25B7F3` **untouched** while the rest of the UI uses no gradient, and labels it *"a retained reference rather than a rule."* The user's brief simultaneously asks for **directional gradient light** as atmosphere. → **Needs decision:** where, if anywhere, does the brand gradient legitimately appear? (Directly relevant to Phase 1.)

**C6 — No usable logo asset for dark UI.** `IconLogo.png` has an opaque background; `fullLogo.png`'s "Core" is white. Neither composites onto the graphite canvas. → **Asset needed.** A transparent SVG symbol is required before Phase 1 can be built.

**C7 — Foundational planning date is in the future.** S4's sheets are dated **10 September 2026** and say *"fresh source review on 10 September 2026."* → Likely forward-dated planning metadata, not an error. Flagged, not blocking.

**C8 — `Inbox` has no page contract.** S2 gives Inbox four children (Proposal activity, Files received, Overdue/reminders, Client replies, Approvals) and it is the most fully specified board node, but S4's inventory has **no Inbox page**. Its concepts are partly absorbed by W01 Home and W04 Activity. → **Unresolved:** is Inbox superseded by Home, or a planned V1 surface?

### Unresolved in S4 itself (its own open questions, plus mine)

| # | Question | Why it matters |
|---|---|---|
| U1 | **Light theme authority** — Foundations defines dark only; light is derived and unapproved | Blocks any light-theme work from being final |
| U2 | **Rail width** — 236px used; never confirmed against a desktop minimum | Affects every shell layout |
| U3 | **Guest mobile** — the rule says guest work must be usable on mobile; designed only in outline | Needs its own pass (affects **G03** first) |
| U4 | **Status vocabulary collision** — S4 uses one amber for *waiting*, *pending*, *in progress* **and** *changes requested*, yet these demand different urgency | Could make a blocked delivery look merely pending |
| U5 | **"Next action" is everywhere but never modelled** — Home, C01, C02, P01, P02 all require it; no source defines whether it is derived or authored | Determines whether Home needs a new field or a selector |
| U6 | **Where do Activity entries live for archived targets?** W04 must handle "deleted/unavailable target"; W05 says archived records are read-only but restorable | Affects history integrity |
| U7 | **Onboarding depth** — A06 says "optional brand/service defaults" while S02 owns Professional Defaults | Risk of specifying the same thing twice |
| U8 | **Legal copy** — A07/A08 need *actual approved copy*, not placeholders | Release dependency, not a design task |
| U9 | **S3 roadmap board contents** — see C1 | May contain sequencing detail |
| U10 | **One project per document** is stated for V1 but the architecture board implies cross-project Portfolio reuse | Confirm V1 stays strict |

### Decisions — RATIFIED by owner

These are **settled**. They override any conflicting reading of the sources.

| # | Decision | Status |
|---|---|---|
| **R1** | **S4's scope governs both boards.** Boards (S1/S2) are flow and grouping references only, never scope authorities. | ✅ Ratified |
| **R2** | **Manual structured document creation is a required V1 capability and must work with no AI present.** The document and proposal UX **must reserve a clearly-labelled optional AI-assist entry point** (`Generate with AI` / `Assist`) so the surface does not need redesigning when AI ships. That entry point may ship **disabled, experimental or capability-gated** until the AI backend is production-ready. | ✅ Ratified — *supersedes the earlier "AI is V1.1 only" recommendation* |
| **R3** | **Guest reviewer only in V1.** No `viewer` role. | ✅ Ratified |
| **R4** | **Dark theme is the approved primary theme.** Light remains derived and unapproved; no light-theme design work until it is separately approved. | ✅ Ratified |
| **R5** | **The CoreDesk gradient is a product-wide, rule-gated asset** — not auth-only. See §7.6 for the approved licence. | ✅ Ratified — *supersedes the earlier "auth-only" recommendation* |
| **R6** | **"Next action" is an explicit authored field** on Client and on Project. Not derived. | ✅ Ratified |
| **R7** | **No Inbox top-level page.** Home absorbs attention/inbox behaviour. | ✅ Ratified |
| **R8** | **Add one intermediate amber.** Split `waiting/pending` (calm) from `changes requested` (needs action). | ✅ Ratified |
| **R9** | **Portfolio, Finance, Growth and Developer remain outside V1 navigation.** | ✅ Ratified |
| **R10** | **No previously rejected UI screen may be reused.** New work starts from the product context, not from superseded prototypes. | ✅ Ratified |
| **R11** | **CoreDesk is a desktop Electron application.** React is the renderer, not a website. Design for the Electron window; preserve desktop behaviour, keyboard interaction, window constraints and app chrome. **Verify important screens inside Electron, not only in a browser.** Localhost is for quick visual inspection only. Never use marketing-site or browser-first patterns. | ✅ Ratified |

### 7.7 Desktop runtime (Electron)

CoreDesk ships as an Electron application. The renderer is React, but the target
is a `BrowserWindow`, and that changes the engineering constraints:

| Constraint | Consequence |
|---|---|
| The built renderer loads over `file://` | **Root-absolute URLs break.** `/assets/x.js` resolves to the drive root and 404s, producing a blank window with no error in the page. Vite must emit relative URLs (`base: './'`), and every asset reference must be relative. |
| The OS frames the window | The content area is smaller than the requested size. A 1440×940 window yields roughly 1424×901 of renderer. Design layouts must not assume the content area equals the window. |
| There is no browser chrome | No address bar, no back button, no tabs. In-app navigation, breadcrumbs and back behaviour carry the whole burden — they are not conveniences. |
| The window paints before first frame | The window `backgroundColor` must be the canvas colour, or a dark-first product flashes white on every launch. |
| External links are not app routes | `https://` links open in the user's default browser; nothing navigates the app window away. |
| A desktop app has no browser zoom | Text must be legible at the default scale; Ctrl+scroll must not be able to distort the work surface. |

**Verification requirement for every phase:** report (1) the browser preview check,
(2) the Electron runtime check, and (3) any differences between them. A screen that
has only been seen in a browser has not been verified.

Harness: `coredesk-app/electron/` — `npm run desktop`, `npm run check:electron`,
`npm run check:parity`.

### 7.8 Appearance system (amends rule 1)

**Ratified by owner.** The workspace is user-configurable, modelled on the design
reference the owner supplied: theme, accent, surface material, background image
with opacity and blur, and interface typeface. All of it is one persisted record
(`coredesk.appearance.v1`) applied as custom properties on `:root`.

**Rule 1 is amended, not repealed.** The distinction that matters:

| | Status |
|---|---|
| Glow, bloom, neon, AI-halo as *default* chrome | **Still forbidden.** Nothing the product ships by default uses blur or glow for decoration. |
| Glass surfaces as a **user-selected material over a user-supplied background image** | **Permitted.** It is a material the owner chooses, and it is only meaningful where it has something to be translucent over. |

**Defaults remain the restrained ones:** graphite, cobalt, **solid** surfaces, no
wallpaper. A fresh workspace looks like the Foundations frame defines it. The
customisation is reachable; it is not the first impression. *A default is a
statement about the product; an option is not.*

**Two constraints survive the amendment unconditionally:**

1. **A scrim is mandatory with any wallpaper.** Once a photograph is behind the
   interface, text contrast depends on an image the app cannot inspect. The scrim
   is a legibility control with a user-facing setting, not a look.
2. **Glass never applies over an empty canvas.** Translucency with nothing behind
   it is just an inconsistent grey, so the material is scoped to the rail, the
   command bar and the workspace sections — the surfaces that sit over the
   wallpaper.

**Accent is user-selectable; cobalt remains the signature.** Changing it is a
preference, and it applies everywhere at once — navigation, primary actions,
lifecycle progress and focus — so a workspace can never end up with a stray cobalt
control beside a magenta one.

**Implementation note — the `backdrop-filter` trap.** Declare the property
**unprefixed only**. Writing both `backdrop-filter` and `-webkit-backdrop-filter`
lets the CSS minifier collapse the pair to the prefixed form alone, which this
Chromium reports as unsupported — the declaration is dropped, transparency still
applies, and glass renders as a broken translucent panel with no blur. Cost half
an hour to find; recorded so it is not found twice.


---

## 9. Phase 1 — recommended scope: Auth Entry (A01)

*Full specification delivered in the Phase 1 brief. Summary of the recommended boundary:*

**In scope:** A01 only — the opening/entry experience and the CoreDesk identity it establishes. Composition, the Core Thread motif, directional gradient light, logo lockup, typographic entry statement, the two entry actions (Sign in, Create account), Terms/Privacy reachability, and the three A01 states (loading, service unavailable, already signed in).

**Out of scope for Phase 1:** A02 Sign In form · A03 Sign Up · A04 Verify · A05 Recovery · A06 Onboarding · any owner-workspace chrome · light theme.

**Why this boundary:** A01 is the only screen whose job is *identity* rather than *task*. It is where the brand gradient, the Core Thread concept and the logo can be established once and inherited everywhere. Designing Sign In first would mean designing the brand inside a form.
