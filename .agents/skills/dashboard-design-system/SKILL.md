---
name: dashboard-design-system
description: Use for frontend UI work in the Admin dashboard when building or refining pages, settings screens, forms, tables, filters, layouts, and shared components that must stay aligned with the existing shadcn-vue primitives, TanStack Form patterns, and route-query-driven datatable UX. Prefer this over generic visual-design skills unless the user explicitly wants a broader redesign.
---

# Dashboard Design System

## Overview

This skill keeps frontend work aligned with the design system already implemented in this repo. It is for dashboard product UI, not for inventing a new visual language.

Primary priority order:

1. UX clarity
2. Clean, simple, minimal UI
3. Consistency with the existing component system
4. Visual polish

Prefer removing friction over adding flair. A good screen should feel obvious to use within a few seconds.

Start from current repo patterns before making design decisions. Ground yourself against the active theme tokens, dashboard shell, sidebar/header composition, shared datatable primitives, and the existing settings-form structure.

If you need concrete composition examples, load only the relevant reference:

- `references/anti-patterns.md`
- `references/states.md`
- `references/overlays.md`
- `references/dashboard-cards.md`
- `references/action-bars.md`
- `references/page-headers.md`
- `references/forms.md`
- `references/datatables.md`

## When To Use

Use this skill when the task involves:

- Designing or refining dashboard pages
- Creating or editing shared UI
- Building forms with `@tanstack/vue-form` and shadcn `Field*` components
- Building tables, filters, or pagination with the shared datatable system
- Adjusting page layout, section hierarchy, empty states, loading states, or action bars
- Translating a product request into UI that should look native

## Core Rules

- Use shadcn-vue components as the primitive layer. Prefer composition over bespoke wrappers.
- Treat the shared UI primitive layer as project-owned source. If a primitive needs adjustment, modify it instead of bypassing it with ad hoc markup.
- Preserve the dashboard shell: sidebar, header, breadcrumb, content area, and card-based sections.
- Respect route-owned component boundaries. Shared components belong in the shared component layer; route-specific pieces belong with the route that owns them.
- Use absolute imports based on existing project conventions.
- Keep dark and light themes working. Prefer semantic tokens and utility classes over hard-coded colors.
- Keep interactions utilitarian and calm. This product is an admin dashboard, not a marketing site.
- Start with the smallest UI that solves the problem. Add visual complexity only when it improves comprehension.
- Prefer predictable layouts and obvious actions over novelty.
- If a choice improves aesthetics but weakens clarity, keep the clearer option.

## UX Priority

Optimize for operator speed and comprehension:

- Make the primary task obvious from the first screenful
- Keep actions near the data or form they affect
- Reduce competing emphasis; only one primary action per local area
- Use progressive disclosure for secondary controls
- Minimize context switching between page, modal, and nested actions
- Preserve user progress during refetches, validation, and filtering
- Make destructive actions deliberate and harder to trigger accidentally

## Minimal UI Principles

The target is clean-simple-minimal dashboard UI, not empty or decorative UI:

- Use fewer surfaces, not more
- Use spacing and typography before adding borders or backgrounds
- Keep titles short and descriptions purposeful
- Avoid decorative icon use; icons should clarify structure or state
- Favor calm neutrals with tokenized emphasis
- Keep action groups compact and easy to scan
- Do not turn every section into a card if spacing or separators communicate hierarchy well enough

## Visual Language

The current system is defined by a restrained, operational dashboard aesthetic:

- Color: warm neutral surfaces with a gold primary accent. Use `primary` for emphasis, not everywhere.
- Surfaces: cards, panels, tables, popovers, and sidebar rely on tokenized background, border, and muted values.
- Density: compact but readable. Favor clear grouping over large decorative spacing.
- Radius: moderate rounding centered around the global `--radius` token.
- Typography: straightforward hierarchy with strong section titles, subdued descriptions, and compact table/filter text.
- Icons: use Lucide sparingly to support hierarchy, section headers, status, and affordances.
- Motion: subtle transitions only. Use motion to clarify state changes, not to decorate.

Avoid these unless explicitly requested:

- Gradient-heavy hero treatments
- Glassmorphism or floating marketing cards
- Editorial/minimalist whitespace extremes
- Novel typography systems disconnected from shadcn defaults
- Raw color values when semantic tokens already cover the use case

For explicit anti-pattern examples, read `references/anti-patterns.md`.

## Layout Patterns

Match the existing dashboard composition:

- Use the established dashboard shell
- Use the existing sidebar and header composition
- Keep breadcrumb and top actions in the header area
- Main content typically uses one of:
  - `container mx-auto max-w-*` for narrower settings/detail pages
  - full-width sections for data-heavy pages like orders and invoices
- Use cards to segment settings and operational blocks
- Use a simple heading row plus supporting description before dense content
- Keep mobile behavior intact; stack controls vertically before forcing cramped horizontal layouts

## Component Selection

Prefer these components and patterns first:

- Actions: `Button`
- Sections: `Card`, `CardHeader`, `CardContent`, `CardFooter`
- Feedback: `Alert`, toast, `Badge`, `Skeleton`
- Inputs: `Input`, `Select`, `Checkbox`, `Field*`
- Navigation: `Sidebar*`, `Breadcrumb`, `Tabs`
- Overlays: `Dialog`, `Sheet`, `Popover`, `DropdownMenu`
- Data views: `Table` through the shared datatable system

If shadcn-vue already provides a suitable primitive, do not replace it with a custom one just for styling freedom.

## Token Usage

Use semantic tokens deliberately:

- `primary`: primary actions, active emphasis, key status accents
- `accent`: subtle highlighted surfaces or contextual emphasis
- `muted`: secondary surfaces, empty states, quiet containers, helper regions
- `border`: default structural separation
- `destructive`: destructive actions, destructive alerts, critical validation

