<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Moon, Sun } from "lucide-vue-next"

const colorMode = useColorMode()
</script>

<template>
	<DropdownMenu>
		<DropdownMenuTrigger as-child>
			<Button
				variant="outline"
				size="icon"
				class="relative rounded-xl"
			>
				<Sun class="h-6 w-6 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />

				<Moon class="absolute h-6 w-6 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />

				<span class="sr-only">Toggle theme</span>
			</Button>
		</DropdownMenuTrigger>

		<DropdownMenuContent
			align="end"
			class="w-40"
		>
			<DropdownMenuItem @click="colorMode.preference = 'light'">
				Light
			</DropdownMenuItem>

			<DropdownMenuItem @click="colorMode.preference = 'dark'">
				Dark
			</DropdownMenuItem>

			<DropdownMenuItem @click="colorMode.preference = 'system'">
				System
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
