<script setup lang="ts">
import { SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/utils"
import supplykeyLogo from "~/assets/supplykey_logo.png"
import type { AppBreadcrumbItem } from "~/components/app-shell"

const {
	breadcrumbs,
	contentClass = "",
	showBreadcrumbs = true,
	showHeader = true,
	showSidebar = true,
	showSidebarTrigger = true,
	showThemeToggle = true,
} = defineProps<{
	breadcrumbs?: AppBreadcrumbItem[]
	contentClass?: string
	showBreadcrumbs?: boolean
	showHeader?: boolean
	showSidebar?: boolean
	showSidebarTrigger?: boolean
	showThemeToggle?: boolean
}>()

const defaultOpen = useCookie<boolean>("sidebar_state", { default: () => true })
</script>

<template>
	<SidebarProvider :default-open="defaultOpen">
		<ToastContainer />

		<AppSidebar v-if="showSidebar" />

		<NuxtLoadingIndicator />

		<main class="app-shell-grid relative flex min-h-screen flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out">
			<div class="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,var(--page-glow-1),transparent_72%)] opacity-75 dark:opacity-35" />
			<div class="pointer-events-none absolute inset-y-0 right-0 w-80 bg-[radial-gradient(circle_at_center,var(--page-glow-2),transparent_70%)] opacity-55 dark:opacity-20" />

			<AppHeader
				v-if="showHeader"
				:breadcrumbs="breadcrumbs"
				:show-breadcrumbs="showBreadcrumbs"
				:show-sidebar-trigger="showSidebar && showSidebarTrigger"
				:show-theme-toggle="showThemeToggle"
			/>

			<div :class="cn('relative z-10 mx-auto flex w-full max-w-420 flex-1 flex-col px-4 pb-8 pt-4 md:px-8 md:pb-10 md:pt-6', contentClass)">
				<slot />
			</div>

			<footer class="relative z-10 border-t border-border/40 bg-background/60 py-4 backdrop-blur-sm">
				<div class="flex items-center justify-center gap-2 leading-none">
					<span class="text-[0.6rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase leading-none">
						Powered by
					</span>
					<img
						:src="supplykeyLogo"
						alt="SupplyKey"
						class="block h-3 w-auto"
					>
				</div>
			</footer>
		</main>
	</SidebarProvider>
</template>

