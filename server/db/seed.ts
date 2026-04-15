import { Kysely, PostgresDialect } from "kysely"
import { Pool } from "pg"
import type { DB } from "./types"

function getDb() {
	const host = process.env.DB_HOST
	const port = process.env.DB_PORT ? Number.parseInt(process.env.DB_PORT, 10) : 5432
	const user = process.env.DB_USER
	const password = process.env.DB_PASSWORD
	const databaseName = process.env.DB_NAME
	const sslEnabled = process.env.DB_SSL === "true"

	if (!host || !user || !password || !databaseName) {
		throw new Error("Database configuration is incomplete")
	}

	return new Kysely<DB>({
		dialect: new PostgresDialect({
			pool: new Pool({
				host,
				port,
				user,
				password,
				database: databaseName,
				max: 5,
				ssl: sslEnabled ? { rejectUnauthorized: true } : false,
			}),
		}),
	})
}

const DEMO_EMAIL = "demo@supplykey.ca"
const DEMO_NAME = "Marcus Thorne"

const PRODUCTS: Array<{
	sku: string
	name: string
	description: string
	category: string
	manufacturer: string
	image_url: string
	price_cents: number
	stock_status: string
	tags: string[]
}> = [
	// Wisdom — Cap Lamps & Charging
	{
		sku: "WIS-LAMP-3A-CSA",
		name: "WISDOM Lamp 3A (CSA-Approved)",
		description: "CSA-approved cordless miner's cap lamp with up to 12,000 lux on high mode and about 13 hours of runtime.",
		category: "Cap Lamps",
		manufacturer: "Wisdom",
		image_url: "https://www.minesupplyco.com/wp-content/uploads/2025/04/Wisdom-Lamp-3A-CSA-1.png",
		price_cents: 16_800,
		stock_status: "in_stock",
		tags: ["cap-lamp", "csa", "cordless"],
	},
	{
		sku: "WIS-WISELITE2-MSHA",
		name: "WISDOM WiseLite2 Cap Lamp (MSHA-Approved)",
		description: "MSHA-approved cordless cap lamp with up to 8,500 lux on high mode and about 16 hours of runtime.",
		category: "Cap Lamps",
		manufacturer: "Wisdom",
		image_url: "https://www.minesupplyco.com/wp-content/uploads/2024/05/big_wisdome_wise_lite_2_cordless.jpg",
		price_cents: 16_400,
		stock_status: "in_stock",
		tags: ["cap-lamp", "msha", "cordless"],
	},
	{
		sku: "WIS-CHG-12B",
		name: "WISDOM Lamp 12-Unit Charging Station",
		description: "Two-sided 12-port charging rack for Wisdom cap lamps with integrated charge indicators.",
		category: "Cap Lamps",
		manufacturer: "Wisdom",
		image_url: "https://www.minesupplyco.com/wp-content/uploads/2025/03/nwcr-12b-600x303.jpg",
		price_cents: 54_000,
		stock_status: "in_stock",
		tags: ["charger", "12-port"],
	},
	{
		sku: "WIS-CHG-36B",
		name: "WISDOM Lamp 36-Unit Charging Station",
		description: "Double-sided 36-port charging station designed for larger lamp fleets and fast site charging.",
		category: "Cap Lamps",
		manufacturer: "Wisdom",
		image_url: "https://www.minesupplyco.com/wp-content/uploads/2025/03/nwcr-36b-600x303.jpg",
		price_cents: 159_600,
		stock_status: "in_stock",
		tags: ["charger", "36-port"],
	},
	{
		sku: "WIS-CHG-60BL",
		name: "WISDOM Lamp 60-Unit Lockable Charging Station",
		description: "Lockable single-sided 60-port charging rack for secure lamp storage and charging underground or on surface.",
		category: "Cap Lamps",
		manufacturer: "Wisdom",
		image_url: "https://www.minesupplyco.com/wp-content/uploads/2025/03/nwcr-60bl-600x406.jpg",
		price_cents: 511_040,
		stock_status: "in_stock",
		tags: ["charger", "60-port", "lockable"],
	},
	{
		sku: "WIS-CHG-BLOCK-34A",
		name: "WISDOM 3A/4A Charging Block",
		description: "USB charging block used to recharge compatible Wisdom 3A and 4A cap lamps.",
		category: "Cap Lamps",
		manufacturer: "Wisdom",
		image_url: "https://www.minesupplyco.com/wp-content/uploads/2025/04/Wisdom-USB-Charge-Block.png",
		price_cents: 800,
		stock_status: "in_stock",
		tags: ["charger", "usb", "accessory"],
	},
	// OutBack Power — Power Systems
	{
		sku: "OUT-FXR3048A",
		name: "OutBack FXR3048A Inverter/Charger",
		description: "3000W, 48V sealed grid/hybrid inverter-charger with integrated battery charging for renewable power systems.",
		category: "Power Systems",
		manufacturer: "OutBack Power",
		image_url: "https://www.modernoutpost.com/wp-content/uploads/2016/06/ob_VFX_VFXR.jpg",
		price_cents: 215_920,
		stock_status: "in_stock",
		tags: ["inverter", "charger", "48v", "3000w"],
	},
	{
		sku: "OUT-VFXR3648A",
		name: "OutBack VFXR3648A Vented Solar Inverter",
		description: "3600W, 48V vented inverter suited for off-grid or grid-connected solar installations.",
		category: "Power Systems",
		manufacturer: "OutBack Power",
		image_url: "https://www.modernoutpost.com/wp-content/uploads/2016/06/ob_VFX_VFXR.jpg",
		price_cents: 246_400,
		stock_status: "in_stock",
		tags: ["inverter", "solar", "48v", "3600w"],
	},
	{
		sku: "OUT-GS8048A",
		name: "OutBack Radian GS8048A 8000W Solar Inverter",
		description: "8000W / 48V inverter-charger with dual AC inputs and high efficiency for larger hybrid or backup systems.",
		category: "Power Systems",
		manufacturer: "OutBack Power",
		image_url: "https://solarpowerdepot.ca/wp-content/uploads/2022/06/OUTBACK-RADIAN-8000W-INVERTER.webp",
		price_cents: 488_000,
		stock_status: "in_stock",
		tags: ["inverter", "solar", "48v", "8000w", "radian"],
	},
	{
		sku: "OUT-FM80",
		name: "OutBack FLEXmax 80 FM80 MPPT Charge Controller",
		description: "80A MPPT charge controller designed to improve PV harvest and support a wide range of battery voltages.",
		category: "Power Systems",
		manufacturer: "OutBack Power",
		image_url: "https://solarpowerdepot.ca/wp-content/uploads/2022/06/OUTBACK-POWER-80A-FM80-MPPT-CHARGE-CONTROLLER.jpg",
		price_cents: 64_800,
		stock_status: "in_stock",
		tags: ["charge-controller", "mppt", "80a"],
	},
	{
		sku: "OUT-MATE3S",
		name: "OutBack MATE3s System Display and Controller",
		description: "Central system display and controller for programming, monitoring, and logging OutBack power systems.",
		category: "Power Systems",
		manufacturer: "OutBack Power",
		image_url: "https://www.modernoutpost.com/wp-content/uploads/2019/11/op_mate3s-1.png",
		price_cents: 70_320,
		stock_status: "in_stock",
		tags: ["display", "controller", "monitoring"],
	},
	{
		sku: "OUT-FM100-AFCI",
		name: "OutBack FLEXmax 100 FM100-300VDC-AFCI",
		description: "100A / 300VDC MPPT charge controller with built-in GFCI and arc-fault protection for advanced solar arrays.",
		category: "Power Systems",
		manufacturer: "OutBack Power",
		image_url: "https://ressupply.com/image/cache/product/fm100-300vdc-afci-320x320.jpg",
		price_cents: 161_377,
		stock_status: "in_stock",
		tags: ["charge-controller", "mppt", "100a", "afci"],
	},
	// Dräger — Gas Detection
	{
		sku: "DRA-XAM-2500",
		name: "Dräger X-am 2500 4-Gas Monitor",
		description: "Portable personal gas monitor for detecting up to four gases in industrial and mining environments.",
		category: "Gas Detection",
		manufacturer: "Dräger",
		image_url: "https://www.supplynow.ca/cdn/shop/files/4542262_0d6ea729-c84b-4acf-8a9d-bec965976fbd.png?v=1733427124&width=1946",
		price_cents: 137_184,
		stock_status: "in_stock",
		tags: ["gas-monitor", "4-gas", "portable"],
	},
	{
		sku: "DRA-XAM-2800",
		name: "Dräger X-am 2800 Basic",
		description: "Connected multi-gas detector for measuring up to four gases, built around a shock-resistant CatEx sensor.",
		category: "Gas Detection",
		manufacturer: "Dräger",
		image_url: "https://www.supplynow.ca/cdn/shop/files/3703919_788eb22b-be20-4f8e-b5c1-165e352affe6.png?v=1733410854&width=1946",
		price_cents: 104_779,
		stock_status: "in_stock",
		tags: ["gas-monitor", "4-gas", "connected"],
	},
	{
		sku: "DRA-XAM-5800",
		name: "Dräger X-am 5800 Basic",
		description: "Connected multi-gas detector for measuring up to six gases with advanced CatEx SR sensing.",
		category: "Gas Detection",
		manufacturer: "Dräger",
		image_url: "https://www.supplynow.ca/cdn/shop/files/VN00733_9efb92ab-00ce-4268-a290-f4fdf406a22c.png?v=1733410822&width=1946",
		price_cents: 121_585,
		stock_status: "in_stock",
		tags: ["gas-monitor", "6-gas", "connected"],
	},
	{
		sku: "DRA-PAC-6500-CO",
		name: "Dräger Pac 6500 CO (CA)",
		description: "Personal single-gas carbon monoxide detector built for fast, precise monitoring in demanding work areas.",
		category: "Gas Detection",
		manufacturer: "Dräger",
		image_url: "https://www.supplynow.ca/cdn/shop/files/8327615_b0df17f2-05e0-40f7-8c2e-4d7ec6f0c87d.jpg?v=1733410935&width=1946",
		price_cents: 54_079,
		stock_status: "in_stock",
		tags: ["gas-monitor", "co", "single-gas"],
	},
	{
		sku: "DRA-PAC-8000-CO2",
		name: "Dräger Pac 8000 CO2",
		description: "Single-gas CO2 monitor from Dräger's Pac 8000 line for specialty-gas personal protection.",
		category: "Gas Detection",
		manufacturer: "Dräger",
		image_url: "https://www.supplynow.ca/cdn/shop/files/8326351_ecf33043-a442-4d04-a608-301778439c80.jpg?v=1733410842&width=1445",
		price_cents: 110_412,
		stock_status: "in_stock",
		tags: ["gas-monitor", "co2", "single-gas"],
	},
	// Dräger — Respiratory Protection
	{
		sku: "DRA-XPLORE-3300M",
		name: "Dräger X-plore 3300 M Half Mask",
		description: "Twin-filter half mask with bayonet connectors and a TPE mask body for everyday respiratory protection.",
		category: "Respiratory Protection",
		manufacturer: "Dräger",
		image_url: "https://www.supplynow.ca/cdn/shop/files/R55330_ffeebd94-fd93-4020-94fe-e7b19f6c3634.jpg?v=1733427279&width=1445",
		price_cents: 1_831,
		stock_status: "in_stock",
		tags: ["respirator", "half-mask", "twin-filter"],
	},
	{
		sku: "DRA-XPLORE-5500",
		name: "Dräger X-plore 5500 Full-Face Mask",
		description: "Twin-filter full-face respirator designed for a wider field of vision and higher respiratory protection.",
		category: "Respiratory Protection",
		manufacturer: "Dräger",
		image_url: "https://cdn11.bigcommerce.com/s-4208f/images/stencil/500x659/products/34734/26390/Drager%20Xplore%205500__62550.1767689117.jpg?c=2",
		price_cents: 23_498,
		stock_status: "in_stock",
		tags: ["respirator", "full-face", "twin-filter"],
	},
	{
		sku: "DRA-PARAT-3200",
		name: "Dräger PARAT 3200 Mouthpiece Respirator",
		description: "Compact escape respirator with mouthpiece and nose clip, using an ABEK15 filter for emergency egress.",
		category: "Respiratory Protection",
		manufacturer: "Dräger",
		image_url: "https://cdn11.bigcommerce.com/s-4208f/images/stencil/500x659/products/34745/26392/Drager%20Parat%203000__51599.1767689121.jpg?c=2",
		price_cents: 8_888,
		stock_status: "in_stock",
		tags: ["respirator", "escape", "emergency"],
	},
]

