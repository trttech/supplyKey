import type { EnquirySummary } from "#shared/types/enquiry"
import { enquiriesRepo } from "~~/server/utils/db"
import { requireSessionUser } from "~~/server/utils/auth"

export default defineEventHandler(async (event): Promise<EnquirySummary[]> => {
	const user = await requireSessionUser(event)

	const enquiries = await enquiriesRepo.listForUser(user.id)
	const lastMessages = await enquiriesRepo.listLastMessages(enquiries.map(e => e.id))
	const previewById = new Map(lastMessages.map(row => [row.enquiry_id, row.body]))

	return enquiries.map(e => ({
		id: e.id,
		enquiryNumber: e.enquiry_number,
		subject: e.subject,
		productSku: e.product_sku,
		supplierName: e.supplier_name,
		status: e.status,
		priority: e.priority,
		updatedAt: new Date(e.updated_at ?? e.created_at).toISOString(),
		lastMessagePreview: previewById.get(e.id)?.slice(0, 160) ?? "",
	}))
})
