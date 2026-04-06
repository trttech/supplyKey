---
number: 1812
title: How to properly do async initial values?
category: Q&A
created: 2025-10-20
url: "https://github.com/TanStack/form/discussions/1812"
upvotes: 1
comments: 1
answered: true
---

# How to properly do async initial values?

I've tried following https://tanstack.com/form/latest/docs/framework/react/guides/async-initial-values, but I have some problems with this approach.

If I do

```ts
const form = useAppForm({
  defaultValues: dataFromServer, // can be undefined
})
```

there is one render that happens when `dataFromServer` first resolves, where the tanstack form values are all undefined. This can cause exceptions if there's an array field doing `field.state.value.map(...)`, plus I have some issues with a select component's onChange firing incorrectly in this scenario.

I've been able to work around this with:

```ts
const isMissingId = useStore(form.store, (s) => !s.values.id)

if (isMissingId) return null;
```

but it feels tedious and error-prone to do it this way. I'm hoping I'm missi...

---

## Accepted Answer

What is the type of `dataFromServer`? It should warn you that it is possibly undefined, which should cascade to the fields.

The best practice for async initial values is to have an 'empty' version of your data while the request is pending. All strings are empty strings, all Dates are today, all numbers are zero etc.

It doesn't need to be recreated on every render since it's just a static fallback object, so you can place it outside of the component.

```tsx
const form = useAppForm({
  defaultValues: dataFromServer ?? emptyValues
})
```