<script setup lang="ts">
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { AppBreadcrumbItem } from "~/components/app-shell"

const {
	breadcrumbs,
	showBreadcrumbs = true,
	showSidebarTrigger = true,
	showThemeToggle = true,
} = defineProps<{
	breadcrumbs?: AppBreadcrumbItem[]
	showBreadcrumbs?: boolean
	showSidebarTrigger?: boolean
	showThemeToggle?: boolean
}>()

const route = useRoute()

const generatedBreadcrumbItems = computed<AppBreadcrumbItem[]>(() => {
	const segments = route.path.split("/").filter(Boolean)
	const items: AppBreadcrumbItem[] = [
		{
			label: "Starter",
			href: route.path === "/dashboard" ? undefined : "/dashboard",
		},
	]

	let currentPath = ""
	for (const segment of segments) {
		if (segment === "dashboard") {
			continue
		}

		currentPath += `/${segment}`

		items.push({
			label: segment
				.split("-")
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" "),
			href: currentPath === route.path ? undefined : currentPath,
		})
	}

	return items
})

const breadcrumbItems = computed(() => breadcrumbs ?? generatedBreadcrumbItems.value)
</script>

<template>
	<header class="border-border/60 bg-background/72 sticky top-0 z-10 flex h-18 shrink-0 items-center gap-3 border-b px-4 backdrop-blur-xl md:px-8">
		<SidebarTrigger
			v-if="showSidebarTrigger"
			class="shrink-0"
		/>

		<div class="flex min-w-0 flex-1 items-center gap-3">
			<Breadcrumb v-if="showBreadcrumbs && breadcrumbItems.length">
				<BreadcrumbList>
					<template
						v-for="(item, index) in breadcrumbItems"
						:key="item.href ?? `${item.label}-${index}`"
					>
						<BreadcrumbItem>
							<BreadcrumbLink
								v-if="item.href"
								as-child
							>
								<NuxtLink :to="item.href">
									{{ item.label }}
								</NuxtLink>
							</BreadcrumbLink>

							<BreadcrumbPage v-else>
								{{ item.label }}
							</BreadcrumbPage>
						</BreadcrumbItem>

						<BreadcrumbSeparator v-if="index < breadcrumbItems.length - 1" />
					</template>
				</BreadcrumbList>
			</Breadcrumb>

			<div class="bg-border/70 hidden h-5 w-px lg:block" />

			<div class="border-border/70 bg-card/78 text-muted-foreground hidden items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium lg:flex">
				<span class="status-dot text-primary" />
				Starter Console
			</div>
		</div>

		<div class="ml-auto flex items-center gap-2">
			<ThemeToggle v-if="showThemeToggle" />
		</div>
	</header>
</template>

