import type { BrandSettings } from "#shared/types/brand"

export function useBrand() {
	const brand = useState<BrandSettings | null>("brand", () => null)
	const isLoading = useState<boolean>("brand-loading", () => false)

	async function refresh() {
		isLoading.value = true
		try {
			brand.value = await $fetch<BrandSettings>("/api/brand")
		}
		catch {
			// swallow — fall back to static defaults if the endpoint fails
		}
		finally {
			isLoading.value = false
		}
	}

	async function update(patch: Partial<BrandSettings>) {
		const next = await $fetch<BrandSettings>("/api/brand", {
			method: "PATCH",
			body: patch,
		})
		brand.value = next
		return next
	}

	return {
		brand,
		isLoading: readonly(isLoading),
		refresh,
		update,
	}
}
