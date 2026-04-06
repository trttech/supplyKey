import { authRepo } from "~~/server/utils/db"
import { requireSessionUser } from "~~/server/utils/auth"

export default defineEventHandler(async (event) => {
	const sessionUser = await requireSessionUser(event)
	const user = await authRepo.findUserById(sessionUser.id)

	if (!user || user.deactivated) {
		throw createError({
			statusCode: 404,
			statusMessage: "User not found",
		})
	}

	return user
})

