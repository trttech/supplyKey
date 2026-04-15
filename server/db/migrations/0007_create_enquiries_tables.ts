import type { Kysely } from "kysely"
import { sql } from "kysely"

export async function up(db: Kysely<unknown>) {
	await sql`CREATE TYPE enquiry_status AS ENUM('sent', 'received', 'reviewing', 'responded', 'resolved')`.execute(db)
	await sql`CREATE TYPE enquiry_priority AS ENUM('low', 'medium', 'high', 'urgent')`.execute(db)

	await db.schema
		.createTable("enquiries")
		.addColumn("id", "integer", col => col.generatedAlwaysAsIdentity().primaryKey())
		.addColumn("enquiry_number", "text", col => col.notNull().unique())
		.addColumn("user_id", "integer", col => col.notNull().references("users.id").onDelete("cascade"))
		.addColumn("subject", "text", col => col.notNull())
		.addColumn("product_sku", "text")
		.addColumn("supplier_name", "text", col => col.notNull())
		.addColumn("status", sql`enquiry_status`, col => col.notNull().defaultTo(sql`'sent'::enquiry_status`))
		.addColumn("priority", sql`enquiry_priority`, col => col.notNull().defaultTo(sql`'medium'::enquiry_priority`))
		.addColumn("created_at", "timestamptz", col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.addColumn("updated_at", "timestamptz")
		.execute()

	await db.schema
		.createIndex("enquiries_user_id_idx")
		.on("enquiries")
		.column("user_id")
		.execute()

	await sql`
		CREATE TRIGGER set_enquiries_updated_at
		BEFORE UPDATE ON enquiries
		FOR EACH ROW
		EXECUTE PROCEDURE set_updated_at()
	`.execute(db)

	await db.schema
		.createTable("enquiry_messages")
		.addColumn("id", "integer", col => col.generatedAlwaysAsIdentity().primaryKey())
		.addColumn("enquiry_id", "integer", col => col.notNull().references("enquiries.id").onDelete("cascade"))
		.addColumn("author_name", "text", col => col.notNull())
		.addColumn("author_role", "text", col => col.notNull())
		.addColumn("body", "text", col => col.notNull())
		.addColumn("attachment_name", "text")
		.addColumn("created_at", "timestamptz", col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.execute()

	await db.schema
		.createIndex("enquiry_messages_enquiry_id_idx")
		.on("enquiry_messages")
		.column("enquiry_id")
		.execute()
}

export async function down(db: Kysely<unknown>) {
	await db.schema.dropTable("enquiry_messages").ifExists().execute()
	await db.schema.dropTable("enquiries").ifExists().execute()
	await sql`DROP TYPE IF EXISTS enquiry_priority`.execute(db)
	await sql`DROP TYPE IF EXISTS enquiry_status`.execute(db)
}
