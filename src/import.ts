import type { VocabItem, Word, OxfordLevel, Pos } from './types.js';

export interface ImportResult {
  valid: VocabItem[];
  errors: string[];
  duplicates: string[];
}

const ALLOWED_LEVELS: OxfordLevel[] = ['A1','A2','B1','B2','C1','C2'];
const ALLOWED_POS: Pos[] = ['noun','verb','adjective','adverb','phrasal verb','idiom','other'];

function slugId(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'') || 'custom_'+Date.now();
}

export function validateWord(raw: Record<string, unknown>, lineNo?: number): { item?: Word; error?: string } {
  const prefix = lineNo ? `บรรทัด ${lineNo}: ` : '';
  const lemma = String(raw.lemma ?? raw.phrase ?? raw.word ?? '').trim();
  if (!lemma) return { error: `${prefix}ต้องมี lemma/phrase` };
  const meaning_th = String(raw.meaning_th ?? raw.th ?? '').trim();
  const meaning_en = String(raw.meaning_en ?? raw.en ?? raw.definition_en ?? '').trim();
  if (!meaning_th && !meaning_en) return { error: `${prefix}${lemma}: ต้องมี meaning_th หรือ meaning_en` };
  const level = String(raw.level ?? 'B1').toUpperCase() as OxfordLevel;
  if (raw.level && !ALLOWED_LEVELS.includes(level)) return { error: `${prefix}${lemma}: level ต้องเป็น ${ALLOWED_LEVELS.join('/')}` };
  const pos = String(raw.pos ?? 'other').toLowerCase() as Pos;
  const id = String(raw.id ?? 'custom_'+slugId(lemma)).trim();
  // examples: string "en|th" or array
  let examples: Word['examples'] = [];
  if (Array.isArray(raw.examples)) {
    examples = (raw.examples as unknown[]).slice(0,3).map((e) => {
      if (typeof e === 'string') {
        const parts = e.split('|');
        return { en: parts[0]?.trim() || String(e), th: parts[1]?.trim() || '', context: 'custom' };
      }
      const o = e as Record<string, unknown>;
      return { en: String(o.en ?? ''), th: String(o.th ?? ''), context: String(o.context ?? 'custom') };
    }).filter(e=>e.en);
  } else if (typeof raw.example_en === 'string' && raw.example_en) {
    examples = [{ en: String(raw.example_en), th: String(raw.example_th ?? ''), context: 'custom' }];
  }
  if (examples.length===0) examples = [{ en: `Example with ${lemma}.`, th: `ตัวอย่าง ${lemma}`, context: 'custom' }];

  const item: Word = {
    id: id || 'custom_'+slugId(lemma),
    kind: 'word',
    lemma, phrase: lemma, pos: (ALLOWED_POS.includes(pos) ? pos : 'other'),
    level: (ALLOWED_LEVELS.includes(level) ? level : 'B1'),
    phonetic: String(raw.phonetic ?? ''),
    meaning_th: meaning_th || meaning_en,
    meaning_en: meaning_en || meaning_th,
    category: 'general', category_th: String(raw.category_th ?? 'นำเข้าเอง'),
    difficulty: Number(raw.difficulty ?? (level==='A1'||level==='A2'?1: level==='B1'?2:3)) as 1|2|3,
    frequency: Number(raw.frequency ?? 4),
    examples, synonyms: Array.isArray(raw.synonyms) ? (raw.synonyms as string[]) : [],
    mnemonic: String(raw.mnemonic ?? ''),
    literal_th: String(raw.literal_th ?? ''),
    origin: String(raw.origin ?? ''),
  };
  return { item };
}

