/**
 * IdiomMaster — main.ts (เสาเข็ม)
 * - ติดตั้ง Global Error Boundary
 * - Migrate localStorage -> IndexedDB (ทนทาน, ไม่หายเมื่อ quota)
 * - Expose hardened helpers ให้ index.html เรียกใช้ (normalize, calcIntervals, pickQuestionMode)
 * - ไม่ทำลาย file:// double-click — ถ้าเป็น file:// จะข้าม IDB
 */
import { installErrorBoundary, showToast } from './errorBoundary.js';
import { loadAll, saveAll } from './storage.js';
import { normalizeAnswer, isAnswerCorrect } from './utils/normalize.js';
import { calcIntervals, pickQuestionMode, getLevel, computeGrade } from './srs.js';
import { isDailyLessonActive, isDailyLessonFinished } from './daily.js';
import { blankPhraseInSentence } from './utils/cloze.js';

installErrorBoundary();

// expose for debugging / for index.html inline script to reuse hardened logic
// @ts-ignore
window.__IdiomMasterHardened = { normalizeAnswer, isAnswerCorrect, calcIntervals, pickQuestionMode, getLevel, isDailyLessonActive, isDailyLessonFinished, showToast, blankPhraseInSentence, computeGrade };

// Migrate: ถ้าเปิดด้วย http(s) ให้ sync localStorage -> IDB ครั้งแรก
if (location.protocol.startsWith('http')) {
  loadAll().then(async (state) => {
    // ถ้า IDB ว่างแต่ localStorage มีของ ให้ saveAll เพื่อดันเข้า IDB (migration)
    // loadAll ทำแล้ว (fallback ไป localStorage) ถ้า saveAll จะเขียนลง IDB ด้วย
    try {
      await saveAll(state);
      console.log('[IdiomMaster] storage migrated to IndexedDB');
    } catch (e) {
      console.warn('[IdiomMaster] migration failed', e);
    }
  });
}

// Typecheck helper — ensure idioms.json ดาวน์โหลดได้ (Vite จะ bundle)
console.log('[IdiomMaster] hardened modules loaded');
