---
type: operating-map
project: Smart Agent AI
owner: Дмитрий Чекмарев
created: 2026-06-13T17:13:35+00:00
status: audit
scope: read-only Hermes/Obsidian/Kanban/Cron audit
---

# Карта функционала компании и аудит агентной команды

## 0. Короткий вывод

Компания уже имеет много заготовок: Hermes-профили, Kanban-роли, активные cron-контуры, Obsidian-проекты, VK-публикацию, SEO/site-публикацию, память/ops-watchdog. Но операционная система пока не собрана в управляемую агентную команду: деньги, клиенты и delivery стоят в Kanban как blocked из-за падений worker-профилей и protocol violations.

Главная проблема: есть много автономных генераторов и watchdog-ов, но нет устойчивого revenue-to-delivery контура: лиды → касания → демо → счёт → оплата → внедрение → удержание.

Главный приоритет на 48 часов: не расширять контент и не строить новые сложные контуры, а поднять агентный money-room вокруг оффера «AI-бот для приёма заявок за 48 часов» и закрыть 1–2 оплаты.

---

## 1. Источники аудита

Проверено low-risk/read-only:

- `hermes profile list`
- `hermes kanban stats`
- `hermes kanban list`
- `hermes kanban show` по blocked-задачам
- `hermes cron list --all`
- `hermes cron status`
- `hermes skills list`
- Obsidian:
  - `/root/obsidian-vault/projects/02-Smart Agent AI/README.md`
  - `/root/obsidian-vault/projects/02-Smart Agent AI/sales-war-room/2026-06-09-sales-sprint.md`
  - `/root/obsidian-vault/projects/vk-department/`
  - `/root/obsidian-vault/projects/Контент-отдел Smart Agent AI.md`
  - `/root/obsidian-vault/projects/youtube-money-system/agent-video-factory/`
  - `/root/obsidian-vault/projects/PROJECTS-PORTFOLIO.md`
  - `/root/obsidian-vault/projects/RU-Brand-Autopilot-Execution-Board.md`
  - `/root/obsidian-vault/agents/hermes-memory/` без чтения файлов с секретами

Секреты/ключи не читались и не раскрывались.

---

## 2. Существующие Hermes-профили / агенты

### 2.1 Рабочий профиль сейчас

- `default` — running. Фактически текущий основной ассистент/gateway-origin, через него идут ручные и системные действия.

### 2.2 Профили управления и контроля

- `orchestrator` — stopped. Должен быть Tier 0 / Яна / COO-оркестратор, но сейчас не является постоянно работающим операционным центром.
- `controller-finance` — stopped. Есть Kanban-роль, одна задача по бюджету/рентабельности закрыта.
- `controller-ops` — stopped. Используется в Kanban, есть done/todo задачи по SLA, синтезу и операционному контролю.
- `controller-quality` — stopped. Используется в Kanban, есть done/todo/blocked задачи, перегружен контролем разных контуров.
- `system-doctor` — stopped. Есть cron-watchdog как отдельный скриптовый контур.

### 2.3 Исполнительские профили

- `worker-content` — stopped. Используется в Kanban; контент-план закрыт, есть задача по E-E-A-T/перелинковке.
- `worker-execution` — stopped. Используется в Kanban; ключевые задачи по продажам/операционке/сайту blocked из-за падений.
- `worker-research` — stopped. Используется в Kanban; SEO/speed audit blocked из-за падений.
- `client-solutions-agent` — stopped. Клиентский контур есть как профиль, но задача онбординга/удержания blocked.
- `builder` — stopped. Универсальный builder, но в текущей бизнес-карте не привязан к конкретному money/delivery процессу.
- `analyst`, `research`, `researcher`, `gemini-research` — stopped. Исследовательские роли есть, `gemini-research` дополнительно используется cron-задачей.
- `smart-agent-studio` — stopped. Похоже на профиль продуктовой/агентной студии, но не видно как стабильный операционный исполнитель в Kanban.

### 2.4 Смежные/проектные профили

