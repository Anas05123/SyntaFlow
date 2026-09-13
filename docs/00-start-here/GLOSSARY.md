# CoreDesk — Domain Glossary & Canonical Vocabulary

> **Status:** AUDITED & CANONICAL  
> **Last verified:** 2026-09-13  
> **Owner domain:** Product Architecture & Domain Integrity  

---

## Canonical Terms & Definitions

- **Access Grant**: A scoped, non-transitive security grant defining: recipient email, target resource, role (`Guest reviewer` | `Guest viewer`), expiration date, and revocation state.
- **Activity Event**: An immutable, chronological audit event recording significant operational transitions (e.g. task completion, review sign-off, client archiving).
- **Attention**: An operational flag indicating an active impediment requiring operator intervention (`waiting`, `blocked`, `overdue`). Strictly decoupled from task or project status.
- **Client**: The ongoing commercial entity and relationship that outlives any individual project engagement.
- **Client Note**: A strictly private note written by the operator regarding a client relationship; never exposed to clients or guest portals.
- **Contact**: A named human stakeholder belonging to a client organization with a specific role and contact coordinates.
- **Decision**: The formal verdict submitted by a client regarding a document version snapshot: either `'approved'` (authorizes delivery) or `'changes'` (requests modifications).
- **Delivery Package**: The final bundle of approved document versions and file assets handed over to the client upon project completion.
- **Document**: A versioned work artifact created during client engagements (Proposal, Brief, Agreement, Deliverable, etc.).
- **Document Version (`DocVersion`)**: An immutable, numbered snapshot of a document created at the moment of formal submission for review.
- **Lifecycle**: The overarching multi-phase journey of a client relationship (Lead $\longrightarrow$ Proposal $\longrightarrow$ Agreement $\longrightarrow$ Onboarding $\longrightarrow$ Project $\longrightarrow$ Work $\longrightarrow$ Review $\longrightarrow$ Delivery).
- **Milestone**: A major progress checkpoint and financial governance gate within a project engagement.
- **Professional Profile**: Workspace configuration capturing the operator's business identity, registration, tax details, and billing rates.
- **Project**: A discrete, scoped commercial engagement with defined deliverables, boundaries, and budgets.
- **Review Request (`Review`)**: A formal sign-off request dispatched to a client contact for an exact document version snapshot.
- **Task**: The atomic unit of operator production work. Exactly one canonical record represents a task across Home, Tasks Workspace, and Project Workspace.
- **Task Status**: The execution stage of a task (`todo`, `in-progress`, `done`, `cancelled`).
- **Workspace**: The root operational boundary and data store for an independent practitioner's business.
