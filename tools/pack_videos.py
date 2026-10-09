"""
pack_videos.py
บีบอัดไฟล์วิดีโอ 688 คลิปออกเป็น zip packages เพื่ออัปโหลดขึ้น GitHub Releases
แบ่งออกเป็น 3 ส่วน (Part 1, Part 2, Part 3) ขนาด ~350-500 MB เพื่อให้อัปโหลดและดาวน์โหลดได้ง่ายและเสถียร
"""
import zipfile
import glob
import os
import math

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIDEO_DIR = os.path.join(ROOT_DIR, 'video')
OUTPUT_DIR = os.path.join(ROOT_DIR, 'scratch', 'video_packs')
os.makedirs(OUTPUT_DIR, exist_ok=True)

files = sorted(glob.glob(os.path.join(VIDEO_DIR, '*.webm')))
total_files = len(files)
print(f"เตรียมแพ็กไฟล์ทั้งหมด {total_files} ไฟล์...")

PARTS = 5
chunk_size = math.ceil(total_files / PARTS)

for part_idx in range(PARTS):
    start = part_idx * chunk_size
    end = min((part_idx + 1) * chunk_size, total_files)
    part_files = files[start:end]
    
    zip_name = f"videos-pack-part{part_idx + 1}.zip"
    zip_path = os.path.join(OUTPUT_DIR, zip_name)
    
    print(f"\n--- กำลังสร้าง {zip_name} (ไฟล์ที่ {start + 1} ถึง {end} รวม {len(part_files)} ไฟล์) ---")
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_STORED, allowZip64=True) as zf:
        for f in part_files:
            # เก็บทั้งชื่อตรงๆ (basename) เพื่อให้อ่านง่ายและไม่ติดโฟลเดอร์ย่อย
            arcname = os.path.basename(f)
            zf.write(f, arcname=arcname)
            
    size_mb = round(os.path.getsize(zip_path) / (1024 * 1024), 2)
    print(f"สร้างสำเร็จ: {zip_path} (ขนาด: {size_mb} MB)")

print("\nแพ็กไฟล์วิดีโอครบทั้ง 5 ส่วนเรียบร้อยแล้ว!")
