---
type: hermes-memory-local-current
target: memory
updated_at: 2026-06-07T17:46:11.787752+00:00
---
# MEMORY.local-current

Obsidian vault is the primary knowledge base: /root/obsidian-vault. Hermes memory/context files: /root/obsidian-vault/agents/hermes-memory/. Memory contract: /root/obsidian-vault/agents/Memory-Contract-Hermes-Default.md.
§
Smart Agent AI context belongs in Obsidian, not local durable memory; local memory should stay as short pointers/rules only.
§
Model routing: primary openai-codex/gpt-5.5; if rate-limited, fallback to deepseek/deepseek-v4-pro, then OpenRouter Claude/Gemini; switch back to Codex when recovered.
§
Hermes VPS has 1GB RAM; keep concurrency low. n8n removed; do not suggest n8n.
§
Project-specific long context, current agent states, reports, prompts, revenue status, and UI briefs belong in Obsidian project notes, not durable memory.
