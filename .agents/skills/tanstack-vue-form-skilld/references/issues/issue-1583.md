---
number: 1583
title: Infer form data type from validator instead of default values
type: feature
state: closed
created: 2025-06-17
url: "https://github.com/TanStack/form/issues/1583"
reactions: 44
comments: 17
labels: "[enhancement]"
---

# Infer form data type from validator instead of default values

Currently the type of the form data seems to be inferred from the default values instead of the validator type. However, the validator is typically more complete/extended and since it's used for validation, it should always result in the correct type...

Currently, when I do something like (using zod in the example):

```
  const optionsForm = useAppForm({
    defaultValues: { foo: '' },
    validators: {
      onChange: z.object({ foo: z.string().optional() }),
    },
  });
```

This gives me a ts error, because it says the validation schema has foo as optional, while the default values have it filled in.

Another example with an enum type:
```
  const optionsForm = useAppForm({
    defaultValues: { foo: 'a' },
    validators: {
      onChange: z.object({ foo: z.enum(['a', 'b'])}),
    },
  });
```
This gives me a ts error because in the default values foo is infered as string, but the validator only accepts the more narrow `'a' | 'b'` as type.

Since `useAppForm` takes a very large number of generics, manually specifying these isn't really a good alternative.

---

## Top Comments

**@LeCarbonator** (+4):

I have two concerns with this request:

1. What would be the inferred data type from these validators?

```tsx
// These are all valid validators in TSF v1
validators: {
  onMount: z.object({ name: z.string().min(1) }),
  onChange: () => 'Consistent error',
  onBlur: ({ value }) => value.name.length === 0 ? 'Too short' : null,
  onSubmit:  ({ formApi }) => {
     if (externalCondition) {
        return formApi.parseValuesWithSchema(
            z.object({ name: z.string().min(1) })
        )
     }
  } 
}
```

2. Which one takes priority?

...

**@Tiikara** (+2):

Also, regarding this case:

```
validators: {
 onMount: z.object({ name: z.string().min(1) }),
 onChange: z.object({ name: z.number() })
}
```

I think this is simply an error. Does it really matter which validator the type inference comes from? The field should have a consistent type across all validators I think.

**@erasebegin** (+2):

> We tried to migrate from react-hook-form to this library, however this issue caused a lot of troubles during migration so we had to stop. Using default, optional or just using drizzle-zod or similar libs cause a lot of troubles with typescript because defaultValues override the types from the schema validator. we tried to use some hacks to force it to work. However this is a critical issue for wider adoption of this library. At least we need docs or other official workaround for this problem

I have found that docs around zod integration are basically non-existent