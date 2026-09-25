import json

with open("app/data/oxford3000.json", encoding="utf-8") as f:
    ox = json.load(f)

templated = []
good = []

for i, it in enumerate(ox):
    mn = it.get("mnemonic", "").strip()
    if not mn or "เชื่อมคำว่า" in mn or mn.startswith("จำ \"") or "จากประโยคตัวอย่างด้านบน" in mn:
        templated.append(it)
    else:
        good.append(it)

print(f"Total: {len(ox)}")
print(f"Good: {len(good)}")
print(f"Needs upgrade: {len(templated)}")
