---
type: audit-map
project: Smart Agent AI
owner: Дмитрий Чекмарёв
created: 2026-06-13T17:19:19+00:00
status: read-only audit
scope: Hermes profiles, skills, kanban, cron, Obsidian project map
---

# Структура Hermes: профили, skills, роли и проектные команды

## 0. Короткий вывод

Сейчас в интерфейсе есть **много возможностей**, но они смешаны в одну картину:

- **Hermes profiles** — это реальные профили/агенты, которые можно видеть в `hermes profile list`.
- **Skills** — это инструменты/навыки, а не агенты. Skill сам по себе ничего не делает, пока профиль/агент не использует его в задаче.
- **Cron jobs** — это расписания и автоскрипты. Многие выглядят как «агенты», но технически это не отдельные Hermes-профили.
- **Kanban tasks** — это задачи, назначенные на profiles. Kanban показывает, кому поручено, но не значит, что профиль сейчас живой или успешно выполняет работу.
- **Obsidian agent cards** — это описания ролей/агентов в проектах. Они полезны как оргструктура, но не всегда являются настоящими Hermes-профилями.

Главный факт: **реально существующих Hermes-профилей — 18, активен сейчас только `default`, остальные остановлены**. Skills установлено много: **177 enabled**. Большая часть проектных «агентов» сейчас существует как cron/скрипт/роль/описание, а не как отдельный профиль.

---

## 1. Что Дмитрий видит в интерфейсе

### 1.1 Profiles ≠ активные агенты

`hermes profile list` показывает профили, которые есть в системе. Это ближайший аналог «агентов» в интерфейсе Hermes.

Но статус важен:

- `running` — профиль сейчас поднят.
- `stopped` — профиль существует, но прямо сейчас не работает как живой агент.

На момент аудита:

- `default` — running.
- Все остальные профили — stopped.

### 1.2 Skills ≠ agents

`hermes skills list` показывает установленные навыки. Например `vk-management`, `youtube-content`, `google-workspace`, `github-pr-workflow`, `obsidian-vault` — это **наборы возможностей**, а не отдельные сотрудники.

Правильная логика:

```text
agent/profile → использует нужные skills → делает задачу → пишет результат в Obsidian/Kanban
```

Неправильная логика:

```text
skill установлен → значит агент уже работает
```

### 1.3 Cron ≠ agents

`hermes cron list --all` показывает расписания: отчёты, публикации, watchdog-и, автопостинг, проверки, синки. Некоторые cron-задачи называются «агент», но технически часто это:

- `Mode: no-agent` — скрипт без отдельного LLM-агента;
- `Deliver: local/origin` — куда доставить результат;
- иногда указан `Profile`, например `gemini-research`, `default`, `numerologic-ceo`.

То есть cron — это **автоматика**, но не всегда агент.

### 1.4 Kanban tasks запускают/используют profiles

Kanban показывает задачи по assignee:

- `controller-ops`
- `controller-quality`
- `controller-finance`
- `worker-content`
- `worker-execution`
- `worker-research`
- `client-solutions-agent`
- `orchestrator`

Фактическая картина Kanban на момент аудита:

- todo: 7
- blocked: 5
- done: 5
- running: 0
- ready: 0

Главные блокеры висят на продажах, клиентах, SEO/site audit, операционке и контроле контента. Значит роли назначены, но полноценная рабочая команда ещё не собрана.

---

## 2. Фактически существующие агенты/профили

Источник: `hermes profile list`.

### 2.1 Активный профиль

- `default` — основной текущий ассистент/gateway. Статус: **running**. Через него идут ручные действия, системные проверки, часть cron/watchdog-контуров.

### 2.2 Управление и контроль

- `orchestrator` — центральный координатор/COO-роль. Статус: stopped. В Kanban уже использовался для карты задач.
- `controller-ops` — контроль сроков, SLA, операционных задач. Статус: stopped. В Kanban есть done/todo.
- `controller-quality` — контроль качества результатов, site/content gates. Статус: stopped. Есть todo/blocked/done.
- `controller-finance` — бюджет, рентабельность, финконтроль. Статус: stopped. Есть закрытая задача по бюджету/рентабельности.
- `system-doctor` — системная диагностика. Статус: stopped. Параллельно есть cron-watchdog-и, но это не полноценный постоянно живой профиль.

### 2.3 Исполнители

