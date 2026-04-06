import { Kysely, PostgresDialect } from "kysely"
import { Pool } from "pg"
import type { DB } from "./types"
import { log } from "~~/shared/log"

export class Database {
	private static instance: Database | null = null
	protected db: Kysely<DB>

	protected constructor(db: Kysely<DB>) {
		this.db = db
	}

	static getInstance(): Database {
		if (Database.instance) {
			return Database.instance
		}

		const { db } = useRuntimeConfig()
		const { host, port, user, password, name, ssl } = db

		if (!host || !user || !password || !name) {
			throw new Error("Database configuration is incomplete")
		}

		const dialect = new PostgresDialect({
			pool: new Pool({
				host,
				port: port || 5432,
				user,
				password,
				database: name,
				max: 10,
				ssl: ssl ? { rejectUnauthorized: true } : false,
			}),
		})

		const kysely = new Kysely<DB>({
			dialect,
			log: process.env.NODE_ENV !== "production"
				? (event) => {
						if (event.level === "query") {
							log.info(
								{
									query: event.query.sql,
									parameters: event.query.parameters,
									duration: event.queryDurationMillis,
								},
								"Database query",
							)
						}

						if (event.level === "error") {
							log.error(
								{
									error: event.error,
									query: event.query.sql,
									parameters: event.query.parameters,
								},
								"Database query error",
							)
						}
					}
				: undefined,
		})

		Database.instance = new Database(kysely)
		return Database.instance
	}

	static getMigrationInstance() {
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
					max: 10,
					ssl: sslEnabled ? { rejectUnauthorized: true } : false,
				}),
			}),
		})
	}

	getQueryBuilder(): Kysely<DB> {
		return this.db
	}

	async destroy() {
		await this.db.destroy()
		Database.instance = null
	}
}

