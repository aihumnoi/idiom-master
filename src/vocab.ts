/** จัดการแก้ไข / ลบ / รู้แล้ว ของสำนวนและคำศัพท์ */
export interface VocabEdit {
  phrase?: string;
  lemma?: string;
  phonetic?: string;
  meaning_th?: string;
  meaning_en?: string;
  mnemonic?: string;
  literal_th?: string;
  origin?: string;
}

export const EDITABLE_FIELDS = [
  'phrase', 'lemma', 'phonetic', 'meaning_th', 'meaning_en', 'mnemonic', 'literal_th', 'origin',
] as const;

/** สำนวนใช้ภาพจำ (Dual Coding) — คำ Oxford/word และประโยค sentence ไม่ใช้ */
export function usesMnemonic(item?: { kind?: string } | null): boolean {
  if (!item) return false;
  const kind = item.kind || 'idiom';
  return kind !== 'word' && kind !== 'sentence';
}

export function applyVocabEdits<T extends { id: string; kind?: string; phrase?: string; lemma?: string }>(
  items: T[],
  edits: Record<string, VocabEdit>,
): T[] {
  if (!edits || !Object.keys(edits).length) return items.map(v => ({ ...v }));
  return items.map(v => {
    const ed = edits[v.id];
    if (!ed) return { ...v };
    const merged = { ...v, ...ed } as T;
    const phrase = (ed.phrase ?? (merged as { phrase?: string }).phrase ?? '').trim();
    if (phrase) {
      (merged as { phrase: string }).phrase = phrase;
      if ((v.kind || 'idiom') === 'word') {
        (merged as { lemma: string }).lemma = ed.lemma?.trim() || phrase;
      }
    }
    return merged;
  });
}

export function filterVisible<T extends { id: string }>(items: T[], hidden: Set<string> | string[]): T[] {
  const set = hidden instanceof Set ? hidden : new Set(hidden);
  if (!set.size) return items.slice();
  return items.filter(v => !set.has(v.id));
}

export function hideId(hidden: Set<string>, id: string): Set<string> {
  const next = new Set(hidden);
  if (id) next.add(id);
  return next;
}

export function unhideId(hidden: Set<string>, id: string): Set<string> {
  const next = new Set(hidden);
  next.delete(id);
  return next;
}

export function upsertEdit(edits: Record<string, VocabEdit>, id: string, patch: VocabEdit): Record<string, VocabEdit> {
  const next = { ...edits };
  const cleaned: VocabEdit = {};
  for (const key of EDITABLE_FIELDS) {
    const val = patch[key];
    if (typeof val === 'string' && val.trim()) (cleaned as Record<string, string>)[key] = val.trim();
  }
  next[id] = { ...(next[id] || {}), ...cleaned };
  return next;
}

export function removeCustomById<T extends { id: string }>(custom: T[], id: string): T[] {
  return custom.filter(v => v.id !== id);
}

export function updateCustomById<T extends { id: string }>(custom: T[], id: string, patch: Partial<T>): T[] {
  return custom.map(v => v.id === id ? { ...v, ...patch, id: v.id } : v);
}
