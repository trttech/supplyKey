import { userRepo } from "~~/server/utils/db"
import { requireSessionUser } from "~~/server/utils/auth"

export default defineEventHandler(async (event) => {
	await requireSessionUser(event)

	const users = await userRepo.listUsers()

	return {
		users,
	}
})
