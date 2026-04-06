---
number: 1273
title: formOptions missing type inference leads to incorrect inferred types in subforms (withForm)
type: other
state: open
created: 2025-03-13
url: "https://github.com/TanStack/form/issues/1273"
reactions: 7
comments: 3
---

# formOptions missing type inference leads to incorrect inferred types in subforms (withForm)

### Describe the bug

Currently, defining validators within the formOptions function does not allow proper type inference from defaultOptions. To retain type inference, users are forced to define validators within useAppForm at the top-level form.

However, this causes a problem for sub-form components that use withForm. If these sub-forms rely on the return type of formOptions, they do not inherit the validators defined in useAppForm. As a result, fields within the sub-forms lack access to the form-level validators, leading to incorrect type inference. (No issues at runtime).

### Your minimal, reproducible example

https://stackblitz.com/edit/tanstack-form-ajwjukhq?file=src%2Ffeatures%2Fpeople%2Fshared-form.tsx

### Steps to reproduce

Simply go to shared-form.tsx and notice the value prop for validators > onChange is any. 
This illustrates the lack of type inference within formOptions.

Within this second stackblitz you can see what I mean about incorrect type inference if defining validators within useAppForm:

https://stackblitz.com/edit/tanstack-form-oennwahz?file=src%2Ffeatures%2Fpeople%2Faddress-fields.tsx

For this one, notice how within useAppField, we defined an error for that address.line1 that returns a number!
We then defined a validator at the field level for the same field that returns string. 

...