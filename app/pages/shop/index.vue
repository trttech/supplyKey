<script setup lang="ts">
import { Check, LoaderCircle, Plus, Search } from "@lucide/vue"
import type { FetchError } from "ofetch"
import type { ProductListResponse } from "#shared/types/product"
import { toast } from "~/components/toast"
import { useCart } from "~/composables/useCart"

definePageMeta({
	layout: "dashboard",
	middleware: ["authenticated"],
})

useHead({
	title: "Shop Products",
})

const route = useRoute()
const router = useRouter()
const cart = useCart()
await cart.refresh()

const category = computed(() => typeof route.query.category === "string" ? route.query.category : "")
const manufacturer = computed(() => typeof route.query.manufacturer === "string" ? route.query.manufacturer : "")
const q = ref(typeof route.query.q === "string" ? route.query.q : "")

const apiQuery = computed(() => ({
	category: category.value || undefined,
	manufacturer: manufacturer.value || undefined,
	q: typeof route.query.q === "string" && route.query.q.length > 0 ? route.query.q : undefined,
}))

const { data, pending, refresh } = await useFetch<ProductListResponse>("/api/products", {
	query: apiQuery,
})

function updateQuery(next: Record<string, string | undefined>) {
	const merged = { ...route.query, ...next }
	for (const key of Object.keys(merged)) {
		if (merged[key] === undefined || merged[key] === "") {
			delete merged[key]
		}
	}
	router.push({ path: route.path, query: merged })
}

function setCategory(value: string) {
	updateQuery({ category: value === category.value ? undefined : value })
}

function setManufacturer(value: string) {
	updateQuery({ manufacturer: value === manufacturer.value ? undefined : value })
}

function submitSearch() {
	updateQuery({ q: q.value || undefined })
}

function clearFilters() {
	q.value = ""
	router.push({ path: route.path, query: {} })
}

const addingId = ref<number | null>(null)
async function handleAdd(productId: number) {
	addingId.value = productId
	try {
		await cart.addItem(productId, 1)
		toast.success("Added to cart.")
	}
	catch (error) {
		const fetchError = error as FetchError<{ message?: string }>
		toast.error(fetchError.data?.message || "Unable to add to cart.")
	}
	finally {
		addingId.value = null
	}
}

