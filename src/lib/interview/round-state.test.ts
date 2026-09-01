
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

// 组合场景：模拟 interview-room 的调用方式，覆盖 A1/A2 修复的状态机
import { isRoundViewOnly } from './round-status';

test('single round completion does NOT make the session read-only (A1: transition screen preserved)', () => {
  // AI 结束单轮: round completed + session still in_progress
  // round 单独看是可只读的……
  expect(isRoundViewOnly('completed', 'in_progress')).toBe(true);
  // ……但 session 级只读只由 sessionStatus 决定；单轮完成时会话仍 in_progress，
  // 因此 A1 修复的 history-effect 条件（sessionStatus === 'completed'）不触发，
  // 转场屏得以保留。
  expect(isRoundViewOnly('completed', 'in_progress')).toBe(true);
  expect(isRoundViewOnly('pending', 'in_progress')).toBe(false);
});

test('completed session is read-only regardless of round state (A1: view history for finished sessions)', () => {
  expect(isRoundViewOnly('in_progress', 'completed')).toBe(true);
  expect(isRoundViewOnly('completed', 'completed')).toBe(true);
  expect(isRoundViewOnly('pending', 'completed')).toBe(true);
});

test('switching into an empty unfinished round should auto-start (H2/A2 regression guard)', () => {
  // 切到空轮次: 无消息、非只读、非完成、非加载中 -> 自动开始
  expect(shouldAutoStartRound({ ...base, roundId: 'round-2', lastInitRoundId: null })).toBe(true);
  // 但该轮正在加载历史时不能自动开始
  expect(shouldAutoStartRound({ ...base, roundId: 'round-2', loadingRoundId: 'round-2' })).toBe(false);
});
