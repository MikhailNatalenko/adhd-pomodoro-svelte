---
description: Notes for agents working on this project
---

# Project Notes for Agents

## Language Policy

**All UI text must be in English.** This includes:
- Button labels and text content
- `title` / `aria-label` attributes (tooltips)
- Placeholder text in inputs
- Any user-visible strings

Do **not** add Russian text to UI components. Code comments can be in any language.

## Custom Timer UI

The custom timer feature lives in `src/lib/components/Controls.svelte`:
- Two independent lists: **Active** (work) and **Rest** timers, backed by `workTimers` / `restTimers` persistent cookie stores in `pomodoroStore.ts`.
- The **+** button next to each column opens a modal dialog (`dialogOpen` state) to add a new timer value.
- **Edit mode** is toggled via the pencil icon button in the page header (`src/routes/+page.svelte`). The state is a global writable store `editMode` exported from `pomodoroStore.ts`. When active, delete (×) buttons appear next to each timer.
- Timers are persisted in cookies via `persistentStore` from `src/lib/stores/persistentStore.ts`.

## Layout

- `+page.svelte` uses `min-height: 100vh` and `overflow-y: auto` on `main` and `.container` to allow vertical growth when many timers are added.
- The `.pomodoro` section uses `margin-bottom` (not a fixed height) so the controls column can grow.
