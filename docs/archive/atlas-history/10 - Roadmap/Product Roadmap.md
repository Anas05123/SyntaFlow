> Historical archive — Atlas was the former working name of CoreDesk.
> This document is not a current source of truth.

---

﻿---
title: Product Roadmap
project: Project Atlas
product: AI Agency OS
version: 1.0
status: Active
owners:
  - Founder
  - CTO
last_updated: 2026-08-03
---

# Product Roadmap

## Product Direction

AI Agency OS is a local-first desktop operating system for digital agencies.

Core workflow:

```text
Discover businesses
â†’ Analyze opportunities
â†’ Prioritize leads
â†’ Generate tailored websites
â†’ Review and improve
â†’ Export or deploy
â†’ Manage outreach
â†’ Convert and manage clients
```

## Product Principles

- Offline-first.
- No mandatory subscription.
- Local AI through Ollama by default.
- Optional cloud providers only when explicitly enabled.
- Professional output, not AI-looking output.
- Human approval for sensitive actions.
- Security and maintainability before speed.
- Documentation before production implementation.

## Phase 0 - Architecture Freeze

**Status:** In progress

Goal: finish the foundation before production coding.

Deliverables:

- [x] Project Atlas vault
- [x] Product vision foundation
- [x] Product requirements foundation
- [x] User-flow foundation
- [x] UI/UX foundation
- [x] Database foundation
- [x] System architecture foundation
- [x] AI Engine Architecture
- [x] Security Architecture
- [x] Module and Plugin Architecture
- [x] Engineering Standards and Codex Rules
- [x] Repository Structure and Development Environment
- [x] Testing and Quality Assurance Strategy
- [ ] Release, Packaging, Update and Recovery Architecture
- [ ] Final design system expansion
- [ ] First module specifications
- [ ] Final architecture review
- [ ] Repository initialization task

Exit criteria:

- First Codex implementation task is fully specified.
- Security boundaries are approved.
- Testing requirements are approved.
- Repository structure is approved.

## Phase 1 - Repository Foundation

**Status:** Not started

Goal: create the technical foundation without building product features yet.

Deliverables:

- Git repository
- pnpm workspace
- Electron desktop shell
- Secure main/preload/renderer separation
- React renderer foundation
- TypeScript strict configuration
- ESLint and Prettier
- Shared contracts package
- Design system package foundation
- Testing package foundation
- CI validation
- Logging foundation
- Settings foundation
- Database migration runner
- Job Service foundation

Exit criteria:

- `pnpm validate` passes.
- Desktop app opens.
- Secure preload bridge exists.
- Fake providers can be used in tests.
- No product modules are built prematurely.

## Phase 2 - Core Local Data System

**Status:** Not started

Goal: establish durable local storage and safe user data handling.

Deliverables:

- SQLite schema v1
- Migrations
- Repository patterns
- File storage service
- Backup service
- Restore workflow
- Audit event system
- Settings persistence
- Secure Storage service

Exit criteria:

- Database initializes from migrations.
- Backup and restore pass tests.
- Secrets are stored outside plain SQLite.
- Renderer cannot directly access data services.

## Phase 3 - Campaigns and Business Records

**Status:** Not started

Goal: build the first usable workspace.

Deliverables:

- Campaign creation
- Campaign list
- Campaign dashboard
- Business records
- Contact records
- Tags and statuses
- Notes
- Activity timeline
- Search and filters

Exit criteria:

- Founder can create a campaign and save businesses locally.
- Data persists across app restarts.
- Core E2E campaign flow passes.

## Phase 4 - Business Discovery and Enrichment

**Status:** Not started

Goal: find and enrich businesses using free-first, replaceable sources.

Deliverables:

- Discovery provider interface
- OpenStreetMap provider
- Nominatim geocoding provider
- Website enrichment service
- Duplicate detection
- Review queue
- Background discovery jobs
- Discovery logs and progress

Exit criteria:

- User can search a category and location.
- Results are normalized and saved.
- Duplicates are detected.
- Failures are recoverable.
- Discovery tests use fake providers.

## Phase 5 - AI Engine and Atlas Foundation

**Status:** Not started

Goal: integrate local AI safely through the AI Engine.

Deliverables:

- Ollama provider adapter
- Model registry
- Task router
- Prompt registry
- Output validator
- Atlas chat foundation
- Campaign summary
- Lead scoring
- Business analysis
- Local memory foundation

Exit criteria:

- App works when Ollama is unavailable.
- AI requests use the AI Engine only.
- Structured outputs are validated.
- Atlas memory is editable and traceable.

## Phase 6 - Website Generation System

**Status:** Not started

Goal: generate professional websites through a controlled pipeline.

Deliverables:

- Website brief builder
- Design fingerprint system
- Website specification schema
- Component selection system
- Website compiler
- Local preview
- Version history
- Revision workflow
- Export workflow
- Quality checks

Exit criteria:

- A business can receive a generated website version.
- Website output is previewable locally.
- Revisions are controlled.
- Generated websites are isolated from the main app.
- Design repetition checks exist.

## Phase 7 - CRM and Outreach

**Status:** Not started

Goal: manage sales activity from inside the same workspace.

Deliverables:

- CRM pipeline
- Deal stages
- Follow-ups
- Conversation history
- Outreach draft generation
- Message templates
- Manual approval before sending
- Client conversion

Exit criteria:

- Founder can track prospects from lead to client.
- AI can draft messages but cannot send without approval.
- CRM E2E workflow passes.

## Phase 8 - Deployment and Delivery

**Status:** Not started

Goal: export and optionally deploy generated websites safely.

Deliverables:

- Static export provider
- Deployment provider interface
- Vercel provider optional integration
- Deployment validation
- Deployment history
- Rollback plan
- Secret-safe deployment logs

Exit criteria:

- User can export a website locally.
- Optional deployment requires explicit credentials and approval.
- Deployment tokens never enter generated source.

## Phase 9 - Private Alpha

**Status:** Future

Goal: make the product reliable enough for founder-only daily use.

Deliverables:

- Installer or packaged build
- Crash recovery
- Backup reminder
- Diagnostics export
- Critical workflow tests
- UI polish pass
- Security review
- Performance review

Exit criteria:

- Founder can use the app for real campaigns.
- No Critical or High release blockers remain.

## Phase 10 - Commercial Readiness

**Status:** Future

Goal: prepare for other freelancers or agencies.

Deliverables:

- Licensing strategy
- Update system
- Signed builds
- Onboarding flow
- Documentation
- Template packs
- Support workflow
- Commercial security audit

Exit criteria:

- Product can be installed and used by someone other than the founder.
- Data backup and restore are reliable.
- Support and update paths are defined.

## Future Ideas

These are not Version 1 commitments:

- Public plugin marketplace
- SaaS version
- Multi-user collaboration
- Mobile companion
- Fully automated outreach
- Industry-specific template marketplace
- AI software factory
- Team licensing
- Advanced analytics

## Current Next Action

Finish Architecture Freeze, then create the first Codex-ready task for repository initialization.

