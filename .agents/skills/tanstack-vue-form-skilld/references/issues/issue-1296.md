---
number: 1296
title: withForm types break if defaultValues includes any extra field
type: other
state: closed
created: 2025-03-17
url: "https://github.com/TanStack/form/issues/1296"
reactions: 11
comments: 13
---

# withForm types break if defaultValues includes any extra field

### Describe the bug

Using withForm breaks whenever any extra field is added to the parents defaultValues.

```
import './App.css'
import { useAppForm, withForm } from './hooks/form'

function App() {

  const form = useAppForm({
    defaultValues: {
      form1: '',
      form2: ''
    }
  })

  return (
    <div>
      <ChildForm1 form={form} />
    </div>
  )
}

export default App


const ChildForm1 = withForm({
  defaultValues: {
    form1: ''
  },
  render: ({form}) => {
    return (
      <div />
    )
  }
})
```

### Your minimal, reproducible example

https://github.com/ljukas/tanstack-withform-multiple

### Steps to reproduce

Create a child form using withForm from the createHookForm api. Use `useAppForm`, add the required defaultValues for the child form, then add any extra field to the parents defaultValues. The child-form form props types will no give a red squiggly line.

This also means you cannot compose multiple child forms together, or you can but you get type errors on the childform form-prop

### Expected behavior

As I user I expect the child-form to only care about the fields that it itself needs. So that I can compose multiple child forms together, which I expect is the use case from the start.

### How often does this bug happen?

Every time

### Screenshots or Videos

_No response_

### Platform

All

### TanStack Form adapter

react-form

### TanStack Form version

1.1.0

### TypeScript version

5.7.2

### Additional context

_No response_

---

## Top Comments

**@ljukas** (+19):

@MusKRI Which is what Im trying to report as an error. If the child form needs to have exactly the same default values as the main form it is no longer a child form, it is the form. Say you want to reuse the same child form in two different forms that have seperate values except for the values that the child form needs. You cannot do that reliably atm.

#1273 seems to be a different issue. Using two different child forms inside a parent form and spreading their formOptions will override each others values, so doing that is not reliable.

```
const childForm1Opts = formOptions({
 defaultValues: {
   form1: ''
}})

const childForm1Opts = formOptions({
 defaultValues: {
   form3: ''
}})

...

**@ForrestDevs** (+8):

> > Which is what Im trying to report as an error. If the child form needs to have exactly the same default values as the main form it is no longer a child form, it is the form. Say you want to reuse the same child form in two different forms that have seperate values except for the values that the child form needs. You cannot do that reliably atm.
> 
> This.

Also one upping this, this is exactly what I thought I could do with the `withForm` HOC but have been running into all the same issues as above. 

...

**@Velua** (+9):

> Say you want to reuse the same child form in two different forms that have seperate values except for the values that the child form needs. You cannot do that reliably atm.

Yeah I thought that was the whole point, bit confusing!