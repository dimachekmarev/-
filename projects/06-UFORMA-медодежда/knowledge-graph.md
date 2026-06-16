---
type: knowledge-graph
project: 06-UFORMA
created: 2026-06-16
method: Graphiti-style (отдельные JSON-ноды)
economy: 40-50x токенов vs один index-файл
---

# 🕸️ Knowledge Graph — UFORMA медодежда

Связи между товарами, категориями, SEO-ключами в формате Graphiti.

## Структура графа

```
┌─────────────────────────────────────────────────────────────────┐
│                    САЙТ uforma-med.ru                           │
│  #website ──publisher──▶ #organization                         │
│     │                        │                                  │
│     │                  #localbusiness                           │
│     │                   (Красная 53, Пенза)                     │
│     │                        │                                  │
│     ▼                        ▼                                  │
│  ┌──────────────────────────────────────┐                       │
│  │         КАТАЛОГ (ItemList)           │                       │
│  │  #category-zhenskaya (148 товаров)   │                       │
│  │  #category-muzhskaya  (12 товаров)   │                       │
│  │  #category-premium     (3 товара)    │                       │
│  └──────────┬───────────────────────────┘                       │
│             │                                                   │
│             ▼                                                   │
│  ┌──────────────────────────────────────┐                       │
│  │         ТОВАРЫ (Product)             │                       │
│  │  • Халаты женские (12+)              │                       │
│  │  • Блузы женские (40+)               │                       │
│  │  • Брюки женские (30+)               │                       │
│  │  • Костюмы женские (20+)             │                       │
│  │  • Жакеты женские (15+)              │                       │
│  │  • Мужские халаты (5+)               │                       │
│  │  • Мужские костюмы (4+)              │                       │
│  │  • Премиум (3)                       │                       │
│  └──────────┬───────────────────────────┘                       │
│             │                                                   │
│             ▼                                                   │
│  ┌──────────────────────────────────────┐                       │
│  │         SEO-КОНТЕНТ                  │                       │
│  │  • Статьи (Article) — блог           │                       │
│  │  • FAQ — вопросы/ответы              │                       │
│  │  • HowTo — инструкции выбора         │                       │
│  │  связаны с товарами через about/mentions                     │
│  └──────────────────────────────────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

## Ноды графа

### Корневые ноды

| @id | @type | Описание |
|-----|-------|----------|
| `#organization` | Organization | UFORMA Пенза, Красная 53 |
| `#website` | WebSite | uforma-med.ru |
| `#localbusiness` | LocalBusiness | Магазин в Пензе |

### Категории

| @id | @type | Товаров |
|-----|-------|---------|
| `#category-zhenskaya` | ItemList | 148 |
| `#category-muzhskaya` | ItemList | 12 |
| `#category-premium` | ItemList | 3 |

### Подкатегории (женские)

| @id | @type | Родитель |
|-----|-------|----------|
| `#subcat-bluzy` | CollectionPage | #category-zhenskaya |
| `#subcat-bryuki` | CollectionPage | #category-zhenskaya |
| `#subcat-halaty` | CollectionPage | #category-zhenskaya |
| `#subcat-kostumy` | CollectionPage | #category-zhenskaya |
| `#subcat-zhakety` | CollectionPage | #category-zhenskaya |

### SEO-ключи → товары

| SEO-ключ | → Товары |
|----------|----------|
| `медицинская одежда Пенза` | Все товары |
| `купить медицинский халат Пенза` | #product-halat-* |
| `женская медодежда Пенза` | Все #category-zhenskaya |
| `мужской медицинский костюм Пенза` | #product-kostum-muzh-* |
| `медодежда для врачей Пенза` | Все товары |
| `UFORMA Пенза` | #organization |
| `блуза медицинская женская Пенза` | #product-bluza-* |
| `медицинские брюки женские Пенза` | #product-bryuki-* |
| `премиум медодежда Пенза` | #category-premium |
| `одежда для стоматологов Пенза` | #product-halat-*, #product-kostum-* |
| `медодежда оптом Пенза` | Все товары |

### SEO-статьи (Article) → связанные товары

| Статья | → Товары |
|--------|----------|
| `kak-vybrat-medicinskuyu-odezhdu` | Все категории |
| `kak-vybrat-halat-vracha` | #product-halat-* |
| `zhenskaya-medicinskaya-odezhda-2026` | #category-zhenskaya |
| `muzhskaya-medodezhda-dlya-vrachey` | #category-muzhskaya |
| `premium-medodezhda-otlichiya` | #category-premium |
| `razmery-medicinskoy-odezhdy` | Все товары |
| `tkany-dlya-medodezhdy` | Все товары |

