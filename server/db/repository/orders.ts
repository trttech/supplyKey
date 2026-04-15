import { Database } from "../base"
import type { CheckoutInput } from "#shared/schemas/checkout"

export class EmptyCartError extends Error {
	constructor() {
		super("Cart is empty")
		this.name = "EmptyCartError"
	}
}

function generateOrderNumber() {
	const n = Math.floor(1000 + Math.random() * 9000)
	return `REQ-${n}`
}

const SHIPPING_BY_CARRIER: Record<string, number> = {
	heavy_freight: 18500,
	express_courier: 45000,
	standard_logistics: 9500,
}

function computeShipping(carrier: string) {
	return SHIPPING_BY_CARRIER[carrier] ?? 9500
}

function computeTax(subtotalCents: number) {
	// 1.5% environmental tax per prototype copy
	return Math.round(subtotalCents * 0.015)
}

class OrdersRepository extends Database {
	private static ordersInstance: OrdersRepository | null = null

	private constructor() {
		super(Database.getInstance().getQueryBuilder())
	}

	static override getInstance() {
		if (!OrdersRepository.ordersInstance) {
			OrdersRepository.ordersInstance = new OrdersRepository()
		}

		return OrdersRepository.ordersInstance
	}

	async createFromCart(userId: number, input: CheckoutInput) {
		return this.db.transaction().execute(async (trx) => {
			const lines = await trx
				.selectFrom("cart_items")
				.innerJoin("products", "products.id", "cart_items.product_id")
				.select([
					"cart_items.product_id as product_id",
					"cart_items.quantity as quantity",
					"products.sku as sku",
					"products.name as name",
					"products.price_cents as price_cents",
				])
				.where("cart_items.user_id", "=", userId)
				.execute()

			if (lines.length === 0) {
				throw new EmptyCartError()
			}

			const subtotalCents = lines.reduce((sum, line) => sum + line.price_cents * line.quantity, 0)
			const shippingCents = computeShipping(input.carrier)
			const taxCents = computeTax(subtotalCents)
			const totalCents = subtotalCents + shippingCents + taxCents

			let orderNumber = generateOrderNumber()
			for (let attempt = 0; attempt < 5; attempt++) {
				const existing = await trx
					.selectFrom("orders")
					.select("id")
					.where("order_number", "=", orderNumber)
					.executeTakeFirst()

				if (!existing)
					break
				orderNumber = generateOrderNumber()
			}

			const order = await trx
				.insertInto("orders")
				.values({
					order_number: orderNumber,
					user_id: userId,
					subtotal_cents: subtotalCents,
					shipping_cents: shippingCents,
					tax_cents: taxCents,
					total_cents: totalCents,
					payment_method: input.paymentMethod,
					po_number: input.poNumber ?? null,
					delivery_site: input.deliverySite,
					carrier: input.carrier,
				})
				.returningAll()
				.executeTakeFirstOrThrow()

			await trx
				.insertInto("order_items")
				.values(lines.map(line => ({
					order_id: order.id,
					product_id: line.product_id,
					sku: line.sku,
					name: line.name,
					unit_price_cents: line.price_cents,
					quantity: line.quantity,
				})))
				.execute()

			await trx
				.deleteFrom("cart_items")
				.where("user_id", "=", userId)
				.execute()

			return order
		})
	}

	async findByNumber(orderNumber: string, userId: number) {
		const order = await this.db
			.selectFrom("orders")
			.selectAll()
			.where("order_number", "=", orderNumber)
			.where("user_id", "=", userId)
			.executeTakeFirst()

		if (!order)
			return undefined

		const items = await this.db
			.selectFrom("order_items")
			.selectAll()
			.where("order_id", "=", order.id)
			.orderBy("id", "asc")
			.execute()

		return { order, items }
	}

	async countActiveForUser(userId: number) {
		const row = await this.db
			.selectFrom("orders")
			.select(eb => eb.fn.count<number>("id").as("count"))
			.where("user_id", "=", userId)
			.where("status", "in", ["placed", "processing", "shipped"])
			.executeTakeFirstOrThrow()

		return Number(row.count)
	}

	async sumProjectedExpenditureForUser(userId: number) {
		const row = await this.db
			.selectFrom("orders")
			.select(eb => eb.fn.sum<number>("total_cents").as("total"))
			.where("user_id", "=", userId)
			.where("status", "in", ["placed", "processing", "shipped"])
			.executeTakeFirstOrThrow()

		return Number(row.total ?? 0)
	}

	async recentForUser(userId: number, limit = 5) {
		return this.db
			.selectFrom("orders")
			.selectAll()
			.where("user_id", "=", userId)
			.orderBy("placed_at", "desc")
			.limit(limit)
			.execute()
	}
}

export const ordersRepo = OrdersRepository.getInstance()
