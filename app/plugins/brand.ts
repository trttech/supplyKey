import { useBrand } from "~/composables/useBrand"

export default defineNuxtPlugin(async () => {
	const { brand, refresh } = useBrand()

	if (!brand.value) {
		await refresh()
	}

	useHead({
		style: [
			{
				tagPosition: "bodyClose",
				innerHTML: () => {
					const b = brand.value
					if (!b)
						return ""
					return `:root, .dark {
						--primary: ${b.primaryColor} !important;
						--ring: ${b.primaryColor} !important;
						--sidebar: ${b.sidebarColor} !important;
						--sidebar-background: ${b.sidebarColor} !important;
						--sidebar-primary: ${b.primaryColor} !important;
						--chart-1: ${b.primaryColor} !important;
						--accent: ${b.accentColor} !important;
					}`
				},
			},
		],
	})
})
