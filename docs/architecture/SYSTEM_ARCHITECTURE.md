# CoreDesk — System Architecture & Layering Boundaries

> **Status:** IMPLEMENTED (Layering Specified & Partially Integrated)  
> **Last verified:** 2026-09-13  
> **Relevant source areas:** `apps/desktop/electron/main.cjs`, `apps/desktop/electron/preload.cjs`, `packages/contracts/`, `packages/ai-engine/`  
> **Owner domain:** System Engineering & Architecture  

---

## 1. Architectural Principles

1. **Strict Layer Separation**: UI rendering components are completely decoupled from operating system APIs, file system access, and raw database drivers.
2. **Narrow Typed Preload**: No arbitrary `ipcRenderer.send()` or `invoke()` calls are exposed to the browser window. Every operation passes through an explicit, typed context bridge method.
3. **Fail-Closed Security**: The browser window runs with `nodeIntegration: false`, `contextIsolation: true`, and `sandbox: true`. If a privilege check or input validation fails, the request is rejected immediately.
4. **Single Source of Truth**: Operational records exist in one canonical relational store. Multiple views render projections of the same underlying record rather than duplicating state.

---

## 2. Layered Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. RENDERER LAYER (React 19 + TypeScript)                   │
│    Screens, Workspaces, Inspectors, Drawers, State Store    │
└──────────────────────────────┬──────────────────────────────┘
                               │ Calls typed window.coreDeskDesktop
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. TYPED PRELOAD BRIDGE (contextBridge)                     │
│    apps/desktop/electron/preload.cjs                        │
│    - Strips unauthorized access                             │
│    - Validates Zod input schemas                            │
│    - No node require or arbitrary IPC leakage               │
└──────────────────────────────┬──────────────────────────────┘
                               │ Explicit IPC channels (invoke / send)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. MAIN PROCESS & IPC HANDLERS                              │
│    apps/desktop/electron/main.cjs                           │
│    - BrowserWindow management & frameless window controls   │
│    - Sender validation & navigation restrictions            │
│    - Dispatches to Application Services                     │
└──────────────────────────────┬──────────────────────────────┘
                               │ Typed function invocation
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. APPLICATION SERVICES & DOMAIN RULES                      │
│    Task Service, Document Service, Review Engine, AI Engine │
│    - Enforces business invariants                           │
│    - Precondition verification                              │
│    - Side effect generation & activity event logging        │
└──────────────────────────────┬──────────────────────────────┘
                               │ Repository interfaces
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. PERSISTENCE & DATA LAYER                                 │
│    SQLite (database/migrations/) / Local State Store        │
│    - Atomic transactions                                    │
│    - Schema versioning & SQL migrations                     │
│    - Disk persistence in userData/coredesk.sqlite           │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Layer Responsibilities & Ownership

| Layer | Directory / Files | Primary Responsibility | Prohibited Actions |
|---|---|---|---|
| **Renderer Layer** | `apps/desktop/src/` | State presentation, user gesture handling, responsive layouts, optimistic UI updates. | ❌ Direct database access<br>❌ Direct OS filesystem writes<br>❌ Calling Ollama/LLM APIs directly<br>❌ Direct Electron `ipcRenderer` access |
| **Preload Bridge** | `apps/desktop/electron/preload.cjs` | Secure exposure of specific, named API methods via `contextBridge.exposeInMainWorld`. Schema validation. | ❌ Exposing raw `require` or Node globals<br>❌ Exposing generic `invoke(channel, ...)`<br>❌ Bypassing context isolation |
| **Main & IPC** | `apps/desktop/electron/main.cjs` | Window lifecycle, native display metrics, shell URL opening (`shell.openExternal`), IPC routing. | ❌ Direct UI business logic<br>❌ Storing unvalidated client data |
| **App Services** | `packages/ai-engine/`<br>`packages/contracts/` | Enforces business rules, runs transitions, orchestrates AI generation, writes audit events. | ❌ Rendering concerns<br>❌ Direct DOM access |
| **Persistence** | `database/migrations/`<br>`apps/desktop/src/state/db.ts` | Relational indexing, transactional schema consistency, disk storage. | ❌ Business logic decisions<br>❌ Unvalidated write bypass |

---

## 4. Prohibited Shortcuts & Architectural Violations

1. **No Direct SQLite Access in Renderer**: React components must never import database drivers (`better-sqlite3`, `sqlite3`, etc.). All data operations must flow through IPC handlers.
2. **No Direct AI Provider Calls from UI**: A screen must never invoke `fetch('http://localhost:11434/api/generate')`. All AI requests must route through `coredeskAi.generate()` and the backend `TaskRouter`.
3. **No Dynamic Window Chrome Resizing Hacks**: The frameless window controls must communicate maximize/unmaximize states via the established `coredesk:window-state` IPC event stream.
4. **No Unsanitized External URL Navigation**: The Electron `webPreferences.setWindowOpenHandler` must deny all in-window web navigations and route external `https://` links exclusively to the operating system's default browser via `shell.openExternal()`.
