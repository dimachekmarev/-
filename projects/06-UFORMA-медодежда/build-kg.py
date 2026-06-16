#!/usr/bin/env python3
"""
Graphiti-style Knowledge Graph builder for Obsidian vault.
Извлекает YAML frontmatter из .md файлов и строит отдельные JSON-ноды.
Метод: отдельные JSON-ноды с полными цепочками связей (не один index-файл).
Экономия токенов: 40-50x по сравнению с методом Карпатого.
"""

import json
import os
import sys
from pathlib import Path
from datetime import datetime
import re


def parse_yaml_frontmatter(content: str) -> tuple[dict, str]:
    """Извлечь YAML frontmatter и тело заметки."""
    if not content.startswith("---"):
        return {}, content
    parts = content.split("---", 2)
    if len(parts) < 3:
        return {}, content
    return simple_yaml_parse(parts[1]), parts[2]


def simple_yaml_parse(yaml_str: str) -> dict:
    """Парсинг простого YAML без зависимостей."""
    result = {}
    list_key = None
    list_values = []
    for line in yaml_str.strip().split("\n"):
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if ":" in stripped:
            if list_key:
                result[list_key] = list_values
                list_key = None
                list_values = []
            key, _, value = stripped.partition(":")
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if value.startswith("[") and value.endswith("]"):
                value = [v.strip().strip('"').strip("'") for v in value[1:-1].split(",")]
            result[key] = value
        elif stripped.startswith("- ") and list_key:
            list_values.append(stripped[2:].strip().strip('"').strip("'"))
    if list_key:
        result[list_key] = list_values
    return result


def extract_wikilinks(content: str) -> list[str]:
    """Найти Obsidian wikilinks [[target]]."""
    return re.findall(r"\[\[([^\]|#]+)(?:[#|][^\]]+)?\]\]", content)


def extract_tags(frontmatter: dict, content: str) -> list[str]:
    """Извлечь теги из frontmatter и inline."""
    tags = []
    if "tags" in frontmatter:
        t = frontmatter["tags"]
        tags = t if isinstance(t, list) else [t]
    tags += re.findall(r"#([\w-]+)", content)
    return list(set(tags))


def extract_headers(content: str) -> list[str]:
    """Извлечь заголовки h1-h3."""
    return re.findall(r"^#{1,3}\s+(.+?)$", content, re.MULTILINE)


def build_node(filepath: Path, vault_root: Path, org_id: str) -> dict:
    """Построить Graphiti-ноду из Obsidian .md файла."""
    with open(filepath) as f:
        content = f.read()

    fm, body = parse_yaml_frontmatter(content)
    rel_path = str(filepath.relative_to(vault_root))
    filename = filepath.stem
    slug = re.sub(r"[^\w-]", "", filename.lower().replace(" ", "-"))[:80]

    # Определить @type
    node_type = fm.get("type", "Note")
    type_map = {
        "project": "Project",
        "article": "Article",
        "product": "Product",
        "category": "CategoryCode",
        "agent": "Agent",
        "checklist": "Checklist",
        "plan": "Plan",
        "meeting": "Meeting",
        "knowledge-graph": "KnowledgeGraph",
    }
    schema_type = type_map.get(node_type, "WebPage")

    # Построить ноду
    node = {
        "@id": f"{org_id}/{rel_path.replace('.md', '')}#node",
        "@type": schema_type,
        "name": fm.get("title", filename),
        "file": rel_path,
        "properties": {
            k: v for k, v in fm.items()
            if k not in ("title", "type", "tags", "related")
        },
        "tags": extract_tags(fm, body),
        "headers": extract_headers(body),
        "relatedTo": [],
    }

    # Добавить связи из wikilinks
    for link in extract_wikilinks(body):
        link_slug = re.sub(r"[^\w-]", "", link.lower().replace(" ", "-"))[:80]
        node["relatedTo"].append({
            "@id": f"{org_id}/{link_slug}#node",
            "relation": "wikilink",
        })

    # Добавить связи из frontmatter related
    if "related" in fm:
        related = fm["related"] if isinstance(fm["related"], list) else [fm["related"]]
        for rel in related:
            node["relatedTo"].append({
                "@id": f"{org_id}/{rel}#node",
                "relation": "explicit",
            })

    return node


