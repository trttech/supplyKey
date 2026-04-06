import type { H3Error, H3Event } from "h3"
import { createError, sendError } from "h3"
import { log } from "#shared/log"

export default (error: unknown, event: H3Event) => {
	log.error({ error }, "Global API error caught")

	const h3Error = error as H3Error
	const statusCode = h3Error.statusCode || 500
	const statusMessage = h3Error.statusMessage || "Internal Server Error"
	const clientMessage = statusCode >= 500
		? "An unexpected error occurred"
		: h3Error.message || statusMessage

	return sendError(
		event,
		createError({
			statusCode,
			statusMessage: clientMessage,
			message: clientMessage,
		}),
	)
}

