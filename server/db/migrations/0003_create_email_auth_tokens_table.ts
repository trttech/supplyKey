import type { Kysely } from "kysely"
import { sql } from "kysely"

export async function up(db: Kysely<unknown>) {
	await db.schema
		.createTable("email_auth_tokens")
		.addColumn("id", "integer", col => col.generatedAlwaysAsIdentity().primaryKey())
		.addColumn("user_id", "integer", col => col.notNull().references("users.id").onDelete("cascade"))
		.addColumn("token_hash", "text", col => col.notNull().unique())
		.addColumn("created_at", "timestamptz", col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.addColumn("expires_at", "timestamptz", col => col.notNull())
		.addColumn("used_at", "timestamptz")
		.addColumn("revoked_at", "timestamptz")
		.addColumn("ip_address", sql`inet`)
		.addColumn("user_agent", "text")
		.execute()

	await db.schema
		.createIndex("email_auth_tokens_user_id_idx")
		.on("email_auth_tokens")
		.column("user_id")
		.execute()
}

export async function down(db: Kysely<unknown>) {
	await db.schema.dropTable("email_auth_tokens").ifExists().execute()
}

