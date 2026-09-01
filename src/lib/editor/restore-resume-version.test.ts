import type { ResumeDraftSnapshot } from '@/types/editor';
import type { Resume } from '@/types/resume';
import { DEFAULT_THEME } from '@/lib/resume-theme/default-theme';
import { test, expect } from 'vitest';

function makeDraft(title: string): ResumeDraftSnapshot {
  return {
    title,
    template: 'default',
    themeConfig: {
      ...DEFAULT_THEME,
      margin: {
        ...DEFAULT_THEME.margin,
      },
    },
    language: 'en',
    sections: [],
  };
}

function makeResume(title: string): Resume {
  return {
    id: 'resume-1',
    userId: 'user-1',
    title,
    template: 'default',
    themeConfig: {
      ...DEFAULT_THEME,
      margin: {
        ...DEFAULT_THEME.margin,
      },
    },
    isDefault: false,
    language: 'en',
    sections: [],
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  };
}

test('restores a different snapshot and persists it after verification', async () => {
  const { executeResumeRestore } = await import('./restore-resume-version');
  const calls: string[] = [];
  let currentDraft = makeDraft('current');
  const targetDraft = makeDraft('target');

  const result = await executeResumeRestore({
    readCurrentDraft: async () => currentDraft,
    targetDraft,
    saveBackupVersion: async () => {
      calls.push('backup');
    },
    applyTargetDraft: async (draft: ResumeDraftSnapshot) => {
      calls.push('apply');
      currentDraft = draft;
    },
    persistRestoredDraft: async () => {
      calls.push('persist');
    },
  });

  expect(calls).toEqual(['backup', 'apply', 'persist']);
  expect(result.status).toBe('restored');
});

test('returns noop when restoring the already-current snapshot', async () => {
  const { executeResumeRestore } = await import('./restore-resume-version');
  const currentDraft = makeDraft('same');
  let persisted = false;

  const result = await executeResumeRestore({
    readCurrentDraft: async () => currentDraft,
    targetDraft: makeDraft('same'),
    saveBackupVersion: async () => {
      throw new Error('should not back up noop restore');
    },
    applyTargetDraft: async () => {
      throw new Error('should not apply noop restore');
    },
    persistRestoredDraft: async () => {
      persisted = true;
    },
  });

  expect(result).toEqual({ status: 'noop', reason: 'already-current' });
  expect(persisted).toBe(false);
});

test('throws when apply completes but current draft still does not match target', async () => {
  const { executeResumeRestore } = await import('./restore-resume-version');
  const currentDraft = makeDraft('before');
  await expect(
    () =>
      executeResumeRestore({
        readCurrentDraft: async () => currentDraft,
        targetDraft: makeDraft('after'),
        saveBackupVersion: async () => {},
        applyTargetDraft: async () => {},
        persistRestoredDraft: async () => {},
      })).rejects.toThrow(/restore verification failed/i);
});

