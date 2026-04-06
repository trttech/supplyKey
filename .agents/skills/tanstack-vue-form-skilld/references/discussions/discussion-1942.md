---
number: 1942
title: form.handleSubmit not awaitable
category: Q&A
created: 2025-12-19
url: "https://github.com/TanStack/form/discussions/1942"
upvotes: 1
comments: 1
answered: false
---

# form.handleSubmit not awaitable

The signature of form.handleSubmit being async is a bit misleading, as the promise immediately resolves.

Is this per design or a bug?


for example:

```ts
const form = useForm({
    onSubmit: async ({ value }) => {
      const updateModel = InvoiceClient.mapUpdateModel(value as InvoiceModel);
      return updateInvoice.mutateAsync({ id: invoice.id, invoice: updateModel }); // Tried await, return, and a combination
    },
})

const previewInvoice = useMutation({
    mutationKey: ['invoice', 'previewInvoice'],
    mutationFn: async () => {
      // doesn't work; immediately resolves
      await submitForm();
      // works
      const updateModel = InvoiceClient.mapUpdateModel(value as InvoiceModel);
      await updateInvoice.mutateAsync({ id: invoice.id, invoice: upd...

---

## Top Comments

**@LeCarbonator** (+1):

This might have been due to an accidental regression where the promise was no longer returned during submission. It caused runtime errors when trying to attach `.then()` methods and the like.

Could you try updating to latest and checking it?