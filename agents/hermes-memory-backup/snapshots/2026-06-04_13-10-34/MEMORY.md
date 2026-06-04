Obsidian vault is the primary knowledge base: /root/obsidian-vault. Hermes memory source files live under /root/obsidian-vault/agents/hermes-memory/; startup context file: /root/obsidian-vault/agents/hermes-memory/context-bootstrap.md; daily booster: /root/obsidian-vault/agents/hermes-memory/daily-context-booster.md.
§
Memory Contract for the default Hermes agent: /root/obsidian-vault/agents/Memory-Contract-Hermes-Default.md; it is the source of truth for memory hygiene and conflicts.
§
Smart Agent AI context: Дмитрий Чекмарев, Telegram gateway on Ubuntu server, Hermes Agent. Detailed company/project/agent state belongs in Obsidian, not local durable memory.
§
Autostart58/autoschool content pipeline has a hard anti-repeat requirement for visuals: repeated article/Telegram cover photos are unacceptable; cron scripts should enforce image history/dedup, not rely on prompts.
§
Researcher agent: profile `researcher` v0.2.1, deepseek-v4-pro, CLI-only, skills: research-intelligence.
§
Model priority: PRIMARY = openai-codex / gpt-5.5. When Codex limits exhaust (429/rate-limit), fall back to deepseek/deepseek-v4-pro at api.deepseek.com. When Codex limits recover, switch BACK to Codex as primary — do NOT stay on DeepSeek. DeepSeek is RESERVE, not default. The fallback chain is: 1) deepseek/deepseek-v4-pro, 2) openrouter anthropic/claude-sonnet-4.6, 3) openrouter google/gemini-2.5-pro. NOT OpenRouter as first fallback.
§
Numerologic CO-CEO: profile `numerologic-ceo` (deepseek-v4-pro), ceo.db backend, cron: daily reports+decisions. Stitch prompt: /root/web-projects/numerologic/STITCH_PROMPT.md. Site: dimachekmarev/numerologic (GH Actions, Pages needs manual enable). Revenue claims require real payment-provider/bank confirmation; mock/test/manual SQLite records count as 0 ₽.
§
n8n Docker removed — freed 2.7G. Disk: 81% (2.7G free). Do not suggest n8n.
§
UI design: user prefers Google Stitch over agent-generated HTML/CSS; write detailed English Stitch prompts and implement output. Numerologic UI should be bright, modern, friendly, feminine/light app/PWA for RU women, not dark mystical; focus on mini-analysis → paid reports → Club subscription → add-ons.