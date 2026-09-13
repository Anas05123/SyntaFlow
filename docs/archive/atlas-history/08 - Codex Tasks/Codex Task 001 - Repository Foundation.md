> Historical archive — Atlas was the former working name of CoreDesk.
> This document is not a current source of truth.

---

﻿---
title: Codex Task 001 - Repository Foundation
project: Project Atlas
product: AI Agency OS
task_id: ATLAS-CODE-001
status: Ready
owner: Codex
approved_by:
  - Founder
  - CTO
last_updated: 2026-08-03
---

# Codex Task 001 - Repository Foundation

## Objective

Initialize the AI Agency OS repository foundation according to the approved Engineering Handbook.

This task creates the development structure, tooling, validation commands and secure desktop foundation skeleton.

It must not implement product features.

---

## Required Reading

Codex must read these files before implementation:

- [[../00 - Project Index/Project Atlas Home]]
- [[../01 - Product/Product Vision]]
- [[../01 - Product/Product Requirements]]
- [[../03 - Architecture/System Architecture]]
- [[../04 - AI Engine/AI Engine Architecture]]
- [[../05 - Security/Security Architecture]]
- [[../06 - Modules/Module and Plugin Architecture]]
- [[../06 - Modules/Module Registry]]
- [[../07 - Engineering Standards/Engineering Standards and Codex Rules]]
- [[../07 - Engineering Standards/Repository Structure and Development Environment]]
- [[../07 - Engineering Standards/Testing and Quality Assurance Strategy]]
- [[../07 - Engineering Standards/Release, Packaging, Update and Recovery Architecture]]
- [[../09 - Decisions/Decision Log]]
- [[../09 - Decisions/Architecture Freeze Audit]]

---

## Included Scope

Codex may create:

- Git repository foundation if not already created
- `pnpm` workspace
- Root `package.json`
- `pnpm-workspace.yaml`
- TypeScript base configuration
- ESLint configuration
- Prettier configuration
- `.editorconfig`
- `.gitignore`
- `.env.example`
- Root `README.md`
- `apps/desktop` package
- Electron Forge + Vite foundation
- React renderer foundation
- Secure main/preload/renderer folder separation
- Placeholder secure preload bridge
- Empty approved source folders
- Internal package folders
- Test foundation with Vitest and Playwright configuration
- Basic fake-provider test utilities if needed for validation skeleton
- GitHub Actions validation workflow
- Documentation folder mirroring approved vault documents

---

## Excluded Scope

Codex must not implement:

- Campaign features
- Business discovery
- Business enrichment
- Ollama integration
- AI Engine runtime logic
- Website generation
- Website compiler
- CRM features
- Outreach features
- Deployment providers
- Plugin runtime
- Real database schema beyond a migration placeholder or migration runner skeleton
- Real provider credentials
- Real external API calls
- Product analytics
- Licensing
- Auto-update implementation

---

## Required Repository Structure

Codex must follow the structure defined in:

- [[../07 - Engineering Standards/Repository Structure and Development Environment]]

The initial repository must include the top-level folders:

```text
apps/
packages/
docs/
prompts/
migrations/
scripts/
tests/
tools/
```

The desktop app must separate:

```text
apps/desktop/src/main
apps/desktop/src/preload
apps/desktop/src/renderer
apps/desktop/src/core
apps/desktop/src/modules
apps/desktop/src/providers
apps/desktop/src/plugins
apps/desktop/src/shared
```

---

## Security Requirements

Codex must ensure:

- Renderer has no direct Node.js access.
- Main, preload and renderer code are separated.
- Preload exposes only a narrow typed API placeholder.
- No secrets are committed.
- `.env.example` contains no real secrets.
- `.gitignore` excludes user data, databases, logs, build output and environment files.
- Electron security defaults follow the Security Architecture.
- No external provider is enabled by default.
- No real deployment or AI credentials exist.

---

## Testing Requirements

Codex must add validation commands for:

- Type checking
- Linting
- Formatting check
- Unit tests
- Build verification

Minimum expected root commands:

```powershell
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
pnpm validate
```

Codex must run the validation commands that are possible in the created environment and report exact results.

---

## Acceptance Criteria

- [ ] Repository structure matches the approved foundation.
- [ ] `pnpm install` works.
- [ ] TypeScript strict configuration exists.
- [ ] Electron app has separate main, preload and renderer entry points.
- [ ] React renderer starts with a minimal application shell only.
- [ ] Renderer does not access privileged APIs directly.
- [ ] Preload bridge is narrow and typed.
- [ ] Root validation scripts exist.
- [ ] Tests can run with at least one basic passing test.
- [ ] Build command exists and succeeds or reports a clear environment blocker.
- [ ] GitHub Actions validation workflow exists.
- [ ] `.gitignore` protects secrets, databases, logs, generated projects and build output.
- [ ] Documentation is copied or mirrored into `docs/`.
- [ ] No product feature is implemented.
- [ ] Completion report is provided.

---

## Completion Report Required

Codex must report:

- Files created
- Files modified
- Dependencies added
- Commands run
- Validation results
- Security considerations
- Assumptions
- Known limitations
- Remaining risks
- Next recommended task

Codex must not report only `done`.
