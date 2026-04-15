<script setup lang="ts">
import { ArrowUpRight, LoaderCircle, Plus, Search, X } from "@lucide/vue"
import type { FetchError } from "ofetch"
import type { EnquiryPriority, EnquirySummary } from "#shared/types/enquiry"
import { toast } from "~/components/toast"

definePageMeta({
	layout: "dashboard",
	middleware: ["authenticated"],
})

useHead({
	title: "Enquiries",
})

const { data, pending, refresh } = await useFetch<EnquirySummary[]>("/api/enquiries")

const searchQuery = ref("")
const filtered = computed(() => {
	const rows = data.value ?? []
	if (!searchQuery.value.trim())
		return rows
	const q = searchQuery.value.trim().toLowerCase()
	return rows.filter(r =>
		r.enquiryNumber.toLowerCase().includes(q)
		|| r.subject.toLowerCase().includes(q)
		|| r.supplierName.toLowerCase().includes(q),
	)
})

const priorityStyles: Record<string, string> = {
	urgent: "bg-destructive text-destructive-foreground",
	high: "bg-destructive/15 text-destructive",
	medium: "bg-primary/10 text-primary",
	low: "bg-muted text-muted-foreground",
}

const statusStyles: Record<string, string> = {
	sent: "bg-muted text-muted-foreground",
	received: "bg-chart-4/20 text-primary",
	reviewing: "bg-primary/10 text-primary",
	responded: "bg-success/10 text-success",
	resolved: "bg-muted text-muted-foreground",
}

function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const isModalOpen = ref(false)
const form = reactive({
	subject: "",
	supplierName: "",
	productSku: "",
	priority: "medium" as EnquiryPriority,
	initialMessage: "",
})
const isSubmitting = ref(false)

const priorityOptions: EnquiryPriority[] = ["low", "medium", "high", "urgent"]
const supplierSuggestions = [
	"SupplyKey Direct",
	"Global Metal Logistics Corp",
	"Caterpillar Official",
	"Hilti North America",
	"Bosch Industrial",
	"Cummins Power Systems",
]

function openModal() {
	form.subject = ""
	form.supplierName = ""
	form.productSku = ""
	form.priority = "medium"
	form.initialMessage = ""
	isModalOpen.value = true
}

function closeModal() {
	isModalOpen.value = false
}

async function submitEnquiry() {
	if (!form.subject.trim() || !form.supplierName.trim() || !form.initialMessage.trim()) {
		toast.error("Subject, supplier, and message are required.")
		return
	}
	isSubmitting.value = true
	try {
		const response = await $fetch<{ enquiryNumber: string }>("/api/enquiries", {
			method: "POST",
			body: {
				subject: form.subject.trim(),
				supplierName: form.supplierName.trim(),
				productSku: form.productSku.trim() || undefined,
				priority: form.priority,
				initialMessage: form.initialMessage.trim(),
			},
		})
		toast.success(`Enquiry ${response.enquiryNumber} dispatched.`)
		closeModal()
		await refresh()
		await navigateTo(`/enquiries/${response.enquiryNumber}`)
	}
	catch (err) {
		const fetchError = err as FetchError<{ message?: string }>
		toast.error(fetchError.data?.message || "Unable to create enquiry.")
	}
	finally {
		isSubmitting.value = false
	}
}
</script>

