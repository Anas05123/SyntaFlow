# CoreDesk — Appearance Engine & Theming System

> **Status:** IMPLEMENTED  
> **Last verified:** 2026-09-13  
> **Relevant source areas:** `coredesk-app/src/components/AppearancePopover.tsx`, `coredesk-app/src/styles/tokens.css`, `coredesk-app/src/styles/layout.css`  
> **Owner domain:** UI Customization & Theming  

---

## 1. The Two-Layer Visual Hierarchy

CoreDesk maintains a strict separation between the **Environment Canvas** and the **Content Surfaces**:

1. **Environment Canvas (`--canvas`, `.shell-backdrop`)**:
   - The foundation of the desktop window. Hosts the optional wallpaper image, background ambient glow, and overall window tint.
2. **Content Surfaces (`--surface`, `--surface-subtle`, `.card`, `.panel`)**:
   - The functional workspace where text, tables, and buttons reside.
   - **Contrast Protection Rule**: Content surfaces never become 100% transparent. When wallpapers are active, cards blend using `color-mix(in srgb, var(--surface) calc(var(--panel-alpha, 0.88) * 100%), transparent)` paired with `backdrop-filter: blur(12px)`. This ensures WCAG AA text legibility regardless of wallpaper brightness or pattern.

---

## 2. Appearance Popover (`AppearancePopover.tsx`)

Accessible via the sun/palette icon on the top command bar, providing real-time adjustments without reloading:
- **Theme Mode**: `Dark` (default), `Light`, or `System`.
- **Accent Palette**: `CoreDesk Cobalt` (`#2563EB`), `Cyan` (`#06B6D4`), `Emerald` (`#10B981`), `Violet` (`#8B5CF6`), `Amber` (`#F59E0B`).
- **Surface Material**: `Solid Graphite` (pure opacity) vs `Frosted Glass` (translucent blur).
- **Wallpaper Engine**:
  - Pre-packaged studio gradients and dark architectural textures.
  - Custom local image upload (`data:image/...` or local file path).
  - **Dim Slider ($0\% – 80\%$)**: Darkens the wallpaper to increase contrast.
  - **Blur Slider ($0\text{px} – 32\text{px}$)**: Softens wallpaper textures so text remains sharp.

---

## 3. Persistence & Data Attributes

Appearance preferences are written to `localStorage` under `coredesk.appearance.v1` and applied as data attributes to the root HTML document:
```html
<html data-theme="dark" data-accent="cobalt" data-surface="soft" data-wallpaper="true" style="--blur: 16px; --dim: 0.45;">
```
This guarantees that themes apply immediately on application boot before the first paint, eliminating theme flickering.
