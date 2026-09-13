# CoreDesk — Design System & Visual Foundations

> **Status:** IMPLEMENTED  
> **Last verified:** 2026-09-13  
> **Relevant source areas:** `coredesk-app/src/styles/tokens.css`, `coredesk-app/src/styles/layout.css`, `coredesk-app/src/styles/components.css`  
> **Owner domain:** Visual Design & Design Tokens  

---

## 1. Design Principles & Aesthetic Foundations

CoreDesk embodies an **executive graphite operating environment**. It rejects generic, colorful web-dashboard conventions in favor of a restrained, high-density desktop aesthetic:
- **Graphite Surfaces**: Deep dark neutrals (`#0B0D0F` to `#242A30`) that eliminate eye strain during long working sessions.
- **Cobalt & Cyan Precision**: Cobalt (`#2563EB`) denotes primary user intent; Cyan (`#06B6D4`) denotes active workstreams and fresh activity.
- **Subtle 1px Architecture**: Boundaries are defined by hair-line 1px borders with low-alpha edges (`rgba(255, 255, 255, 0.08)`), never thick outlines or drop shadows.
- **Tabular Numeric Alignment**: Financial metrics, dates, and hours use `font-variant-numeric: tabular-nums` for precision scanning.

---

## 2. Color Palette & Semantic Tokens

### 2.1 Surfaces & Neutrals
```css
--canvas:          #0B0D0F;   /* Base application window background */
--surface:         #121518;   /* Primary card and drawer background */
--surface-subtle:  #181C20;   /* Secondary column, input, and table hover */
--surface-raised:  #1F2429;   /* Popovers, menus, elevated dropdowns */
--edge:            rgba(255, 255, 255, 0.08); /* Standard 1px boundary */
--divider:         rgba(255, 255, 255, 0.06); /* Subtle interior split */
```

### 2.2 Brand & Interaction Accents
```css
--accent:          #2563EB;   /* CoreDesk Cobalt: Primary buttons, active states */
--accent-hover:    #1D4ED8;   /* Hover state for primary buttons */
--cyan:            #06B6D4;   /* Cyan Accent: Live counters, active projects */
--cyan-subtle:     rgba(6, 182, 212, 0.12); /* Subtle cyan pill background */
```

### 2.3 Semantic Status & Attention Tones
```css
--risk:            #EF4444;   /* Blocker / Overdue / Error (Red) */
--risk-subtle:     rgba(239, 68, 68, 0.12);
--waiting:         #F59E0B;   /* Waiting on Client / External Gate (Amber) */
--waiting-subtle:  rgba(245, 158, 11, 0.12);
--ok:              #10B981;   /* Approved / Done / Met Milestone (Emerald) */
--ok-subtle:       rgba(16, 185, 129, 0.12);
--metadata:        #94A3B8;   /* Secondary labels, dates, subtitles */
--muted:           #64748B;   /* Disabled states, subtle timestamps */
```

---

## 3. Typography Hierarchy

Primary font stack: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

| Token / Class | Font Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `--fs-hero` | `28px` | `700` | `1.2` | Major welcome headings, auth titles |
| `--fs-page-title` | `20px` | `650` | `1.25` | Workspace screen headers (`Tasks`, `Clients`) |
| `--fs-section` | `15px` | `600` | `1.35` | Pillar headers, panel titles, group titles |
| `--fs-body` | `13px` | `450` | `1.45` | Standard body text, descriptions, table cells |
| `--fs-metadata` | `11.5px` | `500` | `1.4` | Badges, tags, due dates, breadcrumbs |
| `--fs-micro` | `10px` | `600` | `1.2` | Status pill text, uppercase section badges |

---

## 4. Radii & Spacing Scales

### Radii Scale
```css
--r-control:       6px;       /* Buttons, inputs, small tags */
--r-card:          8px;       /* Task cards, column items, list rows */
--r-panel:         10px;      /* Modals, drawers, popovers */
--r-full:          9999px;    /* Circular pills and avatars */
```

### Spacing Scale
- `4px`: Micro gap between icon and label.
- `8px`: Standard control padding; gap between chips.
- `12px`: Gap between grouped list items.
- `16px`: Standard card interior padding; column gutters.
- `24px`: Major screen container margins.

---

## 5. Control Materials & Glass Effects

CoreDesk selectively applies frosted glass to floating navigation and header surfaces:
- **Top Command Bar**: `backdrop-filter: blur(16px); background: rgba(18, 21, 24, 0.75);`
- **Slide-Over Drawers**: `background: rgba(18, 21, 24, 0.95); backdrop-filter: blur(20px);`
- **Wallpaper Backgrounds**: When custom wallpapers are active, cards blend using `color-mix(in srgb, var(--surface) 88%, transparent)` with `backdrop-filter: blur(12px)`.

---

## 6. Button Variants

1. **Primary Button (`.btn-primary`)**:
   - `background: var(--accent); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.12);`
   - Active hover: `var(--accent-hover)`.
2. **Secondary Button (`.btn-secondary`)**:
   - `background: var(--surface-subtle); color: var(--text); border: 1px solid var(--edge);`
3. **Ghost / Icon Button (`.btn-ghost`, `.btn-icon`)**:
   - `background: transparent; color: var(--metadata);`
   - Hover: `background: var(--surface-subtle); color: var(--text);`
4. **Danger Button (`.btn-danger`)**:
   - `background: var(--risk-subtle); color: var(--risk); border: 1px solid var(--risk);`

---

## 7. What is Strictly FORBIDDEN

> [!CAUTION]
> The following design anti-patterns are strictly prohibited in CoreDesk:
> - **Random Gradients**: No bright purple-to-orange gradient buttons or neon headers.
> - **Neon Borders**: No glowing cyan/pink border outlines.
> - **Glass Everywhere**: Never apply translucency to primary data tables or task cards (causes legibility collapse).
> - **Huge SaaS Metric Cards**: No oversized `48px` KPI numbers with meaningless stock-chart icons.
> - **Tiny Unreadable Gray Text**: No text smaller than `10px` or contrast below WCAG AA (4.5:1).
> - **Marketing Layouts Inside Software**: No hero landing page illustrations inside the operating workspace.
