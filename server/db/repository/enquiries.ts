import { Database } from "../base"
import type { EnquiryPriority, EnquiryStatus } from "../types"

function generateEnquiryNumber() {
	const n = Math.floor(1000 + Math.random() * 9000)
	return `REQ-${n}`
}

export interface CreateEnquiryInput {
	userId: number
	subject: string
	supplierName: string
	productSku: string | null
	priority: EnquiryPriority
	initialMessage: {
		authorName: string
		authorRole: string
		body: string
	}
}

export interface AppendMessageInput {
	enquiryId: number
	authorName: string
	authorRole: string
	body: string
	nextStatus?: EnquiryStatus
}

export interface UpdateEnquiryInput {
	status?: EnquiryStatus
	priority?: EnquiryPriority
}

class EnquiriesRepository extends Database {
	private static enquiriesInstance: EnquiriesRepository | null = null

	private constructor() {
		super(Database.getInstance().getQueryBuilder())
	}

	static override getInstance() {
		if (!EnquiriesRepository.enquiriesInstance) {
			EnquiriesRepository.enquiriesInstance = new EnquiriesRepository()
		}

		return EnquiriesRepository.enquiriesInstance
	}

	async listForUser(userId: number) {
		return this.db
			.selectFrom("enquiries")
			.selectAll()
			.where("user_id", "=", userId)
			.orderBy("updated_at", "desc")
			.orderBy("created_at", "desc")
			.execute()
	}

	async listLastMessages(enquiryIds: number[]) {
		if (enquiryIds.length === 0)
			return [] as Array<{ enquiry_id: number, body: string }>

		return this.db
			.selectFrom("enquiry_messages as m")
			.select(["m.enquiry_id as enquiry_id", "m.body as body"])
			.where("m.enquiry_id", "in", enquiryIds)
			.where("m.id", "in", eb => eb
				.selectFrom("enquiry_messages as inner")
				.select(inner => inner.fn.max("inner.id").as("max_id"))
				.whereRef("inner.enquiry_id", "=", "m.enquiry_id")
				.groupBy("inner.enquiry_id"))
			.execute()
	}

	async countOpenForUser(userId: number) {
		const row = await this.db
			.selectFrom("enquiries")
			.select(eb => eb.fn.count<number>("id").as("count"))
			.where("user_id", "=", userId)
			.where("status", "in", ["sent", "received", "reviewing"])
			.executeTakeFirstOrThrow()

		return Number(row.count)
	}

	async create(input: CreateEnquiryInput) {
		return this.db.transaction().execute(async (trx) => {
			let enquiryNumber = generateEnquiryNumber()
			for (let attempt = 0; attempt < 5; attempt++) {
				const existing = await trx
					.selectFrom("enquiries")
					.select("id")
					.where("enquiry_number", "=", enquiryNumber)
					.executeTakeFirst()

				if (!existing)
					break
				enquiryNumber = generateEnquiryNumber()
			}

			const enquiry = await trx
				.insertInto("enquiries")
				.values({
					enquiry_number: enquiryNumber,
					user_id: input.userId,
					subject: input.subject,
					supplier_name: input.supplierName,
					product_sku: input.productSku,
					priority: input.priority,
					status: "sent",
				})
				.returningAll()
				.executeTakeFirstOrThrow()

			await trx
				.insertInto("enquiry_messages")
				.values({
					enquiry_id: enquiry.id,
					author_name: input.initialMessage.authorName,
					author_role: input.initialMessage.authorRole,
					body: input.initialMessage.body,
				})
				.execute()

			return enquiry
		})
	}

	async appendMessage(input: AppendMessageInput) {
		return this.db.transaction().execute(async (trx) => {
			const message = await trx
				.insertInto("enquiry_messages")
				.values({
					enquiry_id: input.enquiryId,
					author_name: input.authorName,
					author_role: input.authorRole,
					body: input.body,
				})
				.returningAll()
				.executeTakeFirstOrThrow()

			await trx
				.updateTable("enquiries")
				.set({
					updated_at: new Date(),
					...(input.nextStatus ? { status: input.nextStatus } : {}),
				})
				.where("id", "=", input.enquiryId)
				.execute()

			return message
		})
	}

	async update(enquiryNumber: string, userId: number, patch: UpdateEnquiryInput) {
		if (!patch.status && !patch.priority)
			return

		await this.db
			.updateTable("enquiries")
			.set({
				updated_at: new Date(),
				...(patch.status ? { status: patch.status } : {}),
				...(patch.priority ? { priority: patch.priority } : {}),
			})
			.where("enquiry_number", "=", enquiryNumber)
			.where("user_id", "=", userId)
			.execute()
	}

	async findByNumber(enquiryNumber: string, userId: number) {
		const enquiry = await this.db
			.selectFrom("enquiries")
			.selectAll()
			.where("enquiry_number", "=", enquiryNumber)
			.where("user_id", "=", userId)
			.executeTakeFirst()

		if (!enquiry)
			return undefined

		const messages = await this.db
			.selectFrom("enquiry_messages")
			.selectAll()
			.where("enquiry_id", "=", enquiry.id)
			.orderBy("created_at", "asc")
			.execute()

		return { enquiry, messages }
	}
}

export const enquiriesRepo = EnquiriesRepository.getInstance()
