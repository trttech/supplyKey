---
number: 1844
title: Extending FieldMeta Typing
category: Q&A
created: 2025-11-06
url: "https://github.com/TanStack/form/discussions/1844"
upvotes: 2
comments: 0
answered: false
---

# Extending FieldMeta Typing

I am using field meta heavily in my project, one case is like this 

```
function TextField(props: Partial<TextInputProps>) {
    const field = useFieldContext<string>()

    return (
        <TextInput
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            disabled={field.state.meta?.disabled}
            hidden={field.state.meta?.hidden}
            error={field.state.meta.errors.join(', ')}
            {...props}
            id={field.name}
        />
    )
}
```

I set the meta using `fieldApi.setMeta(prev => ({ ...prev, disabled: true, hidden: false }))` but I face a problem to extend typing for FieldMeta, I tried extending through `.d.ts` file like 

```
declare module '@tanstack/react-form' {
  interface FieldMeta {
    disabled?: boolean
    hidden?: boolean
    dataSource?: Array<number | string | { [key: string]: any }>
  }
}
```...