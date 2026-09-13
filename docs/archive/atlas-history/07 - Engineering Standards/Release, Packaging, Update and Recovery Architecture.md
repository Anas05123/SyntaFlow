> Historical archive — Atlas was the former working name of CoreDesk.
> This document is not a current source of truth.

---

﻿---
title: Release, Packaging, Update and Recovery Architecture
project: Project Atlas
product: AI Agency OS
version: 1.0
status: Approved Foundation
owners:
  - Founder
  - CTO
last_updated: 2026-08-03
---

# Release, Packaging, Update and Recovery Architecture

## 1. Purpose

This document defines how AI Agency OS is packaged, released, updated, recovered and diagnosed.

The product is a local-first desktop application. Release architecture must protect user data, preserve offline usability, prevent unsafe updates, and make recovery possible when something fails.

This document is implementation-ready and must be followed by Codex during repository setup and release workflow implementation.

---

## 2. Established Decisions

These decisions remain fixed unless changed by a formal Architecture Decision Record.

- AI Agency OS is offline-first.
- There is no mandatory subscription.
- ChatGPT acts as CTO and planning partner.
- Codex acts as implementation engineer.
- Ollama is the default local AI runtime.
- The application uses a modular monolith architecture.
- The desktop stack is Electron, React, TypeScript and SQLite.
- Documentation comes before production implementation.
- Security and user data protection outrank speed.
- Optional cloud services are disabled by default.
- Generated websites are treated as untrusted until validated.
- Releases must never silently risk user data.

---

## 3. Release Goals

The release system must provide:

- Reliable Windows installation
- Safe updates
- Signed release artifacts before commercial distribution
- Clear release channels
- Rollback strategy
- Crash recovery
- Startup recovery
- Migration safety
- Backup and restore protection
- Diagnostic export
- Release validation
- Incident handling

The user should not need technical knowledge to recover from common failures.

---

## 4. Release Channels

AI Agency OS uses three release channels.

| Channel | Purpose | Audience | Stability |
|---|---|---|---|
| Development | Internal testing and Codex validation | Founder and development environment | Unstable |
| Beta | Real usage with controlled risk | Founder and trusted testers | Mostly stable |
| Stable | Production-ready public release | Paying or normal users | Stable |

### 4.1 Development Channel

Rules:

- Can include unfinished features.
- Uses development data by default.
- May show developer tools.
- Must not use production credentials.
- Must not auto-update to Stable.
- May include verbose logging.
- May connect to fake providers.

### 4.2 Beta Channel

Rules:

- Uses real workflows with caution.
- Requires migration tests.
- Requires backup before risky operations.
- May include extra diagnostics.
- Must not silently enable experimental features.
- Beta release notes must list known risks.

### 4.3 Stable Channel

Rules:

- Must pass full release checklist.
- Must not include unfinished features.
- Must not include developer-only tools.
- Must use production security settings.
- Must use signed release artifacts before commercial distribution.
- Must support safe update and recovery behavior.

---

## 5. Versioning

AI Agency OS uses semantic versioning.

```text
MAJOR.MINOR.PATCH
```

Rules:

- Major versions may include breaking changes.
- Minor versions add compatible features.
- Patch versions fix bugs without changing expected behavior.
- Database migrations are tied to application versions.
- Prompt changes that affect output quality require version notes.
- Provider changes require compatibility notes.

Example:

```text
1.0.0 Stable first public release
1.1.0 Adds CRM follow-up reminders
1.1.1 Fixes backup restore edge case
2.0.0 Introduces breaking plugin API changes
```

---

## 6. Windows Packaging Strategy

Version 1 targets Windows first.

Packaging goals:

- Simple installer
- Clean uninstall
- No user data deletion during uninstall unless explicitly selected
- Desktop shortcut
- Start menu shortcut
- Separate application files and user data
- Signed installer before public commercial release

### 6.1 Packaging Tooling

The approved foundation is:

```text
Electron Forge with Vite
```

Initial Windows package target:

```text
Squirrel.Windows or MSI target after validation
```

Final installer target must be selected during repository implementation after checking:

- Update support
- Code-signing support
- Windows compatibility
- Installer size
- Uninstall behavior
- User-data preservation
- CI packaging compatibility

Codex must document the selected target in an ADR before commercial release.

---

## 7. Installation Layout

Application binaries and user data must be separate.

### 7.1 Application Install Directory

Contains:

- Application executable
- Bundled renderer assets
- Runtime files
- Packaged resources
- Update metadata

Must not contain:

- User database
- Client data
- Generated websites
- Backups
- API keys
- Deployment credentials
- Production logs

### 7.2 User Data Directory

Contains:

```text
AI Agency OS Data/
â”œâ”€â”€ database/
â”œâ”€â”€ projects/
â”œâ”€â”€ assets/
â”œâ”€â”€ backups/
â”œâ”€â”€ logs/
â”œâ”€â”€ cache/
â”œâ”€â”€ temporary/
â””â”€â”€ recovery/
```

Rules:

- User data remains after app uninstall unless the user explicitly chooses removal.
- The active data directory is visible in Settings.
- Data directory permissions are validated on startup.
- The application must not store user data in the source repository.
- Development and production data directories remain separate.

---

## 8. Code Signing

Code signing is required before commercial Stable releases.

Signed artifacts include:

- Windows installer
- Application executable
- Update packages where supported
- Release metadata where supported

Rules:

- Signing certificates are never committed.
- Signing credentials are never stored in the repository.
- Signing occurs in a controlled release environment.
- Development builds may be unsigned but must be clearly marked.
- Stable release documentation must state whether the build is signed.

Unsigned public Stable releases are not approved.

---

## 9. Release Artifact Integrity

Every release must produce verifiable artifacts.

Release artifact metadata includes:

- Version
- Channel
- Build date
- Commit hash
- Platform
- Installer filename
- File size
- Hash
- Signature status
- Migration version
- Release notes

Hash algorithm:

```text
SHA-256
```

Rules:

- Users must not be asked to install unknown artifacts.
- Update verification must check integrity before installation.
- Failed verification blocks update installation.
- Release metadata must not be editable by the application after download.

---

## 10. Update Strategy

Updates must be safe, visible and recoverable.

Default behavior:

- Stable channel checks for updates only when enabled or approved.
- Development channel may update manually.
- Beta channel may notify more aggressively.
- No update may install from an unverified source.
- No update may silently migrate user data without backup.

Update flow:

```text
Check for update
      â†“
Fetch release metadata
      â†“
Verify channel compatibility
      â†“
Verify signature and hash
      â†“
Show release notes
      â†“
Create pre-update recovery point
      â†“
Download update
      â†“
Verify downloaded artifact
      â†“
Install update
      â†“
Restart application
      â†“
Run startup recovery checks
      â†“
Run migrations if required
      â†“
Confirm application health
```

---

## 11. Update Verification

Before installing an update, the application must verify:

- Release channel
- Version ordering
- Platform compatibility
- Application compatibility
- Artifact hash
- Signature status
- Update source
- Required migration version
- Minimum supported current version
- Known blocking issues

Verification failure must:

- Stop installation
- Preserve the current version
- Show a clear message
- Record a diagnostic event
- Offer retry only when safe

---

## 12. Update Rollback

Rollback support must be planned from Version 1.

Rollback is required when:

- Update installation fails.
- Application cannot start after update.
- Startup health checks fail.
- Migrations fail safely before committing.
- Update verification later detects corruption.

Rollback must restore:

- Previous application version where supported
- Previous compatible database state when migration failed before commit
- User data access
- Previous settings when update settings fail

Rollback must not:

- Delete user-generated projects
- Delete backups
- Delete logs required for diagnosis
- Hide failed-update evidence

If full application rollback is not technically available in early builds, the application must at least preserve user data and provide manual recovery instructions.

---

## 13. Database Backup Before Migrations

Before any migration that changes user data, AI Agency OS must create a migration safety backup.

Backup flow:

```text
Detect required migration
      â†“
Check database health
      â†“
Create backup
      â†“
Verify backup integrity
      â†“
Run migration in transaction where possible
      â†“
Verify schema version
      â†“
Verify key data integrity
      â†“
Mark migration complete
```

Rules:

- Migration backup must happen before destructive schema changes.
- Backup integrity must be checked before migration begins.
- Failed backup blocks migration.
- Failed migration must preserve or restore the previous valid state.
- Released migrations must never be edited.
- Migration logs must not expose secrets.

---

## 14. Migration Failure Recovery

Migration failure states:

```text
backup_failed
backup_verification_failed
migration_failed
post_migration_validation_failed
restore_failed
manual_recovery_required
```

Recovery rules:

