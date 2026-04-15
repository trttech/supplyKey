<script setup lang="ts">
import { LoaderCircle, LogIn, Zap } from "@lucide/vue"
import type { FetchError } from "ofetch"
import defaultLogo from "~/assets/supplykey_logo.png"
import { toast } from "~/components/toast"
import { useBrand } from "~/composables/useBrand"

definePageMeta({
	layout: "empty",
	middleware: ["authenticated"],
})

useHead({
	title: "Sign In",
})

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const demoMode = computed(() => runtimeConfig.public.demoMode)

const { brand, refresh: refreshBrand } = useBrand()
if (!brand.value)
	await refreshBrand()
const logoSrc = computed(() => brand.value?.logoDataUrl || defaultLogo)
const orgTagline = computed(() => brand.value?.tagline ?? "Mine Supply Company")

const email = ref("")
const isLoading = ref(false)
const isDemoLoading = ref(false)
const success = ref(false)
const debugMagicLink = ref("")
const debugMagicLinkPath = computed(() => debugMagicLink.value.replace(/^https?:\/\/[^/]+/, ""))
const redirectTarget = computed(() => {
	const value = route.query.redirect
	return typeof value === "string" && value.startsWith("/") ? value : undefined
})

async function handleMagicLink() {
	if (!email.value.trim()) {
		toast.error("Corporate email is required.")
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
		toast.success("Authentication link dispatched.")
	}
	catch (error) {
		const fetchError = error as FetchError<{ message?: string }>
		toast.error(fetchError.data?.message || "Unable to dispatch authentication link.")
	}
	finally {
		isLoading.value = false
	}
}

async function handleDemoLogin() {
	isDemoLoading.value = true
	try {
		await $fetch("/api/auth/demo-login", { method: "POST" })
		toast.success("Demo session established.")
		await navigateTo(redirectTarget.value || "/dashboard")
	}
	catch (error) {
		const fetchError = error as FetchError<{ message?: string }>
		toast.error(fetchError.data?.message || "Unable to establish demo session.")
	}
	finally {
		isDemoLoading.value = false
	}
}

function resetState() {
	success.value = false
	debugMagicLink.value = ""
}
</script>

