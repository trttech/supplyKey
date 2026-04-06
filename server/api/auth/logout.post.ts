import { log } from "#shared/log"

export default defineEventHandler(async (event) => {
	const session = await getUserSession(event) as { user?: { id: number } }

	if (session.user) {
		log.info({ userId: session.user.id }, "User logging out")
	}

	await clearUserSession(event)

	return {
		success: true,
	}
})
