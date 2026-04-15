<script setup lang="ts">
import { ArrowLeft, Bold, Factory, FileText, Italic, LoaderCircle, MapPin, Paperclip, Send, Smile, Sparkles } from "@lucide/vue"
import type { FetchError } from "ofetch"
import type { EnquiryPriority, EnquiryStatus, EnquirySummary, EnquiryThread } from "#shared/types/enquiry"
import { toast } from "~/components/toast"

definePageMeta({
	layout: "dashboard",
	middleware: ["authenticated"],
})

const route = useRoute()
const number = computed(() => typeof route.params.number === "string" ? route.params.number : "")

const { data: thread, pending, error, refresh: refreshThread } = await useFetch<EnquiryThread>(
	() => `/api/enquiries/${number.value}`,
	{ watch: [number] },
)

const { data: enquiries, refresh: refreshList } = await useFetch<EnquirySummary[]>("/api/enquiries")

useHead({
	title: computed(() => thread.value ? `${thread.value.enquiryNumber} · ${thread.value.subject}` : "Enquiry"),
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

const priorityOptions: EnquiryPriority[] = ["low", "medium", "high", "urgent"]
const statusOptions: EnquiryStatus[] = ["sent", "received", "reviewing", "responded", "resolved"]

function formatDateTime(iso: string) {
	const date = new Date(iso)
	return date.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

function isBuyer(authorRole: string) {
	return authorRole.toLowerCase().includes("procurement") || authorRole.toLowerCase().includes("buyer")
}

const replyBody = ref("")
const sendingRole = ref<"buyer" | "supplier" | null>(null)
const editingField = ref<"priority" | "status" | null>(null)

async function sendMessage(asSupplier: boolean) {
	if (!replyBody.value.trim()) {
		toast.error("Message body cannot be empty.")
		return
	}
	sendingRole.value = asSupplier ? "supplier" : "buyer"
	try {
		await $fetch(`/api/enquiries/${number.value}/messages`, {
			method: "POST",
			body: {
				body: replyBody.value.trim(),
				asSupplier,
			},
		})
		replyBody.value = ""
		await Promise.all([refreshThread(), refreshList()])
		toast.success(asSupplier ? "Supplier reply inserted." : "Message dispatched.")
	}
	catch (err) {
		const fetchError = err as FetchError<{ message?: string }>
		toast.error(fetchError.data?.message || "Unable to send message.")
	}
	finally {
		sendingRole.value = null
	}
}

async function updatePriority(value: EnquiryPriority) {
	if (!thread.value || thread.value.priority === value) {
		editingField.value = null
		return
	}
	try {
		await $fetch(`/api/enquiries/${number.value}`, {
			method: "PATCH",
			body: { priority: value },
		})
		await Promise.all([refreshThread(), refreshList()])
		toast.success("Priority updated.")
	}
	catch (err) {
		const fetchError = err as FetchError<{ message?: string }>
		toast.error(fetchError.data?.message || "Unable to update priority.")
	}
	finally {
		editingField.value = null
	}
}

async function updateStatus(value: EnquiryStatus) {
	if (!thread.value || thread.value.status === value) {
		editingField.value = null
		return
	}
	try {
		await $fetch(`/api/enquiries/${number.value}`, {
			method: "PATCH",
			body: { status: value },
		})
		await Promise.all([refreshThread(), refreshList()])
		toast.success("Status updated.")
	}
	catch (err) {
		const fetchError = err as FetchError<{ message?: string }>
		toast.error(fetchError.data?.message || "Unable to update status.")
	}
	finally {
		editingField.value = null
	}
}
</script>

<template>
	<div class="space-y-6">
		<NuxtLink
			to="/enquiries"
			class="inline-flex items-center gap-2 text-[0.68rem] font-bold tracking-[0.16em] text-muted-foreground uppercase transition-colors hover:text-primary"
		>
			<ArrowLeft class="size-3.5" />
			Back to Enquiries
		</NuxtLink>

		<div v-if="pending" class="rounded-md border border-border/60 bg-card p-12 text-center">
			<p class="text-sm text-muted-foreground">
				Loading communication hub…
			</p>
		</div>

		<div v-else-if="error || !thread" class="rounded-md border border-destructive/30 bg-destructive/5 p-8 text-center">
			<p class="text-sm text-destructive">
				Unable to load enquiry thread.
			</p>
		</div>

		<section v-else class="grid gap-5 xl:grid-cols-[18rem_1fr_16rem]">
			<aside class="rounded-md border border-border/60 bg-card">
				<header class="border-b border-border/40 p-4">
					<p
						class="text-[0.62rem] font-bold tracking-[0.2em] text-muted-foreground uppercase"
						style="font-family: var(--font-display);"
					>
						Enquiry History
					</p>
					<p class="mt-1 text-xs text-muted-foreground">
						{{ enquiries?.length ?? 0 }} active threads
					</p>
				</header>
				<ul class="max-h-[32rem] space-y-0.5 overflow-y-auto p-2">
					<li v-for="row in enquiries ?? []" :key="row.id">
						<NuxtLink
							:to="`/enquiries/${row.enquiryNumber}`"
							class="block rounded-md p-3 transition-all"
							:class="row.enquiryNumber === thread.enquiryNumber
								? 'bg-primary text-primary-foreground'
								: 'hover:bg-muted text-foreground'"
						>
							<div class="flex items-center justify-between">
								<span
									class="text-[0.6rem] font-bold tracking-[0.14em] uppercase"
									:class="row.enquiryNumber === thread.enquiryNumber ? 'text-primary-foreground/70' : 'text-muted-foreground'"
								>
									{{ row.enquiryNumber }}
								</span>
								<span
									class="rounded-sm px-1.5 py-0.5 text-[0.56rem] font-bold tracking-[0.12em] uppercase"
									:class="row.enquiryNumber === thread.enquiryNumber
										? 'bg-primary-foreground/20 text-primary-foreground'
										: statusStyles[row.status]"
								>
									{{ row.status }}
								</span>
							</div>
							<p
								class="mt-1.5 line-clamp-2 text-sm font-semibold"
								style="font-family: var(--font-display);"
							>
								{{ row.subject }}
							</p>
							<p
								class="mt-0.5 truncate text-[0.65rem]"
								:class="row.enquiryNumber === thread.enquiryNumber ? 'text-primary-foreground/70' : 'text-muted-foreground'"
							>
								{{ row.supplierName }}
							</p>
						</NuxtLink>
					</li>
				</ul>
			</aside>

			<div class="flex flex-col rounded-md border border-border/60 bg-card">
				<header class="flex flex-col gap-3 border-b border-border/40 p-6">
					<div class="flex items-center gap-2">
						<span
							class="rounded-sm px-2 py-0.5 text-[0.58rem] font-bold tracking-[0.14em] uppercase"
							:class="priorityStyles[thread.priority]"
						>
							{{ thread.priority }}
						</span>
						<span
							class="rounded-sm px-2 py-0.5 text-[0.58rem] font-bold tracking-[0.14em] uppercase"
							:class="statusStyles[thread.status]"
						>
							{{ thread.status }}
						</span>
						<span class="text-[0.62rem] font-bold tracking-[0.16em] text-muted-foreground uppercase">
							{{ thread.enquiryNumber }}
						</span>
					</div>
					<h1
						class="text-2xl font-extrabold tracking-[-0.02em] text-foreground"
						style="font-family: var(--font-display);"
					>
						{{ thread.subject }}
					</h1>
					<p class="text-sm font-semibold text-primary">
						{{ thread.supplierName }}
					</p>
				</header>

				<div class="flex-1 space-y-5 overflow-y-auto p-6">
					<article
						v-for="message in thread.messages"
						:key="message.id"
						class="flex gap-4"
						:class="isBuyer(message.authorRole) ? 'flex-row-reverse' : ''"
					>
						<div
							class="flex size-9 shrink-0 items-center justify-center rounded-md text-xs font-bold"
							:class="isBuyer(message.authorRole) ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'"
							style="font-family: var(--font-display);"
						>
							{{ message.authorName.slice(0, 2).toUpperCase() }}
						</div>
						<div class="max-w-[78%] space-y-1.5">
							<div
								class="flex items-center gap-2 text-[0.62rem] font-bold tracking-[0.12em] text-muted-foreground uppercase"
								:class="isBuyer(message.authorRole) ? 'justify-end' : ''"
							>
								<span>{{ message.authorName }}</span>
								<span>·</span>
								<span>{{ message.authorRole }}</span>
							</div>
							<div
								class="rounded-md p-4 text-sm leading-6"
								:class="isBuyer(message.authorRole) ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'"
							>
								<p>{{ message.body }}</p>
								<div
									v-if="message.attachmentName"
									class="mt-3 flex items-center gap-2 rounded-md bg-background/60 px-3 py-2 text-xs text-foreground"
								>
									<FileText class="size-3.5 shrink-0" />
									<span class="truncate font-semibold">{{ message.attachmentName }}</span>
								</div>
							</div>
							<p
								class="text-[0.6rem] text-muted-foreground"
								:class="isBuyer(message.authorRole) ? 'text-right' : ''"
							>
								{{ formatDateTime(message.createdAt) }}
							</p>
						</div>
					</article>
				</div>

				<footer class="border-t border-border/40 p-4">
					<div class="rounded-md bg-muted p-3">
						<textarea
							v-model="replyBody"
							rows="2"
							placeholder="Type your reply…"
							class="w-full resize-none bg-transparent text-sm leading-6 text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
							:disabled="sendingRole !== null"
							@keydown.enter.meta.prevent="sendMessage(false)"
							@keydown.enter.ctrl.prevent="sendMessage(false)"
						/>
						<div class="mt-2 flex items-center justify-between">
							<div class="flex gap-1 text-muted-foreground">
								<button type="button" class="flex size-8 items-center justify-center rounded-md hover:bg-background" disabled>
									<Bold class="size-4" />
								</button>
								<button type="button" class="flex size-8 items-center justify-center rounded-md hover:bg-background" disabled>
									<Italic class="size-4" />
								</button>
								<button type="button" class="flex size-8 items-center justify-center rounded-md hover:bg-background" disabled>
									<Paperclip class="size-4" />
								</button>
								<button type="button" class="flex size-8 items-center justify-center rounded-md hover:bg-background" disabled>
									<Smile class="size-4" />
								</button>
							</div>
							<div class="flex items-center gap-2">
								<button
									type="button"
									class="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-background px-3 py-1.5 text-[0.6rem] font-bold tracking-[0.14em] text-muted-foreground uppercase transition-all hover:border-primary hover:text-primary disabled:opacity-60"
									:disabled="sendingRole !== null || !replyBody.trim()"
									title="Insert as supplier reply (demo)"
									@click="sendMessage(true)"
								>
									<LoaderCircle v-if="sendingRole === 'supplier'" class="size-3.5 animate-spin" />
									<Sparkles v-else class="size-3.5" />
									As Supplier
								</button>
								<button
									type="button"
									class="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 text-[0.62rem] font-bold tracking-[0.14em] text-primary-foreground uppercase transition-all hover:brightness-110 disabled:opacity-60"
									:disabled="sendingRole !== null || !replyBody.trim()"
									@click="sendMessage(false)"
								>
									<LoaderCircle v-if="sendingRole === 'buyer'" class="size-3.5 animate-spin" />
									<Send v-else class="size-3.5" />
									Send
								</button>
							</div>
						</div>
					</div>
				</footer>
			</div>

			<aside class="space-y-3">
				<div class="rounded-md border border-border/60 bg-card p-5">
					<div class="mb-3 flex items-center gap-2 text-muted-foreground">
						<Factory class="size-4" />
						<p class="text-[0.62rem] font-bold tracking-[0.18em] uppercase">
							Supplier
						</p>
					</div>
					<p class="text-sm font-semibold text-foreground">
						{{ thread.supplierName }}
					</p>
					<p v-if="thread.productSku" class="mt-2 text-xs text-muted-foreground">
						SKU: <span class="font-mono text-foreground">{{ thread.productSku }}</span>
					</p>
				</div>

				<div class="rounded-md border border-border/60 bg-card p-5">
					<p class="text-[0.62rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
						Priority
					</p>
					<div v-if="editingField === 'priority'" class="mt-3 space-y-1">
						<button
							v-for="option in priorityOptions"
							:key="option"
							type="button"
							class="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[0.68rem] font-bold tracking-[0.12em] uppercase transition-all"
							:class="thread.priority === option ? priorityStyles[option] : 'text-muted-foreground hover:bg-muted'"
							@click="updatePriority(option)"
						>
							<span>{{ option }}</span>
							<span v-if="thread.priority === option">●</span>
						</button>
						<button
							type="button"
							class="w-full rounded-md px-2.5 py-1 text-[0.58rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase hover:text-foreground"
							@click="editingField = null"
						>
							Cancel
						</button>
					</div>
					<button
						v-else
						type="button"
						class="mt-3 w-full rounded-md px-3 py-2 text-[0.68rem] font-bold tracking-[0.14em] uppercase transition-all hover:brightness-110"
						:class="priorityStyles[thread.priority]"
						@click="editingField = 'priority'"
					>
						{{ thread.priority }}
					</button>
				</div>

				<div class="rounded-md border border-border/60 bg-card p-5">
					<p class="text-[0.62rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
						Status
					</p>
					<div v-if="editingField === 'status'" class="mt-3 space-y-1">
						<button
							v-for="option in statusOptions"
							:key="option"
							type="button"
							class="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-[0.68rem] font-bold tracking-[0.12em] uppercase transition-all"
							:class="thread.status === option ? statusStyles[option] : 'text-muted-foreground hover:bg-muted'"
							@click="updateStatus(option)"
						>
							<span>{{ option }}</span>
							<span v-if="thread.status === option">●</span>
						</button>
						<button
							type="button"
							class="w-full rounded-md px-2.5 py-1 text-[0.58rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase hover:text-foreground"
							@click="editingField = null"
						>
							Cancel
						</button>
					</div>
					<button
						v-else
						type="button"
						class="mt-3 w-full rounded-md px-3 py-2 text-[0.68rem] font-bold tracking-[0.14em] uppercase transition-all hover:brightness-110"
						:class="statusStyles[thread.status]"
						@click="editingField = 'status'"
					>
						{{ thread.status }}
					</button>
				</div>

				<div class="rounded-md border border-border/60 bg-card p-5">
					<div class="flex items-center gap-2 text-muted-foreground">
						<MapPin class="size-4" />
						<p class="text-[0.62rem] font-bold tracking-[0.18em] uppercase">
							Routing
						</p>
					</div>
					<p class="mt-2 text-sm text-foreground">
						Fremantle Terminal
					</p>
					<p class="mt-1 text-xs text-muted-foreground">
						Response SLA: ~4 operational hours
					</p>
				</div>

				<div class="rounded-md border border-border/60 bg-card p-5">
					<p class="text-[0.62rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
						Thread Opened
					</p>
					<p class="mt-2 text-sm font-semibold text-foreground">
						{{ formatDateTime(thread.createdAt) }}
					</p>
				</div>
			</aside>
		</section>
	</div>
</template>
