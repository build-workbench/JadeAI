import { normalizeModelListPayload, readModelListResponse } from './model-list';
import { test, expect } from 'vitest';

test('normalizeModelListPayload accepts provider objects and string models', () => {
  expect(normalizeModelListPayload({ models: [{ id: 'gpt-5' }, 'claude-sonnet'] })).toEqual({
    models: [{ id: 'gpt-5' }, { id: 'claude-sonnet' }],
  });
});

test('readModelListResponse preserves recoverable server errors', async () => {
  const response = new Response(JSON.stringify({ models: [], error: 'upstream auth failed' }), { status: 400 });

  expect(await readModelListResponse(response, 'Unable to load models')).toEqual({
    models: [],
    error: 'upstream auth failed',
  });
});

test('readModelListResponse supplies a fallback error for non-JSON failures', async () => {
  const response = new Response('bad gateway', { status: 502 });

  expect(await readModelListResponse(response, 'Unable to load models')).toEqual({
    models: [],
    error: 'Unable to load models (502)',
  });
});
