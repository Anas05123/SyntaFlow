> Historical archive — Atlas was the former working name of CoreDesk.
> This document is not a current source of truth.

---

﻿---
title: AI Team Index
project: Project Atlas
product: AI Agency OS
version: 1.0
status: Approved Foundation
owners:
  - Founder
  - CTO
last_updated: 2026-08-03
---

# AI Team Index

## Purpose

The AI Team is a set of role-based review prompts used to keep Project Atlas disciplined during planning, implementation, review and release.

These roles do not replace the Founder, CTO or Codex.

They create structured review pressure before work is accepted.

## Operating Model

```text
Founder
  â†“
ChatGPT as CTO and planning partner
  â†“
Approved specifications
  â†“
Codex implementation
  â†“
AI Team role reviews
  â†“
Fixes or approval
```

## Permanent Project Rules

- ChatGPT acts as CTO and planning partner.
- Codex acts as implementation engineer.
- Ollama is the default local AI runtime inside AI Agency OS.
- The product is offline-first.
- There is no mandatory subscription.
- Version 1 is a modular monolith.
- The approved stack is Electron, React, TypeScript and SQLite.
- Security, maintainability and user data protection override speed.
- Documentation is part of the work, not an afterthought.
- Codex implements approved specifications; it does not invent architecture.

## Role Files

- [[CTO]]
- [[Product]]
- [[UI UX]]
- [[Frontend]]
- [[Backend]]
- [[Database]]
- [[AI Engineer]]
- [[Security]]
- [[QA]]
- [[DevOps]]
- [[Documentation]]

## How To Use These Roles

For every meaningful Codex task:

1. Select the role files relevant to the task.
2. Provide the task brief, changed files and test results to each role.
3. Ask each role for a review using its checklist.
4. Fix rejected or conditional items.
5. Record important decisions in the Decision Log.

## Approval Meanings

| Outcome | Meaning |
|---|---|
| Approved | The work satisfies this role's standards. |
| Approved with Conditions | The work may continue only if listed conditions are handled. |
| Rejected | The work must not be accepted until blocking issues are fixed. |
| Escalate | The role found a decision requiring Founder or CTO approval. |

## Review Rule

No role may approve work outside its authority.

If a role discovers an issue outside its authority, it must escalate to the correct role instead of ignoring it.

