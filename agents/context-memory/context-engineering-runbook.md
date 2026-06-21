---
type: runbook
status: active
created: 2026-06-21
---
# Context Engineering Runbook

Цель: убрать забывчивость агентов и не сжигать токены.

Как пользоваться:

1. Перед задачей агент формулирует короткий поисковый запрос.
2. Запускает `memory_cli.py context-pack "запрос"`.
3. Берёт в промпт только compact pack: факты, пути, связи.
4. Если найдено мало, делает второй запрос другими словами.
5. Новые стабильные факты пишет как semantic memory.
6. Статусы и события не пишет в durable memory, а оставляет в Obsidian/episodic слое.

Команды:

`python3 /root/obsidian-vault/agents/context-memory/scripts/memory_cli.py ingest-vault`

`python3 /root/obsidian-vault/agents/context-memory/scripts/memory_cli.py query "uforma медодежда"`

`python3 /root/obsidian-vault/agents/context-memory/scripts/memory_cli.py context-pack "как работать с Дмитрием"`

Политика хранения:

- Preferences and stable rules — semantic.
- Project progress and daily work — episodic/project.
- Repeatable workflows — procedural/skills.
- Secrets — не индексировать намеренно и не сохранять как факты.

Минимальный prompt budget:

- Горячий контекст: до 2000 токенов.
- Context pack: 5–15 фактов.
- Полные файлы читать только при точечной необходимости.
