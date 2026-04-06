---
number: 418
title: "[Feature Request]: Transform values on submit"
type: feature
state: open
created: 2023-08-30
url: "https://github.com/TanStack/form/issues/418"
reactions: 35
comments: 19
labels: "[enhancement]"
---

# [Feature Request]: Transform values on submit

> This feature request comes from https://github.com/houseform/houseform/issues/60, the older form library I maintained

### Description

Ideally, I'd like to have a number, displayed as a string (say, a locale with `1,000,000`) and then transform this number back during the field submission.

```jsx
 <Field
  name="number"
  initialValue={'0'}
  // This is the magic
  transformOnSubmit={v => parseFloat(v)}
  onChangeValidate={z.coerce.number().min(1, 'Must be at least 1')}
/>
```

---

## Top Comments

**@leomelzer** (+8):

I think the idea with `z.input` and `z.output` would be great. I've come here by a little googling and https://github.com/colinhacks/zod/issues/1206

There is a proposed solution which uses `transform` as you suggest @juanvilladev  See https://github.com/colinhacks/zod/issues/1206#issuecomment-2163952886

Looking at standard-schema there is `InferInput` and `InferOutput` which would likely be the right approach for tanstack-form I believe. 

My use case:

...

**@crutchcorn** [maintainer] (+4):

No worries @CheRayLiu! Thanks for being willing in the first place :) 

**@juanvilladev** (+9):

IMO further discussion should go into whether or not transforms on the base schema should be respected. This is how I personally would like it to work:

When we define a zod schema as the validator, the form should allow default values which align with z.input<typeof Schema>
Then the submit handler should infer the types coming from z.output<typeof Schema>. This allows us to keep the transformation and base logic in one area rather than defining a base schema that then needs to be merged with the value you pass to something like transformOnSubmit.

...