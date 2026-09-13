# CoreDesk — Architecture Decision Records (ADRs)

> **Status:** ACTIVE ARCHIVE  
> **Last verified:** 2026-09-13  
> **Relevant source areas:** `docs/decisions/`, `docs/architecture/`  
> **Owner domain:** Technical Architecture  

---

## ADR Index

| ID | Title | Date | Status |
|---|---|---|---|
| **ADR-001** | Desktop-First Architecture via Electron | 2026-08-03 | Accepted |
| **ADR-002** | Local-First Storage & Offline Sovereignty | 2026-08-03 | Accepted |
| **ADR-003** | SQLite as Canonical Production Persistence | 2026-08-03 | Accepted |
| **ADR-004** | Narrow, Explicit Preload Context Bridge | 2026-08-05 | Accepted |
| **ADR-005** | Immutable Submitted Document Versions | 2026-08-10 | Accepted |
| **ADR-006** | Review Requests Bound to Exact Versions | 2026-08-10 | Accepted |
| **ADR-007** | Single Canonical Task Record Across Projections | 2026-09-11 | Accepted |
| **ADR-008** | Decoupled Status vs. Attention Dimensions | 2026-09-12 | Accepted |
| **ADR-009** | Restrained Graphite Palette & Controlled Accents | 2026-08-04 | Accepted |
| **ADR-010** | Ollama-First AI Engine Abstraction | 2026-08-08 | Accepted |
| **ADR-011** | Non-Transitive, Scoped Access Grant Model | 2026-08-12 | Accepted |
| **ADR-012** | Available Workspace Width Responsive Inspector | 2026-09-12 | Accepted |

---

### ADR-001: Desktop-First Architecture via Electron
- **Context**: Operators require offline speed, native window management, font rasterization, and local filesystem control.
- **Decision**: Build CoreDesk as an Electron desktop application using React and TypeScript.
- **Alternatives Considered**: Web-only SaaS application, native Swift/C# macOS/Windows apps.
- **Reason**: Web SaaS forces subscription locks and lacks local file sovereignty; pure native apps require duplicate codebases.
- **Consequences**: Bundle size includes Chromium/Node; requires strict sandboxing and preload boundaries.
- **Status**: Accepted.

---

### ADR-005: Immutable Submitted Document Versions
- **Context**: Disputes arise when clients claim they approved different terms or content than what was delivered.
- **Decision**: Submitting a document freezes an immutable `DocVersion` snapshot. Subsequent edits occur on an incremented working draft and never mutate historical snapshots.
- **Alternatives Considered**: Single mutable document with change history diffing.
- **Reason**: Diffing is ambiguous and prone to corruption; immutable snapshots provide cryptographically clean legal audit trails.
- **Status**: Accepted.

---

### ADR-007: Single Canonical Task Record Across Projections
- **Context**: Tasks were previously duplicated or synchronized asynchronously between Home, Project Workspace, and Tasks board.
- **Decision**: Exactly one canonical `Task` record exists in the store. Home Focus Queue, Tasks Board/List, and Project Workspace render projections of this single record.
- **Consequences**: Guaranteed consistency; zero state desynchronization.
- **Status**: Accepted.

---

### ADR-008: Decoupled Status vs. Attention Dimensions
- **Context**: Previous implementations conflated operational status (`To Do`, `In Progress`, `Done`) with attention states (`Waiting`, `Blocked`).
- **Decision**: Status represents production stage; Attention represents impediments. Status Board strictly contains three columns (`To Do`, `In Progress`, `Done`). Attention grouping is a distinct view option.
- **Status**: Accepted.

---

### ADR-012: Available Workspace Width Responsive Inspector
- **Context**: Viewport media queries (`min-width: 1360px`) broke when the sidebar expanded/collapsed, causing cards to clip.
- **Decision**: Use `ResizeObserver` measuring the parent work container (`>= 1020px`) to toggle side-by-side vs overlay mode. Suppress backdrop scrim during side-by-side mode.
- **Status**: Accepted.
