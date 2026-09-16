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
| **Operator Cockpit (Home)** | `IMPLEMENTED` | `apps/desktop/src/screens/HomeScreen.tsx` | 3-column operational cockpit hierarchy: (1) Urgent Attention & Blockers on left with high contrast indicator, (2) Resume Active Work center with active project banner and inline task creator, (3) Waiting on Client / Reviews right. Compact, dense Client Pulse runway table below. |
| **Clients Workspace** | `IMPLEMENTED` | `apps/desktop/src/screens/ClientsScreen.tsx` | Master-detail split view with stale state bug eliminated by construction using `effectiveSelectedId`. If filtered list is empty, right pane completely clears with informative empty state. |
| **Client Onboarding Drawer** | `IMPLEMENTED` | `apps/desktop/src/components/ClientStudioDrawer.tsx` | Apple-style slide-over studio drawer replacing small modal. Collects Brand/Identity, Primary Decision-Maker, Commercial Terms (Fixed/Retainer/Hourly), and launchpad actions. |
| **Projects Workspace** | `IMPLEMENTED` | `apps/desktop/src/screens/ProjectsScreen.tsx` | Structured desktop inventory table (`cd-projects-table`) with project, client, stage and attention chips, next milestone, target due date, review status, and direct workspace actions. Ungrounded progress bars removed. |
| **Project Workspace Tabs** | `IMPLEMENTED` | `apps/desktop/src/screens/ProjectWorkspaceScreen.tsx` | Multi-tab project environment: Overview, Scope & Brief, Milestones, Tasks, Documents, Deliverables. |
| **Blueprint Scoping Studio** | `IMPLEMENTED` | `apps/desktop/src/screens/CreateProjectScreen.tsx` | Multi-step project creator with pre-packaged blueprints: Brand Identity System, Design System & Web Experience, Strategic Advisory Retainer. |
| **Tasks Workspace** | `IMPLEMENTED (FROZEN)` | `apps/desktop/src/screens/TasksScreen.tsx` | Dual views `[ Board ]` and `[ List ]`. Responsive density modes (`compact` <1100px, `regular` 1100-1450px, `wide` >1450px). Side-by-side threshold set to $\ge 1100\text{px}$ workspace width. Dedicated horizontal scroll ownership (`.cd-tasks-board-wrap`) preventing column clipping at 1440x900. |
| **Task Detail Inspector** | `IMPLEMENTED (FROZEN)` | `apps/desktop/src/components/TaskPanel.tsx` | Unified `OverlaySurface` with central Escape handler stack and guaranteed focus return to trigger. Route-aware lifecycle auto-unmounts on navigation. Semantic ARIA roles (`role="dialog"` in overlay, `role="region"` side-by-side). |
| **Documents Workspace** | `IMPLEMENTED` | `apps/desktop/src/screens/DocumentsScreen.tsx` | Document inventory filtering by type (Proposal, Brief, Agreement, Scope, Notes, Deliverable). |
| **Document Studio** | `IMPLEMENTED` | `apps/desktop/src/screens/DocumentWorkspaceScreen.tsx` | Unified 3-column desktop studio layout with left section outline & live completion dots, center executive paper canvas (`.doc-page`) with continuous typographic reading hierarchy and click-to-edit inline section workflow, right review intelligence rail with client feedback quote and private internal notes, live dirty/clean/saving state contract, keyboard shortcut support (`Ctrl+S`), presentation template preview toggles, and wallpaper-bleed material protection. |
| **Review Transmission Studio** | `IMPLEMENTED` | `apps/desktop/src/screens/ShareSetupScreen.tsx` | 5-step executive submission studio (`cd-share-studio`): (1) Version snapshot confirmation, (2) Decision authority & SLA turnaround chips, (3) Cover letter presets, (4) Presentation template selector (Executive Editorial, Modern Studio, Enterprise Formal), (5) Northlight Studio portfolio showcase attachment. Features live client transactional email & portal preview. |
| **Activity Feed** | `IMPLEMENTED` | `apps/desktop/src/screens/ActivityScreen.tsx` | Chronological feed of workspace events, task completions, and status changes. |
| **Settings & Control Center** | `IMPLEMENTED` | `apps/desktop/src/screens/SettingsScreen.tsx`<br>`apps/desktop/src/components/settings/` | Dedicated full-window workspace route (`#/settings/:section`) with single left navigation rail (220px) and single top bar (bypassing main `Rail` and `Topbar` to eliminate double chrome). Top bar features `← Back` returning to prior workspace, breadcrumb path (`Settings / Section`), live search with keyboard navigation, and frameless window controls. Broad flexible content canvas (1200–1600px). Real Integrations Architecture with secure Electron Credential Vault (`SafeStorageCredentialVault` failing secure without weak fallbacks, `TestCredentialVault` strictly for testing), desktop OAuth 2.0 PKCE flow manager with direct 1-click browser authorization, single-use 10-minute expiring state tokens, token refresh concurrency locks, Model Context Protocol (MCP) Streamable HTTP transport with reconnection state machine, centralized `IntegrationHealthService` with outage normalization and 30-60s freshness caching, capability risk classification (`READ`, `WRITE`, `EXTERNAL_ACTION`, `DESTRUCTIVE`) with human confirmation gates, live providers (Google Calendar, Gmail, Google Drive, Notion, Linear, GitHub), Universal Catalog Provider for immediate connection across all 16 catalog services without missing-adapter failures, 1-click `[ ⚡ Connect All ]` and `[ Disconnect All ]` batch operations, authentic SVG vendor brand logos for 16 services, and compact 3-column cards (72–88px height) with slide-over detail drawer. |
| **Appearance Popover** | `IMPLEMENTED` | `apps/desktop/src/components/AppearancePopover.tsx` | Theme selector (Dark, Light, System), accent color, wallpaper backdrop, blur and dim adjustments. |
| **Universal Search (⌘K)** | `IMPLEMENTED` | `apps/desktop/src/components/SearchPalette.tsx` | Omnipresent fuzzy search across Clients, Projects, Tasks, and Documents with instant keyboard navigation. |
| **Guest Review Flow** | `IMPLEMENTED` | `apps/desktop/src/components/guest/GuestReviewSurface.tsx`<br>`apps/desktop/src/screens/OwnerGuestPreviewWorkspace.tsx`<br>`apps/desktop/src/screens/guest/GuestReviewScreen.tsx` | "One Presentation, Two Shells" architecture: Workspace-native owner preview with toolbar + External client guest view with `MinimalGuestHeader`. Exact immutable `DocVersion` binding, transmission cover note callout, 3 presentation templates (`executive`, `modern-studio`, `enterprise`), expandable studio portfolio showcase with real case studies and metrics, continuous editorial reading canvas (720–850px), structured right inspector rail (320–380px). |
| **Auth & Session System** | `IMPLEMENTED (Local)`<br>`SPECIFIED (Web)` | `apps/desktop/src/screens/AuthScreen.tsx`<br>`apps/desktop/electron/auth/`<br>`docs/systems/AUTH_SYSTEM.md` | In-place toggle between Sign In and Create Account. Email normalization, scrypt password hashing, timing-safe validation, Electron `safeStorage` session encryption, and safe workspace context restoration. Planned cloud OAuth abstraction defined via `WebAuthProvider`. |
| **Public Web Platform & Search Console Indexing** | `PRODUCTION VERIFIED & INDEXING ACTIVE` | `apps/web/src/`<br>`https://syntaflow.tech` | Full production web platform & search indexing pipeline: 31 canonical indexable routes, centralized `seoConfig.ts` with OpenGraph & Schema.org JSON-LD, 7-stage interactive Product Workflow, dedicated Solutions suite (Agencies, Freelancers, Consultants, Studios), verified Integrations catalog with 6 dedicated landing pages, 24-section Privacy Policy with Google Limited Use compliance and static pre-rendered fallback (`privacy.html`), 22-section Terms of Service, architectural Security disclosure, code-split React.lazy architecture (87 kB gzip main bundle), WebP image assets (99% reduction), 100% verified across 7 viewports (203/203 checks pass), 233/233 SEO tests pass, and live production deployment active on Appwrite Sites (`syntaflow.tech`, 116/116 live production tests pass). Phase 8 Search Console & OAuth verification complete: `sc-domain:syntaflow.tech` verified, `sitemap.xml` accepted with 31 discovered URLs, priority URLs submitted to Google priority crawl queue, zero manual actions or security issues, and Google Cloud OAuth Branding status confirmed: *"Your branding has been verified and is being shown to users."* |

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
- **Full Test Suite:** 31 test files (146 unit, integration, and security tests) pass with **100% pass rate** (`npm test`).
- **Security Test Suite:** 5 security test suites (10 tests) pass with **100% pass rate** (`npm run test:security`).
- **Route & Interaction QA:** `node verify-app.mjs` verifies 35/35 routes with **0 errors and 0 problems**.
- **Electron Verification:** `node verify-electron-phase.mjs` verifies all 8 window memory, multi-monitor, reload protection, and session persistence requirements on the real Electron runtime.
