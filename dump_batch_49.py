import json

with open(r"C:\Users\nipon\.gemini\antigravity-cli\brain\f19bc2c1-ebfd-4330-9cf2-4800f6aa6f93\scratch\ox_batches\batch_49.json", encoding="utf-8") as f:
    data = json.load(f)

print(f"Total words: {len(data)}")
for i, item in enumerate(data):
    print(f"{i+1}. {item['id']} | {item['lemma']} | {item['pos']} | {item['meaning_th']}")
