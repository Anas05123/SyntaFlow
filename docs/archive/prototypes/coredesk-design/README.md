# CoreDesk — Deliverables Index

Design work produced from the **CoreDesk — Product UI Exploration** Figma file
(`aFi6Drd2UNeDaklTjD0ygZ`), read via the Figma REST API on 10 September 2026.

## What this folder is

A complete, clickable design of the CoreDesk V1 product UI, built to the page
contracts that already exist in your Figma planning pages. It is a design
artifact — not application code — and it is **not** a modification of
`project-atlas`.

## Files

| File | What it is |
|---|---|
| `index.html` | Entry point. Open this. |
| `coredesk.css` | The design system in code: tokens, components, states. Every value traced to the Foundations frame. |
| `data.js` | Representative records (clients, projects, documents, versions, reviews, deliveries, access grants) shaped to the Figma record model. |
| `app.js` | Every screen, implemented to its page-inventory contract. |
| `FIGMA-BUILD-PLAN.md` | How to reproduce this in Figma: token table, component inventory, page map, build order. |
| `verify.mjs` | Headless route + interaction verification harness. |
| `shoot.mjs` | Screenshot capture for all screens. |

## Run it

A local server is already running:

```
http://127.0.0.1:4173/index.html
```

To serve it yourself from this folder:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

## Keyboard

| Key | Action |
|---|---|
| `Ctrl/⌘ + K` | Global search overlay (W03) |
| `/` | Same, when not typing |
| `Esc` | Close overlay → modal → panel → menu |

## How to read the design

- **Screen IDs** in `app.js` comments map to the Figma page inventory: `A01–A08` auth, `W01–W05` owner workspace, `C01–C02` clients, `P01–P06` projects, `D01–D05` documents, `G01–G04` guest, `S01–S03` settings.
- **`#/states`** is the design-review screen. It renders the shared V1 state contract — loading, empty, filter-empty, failure, partial failure, unauthorized, unavailable, dirty/saving/failed-save, blocked action, destructive naming, progress — plus the full token table.
- The **theme toggle** in the top bar switches graphite and light. Both use the same token set; cobalt is held constant.

## Screens implemented

**Owner workspace** — Home (W01, plus first-run state) · Tasks (W02 + shared task detail panel) · Clients (C01) · Client Detail (C02, five tabs) · Projects (P01) · Project Workspace (P02–P06, five tabs) · Documents (D01) · Document Workspace (D02) · Preview & Export (D03) · Version History (D04) · Review & Share Setup (D05) · Activity (W04) · Archive (W05) · Search overlay (W03) · Settings (S01–S03)

**Guest surface** — Invite & Verify (G01) · Shared Project (G02) · Review Version (G03) · Delivery (G04) · plus wrong-account, revoked, expired and unauthorized states

**Flows** — Create project (four steps) · Add client · Review request · Export with progress

**Entry** — Auth entry (A01–A05) · Onboarding (A06) · Terms (A07) · Privacy (A08)

## Verification status

- 88 route renders across both themes — 0 failures
- 56 interactive actions — 0 failures
- 23 screenshots — 0 layout overflows, 0 console errors

Re-run both harnesses:

```powershell
node verify.mjs "$PWD\app.js" "$PWD\.verify-report.txt"
node shoot.mjs
```

## What this is not

- Not a Figma file. It cannot be written back into Figma — the token used to read your file was read-only, and no API here can create nodes.
- Not production code. It has no framework, no tests and no persistence; it is a specification you can see and click.
- Not a change to `project-atlas`. That repo is a different product (Project Atlas, an AI agency OS); this is CoreDesk.
