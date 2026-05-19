---
type: research
created: 2026-05-19
tags: [research, github, content-automation, social-media]
project: "[[Контент-отдел Smart Agent AI]]"
---

# GitHub Research: Лучшие решения для контент-фабрики

## Топ-находки

### 🥇 social-ai-team (114 ★)
**https://github.com/stevenflanagan1/social-ai-team**

Полноценная AI-команда для соцсетей SMB. Архитектура из 9 специализированных навыков для Claude Code — идеально адаптируется под Hermes.

**Архитектура (3 слоя):**

```
LAYER 1 — FOUNDATION
  /brand-onboarding    → context/brand-style.md      (один раз)
  /content-calendar    → context/content-calendar.md  (ежемесячно)

LAYER 2 — CONTENT CREATION
  /caption-writer           → outputs/captions/       (Instagram, Facebook)
  /social-creative-designer → outputs/creatives/      (Nano Banana визуалы)
  /linkedin-writer          → outputs/linkedin/
  /threads-writer           → outputs/threads/
  /x-writer                 → outputs/x/

LAYER 3 — DISTRIBUTION & REVIEW
  /publisher                → Blotato/API (публикация)
  /social-performance-review → outputs/reviews/       (конец месяца)
                                     ↓
                           context/best-performers.md
                           (петля обратной связи)
```

**Ключевые паттерны:**
- **Context files как shared memory:** brand-style.md → календарь → best-performers — файлы передаются между агентами
- **Human-in-the-loop на каждом переходе:** «Phase complete. Review output then say 'next'.»
- **Orchestrator agent:** `social-media-manager` координирует, не делает работу сам
- **Платформенно-нативные писатели:** отдельный агент под каждую площадку (LinkedIn ≠ X ≠ Threads)
- **Визуалы двумя способами:** Nano Banana (брендовые фото) + Blotato (инфографика)

**Что берём:**
- Всю архитектуру 3-слойного конвейера ✅
- Паттерн context files как shared memory между агентами ✅
- Human-in-the-loop на каждом этапе ✅
- Структуру brand-style.md (единый источник правды о бренде) ✅
- Контент-календарь с content pillars и format mix ✅

---

### 🥈 Agentfy (400 ★)
**https://github.com/Agentfy-io/Agentfy**

Модульная multi-agent система для соцсетей. Архитектура: Perception → Reasoning → Action.

**Что интересно:**
- Агенты под каждую платформу: X, YouTube, Instagram, TikTok, WhatsApp
- MCP (Model Context Protocol) для коммуникации между агентами
- Единый интерфейс: «спроси один раз — агент сделает всё»
- Поддерживает cross-platform buyer discovery, content transformation, automated messaging

**Что берём:**
- Идею единого entry-point для пользователя ✅
- Платформенно-специфичных агентов ✅

---

### 🥉 automate-for-growth (654 ★)
**https://github.com/cporter202/automate-for-growth**

Образовательный курс по автоматизации контента. 11 модулей.

**Ключевые концепции:**
- Системный подход vs one-off контент
- Content pillars (тематические столпы)
- Bulk content generation
- Multi-platform publishing (8+ платформ)
- Brand authority automation

**Что берём:**
- Content pillars framework ✅
- Идею «система, а не разовый пост» ✅

---

## Сравнение с нашим дизайном

| Компонент | Наш дизайн | social-ai-team | Что улучшить |
|-----------|-----------|----------------|--------------|
| Оркестратор | Нет | social-media-manager | **Добавить!** |
| Brand onboarding | Нет | brand-onboarding | **Добавить!** |
| Content calendar | Нет | content-calendar (ежемесячно) | **Добавить!** |
| Intake (приём сырья) | Content Intake Agent | Нет (фокус на календаре) | Оставить |
| Написание постов | Content Writer (один на всех) | Отдельные писатели под площадки | Разделить |
| Визуалы | Нет в фазе 1 | social-creative-designer | Добавить позже |
| Публикация | Content Scheduler | Publisher (Blotato) | Адаптировать под API |
| Аналитика | Analytics Agent | social-performance-review | Объединить |
| Обратная связь | Нет | best-performers.md → календарь | **Добавить!** |

---

