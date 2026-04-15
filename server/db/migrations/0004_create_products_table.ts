import type { Kysely } from "kysely"
import { sql } from "kysely"

export async function up(db: Kysely<unknown>) {
	await db.schema
		.createTable("products")
		.addColumn("id", "integer", col => col.generatedAlwaysAsIdentity().primaryKey())
		.addColumn("sku", "text", col => col.notNull().unique())
		.addColumn("name", "text", col => col.notNull())
		.addColumn("description", "text", col => col.notNull())
		.addColumn("category", "text", col => col.notNull())
		.addColumn("manufacturer", "text", col => col.notNull())
		.addColumn("image_url", "text")
		.addColumn("price_cents", "integer", col => col.notNull())
		.addColumn("stock_status", "text", col => col.notNull().defaultTo("in_stock"))
		.addColumn("tags", sql`text[]`, col => col.notNull().defaultTo(sql`ARRAY[]::text[]`))
		.addColumn("created_at", "timestamptz", col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.addColumn("updated_at", "timestamptz")
		.execute()

	await db.schema
		.createIndex("products_category_idx")
		.on("products")
		.column("category")
		.execute()

	await db.schema
		.createIndex("products_manufacturer_idx")
		.on("products")
		.column("manufacturer")
		.execute()

	await sql`
		CREATE TRIGGER set_products_updated_at
		BEFORE UPDATE ON products
		FOR EACH ROW
		EXECUTE PROCEDURE set_updated_at()
	`.execute(db)
}

export async function down(db: Kysely<unknown>) {
	await db.schema.dropTable("products").ifExists().execute()
}
