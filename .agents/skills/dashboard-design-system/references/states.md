# States

Use this reference for loading, empty, success, and error behavior in Kleos Admin.

## Loading

Rules:

- Keep the layout shape visible
- Prefer skeletons over generic spinners for page and table content
- Avoid full-screen loading takeovers unless the page truly has no usable content yet

Example shape:

```vue
<Card>
  <CardHeader class="space-y-2">
    <Skeleton class="h-6 w-40" />
    <Skeleton class="h-4 w-72" />
  </CardHeader>

  <CardContent class="space-y-3">
    <Skeleton class="h-10 w-full" />
    <Skeleton class="h-10 w-full" />
    <Skeleton class="h-10 w-full" />
  </CardContent>
</Card>
```

## Empty

Rules:

- Keep the message concise
- Explain what is missing
- Provide a next action when appropriate

Example shape:

```vue
<Card class="border-dashed">
  <CardContent class="flex flex-col items-center justify-center gap-3 py-10 text-center">
    <div class="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
      <Search class="h-5 w-5 text-muted-foreground" />
    </div>

    <div class="space-y-1">
      <p class="font-medium">No invoices found</p>
      <p class="text-sm text-muted-foreground">
        Try changing the filters or clearing the search.
      </p>
    </div>

    <Button variant="outline" @click="resetFilters">
      Clear filters
    </Button>
  </CardContent>
</Card>
```

## Error

Rules:

- Page-level failures use inline `Alert`
- Field-level failures stay under the field
- Error copy should state the failure plainly

Example shape:

```vue
<Alert variant="destructive">
  <AlertTitle>Could not load orders</AlertTitle>
  <AlertDescription>
    Refresh the page or try again in a moment.
  </AlertDescription>
</Alert>
```

## Success

Rules:

- Use toast for transient save success
- Keep the tone calm
- Do not celebrate routine admin actions

Example phrases:

- `Store settings saved`
- `Invoice sent`
- `Changes restored`

## Pending Actions

Rules:

- Disable the primary action while pending
- Show a spinner only where it clarifies the active action
- Keep button labels readable while loading

Example shape:

```vue
<Button :disabled="isSubmitting">
  <Loader2 v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
  Save changes
</Button>
```
