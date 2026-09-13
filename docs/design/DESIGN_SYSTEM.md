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

### 2.3 Semantic Status & Attention Tones (WCAG 1.4.3 Compliant)
```css
--risk:            #D65A5A;   /* Blocker / Overdue / Error (Red) */
--risk-tint:       rgba(214, 90, 90, 0.12);
--waiting:         #D49A3A;   /* Waiting on Client / External Gate (Amber) */
--waiting-tint:    rgba(212, 154, 58, 0.12);
--active:          #3FA66B;   /* Approved / Done / Met Milestone (Emerald) */
--active-tint:     rgba(63, 166, 107, 0.12);

/* WCAG 1.4.3 Verified Contrast Ratios across canvas (#0e1114), surface (#14181c), raised (#1b2026), and sidebar (#101418) */
--text:            #F4F6F8;   /* 15.2:1 contrast */
--muted:           #B6BEC8;   /* 9.3:1 contrast on canvas (light: #424b56, 9.4:1) */
--metadata:        #8C96A3;   /* 5.7:1 contrast on canvas (light: #525c68, 6.7:1) */
```

---

## 3. Typography Hierarchy (Normalized 7-Step Scale)

Primary font stack: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

| Token / Step | Font Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `--fs-display` | `30px` | `700` | `1.2` | Major document hero titles, auth titles |
| `--fs-page-title` | `24px` | `650` | `1.25` | Workspace screen headers (`Home`, `Tasks`, `Clients`) |
| `--fs-title` | `20px` | `600` | `1.3` | Object titles, modal headers, card group titles |
| `--fs-section` | `16px` | `600` | `1.35` | Pillar headers, panel section titles |
| `--fs-body` | `14px` | `450` | `1.5` | Standard body text, descriptions, table cells |
| `--fs-meta` | `12.5px` | `500` | `1.4` | Badges, tags, due dates, breadcrumbs, secondary info |
| `--fs-eyebrow` | `11px` | `650` | `1.2` | Uppercase section badges, status pills |

---

## 4. Control Sizing Scale (WCAG 2.5.8 Compliant)

| Role | Target Height | Padding | Icon Size | Min Target (WCAG 2.5.8) |
|---|---|---|---|---|
| **Primary Controls (`.btn-primary`, `.btn-secondary`)** | `40px` | `0 16px` | `16px` | $\ge 24\times 24\text{px}$ (Exceeds) |
| **Compact Controls (`.btn-sm`)** | `36px` | `0 12px` | `14px` | $\ge 24\times 24\text{px}$ (Exceeds) |
| **Icon-Only Buttons (`.btn-icon`)** | `32–36px` | `0` | `16px` | $\ge 24\times 24\text{px}$ (Exceeds) |
| **Checkboxes & Radios (`.check`, `.tick`)** | `18px box` | `3px pseudo` | — | Expanded to $\ge 24\times 24\text{px}$ via pseudo-elements |

---

## 5. Focus System & Interactive States (WCAG 2.4.7)

Every keyboard-interactive element exposes a visible, high-contrast focus indicator:
```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 4px;
}
```
- **Global Rail Active State**: Filled background (`var(--raised)`) + 3px cobalt left marker.
- **Tabs Active State**: Solid cobalt bottom indicator rule.
- **Local Outline**: Filled selected row (`var(--row-selected)`).
- **Table Rows**: Subtle selected background tint (`color-mix(in srgb, var(--accent) 9%, transparent)`).

---

## 6. Radii & Spacing Scales

### Radii Scale
```css
--r-control:       4px;       /* Buttons, inputs, tags */
--r-card:          6px;       /* Task cards, column items, list rows */
--r-panel:         8px;       /* Modals, drawers, popovers */
--r-full:          9999px;    /* Circular pills and avatars */
```

### Spacing Scale
- `4px`: Micro gap between icon and label.
- `8px`: Standard control padding; gap between chips.
- `12px`: Gap between grouped list items.
- `16px`: Standard card interior padding; column gutters.
- `24px`: Major screen container margins (`--pad-page`).

---

## 7. Control Materials & Glass Effects

CoreDesk selectively applies frosted glass to floating navigation and header surfaces:
- **Top Command Bar**: `backdrop-filter: blur(24px) saturate(180%); background: color-mix(in srgb, var(--surface) 82%, transparent);`
- **Slide-Over Drawers**: `background: var(--surface);`
- **Wallpaper Backgrounds**: When custom wallpapers are active, operational surfaces (tables, forms, editors, inspectors) remain solid/opaque (`backdrop-filter: none;`) to prevent legibility collapse.

---

## 8. Button Variants

1. **Primary Button (`.btn-primary`)**:
   - `height: 40px; background: var(--accent); color: #ffffff; border: 1px solid var(--accent);`
   - Active hover: `var(--accent-hover)`.
2. **Secondary / Standard Button (`.btn`)**:
   - `height: 40px; background: var(--raised); color: var(--text); border: 1px solid var(--divider);`
3. **Ghost Button (`.btn-ghost`)**:
   - `background: transparent; color: var(--muted); border: 1px solid transparent;`
   - Hover: `background: var(--row-hover); color: var(--text);`
4. **Danger Button (`.btn-danger`)**:
   - `background: var(--risk-tint); color: var(--risk); border: 1px solid var(--risk);`

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
