# Промпт-пак: AI-аватары «Деньги онлайн без лица»
**Проект:** Дмитрий Чекмарев — «Как заработать много денег в интернете без лица но со своим аватаром»
**Стиль:** business AI avatar, studio light, faceless personal brand
**Дата:** 2026-07-18
**Референсы (Yandex Disk):**
- `02_Аватар_и_визуал/Close-up_studio_portrait_of_the_202605292326.jpeg`
- `02_Аватар_и_визуал/Professional_studio_character_reference_sheet_202605292325.jpeg`
(локальные копии лежат рядом с этим файлом)

---

## Базовые принципы (из референсов)
- Студийный свет (soft key + rim light), нейтральный/градиентный фон.
- Лицо НЕ показывается — силуэт со спины, тень, ракурс вниз/вверх, или кадрирование по плечам.
- Премиальная корпоративная эстетика: тёмный блейзер, чистые линии, editorial-фотография.
- Цветокор: тёплый нейтральный, высокий контраст, кинематографично.

---

## Вариант 1 — «Силуэт со спины» (самый безопасный для faceless)
**Промпт (EN):**
> Faceless business avatar, close-up studio portrait, confident entrepreneur seen from behind wearing premium dark navy blazer, soft cinematic studio key light, rim light highlighting shoulder outline, shallow depth of field, smooth grey gradient backdrop, minimalist editorial photography, no face visible, 8k, sharp details, professional color grading.

**Промпт (RU, для Midjourney/локальных моделей):**
> Беслицый бизнес-аватар, крупный студийный портрет, уверенный предприниматель со спины в тёмном блейзере, мягкий кинематографичный студийный свет, контурный свет по плечу, малая глубина резкости, гладкий серый градиентный фон, минимализм, лицо не видно, 8k.

**Аспект:** portrait · **Negative:** face, facial features, eyes, text, watermark

---

## Вариант 2 — «Тень/профиль в полуобороте» (динамичный бренд)
**Промпт (EN):**
> Faceless personal brand avatar, three-quarter back view, entrepreneur in charcoal suit turning away from camera, dramatic studio lighting with strong side key, long elegant shadow, dark moody background with subtle bokeh, high-end corporate aesthetic, no face shown, cinematic color grade, ultra detailed, 8k portrait.

**Промпт (RU):**
> Беслицый аватар личного бренда, вид в три четверти со спины, предприниматель в тёмном костюме отворачивается от камеры, драматичный боковой студийный свет, длинная элегантная тень, тёмный фон с лёгким боке, премиальная корпоративная эстетика, лицо скрыто, кинематографичный цветокор, ультра-детализация.

**Аспект:** portrait · **Negative:** face, front view, text, logo

---

## Вариант 3 — «Абстрактный бренд-символ» (для обложек/иконок)
**Промпт (EN):**
> Faceless abstract business avatar icon, stylized silhouette of a person in suit against glowing studio gradient, golden hour rim light, geometric minimal composition, premium fintech brand style, no facial details, clean negative space, 8k render, crisp vector-like edges.

**Промпт (RU):**
> Беслицый абстрактный аватар-иконка, стилизованный силуэт человека в костюме на светящемся студийном градиенте, свет «золотого часа» по контуру, геометричная минималистичная композиция, премиальный финтех-стиль, без деталей лица, чистый негатив, 8k рендер.

**Аспект:** square · **Negative:** face, realistic skin, text

---

## Как генерировать (fallback-скрипт)
См. `generate_avatars.sh` — он берёт FAL_KEY из окружения и генерирует все 3 варианта.
Если FAL_KEY не задан, нужно:
1. Получить бесплатный ключ на https://fal.ai → `export FAL_KEY=...`
2. Или залогиниться в Nous Portal: `hermes model` (управляет биллингом).
3. Или использовать локальную модель (SDXL + ControlNet) через `python generate_local.py` (требует GPU).

## Статус
- [x] Референсы прочитаны из Yandex Disk (rclone)
- [x] Локальные копии референсов сохранены
- [x] Промпт-пак составлен (3 варианта)
- [ ] Тестовая генерация — НЕ ВЫПОЛНЕНА (image_generate недоступен: нет FAL_KEY / нет логина в Nous Portal)
