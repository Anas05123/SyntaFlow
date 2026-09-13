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

## 9. Settings Structure & Danger Zone (Section 23)

Settings are partitioned into 7 contextual tabs:
1. `General`: Business identity & document proposal defaults.
2. `Appearance`: Theme mode (Dark/Light/System) & document accents.
3. `Workspace`: Workspace name, timezone, services & fee items, notifications.
4. `Account`: Owner profile, email, password, and sign out.
5. `Client Access`: Object-level access grants table & guest permissions.
6. `Integrations`: Offline workstation sync (folder sync, .ics calendar, CSV/JSON export, webhooks).
7. `Advanced`: Canonical database statistics, storage paths, data export, and an explicit **Danger Zone** (`.cd-danger-zone`) isolating destructive operations (Reset demo data, Purge UI cache).
