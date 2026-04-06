import type { Logger, LoggerOptions } from "pino"
import pino from "pino"

const development: LoggerOptions = {
	name: "starter",
	level: "trace",
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
		},
	},
	browser: {
		asObject: true,
		disabled: false,
	},
}

const production: LoggerOptions = {
	name: "starter",
	level: "info",
	browser: {
		disabled: true,
	},
}

export const log: Logger = pino(
	process.env.NODE_ENV === "production" ? production : development,
)

