---
type: hermes-memory-local-current
target: memory
updated_at: 2026-06-12T15:44:11.969556+00:00
---
# MEMORY.local-current

Obsidian vault: /root/obsidian-vault (primary KB). Hermes memory files: agents/hermes-memory/. Long context/reports/revenue/UI briefs → Obsidian. Local durable memory → short pointers only.
§
Hermes VPS: 2 CPU, 1.9 GB RAM, 29 GB disk, 2 GB swap enabled at /swapfile. Keep concurrency low: one heavy code/build task plus light watchdogs.
§
VK: app 54628476, user 8314079. Token with wall+messages+offline. Creds: /root/obsidian-vault/agents/hermes-memory/vk-credentials.md. POST 09:00-22:00 MSK ONLY. Delete by from_id==8314079, never text. Dept proj: /root/obsidian-vault/projects/vk-department. 2/day to dikaya_kleshnya+smart_agent_ai. Publisher: vk_department_publish.py
§
Standalone Codex CLI is configured for Evidence Runner: `/usr/local/bin/walter-evidence` wraps `/root/tools/codex-cli-evidence-runner/scripts/walter`; `~/.codex/auth.json` is bridged from Hermes `openai-codex` OAuth; `~/.codex/config.toml` uses top-level `model = "gpt-5.5"`.
§
Yandex Disk is connected via rclone remote `yandex:` using OAuth. Dedicated skill: `yandex-disk-agent`; Obsidian notes: `/root/obsidian-vault/agents/hermes-memory/yandex-disk-agent.md` and `yandex-disk-inventory.md`; daily local inventory cron job updates the index.
§
dikayakleshnya.ru — Reg.Ru hosting (IP 31.31.198.57, nginx). Server path: /var/www/u3439587/data/www/dikayakleshnya.ru/. Deploy/update: rsync over SSH using credentials from secure credential note, not from durable memory. NEVER suggest Vercel/redeploy — site already live. Always check memory before proposing hosting solutions.
§
Hermes model auto-router is installed: /root/.hermes/scripts/hermes_model_router.py via cron job b2653f8887df every 5m. Codex gpt-5.5 is primary; after repeated Codex failures it switches to DeepSeek v4 pro; when Codex probe succeeds it returns to Codex and restarts gateway.
