# Automatic team reporting / 自动统计（1.2.0）

## Teammates: install and use

Use the same public GitHub installation command. No startup ZIP, receiver file, Feishu credentials, name entry or extra enrollment confirmation is required. At the start of an independent Lymow design/review task, the agent runs `scripts/report_usage.mjs` using Node.js (already required by the skills CLI). The public collector endpoint is bundled in `reporting.json`; Feishu credentials are server-side secrets, never client files.

Reporting is disclosed in README and SKILL.md. It sends a persistent random local alias (or an operator name explicitly supplied for reporting), event ID/type, timestamp/week, count, skill/version and agent. It does not read or send chat text, page copy, project paths, filenames, assets, email, OS usernames, hardware IDs or machine names. Hosting providers observe normal HTTP metadata. The collector has no event-reading API and forwards only an exact field allowlist to the maintainer's private Feishu table.

## What counts and who is counted

- `install`: one installation registration at **first actual use**, not at download time. Standard skills CLI installation does not execute a custom install hook. Someone who only installs and never uses the skill will not produce a Feishu event.
- `run`: one independent requirement starts. Different requirements get different random task IDs, even in one chat. Follow-up edits/retries on the same requirement reuse its ID. Runs are not completed pages or productivity scores.
- No supplied name: the script creates a label such as `同事-7cf2a0d6b81e4392` once and persists it across tasks, new chats and normal skill updates. It is not a temporary per-task name.
- Name explicitly supplied for reporting on first use: pass `--person`. Page copy containing a person's name is not operator identification. Established identities remain fixed; later name mentions do not silently reassign records.
- A label identifies a local configuration, not a verified human. Changing device/account, clearing state or using a different `LYMOW_USAGE_HOME` creates a new identity. Sharing/copying a configuration merges people. Equal explicit names are grouped together; the owner should use unique team names or a separate agreed alias mapping.
- The GitHub skill and collector are public. External installs can also report; anonymous labels cannot prove team membership. The collector is not an authenticated employee audit, and forged traffic cannot be ruled out.
- Each event has `count=1`; keep install and run separate. Weeks use ISO Monday–Sunday, UTC+08:00, based on the original client timestamp.

## Local state, retries and stop control

State stays in `~/.config/lymow-skill-usage/`: `config.json` stores the persistent identity/disabled setting and `report-events.json` stores event IDs and delivery status. Never package this personal state for other teammates. `LYMOW_USAGE_HOME` is an explicit override for tests or separate profiles.

```sh
node path/to/installed/skill/scripts/report_usage.mjs status
node path/to/installed/skill/scripts/report_usage.mjs disable
node path/to/installed/skill/scripts/report_usage.mjs enable
node path/to/installed/skill/scripts/report_usage.mjs flush
```

`disable` persists even before first use; `LYMOW_USAGE_DISABLED=1` also suppresses all reporting. `enable` is only used when the operator asks to resume. These controls require no receiver configuration. Existing v1.1 identities and disabled settings are respected; previously enrolled copies do not register installation again. The old Python helper remains solely for legacy private-receiver compatibility. Its existing SQLite backlog is not silently migrated; if needed, the owner can use that legacy helper's `flush` to deliver it. New task reports use Node and the public relay.

The helper records before sending, serializes concurrent calls with a local lock, and sends at most three pending events per invocation. Each request times out after ten seconds. Failed events retain their original ID/timestamp for later retries. There is no background daemon. If the agent never invokes again, a pending queue is not automatically sent. Agent/tool/network permissions still apply; do not bypass them. Lack of Node, a missed invocation, a shared state lock timeout, disabled reporting, old versions or unavailable services can cause gaps.

Local repeats with the same task ID are deduplicated. The Feishu receiver appends rows; an ambiguous timeout after a successful remote write can still duplicate an event. Use distinct event IDs when reconciling doubtful totals. No event does not prove no work happened.

## Fields and Feishu view

All columns are text except count (number):

| Field | Meaning |
|---|---|
| event_id | Hash of random local registration ID, kind and random task ID |
| person | Persistent anonymous label or explicitly supplied operator name |
| event | install or run |
| occurred_at | ISO timestamp with +08:00 |
| week | ISO week, e.g. 2026-W44 |
| count | Always 1 |
| skill | lymow-web-design |
| skill_version | Installed version |
| agent | codex, claude-code, cursor or other |

The private table uses the grouped view `week → person → event`, with record counts. Exclude known verification identities when assessing colleague usage. No historic activity is fabricated or recovered. A successful relay response confirms Feishu accepted the trigger, not that downstream automation was successful; verify table rows or automation logs when troubleshooting.

## Owner maintenance — no teammate action

The `service/` directory is the Vercel collector source. Configure production secrets `FEISHU_WEBHOOK` and `FEISHU_TOKEN` in that service only; the target must be the authorized Feishu Base automation endpoint. The existing automation is **接收到 Webhook 时 → 新增记录**, with eight incoming text fields mapped and count fixed to 1. Keep Bearer verification enabled and the table private.

Collector validation allows only the nine fields above and limits actual request bodies to 2 KiB. Production rate limiting restricts the collector path to 60 requests per minute per IP; shared office IPs share the allowance. Excess/failed requests remain locally queued. This reduces bursts but does not authenticate coworkers or provide exactly-once delivery. Set server-side `REPORTING_PAUSED=1` and redeploy to pause forwarding if necessary. Hosting and Feishu automation quotas still apply; a plan upgrade is not part of this setup.

The public endpoint has no embedded Feishu secret. Do not place receiver URLs, tokens, individual identities, event logs or deployment-local files in GitHub. The official skills.sh CLI aggregate install count remains a separate metric from these task events.
