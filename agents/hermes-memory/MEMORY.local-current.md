---
type: hermes-memory-local-current
target: memory
updated_at: 2026-06-15T17:20:23.771052+00:00
---
# MEMORY.local-current

Obsidian vault: /root/obsidian-vault; reports/briefs → Obsidian. Hermes reports Telegram group: -1002143793106 “Отчеты по проектам” (invite t.me/+R7mjRLI-4GA1Zjcy).
§
Hermes VPS: 2 CPU, 1.9 GB RAM, 29 GB disk, 2 GB swap enabled at /swapfile. Keep concurrency low: one heavy code/build task plus light watchdogs.
§
VK: app 54628476, user 8314079. Token with wall+messages+offline. Creds: /root/obsidian-vault/agents/hermes-memory/vk-credentials.md. POST 09:00-22:00 MSK ONLY. Delete by from_id==8314079, never text. Dept proj: /root/obsidian-vault/projects/vk-department. 2/day to dikaya_kleshnya+smart_agent_ai. Publisher: vk_department_publish.py
§
Yandex Disk is connected via rclone remote `yandex:` using OAuth. Dedicated skill: `yandex-disk-agent`; Obsidian notes: `/root/obsidian-vault/agents/hermes-memory/yandex-disk-agent.md` and `yandex-disk-inventory.md`; daily local inventory cron job updates the index.
§
Reg.Ru ISPmanager: 31.31.198.57, u3439587, passwd sMd0S3v3uDUF87cV. Sites: dikayakleshnya.ru (Yandex Pay shopId=8c2d2d92-05d0-4e68-9acf-254ed0933fd4, API-ключ не сгенерирован, PHP /api/pay/), uforma-med.ru (Next.js 16, 160 продуктов, медодежда, Красная 53 Пенза, DNS ISPmanager→BIND ждёт синхронизации). /var/www/u3439587/data/www/<domain>/. Codex custom:codex-balance→codex-only.onrender.com.
§
YouTube Agent Video Factory: heavy assets live on Yandex Disk `yandex:YouTube_Money_System/Agent_Video_Factory/`; Obsidian/memory keep only indexes and links.
§
Dmitry's YouTube Agent Video Factory should target global English audiences when monetization/RPM matters; he dislikes vague names like NEUROLUX and wants clear channel positioning.
§
Model config: primary=openai-codex/gpt-5.5. codex-balance custom provider is registered as custom:codex-balance via codex-only.onrender.com, but its endpoint currently returns HTTP 200 with empty body, so it must not be primary until a real JSON/OK smoke test passes. DeepSeek is manual-only per Dmitry; do not auto-switch to it.
