import { Database } from "../base"

class UserRepository extends Database {
	private static userInstance: UserRepository | null = null

	private constructor() {
		super(Database.getInstance().getQueryBuilder())
	}

	static override getInstance() {
		if (!UserRepository.userInstance) {
			UserRepository.userInstance = new UserRepository()
		}

		return UserRepository.userInstance
	}

	async countUsers() {
		const result = await this.db
			.selectFrom("users")
			.select(eb => eb.fn.count<number>("id").as("count"))
			.executeTakeFirstOrThrow()

		return Number(result.count)
	}

	async listUsers() {
		return this.db
			.selectFrom("users")
			.selectAll()
			.orderBy("created_at", "desc")
			.execute()
	}

	async recentUsers(limit = 5) {
		return this.db
			.selectFrom("users")
			.selectAll()
			.orderBy("created_at", "desc")
			.limit(limit)
			.execute()
	}

	async getDashboardStats() {
		const [users, verifiedUsers, admins] = await Promise.all([
			this.db.selectFrom("users").select(eb => eb.fn.count<number>("id").as("count")).executeTakeFirstOrThrow(),
			this.db.selectFrom("users").where("email_verified", "=", true).select(eb => eb.fn.count<number>("id").as("count")).executeTakeFirstOrThrow(),
			this.db.selectFrom("users").where("role", "=", "admin").select(eb => eb.fn.count<number>("id").as("count")).executeTakeFirstOrThrow(),
		])

		return {
			users: Number(users.count),
			verifiedUsers: Number(verifiedUsers.count),
			admins: Number(admins.count),
		}
	}
}

export const userRepo = UserRepository.getInstance()