- Preserve the original database whenever possible.
- Never repeatedly attempt a failing migration without user visibility.
- Show an understandable recovery screen.
- Offer restore from the migration backup.
- Keep technical details in diagnostic logs.
- Do not start the application on a partially migrated database.

If automatic recovery fails, the application must provide:

- Backup location
- Error code
- Current database path
- Restore instructions
- Diagnostic export option

---

## 15. Safe Restore

Restore operations are sensitive and must require confirmation.

Restore flow:

```text
User selects backup
      â†“
Validate backup file
      â†“
Check version compatibility
      â†“
Show restore summary
      â†“
Create safety backup of current state
      â†“
Restore selected backup
      â†“
Verify restored database
      â†“
Verify project files
      â†“
Restart application services
      â†“
Show result
```

Rules:

- Existing state is backed up before restore.
- Corrupted backups are rejected.
- Incompatible backups require clear explanation.
- Restore never silently deletes current data.
- Restore failure must attempt to return to the pre-restore state.
- Restore actions create audit events.

---

## 16. Startup Recovery

Startup must include recovery checks before normal application use.

Startup checks:

- Application version
- Data directory access
- Database file existence
- Database integrity
- Migration status
- Previous shutdown status
- Unfinished update status
- Unfinished restore status
- Pending recovery actions
- Required folders
- Log availability
- Settings validity
- Secure Storage availability

Startup recovery flow:

```text
Application starts
      â†“
Load minimal recovery services
      â†“
Check previous state
      â†“
Repair safe filesystem issues
      â†“
Validate database
      â†“
Resume or fail pending recovery
      â†“
Start full application
```

The full UI must not open on an unsafe data state.

---

## 17. Crash Recovery

AI Agency OS must handle unexpected crashes without losing important work.

Crash recovery must preserve:

- Unsaved drafts where practical
- Job state
- Generated website specifications
- Partially completed safe outputs
- Logs
- Diagnostic information

Crash recovery screen should show:

- What happened
- Whether data is safe
- Last successful backup
- Failed jobs
- Recovery options
- Diagnostic export option

Rules:

- Crashes must not corrupt the database.
- Long-running jobs must be resumable or safely marked failed.
- The app must avoid repeating dangerous actions after restart.
- External actions such as deployment or outreach must never automatically repeat after crash without user approval.

---

## 18. Background Job Recovery

Background jobs must survive application restart where practical.

Job recovery states:

```text
resume_available
retry_available
safe_to_mark_failed
manual_review_required
not_recoverable
```

Recovery rules:

- Discovery jobs may resume from last saved page or checkpoint.
- Enrichment jobs may continue remaining businesses.
- AI generation may restart safely from the last approved stage.
- Website compilation may clean and rebuild.
- Deployment jobs require status check before retry.
- Outreach sending requires manual review before retry.
- Backup and restore jobs require special recovery screens.

Jobs must be idempotent where possible.

---

## 19. Generated Project Recovery

Generated website projects are user-facing assets and must be recoverable.

Each generated project should contain:

```text
project-id/
â”œâ”€â”€ specification/
â”œâ”€â”€ source/
â”œâ”€â”€ assets/
â”œâ”€â”€ builds/
â”œâ”€â”€ previews/
â”œâ”€â”€ versions/
â””â”€â”€ recovery/
```

Recovery rules:

- Website specifications are saved before compilation.
- Website versions are immutable after approval.
- Failed builds do not overwrite the last good version.
- A new revision creates a new version.
- Export failures preserve generated source.
- Deployment failures preserve local output.
- The user can reopen the last good preview.
- The user can compare failed and previous versions when safe.

---

## 20. Backup Architecture

Backups include:

- SQLite database
- Website project metadata
- Approved generated project versions
- Settings excluding secrets
- Prompt versions where needed
- Atlas memory
- Audit metadata

Backups do not include by default:

- Raw secret values
- Credential tokens
- Temporary cache
- Large build artifacts unless selected
- Unnecessary logs

Backup types:

| Type | Trigger | Purpose |
|---|---|---|
| Automatic safety backup | Before migrations and restore | Recovery |
| Manual backup | User action | Data portability |
| Scheduled backup | Optional future setting | Resilience |
| Diagnostic backup | Support workflow | Debugging without secrets |

---

## 21. Backup Integrity

Every backup must include metadata.

```json
{
  "backupId": "string",
  "createdAt": "ISO-8601",
  "appVersion": "string",
  "schemaVersion": "string",
  "channel": "Stable",
  "contents": [],
  "hash": "sha256",
  "encrypted": false
}
```

