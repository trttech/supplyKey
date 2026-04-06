# Datatables

Use this reference for list screens, operational tables, and any filterable record view in Kleos Admin.

## Stack

- The shared datatable component system as the primary table layer
- TanStack Table under the hood
- Route query params as the source of truth for search, filters, sorting, and pagination

## Standard Composition

Use these pieces before inventing new table UI:

- `DataTable`
- `DataTableToolbar`
- `DataTableSearch`
- `DataTableFacetedFilter`
- `DataTableDateRangeFilter`
- `DataTablePagination`
- `DataTableViewOptions`
- `DataTableColumnHeader`

## Query Param Rules

- Search: `q`
- Page index: `page`
- Page size: `pageSize`
- Sort: `sort`
- Multi-select filters: use a stable string format already established on the page, typically comma-separated values
- Filter changes reset page to `1`

## Toolbar Rules

- Search belongs in the toolbar
- Faceted filters belong beside search
- Reset belongs in the toolbar when filters are active
- Column visibility belongs in view options
- Do not move core table controls into page-level hero sections

## Table State UX

- Initial load: skeleton rows in the table body
- Empty state: concise message inside the table region
- Refetch: keep visible data when possible
- Pagination: compact and operational, not oversized
- Dense rows should remain readable in both themes

## Example Shape

```vue
<DataTable :columns="columns" :data="rows" :loading="isLoading">
  <template #toolbar="{ table }">
    <DataTableToolbar
      :table="table"
      :custom-is-filtered="hasActiveFilters"
      :on-reset="resetFilters"
    >
      <template #filters>
        <DataTableSearch
          :model-value="search"
          placeholder="Search orders"
          @update:model-value="updateSearch"
        />

        <DataTableFacetedFilter
          title="Status"
          :options="statusOptions"
          :selected-values="selectedStatuses"
          @update:selected-values="updateStatuses"
        />
      </template>
    </DataTableToolbar>
  </template>

  <template #pagination="{ table }">
    <DataTablePagination
      :table="table"
      :server-pagination="serverPagination"
      @server-page-change="updatePage"
      @server-page-size-change="updatePageSize"
    />
  </template>
</DataTable>
```

## Implementation Shape

The common flow is:

1. Read values from `route.query`
2. Parse into typed filter state
3. Update query through one centralized helper
4. Drive data fetches or client filtering from parsed state
5. Render controls through the shared datatable components

Do not keep a second source of truth for table filters in local component state unless the interaction requires a temporary draft state.
