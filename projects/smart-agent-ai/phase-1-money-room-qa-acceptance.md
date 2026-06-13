---
type: qa-acceptance-checklist
project: Smart Agent AI
phase: phase-1-money-room
offer: AI-бот для приёма заявок за 48 часов
created: 2026-06-13T18:12:19Z
owner_profile: agent-qa-controller
status: ready-for-approval-gate
source_plan: [[phase-1-money-room-command-plan]]
source_kpi_board: [[phase-1-money-room-kpi-board]]
source_crm: [[phase-1-money-room-lead-tracker]]
source_outreach: [[phase-1-money-room-outreach-scripts]]
source_proposal: [[phase-1-money-room-proposal-kit]]
source_delivery: [[phase-1-money-room-delivery-checklist]]
outreach_launched: false
client_delivery_launched: false
secrets_read: false
scope_changed: false
---

# Phase 1 Money Room — QA acceptance criteria и quality gate

Offer: **AI-бот для приёма заявок за 48 часов**.

Назначение файла: дать быстрый QA gate (контроль качества перед отправкой/КП/delivery), чтобы команда не обещала лишнего, не ломала CRM hygiene (гигиену CRM), не запускала unsafe bot behavior (опасное поведение бота) и не теряла delivery handoff (передачу в исполнение).

Статус: **готово как checklist / acceptance criteria**. Это контрольный артефакт; рассылки, сборки, деплой, CRM-подключения и клиентские отправки из этой задачи не запускались.

## 0. Жёсткие правила go/no-go

QA может дать `GO` только если выполнены все 6 условий:

1. **Approval есть:** сегмент, скрипт, цена/scope и delivery feasibility approved ответственными владельцами.
2. **48h обещание безопасно:** срок «до 48 часов» считается только после оплаты/approval, материалов, safe access plan и подтверждённого handoff-канала.
3. **Нет ложных обещаний:** нет гарантии продаж, замены отдела продаж, медицинских/финансовых/юридических консультаций, сложной CRM/omnichannel без отдельной оценки.
4. **CRM чистая:** каждый активный лид имеет разрешённый `status`, `score`, `next_action`, `due_date`, публичный `source`, без секретов/приватных данных в notes.
5. **Bot behavior ограничен:** бот только принимает заявку, задаёт 3–7 вопросов, отвечает по approved FAQ, передаёт человеку и умеет отказаться/эскалировать.
6. **Delivery handoff полный:** есть клиентский scope, менеджер, канал уведомления, success metric на 7 дней, риски и следующий шаг.

Если хотя бы один пункт не выполнен — статус `NO-GO` или `CONDITIONAL GO` с конкретным блокером и владельцем.

## 1. Acceptance criteria by lane

### A. Sales promises — что можно выпускать наружу

**Accepted, если:**

- [ ] В каждом скрипте и КП формулировка: «бот принимает заявки / собирает данные / передаёт менеджеру», а не «продаёт сам».
- [ ] Срок звучит как: `до 48 часов после оплаты, материалов, safe access и подтверждения scope`.
- [ ] Указано, что MVP (минимально рабочая версия) стартует с 1 канала и 1–3 услуг.
- [ ] Цена/пакет совпадает с approved диапазонами: Starter 15–25k, Standard 35–55k, Premium 75–120k ₽.
- [ ] Клиенту явно сказано, что закрытая CRM, платежи внутри бота, сложный календарь, omnichannel и кастомная интеграция не входят без отдельной оценки.
- [ ] В medical/finance/legal нишах бот не консультирует, не ставит диагнозы, не обещает результат, а только собирает заявку и передаёт человеку.
- [ ] CTA (следующий шаг) короткий: пример сценария / 7-минутный разбор / demo-flow, не длинная «цифровая трансформация».

**Reject, если найдено:**

