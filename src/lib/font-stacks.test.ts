
import {
  CHINESE_RESUME_FONT_STACK,
  FONT_STACK_OPTIONS,
  resolveDocxFonts,
  resolveFontStack,
} from './font-stacks';
import { test, expect } from 'vitest';

test('Chinese resume font stack is available for PDF and DOCX exports', () => {
  expect(FONT_STACK_OPTIONS.some((option) => option.value === CHINESE_RESUME_FONT_STACK)).toBeTruthy();
  expect(resolveFontStack(CHINESE_RESUME_FONT_STACK)).toBe(CHINESE_RESUME_FONT_STACK);
  expect(resolveDocxFonts(CHINESE_RESUME_FONT_STACK)).toEqual({
    west: 'Resource Han Rounded CN',
    east: 'Resource Han Rounded CN',
  });
});

test('DOCX font resolution keeps Latin west font when stack mixes Chinese and generic families', () => {
  expect(resolveDocxFonts('sans-serif, "Noto Sans SC", Inter')).toEqual({
    west: 'Inter',
    east: 'Noto Sans SC',
  });
});

test('DOCX font resolution falls back to first non-generic family for both west/east when only one family is provided', () => {
  expect(resolveDocxFonts('"PingFang SC", sans-serif')).toEqual({
    west: 'PingFang SC',
    east: 'PingFang SC',
  });
});
