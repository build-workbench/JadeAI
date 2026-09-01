
import type { ResumeSection } from '@/types/resume';
import { isSectionEmpty, md } from './utils';
import { test, expect } from 'vitest';

test('md renders summary text blocks as compact line breaks', () => {
  expect(md('first block\n\nsecond block')).toBe('first block<br>second block');
});

test('md keeps single newlines compact inside a summary block', () => {
  expect(md('first line\nsecond line')).toBe('first line<br>second line');
});

test('md inserts a line break after a line ending in inline markup', () => {
  // Regression: a line ending in </strong> used to swallow the next line's <br>.
  expect(md('**Bold line**\nSecond line')).toBe('<strong>Bold line</strong><br>Second line');
});

test('md still skips the line break after a block-level tag', () => {
  expect(md('first line\nsecond line')).toBe('first line<br>second line');
  expect(md('text\n- item')).toBe('text<ul style="margin:2px 0;padding-left:1.5em;list-style-type:disc"><li>item</li></ul>');
});

test('isSectionEmpty treats null content as empty instead of crashing', () => {
  const now = new Date('2026-05-31T00:00:00.000Z');
  const section: ResumeSection = {
    id: 'work',
    resumeId: 'resume',
    type: 'work_experience',
    title: 'Work',
    sortOrder: 1,
    visible: true,
    content: null as unknown as ResumeSection['content'],
    createdAt: now,
    updatedAt: now,
  };

  expect(isSectionEmpty(section)).toBe(true);
});

test('isSectionEmpty treats blank summary text blocks as empty', () => {
  const now = new Date('2026-05-31T00:00:00.000Z');
  const section: ResumeSection = {
    id: 'summary',
    resumeId: 'resume',
    type: 'summary',
    title: 'Summary',
    sortOrder: 1,
    visible: true,
    content: { text: '\n\n' },
    createdAt: now,
    updatedAt: now,
  };

  expect(isSectionEmpty(section)).toBe(true);
});
