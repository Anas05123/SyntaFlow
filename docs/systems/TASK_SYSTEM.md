# CoreDesk — Task System Specification

> **Status:** IMPLEMENTED & FROZEN (All 12 QA Assertions Verified)  
> **Last verified:** 2026-09-13  
> **Relevant source areas:** `coredesk-app/src/screens/TasksScreen.tsx`, `coredesk-app/src/components/TaskPanel.tsx`, `coredesk-app/src/components/TaskRow.tsx`, `coredesk-app/src/domain/types.ts`  
> **Owner domain:** Execution Architecture  

---

## 1. Single Canonical Task Principle

In CoreDesk, a task is never an isolated note or transient UI element. **There is exactly one canonical `Task` record.**
- The task on the **Operator Cockpit Focus Queue**,
- the task on the **Tasks Workspace Board and List**, and
- the task on the **Project Workspace Tasks tab**
are **projections of the exact same record** (`Task.id`). Mutating a task in any view immediately updates all other views.

---

## 2. Decoupled Dimensions: Status vs. Attention

Status and Attention are strictly separated into two orthogonal dimensions:

### 2.1 Canonical Task Status (`TaskStatus`)
Represents the operator's execution stage:
- `todo` — Work is pending.
- `in-progress` — Work is actively underway.
- `done` — Work is finished.
- `cancelled` — Work was formally abandoned.

### 2.2 Operator Attention Flags (`TaskAttention`)
Represents operational impediments requiring attention, independent of stage:
- `waiting` — Work is stalled waiting on an external response (client feedback, vendor asset, approval).
- `blocked` — Work cannot proceed because internal prerequisite tasks are incomplete.
- `overdue` — Due date is in the past and task is not done.

> [!IMPORTANT]
> `waiting` and `blocked` are **never** treated as canonical task statuses. In the default Status Board view, there are exactly three columns: **To Do**, **In Progress**, and **Done**. To view attention states as columns, the operator switches Grouping to **Attention** (`Blocked`, `Waiting`, `Overdue`, `Clear / In Track`).

---

## 3. Normalized Priority Vocabulary

Priority vocabulary is unified across all screens, domain models, and inspectors:
1. `blocker` — Halts project progress or commercial gating. (Red badge)
2. `urgent` — Requires immediate same-day execution. (Orange badge)
3. `high` — Essential milestone deliverable. (Cyan badge)
4. `medium` — Standard scheduled production work. (Display label `Medium`; legacy `Normal` retired).
5. `low` — Backlog or minor refinement task.

---

## 4. Prerequisite Dependencies & Safety Enforcement

CoreDesk supports canonical prerequisite task dependencies (`dependencies?: TaskId[]` / `TaskDependency`):
- **Blocker Detection**: If any task ID in `task.dependencies` has `status !== 'done'`, the task is automatically flagged `blocked` by the derived selector `derived.isTaskBlocked(task)`.
- **Completion Safety Guard**:
  - Toggling completion checkbox: blocked.
  - Clicking "Mark Complete" in Inspector: blocked.
  - Dragging and dropping into `Done` column: card snaps back to origin column.
  - All blocked completion attempts dispatch a warning toast: `"Cannot Complete: Prerequisite tasks must be completed first."`

---

## 5. Dual Workspace Views & Dynamic Grouping

1. **Board View (Default)**: Visual columns with task count pills, urgency chips, checklist progress meters, and drag-and-drop drop targets.
2. **List View**: High-density tabular layout with inline completion toggles, due dates, priority pills, and project jump links.
3. **Dynamic Grouping**: Operators can pivot columns in real time:
   - `status`: To Do, In Progress, Done.
   - `attention`: Blocked, Waiting, Overdue, Clear / In Track.
   - `priority`: Blocker, Urgent, High, Medium, Low.
   - `milestone`: Grouped by project milestones.
   - `project`: Grouped by active client projects.
4. **Preference Persistence**: Selected view mode (`board` vs `list`) is persisted in `localStorage` under `coredesk.tasks.view`.

---

## 6. Drag-and-Drop Architecture

- **Intra-Column Reordering**: Dragging over cards renders an active insertion line indicator. On release, `task/reorder` is dispatched with the full array of task IDs, updating the persistent `order` integer index.
- **Cross-Column State Mutations**: Dropping into a new column dispatches canonical mutations (`task/status`, `task/priority`, `task/patch`).
- **Activity Logging**: Completing a task logs exactly one `ActivityEvent` via the central store reducer, preventing duplicate entries.

---

## 7. Responsive Task Inspector Drawer

- **Mount Point**: Begins cleanly at `top: 64px`, `height: calc(100dvh - 64px)` below the floating top bar.
- **Responsive Workspace Measurement**: `ResizeObserver` monitors available workspace width (`<main className="work">`):
  - **$\ge 1020\text{px}$ (Side-by-Side Mode)**: Workspace applies `margin-right: clamp(380px, 28vw, 460px)`. Inspector sits side-by-side with zero backdrop scrim (`display: none !important`), enabling simultaneous board manipulation and card inspection.
  - **$< 1020\text{px}$ (Overlay Mode)**: Inspector slides over the workspace with a soft backdrop scrim (`.scrim.soft`).
- **Ergonomics**: Sticky footer (`position: sticky; bottom: 0; z-index: 10`) guarantees action buttons are reachable regardless of checklist length. `Escape` key closes the inspector.
