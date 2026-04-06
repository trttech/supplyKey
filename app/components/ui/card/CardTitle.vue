<script setup lang="ts">
import { cn } from "@/utils"
import type { HTMLAttributes } from "vue"

const props = defineProps<{
	class?: HTMLAttributes["class"]
}>()
</script>

<template>
	<h3
		data-slot="card-title"
		:class="cn('text-base leading-none font-semibold tracking-[-0.02em]', props.class)"
	>
		<slot />
	</h3>
</template>
