<script setup lang="ts" generic="TData">
import { Button } from "@/components/ui/button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-vue-next"
import type { Table } from "@tanstack/vue-table"
import { computed } from "vue"

type ServerPagination = {
	currentPage: number
	perPage: number
	lastPage: number
	total?: number
	canPrevious?: boolean
	canNext?: boolean
	mode?: "page" | "cursor"
}

interface DataTablePaginationProps {
	table: Table<TData>
	showSelectedRows?: boolean
	showPageSizeSelector?: boolean
	showPageInfo?: boolean
	serverPagination?: ServerPagination
	pageSizeOptions?: number[]
}

const props = withDefaults(defineProps<DataTablePaginationProps>(), {
	showSelectedRows: true,
	showPageSizeSelector: true,
	showPageInfo: true,
	pageSizeOptions: () => [25, 50, 100],
})

const emit = defineEmits<{
	serverPageChange: [page: number]
	serverPageSizeChange: [perPage: number]
}>()

const isServerMode = computed(() => Boolean(props.serverPagination))
const isCursorMode = computed(() => isServerMode.value && props.serverPagination?.mode === "cursor")
const currentPage = computed(() => isServerMode.value
	? (props.serverPagination?.currentPage || 1)
	: (props.table.getState().pagination.pageIndex + 1))
const pageCount = computed(() => isServerMode.value
	? Math.max(1, props.serverPagination?.lastPage || 1)
	: props.table.getPageCount())
const pageSize = computed(() => isServerMode.value
	? (props.serverPagination?.perPage || 50)
	: props.table.getState().pagination.pageSize)
const canPrevious = computed(() => isServerMode.value
	? (props.serverPagination?.canPrevious ?? (currentPage.value > 1))
	: props.table.getCanPreviousPage())
const canNext = computed(() => isServerMode.value
	? (props.serverPagination?.canNext ?? (currentPage.value < pageCount.value))
	: props.table.getCanNextPage())
const totalRows = computed(() => isServerMode.value
	? (props.serverPagination?.total ?? props.table.getFilteredRowModel().rows.length)
	: props.table.getFilteredRowModel().rows.length)
const rangeStart = computed(() => {
	if (totalRows.value === 0) return 0
	return ((currentPage.value - 1) * pageSize.value) + 1
})
const rangeEnd = computed(() => {
	if (totalRows.value === 0) return 0
	return Math.min(totalRows.value, currentPage.value * pageSize.value)
})

function updatePageSize(value: string) {
	const parsed = Number(value)
	if (!Number.isFinite(parsed) || parsed < 1) return

	if (isServerMode.value) {
		emit("serverPageSizeChange", parsed)
		return
	}

	props.table.setPageSize(parsed)
}

function firstPage() {
	if (isServerMode.value) {
		emit("serverPageChange", 1)
		return
	}
	props.table.setPageIndex(0)
}

function previousPage() {
	if (isServerMode.value) {
		emit("serverPageChange", Math.max(1, currentPage.value - 1))
		return
	}
	props.table.previousPage()
}

function nextPage() {
	if (isServerMode.value) {
		emit("serverPageChange", Math.min(pageCount.value, currentPage.value + 1))
		return
	}
	props.table.nextPage()
}

function lastPage() {
	if (isCursorMode.value) {
		return
	}
	if (isServerMode.value) {
		emit("serverPageChange", pageCount.value)
		return
	}
	props.table.setPageIndex(props.table.getPageCount() - 1)
}
</script>

<template>
	<div class="border-border/70 bg-card/55 flex flex-col gap-4 rounded-[1.2rem] border px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
		<div class="flex-1 space-y-1">
			<slot name="selected-info">
				<p class="text-sm font-medium">
					<span v-if="props.showSelectedRows">
						{{ props.table.getFilteredSelectedRowModel().rows.length }} of
						{{ totalRows }} row(s) selected
					</span>

					<span v-else>
						{{ totalRows }} result(s)
					</span>
				</p>
			</slot>

			<p class="text-muted-foreground text-xs">
				Showing {{ rangeStart }}-{{ rangeEnd }} of {{ totalRows }}
			</p>
		</div>

		<div class="flex flex-wrap items-center gap-3 lg:justify-end">
			<div
				v-if="props.showPageSizeSelector"
				class="flex items-center gap-2"
			>
				<p class="text-muted-foreground text-sm font-medium">
					Rows per page
				</p>

				<Select
					:model-value="`${pageSize}`"
					@update:model-value="(value) => value && updatePageSize(String(value))"
				>
					<SelectTrigger class="h-9 w-20">
						<SelectValue :placeholder="`${pageSize}`" />
					</SelectTrigger>

					<SelectContent side="top">
						<SelectItem
							v-for="size in props.pageSizeOptions"
							:key="size"
							:value="`${size}`"
						>
							{{ size }}
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div
				v-if="props.showPageInfo"
				class="bg-muted text-foreground inline-flex min-w-28 items-center justify-center rounded-full px-3 py-2 text-sm font-medium"
			>
				<span v-if="isCursorMode">
					Page {{ currentPage }}
				</span>

				<span v-else>
					Page {{ currentPage }} of {{ pageCount }}
				</span>
			</div>

			<div class="flex items-center gap-2">
				<template v-if="isCursorMode">
					<Button
						variant="outline"
						size="sm"
						class="rounded-xl"
						:disabled="!canPrevious"
						@click="firstPage"
					>
						First
					</Button>

					<Button
						variant="outline"
						size="sm"
						class="rounded-xl"
						:disabled="!canPrevious"
						@click="previousPage"
					>
						Previous
					</Button>

					<Button
						variant="outline"
						size="sm"
						class="rounded-xl"
						:disabled="!canNext"
						@click="nextPage"
					>
						Next
					</Button>
				</template>

				<template v-else>
					<Button
						variant="outline"
						class="hidden h-9 w-9 rounded-xl p-0 lg:flex"
						:disabled="!canPrevious"
						@click="firstPage"
					>
						<span class="sr-only">Go to first page</span>

						<ChevronsLeft class="h-4 w-4" />
					</Button>

					<Button
						variant="outline"
						class="h-9 w-9 rounded-xl p-0"
						:disabled="!canPrevious"
						@click="previousPage"
					>
						<span class="sr-only">Go to previous page</span>

						<ChevronLeft class="h-4 w-4" />
					</Button>

					<Button
						variant="outline"
						class="h-9 w-9 rounded-xl p-0"
						:disabled="!canNext"
						@click="nextPage"
					>
						<span class="sr-only">Go to next page</span>

						<ChevronRight class="h-4 w-4" />
					</Button>

					<Button
						variant="outline"
						class="hidden h-9 w-9 rounded-xl p-0 lg:flex"
						:disabled="!canNext"
						@click="lastPage"
					>
						<span class="sr-only">Go to last page</span>

						<ChevronsRight class="h-4 w-4" />
					</Button>
				</template>
			</div>
		</div>
	</div>
</template>
