<script setup lang="ts">
import {
	Ban,
	CircleCheck,
	Info,
	TriangleAlert,
	X,
} from "@lucide/vue"
import type { Component } from "vue"
import type { Toast, ToastType } from "."

const props = defineProps<{ toast: Toast }>()

const emit = defineEmits<{ close: [] }>()

// Timer & progress variables
let timeoutId: ReturnType<typeof setTimeout> | null = null
let rafId: number
const progress = ref(100)
let accumulatedTime = 0
let startTime = 0

// Refs for accessibility
const toastRef = useTemplateRef<HTMLDivElement>("toastRef")

// Generate unique IDs for accessibility
const titleId = computed(() => `toast-title-${props.toast.id}`)
const messageId = computed(() => `toast-message-${props.toast.id}`)

const typeClasses: Record<ToastType, string> = {
	info: "bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
	success: "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200",
	warn: "bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
	error: "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200",
}

const focusClasses: Record<ToastType, string> = {
	info: "focus:ring-blue-500 dark:focus:ring-blue-400",
	success: "focus:ring-green-500 dark:focus:ring-green-400",
	warn: "focus:ring-yellow-500 dark:focus:ring-yellow-400",
	error: "focus:ring-red-500 dark:focus:ring-red-400",
}

const iconClasses: Record<ToastType, string> = {
	info: "text-blue-500 dark:text-blue-400",
	success: "text-green-500 dark:text-green-400",
	warn: "text-yellow-500 dark:text-yellow-400",
	error: "text-red-600 dark:text-red-400",
}

const closeButtonClasses: Record<ToastType, string> = {
	info: "text-blue-400 hover:text-blue-600 focus:ring-blue-500 dark:text-blue-500 dark:hover:text-blue-300 dark:focus:ring-blue-400",
	success: "text-green-400 hover:text-green-600 focus:ring-green-500 dark:text-green-500 dark:hover:text-green-300 dark:focus:ring-green-400",
	warn: "text-yellow-400 hover:text-yellow-600 focus:ring-yellow-500 dark:text-yellow-500 dark:hover:text-yellow-300 dark:focus:ring-yellow-400",
	error: "text-red-400 hover:text-red-600 focus:ring-red-500 dark:text-red-500 dark:hover:text-red-300 dark:focus:ring-red-400",
}

const typeLabels: Record<ToastType, string> = {
	info: "Information",
	success: "Success",
	warn: "Warning",
	error: "Error",
}

const icons: Record<ToastType, Component> = {
	info: Info,
	success: CircleCheck,
	error: Ban,
	warn: TriangleAlert,
}

function updateProgress(timestamp: number) {
	const delta = timestamp - startTime
	const totalElapsed = accumulatedTime + delta
	// Calculate progress based on the total elapsed time relative to the timeout
	progress.value = Math.max(
		100 - (totalElapsed / props.toast.timeout) * 100,
		0,
	)
	if (totalElapsed < props.toast.timeout) {
		rafId = requestAnimationFrame(updateProgress)
	}
}

function startTimer() {
	startTime = performance.now()
	accumulatedTime = 0
	progress.value = 100
	timeoutId = setTimeout(() => emit("close"), props.toast.timeout)
	rafId = requestAnimationFrame(updateProgress)
}

function pauseTimer() {
	if (timeoutId) {
		clearTimeout(timeoutId)
		timeoutId = null
	}
	cancelAnimationFrame(rafId)
	accumulatedTime += performance.now() - startTime
}
function resumeTimer() {
	startTime = performance.now()
	timeoutId = setTimeout(
		() => emit("close"),
		props.toast.timeout - accumulatedTime,
	)
	rafId = requestAnimationFrame(updateProgress)
}

function handleClose() {
	pauseTimer()
	emit("close")
}

function handleKeydown(event: KeyboardEvent) {
	// Close toast with Escape key
	if (event.key === "Escape") {
		handleClose()
	}
}
onMounted(() => {
	startTimer()
	// Note: Removed auto-focus for error toasts to prevent unwanted focus border
	// Error toasts already use aria-live="assertive" for screen reader announcements
})

onUnmounted(pauseTimer)
</script>

<template>
	<div
		ref="toastRef"
		role="alert"
		:aria-live="toast.type === 'error' ? 'assertive' : 'polite'"
		:aria-atomic="true"
		:aria-labelledby="titleId"
		:aria-describedby="messageId"
		class="relative mb-2 flex max-w-max min-w-64 items-center gap-3 rounded-md p-4 shadow-lg shadow-gray-400 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:outline-none dark:shadow-gray-900 dark:focus:ring-offset-gray-950"
		:class="[typeClasses[toast.type], focusClasses[toast.type]]"
		tabindex="0"
		@mouseenter="pauseTimer"
		@mouseleave="resumeTimer"
		@touchstart="pauseTimer"
		@touchend="resumeTimer"
		@keydown="handleKeydown"
	>
		<!-- Icon with semantic meaning -->
		<div
			class="shrink-0"
			:aria-hidden="true"
		>
			<component
				:is="icons[toast.type]"
				class="size-6"
				:class="iconClasses[toast.type]"
			/>
		</div>

		<!-- Content -->
		<div class="min-w-0 grow">
			<!-- Hidden title for screen readers -->
			<span
				:id="titleId"
				class="sr-only"
			>
				{{ typeLabels[toast.type] }} notification
			</span>

			<!-- Message -->
			<p
				:id="messageId"
				class="text-sm font-medium wrap-break-word"
			>
				{{ toast.message }}
			</p>
		</div>

		<!-- Close button -->
		<button
			type="button"
			class="ml-2 shrink-0 rounded-md p-1 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:outline-none dark:focus:ring-offset-gray-950"
			:class="closeButtonClasses[toast.type]"
			:aria-label="`Dismiss ${typeLabels[toast.type].toLowerCase()} notification`"
			@click="handleClose"
		>
			<X
				class="h-4 w-4"
				aria-hidden="true"
			/>
		</button>

		<!-- Progress bar -->
		<div
			class="pointer-events-none absolute inset-x-0 bottom-0 h-1 overflow-hidden opacity-75"
			:style="{
				borderBottomLeftRadius: 'inherit',
				borderBottomRightRadius: 'inherit',
			}"
			role="progressbar"
			:aria-valuenow="progress"
			aria-valuemin="0"
			aria-valuemax="100"
			:aria-label="`${Math.round(progress)}% time remaining`"
		>
			<div
				:style="{
					width: progress + '%',
					backgroundColor: 'currentColor',
				}"
				class="h-full transition-all duration-100 ease-linear"
			/>
		</div>
	</div>
</template>
