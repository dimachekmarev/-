# Skill Cleanup Inventory

Обновлено: 2026-06-09T11:20:54.026391+00:00

Формат: номер — skill — категория — коротко. Удаление/архив — только после выбора Дмитрия по номерам.

1. `autonomous-delivery-recovery` — .archive — Ведение автономных проектов при фрустрации пользователя из-за пропавшей работы: быстрый recovery, accountability-отчёт и немедленное продолжение
2. `cron-pipeline-recovery-and-backfill` — .archive — Recover failed multi-job cron pipelines, identify root cause from job outputs, and backfill missed business-critical delivery safely.
3. `hermes-gateway-incident-triage` — .archive — Diagnose Hermes messaging incidents by separating transport issues from provider/model/auth/billing failures, then recover with a verified end-to-end check.
4. `russian-content-quality-gate-autopost` — .archive — Enforce a hard Russian-language quality gate (linguist + anti-AI humanizer) before any social autopost publication.
5. `safe-disk-pressure-recovery` — .archive — Recover Linux hosts from low-disk incidents safely (especially before Docker/app installs) using preview-first cleanup, explicit consent, and staged execution.
6. `shared-hosting-deploy` — .archive — Деплой статических сайтов на shared-хостинг (Beget, Timeweb и аналоги) через SSH. Next.js static export, загрузка в public_html.
7. `yandex-cloud-auth-setup` — .archive — Подключение Yandex Cloud к агенту без путаницы между типами ключей (API key, static access key, authorized key JSON, IAM token).
8. `agentic-business-analysis` — agentic-business-analysis — Use when analyzing a business to find safe, measurable AI-agent automation opportunities: process mapping, opportunity scoring, agent role design, approval gates, and 2-4 week pilot scope.
9. `apple-reminders` — apple — Apple Reminders via remindctl: add, list, complete.
10. `findmy` — apple — Track Apple devices/AirTags via FindMy.app on macOS.
11. `imessage` — apple — Send and receive iMessages/SMS via the imsg CLI on macOS.
12. `blackbox` — autonomous-ai-agents — Delegate coding tasks to Blackbox AI CLI agent. Multi-model agent with built-in judge that runs tasks through multiple LLMs and picks the best result. Requires the blackbox CLI and a Blackbox AI API key.
13. `claude-code` — autonomous-ai-agents — Delegate coding to Claude Code CLI (features, PRs).
14. `codex` — autonomous-ai-agents — Delegate coding to OpenAI Codex CLI (features, PRs).
15. `hermes-agent` — autonomous-ai-agents — Configure, extend, or contribute to Hermes Agent.
16. `hermes-operator-support` — autonomous-ai-agents — Use when operating Hermes with a user in the loop: interactive configuration, gateway/provider incident triage, remote terminal coaching, and frustration recovery.
17. `hermes-profile-distribution-installs` — autonomous-ai-agents — Install, adapt, and verify third-party Hermes profile distributions as separate agents/profiles.
18. `honcho` — autonomous-ai-agents — Configure and use Honcho memory with Hermes -- cross-session user modeling, multi-profile peer isolation, observation config, dialectic reasoning, session summaries, and context budget enforcement. Use when setting up Honcho, troubleshootin
19. `kanban-codex-lane` — autonomous-ai-agents — Use when a Hermes Kanban worker wants to run Codex CLI as an isolated implementation lane while Hermes keeps ownership of task lifecycle, reconciliation, testing, and handoff.
20. `opencode` — autonomous-ai-agents — Delegate coding to OpenCode CLI (features, PR review).
21. `evm` — blockchain — Read-only EVM client: wallets, tokens, gas across 8 chains.
22. `hyperliquid` — blockchain — Hyperliquid market data, account history, trade review.
23. `solana` — blockchain — Query Solana blockchain data with USD pricing — wallet balances, token portfolios with values, transaction details, NFTs, whale detection, and live network stats. Uses Solana RPC + CoinGecko. No API key required.
24. `business-automation-playbook` — business — Use when analyzing a business for AI-agent automation, decomposing processes, scoring opportunities, designing agent roles, or scoping 2-4 week pilots. Adapted from AlekseiUL/agentic-business-analysis and Sprut_AI methodology.
25. `client-commercial-growth-ops` — business — Use when building client-facing commercial growth assets: AI consulting proposal agents, polished КП/PDF offers, pricing packages, and social-channel launch sprints.
26. `one-three-one-rule` — communication — >
27. `telegram-project-channel-operations` — communication — Configure Telegram project channels and bots with clear separation between sales/public content and internal reports.
28. `architecture-diagram` — creative — Dark-themed SVG architecture/cloud/infra diagrams as HTML.
29. `ascii-art` — creative — ASCII art: pyfiglet, cowsay, boxes, image-to-ascii.
30. `ascii-video` — creative — ASCII video: convert video/audio to colored ASCII MP4/GIF.
31. `baoyu-article-illustrator` — creative — Article illustrations: type × style × palette consistency.
32. `baoyu-comic` — creative — Knowledge comics (知识漫画): educational, biography, tutorial.
33. `baoyu-infographic` — creative — Infographics: 21 layouts x 21 styles (信息图, 可视化).
34. `blender-mcp` — creative — Control Blender directly from Hermes via socket connection to the blender-mcp addon. Create 3D objects, materials, animations, and run arbitrary Blender Python (bpy) code. Use when user wants to create or modify anything in Blender.
35. `claude-design` — creative — Design one-off HTML artifacts (landing, deck, prototype).
36. `comfyui` — creative — Generate images, video, and audio with ComfyUI — install, launch, manage nodes/models, run workflows with parameter injection. Uses the official comfy-cli for lifecycle and direct REST/WebSocket API for execution.
37. `concept-diagrams` — creative — Generate flat, minimal light/dark-aware SVG diagrams as standalone HTML files, using a unified educational visual language with 9 semantic color ramps, sentence-case typography, and automatic dark mode. Best suited for educational and non-s
38. `creative-ideation` — creative — Generate project ideas via creative constraints.
39. `design-md` — creative — Author/validate/export Google's DESIGN.md token spec files.
40. `excalidraw` — creative — Hand-drawn Excalidraw JSON diagrams (arch, flow, seq).
41. `humanizer` — creative — Humanize text: strip AI-isms and add real voice.
42. `hyperframes` — creative — Create HTML-based video compositions, animated title cards, social overlays, captioned talking-head videos, audio-reactive visuals, and shader transitions using HyperFrames. HTML is the source of truth for video. Use when the user wants a r
43. `manim-video` — creative — Manim CE animations: 3Blue1Brown math/algo videos.
44. `meme-generation` — creative — Generate real meme images by picking a template and overlaying text with Pillow. Produces actual .png meme files.
45. `p5js` — creative — p5.js sketches: gen art, shaders, interactive, 3D.
46. `pixel-art` — creative — Pixel art w/ era palettes (NES, Game Boy, PICO-8).
47. `popular-web-designs` — creative — 54 real design systems (Stripe, Linear, Vercel) as HTML/CSS.
48. `pretext` — creative — Use when building creative browser demos with @chenglou/pretext — DOM-free text layout for ASCII art, typographic flow around obstacles, text-as-geometry games, kinetic typography, and text-powered generative art. Produces single-file HTML 
49. `sketch` — creative — Throwaway HTML mockups: 2-3 design variants to compare.
50. `songwriting-and-ai-music` — creative — Songwriting craft and Suno AI music prompts.
51. `touchdesigner-mcp` — creative — Control a running TouchDesigner instance via twozero MCP — create operators, set parameters, wire connections, execute Python, build real-time visuals. 36 native tools.
52. `jupyter-live-kernel` — data-science — Iterative Python via live Jupyter kernel (hamelnb).
53. `autonomous-content-pipeline-operations` — devops — Use when building, monitoring, recovering, or quality-gating autonomous content/publishing pipelines with Hermes cron, scripts, WordPress, Telegram/MAX, and watchdogs.
54. `autoposting-pipelines` — devops — Class-level playbook for building and operating reliable autoposting pipelines across channels (Telegram, WordPress custom endpoints) with quality gates, anti-repeat state, scheduling, and incident recovery.
55. `cli` — devops — Run 150+ AI apps via inference.sh CLI (infsh) — image generation, video creation, LLMs, search, 3D, social automation. Uses the terminal tool. Triggers: inference.sh, infsh, ai apps, flux, veo, image generation, video generation, seedream, 
56. `cloud-credential-intake-and-validation` — devops — Intake and validate cloud credentials in chat without loops: identify credential type early, request only missing artifacts, and verify with minimal safe probes.
57. `deployment-and-host-recovery` — devops — Use when deploying static sites to shared hosting or recovering host capacity safely: SSH/FTP discovery, static export upload, WordPress-protection, disk-pressure cleanup, and verification.
58. `docker-management` — devops — Manage Docker containers, images, volumes, networks, and Compose stacks — lifecycle ops, debugging, cleanup, and Dockerfile optimization.
59. `hermes-cron-reliability-operations` — devops — Operate Hermes cron jobs as an SRE/watchdog: inspect critical jobs, recover paused/error/stale jobs, force runs, and verify scheduler health.
60. `kanban-orchestrator` — devops — Decomposition playbook + anti-temptation rules for an orchestrator profile routing work through Kanban. The "don't do the work yourself" rule and the basic lifecycle are auto-injected into every kanban worker's system prompt; this skill is 
61. `kanban-worker` — devops — Pitfalls, examples, and edge cases for Hermes Kanban workers. The lifecycle itself is auto-injected into every worker's system prompt as KANBAN_GUIDANCE (from agent/prompt_builder.py); this skill is what you load when you want deeper detail
62. `pinggy-tunnel` — devops — Zero-install localhost tunnels over SSH via Pinggy.
63. `watchers` — devops — Poll RSS, JSON APIs, and GitHub with watermark dedup.
64. `webhook-subscriptions` — devops — Webhook subscriptions: event-driven agent runs.
65. `adversarial-ux-test` — dogfood — Roleplay the most difficult, tech-resistant user for your product. Browse the app as that persona, find every UX pain point, then filter complaints through a pragmatism layer to separate real problems from noise. Creates actionable tickets 
66. `dogfood` — dogfood — Exploratory QA of web apps: find bugs, evidence, reports.
67. `agentmail` — email — Give the agent its own dedicated email inbox via AgentMail. Send, receive, and manage email autonomously using agent-owned email addresses (e.g. hermes-agent@agentmail.to).
68. `himalaya` — email — Himalaya CLI: IMAP/SMTP email from terminal.
69. `changelog-generator` — external-codex — Automatically creates user-facing changelogs from git commits by analyzing commit history, categorizing changes, and transforming technical commits into clear, customer-friendly release notes. Turns hours of manual changelog writing into mi
70. `content-research-writer` — external-codex — Assists in writing high-quality content by conducting research, adding citations, improving hooks, iterating on outlines, and providing real-time feedback on each section. Transforms your writing process from solo effort to collaborative pa
71. `create-plan` — external-codex — Create a concise plan. Use when a user explicitly asks for a plan related to a coding task.
72. `email-draft-polish` — external-codex — Draft, rewrite, or condense emails with target tone, length, and audience; use for cold outreach, replies, status updates, or escalations where clarity and brevity matter.
73. `gh-fix-ci` — external-codex — Inspect GitHub PR checks with gh, pull failing GitHub Actions logs, summarize failure context, then create a fix plan and implement after user approval. Use when a user asks to debug or fix failing PR CI/CD checks on GitHub Actions and want
74. `internal-comms` — external-codex — A set of resources to help me write all kinds of internal communications, using the formats that my company likes to use. Claude should use this skill whenever asked to write some sort of internal communications (status reports, leadership 
75. `mcp-builder` — external-codex — Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Use when building MCP servers to integrate external APIs or services, whether in Python (F
76. `skill-share` — external-codex — A skill that creates new Claude skills and automatically shares them on Slack using Rube for seamless team collaboration and skill discovery.
77. `support-ticket-triage` — external-codex — Triage customer support tickets/emails/chats into categories, priority, and next action; draft responses and create reproducible steps; use for Zendesk/Intercom/Help Scout exports or pasted threads.
78. `webapp-testing` — external-codex — Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs.
79. `3-statement-model` — finance — Build fully-integrated 3-statement models (IS, BS, CF) in Excel with working capital schedules, D&A roll-forwards, debt schedule, and the plugs that make cash and retained earnings tie. Pairs with excel-author.
80. `comps-analysis` — finance — Build comparable company analysis in Excel — operating metrics, valuation multiples, statistical benchmarking vs peer sets. Pairs with excel-author. Use for public-company valuation, IPO pricing, sector benchmarking, or outlier detection.
81. `dcf-model` — finance — Build institutional-quality DCF valuation models in Excel — revenue projections, FCF build, WACC, terminal value, Bear/Base/Bull scenarios, 5x5 sensitivity tables. Pairs with excel-author. Use for intrinsic-value equity analysis.
82. `excel-author` — finance — Build auditable Excel workbooks headless with openpyxl — blue/black/green cell conventions, formulas over hardcodes, named ranges, balance checks, sensitivity tables. Use for financial models, audit outputs, reconciliations.
83. `lbo-model` — finance — Build leveraged buyout models in Excel — sources & uses, debt schedule, cash sweep, exit multiple, IRR/MOIC sensitivity. Pairs with excel-author. Use for PE screening, sponsor-case valuation, or illustrative LBO in a pitch.
84. `merger-model` — finance — Build accretion/dilution (merger) models in Excel — pro-forma P&L, synergies, financing mix, EPS impact. Pairs with excel-author. Use for M&A pitches, board materials, or deal evaluation.
85. `pptx-author` — finance — Build PowerPoint decks headless with python-pptx. Pairs with excel-author for model-backed decks where every number traces to a workbook cell. Use for pitch decks, IC memos, earnings notes.
86. `stocks` — finance — Stock quotes, history, search, compare, crypto via Yahoo.
87. `minecraft-modpack-server` — gaming — Host modded Minecraft servers (CurseForge, Modrinth).
88. `pokemon-player` — gaming — Play Pokemon via headless emulator + RAM reads.
89. `codebase-inspection` — github — Inspect codebases w/ pygount: LOC, languages, ratios.
90. `github-auth` — github — GitHub auth setup: HTTPS tokens, SSH keys, gh CLI login.
91. `github-code-review` — github — Review PRs: diffs, inline comments via gh or REST.
92. `github-issues` — github — Create, triage, label, assign GitHub issues via gh or REST.
93. `github-pr-workflow` — github — GitHub PR lifecycle: branch, commit, open, CI, merge.
94. `github-repo-management` — github — Clone/create/fork repos; manage remotes, releases.
95. `fitness-nutrition` — health — >
96. `neuroskill-bci` — health — >
97. `fastmcp` — mcp — Build, test, inspect, install, and deploy MCP servers with FastMCP in Python. Use when creating a new MCP server, wrapping an API or database as MCP tools, exposing resources or prompts, or preparing a FastMCP server for Claude Code, Cursor
98. `mcporter` — mcp — Use the mcporter CLI to list, configure, auth, and call MCP servers/tools directly (HTTP or stdio), including ad-hoc servers, config edits, and CLI/type generation.
99. `native-mcp` — mcp — MCP client: connect servers, register tools (stdio/HTTP).
100. `gif-search` — media — Search/download GIFs from Tenor via curl + jq.
101. `heartmula` — media — HeartMuLa: Suno-like song generation from lyrics + tags.
102. `songsee` — media — Audio spectrograms/features (mel, chroma, MFCC) via CLI.
103. `spotify` — media — Spotify: play, search, queue, manage playlists and devices.
104. `youtube-content` — media — YouTube transcripts to summaries, threads, blogs.
105. `openclaw-migration` — migration — Migrate a user's OpenClaw customization footprint into Hermes Agent. Imports Hermes-compatible memories, SOUL.md, command allowlists, user skills, and selected workspace assets from ~/.openclaw, then reports exactly what could not be migrat
106. `axolotl` — mlops — Axolotl: YAML LLM fine-tuning (LoRA, DPO, GRPO).
107. `chroma` — mlops — Open-source embedding database for AI applications. Store embeddings and metadata, perform vector and full-text search, filter by metadata. Simple 4-function API. Scales from notebooks to production clusters. Use for semantic search, RAG ap
108. `clip` — mlops — OpenAI's model connecting vision and language. Enables zero-shot image classification, image-text matching, and cross-modal retrieval. Trained on 400M image-text pairs. Use for image search, content moderation, or vision-language tasks with
109. `faiss` — mlops — Facebook's library for efficient similarity search and clustering of dense vectors. Supports billions of vectors, GPU acceleration, and various index types (Flat, IVF, HNSW). Use for fast k-NN search, large-scale vector retrieval, or when y
110. `guidance` — mlops — Control LLM output with regex and grammars, guarantee valid JSON/XML/code generation, enforce structured formats, and build multi-step workflows with Guidance - Microsoft Research's constrained generation framework
111. `huggingface-hub` — mlops — HuggingFace hf CLI: search/download/upload models, datasets.
112. `instructor` — mlops — Extract structured data from LLM responses with Pydantic validation, retry failed extractions automatically, parse complex JSON with type safety, and stream partial results with Instructor - battle-tested structured output library
113. `llava` — mlops — Large Language and Vision Assistant. Enables visual instruction tuning and image-based conversations. Combines CLIP vision encoder with Vicuna/LLaMA language models. Supports multi-turn image chat, visual question answering, and instruction
114. `nemo-curator` — mlops — GPU-accelerated data curation for LLM training. Supports text/image/video/audio. Features fuzzy deduplication (16× faster), quality filtering (30+ heuristics), semantic deduplication, PII redaction, NSFW detection. Scales across GPUs with R
115. `outlines` — mlops — Outlines: structured JSON/regex/Pydantic LLM generation.
116. `peft` — mlops — Parameter-efficient fine-tuning for LLMs using LoRA, QLoRA, and 25+ methods. Use when fine-tuning large models (7B-70B) with limited GPU memory, when you need to train <1% of parameters with minimal accuracy loss, or for multi-adapter servi
117. `pinecone` — mlops — Managed vector database for production AI applications. Fully managed, auto-scaling, with hybrid search (dense + sparse), metadata filtering, and namespaces. Low latency (<100ms p95). Use for production RAG, recommendation systems, or seman
118. `pytorch-fsdp` — mlops — Expert guidance for Fully Sharded Data Parallel training with PyTorch FSDP - parameter sharding, mixed precision, CPU offloading, FSDP2
119. `pytorch-lightning` — mlops — High-level PyTorch framework with Trainer class, automatic distributed training (DDP/FSDP/DeepSpeed), callbacks system, and minimal boilerplate. Scales from laptop to supercomputer with same code. Use when you want clean training loops with
120. `simpo` — mlops — Simple Preference Optimization for LLM alignment. Reference-free alternative to DPO with better performance (+6.4 points on AlpacaEval 2.0). No reference model needed, more efficient than DPO. Use for preference alignment when want simpler,
121. `slime` — mlops — Provides guidance for LLM post-training with RL using slime, a Megatron+SGLang framework. Use when training GLM models, implementing custom data generation workflows, or needing tight Megatron-LM integration for RL scaling.
122. `tensorrt-llm` — mlops — Optimizes LLM inference with NVIDIA TensorRT for maximum throughput and lowest latency. Use for production deployment on NVIDIA GPUs (A100/H100), when you need 10-100x faster inference than PyTorch, or for serving models with quantization (
123. `unsloth` — mlops — Unsloth: 2-5x faster LoRA/QLoRA fine-tuning, less VRAM.
124. `whisper` — mlops — OpenAI's general-purpose speech recognition model. Supports 99 languages, transcription, translation to English, and language identification. Six model sizes from tiny (39M params) to large (1550M params). Use for speech-to-text, podcast tr
125. `lm-evaluation-harness` — mlops/evaluation — lm-eval-harness: benchmark LLMs (MMLU, GSM8K, etc.).
126. `weights-and-biases` — mlops/evaluation — W&B: log ML experiments, sweeps, model registry, dashboards.
127. `llama-cpp` — mlops/inference — llama.cpp local GGUF inference + HF Hub model discovery.
128. `obliteratus` — mlops/inference — OBLITERATUS: abliterate LLM refusals (diff-in-means).
129. `vllm` — mlops/inference — vLLM: high-throughput LLM serving, OpenAI API, quantization.
130. `audiocraft` — mlops/models — AudioCraft: MusicGen text-to-music, AudioGen text-to-sound.
131. `segment-anything` — mlops/models — SAM: zero-shot image segmentation via points, boxes, masks.
132. `dspy` — mlops/research — DSPy: declarative LM programs, auto-optimize prompts, RAG.
133. `obsidian` — note-taking — Read, search, create, and edit notes in the Obsidian vault.
134. `obsidian-daily-digest` — note-taking — Save conversations, insights, and daily digests to Obsidian vault + GitHub sync
135. `obsidian-vault` — obsidian-vault — Use when reading, writing, searching, or managing the Smart Agent AI Obsidian knowledge base. The vault is the company's source of truth: clients, projects, agents, methodology, and daily notes.
136. `airtable` — productivity — Airtable REST API via curl. Records CRUD, filters, upserts.
137. `canvas` — productivity — Canvas LMS integration — fetch enrolled courses and assignments using API token authentication.
138. `google-workspace` — productivity — Gmail, Calendar, Drive, Docs, Sheets via gws CLI or Python.
139. `here-now` — productivity — Publish static sites to {slug}.here.now and store private files in cloud Drives for agent-to-agent handoff.
140. `linear` — productivity — Linear: manage issues, projects, teams via GraphQL + curl.
141. `maps` — productivity — Geocode, POIs, routes, timezones via OpenStreetMap/OSRM.
142. `memento-flashcards` — productivity — >-
143. `nano-pdf` — productivity — Edit PDF text/typos/titles via nano-pdf CLI (NL prompts).
144. `notion` — productivity — Notion API + ntn CLI: pages, databases, markdown, Workers.
145. `ocr-and-documents` — productivity — Extract text from PDFs/scans (pymupdf, marker-pdf).
146. `powerpoint` — productivity — Create, read, edit .pptx decks, slides, notes, templates.
147. `shop-app` — productivity — Shop.app: product search, order tracking, returns, reorder.
148. `shopify` — productivity — Shopify Admin & Storefront GraphQL APIs via curl. Products, orders, customers, inventory, metafields.
149. `siyuan` — productivity — SiYuan Note API for searching, reading, creating, and managing blocks and documents in a self-hosted knowledge base via curl.
150. `teams-meeting-pipeline` — productivity — Operate the Teams meeting summary pipeline via Hermes CLI — summarize meetings, inspect pipeline status, replay jobs, manage Microsoft Graph subscriptions.
151. `telephony` — productivity — Give Hermes phone capabilities without core tool changes. Provision and persist a Twilio number, send and receive SMS/MMS, make direct calls, and place AI-driven outbound calls through Bland.ai or Vapi.
152. `godmode` — red-teaming — Jailbreak LLMs: Parseltongue, GODMODE, ULTRAPLINIAN.
153. `arxiv` — research — Search arXiv papers by keyword, author, category, or ID.
154. `bioinformatics` — research — Gateway to 400+ bioinformatics skills from bioSkills and ClawBio. Covers genomics, transcriptomics, single-cell, variant calling, pharmacogenomics, metagenomics, structural biology, and more. Fetches domain-specific reference material on de
155. `blogwatcher` — research — Monitor blogs and RSS/Atom feeds via blogwatcher-cli tool.
156. `darwinian-evolver` — research — Evolve prompts/regex/SQL/code with Imbue's evolution loop.
157. `domain-intel` — research — Passive domain reconnaissance using Python stdlib. Subdomain discovery, SSL certificate inspection, WHOIS lookups, DNS records, domain availability checks, and bulk multi-domain analysis. No API keys required.
158. `drug-discovery` — research — >
159. `duckduckgo-search` — research — Free web search via DuckDuckGo — text, news, images, videos. No API key needed. Prefer the `ddgs` CLI when installed; use the Python DDGS library only after verifying that `ddgs` is available in the current runtime.
160. `gitnexus-explorer` — research — Index a codebase with GitNexus and serve an interactive knowledge graph via web UI + Cloudflare tunnel.
161. `llm-wiki` — research — Karpathy's LLM Wiki: build/query interlinked markdown KB.
162. `osint-investigation` — research — Public-records OSINT investigation framework — SEC EDGAR filings, USAspending contracts, Senate lobbying, OFAC sanctions, ICIJ offshore leaks, NYC property records (ACRIS), OpenCorporates registries, CourtListener court records, Wayback Mac
163. `parallel-cli` — research — Optional vendor skill for Parallel CLI — agent-native web search, extraction, deep research, enrichment, FindAll, and monitoring. Prefer JSON output and non-interactive flows.
164. `polymarket` — research — Query Polymarket: markets, prices, orderbooks, history.
165. `qmd` — research — Search personal knowledge bases, notes, docs, and meeting transcripts locally using qmd — a hybrid retrieval engine with BM25, vector search, and LLM reranking. Supports CLI and MCP integration.
166. `research-paper-writing` — research — Write ML papers for NeurIPS/ICML/ICLR: design→submit.
167. `scrapling` — research — Web scraping with Scrapling - HTTP fetching, stealth browser automation, Cloudflare bypass, and spider crawling via CLI and Python.
168. `searxng-search` — research — Free meta-search via SearXNG — aggregates results from 70+ search engines. Self-hosted or use a public instance. No API key needed. Falls back automatically when the web search toolset is unavailable.
169. `1password` — security — Set up and use 1Password CLI (op). Use when installing the CLI, enabling desktop app integration, signing in, and reading/injecting secrets for commands.
170. `oss-forensics` — security — |
171. `sherlock` — security — OSINT username search across 400+ social networks. Hunt down social media accounts by username.
172. `openhue` — smart-home — Control Philips Hue lights, scenes, rooms via OpenHue CLI.
173. `vk-management` — social-media — Manage VK (VKontakte) communities: OAuth setup, wall posts with images, messaging.
174. `xurl` — social-media — X/Twitter via xurl CLI: post, search, DM, media, v2 API.
175. `debugging-hermes-tui-commands` — software-development — Debug Hermes TUI slash commands: Python, gateway, Ink UI.
176. `hermes-agent-skill-authoring` — software-development — Author in-repo SKILL.md: frontmatter, validator, structure.
177. `hermes-s6-container-supervision` — software-development — Modify, debug, or extend the s6-overlay supervision tree inside the Hermes Agent Docker image — adding new services, debugging profile gateways, understanding the Architecture B main-program pattern.
178. `node-inspect-debugger` — software-development — Debug Node.js via --inspect + Chrome DevTools Protocol CLI.
179. `plan` — software-development — Plan mode: write an actionable markdown plan to .hermes/plans/, no execution. Bite-sized tasks, exact paths, complete code.
180. `python-debugpy` — software-development — Debug Python: pdb REPL + debugpy remote (DAP).
181. `requesting-code-review` — software-development — Pre-commit review: security scan, quality gates, auto-fix.
182. `rest-graphql-debug` — software-development — Debug REST/GraphQL APIs: status codes, auth, schemas, repro.
183. `simplify-code` — software-development — Parallel 3-agent cleanup of recent code changes.
184. `spike` — software-development — Throwaway experiments to validate an idea before build.
185. `subagent-driven-development` — software-development — Execute plans via delegate_task subagents (2-stage review).
186. `systematic-debugging` — software-development — 4-phase root cause debugging: understand bugs before fixing.
187. `test-driven-development` — software-development — TDD: enforce RED-GREEN-REFACTOR, tests before code.
188. `writing-plans` — software-development — Write implementation plans: bite-sized tasks, paths, code.
189. `commercial-pwa-mvp` — web-development — Turn a placeholder or early static web repository into a showable commercial PWA MVP with landing page, calculator/tool UI, lead capture, legal pages, offline basics, verification, and publish-ready GitHub state.
190. `frontend-design` — web-development — Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, 
191. `page-agent` — web-development — Embed alibaba/page-agent into your own web application — a pure-JavaScript in-page GUI agent that ships as a single <script> tag or npm package and lets end-users of your site drive the UI with natural language ("click login, fill username 
192. `web-studio-orchestrator` — web-development — Master orchestrator for Smart Agent AI web studio — manages 8 AI subagents to build premium websites. Phase workflow: Research → Brand → UX → Content → UI → Frontend → SEO → QA → Deploy.
193. `yuanbao` — yuanbao — Yuanbao (元宝) groups: @mention users, query info/members.
