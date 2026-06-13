# Google Workspace Status — Agent Video Factory

## Статус
- [x] Google Workspace OAuth подключён.
- [x] Token сохранён локально: `/root/.hermes/google_token.json`.
- [x] Client secret сохранён локально: `/root/.hermes/google_client_secret.json`.
- [x] Live API check прошёл успешно.

## Подключённые области доступа
- Gmail: читать, отправлять, изменять письма.
- Google Calendar: читать/создавать/изменять события.
- Google Drive: читать/загружать/изменять файлы.
- Google Docs: читать/создавать/изменять документы.
- Google Sheets: читать/создавать/изменять таблицы.
- Google Contacts / People: читать контакты.

## Правило безопасности
- Не отправлять письма, не создавать события, не шарить/удалять файлы, не менять Docs/Sheets без явного подтверждения Дмитрия.
- В Obsidian не хранить токены, client secret или коды авторизации.
- Тяжёлые ассеты YouTube-проекта всё равно хранятся на Яндекс.Диске, Google Drive используем только если Дмитрий отдельно попросит.

## Следующий шаг
Можно использовать Google Drive/Docs/Sheets/Gmail/Calendar как инфраструктуру проекта, но публикации и изменения — только после подтверждения.
