<script setup lang="ts" generic="TData">
import { Check, ListFilter } from "@lucide/vue"
import type { Column } from "@tanstack/vue-table"
import type { Component } from "vue"
import { computed } from "vue"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "~/utils"

interface DataTableFacetedFilterProps {
	column?: Column<TData, unknown>
	title?: string
	modelValue?: string[]
	single?: boolean
	options: {
		label: string
		value: string
		icon?: Component
	}[]
}

const props = defineProps<DataTableFacetedFilterProps>()
const emit = defineEmits<{
	"update:modelValue": [values: string[]]
}>()

const facets = computed(() => props.column?.getFacetedUniqueValues())
const isControlled = computed(() => props.modelValue !== undefined)
const selectedValues = computed(
	() =>
		new Set(
			props.modelValue
			?? (props.column?.getFilterValue() as string[] | undefined),
		),
)

function applyFilter(values: string[]) {
	if (!isControlled.value) {
		props.column?.setFilterValue(values.length ? values : undefined)
	}
	emit("update:modelValue", values)
}
</script>

<template>
	<Popover>
		<PopoverTrigger as-child>
			<Button
				variant="outline"
				class="border-border/70 bg-card/75 h-10 rounded-xl px-3.5"
			>
				<ListFilter class="mr-2 h-4 w-4" />
				{{ title }}

				<template v-if="selectedValues.size > 0">
					<Separator
						orientation="vertical"
						class="mx-2 h-4"
					/>

					<Badge
						variant="secondary"
						class="rounded-full px-2 py-0.5 text-[0.72rem] font-medium lg:hidden"
					>
						{{ selectedValues.size }}
					</Badge>

					<div class="hidden gap-1 lg:flex">
						<Badge
							v-if="selectedValues.size > 2"
							variant="secondary"
							class="rounded-full px-2 py-0.5 text-[0.72rem] font-medium"
						>
							{{ selectedValues.size }} selected
						</Badge>

						<template v-else>
							<Badge
								v-for="item in options.filter((option) => selectedValues.has(option.value))"
								:key="item.value"
								variant="secondary"
								class="rounded-full px-2 py-0.5 text-[0.72rem] font-medium"
							>
								{{ item.label }}
							</Badge>
						</template>
					</div>
				</template>
			</Button>
		</PopoverTrigger>

		<PopoverContent
			class="w-60 p-0"
			align="start"
		>
			<Command :filter-function="(list: any, term: string) => list.filter((i: any) => i.label.toLowerCase()?.includes(term.toLowerCase()))">
				<CommandInput
					:placeholder="`Search ${title?.toLowerCase() || 'options'}`"
					class="border-0 focus:ring-0 focus:ring-offset-0"
				/>

				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>

					<CommandGroup>
						<CommandItem
							v-for="option in options"
							:key="option.value"
							:value="option"
							@select="() => {
								if (props.single) {
									const isSelected = selectedValues.has(option.value)
									applyFilter(isSelected ? [] : [option.value])
									return
								}

								const nextValues = new Set(selectedValues)
								if (nextValues.has(option.value)) nextValues.delete(option.value)
								else nextValues.add(option.value)
								applyFilter(Array.from(nextValues))
							}"
						>
							<div
								:class="cn(
									'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
									selectedValues.has(option.value)
										? 'bg-primary text-primary-foreground'
										: 'opacity-50 [&_svg]:invisible',
								)"
							>
								<Check :class="cn('h-4 w-4')" />
							</div>

							<component
								:is="option.icon"
								v-if="option.icon"
								class="text-muted-foreground mr-2 h-4 w-4"
							/>

							<span>{{ option.label }}</span>

							<span
								v-if="facets?.get(option.value)"
								class="text-muted-foreground bg-muted ml-auto inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-[0.68rem] font-medium"
							>
								{{ facets.get(option.value) }}
							</span>
						</CommandItem>
					</CommandGroup>

					<template v-if="selectedValues.size > 0">
						<CommandSeparator />

						<CommandGroup>
							<CommandItem
								:value="{ label: 'Clear filters' }"
								class="justify-center rounded-lg text-center font-medium"
								@select="applyFilter([])"
							>
								Clear filters
							</CommandItem>
						</CommandGroup>
					</template>
				</CommandList>
			</Command>
		</PopoverContent>
	</Popover>
</template>
