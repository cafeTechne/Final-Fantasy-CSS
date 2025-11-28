# Component Inventory and Stubs

This document lists the current components in the library, notes which ones are implemented in the demo, and points out missing or planned components. For missing components we add lightweight CSS stubs in `css/components/` so we have files to iterate on and document.

Purpose:
- Provide a single source-of-truth for the component system.
- Make it easy to add examples and tests for each component.
- Keep an explicit list so future additions are deliberate and low-debt.

## Foundational tokens & utilities
- Variables / tokens (colors, spacing, fonts): present in `css/core.css`.
- Utilities (spacing, display): limited set present in `css/demo.css` — plan to expand to a documented, small utility set.
- Container & grid: `.container`, small `.grid-2` present; plan to add responsive grid utilities.

## Content & layout
- Cards: implemented in `css/components.css`.
- Typography: basic styles in `core.css`.
- Tables: MISSING (stub created).
- Avatars / Figures: MISSING (stub created).

## Forms
- Inputs / selects / textarea: implemented.
- Checkboxes / radios / toggles: implemented.
- Input groups / inline forms: MISSING (stub created).
- Validation states: implemented.

## Navigation & Menus
- Nav (tabs): implemented (`.ff-nav`).
- Navbar (site header): MISSING (stub created).
- Breadcrumb: implemented styles included.
- Pagination: implemented.
- Dropdown: implemented.

## Overlays & feedback
- Modal: implemented (backdrop + modal). Needs ARIA & focus trapping (planned).
- Tooltip: implemented CSS-only hover tooltip.
- Popover: MISSING (stub created).
- Toasts / toasters: MISSING (stub created).

## Interactive / Game-specific
- Battle menu / ATB gauge: implemented.
- Materia slots (FF7): implemented.
- Junction display (FF8): implemented.

## Misc
- Badges: implemented.
- Progress bars: implemented.
- Spinners: partly present via `.ff-btn.loading` pseudo-element; consider a dedicated spinner component (stub created).

---

## Files added as stubs
The following empty-but-documented stubs were added under `css/components/` to reserve component names and provide an immediate place to implement styles and examples.

- `css/components/ff-navbar.css` — placeholder for site-level navbar styles
- `css/components/ff-table.css` — placeholder for table styles and responsive tables
- `css/components/ff-popover.css` — placeholder for popover component (keyboard + ARIA)
- `css/components/ff-toast.css` — placeholder for toast notifications
- `css/components/ff-accordion.css` — placeholder for collapse/accordion
- `css/components/ff-input-group.css` — placeholder for input groups and addons
- `css/components/ff-avatar.css` — placeholder for avatar/figure component
- `css/components/ff-spinner.css` — placeholder for spinner component

## Next doc tasks
- Create per-component markdown under `docs/components/` that include HTML examples, API notes (classes, data-attributes), and accessibility guidelines.
- Add a docs index page (or migrate to VitePress) that lists components and links to examples.

If this inventory looks right I will:
1. Add the stub CSS files to the repo (empty files with header comments).
2. Create `docs/components/{component}.md` skeleton files for each component so we can start filling examples.
