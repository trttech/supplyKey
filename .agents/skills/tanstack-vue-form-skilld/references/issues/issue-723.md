---
number: 723
title: `canSubmit` is always `true` on first render of form
type: other
state: closed
created: 2024-05-29
url: "https://github.com/TanStack/form/issues/723"
reactions: 15
comments: 10
---

# `canSubmit` is always `true` on first render of form

### Describe the bug

I am using a form with the `zodValidator` and have several field-level validations. On the first render the `canSubmit` property is true even though several fields are invalid. After changing the first input the validations run and `canSubmit` is invalid.

### Your minimal, reproducible example

https://tanstack.com/form/latest/docs/framework/react/examples/zod

### Steps to reproduce

1. Go to the official zod example
2. The `Submit` button is enabled even though the firstName has a minLength validation of 3
3. Type something in any of the fields
4. The `Submit` button is disabled until all the validations are correct

### Expected behavior

I would expect that the `canSubmit` property considers all validations on the first render and shows a disabled `Submit` button from the start instead of changing from enabled to disabled after typing one letter and going back to enabled after all validations are correct.

### How often does this bug happen?

Every time

### Screenshots or Videos

_No response_

### Platform

OS: MacOS
Browser: Arc

### TanStack Form adapter

react-form

### TanStack Form version

0.20.2

### TypeScript version

_No response_

### Additional context

_No response_

---

## Top Comments

**@Balastrong** [maintainer] (+6):

Hey! The current behavior in the example seems correct to me, the validator is triggered `onChange` hence I'd expect no validation to be run as long as the value doesn't change.

What you're trying to achieve might be validating `onMount`.

---

With that said, if we agree that `onMount` is the answer, I noticed that there might be a bug there preventing `canSubmit` to go false but it's another topic we might want to tackle (and I already have an idea why we have this bug).

An alternative option could be to manually run `form.validateAllFields("change")` when your form mounts.

**@OPerel** (+16):

I'm having the same issue. I'm trying to run validations at `onChange` (tried both at the form level and at the field level). The form is initially valid, both `canSubmit` and `isValid` are true, even though all fields are empty and thus invalid. Only when changing one of the values the form state is changed to invalid and `canSubmit` is false.
Using `onMount` for the initial validation doesn't help as this only runs when the form is mounted, causing the form to stay invalid even when fields are populated and the state changes.
All I want is to have the submit button disabled until the form is...

**@johanfive** (+9):

I just wanted to point out this alternative solution as well:
```js
<form.Subscribe selector={(state) => state.isValid && !state.isPristine}>
    {(canSubmit) => <Button type="submit" disabled={!canSubmit}>Submit</Button>}
</form.Subscribe>
```
With that you do not need to duplicate your validator into `onMount`. You just don't rely on the OOTB `state.canSubmit` and make up your own with a `selector`.