- `worker-content` — контент, E-E-A-T, перелинковка, соцсети. Статус: stopped. В Kanban есть done/todo.
- `worker-execution` — исполнение, технические задачи, сайт, процессы. Статус: stopped. На нём висят важные blocked-задачи.
- `worker-research` — исследования, SEO/speed audit, аналитика. Статус: stopped. Есть blocked-задача по Smart Agent AI site audit.
- `client-solutions-agent` — клиентские решения, онбординг, удержание, апсейл. Статус: stopped. Клиентская задача blocked.
- `builder` — универсальный builder/разработчик. Статус: stopped.
- `smart-agent-studio` — профиль под продуктовую/агентную студию. Статус: stopped.

### 2.4 Исследовательские профили

- `analyst` — аналитик. Статус: stopped.
- `research` — исследовательский профиль. Статус: stopped.
- `researcher` — researcher-agent distribution. Статус: stopped.
- `gemini-research` — исследовательский профиль на Gemini. Статус: stopped, но есть активный cron `ru-gemini-research-creative-pack`, который доставляет работу через этот профиль.

### 2.5 Смежные/проектные профили

- `numerologic-ceo` — отдельный проект Numerologic. Статус: stopped. Есть cron-задачи Numerologic, часть script-only, одна paused с этим profile.
- `yandex-economy` — профиль под Yandex/GPT-контур. Статус: stopped.

### 2.6 Вывод по профилям

Профили есть, но как команда они пока не выглядят собранными:

- активен только `default`;
- project/cron roles часто называются агентами, но не являются profile;
- ключевые бизнес-задачи в Kanban частично blocked;
- не хватает отдельного revenue/sales-owner профиля, хотя денег/продажам сейчас нужен главный фокус.

---

## 3. Фактически существующие skills

Источник: `hermes skills list`. Всего: **177 enabled, 0 disabled**. По источникам: **83 hub-installed, 60 builtin, 34 local**.

Ниже не «новые skills», а распределение уже установленных по крупным блокам.

### 3.1 Hermes / оркестрация / agent management

- `hermes-agent`
- `codex`
- `claude-code`
- `opencode`
- `blackbox`
- `honcho`
- `dogfood`
- `yuanbao`
- `hermes-operator-support`
- `hermes-profile-distribution-installs`
- `kanban-codex-lane`
- `one-three-one-rule`
- `telegram-project-channel-operations`
- `agentic-business-analysis`
- `plan`
- `writing-plans`
- `create-plan`
- `subagent-driven-development`
- `hermes-agent-skill-authoring`

### 3.2 GitHub / code / web development

- `github-auth`
- `github-code-review`
- `github-issues`
- `github-pr-workflow`
- `github-repo-management`
- `gh-fix-ci`
- `changelog-generator`
- `requesting-code-review`
- `simplify-code`
- `systematic-debugging`
- `test-driven-development`
- `python-debugpy`
- `node-inspect-debugger`
- `rest-graphql-debug`
- `webapp-testing`
- `mcp-builder`
- `fastmcp`
- `mcporter`
- `native-mcp`
- `commercial-pwa-mvp`
- `frontend-design`
- `page-agent`
- `web-studio-orchestrator`
- `debugging-hermes-tui-commands`
- `hermes-s6-container-supervision`

### 3.3 Business / sales / клиентские процессы

- `business-automation-playbook`
- `client-commercial-growth-ops`
- `quick-sell-automation`
- `agentic-business-analysis`
- `support-ticket-triage`
- `email-draft-polish`
- `internal-comms`
- `telephony`
- `airtable`
- `linear`
- `shopify`
- `shop-app`
- `google-workspace`
- `ocr-and-documents`
- `powerpoint`

### 3.4 Content / social / publishing

- `vk-management`
- `xurl`
- `autoposting-pipelines`
- `autonomous-content-pipeline-operations`
- `content-research-writer`
- `telegram-project-channel-operations`
- `humanizer`
- `pretext`
- `meme-generation`
- `gpt-image-2-agent-kit`
- `baoyu-article-illustrator`
- `baoyu-infographic`
- `design-md`
- `popular-web-designs`

### 3.5 YouTube / media / video / audio

- `youtube-content`
- `spotify`
- `whisper`
- `audiocraft-audio-generation`
- `manim-video`
- `ascii-video`
- `songwriting-and-ai-music`
- `hyperframes`
- `comfyui`
- `gpt-image-2-agent-kit`
- `blender-mcp`
- `p5js`

