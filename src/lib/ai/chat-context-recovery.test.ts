import type { UIMessage } from 'ai';
import { stripAssistantToolPartsForRecovery } from './chat-context-recovery';
import { test, expect } from 'vitest';

test('stripAssistantToolPartsForRecovery keeps assistant text but removes tool parts', () => {
  const messages: UIMessage[] = [
    {
      id: 'assistant-1',
      role: 'assistant',
      parts: [
        { type: 'step-start' },
        {
          type: 'tool-updateSection',
          toolCallId: 'assistant-1-tool-0',
          state: 'output-available',
          input: { sectionId: 'summary' },
          output: { success: true },
        },
        { type: 'text', text: '已完成更新' },
      ],
    },
  ];

  const recovered = stripAssistantToolPartsForRecovery(messages);
  expect(recovered[0]?.parts).toEqual([{ type: 'text', text: '已完成更新' }]);
});

test('stripAssistantToolPartsForRecovery leaves non-assistant messages unchanged', () => {
  const messages: UIMessage[] = [
    {
      id: 'user-1',
      role: 'user',
      parts: [{ type: 'text', text: '继续优化' }],
    },
  ];

  const recovered = stripAssistantToolPartsForRecovery(messages);
  expect(recovered).toEqual(messages);
});
