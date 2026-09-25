import { describe, it, expect } from 'vitest';
import { applyVocabEdits, filterVisible, hideId, unhideId, upsertEdit, removeCustomById, updateCustomById, usesMnemonic } from '../src/vocab.js';

describe('usesMnemonic', () => {
  it('idioms use Dual Coding, Oxford words & sentences do not', () => {
    expect(usesMnemonic({ kind: 'idiom' })).toBe(true);
    expect(usesMnemonic({})).toBe(true);
    expect(usesMnemonic({ kind: 'word' })).toBe(false);
    expect(usesMnemonic({ kind: 'sentence' })).toBe(false);
    expect(usesMnemonic(null)).toBe(false);
  });
});

describe('vocab edit/hide', () => {
  it('applyVocabEdits merges fields without mutating source', () => {
    const items = [{ id: 'a', phrase: 'break the ice', meaning_th: 'เก่า', kind: 'idiom' as const }];
    const out = applyVocabEdits(items, { a: { meaning_th: 'ใหม่', phrase: 'break ice' } });
    expect(out[0].phrase).toBe('break ice');
    expect(out[0].meaning_th).toBe('ใหม่');
    expect(items[0].phrase).toBe('break the ice');
    expect(items[0].meaning_th).toBe('เก่า');
  });
  it('applyVocabEdits syncs lemma for words', () => {
    const items = [{ id: 'w', kind: 'word' as const, lemma: 'old', phrase: 'old', meaning_th: 'เก่า' }];
    const out = applyVocabEdits(items, { w: { phrase: 'new' } });
    expect(out[0].phrase).toBe('new');
    expect(out[0].lemma).toBe('new');
  });
  it('filterVisible excludes hidden ids', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    expect(filterVisible(items, new Set(['b'])).map(x => x.id)).toEqual(['a', 'c']);
    expect(filterVisible(items, ['a', 'c']).map(x => x.id)).toEqual(['b']);
  });
  it('hideId / unhideId are immutable', () => {
    const hidden = new Set(['a']);
    const hid = hideId(hidden, 'b');
    expect([...hid].sort()).toEqual(['a', 'b']);
    expect(hidden.has('b')).toBe(false);
    const restored = unhideId(hid, 'a');
    expect([...restored]).toEqual(['b']);
    expect(hid.has('a')).toBe(true);
  });
  it('upsertEdit trims and keeps previous fields', () => {
    const edits = upsertEdit({}, 'a', { meaning_th: '  ทำลายความเงียบ  ', phrase: '' });
    expect(edits.a.meaning_th).toBe('ทำลายความเงียบ');
    expect(edits.a.phrase).toBeUndefined();
    const next = upsertEdit(edits, 'a', { phrase: 'break the ice' });
    expect(next.a.meaning_th).toBe('ทำลายความเงียบ');
    expect(next.a.phrase).toBe('break the ice');
  });
  it('removeCustomById / updateCustomById', () => {
    const custom = [{ id: 'x', phrase: 'a' }, { id: 'y', phrase: 'b' }];
    expect(removeCustomById(custom, 'x').map(v => v.id)).toEqual(['y']);
    expect(updateCustomById(custom, 'y', { phrase: 'bee' })[1].phrase).toBe('bee');
    expect(custom[1].phrase).toBe('b');
  });
});
