---
name: coredesk-documents
description: Use for CoreDesk Document Studio, versioning, review requests, approval gates, and delivery packages.
---

# CoreDesk Document & Review Governance Skill

## Purpose
Use when modifying the document editor, implementing version history, building review request flows, or packaging client deliverables.

## Required Reading (Read First)
1. [`docs/systems/DOCUMENT_SYSTEM.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/systems/DOCUMENT_SYSTEM.md)
2. [`docs/systems/REVIEW_DELIVERY_SYSTEM.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/systems/REVIEW_DELIVERY_SYSTEM.md)
3. [`docs/security/ACCESS_MODEL.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/security/ACCESS_MODEL.md)

## Key Source Directories
- `apps/desktop/src/screens/DocumentWorkspaceScreen.tsx`
- `apps/desktop/src/screens/DocumentsScreen.tsx`
- `apps/desktop/src/screens/guest/GuestReviewScreen.tsx`
- `apps/desktop/src/screens/guest/GuestDeliveryScreen.tsx`

## Non-Negotiable Rules
- **Immutable Snapshots**: Submitted `DocVersion` records are strictly immutable. Once created, their content and timestamps can never be edited.
- **Working Draft Decoupling**: Modifications to working drafts must never alter the review state or content of active or historical snapshots.
- **Exact Version Binding**: Review decisions (`approved`, `changes`) bind strictly to one exact version number.
- **Delivery Eligibility Gate**: Delivery packaging cannot be unlocked if any required deliverable document is unapproved or in review.

## Validation Commands
```bash
cd apps/desktop
npm run build
npm run check:routes
```

## Post-Work Documentation Updates
- Update [`docs/systems/DOCUMENT_SYSTEM.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/systems/DOCUMENT_SYSTEM.md) if document structure or versioning mechanics change.
- Update [`docs/systems/REVIEW_DELIVERY_SYSTEM.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/systems/REVIEW_DELIVERY_SYSTEM.md) if delivery packaging or review flows change.
