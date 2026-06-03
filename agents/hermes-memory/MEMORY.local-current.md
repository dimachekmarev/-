---
type: hermes-memory-local-current
target: memory
updated_at: 2026-06-03T15:07:29.072775+00:00
---
# MEMORY.local-current

Obsidian vault is the primary knowledge base: /root/obsidian-vault. Hermes memory source files live under /root/obsidian-vault/agents/hermes-memory/; startup context file: /root/obsidian-vault/agents/hermes-memory/context-bootstrap.md; daily booster: /root/obsidian-vault/agents/hermes-memory/daily-context-booster.md.
§
Memory Contract for the default Hermes agent: /root/obsidian-vault/agents/Memory-Contract-Hermes-Default.md; it is the source of truth for memory hygiene and conflicts.
§
Smart Agent AI context: Дмитрий Чекмарев, Telegram gateway on Ubuntu server, Hermes Agent. Detailed company/project/agent state belongs in Obsidian, not local durable memory.
§
Autostart58/autoschool content pipeline has a hard anti-repeat requirement for visuals: repeated article/Telegram cover photos are unacceptable; cron scripts should enforce image history/dedup, not rely on prompts.
§
Hermes researcher agent installed as profile `researcher` from /root/agents/hermes-researcher-agent (v0.2.1, AlekseiUL). Uses deepseek-v4-pro via deepseek provider (dpqv4.pro). Alias: `researcher`. Launch: `hermes -p researcher chat` or `researcher` (if alias is set). Skills include research-intelligence (source ladders, evidence gate, browser verification). CLI-only profile — no gateway, no cron.
§
Codex 5.5 fallback rule: When Codex limits exhaust, immediately switch to dpqv4.pro (deepseek provider, deepseek-v4-pro model at api.deepseek.com) — NOT to OpenRouter. The dpqv4.pro deepseek path is the primary duplicating fallback. Default profile already uses provider=deepseek, model=deepseek-v4-pro. This is the user's preferred fallback when Codex goes down.
§
Numerologic CO-CEO: autonomous business agent with SQLite backend (ceo.db), tiered report generation, Hermes profile `numerologic-ceo` on deepseek-v4-pro, cron: daily reports (07 UTC) + daily decisions (08 UTC). Backend CLI: /root/.hermes/scripts/numerologic_ceo.py. Site at dimachekmarev/numerologic with GitHub Actions auto-deploy (needs Pages enabled manually once).
