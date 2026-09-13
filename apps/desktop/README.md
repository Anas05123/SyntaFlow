# CoreDesk

A focused workspace for independent professionals: manage a client relationship,
run a project, write its documents, collect a decision and deliver the right
version.

This is the **CoreDesk V1 app frontend** — a real React + TypeScript + Vite
application, built from the Figma planning sources.

## Provenance

Everything here traces to one of the Figma sources:

| Source | What it gave |
|---|---|
| `CoreDesk — Product UI Exploration` → **Foundations** frame | Every design token: the graphite surface ladder, cobalt `#2F6FEB`, the Inter type scale, radii 9/7, 40–44px controls, and the six design rules |
| Same file → **Page inventory** (6 sheets) | The screen contracts: A01–A08, W01–W05, C01–C02, P01–P06, D01–D05, G01–G04, S01–S03, including each screen's required content, actions and states |
| Same file → **IA** and **Lifecycles & access** | Routes, the record model, transition guards and the shared V1 state contract |
| FigJam → **Client Lifecycle** | The end-to-end flow: lead → client → proposal → acceptance → agreement → welcome pack → questionnaire → assets → kickoff → project → review/approval → delivery → completion |
| FigJam → **Product Architecture** | The IA: Core Workspace (Projects, Documents, Portfolio, Professional Profile), Inbox, and the later Growth / Finance / Developer sub-apps |

## Running it

```bash
npm install
npm run dev        # http://127.0.0.1:5173
```

Other scripts:

```bash
npm run build      # tsc -b && vite build
npm run preview    # serve the production build
npm run lint       # oxlint
```

> **npm note.** This machine's environment sets `npm_config_allow_scripts`,
> which npm 11 rejects for project-scoped installs (`EALLOWSCRIPTS`). If
> `npm install` fails, clear it for the command:
>
> ```powershell
> Remove-Item Env:npm_config_allow_scripts; npm install
> ```
>
> `package.json` carries an `allowScripts` array for the project instead.

## Architecture

```
src/
  domain/        # the record model, seed data, dates, status vocabulary
    types.ts     #   Client, Project, Task, Document, Version, Review,
                 #   DeliveryPackage, AccessGrant, ActivityEvent
    seed.ts      #   representative records
    status.ts    #   one mapping from state -> tone + label
    dates.ts     #   due/overdue maths, pinned to a fixed "today"
  state/
    store.tsx    # reducer store + derived selectors, persisted to localStorage
  app/
    router.ts    # hash router matching the IA destinations
    Shell.tsx    # rail + topbar shell, guest chrome, breadcrumbs
  ui/
    overlay.tsx  # toasts, slide-over panel, modals, search — one host
    primitives.tsx
    tokens.css   # design tokens, straight from the Foundations frame
  components/    # TaskRow, TaskPanel, SearchPalette, ModalHost
  screens/       # one file per screen contract
```

### Design rules enforced in code

The Foundations frame states six rules. They hold throughout:

- No glow or glassmorphism
- No bright-outline buttons — primary actions are filled cobalt
- No gradient cards
- No pill-heavy navigation — active nav is a surface change plus a 2px rail mark
- Dividers, rails and work surfaces instead of boxes
- Primary controls are 40–44px

Cobalt stays a signature, not decoration: one filled primary per view.

### Two source conflicts, resolved deliberately

1. **The architecture board is larger than V1.** It shows Growth (Campaigns,
   Scraping), Finance, Developer, Portfolio and Automations. The design file's
   own brief calls those *"later sub-applications"* and *"proposed scope — not
   the principal product direction."* This build implements the **V1 page
   inventory**; the wider branches are not built.
2. **The board's Home model wins over the design file's.** The design file does
   not specify the owner home layout, but the architecture board names four
   groups — Now, Needs response, Waiting, Upcoming — so `HomeScreen` uses them
   rather than inventing a dashboard.

## Behaviour you can exercise

- **State transfers between screens.** Completing a task on Tasks moves it out
  of Today and into Done, and the Home counts and rail badges follow.
- **Guards actually block.** Create project will not leave step 1 without a
  client. Share setup disables its button while a guard is unmet and names the
  reason. "Request changes" on the guest surface refuses without a comment.
- **Delivery is blocked by design.** Brand guidelines v3 has no approved
  version, so the package cannot be shared.
- **Submitting is immutable.** Freezing a version copies a new draft forward; it
  never overwrites.
- **Everything persists** to localStorage. Settings → *Reset demo data* restores
  the seed.

Try: `Ctrl+K` search, `/` to search, `Esc` to unwind overlay → modal → panel.

## Verification

```bash
node verify-app.mjs
```

Drives the built app in Chromium: 33 routes, six interactive flows, both themes.

Last run: **33/33 routes, 0 console errors, 0 problems.**

## What this is not

- **No backend.** State lives in localStorage. Uploads and exports are
  simulated and labelled as such in the UI.
- **Unified CoreDesk Architecture.** Project Atlas is retired; this application
  is the sole CoreDesk desktop client consolidating all frontend and backend capabilities.
- **Not final visual design.** It implements the Foundations tokens faithfully,
  but the light theme is derived rather than approved in Figma, and the guest
  mobile breakpoint is outline-only.
