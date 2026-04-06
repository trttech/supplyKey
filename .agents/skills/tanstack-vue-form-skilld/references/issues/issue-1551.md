---
number: 1551
title: Records fields have wrong types
type: bug
state: open
created: 2025-06-03
url: "https://github.com/TanStack/form/issues/1551"
reactions: 3
comments: 1
labels: "[bug]"
---

# Records fields have wrong types

### Describe the bug

I wonder if it is possible to have such field value with TanStack Form. Pretty sure it should (and is) but the types seem wrong:
```ts
function App() {
  const form = createForm(() => ({
    defaultValues: {
      firstName: '',
      lastName: '',
      address: {
        home: {
          street: '',
          number: '',
        },
      } as Record<string, { street: string; number: string }>,
    },
    ...
  }));

  return (
    <div>
      <h1>Simple Form Example</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        ...
        <div>
          <form.Field
            name={`address.${'home'}.street`}
            children={(field) => (
              <>
                <label for={field().name}>Street:</label>
                <input
                  id={field().name}
                  name={field().name}
                  value={field().state.value}
                  onBlur={field().handleBlur}
                  onInput={(e) => field().handleChange(e.target.value)}
                />
                <FieldInfo field={field()} />
              </>
            )}
          />
        </div>
```...