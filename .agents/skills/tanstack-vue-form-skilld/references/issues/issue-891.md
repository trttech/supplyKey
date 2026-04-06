---
number: 891
title: "\"Type instantiation is excessively deep and possibly infinite\" and tsc crashing"
type: bug
state: closed
created: 2024-08-07
url: "https://github.com/TanStack/form/issues/891"
reactions: 15
comments: 23
labels: "[bug, help wanted]"
---

# "Type instantiation is excessively deep and possibly infinite" and tsc crashing

### Describe the bug

First off, thanks for the awesome library!

We have been observing some weird instances of "Type instantiation is excessively deep and possibly infinite". For some files, tsc is even crashing.

Our repo is private so can't share it but we created a couple of custom Fields/components, so maybe you can spot where this is coming from:

1. We have been using zod as a form validator on Fields
2. We wrap all forms in a form context provider to avoid prop drilling and are passing in reference from useRef(form) as we had some problems with stability in earlier versions (not sure if this still makes any difference).
<details>
  <summary>Code</summary>

```javascript
import type { MutableRefObject } from "react";
import { createContext, useContext } from "react";
import type { useForm } from "@tanstack/react-form";

export const FormContext: React.Context<MutableRefObject<ReturnType<typeof useForm<any>>> | undefined> =
  createContext<MutableRefObject<ReturnType<typeof useForm<any>>> | undefined>(undefined);

export function useFormContext<V>(): ReturnType<typeof useForm<V>> {
  const form = useContext(FormContext) as MutableRefObject<ReturnType<typeof useForm<V>>> | undefined;
  if (!form) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return form.current;
}
```

</details>

3. We are using custom fields like in the code below

<details>
  <summary>Code</summary>

...

---

## Top Comments

**@Spaubleit** (+4):

I recreated the most minimal reproduction possible:
```typescript
import { FormApi, useForm } from "@tanstack/react-form";

const register = <Data,>(form: FormApi<Data>) => {};

const App = () => {
  const form = useForm({
    defaultValues: {
      name: "",
      title: "",
    },
  });

  const x = register(form);

  return null;
};

export default App;

```
CodeSandbox

---

Speaking of custom components, we've been drafting a possible API and recommended pattern in #825 (component example in https://github.com/TanStack/form/pull/825/files#diff-b2e0803ded7363bf3432f160f7c7f6e9bf...

**@Balastrong** [maintainer]:

Can you give it a try with the version from #1016?

To use it in your projects use this install script:
```
pnpm add https://pkg.pr.new/@tanstack/react-form@1016
```