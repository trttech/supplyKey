import type { EnquiryThread } from "#shared/types/enquiry"
import { enquiriesRepo } from "~~/server/utils/db"
import { requireSessionUser } from "~~/server/utils/auth"

export default defineEventHandler(async (event): Promise<EnquiryThread> => {
	const user = await requireSessionUser(event)
	const number = getRouterParam(event, "number")

	if (!number) {
		throw createError({ statusCode: 400, statusMessage: "Enquiry number is required" })
	}

	const result = await enquiriesRepo.findByNumber(number, user.id)

	if (!result) {
		throw createError({ statusCode: 404, statusMessage: "Enquiry not found" })
	}

	const { enquiry, messages } = result

	return {
		id: enquiry.id,
		enquiryNumber: enquiry.enquiry_number,
		subject: enquiry.subject,
		productSku: enquiry.product_sku,
		supplierName: enquiry.supplier_name,
		status: enquiry.status,
		priority: enquiry.priority,
		createdAt: new Date(enquiry.created_at).toISOString(),
		messages: messages.map(m => ({
			id: m.id,
			authorName: m.author_name,
			authorRole: m.author_role,
			body: m.body,
			attachmentName: m.attachment_name,
			createdAt: new Date(m.created_at).toISOString(),
		})),
	}
})
