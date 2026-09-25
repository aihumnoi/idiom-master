# Architecture — IdiomMaster (Hardened v2)

## โครงสร้างไฟล์
```
idiom-master/
├── src/                    # TypeScript strict (เสาเข็ม)
│   ├── types.ts
│   ├── srs.ts              # FSRS-lite + calcIntervals + pickQuestionMode
│   ├── storage.ts          # IndexedDB (idb) + localStorage fallback + migration
│   ├── daily.ts
│   ├── utils/normalize.ts
│   ├── errorBoundary.ts    # global error + toast
│   └── main.ts
├── tests/                  # Vitest 34 tests
├── app/
│   ├── index.html          # 212 idioms, ยังดับเบิ้ลคลิก file:// ได้
│   ├── data/idioms.json + idioms.js
│   ├── sw.js (v3 cache CDN) + manifest.json
│   └── icons/
├── dist/                   # vite build output
├── vite.config.ts / vitest.config.ts / tsconfig.json
└── .github/workflows/ci.yml
```

## Data Flow (Hardened)
```
idioms.json --\
              +--> src/storage.ts (IndexedDB -> localStorage fallback) --> loadAll()/saveAll()
data/idioms.js --/         |
                           +--> src/srs.ts (gradeCard, calcIntervals) --> Review Queue (Again วนท้าย)
                           +--> src/daily.ts (isDailyLessonActive)   --> Daily 4 เกม
                           +--> src/errorBoundary.ts (window.onerror) --> toast
```

## Storage Schema (ทนทาน)
- `idb` DB `idiom-master` store `kv` หลัก, `localStorage` เป็น fallback + migration อัตโนมัติ `src/storage.ts:40`
- Keys: `idiom_progress`, `idiom_history`, `idiom_stats`, `idiom_settings`, `daily_*` (7 keys)
- `safeParse` + `try/catch` ทุก `JSON.parse` / `localStorage` ไม่ throw หน้า trắng
- Export/Import รวม daily state + version `app/index.html:1553`

## SRS States
- new -> learning (step 10m, 1d) -> review -> relearning (ถ้า Again)

## วิธีรัน
ดับเบิ้ลคลิก `app/index.html` หรือ `npx serve app`
