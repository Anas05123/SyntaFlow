> Historical archive — Atlas was the former working name of CoreDesk.
> This document is not a current source of truth.

---

﻿# Database Architecture

## Core Data Areas

- Campaigns
- Businesses
- Contacts
- Discovery records
- Enrichment results
- AI analyses
- Website projects
- Website versions
- CRM deals
- Conversations
- Deployments
- Background jobs
- Audit events
- Atlas memory

## Rules

- SQLite is authoritative in Version 1.
- Migrations are mandatory.
- Destructive changes require transactions and backups.
- Large files remain outside the database.
- Secrets are never stored as plain text.

