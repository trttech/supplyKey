---
number: 1839
title: How to use Tanstack Form in conjunction with Tanstack Query mutation for proper form.state.isSubmitSuccessful?
category: Q&A
created: 2025-11-01
url: "https://github.com/TanStack/form/discussions/1839"
upvotes: 3
comments: 0
answered: false
---

# How to use Tanstack Form in conjunction with Tanstack Query mutation for proper form.state.isSubmitSuccessful?

# Context

I am using Tanstack Form in conjunction with Tanstack Query (and Tanstack Router). I do not manage to get the form `isSubmitSuccessful` to be `false` while not having an uncaught Promise at the same time, using `mutate` vs `mutateAsync`.

# TL;DR

**Issue:**

- When using Tanstack Query mutation `mutate` as the form `onSubmit` function means the form is always considered as submitted successfully (`form.state.isSubmitSuccessful`) even if the mutate function failed (which is expected considering mutate is always resolved).
- When using Tanstack Query mutation `mutateAsync` as the form `onSubmit` function means the form is properly considered as submitted unsuccessfully when the mutateAsync function throws, but then there is an uncaught promise.

It is unclear what shou...