const ENQUIRIES: Array<{
	enquiry_number: string
	subject: string
	product_sku: string | null
	supplier_name: string
	status: "sent" | "received" | "reviewing" | "responded" | "resolved"
	priority: "low" | "medium" | "high" | "urgent"
	messages: Array<{ author_name: string, author_role: string, body: string, attachment_name?: string }>
}> = [
	{
		enquiry_number: "REQ-8829",
		subject: "WISDOM Lamp 3A — 200 unit fleet refresh",
		product_sku: "WIS-LAMP-3A-CSA",
		supplier_name: "Mine Supply Co",
		status: "responded",
		priority: "high",
		messages: [
			{
				author_name: "Marcus Thorne",
				author_role: "Procurement Lead",
				body: "Requesting quote for 200 units of WISDOM Lamp 3A (CSA-approved) for the North Basin fleet refresh. Need CSA certificates bundled with each pallet. Delivery to Fremantle Terminal by end of month.",
			},
			{
				author_name: "Mine Supply Co",
				author_role: "Supplier",
				body: "Enquiry received. Stock confirmed on 200 units ex-works Ontario. CSA documentation will ship with each pallet. Lead time 7 business days.",
			},
			{
				author_name: "Mine Supply Co",
				author_role: "Supplier",
				body: "Attaching formal quote and CSA certificate index. Pallet numbers and charge-cycle logs included.",
				attachment_name: "Quote_WisdomLamp3A_NorthBasin.pdf",
			},
		],
	},
	{
		enquiry_number: "REQ-7441",
		subject: "Dräger X-am 5800 calibration gas compatibility",
		product_sku: "DRA-XAM-5800",
		supplier_name: "SupplyKey Direct",
		status: "reviewing",
		priority: "high",
		messages: [
			{
				author_name: "Marcus Thorne",
				author_role: "Procurement Lead",
				body: "Need confirmation the X-am 5800 Basic calibration kit covers CH4, CO, H2S, and O2 at the concentrations we use in Pit C. Attaching recent sampling logs.",
				attachment_name: "Pit_C_Log.pdf",
			},
			{
				author_name: "SupplyKey Engineering",
				author_role: "Technical Specialist",
				body: "Reviewing with Dräger product group. Will confirm sensor ranges against Pit C exposure profile and respond within 4 hours.",
			},
		],
	},
	{
		enquiry_number: "REQ-6902",
		subject: "OutBack Radian GS8048A — Solar Pack 03 retrofit",
		product_sku: "OUT-GS8048A",
		supplier_name: "SupplyKey Direct",
		status: "received",
		priority: "medium",
		messages: [
			{
				author_name: "Marcus Thorne",
				author_role: "Procurement Lead",
				body: "Scoping the Radian 8000W for the Solar Pack 03 retrofit. Need pricing on 6 units plus MATE3s controllers for each. Delivery split across two sites.",
			},
		],
	},
]

