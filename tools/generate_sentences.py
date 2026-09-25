# -*- coding: utf-8 -*-
"""Generate app/data/sentences.json + sentences.js from sentences_data/parts/*.py

Usage:
    python tools/generate_sentences.py

Outputs:
    app/data/sentences.json   (fetch path, served over http)
    app/data/sentences.js     (window.__SENTENCES__ = [...]; file:// fallback)
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARTS_DIR = os.path.join(ROOT, "sentences_data", "parts")
OUT_JSON = os.path.join(ROOT, "app", "data", "sentences.json")
OUT_JS = os.path.join(ROOT, "app", "data", "sentences.js")

sys.path.insert(0, PARTS_DIR)

PART_FILES = ["p1", "p2", "p3", "p4", "p5", "p6"]


def load_parts():
    sections = []
    for name in PART_FILES:
        mod = __import__(name)
        sections.extend(mod.DATA)
    return sections


def clean_keyword(keyword, sentence):
    """Ensure keyword appears in the sentence (case-insensitive); else derive one."""
    if keyword:
        if keyword.lower() in sentence.lower():
            return keyword
    # derive: longest content word (>=4 chars, alpha) present in the sentence
    words = re.findall(r"[A-Za-z']{4,}", sentence)
    stop = {"that", "with", "have", "this", "from", "they", "there", "what", "will", "about", "would", "could", "should", "want", "going", "because", "these", "those", "their", "your", "don't", "can't", "didn't", "wasn't"}
    for w in words:
        if w.lower() not in stop:
            return w
    return words[0] if words else sentence.strip().strip(".!?") or "it"


def build_items(sections):
    items = []
    counter = 0
    for cat_key, cat_th, rows in sections:
        for en, th, keyword, diff in rows:
            counter += 1
            kw = clean_keyword(keyword, en)
            items.append({
                "id": "st_%04d" % counter,
                "kind": "sentence",
                "phrase": en,
                "keyword": kw,
                "phonetic": "",
                "meaning_th": th,
                "meaning_en": "",
                "category": cat_key,
                "category_th": cat_th,
                "category_full": cat_th,
                "difficulty": int(diff),
                "frequency": 5,
                "examples": [{"en": en, "th": th, "context": cat_key}],
                "synonyms": [],
                "mnemonic": "",
            })
    return items


def main():
    sections = load_parts()
    items = build_items(sections)
    # validate
    ids = [it["id"] for it in items]
    assert len(ids) == len(set(ids)), "duplicate ids"
    for it in items:
        assert it["phrase"] and it["meaning_th"], "missing field in %s" % it["id"]
        assert it["keyword"].lower() in it["phrase"].lower(), "keyword missing in %s: %s" % (it["id"], it["keyword"])
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=1)
    with open(OUT_JS, "w", encoding="utf-8") as f:
        f.write("window.__SENTENCES__ = " + json.dumps(items, ensure_ascii=False, separators=(",", ":")) + ";\n")
    print("Generated %d sentences -> %s / %s" % (len(items), OUT_JSON, OUT_JS))


if __name__ == "__main__":
    main()