- `numerologic-ceo` — stopped. Отдельный смежный проект Numerologic.
- `yandex-economy` — stopped. Смежный профиль под Yandex/GPT-контур.

### 2.5 Вывод по профилям

Профили созданы, но большинство не запущены как устойчивая агентная команда. В Kanban они используются как assignee, но blocked-задачи показывают, что исполнители падают или завершаются без `kanban_complete`/`kanban_block`.

---

## 3. Какие бизнес-функции уже закрыты

### 3.1 Стратегия / CEO / COO

Статус: частично закрыто.

Что есть:

- `orchestrator` профиль.
- Cron-контуры: `smartagent-master-brain-daily-orchestration`, `smartagent-self-healing-orchestrator`, `daily-morning-report-and-plan`, `smartagent-evening-implementation-control`.
- Kanban-задача «Собрать карту задач на 7 дней и разложить по агентам» закрыта.

Проблема:

- Яна/Orchestrator пока не работает как полноценный COO: не видно стабильной цепочки «делегировала → агент сделал → контролёр принял → Дмитрий получил короткий отчёт».

### 3.2 Продажи / revenue

Статус: критически частично закрыто, фактическая работа заблокирована.

Что есть:

- Sales Sprint в Obsidian: оффер «AI-бот для приёма заявок за 48 часов», цены $49 / $99 / $200–300 / $500–700, план 120 касаний за 24 часа.
- Cron-контуры: `smartagent-48h-autopilot-money-hunter`, `smartagent-sales-offer-factory`, `smartagent-daily-3-money-ideas-research`, `smartagent-10000usd-september-war-room`, `smartagent-2h-money-execution-sprint`.
- Kanban-задача продаж создана.

Проблема:

- Kanban-задача `[D1-D7] Продажи: план касаний, офферов и ежедневный пайплайн` blocked из-за падений `worker-execution`.
- Нет отдельного профиля `sales-agent`, `lead-research-agent`, `closer-agent`, `revenue-controller`.
- Нет видимого единого CRM/lead-tracker статуса: лид → контакт → ответ → демо → счёт → оплата.

### 3.3 Маркетинг / контент / бренд

Статус: частично/хорошо закрыто.

Что есть:

- Документ «Контент-отдел Smart Agent AI + Личный бренд» с лейнами: intake, writing, visual, scheduler, analytics, community, knowledge.
- `worker-content` профиль.
- RU Brand Autopilot board: ежедневные RU packs, weekly revenue board, Gemini research/creative.
- Контент-план Kanban закрыт.
- VK department с правилами качества и active posting.
- Site SEO Publisher Agent в Obsidian.

Проблема:

- Контент генерируется, но не всегда связан с продажами и CRM.
- Community/комментарии/диалоги отложены, а для денег сейчас именно диалоги важнее охватов.

### 3.4 Лидогенерация

Статус: слабое/частично закрыто.

Что есть:

- Money ideas/research cron-задачи.
- Sales sprint с нишами: стоматологии, салоны, автоуслуги, ремонт, онлайн-школы, частные клиники.
- VK/контент может прогревать входящие.

Проблема:

- Нет выделенного `lead-research-agent` и `outreach-agent` как профилей.
- Нет обязательного ежедневного KPI по новым лидам, персонализированным сообщениям, ответам, демо, оплатам.

### 3.5 Клиентские решения / account / retention

Статус: профиль есть, контур заблокирован.

Что есть:

- `client-solutions-agent` профиль.
- Kanban-задача по онбордингу, удержанию, апсейлу.

Проблема:

- Задача `[D1-D7] Клиенты: онбординг, удержание, апсейл` blocked: agent crash x2.
- Нет устойчивого клиентского playbook: onboarding checklist, SLA ответов, weekly value report, upsell triggers.

### 3.6 Delivery / production / implementation

Статус: недостаточно закрыто.

Что есть:

- `worker-execution`, `builder`, `smart-agent-studio`, `client-solutions-agent`.
- Site/WordPress/SEO publishing automation.
- Навыки: web-studio, commercial-pwa, deployment, business automation.

Проблема:

