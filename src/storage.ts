/**
 * IdiomMaster Storage — IndexedDB (idb) + localStorage fallback + migration
 * เสาเข็ม: ไม่พังเมื่อ localStorage เต็ม/ถูกบล็อก/JSON พัง, มี try/catch ทุกจุด, มี quota handling
 */
import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { HistoryEntry, SrsProgress, Stats, Settings, DailyGameProgress } from './types.js';

interface IdiomDB extends DBSchema {
  kv: { key: string; value: unknown };
}

const DB_NAME = 'idiom-master';
const DB_VERSION = 1;
const STORE = 'kv';

const KEYS = {
  progress: 'idiom_progress',
  history: 'idiom_history',
  stats: 'idiom_stats',
  settings: 'idiom_settings',
  dailyIds: 'daily_lesson_ids',
  dailyDate: 'daily_lesson_date',
  dailyGame: 'daily_game_progress',
  dailyCloze: 'daily_cloze_done',
  dailyScenario: 'daily_scenario_done',
  dailyBuilder: 'daily_builder_done',
  dailyTh2en: 'daily_th2en_done',
} as const;

let dbPromise: Promise<IDBPDatabase<IdiomDB>> | null = null;
let idbAvailable: boolean | null = null;

function getDB(): Promise<IDBPDatabase<IdiomDB>> | null {
  if (idbAvailable === false) return null;
  if (typeof indexedDB === 'undefined') { idbAvailable = false; return null; }
  if (!dbPromise) {
    dbPromise = openDB<IdiomDB>(DB_NAME, DB_VERSION, {
      upgrade(db) { if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE); }
    }).catch(() => { idbAvailable = false; return null as unknown as IDBPDatabase<IdiomDB>; });
  }
  return dbPromise;
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (raw == null) return fallback;
  try { const v = JSON.parse(raw); return v as T; } catch { return fallback; }
}

function lsGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key: string, val: string): boolean {
  try { localStorage.setItem(key, val); return true; } catch (e) {
    // QuotaExceededError — ลองลบ fallback เก่า
    try { localStorage.removeItem('idioms_fallback'); localStorage.setItem(key, val); return true; } catch { return false; }
  }
}
function lsRemove(key: string) { try { localStorage.removeItem(key); } catch { /* ignore */ } }

// ---------- public API ----------
export async function storageGet<T>(key: string, fallback: T): Promise<T> {
  const db = getDB();
  if (db) {
    try {
      const v = await (await db).get(STORE, key);
      if (v !== undefined) return v as T;
    } catch { /* fallback to ls */ }
  }
  return safeParse(lsGet(key), fallback);
}

export async function storageSet(key: string, value: unknown): Promise<void> {
  const raw = JSON.stringify(value);
  // เขียนลง IDB ก่อน (ทนกว่า)
  const db = getDB();
  if (db) {
    try { await (await db).put(STORE, value, key); } catch { /* ignore */ }
  }
  // เขียนลง localStorage ด้วยเพื่อ backward compat (ถ้าใส่ไม่ได้ก็ไม่พัง)
  lsSet(key, raw);
}

export async function storageRemove(key: string): Promise<void> {
  const db = getDB();
  if (db) try { await (await db).delete(STORE, key); } catch { /* */ }
  lsRemove(key);
}

/** โหลด state ทั้งหมดแบบทนทาน — ถ้า JSON พังจะได้ fallback ไม่ throw */
export async function loadAll() {
  const [progress, history, stats, settings, dailyIds, dailyDate, dailyGame, cloze, scenario, builder, th2en] = await Promise.all([
    storageGet<Record<string, SrsProgress>>(KEYS.progress, {}),
    storageGet<HistoryEntry[]>(KEYS.history, []),
    storageGet<Stats>(KEYS.stats, { xp: 0, streak: 0, lastStudyDate: null, level: 1, streakFreezes: 1 }),
    storageGet<Settings>(KEYS.settings, { dailyNew: 5, dailyReview: 5 }),
    storageGet<string[]>(KEYS.dailyIds, []),
    storageGet<string>(KEYS.dailyDate, ''),
    storageGet<DailyGameProgress>(KEYS.dailyGame, { cloze: false, scenario: false, match: false, builder: false }),
    storageGet<string[]>(KEYS.dailyCloze, []),
    storageGet<string[]>(KEYS.dailyScenario, []),
    storageGet<string[]>(KEYS.dailyBuilder, []),
    storageGet<string[]>(KEYS.dailyTh2en, []),
  ]);
  // validate types
  return {
    progress: (progress && typeof progress === 'object' ? progress : {}) as Record<string, SrsProgress>,
    history: Array.isArray(history) ? history : [],
    stats: stats && typeof stats.xp === 'number' ? { streakFreezes: 1, ...stats } : { xp: 0, streak: 0, lastStudyDate: null, level: 1, streakFreezes: 1 },
    settings: settings && typeof settings.dailyNew === 'number' ? settings : { dailyNew: 5, dailyReview: 5 },
    dailyLessonIds: Array.isArray(dailyIds) ? dailyIds : [],
    dailyLessonDate: typeof dailyDate === 'string' ? dailyDate : '',
    dailyGameProgress: dailyGame && typeof dailyGame.cloze === 'boolean' ? dailyGame : { cloze: false, scenario: false, match: false, builder: false },
    dailyClozeDone: new Set<string>(Array.isArray(cloze) ? cloze : []),
    dailyScenarioDone: new Set<string>(Array.isArray(scenario) ? scenario : []),
    dailyBuilderDone: new Set<string>(Array.isArray(builder) ? builder : []),
    dailyTh2enDone: new Set<string>(Array.isArray(th2en) ? th2en : []),
  };
}

export async function saveAll(state: {
  progress: Record<string, SrsProgress>;
  history: HistoryEntry[];
  stats: Stats;
  settings: Settings;
  dailyLessonIds: string[];
  dailyLessonDate: string;
  dailyGameProgress: DailyGameProgress;
  dailyClozeDone: Set<string>;
  dailyScenarioDone: Set<string>;
  dailyBuilderDone: Set<string>;
  dailyTh2enDone: Set<string>;
}): Promise<void> {
  await Promise.all([
    storageSet(KEYS.progress, state.progress),
    storageSet(KEYS.history, state.history),
    storageSet(KEYS.stats, state.stats),
    storageSet(KEYS.settings, state.settings),
    storageSet(KEYS.dailyIds, state.dailyLessonIds),
    storageSet(KEYS.dailyDate, state.dailyLessonDate),
    storageSet(KEYS.dailyGame, state.dailyGameProgress),
    storageSet(KEYS.dailyCloze, [...state.dailyClozeDone]),
    storageSet(KEYS.dailyScenario, [...state.dailyScenarioDone]),
    storageSet(KEYS.dailyBuilder, [...state.dailyBuilderDone]),
    storageSet(KEYS.dailyTh2en, [...state.dailyTh2enDone]),
  ]);
}

export async function clearAll(): Promise<void> {
  for (const k of Object.values(KEYS)) await storageRemove(k);
  // ลบ fallback เก่าด้วย
  lsRemove('idioms_fallback');
}

/** สำหรับเทส: บังคับใช้ localStorage อย่างเดียว */
export function __forceLocalStorageOnly() { idbAvailable = false; dbPromise = null; }
