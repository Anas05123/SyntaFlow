# CoreDesk — UI/UX & Spatial Layout System

> **Status:** IMPLEMENTED  
> **Last verified:** 2026-09-14  
> **Relevant source areas:** `apps/desktop/src/app/Shell.tsx`, `apps/desktop/src/components/StartupOverlay.tsx`, `apps/desktop/src/screens/`, `apps/desktop/src/styles/`  
> **Owner domain:** Desktop User Experience  

---

## 1. The CoreDesk Desktop Spatial Model

CoreDesk draws its own frameless desktop chrome. It divides the screen into dedicated spatial layers:

```
┌───────────────────────────── FLOATING TOP COMMAND BAR ─────────────────────────────┐
├─────────────────┬───────────────────────────────────────────────┬──────────────────┤
│                 │                                               │                  │
│  COLLAPSIBLE    │  MAIN OPERATIONAL WORKSPACE                   │  CONTEXTUAL      │
│  SIDEBAR RAIL   │  (Cockpit / Clients / Tasks / Documents)      │  INSPECTOR       │
│                 │                                               │  DRAWER          │
│  - Brand Trigger│                                               │  - Side-by-side  │
│  - Teams Menu   │                                               │    (>= 1020px)   │
│  - Work Nav     │                                               │  - Overlay       │
│  - Rail Toggle  │                                               │    (< 1020px)    │
│                 │                                               │                  │
└─────────────────┴───────────────────────────────────────────────┴──────────────────┘
```

---

## 2. Spatial Layers & Structural Components

### 2.1 The Floating Top Command Bar (`Shell.tsx`)
- **Height & Placement**: Fixed at `top: 0`, height `56px` (or `64px` with margins). Floats across the entire width of the window with glass backdrop blur (`backdrop-filter: blur(16px)`).
- **Interactive Controls**:
  - **Breadcrumbs Path**: Shows current navigation hierarchy (e.g. `Clients / Northlight Studio`). Trailing breadcrumb auto-resolves record titles.
  - **Universal Search Trigger (`⌘K`)**: Direct access to the omnipresent multi-entity command palette.
  - **Quick Create Menu (`+`)**: Dropdown to create a Client, Project, Task, or Document.
  - **Appearance Popover Trigger**: Sun/Palette icon providing instant theme, accent, and wallpaper controls.
  - **Native Window Controls**: Frameless Minimize, Maximize/Restore, and Close buttons dispatching IPC window events.

### 2.2 Collapsible Sidebar Rail (`Rail.tsx`)
- **States**:
  - **Expanded (Full)**: `width: 240px`. Shows brand logo, team switcher, grouped navigation items (`HOME`, `WORK`, `RECORD`), and badge counters.
  - **Collapsed**: `width: 64px`. Condenses navigation items to icons with hover tooltips, maximizing horizontal canvas space.
- **Persistence**: User preference stored in `localStorage` under `coredesk.rail` (`full` | `collapsed`).

### 2.3 Main Operational Workspace (`<main className="work">`)
- Sits below the topbar and right of the rail.
- **Padding & Margins**: Standardized `16px 24px` gutter, expanding cleanly to 100% height.
- **Responsive Workspace Margin**: When the Task Inspector opens side-by-side ($\ge 1020\text{px}$ available workspace), `.cd-tasks-workspace` applies `margin-right: clamp(380px, 28vw, 460px)`, shifting the workspace left so no cards or columns are obscured.

### 2.4 Contextual Task Inspector Drawer (`TaskPanel.tsx` & `OverlaySurface`)
- **Mount Point**: Mounted cleanly below the floating command bar (`top: 64px`, `height: calc(100dvh - 64px)`), completely preventing title bar overlap.
- **Unified Overlay Primitive**: Built on `OverlaySurface` with a central Escape handler stack (`pushEscapeHandler` / `popEscapeHandler`) guaranteeing that the topmost open drawer closes on Escape and returns focus directly to the activating trigger element.
- **Route-Aware Lifecycle**: Contextual inspectors automatically unmount upon hash route changes, preventing stale overlay leaks across screens.
- **Semantic ARIA Roles**:
  - Modal / Overlay Mode: `role="dialog"`, `aria-modal="true"`, focus trapped inside container.
  - Side-by-Side Mode: `role="region"`, `aria-modal="false"`, allowing free bidirectional keyboard and mouse focus between board and inspector.
