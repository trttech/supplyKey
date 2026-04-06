// @ts-check
import harlanzw from "eslint-plugin-harlanzw"
import tailwind from "eslint-plugin-tailwindcss"
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt([
	{
		ignores: ["node_modules", ".nuxt", "dist", ".github", ".agents", "**/*.md"],
	},
	...tailwind.configs["flat/recommended"],
	{
		settings: {
			tailwindcss: {
				config: false, // Disable config file lookup for Tailwind CSS v4
				cssFiles: ["app/assets/css/**/*.css"],
				cssFilesRefreshRate: 5_000,
			},
		},
		rules: {
			// Disable no-custom-classname for Tailwind v4 CSS-based theme tokens
			"tailwindcss/no-custom-classname": "off",
		},
	},
	...harlanzw({ link: false, nuxt: true, vue: true }),
	{
		files: ["**/*.js", "**/*.ts", "**/*.vue"],
		rules: {
			"strict": ["error", "global"],

			// ============================================
			// Vue Component Structure
			// ============================================
			"vue/multi-word-component-names": "off",
			"vue/block-order": ["error", { order: ["script", "template", "style"] }],
			"vue/component-api-style": ["error", ["script-setup"]],
			"vue/prefer-define-options": ["error"],

			// ============================================
			// Vue Script Setup & Macros
			// ============================================
			"vue/block-lang": ["error", { script: { lang: "ts" } }],
			"vue/define-emits-declaration": ["error", "type-based"],
			"vue/define-props-declaration": ["error", "type-based"],
			"vue/define-macros-order": ["error", { order: ["defineProps", "defineEmits"] }],
			"vue/require-typed-ref": ["error"],
			"vue/prefer-use-template-ref": ["error"],
			"vue/no-required-prop-with-default": ["error", { autofix: false }],
			"vue/new-line-between-multi-line-property": ["error", { minLineOfMultilineProperty: 2 }],

			// ============================================
			// Vue Template Formatting
			// ============================================
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
			"vue/singleline-html-element-content-newline": [
				"error",
				{
					ignoreWhenNoAttributes: true,
					ignoreWhenEmpty: true,
				},
			],

			// ============================================
			// Vue Template Conventions
			// ============================================
			"vue/component-name-in-template-casing": [
				"error",
				"PascalCase",
				{
					registeredComponentsOnly: true,
					ignores: [],
				},
			],
			"vue/html-button-has-type": [
				"error",
				{
					button: true,
					submit: true,
					reset: true,
				},
			],
			"vue/html-comment-content-spacing": ["error", "always"],

			// ============================================
			// TypeScript
			// ============================================
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/no-explicit-any": [
				"warn",
				{
					fixToUnknown: false,
					ignoreRestArgs: false,
				},
			],

			// ============================================
			// Import Rules
			// ============================================
			"import/no-dynamic-require": "warn",
			"import/no-nodejs-modules": "warn",

			// ============================================
			// General JavaScript/TypeScript
			// ============================================
			"no-undef": 0,
			"no-unused-expressions": "error",
			"no-unneeded-ternary": "error",
			"no-unused-vars": ["warn", { ignoreRestSiblings: true }],
			"no-console": "warn",
			"no-lonely-if": "error",
			"no-plusplus": "off",
			"no-use-before-define": [
				"error",
				{
					functions: false,
					variables: false,
				},
			],
			"max-len": [
				"warn",
				{
					code: 180,
					ignorePattern: "class=\"([\\s\\S]*?)\"|d=\"([\\s\\S]*?)\"", // tailwind class lists and svg in templates can get long
					ignoreUrls: true,
					ignoreStrings: true,
					ignoreTemplateLiterals: true,
					ignoreRegExpLiterals: true,
				},
			],
			"max-params": ["error", 4],

			// ============================================
			// Restricted Syntax
			// ============================================
			"no-restricted-syntax": [
				"warn",
				{
					selector: "ForInStatement",
					message: "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
				},
				{
					selector: "ForOfStatement",
					message: "iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.",
				},
				{
					selector: "LabeledStatement",
					message: "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
				},
				{
					selector: "WithStatement",
					message: "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
				},
				{
					selector: "CallExpression[callee.name=I18n] > Literal",
					message: "Use the T object instead of a string in I18n calls",
				},
			],
		},
	},
])
