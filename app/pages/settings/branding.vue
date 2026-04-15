<script setup lang="ts">
import { ArrowLeft, CheckCircle2, LoaderCircle, RotateCcw, Upload } from "@lucide/vue"
import type { FetchError } from "ofetch"
import type { BrandSettings } from "#shared/types/brand"
import { toast } from "~/components/toast"
import { useBrand } from "~/composables/useBrand"

definePageMeta({
	layout: "dashboard",
	middleware: ["authenticated"],
})

useHead({
	title: "Branding",
})

const { brand, refresh, update } = useBrand()
if (!brand.value)
	await refresh()

const defaults: BrandSettings = {
	orgName: "SupplyKey",
	tagline: "Mine Supply Company",
	logoDataUrl: null,
	primaryColor: "#003f63",
	sidebarColor: "#0b1a26",
	accentColor: "#5d3002",
}

const form = reactive<BrandSettings>({
	orgName: brand.value?.orgName ?? defaults.orgName,
	tagline: brand.value?.tagline ?? defaults.tagline,
	logoDataUrl: brand.value?.logoDataUrl ?? null,
	primaryColor: brand.value?.primaryColor ?? defaults.primaryColor,
	sidebarColor: brand.value?.sidebarColor ?? defaults.sidebarColor,
	accentColor: brand.value?.accentColor ?? defaults.accentColor,
})

watch(brand, (next) => {
	if (!next)
		return
	form.orgName = next.orgName
	form.tagline = next.tagline
	form.logoDataUrl = next.logoDataUrl
	form.primaryColor = next.primaryColor
	form.sidebarColor = next.sidebarColor
	form.accentColor = next.accentColor
})

const fileInput = ref<HTMLInputElement | null>(null)
const isSaving = ref(false)

function triggerFilePick() {
	fileInput.value?.click()
}

function onFileSelected(event: Event) {
	const input = event.target as HTMLInputElement
	const file = input.files?.[0]
	if (!file)
		return

	if (file.size > 300_000) {
		toast.error("Logo file must be smaller than 300 KB.")
		input.value = ""
		return
	}

	const reader = new FileReader()
	reader.onload = () => {
		form.logoDataUrl = typeof reader.result === "string" ? reader.result : null
	}
	reader.onerror = () => {
		toast.error("Could not read logo file.")
	}
	reader.readAsDataURL(file)
	input.value = ""
}

function clearLogo() {
	form.logoDataUrl = null
}

function resetForm() {
	Object.assign(form, defaults)
}

async function save() {
	isSaving.value = true
	try {
		await update({
			orgName: form.orgName,
			tagline: form.tagline,
			logoDataUrl: form.logoDataUrl,
			primaryColor: form.primaryColor,
			sidebarColor: form.sidebarColor,
			accentColor: form.accentColor,
		})
		toast.success("Brand updated. Theme propagating…")
	}
	catch (err) {
		const fetchError = err as FetchError<{ message?: string }>
		toast.error(fetchError.data?.message || "Unable to save branding.")
	}
	finally {
		isSaving.value = false
	}
}

const primaryPreview = computed(() => form.primaryColor)
const sidebarPreview = computed(() => form.sidebarColor)
const accentPreview = computed(() => form.accentColor)
</script>

