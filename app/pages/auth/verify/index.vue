<script setup lang="ts">
import { CheckCircle2, LoaderCircle, XCircle } from "lucide-vue-next"
import type { FetchError } from "ofetch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

definePageMeta({
	layout: "empty",
	middleware: ["authenticated"],
})

useHead({
	title: "Verify Link",
})

const route = useRoute()
const redirectTo = computed(() => {
	const value = route.query.redirect
	return typeof value === "string" && value.startsWith("/") ? value : "/dashboard"
})
const retryLoginHref = computed(() => {
	const params = new URLSearchParams()
	if (redirectTo.value !== "/dashboard") {
		params.set("redirect", redirectTo.value)
	}

	return params.size ? `/auth/login?${params.toString()}` : "/auth/login"
})

const token = computed(() => {
	const value = route.query.token
	return typeof value === "string" ? value : ""
})

const pending = ref(true)
const success = ref(false)
const errorMessage = ref("The magic link is invalid or has expired.")

onMounted(async () => {
	if (!token.value) {
		errorMessage.value = "Missing token."
		pending.value = false
		return
	}

	try {
		await $fetch<{ success: boolean }>("/api/auth/verify", {
			method: "POST",
			body: {
				token: token.value,
			},
		})

		success.value = true
		await navigateTo(redirectTo.value)
	}
	catch (error) {
		const fetchError = error as FetchError<{ message?: string }>
		errorMessage.value = fetchError.data?.message || fetchError.message || errorMessage.value
	}
	finally {
		pending.value = false
	}
})
</script>

<template>
	<div class="mx-auto flex min-h-screen max-w-xl items-center px-6 py-10">
		<Card class="surface-panel surface-outline w-full rounded-[2rem] border">
			<CardHeader class="text-center">
				<CardTitle class="text-3xl tracking-[-0.04em]">
					{{
						pending
							? "Verifying..."
							: success
								? "Signed in"
								: "Verification failed"
					}}
				</CardTitle>

				<CardDescription>
					{{
						pending
							? "Validating your magic link and creating a session."
							: success
								? "Redirecting into the starter dashboard."
								: "This sign-in link could not be used."
					}}
				</CardDescription>
			</CardHeader>

			<CardContent class="flex flex-col items-center gap-4 text-center">
				<LoaderCircle
					v-if="pending"
					class="text-primary size-10 animate-spin"
				/>

				<div
					v-else-if="success"
					class="flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600"
				>
					<CheckCircle2 class="size-9" />
				</div>

				<div
					v-else
					class="flex size-16 items-center justify-center rounded-full bg-red-500/10 text-red-600"
				>
					<XCircle class="size-9" />
				</div>

				<p
					v-if="!pending && !success"
					class="text-muted-foreground text-sm leading-7"
				>
					{{ errorMessage }}
				</p>
			</CardContent>

			<CardFooter v-if="!pending && !success">
				<Button
					as-child
					class="w-full rounded-xl"
				>
					<NuxtLink :to="retryLoginHref">
						Request a new link
					</NuxtLink>
				</Button>
			</CardFooter>
		</Card>
	</div>
</template>
