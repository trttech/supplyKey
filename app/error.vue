<script setup lang="ts">
import type { NuxtError } from "#app"
import { clearError } from "#app/composables/error"
import { log } from "#shared/log"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const props = defineProps<{ error: NuxtError }>()

log.error({ error: props.error }, "Error Page")

useHead({
	title: "Error",
	meta: [{ name: "description", content: "Some Error Occured" }],
})

const handleError = () => clearError({ redirect: "/" })
</script>

<template>
	<div class="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center">
		<Card class="w-full">
			<CardHeader>
				<h1 class="text-primary text-center text-3xl font-bold">
					An Error Occured
				</h1>
			</CardHeader>

			<CardContent class="flex flex-col gap-y-7 text-center">
				<p class="text-7xl font-bold">
					{{ error?.statusCode }}
				</p>

				<p>{{ error?.message }}</p>

				<Button
					variant="default"
					type="button"
					class="w-full rounded-full"
					@click="handleError"
				>
					Return Home...
				</Button>
			</CardContent>
		</Card>
	</div>
</template>
