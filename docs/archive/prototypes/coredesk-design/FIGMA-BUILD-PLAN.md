# CoreDesk — Figma Build Plan

How to reproduce this design inside Figma, using the structure your planning
file already established. Token values are read from the **Foundations** frame
`[3:9] CoreDesk — Precision Workspace` — they are not estimates.

---

## 1. Why it has to be rebuilt rather than imported

Your Figma file was read with a **read-only** token (`file_content:read`). That
scope can read a file and cannot create or modify anything in it. There is no
API path, with any token, that writes nodes into a Figma design file — that
capability exists only inside Figma itself, through the plugin API or the editor.

So the working direction is: this design is the source of truth, and it gets
into Figma one of two ways.

| Method | Effort | Fidelity |
|---|---|---|
| **Screenshot into frames** — capture each screen at 1440×900 and place as a frame background, then rebuild components on top | Low | Visual 1:1, not editable structure |
| **Figma plugin** — a plugin generates frames, text styles and component sets from the token table below | Medium | Fully editable, real component structure |

`shoot.mjs` already produces the screenshots at the right viewport for the
first method.

---

## 2. Foundations — build these first

### 2.1 Colour styles

Create as **local styles** named in the `core/` namespace so they map cleanly
onto code later. Dark is the canonical theme; light is derived.

| Style name | Hex | Role |
|---|---|---|
| `core/background/canvas` | `#0B0D0F` | Application background |
| `core/background/sidebar` | `#0F1215` | Navigation rail |
| `core/surface/default` | `#12161A` | Cards, panels, work surfaces |
| `core/surface/raised` | `#171C21` | Nested rows, controls, inputs |
| `core/border/divider` | `#262C33` | Every 1px separator |
| `core/border/edge` | `#323A43` | Control outlines, modal edges |
| `core/text/primary` | `#F4F6F8` | Headings and body |
| `core/text/muted` | `#A8B0BA` | Secondary copy |
| `core/text/metadata` | `#737D88` | Timestamps, hints, counts |
| `core/accent/default` | `#2F6FEB` | Primary action, active state |
| `core/status/active` | `#3FA66B` | Active, approved, delivered, complete |
| `core/status/waiting` | `#D49A3A` | Waiting, pending, in progress, changes requested |
| `core/status/risk` | `#D65A5A` | At risk, overdue, blocked, revoked |

**Tints:** use `core/accent/default` at 10–12% opacity for tinted fills. In
Figma this is a fill with opacity set, not a separate hex.

**Light theme:** mirror each style under `core-light/`. Canvas `#EEF1F4`,
surface `#FFFFFF`, raised `#F4F6F8`, divider `#DDE2E7`, text `#14181C`, muted
`#5A646E`, accent `#2560D8`. Cobalt is darkened one step for contrast; the
status colours darken similarly.

### 2.2 Text styles

One family only: **Inter**. Sizes below are taken from the frame.

| Style name | Size / line | Weight | Use in frame |
|---|---|---|---|
| `display/page` | 30 / 36 | 700 | H1 — "Project workspace" |
| `title/section` | 20 / 24 | 700 | H2 — "Control language", "Typography", "Rules" |
| `title/card` | 16 / 19 | 600 | "Current work", card titles |
| `body/default` | 14 / 17 | 400 | "Operational body copy with calm hierarchy." |
| `body/strong` | 14 / 17 | 600 | Buttons, emphasis |
| `label/default` | 13 / 16 | 500 | "No glow or glassmorphism" |
| `meta/default` | 12 / 15 | 500 | "Metadata / Sep 10 · 2 days" |
| `label/eyebrow` | 11 / 14 | 600, 0.08em tracking, uppercase | Small section eyebrows |

### 2.3 Geometry