- [ ] «Гарантируем рост продаж / лидов / запись».
- [ ] «Заменим администратора / отдел продаж».
- [ ] «Подключим любую CRM за 48 часов».
- [ ] «Бот сам консультирует / назначает лечение / считает финансы / даёт юридический совет».
- [ ] Скидка или цена без условия, scope и approval.
- [ ] Payment-next-step с реальными реквизитами/секретами в Markdown, CRM, Kanban или открытом чате.

### B. CRM hygiene — lead tracker / pipeline

**Accepted, если:**

- [ ] Используются только разрешённые статусы: `new`, `qualified`, `contacted`, `replied`, `demo-booked`, `proposal-sent`, `payment-pending`, `paid`, `lost`, `nurture`.
- [ ] Активные статусы имеют `next_action` и `due_date`: `new`, `qualified`, `contacted`, `replied`, `demo-booked`, `proposal-sent`, `payment-pending`, `nurture`.
- [ ] `score` только 1–5, без свободных оценок.
- [ ] `source` — публичный URL/источник, не приватная переписка и не секретный файл.
- [ ] `notes` короткие: причина score, pain hypothesis, blocker, ответ клиента; без паролей, токенов, реквизитов, мед/фин деталей.
- [ ] Переход в `contacted` только после approval сегмента и скрипта.
- [ ] Переход в `proposal-sent` только после approved package/scope/price.
- [ ] Переход в `payment-pending` только после delivery feasibility check.
- [ ] `paid` ставит только revenue-controller/владелец после подтверждения оплаты.
- [ ] Лиды не удаляются: отказ = `lost`, отложить = `nurture`.

**Reject, если найдено:**

- [ ] Пустой `next_action` у активного лида.
- [ ] Просроченный `due_date` без причины/эскалации.
- [ ] Самодельный статус вроде `warm`, `hot`, `sent`, `waiting`, не входящий в схему.
- [ ] Контакт/источник взят не из публичного канала или не имеет clear approval.
- [ ] В notes попали секреты, приватные данные, диагнозы, банковские сведения.

### C. Bot behavior — поведение будущего MVP

**Accepted, если бот в сценарии:**

- [ ] Приветствует коротко и объясняет, что помогает оформить заявку.
- [ ] Задаёт 3–7 вопросов максимум: услуга, имя, контакт, удобное время, комментарий/деталь.
- [ ] Отвечает только по утверждённому FAQ/source text.
- [ ] При запретной теме говорит: `передам вопрос человеку / администратор уточнит`.
- [ ] Не просит паспорт, карту, медицинские документы, банковские реквизиты или лишние персональные данные.
- [ ] Не обещает скидку, запись, результат, диагноз, расчёт без проверки менеджера.
- [ ] Всегда даёт возможность перейти к человеку.
- [ ] Передаёт менеджеру понятную карточку заявки.
- [ ] Сохраняет/передаёт только минимальные данные, нужные для follow-up.
- [ ] Имеет edge-case ответы: непонятный вопрос, запретная тема, агрессивный клиент, просьба о скидке, просьба удалить данные.

**Reject, если бот:**

- [ ] Самостоятельно закрывает сделку, назначает скидку или подтверждает запись без менеджера.
- [ ] Импровизирует экспертные консультации вне FAQ.
- [ ] Собирает sensitive data (чувствительные данные) без необходимости и approval.
- [ ] Не умеет остановиться и перевести на человека.
- [ ] Не показывает, что именно было передано менеджеру.

### D. Delivery handoff — передача после оплаты/approval

**Accepted, если handoff содержит:**

- [ ] Client name / ниша / ответственный менеджер.
- [ ] Selected package и approved price.
- [ ] Payment status: draft / invoice sent / paid / blocked.
- [ ] 48h clock start: конкретное время после оплаты и материалов.
- [ ] Services in scope: 1–3 услуги для MVP.
- [ ] Entry channel: один канал для старта.
- [ ] Approved FAQ/source text.
- [ ] Bot must NOT answer: список стоп-тем.
- [ ] Notification/handoff channel: Telegram / таблица / CRM-ready файл.
- [ ] Responsible manager + working hours.
- [ ] Success metric for first 7 days.
- [ ] Safe access method: одноразовая ссылка / 1Password / временный ключ / отдельный техаккаунт; не обычный чат.
- [ ] Delivery owner, QA owner, next action.
- [ ] Current risks + решение/владелец по каждому риску.

