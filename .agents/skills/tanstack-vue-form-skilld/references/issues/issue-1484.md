---
number: 1484
title: Type instantiation is excessively deep and possibly infinite with recursive field value structure
type: other
state: open
created: 2025-05-07
url: "https://github.com/TanStack/form/issues/1484"
reactions: 9
comments: 1
---

# Type instantiation is excessively deep and possibly infinite with recursive field value structure

### Describe the bug

We are trying to adopt tanstack form in our CMS, where we have complex and recursive content structure, and in the form types we represent the field values as:

```ts
export type FieldValues = {
  [key: string]: string | string[] | number | boolean | null | FieldValues | FieldValues[];
};
```

Also, we are passing down the `form` instance via a provider as our codebase is huge and we need a context to share the form instance deep down the tree.

```ts
type FormContextType = ReactFormExtendedApi<
  FieldValues,
  FormValidateOrFn<FieldValues> | undefined,
  ZodType<FieldValues, ZodTypeDef, FieldValues>,
  FormAsyncValidateOrFn<FieldValues> | undefined,
  FormValidateOrFn<FieldValues> | undefined,
  FormAsyncValidateOrFn<FieldValues> | undefined,
  FormValidateOrFn<FieldValues> | undefined,
  FormAsyncValidateOrFn<FieldValues> | undefined,
  FormAsyncValidateOrFn<FieldValues> | undefined,
  {}
> | null;

export const FormContext = React.createContext<FormContextType>(null);

export const FormProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: FormContextType;
}) => {
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

function App() {
  const form = useForm({
    defaultValues: defaultPeople,
    onSubmit({ value }) {
      alert(JSON.stringify(value));
    },
  });

...

---

## Top Comments

**@taylous**:

it's not precise, but perhaps you could try removing `ReactNode` type or narrowing the type inference.

i actually encountered the same issue recently.
in my case, it happened when I tried form composition using `withForm`.
the root cause turned out to be that one of the properties declared in `defaultValues` within the `formOptions` used in `useAppForm` had a `ReactNode` type.
> all other properties were of type string!

after removing that, the error disappeared.
let me share a portion of my code with you.


```ts
type Information = {
    id: string;
    // ... ...
    target: ReactNode,  // this line was the cause of the issue.
}

export const defaultInformation: Information= {...}


function Playground() {
  const form = useAppForm({
    ...defaultInformation,
    onSubmit: ({ value }) => { ... },
  });

...