Rules:

- Backup integrity is verified after creation.
- Restore verifies integrity before modifying current data.
- Partial backups are marked clearly.
- Failed backups are not shown as valid restore points.
- Future encrypted backups require password and recovery warnings.

---

## 22. Failed-Update Recovery

Failed-update recovery states:

```text
download_failed
verification_failed
installation_failed
restart_failed
post_update_health_failed
migration_blocked
rollback_required
manual_repair_required
```

The application must:

- Preserve current data.
- Preserve previous working version when possible.
- Avoid repeated failing updates.
- Save diagnostic logs.
- Show the failed version and previous version.
- Let the user retry, postpone or export diagnostics.
- Block update when the same failure repeats until the update source changes or the user approves retry.

---

## 23. Diagnostic Export

Users must be able to export diagnostics without exposing secrets.

Diagnostic export may include:

- Application version
- Release channel
- Operating system
- Installation path
- Data path
- Database schema version
- Recent non-sensitive logs
- Crash reports
- Failed job summaries
- Migration status
- Provider health status
- Configuration summary
- Redacted error details

Diagnostic export must not include:

- API keys
- Access tokens
- Passwords
- Deployment credentials
- Full private messages
- Hidden AI reasoning
- Raw customer data unless explicitly selected

Export format:

```text
diagnostics-YYYYMMDD-HHMM.zip
```

The user must see what categories are included before export.

---

## 24. Logging for Release and Recovery

Required logs:

```text
application.log
jobs.log
security.log
update.log
migration.log
backup.log
crash.log
```

Rules:

- Logs rotate.
- Logs have retention limits.
- Logs are redacted.
- Security events are separated.
- Update and migration logs are preserved after failure.
- Logs are accessible through Settings.
- Exported logs are redacted again.

---

## 25. Incident Handling

An incident is any event that may affect data safety, credentials, release integrity or application trust.

Examples:

- Broken update
- Data-loss bug
- Credential exposure
- Unsafe generated project behavior
- Corrupted migration
- Failed restore
- Security vulnerability
- Malicious dependency
- Incorrect release artifact

Incident response:

1. Stop affected release or update.
2. Preserve diagnostic evidence.
3. Identify affected versions.
4. Identify affected data or users.
5. Create a fix branch.
6. Add regression tests.
7. Validate migration and recovery behavior.
8. Release a signed fix.
9. Document the incident.
10. Update prevention rules.

Critical incidents must not be hidden or silently patched.

---

## 26. Release Notes

Every Beta and Stable release requires release notes.

Release notes must include:

- Version
- Channel
- Release date
- New features
- Fixes
- Security changes
- Migration notes
- Backup recommendation
- Known issues
- Recovery notes if applicable

Release notes must not claim unfinished features are complete.

---

## 27. Release Checklist

Before a Stable release:

- [ ] Version number is updated.
- [ ] Release notes are written.
- [ ] Type checking passes.
- [ ] Linting passes.
- [ ] Formatting check passes.
- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] Security tests pass.
- [ ] Critical end-to-end tests pass.
- [ ] Database migration tests pass.
- [ ] Backup and restore tests pass.
- [ ] Update verification tests pass.
- [ ] Failed-update recovery is tested.
- [ ] Crash recovery is tested.
- [ ] Diagnostic export is tested.
- [ ] No Critical or High bugs remain.
- [ ] No secrets are detected.
- [ ] Dependency review is complete.
- [ ] Installer builds successfully.
- [ ] Installer uninstall behavior is tested.
- [ ] User data remains separate from application files.
- [ ] Release artifacts are hashed.
- [ ] Release artifacts are signed when required.
- [ ] Manual product review is approved.
- [ ] Documentation is updated.

---

## 28. Release-Blocking Conditions

A release is blocked when any of these are true:

- Critical or High security vulnerability exists.
- User data loss risk is unresolved.
- Database migration test fails.
- Backup or restore test fails.
- Update verification fails.
- Installer cannot install or uninstall safely.
- Secrets appear in source, logs or generated artifacts.
- Renderer security settings are weakened.
- Generated websites can access application secrets.
- External providers are enabled by default without approval.
- Critical workflows fail.
- Signed release requirement is unmet for commercial Stable.
- Diagnostic export exposes sensitive data.
- Documentation materially conflicts with implementation.
- Codex reports tests passed without actually running them.

