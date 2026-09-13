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

### 2.4 Contextual Task Inspector Drawer (`TaskPanel.tsx`)
- **Mount Point**: Mounted cleanly below the floating command bar (`top: 64px`, `height: calc(100dvh - 64px)`), completely preventing title bar overlap.
- **Responsive Modes** (Measured by `ResizeObserver` on parent work container):
  - **Side-by-Side Mode ($\ge 1020\text{px}$ available workspace)**: Sits alongside the task board. The dark backdrop scrim is completely suppressed (`display: none !important`), allowing simultaneous board interaction and card inspection.
  - **Overlay Mode ($< 1020\text{px}$ available workspace)**: Slides over the board with a soft dismissible scrim (`.scrim.soft`).
- **Internal Ergonomics**:
  - Internal scrolling on `.panel-body`.
  - Sticky action footer (`.panel-foot`) pinned to `bottom: 0` with `z-index: 10`, ensuring completion buttons remain reachable.

### 2.5 In-App Guest Preview Workspace (`OwnerGuestPreviewWorkspace.tsx`)
- **Core Spatial Principle**: *"Open Object $\rightarrow$ Open Workspace Context"*, not *"Open Object $\rightarrow$ Leave the App"*.
- **Structure**:
  - Pinned owner-only toolbar (`OwnerPreviewToolbar`) providing direct link copying, external tab launching, and return navigation.
  - Fluid reading canvas (`.cd-review-main`) hosting the continuous editorial document paper surface.
  - Right-side structured review inspector (`.cd-review-inspector`, 320–380px) docking alongside wide/medium viewports ($\ge 1020\text{px}$) and adapting to a slide-over drawer on compact viewports ($< 1020\text{px}$) so the document reading measure is never crushed.
  - `Escape` key closes the inspector and restores focus.

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
- **Natural Latch**: If session resolution is faster than animation, it completes smoothly (~850ms min). If slower, it holds on a calm, completed brand state rather than looping aggressively.
- **Reduced Motion Support**: When `prefers-reduced-motion: reduce` is active, the traveling signal and expanding ripples are suppressed; the mark performs a brief 250ms opacity fade before handing off.
- **Restrained Recovery Surface**: If session initialization fails or errors, transitions to an honest recovery card: *"CoreDesk couldn't open your workspace. Your local data has not been deleted. [Try again]"*.