- Нет отдельного `delivery-manager-agent` и `implementation-agent` с ответственностью за клиентский результат.
- `worker-execution` падает на ключевых задачах.

### 3.7 Разработка / сайт / автоматизация

Статус: частично закрыто.

Что есть:

- Smart Agent AI сайт и project README.
- `SEO-Site-Publisher-Agent` как agent-card.
- Cron: `smartagent-site-agent-1-seo-draft`, `smartagent-site-agent-2-publish`, `smartagent-site-speed-seo-red-watchdog`.
- Site checklist: SEO + speed + trust.

Проблема:

- SEO/speed audit в Kanban blocked из-за падения `worker-research`.
- Есть публикация, но нет закрытого контура «аудит → правки → QA → метрики».

### 3.8 Финансы / cash control

Статус: частично закрыто.

Что есть:

- `controller-finance` профиль.
- Kanban-задача «Настроить контроль бюджета и рентабельности» done.

Проблема:

- Нет активного ежедневного cash runway agent: остаток денег, runway, обязательства, счета, план оплат.
- Для ситуации «денег примерно на 2 недели» нужен ежедневный финансовый контроль, а не только разовая настройка.

### 3.9 Качество / QA

Статус: частично закрыто, перегружено.

Что есть:

- `controller-quality` профиль.
- Kanban-задача «Настроить контроль качества результатов» done.
- Quality gates в YouTube Agent Video Factory и VK content contract.

Проблема:

- Контрольная задача по контенту blocked из-за protocol violation/crash.
- Один общий `controller-quality` не заменяет специализированные gates: sales QA, delivery QA, content QA, site QA.

### 3.10 SRE / ops / watchdog

Статус: хорошо закрыто технически, но не связано с бизнес-результатом.

Что есть:

- Cron status: gateway running, 48 active jobs.
- Активные контуры: SRE Guardian, Hermes model router, System Doctor, System Optimizer, Memory Steward, project autonomy red-status watchdog, ops-watchdog-missing-data-alert.
- `hermes-daily-disk-autoclean`, Yandex Disk inventory.

Проблема:

- Технические watchdog-и видят инфраструктуру, но не всегда поднимают бизнес-блокеры: продажи/клиенты/операционка blocked в Kanban.

### 3.11 Knowledge / память / Obsidian

Статус: хорошо закрыто.

Что есть:

- Obsidian vault `/root/obsidian-vault`.
- Cron: memory hourly sync, memory daily hygiene, daily context booster, Supabase mirror watchdog.
- Проектные README/планы/агентные карточки.

Проблема:

- База знаний богата, но решения не всегда превращаются в assigned runnable tasks с приёмкой.

### 3.12 Legal / admin

Статус: отсутствует.

Что нужно:

- Договор/счёт/акт/оферта/NDA/политика данных для быстрых продаж.
- Контроль обещаний в коммерческих предложениях.
- Минимальный admin-agent для счетов, документов, follow-up по оплате.

### 3.13 YouTube / Agent Video Factory

Статус: спроектировано, но не запущено как рабочие профили.

Что есть:

- Проект `/root/obsidian-vault/projects/youtube-money-system/agent-video-factory/`.
- Спроектированы 10 ролей: Donor Scout, Strategist, Script Writer, Visual Designer, Voice Artist, Video Editor, Packaging Designer, Publisher, Analytics Eye, Controller.
- Pipeline с GO/NO-GO gates.
- Цель: 3 Shorts/день + 1 Long/неделю.
- Хранение тяжёлых файлов вынесено на Yandex Disk.

Проблема:

- В README проекта статус: каналы/инструменты не настроены, 0 видео опубликовано. В текущем контексте указано, что Google Workspace/YouTube подключены — значит документация и фактический доступ нужно сверить без чтения секретов.
- Эти 10 ролей пока не являются Hermes-профилями.

### 3.14 VK / social publishing

Статус: хорошо закрыто как публикационный контур.

Что есть:

- `vk-department` project.
- Два боевых сообщества: Дикая Клешня и Smart Agent AI.
- Режим: 2 поста в день на каждое направление.
- Активные cron-задачи VK: утро/вечер для smart_agent_ai и dikaya_kleshnya.
- Content contract с правилами качества и CTA.

Проблема:

- VK закрывает публикации, но не закрывает обработку входящих, квалификацию лидов и передачу в CRM.

---

## 4. Агенты/контуры, которые есть только как skills/cron/проекты, но не как рабочие профили

### 4.1 Project/Obsidian-only agents

- `SEO-Site-Publisher-Agent` — карточка агента + site-publish queue, но не отдельный Hermes-профиль.
- Content Intake Agent — описан в «Контент-отделе», но не профиль.
- Content Writer Agent — описан, но не профиль.
- Content Scheduler Agent — описан, но не профиль.
- Content Analytics Agent — описан, но не профиль.
- YouTube Agent Video Factory 10 агентов — описаны как роли, но не профили.
- VK Department Publisher — есть проект/скрипт/cron, но не профиль.

### 4.2 Cron/script-only agents

- SRE Guardian — cron/script, не отдельный постоянно управляемый профиль.
- Hermes model router — cron/script.
- Memory Steward — cron/script.
- System Optimizer / System Doctor watchdog — cron/script.
- SmartAgent money hunter / offer factory / market lab / personal brand growth / TikTok pack builder — cron jobs, но не собраны в accountable revenue team.
- Yandex Disk inventory — cron/script.

### 4.3 Skills-only capabilities

Сильные enabled skills есть: `obsidian-vault`, `autoposting-pipelines`, `vk-management`, `google-workspace`, `yandex-disk-agent`, `business-automation`, `client-commercial`, `quick-sell-automation`, `commercial-pwa-mvp`, `web-studio-orchestrator`, devops/watchdog skills.

Проблема: skills — это возможности, но не владельцы KPI. Нужны профили/агенты с ответственностью за бизнес-результат.

---

## 5. Главные отсутствующие агенты

Критически отсутствуют или не выделены:

1. `revenue-controller` — владелец денег, cash KPI, pipeline, приоритизация на 48 часов.
2. `lead-research-agent` — ежедневный список целевых бизнесов с контактами и болями.
3. `outreach-sales-agent` — персонализированные касания и follow-up.
4. `closer-proposal-agent` — КП, счёт, дожим на оплату, next step.
5. `demo-builder-agent` — быстрые демо/прототипы под нишу за часы.
6. `delivery-manager-agent` — после оплаты ведёт запуск, SLA, handoff клиенту.
7. `implementation-agent` — делает бота/интеграцию/таблицу/CRM, а не просто план.
8. `crm-knowledge-steward` — ведёт лиды, сделки, статусы, историю контактов.
9. `legal-admin-agent` — шаблоны договора/счёта/акта/NDA/оферты и безопасные обещания.
10. `community-inbox-agent` — разбирает входящие из VK/Telegram/сайта и передаёт тёплых лидов.
11. `sales-quality-controller` — проверяет сообщения/КП/этичность/конверсию.
12. `client-success-controller` — value reports, удержание, апсейл.

---

## 6. Рекомендуемая оргструктура агентов

### Tier 0 — Яна / Orchestrator / COO

Один центр управления, не делает руками.

Обязанности:

- принимает цель Дмитрия;
- декомпозирует на задачи;
- назначает Tier 1/Tier 2;
- требует результат в Obsidian/Kanban;
- принимает только через контролёров;
- Дмитрию отдаёт короткий отчёт: деньги, риски, следующий шаг.

Кандидат-профиль: `orchestrator`.

### Tier 1 — контролёры

- Revenue Controller — деньги, лиды, оплаты, pipeline.
- Ops/Delivery Controller — сроки, handoff, SLA, загрузка.
- Quality Controller — качество результатов и safety gates.
- Finance Controller — runway, маржинальность, счета.
- SRE/Knowledge Controller — инфраструктура, память, Obsidian, Kanban health.

Существуют частично: `controller-finance`, `controller-ops`, `controller-quality`, SRE cron-контуры. Не хватает Revenue Controller как отдельной роли.

