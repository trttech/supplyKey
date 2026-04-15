import type { OrderDetail } from "#shared/types/order"
import { ordersRepo } from "~~/server/utils/db"
import { requireSessionUser } from "~~/server/utils/auth"

export default defineEventHandler(async (event): Promise<OrderDetail> => {
	const user = await requireSessionUser(event)
	const orderNumber = getRouterParam(event, "number")

	if (!orderNumber) {
		throw createError({ statusCode: 400, statusMessage: "Order number is required" })
	}

	const result = await ordersRepo.findByNumber(orderNumber, user.id)

	if (!result) {
		throw createError({ statusCode: 404, statusMessage: "Order not found" })
	}

	const { order, items } = result

	return {
		id: order.id,
		orderNumber: order.order_number,
		status: order.status,
		subtotalCents: order.subtotal_cents,
		shippingCents: order.shipping_cents,
		taxCents: order.tax_cents,
		totalCents: order.total_cents,
		paymentMethod: order.payment_method,
		poNumber: order.po_number,
		deliverySite: order.delivery_site,
		carrier: order.carrier,
		placedAt: new Date(order.placed_at).toISOString(),
		lines: items.map(item => ({
			id: item.id,
			productId: item.product_id,
			sku: item.sku,
			name: item.name,
			unitPriceCents: item.unit_price_cents,
			quantity: item.quantity,
			lineTotalCents: item.unit_price_cents * item.quantity,
		})),
	}
})
