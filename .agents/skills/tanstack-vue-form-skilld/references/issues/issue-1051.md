---
number: 1051
title: Form options are stale after submit
type: bug
state: open
created: 2024-12-02
url: "https://github.com/TanStack/form/issues/1051"
reactions: 2
comments: 3
labels: "[bug]"
---

# Form options are stale after submit

### Describe the bug

I want to disable the submit button after the submission. I compare `options.defaultValues` and `values` from the store to determine whether they are equal. However, the next render after submission contains stale options. This happens likely because of the `useIsomorphicLayoutEffect` that updates the options here. I wonder maybe the `formApi.update` can be called during the render

### Your minimal, reproducible example

https://codesandbox.io/p/sandbox/elated-brahmagupta-sj6mvk

### Steps to reproduce

1. Type "Johny" in the input
2. Click the submit button
3. Click the submit button again

### Expected behavior

...