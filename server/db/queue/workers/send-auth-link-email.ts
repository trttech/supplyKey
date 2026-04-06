import type { Job } from "pg-boss"
import { sendMail } from "~~/server/utils/mailer"
import { log } from "~~/shared/log"

export interface SendAuthLinkEmailJobData {
	email: string
	magicLink: string
	appName: string
	expiresInMinutes: number
}

function emailTemplate(appName: string, magicLink: string, expiresInMinutes: number) {
	return `
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Sign in to ${appName}</title>
			</head>
			<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 24px; background: #f6f3ec;">
				<div style="max-width: 640px; margin: 0 auto; background: #fffaf2; border-radius: 18px; overflow: hidden; border: 1px solid #eadfce;">
					<div style="padding: 32px; background: linear-gradient(135deg, #c98d34 0%, #2f8f73 100%); color: white;">
						<h1 style="margin: 0; font-size: 28px;">Sign in to ${appName}</h1>
					</div>
					<div style="padding: 32px;">
						<p>Use the button below to sign in.</p>
						<p style="margin: 28px 0;">
							<a href="${magicLink}" style="display: inline-block; padding: 14px 20px; border-radius: 12px; background: #c98d34; color: white; text-decoration: none; font-weight: 600;">
								Open magic link
							</a>
						</p>
						<p>This link expires in ${expiresInMinutes} minutes.</p>
						<p>If the button does not work, use this URL:</p>
						<p style="word-break: break-word;">${magicLink}</p>
					</div>
				</div>
			</body>
		</html>
	`
}

export const createSendAuthLinkEmailHandler = () => {
	return async ([job]: Job<SendAuthLinkEmailJobData>[]) => {
		if (!job) {
			throw new Error("Missing queued job payload")
		}

		const { email, magicLink, appName, expiresInMinutes } = job.data

		if (!email || !magicLink) {
			throw new Error(`Missing required auth email fields for job ${job.id}`)
		}

		await sendMail({
			to: email,
			subject: `Sign in to ${appName}`,
			text: `Open this sign-in link: ${magicLink}. It expires in ${expiresInMinutes} minutes.`,
			html: emailTemplate(appName, magicLink, expiresInMinutes),
		})

		log.info({ email, jobId: job.id }, "Auth link email sent")
	}
}
