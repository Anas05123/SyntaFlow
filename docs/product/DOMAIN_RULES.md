# CoreDesk — Domain Rules & Business Invariants

> **Status:** IMPLEMENTED  
> **Last verified:** 2026-09-13  
> **Relevant source areas:** `coredesk-app/src/domain/types.ts`, `coredesk-app/src/state/store.tsx`  
> **Owner domain:** Domain Logic & Integrity  

---

## 1. Core Architectural Invariants

1. **Strict Relational Ownership**: A `Project` belongs to exactly one `Client`. A project cannot be orphaned or shared between multiple clients.
2. **Document Version Immutability**: A submitted `DocVersion` is completely immutable. Any subsequent revisions must be made in the `workingVersion` draft and submitted as a new incremented version snapshot ($n+1$).
3. **Exact-Version Review Scope**: A `ReviewRequest` binds to an exact version number. If an operator edits the document while a review is pending, the review is superseded and cannot approve the unsubmitted draft.
4. **Delivery Gate Enforcement**: A `DeliveryPackage` cannot be generated or downloaded unless all required deliverable documents have reached `approved` decision status.
5. **Archive is Non-Destructive**: Archiving a record soft-deletes it from active workspaces (`state = 'archived'`). It preserves all historical relations, activity logs, and financial totals. Restoring an archived record restores it to its previous state.
6. **Independence of Lifecycle, Attention, and Access**:
   - `ProjectStage` (`active`, `in-review`, etc.) describes the project's commercial phase.
   - `TaskAttention` (`waiting`, `blocked`, `overdue`) describes an immediate operational impediment.
   - `Visibility` (`private`, `shared`) describes security authorization.
   - **These three dimensions must never be collapsed into a single status field.**
7. **Single Task Record Reuse**: A task appearing in the Operator Cockpit Focus Queue, the Tasks Workspace Board/List, and the Project Workspace Tasks tab is the **exact same canonical record** (`Task.id`). Mutating it in any view updates all projections synchronously.
8. **Dependency Drag Safety**: A task blocked by incomplete prerequisite dependencies cannot be transitioned to `done` via drag-and-drop, inline toggle, or inspector buttons.

---

## 2. Operation Specifications

### OP-01: Create New Project Engagement

- **PRECONDITIONS**:
  - `clientId` must exist and reference an active or prospect client.
  - Project `name` must be a non-empty string.
  - Project `stage` defaults to `'draft'` or `'planned'`.
- **ACTION**:
  - Insert new `Project` record into state with generated `ProjectId`.
  - If a scoping blueprint is selected, initialize predefined `milestones` with default budgets and target deliverables.
- **SIDE EFFECTS**:
  - Append an `ActivityEvent` of type `'project'`: `"Created project '{name}' for {clientName}"`.
  - Update `client.lastActivity` timestamp.
- **FAILURE CONDITIONS**:
  - Target `clientId` does not exist in the store: reject operation.
  - Name is blank or whitespace: reject with validation error.

---

### OP-02: Complete Task (`task/status` or `task/toggle`)

- **PRECONDITIONS**:
  - Task `id` must exist in `state.tasks`.
  - Target status is `'done'` (or toggled from non-done).
  - All prerequisite task IDs listed in `task.dependencies` must currently have `status === 'done'`.
  - `task.blockedByTaskId` (if populated) must reference a task with `status === 'done'`.
- **ACTION**:
  - Set `task.status = 'done'`.
  - Clear any active attention flag (`task.attention = null`).
- **SIDE EFFECTS**:
  - Append exactly one `ActivityEvent`: `"Completed task '{task.title}'"`. (Duplicate events on repeated calls are suppressed).
  - If the task was linked to a `milestoneId`, check whether all sibling tasks under that milestone are complete; if so, notify or mark milestone ready.
- **FAILURE CONDITIONS**:
  - One or more prerequisite tasks are not `'done'`:
    - **Operation is rejected**.
    - Status remains unchanged.
    - System dispatches warning toast: `"Cannot Complete: Prerequisite tasks must be completed first."`

---

### OP-03: Reorder Tasks Intra-Column (`task/reorder`)

- **PRECONDITIONS**:
  - `orderedTaskIds: TaskId[]` contains valid task identifiers belonging to the specified column/group.
- **ACTION**:
  - Assign integer `order` values to each task matching its index in `orderedTaskIds` ($0, 1, 2, \dots$).
- **SIDE EFFECTS**:
  - State is saved to persistent storage (`localStorage` / SQLite) so order survives app restart.
- **FAILURE CONDITIONS**:
  - An ID in `orderedTaskIds` does not exist: skip missing ID, reorder remaining valid IDs.

---

### OP-04: Submit Document for Client Review

- **PRECONDITIONS**:
  - `documentId` exists.
  - Document `workingVersion` is greater than or equal to current `submittedVersion`.
  - Designated reviewer email is valid.
- **ACTION**:
  - Create an immutable snapshot `DocVersion` with index $n = \text{workingVersion}$, current timestamp, author, and `decision = null`.
  - Set `document.submittedVersion = n`.
  - Set `document.reviewState = 'waiting'`.
  - Set `document.visibility = 'shared'`.
  - Create a new `ReviewRequest` targeting version $n$.
- **SIDE EFFECTS**:
  - Append `ActivityEvent`: `"Submitted {document.title} (v{n}) for review to {reviewer.name}"`.
  - Update associated Project stage to `'in-review'` (if not already).
- **FAILURE CONDITIONS**:
  - Document has no content sections: reject submission.
  - Previous review on the same version is still actively pending: prompt operator to confirm withdrawal or update.

---

### OP-05: Record Client Review Decision

- **PRECONDITIONS**:
  - `reviewId` exists and has `state === 'waiting'`.
  - Decision is explicitly `'approved'` or `'changes'`.
- **ACTION**:
  - Set `review.state = (decision === 'approved' ? 'approved' : 'changes-requested')`.
  - Set `review.outcome = decision`.
  - Set `review.decisionDate = ISO_TIMESTAMP`.
  - Locate target `DocVersion` ($n = \text{review.version}$) and update its `decision` field.
  - Update parent `DocumentRecord.reviewState`:
    - If `approved`: set `reviewState = 'approved'`.
    - If `changes`: set `reviewState = 'changes-requested'`. Increment `workingVersion = workingVersion + 1` to open a new draft.
- **SIDE EFFECTS**:
  - Append `ActivityEvent`: `"Client {outcome} {document.title} (v{n})"`.
  - If approved, evaluate whether all required deliverables for project milestone are met.
- **FAILURE CONDITIONS**:
  - Review is already decided or withdrawn: reject duplicate decision.

---

### OP-06: Archive Client Relationship

- **PRECONDITIONS**:
  - `clientId` exists.
  - No active projects belonging to this client are currently in stage `'active'` or `'in-review'`.
- **ACTION**:
  - Set `client.state = 'archived'`.
  - Set `client.archivedOn = ISO_TIMESTAMP`.
- **SIDE EFFECTS**:
  - Append `ActivityEvent`: `"Archived client '{client.name}'"`.
  - Client is removed from active workspace lists and operator cockpit, but remains queryable in Archive screen and universal search.
- **FAILURE CONDITIONS**:
  - One or more projects under this client are `'active'` or `'in-review'`:
    - **Operation blocked**.
    - Alert operator: `"Cannot archive client with active engagements. Close or resolve active projects first."`
