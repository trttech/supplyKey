---
number: 1921
title: How should the `useAppForm` object be typed when passed to child components?
category: Q&A
created: 2025-12-08
url: "https://github.com/TanStack/form/discussions/1921"
upvotes: 4
comments: 0
answered: false
---

# How should the `useAppForm` object be typed when passed to child components?

I am trying to understand the correct way to type a `useAppForm` instance when it is passed down to child components. The current documentation only shows flat examples where the form is created and used within the same component, but this does not reflect real-world usage where forms are split across multiple components.

When I pass the form instance like this:

```ts
interface ItemFieldsProps {
  form: ReturnType<typeof useAppForm>;
}
```

TypeScript loses all field information:
– field names do not autocomplete
– `field.state.value` becomes `{}`
– value-related components report type errors

What is the recommended way to correctly type the `form` object when it is passed as a prop so that all field names and value types are preserved?

Clear guidance in the documentat...