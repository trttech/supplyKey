import { z } from "zod"

export const checkoutSchema = z.object({
	deliverySite: z.string().min(1, "Delivery site is required"),
	carrier: z.string().min(1, "Carrier is required"),
	paymentMethod: z.string().min(1, "Payment method is required"),
	poNumber: z.string().optional(),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>

export const cartItemAddSchema = z.object({
	productId: z.number().int().positive(),
	quantity: z.number().int().positive().default(1),
})

export const cartItemUpdateSchema = z.object({
	quantity: z.number().int().min(0),
})
