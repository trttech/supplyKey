<script setup lang="ts">
import { computed } from "vue"
import ToastAlert from "./ToastAlert.vue"
import { toast as toastSvc } from "."
import type { ToastPosition } from "."

const { toasts, removeToast } = toastSvc

const groupedToasts = computed(() => {
	const groups: Record<string, typeof toasts.value> = {}
	toasts.value.forEach((toast) => {
		const key = toast.position || "top"
		groups[key] = groups[key] || []
		groups[key] = [...groups[key], toast]
	})
	return groups
})

const positionClasses: Record<ToastPosition, string> = {
	"top": "top-4 left-1/2 -translate-x-1/2",
	"top-left": "top-4 left-4",
	"top-right": "top-4 right-4",
	"bottom": "bottom-4 left-1/2 -translate-x-1/2",
	"bottom-left": "bottom-4 left-4",
	"bottom-right": "bottom-4 right-4",
}
</script>

<template>
	<template
		v-for="(group, position) in groupedToasts"
		:key="position"
	>
		<div
			:class="[
				'pointer-events-none fixed z-50 flex max-w-sm flex-col gap-2',
				positionClasses[position as ToastPosition],
			]"
			role="region"
			:aria-label="`Toast notifications - ${position}`"
			aria-live="polite"
		>
			<TransitionGroup
				move-class="transition ease duration-300"
				enter-active-class="transition ease duration-300"
				leave-active-class="absolute transition ease duration-300"
				enter-from-class="translate-y-20 opacity-0 scale-95"
				leave-to-class="translate-y-20 opacity-0 scale-95"
				enter-to-class="translate-y-0 opacity-100 scale-100"
				leave-from-class="translate-y-0 opacity-100 scale-100"
			>
				<div
					v-for="toast in group"
					:key="toast.id"
					class="pointer-events-auto"
				>
					<ToastAlert
						:toast="toast"
						@close="removeToast(toast.id)"
					/>
				</div>
			</TransitionGroup>
		</div>
	</template>
</template>
