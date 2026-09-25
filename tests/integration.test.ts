import { describe, it, expect } from 'vitest';
import idioms from '../app/data/idioms.json' assert { type: 'json' };
import type { Idiom } from '../src/types.js';

describe('idioms data integrity (500)', () => {
  it('loads 500 idioms', () => {
    expect((idioms as Idiom[]).length).toBe(500);
  });
  it('every idiom has required fields', () => {
    for (const it of idioms as Idiom[]) {
      expect(it.id, `missing id`).toBeTruthy();
      expect(it.phrase).toBeTruthy();
      expect(it.meaning_th).toBeTruthy();
      expect(it.mnemonic).toBeTruthy();
      expect(it.examples.length).toBeGreaterThanOrEqual(2);
    }
  });
  it('ids unique', () => {
    const ids = (idioms as Idiom[]).map(x=>x.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('examples have en/th/context', () => {
    for (const it of idioms as Idiom[]) {
      for (const ex of it.examples) {
        expect(ex.en).toBeTruthy();
        expect(ex.th).toBeTruthy();
      }
    }
  });
});
