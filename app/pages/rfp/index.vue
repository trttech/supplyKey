<script setup lang="ts">
import { Check, Info, LoaderCircle, Minus, Plus } from "@lucide/vue"
import type { FetchError } from "ofetch"
import type { ProductListResponse } from "#shared/types/product"
import { toast } from "~/components/toast"
import { useCart } from "~/composables/useCart"

definePageMeta({
	layout: "dashboard",
	middleware: ["authenticated"],
})

useHead({
	title: "Contract Pricing",
})

const cart = useCart()
await cart.refresh()

const { data, pending } = await useFetch<ProductListResponse>("/api/products")

const CONTRACT_METADATA: Array<{ terms: string, rfp: string, vendor: string, expiryDays: number }> = [
	{ terms: "Fixed 24 mo.", rfp: "RFP-2026-014", vendor: "Caterpillar Official", expiryDays: 540 },
	{ terms: "Bulk Multiplier", rfp: "RFP-2026-019", vendor: "Global Metal Logistics", expiryDays: 180 },
	{ terms: "Index-Linked Quarterly", rfp: "RFP-2026-022", vendor: "SupplyKey Direct", expiryDays: 92 },
	{ terms: "Fixed 12 mo.", rfp: "RFP-2026-031", vendor: "Hilti North America", expiryDays: 318 },
	{ terms: "Volume Discount", rfp: "RFP-2026-040", vendor: "DeWalt Industrial", expiryDays: 61 },
	{ terms: "Fixed 36 mo.", rfp: "RFP-2026-052", vendor: "Bosch Industrial", expiryDays: 870 },
]

const rows = computed(() => (data.value?.items ?? []).map((product, i) => ({
	product,
	meta: CONTRACT_METADATA[i % CONTRACT_METADATA.length],
})))

const DEFAULT_QTY = 5
const quantities = reactive<Record<number, number>>({})

function qtyFor(productId: number) {
	return quantities[productId] ?? DEFAULT_QTY
}

function increment(productId: number) {
	quantities[productId] = qtyFor(productId) + 1
}

function decrement(productId: number) {
	const next = qtyFor(productId) - 1
	quantities[productId] = next < 1 ? 1 : next
}

function setQtyFromEvent(productId: number, event: Event) {
	const target = event.target as HTMLInputElement | null
	if (!target)
		return
	const parsed = Number.parseInt(target.value, 10)
	if (!Number.isFinite(parsed) || parsed < 1) {
		quantities[productId] = 1
		target.value = "1"
		return
	}
	quantities[productId] = parsed
}

const addingId = ref<number | null>(null)
async function buyNow(productId: number) {
	addingId.value = productId
	const quantity = qtyFor(productId)
	try {
		await cart.addItem(productId, quantity)
		toast.success(`${quantity} unit${quantity === 1 ? "" : "s"} added to cart.`)
	}
	catch (error) {
		const fetchError = error as FetchError<{ message?: string }>
		toast.error(fetchError.data?.message || "Unable to add item.")
	}
	finally {
		addingId.value = null
	}
}

