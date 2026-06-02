В этом окружении правки credentials-файла из агентских file-tools недоступны; рабочий обходной путь — shell-редактирование через terminal. Для применения изменений конфигурации Hermes Gateway требуется перезапуск сервиса.
§
Компания: Smart Agent AI. Основатель: Дмитрий Чекмарев (dimachekmarev, dimachekmarv@gmail.com), Telegram ID 811372815. Сервер: Ubuntu 24.04, Hermes Agent, Telegram gateway. Default model: openai-codex gpt-5.5; YandexGPT fallback/profile `yandex-economy` configured.
§
Obsidian vault: /root/obsidian-vault (OBSIDIAN_VAULT_PATH). Структура: Home.md (индекс), company/ (Smart Agent AI, Методология), clients/ (Клиенты, CRM), projects/ (Проекты), agents/ (Агенты), automation/, meetings/, learning/, templates/ (Daily Note). Используется как база знаний компании. Навык obsidian-vault загружается для операций с хранилищем.
§
Telegram attachment quirk: if MEDIA file names contain Cyrillic or special characters, delivery may fail. For reliable sending, create/send a duplicate with a short ASCII filename.
§
Ограничение «гео Бараново, 22Б; не упоминать Краснодар» применяется только в контексте проекта «Дикая Клешня», не как общее правило.
§
Memory Contract для основного агента хранится в Obsidian: /root/obsidian-vault/agents/Memory-Contract-Hermes-Default.md; при конфликте памяти с файлами приоритет у этого контракта и source of truth.
§
Текущий приоритет пользователя: улучшение качества работы главного агента (самоулучшение, стабильность, точность).
§
Для workflow Pinterest marketing report в n8n email получателя: Dimachekmarev84@gmail.com.
§
В Hermes skills installer внешние community-SKILL с паттерном `curl ... | bash` получают verdict DANGEROUS и блокируются без возможности override через --force; их нужно вручную санировать и ставить из локального файла.