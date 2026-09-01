import type { AIChatUIMessage } from '@/types/ai';
import {
  EMPTY_ASSISTANT_RESPONSE_ERROR_TEXT,
  hasRenderableAssistantReplySinceRequest,
  isEmptyAssistantResponseErrorText,
  hasRenderableSerializedAssistantOutput,
  hasRenderableUIAssistantMessage,
  resolveAssistantTerminalOutcome,
  shouldSurfaceEmptyAssistantResponseError,
} from './chat-response-status';
import { test, expect } from 'vitest';

test('hasRenderableSerializedAssistantOutput treats non-empty text as renderable', () => {
  expect(hasRenderableSerializedAssistantOutput({
    content: '优化后的简历内容',
    orderedParts: [{ type: 'text', text: '优化后的简历内容' }],
  })).toBe(true);
});

test('hasRenderableSerializedAssistantOutput treats tool-only responses as renderable', () => {
  expect(hasRenderableSerializedAssistantOutput({
    content: '',
    orderedParts: [{
      type: 'tool',
      toolName: 'updateResume',
      state: 'output-available',
      args: { section: 'experience' },
      result: { ok: true },
    }],
  })).toBe(true);
});

test('resolveAssistantTerminalOutcome marks empty terminal responses as stream errors', () => {
  const outcome = resolveAssistantTerminalOutcome({
    serialized: {
      content: '   ',
      orderedParts: [],
      hasError: false,
    },
    finishReason: 'stop',
    isAborted: false,
    classifiedErrorKind: undefined,
  });

  expect(outcome.status).toBe('error');
  expect(outcome.errorKind).toBe('stream');
  expect(outcome.errorText).toBe(EMPTY_ASSISTANT_RESPONSE_ERROR_TEXT);
});

test('resolveAssistantTerminalOutcome keeps classified errors', () => {
  const outcome = resolveAssistantTerminalOutcome({
    serialized: {
      content: '',
      orderedParts: [],
      hasError: false,
      errorText: 'Provider timeout',
    },
    finishReason: 'error',
    isAborted: false,
    classifiedErrorKind: 'provider',
  });

  expect(outcome.status).toBe('error');
  expect(outcome.errorKind).toBe('provider');
  expect(outcome.errorText).toBe('Provider timeout');
});

test('isEmptyAssistantResponseErrorText matches only the canonical error text', () => {
  expect(isEmptyAssistantResponseErrorText(EMPTY_ASSISTANT_RESPONSE_ERROR_TEXT)).toBe(true);
  expect(isEmptyAssistantResponseErrorText('provider timeout')).toBe(false);
  expect(isEmptyAssistantResponseErrorText(undefined)).toBe(false);
});

test('shouldSurfaceEmptyAssistantResponseError requires explicit session-scoped terminal state', () => {
  expect(shouldSurfaceEmptyAssistantResponseError({
    sessionId: undefined,
    terminalSessionId: undefined,
    requestStatus: 'ready',
    terminalStatus: undefined,
    hasRenderableAssistantReply: false,
  })).toBe(false);

  expect(shouldSurfaceEmptyAssistantResponseError({
    sessionId: 'session-a',
    terminalSessionId: undefined,
    requestStatus: 'ready',
    terminalStatus: undefined,
    hasRenderableAssistantReply: false,
  })).toBe(false);

  expect(shouldSurfaceEmptyAssistantResponseError({
    sessionId: 'session-a',
    terminalSessionId: 'session-b',
    requestStatus: 'ready',
    terminalStatus: undefined,
    hasRenderableAssistantReply: false,
  })).toBe(false);

  expect(shouldSurfaceEmptyAssistantResponseError({
    sessionId: 'session-a',
    terminalSessionId: 'session-a',
    requestStatus: 'streaming',
    terminalStatus: undefined,
    hasRenderableAssistantReply: false,
  })).toBe(false);

  expect(shouldSurfaceEmptyAssistantResponseError({
    sessionId: 'session-a',
    terminalSessionId: 'session-a',
    requestStatus: 'ready',
    terminalStatus: 'error',
    hasRenderableAssistantReply: false,
  })).toBe(false);

  expect(shouldSurfaceEmptyAssistantResponseError({
    sessionId: 'session-a',
    terminalSessionId: 'session-a',
    requestStatus: 'ready',
    terminalStatus: undefined,
    hasRenderableAssistantReply: true,
  })).toBe(false);

  expect(shouldSurfaceEmptyAssistantResponseError({
    sessionId: 'session-a',
    terminalSessionId: 'session-a',
    requestStatus: 'ready',
    terminalStatus: undefined,
    hasRenderableAssistantReply: false,
  })).toBe(true);
});

test('hasRenderableUIAssistantMessage detects renderable assistant parts', () => {
  const toolOnlyMessage = {
    id: 'assistant-1',
    role: 'assistant',
    parts: [
      {
        type: 'tool-updateResume',
        state: 'output-available',
        toolCallId: 'tool-1',
        input: { section: 'summary' },
        output: { success: true },
      },
    ],
  } as AIChatUIMessage;

  const emptyTextMessage = {
    id: 'assistant-2',
    role: 'assistant',
    parts: [{ type: 'text', text: '   ' }],
  } as AIChatUIMessage;

  expect(hasRenderableUIAssistantMessage(toolOnlyMessage)).toBe(true);
  expect(hasRenderableUIAssistantMessage(emptyTextMessage)).toBe(false);
});

test('hasRenderableAssistantReplySinceRequest treats same-id empty-to-renderable transition as new reply', () => {
  const latestAssistantMessage = {
    id: 'assistant-1',
    role: 'assistant',
    parts: [{ type: 'text', text: '已重新生成完整回复' }],
  } as AIChatUIMessage;

  expect(hasRenderableAssistantReplySinceRequest(
      latestAssistantMessage,
      'assistant-1',
      false
    )).toBe(true);
});

test('hasRenderableAssistantReplySinceRequest rejects unchanged renderable baseline', () => {
  const latestAssistantMessage = {
    id: 'assistant-2',
    role: 'assistant',
    parts: [{ type: 'text', text: '原始回复' }],
  } as AIChatUIMessage;

  expect(hasRenderableAssistantReplySinceRequest(
      latestAssistantMessage,
      'assistant-2',
      true
    )).toBe(false);
});
