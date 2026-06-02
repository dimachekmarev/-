---
type: hermes-memory-index
updated_at: 2026-06-02T12:34:23.753187+00:00
status: active
source_of_truth: obsidian
supabase_status: pending_credentials_or_project_restore
---
# Hermes Memory Index

Это основной человекочитаемый слой памяти Яны/Hermes.

## Где что лежит

- Локальная короткая память Hermes: `/root/.hermes/memories/MEMORY.md` и `/root/.hermes/memories/USER.md`
- Obsidian source of truth (единый источник правды): `agents/hermes-memory/`
- Последний bootstrap-контекст: `agents/hermes-memory/context-bootstrap.md`
- Полная копия MEMORY: `agents/hermes-memory/MEMORY.full.md`
- Полная копия USER: `agents/hermes-memory/USER.full.md`
- Снапшоты: `agents/hermes-memory-backup/snapshots/`

## Правило

Локальная память на сервере должна быть короткой: только указатели и критичные предпочтения. Всё длинное хранится в Obsidian и, когда Supabase-доступ восстановлен, дублируется в Supabase.

## Supabase status

На момент настройки REST host проекта `hagmwnadcvdravmhedcd.supabase.co` не резолвится, а management token отвечает 403. Скрипт синхронизации установлен и будет работать после восстановления проекта/токена.
