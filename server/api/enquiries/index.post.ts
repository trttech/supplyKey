import { createEnquirySchema } from "#shared/schemas/enquiry"
import { enquiriesRepo } from "~~/server/utils/db"
import { requireSessionUser } from "~~/server/utils/auth"

export default defineEventHandler(async (event) => {
	const user = await requireSessionUser(event)
	const body = await readValidatedBody(event, createEnquirySchema.parse)

	const enquiry = await enquiriesRepo.create({
		userId: user.id,
		subject: body.subject,
		supplierName: body.supplierName,
		productSku: body.productSku ?? null,
		priority: body.priority,
		initialMessage: {
			authorName: user.name ?? "Procurement Lead",
			authorRole: "Procurement Lead",
			body: body.initialMessage,
		},
	})

	return { enquiryNumber: enquiry.enquiry_number }
})
