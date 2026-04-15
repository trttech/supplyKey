import { updateEnquirySchema } from "#shared/schemas/enquiry"
import { enquiriesRepo } from "~~/server/utils/db"
import { requireSessionUser } from "~~/server/utils/auth"

export default defineEventHandler(async (event) => {
	const user = await requireSessionUser(event)
	const enquiryNumber = getRouterParam(event, "number")

	if (!enquiryNumber) {
		throw createError({ statusCode: 400, statusMessage: "Enquiry number is required" })
	}

	const body = await readValidatedBody(event, updateEnquirySchema.parse)

	const existing = await enquiriesRepo.findByNumber(enquiryNumber, user.id)
	if (!existing) {
		throw createError({ statusCode: 404, statusMessage: "Enquiry not found" })
	}

	await enquiriesRepo.update(enquiryNumber, user.id, {
		status: body.status,
		priority: body.priority,
	})

	return { success: true }
})
