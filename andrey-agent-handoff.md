# Smart Agent AI — пакет навыков и знаний для передачи Андрею

Дата выгрузки: 2026-05-28
Владелец: Дмитрий Чекмарев

## 1) Сводка
- Всего навыков (skills): **169**
- Включено: **169**
- Отключено: **0**
- Источники:
  - builtin: **85**
  - hub/official/community: **66**
  - local: **18**

> Ниже — полный список активных skills и перечень базы знаний Obsidian (без секретов, токенов и паролей).

---

## 2) Полный список skills (как на сервере сейчас)

```text
Installed Skills                                        
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━━━┳━━━━━━━━━┓
┃ Name                                ┃ Category             ┃ Source    ┃ Trust     ┃ Status  ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━━━╇━━━━━━━━━┩
│ agentic-business-analysis           │                      │ skills.sh │ community │ enabled │
│ dogfood                             │                      │ builtin   │ builtin   │ enabled │
│ obsidian-vault                      │                      │ local     │ local     │ enabled │
│ yuanbao                             │                      │ builtin   │ builtin   │ enabled │
│ blackbox                            │ autonomous-ai-agents │ official  │ official  │ enabled │
│ claude-code                         │ autonomous-ai-agents │ builtin   │ builtin   │ enabled │
│ codex                               │ autonomous-ai-agents │ builtin   │ builtin   │ enabled │
│ hermes-agent                        │ autonomous-ai-agents │ builtin   │ builtin   │ enabled │
│ hermes-gateway-incident-triage      │ autonomous-ai-agents │ local     │ local     │ enabled │
│ hermes-interactive-config           │ autonomous-ai-agents │ local     │ local     │ enabled │
│ honcho                              │ autonomous-ai-agents │ official  │ official  │ enabled │
│ kanban-codex-lane                   │ autonomous-ai-agents │ builtin   │ builtin   │ enabled │
│ opencode                            │ autonomous-ai-agents │ builtin   │ builtin   │ enabled │
│ evm                                 │ blockchain           │ official  │ official  │ enabled │
│ hyperliquid                         │ blockchain           │ official  │ official  │ enabled │
│ solana                              │ blockchain           │ official  │ official  │ enabled │
│ ai-consulting-proposal-agent        │ business             │ local     │ local     │ enabled │
│ business-automation-playbook        │ business             │ local     │ local     │ enabled │
│ autonomous-delivery-recovery        │ communication        │ local     │ local     │ enabled │
│ one-three-one-rule                  │ communication        │ official  │ official  │ enabled │
│ architecture-diagram                │ creative             │ builtin   │ builtin   │ enabled │
│ ascii-art                           │ creative             │ builtin   │ builtin   │ enabled │
│ ascii-video                         │ creative             │ builtin   │ builtin   │ enabled │
│ baoyu-article-illustrator           │ creative             │ builtin   │ builtin   │ enabled │
│ baoyu-comic                         │ creative             │ builtin   │ builtin   │ enabled │
│ baoyu-infographic                   │ creative             │ builtin   │ builtin   │ enabled │
│ blender-mcp                         │ creative             │ official  │ official  │ enabled │
│ claude-design                       │ creative             │ builtin   │ builtin   │ enabled │
│ comfyui                             │ creative             │ builtin   │ builtin   │ enabled │
│ concept-diagrams                    │ creative             │ official  │ official  │ enabled │
│ design-md                           │ creative             │ builtin   │ builtin   │ enabled │
│ excalidraw                          │ creative             │ builtin   │ builtin   │ enabled │
│ humanizer                           │ creative             │ builtin   │ builtin   │ enabled │
│ hyperframes                         │ creative             │ official  │ official  │ enabled │
│ ideation                            │ creative             │ builtin   │ builtin   │ enabled │
│ manim-video                         │ creative             │ builtin   │ builtin   │ enabled │
│ meme-generation                     │ creative             │ official  │ official  │ enabled │
│ p5js                                │ creative             │ builtin   │ builtin   │ enabled │
│ pixel-art                           │ creative             │ builtin   │ builtin   │ enabled │
│ popular-web-designs                 │ creative             │ builtin   │ builtin   │ enabled │
│ pretext                             │ creative             │ builtin   │ builtin   │ enabled │
│ sketch                              │ creative             │ builtin   │ builtin   │ enabled │
│ songwriting-and-ai-music            │ creative             │ builtin   │ builtin   │ enabled │
│ touchdesigner-mcp                   │ creative             │ builtin   │ builtin   │ enabled │
│ jupyter-live-kernel                 │ data-science         │ builtin   │ builtin   │ enabled │
│ autoposting-pipelines               │ devops               │ local     │ local     │ enabled │
│ cron-pipeline-recovery-and-backfill │ devops               │ local     │ local     │ enabled │
│ docker-management                   │ devops               │ official  │ official  │ enabled │
│ inference-sh-cli                    │ devops               │ local     │ local     │ enabled │
│ kanban-orchestrator                 │ devops               │ builtin   │ builtin   │ enabled │
│ kanban-worker                       │ devops               │ builtin   │ builtin   │ enabled │
│ pinggy-tunnel                       │ devops               │ official  │ official  │ enabled │
│ shared-hosting-deploy               │ devops               │ local     │ local     │ enabled │
│ sre-watchdog-automation             │ devops               │ local     │ local     │ enabled │
│ watchers                            │ devops               │ official  │ official  │ enabled │
│ webhook-subscriptions               │ devops               │ builtin   │ builtin   │ enabled │
│ wordpress-autoposting-orchestration │ devops               │ local     │ local     │ enabled │
│ adversarial-ux-test                 │ dogfood              │ official  │ official  │ enabled │
│ agentmail                           │ email                │ official  │ official  │ enabled │
│ himalaya                            │ email                │ builtin   │ builtin   │ enabled │
│ 3-statement-model                   │ finance              │ official  │ official  │ enabled │
│ comps-analysis                      │ finance              │ official  │ official  │ enabled │
│ dcf-model                           │ finance              │ official  │ official  │ enabled │
│ excel-author                        │ finance              │ official  │ official  │ enabled │
│ lbo-model                           │ finance              │ official  │ official  │ enabled │
│ merger-model                        │ finance              │ official  │ official  │ enabled │
│ pptx-author                         │ finance              │ official  │ official  │ enabled │
│ stocks                              │ finance              │ official  │ official  │ enabled │
│ minecraft-modpack-server            │ gaming               │ builtin   │ builtin   │ enabled │
│ pokemon-player                      │ gaming               │ builtin   │ builtin   │ enabled │
│ codebase-inspection                 │ github               │ builtin   │ builtin   │ enabled │
│ github-auth                         │ github               │ builtin   │ builtin   │ enabled │
│ github-code-review                  │ github               │ builtin   │ builtin   │ enabled │
│ github-issues                       │ github               │ builtin   │ builtin   │ enabled │
│ github-pr-workflow                  │ github               │ builtin   │ builtin   │ enabled │
│ github-repo-management              │ github               │ builtin   │ builtin   │ enabled │
│ fitness-nutrition                   │ health               │ official  │ official  │ enabled │
│ neuroskill-bci                      │ health               │ official  │ official  │ enabled │
│ fastmcp                             │ mcp                  │ official  │ official  │ enabled │
│ mcporter                            │ mcp                  │ official  │ official  │ enabled │
│ native-mcp                          │ mcp                  │ builtin   │ builtin   │ enabled │
│ gif-search                          │ media                │ builtin   │ builtin   │ enabled │
│ heartmula                           │ media                │ builtin   │ builtin   │ enabled │
│ songsee                             │ media                │ builtin   │ builtin   │ enabled │
│ spotify                             │ media                │ builtin   │ builtin   │ enabled │
│ youtube-content                     │ media                │ builtin   │ builtin   │ enabled │
│ openclaw-migration                  │ migration            │ official  │ official  │ enabled │
│ audiocraft-audio-generation         │ mlops                │ builtin   │ builtin   │ enabled │
│ axolotl                             │ mlops                │ official  │ official  │ enabled │
│ chroma                              │ mlops                │ official  │ official  │ enabled │
│ clip                                │ mlops                │ official  │ official  │ enabled │
│ dspy                                │ mlops                │ builtin   │ builtin   │ enabled │
│ evaluating-llms-harness             │ mlops                │ builtin   │ builtin   │ enabled │
│ faiss                               │ mlops                │ official  │ official  │ enabled │
│ guidance                            │ mlops                │ official  │ official  │ enabled │
│ huggingface-hub                     │ mlops                │ builtin   │ builtin   │ enabled │
│ instructor                          │ mlops                │ official  │ official  │ enabled │
│ llama-cpp                           │ mlops                │ builtin   │ builtin   │ enabled │
│ llava                               │ mlops                │ official  │ official  │ enabled │
│ nemo-curator                        │ mlops                │ official  │ official  │ enabled │
│ obliteratus                         │ mlops                │ builtin   │ builtin   │ enabled │
│ outlines                            │ mlops                │ official  │ official  │ enabled │
│ peft-fine-tuning                    │ mlops                │ local     │ local     │ enabled │
│ pinecone                            │ mlops                │ official  │ official  │ enabled │
│ pytorch-fsdp                        │ mlops                │ official  │ official  │ enabled │
│ pytorch-lightning                   │ mlops                │ official  │ official  │ enabled │
│ segment-anything-model              │ mlops                │ builtin   │ builtin   │ enabled │
│ serving-llms-vllm                   │ mlops                │ builtin   │ builtin   │ enabled │
│ simpo-training                      │ mlops                │ local     │ local     │ enabled │
│ slime-rl-training                   │ mlops                │ local     │ local     │ enabled │
│ tensorrt-llm                        │ mlops                │ official  │ official  │ enabled │
│ unsloth                             │ mlops                │ official  │ official  │ enabled │
│ weights-and-biases                  │ mlops                │ builtin   │ builtin   │ enabled │
│ whisper                             │ mlops                │ official  │ official  │ enabled │
│ obsidian                            │ note-taking          │ builtin   │ builtin   │ enabled │
│ obsidian-daily-digest               │ note-taking          │ local     │ local     │ enabled │
│ airtable                            │ productivity         │ builtin   │ builtin   │ enabled │
│ canvas                              │ productivity         │ official  │ official  │ enabled │
│ google-workspace                    │ productivity         │ builtin   │ builtin   │ enabled │
│ here.now                            │ productivity         │ local     │ local     │ enabled │
│ linear                              │ productivity         │ builtin   │ builtin   │ enabled │
│ maps                                │ productivity         │ builtin   │ builtin   │ enabled │
│ memento-flashcards                  │ productivity         │ official  │ official  │ enabled │
│ nano-pdf                            │ productivity         │ builtin   │ builtin   │ enabled │
│ notion                              │ productivity         │ builtin   │ builtin   │ enabled │
│ ocr-and-documents                   │ productivity         │ builtin   │ builtin   │ enabled │
│ powerpoint                          │ productivity         │ builtin   │ builtin   │ enabled │
│ shop-app                            │ productivity         │ official  │ official  │ enabled │
│ shopify                             │ productivity         │ official  │ official  │ enabled │
│ siyuan                              │ productivity         │ official  │ official  │ enabled │
│ teams-meeting-pipeline              │ productivity         │ builtin   │ builtin   │ enabled │
│ telephony                           │ productivity         │ official  │ official  │ enabled │
│ godmode                             │ red-teaming          │ builtin   │ builtin   │ enabled │
│ arxiv                               │ research             │ builtin   │ builtin   │ enabled │
│ bioinformatics                      │ research             │ official  │ official  │ enabled │
│ blogwatcher                         │ research             │ builtin   │ builtin   │ enabled │
│ darwinian-evolver                   │ research             │ official  │ official  │ enabled │
│ domain-intel                        │ research             │ official  │ official  │ enabled │
│ drug-discovery                      │ research             │ official  │ official  │ enabled │
│ duckduckgo-search                   │ research             │ official  │ official  │ enabled │
│ gitnexus-explorer                   │ research             │ official  │ official  │ enabled │
│ llm-wiki                            │ research             │ builtin   │ builtin   │ enabled │
│ osint-investigation                 │ research             │ official  │ official  │ enabled │
│ parallel-cli                        │ research             │ official  │ official  │ enabled │
│ polymarket                          │ research             │ builtin   │ builtin   │ enabled │
│ qmd                                 │ research             │ official  │ official  │ enabled │
│ research-paper-writing              │ research             │ builtin   │ builtin   │ enabled │
│ scrapling                           │ research             │ official  │ official  │ enabled │
│ searxng-search                      │ research             │ official  │ official  │ enabled │
│ 1password                           │ security             │ official  │ official  │ enabled │
│ oss-forensics                       │ security             │ official  │ official  │ enabled │
│ sherlock                            │ security             │ official  │ official  │ enabled │
│ openhue                             │ smart-home           │ builtin   │ builtin   │ enabled │
│ xurl                                │ social-media         │ builtin   │ builtin   │ enabled │
│ debugging-hermes-tui-commands       │ software-development │ builtin   │ builtin   │ enabled │
│ hermes-agent-skill-authoring        │ software-development │ builtin   │ builtin   │ enabled │
│ hermes-s6-container-supervision     │ software-development │ builtin   │ builtin   │ enabled │
│ node-inspect-debugger               │ software-development │ builtin   │ builtin   │ enabled │
│ plan                                │ software-development │ builtin   │ builtin   │ enabled │
│ python-debugpy                      │ software-development │ builtin   │ builtin   │ enabled │
│ requesting-code-review              │ software-development │ builtin   │ builtin   │ enabled │
│ rest-graphql-debug                  │ software-development │ official  │ official  │ enabled │
│ spike                               │ software-development │ builtin   │ builtin   │ enabled │
│ subagent-driven-development         │ software-development │ builtin   │ builtin   │ enabled │
│ systematic-debugging                │ software-development │ builtin   │ builtin   │ enabled │
│ test-driven-development             │ software-development │ builtin   │ builtin   │ enabled │
│ writing-plans                       │ software-development │ builtin   │ builtin   │ enabled │
│ page-agent                          │ web-development      │ official  │ official  │ enabled │
│ web-studio-orchestrator             │ web-development      │ local     │ local     │ enabled │
└─────────────────────────────────────┴──────────────────────┴───────────┴───────────┴─────────┘
66 hub-installed, 85 builtin, 18 local — 169 enabled, 0 disabled
```