### 3.6 Google / productivity / documents / storage

- `google-workspace`
- `yandex-disk-agent`
- `cloud-storage-rclone`
- `airtable`
- `notion`
- `linear`
- `canvas`
- `maps`
- `memento-flashcards`
- `ocr-and-documents`
- `powerpoint`
- `teams-meeting-pipeline`
- `here.now`
- `siyuan`
- `telephony`

### 3.7 Obsidian / knowledge / память

- `obsidian`
- `obsidian-vault`
- `obsidian-daily-digest`
- `llm-wiki`
- `memento-flashcards`
- `qmd`
- `research-paper-writing`

### 3.8 DevOps / SRE / infrastructure

- `docker-management`
- `watchers`
- `pinggy-tunnel`
- `deployment-and-host-recovery`
- `cloud-credential-intake-and-validation`
- `hermes-cron-reliability-operations`
- `inference-sh-cli`
- `webhook-subscriptions`
- `autonomous-content-pipeline-operations`
- `autoposting-pipelines`
- `hermes-s6-container-supervision`
- `fastmcp`
- `native-mcp`
- `mcporter`

### 3.9 Finance / инвестиции / модели

- `3-statement-model`
- `comps-analysis`
- `dcf-model`
- `excel-author`
- `lbo-model`
- `merger-model`
- `pptx-author`
- `stocks`
- `hyperliquid`
- `polymarket`
- `evm`
- `solana`

### 3.10 Research / intelligence / web search

- `arxiv`
- `duckduckgo-search`
- `searxng-search`
- `scrapling`
- `domain-intel`
- `osint-investigation`
- `gitnexus-explorer`
- `llm-wiki`
- `parallel-cli`
- `research-paper-writing`
- `qmd`
- `polymarket`
- `bioinformatics`
- `drug-discovery`
- `darwinian-evolver`
- `jupyter-live-kernel`

### 3.11 Design / creative

- `architecture-diagram`
- `ascii-art`
- `ascii-video`
- `baoyu-article-illustrator`
- `baoyu-comic`
- `baoyu-infographic`
- `blender-mcp`
- `claude-design`
- `comfyui`
- `concept-diagrams`
- `creative-ideation` / `ideation`
- `design-md`
- `excalidraw`
- `gpt-image-2-agent-kit`
- `humanizer`
- `hyperframes`
- `manim-video`
- `meme-generation`
- `p5js`
- `pixel-art`
- `popular-web-designs`
- `pretext`
- `songwriting-and-ai-music`

### 3.12 Прочие установленные блоки, не главные для текущей оргкарты

- Email: `agentmail`, `himalaya`.
- Security: `1password`, `oss-forensics`, `sherlock`.
- ML/MLOps: `axolotl`, `chroma`, `clip`, `dspy`, `faiss`, `guidance`, `huggingface-hub`, `instructor`, `llama-cpp`, `llava`, `nemo-curator`, `obliteratus`, `outlines`, `peft-fine-tuning`, `pinecone`, `pytorch-fsdp`, `pytorch-lightning`, `segment-anything-model`, `serving-llms-vllm`, `simpo-training`, `slime-rl-training`, `tensorrt-llm`, `unsloth`, `weights-and-biases`.
- Gaming/health/smart-home/migration: `minecraft-modpack-server`, `pokemon-player`, `fitness-nutrition`, `neuroskill-bci`, `openhue`, `openclaw-migration`.

---

## 4. Распределение skills по агентам/ролям

Важно: это **распределение уже существующих skills**, без создания новых skills и без запуска новых агентов.

### 4.1 `default` — ручной главный ассистент / emergency operator

Назначение:

- принимать запросы Дмитрия;
- делать read-only аудит;
- писать документы в Obsidian;
- проверять состояние системы;
- не подменять собой всю команду.

Нужные skills:

- `hermes-agent`
- `obsidian-vault`, `obsidian`
- `google-workspace`
- `yandex-disk-agent`
- `hermes-cron-reliability-operations`
- `watchers`
- `plan`, `writing-plans`

### 4.2 `orchestrator` — COO / диспетчер задач

Назначение:

- принимать цель;
- разложить на задачи;
- назначить profiles;
- требовать артефакт и приёмку;
- давать Дмитрию короткий статус.

Нужные skills:

- `hermes-agent`
- `kanban-codex-lane`
- `honcho`
- `one-three-one-rule`
- `telegram-project-channel-operations`
- `obsidian-vault`
- `plan`, `writing-plans`, `create-plan`
- `agentic-business-analysis`

### 4.3 `controller-ops` — операционный контролёр

Назначение:

- SLA, дедлайны, handoff, unblock;
- контроль, что задачи не висят в blocked;
- ежедневный operating review.

Нужные skills:

- `kanban-codex-lane`
- `hermes-cron-reliability-operations`
- `watchers`
- `linear`
- `google-workspace`
- `obsidian-vault`
- `one-three-one-rule`

### 4.4 `controller-quality` — quality gate

Назначение:

- проверка сайта, контента, кода, коммерческих материалов;
- GO/NO-GO перед публикацией/отправкой клиенту;
- контроль protocol violations в Kanban.

Нужные skills:

- `requesting-code-review`
- `test-driven-development`
- `webapp-testing`
- `adversarial-ux-test`
- `systematic-debugging`
- `obsidian-vault`
- `vk-management`
- `youtube-content`
- `humanizer`
- `pretext`

### 4.5 `controller-finance` — финансы и cash control

Назначение:

- контроль runway, маржинальности, оплат, бюджета;
- финансовая приёмка коммерческих решений.

Нужные skills:

- `excel-author`
- `3-statement-model`
- `dcf-model`
- `comps-analysis`
- `stocks`
- `pptx-author`
- `google-workspace`
- `obsidian-vault`

### 4.6 `system-doctor` — системный доктор / SRE reviewer

Назначение:

- диагностика Hermes/gateway/cron/scripts;
- обнаружение красных статусов;
- не бизнес-управление, а техническая устойчивость.

Нужные skills:

- `hermes-cron-reliability-operations`
- `watchers`
- `docker-management`
- `deployment-and-host-recovery`
- `cloud-credential-intake-and-validation`
- `pinggy-tunnel`
- `webhook-subscriptions`
- `hermes-s6-container-supervision`
- `debugging-hermes-tui-commands`

### 4.7 `worker-research` / `research` / `researcher` / `analyst` / `gemini-research`

Назначение:

- research, конкурентный анализ, SEO/speed audit, ниши, доноры YouTube, рынок.

Нужные skills:

- `duckduckgo-search`
- `searxng-search`
- `scrapling`
- `domain-intel`
- `osint-investigation`
- `gitnexus-explorer`
- `arxiv`
- `llm-wiki`
- `parallel-cli`
- `research-paper-writing`
- `qmd`
- `content-research-writer`

### 4.8 `worker-content` — контент / VK / site content

Назначение:

- контент-план;
- посты VK/Telegram;
- SEO/E-E-A-T материалы;
- упаковка офферов в посты.

Нужные skills:

- `vk-management`
- `autoposting-pipelines`
- `autonomous-content-pipeline-operations`
- `youtube-content`
- `content-research-writer`
- `humanizer`
- `pretext`
- `gpt-image-2-agent-kit`
- `baoyu-article-illustrator`
- `baoyu-infographic`
- `design-md`
- `obsidian-vault`

### 4.9 `worker-execution` — исполнитель / implementation

Назначение:

- технические правки;
- сайты/интеграции/автоматизации;
- implementation под клиента;
- доведение задач до результата.

Нужные skills:

- `github-auth`
- `github-pr-workflow`
- `github-code-review`
- `commercial-pwa-mvp`
- `web-studio-orchestrator`
- `frontend-design`
- `page-agent`
- `deployment-and-host-recovery`
- `docker-management`
- `systematic-debugging`
- `test-driven-development`
- `obsidian-vault`

### 4.10 `builder` / `smart-agent-studio` — продуктовая сборка

Назначение:

- сборка MVP, демо, PWA, agent studio workflows;
- быстрые прототипы для продаж и delivery.

Нужные skills:

- `codex`
- `claude-code`
- `opencode`
- `github-repo-management`
- `github-pr-workflow`
- `commercial-pwa-mvp`
- `web-studio-orchestrator`
- `mcp-builder`
- `fastmcp`
- `native-mcp`
- `frontend-design`
- `architecture-diagram`
- `obsidian-vault`

### 4.11 `client-solutions-agent` — клиентский account / решения

Назначение:

