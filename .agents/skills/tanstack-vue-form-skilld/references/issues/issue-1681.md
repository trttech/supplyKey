---
number: 1681
title: form.reset during onSubmit ignores new default values
type: bug
state: open
created: 2025-08-07
url: "https://github.com/TanStack/form/issues/1681"
reactions: 8
comments: 3
labels: "[bug]"
---

# form.reset during onSubmit ignores new default values

### Describe the bug

The issue is that if you use the form's reset function from inside the form's onSubmit with new default values, they will be ignored. 
This only happens if used in combination with form store-related watches such as "isDirty" 
From the troubleshooting done by @LeCarbonator , it appears to be a race condition between handleSubmit and reset.






### Your minimal, reproducible example

https://stackblitz.com/edit/vitejs-vite-jd2ttqqx?file=src%2FApp.tsx

### Steps to reproduce

1. Uncheck the checkbox.
2. Click the Submit button
3. See how the form goes back to the original default values instead of the new ones.

### Expected behavior

Since we are calling the reset function with new values, those values should become the new form values. 

### How often does this bug happen?

Every time

### Screenshots or Videos

_No response_

### Platform

- OS: Any
- Browser: Any
- Node Version: 22

### TanStack Form adapter

react-form

### TanStack Form version

1.18.0

### TypeScript version

v5.8.3

### Additional context

A chat around this issue can be found here

---

## Top Comments

**@romulovalez**:

+1, a workaround for now is to `setTimeout(() => form.reset());`

**@djordje-st**:

> +1, a workaround for now is to `setTimeout(() => form.reset());`

Unfortunately that doesn't work for me either

**@dragonautdev**:

@romulovalez @djordje-st The setTimeout strategy works, but the amount of time you need to wait varies. 

when we discovered the issue, I had to set a timeout of up to 500ms for it to work.