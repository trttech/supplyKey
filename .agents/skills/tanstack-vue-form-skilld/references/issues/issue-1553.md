---
number: 1553
title: Recursive type, breaks the typesafety
type: other
state: open
created: 2025-06-03
url: "https://github.com/TanStack/form/issues/1553"
reactions: 8
comments: 1
---

# Recursive type, breaks the typesafety

### Describe the bug

If I have an object, that can reference itself. It will break the type-safety of the form. 

For example here the `list` is any, and the function `getFieldValue` or the property `name` on `Field` does not have any type safety either.

```
type Name = {
	name: string;
	list: Name[];
};

const Component = () => {
	const form = useForm({
		defaultValues: {
			name: "test",
			list: [],
		} as Name,
	});
	const list = form.getFieldValue("list");
	return <div></div>;
};
```

### Your minimal, reproducible example

check the description

### Steps to reproduce

Create a form like I showed in the example.

### Expected behavior

I would expect the `list` variable to be of type `Name[]` and `name` property etc... would remain type safe.

### How often does this bug happen?

Every time

### Screenshots or Videos

_No response_

### Platform

- linux
- chrome

### TanStack Form adapter

None

### TanStack Form version

1.11.1

### TypeScript version

5.8.3

### Additional context

_No response_