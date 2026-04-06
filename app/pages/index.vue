<script setup lang="ts">
import { ArrowRight, Database, LayoutDashboard, Mail, Workflow } from "lucide-vue-next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

definePageMeta({
	layout: "empty",
	middleware: ["authenticated"],
})

useHead({
	title: "Starter",
})

const capabilities = [
	{
		title: "Minimal auth",
		description: "Magic-link sign-in with session cookies and a protected app shell.",
		icon: Mail,
	},
	{
		title: "Database first",
		description: "Kysely repositories, migrations, and typed server routes on Postgres.",
		icon: Database,
	},
	{
		title: "Queue included",
		description: "pg-boss jobs for async mail and background work without extra infra.",
		icon: Workflow,
	},
	{
		title: "Modern dashboard UI",
		description: "Updated layout and datatable patterns pulled from the newer dashboard repo.",
		icon: LayoutDashboard,
	},
]
</script>

<template>
	<div class="relative min-h-screen overflow-hidden">
		<div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,141,52,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(47,143,115,0.14),transparent_30%)]" />

		<div class="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 md:px-10">
			<div class="flex items-center justify-between">
				<Badge class="rounded-full px-3 py-1 text-xs tracking-[0.18em] uppercase">
					Starter Template
				</Badge>

				<ThemeToggle />
			</div>

			<div class="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr]">
				<div class="space-y-8">
					<div class="space-y-4">
						<h1 class="max-w-3xl text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
							Backend discipline with a cleaner dashboard shell.
						</h1>

						<p class="text-muted-foreground max-w-2xl text-lg leading-8">
							This starter merges the database, auth, route, and queue structure from
							`midwives` with the updated visual system and datatable patterns from
							`dashboard`, then strips both down into a reusable base.
						</p>
					</div>

					<div class="flex flex-wrap gap-3">
						<Button
							as-child
							size="lg"
							class="rounded-2xl px-6"
						>
							<NuxtLink to="/auth/login">
								Open auth flow
								<ArrowRight class="ml-2 h-4 w-4" />
							</NuxtLink>
						</Button>

						<Button
							as-child
							variant="outline"
							size="lg"
							class="rounded-2xl px-6"
						>
							<a
								href="https://nuxt.com/docs"
								target="_blank"
								rel="noreferrer"
							>
								Nuxt docs
							</a>
						</Button>
					</div>
				</div>

				<div class="grid gap-4">
					<Card
						v-for="item in capabilities"
						:key="item.title"
						class="surface-panel surface-outline rounded-[1.7rem] border"
					>
						<CardHeader class="pb-3">
							<div class="bg-primary/12 text-primary flex size-12 items-center justify-center rounded-2xl">
								<component
									:is="item.icon"
									class="size-5"
								/>
							</div>

							<CardTitle class="pt-3 text-xl tracking-[-0.03em]">
								{{ item.title }}
							</CardTitle>
						</CardHeader>

						<CardContent>
							<CardDescription class="text-sm leading-6">
								{{ item.description }}
							</CardDescription>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	</div>
</template>