**Reject, если:**

- [ ] Нет менеджера, который принимает заявки.
- [ ] Не выбран канал handoff.
- [ ] Нет approved FAQ/стоп-тем.
- [ ] 48h срок обещан до материалов/оплаты/safe access.
- [ ] Требуется закрытая CRM/платёжка/деплой в инфраструктуру клиента без отдельного approval.
- [ ] Секреты просят/хранят в открытом виде.

## 2. QA checklist перед первым outreach

Использовать перед любым реальным касанием.

- [ ] `phase-1-money-room-leads-120` / импорт проверены: лиды из публичных источников, score 4–5 в приоритете.
- [ ] Дмитрий/revenue-controller approved сегмент и первые 20 sample leads.
- [ ] Скрипт выбран: soft / direct / expert.
- [ ] Персонализация не врёт: не писать «глубоко изучил бизнес», если была только публичная страница.
- [ ] Сообщение содержит safe promise: заявка → 3–7 вопросов → контакт → менеджер.
- [ ] Нет запрещённых обещаний: продажи, консультации, CRM за 48h, замена отдела продаж.
- [ ] CTA один и короткий: показать пример / 7 минут demo.
- [ ] CRM до отправки имеет `status=qualified`, `next_action`, `due_date`.
- [ ] После отправки будет записано: `status=contacted`, `last_touch/date` в notes, `next_action_due` по правилам follow-up.
- [ ] Outreach не запускается автоматически из агента без approval.

**Go/no-go:**

```text
Outreach QA: GO / CONDITIONAL GO / NO-GO
Blocker:
Owner:
Fix needed before send:
Approved script variant:
Sample size approved:
```

## 3. QA checklist перед КП / payment-next-step

- [ ] Есть реальный hot reply / demo / запрос цены.
- [ ] Package выбран под scope, не навязан Premium первым сообщением без диагностики.
- [ ] Цена в approved диапазоне или отдельно approved.
- [ ] КП содержит «что входит / что не входит / что нужно от клиента».
- [ ] 48h срок привязан к оплате, материалам, safe access и подтверждённому scope.
- [ ] Delivery-manager подтвердил feasibility (можно ли выполнить за 48h).
- [ ] Нет реальных платёжных секретов/реквизитов в draft-файлах.
- [ ] Если клиент готов платить, есть handoff на safe payment-next-step без раскрытия секретов.
- [ ] Перед `proposal-sent` CRM обновлена и next action назначен.
- [ ] Перед `payment-pending` заполнен минимум delivery handoff.

**Go/no-go:**

```text
Proposal QA: GO / CONDITIONAL GO / NO-GO
Client:
Package:
Approved price:
Delivery feasibility: yes/no/conditional
Missing materials:
Blocker:
Owner:
```

## 4. QA checklist перед build/deploy/client delivery

Не запускать build/deploy из QA-задачи. Этот блок только для acceptance gate перед отдельной delivery-командой.

- [ ] Оплата или явный approval на старт зафиксированы.
- [ ] Intake заполнен: услуги, канал, FAQ, стоп-темы, handoff, менеджер, success metric.
- [ ] Safe access plan подтверждён; секреты не в Markdown/CRM/Kanban/open chat.
- [ ] Scope узкий: 1 канал, 1–3 услуги, 3–7 вопросов, FAQ только approved.
- [ ] Есть тест-кейсы: минимум 5 happy path и 5 edge cases.
- [ ] Менеджер понимает карточку заявки и следующий шаг.
- [ ] Клиент approved тексты, FAQ и ограничения.
- [ ] Риски записаны и имеют владельца.
- [ ] KPI/revenue-controller знает статус: ready / blocked / needs changes.

