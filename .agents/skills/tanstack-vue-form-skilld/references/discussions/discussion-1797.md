---
number: 1797
title: How to init defaultValues from an async resource without showing loading
category: Q&A
created: 2025-10-07
url: "https://github.com/TanStack/form/discussions/1797"
upvotes: 2
comments: 0
answered: false
---

# How to init defaultValues from an async resource without showing loading

One problem I ran into was initializing the defaultValues from an API call without rendering a loading.
I wanted my form the be disabled and become active as data is loaded.

One solution I came up with was using a useEffect to reset form upon request success

```jsx
  useEffect(() => {
    if (status !== 'success') return;

    const defaultValues = { ... };
    form.reset(defaultValues, { keepDefaultValues: true });
  }, [status]);
```

But after that `isPristine`, `isDefaultValue`, and etc. became false.

I was wondering what can I do to fix this? I want the submit button to be disabled before any changes applied to the form.

- Also note that the `listeners.onChange` doesn't work as well since the `reset()` call triggers it as well.