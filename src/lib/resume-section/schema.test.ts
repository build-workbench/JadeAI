
import { isResumeSectionType, normalizeResumeSectionContent, safeNormalizeResumeSectionContent } from './schema';
import { test, expect } from 'vitest';

test('recognizes supported resume section types', () => {
  expect(isResumeSectionType('work_experience')).toBe(true);
  expect(isResumeSectionType('qr_codes')).toBe(true);
  expect(isResumeSectionType('unknown_section')).toBe(false);
});

test('normalizes supported section content and rejects invalid payloads', () => {
  expect(normalizeResumeSectionContent('summary', { text: 'hello' })).toEqual({ text: 'hello' });

  expect(
    () => normalizeResumeSectionContent('summary', { items: [] }),).toThrow();
});

test('passes through unsupported section types without throwing', () => {
  const raw = { custom: true, payload: [1, 2, 3] };
  expect(normalizeResumeSectionContent('unknown_section', raw)).toBe(raw);
});

test('safeNormalizeResumeSectionContent falls back to empty content on malformed input', () => {
  // Null/primitive content that used to corrupt resumes and crash exports.
  expect(safeNormalizeResumeSectionContent('work_experience', null)).toEqual({ items: [] });
  expect(safeNormalizeResumeSectionContent('summary', 'a string')).toEqual({ text: '' });
  expect(safeNormalizeResumeSectionContent('skills', 42)).toEqual({ categories: [] });
});

test('safeNormalizeResumeSectionContent assigns stable ids to imported items', () => {
  const normalized = safeNormalizeResumeSectionContent('work_experience', {
    items: [
      { company: 'Acme', position: 'Engineer', startDate: '2020-01', endDate: null, current: true, description: 'x', highlights: [] },
    ],
  }) as { items: { id: string; company: string }[] };

  expect(normalized.items.length).toBe(1);
  expect(typeof normalized.items[0].id).toBe('string');
  expect(normalized.items[0].id.length > 0).toBeTruthy();
});
