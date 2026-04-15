import { postMessageSchema } from "#shared/schemas/enquiry"
import { enquiriesRepo } from "~~/server/utils/db"
import { requireSessionUser } from "~~/server/utils/auth"

export default defineEventHandler(async (event) => {
	const user = await requireSessionUser(event)
	const enquiryNumber = getRouterParam(event, "number")

	if (!enquiryNumber) {
		throw createError({ statusCode: 400, statusMessage: "Enquiry number is required" })
	}

	const body = await readValidatedBody(event, postMessageSchema.parse)

	const result = await enquiriesRepo.findByNumber(enquiryNumber, user.id)
	if (!result) {
		throw createError({ statusCode: 404, statusMessage: "Enquiry not found" })
	}

	const { enquiry } = result

	const message = await enquiriesRepo.appendMessage({
		enquiryId: enquiry.id,
		authorName: body.asSupplier ? enquiry.supplier_name : (user.name ?? "Procurement Lead"),
		authorRole: body.asSupplier ? "Supplier" : "Procurement Lead",
		body: body.body,
		nextStatus: body.asSupplier ? "responded" : "reviewing",
	})

	return {
		id: message.id,
		enquiryNumber: enquiry.enquiry_number,
	}
})
