<script setup lang="ts">
import { CheckCircle2, Clock, Cog, FileBarChart2, Route, ShieldCheck, Sparkles, Wrench } from "@lucide/vue"
import { toast } from "~/components/toast"

definePageMeta({
	layout: "dashboard",
	middleware: ["authenticated"],
})

useHead({
	title: "Request Estimate",
})

const assets = [
	{
		id: "rotary-drills",
		name: "Rotary Drill Rigs",
		category: "Heavy Machinery",
		badge: "Heavy Duty",
		icon: Cog,
		priceLabel: "From $184,000",
	},
	{
		id: "conveyor-systems",
		name: "Conveyor Systems",
		category: "Material Handling",
		badge: "In-Stock",
		icon: Route,
		priceLabel: "From $28,450 / m",
	},
	{
		id: "pressure-valves",
		name: "Hydraulic Pressure Valves",
		category: "Precision Components",
		badge: "Specialized",
		icon: Wrench,
		priceLabel: "From $1,150",
	},
]

const selected = ref<string[]>(["rotary-drills", "pressure-valves"])
function toggle(id: string) {
	const set = new Set(selected.value)
	if (set.has(id))
		set.delete(id)
	else
		set.add(id)
	selected.value = [...set]
}

const projectId = ref("NB-2026-STRUCTURAL")
const timeline = ref("15-30")
const budgetMin = ref("750000")
const budgetMax = ref("950000")
const technicalSpecs = ref("ASTM A6/A6M compliant structural steel. ISO 9001 certified vendors. Priority routing through Fremantle Terminal. Verification of heat treatment logs at source.")
const acceptCompliance = ref(true)

const infoCards = [
	{
		icon: ShieldCheck,
		title: "Compliance Check",
		description: "Each estimate is cross-referenced with your operational compliance profile before being released to supplier partners.",
	},
	{
		icon: Sparkles,
		title: "RFP Negotiation",
		description: "Upgrade estimates into formal RFP negotiations directly from the draft view. Vendor-side counterparts are notified automatically.",
	},
	{
		icon: Route,
		title: "Logistics Routing",
		description: "Site geography, hazard class, and carrier capacity are considered during quotation to reduce downstream revisions.",
	},
]

function handleValidate() {
	if (selected.value.length === 0) {
		toast.error("Select at least one asset class.")
		return
	}
	toast.success("Estimate parameters validated. Supplier network notified.")
}
</script>

