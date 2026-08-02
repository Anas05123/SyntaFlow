---
title: Testing and Quality Assurance Strategy
project: Project Atlas
product: AI Agency OS
version: 1.0
status: Approved Foundation
owners:
  - Founder
  - CTO
last_updated: 2026-08-03
---

# Testing and Quality Assurance Strategy

## Purpose

This document defines how AI Agency OS is tested before features are accepted or released.

Working once is not enough. The software must be correct, secure, reliable, recoverable, maintainable, usable and safe for user data.

## Quality Principles

1. Tests are part of implementation.
2. Critical workflows require automated tests.
3. Success and failure paths must both be tested.
4. User data must never be placed at risk during testing.
5. Tests must run without paid services.
6. External providers use fake or sandbox implementations.
7. Security checks cannot be postponed.
8. Database migrations require dedicated tests.
9. AI output must be evaluated, not blindly trusted.
10. A feature is incomplete until acceptance criteria pass.

## Testing Layers

```text
Static Validation
        â†“
Unit Tests
        â†“
Integration Tests
        â†“
Contract Tests
        â†“
Security Tests
        â†“
End-to-End Tests
        â†“
Manual Product Review
        â†“
Release Validation
```

## Static Validation

Required:

- TypeScript type checking
- ESLint
- Prettier formatting check
- Dependency review
- Secret scanning
- Build verification

Minimum commands:

```powershell
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
```

## Unit Tests

Unit tests verify isolated business logic.

Examples:

- Campaign validation
- Business deduplication
- Opportunity scoring
- Design fingerprint comparison
- Permission decisions
- Job state transitions
- CRM stage rules
- Retry policies
- Path validation

Rules:

- No real network calls.
- No real credentials.
- Deterministic results.
- Edge cases included.

## Integration Tests

Integration tests verify components working together.

Examples:

- SQLite repositories
- Database migrations
- Secure IPC handlers
- Filesystem service
- Ollama adapter
- Discovery providers
- Website compiler
- Backup and restore
- Background jobs

Integration tests use isolated temporary data, never the founder's real database.

## Contract Tests

Required contract areas:

- Main to preload
- Preload to renderer
- Module public APIs
- AI provider interface
- Discovery provider interface
- Deployment provider interface
- Plugin capability interface
- Background job messages

Contract tests confirm valid requests succeed, invalid requests fail safely and errors use approved structures.

## End-to-End Tests

Playwright verifies critical user workflows.

### Campaign Flow

```text
Launch application
â†’ Create campaign
â†’ Save campaign
â†’ Reopen campaign
â†’ Confirm data persists
```

### Discovery Flow

```text
Create campaign
â†’ Start fake discovery job
â†’ Display progress
â†’ Receive businesses
â†’ Remove duplicates
â†’ Save results
```

### Website Flow

```text
Select business
â†’ Create website brief
â†’ Generate website specification
â†’ Compile local website
â†’ Open preview
â†’ Save version
â†’ Export project
```

### CRM Flow

```text
Create business
â†’ Add contact
â†’ Create deal
â†’ Move deal stage
â†’ Add follow-up
â†’ Convert to client
```

### Recovery Flow

```text
Create data
â†’ Create backup
â†’ Modify data
â†’ Restore backup
â†’ Confirm original data returns
```

## Security Tests

Required:

- Renderer cannot access Node.js directly.
- IPC sender validation.
- IPC input validation.
- Path traversal rejection.
- SQL injection protection.
- Unsafe URL rejection.
- SSRF protection.
- Secret redaction.
- Credential permission checks.
- Content Security Policy.
- Navigation blocking.
- Popup blocking.
- Generated-project isolation.
- Plugin permission denial.
- External AI opt-in enforcement.
- Destructive action confirmation.
- Deployment approval requirement.

Critical security failures block release.

## Database Testing

Every migration is tested against:

1. Clean empty database.
2. Previous schema version.
3. Representative existing data.
4. Failure during migration.
5. Backup and recovery behavior.

Released migrations must never be edited.

## Background Job Testing

Every long-running job is tested for:

