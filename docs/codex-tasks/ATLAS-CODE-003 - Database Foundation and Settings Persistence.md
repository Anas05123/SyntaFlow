---
title: ATLAS-CODE-003 - Database Foundation and Settings Persistence
project: Project Atlas
product: AI Agency OS
task_id: ATLAS-CODE-003
status: Ready
owner: Codex
approved_by:
  - Founder
  - CTO
last_updated: 2026-08-03
---

# ATLAS-CODE-003 - Database Foundation and Settings Persistence

## Objective

Create the durable local database foundation and persist safe user settings without implementing product features.

This task upgrades the Task 002 skeletons into real local runtime foundations:

- SQLite database adapter
- Migration metadata persistence
- Durable settings persistence for non-sensitive settings
- Backup-safe database initialization
- Integration tests using isolated temporary databases
- Documentation updates

This task must not implement campaigns, business discovery, AI/Ollama runtime, CRM, website generation, deployment providers, plugin runtime, outreach, analytics, or product database tables.

---

## Required Reading

Codex must read:

- `docs/handbook/Project Atlas Home.md`
- `docs/architecture/Database Architecture.md`
- `docs/architecture/Security Architecture.md`
- `docs/architecture/System Architecture.md`
- `docs/architecture/Engineering Standards and Codex Rules.md`
- `docs/architecture/Repository Structure and Development Environment.md`
- `docs/architecture/Testing and Quality Assurance Strategy.md`
- `docs/codex-tasks/ATLAS-CODE-002 - Foundation Runtime Services.md`
- `docs/codex-tasks/ATLAS-CODE-002 Completion Report.md`

If any requirement conflicts, Codex must stop and report the conflict before implementation.

---

## Included Scope

Codex may implement only foundation persistence work:

1. Add a justified SQLite dependency.
2. Create a database connection factory.
3. Create foundation metadata tables only.
4. Persist migration version tracking.
5. Run migrations transactionally.
6. Add database health checks.
7. Persist safe non-sensitive settings.
8. Keep sensitive settings reserved for future Secure Storage.
9. Add backup-safe initialization hooks.
10. Add isolated integration tests.
11. Update README and relevant docs.

---

## Excluded Scope

Codex must not implement:

- Campaign tables
- Business tables
- Contact tables
- Discovery records
- AI memory tables
- Website project tables
- CRM tables
- Deployment tables
- Plugin tables
- Real provider integrations
- Credential storage
- Encryption claims
- Product UI screens
- Product workflows

---

## Database Requirements

### SQLite Adapter

Create a small database foundation inside:

```text
apps/desktop/src/core/database/
```

It must provide:

- Open database
- Close database
- Execute statements
- Query rows
- Run transactions
- Enable foreign keys
- Report health

The database path must come from the approved App Data Path Resolver.

The renderer must not access SQLite directly.

---

### Dependency Requirement

If adding SQLite, Codex must document:

- Package selected
- Why it was selected
- Native build implications
- License
- Security considerations
- Why alternatives were not selected

The dependency must be added only where needed.

---

### Foundation Tables Only

Allowed tables:

```text
schema_migrations
app_settings
foundation_metadata
```

No product tables are allowed in this task.

---

### Migration Metadata

`schema_migrations` must track:

- Migration ID
- Description
- Applied timestamp
- Checksum if practical
- Application version if available

Migrations must be idempotent where practical.

Released migrations must not be edited after approval.

---

### Transaction Safety

Migration execution must:

- Check current applied migrations.
- Apply pending migrations in order.
- Run each migration inside a transaction where supported.
- Record the migration only after success.
- Stop on failure.
- Avoid leaving partial metadata.
- Surface safe errors.

---

### Backup Hook

Before applying migrations to an existing database, the runner must support a backup hook.

For this task:

- The hook may be a tested interface.
- A simple local copy backup may be implemented if safe.
- Backup files must stay inside the approved backup directory.
- No backup should overwrite an existing backup silently.

---

## Settings Persistence Requirements

Persist safe settings such as:

- Theme mode
- Log level
- Ollama base URL
- Default AI privacy mode
- App data path display value

Rules:

- Validate settings using the existing schema.
- Store only non-sensitive settings.
- Do not store API keys, deployment tokens, passwords, or credentials.
- Settings read failure must fall back safely to defaults and log the issue.
- Invalid persisted settings must be rejected or repaired safely.
- Settings writes must be transactional.
- Renderer receives settings only through approved future IPC, not direct database access.

---

## Scripts

Update the existing scripts:

```text
pnpm db:status
pnpm db:migrate
pnpm db:backup
```

They must use safe development data paths and must not touch real production data by default.

The scripts must print clear JSON output.

---

## Security Requirements

- Renderer still has no direct Node.js or SQLite access.
- Database path is resolved through the approved path resolver.
- Path traversal is rejected.
- Queries use parameters.
- Settings validation uses schemas.
- Secrets are not stored in settings.
- Logs redact sensitive values.
- Migration errors are safe to display.
- Test databases use temporary folders.
- No real user database is modified during tests.
- No product schema is introduced.

---

## Testing Requirements

Add or update tests for:

- Database open and close
- Foreign keys enabled
- Migration status before and after migration
- Migration transaction failure behavior
- Migration idempotency
- Backup hook invocation
- Isolated temporary database usage
- Settings default load
- Settings persistence
- Settings validation failure
- Sensitive settings rejection
- Safe database health output
- `db:status`, `db:migrate`, and `db:backup` script behavior

Tests must not require paid services, production credentials, real deployments, or the founder's real database.

---

## Expected Validation Commands

Codex must run:

```powershell
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm test:integration
pnpm test:security
pnpm db:status
pnpm db:migrate
pnpm db:backup
pnpm build
pnpm validate
```

If Electron is available locally, Codex should also run:

```powershell
pnpm --filter @atlas/desktop exec electron --version
```

If Electron is still unavailable, Codex must document the exact blocker and local manual command.

---

## Acceptance Criteria

- [ ] SQLite dependency is justified.
- [ ] Database connection factory exists.
- [ ] Foreign keys are enabled.
- [ ] Foundation tables exist.
- [ ] No product tables exist.
- [ ] Migration metadata persists.
- [ ] Migrations run transactionally.
- [ ] Migration failure behavior is tested.
- [ ] Backup hook exists and is tested.
- [ ] Safe settings persist.
- [ ] Sensitive settings are not persisted.
- [ ] Tests use isolated temporary databases.
- [ ] Renderer remains unprivileged.
- [ ] Database scripts work safely.
- [ ] Documentation is updated.
- [ ] Validation commands pass or documented environment-only blockers remain.

---

## Completion Report Required

Codex must report:

- Files created
- Files modified
- Dependencies added
- Dependency justification
- Database tables created
- Confirmation that no product schema was added
- Commands run
- Validation results
- Runtime smoke-test result or blocker
- Security controls added
- Assumptions
- Known limitations
- Remaining risks
- Recommended next task

Codex must not implement Task 004.

---

## Next Task Preview

If ATLAS-CODE-003 passes review, the likely next task is:

```text
ATLAS-CODE-004 - Secure Storage and Credential Foundation
```

That future task will introduce OS-protected credential storage for secrets and provider tokens.