| Token | Value | Evidence in frame |
|---|---|---|
| Card radius | **9** | All eight colour swatches: `286×72 r=9` |
| Control radius | **7** | Primary 160×44 r=7, secondary 132×44 r=7 |
| Primary control height | **40–44** | Stated rule: "Primary controls: 40–44 px" |
| Divider | 1px `core/border/divider` | — |
| Sidebar width | 236px | Shell grid track |
| Page padding | 28px | Work region |
| Card padding | 20px | Panel interiors |
| Grid gap | 16px | — |

### 2.4 Effect and layout styles

- **Elevation/overlay** — `0 12px 32px rgba(0,0,0,0.34)`. Overlays only.
- **Elevation/modal** — `0 24px 64px rgba(0,0,0,0.44)`. Modals only.
- No drop shadows on cards. Cards separate by surface colour plus divider.
- Auto-layout everywhere: vertical `gap: 16`, horizontal padding `20`.
- Set **"Clip content"** on the shell frame; only the work region scrolls.

---

## 3. Design rules from the frame — treat as constraints

The Foundations frame states six rules. They are enforced in `coredesk.css` and
must hold in Figma:

1. No glow or glassmorphism
2. No bright-outline buttons
3. No gradient cards
4. No pill-heavy navigation
5. Use dividers, rails and work surfaces
6. Primary controls: 40–44 px

Additional rules derived from the planning pages:

- Cobalt is **a signature, not decoration** — one filled primary per view.
- Navigation uses a **surface change plus a 2px cobalt rail mark**, not a pill.
- Status is never carried by colour alone; every chip has a text label.
- Every measured value uses tabular numerals.

---

## 4. Component inventory

Build as component sets with variants. Suggested order is the dependency order.

### Primitives

| Component | Variants | Notes |
|---|---|---|
| `Button` | `intent=primary/secondary/ghost/quiet/danger` × `size=md(40)/lg(44)/sm(32)` × `state=default/hover/disabled` | Primary is a **filled** cobalt button, white ink. Never an outlined bright button. |
| `IconButton` | `state`, `bordered=yes/no` | 32×32 |
| `Field` | `type=input/select/textarea` × `state=default/hover/focus/invalid/disabled` | Focus is a cobalt 1px border, no glow, no outer ring in the design |
| `Checkbox` / `Radio` | `state=off/on/mixed` | Cobalt fill when on |
| `SegmentedControl` | `items=2–5` × `selected` | Replaces pills for view switching |
| `Tab` | `state=default/hover/selected` | 2px cobalt underline, sits on a 1px divider rail |
| `Chip` | `tone=active/waiting/risk/accent/neutral` × `dot=yes/no` | 22px tall, 6px radius |
| `Avatar` | `size=28/30` × `initials` | 1px divider ring |
| `ProgressBar` | `tone=accent/ok` | 6px track on `raised` |
| `Skeleton` | `w/h` | Sheen between `#1D2329` and `#262D34` |

### Composites

| Component | Variants | Used by |
|---|---|---|
| `MetricCard` | `tone=default/risk/waiting` | W01 |
| `ItemRow` | `interactive=yes/no`, `completed`, `selected` | Everywhere |
| `DefinitionRow` | `2-column 132px label` | Detail rails |
| `DataTable` + `TableRow` | `selected`, `hover` | C01, D01, P04, S03 |
| `PageHeader` | `actions=0/1/2` | Every page |
| `Card` | `header=yes/no`, `footer=yes/no` | Everywhere |
| `Banner` | `tone=neutral/ok/warn/bad` × `action=yes/no` | Failures, partial failures, blocks |
| `EmptyState` | `kind=first-run/filter-empty/error/unauthorized/unavailable/blocked` | State contract |
| `MilestoneGroupHeader` | — | P03 |
| `ReviewCard` | `state=waiting/overdue/changes/approved/superseded` | P05 |
| `PackageFileRow` | `approved=yes/no`, `kind=pdf/zip/img` | P06, G04 |
| `VersionRow` | `state=current/submitted/superseded`, `delivered=yes/no` | D04 |
| `TimelineEvent` | `type=review/feedback/approval/delivery`, `read=yes/no` | W04 |
| `StepIndicator` | `steps=4`, `current=1–4` | P01 create, A06 |
| `OptionCard` | `selected`, `radio/checkbox` | Create flows, settings |
| `SaveStateIndicator` | `state=dirty/saving/saved/failed` | D02 |
| `Toast` | `tone=default/ok/warn/bad` | Global |

