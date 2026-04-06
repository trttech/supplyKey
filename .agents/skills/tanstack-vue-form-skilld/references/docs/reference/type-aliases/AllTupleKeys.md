---
id: AllTupleKeys
title: AllTupleKeys
---

# Type Alias: AllTupleKeys\<T\>

```ts
type AllTupleKeys<T> = T extends any ? keyof T & `${number}` : never;
```

Defined in: packages/form-core/src/util-types.ts:65

## Type Parameters

### T

`T`
