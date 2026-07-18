# Найдено на GitHub для автономного завода контента (Smart Agent AI / Дмитрий Чекмарев)

> Статус: реально скачано и изучено 07.2026. Все пути — реальные, клонирование прошло успешно.
> Контекст системы: Hermes Agent (нативный Kanban, мульти-агент) + контент-фабрика на HyperFrames + Yandex Disk (`rclone yandex:`).

---

## 1. Реально скачанные репозитории (локальные пути)

Все клонированы в `/root/agents/` (shallow clone, `--depth 1`):

| № | Репозиторий | Локальный путь | Назначение | Лицензия |
|---|-------------|----------------|------------|----------|
| 1 | `saltbo/agent-kanban` (это и есть "agent-kanban.dev") | `/root/agents/agent-kanban` | Лидер-воркер оркестрация + крипто-идентичность агентов | FSL-1.1-ALv2 |
| 2 | `gsavla6-hue/ai-content-creation-agent` | `/root/agents/ai-content-creation-agent` | Автономный пайплайн research→write→SEO→publish (Python/OpenAI) | MIT |
| 3 | `gsavla6-hue/n8n-ai-content-pipeline` | `/root/agents/n8n-ai-content-pipeline` | Тот же пайплайн, но как n8n workflow.json | MIT |
| 4 | `maniginam/hermes-content-pipeline` | `/root/agents/hermes-content-pipeline` | Пайплайн КОНТЕНТА НА САМОМ HERMES (research→outline→write) | MIT |
| 5 | `Adam-Dangerfield/Agent-Kanban` | `/root/agents/Agent-Kanban` | Self-hosted kanban/тикет-система для агентов (REST API + Postgres) | AGPLv3 |
| 6 | `Raman369AI/agent-kanban-pm` | `/root/agents/agent-kanban-pm` | Local-first kanban PM для humans + headless CLI агентов (Python) | MIT |
| 7 | `andyrewlee/awesome-agent-orchestrators` | `/root/agents/awesome-agent-orchestrators` | Курируемый список оркестраторов (источник для поиска) | — |

**Важное уточнение про "agent-kanban.dev":** в задании указан `andyrewlee/awesome-agent-orchestrators`, который *упоминает* agent-kanban. Сам домен `agent-kanban.dev` принадлежит репозиторию **`saltbo/agent-kanban`** — это и есть тот самый проект (лидер-воркер модель, крипто-идентичность Ed25519, поддержка Hermes как runtime). Клонирован как п.1.

### Уже присутствующие локально (до этой задачи, в `/root/agents/`):
- `/root/agents/hermes-researcher-agent` — исследовательский агент на Hermes
- `/root/agents/hermes-system-doctor` — системный доктор на Hermes

---

## 2. Что у нас УЖЕ ЕСТЬ своё (не нужно брать из GitHub)

- **Нативный Hermes Kanban (мульти-агент)** — `/root/.hermes/skills/hermes-kanban/`
  - `SKILL.md` — роли Orchestrator / Worker, lifecycle (orient→work→heartbeat→block/complete), routing-правила, anti-patterns.
  - `references/orchestrator-playbook.md` — полный playbook декомпозиции (fan-out/fan-in, pipeline с гейтами, goal-mode карточки, recovery stuck workers).
  - `references/worker-playbook.md` — workspace handling, handoff-формы, retry-диагностика, heartbeats.
  - БД: `/root/.hermes/kanban.db` (таблицы: `tasks`, `task_events`, `task_comments`, `task_runs`, `task_links`, `task_attachments`, `kanban_notify_subs`).
  - **Вывод:** лидер-воркер оркестрация и крипто-идентичность нам НЕ нужно брать из `saltbo/agent-kanban` — у нас есть свой нативный, более глубокий механизм. `agent-kanban` годится только как *референс архитектуры* (Ed25519 identity паттерн — см. раздел 3).

- **Yandex Disk через rclone** — уже настроен и проверен:
  - `yandex:Smart_Agent_AI`, `yandex:Content_Factory`, `yandex:Investor_Deck`, `yandex:YouTube_Money_System`.
  - Любой пайплайн может сохранять готовый контент напрямую: `rclone copy article.md yandex:Content_Factory/`.

- **Контент-фабрика HyperFrames** — собственная система (вне скачанного).

---

## 3. Что КОНКРЕТНО можно взять готового (файлы/паттерны)

### 3.1. `maniginam/hermes-content-pipeline` — САМЫЙ РЕЛЕВАНТНЫЙ (прямо про Hermes)
Готовый 3-этапный пайплайн контента на базе Hermes Agent. Паттерн можно взять почти дословно.

