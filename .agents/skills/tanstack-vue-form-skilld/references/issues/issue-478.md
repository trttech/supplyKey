---
number: 478
title: "[Docs] Guide page about getting and setting field values"
type: docs
state: open
created: 2023-10-18
url: "https://github.com/TanStack/form/issues/478"
reactions: 8
comments: 2
labels: "[enhancement, good first issue, docs]"
---

# [Docs] Guide page about getting and setting field values

Something that people usually look for when using a forms library is being able to easily get and set field values, so we should have a page in the guide section for that.

Some topics that the page should cover:

- How do I initialize the form?
- How do I initialize the form with values resulting from an API call? (we can show how to do this with and without Tanstack Query)
- How do I set a single field vs the entire form (if it is possible to set all the fields at once)
- Will setting a new value programmatically trigger validation? If not, is there a way to trigger it?
- How do I retrieve the current value of a single field? Of the entire form? (not necessarily within a onchange/onblur callback but also by directly calling the `form` API object)
- How do I listen for changes?