### Shell

| Component | Notes |
|---|---|
| `AppShell` | 236px rail + work region; `min-height: 0` on the work region so only it scrolls |
| `Rail` / `RailItem` | `state=default/hover/active`, `badge=0/n`, `badge=alert` |
| `TopBar` | Breadcrumb (`Client → Project → Document`), search trigger, activity, theme toggle |
| `Breadcrumb` | Final segment is primary text and non-interactive |
| `SearchOverlay` | Global, one instance. Groups results by record type. |
| `SlideOverPanel` | 380px, for record detail (task detail is shared by W02 and P03) |
| `Modal` | 560px standard, 880px wide |
| `Menu` | Context actions |

---

## 5. Page map

Each page in Figma holds one screen, laid out at **1440×900**. Screen IDs match
your page inventory so the two documents stay cross-referenceable.

### Page: `01 · Foundations`
Token swatches, type scale, geometry, component starters. Mirrors the existing
Foundations frame, extended with the light theme.

### Page: `10 · Owner workspace`
| Frame | Screen | Source contract |
|---|---|---|
| W01 Home | Action queue, metrics, current work, recently opened | W01 |
| W01a Home — first run | Single actionable first-work prompt | W01 first-run state |
| W02 Tasks | Filter tabs, row list, shared detail panel | W02 |
| W03 Search | Global overlay — no query, results, no results | W03 |
| W04 Activity | Timeline, unread/all, unavailable target | W04 |
| W05 Archive | Read-only records, restore, conflict check | W05 |

### Page: `20 · Clients`
| Frame | Screen | Source contract |
|---|---|---|
| C01 Clients | Table with relationship, contact, projects, next action | C01 |
| C02 Client Detail — Projects | Tab 1 | C02 |
| C02 Client Detail — Documents | Tab 2 | C02 |
| C02 Client Detail — Contacts | Tab 3 | C02 |
| C02 Client Detail — Private notes | Tab 4 | C02 |
| C02 Client Detail — History | Tab 5 | C02 |
| Add client | Modal, including duplicate warning | C01 |

### Page: `30 · Projects`
| Frame | Screen | Source contract |
|---|---|---|
| P01 Projects | Cards with stage, milestone, progress, review state | P01 |
| P01a Create project ×4 | Client → Brief & scope → Dates → Summary | P01 create flow |
| P02 Overview | Context header + brief, scope, milestones, controls | P02 |
| P03 Work | Milestone-grouped tasks, real progress count | P03 |
| P04 Documents & Files | Documents table + files with visibility | P04 |
| P05 Reviews | Review cards with outcome and comments | P05 |
| P06 Delivery — blocked | Missing approval blocks delivery | P06 |
| P06 Delivery — delivered | Delivered and acknowledged, recorded separately | P06 |

**The context header is one component** reused across P02–P06, per the rule
"Project tabs share one context header."

### Page: `40 · Documents`
| Frame | Screen | Source contract |
|---|---|---|
| D01 Documents | Global table with working/submitted version | D01 |
| D02 Write | Outline + writing surface + context rail | D02 |
| D03 Preview & export | Paginated preview, brand choice, export progress | D03 |
| D04 Version history | Numbered immutable versions, delivery references | D04 |
| D05 Review & share setup | Four steps, guard list, guest preview | D05 |

### Page: `50 · Guest surface`
Separate page because guests never inherit owner navigation.

