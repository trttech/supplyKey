<script setup lang="ts">
import { cn } from "@/utils"
import type { HTMLAttributes } from "vue"

const props = defineProps<{
	class?: HTMLAttributes["class"]
}>()
</script>

<template>
	<div
		data-slot="card"
		:class="
			cn(
				'surface-panel surface-outline bg-card/90 text-card-foreground flex flex-col gap-6 rounded-[1.4rem] border py-6 backdrop-blur-sm',
				props.class,
			)
		"
	>
		<slot />
	</div>
</template>
