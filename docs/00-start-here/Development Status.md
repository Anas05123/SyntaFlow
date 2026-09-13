# CoreDesk — Current Implementation State

> **Status:** AUDITED & VERIFIED  
> **Last verified:** 2026-09-14  
> **Repository Workspace:** Consolidated CoreDesk monorepo  
> **Frontend Target:** `apps/desktop/` (React 19.2.8, TypeScript 6.0.2, Vite 8.3.0)  
> **Desktop Runtime:** Electron 44 (via `apps/desktop/electron/main.cjs`)  
> **Owner domain:** Core Engineering & Architecture  

---

## 1. Executive Summary

CoreDesk is functional as a desktop application. The frontend is rendered via React 19 in `apps/desktop`, hosted inside a frameless Electron BrowserWindow. 

The launch and session lifecycle includes:
- Multi-monitor safe window geometry persistence with debounce and minimized-closure safety.
- Production reload protection (`F5`, `Ctrl+R`, `Ctrl+Shift+R`, `Cmd+R` disabled in built mode; development ergonomics preserved).
- Single-instance desktop lock restoring focus to the primary window.
- Startup transition sequence ("The continuous thread reconnects", Phases A through E) with reduced motion and recovery surface.
- Secure local email/password authentication (`LocalAuthProvider`) with scrypt password hashing, timing-safe verification, and Electron `safeStorage` session encryption.
- Safe `LastWorkspaceContext` session restoration with state record existence validation and fallback to `#/home`.

State management is driven by an in-memory React Context + Reducer store (`store.tsx`) backed by `localStorage` persistence (`coredesk.state.v1`), while the underlying SQLite database schema and typed contracts reside in `database/migrations` and `packages/contracts`.

---

## 2. Screen & Workspace Implementation Status

| Screen / Feature | Implementation Status | Path | Notes & Current State |
|---|---|---|---|
| Screen / Feature | Implementation Status | Path | Notes & Current State |
|---|---|---|---|
| **Operator Cockpit (Home)** | `IMPLEMENTED` | `apps/desktop/src/screens/HomeScreen.tsx` | 3-column operational cockpit hierarchy: (1) Urgent Attention & Blockers on left with high contrast indicator, (2) Resume Active Work center with active project banner and inline task creator, (3) Waiting on Client / Reviews right. Compact, dense Client Pulse runway table below. |
| **Clients Workspace** | `IMPLEMENTED` | `apps/desktop/src/screens/ClientsScreen.tsx` | Master-detail split view with stale state bug eliminated by construction using `effectiveSelectedId`. If filtered list is empty, right pane completely clears with informative empty state. |
| **Client Onboarding Drawer** | `IMPLEMENTED` | `apps/desktop/src/components/ClientStudioDrawer.tsx` | Apple-style slide-over studio drawer replacing small modal. Collects Brand/Identity, Primary Decision-Maker, Commercial Terms (Fixed/Retainer/Hourly), and launchpad actions. |
| **Projects Workspace** | `IMPLEMENTED` | `apps/desktop/src/screens/ProjectsScreen.tsx` | Structured desktop inventory table (`cd-projects-table`) with project, client, stage and attention chips, next milestone, target due date, review status, and direct workspace actions. Ungrounded progress bars removed. |
| **Project Workspace Tabs** | `IMPLEMENTED` | `apps/desktop/src/screens/ProjectWorkspaceScreen.tsx` | Multi-tab project environment: Overview, Scope & Brief, Milestones, Tasks, Documents, Deliverables. |
| **Blueprint Scoping Studio** | `IMPLEMENTED` | `apps/desktop/src/screens/CreateProjectScreen.tsx` | Multi-step project creator with pre-packaged blueprints: Brand Identity System, Design System & Web Experience, Strategic Advisory Retainer. |
| **Tasks Workspace** | `IMPLEMENTED (FROZEN)` | `apps/desktop/src/screens/TasksScreen.tsx` | Dual views `[ Board ]` and `[ List ]`. Responsive density modes (`compact` <1100px, `regular` 1100-1450px, `wide` >1450px). Side-by-side threshold set to $\ge 1100\text{px}$ workspace width. Dedicated horizontal scroll ownership (`.cd-tasks-board-wrap`) preventing column clipping at 1440x900. |
| **Task Detail Inspector** | `IMPLEMENTED (FROZEN)` | `apps/desktop/src/components/TaskPanel.tsx` | Unified `OverlaySurface` with central Escape handler stack and guaranteed focus return to trigger. Route-aware lifecycle auto-unmounts on navigation. Semantic ARIA roles (`role="dialog"` in overlay, `role="region"` side-by-side). |
| **Documents Workspace** | `IMPLEMENTED` | `apps/desktop/src/screens/DocumentsScreen.tsx` | Document inventory filtering by type (Proposal, Brief, Agreement, Scope, Notes, Deliverable). |
| **Document Studio** | `IMPLEMENTED` | `apps/desktop/src/screens/DocumentWorkspaceScreen.tsx` | Structured section editor with editable textarea per section, real dirty/clean/saving tracking, Revert and Save actions, keyboard shortcut support (`Ctrl+S`), and removed fake simulate state button. Header SaveStateIndicator bound directly to real editor state. |
| **Activity Feed** | `IMPLEMENTED` | `apps/desktop/src/screens/ActivityScreen.tsx` | Chronological feed of workspace events, task completions, and status changes. |
| **Archive Workspace** | `IMPLEMENTED` | `apps/desktop/src/screens/ArchiveScreen.tsx` | Read-only view of archived clients, projects, and documents with restore actions. |
| **Settings & Profile** | `IMPLEMENTED` | `apps/desktop/src/screens/SettingsScreen.tsx` | Reorganized into 7 contextual tabs: General, Appearance, Workspace, Account, Client Access, Integrations, and Advanced. Destructive operations (Reset demo data, Purge UI cache) strictly isolated inside explicit Danger Zone (`cd-danger-zone`). |
| **Appearance Popover** | `IMPLEMENTED` | `apps/desktop/src/components/AppearancePopover.tsx` | Theme selector (Dark, Light, System), accent color, wallpaper backdrop, blur and dim adjustments. |
| **Universal Search (⌘K)** | `IMPLEMENTED` | `apps/desktop/src/components/SearchPalette.tsx` | Omnipresent fuzzy search across Clients, Projects, Tasks, and Documents with instant keyboard navigation. |
| **Guest Review Flow** | `IMPLEMENTED` | `apps/desktop/src/components/guest/GuestReviewSurface.tsx`<br>`apps/desktop/src/screens/OwnerGuestPreviewWorkspace.tsx`<br>`apps/desktop/src/screens/guest/GuestReviewScreen.tsx` | "One Presentation, Two Shells" architecture: Workspace-native owner preview with toolbar (`Copy guest link`, `Open externally`, `Refresh`, `Close preview`) + External client guest view with `MinimalGuestHeader`. Exact immutable `DocVersion` binding, continuous editorial reading canvas (720–850px), structured right inspector rail (320–380px), decision & comment synchronization. |
| **Auth & Session System** | `IMPLEMENTED (Local)`<br>`SPECIFIED (Web)` | `apps/desktop/src/screens/AuthScreen.tsx`<br>`apps/desktop/electron/auth/`<br>`docs/systems/AUTH_SYSTEM.md` | In-place toggle between Sign In and Create Account. Email normalization, scrypt password hashing, timing-safe validation, Electron `safeStorage` session encryption, and safe workspace context restoration. Planned cloud OAuth abstraction defined via `WebAuthProvider`. |

