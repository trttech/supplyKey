---
number: 1628
title: `evaluate` does not correctly compare objects which breaks formOptions updates
type: bug
state: open
created: 2025-07-23
url: "https://github.com/TanStack/form/issues/1628"
reactions: 3
comments: 3
labels: "[bug]"
---

# `evaluate` does not correctly compare objects which breaks formOptions updates

### Describe the bug

This is essentially the same issue as https://github.com/TanStack/store/issues/218, but specific to `useForm`'s form options updates. If default values were changed and the changed value is an object that does not return property keys via `Object.keys`—such as `Date`, `File`, or `Temporal.Duration`/`Temporal.PlainDate`—then `evaluate` returns true and `shouldUpdateValues` returns false. This causes the form API to not be updated, so nothing rerenders despite a prop change.

### Your minimal, reproducible example

https://codesandbox.io/p/devbox/modest-jang-4635xz

### Steps to reproduce

...