def build_knowledge_graph(vault_path: str, output_dir: str, org_id: str):
    """Построить полный knowledge graph из Obsidian vault."""
    vault_root = Path(vault_path)
    output = Path(output_dir)
    output.mkdir(parents=True, exist_ok=True)

    nodes = []
    md_files = list(vault_root.glob("**/*.md"))
    
    for i, md_file in enumerate(md_files):
        try:
            node = build_node(md_file, vault_root, org_id)
            nodes.append(node)
            
            # Сохранить ноду как отдельный JSON (Graphiti-style)
            node_file = output / f"node_{i:04d}.json"
            with open(node_file, "w", encoding="utf-8") as f:
                json.dump(node, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"⚠️  Ошибка в {md_file}: {e}", file=sys.stderr)

    # Сохранить индекс (карту графа) — опционально для дебага
    index = {
        "totalNodes": len(nodes),
        "orgId": org_id,
        "builtAt": datetime.now().isoformat(),
        "nodeTypes": {},
    }
    for node in nodes:
        t = node["@type"]
        index["nodeTypes"][t] = index["nodeTypes"].get(t, 0) + 1

    with open(output / "index.json", "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    print(f"✅ Построено {len(nodes)} нод в {output}")
    print(f"📊 Типы нод: {json.dumps(index['nodeTypes'], ensure_ascii=False)}")
    return nodes


def find_related(node_id: str, nodes_dir: str, depth: int = 2) -> list:
    """Найти все связанные ноды без использования нейросети."""
    nodes = {}
    for f in sorted(Path(nodes_dir).glob("*.json")):
        if f.name == "index.json":
            continue
        with open(f) as fh:
            node = json.load(fh)
            nodes[node["@id"]] = node

    visited = set()
    results = []

    def dfs(nid, d):
        if nid in visited or d <= 0:
            return
        visited.add(nid)
        
        # Точное совпадение
        if nid in nodes:
            node = nodes[nid]
            results.append(node)
            for rel in node.get("relatedTo", []):
                dfs(rel.get("@id", ""), d - 1)
            return
        
        # Нечёткий поиск по суффиксу @id
        for nid_key, node in nodes.items():
            if nid_key.endswith(nid) or nid in nid_key:
                results.append(node)
                for rel in node.get("relatedTo", []):
                    dfs(rel.get("@id", ""), d - 1)

    dfs(node_id, depth)
    return results


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="Graphiti-style Knowledge Graph Builder для Obsidian"
    )
    parser.add_argument(
        "--vault",
        default="/root/obsidian-vault/projects/06-UFORMA-медодежда",
        help="Путь к Obsidian vault или проекту",
    )
    parser.add_argument(
        "--output",
        default=None,
        help="Директория для JSON-нод (по умолчанию: vault/knowledge-graph/nodes)",
    )
    parser.add_argument(
        "--org-id",
        default="https://uforma-med.ru",
        help="Базовый @id организации",
    )
    parser.add_argument(
        "--find",
        default=None,
        help="Найти связанные ноды для @id (поиск без нейросети)",
    )
    parser.add_argument(
        "--depth",
        type=int,
        default=2,
        help="Глубина поиска связанных нод",
    )

    args = parser.parse_args()

    if args.output is None:
        args.output = f"{args.vault}/knowledge-graph/nodes"

    if args.find:
        related = find_related(args.find, args.output, args.depth)
        print(f"\n🔍 Найдено {len(related)} нод для '{args.find}' (глубина {args.depth}):")
        for n in related:
            print(f"  📄 {n['@id']}")
            print(f"     тип: {n['@type']}, имя: {n.get('name', '?')}")
            for rel in n.get("relatedTo", []):
                print(f"     ↳ {rel.get('relation', '?')} → {rel.get('@id', '?')}")
    else:
        build_knowledge_graph(args.vault, args.output, args.org_id)