- онбординг;
- discovery;
- постановка решения;
- удержание и апсейл;
- превращение оплаты в результат.

Нужные skills:

- `business-automation-playbook`
- `client-commercial-growth-ops`
- `quick-sell-automation`
- `google-workspace`
- `airtable`
- `linear`
- `telephony`
- `email-draft-polish`
- `support-ticket-triage`
- `obsidian-vault`

### 4.12 `numerologic-ceo`

Назначение:

- отдельный проект Numerologic: прогнозы, клиентские посты, управленческие решения.

Нужные skills:

- `business-automation-playbook`
- `client-commercial-growth-ops`
- `vk-management`
- `autoposting-pipelines`
- `google-workspace`
- `obsidian-vault`
- finance skills по необходимости.

### 4.13 `yandex-economy`

Назначение:

- Yandex/GPT/economy-контур, потенциально аналитика и storage-related workflows.

Нужные skills:

- `yandex-disk-agent`
- `cloud-storage-rclone`
- `google-workspace`
- `obsidian-vault`
- `duckduckgo-search`
- `searxng-search`
- finance/research skills по задаче.

---

## 5. Проектные команды

### 5.1 Smart Agent AI

Фактически есть:

- Hermes profiles: `orchestrator`, `controller-ops`, `controller-quality`, `controller-finance`, `worker-content`, `worker-execution`, `worker-research`, `client-solutions-agent`, `builder`, `smart-agent-studio`.
- Obsidian project: `/root/obsidian-vault/projects/02-Smart Agent AI/`.
- Отдельная карта: `/root/obsidian-vault/projects/smart-agent-ai/company-agent-operating-map.md`.
- Site agent card: `SEO-Site-Publisher-Agent` — описан в Obsidian, но не является отдельным Hermes-профилем.
- Cron-контуры: site SEO draft/publish/watchdog, money hunter, offer factory, master brain, implementation control и др.

Как собрать команду без создания новых skills:

- COO: `orchestrator`
- Research/SEO: `worker-research` + research skills
- Site implementation: `worker-execution` + GitHub/web/devops skills
- Content/VK/site trust: `worker-content` + content/social/creative skills
- Quality: `controller-quality`
- Finance: `controller-finance`
- Client/account: `client-solutions-agent`
- Product demo/MVP: `builder` или `smart-agent-studio`

Чего фактически нет как профиля:

- revenue-controller;
- lead-research-agent;
- outreach-sales-agent;
- closer/proposal-agent;
- delivery-manager-agent;
- legal/admin-agent;
- CRM/knowledge-steward.

### 5.2 VK Department

Фактически есть:

- Obsidian project: `/root/obsidian-vault/projects/vk-department/`.
- Два направления: Smart Agent AI и Дикая Клешня.
- Активные cron-задачи VK morning/evening posts.
- Skills: `vk-management`, `autoposting-pipelines`, `obsidian-vault`, creative/content skills.

Как распределить:

- `worker-content` — текст, упаковка, CTA.
- `controller-quality` — проверка правил качества перед публикацией.
- `worker-research` — темы/тренды/конкуренты.
- `client-solutions-agent` — должен принимать тёплых лидов из комментариев/сообщений, но отдельного inbox-agent нет.

Чего фактически нет как профиля:

- VK publisher-agent как Hermes profile;
- community-inbox-agent;
- social analytics agent;
- lead handoff/CRM agent.

### 5.3 YouTube Video Factory

Фактически есть:

- Obsidian project: `/root/obsidian-vault/projects/youtube-money-system/agent-video-factory/`.
- Документированы 10 ролей: Donor Scout, Strategist, Script Writer, Visual Designer, Voice Artist, Video Editor, Packaging Designer, Publisher, Analytics Eye, Controller.
- Pipeline и storage-policy.
- Тяжёлые материалы должны лежать на Yandex Disk: `yandex:YouTube_Money_System/Agent_Video_Factory/`.
- В README проекта статус: архитектура спроектирована, 0 видео опубликовано, каналы/инструменты требуют настройки/сверки.

Как распределить на текущие профили без создания новых:

- Donor Scout / Analytics Eye → `worker-research` или `gemini-research`.
- Strategist → `orchestrator` + `worker-research`.
- Script Writer / Packaging → `worker-content`.
- Visual / thumbnail → `worker-content` + creative skills.
- Video assembly → `worker-execution` / `builder`.
- Publisher → cron/script + `youtube-content`, `google-workspace`, `yandex-disk-agent`.
- Controller → `controller-quality`.

