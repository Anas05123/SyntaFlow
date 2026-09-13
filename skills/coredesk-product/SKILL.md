---
name: coredesk-product
description: Use for CoreDesk product strategy, client lifecycle modeling, commercial blueprints, and roadmap planning.
---

# CoreDesk Product Skill

## Purpose
Use when planning features, adjusting client lifecycle stages, working on commercial scoping blueprints, or modifying product roadmap priorities.

## Required Reading (Read First)
1. [`docs/product/PRODUCT_VISION.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/product/PRODUCT_VISION.md)
2. [`docs/product/CLIENT_LIFECYCLE.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/product/CLIENT_LIFECYCLE.md)
3. [`docs/roadmap/ROADMAP.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/roadmap/ROADMAP.md)

## Key Source Directories
- `apps/desktop/src/domain/`
- `apps/desktop/src/screens/CreateProjectScreen.tsx`
- `apps/desktop/src/screens/HomeScreen.tsx`

## Non-Negotiable Rules
- **The Product is the Loop**: Never design isolated screens; preserve end-to-end commercial continuity from proposal to delivery.
- **Three Structural Records**: Never conflate Client, Project, and Document. Closing a project never closes its client.
- **Dimension Decoupling**: Lifecycle stage, operational attention, and security access are separate dimensions. Never collapse them into one status.
- **No Scope Drift**: Never introduce multi-tenant SaaS features or team seats into V1 solo practice scope.

## Validation Commands
```bash
cd apps/desktop
npm run build
```

## Post-Work Documentation Updates
- Update [`docs/00-start-here/Development Status.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/00-start-here/Development Status.md) if system capabilities change.
- Update [`docs/roadmap/ROADMAP.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/roadmap/ROADMAP.md) if milestone phases shift.
- Update [`docs/DECISIONS.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/DECISIONS.md) for any major architectural choices.
