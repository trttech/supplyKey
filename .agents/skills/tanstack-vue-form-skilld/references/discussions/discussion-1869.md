---
number: 1869
title: "Vue-Form: Is there a TypeScript pattern for creating reusable form components?"
category: Q&A
created: 2025-11-23
url: "https://github.com/TanStack/form/discussions/1869"
upvotes: 2
comments: 1
answered: false
---

# Vue-Form: Is there a TypeScript pattern for creating reusable form components?

I'm trying to create reusable Vue components that accept a form from `useForm()` but struggling with TypeScript patterns.

## Example

```vue
<script setup lang="ts">
// How do I properly type this?
interface Props {
  form: any 
  name: string
}

const { form, name } = defineProps<Props>()
</script>

<template>
  <form.Field v-slot="{ field }" :name="name">
    <input 
      :value="field.state.value"
      @input="(e) => field.handleChange((e.target as HTMLInputElement).value)"
    />
  </form.Field>
</template>
```

## What I want to achieve:
Remove boilerplate from actual forms by wrapping all my reusable components with a Field component

## Question:

Is there an established TypeScript pattern for this in Vue? I noticed `createFormHookContexts` was added...

---

## Top Comments

**@mkeyy0**:

I guess it's a related issue https://github.com/TanStack/form/discussions/1464, there are no available alternatives for this in Vue, which is quite sad :( , I ran into the same issue, want to decompose the form, but it is blocked by this Vue issue: https://github.com/vuejs/core/issues/8553