---
id: TupleDeepKeyAndValue
title: TupleDeepKeyAndValue
---

# Interface: TupleDeepKeyAndValue\<TParent, T, TKey\>

Defined in: packages/form-core/src/util-types.ts:56

## Extends

- [`AnyDeepKeyAndValue`](AnyDeepKeyAndValue.md)

## Type Parameters

### TParent

`TParent` *extends* [`AnyDeepKeyAndValue`](AnyDeepKeyAndValue.md)

### T

`T`

### TKey

`TKey` *extends* [`AllTupleKeys`](../type-aliases/AllTupleKeys.md)\<`T`\>

## Properties

### key

```ts
key: `${TParent["key"] extends never ? "" : TParent["key"]}[${TKey}]`;
```

Defined in: packages/form-core/src/util-types.ts:61

#### Overrides

[`AnyDeepKeyAndValue`](AnyDeepKeyAndValue.md).[`key`](AnyDeepKeyAndValue.md#key)

***

### value

```ts
value: 
  | T[TKey]
| Nullable<TParent["value"]>;
```

Defined in: packages/form-core/src/util-types.ts:62

#### Overrides

[`AnyDeepKeyAndValue`](AnyDeepKeyAndValue.md).[`value`](AnyDeepKeyAndValue.md#value)
