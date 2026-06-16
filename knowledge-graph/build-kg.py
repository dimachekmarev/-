#!/usr/bin/env python3
"""
Graphiti Knowledge Graph Builder
Строит knowledge graph из Obsidian vault без нейросети.
Экономия токенов: 40-50x vs LLM-based extraction.

Usage: python3 build-kg.py [--watch]
"""

import json, os, re
from pathlib import Path
from datetime import datetime

VAULT = Path("/root/obsidian-vault")
KG_DIR = VAULT / "knowledge-graph"

def scan_vault():
    """Сканирует все .md файлы, извлекает [[links]] и строит граф."""
    graph = {"nodes": {}, "edges": []}

    for md_file in VAULT.rglob("*.md"):
        if ".trash" in str(md_file) or "knowledge-graph" in str(md_file):
            continue

        rel_path = str(md_file.relative_to(VAULT))
        node_id = rel_path.replace("/", "_").replace(".md", "")
        
        content = md_file.read_text(errors="replace")
        links = re.findall(r'\[\[([^\]|]+)(?:\|[^\]]+)?\]\]', content)
        
        # Category from path
        category = rel_path.split("/")[0] if "/" in rel_path else "root"

        graph["nodes"][node_id] = {
            "@type": "Note",
            "name": md_file.stem,
            "path": rel_path,
            "category": category,
            "links_to": links[:30],
            "size": len(content),
            "modified": datetime.fromtimestamp(md_file.stat().st_mtime).isoformat(),
        }

        # Build edges
        for target in links[:30]:
            graph["edges"].append({
                "from": node_id,
                "to": target,
                "type": "references"
            })

    return graph

def main():
    print("Сканирую Obsidian vault...")
    graph = scan_vault()
    
    # Save
    KG_DIR.mkdir(exist_ok=True)
    out = KG_DIR / "knowledge-graph.json"
    
    with open(out, "w") as f:
        json.dump(graph, f, ensure_ascii=False)
    
    nodes = len(graph["nodes"])
    edges = len(graph["edges"])
    size_kb = os.path.getsize(out) / 1024
    
    print(f"✅ Knowledge graph: {nodes} нод, {edges} связей ({size_kb:.0f} KB)")
    
    # Quick stats
    cats = {}
    for n in graph["nodes"].values():
        cats[n["category"]] = cats.get(n["category"], 0) + 1
    for cat, count in sorted(cats.items()):
        print(f"  {cat}: {count}")

if __name__ == "__main__":
    main()