**Go/no-go:**

```text
Delivery QA: GO / CONDITIONAL GO / NO-GO
Client:
48h clock starts at:
Scope summary:
Safe access status:
Tests required:
Blocker:
Owner:
Next action:
```

## 5. Risk register (реестр рисков)

| Риск | Severity | Где проявится | Контроль | Владелец | Go/no-go |
|---|---|---|---|---|---|
| Ложное обещание «гарантируем продажи» | high | outreach / КП | запретить формулировку, заменить на «приём заявок и handoff» | agent-qa-controller | NO-GO до исправления |
| 48h срок обещан до материалов/оплаты | high | КП / sales call | использовать формулу «после оплаты, материалов, safe access, scope» | proposal-agent + delivery-manager-agent | NO-GO до исправления |
| CRM загрязняется свободными статусами | medium | lead tracker | data validation: разрешённые статусы и score 1–5 | crm-steward-agent | CONDITIONAL GO после чистки |
| Активный лид без next action | medium | follow-up | каждые 4h snapshot, due_date обязателен | crm-steward-agent | CONDITIONAL GO после заполнения |
| Секреты/реквизиты в открытом файле | critical | КП / delivery / notes | не хранить, использовать safe access method | delivery-manager-agent + agent-qa-controller | NO-GO, удалить/ротировать секрет |
| Мед/фин/юр консультация от бота | critical | bot scenario | FAQ-only + fallback to human | delivery-manager-agent + QA | NO-GO до ограничения |
| Закрытая CRM/платёжка попала в 48h scope | high | proposal / delivery | вынести в отдельную оценку | proposal-agent + delivery-manager-agent | NO-GO до scope fix |
| Нет менеджера после заявки | high | delivery handoff | назначить manager + hours | клиент + delivery-manager-agent | NO-GO |
| Нет success metric на 7 дней | medium | delivery / owner report | зафиксировать 1 измеримый критерий | delivery-manager-agent | CONDITIONAL GO |
| Outreach запущен без approval | high | sales ops | gate: сегмент + script approval до `contacted` | outreach-sales-agent + revenue-controller | NO-GO / stop-send |

## 6. Fast audit template for QA controller

Копировать в комментарий/отчёт перед approval gate.

```markdown
## QA gate — {{artifact/client}}

Status: GO / CONDITIONAL GO / NO-GO
Checked artifacts:
- Sales promises:
- CRM hygiene:
- Bot behavior:
- Delivery handoff:

Blocking issues:
1.
2.
3.

Required fixes before send/build:
1.
2.
3.

Owner decisions needed:
- Дмитрий/revenue-controller:
- Delivery-manager:
- CRM steward:

Safety receipt:
- Outreach launched: no / yes
- Build/deploy launched: no / yes
- Secrets read/copied: no / yes
- Scope changed: no / yes
```

## 7. QA decision matrix

| Status | Meaning | Allowed next step |
|---|---|---|
| `GO` | Все critical/high риски закрыты; acceptance criteria пройдены | можно передавать на ручной approved send / КП / delivery step |
| `CONDITIONAL GO` | Нет critical риска, но есть small/medium fix с владельцем | можно продолжать только после фиксирования условия и owner |
| `NO-GO` | Есть critical/high риск или отсутствует обязательный approval | остановить отправку/build/payment promise до исправления |

## 8. Safety receipt

- Проверены источники: command plan, KPI board, lead tracker schema, outreach scripts, proposal kit, delivery checklist.
- Scope задачи не менялся: подготовлены acceptance criteria и QA checklist.
- Долгие тесты не запускались.
- Outreach/dispatch не запускались.
- Build/deploy/client delivery не запускались.
- Секреты, `.env`, токены, платёжные реквизиты не читались и не копировались.
