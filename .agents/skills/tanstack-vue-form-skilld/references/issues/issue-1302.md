---
number: 1302
title: React 17 type issue on form.Field and form.Subscribe
type: bug
state: closed
created: 2025-03-18
url: "https://github.com/TanStack/form/issues/1302"
reactions: 11
comments: 7
labels: "[bug]"
---

# React 17 type issue on form.Field and form.Subscribe

### Describe the bug

Getting this issue for the jsx components in react 17 

  Type 'ReactNode' is not assignable to type 'ReactElement<any, any> | null'.
        Type 'undefined' is not assignable to type 'ReactElement<any, any> | null'.


### Your minimal, reproducible example

https://codesandbox.io/p/devbox/fklwm9

### Steps to reproduce

1. Create a react 17 project
```json
    "react": "^17.0.1",
    "react-dom": "^17.0.1"
    "@types/react": "^17.0.1",
    "@types/react-dom": "^17.0.1"

```
2. Use the simple form example
3. `<form.Field>` will throw the above ts error

### Expected behavior

Expect the ts error to not be there and for react 17 to be supported. 

### How often does this bug happen?

Every time

### Screenshots or Videos

_No response_

### Platform

- Every system. Reproducible example in codesandbox. 

### TanStack Form adapter

None

### TanStack Form version

v1.1.0

### TypeScript version

_No response_

### Additional context

_No response_

---

## Top Comments

**@ben-heimberg**:

Any news about this?

**@kikoane**:

i have the same problem, doesn't work with react 17 types atm

**@abritov**:

Same error on react 18.2.0