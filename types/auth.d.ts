import type { UserRole } from "~/server/db/types"

declare module "#auth-utils" {
	interface User {
		id: number
		email: string
		name: string | null
		role: UserRole
		email_verified: boolean
		last_active_at: Date | null
		created_at: Date
	}

	interface UserSession {
		user: User
	}
}

export {}