<template>
	<div class="space-y-8">
		<section class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
			<div class="space-y-2">
				<p class="text-[0.68rem] font-bold tracking-[0.24em] text-muted-foreground uppercase">
					Supplier Correspondence
				</p>
				<h1
					class="text-5xl font-extrabold tracking-[-0.045em] text-foreground"
					style="font-family: var(--font-display);"
				>
					Enquiries &amp; Follow-ups
				</h1>
				<p class="max-w-2xl text-sm leading-7 text-muted-foreground">
					Ticket tracker for all active supplier communications. Priority-weighted and bound to the active operator.
				</p>
			</div>

			<div class="flex items-center gap-3">
				<div class="relative">
					<Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<input
						v-model="searchQuery"
						type="text"
						placeholder="Search enquiries…"
						class="w-64 rounded-md border border-border/60 bg-card py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
					>
				</div>
				<button
					type="button"
					class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-[0.68rem] font-bold tracking-[0.14em] text-primary-foreground uppercase transition-all hover:brightness-110"
					style="font-family: var(--font-display);"
					@click="openModal"
				>
					<Plus class="size-4" />
					New Enquiry
				</button>
			</div>
		</section>

		<section>
			<div v-if="pending" class="space-y-3">
				<div v-for="i in 3" :key="i" class="h-28 rounded-md bg-muted animate-pulse" />
			</div>

			<div v-else-if="!filtered.length" class="rounded-md border border-border/60 bg-card p-12 text-center">
				<p class="text-sm text-muted-foreground">
					No enquiries match this search.
				</p>
				<button
					type="button"
					class="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[0.62rem] font-bold tracking-[0.14em] text-primary-foreground uppercase transition-all hover:brightness-110"
					@click="openModal"
				>
					<Plus class="size-3.5" />
					New Enquiry
				</button>
			</div>

			<ul v-else class="space-y-3">
				<li
					v-for="enquiry in filtered"
					:key="enquiry.id"
				>
					<NuxtLink
						:to="`/enquiries/${enquiry.enquiryNumber}`"
						class="group flex items-start gap-5 rounded-md border border-border/60 bg-card p-6 transition-all hover:border-primary/40"
					>
						<div class="flex-1 min-w-0 space-y-2">
							<div class="flex items-center gap-2">
								<span
									class="rounded-sm px-2 py-0.5 text-[0.58rem] font-bold tracking-[0.14em] uppercase"
									:class="priorityStyles[enquiry.priority]"
								>
									{{ enquiry.priority }}
								</span>
								<span
									class="rounded-sm px-2 py-0.5 text-[0.58rem] font-bold tracking-[0.14em] uppercase"
									:class="statusStyles[enquiry.status]"
								>
									{{ enquiry.status }}
								</span>
								<span class="text-[0.62rem] font-bold tracking-[0.16em] text-muted-foreground uppercase">
									{{ enquiry.enquiryNumber }}
								</span>
							</div>
							<h3
								class="text-lg font-extrabold tracking-[-0.015em] text-foreground"
								style="font-family: var(--font-display);"
							>
								{{ enquiry.subject }}
							</h3>
							<p class="text-xs font-semibold text-primary">
								{{ enquiry.supplierName }}
							</p>
							<p class="line-clamp-2 text-sm text-muted-foreground">
								{{ enquiry.lastMessagePreview }}
							</p>
						</div>

						<div class="flex flex-col items-end gap-3">
							<span class="text-[0.62rem] font-semibold tracking-wide text-muted-foreground whitespace-nowrap">
								{{ formatDate(enquiry.updatedAt) }}
							</span>
							<div class="flex size-9 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-all group-hover:border-primary group-hover:text-primary">
								<ArrowUpRight class="size-4" />
							</div>
						</div>
					</NuxtLink>
				</li>
			</ul>
		</section>

		<Teleport to="body">
			<div
				v-if="isModalOpen"
				class="fixed inset-0 z-50 flex items-center justify-center p-4"
			>
				<div
					class="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
					@click="closeModal"
				/>
				<div class="relative w-full max-w-xl rounded-md border border-border/60 bg-card shadow-2xl">
					<header class="flex items-start justify-between border-b border-border/40 p-6">
						<div>
							<p
								class="text-[0.62rem] font-bold tracking-[0.2em] text-muted-foreground uppercase"
								style="font-family: var(--font-display);"
							>
								New Enquiry
							</p>
							<h2
								class="mt-1 text-2xl font-extrabold tracking-[-0.02em] text-foreground"
								style="font-family: var(--font-display);"
							>
								Dispatch to supplier network
							</h2>
						</div>
						<button
							type="button"
							class="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
							@click="closeModal"
						>
							<X class="size-4" />
						</button>
					</header>

					<form class="space-y-5 p-6" @submit.prevent="submitEnquiry">
						<div>
							<label class="text-[0.62rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
								Subject
							</label>
							<input
								v-model="form.subject"
								type="text"
								placeholder="e.g. Hydraulic valve specs — Pit C"
								class="mt-2 w-full rounded-md bg-muted px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
								:disabled="isSubmitting"
							>
						</div>

						<div class="grid gap-5 sm:grid-cols-2">
							<div>
								<label class="text-[0.62rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
									Supplier
								</label>
								<input
									v-model="form.supplierName"
									type="text"
									placeholder="Supplier name"
									list="supplier-options"
									class="mt-2 w-full rounded-md bg-muted px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
									:disabled="isSubmitting"
								>
								<datalist id="supplier-options">
									<option v-for="s in supplierSuggestions" :key="s" :value="s" />
								</datalist>
							</div>

							<div>
								<label class="text-[0.62rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
									Product SKU (optional)
								</label>
								<input
									v-model="form.productSku"
									type="text"
									placeholder="SKI-VLV-XP900"
									class="mt-2 w-full rounded-md bg-muted px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
									:disabled="isSubmitting"
								>
							</div>
						</div>

						<div>
							<label class="text-[0.62rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
								Priority
							</label>
							<div class="mt-2 grid grid-cols-4 gap-2">
								<button
									v-for="option in priorityOptions"
									:key="option"
									type="button"
									class="rounded-md px-3 py-2 text-[0.62rem] font-bold tracking-[0.14em] uppercase transition-all"
									:class="form.priority === option ? priorityStyles[option] : 'bg-muted text-muted-foreground hover:text-foreground'"
									:disabled="isSubmitting"
									@click="form.priority = option"
								>
									{{ option }}
								</button>
							</div>
						</div>

						<div>
							<label class="text-[0.62rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
								Initial Message
							</label>
							<textarea
								v-model="form.initialMessage"
								rows="4"
								placeholder="Describe your requirement, quantity, and timeline…"
								class="mt-2 w-full resize-none rounded-md bg-muted px-3 py-2.5 text-sm leading-6 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
								:disabled="isSubmitting"
							/>
						</div>

						<div class="flex items-center justify-end gap-3 pt-2">
							<button
								type="button"
								class="rounded-md border border-border/70 px-4 py-2 text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase transition-all hover:border-foreground hover:text-foreground"
								:disabled="isSubmitting"
								@click="closeModal"
							>
								Cancel
							</button>
							<button
								type="submit"
								class="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-[0.62rem] font-bold tracking-[0.14em] text-primary-foreground uppercase transition-all hover:brightness-110 disabled:opacity-60"
								:disabled="isSubmitting"
							>
								<LoaderCircle v-if="isSubmitting" class="size-3.5 animate-spin" />
								{{ isSubmitting ? "Dispatching…" : "Dispatch Enquiry" }}
							</button>
						</div>
					</form>
				</div>
			</div>
		</Teleport>
	</div>
</template>
