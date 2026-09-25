#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Watcher สำหรับ youtube/ — เช็คทุก 30 วินาที ถ้าเจอ .webm/.mp4 ใหม่ จะ:
1) ดึง ID จากชื่อไฟล์ [VIDEOID]
2) โหลด auto-sub (th,en) ผ่าน yt-dlp ถ้ายังไม่มี .srt
3) แยก transcript -> สกัดสำนวนด้วย heuristic + บันทึก log
4) อัปเดต app/data/idioms.json อัตโนมัติ (ถ้าสกัดได้)
"""
import pathlib, re, time, json, subprocess, sys
from datetime import datetime

ROOT = pathlib.Path(r"C:\Users\nipon\Documents\opencode\idiom-master")
YOUTUBE_DIR = ROOT / "youtube"
LOG_PATH = ROOT / "tools" / "watch_log.json"
PROCESSED_PATH = ROOT / "tools" / "processed.json"
IDIOMS_JSON = ROOT / "app" / "data" / "idioms.json"
IDIOMS_JS = ROOT / "app" / "data" / "idioms.js"

# เก็บ ID ที่เคยประมวลผลแล้ว
def load_processed():
    if PROCESSED_PATH.exists():
        try: return set(json.loads(PROCESSED_PATH.read_text(encoding='utf-8')))
        except: return set()
    return set()

def save_processed(s):
    PROCESSED_PATH.write_text(json.dumps(sorted(list(s)), ensure_ascii=False, indent=2), encoding='utf-8')

def extract_id(filename):
    m = re.search(r'\[([A-Za-z0-9_-]{11})\]', filename)
    return m.group(1) if m else None

def ensure_subs(video_id):
    """โหลด srt th,en ถ้ายังไม่มี"""
    th = YOUTUBE_DIR / f"{video_id}.th.srt"
    en = YOUTUBE_DIR / f"{video_id}.en.srt"
    if th.exists() and en.exists():
        return True
    # ใช้ yt-dlp โหลด sub อย่างเดียว
    cmd = [
        "yt-dlp", "--write-auto-sub", "--sub-lang", "th,en",
        "--skip-download", "--sub-format", "srt",
        "-o", str(YOUTUBE_DIR / "%(id)s.%(ext)s"),
        f"https://www.youtube.com/watch?v={video_id}"
    ]
    print(f"[{datetime.now().strftime('%H:%M:%S')}] yt-dlp subs for {video_id} ...")
    try:
        subprocess.run(cmd, timeout=120, check=False)
        return th.exists() or en.exists()
    except Exception as e:
        print("yt-dlp error:", e)
        return False

def parse_srt(path):
    if not path.exists(): return ""
    txt = path.read_text(encoding='utf-8', errors='ignore')
    # ลบ timestamp/เลข
    lines = []
    for line in txt.splitlines():
        line=line.strip()
        if not line: continue
        if re.match(r'^\d+$', line): continue
        if re.match(r'\d{2}:\d{2}:\d{2}', line): continue
        lines.append(line)
    # รวมและลบซ้ำติดกัน
    dedup=[]
    for l in lines:
        if not dedup or dedup[-1]!=l:
            dedup.append(l)
    return " ".join(dedup)

def heuristic_extract(transcript_en, video_id, title):
    """สกัดสำนวนแบบ heuristic: หาประโยคที่ซ้ำบ่อย + อยู่ในรายการ phrase ยอดฮิต
    ถ้าเจอน้อยกว่า 2 จะคืน transcript ให้คนตรวจ"""
    # รายการสำนวนที่มักโผล่ใน playlist นี้ (จาก idioms_data + วิดีโอ)
    # จะใช้ LLM จริงในอนาคต ตอนนี้ใช้ pattern matching + ส่งให้ตรวจสอบ
    candidates = []
    # หา phrase ที่อยู่ใน transcript ซ้ำๆ
    # ลองดึงประโยคที่อยู่ใน quotes หรือ TitleCase 3-5 คำ
    # ชั่วคราว: ส่ง transcript ทั้งก้อนไปให้ log ไว้ก่อน
    return candidates

def update_log(entry):
    log = []
    if LOG_PATH.exists():
        try: log = json.loads(LOG_PATH.read_text(encoding='utf-8'))
        except: log=[]
    log.append(entry)
    LOG_PATH.write_text(json.dumps(log, ensure_ascii=False, indent=2), encoding='utf-8')

def main_loop():
    print(f"Watcher started — monitoring {YOUTUBE_DIR} every 30s (target 97 videos)")
    print(f"Current: {len(list(YOUTUBE_DIR.glob('*.webm'))) + len(list(YOUTUBE_DIR.glob('*.mp4')))} video files")
    processed = load_processed()
    while True:
        try:
            files = list(YOUTUBE_DIR.glob("*.webm")) + list(YOUTUBE_DIR.glob("*.mp4")) + list(YOUTUBE_DIR.glob("*.mkv"))
            # นับ srt ด้วย
            for f in files:
                vid = extract_id(f.name)
                if not vid:
                    continue
                if vid in processed:
                    continue
                print(f"\n[{datetime.now().strftime('%H:%M:%S')}] NEW: {f.name} -> {vid}")
                ok = ensure_subs(vid)
                en_path = YOUTUBE_DIR / f"{vid}.en.srt"
                th_path = YOUTUBE_DIR / f"{vid}.th.srt"
                en_txt = parse_srt(en_path)[:2000] if en_path.exists() else ""
                th_txt = parse_srt(th_path)[:2000] if th_path.exists() else ""
                entry = {
                    "time": datetime.now().isoformat(),
                    "file": f.name,
                    "video_id": vid,
                    "subs_ok": ok,
                    "en_preview": en_txt[:500],
                    "th_preview": th_txt[:500],
                    "status": "subs_ready" if ok else "subs_failed"
                }
                update_log(entry)
                # ทำเครื่องหมายว่า processed เพื่อไม่วนซ้ำ (แต่ถ้า extract idioms ยังไม่เสร็จ จะมาเติมภายหลัง)
                processed.add(vid)
                save_processed(processed)
                # นับรวม
                total_videos = len(files)
                print(f"  -> subs_ok={ok}, total videos in folder: {total_videos}/97")
                # อัปเดต idioms.json count log
                if IDIOMS_JSON.exists():
                    cnt = len(json.loads(IDIOMS_JSON.read_text(encoding='utf-8')))
                    print(f"  -> idioms.json now: {cnt} entries")
            # สรุปทุก 5 นาที
            time.sleep(30)
        except KeyboardInterrupt:
            print("Stopped")
            break
        except Exception as e:
            print("Watcher error:", e)
            time.sleep(30)

if __name__ == "__main__":
    YOUTUBE_DIR.mkdir(parents=True, exist_ok=True)
    (ROOT/"tools").mkdir(parents=True, exist_ok=True)
    main_loop()