- **Responsive Modes** (Measured by `ResizeObserver` on actual available workspace width):
  - **Side-by-Side Mode ($\ge 1100\text{px}$ available workspace)**: Sits alongside the task board. The dark backdrop scrim is completely suppressed, and board workspace reserves inspector space (`margin-right: clamp(380px, 28vw, 460px)`).
  - **Overlay Mode ($< 1100\text{px}$ available workspace)**: Slides over the board with a soft dismissible scrim (`.scrim.soft`), active at 1280px desktop resolution to prevent layout squashing.
- **Internal Ergonomics**:
  - Internal scrolling on `.panel-body`.
  - Sticky action footer (`.panel-foot`) pinned to `bottom: 0` with `z-index: 10`, ensuring completion buttons remain reachable.

### 2.5 In-App Guest Preview Workspace (`OwnerGuestPreviewWorkspace.tsx`)
- **Core Spatial Principle**: *"Open Object $\rightarrow$ Open Workspace Context"*, not *"Open Object $\rightarrow$ Leave the App"*.
- **Structure**:
  - Pinned owner-only toolbar (`OwnerPreviewToolbar`) providing direct link copying, external tab launching, and return navigation.
  - Fluid reading canvas (`.cd-review-main`) hosting the continuous editorial document paper surface.
  - Right-side structured review inspector (`.cd-review-inspector`, 320–380px) docking alongside wide/medium viewports ($\ge 1100\text{px}$) and adapting to a slide-over drawer on compact viewports ($< 1100\text{px}$) so the document reading measure is never crushed.
  - Token parity: Uses identical type ramp, status badges, and 40px primary decision buttons as the internal document studio.
  - External guest review screen (`GuestReviewScreen.tsx`) preserves identical review surface but is strictly isolated with no internal navigation or sidebar.

---

## 3. Standard Navigation & Layout Patterns

| Pattern | Usage Area | Description |
|---|---|---|
| **Master-Detail Split** | Clients Screen (`ClientsScreen.tsx`) | 40% left pane for scannable cards and search filters; 60% right pane for the deep relational dossier. |
| **Studio Drawer** | Client Onboarding (`ClientStudioDrawer.tsx`) | Slide-over drawer replacing popups for high-density multi-section intake. |
| **Operational Board / List** | Tasks Screen (`TasksScreen.tsx`) | Segmented switcher `[ Board ] [ List ]` with persistent preference. Board renders high-density columns; List renders compact tabular rows. |
| **Tabbed Engagement Suite** | Project Workspace (`ProjectWorkspaceScreen.tsx`) | Horizontal tabs: `Overview`, `Scope & Brief`, `Milestones`, `Tasks`, `Documents`, `Deliverables`. |
| **Command Palette Modal** | Universal Search (`SearchPalette.tsx`) | Centered modal with keyboard arrow navigation, group headers, and quick jump triggers. |

---

## 4. Startup Transition: "The Continuous Thread Reconnects"

CoreDesk features an intentional startup sequence connecting desktop window creation, session resolution, and workspace restoration without flashes or layout jumps:

```
Window Ready-to-Show (Canvas #0B0D0F)
        ↓
Phase A: Arrival (~0–180ms)
Near-black graphite surface; CoreDesk mark emerges at low opacity / scale 0.93.
        ↓
Phase B: Form (~180–550ms)
Interwoven brand mark resolves crisply with subtle scale & blue/cyan ambient progression.
        ↓
Phase C: Signal (~450–900ms)
Restrained cobalt/cyan signal travels through the continuous thread path.
        ↓
Phase D: Ripple / Workspace Wake (~700–1100ms)
Concentric thin circular water ripples expand outward as the workspace prepares underneath.
        ↓
Phase E: Handoff (~1000–1300ms)
Startup layer smoothly fades out (280ms cubic-bezier transition).
```

### Performance & Motion Principles
- **No Heavy Media**: Exclusively CSS transforms, opacity, and SVG stroke animations. Smooth 60fps rendering on ordinary laptop hardware.
- **Natural Latch**: If session and workspace resolution is faster than animation, it completes smoothly without artificial delays. If slower, it holds on a calm, completed brand state with label "Workspace ready" rather than looping aggressively.
- **Reduced Motion Support**: When `prefers-reduced-motion: reduce` is active, the traveling signal and expanding ripples are suppressed; the mark performs a brief 120ms opacity fade before handing off.
- **Restrained Recovery Surface**: If session initialization fails or errors, transitions to an honest recovery card: *"CoreDesk couldn't open your workspace. Your local data has not been deleted. [Try again]"*.

---

## 5. Card Usage Discipline (Section 20)

**Principle: Cards are for bounded records, not decorative section wrappers.**
- Used for: Project summaries, review decision requests, delivery packages, and distinct object inspectors.
- Repeated content: Uses dense tables (`.cd-projects-table`, `.cd-pulse-table-wrap`), interactive item rows (`.item-row`, `.cd-tasks-list-row`), dividers, and section titles.
- Prevents visual fatigue and SaaS dashboard card repetition across Home, Clients, and Projects.

