<script setup lang="ts">
import { CheckCircle2, LoaderCircle, Minus, Plus, ShieldCheck, Trash2, Truck } from "@lucide/vue"
import type { FetchError } from "ofetch"
import type { CheckoutResponse } from "#shared/types/order"
import { toast } from "~/components/toast"
import { useCart } from "~/composables/useCart"

definePageMeta({
	layout: "dashboard",
	middleware: ["authenticated"],
})

useHead({
	title: "Cart",
})

const cart = useCart()
await cart.refresh()

const deliverySite = ref("Terminal Alpha-7 Central")
const carrier = ref<"heavy_freight" | "express_courier" | "standard_logistics">("heavy_freight")
const paymentMethod = ref<"invoice_net30" | "purchase_order" | "corporate_account">("invoice_net30")
const poNumber = ref("")
const isSubmitting = ref(false)
const updatingId = ref<number | null>(null)

const carriers = [
	{ value: "heavy_freight", label: "Heavy Freight LTL", detail: "5–7 day transit · tarped trailer", priceCents: 18500 },
	{ value: "express_courier", label: "Express Courier", detail: "Next-day · hazmat certified", priceCents: 45000 },
	{ value: "standard_logistics", label: "Standard Logistics", detail: "7–10 day transit · standard freight", priceCents: 9500 },
] as const

const deliverySites = [
	"Terminal Alpha-7 Central",
	"North Basin Muster Point",
	"Pit C Service Road",
	"Fremantle Port Receiving",
]

const paymentOptions = [
	{ value: "invoice_net30", label: "Invoice · Net 30", detail: "Company account on file" },
	{ value: "purchase_order", label: "Purchase Order", detail: "Requires PO number" },
	{ value: "corporate_account", label: "Corporate Account", detail: "Direct debit authorization" },
] as const

const selectedCarrier = computed(() => carriers.find(c => c.value === carrier.value))
const displayedShippingCents = computed(() => {
	if (!cart.summary.value.lines.length)
		return 0
	return selectedCarrier.value?.priceCents ?? cart.summary.value.shippingCents
})
const displayedSubtotalCents = computed(() => cart.summary.value.subtotalCents)
const displayedTaxCents = computed(() => Math.round(displayedSubtotalCents.value * 0.015))
const displayedTotalCents = computed(() => displayedSubtotalCents.value + displayedShippingCents.value + displayedTaxCents.value)