### FAQ → товары

| Вопрос | → Товары |
|--------|----------|
| Как выбрать размер? | #article-razmery-medicinskoy-odezhdy |
| Какие ткани используете? | #article-tkany-dlya-medodezhdy |
| Есть ли доставка по Пензе? | #localbusiness |
| Можно ли примерить перед покупкой? | #localbusiness |
| Работаете ли с клиниками? | #organization |
| Есть ли скидки оптовикам? | Все товары |

---

## Связи между товарами (cross-sell)

```
#product-bluza-anabel-belyy
  └─ relatedTo: #product-bryuki-klassic-belye  (комплект)
  └─ relatedTo: #product-halat-zhenskiy-belyy  (альтернатива)

#product-kostum-zhenskiy-biryuzovyy
  └─ relatedTo: #product-bluza-anzhelika-biryuzovyy  (сочетается)
  └─ relatedTo: #product-halat-zhenskiy-biryuzovyy   (альтернатива)

#product-halat-muzhskoy-belyy
  └─ relatedTo: #product-bryuki-muzhskie-belye       (комплект)
  └─ relatedTo: #product-kostum-muzhskoy-belyy       (альтернатива)
```

---

## JSON-ноды (Graphiti-формат)

Файлы в `knowledge-graph/nodes/` — по одному JSON на ноду.

### Пример: `node_0001_organization.json`

```json
{
  "@id": "https://uforma-med.ru/#organization",
  "@type": "Organization",
  "name": "UFORMA — медицинская одежда в Пензе",
  "url": "https://uforma-med.ru",
  "properties": {
    "address": "Красная ул., 53, Пенза, 440000",
    "phone": "+7-917-212-33-44",
    "foundingDate": "2020",
    "owner": "Дмитрий Чекмарев",
    "telegram": "@dimachekmarev"
  },
  "relatedTo": [
    {"@id": "#website", "relation": "hasWebsite"},
    {"@id": "#localbusiness", "relation": "hasStore"},
    {"@id": "#category-zhenskaya", "relation": "offersCategory"},
    {"@id": "#category-muzhskaya", "relation": "offersCategory"},
    {"@id": "#category-premium", "relation": "offersCategory"}
  ]
}
```

### Пример: `node_0100_product-halat-belyy.json`

```json
{
  "@id": "https://uforma-med.ru/product/halat-zhenskiy-belyy#product",
  "@type": "Product",
  "name": "Халат женский белый",
  "properties": {
    "price": 2400,
    "currency": "RUB",
    "category": "Женская одежда",
    "subcategory": "Халаты",
    "fabric": "Спандекс: полиэстер 90%, спандекс 10%",
    "sizes": ["42", "44", "46", "48", "50", "52", "54", "56"],
    "availability": "InStock"
  },
  "relatedTo": [
    {"@id": "#organization", "relation": "offeredBy"},
    {"@id": "#category-zhenskaya", "relation": "belongsToCategory"},
    {"@id": "#subcat-halaty", "relation": "belongsToSubcategory"},
    {"@id": "https://uforma-med.ru/product/bryuki-klassic-belye#product", "relation": "completesWith"},
    {"@id": "#seo-kupit-halat-penza", "relation": "targetsSEO"},
    {"@id": "#article-kak-vybrat-halat", "relation": "mentionedIn"}
  ]
}
```

---

## Как использовать

1. **Сайт**: JSON-LD на страницах автоматически строит этот граф
2. **Obsidian**: backlinks между нотами = связи в графе
3. **Claude Code / Codex / Pi shell**: загружаешь `knowledge-graph/nodes/` → агент ищет связанные ноды без LLM
4. **Поиск без нейросети**: скрипт `find_related.py` находит цепочку нод по `@id`

---

## 💰 Экономия

| Подход | Токенов на поиск | × товаров |
|--------|:-:|:-:|
| Один index-файл (Карпатый) | ~50K токенов | × |
| Graphiti (отдельные ноды + скрипт) | ~1K токенов | 40-50× экономия |

---

## Ссылки

- Graphiti GitHub: https://github.com/getzep/graphiti (70K+ ★)
- Docs: https://help.getzep.com/graphiti
- Сайт UFORMA: https://uforma-med.ru
- Obsidian vault: `/root/obsidian-vault/projects/06-UFORMA-медодежда/`
