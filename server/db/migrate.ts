import * as path from "node:path"
import { promises as fs } from "node:fs"
import { fileURLToPath, pathToFileURL } from "node:url"
import { Migrator, type Migration, type MigrationProvider } from "kysely"
import { Database } from "./base"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class CustomFileMigrationProvider implements MigrationProvider {
	constructor(private readonly folder: string) {}

	async getMigrations(): Promise<Record<string, Migration>> {
		const migrations: Record<string, Migration> = {}
		const files = await fs.readdir(this.folder)

		await Promise.all(
			files
				.filter(fileName => fileName.endsWith(".ts") || fileName.endsWith(".js"))
				.map(async (fileName) => {
					const migrationName = fileName.replace(/\.(ts|js)$/, "")
					const filePath = path.join(this.folder, fileName)
					const fileUrl = pathToFileURL(filePath).href
					const migration = await import(fileUrl)
					migrations[migrationName] = migration
				}),
		)

		return migrations
	}
}

function getMigrator() {
	const db = Database.getMigrationInstance()
	const migrationFolder = path.resolve(__dirname, "migrations")

	return {
		db,
		migrator: new Migrator({
			db,
			provider: new CustomFileMigrationProvider(migrationFolder),
		}),
	}
}

async function completeAndExit(
	db: Awaited<ReturnType<typeof Database.getMigrationInstance>>,
	action: () => Promise<{ error?: unknown, results?: Array<{ migrationName: string, status: string, executedAt?: Date }> }>,
) {
	try {
		const { error, results } = await action()

		results?.forEach((result) => {
			if (result.status === "Success") {
				console.log(`✓ ${result.migrationName}`)
			}
			else if (result.status === "Error") {
				console.error(`✗ ${result.migrationName}`)
			}
		})

		if (error) {
			console.error(error)
			process.exitCode = 1
		}
	}
	finally {
		await db.destroy()
	}
}

async function migrateUp() {
	const { db, migrator } = getMigrator()
	await completeAndExit(db, () => migrator.migrateUp())
}

async function migrateDown() {
	const { db, migrator } = getMigrator()
	await completeAndExit(db, () => migrator.migrateDown())
}

async function migrateLatest() {
	const { db, migrator } = getMigrator()
	await completeAndExit(db, () => migrator.migrateToLatest())
}

async function migrateStatus() {
	const { db, migrator } = getMigrator()

	try {
		const migrations = await migrator.getMigrations()

		if (!migrations.length) {
			console.log("No migrations found")
			return
		}

		migrations.forEach((migration) => {
			const status = migration.executedAt
				? `executed at ${migration.executedAt.toISOString()}`
				: "pending"
			console.log(`${migration.name}: ${status}`)
		})
	}
	finally {
		await db.destroy()
	}
}

const command = process.argv[2]

switch (command) {
	case "up":
		await migrateUp()
		break
	case "down":
		await migrateDown()
		break
	case "latest":
		await migrateLatest()
		break
	case "status":
		await migrateStatus()
		break
	default:
		console.error("Usage: tsx server/db/migrate.ts <up|down|latest|status>")
		process.exitCode = 1
}
