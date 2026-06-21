---
type: system
status: active
created: 2026-06-21
---
# Context Memory Layer

Назначение: экономичная память для агентских систем без загрузки всего Obsidian в промпт.

Слои:

1. Semantic memory — стабильные факты, правила, предпочтения.
2. Episodic memory — события, сессии, дневники, статусы.
3. Procedural memory — инструкции, workflows, skills.
4. Project memory — проекты, сайты, клиенты, активы.
5. Graph memory — связи между заметками через wikilinks.

Файлы:

- `agent_memory.db` — SQLite + FTS5 база памяти.
- `scripts/memory_cli.py` — индексатор, поиск, context-pack.
- `context-engineering-runbook.md` — как агент должен пользоваться памятью.

Правило экономии токенов:

Агент не читает весь vault. Агент делает query/context-pack и берёт только 5–15 релевантных фактов.
