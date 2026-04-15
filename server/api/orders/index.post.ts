import { checkoutSchema } from "#shared/schemas/checkout"
import type { CheckoutResponse } from "#shared/types/order"
import { EmptyCartError, ordersRepo } from "~~/server/utils/db"
import { requireSessionUser } from "~~/server/utils/auth"

export default defineEventHandler(async (event): Promise<CheckoutResponse> => {
	const user = await requireSessionUser(event)
	const body = await readValidatedBody(event, checkoutSchema.parse)

	try {
		const order = await ordersRepo.createFromCart(user.id, body)
		return { orderNumber: order.order_number }
	}
	catch (error) {
		if (error instanceof EmptyCartError) {
			throw createError({ statusCode: 400, statusMessage: "Cart is empty" })
		}
		throw error
	}
})
