import { describe, it, expect } from 'vitest';
import { blankPhraseInSentence, sentenceHasPhrase } from '../src/utils/cloze.js';
import idioms from '../app/data/idioms.json' assert { type: 'json' };

describe('blankPhraseInSentence', () => {
  it('blanks an exact phrase', () => {
    expect(blankPhraseInSentence('break the ice', 'I told a joke to break the ice.')).toBe('I told a joke to ____.');
  });
  it('handles someone + inflection', () => {
    const out = blankPhraseInSentence('Give someone the cold shoulder', 'She gave him the cold shoulder all night at the party.');
    expect(out).toContain('____');
    expect(out).not.toMatch(/cold shoulder/i);
  });
  it('handles phrasal verb without the object pronoun', () => {
    const out = blankPhraseInSentence('Brush it off', 'She brushed off the rude comment and kept smiling.');
    expect(out).toContain('____');
    expect(out.toLowerCase()).not.toContain('brushed off');
  });
  it('strips parentheticals like (BFF)', () => {
    const out = blankPhraseInSentence('Best friend forever (BFF)', "You'll always be my best friend forever.");
    expect(out).toContain('____');
    expect(out.toLowerCase()).not.toContain('best friend forever');
  });
  it('handles broke down / break down', () => {
    const out = blankPhraseInSentence('Break down', 'She broke down in tears at the funeral.');
    expect(out).toBe('She ____ in tears at the funeral.');
  });
  it('every idiom blanks in at least one example (ไม่พังโหมด cloze)', () => {
    const failed: string[] = [];
    for (const it of idioms as Array<{ phrase: string; examples: Array<{ en: string }> }>) {
      const ok = (it.examples || []).some(ex => sentenceHasPhrase(it.phrase, ex.en));
      if (!ok) failed.push(it.phrase);
    }
    expect(failed, `cloze failed: ${failed.join(', ')}`).toEqual([]);
  });
});
