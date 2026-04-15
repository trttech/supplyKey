import { cartItemUpdateSchema } from "#shared/schemas/checkout"
import { cartRepo } from "~~/server/utils/db"
import { requireSessionUser } from "~~/server/utils/auth"

export default defineEventHandler(async (event) => {
	const user = await requireSessionUser(event)
	const idParam = getRouterParam(event, "id")
	const id = idParam ? Number.parseInt(idParam, 10) : Number.NaN

	if (!Number.isFinite(id) || id <= 0) {
		throw createError({ statusCode: 400, statusMessage: "Invalid cart item id" })
	}

	const body = await readValidatedBody(event, cartItemUpdateSchema.parse)
	await cartRepo.updateQuantity(id, user.id, body.quantity)

	return { success: true }
})
