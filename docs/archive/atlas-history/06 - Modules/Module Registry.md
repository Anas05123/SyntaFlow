> Historical archive — Atlas was the former working name of CoreDesk.
> This document is not a current source of truth.

---

﻿---
title: Module Registry
project: Project Atlas
product: AI Agency OS
version: 1.0
status: Active
owners:
  - Founder
  - CTO
last_updated: 2026-08-03
---

# Module Registry

## Purpose

This file is the quick reference registry for AI Agency OS modules. Detailed boundaries, contracts and plugin rules live in [[Module and Plugin Architecture]].

## Core Modules

| Module | Status | Owner | Notes |
|---|---|---|---|
| App Shell | Planned | Core | Desktop lifecycle, secure windows and navigation |
| Settings | Planned | Core | Preferences, integrations and local configuration |
| Database | Planned | Core | SQLite, migrations and repositories |
| Filesystem | Planned | Core | Controlled application storage |
| Jobs | Planned | Core | Background queue, progress, retries and recovery |
| Security | Planned | Core | Permissions, IPC, credentials and validation |
| Audit | Planned | Core | Security and business event audit trail |
| Logging | Planned | Core | Structured local logs with redaction |
| Notifications | Planned | Core | Safe user-facing status and alerts |

## Product Modules

| Module | Status | Owner | Notes |
|---|---|---|---|
| Campaigns | Planned | Product | Campaign creation, organization and progress |
| Businesses | Planned | Product | Business records, contacts, tags and status |
| Discovery | Planned | Architecture | Multi-source business discovery providers |
| Enrichment | Planned | Architecture | Public website/contact enrichment |
| AI Engine | Planned | AI | Provider-independent AI gateway |
| Atlas | Planned | AI/Product | Assistant, campaign intelligence and approved memory |
| Website Projects | Planned | Product | Briefs, assets, versions and specifications |
| Website Generator | Planned | AI/Product | Structured generation and deterministic compiler |
| Templates | Planned | Design/Product | Components, sections, prompts and industry playbooks |
| CRM | Planned | Product | Deals, stages, follow-ups and client conversion |
| Outreach | Planned | Product | Drafts, history and approved sending integrations |
| Deployment | Planned | DevOps | Export, preview, publishing and deployment history |
| Backup | Planned | DevOps | Backup, integrity checks, restore and recovery |
| Analytics | Future | Product | Local performance and campaign insights |

## Provider Modules

| Provider | Status | Capability |
|---|---|---|
| Ollama | Planned | Local AI runtime |
| OpenStreetMap / Overpass | Planned | Business discovery |
| Nominatim | Planned | Geocoding |
| Static Export | Planned | Website export |
| Vercel | Optional | Deployment provider |
| Cloud AI Providers | Future Optional | User-enabled AI providers only |

## Rules

- Modules must follow [[Module and Plugin Architecture]].
- Product modules use contracts, not internal repositories from other modules.
- Provider-specific code remains inside provider adapters.
- Optional module failure must not prevent the core application from opening.
- Public plugin marketplace remains outside Version 1.
