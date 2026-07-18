---
type: hermes-context-map
updated_at: 2026-07-18T12:30:00+00:00
status: active
owner: Dmitry Chekmarev (Smart Agent AI)
purpose: Единая карта контекста. Hermes грузит её при старте и при любом событии знает, КУДА зайти освежить память. Независимо от того, включён ли пользователь.
---

# CONTEXT-MAP — куда идти за контекстом

## Принцип автономии
Пользователь хочет, чтобы Hermes ВСЕГДА помнил картину, даже когда пользователь офлайн.
При любом событии (старт сессии, новая задача, сбой, упоминание проекта) — освежи контекст по этой карте.

## 1. Локальная память Hermes (всегда вшита в сессию)
- `/root/.hermes/` — конфиги, skills, cron, memories агента.
- MEMORY (system) — краткие факты. USER PROFILE — кто пользователь.
- Дублируется в Obsidian: `agents/hermes-memory/MEMORY.local-current.md`, `USER.local-current.md`.

## 2. Obsidian Vault (главный источник правды)
Путь: `/root/obsidian-vault`
Git: `git@github.com:dimachekmarev/-.git` (remote origin, синк работает, SSH `id_ed25519_github`).
Что смотреть:
- `agents/hermes-memory/` — моя память/профиль (свежие снапшоты в `hermes-memory-backup/`).
- `agents/Главный мозг Smart Agent AI.md` — центральная нервная система.
- `agents/Агенты.md`, `agents/Иерархия агентов и регламент исполнения.md` — кто есть кто.
- `agents/Memory-Contract-Hermes-Default.md` — контракт памяти.
- `projects/` — все проекты (см. ниже).
- `meetings/Единый дневник операций.md` — операционный дневник.
- `automation/` — автоматизации.

## 3. Проекты (Obsidian `projects/`)
- `01-Личный бренд` — личный бренд.
- `02-Smart Agent AI` / `smart-agent-ai` — агентство AI-автоматизации.
- `03-Деньги онлайн` / `money-online-ai-avatars` — ДЕНЬГИ ОНЛАЙН БЕЗ ЛИЦА (аватары, воронки, контент-система 10 агентов). Ключевой проект.
- `content-factory` — завод контента (scenarios.json, state.json, content_calendar.csv, make-workflow.md).
- `vk-department` / `pvk-vk-autoposting` — VK-автопостинг.
- `04-Telegram-система` — Telegram.
- `05-SaaS-решение` — SaaS.
- `06-UFORMA-медодежда` — медодежда (dikayakleshnya.ru, uforma-med.ru), продвижение через Pinterest.
- `youtube-money-system` — YouTube-система.
- `multi-platform-blogger-network` — сеть блогеров.

## 4. Yandex Disk (rclone: `yandex:`)
Всегда доступен. Что лежит:
- `Проект. Как заработать много денег в интернете без лица но со своим аватаром/` — ГЛАВНЫЙ проект аватаров:
  - `01_Стратегия_и_ниша/` — ниша, план.
  - `02_Аватар_и_визуал/` — JPEG reference-листы аватара (Close-up_studio_portrait, character_reference_sheet).
  - `03_Контент_план/` — спринты.
  - `05_Воронки_и_монетизация/` — воронки, офферы.
  - `06_Автоматизации/` — audit_bot.py, sales_outreach.py, voice_sales_bot.py, n8n_Dmitry_Chekmarev/.
  - `07_Материалы_и_исходники/makecom-blueprints/` — Make.com blueprints (соцсети, pintrest, бизнес-бот, RSS-TG).
  - `ai аватары/аватары.xlsx` — таблица аватаров.
- `Content_Factory/` — выходы контент-фабрики.
- `Smart_Agent_AI/`, `Investor_Deck/` — инвест-дек, материалы агентства.
- `YouTube_Money_System/`, `uforma-med/`, `u forma видео` — видео-материалы.

## 5. Google Диск (НЕ настроен — требует действия)
- rclone `gdrive:` отсутствует. Нужна ссылка доступа ИЛИ OAuth-авторизация.
- Действие при необходимости: запросить у пользователя shared-ссылку на папку ИЛИ настроить `rclone config` gdrive.
- Альтернатива: заход через browser automation по сессии пользователя (пока не реализовано — нужен remote-браузер или скриншоты).

## 6. GitHub (через Obsidian-репо)
- Основной remote: `git@github.com:dimachekmarev/-.git` (Obsidian vault).
- Hermes-агент `/root` .git НЕ имеет remote (мелкая недоконфигурация, не критично — память в Obsidian).
- Make.com / n8n blueprints лежат в Yandex Disk (см. п.4).

## 7. Другие локальные репозитории (/.git)
- `/root/crypto-scalp-bot` — бот Binance (8 суб-агентов, pyramid 20x, ждёт testnet keys).
- `/root/apex-scalper`, `/root/agents/hermes-researcher-agent`, `/root/agents/hermes-system-doctor`, `/root/tools/codex-cli-evidence-runner`, `/root/tools/gpt-image-2-agent-kit`.

## 8. Автономные действия Hermes при старте сессии
1. Прочитать эту карту (всегда в системной памяти).
2. Если задача касается проекта — зайти в соответствующую папку Obsidian + Yandex Disk.
3. Если упомянут Google Диск — проверить доступность, иначе запросить ссылку.
4. При сбоях/sync-проблемах — проверить `git remote -v` в obsidian-vault и SSH-ключ.

## 9. Контакты / каналы доставки
- Telegram: Дмитрий (DM), канал «Отчёты по проектам» (target telegram:Отчёты по проектам).
- VK app 54628476 — паблишер `vk_department_publish.py`, фото-пулы `/root/vk-photos/`.
- Yandex Disk — хранилище артефактов.
