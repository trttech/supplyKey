---
id: DeepKeys
title: DeepKeys
---

# Type Alias: DeepKeys\<T\>

```ts
type DeepKeys<T> = unknown extends T ? string : DeepKeysAndValues<T>["key"];
```

Defined in: packages/form-core/src/util-types.ts:161

The keys of an object or array, deeply nested.

## Type Parameters

### T

`T`
