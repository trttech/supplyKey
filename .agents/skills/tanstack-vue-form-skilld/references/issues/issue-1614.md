---
number: 1614
title: Calling `FieldApi.handleChange(undefined)` sets field to field's default value instead
type: other
state: closed
created: 2025-07-15
url: "https://github.com/TanStack/form/issues/1614"
reactions: 8
comments: 7
---

# Calling `FieldApi.handleChange(undefined)` sets field to field's default value instead

### Describe the bug

When calling `field.handleChange(undefined)` in a framework, it will revert the field's value back to the default value after 1 rerender. It is because the `.update()` method will overwrite `undefined`.

* Since it occurs in `FieldApi.update`, this error does not happen in form-core, but in framework adapters.
* Calling `field.handleChange(null)` works as expected.
* If the default value is also `undefined`, the change is unnoticeable.

### Your minimal, reproducible example

https://stackblitz.com/edit/vitejs-vite-wbyrntnr?file=src%2FApp.tsx

### Steps to reproduce

1. There are two checkboxes per type of form (AppForm, Form)
2. Uncheck the first one to set the value to `undefined`. It will revert to the default value instead of `undefined`.
3. Uncheck the second one to set the value to `null`. It properly sets the value to `null`.

### Expected behavior

As a user, I expect to be able to use `undefined` as an override value regardless of what the default Value is. Use cases include:

* Libraries such as `react-day-picker` which use `undefined` instead of `null` as their state
* Personal implementations that use `undefined`, such as optional select menus.

### How often does this bug happen?

Every time

### Screenshots or Videos

_No response_

### Platform

...