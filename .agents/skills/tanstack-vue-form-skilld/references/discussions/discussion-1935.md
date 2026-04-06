---
number: 1935
title: Allow explicitly typing withForm props via a provided interface
category: Q&A
created: 2025-12-14
url: "https://github.com/TanStack/form/discussions/1935"
upvotes: 2
comments: 1
answered: true
---

# Allow explicitly typing withForm props via a provided interface

If my understanding is correct, the props passed to withForm are currently inferred from their usage. Would it be possible to explicitly provide a props interface instead, to improve developer experience? For example:

```ts
withForm({
  props: ({ form, foo, bar }: FooBarProps), 
    …
  },
})
```

---

## Accepted Answer

You can type assert if that's what you mean. The `props` object is not used at runtime.
```ts
withForm({
   props: {} as MyAdditionalProps,
   render: function Render({ form, additionalProp }) {/* ... */}
})
```