import { describe, it, expect } from 'vitest';
import sentences from '../app/data/sentences.json' assert { type: 'json' };
import { sentenceHasPhrase } from '../src/utils/cloze.js';
import type { Sentence } from '../src/types.js';

describe('sentences data integrity (1000)', () => {
  it('loads exactly 1000 sentences', () => {
    expect((sentences as Sentence[]).length).toBe(1000);
  });
  it('every sentence has required fields', () => {
    for (const it of sentences as Sentence[]) {
      expect(it.id, `missing id`).toBeTruthy();
      expect(it.phrase).toBeTruthy();
      expect(it.meaning_th).toBeTruthy();
      expect(it.keyword).toBeTruthy();
      expect(it.category_th).toBeTruthy();
    }
  });
  it('ids unique', () => {
    const ids = (sentences as Sentence[]).map(x => x.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('keyword is a word present in the sentence (cloze ต้อง blank ได้)', () => {
    const failed: string[] = [];
    for (const it of sentences as Sentence[]) {
      if (!sentenceHasPhrase(it.keyword, it.phrase)) failed.push(it.id + ':' + it.keyword);
    }
    expect(failed, `cloze failed: ${failed.join(', ')}`).toEqual([]);
  });
  it('difficulty is 1..3', () => {
    for (const it of sentences as Sentence[]) {
      expect([1, 2, 3]).toContain(it.difficulty);
    }
  });
});