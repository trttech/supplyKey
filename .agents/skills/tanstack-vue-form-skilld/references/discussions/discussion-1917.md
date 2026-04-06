---
number: 1917
title: How to pass useForm type to reusable component properly ?
category: Q&A
created: 2025-12-07
url: "https://github.com/TanStack/form/discussions/1917"
upvotes: 4
comments: 0
answered: false
---

# How to pass useForm type to reusable component properly ?

since I am using `any` type for InputField props, i am getting `TS7031: Binding element state, handleChange, handleBlur implicitly has an any type.` type error... in my case, how I properly set types here ? you can check full code in github gist (below link).

I have tried 
type Form = ReturnType<typeof useForm> but it is solving current issue but causing more type errors in my form

...