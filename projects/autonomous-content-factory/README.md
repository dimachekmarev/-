---
type: project
created: 2026-07-18T12:45:00+00:00
status: autonomous-build
owner: Hermes (Dmitry Chekmarev — контроль)
purpose: Автономный завод контента + аватаров. Работает без управления пользователя 1.5ч+, создаёт субагентов, скиллы, ищет готовое в GitHub.
---

# Autonomous Content Factory

## Структура (рабочая)
- `pipelines/` — пайплайны (контент-фабрика, аватары)
- `skills/` — сгенерированные скиллы
- `agents/` — контракты субагентов (роли: orchestrator/dispatcher/worker/reviewer/delivery/monitor)
- `state.json` — статус автономной сессии
- `found-in-github.md` — готовое, найденное в репозиториях

## Правило завершения (из KANBAN-слоя)
Модельный ответ ≠ работа. Файл на диске ≠ завершение.
Работа = владелец + границы + зависимости + проверка + доставка + receipt.

## Источники контекста
См. agents/CONTEXT-MAP.md
Yandex Disk: yandex:/Проект. Как заработать много денег.../ (аватары)
Yandex Disk: yandex:/Content_Factory/ (выходы)
