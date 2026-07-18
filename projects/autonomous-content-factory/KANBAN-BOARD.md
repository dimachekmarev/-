---
type: kanban-board
updated: 2026-07-18T12:45:00+00:00
layer: agent-contract-kanban (поверх стока)
owner: Hermes (Dmitry Chekmarev — контроль)
rule: модельный ответ != работа; локальный файл != завершение; отчёт worker != proof
---

# Канборд автономного завода (Smart Agent AI)

Карточка = контракт. Поля: owner / worker / reviewer / delivery / bounds / dependencies / done_definition / receipt / after.

## A. Контекст и память
- id: A1 | title: Контекст-карта всегда под рукой | owner: Hermes | worker: Hermes
  bounds.read: [Obsidian /root/obsidian-vault, Yandex rclone yandex:, CONTEXT-MAP.md]
  bounds.forbidden: [приватные ключи, чужие репо без разрешения]
  done_definition: CONTEXT-MAP.md актуален и вшит в MEMORY | receipt: /root/obsidian-vault/agents/CONTEXT-MAP.md
  status: DONE

## B. Сохранение переписки
- id: B1 | title: Авто-слив переписки в Obsidian | owner: Hermes | worker: cron obsidian-daily-digest
  bounds.read: [сессии Hermes ~/.hermes, Obsidian]
  done_definition: cron стоит, ежедневно пишет дневник в Obsidian | receipt: cronjob list + файл meetings/
  status: IN_PROGRESS

## C. Контент-фабрика
- id: C1 | title: Пайплайн рендера -> Yandex | owner: Hermes | worker: content_factory_pipeline.py
  reviewer: rclone ls yandex:/Content_Factory | delivery: Yandex Disk
  done_definition: видео отрендерено и залито, state.json обновлён | receipt: rclone ls
  status: DONE (proof: 20260718_1225_001_новая-жизнь.mp4)
- id: C2 | title: Доставка видео в VK/Telegram | owner: Hermes | worker: vk_department_publish.py
  dependencies: [C1] | done_definition: видео опубликовано в VK-департамент | receipt: VK post id
  status: TODO

## D. Аватары для рекламы
- id: D1 | title: Промпт-паки + структура | owner: Hermes | worker: subagent #4
  done_definition: 3 пака по 5 вариантов, fallback-цепочка | receipt: avatars/ads/README.md
  status: DONE
- id: D2 | title: Реальная генерация аватаров | owner: Hermes | worker: image_generate / FAL
  dependencies: [D1] | bounds.forbidden: [генерация без ключа]
  done_definition: минимум 3 готовых PNG/JPG в shared/output | receipt: файлы в shared/output/
  blocker: НЕТ FAL_KEY / SORA_KEY | status: BLOCKED

## E. Интеграции
- id: E1 | title: Google Диск -> Obsidian | owner: Hermes | worker: browser-act / rclone
  blocker: нет авторизации/ссылки | status: BLOCKED
- id: E2 | title: Supabase как зеркало контекста | owner: Hermes
  blocker: нет URL+key, база мертва | status: BLOCKED (решение: поднять или вычистить из памяти)
