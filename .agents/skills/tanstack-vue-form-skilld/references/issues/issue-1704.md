---
number: 1704
title: Zod errors from server action aren't propagated to field error.
type: bug
state: open
created: 2025-08-18
url: "https://github.com/TanStack/form/issues/1704"
reactions: 14
comments: 7
labels: "[bug]"
---

# Zod errors from server action aren't propagated to field error.

### Describe the bug

Hi :)

I'm trying to implement a tanstack form in my project, but I've encountered a problem.
Namely, validation errors from the server-side action using the ZOD aren't being sent to the form's inputs. They're visible in `state` and the form itself, but they're not visible in `field.state.meta.errors`   

I followed the official guide and some YouTube tutorials, but there aren't enough examples online for this scenario :/

I'd like to avoid returning my own object from "zodErrors" and parsing it in the client component; I'd like to use the returned function from `createServerValidate`.

I validate all the code in `onBlur` and `onSubmit` using the ZOD scheme => and everything works.  

However, when I do the same in the server action:

```tsx
const serverValidate = createServerValidate({
onServerValidate: formSchema,
});
```
the errors don't get sent to the fields. They're visible in `state` and `form`, but they don't propagate downstream.

### Normal behavior

Validation with ZOD, from `onBlur` / `onChange`:

<img width="586" height="221" alt="Image" src="https://github.com/user-attachments/assets/33cc6f5d-e89e-4adb-b2c6-05989989c3b1" />

<img width="833" height="220" alt="Image" src="https://github.com/user-attachments/assets/6ffdcc5b-8722-4035-b2df-302221b68bd9" />

### Behavior when errors are comming from server action

<img width="586" height="221" alt="Image" src="https://github.com/user-attachments/assets/af63a0eb-3e20-4719-87d5-ae6b32fb2051" />

<img width="854" height="220" alt="Image" src="https://github.com/user-attachments/assets/1113b918-fb67-4739-bca4-4023520c85a1" />

### Your minimal, reproducible example

...

---

## Top Comments

**@janhesters** (+2):

###  Confirming the bug with a minimal **React Router** example

I ran into the same issue — server-side field errors (from `createServerValidate`) appear correctly in `form.state.errorMap.onServer.fields`, but they never propagate to individual `field.state.meta.errors`. This means UI conditions like:

```tsx
const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
```

never become `true`, and the inputs don’t show server errors, even though they exist in the form state.

Here’s the shape I get on the client after submitting:

...

**@petrkrizek** (+2):

solved by using this in remix/react-router7

```
  useEffect(() => {
    if (fetcher.data) {
      form.setErrorMap(fetcher.data.errorMap)
    }
  }, [fetcher.data])
```

you can probably replace fetcher with your actionData in Next.


the `transform: useTransform(...mergeForm ...)` function seems useless. The `useTransform` is not event exported from `@tanstack/react-form`, I had to import it from `@tanstack/react-form-remix`. Which docs and examples do not mention. Docs for useTransform are missing. This lib and its docs are a joke. Sorry.

**@boertel**:

> !!! Also the createServerValidate is using the old getHeader completely breaking this. For now you can return your errorMap.onServer in onMount() => { fields: state.errorMap.onServer }

For anyone landing on this issue, I encountered the same `getHeader` issue (@elmarvr) when using the latest @tanstack/react-start. #1771 should fix it! 