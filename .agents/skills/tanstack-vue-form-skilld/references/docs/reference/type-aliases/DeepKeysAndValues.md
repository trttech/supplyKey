---
id: DeepKeysAndValues
title: DeepKeysAndValues
---

# Type Alias: DeepKeysAndValues\<T\>

```ts
type DeepKeysAndValues<T> = DeepKeysAndValuesImpl<T> extends AnyDeepKeyAndValue ? DeepKeysAndValuesImpl<T> : never;
```

Defined in: packages/form-core/src/util-types.ts:129

## Type Parameters

### T

`T`