### Tier 2 — исполнители

- Lead Research Agent.
- Outreach/Sales Agent.
- Demo/Proposal Builder.
- Client Solutions Agent.
- Implementation/Automation Agent.
- Content/VK Publisher Agent.
- Site/SEO Agent.
- Video Factory Producer/agents.
- CRM/Knowledge Steward.
- Legal/Admin Agent.

Существуют частично: `worker-content`, `worker-execution`, `worker-research`, `client-solutions-agent`, `builder`, `smart-agent-studio`. Нужно привязать их к KPI и починить Kanban execution.

### Tier 3 — watchdog / cron / автономные контуры

- SRE Guardian.
- Model Router.
- System Doctor/System Optimizer.
- Memory Steward / Obsidian sync.
- VK autopost.
- Site SEO publish/watchdog.
- Money hunter / offer factory / market lab.
- Yandex Disk inventory.

Эти контуры уже есть, но должны поднимать не только технические алерты, а и бизнес-алерты: нет лидов, нет касаний, нет оплат, blocked sales task.

---

## 7. 15 обязательных агентов для нормальной работы компании

1. Яна / COO Orchestrator — владелец всей агентной операционки.
2. Revenue Controller — ежедневный контроль денег и продаж.
3. Lead Research Agent — находит целевых клиентов и боли.
4. Outreach Sales Agent — делает касания и follow-up.
5. Offer/Demo/Proposal Agent — собирает оффер, демо, КП, счёт.
6. Client Solutions / Account Agent — онбординг, удержание, апсейл.
7. Delivery Manager Agent — ведёт оплаченные проекты до результата.
8. Implementation / Automation Engineer Agent — собирает ботов, интеграции, сайты, автоматизации.
9. Content & VK Marketing Agent — посты, CTA, упаковка кейсов, соцсети.
10. Site/SEO Publisher Agent — сайт, статьи, скорость, поисковое доверие.
11. YouTube Video Factory Producer — управляет 10-агентным видео-конвейером.
12. Finance/Cash Controller — runway, расходы, маржа, обязательства.
13. Quality Gate Controller — приёмка перед отправкой клиенту/публикацией.
14. SRE/Ops Guardian — инфраструктура, cron, gateway, падения, Kanban health.
15. Legal/Admin Agent — договоры, счета, акты, NDA, безопасные формулировки.

---

## 8. Что запускать первым за 48 часов для денег

### Цель 48 часов

Закрыть 1–2 оплаты по офферу: AI-бот для приёма заявок за 48 часов.

### Минимальный агентный war-room

1. Яна / Orchestrator — ставит задачу и принимает отчёты.
2. Revenue Controller — держит KPI и запрещает уходить в несрочный контент.
3. Lead Research Agent — 100–150 бизнесов из 5–6 ниш.
4. Outreach Sales Agent — 120 персонализированных касаний за 24 часа.
5. Demo/Proposal Agent — 5–8 микро-демо/КП под ответы.
6. Client Solutions Agent — принимает оплатившего клиента и запускает onboarding.
7. Implementation Agent — готовит базового AI-бота + таблицу заявок.
8. Finance/Admin Agent — счёт/предоплата/учёт оплат.

### Оффер

Использовать уже готовый Sales Sprint:

- $49 — экспресс-аудит переписок/профиля.
- $99 — аудит + прототип сценария.
- $200–300 — запуск базового бота за 48 часов.
- $500–700 — бот + таблица заявок + 7 дней правок.

### KPI на первые 48 часов

- 150 лидов в CRM/таблице.
- 120 касаний в первые 24 часа.
- 25 ответов.
- 8 демо/разборов.
- 4 предложения оплатить.
- 1–2 оплаты.
- Каждый лид имеет статус: new/contacted/replied/demo/proposal/invoice/paid/lost.

### Что не делать в эти 48 часов

- Не расширять YouTube factory до первой оплаты.
- Не плодить новые cron-задачи.
- Не делать «ещё один стратегический план» вместо касаний.
- Не публиковать контент без связки с CTA и CRM.

