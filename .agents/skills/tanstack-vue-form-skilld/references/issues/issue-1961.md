---
number: 1961
title: Entrire array elements are re-rendered when updating one array element
type: other
state: open
created: 2025-12-29
url: "https://github.com/TanStack/form/issues/1961"
reactions: 6
comments: 2
---

# Entrire array elements are re-rendered when updating one array element

### Describe the bug

It seems like when you use array fields in TanStack Form with vue, it re-renders each element in the list when any of the array elements is changed. It doesn't slow down the performance in case you have one input field, but once your form has more items, it becomes extremely slow.

### Your minimal, reproducible example

https://stackblitz.com/edit/tanstack-form-cuwgrt8f?file=src%2Fmain.ts

### Steps to reproduce

1. Open the repro repo
2. Click the "Open preview in a new tab" button (it is needed to see Vue-scan changes, they won't be visible when the view is split.
3. Add a few fields to the form
4. Type any value in any input
5. See that all items are re-rendered in the list

### Expected behavior

As a user, I would expect that only the changed fields are re-rendered, while in actual behaviour in re-renders all fields

### How often does this bug happen?

Every time

### Screenshots or Videos

_No response_

### Platform

- **OS**: MacOS
- **Browser**: Chrome
- **Version**: 143.0.7499.170 (Official Build) (arm64)

### TanStack Form adapter

vue-form

### TanStack Form version

1.27.7

### TypeScript version

5.8.2

### Additional context

_No response_