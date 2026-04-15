export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "made_to_order"

export interface ProductListItem {
	id: number
	sku: string
	name: string
	description: string
	category: string
	manufacturer: string
	imageUrl: string | null
	priceCents: number
	stockStatus: string
	tags: string[]
}

export interface ProductFilters {
	category?: string
	manufacturer?: string
	q?: string
	page?: number
}

export interface ProductListResponse {
	items: ProductListItem[]
	total: number
	facets: {
		categories: Array<{ value: string, count: number }>
		manufacturers: Array<{ value: string, count: number }>
	}
}
