---
number: 2026
title: Composing forms when formOptions defaultValues is dynamic
category: Q&A
created: 2026-02-06
url: "https://github.com/TanStack/form/discussions/2026"
upvotes: 1
comments: 0
answered: false
---

# Composing forms when formOptions defaultValues is dynamic

I'm having trouble figuring out a clean way to compose forms spread across multiple files / components when the formOptions are "dynamic". For instance, an entity is loaded from the server and its values are used as the "defaultValues" for formOptions. In the examples of form composition, formOptions is always declared in some "shared options" file and exported. Things get complicated if some of the form options are dynamic.

A few options I've explored so far:

1. Extracting form options out to a hook, prop drilling the "initial state" to child form components, and regenerating the form options everywhere, using `useTypedAppFormContext`
2. Drilling the `formOptions` everywhere. Not pretty - there's like 12 generic types on `FormOptions`... 
3. Contextual `formOptions` + `useTypedApp...