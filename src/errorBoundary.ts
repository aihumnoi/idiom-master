/**
 * Global error boundary — เสาเข็ม: ไม่ให้ JS throw แล้วหน้า trắng
 */
export function installErrorBoundary(): void {
  window.addEventListener('error', (e) => {
    console.error('[IdiomMaster] global error', e.error || e.message);
    showToast('เกิดข้อผิดพลาดเล็กน้อย ระบบได้บันทึกและจะไม่พังทั้งหน้า — ลองรีเฟรชถ้ายังมีปัญหา');
  });
  window.addEventListener('unhandledrejection', (e) => {
    console.error('[IdiomMaster] unhandled rejection', e.reason);
    showToast('มีบางอย่างล้มเหลวชั่วคราว — ลองใหม่อีกครั้ง');
    e.preventDefault();
  });
}

let toastTimer: number | null = null;
export function showToast(msg: string): void {
  let el = document.getElementById('globalToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'globalToast';
    el.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg z-[9999] max-w-[90vw] text-center';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.remove('hidden');
  el.style.display = 'block';
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { el!.style.display = 'none'; }, 4000);
}

export function safeJsonParse<T>(raw: string | null, fallback: T, label = 'unknown'): T {
  if (raw == null) return fallback;
  try { return JSON.parse(raw) as T; } catch (e) {
    console.warn(`[IdiomMaster] JSON parse failed for ${label}`, e);
    return fallback;
  }
}

export function safeLocalStorageGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch (e) { console.warn('[IdiomMaster] localStorage get failed', key, e); return null; }
}
export function safeLocalStorageSet(key: string, val: string): boolean {
  try { localStorage.setItem(key, val); return true; } catch (e) {
    console.warn('[IdiomMaster] localStorage set failed', key, e);
    // พยายามลบ fallback แล้วลองใหม่
    try { localStorage.removeItem('idioms_fallback'); localStorage.setItem(key, val); return true; } catch { return false; }
  }
}
