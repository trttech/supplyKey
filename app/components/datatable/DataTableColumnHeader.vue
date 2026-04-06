<script setup lang="ts" generic="TData">
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowDown, ArrowUp, ArrowUpDown, EyeOff } from "lucide-vue-next"
import type { Column } from "@tanstack/vue-table"
import { cn } from "~/utils"

interface DataTableColumnHeaderProps {
	column: Column<TData, unknown>
	title: string
	class?: string
}

const props = defineProps<DataTableColumnHeaderProps>()
</script>

<template>
	<div
		v-if="column.getCanSort()"
		:class="cn('flex items-center space-x-2', props.class)"
	>
		<DropdownMenu>
			<DropdownMenuTrigger as-child>
				<Button
					variant="ghost"
					class="data-[state=open]:bg-accent/70 h-9 rounded-lg px-2.5"
				>
					<span>{{ title }}</span>

					<ArrowDown
						v-if="column.getIsSorted() === 'desc'"
						class="ml-2 h-4 w-4"
					/>

					<ArrowUp
						v-else-if="column.getIsSorted() === 'asc'"
						class="ml-2 h-4 w-4"
					/>

					<ArrowUpDown
						v-else
						class="ml-2 h-4 w-4"
					/>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="start">
				<DropdownMenuItem @click="column.toggleSorting(false)">
					<ArrowUp class="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
					Asc
				</DropdownMenuItem>

				<DropdownMenuItem @click="column.toggleSorting(true)">
					<ArrowDown class="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
					Desc
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem @click="column.toggleVisibility(false)">
					<EyeOff class="text-muted-foreground/70 mr-2 h-3.5 w-3.5" />
					Hide
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	</div>

	<div
		v-else
		:class="cn('text-foreground', props.class)"
	>
		{{ title }}
	</div>
</template>
