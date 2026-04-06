import { JOB_NAMES } from "~~/server/db/queue/workers"
import type { Queue } from "~~/server/db/queue"
import { userRepo } from "~~/server/utils/db"
import { requireSessionUser } from "~~/server/utils/auth"

export default defineEventHandler(async (event) => {
	await requireSessionUser(event)

	const [totals, recentUsers, queuedAuthEmails] = await Promise.all([
		userRepo.getDashboardStats(),
		userRepo.recentUsers(5),
		(useNitroApp() as ReturnType<typeof useNitroApp> & { queue?: Queue }).queue?.getQueueSize(JOB_NAMES.SEND_AUTH_LINK_EMAIL) ?? Promise.resolve(0),
	])

	return {
		totals: {
			users: totals.users,
			verified_users: totals.verifiedUsers,
			admins: totals.admins,
			queued_auth_emails: queuedAuthEmails,
		},
		recentUsers,
	}
})
