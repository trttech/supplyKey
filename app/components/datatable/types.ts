export interface FilterOption {
	value: string
	label: string
}

export interface FilterConfig {
	key: string
	label: string
	type: "select" | "multiSelect" | "search" | "dateRange"
	options?: FilterOption[]
	placeholder?: string
}

export interface DateRangeValue {
	start?: string
	end?: string
}
