import type { H3Event } from "h3"
import type { UserRole } from "../db/types"

export interface SessionUser {
	id: number
	email: string
	name: string | null
	role: UserRole
	email_verified: boolean
	last_active_at: Date | null
	created_at: Date
}

export async function requireSessionUser(event: H3Event) {
	const session = await getUserSession(event) as { user?: SessionUser }

	if (!session.user) {
		throw createError({
			statusCode: 401,
			statusMessage: "Unauthorized",
		})
	}

	return session.user
}
