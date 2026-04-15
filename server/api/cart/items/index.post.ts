import { cartItemAddSchema } from "#shared/schemas/checkout"
import { cartRepo, productsRepo } from "~~/server/utils/db"
import { requireSessionUser } from "~~/server/utils/auth"

export default defineEventHandler(async (event) => {
	const user = await requireSessionUser(event)
	const body = await readValidatedBody(event, cartItemAddSchema.parse)

	const product = await productsRepo.findById(body.productId)
	if (!product) {
		throw createError({ statusCode: 404, statusMessage: "Product not found" })
	}

	const row = await cartRepo.addOrIncrement(user.id, body.productId, body.quantity)

	return { success: true, id: row.id }
})
