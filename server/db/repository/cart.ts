import { Database } from "../base"

class CartRepository extends Database {
	private static cartInstance: CartRepository | null = null

	private constructor() {
		super(Database.getInstance().getQueryBuilder())
	}

	static override getInstance() {
		if (!CartRepository.cartInstance) {
			CartRepository.cartInstance = new CartRepository()
		}

		return CartRepository.cartInstance
	}

	async listForUser(userId: number) {
		return this.db
			.selectFrom("cart_items")
			.innerJoin("products", "products.id", "cart_items.product_id")
			.select([
				"cart_items.id as id",
				"cart_items.product_id as product_id",
				"cart_items.quantity as quantity",
				"products.sku as sku",
				"products.name as name",
				"products.category as category",
				"products.manufacturer as manufacturer",
				"products.image_url as image_url",
				"products.price_cents as price_cents",
			])
			.where("cart_items.user_id", "=", userId)
			.orderBy("cart_items.created_at", "asc")
			.execute()
	}

	async countItemsForUser(userId: number) {
		const row = await this.db
			.selectFrom("cart_items")
			.where("user_id", "=", userId)
			.select(eb => eb.fn.sum<number>("quantity").as("total"))
			.executeTakeFirstOrThrow()

		return Number(row.total ?? 0)
	}

	async addOrIncrement(userId: number, productId: number, quantity: number) {
		return this.db
			.insertInto("cart_items")
			.values({ user_id: userId, product_id: productId, quantity })
			.onConflict(oc => oc.columns(["user_id", "product_id"]).doUpdateSet({
				quantity: eb => eb("cart_items.quantity", "+", quantity),
				updated_at: new Date(),
			}))
			.returningAll()
			.executeTakeFirstOrThrow()
	}

	async updateQuantity(id: number, userId: number, quantity: number) {
		if (quantity <= 0) {
			await this.remove(id, userId)
			return
		}

		await this.db
			.updateTable("cart_items")
			.set({ quantity, updated_at: new Date() })
			.where("id", "=", id)
			.where("user_id", "=", userId)
			.execute()
	}

	async remove(id: number, userId: number) {
		await this.db
			.deleteFrom("cart_items")
			.where("id", "=", id)
			.where("user_id", "=", userId)
			.execute()
	}

	async clearForUser(userId: number) {
		await this.db
			.deleteFrom("cart_items")
			.where("user_id", "=", userId)
			.execute()
	}
}

export const cartRepo = CartRepository.getInstance()
