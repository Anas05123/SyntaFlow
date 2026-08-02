---
title: Engineering Standards and Codex Rules
project: Project Atlas
product: AI Agency OS
version: 1.0
status: Approved Foundation
owners:
  - Founder
  - CTO
last_updated: 2026-08-03
---

# Engineering Standards and Codex Rules

## Purpose

This document defines how AI Agency OS is designed, implemented, tested, reviewed and documented.

Codex is the implementation engineer. Codex may implement approved specifications, but it may not independently redefine product strategy, architecture, security boundaries or module ownership.

## Source of Truth

The Project Atlas Obsidian vault is the planning source of truth.

Required references:

- [[Repository Structure and Development Environment]]
- [[Testing and Quality Assurance Strategy]]
- [[../08 - Codex Tasks/Task Board]]
- [[../09 - Decisions/Decision Log]]
- [[../10 - Roadmap/Product Roadmap]]

When documentation conflicts, implementation stops until the conflict is resolved.

## Priority Order

1. Security
2. User data protection
3. Correctness
4. Maintainability
5. Reliability
6. User experience
7. Performance
8. Development speed

Fast delivery must never justify unsafe or unmaintainable code.

## Preserved Project Decisions

- Offline-first desktop application.
- No mandatory subscription.
- ChatGPT acts as CTO and planning partner.
- Codex acts as implementation engineer.
- Ollama is the default local AI runtime.
- Optional cloud providers are disabled by default.
- Modular monolith architecture.
- Electron, React, TypeScript and SQLite form the Version 1 foundation.
- Documentation is written before production implementation.

## Approved Technology Foundation

| Area           | Decision                     |
| -------------- | ---------------------------- |
| Desktop        | Electron                     |
| UI             | React                        |
| Language       | TypeScript                   |
| Database       | SQLite                       |
| Local AI       | Ollama through the AI Engine |
| Architecture   | Modular monolith             |
| Documentation  | Obsidian Markdown            |
| Source Control | Git and GitHub               |

Technology changes require an Architecture Decision Record.

## TypeScript Standards

Strict TypeScript is mandatory.

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "useUnknownInCatchVariables": true
  }
}
```

Rules:

- Avoid `any`.
- Use `unknown` for untrusted values.
- Validate external inputs at runtime.
- Use discriminated unions for state.
- Do not silence TypeScript errors.
- Keep provider-specific types inside provider adapters.

## Module Boundary Rules

Codex must not:

- Import another module's internal repository.
- Access another module's database tables directly.
- Call Ollama directly from product modules.
- Import deployment SDKs into UI code.
- Place business rules inside React components.
- Place database queries inside UI code.
- Create circular dependencies.

Approved communication:

- Public contracts
- Domain events
- Application services
- Background jobs

## Layer Rules

```text
Presentation
      â†“
Application
      â†“
Domain

Infrastructure
      â†“
Domain Contracts
```

Domain logic must not depend on Electron, React, SQLite, Ollama, provider SDKs or filesystem APIs.

## Security Rules

Mandatory:

- No secrets in frontend code.
- No secrets in logs.
- No direct Node.js access in renderer.
- No unrestricted IPC.
- Validate every IPC request.
- Validate every external URL.
- Validate every imported file.
- Run generated websites in isolation.
- Enforce AI permissions outside the model.
- Keep external providers opt-in.
- Require approval for sensitive actions.

Security requirements cannot be postponed as cleanup.

## AI Engineering Rules

All AI requests must use the AI Engine.

Codex must not:

- Call Ollama directly from product modules.
- Hard-code prompts inside UI components.
- Treat AI output as trusted.
- Save AI suggestions as facts automatically.
- Give AI direct access to credentials.
- Let AI deploy, delete or send messages without approval.

AI outputs that affect application data must use validated schemas.

## Dependency Rules

Before adding a dependency, Codex must document:

- Package name
- Purpose
- Why existing code is insufficient
- Maintenance status
- License
- Security risk
- Runtime or bundle impact

Reject unnecessary, abandoned, oversized or security-sensitive dependencies unless explicitly justified.

## Database Standards

- All access uses repositories.
- All queries use parameters.
- Migrations are versioned.
- Multi-step writes use transactions.
- Foreign keys are enabled.
- Database rows are not returned directly to UI code.
- Destructive migrations require backup and review.
- Tests use isolated test databases.

## UI Standards

- Use the approved design system.
- No hard-coded colors.
- No one-off spacing values without approval.
- Every action has visible feedback.
- Loading, empty and error states are explicit.
- Tables support large datasets.
- Accessibility is required.
- Long tasks must not freeze the interface.
- Destructive actions require confirmation.

## Testing Requirements

Each feature includes tests appropriate to its risk:

- Unit tests for domain logic.
- Integration tests for repositories, IPC and adapters.
- Contract tests for public APIs.
- Security tests for sensitive boundaries.
- End-to-end tests for critical workflows.

Codex must never delete failing tests to make a build pass.

## Codex Task Format

Every Codex task must include:

- Objective
- Required reading
- Included scope
- Excluded scope
- Acceptance criteria
- Testing requirements
- Security requirements
- Allowed files or modules
- Completion report requirements

## Codex Execution Process

1. Read required documentation.
2. Inspect the existing repository.
3. Identify affected modules.
4. Identify risks.
5. Implement the smallest correct change.
6. Add or update tests.
7. Run validation commands.
8. Review the diff.
9. Update documentation.
10. Report results.

## Definition of Ready

- [ ] Business purpose is clear.
- [ ] Scope is defined.
- [ ] User flow is approved.
- [ ] Architecture is approved.
- [ ] Security requirements are known.
- [ ] Data changes are defined.
- [ ] UI behavior is defined.
- [ ] Acceptance criteria exist.
- [ ] Testing requirements exist.

## Definition of Done

- [ ] Approved behavior is implemented.
- [ ] Architecture boundaries are respected.
- [ ] Security requirements are satisfied.
- [ ] Input validation exists.
- [ ] Error behavior exists.
- [ ] Tests are added and passing.
- [ ] Type checking passes.
- [ ] Linting passes.
- [ ] No secrets are exposed.
- [ ] Documentation is updated.
- [ ] Remaining risks are documented.

## Completion Report

Codex must report:

- Files created
- Files modified
- Dependencies added
- Database migrations added
- Tests added
- Commands executed
- Test results
- Security considerations
- Assumptions
- Known limitations
- Remaining risks

## Architecture Decisions

### ADR-ENG-001 - Strict TypeScript

**Decision:** Strict TypeScript is mandatory.

**Reason:** Strong type checking reduces defects and unsafe assumptions.

### ADR-ENG-002 - Small Scoped Codex Tasks

**Decision:** Codex receives focused tasks.

**Reason:** Small tasks are easier to review, test and correct.

### ADR-ENG-003 - Documentation Before Implementation

**Decision:** Specifications must be approved before production implementation.

**Reason:** Codex implements decisions instead of inventing them.

### ADR-ENG-004 - Tests Are Part of Completion

**Decision:** A feature without required tests is incomplete.

**Reason:** Working once is not the same as being reliable.

## Next Action

Follow [[Repository Structure and Development Environment]] before repository creation.
