import { isRetryableErrorKind } from './chat-retry-policy';
import { test, expect } from 'vitest';

test('isRetryableErrorKind includes empty-response stream errors', () => {
  expect(isRetryableErrorKind('stream')).toBe(true);
});

test('isRetryableErrorKind excludes non-retryable error kinds', () => {
  expect(isRetryableErrorKind('tool')).toBe(false);
  expect(isRetryableErrorKind('client_abort')).toBe(false);
  expect(isRetryableErrorKind(undefined)).toBe(false);
});
