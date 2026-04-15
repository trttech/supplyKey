import type { Kysely } from "kysely"
import { sql } from "kysely"

export async function up(db: Kysely<unknown>) {
	await db.schema
		.createTable("cart_items")
		.addColumn("id", "integer", col => col.generatedAlwaysAsIdentity().primaryKey())
		.addColumn("user_id", "integer", col => col.notNull().references("users.id").onDelete("cascade"))
		.addColumn("product_id", "integer", col => col.notNull().references("products.id").onDelete("cascade"))
		.addColumn("quantity", "integer", col => col.notNull().defaultTo(1))
		.addColumn("created_at", "timestamptz", col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.addColumn("updated_at", "timestamptz")
		.addUniqueConstraint("cart_items_user_product_unique", ["user_id", "product_id"])
		.execute()

	await db.schema
		.createIndex("cart_items_user_id_idx")
		.on("cart_items")
		.column("user_id")
		.execute()

	await sql`
		CREATE TRIGGER set_cart_items_updated_at
		BEFORE UPDATE ON cart_items
		FOR EACH ROW
		EXECUTE PROCEDURE set_updated_at()
	`.execute(db)
}

export async function down(db: Kysely<unknown>) {
	await db.schema.dropTable("cart_items").ifExists().execute()
}
