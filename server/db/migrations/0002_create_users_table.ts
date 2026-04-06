import type { Kysely } from "kysely"
import { sql } from "kysely"

export async function up(db: Kysely<unknown>) {
	await sql`CREATE TYPE role_type AS ENUM('admin', 'member')`.execute(db)

	await db.schema
		.createTable("users")
		.addColumn("id", "integer", col => col.generatedAlwaysAsIdentity().primaryKey())
		.addColumn("email", "text", col => col.notNull().unique())
		.addColumn("name", "varchar(255)")
		.addColumn("role", sql`role_type`, col => col.notNull().defaultTo(sql`'member'::role_type`))
		.addColumn("email_verified", "boolean", col => col.notNull().defaultTo(false))
		.addColumn("last_active_at", "timestamptz")
		.addColumn("deactivated", "boolean", col => col.notNull().defaultTo(false))
		.addColumn("created_at", "timestamptz", col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.addColumn("updated_at", "timestamptz")
		.execute()

	await sql`
		CREATE TRIGGER set_user_updated_at
		BEFORE UPDATE ON users
		FOR EACH ROW
		EXECUTE PROCEDURE set_updated_at()
	`.execute(db)
}

export async function down(db: Kysely<unknown>) {
	await db.schema.dropTable("users").ifExists().execute()
	await sql`DROP TYPE IF EXISTS role_type`.execute(db)
}

