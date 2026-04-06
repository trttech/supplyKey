---
number: 1078
title: form.setFieldValue on an un-initialized field will create meta missing errors
type: question
state: open
created: 2024-12-16
url: "https://github.com/TanStack/form/issues/1078"
reactions: 4
comments: 5
labels: "[question]"
---

# form.setFieldValue on an un-initialized field will create meta missing errors

### Describe the bug

If you have a field that is displayed conditionally in the form, and use form.setFieldValue without dontUpdateMeta: true before it's initialization, it will create meta for this field without errors. I understand that makes more sense to update the value with dontUpdateMeta: true if the field wasn't initialized yet, but it can lead to some inconsistent behavior since we are not expecting errors to be undefined.

 

### Your minimal, reproducible example

https://codesandbox.io/p/github/sinuheshinbr/tanstack-form-missing-errors/main?workspaceId=ws_NWHNzLQ8YDitxFDjr6vrpe

### Steps to reproduce

go to: https://codesandbox.io/p/github/sinuheshinbr/tanstack-form-missing-errors/main?workspaceId=ws_NWHNzLQ8YDitxFDjr6vrpe
click on "setFieldValue"
then clikc on "Show"

...