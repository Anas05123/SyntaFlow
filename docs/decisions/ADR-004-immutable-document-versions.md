# ADR-004: Immutable Submitted Document Versions

> **Date:** 2026-08-10  
> **Status:** Accepted  
> **Scope:** Architecture & Domain Governance  

---

## Context
Disputes arise when clients claim they approved terms different from what was executed. Mutable document records create legal vulnerability.

## Decision
Submitting a document freezes an immutable DocVersion record. Edits continue on an incremented working draft without mutating historical versions.

## Consequences
Preserves complete audit history; versions once submitted cannot be edited or deleted.