export function parseJsonImport(text: string): ImportResult {
  const errors: string[] = [];
  const valid: VocabItem[] = [];
  const duplicates: string[] = [];
  const seen = new Set<string>();
  let arr: unknown;
  try { arr = JSON.parse(text); } catch (e) { return { valid: [], errors: ['JSON ไม่ถูกต้อง: '+(e as Error).message], duplicates: [] }; }
  const list = Array.isArray(arr) ? arr : [arr];
  list.forEach((raw, idx) => {
    if (typeof raw !== 'object' || !raw) { errors.push(`รายการ ${idx+1}: ไม่ใช่ object`); return; }
    const r = raw as Record<string,unknown>;
    // ถ้าเป็น idiom format (มี phrase + origin) ให้รับเป็น idiom ด้วย
    if (r.phrase && r.meaning_th && !r.lemma) {
      // idiom
      const idiom = r as unknown as VocabItem;
      const id = String((idiom as unknown as Record<string,unknown>).id ?? slugId(String(r.phrase)));
      if (seen.has(id)) duplicates.push(id);
      else { seen.add(id); valid.push({ ...(idiom as VocabItem), id, kind: (idiom as Word).kind ?? 'idiom' } as VocabItem); }
      return;
    }
    const { item, error } = validateWord(r, idx+1);
    if (error) errors.push(error);
    else if (item) {
      if (seen.has(item.id)) duplicates.push(item.id);
      else { seen.add(item.id); valid.push(item); }
    }
  });
  return { valid, errors, duplicates };
}

export function parseCsvImport(text: string): ImportResult {
  const errors: string[] = [];
  const valid: VocabItem[] = [];
  const duplicates: string[] = [];
  const seen = new Set<string>();
  const lines = text.split(/\r?\n/).filter(l=>l.trim());
  if (lines.length===0) return { valid: [], errors: ['ไฟล์ว่าง'], duplicates: [] };
  // header detection
  const header = lines[0].split(',').map(s=>s.trim().toLowerCase());
  const hasHeader = header.includes('lemma') || header.includes('phrase') || header.includes('word');
  const dataLines = hasHeader ? lines.slice(1) : lines;
  const cols = hasHeader ? header : ['lemma','meaning_th','meaning_en','pos','level','example_en','example_th'];
  dataLines.forEach((line, idx) => {
    const lineNo = idx + (hasHeader?2:1);
    // simple CSV split respecting quotes
    const fields = splitCsv(line);
    const raw: Record<string,unknown> = {};
    cols.forEach((c,i)=> raw[c]=fields[i]?.trim());
    // map common header variants
    if (raw.word && !raw.lemma) raw.lemma = raw.word;
    const { item, error } = validateWord(raw, lineNo);
    if (error) errors.push(error);
    else if (item) {
      if (seen.has(item.id)) duplicates.push(item.id);
      else { seen.add(item.id); valid.push(item); }
    }
  });
  return { valid, errors, duplicates };
}

function splitCsv(line: string): string[] {
  const out: string[] = [];
  let cur = '', inQ = false;
  for (let i=0;i<line.length;i++) {
    const ch=line[i];
    if (ch==='"') { if (inQ && line[i+1]==='"') { cur+='"'; i++; } else inQ=!inQ; }
    else if (ch===',' && !inQ) { out.push(cur); cur=''; }
    else cur+=ch;
  }
  out.push(cur);
  return out.map(s=>s.trim().replace(/^\"|\"$/g,''));
}

export function mergeVocab(existing: VocabItem[], incoming: VocabItem[]): { merged: VocabItem[]; added: number; skipped: number } {
  const map = new Map(existing.map(v=>[v.id, v]));
  let added=0, skipped=0;
  for (const it of incoming) {
    if (map.has(it.id)) skipped++;
    else { map.set(it.id, it); added++; }
  }
  return { merged: [...map.values()], added, skipped };
}

export function filterByKindAndLevel(items: VocabItem[], kind: string, level: string): VocabItem[] {
  return items.filter(v=>{
    if (kind && ((v as Word).kind ?? 'idiom') !== kind) return false;
    if (level && (v as Word).level !== level) return false;
    return true;
  });
}
