---
type: crm-schema
project: Smart Agent AI
phase: phase-1-money-room
offer: AI-бот для приёма заявок за 48 часов
created: 2026-06-13T17:27:59+00:00
updated: 2026-06-13T17:53:53+00:00
owner_profile: crm-steward-agent
status: sheets-ready
source_plan: [[phase-1-money-room-command-plan]]
source_leads: [[phase-1-money-room-leads-120]]
no_external_crm_connected: true
outreach_launched: false
secrets_read: false
---

# Phase 1 Money Room — Lead Tracker Schema

Назначение: единый CRM/lead tracker для 48h money-room оффера «AI-бот для приёма заявок за 48 часов».

Важно:
- Это Obsidian/Sheets-ready схема, не подключение внешней CRM.
- Внешние CRM не подключать без отдельного approval.
- Секреты, токены, платёжные реквизиты и приватные данные сюда не писать.
- Реальные касания/рассылки не запускать без approval сегмента и скрипта.

## 1. Статусы воронки

Разрешённые значения поля `status`:

| status | Смысл | Когда ставить | Следующее действие |
|---|---|---|---|
| `new` | Лид найден, ещё не проверен CRM steward/продажами | После импорта из lead research | Проверить публичный источник, score и применимость оффера |
| `qualified` | Лид подходит под ICP и готов к ручному касанию | После проверки источника и score | Подготовить персонализированное сообщение |
| `contacted` | Первое касание сделано | Только после approval скрипта и факта отправки | Ждать ответ или поставить follow-up |
| `replied` | Получен ответ | После любого осмысленного ответа | Зафиксировать суть ответа и предложить быстрый разбор/демо |
| `demo-booked` | Демо/созвон/разбор назначен | Когда есть дата/время или подтверждённый слот | Подготовить демо-сценарий и вопросы |
| `proposal-sent` | КП/пакет/следующий шаг отправлен | После демо или горячего интереса | Ждать решение, уточнить blockers |
| `payment-pending` | Клиент готов платить/ждёт оплату/аванс | Когда согласован пакет и следующий платёжный шаг | Проверить scope и безопасный payment-next-step |
| `paid` | Оплата получена | Только после подтверждения оплаты владельцем/revenue-controller | Передать в delivery handoff |
| `lost` | Лид закрыт без продолжения | Не подходит, отказ, нет ответа после лимита follow-up | Записать причину, не удалять строку |
| `nurture` | Отложить на прогрев | Подходит, но не сейчас / слабый score / долгий цикл | Поставить дату возврата |

Стандартный путь: `new` → `qualified` → `contacted` → `replied` → `demo-booked` → `proposal-sent` → `payment-pending` → `paid`.

Боковые выходы из любого активного статуса: `lost` или `nurture`.

## 2. Обязательные поля

Sheets-ready заголовки для основной таблицы:

```csv
company,niche,channel,contact,source,score,owner,status,next_action,due_date,notes
```

| Поле | Тип | Обязательно | Правило заполнения | Пример |
|---|---|---:|---|---|
| `company` | text | да | Название компании/проекта из публичного источника | `Dental Mania` |
| `niche` | enum/text | да | Ниша или сегмент | `стоматология` |
| `channel` | text | да | Канал потенциального касания, только публичный | `сайт/форма`, `WhatsApp публично указан`, `Telegram публично указан` |
| `contact` | text | да | Роль или публичный контактный путь. Не копировать личные данные без нужды | `администратор/владелец`, `форма на сайте` |
| `source` | url/text | да | Публичный URL/источник, откуда взят лид | `https://example.ru/` |
| `score` | number 1–5 | да | Оценка fit под оффер | `5` |
| `owner` | text | да | Ответственный агент/человек | `crm-steward-agent` |
| `status` | enum | да | Одно из 10 разрешённых значений | `new` |
| `next_action` | text | да для активных | Следующий конкретный шаг; не пустой, пока статус не `paid`/`lost` | `Проверить источник и подготовить approved script` |
| `due_date` | date | да для активных | Дата следующего действия в формате `YYYY-MM-DD` | `2026-06-14` |
| `notes` | text | нет | Коротко: причина score, риск, ответ, blocker. Без секретов | `Публичный источник; касание не отправлялось` |

