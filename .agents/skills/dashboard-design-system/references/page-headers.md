# Page Headers

Use these patterns for dashboard pages. Avoid marketing-style hero sections.

## 1. Settings Or Detail Pages

Use this for narrower pages such as store settings, account pages, configuration screens, and detail views.

- Container: `container mx-auto max-w-4xl space-y-6`
- Top row: small icon badge + page title
- Divider: a simple top border under the title row
- Optional state area: success/error alerts directly below the header
- Main content: stacked cards or media cards followed by forms

Visual behavior:

- Title should be direct and operational
- Descriptions should be one sentence, not promotional copy
- Keep the first action close to the title or inside the first card

Example shape:

```vue
<div class="container mx-auto max-w-4xl space-y-6">
  <div class="space-y-4">
    <div class="flex items-center gap-3">
      <div class="bg-primary/10 border-primary/20 flex h-10 w-10 items-center justify-center rounded-lg border">
        <StoreIcon class="text-primary h-5 w-5" />
      </div>

      <h1 class="text-2xl font-semibold tracking-tight">
        Store settings
      </h1>
    </div>

    <div class="border-border border-t" />
  </div>

  <Alert v-if="errorMessage" variant="destructive">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{{ errorMessage }}</AlertDescription>
  </Alert>
</div>
```

## 2. Data-Heavy Pages

Use this for orders, invoices, history views, and list screens.

- Prefer a wider layout
- Keep the page intro compact
- Let the datatable toolbar carry search, filters, and view options
- Do not add oversized banners above the table

## 3. Header Checklist

- Use a clear noun-based page title
- Add a short supporting description only if it improves task clarity
- Keep icon use minimal and functional
- Do not introduce large gradient backgrounds, hero illustrations, or centered landing-page layouts
- Keep alert messages below the header, not mixed into the title row