---

## 3) База знаний (Obsidian vault) — рабочие заметки
Путь: `/root/obsidian-vault`

### Файлы знаний (.md)
- /root/obsidian-vault/obsidian-structure.md
- /root/obsidian-vault/obsidian-vault-structure.md
- /root/obsidian-vault/obsidian-setup-smart-agent-ai.md
- /root/obsidian-vault/Как подключен мой Obsidian (Smart Agent AI).md
- /root/obsidian-vault/Структура хранилища Obsidian.md
- /root/obsidian-vault/meetings/Единый дневник операций.md
- /root/obsidian-vault/projects/youtube-money-system/plans/90-day-execution-board.md
- /root/obsidian-vault/projects/youtube-money-system/plans/version-2-18plus-funnel.md
- /root/obsidian-vault/projects/youtube-money-system/plans/version-1-safe-youtube.md
- /root/obsidian-vault/projects/youtube-money-system/plans/90-day-plan.md
- /root/obsidian-vault/projects/youtube-money-system/agents/roles.md
- /root/obsidian-vault/projects/youtube-money-system/donors/README.md
- /root/obsidian-vault/meetings/2026-05-26 Дайджест.md
- /root/obsidian-vault/projects/Approval-Protocol-Executive-Report.md
- /root/obsidian-vault/projects/KPI-Shield-Revenue.md
- /root/obsidian-vault/projects/VK-Publishing-Contour-SemiAuto.md
- /root/obsidian-vault/projects/Crosslink-Registry-RU.md
- /root/obsidian-vault/projects/RU-Brand-Autopilot-Execution-Board.md
- /root/obsidian-vault/projects/Go-To-Market-Россия-VK-Dzen.md
- /root/obsidian-vault/projects/Личный-бренд-автономная-система.md
- /root/obsidian-vault/projects/GitHub-Личный-бренд-Дмитрия.md
- /root/obsidian-vault/meetings/2026-05-25 Дайджест.md
- /root/obsidian-vault/projects/Smart Agent Ai - Battle Setup Socials.md
- /root/obsidian-vault/projects/Smart Agent Ai - Social Media Agent Architecture.md
- /root/obsidian-vault/projects/Smart Agent Ai - Luxury Pinned Post.md
- /root/obsidian-vault/projects/Smart Agent Ai - Luxury Commercial Offer Template.md
- /root/obsidian-vault/projects/Smart Agent Ai - 7 Day Luxury Content Plan.md
- /root/obsidian-vault/projects/Smart Agent Ai - Sales Scripts.md
- /root/obsidian-vault/projects/Smart Agent Ai - Revenue Engine.md
- /root/obsidian-vault/projects/Smart Agent Ai - Posts Pack.md
- /root/obsidian-vault/projects/Smart Agent Money System.md
- /root/obsidian-vault/Home.md
- /root/obsidian-vault/meetings/2026-05-22 Дайджест.md
- /root/obsidian-vault/meetings/2026-05-21 Дайджест.md
- /root/obsidian-vault/meetings/2026-05-20 Дайджест.md
- /root/obsidian-vault/meetings/2026-05-19 Дайджест.md
- /root/obsidian-vault/learning/Hermes Agent - голосовое управление.md
- /root/obsidian-vault/templates/Insight.md
- /root/obsidian-vault/meetings/2026-05-19 Настройка Hermes.md
- /root/obsidian-vault/automation/brand-style.md
- /root/obsidian-vault/automation/GitHub Research - Content Factory.md
- /root/obsidian-vault/agents/Агенты.md
- /root/obsidian-vault/projects/Проекты.md
- /root/obsidian-vault/projects/Контент-отдел Smart Agent AI.md
- /root/obsidian-vault/meetings/2026-05-19 Daily.md
- /root/obsidian-vault/clients/CRM.md
- /root/obsidian-vault/clients/Клиенты.md
- /root/obsidian-vault/templates/Daily Note.md
- /root/obsidian-vault/company/Методология.md
- /root/obsidian-vault/company/Smart Agent AI.md

---

## 4) Что передавать Андрею
1. Этот файл (как паспорт настроек и знаний).
2. Папку skills (если нужно перенести 1-в-1): `~/.hermes/skills/`
3. Папку базы знаний: `/root/obsidian-vault/`

## 5) Важно
- Секреты и ключи API в этот файл **не включены**.
- Для запуска у Андрея нужны его собственные ключи/токены в `.env`.