---

## 9. Kanban / dispatcher проблемы, которые мешают

Факты из Kanban:

- Статусы: todo 7, blocked 5, done 5, ready 0, running 0.
- Ключевые blocked:
  - продажи: `t_08f2711c`, `worker-execution`, agent crash x2, много падений и protocol violations;
  - клиенты: `t_87728feb`, `client-solutions-agent`, agent crash x2;
  - SEO/site audit: `t_b93e4fd0`, `worker-research`, agent crash x2;
  - операционка: `t_f435a3b0`, `worker-execution`, agent crash x2;
  - контроль контента: `t_c7b91ccf`, `controller-quality`, protocol violation/crash.

Главные проблемы:

1. Dispatcher/gateway жив, cron жив, но Kanban execution не доводит задачи до результата.
2. Worker-профили завершаются без обязательного `kanban_complete` или `kanban_block` — система считает это protocol violation.
3. Продажи и клиенты — самые важные контуры — находятся в blocked, а не в running/done.
4. Нет `controller-sales`/`revenue-controller`, хотя в текстах задач уже упоминается sales/client control.
5. Контролёры проверяют задачи, но сами тоже падают/блокируются.
6. Слишком много генераторов идей и контента, слишком мало агентов, отвечающих за оплату и delivery.

Операционное решение:

- Сначала починить или временно обойти Kanban-execution для money-room: каждый агент должен возвращать артефакт в Obsidian и явный статус done/blocked.
- Для каждой задачи добавить owner, KPI, deadline, acceptance criteria, output file.
- Деньги, клиенты, delivery не должны висеть в blocked без ежедневного red-alert Дмитрию/Яне.

---

## 10. Карта покрытия бизнес-контуров

- Стратегия/CEO: частично закрыто (`orchestrator`, master-brain cron), нужен живой COO-ритм.
- Продажи: формально есть материалы и cron, фактически blocked; нужен revenue team.
- Маркетинг/контент: закрыто лучше остальных, но не хватает связки с CRM/деньгами.
- Лидогенерация: частично, нет выделенного lead-research/outreach профиля.
- Клиенты/account: профиль есть, задача blocked.
- Delivery/production: частично, нет сильного delivery manager + implementation loop.
- Разработка/сайт/автоматизация: частично, site publishing есть, SEO audit blocked.
- Финансы: базово есть, нужен ежедневный cash/runway controller.
- Качество: базово есть, нужна специализация по sales/delivery/content.
- SRE/ops: технически сильно, бизнес-алерты слабее.
- Knowledge/память: хорошо.
- Legal/admin: отсутствует.
- YouTube/video factory: спроектировано, не является рабочей профильной командой.
- VK/social publishing: публикация работает, inbox/lead handoff отсутствует.

---

## 11. Рекомендации по следующему шагу

1. Назначить `orchestrator` как Яну/COO только на управление, не на ручное выполнение.
2. Создать или явно выделить revenue team из 4 ролей: Revenue Controller, Lead Research, Outreach Sales, Demo/Proposal.
3. В течение 48 часов работать только по money KPI и Sales Sprint.
4. Починить Kanban protocol для `worker-execution`, `client-solutions-agent`, `worker-research`, `controller-quality` или временно переводить money tasks в прямые агентные поручения с обязательным Obsidian-артефактом.
5. Ввести CRM/lead tracker как обязательный артефакт каждого дня.
6. После первой оплаты — поднять delivery контур: Client Solutions + Implementation + Quality Gate + Finance/Admin.
7. После стабилизации денег — возвращаться к YouTube factory и расширению каналов.

---

## 12. Минимальный стандарт результата для каждого агента

Каждый агент должен сдавать не «рассуждение», а операционный артефакт:

- путь к файлу в Obsidian или ссылку на запись;
- статус: done / blocked / needs-approval;
- KPI/метрики;
- что сделано;
- что мешает;
- следующий конкретный шаг;
- кто контролёр приёмки.

Без этого Яна не сможет быть COO, а будет снова делать работу вручную.
