# IdiomMaster — แอปฝึกและจดจำสำนวนอังกฤษแบบผู้เชี่ยวชาญ

> จำสำนวนได้ 300+ สำนวน คำศัพท์ Oxford 3,000 คำ และประโยคใช้บ่อย 1,000 ประโยค ใน 90 วัน วันละ 12 นาที ด้วยวิทยาศาสตร์การจำ 7 เสาหลัก

## วิธีใช้งาน (ใช้งานได้ทันที ไม่ต้องติดตั้ง)

1. ดับเบิ้ลคลิก `app/index.html` — เปิดในเบราว์เซอร์ได้เลย
2. หรือรัน `npx serve app` แล้วเปิด http://localhost:3000

## มีอะไรบ้าง

- **500 สำนวน** (ครอบคลุม 10 หมวดหมู่หลัก หมวดละ 50 สำนวน) — แต่ละตัวมี mnemonic ภาพจำ Dual Coding + origin เชิงลึก + ตัวอย่าง EN/TH 3 บริบทครบถ้วน
- **Oxford 3,000 คำศัพท์** (A1–C1) — พร้อม pos/level/ตัวอย่าง
- **1,000 ประโยคใช้บ่อย** — สนทนาประจำวัน + ประโยคที่เจอในหนัง/ซีรีส์ ครอบคลุม 18 หมวด (ทักทาย/ชีวิตประจำวัน/ครอบครัว/อาหาร/เดินทาง/ซื้อของ/ทำงาน/เรียน/สุขภาพ/อารมณ์/ดูหนัง/โทรศัพท์/ฯลฯ) — สร้างจาก `sentences_data/parts/*.py` ด้วย `tools/generate_sentences.py`
- **5 โมดูล:**
  - วันนี้ — Dashboard + ภาพรวม + Today's preview + XP วันนี้
  - เรียนใหม่ — 5 ตัว/วัน แบบ Story + Dual Coding
  - ทบทวน — SRS FSRS-lite 4 ปุ่ม (Again/Hard/Good/Easy) + คำถามสลับ 4 แบบ + สรุปผลหลังจบรอบ
  - ฝึกเกม — 5 เกม: Cloze, Scenario, TH→EN, Speed Match (60วิ), Builder + ประวัติสถิติเกม
  - คลัง — ค้นหา/กรอง/เรียงลำดับ + เพิ่มเข้า SRS
  - สถิติ — Heatmap 30 วัน, XP/Level, Weak Map, Leech + รายการที่ตกบ่อย
- **สายเรียน 3 สาย**: สำนวน / Oxford / ประโยค 1,000 (สลับได้จากหน้าแรก)

## ฟีเจอร์เสริม v2.1

- **Dark mode** — สลับธีม (สว่าง/มืด/อัตโนมัติตามระบบ) ผ่านปุ่ม ☾ / ตั้งค่า
- **ตั้งค่า** — เป้าหมายรายวัน, ความเร็วเสียงอ่าน, Export/Import, รีเซ็ต
- **XP วันนี้** — ติดตามคะแนนประจำวัน
- **Onboarding** — แนะนำการใช้งานครั้งแรก
- **ประวัติเกม** — สถิติการเล่น/ความแม่นยำรายเกม
- **ประเมินผลอัตโนมัติ** — ระบบให้คะแนนทบทวนเอง (Again/Hard/Good/Easy) จากเวลาตอบ + ความถูกต้อง โดยเรียนรู้ baseline ของแต่ละใบจากประวัติสะสม (ไม่ตัดสินจากครั้งแรก) — ปิด/เปิดได้ที่ตั้งค่า

## วิทยาศาสตร์การจำ 7 เสาหลัก

ดู `docs/memory-science.md` — Dual Coding, Spaced Repetition (FSRS-lite), Elaborative Encoding, Retrieval Practice 5 ระดับ, Varied Context, Interleaving, Metacognition

## Tech — เสาเข็ม (ไม่เปราะ)

- **MVP**: `app/index.html` + Tailwind CDN + Vanilla JS — ยังดับเบิ้ลคลิกได้ (file:// fallback `data/*.js`)
- **Hardened**: `src/` TypeScript strict + `idb` IndexedDB + localStorage fallback + migration (`src/storage.ts:1`) + Global Error Boundary + Toast (`src/errorBoundary.ts:1`)
- **Build**: Vite 6 + `npm run build` -> `dist/` + PWA `sw.js` cache CDN + data
- **Test**: Vitest 68 tests (`tests/*.test.ts`) + `npx tsc --noEmit` + CI `.github/workflows/ci.yml`
- Web Speech API + Export/Import รวม daily state

## โครงสร้าง

```
idiom-master/
├── src/                 # TypeScript เสาเข็ม
│   ├── types.ts         # Idiom, Sentence, Word, SrsProgress, Stats strict types
│   ├── srs.ts           # FSRS-lite, calcIntervals, pickQuestionMode
│   ├── storage.ts       # IndexedDB (idb) + localStorage fallback
│   ├── daily.ts         # isDailyLessonActive, getDailyPool
│   ├── vocab.ts         # usesMnemonic, edit/hide helpers
│   ├── utils/normalize.ts / cloze.ts
│   ├── errorBoundary.ts # global error + toast
│   └── main.ts          # ติดตั้ง boundary + migrate
├── tests/               # 68 tests (srs, normalize, storage, daily, cloze, sentences, integration, ...)
├── app/index.html       # 500 idioms + Oxford 3000 + 1,000 sentences, 5 เกม Daily + Review + Dark mode + Settings
├── app/data/            # idioms.js/json, oxford3000.js/json, sentences.js/json
├── app/sw.js            # PWA cache (data + CDN)
├── sentences_data/      # ข้อมูล 1,000 ประโยค (parts/p1..p6.py)
├── tools/generate_sentences.py  # generator sentences_data -> app/data/sentences.*
├── vite.config.ts / vitest.config.ts / tsconfig.json
└── idioms_data.py
```

## Roadmap

- Phase 2: PWA + เสียง STT + เพิ่มเป็น 300 สำนวน
- Phase 3: Next.js + Supabase + AI ตรวจประโยค

---
สร้างที่ `C:\Users\nipon\Documents\opencode\idiom-master`
