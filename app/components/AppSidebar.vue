<script setup lang="ts">
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BookOpenText, LayoutDashboard, Users } from "lucide-vue-next"
import type { AppNavItem } from "~/components/app-shell"

const route = useRoute()

const menuGroups = computed(() => [
	{
		title: "Workspace",
		items: [
			{
				label: "Overview",
				description: "Starter dashboard",
				href: "/dashboard",
				icon: LayoutDashboard,
			},
			{
				label: "Users",
				description: "Protected datatable example",
				href: "/users",
				icon: Users,
			},
		] satisfies AppNavItem[],
	},
	{
		title: "References",
		items: [
			{
				label: "Setup guide",
				description: "Backend and database notes",
				href: "/",
				icon: BookOpenText,
			},
		] satisfies AppNavItem[],
	},
])

const isActive = (path: string) => route.path === path
</script>

<template>
	<Sidebar collapsible="icon">
		<SidebarHeader class="p-2.5 group-data-[collapsible=icon]:px-1.5 group-data-[collapsible=icon]:py-2">
			<SidebarMenu class="border-sidebar-border/70 border-b pb-3 group-data-[collapsible=icon]:pb-2">
				<SidebarMenuItem>
					<SidebarMenuButton
						as-child
						size="lg"
						class="h-auto rounded-xl px-2.5 py-2.5 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-lg group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0"
					>
						<NuxtLink to="/dashboard">
							<div class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-xl text-sm font-semibold tracking-[-0.04em] group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-lg">
								FS
							</div>

							<div class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
								<span class="truncate text-[0.95rem] font-semibold tracking-[-0.03em]">Fullstack Starter</span>
								<span class="text-sidebar-foreground/58 truncate text-[0.72rem]">Nuxt, Kysely, queue, auth</span>
							</div>
						</NuxtLink>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarHeader>

		<SidebarContent class="overflow-x-hidden px-2.5 pb-2.5 [scrollbar-width:none] group-data-[collapsible=icon]:px-1.5 [&::-webkit-scrollbar]:hidden">
			<SidebarGroup
				v-for="group in menuGroups"
				:key="group.title"
			>
				<SidebarGroupLabel class="text-sidebar-foreground/45 px-3 text-[0.68rem] font-semibold tracking-[0.2em] uppercase">
					{{ group.title }}
				</SidebarGroupLabel>

				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem
							v-for="item in group.items"
							:key="item.href"
						>
							<SidebarMenuButton
								as-child
								:tooltip="item.label"
								:is-active="isActive(item.href)"
							>
								<NuxtLink :to="item.href">
									<component :is="item.icon" />
									<span>{{ item.label }}</span>
								</NuxtLink>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>

		<SidebarFooter class="mt-auto p-2.5 pt-0 group-data-[collapsible=icon]:px-1.5">
			<UserMenu />
		</SidebarFooter>
	</Sidebar>
</template>