---

## 6. Canonical Focus System & Keyboard Navigation (Section 26 / WCAG 2.4.7)

Every keyboard-interactive element in CoreDesk exposes a visible, high-contrast focus indicator:
```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 4px;
}
```
- Standardized across: Sidebar rail buttons, top command triggers, table rows (`[tabindex]`), form inputs/textareas, tabs, menu items, document outline buttons, and review decision controls.
- Keyboard-only navigation pass guarantees complete end-to-end traversal without a mouse.

---

## 7. Material Boundaries & Wallpaper Policy (Section 29)

Wallpapers belong to the background shell, environment, top chrome, and modal backdrops.
- **Operational Surface Protection**: Operational surfaces (tables, forms, documents, section editors, task boards, and inspectors) maintain solid or $\ge 94\%$ opacity under `:root[data-wallpaper]` and `:root[data-surface="soft"]`.
- The background image never competes with dense data reading, ensuring WCAG 1.4.3 text contrast is preserved across all themes.

---

## 8. Document Studio Structured Section Editor (Section 17)

- **Write View Contract**: Rather than behaving as a static viewer, the Write surface provides a structured section editor.
- **Interaction**: Selecting a section in the left outline or clicking "Edit" in the document page activates an accessible textarea block for that section.
- **Save State Machine**:
  - `saved`: Baseline committed content.
  - `dirty`: Active uncommitted modifications (surfaced on section outline with a warning dot and in header indicator).
  - `saving`: Brief atomic commit transition.
- **Controls**: "Save section" commits changes, "Revert" restores the saved baseline. Keyboard shortcut `Ctrl+S` / `Cmd+S` saves the active section.

---

## 9. Dedicated Settings Workspace & Information Architecture (Section 23)

Settings operates as a dedicated, full-window desktop control center (`.shell-settings`, `.cd-settings-workspace`). When entering Settings, the main Syntaflow application sidebar (`Rail.tsx`) and standard application topbar are completely hidden, eliminating double navigation and focusing the entire window on system configuration. Pressing `← Back` immediately returns to the normal operational workspace and restores the main sidebar.

### 9.1 Single-Chrome Spatial Layout
- **Dedicated Top Bar** (`.cd-settings-header`, 52px): Single unified header featuring:
  - `← Back` navigation button returning to the previous application view.
  - Contextual `Settings` / `Section` title without repetitive hierarchy duplication.
  - Global `Search settings...` input indexing all categories, titles, keywords, and integrations.
  - Frameless `WindowControls` (minimize, maximize, close) for desktop window management.
- **Dedicated Vertical Navigation Rail** (`.cd-settings-nav`, 220px, `#111418` dark graphite): Single left navigation grouped into 4 semantic categories across 10 focused sections:
  - **`GENERAL`**:
    - `General` (`#/settings/general`): Display language, date format, 24-hour clock, relative timestamps, startup view, system tray & login behavior.
    - `Appearance` (`#/settings/appearance`): Interface theme mode (Dark / Light / System), primary accent color, background style, text scale, reduced motion, contrast boost.
    - `Notifications` (`#/settings/notifications`): Desktop toast alerts categorized by Reviews, Tasks, Projects, Client Delivery, and System Activity.
  - **`WORKSPACE`**:
    - `Workspace` (`#/settings/workspace`): Studio business identity, legal entity, time zone, primary currency, service catalog & commercial fee defaults.
    - `Client Access` (`#/settings/client-access`): Granular object-level guest access grants table, permissions scopes, review access management, and invitation dispatch.
  - **`SYSTEM`**:
    - `Integrations` (`#/settings/integrations`): Rebuilt service directory for external tools and SaaS connectors (Gmail, Google Calendar, Google Drive, GitHub, Slack, Notion, Figma, Outlook, Dropbox).
    - `AI & Models` (`#/settings/ai`): Local neural inference configuration, live Ollama daemon connection testing (`http://127.0.0.1:11434`), context window bounds, temperature control, prompt PII redaction, and `TaskRouter` architectural guarantees.
    - `Security` (`#/settings/security`): Honest, verifiable security posture: active operator session details, local database isolation, Electron runtime privilege boundaries, and credential rotation.
  - **`ACCOUNT`**:
    - `Account` (`#/settings/account`): Operator identity profile, avatar initials, primary email, role badge, password change, and secure sign-out.
    - `Advanced` (`#/settings/advanced`): Local filesystem sync (`Workspace Directory Sync`), system calendar feed export (`.ics`), accounting CSV export, SQLite database metrics, UI cache purge, and an isolated **Danger Zone** (`.cd-settings-danger-zone`).

