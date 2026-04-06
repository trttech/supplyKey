import type { SendAuthLinkEmailJobData } from "./send-auth-link-email"

export { createSendAuthLinkEmailHandler } from "./send-auth-link-email"
export type { SendAuthLinkEmailJobData }

export const JOB_NAMES = {
	SEND_AUTH_LINK_EMAIL: "send-auth-link-email",
} as const

export type JobName = (typeof JOB_NAMES)[keyof typeof JOB_NAMES]

export interface JobTypeMap {
	[JOB_NAMES.SEND_AUTH_LINK_EMAIL]: SendAuthLinkEmailJobData
}

