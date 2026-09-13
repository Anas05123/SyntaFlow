---
name: coredesk-ui
description: Use for CoreDesk screens, components, layout hierarchy, navigation, design tokens, and CSS styling.
---

# CoreDesk UI & Design System Skill

## Purpose
Use when modifying React screens, extracting components, styling with CSS, adjusting layout margins, or updating design tokens.

## Required Reading (Read First)
1. [`docs/design/UI_UX_SYSTEM.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/design/UI_UX_SYSTEM.md)
2. [`docs/design/DESIGN_SYSTEM.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/design/DESIGN_SYSTEM.md)
3. [`docs/systems/TASK_SYSTEM.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/systems/TASK_SYSTEM.md) (if working on Tasks or Inspector)

## Key Source Directories
- `apps/desktop/src/screens/`
- `apps/desktop/src/components/`
- `apps/desktop/src/styles/`
- `apps/desktop/src/app/`

## Non-Negotiable Rules
- **Desktop-First**: Design for native desktop ergonomics (keyboard navigation, high density, tabular numbers).
- **Restrained Aesthetic**: Adhere to dark graphite (`#0B0D0F`), CoreDesk Cobalt (`#2563EB`), and Cyan (`#06B6D4`).
- **Forbidden Patterns**: No random multi-colored gradients, no neon glowing borders, no glass everywhere, no huge SaaS KPI cards.
- **Available Workspace Width**: Responsiveness must be driven by available workspace width via `ResizeObserver`, not raw window width.
- **Side-by-Side Mode**: Inspector drawer sits side-by-side at $\ge 1020\text{px}$ available width with scrim suppressed. Overlays at $< 1020\text{px}$.
- **Contrast Protection**: Content surfaces must remain legible over any custom wallpaper.

## Validation Checklist
```bash
cd apps/desktop
npm run lint
npm run build
```
Verify viewports:
- $1280 \times 720$ (Inspector overlay with soft scrim)
- $1440 \times 900$ (Inspector side-by-side with scrim suppressed)
- $1920 \times 1080$ (Unconstrained widescreen)

## Post-Work Documentation Updates
- Update [`docs/design/UI_UX_SYSTEM.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/design/UI_UX_SYSTEM.md) if a layout pattern changed.
- Update [`docs/design/DESIGN_SYSTEM.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/design/DESIGN_SYSTEM.md) if tokens or components changed.
- Update [`docs/00-start-here/Development Status.md`](file:///c:/Users/Anas/Desktop/CoreDesk/docs/00-start-here/Development Status.md) with new screen states.
