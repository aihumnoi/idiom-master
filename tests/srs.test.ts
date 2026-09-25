import { describe, it, expect } from 'vitest';
import { gradeCard, calcIntervals, pickQuestionMode, getLevel, ensureProgress, getDueIds, isLeech, computeGrade, allowedGrades, interleaveByCategory, formatDuration } from '../src/srs.js';
import type { SrsProgress } from '../src/types.js';

describe('SRS FSRS-lite', () => {
  it('new -> Again sets 1m and learning', () => {
    const m: Record<string, SrsProgress> = {};
    const p = gradeCard(m, 'x', 1, 1_000);
    expect(p.state).toBe('learning');
    expect(p.due).toBe(1_000 + 60_000);
    expect(p.stability).toBe(0.2);
  });
  it('new -> Good sets 1d and review', () => {
    const m: Record<string, SrsProgress> = {};
    const p = gradeCard(m, 'x', 3, 0);
    expect(p.state).toBe('review');
    expect(p.stability).toBe(1);
    expect(p.due).toBe(86400_000);
  });
  it('new -> Hard stays learning at 10m', () => {
    const m: Record<string, SrsProgress> = {};
    const p = gradeCard(m, 'x', 2, 0);
    expect(p.state).toBe('learning');
    expect(p.due).toBe(10 * 60_000);
  });
  it('learning Good graduates to 1 day, not a multiplied review interval', () => {
    const m: Record<string, SrsProgress> = { a: { stability: 0.3, difficulty: 5, due: 0, reps: 1, lapses: 0, state: 'learning', last: 0 } };
    const p = gradeCard(m, 'a', 3, 0);
    expect(p.state).toBe('review');
    expect(p.due).toBe(86400_000);
    expect(p.stability).toBe(1);
  });
  it('relearning Good graduates to 1 day (ไม่เอาช่วงทบทวนยาวจากความจำระยะสั้น)', () => {
    const m: Record<string, SrsProgress> = { a: { stability: 4, difficulty: 5, due: 0, reps: 6, lapses: 1, state: 'relearning', last: 0 } };
    const p = gradeCard(m, 'a', 3, 0);
    expect(p.state).toBe('review');
    expect(p.due).toBe(86400_000);
    expect(p.stability).toBe(4);
  });
  it('review Again halves stability and pushes lapses', () => {
    const m: Record<string, SrsProgress> = { a: { stability: 4, difficulty: 5, due: 0, reps: 3, lapses: 0, state: 'review', last: 0 } };
    const p = gradeCard(m, 'a', 1, 10_000);
    expect(p.lapses).toBe(1);
    expect(p.stability).toBe(2); // 4*0.5
    expect(p.state).toBe('relearning');
    expect(p.due).toBe(10_000 + 10 * 60_000);
  });
  it('review Good uses current stability as interval then multiplies for next time', () => {
    const m: Record<string, SrsProgress> = { a: { stability: 2, difficulty: 5, due: 0, reps: 2, lapses: 0, state: 'review', last: 0 } };
    const p = gradeCard(m, 'a', 3, 0);
    expect(p.stability).toBe(5); // 2*2.5 for NEXT time
    expect(p.due).toBe(2 * 86400_000); // this review = current s
  });
  it('review Easy interval is 1.3s, then stability * 3.5', () => {
    const m: Record<string, SrsProgress> = { a: { stability: 2, difficulty: 5, due: 0, reps: 2, lapses: 0, state: 'review', last: 0 } };
    const p = gradeCard(m, 'a', 4, 0);
    expect(p.due).toBe(2 * 1.3 * 86400_000);
    expect(p.stability).toBe(7);
  });
  it('calcIntervals for new matches actual gradeCard', () => {
    const p: SrsProgress = { stability: 0, difficulty: 5, due: 0, reps: 0, lapses: 0, state: 'new', last: 0 };
    expect(calcIntervals(p, 0)).toEqual({ again: '1 นาที', hard: '10 นาที', good: '1 วัน', easy: '3 วัน' });
    expect(computeGrade(p, 1, 0).due).toBe(60_000);
    expect(computeGrade(p, 3, 0).due).toBe(86400_000);
  });
  it('calcIntervals for review with s=2 matches actual due', () => {
    const p: SrsProgress = { stability: 2, difficulty: 5, due: 0, reps: 5, lapses: 0, state: 'review', last: 0 };
    const iv = calcIntervals(p, 0);
    expect(iv.hard).toBe('1 วัน');
    expect(iv.good).toBe('2 วัน');
    expect(iv.easy).toBe('2.6 วัน');
    expect(computeGrade(p, 3, 0).due).toBe(2 * 86400_000);
    expect(computeGrade(p, 4, 0).due).toBe(2 * 1.3 * 86400_000);
  });
  it('calcIntervals for review with s=7', () => {
    const iv = calcIntervals({ stability: 7, difficulty: 5, due: 0, reps: 5, lapses: 0, state: 'review', last: 0 }, 0);
    expect(iv.good).toBe('7 วัน');
    expect(iv.easy).toBe('9.1 วัน');
  });
  it('pickQuestionMode respects lapses', () => {
    expect(pickQuestionMode({ stability: 0.2, difficulty: 5, due: 0, reps: 5, lapses: 3, state: 'review', last: 0 })).toBe('choice');
    expect(pickQuestionMode({ stability: 0.3, difficulty: 5, due: 0, reps: 0, lapses: 0, state: 'review', last: 0 })).toBe('choice');
    expect(pickQuestionMode({ stability: 0.8, difficulty: 5, due: 0, reps: 1, lapses: 0, state: 'review', last: 0 })).toBe('cloze');
  });
  it('pickQuestionMode high stability rotates', () => {
    const p = (reps: number) => ({ stability: 5, difficulty: 5, due: 0, reps, lapses: 0, state: 'review' as const, last: 0 });
    expect(pickQuestionMode(p(0))).toBe('scenario');
    expect(pickQuestionMode(p(1))).toBe('input');
  });
  it('getDueIds sorts by due', () => {
    const m: Record<string, SrsProgress> = {
      a: { stability: 1, difficulty: 5, due: 300, reps: 1, lapses: 0, state: 'review', last: 0 },
      b: { stability: 1, difficulty: 5, due: 100, reps: 1, lapses: 0, state: 'review', last: 0 },
      c: { stability: 0, difficulty: 5, due: 0, reps: 0, lapses: 0, state: 'new', last: 0 },
    };
    expect(getDueIds(m, 250)).toEqual(['b']);
    expect(getDueIds(m, 500)).toEqual(['b','a']);
  });
  it('isLeech threshold', () => {
    expect(isLeech({ stability: 1, difficulty: 5, due: 0, reps: 5, lapses: 3, state: 'review', last: 0 })).toBe(true);
    expect(isLeech({ stability: 1, difficulty: 5, due: 0, reps: 5, lapses: 2, state: 'review', last: 0 })).toBe(false);
  });
  it('getLevel', () => {
    expect(getLevel(0)).toBe(1);
    expect(getLevel(199)).toBe(1);
    expect(getLevel(200)).toBe(2);
    expect(getLevel(5000)).toBe(10);
  });
  it('ensureProgress creates default', () => {
    const m: Record<string, SrsProgress> = {};
    const p = ensureProgress(m, 'new_id');
    expect(p.state).toBe('new');
    expect(m['new_id']).toBe(p);
  });
  it('allowedGrades blocks Good/Easy when the answer was wrong', () => {
    expect(allowedGrades(false)).toEqual([1, 2]);
    expect(allowedGrades(true)).toEqual([1, 2, 3, 4]);
    expect(allowedGrades(null)).toEqual([1, 2, 3, 4]);
  });
  it('interleaveByCategory avoids 3 of the same in a row when possible', () => {
    const items = [
      { id: 'a1', category: 'social' }, { id: 'a2', category: 'social' }, { id: 'a3', category: 'social' },
      { id: 'b1', category: 'business' }, { id: 'b2', category: 'business' },
      { id: 'c1', category: 'love' },
    ];
    const out = interleaveByCategory(items);
    expect(out.map(x => x.id).sort()).toEqual(items.map(x => x.id).sort());
    let same = 0, maxSame = 1;
    for (let i = 1; i < out.length; i++) {
      if (out[i].category === out[i - 1].category) { same++; maxSame = Math.max(maxSame, same + 1); }
      else same = 0;
    }
    expect(maxSame).toBeLessThanOrEqual(2);
  });
  it('formatDuration', () => {
    expect(formatDuration(60_000)).toBe('1 นาที');
    expect(formatDuration(10 * 60_000)).toBe('10 นาที');
    expect(formatDuration(6 * 3600_000)).toBe('6 ชม.');
    expect(formatDuration(86400_000)).toBe('1 วัน');
  });
});
