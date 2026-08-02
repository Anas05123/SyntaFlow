---
title: ATLAS-CODE-002 - Foundation Runtime Services
project: Project Atlas
product: AI Agency OS
task_id: ATLAS-CODE-002
status: Ready
owner: Codex
approved_by:
  - Founder
  - CTO
last_updated: 2026-08-03
---

# ATLAS-CODE-002 - Foundation Runtime Services

## Objective

Create the first runtime service foundation for AI Agency OS without implementing product features.

This task adds the safe internal services that future modules will depend on:

- App data path resolver
- Settings service skeleton
- Structured logging service
- Secure IPC registration helper
- Job Service skeleton
- Database migration runner skeleton
- Startup health checks connected to the existing foundation shell

This task must not implement campaigns, business discovery, AI runtime, CRM, website generation, deployment providers, plugin runtime, or product database schema.

---

## Required Reading

Codex must read:

- `docs/handbook/Project Atlas Home.md`
- `docs/architecture/System Architecture.md`
- `docs/architecture/Security Architecture.md`
- `docs/architecture/Database Architecture.md`
- `docs/architecture/AI Engine Architecture.md`
- `docs/architecture/Module and Plugin Architecture.md`
- `docs/architecture/Engineering Standards and Codex Rules.md`
- `docs/architecture/Repository Structure and Development Environment.md`
- `docs/architecture/Testing and Quality Assurance Strategy.md`
- `docs/codex-tasks/Codex Task 001 - Repository Foundation.md`
- `docs/codex-tasks/ATLAS-CODE-001 Completion Report.md`

If any requirement conflicts, Codex must stop and report the conflict before implementation.

---

## Included Scope

Codex may create or modify files only inside the existing repository foundation.

Included work:

1. App data path resolver
2. Settings service skeleton
3. Structured logging service
4. Secure IPC registration helper
5. Job Service skeleton
6. Migration runner skeleton
7. Startup health aggregation
8. Tests for the above
9. Documentation updates for the new foundation services

---

## Excluded Scope

Codex must not implement:

- Campaign module behavior
- Business discovery
- Business enrichment
- Ollama integration
- Atlas AI runtime
- Website generation
- Website compiler
- CRM
- Outreach
- Deployment providers
- Plugin runtime
- Real product database tables
- Real provider credentials
- Real external API calls
- Licensing
- Auto-update implementation
- Installer packaging

---

## Service Requirements

### 1. App Data Path Resolver

Create a service responsible for resolving approved application data directories.

It must provide paths for:

- Database
- Projects
- Assets
- Backups
- Logs
- Cache
- Temporary files

Rules:

- User data must remain outside the source repository.
- Development and production data paths must be separate.
- Paths must be normalized.
- Path traversal must be rejected.
- Direct renderer access to filesystem paths remains forbidden.
- Tests must use isolated temporary directories.

Suggested location:

```text
apps/desktop/src/core/filesystem/
```

---

### 2. Settings Service Skeleton

Create a typed settings service skeleton.

It must support:

- Reading settings
- Updating settings
- Validating settings with schemas
- Returning defaults
- Separating sensitive and non-sensitive settings

Version 1 skeleton settings may include:

- Theme mode
- Log level
- Ollama base URL
- Default AI privacy mode
- Application data path display value

Rules:

- No secrets are stored in plain settings.
- Sensitive credentials remain reserved for a future Secure Storage Service.
- Renderer receives only safe settings through approved IPC.

Suggested location:

```text
apps/desktop/src/core/settings/
```

---

### 3. Structured Logging Service

Replace the loose redaction helper with a small structured logging foundation.

It must support:

- `debug`
- `info`
- `warn`
- `error`
- `security`

Log events should include:

- Timestamp
- Level
- Module
- Operation
- Optional request ID
- Optional job ID
- Message
- Redacted metadata

Rules:

- Secrets must be redacted.
- Logs must not expose API keys, passwords, tokens, deployment credentials, or hidden AI reasoning.
- File writing may be skeleton-only if the app data path service is not ready for durable logs yet.
- Console logging is allowed in development only through the logger abstraction.

Suggested location:

```text
apps/desktop/src/core/logging/
```

---

### 4. Secure IPC Registration Helper

Create a helper that registers IPC handlers with:

- Channel name
- Input schema
- Output schema
- Permission placeholder
- Handler function
- Safe error translation
- Logging

Rules:

- Renderer input is untrusted.
- Every IPC input must be validated.
- Every IPC output must be validated.
- Unknown channels are not exposed.
- Errors returned to renderer must not contain stack traces or secrets.
- Existing `app:health` IPC should migrate to this helper.

Suggested location:

```text
apps/desktop/src/main/ipc/
```

---

### 5. Job Service Skeleton

Create an in-memory Job Service skeleton for future long-running tasks.

It must support:

- Create job
- Read job
- List jobs
- Update progress
- Complete job
- Fail job
- Cancel job where possible

Approved base states:

```text
queued
running
completed
failed
cancelled
```

Rules:

- No real discovery, AI, deployment, or website work.
- Jobs must have stable IDs.
- Job errors must use structured application errors.
- Job state transitions must be tested.
- Future persistence can be added later.

Suggested location:

```text
apps/desktop/src/core/jobs/
```

---

### 6. Migration Runner Skeleton

Create a database migration runner skeleton without product schema.

It must support:

- Reading migration metadata
- Listing migration files
- Reporting pending migrations
- Applying no-op foundation migration safely
- Recording migration version in a foundation metadata table if SQLite is introduced

Rules:

- Do not create campaign, business, AI, CRM, or website tables.
- If SQLite dependency is added, justify it.
- If SQLite is deferred, create the runner interface and fake/test implementation only.
- Migrations must be idempotent where possible.
- Tests must use temporary isolated data.

Suggested locations:

```text
apps/desktop/src/core/database/
migrations/
scripts/database/
```

---

### 7. Startup Health Aggregation

Extend the existing foundation health check so it reports safe runtime-service status.

It may report:

- App status
- App data path status
- Settings service status
- Logger status
- Job service status
- Migration status

Rules:

- Health output must not expose local private paths to the renderer unless explicitly approved.
- The renderer may display a simple foundation status only.
- No product dashboard should be created.

---

## Security Requirements

Codex must ensure:

- Renderer still has no direct Node.js access.
- Renderer still cannot access filesystem, SQLite, provider SDKs, or credentials directly.
- Preload exposes only narrow typed APIs.
- IPC input and output validation is mandatory.
- Logs redact secrets.
- Settings do not store secrets.
- App data paths are normalized and constrained.
- Errors sent to renderer are safe.
- No external provider is enabled.
- No real credentials are introduced.

---

## Testing Requirements

Add tests for:

- Path resolution and path traversal rejection
- Settings defaults and validation failures
- Secret redaction and structured logging
- Secure IPC validation success and failure
- Safe IPC error mapping
- Job state transitions
- Job cancellation
- Migration runner pending-state behavior
- Health aggregation output

Tests must use fake or temporary resources only.

No test may use real credentials, real user data, or the founder’s real application database.

---

## Expected Validation Commands

Codex must run:

```powershell
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
pnpm validate
```

If Electron runtime smoke testing is possible, Codex should also run it and report the result.

If Electron cannot launch because the binary is unavailable or the environment blocks its cache, Codex must report the exact blocker.

---

## Acceptance Criteria

- [ ] App data path resolver exists and is tested.
- [ ] Settings service skeleton exists and is tested.
- [ ] Structured logging service exists and is tested.
- [ ] Secure IPC registration helper exists and is tested.
- [ ] Existing health IPC uses the secure IPC helper.
- [ ] Job Service skeleton exists and is tested.
- [ ] Migration runner skeleton exists and is tested.
- [ ] Startup health aggregation reports foundation service status.
- [ ] Renderer remains unprivileged.
- [ ] No product features are implemented.
- [ ] No real database product schema is added.
- [ ] No external providers are enabled.
- [ ] No secrets are introduced.
- [ ] Documentation is updated.
- [ ] Validation commands pass or any runtime-only blocker is clearly documented.

---

## Completion Report Required

Codex must report:

- Files created
- Files modified
- Dependencies added
- Whether any dependency was rejected or deferred
- Commands run
- Validation results
- Runtime smoke-test result or blocker
- Security controls added
- Assumptions
- Known limitations
- Remaining risks
- Recommended next task

Codex must not implement Task 003.

---

## Next Task Preview

If ATLAS-CODE-002 passes review, the likely next task is:

```text
ATLAS-CODE-003 - Database Foundation and Settings Persistence
```

That future task may introduce the real SQLite library, migration persistence, durable settings storage and backup-safe database initialization.
