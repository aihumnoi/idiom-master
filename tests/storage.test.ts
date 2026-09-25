import { describe, it, expect, beforeEach } from 'vitest';
import { storageGet, storageSet, storageRemove, loadAll, saveAll, clearAll, __forceLocalStorageOnly } from '../src/storage.js';

describe('storage layer (IndexedDB + localStorage fallback)', () => {
  beforeEach(async () => {
    __forceLocalStorageOnly();
    await clearAll();
    localStorage.clear();
  });

  it('storageSet/get roundtrip via localStorage fallback', async () => {
    await storageSet('test_key', { a: 1 });
    const v = await storageGet<{a:number}>('test_key', {a:0});
    expect(v).toEqual({ a: 1 });
  });

  it('safeParse returns fallback on corrupted JSON', async () => {
    localStorage.setItem('bad_json', '{not json');
    const v = await storageGet('bad_json', { fallback: true });
    expect(v).toEqual({ fallback: true });
  });

  it('loadAll returns defaults when empty', async () => {
    const all = await loadAll();
    expect(all.progress).toEqual({});
    expect(all.history).toEqual([]);
    expect(all.stats.xp).toBe(0);
    expect(all.dailyClozeDone instanceof Set).toBe(true);
  });

  it('saveAll / loadAll persists daily sets', async () => {
    await saveAll({
      progress: { x: { stability: 2, difficulty: 5, due: 123, reps: 1, lapses: 0, state: 'review', last: 0 } },
      history: [{ id: 'x', grade: 3, time: 999 }],
      stats: { xp: 100, streak: 2, lastStudyDate: 'Mon', level: 1 },
      settings: { dailyNew: 5, dailyReview: 20 },
      dailyLessonIds: ['x'],
      dailyLessonDate: 'Mon',
      dailyGameProgress: { cloze: true, scenario: false, match: false, builder: false },
      dailyClozeDone: new Set(['x']),
      dailyScenarioDone: new Set(),
      dailyBuilderDone: new Set(),
      dailyTh2enDone: new Set(['y']),
    });
    const loaded = await loadAll();
    expect(loaded.dailyLessonIds).toEqual(['x']);
    expect(loaded.dailyClozeDone.has('x')).toBe(true);
    expect(loaded.dailyTh2enDone.has('y')).toBe(true);
  });

  it('clearAll removes everything', async () => {
    await storageSet('idiom_progress', { z: 1 });
    await clearAll();
    const v = await storageGet('idiom_progress', null);
    expect(v).toBeNull();
  });

  it('storageRemove is tolerant', async () => {
    await expect(storageRemove('non_existent')).resolves.toBeUndefined();
  });
});
