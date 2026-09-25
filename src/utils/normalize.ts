/**
 * normalizeAnswer — ทนต่อพิมพ์ผิดเล็กน้อย (เสาเข็ม: ไม่เปราะเพราะ apostrophe/space)
 * ใช้ทั้ง Review input และ practice th2en
 */
export function normalizeAnswer(s: string): string {
  if (typeof s !== 'string') return '';
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[''`\u2019]/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

export function normalizePhrase(s: string): string {
  return normalizeAnswer(s);
}

/** ตรวจคำตอบแบบ tolerant — ยอมให้เว้นวรรคเกิน/ขาด apostrophe ได้ */
export function isAnswerCorrect(input: string, expected: string): boolean {
  return normalizeAnswer(input) === normalizeAnswer(expected);
}