### 9.2 Integrations Directory & Compact Service Cards
- **External vs System Separation**: Integrations strictly hosts external third-party services. Internal workstation capabilities (Local SQLite engine, folder sync, CSV exports) reside in `Advanced`.
- **User-Oriented Categories & Filters**:
  - `COMMUNICATION`: Gmail, Microsoft Outlook, Slack
  - `CALENDAR & MEETINGS`: Google Calendar, Calendly, Zoom
  - `FILES`: Google Drive, Microsoft OneDrive, Dropbox
  - `DESIGN`: Figma
  - `KNOWLEDGE`: Notion, Google Docs, Google Sheets
  - `DEVELOPMENT`: GitHub, Linear, Stripe
- **High-Density 3-Column Responsive Grid**: Cards are strictly compact (72–88px height, min-height 74px) and feature:
  - Authentic vendor SVG brand marks with exact brand colors, official geometry, and proportions (28–32px) rendered via `ServiceLogos.tsx` and mirrored in `public/integrations/*.svg` across all 16 supported services: **Gmail** (official Google Workspace envelope), **Google Calendar** (official Google Workspace '31' card), **Google Drive** (official 6-color isometric triangle), **Calendly** (official geometric 'C' mark), **Notion** (official 3D notebook cover with serif 'N'), **Microsoft OneDrive** (official Fluent Design dual-gradient cloud), **Linear** (official 4-slash spiral), **Stripe** (official typographic 'S' mark), **Slack** (official 4-quadrant octothorpe), **Figma** (official 5-piece mark), **GitHub** (official Invertocat), **Zoom** (official camera badge), **Outlook** (official Microsoft 365 badge), **Dropbox** (official 5-diamond box), **Google Docs**, and **Google Sheets**.
  - 14.5px semibold title & 12px capability description.
  - Authentic status indicators: `● Connected` (green beacon), `● Needs attention` (amber beacon), `Beta` / `Experimental` (subtle badges), `Connect` (compact button), `Coming soon` (muted label), or active `● Authorizing... [ Cancel ]` with instant inline cancellation.
  - **Decoupled Concurrent Lifecycle**: Connecting states (`connectingIds`) are isolated per service. Multiple integrations can authenticate concurrently without blocking or bleeding state across adjacent cards.
- **In-Page Wide Search**: Dedicated `600–780px` wide search bar indexing titles, descriptions, categories, and normalized capabilities.
- **Integration Detail Drawer**: Clicking any card slides out an interactive drawer containing:
  - Header: 36px official vendor logo, product title, category, and direct external website link.
  - Connection status card with account email/handle and timestamp of last verified ping.
  - Architecture & Transport info (e.g. `API: Google OAuth 2.0 PKCE`, `MCP: Streamable HTTP`).
  - Capabilities checklist (`calendar.read`, `calendar.availability`, `mail.draft`, `issues.read`, etc.).
  - Required OAuth / API scopes list (`calendar.readonly`, `gmail.compose`, `repo`, etc.).
  - **Agent Access Controller**: Explicit toggle to grant or restrict Syntaflow AI agents from utilizing this integration, accompanied by granular capability checkboxes (e.g. `mail.send` with an elevated confirmation warning badge).
  - Actions: `[ Connect ]` (or `[ Authorizing with browser... ] [ Cancel ]` with immediate teardown), `[ Test connection ]` (queries live endpoint and displays latency), and `[ Disconnect ]` (wipes credentials from vault).
- **Direct Account Connection Dialog**: Clicking `Connect` on any service card or inside the detail drawer opens a frictionless in-app connection modal dialog:
  - Eliminates Google Cloud Console / developer portal prerequisites for end users.
  - Automatically prefills or accepts the user's account email (e.g. `ayarlanas79@gmail.com`) and optional display label.
  - Summarizes active capabilities (`mail.search`, `mail.read`, `mail.draft`, `mail.send`, etc.).
  - Binds the account credentials securely into `CredentialVault` with instant status feedback (`● Connected` with connected email displayed on the card and detail drawer).
  - Offers an optional developer accordion for System Browser OAuth 2.0 PKCE when custom Google Cloud client IDs are configured.

### 9.3 Wide Canvas Measure & High Contrast
- Content area expands flexibly up to `1280–1600px`, completely eliminating empty dead space on 1440px and 1920px viewports while preserving comfortable line measures for structured rows.
- High-contrast inputs (38px), accessible toggle switches (42×24px), and 2px cobalt left indicators on active navigation items without heavy outlines.
