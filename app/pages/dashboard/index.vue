<script setup lang="ts">
import { Mail, Shield, UserRoundCheck, Users } from "@lucide/vue"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDateTime } from "@/utils"

definePageMeta({
	layout: "dashboard",
	middleware: ["authenticated"],
})

useHead({
	title: "Dashboard",
})

const { data, pending, refresh } = await useFetch("/api/dashboard/stats")

const cards = computed(() => {
	const stats = data.value
	return [
		{
			label: "Total users",
			value: stats?.totals.users ?? 0,
			description: "Every account created through magic-link auth.",
			icon: Users,
		},
		{
			label: "Verified users",
			value: stats?.totals.verified_users ?? 0,
			description: "Users who completed at least one sign-in.",
			icon: UserRoundCheck,
		},
		{
			label: "Admins",
			value: stats?.totals.admins ?? 0,
			description: "The first created user becomes admin automatically.",
			icon: Shield,
		},
		{
			label: "Queued auth emails",
			value: stats?.totals.queued_auth_emails ?? 0,
			description: "Live pg-boss queue depth for magic-link delivery.",
			icon: Mail,
		},
	]
})
</script>

<template>
	<div class="space-y-8">
		<section class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
			<div class="space-y-2">
				<p class="text-muted-foreground text-sm font-semibold tracking-[0.16em] uppercase">
					Overview
				</p>

				<h1 class="text-4xl font-semibold tracking-[-0.05em]">
					Starter dashboard
				</h1>

				<p class="text-muted-foreground max-w-2xl text-sm leading-7">
					This page proves the template end to end: protected routes, database-backed metrics,
					and a running queue.
				</p>
			</div>

			<Button
				variant="outline"
				class="rounded-xl"
				@click="refresh"
			>
				Refresh
			</Button>
		</section>

		<section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
			<Card
				v-for="card in cards"
				:key="card.label"
				class="surface-panel surface-outline rounded-[1.6rem] border"
			>
				<CardHeader class="pb-4">
					<div class="flex items-center justify-between gap-3">
						<div>
							<CardDescription class="text-xs font-semibold tracking-[0.16em] uppercase">
								{{ card.label }}
							</CardDescription>

							<CardTitle class="metric-value mt-3 text-4xl">
								{{ pending ? "..." : card.value }}
							</CardTitle>
						</div>

						<div class="bg-primary/12 text-primary flex size-11 items-center justify-center rounded-2xl">
							<component
								:is="card.icon"
								class="size-5"
							/>
						</div>
					</div>
				</CardHeader>

				<CardContent>
					<p class="text-muted-foreground text-sm leading-6">
						{{ card.description }}
					</p>
				</CardContent>
			</Card>
		</section>

		<section class="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
			<Card class="surface-panel surface-outline rounded-[1.6rem] border">
				<CardHeader>
					<CardTitle class="tracking-[-0.03em]">
						Recent users
					</CardTitle>

					<CardDescription>
						Newest accounts are surfaced here so the dashboard has a concrete database view.
					</CardDescription>
				</CardHeader>

				<CardContent class="space-y-4">
					<div
						v-for="user in data?.recentUsers || []"
						:key="user.id"
						class="border-border/70 bg-card/60 flex items-center justify-between gap-4 rounded-[1.2rem] border px-4 py-3"
					>
						<div class="space-y-1">
							<p class="font-medium">
								{{ user.name || user.email }}
							</p>

							<p class="text-muted-foreground text-sm">
								{{ user.email }}
							</p>
						</div>

						<div class="text-right text-sm">
							<p class="capitalize">
								{{ user.role }}
							</p>

							<p class="text-muted-foreground">
								{{ formatDateTime(user.created_at) }}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card class="surface-panel surface-outline rounded-[1.6rem] border">
				<CardHeader>
					<CardTitle class="tracking-[-0.03em]">
						What to replace first
					</CardTitle>
				</CardHeader>

				<CardContent class="text-muted-foreground space-y-4 text-sm leading-7">
					<p>Swap the `users` schema for your own domain tables.</p>

					<p>Replace the auth email template with branded copy or your provider integration.</p>

					<p>Keep the shell and datatable layer, then add domain routes behind the same middleware.</p>
				</CardContent>
			</Card>
		</section>
	</div>
</template>
