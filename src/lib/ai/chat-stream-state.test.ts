
import type { AIChatUIMessage } from '@/types/ai';
import {
  countCompletedToolParts,
  getNextToolResultReloadState,
  isCompletedToolPart,
} from './chat-stream-state';
import { test, expect } from 'vitest';

function assistantWithTool(state: string): AIChatUIMessage {
  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    parts: [{
      type: 'tool-updateSection',
      toolCallId: crypto.randomUUID(),
      state,
      input: {},
      output: {},
    } as AIChatUIMessage['parts'][number]],
  };
}

test('detects only completed AI tool output parts', () => {
  expect(isCompletedToolPart({ type: 'tool-updateSection', state: 'output-available' })).toBe(true);
  expect(isCompletedToolPart({ type: 'tool-updateSection', state: 'input-available' })).toBe(false);
  expect(isCompletedToolPart({ type: 'text', text: 'hello' })).toBe(false);
});

test('counts completed assistant tool outputs across messages', () => {
  expect(countCompletedToolParts([
    assistantWithTool('output-available'),
    assistantWithTool('input-available'),
    { id: 'user-1', role: 'user', parts: [{ type: 'text', text: 'hello' }] },
  ])).toBe(1);
});

test('reload state ignores tool results already present in initial history', () => {
  const initialMessages = [assistantWithTool('output-available')];
  const initialCount = countCompletedToolParts(initialMessages);

  expect(getNextToolResultReloadState(initialCount, initialMessages)).toEqual({
    shouldReload: false,
    completedToolCount: 1,
  });
});

test('reload state triggers exactly when a new tool output appears', () => {
  const previousMessages = [assistantWithTool('output-available')];
  const nextMessages = [...previousMessages, assistantWithTool('output-available')];

  expect(getNextToolResultReloadState(1, nextMessages)).toEqual({
    shouldReload: true,
    completedToolCount: 2,
  });
});
