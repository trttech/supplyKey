module.exports = {
	apps: [
		{
			name: "supplykey",
			script: "./.output/server/index.mjs",
			instances: 1,
			exec_mode: "fork",
			node_args: "--env-file=.env",
			env: {
				NODE_ENV: "production",
			},
		},
	],
}
