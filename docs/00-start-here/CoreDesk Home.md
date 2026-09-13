# CoreDesk — Obsidian Knowledge Vault Home

> **Welcome to the CoreDesk Knowledge Vault.**  
> This directory (`docs/`) is the single canonical source of truth for CoreDesk product architecture, engineering specifications, design guidelines, domain rules, and development decisions.  
> It functions simultaneously as human documentation, AI context, and the native Obsidian vault.

---

## Quick Navigation Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              COREDESK DASHBOARD                             │
├───────────────────────┬─────────────────────────────┬───────────────────────┤
│  00 - START HERE      │  01 - PRODUCT & DOMAIN      │  02 - ARCHITECTURE    │
│  • [[CoreDesk Home]]  │  • [[PRODUCT_VISION]]       │  • [[SYSTEM_ARCH]]    │
│  • [[Dev Status]]     │  • [[CLIENT_LIFECYCLE]]     │  • [[DATA_MODEL]]     │
│  • [[Doc Map]]        │  • [[PRODUCT_ARCH]]         │  • [[ELECTRON_ARCH]]  │
│  • [[GLOSSARY]]       │  • [[DOMAIN_RULES]]         │  • [[AI_ARCH]]        │
├───────────────────────┼─────────────────────────────┼───────────────────────┤
│  03 - SUBSYSTEMS      │  04 - DESIGN & EXPERIENCE   │  05 - SECURITY & OPS  │
│  • [[TASK_SYSTEM]]    │  • [[UI_UX_SYSTEM]]         │  • [[SECURITY_MODEL]] │
│  • [[DOC_SYSTEM]]     │  • [[DESIGN_SYSTEM]]        │  • [[ACCESS_MODEL]]   │
│  • [[REVIEW_DELIVERY]]│  • Brand Assets             │  • [[ERROR_RECOVERY]] │
│  • [[SEARCH_COMMAND]] │                             │  • [[ROADMAP]]        │
│  • [[SETTINGS_APP]]   │                             │  • [[DECISIONS]]      │
└───────────────────────┴─────────────────────────────┴───────────────────────┘
```

---

## 1. Orientation & Status

- **[Development Status](Development%20Status.md)**: Real-time inventory of working flows, verified routes, and known stubs.
- **[Documentation Map](Documentation%20Map.md)**: Complete structural map of all documents across the workspace.
- **[Glossary](GLOSSARY.md)**: Canonical definitions of entities (`Client`, `Project`, `Task`, `DocVersion`, `DeliveryPackage`).

---

## 2. Product Vision & Commercial Engine

- **[Product Vision](../product/PRODUCT_VISION.md)**: Purpose, target persona (independent agency principal), 5 acceptance gates, core philosophy ("the product is the loop, not the screens").
- **[Client Commercial Lifecycle](../product/CLIENT_LIFECYCLE.md)**: End-to-end commercial graph (Client $\rightarrow$ Proposal $\rightarrow$ Agreement $\rightarrow$ Onboarding $\rightarrow$ Project $\rightarrow$ Work $\rightarrow$ Review $\rightarrow$ Delivery).
- **[Product Architecture](../product/PRODUCT_ARCHITECTURE.md)**: System structure, entity relationships, and operational hierarchy.
- **[Domain Rules & Invariants](../product/DOMAIN_RULES.md)**: Strict business invariants with preconditions, actions, side effects, and failure conditions.
- **[Website Handoff](../product/WEBSITE_HANDOFF.md)**: Specifications for future marketing website and browser authentication deep-link callbacks.

---

## 3. Technical Architecture

- **[System Architecture](../architecture/SYSTEM_ARCHITECTURE.md)**: Layered software architecture (Renderer $\rightarrow$ Preload Bridge $\rightarrow$ IPC Handlers $\rightarrow$ Services $\rightarrow$ Persistence).
- **[Data Model](../architecture/DATA_MODEL.md)**: Canonical schema for all 18+ entities, immutability rules, and SQLite relationships.
- **[Electron Architecture](../architecture/ELECTRON_ARCHITECTURE.md)**: Frameless BrowserWindow, sandbox isolation, typed IPC protocol, dev/built runtimes.
- **[AI Architecture](../architecture/AI_ARCHITECTURE.md)**: The CoreDesk AI Engine pipeline (`TaskRouter` $\rightarrow$ `ContextBuilder` $\rightarrow$ `PromptRegistry` $\rightarrow$ `ProviderAdapter` $\rightarrow$ `Ollama / FakeProvider`).
- **[Coding Standards](../architecture/CODING_STANDARDS.md)**: Strict TypeScript rules, service boundaries, and state ownership contracts.
- **[Testing Strategy](../architecture/TESTING_STRATEGY.md)**: Test hierarchy, unit tests, Playwright route verification, and security test specs.

---

## 4. Operational Subsystems

- **[Task System](../systems/TASK_SYSTEM.md)**: Three decoupled dimensions (Status: Todo/In Progress/Done; Attention: Waiting/Blocked/Overdue; Normalized Priority), prerequisite dependencies, responsive inspector.
- **[Document System](../systems/DOCUMENT_SYSTEM.md)**: Document studio, working versions vs submitted immutable snapshots (`DocVersion`).
- **[Review & Delivery System](../systems/REVIEW_DELIVERY_SYSTEM.md)**: Review requests, revision loops, decisions bound to version snapshots, delivery package gate enforcement.
- **[Search & Command System](../systems/SEARCH_COMMAND_SYSTEM.md)**: Universal multi-entity search, `⌘K` / `Ctrl+K` command palette.
- **[Settings & Appearance](../systems/SETTINGS_APPEARANCE.md)**: Wallpaper engine, acrylic blur, dark/light themes, surface opacity.
- **[Error Recovery Protocols](../systems/ERROR_RECOVERY.md)**: Resilient failure patterns for database corruption, AI timeouts, network disconnects.

---

## 5. Design & Aesthetics

- **[UI / UX System](../design/UI_UX_SYSTEM.md)**: Desktop spatial hierarchy, custom floating chrome, collapsible sidebar, master-detail split views.
- **[Design System](../design/DESIGN_SYSTEM.md)**: Dark graphite palette, cobalt/cyan accent system, control materials, typography scales.

---

## 6. Security, Governance & History

- **[Security Model](../security/SECURITY_MODEL.md)**: Threat model, mitigation matrix, IPC sender validation, external link protocol.
- **[Access Grant Model](../security/ACCESS_MODEL.md)**: Non-inherited access grant model for secure guest reviews and delivery tokens.
- **[Product Roadmap](../roadmap/ROADMAP.md)**: Phases: NOW (V1 Desktop), NEXT (SQLite migration), LATER (Web portal & auth), EXPERIMENTAL (Agents).
- **[Known Issues](../roadmap/KNOWN_ISSUES.md)**: Documented technical debt with reproduction steps and resolution plans.
- **[Decisions & ADRs](../decisions/DECISIONS.md)**: Architecture Decision Records (`ADR-001` through `ADR-012`).
- **[Migration & Audit](../migration/REPOSITORY_AUDIT.md)**: Pre-migration inventory, Atlas remainder log, and final consolidation report.
- **[Historical Archive](../archive/atlas-history/)**: Retired Project Atlas notes and legacy strategy records.
