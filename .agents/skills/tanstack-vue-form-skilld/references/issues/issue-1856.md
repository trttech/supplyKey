---
number: 1856
title: Type inference not working for createServerValidate with Standard Schema (Zod)
type: other
state: open
created: 2025-11-17
url: "https://github.com/TanStack/form/issues/1856"
reactions: 5
comments: 1
---

# Type inference not working for createServerValidate with Standard Schema (Zod)

## Description

When using `createServerValidate` from `@tanstack/react-form-start` with Zod schemas (which implement Standard Schema v1), the return type is `Promise<any>` instead of inferring the output type from the schema.

Since TanStack Form v1.0+ supports Standard Schema natively, and Zod v4+ properly implements the Standard Schema spec with type information available via `StandardSchemaV1.InferOutput`, I would expect `createServerValidate` to infer the validated data type automatically.

## Environment

- `@tanstack/react-form-start`: 1.25.0
- `@tanstack/form-core`: 1.25.0
- `zod`: 4.1.12
- TypeScript: (affects all versions)

## Current Behavior

```typescript
import { createServerValidate, formOptions } from '@tanstack/react-form-start';
import { z } from 'zod';

const emailFormOpts = formOptions({
  defaultValues: {
    email: '',
  },
});

const loginSchema = z.object({
  email: z.string().email(),
  redirect: z.string().default('/'),
});

const serverValidate = createServerValidate({
  ...emailFormOpts,
  onServerValidate: loginSchema,
});

// Type is inferred as Promise<any> instead of Promise<{ email: string; redirect: string }>
const validatedData = await serverValidate(formData);
//    ^? any
```

## Expected Behavior

The return type should be inferred from the Zod schema:

```typescript
const validatedData = await serverValidate(formData);
//    ^? { email: string; redirect: string }
```

## Root Cause Analysis

After investigating the source code:

...