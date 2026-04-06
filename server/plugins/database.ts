import { log } from "~~/shared/log"
import { Database } from "../db/base"

declare module "nitropack" {
	interface NitroApp {
		db?: Database
	}
}

declare module "h3" {
	interface H3EventContext {
		db?: Database
	}
}

export default defineNitroPlugin((nitroApp) => {
	const db = Database.getInstance()

	log.info("✓ Database connection initialized")

	nitroApp.hooks.hookOnce("close", async () => {
		await db.destroy()
		log.info("✓ Database connection closed")
	})

	nitroApp.db = db
})

