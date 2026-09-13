# ADR-005: Review Requests Bound to Exact Version Snapshots

> **Date:** 2026-08-10  
> **Status:** Accepted  
> **Scope:** Architecture & Domain Governance  

---

## Context
Client review feedback must unambiguously target the exact copy reviewed, not intermediate drafts modified during review.

## Decision
Review requests and decisions bind strictly to a specific immutable DocVersion snapshot ID.

## Consequences
Prevents moving-target reviews; clients always review a fixed, deterministic deliverable snapshot.