<template>
	<div class="space-y-8">
		<section class="space-y-2">
			<p class="text-muted-foreground text-[0.68rem] font-bold tracking-[0.24em] uppercase">
				Quotation Workflow
			</p>

			<h1
				class="text-foreground text-5xl font-extrabold tracking-[-0.045em]"
				style="font-family: var(--font-display);"
			>
				Request Estimate
			</h1>

			<p class="text-muted-foreground max-w-2xl text-sm leading-7">
				Initiate a custom quotation against the SupplyKey supplier network. Select asset classes and define project parameters — estimates return within 24 operational hours.
			</p>
		</section>

		<section class="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
			<div class="space-y-6">
				<div class="border-border/60 bg-card rounded-md border p-6">
					<h2
						class="text-foreground mb-5 text-lg font-extrabold tracking-[-0.015em]"
						style="font-family: var(--font-display);"
					>
						Asset Selection
					</h2>

					<div class="grid gap-3 md:grid-cols-3">
						<button
							v-for="asset in assets"
							:key="asset.id"
							type="button"
							class="bg-muted flex flex-col items-start gap-3 rounded-md border-2 p-5 text-left transition-all"
							:class="selected.includes(asset.id) ? 'border-primary bg-primary/5' : 'border-transparent hover:border-border'"
							@click="toggle(asset.id)"
						>
							<div class="flex w-full items-center justify-between">
								<component
									:is="asset.icon"
									class="size-6"
									:class="selected.includes(asset.id) ? 'text-primary' : 'text-muted-foreground'"
								/>

								<span class="bg-background text-muted-foreground rounded-sm px-2 py-0.5 text-[0.58rem] font-bold tracking-[0.14em] uppercase">
									{{ asset.badge }}
								</span>
							</div>

							<div>
								<p
									class="text-foreground text-base font-bold tracking-[-0.01em]"
									style="font-family: var(--font-display);"
								>
									{{ asset.name }}
								</p>

								<p class="text-muted-foreground mt-0.5 text-xs">
									{{ asset.category }}
								</p>
							</div>

							<p class="text-primary text-[0.68rem] font-bold tracking-[0.12em] uppercase">
								{{ asset.priceLabel }}
							</p>
						</button>
					</div>
				</div>

				<div class="border-border/60 bg-card rounded-md border p-6">
					<h2
						class="text-foreground mb-5 text-lg font-extrabold tracking-[-0.015em]"
						style="font-family: var(--font-display);"
					>
						Project Parameters
					</h2>

					<div class="grid gap-5 md:grid-cols-2">
						<div>
							<label class="text-muted-foreground text-[0.62rem] font-bold tracking-[0.2em] uppercase">
								Project Identifier
							</label>

							<input
								v-model="projectId"
								type="text"
								class="bg-muted text-foreground focus:ring-primary/40 mt-2 w-full rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
							>
						</div>

						<div>
							<label class="text-muted-foreground text-[0.62rem] font-bold tracking-[0.2em] uppercase">
								Target Timeline
							</label>

							<select
								v-model="timeline"
								class="bg-muted text-foreground focus:ring-primary/40 mt-2 w-full rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
							>
								<option value="asap">
									ASAP · Priority dispatch
								</option>

								<option value="15-30">
									15–30 days
								</option>

								<option value="quarterly">
									Quarterly planning horizon
								</option>
							</select>
						</div>

						<div>
							<label class="text-muted-foreground text-[0.62rem] font-bold tracking-[0.2em] uppercase">
								Budget Range (Min)
							</label>

							<input
								v-model="budgetMin"
								type="text"
								placeholder="USD"
								class="bg-muted text-foreground focus:ring-primary/40 mt-2 w-full rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
							>
						</div>

						<div>
							<label class="text-muted-foreground text-[0.62rem] font-bold tracking-[0.2em] uppercase">
								Budget Range (Max)
							</label>

							<input
								v-model="budgetMax"
								type="text"
								placeholder="USD"
								class="bg-muted text-foreground focus:ring-primary/40 mt-2 w-full rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:outline-none"
							>
						</div>

						<div class="md:col-span-2">
							<label class="text-muted-foreground text-[0.62rem] font-bold tracking-[0.2em] uppercase">
								Technical Specifications
							</label>

							<textarea
								v-model="technicalSpecs"
								rows="4"
								class="bg-muted text-foreground focus:ring-primary/40 mt-2 w-full resize-none rounded-md px-3 py-2.5 text-sm leading-6 focus:ring-2 focus:outline-none"
							/>
						</div>

						<label class="text-muted-foreground flex items-start gap-3 text-sm md:col-span-2">
							<input
								v-model="acceptCompliance"
								type="checkbox"
								class="border-border text-primary mt-1 size-4 rounded"
							>

							<span>I confirm the project meets SupplyKey compliance baselines and vendor-side safety disclosures are attached.</span>
						</label>
					</div>
				</div>

				<div class="grid gap-3 md:grid-cols-3">
					<div
						v-for="card in infoCards"
						:key="card.title"
						class="border-border/60 bg-card rounded-md border p-5"
					>
						<component
							:is="card.icon"
							class="text-primary size-5"
						/>

						<p
							class="text-foreground mt-3 text-sm font-bold tracking-[-0.01em]"
							style="font-family: var(--font-display);"
						>
							{{ card.title }}
						</p>

						<p class="text-muted-foreground mt-1 text-xs leading-5">
							{{ card.description }}
						</p>
					</div>
				</div>
			</div>

			<aside class="space-y-4 xl:sticky xl:top-24 xl:self-start">
				<div class="border-primary/20 bg-primary text-primary-foreground rounded-md border p-6">
					<p
						class="text-primary-foreground/70 text-[0.62rem] font-bold tracking-[0.2em] uppercase"
						style="font-family: var(--font-display);"
					>
						Draft Estimate
					</p>

					<div class="mt-5 space-y-3">
						<div class="bg-primary-foreground/10 rounded-md p-3">
							<p class="text-primary-foreground/60 text-[0.62rem] font-bold tracking-[0.18em] uppercase">
								Assets Selected
							</p>

							<p
								class="metric-value mt-1 text-3xl font-extrabold"
								style="font-family: var(--font-display);"
							>
								{{ selected.length }}
							</p>
						</div>

						<div class="flex items-center justify-between text-xs">
							<span class="text-primary-foreground/70">Logistics Estimate</span>

							<span class="font-semibold tabular-nums">TBD</span>
						</div>

						<div class="flex items-center justify-between text-xs">
							<span class="text-primary-foreground/70">Response SLA</span>

							<span class="font-semibold">24h operational</span>
						</div>
					</div>

					<button
						type="button"
						class="bg-primary-foreground text-primary mt-5 flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-[0.68rem] font-extrabold tracking-[0.16em] uppercase transition-all hover:brightness-95"
						style="font-family: var(--font-display);"
						@click="handleValidate"
					>
						<CheckCircle2 class="size-4" />
						Validate Parameters
					</button>
				</div>

				<div class="border-border/60 bg-card rounded-md border p-5">
					<div class="text-muted-foreground flex items-center gap-2">
						<Clock class="size-4" />

						<p class="text-[0.62rem] font-bold tracking-[0.18em] uppercase">
							Active Quotations
						</p>
					</div>

					<p
						class="metric-value text-foreground mt-3 text-3xl font-extrabold"
						style="font-family: var(--font-display);"
					>
						24.8k
					</p>

					<p class="text-muted-foreground mt-1 text-xs">
						Processed across the SupplyKey vendor network this quarter.
					</p>
				</div>

				<div class="border-border/60 bg-card rounded-md border p-5">
					<div class="text-muted-foreground flex items-center gap-2">
						<FileBarChart2 class="size-4" />

						<p class="text-[0.62rem] font-bold tracking-[0.18em] uppercase">
							Efficiency Rating
						</p>
					</div>

					<p
						class="metric-value text-foreground mt-3 text-3xl font-extrabold"
						style="font-family: var(--font-display);"
					>
						98.2%
					</p>

					<p class="text-muted-foreground mt-1 text-xs">
						Estimate-to-delivery accuracy across the last 12 months.
					</p>
				</div>
			</aside>
		</section>
	</div>
</template>
