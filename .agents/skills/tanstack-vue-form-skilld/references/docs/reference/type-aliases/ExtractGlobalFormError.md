---
id: ExtractGlobalFormError
title: ExtractGlobalFormError
---

# Type Alias: ExtractGlobalFormError\<TFormError\>

```ts
type ExtractGlobalFormError<TFormError> = TFormError extends GlobalFormValidationError<any> ? TFormError["form"] : TFormError;
```

Defined in: packages/form-core/src/types.ts:124

## Type Parameters

### TFormError

`TFormError`
