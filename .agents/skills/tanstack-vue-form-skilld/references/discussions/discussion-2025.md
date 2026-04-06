---
number: 2025
title: "Array fields | Validating value by index, validating one array \"row\" exclusively"
category: Q&A
created: 2026-02-06
url: "https://github.com/TanStack/form/discussions/2025"
upvotes: 3
comments: 1
answered: false
---

# Array fields | Validating value by index, validating one array "row" exclusively

Hello everyone. Is there any way to trigger validation of the some index of array field item with built-in Tanstack Form tools? As far as I researched, it is possible to trigger validation of the whole array (field has array validation schema), or a whole form.

A bit of context:
I have a component of table where entries can be added, edited and removed. While editing, I have to check whether the row itself is filled correctly.

Have anyone faced similar issue and how have you resolved this?
Please let me know if some additional input data is needed.

Thanks in advance

---

## Top Comments

**@m-kolomoyets**:

UPD:

I have implemented the separate "sub-form" for each table row that gets default values from the parent form and mutates the parent form only when data is valid and row submit trigger is called. In addition, the logic of removing the row from. both dynamic table and parent form if data is not initially in parent form by the index and uer clicks "cancel".

Here is short demo of the result.

https://github.com/user-attachments/assets/a002f9be-a298-4514-8b95-5a38a7d1809b

---

Code for implementing it (with project-specific abstractions, but the whole idea is recognizable):

Sche...