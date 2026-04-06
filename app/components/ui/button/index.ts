import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Button } from "./Button.vue"

export const buttonVariants = cva(
	"focus-visible:border-ring focus-visible:ring-ring/40 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-transparent text-sm font-semibold whitespace-nowrap shadow-sm transition-[transform,background-color,border-color,color,box-shadow] outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground hover:bg-primary/92 hover:-translate-y-0.5 hover:shadow-lg",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/92 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 hover:-translate-y-0.5",
				outline:
					"bg-card/85 text-foreground border-border/70 hover:bg-accent hover:text-accent-foreground dark:bg-input/40 hover:-translate-y-0.5",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/88 hover:-translate-y-0.5",
				ghost:
					"hover:bg-accent/80 hover:text-accent-foreground border-transparent bg-transparent shadow-none",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				"default": "h-10 px-4 py-2 has-[>svg]:px-3.5",
				"sm": "h-9 gap-1.5 px-3.5 text-sm has-[>svg]:px-3",
				"lg": "h-11 px-6 text-sm has-[>svg]:px-4.5",
				"icon": "size-10",
				"icon-sm": "size-9",
				"icon-lg": "size-11",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
)
export type ButtonVariants = VariantProps<typeof buttonVariants>