Чего фактически нет как профиля:

- отдельные 10 Video Factory profiles;
- YouTube producer profile;
- voice/video editor profile;
- YouTube analytics profile.

### 5.4 dikayakleshnya.ru / Дикая Клешня / site

Фактически есть:

- VK-контур Дикая Клешня в `vk-department`.
- Активные VK cron-задачи morning/evening posts.
- Есть paused cron `dikaya-kleshnya-content-quality-gate` с workdir `/root/web-projects/dikaya-kleshnya`.
- Skills подходят: `vk-management`, `autoposting-pipelines`, `web-studio-orchestrator`, `frontend-design`, `commercial-pwa-mvp`, `obsidian-vault`.

Как распределить:

- `worker-content` — посты, офферы, локальный контент.
- `worker-execution` — сайт/технические правки.
- `controller-quality` — качество публикаций и сайта.
- `worker-research` — конкуренты/локальный спрос.

Чего фактически нет как профиля:

- отдельный Dикая Клешня site-agent;
- restaurant/seafood sales-agent;
- order/inbox agent;
- delivery/admin agent.

### 5.5 Yandex Disk / storage

Фактически есть:

- Skill `yandex-disk-agent`.
- Skill `cloud-storage-rclone`.
- Активный cron `Yandex Disk daily local inventory`.
- YouTube storage policy с правилом: тяжёлые файлы не хранить в Hermes/Obsidian, складывать на Yandex Disk.

Как распределить:

- `default` — ручные проверки и разовые действия.
- `system-doctor` — watchdog/storage health.
- `worker-execution` — перенос/организация ассетов по задаче.
- `controller-ops` — следить, что артефакты лежат в правильном месте.

Чего фактически нет как профиля:

- отдельный storage-librarian agent;
- media-asset-manager agent;
- backup/retention controller.

---

## 6. Чего нет как настоящего агента

Ниже роли, которые встречаются как идея, cron, skill или карточка, но **не являются отдельными Hermes-профилями в `hermes profile list`**.

### 6.1 Бизнес и деньги

- `revenue-controller` — нужен, но профиля нет.
- `lead-research-agent` — роли/задачи есть, профиля нет.
- `outreach-sales-agent` — профиля нет.
- `closer-proposal-agent` — профиля нет.
- `sales-quality-controller` — профиля нет.
- `CRM/knowledge-steward` — профиля нет.

### 6.2 Клиенты и delivery

- `delivery-manager-agent` — профиля нет.
- `implementation-agent` — как роль частично закрывается `worker-execution`/`builder`, но отдельного профиля нет.
- `legal-admin-agent` — профиля нет.
- `client-success-controller` — профиля нет.

### 6.3 Content/social/community

- `VK publisher-agent` — есть cron/scripts, но отдельного профиля нет.
- `community-inbox-agent` — профиля нет.
- `social-analytics-agent` — профиля нет.
- `SEO-Site-Publisher-Agent` — есть Obsidian agent-card и cron-контур, но отдельного Hermes-профиля нет.

### 6.4 YouTube/video

- Donor Scout — роль есть, профиля нет.
- Strategist — роль есть, профиля нет.
- Script Writer — роль есть, профиля нет.
- Visual Designer — роль есть, профиля нет.
- Voice Artist — роль есть, профиля нет.
- Video Editor — роль есть, профиля нет.
- Packaging Designer — роль есть, профиля нет.
- Publisher — роль есть, профиля нет.
- Analytics Eye — роль есть, профиля нет.
- Controller — роль есть, профиля нет.

### 6.5 SRE/storage

- SRE Guardian — cron/script, не отдельный profile.
- Hermes model router — cron/script, не profile.
- Memory Steward — cron/script, не profile.
- System Optimizer — cron/script, не profile.
- Yandex Disk inventory — cron/script, не profile.

---

## 7. Минимальная рабочая команда: 10 агентов, которые нужно собрать первыми

Это не создание сейчас. Это карта приоритета, кого надо собрать/закрепить первыми из уже существующих profiles/ролей и skills.

### 1. COO / Orchestrator

- Кандидат: `orchestrator`.
- Задача: держать всю систему, не делать руками.
- Skills: orchestration, Kanban, Obsidian, planning.

### 2. Revenue Controller

