---
number: 1836
title: Why is `fieldContext` exported when you have `useFieldContext`?
category: Q&A
created: 2025-10-31
url: "https://github.com/TanStack/form/discussions/1836"
upvotes: 2
comments: 1
answered: false
---

# Why is `fieldContext` exported when you have `useFieldContext`?

Trying to understand why `fieldContext` is exported in the docs when none of the examples ever use it? Everything is using the hook.   What am I missing?

I get that it's used to build an `useAppForm` hook, with `createFormHook` is that the only use?

---

## Top Comments

**@anntnzrb**:

The raw `fieldContext` is exported for one reason: you pass it to `createFormHook()` to wire up the context system.

```tsx
// form-context.ts
export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

// form.ts
const { useAppForm } = createFormHook({
  fieldContext, // 👈 This is why it's exported
  formContext,
  fieldComponents: { TextField },
  formComponents: { SubscribeButton },
})
```

...