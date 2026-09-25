import type { Grade, SrsProgress, SrsState } from './types.js';

export const SRS_DEFAULT: SrsProgress = {
  stability: 0,
  difficulty: 5,
  due: 0,
  reps: 0,
  lapses: 0,
  state: 'new',
  last: 0,
};

const MINUTE = 60_000;
const HOUR = 3600_000;
const DAY = 86400_000;

export function ensureProgress(map: Record<string, SrsProgress>, id: string): SrsProgress {
  if (!map[id]) map[id] = { ...SRS_DEFAULT };
  return map[id];
}

export function isLearningState(state: SrsState): boolean {
  return state === 'new' || state === 'learning' || state === 'relearning';
}

export function formatDuration(ms: number): string {
  const abs = Math.max(0, ms);
  if (abs < 90_000) return `${Math.max(1, Math.round(abs / MINUTE))} นาที`;
  if (abs < HOUR) return `${Math.round(abs / MINUTE)} นาที`;
  if (abs < DAY) {
    const hours = Math.round((abs / HOUR) * 10) / 10;
    return `${hours} ชม.`;
  }
  const days = Math.round((abs / DAY) * 10) / 10;
  return `${days} วัน`;
}

/**
 * FSRS-lite ที่ช่วงเวลาตรงกับปุ่ม และไม่ปล่อยการ์ดที่เพิ่งเรียน/เพิ่งตก
 * ไปไกลเกินจริง
 *
 * Learning (new / learning / relearning):
 *   Again 1 นาที, Hard 10 นาที, Good จบขั้นเรียน 1 วัน, Easy 3 วัน
 *
 * Review:
 *   ช่วงนี้ใช้ stability ปัจจุบัน แล้วค่อยคูณสำหรับรอบหน้า
 *   Again 10 นาที + กลับไป relearning, Hard 0.5s, Good s, Easy 1.3s
 */
export function computeGrade(p: SrsProgress, grade: Grade, now = Date.now()): SrsProgress {
  const next: SrsProgress = { ...p };
  if (isLearningState(next.state)) {
    if (grade === 1) {
      if (next.state !== 'new') next.lapses++;
      next.stability = Math.max(0.2, (next.stability || 0.3) * 0.5);
      next.due = now + 1 * MINUTE;
      next.state = next.state === 'new' ? 'learning' : 'relearning';
    } else if (grade === 2) {
      next.stability = Math.max(0.5, next.stability || 0.5);
      next.due = now + 10 * MINUTE;
      next.state = next.state === 'relearning' ? 'relearning' : 'learning';
    } else if (grade === 3) {
      next.stability = Math.max(1, next.stability || 1);
      next.due = now + 1 * DAY;
      next.state = 'review';
      next.difficulty = Math.max(1, next.difficulty - 0.1);
    } else {
      next.stability = Math.max(3, next.stability || 3);
      next.due = now + 3 * DAY;
      next.state = 'review';
      next.difficulty = Math.max(1, next.difficulty - 0.2);
    }
  } else {
    const s = Math.max(0.3, next.stability || 0.3);
    if (grade === 1) {
      next.lapses++;
      next.stability = Math.max(0.3, s * 0.5);
      next.difficulty = Math.min(10, next.difficulty + 0.3);
      next.due = now + 10 * MINUTE;
      next.state = 'relearning';
    } else if (grade === 2) {
      next.due = now + s * 0.5 * DAY;
      next.stability = s * 1.2;
      next.difficulty = Math.min(10, next.difficulty + 0.1);
      next.state = 'review';
    } else if (grade === 3) {
      next.due = now + s * DAY;
      next.stability = s * 2.5;
      next.difficulty = Math.max(1, next.difficulty - 0.1);
      next.state = 'review';
    } else {
      next.due = now + s * 1.3 * DAY;
      next.stability = s * 3.5;
      next.difficulty = Math.max(1, next.difficulty - 0.2);
      next.state = 'review';
    }
  }
  next.reps++;
  next.last = now;
  return next;
}

export function gradeCard(map: Record<string, SrsProgress>, id: string, grade: Grade, now = Date.now()): SrsProgress {
  const p = ensureProgress(map, id);
  Object.assign(p, computeGrade(p, grade, now));
  return p;
}

export function calcIntervals(p: SrsProgress, now = Date.now()): { again: string; hard: string; good: string; easy: string } {
  if (p.state === 'known') return { again: '-', hard: '-', good: 'รู้แล้ว', easy: 'รู้แล้ว' };
  const preview = (g: Grade) => formatDuration(computeGrade(p, g, now).due - now);
  return { again: preview(1), hard: preview(2), good: preview(3), easy: preview(4) };
}

export function pickQuestionMode(p: SrsProgress): 'choice' | 'cloze' | 'scenario' | 'input' {
  const s = p.stability ?? 0;
  const lapses = p.lapses ?? 0;
  const reps = p.reps ?? 0;
  if (lapses >= 2 || s < 0.5) return 'choice';
  if (s < 1) return 'cloze';
  if (s < 3) return lapses === 0 && reps % 2 === 0 ? 'scenario' : 'cloze';
  const modes: Array<'scenario' | 'input' | 'cloze' | 'choice'> = ['scenario', 'input', 'cloze', 'choice'];
  return modes[reps % modes.length];
}

export function getDueIds(progress: Record<string, SrsProgress>, now = Date.now()): string[] {
  return Object.entries(progress)
    .filter(([, p]) => p.state !== 'new' && p.state !== 'known' && p.due <= now)
    .sort((a, b) => a[1].due - b[1].due)
    .map(([id]) => id);
}

export function markAsKnown(map: Record<string, SrsProgress>, id: string, now = Date.now()): SrsProgress {
  const p = ensureProgress(map, id);
  p.state = 'known';
  p.stability = 365;
  p.due = now + 365 * DAY;
  p.reps++;
  p.last = now;
  return p;
}

export function unmarkKnown(map: Record<string, SrsProgress>, id: string): void {
  const p = map[id];
  if (p && p.state === 'known') {
    p.state = 'new';
    p.stability = 0;
    p.due = 0;
    p.reps = 0;
    p.lapses = 0;
  }
}

export function isKnown(p?: SrsProgress): boolean { return p?.state === 'known'; }

export function isLeech(p: SrsProgress, threshold = 3): boolean {
  return p.lapses >= threshold;
}

export function getLevel(xp: number): number {
  return Math.min(10, Math.floor(xp / 200) + 1);
}

export function allowedGrades(answeredOk: boolean | null): Grade[] {
  if (answeredOk === false) return [1, 2];
  return [1, 2, 3, 4];
}

export function interleaveByCategory<T extends { category?: string }>(items: T[]): T[] {
  if (items.length < 3) return items.slice();
  const byCat = new Map<string, T[]>();
  for (const it of items) {
    const key = it.category || 'general';
    const arr = byCat.get(key) || [];
    arr.push(it);
    byCat.set(key, arr);
  }
  const out: T[] = [];
  let last = '';
  let last2 = '';
  while (out.length < items.length) {
    const usable = [...byCat.entries()].filter(([, arr]) => arr.length > 0);
    const different = usable.filter(([c]) => c !== last && c !== last2);
    const pool = (different.length ? different : usable.filter(([c]) => c !== last));
    const pickFrom = pool.length ? pool : usable;
    const [cat, arr] = pickFrom[0];
    out.push(arr.shift() as T);
    last2 = last;
    last = cat;
  }
  return out;
}