Practical rules:

- Do not use `primary` as a general background color for large page sections
- Prefer `muted` or default surfaces for supporting content
- Use borders lightly; if spacing already separates content clearly, skip the extra line
- Keep radius consistent with the existing scale; do not introduce oversized rounding for routine dashboard surfaces

## Forms

Forms in this repo are not generic visual exercises. They follow a specific composition:

- Use `@tanstack/vue-form`
- Use shadcn `Field`, `FieldSet`, `FieldGroup`, `FieldLabel`, `FieldDescription`, and `FieldError`
- Keep validation inline under the field
- Use generated Zod schemas when they exist
- Use Pinia Colada mutations for submit flows
- Disable or show pending state on submit buttons while saving
- Use toast for success/failure unless the failure is entirely field-level

Preferred structure:

1. Card header explains the section
2. Field groups organize related controls
3. Inputs stay visually consistent with shadcn defaults
4. Errors appear directly under the relevant control
5. Footer actions are obvious and low-friction

For a reusable blueprint, read `references/forms.md`.

## Datatables And Filters

Datatables are a core part of the product and already have a house style. Reuse it.

- Start from the shared datatable primitives
- Use `DataTableToolbar`, `DataTableSearch`, `DataTableFacetedFilter`, `DataTableDateRangeFilter`, and `DataTablePagination`
- Keep filtering, sorting, and pagination state in `route.query`
- Reset page when filters change
- Preserve query-param stability and back/forward navigation behavior
- Keep loading, empty, and error states within the table region, not as detached page chrome

Design expectations:

- Search and filters sit in the toolbar
- Column visibility belongs in view options, not in custom one-off menus
- Pagination stays compact and operational
- Dense data should remain legible in both themes

For a reusable blueprint, read `references/datatables.md`.

## Cards

Use cards when they improve grouping, scannability, or action clarity:

- Settings and detail groups: card-friendly
- KPI summaries: compact cards or stat panels
- Dense multi-section pages: mix cards with open sections to avoid card overload
- Do not wrap every nested subsection in another card

For reusable card patterns, read `references/dashboard-cards.md`.

## Overlays

Use overlays to reduce navigation cost, not to hide ordinary page structure:

- `Dialog`: short focused tasks, confirmations, destructive actions
- `Sheet`: create/edit flows or contextual detail that should preserve page context
- Inline expansion or collapsible sections: lightweight secondary detail inside a page

For overlay patterns, read `references/overlays.md`.

## State UX

Follow the repo’s existing state behavior:

- Initial page or table load: skeletons
- Background refetch: keep current content visible and show a subtle loading cue
- Empty states: icon, concise message, clear next action
- Page-level errors: inline `Alert`
- Transient action feedback: toast
- Success/error banners should feel product-like, not celebratory

For concrete loading, empty, success, and error patterns, read `references/states.md`.

## Action Bars

Action placement should feel obvious and low-noise:

- Keep one primary action per section or toolbar
- Group secondary actions together
- Push destructive actions away from the primary submit path
- Keep save/reset/cancel patterns consistent across pages

For reusable layouts, read `references/action-bars.md`.

## Content Tone

UI copy should feel operational and direct:

- Prefer sentence case
- Keep labels short
- Use plain language over product marketing language
- Success messages should be calm and matter-of-fact
- Error messages should state what failed and what to do next
- Button labels should describe the action, not the emotion

Examples:

- Prefer `Save changes` over `Update now`
- Prefer `Could not save store settings` over `Oops! Something went wrong`
- Prefer `No invoices found` over `Nothing here yet!`

## Accessibility

Apply system-level accessibility rules by default:

- Every meaningful input needs a visible label unless the pattern clearly calls for an accessible alternate
- Icon-only buttons need accessible text
- Focus states must remain visible
- Error text must remain close to the field or action that caused it
- Destructive actions should be explicit in both label and visual treatment
- Tables with row actions should keep those actions reachable by keyboard and understandable out of visual context

## Decision Tree

Choose the simplest pattern that fits the task:

1. If the task edits a single record or settings group, use a form section or form card.
2. If the task compares or filters many records, use the datatable system.
3. If the task summarizes a small set of metrics, use compact dashboard cards.
4. If the task needs quick confirmation, use a dialog.
5. If the task needs create/edit detail without full navigation, use a sheet.
6. If the task is secondary metadata, use subdued text, badges, or description rows instead of a whole new panel.

## Workflow

When using this skill, follow this order:

1. Inspect the nearest existing page or component that solves a similar dashboard problem.
2. Identify the smallest set of shadcn primitives needed.
3. Preserve route-query, form, and mutation patterns before changing visuals.
4. Apply styling through semantic tokens and existing utility patterns.
5. Verify light mode, dark mode, mobile layout, loading state, empty state, and error state.

During review, also check:

- the main action is obvious
- the screen is not over-carded
- the copy is concise
- the component choice matches the task type
- no state is hidden behind unnecessary indirection

## Output Standard

A good result in this repo should feel:

- Native to the current dashboard
- Built from shadcn-vue primitives rather than custom styling detours
- Calm, clean, and operational
- Consistent with TanStack Form and datatable conventions
- Easy to extend without rewriting the design system later

## Final Review Checklist

- Uses existing primitives before custom wrappers
- Keeps the primary task obvious
- Stays clean, simple, and minimal rather than decorative
- Works in light and dark themes
- Works on mobile without cramped control rows
- Covers loading, empty, success, and error states
- Keeps filters and pagination in query params where applicable
- Avoids hard-coded colors when tokens already exist
- Keeps destructive actions explicit and separated
- Uses direct, operational copy
