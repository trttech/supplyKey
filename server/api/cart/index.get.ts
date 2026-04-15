import type { CartLine, CartSummary } from "#shared/types/cart"
import { cartRepo } from "~~/server/utils/db"
import { requireSessionUser } from "~~/server/utils/auth"

function buildSummary(lines: CartLine[]): CartSummary {
	const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)
	const subtotalCents = lines.reduce((sum, line) => sum + line.lineTotalCents, 0)
	const shippingCents = lines.length > 0 ? 18500 : 0
	const taxCents = Math.round(subtotalCents * 0.015)
	const totalCents = subtotalCents + shippingCents + taxCents

	return {
		lines,
		itemCount,
		subtotalCents,
		shippingCents,
		taxCents,
		totalCents,
	}
}

export default defineEventHandler(async (event): Promise<CartSummary> => {
	const user = await requireSessionUser(event)
	const rows = await cartRepo.listForUser(user.id)

	const lines: CartLine[] = rows.map(row => ({
		id: row.id,
		productId: row.product_id,
		sku: row.sku,
		name: row.name,
		category: row.category,
		manufacturer: row.manufacturer,
		imageUrl: row.image_url,
		unitPriceCents: row.price_cents,
		quantity: row.quantity,
		lineTotalCents: row.price_cents * row.quantity,
	}))

	return buildSummary(lines)
})
