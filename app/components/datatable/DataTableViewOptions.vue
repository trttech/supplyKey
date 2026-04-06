<script setup lang="ts" generic="TData">
import { SlidersHorizontal } from "@lucide/vue"
import type { Table } from "@tanstack/vue-table"
import { computed } from "vue"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableViewOptionsProps {
	table: Table<TData>
	columnLabels?: Record<string, string>
}

const props = defineProps<DataTableViewOptionsProps>()

const columns = computed(() =>
	props.table
		.getAllColumns()
		.filter(
			column =>
				typeof column.accessorFn !== "undefined" && column.getCanHide(),
		),
)

// Get user-friendly column label
const getColumnLabel = (columnId: string): string => {
	return props.columnLabels?.[columnId] || columnId
}
</script>

<template>
	<DropdownMenu>
		<DropdownMenuTrigger as-child>
			<Button
				variant="outline"
				class="hidden h-10 rounded-xl md:flex"
			>
				<SlidersHorizontal class="mr-2 h-4 w-4" />
				Columns
			</Button>
		</DropdownMenuTrigger>

		<DropdownMenuContent
			align="end"
			class="w-44"
		>
			<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>

			<DropdownMenuSeparator />

			<DropdownMenuCheckboxItem
				v-for="column in columns"
				:key="column.id"
				class="capitalize"
				:model-value="column.getIsVisible()"
				@update:model-value="(value) => column.toggleVisibility(!!value)"
			>
				{{ getColumnLabel(column.id) }}
			</DropdownMenuCheckboxItem>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
