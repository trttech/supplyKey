---
number: 1352
title: HMR problem in Vite with `useFieldContext()`
type: other
state: closed
created: 2025-03-28
url: "https://github.com/TanStack/form/issues/1352"
reactions: 11
comments: 7
---

# HMR problem in Vite with `useFieldContext()`

### Describe the bug

After modifying a component that uses the `useFieldContext` hook, I get the following error in the web console after Vite has hot-reloaded the component:

```
Error: `fieldContext` only works when within a `fieldComponent` passed to `createFormHook`
    at useFieldContext (@tanstack_react-form.js?v=fd612f6a:2205:13)
    at TextField (TextField.tsx?t=1743182881241:24:17)
    at react-stack-bottom-frame (react-dom_client.js?v=fd612f6a:16192:20)
    at renderWithHooks (react-dom_client.js?v=fd612f6a:4306:24)
    at updateFunctionComponent (react-dom_client.js?v=fd612f6a:5972:21)
    at beginWork (react-dom_client.js?v=fd612f6a:7048:20)
    at runWithFiberInDEV (react-dom_client.js?v=fd612f6a:726:18)
    at performUnitOfWork (react-dom_client.js?v=fd612f6a:10831:98)
    at workLoopSync (react-dom_client.js?v=fd612f6a:10692:43)
    at renderRootSync (react-dom_client.js?v=fd612f6a:10675:13)
```

### Your minimal, reproducible example

https://stackblitz.com/edit/vitejs-vite-rg13w71d?file=src%2Fcomponents%2FFieldWrapper.tsx

### Steps to reproduce

1. Open Stackblitz link (see above)
2. Open preview in new tab, open inspector and switch to "Console"
3. Go back to Stackblitz and add a class in the `src/components/FieldWrapper.tsx` and save the file
4. Go back to preview, now the page is blank an you see an error in the console

### Expected behavior

Vite reload components and show the changed component.

### How often does this bug happen?

Every time

### Screenshots or Videos

_No response_

### Platform

- OS: macOS
- Browser: Chrome
- Version: 143

### TanStack Form adapter

react-form

### TanStack Form version

v1.2.0

### TypeScript version

v5.7.2

### Additional context

_No response_

---

## Top Comments

**@zwaardje** (+7):

I managed to fix this by having two files. The reload will probably trigger the context to rerender because of HMR.

File A ( context file):
```
import { createFormHookContexts } from '@tanstack/react-form'

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()
```

File B (hook file):

```
import { fieldContext, formContext } from './form-context'

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
... your field components
},
formComponents{
.... your form components
}
```


**@MGRatEJOT**:

The same thing happens if you use "useFormContext".

However, this only happens when I use the recommended pattern of exposing the components via createFormHook(). If I don't provide them to createFormHook, I can use them (via `<ComponentName>` instead of `<form.ComponentName>` or `<field.ComponentName>`) and HMR works fine too.

**@MGRatEJOT**:

> I managed to fix this by having two files. The reload will probably trigger the context to rerender because of HMR.
> 
> File A ( context file):
> 
> ```
> import { createFormHookContexts } from '@tanstack/react-form'
> 
> export const { fieldContext, formContext, useFieldContext, useFormContext } =
>   createFormHookContexts()
> ```
> 
> File B (hook file):
> 
> ```
> import { fieldContext, formContext } from './form-context'
> 
> export const { useAppForm } = createFormHook({
>   fieldContext,
>   formContext,
>   fieldComponents: {
> ... your field components
> },
> formComponents{
> .... your form components
> }
> ```...