- **`hermes-content-pipeline.py`** — основной скрипт. Ключевые паттерны:
  - `hermes_run(prompt, model)` — вызов Hermes одним выстрелом через `subprocess` (`~/.local/bin/hermes -z <prompt>`, опц. `-m <model>`). Это то, как запускать этапы пайплайна из Python.
  - `research_topics(niche, count)` — этап 1: промпт-инжиниринг для web-search research, возвращает JSON-массив тем с `keywords`, `angle`, `search_volume_hint`, `competition_hint`.
  - `generate_outline(topic)` — этап 2: промпт для SEO-оптимизированного outline (slug, meta_description, sections, total_word_target, cta).
  - `write_article(outline, niche)` — этап 3: промпт для финальной статьи в markdown с frontmatter.
  - `parse_json_array/parse_json_object` — **робастный парсинг JSON из вывода LLM** (обрезка ```json fences, поиск `[`/`]` и `{`/`}`). Очень полезно для нашего пайплайна.
  - `run_pipeline(niche, site, count)` — оркестратор: сортировка тем по `search_volume_hint` (high/medium/low), выбор топ-N, генерация, сохранение, summary JSON.
  - **Мульти-модельная стратегия:** разные модели на разные этапы (дешёвая локальная `hermes3:8b` для research/outline, frontier `claude-opus` для writing).
- **`hermes-worker.bb`** — интеграция с Colony daemon (Clojure) через Unix socket IPC: heartbeat каждые 30s, запуск этапов пайплайна как subprocess, отчёт о результатах. Паттерн для нашей автономной оркестрации (заменяем Colony на нативный Hermes Kanban).
- **`output/example-article.md`, `output/example-run.json`** — примеры реального выхлопа (формат frontmatter, структура).

> **Рекомендация:** взять `hermes-content-pipeline.py` как каркас, добавить 4-й этап "publish to Yandex Disk" (`rclone copy`) и обернуть каждый этап в `kanban_create` карточки нативного Hermes Kanban.

### 3.2. `gsavla6-hue/ai-content-creation-agent` — Python-агент (OpenAI)
Автономный агент с tool-use. Паттерны:
- **`main.py`** → класс `AiContentCreationAgent`:
  - `SYSTEM_PROMPT` + `TOOLS` (function-calling: `execute_code`, `web_search`, `save_file`) — готовая схема tool-use для контента.
  - `_call_llm()` с обработкой `tool_calls` и рекурсивным follow-up — паттерн ReAct-цикла.
  - `_search()` поддерживает **Tavily API** (`TAVILY_API_KEY`) — готовый реальный web-search вместо мока.
  - REST API (FastAPI): `/run`, `/chat`, `/stats`, `/health` — можно поднять как микросервис генерации.
  - Мульти-тур память (`self.history`), статистика.
- **`utils/helpers.py`** — утилиты. **`requirements.txt`** — зависимости (openai, fastapi, uvicorn, tavily-python, python-dotenv).
- **Примечание:** заточен под OpenAI `gpt-4o`. Для нашей системы нужно заменить клиент на Hermes/наш провайдер, либо использовать как вдохновение для schema tool-use.

### 3.3. `gsavla6-hue/n8n-ai-content-pipeline` — n8n workflow
- **`workflow.json`** — импортируемый в n8n workflow: Webhook trigger → OpenAI node → Set/Transform → response. Если у нас есть/будет n8n, это готовый каркас пайплайна (ideation→SEO→publish). Без n8n — только как референс структуры узлов.
- **`setup.sh`, `docker-compose.yml`** — поднятие стека.

### 3.4. `saltbo/agent-kanban` — РЕФЕРЕНС архитектуры (не для прямого использования)
У нас есть свой нативный Kanban, но отсюда можно взять **паттерны**, которых у нас нет:
- **`packages/cli/src/agent/identity.ts`** — паттерн **крипто-идентичности агента**: `loadIdentity/saveIdentity` на базе SHA-256 scope (apiUrl+deviceId+runtime), fingerprint. У нашего Hermes Kanban идентичность строится иначе, но паттерн "каждый агент = crypto fingerprint, следующий за ним через tasks/commits/PRs" — полезен для аудита.
- **`packages/cli/src/agent/leader.ts`** — паттерн **лидер-сессии**: генерация Ed25519 keypair на spawn (`crypto.subtle.generateKey({name:"Ed25519"})`), привязка сессии к PID рантайма (`findRuntimeAncestorPid`), heartbeat, reuse identity. Точная модель "leader создаёт задачи → worker claim → PR → leader review/merge → auto-complete".
- **`apps/web/server/` + `packages/shared/src/taskStateMachine.ts`** — state machine задач (Todo→In Progress→In Review→Done), dependency CTE (`taskDeps.ts`), stale detection. Референс для нашего состояния карточек.
- **`skills/ak-plan/`, `skills/ak-task/`** — промпт-скиллы декомпозиции и постановки задач (аналог нашего orchestrator-playbook, но под `ak` CLI).
- **`apps/web/migrations/0001_initial.sql` … `0037_*`** — эволюция схемы kanban-доски (agent identity, GPG keys, subagents, board labels). Полезно как чек-лист полей, если будем расширять свою `kanban.db`.

### 3.5. `Adam-Dangerfield/Agent-Kanban` — self-hosted kanban (AGPLv3, осторожно)
Готовый REST API kanban для агентов (Node/Express + Postgres). Полезно как **альтернатива/бэкенд**, если нативный Hermes Kanban не покроет нужды:
- **`server/src/index.js`** — все роуты. **`server/db/schema.sql`** — схема.
- **`skills/kanban/SKILL.md` + `scripts/kanban.mjs`** — переносимый CLI-скилл для агентов (``me``, ``tasks``, ``claim``, ``comment``, ``status``). Можно адаптировать под наших агентов как обёртку над нашим Kanban.
- **Внимание:** лицензия **AGPLv3** — если модифицируем и выкладываем в сеть, обязаны открыть исходники. Для внутреннего использования ок.

### 3.6. `Raman369AI/agent-kanban-pm` — local-first kanban PM (Python)
- **`kanban_runtime/`** — per-task agent sessions, worktree isolation, **stage handoff** через `STATUS.md` (`handoff_ready: true`, `state: done/review`), role supervisor (`orchestrator`/`worker`/`test`/`diff_review`/`git_pr`).
- **`kanban_runtime/data/agents/*.yaml`** — адаптеры CLI-агентов (claude, gemini, codex, aider…) с auto-approval режимами. **`mcp_server.py`** — MCP surface для агентов.
- Паттерн **stage handoff через файл STATUS.md** — можно позаимствовать для наших воркер-карточек (вместо/вдобавок к `kanban_complete`).

### 3.7. `andyrewlee/awesome-agent-orchestrators` — источник для дальнейшего поиска
Список включает ещё ~20 оркестраторов (multica, vibe-kanban, tutti, jean, bernstein и т.д.). Если нужно расширить — см. `README.md` этого репо.

---

## 4. Адаптация под нашу систему (конкретный план)

1. **Ядро пайплайна контента** → берём `hermes-content-pipeline.py` (`maniginam`). Это уже Hermes-native. Добавляем:
   - Этап 4: `rclone copy <article.md> yandex:Content_Factory/<date>-<slug>.md` (публикация на Yandex Disk).
   - Оборачиваем этапы в нативный Hermes Kanban: `kanban_create` на research / outline / write / publish, с `parents=[...]` зависимостями (паттерн из `orchestrator-playbook.md`).
2. **Оркестрация (лидер-воркер)** → у нас УЖЕ есть (`hermes-kanban` skill). НЕ копируем `saltbo/agent-kanban` целиком. Берём оттуда только идеи: Ed25519 identity для аудита, task state machine, dependency-граф.
3. **Web-search в research** → из `ai-content-creation-agent`: подключение **Tavily** (`_search` + `TAVILY_API_KEY`) вместо мока, либо нативный web-инструмент Hermes.
4. **Генерация как сервис (опц.)** → `ai-content-creation-agent/main.py` FastAPI (`/run`, `/stats`) — если нужен отдельный микросервис генерации вне Hermes.
5. **Наблюдаемость** → из `Agent-Kanban` CLI-скилл `kanban.mjs` — адаптируем как лёгкую обёртку для наших агентов поверх нативного Kanban.

---

## 5. Честные замечания

- Все 7 репозиториев **реально клонировались** (exit code 0), структура изучена по реальным файлам.
- "agent-kanban.dev" из задания — это `saltbo/agent-kanban` (подтверждено README: "Sign up at agent-kanban.dev"). Не путать с `Adam-Dangerfield/Agent-Kanban` (другой проект, AGPLv3).
- `n8n-ai-content-pipeline` полезен только при наличии n8n; сам по себе `workflow.json` — это 3 узла-заглушки (не полный пайплайн). Реальное мясо — в `hermes-content-pipeline.py` и `ai-content-creation-agent/main.py`.
- `agent-kanban-pm` находится в статусе alpha (0.3.0a1) — брать паттерны, не продакшн-код.
- Лицензии: берём MIT-репо свободно; `saltbo/agent-kanban` (FSL) — для внутреннего use ok, но не коммерческая перелицензия; `Agent-Kanban` (AGPLv3) — только для внутреннего use без сетевого раскрытия модификаций.

---

## 6. Быстрый старт адаптации (пример)

```bash
# 1. Взять каркас пайплайна на Hermes
cp /root/agents/hermes-content-pipeline/hermes-content-pipeline.py \
   ~/projects/autonomous-content-factory/pipeline.py

# 2. Добавить публикацию на Yandex Disk (в конец run_pipeline)
rclone copy "$path" yandex:Content_Factory/

# 3. Обернуть этапы в нативный Hermes Kanban (orchestrator profile)
hermes -p orchestrator "Создай kanban-карточки: research -> outline -> write -> publish \
  для ниши 'ai-tools', свяжи parents, запусти воркеров"
```

См. также: `/root/.hermes/skills/hermes-kanban/references/orchestrator-playbook.md` (наш собственный playbook).
