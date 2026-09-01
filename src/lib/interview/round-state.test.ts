
import { shouldAutoStartRound } from './round-state';
import { test, expect } from 'vitest';

const base = {
  roundId: 'round-1',
  messageCount: 0,
  isLoading: false,
  isViewingHistory: false,
  isRoundDone: false,
  loadingRoundId: null,
  lastInitRoundId: null,
};

test('auto-starts an empty active round', () => {
  expect(shouldAutoStartRound(base)).toBe(true);
});

test('does not auto-start while round history is loading', () => {
  expect(shouldAutoStartRound({ ...base, loadingRoundId: 'round-1' })).toBe(false);
});

test('does not auto-start completed history or rounds with messages', () => {
  expect(shouldAutoStartRound({ ...base, isRoundDone: true })).toBe(false);
  expect(shouldAutoStartRound({ ...base, isViewingHistory: true })).toBe(false);
  expect(shouldAutoStartRound({ ...base, messageCount: 1 })).toBe(false);
});

test('does not auto-start the same round twice', () => {
  expect(shouldAutoStartRound({ ...base, lastInitRoundId: 'round-1' })).toBe(false);
});
