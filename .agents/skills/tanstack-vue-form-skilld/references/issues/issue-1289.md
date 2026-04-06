---
number: 1289
title: "[react-form] there is no way to clear a form value if it has a default value."
type: other
state: closed
created: 2025-03-16
url: "https://github.com/TanStack/form/issues/1289"
reactions: 22
comments: 15
---

# [react-form] there is no way to clear a form value if it has a default value.

### Describe the bug

```ts
useForm({
  defaultValues: {
    status: params.get('status') // assume this is active for example 
  }
})
```

```ts
      <form.Field name="status" asyncAlways>
        {(field) => (
        .... 
        field.setValue(undefined) // doesn't work. it resets status to active.
        form.setFieldValue("status", undefined) // doesn't work. it resets status to active.
        field.setValue(undefined) // doesn't work. it resets status to active.
        )}
      </form.Field> 

```

they all default to the default value 

### Your minimal, reproducible example

TODO

### Steps to reproduce

N/A

### Expected behavior

I would expect that setValue / handleChange would accept `undefiend` and it wouldn't be overridden by the default value.

### How often does this bug happen?

Every time

### Screenshots or Videos

_No response_

### Platform

- OS: Macos
- version: ^1.0.5

### TanStack Form adapter

None

### TanStack Form version

^1.0.5

### TypeScript version

_No response_

### Additional context

_No response_

---

## Top Comments

**@germanski** (+18):

I agree. Unpredictable behavior. Still, this is not a reset of the value. You also have to bypass through null. Waiting for correction

**@Dogfalo** (+6):

I would agree with this, setting undefined and resetting a value to default should be separated. I ended up having to set values to null and then filter them out at the end

**@Daniel88dev** (+4):

I have same issue, need to make one of the values null, or undefined when changing different value. But there seems to be no way, how to set value to null. 