function formatPrice(cents: number) {
	return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
</script>

<template>
	<div class="space-y-8">
		<section class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
			<div class="space-y-2">
				<p class="text-[0.68rem] font-bold tracking-[0.24em] text-muted-foreground uppercase">
					Contract Pricing
				</p>
				<h1
					class="text-5xl font-extrabold tracking-[-0.045em] text-foreground"
					style="font-family: var(--font-display);"
				>
					Contract Pricing
				</h1>
				<p class="max-w-2xl text-sm leading-7 text-muted-foreground">
					Pre-negotiated pricing from approved vendor partners. Contracts below are active for the current operator.
				</p>
			</div>
			<div class="flex gap-3">
				<div class="rounded-md border border-border/60 bg-card px-5 py-3">
					<p class="text-[0.62rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
						Active Contracts
					</p>
					<p
						class="metric-value mt-1 text-2xl font-extrabold text-foreground"
						style="font-family: var(--font-display);"
					>
						142
					</p>
				</div>
				<div class="rounded-md border border-border/60 bg-card px-5 py-3">
					<p class="text-[0.62rem] font-bold tracking-[0.18em] text-muted-foreground uppercase">
						Renewals (30d)
					</p>
					<p
						class="metric-value mt-1 text-2xl font-extrabold text-foreground"
						style="font-family: var(--font-display);"
					>
						08
					</p>
				</div>
			</div>
		</section>

		<section class="rounded-md border border-border/60 bg-card">
			<div v-if="pending" class="p-8 text-center text-sm text-muted-foreground">
				Loading contract catalog…
			</div>

			<table v-else class="w-full text-sm">
				<thead>
					<tr class="border-b border-border/60 text-left">
						<th class="px-6 py-4 text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
							Product
						</th>
						<th class="px-4 py-4 text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
							Approved Price
						</th>
						<th class="px-4 py-4 text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
							Vendor / RFP
						</th>
						<th class="px-4 py-4 text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
							Expiry
						</th>
						<th class="px-4 py-4 text-center text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
							Quantity
						</th>
						<th class="px-6 py-4" />
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="row in rows"
						:key="row.product.id"
						class="border-b border-border/40 last:border-b-0"
					>
						<td class="px-6 py-5">
							<div class="flex items-center gap-3">
								<div class="size-14 shrink-0 overflow-hidden rounded-md bg-muted">
									<img
										v-if="row.product.imageUrl"
										:src="row.product.imageUrl"
										:alt="row.product.name"
										class="size-full object-cover"
									>
								</div>
								<div>
									<p class="text-sm font-semibold text-foreground">
										{{ row.product.name }}
									</p>
									<p class="text-[0.62rem] font-semibold tracking-wide text-muted-foreground uppercase">
										{{ row.product.sku }}
									</p>
								</div>
							</div>
						</td>
						<td class="px-4 py-5">
							<p
								class="metric-value text-lg font-extrabold text-foreground"
								style="font-family: var(--font-display);"
							>
								{{ formatPrice(row.product.priceCents) }}
							</p>
							<p class="mt-0.5 text-[0.62rem] font-semibold text-muted-foreground uppercase tracking-wide">
								{{ row.meta.terms }}
							</p>
						</td>
						<td class="px-4 py-5">
							<p class="text-sm font-semibold text-primary">
								{{ row.meta.vendor }}
							</p>
							<p class="text-[0.62rem] font-semibold text-muted-foreground uppercase tracking-wide">
								{{ row.meta.rfp }}
							</p>
						</td>
						<td class="px-4 py-5">
							<p class="text-sm font-semibold text-foreground tabular-nums">
								{{ row.meta.expiryDays }} days
							</p>
							<p class="text-[0.62rem] font-semibold text-muted-foreground uppercase tracking-wide">
								remaining
							</p>
						</td>
						<td class="px-4 py-5">
							<div class="flex items-center justify-center gap-2">
								<button
									type="button"
									class="flex size-8 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-all hover:border-primary hover:text-primary disabled:opacity-50"
									:disabled="qtyFor(row.product.id) <= 1"
									@click="decrement(row.product.id)"
								>
									<Minus class="size-3.5" />
								</button>
								<input
									type="number"
									min="1"
									:value="qtyFor(row.product.id)"
									class="metric-value w-14 rounded-md border border-border/60 bg-background px-2 py-1 text-center text-base font-extrabold text-foreground tabular-nums focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
									style="font-family: var(--font-display);"
									@input="setQtyFromEvent(row.product.id, $event)"
									@blur="setQtyFromEvent(row.product.id, $event)"
								>
								<button
									type="button"
									class="flex size-8 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-all hover:border-primary hover:text-primary"
									@click="increment(row.product.id)"
								>
									<Plus class="size-3.5" />
								</button>
							</div>
						</td>
						<td class="px-6 py-5">
							<div class="flex items-center justify-end gap-2">
								<button
									type="button"
									class="flex size-9 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-all hover:border-primary hover:text-primary"
								>
									<Info class="size-4" />
								</button>
								<button
									type="button"
									class="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-[0.62rem] font-bold tracking-[0.14em] text-primary-foreground uppercase transition-all hover:brightness-110 disabled:opacity-60"
									:disabled="addingId === row.product.id"
									@click="buyNow(row.product.id)"
								>
									<LoaderCircle v-if="addingId === row.product.id" class="size-3.5 animate-spin" />
									<Check v-else-if="cart.summary.value.lines.some(l => l.productId === row.product.id)" class="size-3.5" />
									<span v-else>$</span>
									Buy Now
								</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</section>

		<p class="text-center text-[0.62rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
			Showing 1–{{ rows.length }} of {{ rows.length }} active contracts
		</p>
	</div>
</template>
