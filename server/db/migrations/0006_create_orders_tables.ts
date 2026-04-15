import type { Kysely } from "kysely"
import { sql } from "kysely"

export async function up(db: Kysely<unknown>) {
	await sql`CREATE TYPE order_status AS ENUM('placed', 'processing', 'shipped', 'delivered')`.execute(db)

	await db.schema
		.createTable("orders")
		.addColumn("id", "integer", col => col.generatedAlwaysAsIdentity().primaryKey())
		.addColumn("order_number", "text", col => col.notNull().unique())
		.addColumn("user_id", "integer", col => col.notNull().references("users.id").onDelete("restrict"))
		.addColumn("subtotal_cents", "integer", col => col.notNull())
		.addColumn("shipping_cents", "integer", col => col.notNull().defaultTo(0))
		.addColumn("tax_cents", "integer", col => col.notNull().defaultTo(0))
		.addColumn("total_cents", "integer", col => col.notNull())
		.addColumn("status", sql`order_status`, col => col.notNull().defaultTo(sql`'placed'::order_status`))
		.addColumn("payment_method", "text", col => col.notNull())
		.addColumn("po_number", "text")
		.addColumn("delivery_site", "text", col => col.notNull())
		.addColumn("carrier", "text", col => col.notNull())
		.addColumn("placed_at", "timestamptz", col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.addColumn("created_at", "timestamptz", col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.addColumn("updated_at", "timestamptz")
		.execute()

	await db.schema
		.createIndex("orders_user_id_idx")
		.on("orders")
		.column("user_id")
		.execute()

	await sql`
		CREATE TRIGGER set_orders_updated_at
		BEFORE UPDATE ON orders
		FOR EACH ROW
		EXECUTE PROCEDURE set_updated_at()
	`.execute(db)

	await db.schema
		.createTable("order_items")
		.addColumn("id", "integer", col => col.generatedAlwaysAsIdentity().primaryKey())
		.addColumn("order_id", "integer", col => col.notNull().references("orders.id").onDelete("cascade"))
		.addColumn("product_id", "integer", col => col.notNull().references("products.id").onDelete("restrict"))
		.addColumn("sku", "text", col => col.notNull())
		.addColumn("name", "text", col => col.notNull())
		.addColumn("unit_price_cents", "integer", col => col.notNull())
		.addColumn("quantity", "integer", col => col.notNull())
		.addColumn("created_at", "timestamptz", col => col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`))
		.execute()

	await db.schema
		.createIndex("order_items_order_id_idx")
		.on("order_items")
		.column("order_id")
		.execute()
}

export async function down(db: Kysely<unknown>) {
	await db.schema.dropTable("order_items").ifExists().execute()
	await db.schema.dropTable("orders").ifExists().execute()
	await sql`DROP TYPE IF EXISTS order_status`.execute(db)
}
