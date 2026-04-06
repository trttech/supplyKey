---
id: DeepRecord
title: DeepRecord
---

# Type Alias: DeepRecord\<T\>

```ts
type DeepRecord<T> = { [TRecord in DeepKeysAndValues<T> as TRecord["key"]]: TRecord["value"] };
```

Defined in: packages/form-core/src/util-types.ts:154

## Type Parameters

### T

`T`
