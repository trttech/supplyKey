---
tag: @tanstack/vue-form@1.28.0
version: 1.28.0
published: 2026-01-26
---

# @tanstack/vue-form@1.28.0

### Patch Changes

-   fix: flatten errors consistently when validating before field mount (#2003)

    Fixed an issue where `field.errors` was incorrectly nested as `[[error]]` instead of `[error]` when `form.validate()` was called manually before a field was mounted. The `flat(1)` operation is now applied by default unless `disableErrorFlat` is explicitly set to true, ensuring consistent error structure regardless of when validation occurs.

-   Updated dependencies \[`41faffe`, `7f2453b`]:
    -   @tanstack/form-core@1.28.0
