---
number: 1996
title: Possible to use root object in `withFieldGroup` component?
category: Q&A
created: 2026-01-15
url: "https://github.com/TanStack/form/discussions/1996"
upvotes: 1
comments: 1
answered: true
---

# Possible to use root object in `withFieldGroup` component?

I've got an object type that is often nested under another object in forms, prompting me to use `withFieldGroup` for handling this structure as a common pattern.  However, there are some spots in my app where a form is specifically for that type of object (i.e.: the object is not nested, but is instead the root object used in the form).

Because `fields` is a required prop for `withFieldGroup` components, there doesn't seem to be a way to say "use the root object, not a nested property".  Is this possible, or would this need to be a feature request?

---

## Accepted Answer

If I understood it right, you have a field group of
```ts
type FieldGroup = {
  foo: string,
  bar: number
}

type FormData = {
  foo: string,
  bar: number,
  unrelated: {}
}
```

There's no shortcut for the `fields` name besides listing them:
```ts
<FieldGroup form={form} fields={{
   'foo': 'foo',
   'bar': 'bar'
}}/>
```