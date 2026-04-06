---
id: BroadcastFormSubmissionState
title: BroadcastFormSubmissionState
---

# Type Alias: BroadcastFormSubmissionState

```ts
type BroadcastFormSubmissionState = 
  | {
  errors: any[];
  id: string;
  stage: "validateAllFields" | "validate";
  submissionAttempt: number;
  successful: false;
}
  | {
  id: string;
  onError: unknown;
  stage: "inflight";
  submissionAttempt: number;
  successful: false;
}
  | {
  id: string;
  submissionAttempt: number;
  successful: true;
};
```

Defined in: packages/form-core/src/EventClient.ts:20
