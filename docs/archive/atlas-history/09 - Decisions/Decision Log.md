> Historical archive — Atlas was the former working name of CoreDesk.
> This document is not a current source of truth.

---

﻿---
title: Decision Log
project: Project Atlas
product: AI Agency OS
version: 1.0
status: Active
owners:
  - Founder
  - CTO
last_updated: 2026-08-03
---

# Decision Log

## Purpose

This file records major product and architecture decisions so the project does not drift over time.

Every major reversal requires a new decision entry instead of silently rewriting history.

## Decision Table

| ID | Decision | Status | Reason |
|---|---|---|---|
| ADR-001 | Local-first architecture | Accepted | Cost control, privacy and ownership |
| ADR-002 | No mandatory subscription | Accepted | Product principle and founder requirement |
| ADR-003 | ChatGPT acts as CTO/planning partner | Accepted | Planning and architecture need deliberate direction |
| ADR-004 | Codex acts as implementation engineer | Accepted | Codex is strongest when implementing approved specs |
| ADR-005 | Ollama-first AI runtime | Accepted | Local AI, privacy and no mandatory usage fees |
| ADR-006 | Optional cloud providers remain opt-in | Accepted | Prevent hidden cost and privacy surprises |
| ADR-007 | Multi-source discovery, not Google-only scraping | Accepted | Avoid dependency, fragility and compliance risk |
| ADR-008 | Obsidian is the Engineering Handbook system | Accepted | Local, searchable, linkable and Git-friendly |
| ADR-009 | Modular monolith for Version 1 | Accepted | Strong boundaries without microservice complexity |
| ADR-010 | Electron + React + TypeScript desktop stack | Accepted | Strong desktop UX with modern frontend development |
| ADR-011 | SQLite for Version 1 database | Accepted | Local, simple, reliable and free |
| ADR-012 | Documentation before production implementation | Accepted | Codex must implement approved architecture |
| ADR-013 | AI Engine abstraction required | Accepted | Avoid direct provider coupling |
| ADR-014 | Generated websites use controlled pipeline | Accepted | Safer and more consistent than one huge AI prompt |
| ADR-015 | Atlas memory stores approved facts only | Accepted | Memory must be editable, transparent and safe |
| ADR-016 | Generated code is untrusted until validated | Accepted | Protect application and user computer |
| ADR-017 | Strict TypeScript required | Accepted | Reduces unsafe assumptions |
| ADR-018 | Fake providers required for tests | Accepted | Testing stays free, repeatable and independent |
| ADR-019 | No production coding before Architecture Freeze | Accepted | Prevent rushed architecture and technical debt |

## ADR-001 - Local-First Architecture

**Status:** Accepted

AI Agency OS is primarily a local desktop application. Core data, workflows and AI features should work on the founder's computer without requiring a cloud service.

## ADR-002 - No Mandatory Subscription

**Status:** Accepted

The product must not require a monthly subscription to function. Optional paid services may be added later, but the core system remains usable without them.

## ADR-003 - ChatGPT as CTO

**Status:** Accepted

ChatGPT is used for planning, architecture, product decisions, review and task definition.

## ADR-004 - Codex as Implementation Engineer

**Status:** Accepted

Codex writes code, runs tests and modifies files only against approved specifications.

## ADR-005 - Ollama-First AI

**Status:** Accepted

Ollama is the default local AI runtime for Version 1. Model selection remains configurable.

## ADR-006 - Optional Cloud Providers

**Status:** Accepted

OpenAI, Anthropic, Gemini and other providers can be added later through adapters, but must remain disabled until explicitly enabled by the user.

## ADR-007 - Multi-Source Business Discovery

**Status:** Accepted

The discovery engine uses replaceable providers such as OpenStreetMap, website enrichment and manual verification. Google Maps scraping is not the foundation.

## ADR-008 - Obsidian Engineering Handbook

**Status:** Accepted

Obsidian Markdown is used as the living Engineering Handbook because it is local, easy to search, easy to link and readable by Codex.

## ADR-009 - Modular Monolith

**Status:** Accepted

Version 1 uses a modular monolith instead of microservices. Modules communicate through contracts and events.

## ADR-010 - Electron Stack

**Status:** Accepted

Electron, React and TypeScript are the approved desktop stack, with strict security boundaries between main, preload and renderer.

## ADR-011 - SQLite

**Status:** Accepted

SQLite is the Version 1 local database. Future PostgreSQL compatibility can be considered later if the product becomes multi-user or SaaS.

## ADR-012 - Documentation Before Implementation

**Status:** Accepted

Planning documents, architecture and module specifications must exist before production coding begins.

## ADR-013 - AI Engine Abstraction

**Status:** Accepted

No module may call Ollama or any external provider directly. All AI requests pass through the AI Engine.

## ADR-014 - Controlled Website Generation

**Status:** Accepted

The AI creates structured website specifications. A deterministic compiler creates final websites using approved components and templates.

## ADR-015 - Transparent Atlas Memory

**Status:** Accepted

Atlas stores approved facts, preferences and decisions. It does not store hidden reasoning as memory.

## ADR-016 - Generated Code Isolation

**Status:** Accepted

Generated websites and generated code are isolated from the main application and validated before preview, export or deployment.

## ADR-017 - Strict TypeScript

**Status:** Accepted

Strict TypeScript is mandatory for maintainability and safer refactoring.

## ADR-018 - Fake Providers

**Status:** Accepted

Fake providers are required for AI, discovery, deployment, outreach and embeddings so tests do not depend on paid or live services.

## ADR-019 - Architecture Freeze Before Coding

**Status:** Accepted

Production coding starts only after the main architecture, standards, module boundaries and first implementation tasks are approved.

## Pending Decisions

- First release target: private alpha or founder-only build.
- Whether to expand UI design system before first product module implementation.
- Whether GitHub repository is created immediately during ATLAS-CODE-001 or after local foundation validation.

## Next Action

Update this file whenever a major product, architecture, security or workflow decision changes.


