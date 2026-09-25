import { describe, it, expect } from 'vitest';
import { parseJsonImport, parseCsvImport, mergeVocab, filterByKindAndLevel } from '../src/import.js';
import type { VocabItem } from '../src/types.js';

describe('import (Oxford/custom)', () => {
  it('parseJsonImport valid', () => {
    const json = JSON.stringify([
      { lemma: 'resilient', meaning_th: 'ยืดหยุ่น', pos: 'adjective', level: 'B2', examples: [{en:'She is resilient', th:'เธอ resilient'}] }
    ]);
    const r = parseJsonImport(json);
    expect(r.valid.length).toBe(1);
    expect(r.errors.length).toBe(0);
    expect(r.valid[0].id).toBe('custom_resilient');
  });
  it('parseJsonImport invalid missing lemma', () => {
    const r = parseJsonImport(JSON.stringify([{ meaning_th: 'x'}]));
    expect(r.errors.length).toBe(1);
    expect(r.valid.length).toBe(0);
  });
  it('parseJsonImport detects duplicates', () => {
    const r = parseJsonImport(JSON.stringify([
      { id:'a', lemma:'a', meaning_th:'x' },
      { id:'a', lemma:'a', meaning_th:'y' }
    ]));
    expect(r.duplicates.length).toBe(1);
    expect(r.valid.length).toBe(1);
  });
  it('parseCsvImport with header', () => {
    const csv = `lemma,meaning_th,meaning_en,pos,level,example_en,example_th
resilient,ยืดหยุ่น,able to recover,adjective,B2,She is resilient,เธอ resilient
collaborate,ร่วมมือ,work together,verb,B1,We collaborate,เราร่วมมือ`;
    const r = parseCsvImport(csv);
    expect(r.valid.length).toBe(2);
    expect(r.errors.length).toBe(0);
  });
  it('parseCsvImport without header', () => {
    const csv = `resilient,ยืดหยุ่น,able to recover
collaborate,ร่วมมือ,work together`;
    const r = parseCsvImport(csv);
    expect(r.valid.length).toBe(2);
  });
  it('mergeVocab adds only new', () => {
    const existing: VocabItem[] = [{ id:'a', phrase:'a', meaning_th:'x', meaning_en:'x', category:'general', category_th:'x', difficulty:1, frequency:1, examples:[{en:'e',th:'t',context:'c'}], synonyms:[], phonetic:'', literal_th:'', origin:'', mnemonic:'' } as VocabItem];
    const incoming: VocabItem[] = [
      { id:'a', phrase:'a', meaning_th:'x2', meaning_en:'x2', category:'general', category_th:'x', difficulty:1, frequency:1, examples:[{en:'e',th:'t',context:'c'}], synonyms:[], phonetic:'', literal_th:'', origin:'', mnemonic:'' } as VocabItem,
      { id:'b', phrase:'b', meaning_th:'y', meaning_en:'y', category:'general', category_th:'y', difficulty:1, frequency:1, examples:[{en:'e',th:'t',context:'c'}], synonyms:[], phonetic:'', literal_th:'', origin:'', mnemonic:'' } as VocabItem,
    ];
    const { merged, added, skipped } = mergeVocab(existing, incoming);
    expect(added).toBe(1);
    expect(skipped).toBe(1);
    expect(merged.length).toBe(2);
  });
  it('filterByKindAndLevel', () => {
    const items: VocabItem[] = [
      { id:'1', kind:'word', lemma:'a', phrase:'a', pos:'noun', level:'A1', phonetic:'', meaning_th:'x', meaning_en:'x', category:'general', category_th:'x', difficulty:1, frequency:1, examples:[{en:'e',th:'t',context:'c'}], synonyms:[] } as VocabItem,
      { id:'2', phrase:'break the ice', meaning_th:'x', meaning_en:'x', category:'social', category_th:'s', difficulty:1, frequency:1, examples:[{en:'e',th:'t',context:'c'}], synonyms:[], phonetic:'', literal_th:'', origin:'', mnemonic:'' } as VocabItem,
    ];
    expect(filterByKindAndLevel(items,'word','')).toHaveLength(1);
    expect(filterByKindAndLevel(items,'','A1')).toHaveLength(1);
    expect(filterByKindAndLevel(items,'idiom','')).toHaveLength(1);
  });
});
