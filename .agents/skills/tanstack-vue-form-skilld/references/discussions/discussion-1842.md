---
number: 1842
title: Sharing `onSubmitInvalid` logic
category: Q&A
created: 2025-11-03
url: "https://github.com/TanStack/form/discussions/1842"
upvotes: 2
comments: 0
answered: false
---

# Sharing `onSubmitInvalid` logic

I'm trying to build a consistent form experience where when the user encounters an error, it scrolls to the invalid field. I see there's an example of this in the docs, but the issue I'm running into is sharing that logic with all forms. I thought `formOptions` would be a good fit, but TypeScript complains about incompatible types (since consuming form has `defaultValues` defined but I want my options to be `any` `TFormData`.

Can anyone give advice/code example where they have a consistent Form react component that is used with multiple forms *and* it shares some common behaviors?

Do you really need to type `formOptions` as this to get it to work?
`formOptions<any, any, any, any, any, any, any, any, any, any, any, any, any>`

Thank you!