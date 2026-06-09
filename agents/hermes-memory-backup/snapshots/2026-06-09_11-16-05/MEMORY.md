Obsidian vault is the primary knowledge base: /root/obsidian-vault. Hermes memory/context files: /root/obsidian-vault/agents/hermes-memory/. Memory contract: /root/obsidian-vault/agents/Memory-Contract-Hermes-Default.md.
§
Smart Agent AI context belongs in Obsidian, not local durable memory; local memory should stay as short pointers/rules only.
§
Model routing: primary openai-codex/gpt-5.5; if rate-limited, fallback to deepseek/deepseek-v4-pro, then OpenRouter Claude/Gemini; switch back to Codex when recovered.
§
Hermes VPS has 1GB RAM; keep concurrency low. n8n removed; do not suggest n8n.
§
Project-specific long context, current agent states, reports, prompts, revenue status, and UI briefs belong in Obsidian project notes, not durable memory.
§
VK access configured: app 54628476, user 8314079. User token with messages+offline scope. Credentials stored in /root/obsidian-vault/agents/hermes-memory/vk-credentials.md
§
VK Department project is stored at /root/obsidian-vault/projects/vk-department. Publisher script: /root/.hermes/scripts/vk_department_publish.py. Active VK cron jobs post 2/day each to dikaya_kleshnya and smart_agent_ai.
