# Make.com Workflow: Video Factory

## Назначение
Автоматическое создание видео-заставок через Make.com: сценарий → заставка → YouTube/Disk → отчёт.

## Как это работает
```
[Google Таблица] → [HTTP: наш сервер] → [HyperFrames рендер] → [YouTube Upload] → [Google Таблица: лог]
                                                                      ↘ [Яндекс.Диск]
                                                                      ↘ [Telegram: уведомление]
```

## Шаги Make.com сценария

### 1. Триггер: Расписание
- Модуль: **Schedule**
- Каждый день в 03:00 МСК (после Content Factory cron)

### 2. Получить сценарий
- Модуль: **HTTP — Make a request**
- URL: `http://31.31.198.57:9191/api/scenario/next`
- Method: GET
- Response: JSON со сценарием

### 3. Запустить рендер
- Модуль: **HTTP — Make a request**
- URL: `http://31.31.198.57:9191/api/render`
- Method: POST
- Body: JSON из шага 2
- Response: `{"job_id": "...", "status": "rendering"}`

### 4. Ждать готовности
- Модуль: **HTTP — Make a request** + **Sleep**
- URL: `http://31.31.198.57:9191/api/render/{{job_id}}`
- Повторять каждые 30 секунд пока status != "done"
- Max 15 попыток (7.5 минут)

### 5. Скачать видео
- Модуль: **HTTP — Get a file**
- URL: `http://31.31.198.57:9191/api/video/{{job_id}}`

### 6. Загрузить на YouTube
- Модуль: **YouTube — Upload a Video**
- Title: из сценария (seo_title)
- Description: из сценария (desc_yt)
- Tags: из сценария (hashtags_yt)
- Privacy: unlisted

### 7. Записать в Таблицу
- Модуль: **Google Sheets — Add a Row**
- Spreadsheet: Content Calendar
- Колонки: дата, id, тема, URL видео, статус

### 8. Уведомление
- Модуль: **Telegram — Send a Message**
- Чат: Дмитрий
- Текст: «✅ Видео #{{id}} загружено: {{youtube_url}}»

## API эндпоинты на сервере

`/root/.hermes/scripts/video_api_server.py` — Flask-сервер на порту 9191.

Эндпоинты:
- `GET /api/scenario/next` — следующий сценарий из банка
- `POST /api/render` — запустить рендер, вернуть job_id
- `GET /api/render/<job_id>` — статус рендера
- `GET /api/video/<job_id>` — скачать готовое видео
- `GET /api/status` — состояние системы

## Альтернатива без сервера (проще)

Если серверный API сложно — можно через Google Таблицы:

1. Content Factory (cron) → рендерит видео → Яндекс.Диск → записывает URL в Google Sheet
2. Make.com каждые 2 часа проверяет Таблицу
3. Если есть новая строка со статусом "ready" → YouTube Upload → статус "posted"

Этот вариант уже наполовину работает через наш content_factory.py.
