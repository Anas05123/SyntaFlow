---
name: coredesk-data
description: Use for CoreDesk domain models, state management, store reducers, persistence migration, and SQLite schemas.
---

# CoreDesk Data & State Management Skill

## Purpose
Use when modifying domain entities, updating state reducers (`store.tsx`), writing database queries (`db.ts`), or implementing SQLite migrations.

## Required Reading (Read First)
1. [`docs/architecture/DATA_MODEL.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/architecture/DATA_MODEL.md)
2. [`docs/product/DOMAIN_RULES.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/product/DOMAIN_RULES.md)
3. [`docs/architecture/SYSTEM_ARCHITECTURE.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/architecture/SYSTEM_ARCHITECTURE.md)

## Key Source Directories
- `apps/desktop/src/domain/`
- `apps/desktop/src/state/`
- `database/migrations/`

## Non-Negotiable Rules
- **Pure Reducers**: State updates in `store.tsx` must be immutable and side-effect free.
- **Single Canonical Task**: Never duplicate task records across separate state arrays; Home, Tasks, and Projects must query projections of the same `Task` object.
- **Dependency Invariant**: Tasks blocked by incomplete prerequisite dependencies cannot transition to `done`.
- **Activity Logging Once**: Task completions and critical mutations must append exactly one `ActivityEvent`; prevent duplicate logging on repeated calls.
- **No Direct Renderer DB Access**: The React frontend must never import SQLite drivers directly; data operations must pass through typed IPC.

## Validation Commands
```bash
cd apps/desktop
npm run build
npm run check:routes
```

## Post-Work Documentation Updates
- Update [`docs/architecture/DATA_MODEL.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/architecture/DATA_MODEL.md) if schema fields or relationships change.
- Update [`docs/product/DOMAIN_RULES.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/product/DOMAIN_RULES.md) if invariants or side effects change.
