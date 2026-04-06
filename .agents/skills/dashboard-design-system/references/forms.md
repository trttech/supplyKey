# Forms

Use this reference for settings forms and operational edit flows in Kleos Admin.

## Stack

- `@tanstack/vue-form` for form state
- Generated Zod schemas when available
- shadcn `Field`, `FieldSet`, `FieldGroup`, `FieldLabel`, `FieldDescription`, `FieldError`
- shadcn inputs such as `Input`, `Select`, `Checkbox`
- Pinia Colada mutation for submit
- Toast for submit feedback

## Expected Structure

1. Start with a `Card`
2. Add `CardHeader` with `CardTitle` and `CardDescription`
3. Group related controls with `FieldSet` and `FieldGroup`
4. Render each field through `form.Field`
5. Keep validation errors directly below the control
6. Put submit/reset actions at the bottom with clear pending state

## Example Shape

```vue
<Card>
  <CardHeader>
    <CardTitle>Basic information</CardTitle>
    <CardDescription>Essential store details displayed to customers</CardDescription>
  </CardHeader>

  <CardContent>
    <FieldSet>
      <FieldGroup class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <form.Field name="business_name">
          <template #default="{ field }">
            <Field>
              <FieldLabel :for="field.name">Business name</FieldLabel>
              <Input
                :id="field.name"
                :model-value="field.state.value"
                @update:model-value="field.handleChange"
                @blur="field.handleBlur"
              />
              <FieldError :errors="field.state.meta.errors" />
            </Field>
          </template>
        </form.Field>
      </FieldGroup>
    </FieldSet>
  </CardContent>
</Card>
```

## Form Rules

- Labels sit above inputs
- Helper text is optional but should be purposeful
- Error text stays inline and close to the field
- Use generated schema validation where possible
- Avoid custom field wrappers unless multiple pages need the same behavior
- Do not turn settings forms into wizard-like flows unless the user asks for that specifically