## Улучшенная архитектура контент-завода

### Добавляем то, чего не хватало:

#### 1. Social Media Manager (оркестратор)
Координирует всю команду. Не пишет посты сам — только маршрутизирует.

#### 2. Brand Onboarding Agent
Собирает brand-style.md — единый источник правды:
- Tone of voice
- Визуальный стиль (цвета, шрифты, мудборд)
- Content pillars (о чём говорим)
- Целевая аудитория
- Что можно / нельзя

#### 3. Content Calendar Agent
Строит контент-план на неделю/месяц:
- Темы, форматы, площадки
- Привязка к событиям и запускам
- Баланс: 40% ценность / 30% кейсы / 20% личное / 10% продажи

#### 4. Платформенные писатели (вместо одного Content Writer)
- Telegram Writer (посты для канала)
- X Writer (треды, 280 символов)
- LinkedIn Writer (профессиональные посты)
- VK Writer (статьи, посты)
- Dzen Writer (лонгриды)
- Instagram Writer (короткие + визуальные)

#### 5. Content Repurposer (новый!)
Из одного сырья делает N форматов: тред → пост → статья → карточка

#### 6. Performance Review Agent (обратная связь)
Анализирует что залетело → обновляет best-performers.md → влияет на следующий календарь

---

## Обновлённый workflow

```
Дмитрий (голос / идея / кейс)
    │
    ▼
📋 Social Media Manager (оркестратор)
    │  читает brand-style.md, content-calendar.md
    │
    ├──→ 🎤 Content Intake Agent     (транскрибация → заметка в Obsidian)
    │
    ├──→ 📅 Content Calendar Agent   (в какой слот ставим?)
    │
    ├──→ ✍️ Platform Writers:
    │    ├── Telegram Writer
    │    ├── X Writer
    │    ├── LinkedIn Writer
    │    └── VK/Dzen Writer
    │
    ├──→ 🔄 Content Repurposer      (из одного → много форматов)
    │
    ▼
👤 Дмитрий (approve)
    │
    ▼
📤 Publisher Agent                   (постинг по расписанию)
    │
    ▼
📊 Performance Review Agent          (weekly report → best-performers.md)
    ↑____________________________________________|
         (петля обратной связи)
```

---

## Контекст-файлы (shared memory между агентами)

В `/root/obsidian-vault/automation/`:

| Файл | Создаёт | Читают | Обновляется |
|------|---------|--------|-------------|
| `brand-style.md` | Brand Onboarding | Все агенты | При изменениях |
| `content-calendar.md` | Content Calendar | Все писатели | Еженедельно |
| `best-performers.md` | Performance Review | Calendar + Writers | Ежемесячно |
| `content-queue.md` | Social Media Manager | Publisher | Ежедневно |

---

## Что ставить прямо сейчас (пилот 2-4 недели)

### Фаза 1 (неделя 1-2): Foundation
1. **Brand Onboarding Agent** — создать brand-style.md для Smart Agent AI
2. **Content Intake Agent** — голос → заметка (с Whisper)
3. **Content Calendar Agent** — контент-план на неделю

### Фаза 2 (неделя 2-3): Content Creation
4. **Telegram Writer** — посты для основного канала
5. **X Writer** — треды для международной аудитории

### Фаза 3 (неделя 3-4): Distribution
6. **Publisher Agent** — автопостинг в Telegram + X
7. **Content Repurposer** — из поста в тред и обратно

### Фаза 4 (после пилота):
8. VK/Dzen/LinkedIn/Instagram Writers
9. Performance Review Agent (петля обратной связи)
10. Визуальный контент (изображения)

---

## Сводка: топ-решения с GitHub

| Репо | ★ | Что даёт | Статус |
|------|---|---------|--------|
| social-ai-team | 114 | Архитектура контент-команды | 🔥 Адаптируем |
| Agentfy | 400 | Multi-agent для соцсетей | 📖 Изучаем |
| automate-for-growth | 654 | Методология, content pillars | 📖 Берём концепции |
| social-media-scraping-apis | 1624 | API для всех платформ | 🔧 Пригодится |

[[Контент-отдел Smart Agent AI]] | [[Home]] | [[Агенты]]