- Successful completion
- Progress reporting
- Cancellation
- Retry
- Timeout
- Application restart
- Partial completion
- Provider failure
- Invalid output
- Duplicate execution

Jobs must be idempotent where possible.

## Fake Providers

Required fake providers:

- FakeAIProvider
- FakeDiscoveryProvider
- FakeDeploymentProvider
- FakeOutreachProvider
- FakeEmbeddingProvider

Each fake provider supports success, slow response, timeout, invalid response, authentication failure, rate limit, cancellation and unavailable provider.

## AI Testing

### Structural Testing

Verify:

- Correct model profile selected.
- Correct prompt version used.
- Context size remains within limits.
- Output schema is valid.
- Invalid output is rejected.
- Tool permissions are enforced.
- External providers remain opt-in.

### Quality Evaluation

Evaluate:

- Relevance
- Factual grounding
- Business usefulness
- Tone
- Repetition
- Website uniqueness
- Instruction following
- Multilingual handling
- Latency
- Hardware usage

## Website Generator Testing

Every generated website must pass:

- Build success
- No secret exposure
- Dependency validation
- Responsive layout checks
- Broken-link checks
- Basic accessibility checks
- Valid page structure
- Image fallback handling
- Local preview isolation
- Export verification

Design fingerprints must be checked to avoid repetitive AI-looking outputs.

## Backup and Restore Testing

Verify:

- Backup creation
- Backup integrity
- Database consistency
- File inclusion
- Restore confirmation
- Safety backup before restore
- Failed restore recovery
- Version compatibility
- Corrupted-backup rejection

## Performance Testing

Initial checks:

- Startup
- Campaign list loading
- Business-table filtering
- Pagination
- Large business imports
- Database queries
- Background job responsiveness
- Website preview loading
- AI job progress display
- Backup creation

Datasets:

```text
Small: 100 businesses
Medium: 2,000 businesses
Large: 20,000 businesses
```

## Accessibility Testing

Core screens must support:

- Keyboard navigation
- Visible focus
- Form labels
- Error announcements
- Contrast
- Named buttons
- Modal focus trapping
- Table navigation
- Reduced-motion preference

## Test Data Rules

Test data must be fake, repeatable and free of real credentials.

Required industries:

- Restaurants
- Clinics
- Wholesalers
- Retailers
- Professional services

Include incomplete records and multilingual examples.

## Release Gates

A release is approved only when:

- [ ] Type checking passes.
- [ ] Linting passes.
- [ ] Formatting passes.
- [ ] Unit tests pass.
- [ ] Integration tests pass.
- [ ] Security tests pass.
- [ ] Critical end-to-end tests pass.
- [ ] Database migrations pass.
- [ ] Backup and restore pass.
- [ ] No Critical or High bugs remain.
- [ ] No secrets are detected.
- [ ] Build and package succeed.
- [ ] Manual product review is approved.
- [ ] Documentation is updated.

## Codex Testing Rules

Codex must:

1. Identify required test types before implementation.
2. Add tests with the feature.
3. Run relevant commands.
4. Report exact results.
5. Report skipped tests.
6. Explain failures.
7. Preserve failing tests.
8. Avoid real credentials.
9. Update test documentation.
10. Review the final diff.

Codex must never claim tests passed without executing them.

## Architecture Decisions

### ADR-QA-001 - Automated Tests Are Required

**Decision:** Automated tests are part of every implementation.

**Reason:** Manual testing alone cannot protect a growing codebase.

### ADR-QA-002 - Fake Providers by Default

**Decision:** Automated tests use fake providers by default.

**Reason:** Tests remain free, repeatable and independent.

### ADR-QA-003 - Critical Workflows Use End-to-End Tests

**Decision:** Core user journeys receive end-to-end coverage.

**Reason:** Unit tests cannot verify the complete desktop experience.

### ADR-QA-004 - Security Tests Block Releases

**Decision:** Failed critical security tests block releases.

**Reason:** Security is not optional polish.

## Next Action

Keep this linked from [[Engineering Standards and Codex Rules]] and use it in every Codex task.