async function seed() {
	const db = getDb()

	try {
		console.log("Seeding demo user...")
		const existingUser = await db
			.selectFrom("users")
			.selectAll()
			.where("email", "=", DEMO_EMAIL)
			.executeTakeFirst()

		let demoUserId: number
		if (existingUser) {
			demoUserId = existingUser.id
			console.log(`  ↳ demo user already exists (id=${demoUserId})`)
		}
		else {
			const inserted = await db
				.insertInto("users")
				.values({
					email: DEMO_EMAIL,
					name: DEMO_NAME,
					role: "admin",
					email_verified: true,
					deactivated: false,
				})
				.returning("id")
				.executeTakeFirstOrThrow()
			demoUserId = inserted.id
			console.log(`  ↳ created demo user (id=${demoUserId})`)
		}

		console.log("Resetting catalog (cart_items → order_items → orders → products)...")
		await db.deleteFrom("cart_items").execute()
		await db.deleteFrom("order_items").execute()
		await db.deleteFrom("orders").execute()
		await db.deleteFrom("products").execute()
		console.log("  ↳ cleared")

		console.log("Seeding products...")
		for (const product of PRODUCTS) {
			await db
				.insertInto("products")
				.values(product)
				.execute()
		}
		console.log(`  ↳ ${PRODUCTS.length} products inserted`)

		console.log("Resetting enquiries...")
		await db.deleteFrom("enquiries").execute()
		console.log("  ↳ cleared")

		console.log("Seeding enquiries...")
		for (const enquiry of ENQUIRIES) {
			const created = await db
				.insertInto("enquiries")
				.values({
					enquiry_number: enquiry.enquiry_number,
					user_id: demoUserId,
					subject: enquiry.subject,
					product_sku: enquiry.product_sku,
					supplier_name: enquiry.supplier_name,
					status: enquiry.status,
					priority: enquiry.priority,
				})
				.returning("id")
				.executeTakeFirstOrThrow()

			for (const message of enquiry.messages) {
				await db
					.insertInto("enquiry_messages")
					.values({
						enquiry_id: created.id,
						author_name: message.author_name,
						author_role: message.author_role,
						body: message.body,
						attachment_name: message.attachment_name ?? null,
					})
					.execute()
			}
			console.log(`  ↳ created ${enquiry.enquiry_number} with ${enquiry.messages.length} messages`)
		}

		console.log("✓ Seed complete")
	}
	finally {
		await db.destroy()
	}
}

seed().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
