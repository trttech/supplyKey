# Table Filters Guide

The `/users` page is the reference implementation for the updated table layer pulled from `dashboard`.

## Core components

- `app/components/datatable/DataTable.vue`: table wrapper and loading states
- `app/components/datatable/DataTableToolbar.vue`: search, filters, view options
- `app/components/datatable/DataTableFacetedFilter.vue`: multi-select filter popover
- `app/components/datatable/DataTablePagination.vue`: local or server pagination controls

## Typical pattern

1. Fetch rows from a server route
2. Define `ColumnDef[]`
3. Attach `filterFn` for columns that use faceted filters
4. Pass everything into `DataTable`
5. Use toolbar and pagination slots for controls

## Why this starter uses client-side filtering

It is the smallest reusable baseline. Once you need server-side filters, keep the shell and move state into route query params or API query params the way `dashboard` does in its larger pages.

