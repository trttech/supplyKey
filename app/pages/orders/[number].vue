<script setup lang="ts">
import { ArrowLeft, CheckCircle2, MapPin, Receipt, Truck } from "@lucide/vue"
import type { OrderDetail } from "#shared/types/order"

definePageMeta({
	layout: "dashboard",
	middleware: ["authenticated"],
})

const route = useRoute()
const orderNumber = computed(() => typeof route.params.number === "string" ? route.params.number : "")

const { data: order, pending, error } = await useFetch<OrderDetail>(() => `/api/orders/${orderNumber.value}`)

useHead({
	title: computed(() => order.value ? `Order ${order.value.orderNumber}` : "Order"),
})

function formatPrice(cents: number) {
	return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatDate(iso: string) {
	const date = new Date(iso)
	return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

function formatTime(iso: string) {
	const date = new Date(iso)
	return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
}

const statusColors: Record<string, string> = {
	placed: "bg-primary text-primary-foreground",
	processing: "bg-chart-4 text-primary",
	shipped: "bg-accent text-accent-foreground",
	delivered: "bg-success text-success-foreground",
}

const paymentLabels: Record<string, string> = {
	invoice_net30: "Invoice · Net 30",
	purchase_order: "Purchase Order",
	corporate_account: "Corporate Account",
}

const carrierLabels: Record<string, string> = {
	heavy_freight: "Heavy Freight LTL",
	express_courier: "Express Courier",
	standard_logistics: "Standard Logistics",
}
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

		<div v-if="pending" class="rounded-md border border-border/60 bg-card p-12 text-center">
			<p class="text-sm text-muted-foreground">
				Loading order…
			</p>
		</div>

		<div v-else-if="error || !order" class="rounded-md border border-destructive/30 bg-destructive/5 p-8 text-center">
			<p class="text-sm text-destructive">
				Unable to load order. It may have been removed or you may not have access.
			</p>
			<NuxtLink
				to="/dashboard"
				class="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-[0.68rem] font-bold tracking-[0.15em] text-primary-foreground uppercase transition-all hover:brightness-110"
			>
				Return
			</NuxtLink>
		</div>

		<template v-else>
			<section class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
				<div class="space-y-3">
					<div class="flex items-center gap-3">
						<div class="flex size-14 items-center justify-center rounded-md bg-success/10 text-success">
							<CheckCircle2 class="size-8" />
						</div>
						<div>
							<p class="text-[0.68rem] font-bold tracking-[0.24em] text-muted-foreground uppercase">
								Order Confirmed
							</p>
							<h1
								class="text-4xl font-extrabold tracking-[-0.035em] text-foreground"
								style="font-family: var(--font-display);"
							>
								{{ order.orderNumber }}
							</h1>
						</div>
					</div>
					<p class="text-sm leading-7 text-muted-foreground max-w-xl">
						Manifest has been dispatched to logistics routing. Vendors will confirm acknowledgment within 4 operational hours.
					</p>
				</div>

				<span
					class="inline-flex items-center rounded-sm px-3 py-1.5 text-[0.62rem] font-bold tracking-[0.16em] uppercase"
					:class="statusColors[order.status] ?? 'bg-muted text-foreground'"
				>
					{{ order.status }}
				</span>
			</section>

			<section class="grid gap-4 md:grid-cols-3">
				<div class="rounded-md border border-border/60 bg-card p-5">
					<div class="flex items-center gap-2 text-muted-foreground">
						<MapPin class="size-4" />
						<p class="text-[0.62rem] font-bold tracking-[0.18em] uppercase">
							Delivery Site
						</p>
					</div>
					<p class="mt-3 text-sm font-semibold text-foreground">
						{{ order.deliverySite }}
					</p>
				</div>
				<div class="rounded-md border border-border/60 bg-card p-5">
					<div class="flex items-center gap-2 text-muted-foreground">
						<Truck class="size-4" />
						<p class="text-[0.62rem] font-bold tracking-[0.18em] uppercase">
							Carrier
						</p>
					</div>
					<p class="mt-3 text-sm font-semibold text-foreground">
						{{ carrierLabels[order.carrier] ?? order.carrier }}
					</p>
				</div>
				<div class="rounded-md border border-border/60 bg-card p-5">
					<div class="flex items-center gap-2 text-muted-foreground">
						<Receipt class="size-4" />
						<p class="text-[0.62rem] font-bold tracking-[0.18em] uppercase">
							Payment
						</p>
					</div>
					<p class="mt-3 text-sm font-semibold text-foreground">
						{{ paymentLabels[order.paymentMethod] ?? order.paymentMethod }}
					</p>
					<p v-if="order.poNumber" class="mt-1 text-xs text-muted-foreground">
						PO: {{ order.poNumber }}
					</p>
				</div>
			</section>

			<section class="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
				<div class="rounded-md border border-border/60 bg-card p-6">
					<div class="mb-5 flex items-center justify-between">
						<h2
							class="text-lg font-extrabold tracking-[-0.015em] text-foreground"
							style="font-family: var(--font-display);"
						>
							Line Items
						</h2>
						<span class="text-[0.62rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">
							{{ order.lines.length }} SKU{{ order.lines.length === 1 ? "" : "s" }}
						</span>
					</div>

					<ul class="space-y-3">
						<li
							v-for="line in order.lines"
							:key="line.id"
							class="flex items-center gap-4 rounded-md bg-muted p-4"
						>
							<div class="flex-1 min-w-0">
								<p class="text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
									{{ line.sku }}
								</p>
								<p class="mt-1 truncate text-sm font-semibold text-foreground">
									{{ line.name }}
								</p>
								<p class="mt-1 text-xs text-muted-foreground">
									{{ line.quantity }} × {{ formatPrice(line.unitPriceCents) }}
								</p>
							</div>
							<p
								class="metric-value w-28 text-right text-lg font-extrabold text-foreground"
								style="font-family: var(--font-display);"
							>
								{{ formatPrice(line.lineTotalCents) }}
							</p>
						</li>
					</ul>
				</div>

				<aside class="space-y-4">
					<div class="rounded-md border border-border/60 bg-card p-6">
						<p
							class="text-[0.62rem] font-bold tracking-[0.2em] text-muted-foreground uppercase"
							style="font-family: var(--font-display);"
						>
							Totals
						</p>
						<dl class="mt-5 space-y-3 text-sm">
							<div class="flex items-center justify-between">
								<dt class="text-muted-foreground">
									Subtotal
								</dt>
								<dd class="font-semibold tabular-nums text-foreground">
									{{ formatPrice(order.subtotalCents) }}
								</dd>
							</div>
							<div class="flex items-center justify-between">
								<dt class="text-muted-foreground">
									Logistics
								</dt>
								<dd class="font-semibold tabular-nums text-foreground">
									{{ formatPrice(order.shippingCents) }}
								</dd>
							</div>
							<div class="flex items-center justify-between">
								<dt class="text-muted-foreground">
									Environmental Tax
								</dt>
								<dd class="font-semibold tabular-nums text-foreground">
									{{ formatPrice(order.taxCents) }}
								</dd>
							</div>
						</dl>
						<div class="mt-5 border-t border-border/60 pt-5">
							<p class="text-[0.62rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">
								Grand Total
							</p>
							<p
								class="metric-value mt-2 text-4xl font-extrabold text-foreground"
								style="font-family: var(--font-display);"
							>
								{{ formatPrice(order.totalCents) }}
							</p>
						</div>
					</div>

					<div class="rounded-md border border-border/60 bg-card p-5">
						<p class="text-[0.62rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">
							Placed
						</p>
						<p class="mt-2 text-sm font-semibold text-foreground">
							{{ formatDate(order.placedAt) }}
						</p>
						<p class="text-xs text-muted-foreground">
							{{ formatTime(order.placedAt) }}
						</p>
					</div>
				</aside>
			</section>
		</template>
	</div>
</template>