---

## 3. Subsystem Technical Reality

### Persistence & Data Layer
- **Current Runtime (`apps/desktop`):** `localStorage` using key `coredesk.state.v1`. Reducers in `store.tsx` manage immutable state transitions. `CoreDeskDatabase` in `db.ts` provides relational joins and search indexing.
- **Underlying SQLite Foundation (`database/`):** SQLite schema migrations exist in `database/migrations/0001_foundation_metadata.sql`. Full migration of `apps/desktop` state to the SQLite backend is scheduled for an upcoming architectural phase.

### Electron & Desktop Runtime
- **Main Process:** `apps/desktop/electron/main.cjs` creates a frameless `BrowserWindow` with custom drag regions, rounded corners, and native window control IPC listeners (`minimize`, `maximize`, `close`). Hidden creation and `#0B0D0F` canvas prevent white flashes.
- **Window Memory:** `apps/desktop/electron/window-state.cjs` manages debounced bounds persistence, maximized restoration, and multi-monitor safe positioning.
- **Preload Bridge:** `apps/desktop/electron/preload.cjs` exposes `window.coreDeskDesktop` using Electron's `contextBridge` with `contextIsolation: true`, `nodeIntegration: false`, and `sandbox: true`.

### AI Engine Subsystem
- **Implementation Status:** `READY IN MONOREPO (UI Wiring Planned)`
- **Components (`packages/ai-engine`):**
  - `TaskRouter`: Validates and routes AI execution requests.
  - `PromptRegistry`: Version-controlled prompts for document generation, scoping, and summaries (`coredesk.foundation.*`).
  - `Providers`: `FakeAiProvider` (for testing) and `OllamaProvider` (for local LLM inference via `http://localhost:11434`).
  - `Contracts`: Typed Zod schemas in `@coredesk/contracts`.
- **Desktop Bridge (`packages/contracts`):** Typed `CoreDeskPreloadApi` surface including `coredeskAi: { getStatus, generate }`.

---

## 4. Known Placeholders & Stubs

1. **PDF Generation**: In `DocumentWorkspaceScreen.tsx`, clicking "Export PDF" displays a simulated modal/toast rather than generating a binary PDF stream via Electron headless print.
2. **Website OAuth Authentication**: Desktop operates via local password authentication (`LocalAuthProvider`); website-directed OAuth and `coredesk://` deep links are specified for the web phase (`WebAuthProvider`).
3. **Guest Token Verification**: The guest review screens accept arbitrary `?token=` parameters in the route query without checking against a persistent cryptographic signing table.
4. **File Storage**: Linked assets in tasks and documents reference local simulated URLs rather than managed directory storage in `userData/files/`.

---

## 5. Verification Status

- **Typecheck:** `tsc -b` passes with **0 errors**.
- **Build:** `vite build` builds client bundle cleanly into `dist/`.
- **Full Test Suite:** 21 test files (77 unit, integration, and security tests) pass with **100% pass rate**.
- **Route & Interaction QA:** `node verify-app.mjs` verifies 35/35 routes with **0 errors and 0 problems**.
- **Electron Verification:** `node verify-electron-phase.mjs` verifies all 8 window memory, multi-monitor, reload protection, and session persistence requirements on the real Electron runtime.