<template>
	<div class="relative flex min-h-screen flex-col overflow-hidden bg-background">
		<div
			aria-hidden="true"
			class="pointer-events-none absolute inset-0 opacity-[0.12]"
			style="background-image: radial-gradient(circle at 20% 20%, rgba(0, 63, 99, 0.35), transparent 50%), radial-gradient(circle at 80% 10%, rgba(80, 96, 112, 0.25), transparent 50%), linear-gradient(180deg, rgba(0, 20, 35, 0.08), transparent 60%);"
		/>

		<main class="relative flex flex-grow items-center justify-center p-6">
			<div class="w-full max-w-md">
				<div class="mb-10 flex flex-col items-center justify-center text-center">
					<img
						:src="logoSrc"
						alt="Brand logo"
						class="mx-auto mb-5 h-20 w-auto"
					>
					<p class="text-[0.6875rem] font-semibold tracking-[0.28em] text-muted-foreground uppercase">
						{{ orgTagline }}
					</p>
				</div>

				<div class="relative rounded-[0.5rem] border border-border/40 bg-card p-10">
					<div v-if="success" class="space-y-6">
						<div class="rounded-[0.5rem] bg-muted p-5">
							<p
								class="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase"
								style="font-family: var(--font-display);"
							>
								Authentication dispatched
							</p>
							<p class="mt-3 text-sm text-foreground">
								A sign-in link was generated for <span class="font-semibold">{{ email }}</span>.
							</p>
							<p class="mt-2 text-xs text-muted-foreground">
								Check the server console or Mailpit.
							</p>
						</div>

						<div v-if="debugMagicLink" class="space-y-3 rounded-[0.5rem] border border-primary/20 bg-primary/5 p-5">
							<p class="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
								Development shortcut
							</p>
							<p class="text-xs break-all text-foreground/80">
								{{ debugMagicLink }}
							</p>
							<div class="flex gap-3 pt-2">
								<NuxtLink
									:to="debugMagicLinkPath"
									class="inline-flex items-center justify-center rounded-[0.375rem] bg-primary px-4 py-2 text-xs font-bold tracking-[0.15em] text-primary-foreground uppercase transition-all hover:brightness-110"
								>
									Open link
								</NuxtLink>
								<button
									type="button"
									class="inline-flex items-center justify-center rounded-[0.375rem] border border-border px-4 py-2 text-xs font-bold tracking-[0.15em] text-foreground uppercase transition-all hover:bg-muted"
									@click="resetState"
								>
									Send another
								</button>
							</div>
						</div>
					</div>

					<form
						v-else
						class="space-y-8"
						@submit.prevent="handleMagicLink"
					>
						<div class="mb-2">
							<h2
								class="text-xl font-bold tracking-tight text-foreground"
								style="font-family: var(--font-display);"
							>
								Access Control
							</h2>
							<p class="mt-1 text-sm text-muted-foreground">
								Authenticated personnel only.
							</p>
						</div>

						<div class="space-y-2">
							<label
								for="email"
								class="text-[0.6875rem] font-bold tracking-[0.16em] text-muted-foreground uppercase"
							>
								Corporate Email
							</label>
							<div class="relative">
								<input
									id="email"
									v-model="email"
									type="email"
									placeholder="name@supplykey.com"
									autocomplete="email"
									:disabled="isLoading"
									class="w-full border-0 border-b-2 border-border/60 bg-muted px-3 py-3 text-sm text-foreground transition-all placeholder:font-light placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none disabled:opacity-60"
								>
							</div>
						</div>

						<div>
							<button
								type="submit"
								class="group flex w-full items-center justify-center rounded-[0.375rem] bg-primary px-4 py-4 text-sm font-extrabold tracking-[0.15em] text-primary-foreground uppercase transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
								:disabled="isLoading"
								style="font-family: var(--font-display);"
							>
								<LoaderCircle v-if="isLoading" class="mr-2 size-4 animate-spin" />
								<LogIn v-else class="mr-2 size-4 transition-transform group-hover:translate-x-0.5" />
								<span>{{ isLoading ? "Dispatching..." : "Initialize Authentication" }}</span>
							</button>
						</div>
					</form>

					<div
						v-if="demoMode && !success"
						class="mt-8 border-t border-border/40 pt-8"
					>
						<p class="mb-4 text-center text-[0.6875rem] font-bold tracking-[0.16em] text-muted-foreground uppercase">
							Conference Demo Mode
						</p>
						<button
							type="button"
							class="group flex w-full items-center justify-center rounded-[0.375rem] border-2 border-primary/30 bg-background px-4 py-3 text-sm font-extrabold tracking-[0.15em] text-primary uppercase transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
							:disabled="isDemoLoading"
							style="font-family: var(--font-display);"
							@click="handleDemoLogin"
						>
							<LoaderCircle v-if="isDemoLoading" class="mr-2 size-4 animate-spin" />
							<Zap v-else class="mr-2 size-4" />
							<span>{{ isDemoLoading ? "Connecting..." : "Demo Sign In" }}</span>
						</button>
					</div>

					<div class="mt-10 border-t border-border/40 pt-8 text-center">
						<p class="text-[0.6875rem] leading-relaxed tracking-[0.18em] text-muted-foreground uppercase">
							Issues with login? <br> Contact <span class="font-bold text-foreground">Systems Security</span>
						</p>
					</div>
				</div>

				<p class="mt-8 text-center text-[0.625rem] font-medium tracking-[0.25em] text-muted-foreground/60 uppercase">
					Unauthorized access is strictly monitored and recorded.
				</p>
			</div>
		</main>

		<footer class="relative w-full border-t border-border/20 bg-muted/40 py-6">
			<div class="flex flex-col items-center justify-between gap-3 px-6 md:flex-row md:px-12">
				<div class="flex items-center gap-2 leading-none">
					<span class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase leading-none">
						Powered by
					</span>
					<img
						:src="defaultLogo"
						alt="SupplyKey"
						class="block h-3.5 w-auto"
					>
				</div>
				<div class="flex flex-wrap justify-center gap-6">
					<a href="#" class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-primary">Privacy Policy</a>
					<a href="#" class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-primary">Terms of Service</a>
					<a href="#" class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-primary">Compliance</a>
					<a href="#" class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-primary">Mining Standards</a>
				</div>
			</div>
		</footer>
	</div>
</template>
