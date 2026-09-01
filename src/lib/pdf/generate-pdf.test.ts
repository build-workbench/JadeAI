
import { resolveBrowserLaunchPlan, resolveLocalChromeExecutable } from './generate-pdf';
import { test, expect } from 'vitest';

test('resolveLocalChromeExecutable returns the first available local browser', () => {
  const executablePath = resolveLocalChromeExecutable((candidate) => candidate === '/usr/bin/chromium');

  expect(executablePath).toBe('/usr/bin/chromium');
});

test('resolveLocalChromeExecutable returns null when no local browser exists', () => {
  const executablePath = resolveLocalChromeExecutable(() => false);

  expect(executablePath).toBe(null);
});

test('resolveBrowserLaunchPlan uses a valid CHROME_PATH', () => {
  expect(resolveBrowserLaunchPlan(
      { CHROME_PATH: '/custom/chromium' },
      (candidate) => candidate === '/custom/chromium',
    )).toEqual({
      kind: 'local',
      executablePath: '/custom/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });
});

test('resolveBrowserLaunchPlan rejects an invalid CHROME_PATH', () => {
  expect(
    () => resolveBrowserLaunchPlan({ CHROME_PATH: '/missing/chromium' }, () => false)).toThrow(/CHROME_PATH points to a missing or inaccessible executable/);
});

test('resolveBrowserLaunchPlan requires explicit permission for runtime Chromium download', () => {
  expect(() => resolveBrowserLaunchPlan({}, () => false)).toThrow(/ALLOW_CHROMIUM_DOWNLOAD=true/);

  expect(resolveBrowserLaunchPlan({ ALLOW_CHROMIUM_DOWNLOAD: 'true' }, () => false)).toEqual({ kind: 'download' });
});