- Фактического профиля нет.
- Можно временно закрывать через `controller-finance` + `controller-ops`, но это не идеально.
- Задача: деньги, pipeline, 48h focus, оплаты.
- Skills: business/sales, finance, Google/CRM, Obsidian.

### 3. Lead Research Agent

- Фактического профиля нет.
- Временно: `worker-research` / `gemini-research`.
- Задача: каждый день список лидов, ниш, болей, контактов.
- Skills: research, domain-intel, web search, Obsidian/Google Sheets.

### 4. Outreach / Sales Agent

- Фактического профиля нет.
- Временно: `client-solutions-agent` + `worker-content`.
- Задача: касания, follow-up, перевод в диалог.
- Skills: quick-sell, client-commercial, email/telegram/social, Google Workspace.

### 5. Offer / Demo / Proposal Agent

- Фактического профиля нет.
- Временно: `builder` / `smart-agent-studio` / `worker-execution`.
- Задача: быстрые демо, КП, прототипы, понятное предложение.
- Skills: business automation, web/code, design, docs.

### 6. Client Solutions / Account Agent

- Кандидат: `client-solutions-agent`.
- Задача: онбординг, discovery, удержание, апсейл.
- Skills: client-commercial-growth, support triage, Google, Airtable/Linear, Obsidian.

### 7. Implementation / Builder Agent

- Кандидаты: `worker-execution`, `builder`, `smart-agent-studio`.
- Задача: сделать обещанное клиенту: бот, сайт, CRM, интеграция, автоматизация.
- Skills: GitHub/code, webdev, devops, MCP, automation.

### 8. Content / VK / Site Marketing Agent

- Кандидат: `worker-content`.
- Задача: контент не ради контента, а ради лидов и доверия.
- Skills: vk-management, autoposting, creative, SEO/content, Obsidian.

### 9. Quality Gate Controller

- Кандидат: `controller-quality`.
- Задача: принимать/заворачивать перед клиентом, публикацией, релизом.
- Skills: code review, web testing, content quality, adversarial UX, Obsidian.

### 10. SRE / Knowledge / Storage Guardian

- Кандидаты: `system-doctor` + существующие cron-watchdog-и.
- Задача: чтобы Hermes, cron, Obsidian, Yandex Disk, память и публикации не ломались молча.
- Skills: devops/SRE, cron reliability, yandex disk, cloud storage, Obsidian.

### Что не включать в первые 10 как отдельные агенты

Пока не нужно первыми собирать отдельные 10 YouTube-профилей. Для старта YouTube можно временно закрыть ролями через `worker-research`, `worker-content`, `worker-execution`, `controller-quality`, пока не появятся деньги/устойчивый production loop.

---

## 8. Самая понятная карта для Дмитрия

### Что реально есть

- 18 Hermes-профилей.
- 1 активный профиль: `default`.
- 17 остановленных профилей.
- 177 enabled skills.
- Kanban с 17 задачами: 7 todo, 5 blocked, 5 done.
- Много cron-автоматик: отчёты, VK, Smart Agent site, money ideas, SRE, memory, storage, Numerologic, YouTube-related контуры.
- Obsidian-проекты: Smart Agent AI, VK Department, YouTube Money System / Agent Video Factory, Дикая Клешня/site, storage/Yandex Disk.

### Что собрано лучше всего

- Obsidian/knowledge.
- DevOps/SRE/watchdog-и.
- VK autoposting.
- Smart Agent AI site publishing контур.
- Контентная база и project docs.

### Что собрано частично

- COO/orchestration.
- Quality gates.
- Finance controller.
- Research.
- Client solutions.
- YouTube Video Factory architecture.

### Что не собрано как рабочая агентная команда

- Revenue/sales pipeline.
- Lead research → outreach → demo → invoice → payment.
- CRM/lead status owner.
- Delivery manager.
- Legal/admin documents.
- Community inbox.
- YouTube production profiles.
- Storage librarian/media asset manager.

### Главный организационный принцип

Не надо создавать новые skills. Skills уже достаточно. Сначала нужно **разложить существующие skills по владельцам KPI**:

```text
orchestrator управляет → controllers принимают → workers делают → Obsidian/Kanban фиксируют → Дмитрий получает короткий отчёт
```

И главный фокус на ближайшую сборку:

```text
лиды → касания → демо/КП → счёт → оплата → delivery → retention
```
