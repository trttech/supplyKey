import { createTransport, type SendMailOptions, type Transporter } from "nodemailer"
import type SMTPTransport from "nodemailer/lib/smtp-transport"
import { log } from "~~/shared/log"

interface MailConfig {
	mode: string
	host: string
	port: number
	secure: boolean
	user?: string
	password?: string
	from: string
	replyTo: string
	priority: string
	pool: boolean
	maxConnections: number
	maxMessages: number
	tlsRejectUnauthorized: boolean
}

let transporter: Transporter | null = null

function getConfig() {
	return useRuntimeConfig().mail as unknown as MailConfig
}

function createSmtpTransport() {
	const config = getConfig()

	const transportOptions: SMTPTransport.Options = {
		host: config.host,
		port: config.port,
		secure: config.secure,
		tls: {
			rejectUnauthorized: config.tlsRejectUnauthorized,
		},
	}

	if (config.user && config.password) {
		transportOptions.auth = {
			user: config.user,
			pass: config.password,
		}
	}

	if (config.pool) {
		Object.assign(transportOptions, {
			pool: true,
			maxConnections: config.maxConnections,
			maxMessages: config.maxMessages,
		})
	}

	return createTransport(transportOptions)
}

export function getMailer() {
	if (transporter) {
		return transporter
	}

	transporter = createSmtpTransport()
	return transporter
}

export async function verifyMailerConnection() {
	const config = getConfig()

	if (config.mode === "console") {
		log.info("MAIL_MODE=console, emails will be logged instead of delivered")
		return
	}

	const mailer = getMailer()
	await mailer.verify()
}

export async function sendMail(options: SendMailOptions) {
	const config = getConfig()
	const mailOptions: SendMailOptions = {
		from: config.from,
		...(config.replyTo ? { replyTo: config.replyTo } : {}),
		...(config.priority ? { priority: config.priority as "high" | "normal" | "low" } : {}),
		...options,
	}

	if (config.mode === "console") {
		log.info(
			{
				to: mailOptions.to,
				subject: mailOptions.subject,
				text: mailOptions.text,
				html: mailOptions.html,
			},
			"Console mail delivery",
		)
		return
	}

	const mailer = getMailer()
	await mailer.sendMail(mailOptions)
}

export function closeMailer() {
	if (transporter) {
		transporter.close()
		transporter = null
	}
}

