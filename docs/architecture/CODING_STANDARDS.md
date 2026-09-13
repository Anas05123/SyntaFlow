# CoreDesk — Engineering Standards & Coding Rules

> **Status:** ACTIVE & ENFORCED  
> **Last verified:** 2026-09-13  
> **Relevant source areas:** `apps/desktop/tsconfig.app.json`, `apps/desktop/.oxlintrc.json`, `tsconfig.base.json`  
> **Owner domain:** Engineering Operations  

---

## 1. TypeScript & Static Analysis

1. **Strict Mode Enabled**: `strict: true` is enforced across all `tsconfig.json` configurations.
2. **No Implicit `any`**: All variables, parameters, and return types must be explicitly typed or inferred cleanly.
3. **No Type Assertions (`as any`)**: Bypassing the type system with `as any` or `@ts-ignore` is strictly prohibited unless interfacing with legacy third-party binary C-bindings.
4. **Zod Schema Runtime Validation**: All data crossing process or IPC boundaries must be validated with Zod schemas.

---

## 2. Layering Boundaries & Prohibitions

- **No Renderer Database Imports**: Components in `apps/desktop/src/` must never import `better-sqlite3`, `sqlite3`, or node filesystem modules.
- **No Direct AI Provider Calls**: React components must never invoke `fetch()` directly against LLM APIs. All AI tasks route through the backend `TaskRouter`.
- **Preload API Minimization**: The context bridge must expose only named, purpose-built functions. Never expose raw `ipcRenderer` or dynamic channel invocations.

---

## 3. Component Architecture & State Hygiene

1. **Component Sizing**: React components should stay under 400 lines of code. Sub-views (e.g. table rows, cards, popover items) should be extracted into separate component files.
2. **State Ownership**:
   - Canonical business entities (`Client`, `Project`, `Task`, `Document`) belong to the central store (`store.tsx`).
   - Ephemeral UI state (dropdown open/close, hover state, text input values) belongs to local component `useState`.
3. **Pure Reducer Functions**: Reducers in `store.tsx` must be deterministic and side-effect free. They must never mutate previous state objects directly.
4. **Single Source of Truth**: Never duplicate canonical fields into separate state slices. Multiple views must query the same record using derived selectors (`derived.taskById`, `derived.clientById`).

---

## 4. Documentation Maintenance Contract

> [!IMPORTANT]
> **DOCUMENTATION IS PART OF THE IMPLEMENTATION.**
> A pull request or task is not complete if source code changes but architectural documentation in `docs/coredesk/` becomes inaccurate. Future AI agents must update affected documentation files in `docs/coredesk/` before completing any substantial task.
