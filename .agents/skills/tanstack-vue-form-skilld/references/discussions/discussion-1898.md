---
number: 1898
title: Vue - Best practice for reactive Zod schemas in useForm
category: Q&A
created: 2025-12-02
url: "https://github.com/TanStack/form/discussions/1898"
upvotes: 1
comments: 1
answered: true
---

# Vue - Best practice for reactive Zod schemas in useForm

Hi there, I'm using Zod for validation. I have a scenario where my validation schema needs to be reactive because it depends on asynchronous data (e.g., a user's wallet balance loaded from a hook).

The Problem
I initially tried passing the computed schema directly to the validators option. However, useForm seems to capture the initial value of schema.value, so when the dependent data (uiBalance) updates, the validation logic remains stale (e.g., it still thinks the balance is 0).

```ts
const { uiBalance } = useBalance(); // Async data

// Schema depends on uiBalance
const schema = computed(() => {
  return z.object({
    amount: z.number().max(uiBalance.value),
  });
});

const form = useForm({
  defaultValues: { amount: '' },
  validators: {
    // ❌ This loses reactivity. It uses the initial schema snapshot.
    onChange: schema.value, 
  },
  // ...
});
```...

---

## Accepted Answer

for those who wondering i ended up uses this approach:

```ts
 onChange: ({ formApi }) => {
      const errors = formApi.parseValuesWithSchema(schema.value);
      if (errors) return errors;
    },
```