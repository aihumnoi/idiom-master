import { describe, it, expect } from 'vitest';
import { normalizeAnswer, isAnswerCorrect } from '../src/utils/normalize.js';

describe('normalizeAnswer (เสาเข็ม: ทนพิมพ์ผิด)', () => {
  it('case insensitive', () => {
    expect(normalizeAnswer('Rain check')).toBe('rain check');
    expect(isAnswerCorrect('Rain check', 'rain check')).toBe(true);
  });
  it('trims and collapses spaces', () => {
    expect(normalizeAnswer('  piece   of   cake  ')).toBe('piece of cake');
  });
  it('removes apostrophes', () => {
    expect(normalizeAnswer("can't")).toBe('cant');
    expect(normalizeAnswer('can\u2019t')).toBe('cant');
    expect(isAnswerCorrect("can't", 'cant')).toBe(true);
  });
  it('removes punctuation', () => {
    expect(normalizeAnswer('hit-the-gym!')).toBe('hitthegym');
    expect(normalizeAnswer('break the ice.')).toBe('break the ice');
  });
  it('empty and non-string', () => {
    expect(normalizeAnswer('')).toBe('');
    expect(normalizeAnswer(null as unknown as string)).toBe('');
  });
  it('isAnswerCorrect tolerant', () => {
    expect(isAnswerCorrect("  Can't  ", "can't")).toBe(true);
    expect(isAnswerCorrect('break the ice', 'Break the Ice')).toBe(true);
    expect(isAnswerCorrect('break ice', 'break the ice')).toBe(false);
  });
});
