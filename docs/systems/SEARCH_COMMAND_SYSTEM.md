# CoreDesk — Universal Search & Command Palette System

> **Status:** IMPLEMENTED  
> **Last verified:** 2026-09-13  
> **Relevant source areas:** `coredesk-app/src/components/SearchPalette.tsx`, `coredesk-app/src/state/db.ts`  
> **Owner domain:** Navigation & Productivity  

---

## 1. Universal Search Architecture

CoreDesk features an omnipresent, keyboard-driven command palette accessible from anywhere in the application via `⌘K` (macOS) or `Ctrl+K` (Windows/Linux).

It queries across all four canonical operational entities in real time via `CoreDeskDatabase.search(state, query)`:
1. **Clients**: Searches name, industry, and contact names. (Badge: `CLIENT`)
2. **Projects**: Searches title, project code, and brief text. (Badge: `PROJECT`)
3. **Tasks**: Searches title, note, and linked client/project names. (Badge: `TASK`)
4. **Documents**: Searches title, document type, and section headers. (Badge: `DOC`)

```
┌─────────────────────────────────────────────────────────────┐
│  Search clients, projects, tasks, documents…         [Esc]  │
├─────────────────────────────────────────────────────────────┤
│ CLIENTS                                                     │
│   ● Northlight Studio · Design Agency · Marta Velasco       │
│   ● Verity Health · HealthTech · Dr. Aris Thorne            │
│                                                             │
│ PROJECTS                                                    │
│   ◆ Brand Identity System · Northlight Studio · Active      │
│                                                             │
│ TASKS                                                       │
│   ✔ Export packaging artwork · Brand Identity · High        │
│                                                             │
│ DOCUMENTS                                                   │
│   📄 Commercial Agreement · Northlight Studio · Approved    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Keyboard Navigation Contract

- **`⌘K` / `Ctrl+K`**: Opens the palette, auto-focuses the search input, and clears previous query strings.
- **`Up Arrow` / `Down Arrow`**: Moves selection highlight across categorized result groups.
- **`Enter`**: Executes navigation to the selected record's route (`#/clients/:id`, `#/projects/:id`, `#/tasks`, `#/documents/:id`). Automatically closes the palette.
- **`Escape`**: Dismisses the palette and restores focus to the previously active element.

---

## 3. Quick Actions & Commands

When the search query starts with `>` or matches standard intent verbs, the palette offers direct commands:
- `> New Client`: Opens the Client Onboarding Studio Drawer.
- `> New Project`: Navigates to the Project Scoping Studio.
- `> Toggle Rail`: Collapses or expands the sidebar.
- `> Appearance`: Opens the theme and wallpaper popover.
