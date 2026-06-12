Obsidian vault: /root/obsidian-vault (primary KB). Hermes memory files: agents/hermes-memory/. Long context/reports/revenue/UI briefs → Obsidian. Local durable memory → short pointers only.
§
Model routing FIXED: config.yaml primary=openai-codex/gpt-5.5, fallback=[deepseek/deepseek-v4-pro → openrouter/anthropic/claude-sonnet-4-20250514]. Session /model override if stuck.
§
Hermes VPS: 2 CPU, 1.9 GB RAM, 29 GB disk (18 GB free), NO swap configured. Keep concurrency low but not as strict as when it was 1 GB.
§
VK: app 54628476, user 8314079. Token with wall+messages+offline. Creds: /root/obsidian-vault/agents/hermes-memory/vk-credentials.md. POST 09:00-22:00 MSK ONLY. Delete by from_id==8314079, never text. Dept proj: /root/obsidian-vault/projects/vk-department. 2/day to dikaya_kleshnya+smart_agent_ai. Publisher: vk_department_publish.py
§
Standalone Codex CLI is configured for Evidence Runner: `/usr/local/bin/walter-evidence` wraps `/root/tools/codex-cli-evidence-runner/scripts/walter`; `~/.codex/auth.json` is bridged from Hermes `openai-codex` OAuth; `~/.codex/config.toml` uses top-level `model = "gpt-5.5"`.
§
Yandex Disk is connected via rclone remote `yandex:` using OAuth. Dedicated skill: `yandex-disk-agent`; Obsidian notes: `/root/obsidian-vault/agents/hermes-memory/yandex-disk-agent.md` and `yandex-disk-inventory.md`; daily local inventory cron job updates the index.
§
dikayakleshnya.ru — Reg.Ru (IP 31.31.198.57, nginx). SSH: u3439587 / sMd0S3v3uDUF87cV. Path: /var/www/u3439587/data/www/dikayakleshnya.ru/. Deploy: sshpass+rsync via SSH. FTP pass (different): PgeJjiqw51PZ10lA. NEVER suggest Vercel/redeploy — site already live. Always check memory before proposing hosting solutions.