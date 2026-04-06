<script setup lang="ts">
import { Search, X } from "@lucide/vue"
import { onBeforeUnmount, ref, watch } from "vue"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const props = withDefaults(
	defineProps<{
		modelValue?: string
		placeholder?: string
		debounceMs?: number
		minChars?: number
		inputClass?: string
	}>(),
	{
		modelValue: "",
		placeholder: "Search...",
		debounceMs: 350,
		minChars: 3,
		inputClass: "h-10 w-full min-w-64 md:w-80 xl:w-96",
	},
)

const emit = defineEmits<{
	"update:modelValue": [value: string]
}>()

const localValue = ref(props.modelValue)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

const clearTimer = () => {
	if (!debounceTimer) return
	clearTimeout(debounceTimer)
	debounceTimer = null
}

const emitSearch = (rawValue: string) => {
	const normalized = rawValue.trim()

	// Allow immediate clear to remove applied filters.
	if (!normalized.length) {
		emit("update:modelValue", "")
		return
	}

	// Guard until minimum search length is reached.
	if (normalized.length < props.minChars) {
		if ((props.modelValue || "").trim().length) {
			emit("update:modelValue", "")
		}
		return
	}

	emit("update:modelValue", normalized)
}

const queueSearch = (value: string) => {
	clearTimer()
	debounceTimer = setTimeout(() => {
		emitSearch(value)
	}, props.debounceMs)
}

function onInput(value: string | number) {
	localValue.value = String(value || "")
	queueSearch(localValue.value)
}

function onEnter() {
	clearTimer()
	emitSearch(localValue.value)
}

function clearSearch() {
	clearTimer()
	localValue.value = ""
	emit("update:modelValue", "")
}

watch(
	() => props.modelValue,
	(nextValue) => {
		localValue.value = nextValue || ""
	},
)

onBeforeUnmount(() => {
	clearTimer()
})
</script>

<template>
	<div class="relative">
		<Search class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />

		<Input
			:model-value="localValue"
			:placeholder="props.placeholder"
			:class="`${props.inputClass} pl-9 pr-10`"
			@update:model-value="(value) => onInput(value ?? '')"
			@keydown.enter.prevent="onEnter"
		/>

		<Button
			v-if="localValue.length > 0"
			variant="ghost"
			size="icon-sm"
			class="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 size-8 -translate-y-1/2 rounded-lg"
			@click="clearSearch"
		>
			<X class="size-3.5" />

			<span class="sr-only">Clear search</span>
		</Button>
	</div>
</template>