function formatPrice(cents: number) {
	return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const hasFilters = computed(() => category.value || manufacturer.value || q.value)
</script>

<template>
	<div class="space-y-8">
		<section class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
			<div class="space-y-2">
				<p class="text-[0.68rem] font-bold tracking-[0.24em] text-muted-foreground uppercase">
					Catalog
				</p>
				<h1
					class="text-5xl font-extrabold tracking-[-0.045em] text-foreground"
					style="font-family: var(--font-display);"
				>
					Shop Products
				</h1>
				<p class="max-w-2xl text-sm leading-7 text-muted-foreground">
					Industrial equipment, safety gear, precision tools, and consumables. Add items to your cart to build an order.
				</p>
			</div>

			<div class="flex items-center gap-3">
				<NuxtLink
					to="/cart"
					class="inline-flex items-center gap-2 rounded-md border border-border/70 bg-card px-4 py-2.5 text-[0.72rem] font-bold tracking-[0.15em] text-foreground uppercase transition-all hover:border-primary hover:text-primary"
				>
					Cart ({{ cart.summary.value.itemCount }})
				</NuxtLink>
			</div>
		</section>

		<section class="grid gap-6 lg:grid-cols-[18rem_1fr]">
			<aside class="space-y-6">
				<div class="rounded-md border border-border/60 bg-card p-5">
					<label class="text-[0.62rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">
						Search
					</label>
					<div class="mt-3 flex gap-2">
						<div class="relative flex-1">
							<Search class="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
							<input
								v-model="q"
								type="text"
								placeholder="SKU, name, description"
								class="w-full rounded-md bg-muted px-3 py-2 pl-8 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
								@keyup.enter="submitSearch"
							>
						</div>
						<button
							type="button"
							class="rounded-md bg-primary px-3 text-[0.68rem] font-bold tracking-[0.14em] text-primary-foreground uppercase transition-all hover:brightness-110"
							@click="submitSearch"
						>
							Go
						</button>
					</div>
				</div>

				<div class="rounded-md border border-border/60 bg-card p-5">
					<p class="text-[0.62rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">
						Categories
					</p>
					<ul class="mt-3 space-y-1">
						<li v-for="facet in data?.facets.categories ?? []" :key="facet.value">
							<button
								type="button"
								class="group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-all"
								:class="category === facet.value ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted text-foreground'"
								@click="setCategory(facet.value)"
							>
								<span>{{ facet.value }}</span>
								<span
									class="text-[0.62rem] font-bold tracking-wide"
									:class="category === facet.value ? 'text-primary-foreground/70' : 'text-muted-foreground'"
								>
									{{ facet.count }}
								</span>
							</button>
						</li>
					</ul>
				</div>

				<div class="rounded-md border border-border/60 bg-card p-5">
					<p class="text-[0.62rem] font-bold tracking-[0.2em] text-muted-foreground uppercase">
						Manufacturers
					</p>
					<ul class="mt-3 space-y-1">
						<li v-for="facet in data?.facets.manufacturers ?? []" :key="facet.value">
							<button
								type="button"
								class="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-all"
								:class="manufacturer === facet.value ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-muted text-foreground'"
								@click="setManufacturer(facet.value)"
							>
								<span>{{ facet.value }}</span>
								<span
									class="text-[0.62rem] font-bold tracking-wide"
									:class="manufacturer === facet.value ? 'text-primary-foreground/70' : 'text-muted-foreground'"
								>
									{{ facet.count }}
								</span>
							</button>
						</li>
					</ul>
				</div>

				<button
					v-if="hasFilters"
					type="button"
					class="w-full rounded-md border border-border/70 bg-card px-4 py-2 text-[0.68rem] font-bold tracking-[0.15em] text-muted-foreground uppercase transition-all hover:border-primary hover:text-primary"
					@click="clearFilters"
				>
					Clear Filters
				</button>
			</aside>

			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<p class="text-[0.68rem] font-bold tracking-[0.16em] text-muted-foreground uppercase">
						{{ pending ? "Loading…" : `${data?.total ?? 0} products` }}
					</p>
					<button
						type="button"
						class="text-[0.68rem] font-bold tracking-[0.15em] text-muted-foreground uppercase transition-colors hover:text-primary"
						@click="refresh()"
					>
						Refresh
					</button>
				</div>

				<div v-if="pending" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
					<div v-for="i in 6" :key="i" class="h-80 rounded-md bg-muted animate-pulse" />
				</div>

				<div v-else-if="!data?.items.length" class="rounded-md border border-border/60 bg-card p-12 text-center">
					<p class="text-sm text-muted-foreground">
						No products match these filters.
					</p>
					<button
						type="button"
						class="mt-4 rounded-md bg-primary px-4 py-2 text-[0.68rem] font-bold tracking-[0.15em] text-primary-foreground uppercase transition-all hover:brightness-110"
						@click="clearFilters"
					>
						Clear filters
					</button>
				</div>

				<div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
					<article
						v-for="product in data.items"
						:key="product.id"
						class="group flex flex-col rounded-md border border-border/60 bg-card overflow-hidden transition-all hover:border-primary/40"
					>
						<div class="aspect-[4/3] overflow-hidden bg-muted">
							<img
								v-if="product.imageUrl"
								:src="product.imageUrl"
								:alt="product.name"
								class="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
							>
							<div v-else class="flex size-full items-center justify-center text-muted-foreground">
								No image
							</div>
						</div>

						<div class="flex flex-1 flex-col gap-3 p-5">
							<div class="flex items-center justify-between text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
								<span>{{ product.manufacturer }}</span>
								<span>{{ product.sku }}</span>
							</div>

							<h3
								class="text-lg font-bold tracking-[-0.015em] text-foreground"
								style="font-family: var(--font-display);"
							>
								{{ product.name }}
							</h3>

							<p class="line-clamp-2 text-xs text-muted-foreground">
								{{ product.description }}
							</p>

							<div class="mt-auto flex items-end justify-between pt-3">
								<div>
									<p class="text-[0.62rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
										MSRP
									</p>
									<p
										class="metric-value text-2xl font-extrabold text-foreground"
										style="font-family: var(--font-display);"
									>
										{{ formatPrice(product.priceCents) }}
									</p>
								</div>
								<button
									type="button"
									class="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-[0.68rem] font-bold tracking-[0.14em] text-primary-foreground uppercase transition-all hover:brightness-110 disabled:opacity-60"
									:disabled="addingId === product.id"
									@click="handleAdd(product.id)"
								>
									<LoaderCircle v-if="addingId === product.id" class="size-4 animate-spin" />
									<Check v-else-if="cart.summary.value.lines.some(l => l.productId === product.id)" class="size-4" />
									<Plus v-else class="size-4" />
									Add
								</button>
							</div>
						</div>
					</article>
				</div>
			</div>
		</section>
	</div>
</template>
