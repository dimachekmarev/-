# YouTube Auth Status — Agent Video Factory

## Получено
- [x] OAuth Client ID — получен и сохранён локально в защищённом файле.
- [x] Client Secret — получен и сохранён локально в защищённом файле.
- [x] OAuth client JSON — собран локально для авторизации.
- [x] OAuth authorization code — получен и обменян на токены.
- [x] Refresh token — получен и сохранён локально в защищённом файле.
- [ ] YouTube API проверка не завершена: HTTPError: HTTP Error 403: Forbidden.

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
## Текущий блокер — YouTube Data API v3 disabled

OAuth-токены получены и сохранены, но проверка канала вернула `403 SERVICE_DISABLED`.

Причина: в Google Cloud Project `795274412945` не включён YouTube Data API v3.

Что сделать:
1. Открыть: https://console.developers.google.com/apis/api/youtube.googleapis.com/overview?project=795274412945
2. Нажать **Enable / Включить**.
3. Подождать 2–5 минут.
4. Повторить проверку YouTube API.
