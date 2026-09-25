# IdiomMaster — แอปฝึกและจดจำสำนวนอังกฤษแบบครบวงจร
## Product Requirements Document (PRD) — Expert-Level Memory Design

### 1. วิสัยทัศน์
> จำสำนวนได้ 300+ สำนวนใน 90 วัน โดยใช้เวลาวันละ 12-15 นาที และนำไปใช้ได้จริงในการพูด/เขียน ไม่ใช่แค่ท่องจำ

ต่างจาก Anki/Quizlet ทั่วไป: IdiomMaster ออกแบบจาก 7 หลักวิทยาศาสตร์การจำ ไม่ใช่แค่ flashcard

### 2. ปัญหาที่แก้
- ท่องสำนวนแล้วลืมภายใน 7 วัน (Forgetting Curve)
- รู้ความหมายแต่ใช้ไม่เป็น (No context encoding)
- เบื่อ เลิกกลางคัน (No habit loop)

### 3. ผู้ใช้งานหลัก (Persona)
- **น้องมิน (22, นักศึกษา):** เตรียมสอบ TOEIC/IELTS ต้องการ idiom ระดับ B2-C1
- **พี่โจ (32, พนักงานออฟฟิศ):** อยากพูดให้เป็นธรรมชาติในประชุมกับฝรั่ง
- **ครูแอ๋ว (45):** สอนเด็ก ต้องมีเรื่องเล่า/ที่มาของสำนวน

### 4. โครงสร้างแอป 5 โมดูลหลัก

| โมดูล | หน้าที่ | วิทยาศาสตร์ที่รองรับ |
|------|---------|---------------------|
| **1. Learn** | เรียนรู้สำนวนใหม่ 5 ตัว/วัน แบบ Story+Image+Origin | Dual Coding, Elaboration, Story Method |
| **2. Review** | ทบทวนตาม SRS (FSRS-lite) | Spaced Repetition, Retrieval Practice |
| **3. Practice** | 5 โหมดฝึก: Cloze, Scenario, Sentence Builder, Listen, Speak | Varied Context, Generation Effect, Interleaving |
| **4. Explore** | คลัง 300 สำนวน ค้นหา/กรอง/หมวดหมู่ | - |
| **5. Progress** | Dashboard, Heatmap, Weak map, Streak | Gamification, Metacognition |

### 5. User Journey (วันละ 15 นาที)

```
Morning (7 นาที) - REVIEW
  -> ระบบดัน 8-12 ใบที่ถึงกำหนดทบทวน
  -> ตอบ 4 ปุ่ม: Again/Hard/Good/Easy (FSRS)

Midday (5 นาที) - LEARN
  -> สำนวนใหม่ 5 ตัว (ถ้ายังไม่ครบโควตา)
  -> Flow ต่อสำนวน: ภาพจำ -> เรื่องเล่า -> ตัวอย่าง 3 บริบท -> ลองแต่งประโยค

Evening (3 นาที) - PRACTICE เกมสุ่ม
  -> Cloze / Scenario Quiz / Speed Match
```

### 6. ระบบการจำ 7 เสาหลัก (จาก docs/memory-science.md)

1. **FSRS-lite SRS** - คำนวณช่วงทบทวนแม่นยำกว่า SM2 30%
2. **Dual Coding** - ทุกสำนวนมี Visual Mnemonic (ภาพจำแบบ absurd)
3. **Elaborative Encoding** - ที่มา (Origin) + คำแปลตรงตัว (Literal) + เรื่องเล่า
4. **Retrieval Practice 5 ระดับ** - จากง่าย (เลือกตอบ) -> ยาก (พิมพ์เอง/พูด)
5. **Varied Context** - ตัวอย่าง 3 บริบท: Casual / Business / Movie
6. **Interleaving** - สลับหมวดหมู่ ไม่เรียนเป็นหมวดเดียวรวด
7. **Active Recall + Feedback Loop** - เฉลยทันที + ให้แต่งประโยคแล้ว AI ตรวจ (phase 2)

### 7. Data Model - Idiom

```json
{
  "id": "break_the_ice",
  "phrase": "break the ice",
  "phonetic": "/ˌbreɪk ði ˈaɪs/",
  "meaning_th": "ทำลายความเงียบ/เริ่มต้นบทสนทนาให้ผ่อนคลาย",
  "meaning_en": "to initiate conversation in a social setting",
  "literal_th": "ทุบน้ำแข็ง",
  "origin": "มาจากเรือตัดน้ำแข็งสมัยก่อน ต้องทุบน้ำแข็งก่อนเรืออื่นจะแล่นได้",
  "mnemonic": "นึกภาพคนทุบน้ำแข็งก้อนยักษ์ในงานปาร์ตี้ที่ทุกคนยืนเงียบ",
  "image_prompt": "giant ice cube in party, man hammering it",
  "category": "social",
  "difficulty": 1,
  "frequency": 5,
  "examples": [
    {"en": "I told a joke to break the ice.", "th": "ฉันเล่นมุกเพื่อทำลายความเงียบ", "context": "casual"},
    {"en": "Let's do an icebreaker to break the ice.", "th": "มาทำกิจกรรมละลายพฤติกรรมกัน", "context": "business"},
    {"en": "He broke the ice by asking about her trip.", "th": "เขาเริ่มบทสนทนาด้วยการถามเรื่องทริป", "context": "daily"}
  ],
  "synonyms": ["break the tension"],
  "antonyms": ["create awkward silence"],
  "common_mistake": "อย่าสับสนกับ 'break up the ice'"
}
```

### 8. SRS Logic (FSRS-lite)
- Card มี state: new -> learning -> review -> relearning
- Interval คำนวณจาก stability, difficulty, retrievability
- 4 ปุ่ม: Again (1m), Hard (6h), Good (1d * stability), Easy (2.5d * stability)
- Leech detection: ตก Again > 8 ครั้ง -> แยกไปโหมด Story Re-encode

### 9. Gamification
- XP: Learn +10, Review Good +5, Easy +7, Practice win +15
- Streak: ต่อเนื่อง, Freeze 1 ครั้ง/สัปดาห์
- Level: 1-20 (Newbie -> Idiom Master)
- Badge: 7-day, 30-day, Category Master, Perfect Week
- Heatmap แบบ GitHub

### 10. Tech Stack (MVP)
- **MVP Phase 1 (ตอนนี้):** Single HTML + Vanilla JS + Tailwind CDN + localStorage (ใช้งานได้ทันที ไม่ต้อง build)
- **Phase 2:** PWA + SQLite + TTS/STT (Web Speech API)
- **Phase 3:** Next.js + Supabase + FSRS-rs + AI Sentence Check (LLM)

### 11. Success Metrics
- Retention D7 > 40%, D30 > 20%
- จำได้ 80% หลัง 30 วัน (วัดจาก review accuracy)
- ผู้ใช้แต่งประโยคใช้สำนวนได้ถูกต้อง > 70%

### 12. Roadmap
- Week 1: MVP 100 idioms + Learn/Review/Practice/Explore
- Week 2: PWA + Audio + Streak
- Week 3: AI Check + Import/Export Anki
- Week 4: 300 idioms + Leaderboard
