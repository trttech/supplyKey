import { createTransport, type SendMailOptions, type Transporter } from "nodemailer"
import type SMTPTransport from "nodemailer/lib/smtp-transport"
import { log } from "~~/shared/log"

interface MailConfig {
	isProduction: boolean
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
	connectionTimeout: number
	socketTimeout: number
}

let transporter: Transporter | null = null

function optionalEnv(value: string | undefined) {
	if (value === undefined || value.trim() === "") {
		return undefined
	}

	return value
}

function numberEnv(value: string | undefined, fallback: number) {
	const parsed = value ? Number.parseInt(value, 10) : Number.NaN
	return Number.isNaN(parsed) ? fallback : parsed
}

function booleanEnv(value: string | undefined, fallback: boolean) {
	if (value === undefined) {
		return fallback
	}

	return value === "true"
}

function getConfig() {
	const runtimeMail = useRuntimeConfig().mail as unknown as MailConfig
	const isProduction = process.env.NODE_ENV === "production" || runtimeMail.isProduction

	return {
		isProduction,
		host: optionalEnv(process.env.SMTP_HOST) ?? runtimeMail.host,
		port: numberEnv(process.env.SMTP_PORT, runtimeMail.port),
		secure: booleanEnv(process.env.SMTP_SECURE, runtimeMail.secure),
		user: optionalEnv(process.env.SMTP_USER) ?? runtimeMail.user,
		password: optionalEnv(process.env.SMTP_PASS) ?? runtimeMail.password,
		from: optionalEnv(process.env.MAILER_DEFAULT_FROM) ?? runtimeMail.from,
		replyTo: optionalEnv(process.env.MAILER_DEFAULT_REPLY_TO) ?? runtimeMail.replyTo,
		priority: optionalEnv(process.env.MAILER_DEFAULT_PRIORITY) ?? runtimeMail.priority,
		pool: booleanEnv(process.env.SMTP_POOL, runtimeMail.pool),
		maxConnections: numberEnv(process.env.SMTP_MAX_CONNECTIONS, runtimeMail.maxConnections),
		maxMessages: numberEnv(process.env.SMTP_MAX_MESSAGES, runtimeMail.maxMessages),
		tlsRejectUnauthorized: booleanEnv(
			process.env.SMTP_TLS_REJECT_UNAUTHORIZED,
			runtimeMail.tlsRejectUnauthorized,
		),
		connectionTimeout: numberEnv(process.env.SMTP_CONNECTION_TIMEOUT, runtimeMail.connectionTimeout),
		socketTimeout: numberEnv(process.env.SMTP_SOCKET_TIMEOUT, runtimeMail.socketTimeout),
	} satisfies MailConfig
}

function createSmtpTransport() {
	const config = getConfig()

	if (!config.host) {
		throw new Error("Mail configuration is incomplete. Required: SMTP_HOST")
	}

	if (config.isProduction && (!config.user || !config.password)) {
		throw new Error("Production mail configuration requires SMTP_USER and SMTP_PASS")
	}

	const transportOptions: SMTPTransport.Options = {
		host: config.host,
		port: config.port,
		secure: config.secure,
		connectionTimeout: config.connectionTimeout,
		socketTimeout: config.socketTimeout,
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

	if (getConfig().pool) {
		transporter.on("idle", () => {
			log.debug("✓ SMTP connection pool has idle connections available")
		})
	}

	return transporter
}

export async function verifyMailerConnection() {
	const config = getConfig()
	const mailer = getMailer()

	await mailer.verify()

	const poolInfo = config.pool ? ` (pooled: ${config.maxConnections} connections)` : ""
	log.info(`✓ SMTP connection verified: ${config.host}:${config.port}${poolInfo}`)
}

export async function sendMail(options: SendMailOptions) {
	const config = getConfig()
	const mailOptions: SendMailOptions = {
		from: config.from,
		...(config.replyTo ? { replyTo: config.replyTo } : {}),
		...(config.priority ? { priority: config.priority as "high" | "normal" | "low" } : {}),
		...options,
	}

	const mailer = getMailer()
	try {
		const info = await mailer.sendMail(mailOptions) as SMTPTransport.SentMessageInfo
		log.info(
			{ to: mailOptions.to, subject: mailOptions.subject, messageId: info.messageId },
			"Email sent successfully",
		)
		return info
	}
	catch (error) {
		log.error({ error, to: mailOptions.to, subject: mailOptions.subject }, "Failed to send email")
		throw error
	}
}

export function closeMailer() {
	if (transporter) {
		transporter.close()
		transporter = null
	}
}
