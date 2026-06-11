import { log } from "~~/shared/log"
import { closeMailer, verifyMailerConnection } from "../utils/mailer"

export default defineNitroPlugin(async (nitroApp) => {
	const config = useRuntimeConfig()
	const { host, port } = config.mail

	try {
		await verifyMailerConnection()
	}
	catch (error) {
		log.warn(
			{ error, host, port },
			"SMTP verify failed at startup; queued email sends will retry. Check SMTP configuration.",
		)
	}

	nitroApp.hooks.hookOnce("close", () => {
		closeMailer()
	})
})
