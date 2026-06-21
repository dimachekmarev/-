---
type: runbook
status: active
created: 2026-06-21
---
# Supabase sync for context memory

Назначение: вынести compact memory layer (короткую память агентов) из локального SQLite в Supabase.

Локальный источник:

/root/obsidian-vault/agents/context-memory/agent_memory.db

Скрипт синка:

/root/obsidian-vault/agents/context-memory/scripts/supabase_sync.py

SQL схема:

/root/obsidian-vault/agents/context-memory/supabase-schema.sql

Таблицы:

agent_memory_items
agent_memory_entities
agent_memory_relations

Правило безопасности:

Скрипт не печатает ключи. Файлы с credentials/token/password/api key исключены из локального индекса до синка.

Проверка:

python3 /root/obsidian-vault/agents/context-memory/scripts/supabase_sync.py --dry-run

Запуск:

python3 /root/obsidian-vault/agents/context-memory/scripts/supabase_sync.py

Текущий блокер на момент создания:

SUPABASE_URL и SUPABASE_PROJECT_REF есть в окружении, но host проекта не резолвится DNS. Supabase management API по текущему access token вернул 403.
