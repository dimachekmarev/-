# 📦 AI-аватары для рекламы — «Деньги онлайн без лица» (Д. Чекмарев)

Система паков faceless-аватаров под рекламные креативы.

## Структура

```
ads/
├── README.md                      # этот файл
├── business-trust/                # Ниша: бизнес + доверие (костюм, офис, силуэт)
│   ├── portrait/  square/  landscape/
│   └── PROMPT_PACK_business-trust.md
├── expert-authority/              # Ниша: экспертность (книги, студия)
│   ├── portrait/  square/  landscape/
│   └── PROMPT_PACK_expert-authority.md
├── lifestyle-wealth/              # Ниша: lifestyle/богатство (авто, вид, без лица)
│   ├── portrait/  square/  landscape/
│   └── PROMPT_PACK_lifestyle-wealth.md
├── shared/
│   ├── references/                # референсы-силуэты из Yandex Disk (локальные копии)
│   └── output/                    # сюда пишутся сгенерированные паки
├── generate_ads_avatars.sh        # генерация через FAL_KEY / SORA_KEY
├── generate_local.py              # fallback: локальный SDXL (нужен GPU)
└── index.html                     # fallback: HTML/CSS дизайн с аватаром-силуэтом
```

## Как генерировать

```bash
# 1. Через облако (FAL или Sora) — приоритетный путь
export FAL_KEY=...      # или
export SORA_KEY=...
bash generate_ads_avatars.sh

# 2. Fallback — локальный SDXL (требует GPU + torch)
python generate_local.py --style business-trust

# 3. Если нет GPU и нет ключей — используем референсы + HTML/CSS
#    Открой index.html в браузере, аватар-силуэт готов как шаблон креатива.
```

## Fallback-цепочка

1. **FAL_KEY / SORA_KEY задан** → `generate_ads_avatars.sh` генерирует все 3 пака.
2. **Нет ключа, но есть GPU** → `generate_local.py` (SDXL + ControlNet на базе референсов).
3. **Нет GPU и ключей** → `index.html`: берём референс-силуэт как есть, оборачиваем в
   адаптивный HTML/CSS-макет креатива (заголовок, CTA, фон).

## Статус (2026-07-18)

- [x] Структура папок создана
- [x] 3 промпт-пака по 5 вариантов (EN + аспект + negative)
- [x] Скрипт облачной генерации `generate_ads_avatars.sh`
- [x] Заглушка локальной генерации `generate_local.py`
- [x] HTML/CSS fallback `index.html`
- [ ] Реальная генерация — **НЕ ВЫПОЛНЕНА** (нет FAL_KEY / SORA_KEY; GPU недоступен)
