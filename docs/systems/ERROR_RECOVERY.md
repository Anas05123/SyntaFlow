# CoreDesk — Error Handling, Fault Tolerance & Recovery

> **Status:** IMPLEMENTED in State Reducers & UI Guards  
> **Last verified:** 2026-09-13  
> **Relevant source areas:** `coredesk-app/src/state/store.tsx`, `coredesk-app/src/screens/`  
> **Owner domain:** Reliability & Fault Tolerance  

---

## 1. Resilience Philosophy

CoreDesk operates under a **fail-safe, zero-data-loss** philosophy:
- Optimistic updates must roll back cleanly if an invariant is violated.
- Unsaved drafts remain preserved in memory and local storage.
- External service failures (Ollama offline, network drop) must never crash the desktop app or freeze UI interactions.

---

## 2. Failure Scenarios & Recovery Procedures

| Scenario | What the User Sees | What Data Remains Safe | Recovery & Retry Action |
|---|---|---|---|
| **Storage / Save Failure** | Warning toast: *"Failed to save changes. Operating on local cache."* | In-memory store retains current modifications. Previous disk snapshot remains untouched. | System automatically retries disk write on next state mutation; operator can trigger manual export. |
| **Invalid Drag-and-Drop** | Card snaps back to origin column. Toast: *"Cannot Complete: Prerequisite tasks must be completed first."* | Canonical task status, order, and dependencies remain completely unmodified. | Complete prerequisite tasks or drop card into permitted column (e.g. `In Progress`). |
| **Local AI (Ollama) Offline** | Toast: *"Local AI unavailable. Ensure Ollama is running at localhost:11434."* | Working brief, prompt text, and existing document sections remain intact. | Start Ollama service (`ollama serve`) and click "Retry Generation". |
| **PDF Export Failure** | Toast: *"Export failed. Could not write PDF to disk."* | Document content, version history, and working draft remain 100% safe. | Verify disk write permissions, check available storage, and retry export. |
| **Expired Guest Access Link** | Full-screen notice: *"This review link has expired."* | Document version and historical feedback remain archived and intact. | Contact workspace owner to regenerate an extended access link via Share screen. |
| **Revoked Guest Access Link** | Full-screen notice: *"Access to this resource has been revoked."* | No client data is exposed to unauthorized visitor. | Operator may re-authorize client contact in `ShareSetupScreen.tsx`. |
| **Network Disconnect (Guest Portal)** | Offline banner: *"Network connection lost. Reconnecting…"* | Form input (comments, decisions) is cached in session storage. | Page auto-syncs when connection is restored; submit button enables on reconnection. |

---

## 3. Transaction Rollback Pattern

All state mutations in `store.tsx` execute as pure reducer functions. If an action fails validation (e.g. prerequisite blocked), the reducer returns `state` unmodified:
```typescript
case 'task/status': {
  const target = state.tasks.find(t => t.id === action.id);
  if (!target) return state;

  // Enforce blocker safety
  if (action.status === 'done' && derived.isTaskBlocked(target)) {
    // Return unmodified state; trigger UI alert
    return state;
  }

  // Pure immutable update
  return {
    ...state,
    tasks: state.tasks.map(t => t.id === action.id ? { ...t, status: action.status } : t),
  };
}
```
