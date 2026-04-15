import type { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely"

export type UserRole = "admin" | "member"
export type OrderStatus = "placed" | "processing" | "shipped" | "delivered"
export type EnquiryStatus = "sent" | "received" | "reviewing" | "responded" | "resolved"
export type EnquiryPriority = "low" | "medium" | "high" | "urgent"

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

export interface ProductsTable {
	id: Generated<number>
	sku: string
	name: string
	description: string
	category: string
	manufacturer: string
	image_url: string | null
	price_cents: number
	stock_status: string
	tags: string[]
	created_at: Generated<Date>
	updated_at: ColumnType<Date | null, never, Date | string | null | undefined>
}

export interface CartItemsTable {
	id: Generated<number>
	user_id: number
	product_id: number
	quantity: number
	created_at: Generated<Date>
	updated_at: ColumnType<Date | null, never, Date | string | null | undefined>
}

export interface OrdersTable {
	id: Generated<number>
	order_number: string
	user_id: number
	subtotal_cents: number
	shipping_cents: number
	tax_cents: number
	total_cents: number
	status: OrderStatus
	payment_method: string
	po_number: string | null
	delivery_site: string
	carrier: string
	placed_at: Generated<Date>
	created_at: Generated<Date>
	updated_at: ColumnType<Date | null, never, Date | string | null | undefined>
}

export interface OrderItemsTable {
	id: Generated<number>
	order_id: number
	product_id: number
	sku: string
	name: string
	unit_price_cents: number
	quantity: number
	created_at: Generated<Date>
}

export interface EnquiriesTable {
	id: Generated<number>
	enquiry_number: string
	user_id: number
	subject: string
	product_sku: string | null
	supplier_name: string
	status: EnquiryStatus
	priority: EnquiryPriority
	created_at: Generated<Date>
	updated_at: ColumnType<Date | null, never, Date | string | null | undefined>
}

export interface BrandSettingsTable {
	id: number
	org_name: string
	tagline: string
	logo_data_url: string | null
	primary_color: string
	sidebar_color: string
	accent_color: string
	created_at: Generated<Date>
	updated_at: ColumnType<Date | null, never, Date | string | null | undefined>
}

export interface EnquiryMessagesTable {
	id: Generated<number>
	enquiry_id: number
	author_name: string
	author_role: string
	body: string
	attachment_name: string | null
	created_at: Generated<Date>
}

export interface DB {
	users: UsersTable
	email_auth_tokens: EmailAuthTokensTable
	products: ProductsTable
	cart_items: CartItemsTable
	orders: OrdersTable
	order_items: OrderItemsTable
	enquiries: EnquiriesTable
	enquiry_messages: EnquiryMessagesTable
	brand_settings: BrandSettingsTable
}

export type UserRecord = Selectable<UsersTable>
export type NewUserRecord = Insertable<UsersTable>
export type UserUpdateRecord = Updateable<UsersTable>

export type ProductRecord = Selectable<ProductsTable>
export type NewProductRecord = Insertable<ProductsTable>

export type CartItemRecord = Selectable<CartItemsTable>
export type NewCartItemRecord = Insertable<CartItemsTable>

export type OrderRecord = Selectable<OrdersTable>
export type NewOrderRecord = Insertable<OrdersTable>
export type OrderItemRecord = Selectable<OrderItemsTable>
export type NewOrderItemRecord = Insertable<OrderItemsTable>

export type EnquiryRecord = Selectable<EnquiriesTable>
export type NewEnquiryRecord = Insertable<EnquiriesTable>
export type EnquiryMessageRecord = Selectable<EnquiryMessagesTable>
export type NewEnquiryMessageRecord = Insertable<EnquiryMessagesTable>

export type BrandSettingsRecord = Selectable<BrandSettingsTable>
export type BrandSettingsUpdateRecord = Updateable<BrandSettingsTable>
