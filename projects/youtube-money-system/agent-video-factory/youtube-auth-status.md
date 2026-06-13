# YouTube Auth Status — Agent Video Factory

## Получено
- [x] OAuth Client ID — получен и сохранён локально в защищённом файле.
- [x] Client Secret — получен и сохранён локально в защищённом файле.
- [x] OAuth client JSON — собран локально для авторизации.
- [x] Refresh token — получен и сохранён локально в защищённом файле.
- [x] YouTube Data API v3 — включён и проверен.
- [x] Канал подключён: `NEUROLUX` / `@neurolux-studio`.
- [x] Channel ID: `UC3f037joMq9pnD708qhFsKg`.
- [x] Uploads playlist: `UU3f037joMq9pnD708qhFsKg`.

## Текущее состояние канала
- Подписчики: 3.
- Видео: 0.
- Просмотры: 0.

## Ещё нужно
- [ ] Указать режим тестовой публикации: `private` или `unlisted`.
- [ ] Подготовить тестовый MP4 для пробной загрузки.
- [ ] Перед первой публикацией: GO от Дмитрия.

## Где хранится
- Secret env: `/root/.hermes/secrets/youtube-agent-video-factory.env`
- OAuth client JSON: `/root/.hermes/secrets/youtube-oauth-client.json`
- OAuth token JSON: `/root/.hermes/secrets/youtube-agent-video-factory-token.json`

## Безопасность
- В Obsidian не хранится Client Secret, authorization code, access token или refresh token.
- Пароль от Google/YouTube не нужен.
- Коды 2FA/SMS не пересылать в чат.
