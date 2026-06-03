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
§
Hermes researcher agent installed as profile `researcher` from /root/agents/hermes-researcher-agent (v0.2.1, AlekseiUL). Uses deepseek-v4-pro via deepseek provider (dpqv4.pro). Alias: `researcher`. Launch: `hermes -p researcher chat` or `researcher` (if alias is set). Skills include research-intelligence (source ladders, evidence gate, browser verification). CLI-only profile — no gateway, no cron.
§
Codex 5.5 fallback rule: When Codex limits exhaust, immediately switch to dpqv4.pro (deepseek provider, deepseek-v4-pro model at api.deepseek.com) — NOT to OpenRouter. The dpqv4.pro deepseek path is the primary duplicating fallback. Default profile already uses provider=deepseek, model=deepseek-v4-pro. This is the user's preferred fallback when Codex goes down.