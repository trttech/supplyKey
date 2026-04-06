---
number: 1175
title: "bug: `useForm` and `FormApi` require 9 generic types instead of 1 starting 0.43.0"
type: other
state: closed
created: 2025-02-24
url: "https://github.com/TanStack/form/issues/1175"
reactions: 11
comments: 26
---

# bug: `useForm` and `FormApi` require 9 generic types instead of 1 starting 0.43.0

### Describe the bug

Previously with v0.42.x the types of `useForm` (react hook) and `FormApi` (core class) had 2 generic types, with only 1 being required:
```ts
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
```
Starting 0.43.0 however this has changed to 9 required generic types:
```ts
  TFormData,
  TOnMount extends undefined | FormValidateOrFn<TFormData>,
  TOnChange extends undefined | FormValidateOrFn<TFormData>,
  TOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnBlur extends undefined | FormValidateOrFn<TFormData>,
  TOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnSubmit extends undefined | FormValidateOrFn<TFormData>,
  TOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData>,
  TOnServer extends undefined | FormAsyncValidateOrFn<TFormData>,
```

Even if the form desired by the user does not have any validations they are now forced to define their strictly typed form like so:
```ts
const myForm = new FormApi<MyInterface, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined>
```
Which is extremely cumbersome. Furthermore, for our work project we also wrap a few Tanstack Form component with our custom Material UI components and we want those to be strictly typed, which would now become a complete flustercluck (excuse my french) with generic types.

I would really appreciate it if the defaults for the generic types could be re-introduced.

### Your minimal, reproducible example

https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAbzgVwM4FMBi0RwL5wBmUEuA5AAIwCGAdqjQMYDWA9FOtYzALSE5kA3AChhwWjHRRCXdHACyATwAi1GomFwtcWtRDoAXHAZRxAcxHa41M4Z3IQAIyki8oxhHrwQi7FFwAvCgYfiAAPEqqNAB8ABQImtoAJugyyAA2MABq1OnI6KhGCVZWNnYAzAAMADSJJTp6dmSY1ABuumR1+MJ4AJRAA

### Steps to reproduce

1. Go to the above linked TypeScript playground
2. Go to the "errors" tab
3. See the error "Expected 9 type arguments, but got 1."

...

---

## Top Comments

**@crutchcorn** [maintainer] (+36):

We never intend anyone to pass anything to `useForm`'s generics. Instead, you should be doing:

```tsx
const myForm = useForm({
    defaultValues: {
        age: 30,
        name: 'Favna'
    } as MyData
})
```

**@crutchcorn** [maintainer] (+13):

@deniskabana I'm not following why the following does not work:

```tsx
const formOpts = formOptions({ defaultValues: { } as SomeInterfaceHere })
```

It works at compile time just fine.  

**@crutchcorn** [maintainer] (+4):

This is correct behavior and is required for many of our TS types to work properly. PRs welcomed if you can solve our types another way.