import type { Idiom, DailyGameProgress } from './types.js';

export function isDailyLessonActive(dailyLessonIds: string[], dailyLessonDate: string, dailyGameProgress: DailyGameProgress, today = new Date().toDateString()): boolean {
  return dailyLessonIds.length > 0 && dailyLessonDate === today && Object.values(dailyGameProgress).some(v => !v);
}

export function isDailyLessonFinished(dailyLessonIds: string[], dailyLessonDate: string, dailyGameProgress: DailyGameProgress, today = new Date().toDateString()): boolean {
  return dailyLessonIds.length > 0 && dailyLessonDate === today && Object.values(dailyGameProgress).every(v => v);
}

export function getDailyPool(idioms: Idiom[], dailyLessonIds: string[], dailyLessonDate: string, dailyGameProgress: DailyGameProgress): Idiom[] | null {
  if (!isDailyLessonActive(dailyLessonIds, dailyLessonDate, dailyGameProgress)) return null;
  const pool = idioms.filter(x => dailyLessonIds.includes(x.id));
  return pool.length ? pool : null;
}

export function markDailyGameComplete(game: keyof DailyGameProgress, state: { dailyGameProgress: DailyGameProgress }): boolean {
  if (state.dailyGameProgress[game]) return false;
  state.dailyGameProgress[game] = true;
  return true;
}
