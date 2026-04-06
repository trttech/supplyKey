---
number: 1474
title: Type instantiation is excessively deep and possibly infinite - With Simple Reproduction
type: other
state: open
created: 2025-05-01
url: "https://github.com/TanStack/form/issues/1474"
reactions: 9
comments: 0
---

# Type instantiation is excessively deep and possibly infinite - With Simple Reproduction

### Describe the bug

This is another instance of the TS error. The reproduction is based on the solid example  with one new field.

That `JsonData` type is taken from here

### Your minimal, reproducible example

https://codesandbox.io/p/devbox/quizzical-snyder-w4wf5q?file=%2Fsrc%2Findex.tsx

### Steps to reproduce

1. Open the reproduction
2. See the error



### Expected behavior

I would expect the form to handle this recursive type.

### How often does this bug happen?

Every time

### Screenshots or Videos

_No response_

### Platform

-

### TanStack Form adapter

solid-form

### TanStack Form version

1.9.0

### TypeScript version

5.8.2

### Additional context

_No response_