---
number: 1928
title: Tanstack Start Integration?
category: Q&A
created: 2025-12-11
url: "https://github.com/TanStack/form/discussions/1928"
upvotes: 7
comments: 2
answered: false
---

# Tanstack Start Integration?

Is the tanstack start integration actually working for anyone? This could be a skill issue but I'm struggling to get it working as detailed in the docs. I have the exact setup as the tanstack form start example - https://tanstack.com/form/latest/docs/framework/react/examples/tanstack-start

First issue is in the `handleForm` code:

```ts
export const handleForm = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error('Invalid form data');
    }
    return data;
  })
  .handler(async (ctx) => {
    try {
      const validatedData = await serverValidate(ctx.data);
      console.log('validatedData', validatedData);
    }
    catch (e) {
      if (e instanceof ServerValidateError) { // <- Here, e is showing a ServerValidateError, but not an instanceof??
        return e.response;
      }

      setResponseStatus(500);
      return 'There was an internal error';
    }

    return 'Form has validated successfully';
  });
```

`e.response` is never returned as e does not appear to be a real instance of `ServerValidateError` which I am importing from `@tanstack/react-form-start`

If I change the above to:
```ts
export const handleForm = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error('Invalid form data');
    }
    return data;
  })
  .handler(async (ctx) => {
    try {
      const validatedData = await serverValidate(ctx.data);
      console.log('validatedData', validatedData);
    }
    catch (e) {
      if (e.name === 'ServerValidateError') { // <- Now works
        return e.response;
      }

      setResponseStatus(500);
      return 'There was an internal error';
    }

    return 'Form has validated successfully';
  });
```...

---

## Top Comments

**@arihantverma**:

I'm facing the same issues. I think after the extraction/migration of start specific login into `@tanstack/react-form-start` there are many issues that have crept up that weren't there before, including types loss across function chaining.

About the `ServerValidateError` `instanceof` check not working, I gave codex a try and this is what it said: 

> Vite's SSR mode maintains two separate module loading systems: Node.js's native loader (for externalized deps) and Vite's SSR module runner (for non-externalized deps). When `@tanstack/react-form-start` is loaded by both systems, two differen...

**@kein-1**:

Doesn't work for me either; im super confused

