---
number: 1801
title: How to reset canSubmit when the form value changes after a submission attempt
category: Q&A
created: 2025-10-11
url: "https://github.com/TanStack/form/discussions/1801"
upvotes: 1
comments: 1
answered: true
---

# How to reset canSubmit when the form value changes after a submission attempt

Honestly this may be a skill issue or related to how I initialized the form, but here's the issue; when a submission fails due to a form field being invalid (usually occurs after a form level validation not a field level validation) canSubmit does not update to reflect the forms current validity and as a result this button is disabled forever till you reset the form's state

```
function SubmitButton({
	children = "Continue",
	className,
	...props
}: React.PropsWithChildren<React.ComponentProps<typeof Button>>) {
	const form = useFormContext();

	return (
		<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
			{([canSubmit, isSubmitting]) => (
				<Button
					disabled={!canSubmit || isSubmitting}
					className={className}
					onClick={() => form.handleSubmit()}
					{...props}
				>
					{isSubmitting ? <Spinner /> : children}
				</Button>
			)}
		</form.Subscribe>
	);
}
```...

---

## Accepted Answer

Sorry guys, turns out it was an issue with react compiler, not related to tanstack form