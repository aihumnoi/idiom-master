import { describe, it, expect } from 'vitest';
import { isDailyLessonActive, isDailyLessonFinished, getDailyPool } from '../src/daily.js';
import type { Idiom } from '../src/types.js';

const idioms = [
  { id: 'a', phrase: 'break the ice' },
  { id: 'b', phrase: 'piece of cake' },
  { id: 'c', phrase: 'cost an arm' },
] as Idiom[];

describe('daily lesson', () => {
  it('active when ids match today and some game incomplete', () => {
    const today = new Date().toDateString();
    expect(isDailyLessonActive(['a','b'], today, { cloze: false, scenario: false, match: false, builder: false })).toBe(true);
    expect(isDailyLessonActive(['a'], today, { cloze: true, scenario: true, match: true, builder: true })).toBe(false);
  });
  it('inactive when date mismatched', () => {
    expect(isDailyLessonActive(['a'], 'old date', { cloze: false, scenario: false, match: false, builder: false })).toBe(false);
  });
  it('inactive when empty', () => {
    expect(isDailyLessonActive([], new Date().toDateString(), { cloze: false, scenario: false, match: false, builder: false })).toBe(false);
  });
  it('getDailyPool filters by ids', () => {
    const today = new Date().toDateString();
    const pool = getDailyPool(idioms, ['a','c'], today, { cloze: false, scenario: false, match: false, builder: false });
    expect(pool?.map(x=>x.id)).toEqual(['a','c']);
  });
  it('getDailyPool returns null when inactive', () => {
    expect(getDailyPool(idioms, ['a'], 'old', { cloze: false, scenario: false, match: false, builder: false })).toBeNull();
  });
  it('finished when all 4 games complete today', () => {
    const today = new Date().toDateString();
    expect(isDailyLessonFinished(['a'], today, { cloze: true, scenario: true, match: true, builder: true })).toBe(true);
    expect(isDailyLessonFinished(['a'], today, { cloze: true, scenario: true, match: true, builder: false })).toBe(false);
    expect(isDailyLessonFinished(['a'], 'old date', { cloze: true, scenario: true, match: true, builder: true })).toBe(false);
  });
});
