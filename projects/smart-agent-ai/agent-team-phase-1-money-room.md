---
type: operating-structure
project: Smart Agent AI
owner: Дмитрий Чекмарёв
phase: phase-1-money-room
created: 2026-06-13T17:27:59+00:00
status: ready-for-controlled-dispatch
---

# Phase 1 Money Room: минимальная рабочая агентная структура

## Цель на 48 часов
Оффер: **AI-бот для приёма заявок за 48 часов**.

KPI:
- 120 касаний
- 25 ответов
- 8 демо
- 4 предложения оплатить
- 1–2 оплаты

## Принцип управления
Яна не делает ручную диагностику/операционку. Яна/orchestrator ставит задачу, агент выполняет, контролёр принимает, Дмитрий получает короткий отчёт.

```text
Яна / orchestrator
  -> revenue-controller
    -> lead-research-agent
    -> crm-steward-agent
    -> outreach-sales-agent
    -> proposal-agent
    -> delivery-manager-agent
    -> agent-qa-controller
    -> controller-finance / controller-quality при необходимости
```

## Последовательность работы
1. **Яна/orchestrator** — даёт команду на запуск Phase 1 и не выполняет работу руками.
2. **revenue-controller** — собирает 48h command plan, KPI board, правила approval, порядок эскалации.
3. **lead-research-agent** — собирает 120 потенциальных лидов, сегментирует, отдаёт CRM-ready список.
4. **crm-steward-agent** — держит единый lead tracker и daily KPI snapshot.
5. **outreach-sales-agent** — готовит 3 варианта касаний и follow-up sequence; отправка только после approval.
6. **proposal-agent** — готовит КП, пакеты, счёт-заготовку, scope handoff.
7. **delivery-manager-agent** — готовит 48h checklist внедрения AI-бота и intake.
8. **agent-qa-controller** — задаёт acceptance criteria, проверяет обещания/CRM/delivery/handoff.
9. **controller-finance** — подключается на pricing, маржу, оплату, скидки.
10. **controller-quality** — подключается как внешний quality gate при спорных артефактах.

## Approval gates
- Массовые касания: только после утверждения скриптов и сегментов.
- КП/счёт: только после утверждения цены, scope, срока, оплаты/следующего шага.
- Delivery: только после подтверждённого scope и QA acceptance criteria.
- Секреты/доступы: не читать, не выводить, не копировать в отчёты.

## Kanban graph Phase 1
- `t_3d5c77df` — revenue-controller — Revenue Controller: 48h money-room command plan and KPI board — **ready**.
- `t_ce1e658b` — lead-research-agent — 120 лидов — зависит от `t_3d5c77df` — **todo**.
- `t_39508d54` — crm-steward-agent — lead tracker schema — зависит от `t_3d5c77df` — **todo**.
- `t_60a5270b` — outreach-sales-agent — 3 скрипта + follow-up — зависит от `t_3d5c77df`, `t_ce1e658b` — **todo**.
- `t_2bce2a18` — proposal-agent — КП/пакеты/счёт-заготовка — зависит от `t_60a5270b` — **todo**.
- `t_e4e98d53` — delivery-manager-agent — 48h delivery checklist — зависит от `t_2bce2a18` — **todo**.
- `t_4bc3f8cf` — agent-qa-controller — acceptance criteria и QA — зависит от `t_3d5c77df` — **todo**.

## Рабочие файлы
- Agent cards: `/root/obsidian-vault/projects/smart-agent-ai/agents/`
- KPI board: `/root/obsidian-vault/projects/smart-agent-ai/phase-1-money-room-kpi-board.md`
- Lead tracker schema: `/root/obsidian-vault/projects/smart-agent-ai/phase-1-money-room-lead-tracker.md`

## Dispatch policy
- Phase 1 создана как board-структура.
- `hermes kanban dispatch` **не запускался**.
- На слабом VPS запускать максимум одного агента за раз, начиная с `t_3d5c77df` / `revenue-controller`.
