# @tanstack/vue-form

## 1.28.3

### Patch Changes

- form arrays now work again (#2041)

- Updated dependencies [`0b3952d`]:
  - @tanstack/form-core@1.28.3

## 1.28.2

### Patch Changes

- bump @tanstack/store dependency to 0.8.0 (#2038)

- Updated dependencies [`a07862d`]:
  - @tanstack/form-core@1.28.2

## 1.28.1

### Patch Changes

- Updated dependencies [`72d970a`]:
  - @tanstack/form-core@1.28.1

## 1.28.0

### Patch Changes

- fix: flatten errors consistently when validating before field mount (#2003)

  Fixed an issue where `field.errors` was incorrectly nested as `[[error]]` instead of `[error]` when `form.validate()` was called manually before a field was mounted. The `flat(1)` operation is now applied by default unless `disableErrorFlat` is explicitly set to true, ensuring consistent error structure regardless of when validation occurs.

- Updated dependencies [`41faffe`, `7f2453b`]:
  - @tanstack/form-core@1.28.0

## 1.27.7

### Patch Changes

- Updated dependencies [`3519cce`]:
  - @tanstack/form-core@1.27.7

## 1.27.6

### Patch Changes

- Updated dependencies [`c526378`]:
  - @tanstack/form-core@1.27.6

## 1.27.5

### Patch Changes

- Updated dependencies [`36fa503`, `01b24a9`]:
  - @tanstack/form-core@1.27.5

## 1.27.4

### Patch Changes

- Updated dependencies [`c753d5e`]:
  - @tanstack/form-core@1.27.4

## 1.27.3

### Patch Changes

- Updated dependencies [`c2ecf5d`]:
  - @tanstack/form-core@1.27.3

## 1.27.2

### Patch Changes

- Updated dependencies []:
  - @tanstack/form-core@1.27.2

## 1.27.1

### Patch Changes

- Updated dependencies [`3b080ec`]:
  - @tanstack/form-core@1.27.1

## 1.27.0

### Patch Changes

- Updated dependencies [`8afbfc3`, `4e92a91`]:
  - @tanstack/form-core@1.27.0

## 1.26.0

### Patch Changes

- Updated dependencies [`74f40e7`]:
  - @tanstack/form-core@1.26.0

## 1.25.0

### Patch Changes

- Updated dependencies [`004835f`]:
  - @tanstack/form-core@1.25.0

## 1.23.9

### Patch Changes

- Updated dependencies [`8ede6d0`]:
  - @tanstack/form-core@1.24.5

## 1.23.8

### Patch Changes

- form-core: Optimise event client emissions and minor layout tweaks (#1758)

- Updated dependencies [`94631cb`]:
  - @tanstack/form-core@1.24.4

## 1.23.7

### Patch Changes

- Updated dependencies [`33cce81`]:
  - @tanstack/form-core@1.24.3: respect dontValidate option in formApi array modifiers (#1775)

## 1.23.6

### Patch Changes

- Updated dependencies [`74af33e`]:
  - @tanstack/form-core@1.24.2: prevent runtime errors when using `deleteField` (#1706)

## 1.23.5

### Patch Changes

- Updated dependencies [`2cfe44c`]:
  - @tanstack/form-core@1.24.1

## 1.23.4

### Patch Changes

- Updated dependencies [`c978946`]:
  - @tanstack/form-core@1.24.0

## 1.23.3

### Patch Changes

- Updated dependencies [`f608267`]:
  - @tanstack/form-core@1.23.3

## 1.23.2

### Patch Changes

- Updated dependencies [`7cf3728`]:
  - @tanstack/form-core@1.23.2

## 1.23.1

### Patch Changes

- Updated dependencies [`db96886`]:
  - @tanstack/form-core@1.23.1

## 1.23.0

### Patch Changes

- Updated dependencies [`773c1b8`, `1e36222`]:
  - @tanstack/form-core@1.23.0

## 1.21.1

### Patch Changes

- Updated dependencies [`d2b6063`]:
  - @tanstack/form-core@1.22.0
