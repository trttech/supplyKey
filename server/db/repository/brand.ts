import { Database } from "../base"
import type { BrandSettingsRecord, BrandSettingsUpdateRecord } from "../types"

class BrandRepository extends Database {
	private static brandInstance: BrandRepository | null = null

	private constructor() {
		super(Database.getInstance().getQueryBuilder())
	}

	static override getInstance() {
		if (!BrandRepository.brandInstance) {
			BrandRepository.brandInstance = new BrandRepository()
		}

		return BrandRepository.brandInstance
	}

	async get(): Promise<BrandSettingsRecord> {
		return this.db
			.selectFrom("brand_settings")
			.selectAll()
			.where("id", "=", 1)
			.executeTakeFirstOrThrow()
	}

	async update(patch: BrandSettingsUpdateRecord): Promise<BrandSettingsRecord> {
		return this.db
			.updateTable("brand_settings")
			.set({ ...patch, updated_at: new Date() })
			.where("id", "=", 1)
			.returningAll()
			.executeTakeFirstOrThrow()
	}
}

export const brandRepo = BrandRepository.getInstance()
