import { Database } from "../base"
import type { ProductRecord } from "../types"

export interface ProductListQuery {
	category?: string
	manufacturer?: string
	q?: string
	limit?: number
	offset?: number
}

class ProductsRepository extends Database {
	private static productsInstance: ProductsRepository | null = null

	private constructor() {
		super(Database.getInstance().getQueryBuilder())
	}

	static override getInstance() {
		if (!ProductsRepository.productsInstance) {
			ProductsRepository.productsInstance = new ProductsRepository()
		}

		return ProductsRepository.productsInstance
	}

	async list(query: ProductListQuery = {}) {
		const { category, manufacturer, q, limit = 48, offset = 0 } = query

		let builder = this.db.selectFrom("products").selectAll()

		if (category) {
			builder = builder.where("category", "=", category)
		}

		if (manufacturer) {
			builder = builder.where("manufacturer", "=", manufacturer)
		}

		if (q && q.trim().length > 0) {
			const like = `%${q.trim()}%`
			builder = builder.where(eb => eb.or([
				eb("name", "ilike", like),
				eb("sku", "ilike", like),
				eb("description", "ilike", like),
			]))
		}

		return builder.orderBy("name", "asc").limit(limit).offset(offset).execute()
	}

	async countFiltered(query: ProductListQuery = {}) {
		const { category, manufacturer, q } = query

		let builder = this.db.selectFrom("products").select(eb => eb.fn.count<number>("id").as("count"))

		if (category) {
			builder = builder.where("category", "=", category)
		}
		if (manufacturer) {
			builder = builder.where("manufacturer", "=", manufacturer)
		}
		if (q && q.trim().length > 0) {
			const like = `%${q.trim()}%`
			builder = builder.where(eb => eb.or([
				eb("name", "ilike", like),
				eb("sku", "ilike", like),
				eb("description", "ilike", like),
			]))
		}

		const row = await builder.executeTakeFirstOrThrow()
		return Number(row.count)
	}

	async listFacets() {
		const [categories, manufacturers] = await Promise.all([
			this.db
				.selectFrom("products")
				.select("category")
				.select(eb => eb.fn.count<number>("id").as("count"))
				.groupBy("category")
				.orderBy("category", "asc")
				.execute(),
			this.db
				.selectFrom("products")
				.select("manufacturer")
				.select(eb => eb.fn.count<number>("id").as("count"))
				.groupBy("manufacturer")
				.orderBy("manufacturer", "asc")
				.execute(),
		])

		return {
			categories: categories.map(row => ({ value: row.category, count: Number(row.count) })),
			manufacturers: manufacturers.map(row => ({ value: row.manufacturer, count: Number(row.count) })),
		}
	}

	async findById(id: number): Promise<ProductRecord | undefined> {
		return this.db.selectFrom("products").selectAll().where("id", "=", id).executeTakeFirst()
	}

	async findBySku(sku: string): Promise<ProductRecord | undefined> {
		return this.db.selectFrom("products").selectAll().where("sku", "=", sku).executeTakeFirst()
	}
}

export const productsRepo = ProductsRepository.getInstance()
