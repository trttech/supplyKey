// @ts-check
import harlanzw from "eslint-plugin-harlanzw"
import tailwind from "eslint-plugin-tailwindcss"
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt([
	{
		ignores: ["node_modules", ".nuxt", ".output", "dist"],
	},
	...tailwind.configs["flat/recommended"],
	{
		settings: {
			tailwindcss: {
				config: false,
				cssFiles: ["app/assets/css/**/*.css"],
				cssFilesRefreshRate: 5_000,
			},
		},
		rules: {
			"tailwindcss/no-custom-classname": "off",
		},
	},
	{
		files: ["**/*.js", "**/*.ts", "**/*.vue"],
		plugins: {
			harlanzw,
		},
		rules: {
			"strict": ["error", "global"],
			"harlanzw/link-ascii-only": "error",
			"harlanzw/link-lowercase": "error",
			"harlanzw/link-no-double-slashes": "error",
			"harlanzw/link-no-whitespace": "error",
			"harlanzw/nuxt-await-navigate-to": "error",
			"harlanzw/nuxt-no-side-effects-in-async-data-handler": "error",
			"harlanzw/nuxt-no-side-effects-in-setup": "error",
			"harlanzw/nuxt-prefer-nuxt-link-over-router-link": "error",
			"harlanzw/vue-no-faux-composables": "error",
			"harlanzw/vue-no-nested-reactivity": "error",
			"harlanzw/vue-no-passing-refs-as-props": "error",
			"harlanzw/vue-no-reactive-destructuring": "error",
			"harlanzw/vue-no-ref-access-in-templates": "error",
			"harlanzw/vue-no-torefs-on-props": "error",
			"vue/multi-word-component-names": "off",
			"vue/block-order": ["error", { order: ["script", "template", "style"] }],
			"vue/component-api-style": ["error", ["script-setup"]],
			"vue/block-lang": ["error", { script: { lang: "ts" } }],
			"vue/define-emits-declaration": ["error", "type-based"],
			"vue/define-props-declaration": ["error", "type-based"],
			"vue/html-self-closing": "off",
			"vue/max-attributes-per-line": [
				"error",
				{
					singleline: { max: 1 },
					multiline: { max: 1 },
				},
			],
			"vue/first-attribute-linebreak": [
				"error",
				{
					singleline: "beside",
					multiline: "below",
				},
			],
			"vue/padding-line-between-tags": [
				"error",
				[
					{
						blankLine: "always",
						prev: "*",
						next: "*",
					},
				],
			],
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_"
				}
			],
			"@typescript-eslint/no-explicit-any": "warn",
			"no-undef": "off",
			"no-console": "warn",
			"no-plusplus": "off"
		},
	},
])

