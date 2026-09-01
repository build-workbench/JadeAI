
import { dbInterviewMessagesToUIMessages, getInterviewRole } from './ui-message-adapter';
import { test, expect } from 'vitest';

test('preserves original interview roles when adapting database messages', () => {
  const [interviewer, candidate, system] = dbInterviewMessagesToUIMessages([
    { id: 'm1', role: 'interviewer', content: 'Question', metadata: { marked: true } },
    { id: 'm2', role: 'candidate', content: 'Answer', metadata: { hinted: true } },
    { id: 'm3', role: 'system', content: 'Trigger', metadata: { skipped: true } },
  ]);

  expect(interviewer.role).toBe('assistant');
  expect(getInterviewRole(interviewer)).toBe('interviewer');
  expect(interviewer.metadata?.interviewMetadata).toEqual({ marked: true });

  expect(candidate.role).toBe('user');
  expect(getInterviewRole(candidate)).toBe('candidate');
  expect(candidate.metadata?.interviewMetadata).toEqual({ hinted: true });

  expect(system.role).toBe('system');
  expect(getInterviewRole(system)).toBe('system');
  expect(system.metadata?.interviewMetadata).toEqual({ skipped: true });
});
