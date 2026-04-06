---
number: 1625
title: Using zod schema as a form level onChange validator causes form elements to unnecessarily re-render.
type: other
state: open
created: 2025-07-23
url: "https://github.com/TanStack/form/issues/1625"
reactions: 6
comments: 5
---

# Using zod schema as a form level onChange validator causes form elements to unnecessarily re-render.

### Describe the bug

Let's consider the example from the documentation which uses a zod schema as its form-level onChange validator:

https://tanstack.com/form/latest/docs/framework/react/examples/standard-schema

https://6ymfgt-3001.csb.app/

```tsx
const ZodSchema = z.object({
  firstName: z
    .string()
    .min(3, '[Zod] You must have a length of at least 3')
    .startsWith('A', "[Zod] First name must start with 'A'"),
  lastName: z.string().min(3, '[Zod] You must have a length of at least 3'),
})

export default function App() {
  const form = useForm({
    validators: {
      onChange: ZodSchema,
    },
  })

  return (
    ///
  )
}
```

https://github.com/user-attachments/assets/b42e6208-6650-4166-9b48-cb0e2ccf180d

Initially, typing in either of the inputs will cause both of them to re-render on each keystroke. This is because the `onChange` validator seemingly triggers on each keystroke, and each field which contains an error will be re-rendered. I speculate this is because the internal `fieldMeta` gets updated, and that's causing this issue. But as soon as any of the inputs no longer contains invalid data, it stops getting re-rendered.

That would be okay in some scenarios, but what if you want to trigger validation only on fields that have `isDirty: true` state, or in other words, fields that users have already interacted with. In most cases it makes no sense to validate and display errors if the user have provided no input yet.

...