import { ref, readonly } from "vue"

export type ToastType = "info" | "success" | "warn" | "error"

export type ToastPosition = "top" | "top-left" | "top-right" | "bottom" | "bottom-left" | "bottom-right"

export interface ToastOption {
	position?: ToastPosition
	timeout?: number
	persistent?: boolean // Toast won't auto-dismiss
	allowDuplicates?: boolean // Allow multiple toasts with same message
}

export interface Toast {
	id: number
	message: string
	type: ToastType
	position: ToastPosition
	timeout: number
	persistent: boolean
	timestamp: number
}

// Default configuration
const DEFAULT_CONFIG = {
	position: "bottom-right" as ToastPosition,
	timeout: 5000,
	persistent: false,
	allowDuplicates: true,
}

function initToast() {
	const toasts = ref<Toast[]>([])
	let id = 0

	const showToast = (
		message: string,
		type: ToastType,
		opts?: ToastOption,
	) => {
		const config = { ...DEFAULT_CONFIG, ...opts }

		// Check for duplicates if not allowed
		if (!config.allowDuplicates) {
			const existing = toasts.value.find(
				t => t.message === message && t.type === type,
			)
			if (existing) {
				return existing.id
			}
		}

		const toastId = id++
		const newToast: Toast = {
			id: toastId,
			message,
			type,
			position: config.position,
			timeout: config.timeout,
			persistent: config.persistent,
			timestamp: Date.now(),
		}

		toasts.value.push(newToast)

		// Limit number of toasts to prevent overwhelming the user
		if (toasts.value.length > 5) {
			toasts.value.shift()
		}

		return toastId
	}

	const removeToast = (toastId: number) => {
		toasts.value = toasts.value.filter(t => t.id !== toastId)
	}

	const clearAll = () => {
		toasts.value = []
	}

	const clearByType = (type: ToastType) => {
		toasts.value = toasts.value.filter(t => t.type !== type)
	}

	// Toast type helpers with improved defaults
	return {
		toasts: readonly(toasts),
		removeToast,
		clearAll,
		clearByType,
		info: (message: string, opts?: ToastOption) =>
			showToast(message, "info", opts),
		success: (message: string, opts?: ToastOption) =>
			showToast(message, "success", { timeout: 4000, ...opts }),
		warn: (message: string, opts?: ToastOption) =>
			showToast(message, "warn", { timeout: 6000, ...opts }),
		error: (message: string, opts?: ToastOption) =>
			showToast(message, "error", {
				timeout: 8000,
				allowDuplicates: false,
				...opts,
			}),
	}
}

// Create a global instance
export const toast = initToast()