---

## 29. Release Validation Commands

Minimum local validation:

```powershell
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
```

Release validation:

```powershell
pnpm test:integration
pnpm test:security
pnpm test:e2e
pnpm package
pnpm make
```

Database validation:

```powershell
pnpm db:migrate
pnpm db:status
pnpm db:backup
```

Exact commands may change during repository setup, but their responsibilities must remain.

---

## 30. User-Facing Recovery Experience

Recovery screens must be calm and clear.

They must answer:

- What happened?
- Is my data safe?
- What can I do now?
- What will the application do?
- Where is the backup?
- Can I export diagnostics?

Recovery messages must avoid technical panic.

Bad:

```text
Fatal database migration exception.
```

Approved:

```text
AI Agency OS could not finish updating your local database. Your previous data was backed up before the update. You can restore the backup or export diagnostics for review.
```

---

## 31. Codex Implementation Rules

Codex must:

1. Read this document before release-related implementation.
2. Respect Security Architecture rules.
3. Keep user data outside the install directory.
4. Implement recovery before risky migrations.
5. Use fake update and fake provider tests first.
6. Add tests for failure paths.
7. Report exact validation commands and results.
8. Update documentation when release behavior changes.

Codex must not:

- Add automatic updates without verification.
- Store credentials in release files.
- Disable code signing checks for Stable.
- Delete user data during uninstall.
- Run migrations without safety backup.
- Hide failed updates.
- Treat generated projects as trusted app code.
- Claim rollback exists before implementing and testing it.

---

## 32. Acceptance Criteria

- [ ] Windows installer strategy is defined.
- [ ] Application files and user data are separated.
- [ ] Stable commercial releases require signing.
- [ ] Release channels are defined.
- [ ] Update verification checks signatures or integrity.
- [ ] Failed updates preserve user data.
- [ ] Rollback behavior is documented.
- [ ] Startup recovery checks unsafe states.
- [ ] Crashes preserve recoverable work where practical.
- [ ] Database migrations create verified safety backups.
- [ ] Restore creates a safety backup before modifying current data.
- [ ] Generated project recovery preserves last good versions.
- [ ] Logs are redacted and exportable.
- [ ] Diagnostic export excludes secrets.
- [ ] Release checklist exists.
- [ ] Release-blocking conditions are defined.
- [ ] Incident handling process exists.
- [ ] Codex implementation rules are explicit.

---

## 33. Architecture Decisions

### ADR-REL-001 â€” Windows First

**Decision:** Version 1 targets Windows packaging first.

**Reason:** The founder develops and uses the product on Windows, and focusing on one platform reduces early release complexity.

### ADR-REL-002 â€” Separate Application and User Data

**Decision:** Application binaries and user data are stored separately.

**Reason:** Updates and uninstalls must not risk local business data, generated projects or backups.

### ADR-REL-003 â€” Signed Stable Releases

**Decision:** Commercial Stable releases require signed artifacts.

**Reason:** Users must be able to trust installers and updates.

### ADR-REL-004 â€” Verified Updates Only

**Decision:** Updates must verify integrity before installation.

**Reason:** Unverified updates create unacceptable security and trust risk.

### ADR-REL-005 â€” Backup Before Migration

**Decision:** Data-changing migrations require verified safety backups.

**Reason:** Local-first software must prioritize user data recovery.

### ADR-REL-006 â€” Recovery Is a Core Feature

**Decision:** Crash, startup, update, migration, restore and generated-project recovery are part of core architecture.

**Reason:** A professional desktop product must handle failure without losing user work.

### ADR-REL-007 â€” Diagnostic Export With Redaction

**Decision:** Diagnostic export must exist and must redact sensitive data.

**Reason:** Debugging needs evidence, but privacy and credential safety remain mandatory.

### ADR-REL-008 â€” No Silent Risky Updates

**Decision:** Updates that require migrations, new permissions or risky changes require visible user confirmation.

**Reason:** The user owns the local workspace and must control high-impact changes.

---

## 34. Next Action

Perform the Architecture Freeze Audit.

The audit must check all approved Project Atlas documents for:

- Conflicting decisions
- Missing architecture boundaries
- Missing security controls
- Missing recovery behavior
- Missing Codex rules
- Missing acceptance criteria
- Unclear implementation order
- Features that are not ready for Codex

After the audit is complete, create Codex Task 001: Repository Foundation.

