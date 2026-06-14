---
type: project
status: active
created: 2026-06-08
owner: Дмитрий Чекмарёв
---
# VK-отдел

## Задача отдела
Вести VK как отдельный производственный контур: красивые посты, органика, прогрев аудитории, ответы клиентам и передача тёплых лидов в Telegram.

## Боевые сообщества
1. [[VK — Дикая Клешня]]  
   - VK: https://vk.com/dikaya_kleshnya
   - group_id: `237416900`
   - Режим: 2 поста в день
   - Тема: раки, морепродукты, аппетитный локальный контент, продажи без давления

2. [[VK — Smart Agent AI]]  
   - VK: https://vk.com/smart_agent_ai
   - group_id: `233076338`
   - Режим: 2 поста в день
   - Тема: AI-автоматизация, бизнес-польза, кейсы, прогрев к консультации

## Принцип работы
1. Идея поста → короткая проверка на повторы.
2. Текст → живой, современный, без канцелярита.
3. Картинка → под тему поста, не повторять один и тот же визуал.
4. Хэштеги → 5–10 штук, без мусора.
5. Публикация → VK API.
6. После публикации → ссылка на пост Дмитрию.

## Правила безопасности
- Авто-чистку стен и удаление постов НЕ делаем.
- Если пост не понравился — Дмитрий удаляет вручную.
- Не писать цены, сроки доставки, наличие товара и обещания, если Дмитрий их не дал.
- Не отвечать клиентам агрессивно и не спорить; задача — прогреть и перевести в понятный следующий шаг.

## Техническая база
- Credentials (доступы): `/root/obsidian-vault/agents/hermes-memory/vk-credentials.md`
- Publisher script (публикатор): `/root/.hermes/scripts/vk_department_publish.py`
- State (анти-повторы): `/root/obsidian-vault/projects/vk-department/state.json`
- Google Drive photo pool: https://drive.google.com/drive/folders/1jQvOtJ21kpBjs1VUsqKf7WC8VBwVA8AE
- Google Sheet photo queue: https://docs.google.com/spreadsheets/d/11jOCVRUr3AAnq3Ztkq3OOgrWKTJQtCUA_igKi8LRs98/edit
- Папка «Дикая Клешня»: https://drive.google.com/drive/folders/1cuBusBbkoZ9SOpmN55FEIYF725Z8GgAj
- Папка «Smart Agent AI»: https://drive.google.com/drive/folders/1cdNMDHl34o-lIjN2JXIxr2iamX7dMrxJ
- GitHub research: [[VK GitHub Research]]
- Контент-правила: [[VK Content Contract]]

## Инцидент 2026-06-14 — одинаковые фотографии

Проблема: посты в VK выглядели как с одинаковыми фотографиями.

Причина: публикатор генерировал не реальные разные фото, а однотипные SVG/PNG-карточки. Менялся текст, но визуальный шаблон почти не менялся. `state.json` проверял только текстовые повторы, а `recent_images` не заполнялся.

Исправление:
- в `/root/.hermes/scripts/vk_department_publish.py` добавлены варианты визуалов для `raki` и `ai`;
- добавлен выбор `visual_key`, который не повторяет последние визуалы сообщества;
- добавлена запись `recent_images` с `visual_key`, `variant`, `sha256`, `attachment`, `url`;
- добавлен in-script time guard (защита времени): публикация только 09:00–22:00 MSK;
- проверено через `--dry-run`: публикаций и удалений не было.

Следующий качественный шаг: добавить настоящий image pool (пул картинок) по каждому сообществу: реальные фото раков для «Дикой Клешни» и разные бизнес/AI-иллюстрации для Smart Agent AI.

## Google photo pool — куда Дмитрий загружает фото

Создано 2026-06-14:
- Корневая папка: https://drive.google.com/drive/folders/1jQvOtJ21kpBjs1VUsqKf7WC8VBwVA8AE
- Таблица очереди: https://docs.google.com/spreadsheets/d/11jOCVRUr3AAnq3Ztkq3OOgrWKTJQtCUA_igKi8LRs98/edit
- Фото для «Дикой Клешни»: https://drive.google.com/drive/folders/1cuBusBbkoZ9SOpmN55FEIYF725Z8GgAj
- Визуалы для Smart Agent AI: https://drive.google.com/drive/folders/1cdNMDHl34o-lIjN2JXIxr2iamX7dMrxJ

Правило: Дмитрий загружает фото в нужную папку, затем в таблице на листе `Фото` добавляет строку со ссылкой, темой и статусом `ready`.

## Обновление 2026-06-14 — реальные фото для «Дикой Клешни»

Сделано:
- `vk_department_publish.py` для `raki` / `dikaya_kleshnya` сначала берёт реальные фото из Google Drive папки `1cuBusBbkoZ9SOpmN55FEIYF725Z8GgAj`, выбирая фото без повтора по `recent_images`; если Drive/скачивание недоступны — fallback на SVG-карточку.
- Заголовок поста формируется первой строкой в визуально выделенном виде для VK: `🔥 ЗАГОЛОВОК`; для латиницы/цифр есть best-effort Unicode bold.
- Добавлен `text_key` и `recent_texts`: при реальной публикации публикатор сохраняет ключ текста и блокирует повтор ключа.
- Cron-задачи `vk-raki-morning-post` и `vk-raki-evening-post` дополнены правилом добавлять `drive_folder_id` и уникальный `text_key`.
- Реальный режим по-прежнему защищён time guard: публикация только 09:00–22:00 MSK. Dry-run не пишет `state.json` и не вызывает `wall.post`.

## Следующий этап
Улучшить визуалы:
- собрать/курировать image pool для Smart Agent AI;
- периодически чистить или архивировать неудачные фото в Google Drive вручную;
- при необходимости подключить Google Sheet queue как отдельный слой ручного отбора поверх Drive folder pool.
