<script setup lang="ts">
import { parseDate as parseCalendarDate } from "@internationalized/date"
import { CalendarIcon } from "@lucide/vue"
import type { DateRange } from "reka-ui"
import { Button } from "@/components/ui/button"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { RangeCalendar } from "@/components/ui/range-calendar"
import type {
	DateRangeValue,
	FilterConfig,
} from "~/components/datatable/types"
import { cn, formatDate } from "~/utils"

interface DateRangeFilterProps {
	config: FilterConfig
	startDate?: string
	endDate?: string
	// eslint-disable-next-line no-unused-vars
	onValueChange(value: DateRangeValue): void
}

const props = defineProps<DateRangeFilterProps>()

const open = ref(false)
const dateRange = ref<{ start?: unknown, end?: unknown }>({
	start: undefined,
	end: undefined,
})

// Initialize date range from props when popover opens and keep it in sync
watch(open, (isOpen) => {
	if (isOpen) {
		if (props.startDate || props.endDate) {
			dateRange.value = {
				start: props.startDate ? parseDate(props.startDate) : undefined,
				end: props.endDate ? parseDate(props.endDate) : undefined,
			}
		}
		else {
			dateRange.value = {
				start: undefined,
				end: undefined,
			}
		}
	}
})

// Also refresh the local date range if the external props change while popover is open
watch(
	() => [props.startDate, props.endDate],
	([start, end]) => {
		if (open.value) {
			if (start || end) {
				dateRange.value = {
					start: start ? parseDate(start) : undefined,
					end: end ? parseDate(end) : undefined,
				}
			}
			else {
				dateRange.value = {
					start: undefined,
					end: undefined,
				}
			}
		}
	},
)

function parseDate(dateString: string): unknown {
	try {
		return parseCalendarDate(dateString)
	}
	catch {
		return undefined
	}
}

function formatDateValue(dateValue: unknown): string | undefined {
	if (!dateValue) {
		return undefined
	}

	if (
		typeof dateValue === "object"
		&& "toString" in dateValue
		&& typeof dateValue.toString === "function"
	) {
		return dateValue.toString()
	}

	return undefined
}

function handleCalendarUpdate(value: DateRange) {
	dateRange.value = {
		start: value.start,
		end: value.end,
	}
}

const handleApply = () => {
	props.onValueChange({
		start: formatDateValue(dateRange.value.start),
		end: formatDateValue(dateRange.value.end),
	})
	open.value = false
}

const handleClear = () => {
	dateRange.value = {
		start: undefined,
		end: undefined,
	}
	props.onValueChange({ start: undefined, end: undefined })
	open.value = false
}

const displayText = computed(() => {
	if (props.startDate && props.endDate) {
		return `${formatDate(props.startDate)} - ${formatDate(props.endDate)}`
	}
	if (props.startDate) {
		return `From ${formatDate(props.startDate)}`
	}
	if (props.endDate) {
		return `Until ${formatDate(props.endDate)}`
	}
	return props.config.placeholder || "Select date range"
})

const hasValue = computed(() => Boolean(props.startDate || props.endDate))
</script>

<template>
	<Popover v-model:open="open">
		<PopoverTrigger as-child>
			<Button
				variant="outline"
				:class="cn(
					'h-10 justify-start rounded-xl border-border/70 bg-card/75 px-3.5 text-left font-normal',
					hasValue && 'border-solid',
				)"
			>
				<CalendarIcon class="mr-2 h-4 w-4" />

				<span>{{ displayText }}</span>
			</Button>
		</PopoverTrigger>

		<PopoverContent
			class="w-auto p-0"
			align="start"
		>
			<div class="space-y-4 p-4">
				<RangeCalendar
					:key="`${props.startDate || ''}-${props.endDate || ''}`"
					:model-value="dateRange as unknown as DateRange"
					:number-of-months="2"
					initial-focus
					@update:model-value="handleCalendarUpdate"
				/>

				<div class="flex justify-between gap-2">
					<Button
						variant="outline"
						class="h-9 flex-1 rounded-xl"
						@click="handleClear"
					>
						Clear
					</Button>

					<Button
						class="h-9 flex-1 rounded-xl"
						@click="handleApply"
					>
						Apply
					</Button>
				</div>
			</div>
		</PopoverContent>
	</Popover>
</template>
