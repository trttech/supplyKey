---
number: 1260
title: "FieldAPI: state.meta.errors are not updating properly when using server-validations for errors"
type: other
state: closed
created: 2025-03-09
url: "https://github.com/TanStack/form/issues/1260"
reactions: 17
comments: 5
resolvedIn: 1.28.1
---

# FieldAPI: state.meta.errors are not updating properly when using server-validations for errors

### Describe the bug

Basically, the `field.state.meta.errors` (field as `AnyFieldApi`) is not properly set (i.e. differs from `form.store.state.errors`) when using transformation to properly handle server-side validations, I have a very detailed example below showing expected code (`form.tsx` accessible via `/form`) vs. the code I had to hack for this to work (`home.tsx` accessible as homepage)

The difference is basically manually parsing errors via this hack, then passing them to show:
```
  useEffect(() => {
    if (actionData) {
      const formErrors = form.store.state.errors;
      const realErrors = formErrors.map((error) =>
        error as unknown as {
          [K in keyof z.infer<typeof ZodSchemaServer>]: z.ZodIssue[]
        }
      );
      console.log("real-errors", JSON.stringify(realErrors));
      setAllErrors(() => {
        return realErrors.reduce((result, errorObj) => {
          Object.keys(errorObj).map(key => {
            const K = key as keyof z.infer<typeof ZodSchemaServer>;
            if (!result[K]) result[K] = [];
            if (errorObj[K]) {
              result[K].push(...errorObj[K]);
            }
          });
          return result;
        }, {} as {[K in keyof z.infer<typeof ZodSchemaServer>]: z.ZodIssue[]});
      });
    }
  }, [actionData]);
```

Reproduction: here

### Your minimal, reproducible example

https://codesandbox.io/p/devbox/fast-forest-fjwkyw

### Steps to reproduce

1. Go to link
2. Run it
3. See code difference between `home.tsx` and `form.tsx`

### Expected behavior

As a user, I expect server-side-validation to not require me to manually set the errors, as a side-note, I first tried using `setFieldMeta` manually too, which also did nothing

### How often does this bug happen?

None

### Screenshots or Videos

_No response_

### Platform

Any

### TanStack Form adapter

None

### TanStack Form version

latest

### TypeScript version

latest

...

---

## Top Comments

**@antlanc7** (+9):

Any update on this? Right now server errors are almost unusable.

**@crutchcorn** [maintainer]:

Can you retest with:

```
npm i https://pkg.pr.new/@tanstack/react-form-nextjs@1890
```

I believe we have a fix for many (if not all) Form SSR behaviors

**@crutchcorn** [maintainer] (+1):

Should be fixed in 1.28.1