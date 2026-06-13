# Доступы для запуска Agent Video Factory

Обновлено: 2026-06-13

Цель файла: дать Дмитрию один список ссылок, где зарегистрироваться/включить доступы, и что потом передать Яне/Hermes для запуска агентов.

## Главное правило безопасности

- НЕ присылать основной пароль от Google/Yandex/YouTube.
- НЕ присылать коды из SMS/2FA в общий чат.
- Для API передавать только специальные ключи/токены: OAuth client, API key, refresh token.
- Если сомневаешься — сначала пришли скрин/название экрана, я скажу что нажать.

---

## 1. YouTube / Google Cloud — чтобы агент мог выкладывать видео

### Что открыть
1. Google Cloud Console: https://console.cloud.google.com/
2. Создать проект: https://console.cloud.google.com/projectcreate
3. Включить YouTube Data API v3: https://console.cloud.google.com/apis/library/youtube.googleapis.com
4. OAuth consent screen (экран согласия): https://console.cloud.google.com/apis/credentials/consent
5. Credentials (учётные данные): https://console.cloud.google.com/apis/credentials
6. Документация YouTube Data API: https://developers.google.com/youtube/v3/docs
7. OAuth для Desktop apps: https://developers.google.com/youtube/v3/guides/auth/installed-apps
8. Метод загрузки видео `videos.insert`: https://developers.google.com/youtube/v3/docs/videos/insert

### Что сделать
1. Создать Google Cloud Project.
2. Включить **YouTube Data API v3**.
3. Создать OAuth Client ID:
   - тип: **Desktop app** — проще для первого запуска;
   - название: `Hermes YouTube Publisher`.
4. Скачать JSON клиента.
5. Пройти OAuth-авторизацию на YouTube-канал.

### Какие права нужны
- `https://www.googleapis.com/auth/youtube.upload` — загрузка видео.
- `https://www.googleapis.com/auth/youtube` — управление метаданными.
- `https://www.googleapis.com/auth/yt-analytics.readonly` — аналитика.

### Что передать мне
- `client_id`
- `client_secret`
- после авторизации: `refresh_token`
- ID/название YouTube-канала

Можно передать не в чат, а файлом/заметкой. Я потом сохраню в защищённом месте и не буду держать это в памяти.

---

## 2. YouTube Studio — канал и публикации

### Что открыть
- YouTube Studio: https://studio.youtube.com/
- Настройки канала: https://studio.youtube.com/channel/UC/settings/channel
- Загрузка видео вручную: https://studio.youtube.com/channel/UC/videos/upload

### Что нужно решить
- Канал уже есть или создаём новый?
- Язык канала: RU / EN / смешанный?
- Публикация: сразу public или сначала private/unlisted?

Рекомендация для старта: первые тесты грузить как **Unlisted** (по ссылке), не сразу публично.

---

## 3. Озвучка — ElevenLabs или аналог

### ElevenLabs
- Регистрация / кабинет: https://elevenlabs.io/
- API authentication: https://elevenlabs.io/docs/api-reference/authentication
- Quickstart: https://elevenlabs.io/docs/eleven-api/quickstart

### Что сделать
1. Зарегистрироваться.
2. Выбрать русский голос.
3. Создать API key.

### Что передать мне
- `ELEVENLABS_API_KEY`
- название/ID выбранного голоса

Если не хочешь платный сервис — я могу пробовать локальную/бесплатную озвучку, но качество будет ниже.

---

## 4. Визуал: картинки и анимация

### Runway — анимация/AI-видео
- API docs: https://docs.dev.runwayml.com/
- Runway main: https://runwayml.com/

Что передать:
- API key, если подключаем через API.

### Midjourney — картинки
- Main: https://www.midjourney.com/
- Discord: https://discord.com/

Что нужно:
- доступ к Midjourney;
- если через Discord — понимать, в каком сервере/канале генерировать.

### Higgsfield — как в референсе
- Main: https://higgsfield.ai/

Что нужно:
- аккаунт;
- понять, есть ли API/MCP-доступ на твоём тарифе.

### ComfyUI — свой локальный визуальный станок
- GitHub: https://github.com/comfyanonymous/ComfyUI

Минус: на текущем VPS мало ресурсов. Для ComfyUI лучше отдельная GPU-машина.

---

## 5. Доноры и референсы

Куда складывать:
`yandex:YouTube_Money_System/Agent_Video_Factory/01_Donors/`

Что положить:
- `donors-start.txt` — 10–20 ссылок на видео/каналы.

Формат:
```text
1. https://youtube.com/... — нравится подача/тема/монтаж
2. https://youtube.com/... — хочу похожий формат, но в моей нише
```

---

## 6. Твои идеи / голос / стиль

Куда складывать:
`yandex:YouTube_Money_System/Agent_Video_Factory/00_Index/`

Что положить:
- `niches.txt` — 3–5 ниш, которые хочешь проверить.
- `tone.txt` — как должен звучать канал.
- `offers.txt` — куда ведём зрителя: консультация, аудит, Telegram, PDF, услуга.
- голосовые/тексты с твоими мыслями — можно как есть.

---

## 7. Telegram / воронка продаж

### BotFather
- https://t.me/BotFather

Что нужно:
- Telegram Bot Token, если делаем бота;
- ссылка на Telegram-канал/чат;
- оффер: что продаём или куда ведём человека.

---

## Минимум, чтобы я начал без автопубликации

1. 10 ссылок на доноров.
2. 3 темы/ниши.
3. Решение: Shorts / Long / оба.
4. Озвучка: твой голос или ИИ-голос.
5. Разрешение: делать тестовый ролик без публикации.

## Минимум, чтобы я мог ещё и публиковать

Плюс к списку выше:
1. YouTube OAuth client JSON.
2. OAuth refresh token после авторизации.
3. Правило публикации: `private`, `unlisted` или `public`.

Мой безопасный режим по умолчанию: сначала загружаю как **unlisted**, отправляю тебе ссылку, публично — только после GO.