function formatPrice(cents: number) {
	return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

async function adjustQuantity(id: number, delta: number) {
	const line = cart.summary.value.lines.find(l => l.id === id)
	if (!line)
		return

	const next = Math.max(0, line.quantity + delta)
	updatingId.value = id
	try {
		await cart.updateQuantity(id, next)
	}
	catch {
		toast.error("Unable to update quantity.")
	}
	finally {
		updatingId.value = null
	}
}

async function removeLine(id: number) {
	updatingId.value = id
	try {
		await cart.removeItem(id)
		toast.success("Removed from cart.")
	}
	catch {
		toast.error("Unable to remove item.")
	}
	finally {
		updatingId.value = null
	}
}

async function placeOrder() {
	if (!cart.summary.value.lines.length) {
		toast.error("Cart is empty.")
		return
	}
	if (paymentMethod.value === "purchase_order" && !poNumber.value.trim()) {
		toast.error("PO number is required for Purchase Order payment.")
		return
	}

	isSubmitting.value = true
	try {
		const response = await $fetch<CheckoutResponse>("/api/orders", {
			method: "POST",
			body: {
				deliverySite: deliverySite.value,
				carrier: carrier.value,
				paymentMethod: paymentMethod.value,
				poNumber: poNumber.value.trim() || undefined,
			},
		})
		toast.success(`Order ${response.orderNumber} placed.`)
		await navigateTo(`/orders/${response.orderNumber}`)
	}
	catch (error) {
		const fetchError = error as FetchError<{ message?: string }>
		toast.error(fetchError.data?.message || "Unable to place order.")
	}
	finally {
		isSubmitting.value = false
	}
}
</script>

<template>
	<div class="space-y-8">
		<section class="space-y-2">
			<p class="text-[0.68rem] font-bold tracking-[0.24em] text-muted-foreground uppercase">
				Checkout Pipeline
			</p>
			<h1
				class="text-5xl font-extrabold tracking-[-0.045em] text-foreground"
				style="font-family: var(--font-display);"
			>
				Cart
			</h1>
			<p class="max-w-2xl text-sm leading-7 text-muted-foreground">
				Review line items, select logistics, and authorize payment terms. Submitting the manifest creates a new order under the active operator.
			</p>
		</section>

		<section class="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
			<div class="space-y-6">
				<div class="rounded-md border border-border/60 bg-card p-6">
					<div class="mb-5 flex items-center justify-between">
						<h2
							class="text-lg font-extrabold tracking-[-0.015em] text-foreground"
							style="font-family: var(--font-display);"
						>
							Cart Items
						</h2>
						<span class="text-[0.62rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">
							{{ cart.summary.value.itemCount }} Units
						</span>
					</div>

					<div v-if="!cart.summary.value.lines.length" class="rounded-md bg-muted p-8 text-center">
						<p class="text-sm text-muted-foreground">
							Cart is empty.
						</p>
						<NuxtLink
							to="/shop"
							class="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-[0.68rem] font-bold tracking-[0.15em] text-primary-foreground uppercase transition-all hover:brightness-110"
						>
							Browse Catalog
						</NuxtLink>
					</div>

					<ul v-else class="space-y-3">
						<li
							v-for="line in cart.summary.value.lines"
							:key="line.id"
							class="flex items-center gap-4 rounded-md bg-muted p-4"
						>
							<div class="size-20 shrink-0 overflow-hidden rounded-md bg-background">
								<img
									v-if="line.imageUrl"
									:src="line.imageUrl"
									:alt="line.name"
									class="size-full object-cover"
								>
							</div>

							<div class="flex-1 min-w-0">
								<p class="text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
									{{ line.manufacturer }} · {{ line.sku }}
								</p>
								<p class="mt-1 truncate text-sm font-semibold text-foreground">
									{{ line.name }}
								</p>
								<p class="mt-1 text-xs text-muted-foreground">
									{{ formatPrice(line.unitPriceCents) }} / unit
								</p>
							</div>

							<div class="flex items-center gap-2">
								<button
									type="button"
									class="flex size-8 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-all hover:border-primary hover:text-primary disabled:opacity-60"
									:disabled="updatingId === line.id"
									@click="adjustQuantity(line.id, -1)"
								>
									<Minus class="size-3.5" />
								</button>
								<span class="min-w-[2rem] text-center text-sm font-bold tabular-nums">
									{{ updatingId === line.id ? "…" : line.quantity }}
								</span>
								<button
									type="button"
									class="flex size-8 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-all hover:border-primary hover:text-primary disabled:opacity-60"
									:disabled="updatingId === line.id"
									@click="adjustQuantity(line.id, 1)"
								>
									<Plus class="size-3.5" />
								</button>
							</div>

							<div class="w-24 text-right">
								<p
									class="metric-value text-lg font-extrabold text-foreground"
									style="font-family: var(--font-display);"
								>
									{{ formatPrice(line.lineTotalCents) }}
								</p>
							</div>

							<button
								type="button"
								class="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive disabled:opacity-60"
								:disabled="updatingId === line.id"
								@click="removeLine(line.id)"
							>
								<Trash2 class="size-4" />
							</button>
						</li>
					</ul>
				</div>

				<div class="rounded-md border border-border/60 bg-card p-6">
					<h2
						class="mb-5 text-lg font-extrabold tracking-[-0.015em] text-foreground"
						style="font-family: var(--font-display);"
					>
						Logistics Routing
					</h2>

					<div class="space-y-5">
						<div>
							<label class="text-[0.62rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">
								Delivery Site
							</label>
							<select
								v-model="deliverySite"
								class="mt-2 w-full rounded-md bg-muted px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
							>
								<option v-for="site in deliverySites" :key="site" :value="site">
									{{ site }}
								</option>
							</select>
						</div>

						<div>
							<p class="text-[0.62rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">
								Carrier Service
							</p>
							<div class="mt-3 space-y-2">
								<label
									v-for="option in carriers"
									:key="option.value"
									class="flex items-center gap-4 rounded-md bg-muted p-4 cursor-pointer transition-all"
									:class="{ 'ring-2 ring-primary': carrier === option.value }"
								>
									<input
										v-model="carrier"
										type="radio"
										:value="option.value"
										class="size-4 text-primary"
									>
									<Truck class="size-5 text-muted-foreground" />
									<div class="flex-1">
										<p class="text-sm font-semibold text-foreground">
											{{ option.label }}
										</p>
										<p class="text-xs text-muted-foreground">
											{{ option.detail }}
										</p>
									</div>
									<span
										class="metric-value text-sm font-extrabold text-foreground"
										style="font-family: var(--font-display);"
									>
										{{ formatPrice(option.priceCents) }}
									</span>
								</label>
							</div>
						</div>
					</div>
				</div>

				<div class="rounded-md border border-border/60 bg-card p-6">
					<h2
						class="mb-5 text-lg font-extrabold tracking-[-0.015em] text-foreground"
						style="font-family: var(--font-display);"
					>
						Payment Protocol
					</h2>

					<div class="space-y-3">
						<label
							v-for="option in paymentOptions"
							:key="option.value"
							class="flex items-center gap-4 rounded-md bg-muted p-4 cursor-pointer transition-all"
							:class="{ 'ring-2 ring-primary': paymentMethod === option.value }"
						>
							<input
								v-model="paymentMethod"
								type="radio"
								:value="option.value"
								class="size-4 text-primary"
							>
							<div class="flex-1">
								<p class="text-sm font-semibold text-foreground">
									{{ option.label }}
								</p>
								<p class="text-xs text-muted-foreground">
									{{ option.detail }}
								</p>
							</div>
						</label>
					</div>

					<div v-if="paymentMethod === 'purchase_order'" class="mt-5">
						<label class="text-[0.62rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">
							PO Number
						</label>
						<input
							v-model="poNumber"
							type="text"
							placeholder="PO-2026-00042"
							class="mt-2 w-full rounded-md bg-muted px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
						>
					</div>
				</div>
			</div>

			<aside class="space-y-4 xl:sticky xl:top-24 xl:self-start">
				<div class="rounded-md border border-primary/20 bg-primary text-primary-foreground p-6">
					<p
						class="text-[0.62rem] font-bold tracking-[0.2em] text-primary-foreground/70 uppercase"
						style="font-family: var(--font-display);"
					>
						Order Summary
					</p>

					<dl class="mt-5 space-y-3 text-sm">
						<div class="flex items-center justify-between">
							<dt class="text-primary-foreground/70">
								Subtotal
							</dt>
							<dd class="font-semibold tabular-nums">
								{{ formatPrice(displayedSubtotalCents) }}
							</dd>
						</div>
						<div class="flex items-center justify-between">
							<dt class="text-primary-foreground/70">
								Logistics
							</dt>
							<dd class="font-semibold tabular-nums">
								{{ formatPrice(displayedShippingCents) }}
							</dd>
						</div>
						<div class="flex items-center justify-between">
							<dt class="text-primary-foreground/70">
								Environmental Tax
							</dt>
							<dd class="font-semibold tabular-nums">
								{{ formatPrice(displayedTaxCents) }}
							</dd>
						</div>
					</dl>

					<div class="mt-5 border-t border-primary-foreground/20 pt-5">
						<p class="text-[0.62rem] font-bold tracking-[0.2em] text-primary-foreground/70 uppercase">
							Grand Total
						</p>
						<p
							class="metric-value mt-2 text-4xl font-extrabold"
							style="font-family: var(--font-display);"
						>
							{{ formatPrice(displayedTotalCents) }}
						</p>
					</div>

					<button
						type="button"
						class="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary-foreground px-4 py-3.5 text-[0.72rem] font-extrabold tracking-[0.18em] text-primary uppercase transition-all hover:brightness-95 disabled:opacity-60"
						:disabled="isSubmitting || !cart.summary.value.lines.length"
						style="font-family: var(--font-display);"
						@click="placeOrder"
					>
						<LoaderCircle v-if="isSubmitting" class="size-4 animate-spin" />
						<CheckCircle2 v-else class="size-4" />
						{{ isSubmitting ? "Submitting…" : "Place Order" }}
					</button>
				</div>

				<div class="rounded-md border border-border/60 bg-card p-5">
					<div class="flex items-start gap-3">
						<ShieldCheck class="size-5 shrink-0 text-primary" />
						<div>
							<p
								class="text-xs font-bold tracking-[0.08em] text-foreground"
								style="font-family: var(--font-display);"
							>
								ISO 9001 · Priority Support
							</p>
							<p class="mt-1 text-xs text-muted-foreground">
								All SupplyKey line items ship with compliance documentation. Priority dispatch for critical-path operations.
							</p>
						</div>
					</div>
				</div>
			</aside>
		</section>
	</div>
</template>
