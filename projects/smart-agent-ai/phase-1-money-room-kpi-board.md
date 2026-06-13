---
type: kpi-board
project: Smart Agent AI
phase: phase-1-money-room
created: 2026-06-13T17:27:59+00:00
updated: 2026-06-13T17:32:55+00:00
owner_profile: revenue-controller
status: ready-for-controlled-dispatch
source_plan: [[phase-1-money-room-command-plan]]
no_dispatch_launched: true
secrets_read: false
---

# Phase 1 Money Room KPI Board

Linked plan: [[phase-1-money-room-command-plan]]
Lead tracker schema: [[phase-1-money-room-lead-tracker]]
Team map: [[agent-team-phase-1-money-room]]

## 1. 48h target

Offer: **AI-бот для приёма заявок за 48 часов**.

| KPI | 48h target | Day 1 target | Day 2 target | Current | Status | Owner |
|---|---:|---:|---:|---:|---|---|
| Leads found | 120 | 60 | 120 | 120 | ready-for-crm-import | `lead-research-agent` |
| Leads qualified | 100 | 45 | 100 | 114 | ready-for-crm-import | `lead-research-agent` + `crm-steward-agent` |
| Touches/contacted | 120 | 60 | 120 | 0 | approval-needed-before-send | `outreach-sales-agent` |
| Replies | 25 | 10–12 | 25 | 0 | not-started | `outreach-sales-agent` |
| Demo booked | 8 | 3–4 | 8 | 0 | not-started | `outreach-sales-agent` |
| Demo completed | 6 | 2–3 | 6 | 0 | not-started | `outreach-sales-agent` + `proposal-agent` |
| Proposal/payment offers | 4 | 1–2 | 4 | 0 | not-started | `proposal-agent` |
| Payment pending | 2 | 0–1 | 2 | 0 | not-started | `proposal-agent` |
| Paid | 1–2 | 0–1 | 1–2 | 0 | not-started | `revenue-controller` |

## 2. Conversion health

| Funnel step | Target conversion | Watch threshold | Red flag | Current |
|---|---:|---:|---:|---:|
| Qualified / found | 83% | < 70% | < 50% | 95% (114/120) |
| Replies / touches | 21% | < 12% | < 7% | 0% |
| Demo booked / replies | 32% | < 20% | < 10% | 0% |
| Proposals / demos | 50% | < 30% | 0% | 0% |
| Paid / proposals | 25–50% | < 25% | 0% | 0% |

How to read:
- If replies are weak, change message/personalization before sending more volume.
- If replies are okay but demos are weak, CTA is wrong; switch to quick audit/demo.
- If demos happen but no payment, simplify package and next step.

## 3. 4-hour operating snapshots

Use this table during the 48h sprint. Do not invent numbers; only actual logged activity.

| Window | Leads found | Qualified | Contacted | Replies | Demo booked | Proposals | Paid | Main blocker | Next 3 actions | Updated by |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|---|
| H0–H4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | Waiting for downstream workers / approval gates | 1) lead list 40 A-segment 2) scripts draft 3) QA criteria | `revenue-controller` |
| H4–H8 | 120 | 114 | 0 | 0 | 0 | 0 | 0 | Awaiting segment/script approval before any outreach | 1) CRM import from phase-1-money-room-leads-120.csv 2) approve first 20 sample leads 3) prepare outreach scripts, no sending | `lead-research-agent` |
| H8–H12 |  |  |  |  |  |  |  |  |  |  |
| H12–H16 |  |  |  |  |  |  |  |  |  |  |
| H16–H20 |  |  |  |  |  |  |  |  |  |  |
| H20–H24 |  |  |  |  |  |  |  |  |  |  |
| H24–H28 |  |  |  |  |  |  |  |  |  |  |
| H28–H32 |  |  |  |  |  |  |  |  |  |  |
| H32–H36 |  |  |  |  |  |  |  |  |  |  |
| H36–H40 |  |  |  |  |  |  |  |  |  |  |
| H40–H44 |  |  |  |  |  |  |  |  |  |  |
| H44–H48 |  |  |  |  |  |  |  |  |  |  |

## 4. Daily snapshot template

Copy this block for each daily report.

```markdown
### Snapshot — YYYY-MM-DD HH:MM UTC

- Owner:
- Leads found:
- Leads qualified:
- Contacted:
- Replies:
- Demo booked:
- Demo completed:
- Proposal sent:
- Payment pending:
- Paid:
- Lost:
- Nurture:
- Main blocker:
- Decision needed:
- Next 3 actions:
  1.
  2.
  3.
```

## 5. Agent responsibility board

| Agent | Current command | Input needed | Output expected | Acceptance check |
|---|---|---|---|---|
| `lead-research-agent` | Build 120 leads, Segment A first | ICP from command plan | CRM-ready lead list | 120 rows, public source, score, pain, next action |
| `crm-steward-agent` | Keep lead tracker clean | Lead list + status updates | Tracker + snapshots | every active lead has status and next_action_due |
| `outreach-sales-agent` | Draft messages, not send | Segments + approved offer | 3 scripts + follow-up | no spam tone, no false promises, CTA clear |
| `proposal-agent` | Prepare payment-ready КП | hot replies + package rules | 1-page КП + packages | price/scope/48h requirements explicit |
| `delivery-manager-agent` | Validate 48h delivery promise | proposed scope | intake + checklist | can actually deliver in 48h after materials |
| `agent-qa-controller` | Gate quality and risks | scripts/КП/CRM/delivery | QA checklist + go/no-go | no unsafe promises, no missing handoff |
| `revenue-controller` | Own money room and escalation | all handoffs | owner report + KPI decisions | stop/pivot decisions every 8h |

## 6. Approval gates status

| Gate | Required before | Status | Owner | Notes |
|---|---|---|---|---|
| Segment approval | any real outreach | pending | `revenue-controller` / Дмитрий | approve niches and first 20 sample leads |
| Script approval | any real outreach | pending | `revenue-controller` / Дмитрий | approve primary + follow-up text |
| Price/scope approval | any КП/payment offer | pending | `revenue-controller` / Дмитрий | confirm package and discount rules |
| Delivery feasibility | any paid promise | pending | `delivery-manager-agent` + `agent-qa-controller` | verify 48h MVP scope |
| QA go/no-go | client handoff | pending | `agent-qa-controller` | final safety gate |

## 7. Stop / pivot board

| Checkpoint | Trigger | Action | Owner |
|---|---|---|---|
| After 30 touches | < 3 replies | rewrite first message, add sharper personalization | `outreach-sales-agent` |
| After 60 touches | < 6 replies | change niche or lead quality rule | `revenue-controller` + `lead-research-agent` |
| After 10 replies | < 2 demos | change CTA to 7-minute audit/demo | `outreach-sales-agent` |
| After 4 demos | 0 proposals | simplify offer and package | `proposal-agent` |
| Any time | delivery says scope unsafe | remove promise before sending | `delivery-manager-agent` + `agent-qa-controller` |

## 8. Owner report format

```text
Сделано: [касания] касаний, [ответы] ответов, [демо] демо, [КП] предложений оплатить.
Деньги: [оплачено / pending / 0].
Блокер: [один главный].
Дальше: [3 действия на ближайшие 4 часа].
Нужно от Дмитрия: [approval/решение/ничего].
```

## 9. Safety notes

- This board is a control artifact only.
- Dispatch and outreach were not launched from this task.
- Secrets, tokens, `.env`, payment credentials were not read or copied.
