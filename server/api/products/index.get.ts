import type { ProductListItem, ProductListResponse } from "#shared/types/product"
import type { ProductRecord } from "~~/server/db/types"
import { productsRepo } from "~~/server/utils/db"
import { requireSessionUser } from "~~/server/utils/auth"

function toListItem(row: ProductRecord): ProductListItem {
	return {
		id: row.id,
		sku: row.sku,
		name: row.name,
		description: row.description,
		category: row.category,
		manufacturer: row.manufacturer,
		imageUrl: row.image_url,
		priceCents: row.price_cents,
		stockStatus: row.stock_status,
		tags: row.tags,
	}
}

export default defineEventHandler(async (event): Promise<ProductListResponse> => {
	await requireSessionUser(event)

	const query = getQuery(event)
	const category = typeof query.category === "string" && query.category.length > 0 ? query.category : undefined
	const manufacturer = typeof query.manufacturer === "string" && query.manufacturer.length > 0 ? query.manufacturer : undefined
	const q = typeof query.q === "string" && query.q.length > 0 ? query.q : undefined
	const pageRaw = typeof query.page === "string" ? Number.parseInt(query.page, 10) : 1
	const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1
	const limit = 24
	const offset = (page - 1) * limit

	const [rows, total, facets] = await Promise.all([
		productsRepo.list({ category, manufacturer, q, limit, offset }),
		productsRepo.countFiltered({ category, manufacturer, q }),
		productsRepo.listFacets(),
	])

	return {
		items: rows.map(toListItem),
		total,
		facets,
	}
})