| Frame | Screen | Source contract |
|---|---|---|
| G01 Invite & verify | Masked recipient, project context | G01 |
| G02 Shared project | Only explicitly granted objects | G02 |
| G03 Review version | Immutable banner, comments, decision | G03 |
| G04 Delivery | Files, handoff notes, acknowledgment | G04 |
| G-err Wrong account | Switch identity without revealing content | Access lifecycle |
| G-err Revoked | Clear unavailable state | Essential failure paths |
| G-err Expired | Request renewed access | Essential failure paths |
| G-err Unauthorized | Record exists, identity may not see it | Shared state contract |

Build **G03 at 390px width too** — the rule is "Guest work is usable on mobile
and keyboard."

### Page: `60 · Settings`
| Frame | Screen | Source contract |
|---|---|---|
| S01 Account & workspace | Profile, password, session, notifications, data | S01 |
| S02 Professional defaults | Business identity, services, fee items, branding, live preview | S02 |
| S03 Client access | Grants table, role matrix, lifecycle | S03 |

### Page: `70 · Auth`
A01 Auth entry · A02 Sign in · A03 Sign up · A04 Verify email · A05 Recover access (two steps) · A06 Onboarding · A07 Terms · A08 Privacy

Note the explicit constraint on A07/A08: **actual approved copy is required**,
not placeholder legal claims. Build the frames with an empty-content state and a
recovery route.

### Page: `80 · State contract`
One frame per state, so the contract is reviewable rather than implied:

loading · empty first-run · empty filter · failure with retry · partial failure ·
unauthorized · unavailable record · dirty · saving · saved · failed save ·
blocked action with its unblocking condition · destructive naming with affected
records · progress

---

## 6. Build order

1. **Foundations** — colour styles, text styles, geometry tokens. Nothing else is consistent until this exists.
2. **Primitives** — Button, Field, Chip, Tab, SegmentedControl, Checkbox, Avatar, ProgressBar.
3. **Shell** — AppShell, Rail, TopBar, Breadcrumb. Build the three-tab project context header at the same time.
4. **Composites** — Card, ItemRow, DataTable, MetricCard, Banner, EmptyState, DefinitionRow.
5. **W01 Home** — the highest-traffic screen; it stress-tests most composites.
6. **C01/C02 Clients** then **P01–P06 Projects** — the record spine.
7. **D02 Document workspace** — the most layout-complex screen.
8. **D01, D03, D04, D05** — document satellites.
9. **W02–W05** — tasks, search, activity, archive.
10. **G01–G04** — guest surface, including the unsupported states.
11. **S01–S03** — settings.
12. **A01–A08** — auth, once the legal copy exists.
13. **State contract page** — last, so every state references a real component.

---

## 7. Prototype wiring worth having

These four flows carry the product's hardest rules. Wire them as prototypes so
the rules are testable rather than documented:

1. **P01 create flow** — an unnamed project cannot reach the summary step.
2. **D05 share setup** — the create button stays disabled while a guard is red.
3. **G03 decision** — "Request changes" cannot complete without a comment.
4. **P06 delivery** — "Share package" stays disabled while a required version lacks approval.

Each of these is a stated transition guard in your Lifecycles page. If the
prototype allows the wrong outcome, the design is wrong.

---

## 8. Open questions worth settling before the build

1. **Light theme authority.** The Foundations frame only defines dark. The light palette in `coredesk.css` is derived, not approved. Confirm it or design it properly.
2. **Rail width.** This design uses 236px. Confirm against your intended desktop minimum.
3. **Guest mobile.** The rule says guest work must be usable on mobile. That breakpoint is designed here only in outline; it deserves its own pass.
4. **Terminology.** The planning pages say "Guest reviewer" and "Guest viewer"; the product today only has a review experience. Confirm the viewer role is in V1.
5. **Original logo and gradient.** The preserved-brand-reference frame keeps the original logo and the `#2F6FEB → #25B7F3` gradient untouched. This UI does not use the gradient — confirm that is intended, since the frame retains it as a reference rather than a rule.
