# Dashboard Cards

Use this reference for KPI cards, summary panels, and compact operational sections.

## KPI Cards

Use for:

- revenue, order count, conversion, pending tasks

Rules:

- Keep the label short
- Make the number dominant
- Keep supporting trend or context secondary
- Avoid over-decorating the card

Example shape:

```vue
<Card>
  <CardHeader class="pb-2">
    <CardDescription>Net sales</CardDescription>
    <CardTitle class="text-2xl font-semibold tracking-tight">
      $12,480
    </CardTitle>
  </CardHeader>

  <CardContent>
    <p class="text-sm text-muted-foreground">
      Up 8.4% from last week
    </p>
  </CardContent>
</Card>
```

## Section Cards

Use for:

- grouped settings
- configuration summaries
- compact operational blocks with one or two actions

Rules:

- Start with a clear header
- Keep the body focused on one topic
- Avoid nesting cards inside cards unless the inner card is materially distinct

## Quick Action Cards

Use for:

- shortcuts to common admin tasks
- launch points for create, review, or reconcile actions

Rules:

- Keep the title action-oriented
- Support with one sentence of explanation at most
- Use one primary action

## Card Density

- A page can mix open sections and cards
- If every section is a card, re-evaluate whether some groups can be simplified into spacing plus headings
- Cards should clarify structure, not become the structure
