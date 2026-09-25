// IdiomMaster — strict types (เสาเข็ม)
export type IdiomCategory = 'social' | 'business' | 'emotion' | 'love' | 'general' | 'drama' | 'family' | 'action';
export type SentenceCategory = 'greetings' | 'smalltalk' | 'daily' | 'family' | 'food' | 'travel' | 'shopping' | 'work' | 'study' | 'health' | 'emotion' | 'movie' | 'phone' | 'polite' | 'opinion' | 'time' | 'weather' | 'money';
export type SrsState = 'new' | 'learning' | 'review' | 'relearning' | 'known';
export type StudyTrack = 'idiom' | 'oxford' | 'sentence' | 'both';

export interface IdiomExample {
  en: string;
  th: string;
  context: string;
}

export interface Idiom {
  id: string;
  kind?: 'idiom';
  phrase: string;
  phonetic: string;
  meaning_th: string;
  meaning_en: string;
  literal_th: string;
  origin: string;
  mnemonic: string;
  category: IdiomCategory;
  category_th: string;
  category_full?: string;
  difficulty: 1 | 2 | 3;
  frequency: number;
  examples: IdiomExample[];
  synonyms: string[];
  common_mistake?: string;
}

export type VocabKind = 'idiom' | 'word' | 'sentence';
export type OxfordLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type Pos = 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrasal verb' | 'idiom' | 'other';

export interface Sentence {
  id: string;
  kind: 'sentence';
  phrase: string; // full English sentence
  keyword: string; // word to blank in cloze
  phonetic: string;
  meaning_th: string;
  meaning_en: string;
  literal_th?: string;
  origin?: string;
  mnemonic?: string;
  category: SentenceCategory;
  category_th: string;
  difficulty: 1 | 2 | 3;
  frequency: number;
  examples: IdiomExample[];
  synonyms: string[];
  common_mistake?: string;
}

export interface Word {
  id: string;
  kind: 'word';
  lemma: string;
  phrase: string; // alias for lemma for unified rendering
  pos: Pos;
  level: OxfordLevel;
  phonetic: string;
  meaning_th: string;
  meaning_en: string; // definition_en
  literal_th?: string;
  origin?: string;
  mnemonic?: string;
  category: IdiomCategory;
  category_th: string;
  difficulty: 1 | 2 | 3;
  frequency: number;
  examples: IdiomExample[];
  synonyms: string[];
  common_mistake?: string;
}

export type VocabItem = Idiom | Word | Sentence;

export function isWord(v: VocabItem): v is Word { return (v as Word).kind === 'word'; }
export function isSentence(v: VocabItem): v is Sentence { return (v as Sentence).kind === 'sentence'; }
export function getDisplayPhrase(v: VocabItem): string { return isWord(v) ? v.lemma : v.phrase; }
export function getKind(v: VocabItem): VocabKind { return isWord(v) ? 'word' : isSentence(v) ? 'sentence' : 'idiom'; }

export interface SrsProgress {
  stability: number;
  difficulty: number;
  due: number; // epoch ms
  reps: number;
  lapses: number;
  state: SrsState;
  last: number;
}

export type Grade = 1 | 2 | 3 | 4; // Again/Hard/Good/Easy

export interface Stats {
  xp: number;
  streak: number;
  lastStudyDate: string | null;
  level: number;
  streakFreezes?: number;
  streakFreezeUsedDate?: string | null;
}

export interface Settings {
  dailyNew: number;
  dailyReview: number;
  dailyReminder?: boolean;
  reminderTime?: string;
}

export interface HistoryEntry {
  id: string;
  grade: Grade;
  time: number;
  correct?: boolean | null;
}

export interface DailyGameProgress {
  cloze: boolean;
  scenario: boolean;
  match: boolean;
  builder: boolean;
}

export const LEVEL_NAMES = ["Newbie","Explorer","Learner","Practitioner","Achiever","Scholar","Wordsmith","Idiom Pro","Master","IdiomMaster"] as const;
