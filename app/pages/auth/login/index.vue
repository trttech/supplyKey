<script setup lang="ts">
import { LoaderCircle, Mail } from "@lucide/vue"
import type { FetchError } from "ofetch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "~/components/toast"

definePageMeta({
	layout: "empty",
	middleware: ["authenticated"],
})

useHead({
	title: "Sign In",
})

const route = useRoute()

const email = ref("")
const isLoading = ref(false)
const success = ref(false)
const debugMagicLink = ref("")
const debugMagicLinkPath = computed(() => debugMagicLink.value.replace(/^https?:\/\/[^/]+/, ""))
const redirectTarget = computed(() => {
	const value = route.query.redirect
	return typeof value === "string" && value.startsWith("/") ? value : undefined
})

async function handleMagicLink() {
	if (!email.value.trim()) {
		toast.error("Enter an email address.")
		return
	}

	isLoading.value = true
	debugMagicLink.value = ""

	try {
		const response = await $fetch<{
			success: boolean
			debug_magic_link?: string
		}>("/api/auth/link", {
			method: "POST",
			body: {
				email: email.value,
				redirect: redirectTarget.value,
			},
		})

		success.value = response.success
		debugMagicLink.value = response.debug_magic_link || ""
		toast.success("Magic link queued.")
	}
	catch (error) {
		const fetchError = error as FetchError<{ message?: string }>
		toast.error(fetchError.data?.message || "Unable to send magic link.")
	}
	finally {
		isLoading.value = false
	}
}

function resetState() {
	success.value = false
	debugMagicLink.value = ""
}
</script>

<template>
	<div class="mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-6 py-10 md:px-10 lg:grid-cols-[0.9fr_1.1fr]">
		<div class="hidden min-h-[34rem] rounded-[2rem] border border-white/20 bg-[linear-gradient(145deg,rgba(24,20,14,0.92),rgba(38,27,10,0.82)),radial-gradient(circle_at_top,rgba(201,141,52,0.32),transparent_55%)] p-10 text-white shadow-[0_40px_120px_-56px_rgba(0,0,0,0.7)] lg:flex lg:flex-col lg:justify-between">
			<div class="space-y-4">
				<p class="text-sm font-semibold tracking-[0.18em] text-white/70 uppercase">
					Auth Baseline
				</p>

				<h1 class="max-w-md text-4xl font-semibold tracking-[-0.06em]">
					Minimal login flow, ready for product-specific policy later.
				</h1>
			</div>

			<div class="space-y-4 text-sm leading-7 text-white/72">
				<p>The first user created becomes `admin` automatically.</p>

				<p>In development with `MAIL_MODE=console`, the sign-in link is returned here and logged server-side.</p>

				<p>Switch to SMTP or Mailpit without changing the app flow.</p>
			</div>
		</div>

		<div class="mx-auto w-full max-w-xl">
			<Card class="surface-panel surface-outline rounded-[2rem] border">
				<CardHeader class="space-y-3">
					<CardTitle class="text-3xl tracking-[-0.04em]">
						Sign in
					</CardTitle>

					<CardDescription class="text-base leading-7">
						Request a magic link and land in the protected starter dashboard.
					</CardDescription>
				</CardHeader>

				<CardContent class="space-y-6">
					<div
						v-if="success"
						class="space-y-4"
					>
						<div class="rounded-[1.25rem] border border-emerald-500/20 bg-emerald-500/8 p-4">
							<p class="text-sm font-medium">
								A sign-in link was generated for <span class="font-semibold">{{ email }}</span>.
							</p>

							<p class="text-muted-foreground mt-2 text-sm">
								Check the server log or Mailpit.
							</p>
						</div>

						<div
							v-if="debugMagicLink"
							class="rounded-[1.25rem] border border-amber-500/20 bg-amber-500/8 p-4"
						>
							<p class="text-xs font-semibold tracking-[0.16em] uppercase">
								Development shortcut
							</p>

							<p class="mt-2 text-sm break-all">
								{{ debugMagicLink }}
							</p>

							<div class="mt-4 flex flex-wrap gap-3">
								<Button
									as-child
									class="rounded-xl"
								>
									<NuxtLink :to="debugMagicLinkPath">
										Open link
									</NuxtLink>
								</Button>

								<Button
									variant="outline"
									class="rounded-xl"
									@click="resetState"
								>
									Send another
								</Button>
							</div>
						</div>
					</div>

					<form
						v-else
						class="space-y-4"
						@submit.prevent="handleMagicLink"
					>
						<div class="space-y-2">
							<label
								for="email"
								class="text-sm font-medium"
							>
								Email address
							</label>

							<Input
								id="email"
								v-model="email"
								type="email"
								placeholder="name@example.com"
								autocomplete="email"
								:disabled="isLoading"
							/>
						</div>

						<Button
							type="submit"
							class="h-11 w-full rounded-xl"
							:disabled="isLoading"
						>
							<LoaderCircle
								v-if="isLoading"
								class="mr-2 size-4 animate-spin"
							/>

							<Mail
								v-else
								class="mr-2 size-4"
							/>
							{{ isLoading ? "Sending..." : "Send magic link" }}
						</Button>
					</form>

					<p
						v-if="route.query.redirect"
						class="text-muted-foreground text-sm"
					>
						After sign-in, you will be returned to {{ route.query.redirect }}.
					</p>
				</CardContent>
			</Card>
		</div>
	</div>
</template>
