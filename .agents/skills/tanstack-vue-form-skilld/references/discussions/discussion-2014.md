---
number: 2014
title: onChange listener on object field not triggered when nested properties change
category: Q&A
created: 2026-02-02
url: "https://github.com/TanStack/form/discussions/2014"
upvotes: 1
comments: 1
answered: false
---

# onChange listener on object field not triggered when nested properties change

I'm trying to get an `OnChange` listener to trigger when anything under an object changes rather than on a specific field. I'm unsure if this is intentionally not triggering or is a bug.

Example Code:
...

---

## Top Comments

**@sunnypatell**:

@JackFazackerley listeners in tanstack form don't bubble from child to parent fields. this is by design since each field is a flat entry in `form.fieldInfo` keyed by its dot-path string, with no parent-child relationship between instances. when `people[0].name` changes, only that field's listener fires (plus the form-level one).

confirmed by maintainer @Balastrong in discussion #743.

**best workaround: form-level `listeners.onChange`**

...