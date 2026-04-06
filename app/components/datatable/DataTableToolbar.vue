<script setup lang="ts" generic="TData">
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-vue-next"
import type { Table } from "@tanstack/vue-table"
import { computed } from "vue"
import DataTableSearch from "./DataTableSearch.vue"
import DataTableViewOptions from "./DataTableViewOptions.vue"

interface DataTableToolbarProps {
	table: Table<TData>
	searchKey?: string
	searchPlaceholder?: string
	columnLabels?: Record<string, string>
	customIsFiltered?: boolean
	onReset?: () => void
}

const props = defineProps<DataTableToolbarProps>()

const isFiltered = computed(() => {
	return props.table.getState().columnFilters.length > 0 || props.customIsFiltered
})
const searchColumn = computed(() => {
	if (!props.searchKey) {
		return undefined
	}
	return props.table.getColumn(props.searchKey)
})

const handleReset = () => {
	if (props.onReset) {
		props.onReset()
	}
	else {
		props.table.resetColumnFilters()
	}
}
</script>

<template>
	<div class="surface-panel-subtle surface-outline rounded-[1.25rem] border px-4 py-3">
		<div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
			<div class="flex flex-1 flex-wrap items-center gap-2.5">
				<DataTableSearch
					v-if="searchKey"
					:input-class="'h-10 w-full min-w-64 md:w-80 xl:w-96'"
					:model-value="(searchColumn?.getFilterValue() as string) ?? ''"
					:placeholder="searchPlaceholder || 'Filter...'"
					@update:model-value="(value) => searchColumn?.setFilterValue(value || undefined)"
				/>

				<slot name="filters" />

				<Button
					v-if="isFiltered"
					variant="ghost"
					class="text-muted-foreground h-10 rounded-xl px-3.5"
					@click="handleReset"
				>
					Reset
					<RotateCcw class="ml-2 h-4 w-4" />
				</Button>
			</div>

			<div class="flex flex-wrap items-center gap-2 xl:justify-end">
				<slot name="actions" />

				<DataTableViewOptions
					:table="table"
					:column-labels="columnLabels"
				/>
			</div>
		</div>
	</div>
</template>