<template>
	<div class="space-y-8">
		<NuxtLink
			to="/dashboard"
			class="inline-flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.16em] text-muted-foreground uppercase transition-colors hover:text-primary"
		>
			<ArrowLeft class="size-3.5" />
			Back to Dashboard
		</NuxtLink>

		<section class="space-y-2">
			<p class="text-[0.68rem] font-bold tracking-[0.24em] text-muted-foreground uppercase">
				Platform Settings
			</p>
			<h1
				class="text-5xl font-extrabold tracking-[-0.045em] text-foreground"
				style="font-family: var(--font-display);"
			>
				Branding
			</h1>
			<p class="max-w-2xl text-sm leading-7 text-muted-foreground">
				Control the organization name, logo, and color scheme applied across every screen of the platform. Changes take effect immediately for all active sessions.
			</p>
		</section>

		<section class="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
			<div class="space-y-5">
				<div class="rounded-md border border-border/60 bg-card p-6">
					<h2
						class="mb-5 text-lg font-extrabold tracking-[-0.015em] text-foreground"
						style="font-family: var(--font-display);"
					>
						Identity
					</h2>

					<div class="space-y-5">
						<div>
							<label class="text-[0.62rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
								Organization Name
							</label>
							<input
								v-model="form.orgName"
								type="text"
								class="mt-2 w-full rounded-md bg-muted px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
							>
						</div>

						<div>
							<label class="text-[0.62rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
								Tagline
							</label>
							<input
								v-model="form.tagline"
								type="text"
								class="mt-2 w-full rounded-md bg-muted px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
							>
						</div>

						<div>
							<label class="text-[0.62rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
								Logo
							</label>
							<div class="mt-2 flex items-center gap-4 rounded-md bg-muted p-4">
								<div class="flex size-24 shrink-0 items-center justify-center rounded-md bg-card">
									<img
										v-if="form.logoDataUrl"
										:src="form.logoDataUrl"
										alt="Logo preview"
										class="max-h-20 max-w-20 object-contain"
									>
									<span v-else class="text-[0.58rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
										No logo
									</span>
								</div>
								<div class="flex-1 space-y-2">
									<div class="flex gap-2">
										<button
											type="button"
											class="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-card px-3 py-2 text-[0.62rem] font-bold tracking-[0.14em] text-foreground uppercase transition-all hover:border-primary hover:text-primary"
											@click="triggerFilePick"
										>
											<Upload class="size-3.5" />
											Upload
										</button>
										<button
											v-if="form.logoDataUrl"
											type="button"
											class="inline-flex items-center gap-1.5 rounded-md border border-border/70 px-3 py-2 text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase transition-all hover:border-destructive hover:text-destructive"
											@click="clearLogo"
										>
											Remove
										</button>
									</div>
									<p class="text-[0.62rem] text-muted-foreground">
										SVG or PNG. Under 300 KB. Encoded as a data URL.
									</p>
								</div>
								<input
									ref="fileInput"
									type="file"
									accept="image/svg+xml,image/png,image/jpeg,image/webp"
									class="hidden"
									@change="onFileSelected"
								>
							</div>
						</div>
					</div>
				</div>

				<div class="rounded-md border border-border/60 bg-card p-6">
					<h2
						class="mb-5 text-lg font-extrabold tracking-[-0.015em] text-foreground"
						style="font-family: var(--font-display);"
					>
						Color Scheme
					</h2>

					<div class="space-y-4">
						<div class="flex items-center gap-4 rounded-md bg-muted p-4">
							<input
								v-model="form.primaryColor"
								type="color"
								class="size-14 cursor-pointer rounded-md border border-border/50 bg-transparent"
							>
							<div class="flex-1">
								<p class="text-[0.62rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
									Primary
								</p>
								<p
									class="mt-1 font-mono text-sm font-semibold text-foreground"
									style="font-family: var(--font-display);"
								>
									{{ form.primaryColor }}
								</p>
								<p class="text-[0.62rem] text-muted-foreground">
									CTAs, active navigation, chart accents
								</p>
							</div>
						</div>

						<div class="flex items-center gap-4 rounded-md bg-muted p-4">
							<input
								v-model="form.sidebarColor"
								type="color"
								class="size-14 cursor-pointer rounded-md border border-border/50 bg-transparent"
							>
							<div class="flex-1">
								<p class="text-[0.62rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
									Sidebar
								</p>
								<p class="mt-1 font-mono text-sm font-semibold text-foreground">
									{{ form.sidebarColor }}
								</p>
								<p class="text-[0.62rem] text-muted-foreground">
									Left navigation shell background
								</p>
							</div>
						</div>

						<div class="flex items-center gap-4 rounded-md bg-muted p-4">
							<input
								v-model="form.accentColor"
								type="color"
								class="size-14 cursor-pointer rounded-md border border-border/50 bg-transparent"
							>
							<div class="flex-1">
								<p class="text-[0.62rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
									Accent
								</p>
								<p class="mt-1 font-mono text-sm font-semibold text-foreground">
									{{ form.accentColor }}
								</p>
								<p class="text-[0.62rem] text-muted-foreground">
									Secondary highlights and decorative accents
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="flex items-center justify-end gap-3">
					<button
						type="button"
						class="inline-flex items-center gap-1.5 rounded-md border border-border/70 px-4 py-2.5 text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase transition-all hover:border-foreground hover:text-foreground"
						:disabled="isSaving"
						@click="resetForm"
					>
						<RotateCcw class="size-3.5" />
						Reset to defaults
					</button>
					<button
						type="button"
						class="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-[0.62rem] font-bold tracking-[0.14em] text-primary-foreground uppercase transition-all hover:brightness-110 disabled:opacity-60"
						:disabled="isSaving"
						@click="save"
					>
						<LoaderCircle v-if="isSaving" class="size-3.5 animate-spin" />
						<CheckCircle2 v-else class="size-3.5" />
						{{ isSaving ? "Saving…" : "Save Branding" }}
					</button>
				</div>
			</div>

			<aside class="space-y-3 xl:sticky xl:top-24 xl:self-start">
				<p class="text-[0.62rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">
					Live Preview
				</p>

				<div class="overflow-hidden rounded-md border border-border/60 bg-card">
					<div
						class="flex items-center gap-3 p-4"
						:style="{ backgroundColor: sidebarPreview, color: '#d3e4f8' }"
					>
						<div
							class="flex size-9 items-center justify-center rounded-md text-[0.68rem] font-extrabold"
							:style="{ backgroundColor: primaryPreview, color: '#ffffff' }"
						>
							<img
								v-if="form.logoDataUrl"
								:src="form.logoDataUrl"
								alt=""
								class="size-6 object-contain"
							>
							<span v-else>{{ form.orgName.slice(0, 2).toUpperCase() }}</span>
						</div>
						<div class="flex-1 min-w-0">
							<p
								class="truncate text-[0.72rem] font-extrabold uppercase tracking-[0.1em]"
								style="font-family: var(--font-display);"
							>
								{{ form.orgName }}
							</p>
							<p class="truncate text-[0.58rem] font-semibold uppercase tracking-[0.16em] opacity-60">
								{{ form.tagline }}
							</p>
						</div>
					</div>

					<div class="space-y-3 p-5">
						<p class="text-[0.58rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
							Dashboard Card
						</p>
						<div
							class="rounded-md p-4 text-white"
							:style="{ backgroundColor: primaryPreview }"
						>
							<p class="text-[0.58rem] font-bold tracking-[0.16em] opacity-70 uppercase">
								Active Orders
							</p>
							<p
								class="metric-value mt-1 text-3xl font-extrabold"
								style="font-family: var(--font-display);"
							>
								24
							</p>
						</div>

						<button
							type="button"
							class="w-full rounded-md px-4 py-2.5 text-[0.62rem] font-bold tracking-[0.14em] text-white uppercase"
							:style="{ backgroundColor: primaryPreview }"
						>
							Primary CTA
						</button>

						<div class="flex gap-2">
							<span
								class="rounded-sm px-2 py-0.5 text-[0.58rem] font-bold tracking-[0.14em] text-white uppercase"
								:style="{ backgroundColor: primaryPreview }"
							>
								Primary
							</span>
							<span
								class="rounded-sm px-2 py-0.5 text-[0.58rem] font-bold tracking-[0.14em] text-white uppercase"
								:style="{ backgroundColor: accentPreview }"
							>
								Accent
							</span>
						</div>
					</div>
				</div>
			</aside>
		</section>
	</div>
</template>
