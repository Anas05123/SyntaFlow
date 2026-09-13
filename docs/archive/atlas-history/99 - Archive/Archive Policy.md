> Historical archive — Atlas was the former working name of CoreDesk.
> This document is not a current source of truth.

---

﻿---
title: Archive Policy
project: Project Atlas
product: AI Agency OS
section: Archive
version: 1.0
status: Active
owners:
  - Founder
  - CTO
last_updated: 2026-08-03
---

# Archive Policy

## Purpose

The archive preserves historical material without confusing it with active project guidance.

Project Atlas depends on clear documentation. Codex must never use archived documents as current instructions unless a task explicitly asks it to review historical context.

## What Belongs Here

Move material here when it is:

- Replaced by a newer approved document
- Rejected after Founder or CTO review
- Deprecated by a later architecture decision
- Preserved only for history
- Useful as context but no longer authoritative

## What Does Not Belong Here

Do not place active documents here.

Active material belongs in:

- [[../00 - Project Index/Project Atlas Home|Project Atlas Home]]
- [[../01 - Product/Product Vision|Product Vision]]
- [[../03 - Architecture/System Architecture|System Architecture]]
- [[../04 - AI Engine/AI Engine Architecture|AI Engine Architecture]]
- [[../05 - Security/Security Architecture|Security Architecture]]
- [[../07 - Engineering Standards/Engineering Standards and Codex Rules|Engineering Standards and Codex Rules]]
- [[../08 - Codex Tasks/Task Board|Task Board]]
- [[../09 - Decisions/Decision Log|Decision Log]]

## Required Archive Metadata

Every archived file must include YAML frontmatter with:

```yaml
title:
project: Project Atlas
product: AI Agency OS
archive_status: Archived
original_status:
archived_date:
archived_by:
owner:
reason:
replacement:
restoration_allowed:
```

## Replacement Links

If an archived document was replaced, include a link to the active replacement.

Example:

```markdown
Replacement: [[../03 - Architecture/System Architecture|System Architecture]]
```

If no replacement exists, write:

```markdown
Replacement: None
```

## Reasons

Use one clear reason:

- Replaced
- Rejected
- Deprecated
- Historical
- Duplicated
- Merged into another document
- Incorrect direction
- No longer needed

## Migration Notes

When archiving an active document, record:

- What changed
- What content was moved
- What content was removed
- Which active document now owns the topic
- Whether Codex tasks need updating

## Restoration Procedure

Archived material can return to active use only if:

1. The Founder or CTO requests restoration.
2. The document is reviewed against current architecture.
3. Security and product conflicts are resolved.
4. The document is moved back to an active folder.
5. Metadata is updated from `Archived` to the correct active status.
6. Replacement links and the Decision Log are updated.
7. Codex tasks are updated if implementation guidance changes.

Archived documents must not be restored silently.

## Codex Rule

Codex must treat every file in `99 - Archive` as non-authoritative unless the current task explicitly says otherwise.

Archived material may provide context, but it cannot override active specifications, security rules, architecture decisions, or engineering standards.