Активные статусы: `new`, `qualified`, `contacted`, `replied`, `demo-booked`, `proposal-sent`, `payment-pending`, `nurture`.

Финальные статусы: `paid`, `lost`.

## 3. Правила CRM hygiene (гигиена CRM)

1. Не удалять лидов. Если не подходит — `lost`; если отложить — `nurture`.
2. У каждого активного лида должны быть `next_action` и `due_date`.
3. `score` — только 1, 2, 3, 4, 5.
4. `status` — только из списка выше, без свободных вариантов.
5. `source` должен быть публичным источником, не приватной перепиской и не секретным файлом.
6. В `notes` не хранить пароли, токены, реквизиты, приватные медицинские/финансовые детали.
7. `paid` ставит только revenue-controller/владелец после подтверждения оплаты.
8. Перед `contacted` должен быть approval скрипта и сегмента.
9. Перед `proposal-sent` должны быть утверждены package/scope/price.
10. Перед `payment-pending` нужен delivery feasibility check (проверка, что обещание 48h реально выполнить).

## 4. Google Sheets / CSV setup

Файлы рядом:
- `phase-1-money-room-lead-tracker-template.csv` — пустой шаблон + 2 примерные строки.
- `phase-1-money-room-lead-tracker-import.csv` — компактный импорт 120 найденных лидов в этой схеме.

Рекомендуемые настройки в Google Sheets:

### Data validation (проверка данных)

`status`:
```text
new,qualified,contacted,replied,demo-booked,proposal-sent,payment-pending,paid,lost,nurture
```

`score`:
```text
1,2,3,4,5
```

`due_date`:
- формат ячейки: Date / дата;
- условное форматирование: красный, если `due_date < TODAY()` и `status` не `paid/lost`.

### Suggested filters (фильтры)

1. `status` = `new`/`qualified` — что готовить к касанию.
2. `score` >= 4 — приоритет money-room.
3. `due_date` сегодня или раньше — просроченные действия.
4. `status` = `replied`/`demo-booked`/`proposal-sent`/`payment-pending` — горячая зона.

## 5. Образец строк

| company | niche | channel | contact | source | score | owner | status | next_action | due_date | notes |
|---|---|---|---|---|---:|---|---|---|---|---|
| Dental Mania | стоматология | онлайн-запись/форма заявки | администратор/владелец | https://dentalmania.ru/ | 5 | crm-steward-agent | new | Проверить публичный источник и подготовить персонализацию; не отправлять без approval | 2026-06-14 | Публичный источник; касание не отправлялось |
| Барбершоп пример | барбершоп | сайт/публичный профиль | администратор/владелец | https://example.com/ | 3 | crm-steward-agent | nurture | Вернуться после Segment A; проверить fit и чек | 2026-06-20 | Низкий приоритет для первых 48 часов |

## 6. Mapping из текущего lead list

Текущий файл `phase-1-money-room-leads-120.csv` шире, чем минимальная CRM-схема. Для компактного tracker используется такое соответствие:

| Tracker field | Source column |
|---|---|
| `company` | `company` |
| `niche` | `niche` |
| `channel` | `contact_channel` |
| `contact` | `contact_person_or_role` |
| `source` | `public_source_url` |
| `score` | `offer_fit_score_1_5` |
| `owner` | `owner_profile` |
| `status` | `status` |
| `next_action` | `next_action` |
| `due_date` | `next_action_due` |
| `notes` | `notes` + короткая pain hypothesis при необходимости |

## 7. 4-hour operating snapshot

Для CRM steward каждые 4 часа:

```text
Snapshot: YYYY-MM-DD HH:MM UTC
new:
qualified:
contacted:
replied:
demo-booked:
proposal-sent:
payment-pending:
paid:
lost:
nurture:
Просрочено next_action:
Главный blocker:
Следующие 3 действия:
1.
2.
3.
```

## 8. Safety receipt

- Внешняя CRM не подключалась.
- Секреты/токены/платёжные реквизиты не читались и не копировались.
- Схема и CSV-файлы находятся только в Obsidian workspace проекта.
- Outreach/рассылки не запускались.
