
import { mergeInterviewMessageMetadata } from './message-metadata';
import { test, expect } from 'vitest';

test('merges partial interview message metadata without dropping existing flags', () => {
  expect(mergeInterviewMessageMetadata({ hinted: true, skipped: true }, { marked: true })).toEqual({ hinted: true, skipped: true, marked: true });
});

test('allows partial updates to unset a metadata flag', () => {
  expect(mergeInterviewMessageMetadata({ hinted: true, marked: true }, { marked: false })).toEqual({ hinted: true, marked: false });
});
