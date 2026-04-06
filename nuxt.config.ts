import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
	modules: [
		"@nuxt/eslint",
		"@nuxtjs/html-validator",
		"@nuxtjs/device",
		"@pinia/nuxt",
		"@nuxtjs/color-mode",
		"shadcn-nuxt",
		"nuxt-auth-utils",
	],

	ssr: true,

	pages: {
		pattern: ["**/*.vue", "!**/_lib/**"],
	},

	imports: {
		scan: false,
	},

	devtools: {
		enabled: process.env.NODE_ENV !== "production",
	},

	app: {
		head: {
			htmlAttrs: {
				lang: "en",
			},
			charset: "utf-8",
			viewport: "width=device-width, initial-scale=1",
			title: "Fullstack Starter",
			titleTemplate: "%s · Fullstack Starter",
		},
	},

	css: ["~/assets/css/main.css"],

	colorMode: {
		classSuffix: "",
	},

	runtimeConfig: {
		public: {
			appName: process.env.NUXT_PUBLIC_APP_NAME || "Fullstack Starter",
			baseURL: process.env.NUXT_PUBLIC_BASE_URL || "http://localhost:3000",
		},
		auth: {
			magicLinkTtlMinutes: process.env.AUTH_MAGIC_LINK_TTL_MINUTES
				? Number.parseInt(process.env.AUTH_MAGIC_LINK_TTL_MINUTES, 10)
				: 20,
		},
		db: {
			host: process.env.DB_HOST,
			port: process.env.DB_PORT ? Number.parseInt(process.env.DB_PORT, 10) : 5432,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			name: process.env.DB_NAME,
			ssl: process.env.DB_SSL === "true",
		},
		mail: {
			mode: process.env.MAIL_MODE || "console",
			host: process.env.SMTP_HOST || "localhost",
			port: process.env.SMTP_PORT ? Number.parseInt(process.env.SMTP_PORT, 10) : 1025,
			secure: process.env.SMTP_SECURE === "true",
			user: process.env.SMTP_USER,
			password: process.env.SMTP_PASS,
			from: process.env.MAILER_DEFAULT_FROM || "Starter <noreply@example.com>",
			replyTo: process.env.MAILER_DEFAULT_REPLY_TO || "",
			priority: process.env.MAILER_DEFAULT_PRIORITY || "normal",
			pool: process.env.SMTP_POOL === "true",
			maxConnections: process.env.SMTP_MAX_CONNECTIONS
				? Number.parseInt(process.env.SMTP_MAX_CONNECTIONS, 10)
				: 5,
			maxMessages: process.env.SMTP_MAX_MESSAGES
				? Number.parseInt(process.env.SMTP_MAX_MESSAGES, 10)
				: 100,
			tlsRejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED === "true",
		},
		pgboss: {
			host: process.env.DB_HOST,
			port: process.env.DB_PORT ? Number.parseInt(process.env.DB_PORT, 10) : 5432,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			ssl: process.env.DB_SSL || "false",
			application_name: process.env.PGBOSS_APP_NAME || "fullstack_starter_queue",
			schema: process.env.PGBOSS_SCHEMA || "queue",
			migrate: process.env.PGBOSS_MIGRATE !== "false",
			max: process.env.PGBOSS_MAX_CONN ? Number.parseInt(process.env.PGBOSS_MAX_CONN, 10) : 10,
		},
	},

	dir: {
		shared: "shared",
	},

	nitro: {
		compressPublicAssets: {
			gzip: true,
			brotli: true,
		},
	},

	compatibilityDate: "2026-01-31",

	vite: {
		plugins: [tailwindcss() as never],
	},

	typescript: {
		typeCheck: false,
	},

	debug: process.env.NODE_ENV !== "production",

	eslint: {
		config: {
			stylistic: {
				indent: "tab",
				quotes: "double",
				semi: false,
			},
		},
	},

	shadcn: {
		prefix: "",
		componentDir: "./app/components/ui",
	},
})
