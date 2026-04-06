---
number: 1460
title: Array subfields missing errors in fieldMeta
type: other
state: open
created: 2025-04-27
url: "https://github.com/TanStack/form/issues/1460"
reactions: 11
comments: 8
---

# Array subfields missing errors in fieldMeta

### Describe the bug

When a user pushes a field using field.pushValue or form.pushFieldValue, errors for the subfields are missing from fieldMeta.

This leads to a really bad state if the new subfield has errors on the form level schema. canSubmit becomes false so they can't submit the form, yet the error cannot be surfaced. 

### Your minimal, reproducible example

https://stackblitz.com/edit/tanstack-form-lntbeysv?file=src%2Findex.tsx

### Steps to reproduce

1. Add a row
2. Notice canSubmit is now false, yet no error is surfaced
3. Click "Log all errors" notice that the form has the errors, but is missing from the fieldMeta

### Expected behavior

In the UI, I would expect the error is immediately surfaced to the user.

### How often does this bug happen?

Every time

### Screenshots or Videos

_No response_

### Platform

See StackBlitz, latest version of TSF, valid TS version

### TanStack Form adapter

react-form

### TanStack Form version

^1.7.0

### TypeScript version

_No response_

### Additional context

This happens because we run the validator before the new pushed subfields mount. Since they have not mounted fieldMeta does not exist leading to the difference between the errorMap on the form and field level. 

I propose that onMount we always check if the form errorMap contains errors for the field. If so, copy it over. 

---

## Top Comments

**@dlindahl** (+3):

I believe I am also seeing this issue if a form is validated before the `FieldApi` instance mounts in the DOM, regardless of explicit `pushFieldValue` behavior.

In my use case, certain form fields are rendered in a Tab Panel that is not mounted unless the user click on the Tab. The form still validates successfully and the unmounted field errors are present in the `FormApi`'s error state as expected.

...

**@rhupp-wps** (+1):

Hey, I wanted to ask what the status of the problem is, the error still exists and we can not display error messages on the arrays. (tested with 1.14.2)

**@ThomasStock**:

I am currently solving the problem with `useField({ form, name })` which seems to create the FieldApi for every field you use it for:

```
/**
 * In multi-tab forms or forms where not all fields are visibile / have mounted UI,
 *  the unmounted fields have no field meta and thus no error state on submit.
 * Tanstack form does not sync form-level errors to fields when they later get mounted, so those fields do not contain earlier errors.
 * Also, when we would want to check/count errors in a unrendered tab, we cannot loop over these fields' meta until the tab has been opened.
 * Solution:
 * We force-mount the fields by using useField. This ensures that the fields are always mounted and have errors in their meta.
 * Todo: reevaluate this once tanstack syncs form-level errors to unmounted fields
 * https://github.com/TanStack/form/issues/1630
 * https://github.com/TanStack/form/issues/1460
 */
function FieldEnsurer({ form, name }: { form: AnyFormApi; name: string }) {
  useField({ form, name });
  return null;
}
```...