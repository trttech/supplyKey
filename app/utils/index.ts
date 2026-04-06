import { type ClassValue, clsx } from "clsx"
import type { Updater } from "@tanstack/vue-table"
import { twMerge } from "tailwind-merge"
import type { Ref } from "vue"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<unknown>>(updaterOrValue: T, ref: Ref) {
	ref.value = typeof updaterOrValue === "function"
		? updaterOrValue(ref.value)
		: updaterOrValue
}

const humanizeDate = Intl.DateTimeFormat("en-CA", {
	year: "numeric",
	month: "short",
	day: "numeric",
})

const humanizeDateTime = Intl.DateTimeFormat("en-CA", {
	year: "numeric",
	month: "short",
	day: "numeric",
	hour: "numeric",
	minute: "2-digit",
})

export function formatDate(date: Date | string | null | undefined) {
	if (!date) {
		return "Never"
	}

	return humanizeDate.format(new Date(date))
}

export function formatDateTime(date: Date | string | null | undefined) {
	if (!date) {
		return "Never"
	}

	return humanizeDateTime.format(new Date(date))
}

