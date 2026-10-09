"""
generate_videos_data.py
สแกนไฟล์ video/*.webm ทั้งหมด 688+ ไฟล์ และสร้าง app/data/videos.js และ app/data/videos.json
จัดหมวดหมู่ ดึงชื่อคลิป ดึงแท็ก และเตรียมพร้อมให้เล่นแบบ Offline เต็มหน้าจอ
"""
import os
import glob
import re
import json

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIDEO_DIR = os.path.join(ROOT_DIR, 'video')
OUTPUT_JS = os.path.join(ROOT_DIR, 'app', 'data', 'videos.js')
OUTPUT_JSON = os.path.join(ROOT_DIR, 'app', 'data', 'videos.json')

files = glob.glob(os.path.join(VIDEO_DIR, '*.webm'))
files.sort()

print(f"พบไฟล์วีดีโอทั้งหมด: {len(files)} ไฟล์")

videos = []

CATEGORY_INFO = {
    'all': {'th': 'ทั้งหมด', 'icon': 'fa-film'},
    'quiz': {'th': 'ตอบคำถาม & Quiz', 'icon': 'fa-circle-question'},
    'idiom': {'th': 'สำนวน & จากหนัง', 'icon': 'fa-clapperboard'},
    'sentence': {'th': 'ประโยคใช้จริง & สนทนา', 'icon': 'fa-comments'},
    'grammar': {'th': 'ไวยากรณ์ & Tense', 'icon': 'fa-spell-check'},
    'vocab': {'th': 'คำศัพท์ติดปาก', 'icon': 'fa-book-bookmark'},
    'chat': {'th': 'ตัวย่อสายแชท', 'icon': 'fa-message'},
    'listening': {'th': 'ฝึกฟัง & พูดตาม', 'icon': 'fa-headphones'},
    'general': {'th': 'บทเรียนสั้นทั่วไป', 'icon': 'fa-play'}
}

for idx, f in enumerate(files):
    filename = os.path.basename(f)
    name_no_ext = os.path.splitext(filename)[0]
    
    # Extract youtube ID if present in square brackets at the end
    yt_match = re.search(r'\[([a-zA-Z0-9_-]{11})\]$', name_no_ext)
    yt_id = yt_match.group(1) if yt_match else ''
    
    # Clean string without YT ID
    clean_raw = re.sub(r'\s*\[[a-zA-Z0-9_-]{11}\]$', '', name_no_ext).strip()
    
    # Extract hashtags
    tags = re.findall(r'#([a-zA-Z0-9_\u0E00-\u0E7F]+)', clean_raw)
    
    # Extract clean display title
    clean_title = re.sub(r'#[a-zA-Z0-9_\u0E00-\u0E7F]+', '', clean_raw).strip()
    clean_title = re.sub(r'\s+', ' ', clean_title)
    if not clean_title:
        clean_title = ' '.join(tags[:4]) if tags else name_no_ext
        
    lower = filename.lower()
    
    # Determine category
    if any(k in lower for k in ['quiz', 'ตอบคำถาม', 'โจทย์', 'ข้อนี้', 'ตอบในคอมเม้น', 'พิมพ์ตอบ', 'เฉลย']):
        cat = 'quiz'
    elif any(k in lower for k in ['คำย่อ', 'ตัวย่อ', 'แชท']):
        cat = 'chat'
    elif any(k in lower for k in ['tense', 'แกรมม่า', 'grammar', 'modal', 'verb', 'คำกริยา', 'พหูพจน์', 'ออกเสียง p', 'after กับ then', 'much หรือ many', 'was delivered']):
        cat = 'grammar'
    elif any(k in lower for k in ['สำนวน', 'idiom', 'หนัง', 'movie', 'barbie', 'solo english']):
        cat = 'idiom'
    elif any(k in lower for k in ['ประโยค', 'speaking', 'พูดภาษาอังกฤษ', 'พูดแบบนี้', 'ชวนเพื่อน', 'ทักทาย', 'เที่ยว']):
        cat = 'sentence'
    elif any(k in lower for k in ['ศัพท์', 'vocab', 'คำศัพท์', 'ชื่อสี', 'โต๊ะทำงาน', 'ผิวหน้า', 'อาชีพ', 'เฟอร์นิเจอร์', 'เครื่องบิน', 'เบา', 'สัญลักษณ์']):
        cat = 'vocab'
    elif any(k in lower for k in ['ฟัง', 'listening', 'กดฟัง', 'พูดตาม']):
        cat = 'listening'
    else:
        cat = 'general'
        
    file_size_mb = round(os.path.getsize(f) / (1024 * 1024), 2)
    
    videos.append({
        'id': f'vid_{idx+1:04d}',
        'title': clean_title,
        'filename': filename,
        'src': f'video/{filename}',
        'category': cat,
        'category_th': CATEGORY_INFO.get(cat, {}).get('th', 'ทั่วไป'),
        'tags': tags[:6],
        'yt_id': yt_id,
        'size_mb': file_size_mb
    })

os.makedirs(os.path.dirname(OUTPUT_JS), exist_ok=True)

with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
    json.dump(videos, f, ensure_ascii=False, indent=2)

with open(OUTPUT_JS, 'w', encoding='utf-8') as f:
    f.write('window.__VIDEOS__ = ')
    json.dump(videos, f, ensure_ascii=False, indent=2)
    f.write(';\n')

print(f"สร้างไฟล์เสร็จเรียบร้อย:")
print(f" - {OUTPUT_JS}")
print(f" - {OUTPUT_JSON}")

counts = {}
for v in videos:
    counts[v['category_th']] = counts.get(v['category_th'], 0) + 1
for cat, cnt in counts.items():
    print(f"  * {cat}: {cnt} คลิป")
