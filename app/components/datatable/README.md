# DataTable Components

This directory contains reusable datatable components following the shadcn-vue patterns.

## Components

### Core Components

- **DataTable.vue** - Main table component with slots for customization
- **DataTableColumnHeader.vue** - Reusable sortable column header
- **DataTablePagination.vue** - Advanced pagination controls
- **DataTableViewOptions.vue** - Column visibility toggle
- **DataTableToolbar.vue** - Toolbar with search and filters

## Usage

### Basic Usage

```vue
<script setup lang="ts">
import { DataTable, DataTableToolbar, DataTablePagination } from "@/components/ui/data-table"
import { columns } from "./columns"

const data = ref([])
const loading = ref(false)
</script>

<template>
  <DataTable
    :columns="columns"
    :data="data"
    :loading="loading"
  >
    <template #toolbar="{ table }">
      <DataTableToolbar
        :table="table"
        search-key="name"
        search-placeholder="Search..."
      />
    </template>

    <template #pagination="{ table }">
      <DataTablePagination :table="table" />
    </template>
  </DataTable>
</template>
```

### Column Header Usage

```typescript
// In your columns.ts file
import { DataTableColumnHeader } from "@/components/ui/data-table"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => h(DataTableColumnHeader, {
      column,
      title: "Name",
    }),
    cell: ({ row }) => h("div", {}, row.getValue("name")),
  },
]
```

## Features

- **Sorting** - Built-in sorting with visual indicators
- **Filtering** - Search and custom filters
- **Column Visibility** - Toggle column visibility
- **Pagination** - Full pagination controls with page size selection
- **Loading States** - Skeleton loading animation
- **Responsive** - Mobile-friendly design
- **Type Safety** - Full TypeScript support
- **Customizable** - Slots for custom content

## Props

### DataTable

- `columns: ColumnDef<TData, TValue>[]` - Column definitions
- `data: TData[]` - Table data
- `loading?: boolean` - Loading state

### DataTableToolbar

- `table: Table<TData>` - Table instance
- `searchKey?: string` - Column key for search
- `searchPlaceholder?: string` - Search input placeholder
- `columnLabels?: Record<string, string>` - User-friendly column labels

### DataTablePagination

- `table: Table<TData>` - Table instance
- `showSelectedRows?: boolean` - Show selected row count
- `showPageSizeSelector?: boolean` - Show page size selector
- `showPageInfo?: boolean` - Show page information

## Slots

### DataTable Slots

- `toolbar` - Custom toolbar content
- `empty` - Custom empty state
- `pagination` - Custom pagination

### DataTableToolbar Slots

- `filters` - Additional filter controls
- `actions` - Action buttons
