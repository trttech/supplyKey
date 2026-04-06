---
number: 1813
title: Union types are not handled correctly
type: bug
state: open
created: 2025-10-20
url: "https://github.com/TanStack/form/issues/1813"
reactions: 3
comments: 0
labels: "[bug]"
---

# Union types are not handled correctly

### Describe the bug

The internal types of Tanstack Form, `DeepValue` and `DeepKeysAndValues` don't handle union types correctly and seem to collapse them.

```ts
type Example = { id: string } | { id: undefined };

type Test = DeepKeysAndValues<Example>
//   ^? { key: "id"; value: string; }
```

```ts
const testObj: { id: string } | { id: undefined } = Math.random()
    ? { id: undefined }
    : { id: '' }

type idField = DeepValue<typeof testObj, 'id'>
// Type error - TS2322: Type undefined is not assignable to type string
const a: idField = undefined
const b: idField = 'zzz'
```

My use case was using a union type with `withForm`,  this also happens with `withFieldGroup` 

```ts
import type { MergeExclusive, RequiredDeep } from 'type-fest'

export type EditType = ContactType & ContactPatchType // ContactType has readonly properties like `id`, ContactPatchType has the properties that are editable
export type CreateType = RequiredDeep<ContactDataType> // ContactDataType contains properties that are used for initial create, so no `id` for example
type EitherType = MergeExclusive<CreateType, EditType>

...