import type { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely"

export type UserRole = "admin" | "member"

export interface UsersTable {
	id: Generated<number>
	email: string
	name: string | null
	role: UserRole
	email_verified: boolean
	last_active_at: ColumnType<Date | null, Date | string | null | undefined, Date | string | null | undefined>
	deactivated: boolean
	created_at: Generated<Date>
	updated_at: ColumnType<Date | null, never, Date | string | null | undefined>
}

export interface EmailAuthTokensTable {
	id: Generated<number>
	user_id: number
	token_hash: string
	created_at: Generated<Date>
	expires_at: ColumnType<Date, Date | string, Date | string>
	used_at: ColumnType<Date | null, Date | string | null | undefined, Date | string | null | undefined>
	revoked_at: ColumnType<Date | null, Date | string | null | undefined, Date | string | null | undefined>
	ip_address: string | null
	user_agent: string | null
}

export interface DB {
	users: UsersTable
	email_auth_tokens: EmailAuthTokensTable
}

export type UserRecord = Selectable<UsersTable>
export type NewUserRecord = Insertable<UsersTable>
export type UserUpdateRecord = Updateable<UsersTable>

