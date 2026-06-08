---
type: agent-skill-matrix
status: active
updated: 2026-06-08
---
# Agent Skill Matrix — Smart Agent AI

Цель: skills (умения) не висят только на Яне. Каждый агент получает свой набор ответственности: кто отвечает — тот и делает; Яна/контроль только проверяет и принимает работу.

## Управленческий контур

### `orchestrator`
Роль: раскладывает большие задачи на карточки, назначает исполнителей, не делает работу руками.

Skills:
- `kanban-orchestrator`
- `one-three-one-rule`
- `obsidian-vault`
- `business-automation-playbook`

Выход: дерево задач, владельцы, сроки, зависимости.

### `controller-ops`
Роль: следит, чтобы процессы не зависали.

Skills:
- `watchers`
- `autoposting-pipelines`
- `obsidian-vault`
- `systematic-debugging`

Выход: красные флаги, перезапуск зависших задач, ежедневный операционный минимум.

### `controller-quality`
Роль: принимает работу перед закрытием.

Skills:
- `requesting-code-review`
- `webapp-testing`
- `commercial-pwa-mvp`
- `github-code-review`
- `obsidian-vault`

Выход: PASS/FAIL, что исправить, что готово показывать.

### `system-doctor`
Роль: здоровье Hermes, cron, память, диск, gateway.

Skills:
- `hermes-agent`
- `watchers`
- `docker-management`
- `systematic-debugging`

Выход: короткий red-only отчёт, если что-то сломано.

## Производственный контур

### `worker-research`
Роль: исследования, аудит, поиск источников, техническая диагностика.

Skills:
- `webapp-testing`
- `commercial-pwa-mvp`
- `domain-intel`
- `client-commercial-growth-ops`
- `obsidian-vault`

Выход: отчёт с фактами, приоритетами и ссылками.

### `worker-execution`
Роль: внедрение исправлений, скрипты, сайт, автоматизации.

Skills:
- `commercial-pwa-mvp`
- `deployment-and-host-recovery`
- `github-pr-workflow`
- `systematic-debugging`
- `test-driven-development`

Выход: внесённые изменения, runbook, проверка результата.

### `worker-content`
Роль: статьи, офферы, доверие, SEO-контент, перелинковка.

Skills:
- `client-commercial-growth-ops`
- `content-research-writer`
- `humanizer`
- `youtube-content`
- `obsidian-vault`

Выход: контент-план, тексты, E-E-A-T, структура статей.

### `worker-research` / `gemini-research`
Роль: глубокое внешнее исследование, тренды, конкуренты, рынок.

Skills:
- `web`
- `parallel-cli`
- `domain-intel`
- `osint-investigation`
- `arxiv` при научных темах

Выход: внешние факты и идеи, не финальная реализация.

## Коммерческий контур

### `client-solutions-agent`
Роль: клиентские решения, КП, упаковка внедрений.

Skills:
- `agentic-business-analysis`
- `client-commercial-growth-ops`
- `pptx-author`
- `excel-author`

Выход: КП, структура внедрения, тарифы, план клиента.

### `controller-finance`
Роль: деньги, юнит-экономика, прогнозы.

Skills:
- `3-statement-model`
- `dcf-model`
- `comps-analysis`
- `stocks` если нужны рынки

Выход: экономика, риски, прогноз.

## Память и база знаний

### Боевое правило
- Локальная Hermes memory — короткая.
- Подробный контекст — в Obsidian.
- Supabase — страховочное зеркало, когда доступ/DNS здоров.

### Активные роботы памяти
- `Hermes memory hourly sync to Obsidian/Supabase` — каждый час.
- `Hermes daily context booster` — каждый день утром.
- `Hermes memory Supabase mirror watchdog` — ежедневно сообщает, если Supabase-зеркало не работает.
- `obsidian-auto-push` — пушит Obsidian в GitHub каждые 30 минут.
- `hermes-daily-disk-autoclean` — ежедневная безопасная чистка диска/мусора.

## Контроль качества распределения

- Агент не должен брать чужую работу.
- Любая новая большая задача получает владельца и контролёра.
- Итог каждого агента должен лечь в Obsidian: отчёт, runbook, чеклист или решение.
- Яна даёт владельцу только короткий управленческий итог: сделано / блокер / дальше.