test('restoreResumeVersionById wires store callbacks into the restore transaction', async () => {
  const { restoreResumeVersionById } = await import('./resume-history-actions');
  const targetDraft = makeDraft('target');
  const applyCalls: Array<{
    draft: ResumeDraftSnapshot;
    options: unknown;
  }> = [];
  const saveCalls: Array<Record<string, unknown>> = [];
  const backupCalls: string[] = [];
  const resumeStoreState = {
    currentResume: makeResume('current'),
    save: async (options?: Record<string, unknown>) => {
      saveCalls.push(options ?? {});
    },
  };

  const result = await restoreResumeVersionById('version-1', {
    getResumeVersion: async (versionId: string) => ({
      id: versionId,
      resumeId: 'resume-1',
      snapshot: targetDraft,
      source: 'manual',
      createdAt: Date.now(),
    }),
    executeResumeRestore: async ({
      readCurrentDraft,
      targetDraft: resolvedTargetDraft,
      saveBackupVersion,
      applyTargetDraft,
      persistRestoredDraft,
    }) => {
      expect(await readCurrentDraft()).toEqual(makeDraft('current'));
      expect(resolvedTargetDraft).toEqual(targetDraft);

      await saveBackupVersion();
      await applyTargetDraft(targetDraft);
      await persistRestoredDraft();

      return { status: 'restored' };
    },
    saveCurrentResumeVersion: async (source) => {
      backupCalls.push(source);
      return null;
    },
    applyResumeDraftSnapshot: (draft, options) => {
      applyCalls.push({ draft, options });
      resumeStoreState.currentResume = makeResume(draft.title);
    },
    getResumeStoreState: () => resumeStoreState,
  });

  expect(backupCalls).toEqual(['restore']);
  expect(applyCalls).toEqual([
    {
      draft: targetDraft,
      options: {
        recordHistory: true,
        markDirty: true,
        clearPendingSave: true,
      },
    },
  ]);
  expect(saveCalls).toEqual([{ source: 'restore', forceVersion: true }]);
  expect(result).toEqual({ status: 'restored' });
});

test('restoreResumeVersionById throws when the target version no longer exists', async () => {
  const { restoreResumeVersionById } = await import('./resume-history-actions');

  await expect(
    () =>
      restoreResumeVersionById('missing-version', {
        getResumeVersion: async () => null,
        executeResumeRestore: async () => {
          throw new Error('should not execute restore when version is missing');
        },
        saveCurrentResumeVersion: async () => null,
        applyResumeDraftSnapshot: () => {},
        getResumeStoreState: () => ({
          currentResume: makeResume('current'),
          save: async () => {},
        }),
      })).rejects.toThrow(/version not found/i);
});

test('restoreResumeVersionRecord restores from loaded snapshot without reloading by id', async () => {
  const { restoreResumeVersionRecord } = await import('./resume-history-actions');
  const targetDraft = makeDraft('target');
  const applyCalls: Array<{
    draft: ResumeDraftSnapshot;
    options: unknown;
  }> = [];
  const saveCalls: Array<Record<string, unknown>> = [];
  const backupCalls: string[] = [];
  const resumeStoreState = {
    currentResume: makeResume('current'),
    save: async (options?: Record<string, unknown>) => {
      saveCalls.push(options ?? {});
    },
  };

  const result = await restoreResumeVersionRecord(
    {
      id: 'version-1',
      resumeId: 'resume-1',
      snapshot: targetDraft,
      source: 'manual',
      createdAt: Date.now(),
    },
    {
      getResumeVersion: async () => {
        throw new Error('should not load version by id when record is already available');
      },
      executeResumeRestore: async ({
        readCurrentDraft,
        targetDraft: resolvedTargetDraft,
        saveBackupVersion,
        applyTargetDraft,
        persistRestoredDraft,
      }) => {
        expect(await readCurrentDraft()).toEqual(makeDraft('current'));
        expect(resolvedTargetDraft).toEqual(targetDraft);

        await saveBackupVersion();
        await applyTargetDraft(targetDraft);
        await persistRestoredDraft();

        return { status: 'restored' };
      },
      saveCurrentResumeVersion: async (source) => {
        backupCalls.push(source);
        return null;
      },
      applyResumeDraftSnapshot: (draft, options) => {
        applyCalls.push({ draft, options });
        resumeStoreState.currentResume = makeResume(draft.title);
      },
      getResumeStoreState: () => resumeStoreState,
    }
  );

  expect(backupCalls).toEqual(['restore']);
  expect(applyCalls).toEqual([
    {
      draft: targetDraft,
      options: {
        recordHistory: true,
        markDirty: true,
        clearPendingSave: true,
      },
    },
  ]);
  expect(saveCalls).toEqual([{ source: 'restore', forceVersion: true }]);
  expect(result).toEqual({ status: 'restored' });
});
