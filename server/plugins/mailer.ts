import { log } from "~~/shared/log"
import { closeMailer, verifyMailerConnection } from "../utils/mailer"

export default defineNitroPlugin(async (nitroApp) => {
	await verifyMailerConnection()
	log.info("✓ Mailer ready")

	nitroApp.hooks.hookOnce("close", () => {
		closeMailer()
	})
})
