Obsidian vault is the primary knowledge base: /root/obsidian-vault. Hermes memory source files live under /root/obsidian-vault/agents/hermes-memory/; startup context file: /root/obsidian-vault/agents/hermes-memory/context-bootstrap.md; daily booster: /root/obsidian-vault/agents/hermes-memory/daily-context-booster.md.
§
Memory Contract for the default Hermes agent: /root/obsidian-vault/agents/Memory-Contract-Hermes-Default.md; it is the source of truth for memory hygiene and conflicts.
§
Supabase memory mirror is managed by /root/.hermes/scripts/hermes_memory_sync.py and schema /root/supabase-work/supabase/migrations/20260602_hermes_memory_documents.sql. Current project ref hagmwnadcvdravmhedcd is unavailable until Supabase DNS/project/token is restored.
§
Smart Agent AI context: Дмитрий Чекмарев, Telegram gateway on Ubuntu server, Hermes Agent. Detailed company/project/agent state belongs in Obsidian, not local durable memory.
§
Autostart58/autoschool content pipeline has a hard anti-repeat requirement for visuals: repeated article/Telegram cover photos are unacceptable; cron scripts should enforce image history/dedup, not rely on prompts.
§
Hermes researcher agent installed as profile `researcher` from /root/agents/hermes-researcher-agent; launch via `researcher`, `researcher-agent`, or `hermes -p researcher chat`.