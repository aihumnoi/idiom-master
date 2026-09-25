import pathlib, re, subprocess, time, json, random
ROOT = pathlib.Path(r"C:\Users\nipon\Documents\opencode\idiom-master")
YT = ROOT / "youtube"
log_path = ROOT / "tools" / "batch_log.txt"

def log(msg):
    print(msg)
    with open(log_path, "a", encoding="utf-8") as f:
        f.write(msg+"\n")

def get_ids():
    ids=[]
    for f in YT.glob("*.webm"):
        m=re.search(r'\[([A-Za-z0-9_-]{11})\]', f.name)
        if m: ids.append((m.group(1), f.name))
    for f in YT.glob("*.mp4"):
        m=re.search(r'\[([A-Za-z0-9_-]{11})\]', f.name)
        if m: ids.append((m.group(1), f.name))
    return ids

ids = get_ids()
log(f"Found {len(ids)} videos")
# sort by Ep number
ids.sort(key=lambda x: x[1])
for vid, fname in ids:
    th = YT / f"{vid}.th.srt"
    en = YT / f"{vid}.en.srt"
    if th.exists() and en.exists():
        log(f"SKIP {vid} already has both")
        continue
    log(f"DOWNLOAD subs for {vid} [{fname[:30]}]")
    cmd = ["yt-dlp", "--write-auto-sub", "--sub-lang", "th,en", "--skip-download", "--sub-format", "srt", "-o", str(YT / "%(id)s.%(ext)s"), f"https://www.youtube.com/watch?v={vid}"]
    for attempt in range(3):
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
            out = result.stdout + result.stderr
            if "429" in out or "Too Many Requests" in out:
                wait = 20 + random.randint(5,15)
                log(f"  429 hit, waiting {wait}s retry {attempt+1}/3")
                time.sleep(wait)
                continue
            if th.exists() or en.exists():
                log(f"  OK th={th.exists()} en={en.exists()}")
                break
            else:
                log(f"  no srt yet, output: {out[-400:]}")
                time.sleep(5)
                break
        except Exception as e:
            log(f"  error {e}")
            time.sleep(5)
    # delay between videos to avoid 429
    time.sleep(12 + random.randint(2,6))

log("Batch done")
# count
webm = len(list(YT.glob("*.webm")))
srt = len(list(YT.glob("*.srt")))
log(f"Final: {webm} videos, {srt} srt files -> target 97 videos")
