# Optional team usage reporting / 团队自动统计

Off by default. Python 3.9+ (standard library only) is needed for this optional feature, not for design guidance. No server, agent hook, background job or paid backend is installed. The owner must inform teammates about the destination and fields and obtain consent before enrollment. Names are explicitly supplied, never inferred from OS accounts or chats. If omitted, the helper creates a persistent random alias such as `同事-7cf2a0d6b81e4392`. It is a local-installation identity, not verified personal identity.

## What counts

- `install`: once when a person enrolls an already installed copy on this machine. Repeating setup does not count again. This is a registration of installation, not an invisible installer hook. Past installations cannot be recovered. A different machine/state folder can register again.
- `run`: once when the AI starts a new independent Lymow design/review task. Retries and revisions of the same task reuse the task ID. Starting a run does not imply successful completion. Agent omission or lack of tools can cause undercounting.
- Each event has `count=1`. View install and run separately; sum both only for a clearly labeled total activity count. These are not unique humans or productivity scores.
- Weeks use ISO Monday–Sunday in Asia/Shanghai (UTC+08:00). The client timestamp is used, including for delayed events.

## One-time enrollment

Install/update the complete skill first using the normal skills CLI. From a Codex project installation:

```sh
python3 .agents/skills/lymow-web-design/scripts/team_usage.py setup --agent codex
```

The prompt explains the fields and asks for consent, an optional name/unique team alias, the team's Feishu automation Webhook, and optional Bearer token. The URL/token inputs are hidden. Claude Code users resolve the script under their installed skill directory and use `--agent claude-code`.

For an agent-assisted installation, the agent may use `--person` and `--consent` only after the user has been informed and authorized enrollment. Supply `LYMOW_FEISHU_WEBHOOK` and `LYMOW_FEISHU_TOKEN` through a private environment/configuration, never in a public README, Git commit, shared transcript or shell history. No app secret is needed. Credentials authorize writes to the receiving automation and must remain within the participating team.

Configuration and a retry queue live outside projects in `~/.config/lymow-skill-usage/`. Do not include this directory in ZIP handoffs or give one person's configuration to another person. Shared machines require separate OS accounts or explicitly separate `LYMOW_USAGE_HOME` directories. Reusing one configuration across humans misattributes events.

After enrollment, the SKILL.md instruction tells the AI to record automatically. Teammates do not fill a table for each task. Existing copies need updating once. Restart the agent session if it retains the old skill. Plain `npx skills add` or ZIP copying alone cannot execute custom setup automatically.

## No-package onboarding and anonymous identities (v1.1.1)

No new ZIP is needed. Update the existing installed skill from GitHub using the normal CLI (match the existing agent and project/global scope), then enroll once with the owner-provided **private receiver JSON**:

```sh
python3 path/to/installed/skill/scripts/team_usage.py setup --receiver-file /private/path/receiver.json --agent codex
```

The JSON contains `webhook` and `token`; do not print it, put it in a public repository, or upload it to a public link. Owner configuration still needs to reach each participating device once; updating a public skill cannot secretly deliver private credentials. `--consent` is allowed for agent-assisted setup only after the disclosure has been accepted. Omit `--person` for anonymous registration, or supply the operator's explicitly provided name. No recurring name entry is needed.

Anonymous identity is generated once from a random registration ID, stored in the local configuration, and reused across tasks, sessions and ordinary skill updates. It does not use a hardware fingerprint, OS username, email, chat history or IP address. Two fresh configurations normally receive different labels. Identical task IDs on different installations do not collide because event IDs include the registration ID.

The same anonymous label can therefore show 3 runs this week and 5 next week. A different device, OS account, cleared configuration, or `LYMOW_USAGE_HOME` creates another identity; a shared/copied configuration merges people. A–Z global sequential aliases would require central assignment; this helper uses random labels to avoid that requirement. It cannot reveal the real person behind a label. Equal explicitly supplied names are grouped together, so names should be unique within the team.

An established identity remains fixed; later name mentions do not silently reassign it or rewrite historical rows. To associate a known colleague with an anonymous label, the owner can keep a separate agreed label-to-name mapping. Changing `--person` on an already enrolled configuration is rejected to prevent accidentally attributing another person's queued records to the wrong person.

## Owner: configure Feishu once

Use a dedicated private Base table named `事件明细`. Keep all fields text except `count` (number):

| Field | Meaning |
|---|---|
| event_id | Randomized event identifier, used for deduplication |
| person | Explicit name, unique team alias, or persistent random anonymous label |
| event | `install` or `run` |
| occurred_at | ISO timestamp, UTC+08:00 |
| week | ISO week, e.g. `2026-W44` |
| count | Always 1 |
| skill | `lymow-web-design` |
| skill_version | Installed skill version |
| agent | `codex`, `claude-code`, `cursor`, or `other` |

Minimal receiver: **接收到 Webhook 时 → 新增记录**. Map the eight text fields from incoming JSON to matching columns; set `count` to the constant 1. Enable Bearer-token verification and keep the receiver private. The local SQLite queue deduplicates repeat invocations with the same task ID. This simple append receiver does not deduplicate an ambiguous network retry (for example, a response lost after the row was written), so rare duplicate rows are possible. Use distinct `event_id` counts where available, or inspect repeated IDs. If later required, add a workflow lookup/conditional before creation; do not assume that optional improvement already exists or guarantees uniqueness under concurrency.

Create a weekly grouped view using `week → person → event`, with record counts (or sums of `count`). A dashboard can use `person` as the row, `event` as the series, and distinct `event_id` as the count, filtered by `week`. Keep test identities clearly marked `TEST-`; exclude them when reading operational totals. Never fabricate people or historical events to populate a chart.

The receiver uses an HTTP POST JSON body, not a group-bot message. Automation quotas apply to the team's Feishu plan. A successful Webhook response only confirms receipt; verify the workflow log and the actual row before declaring the connection working. [Official Feishu webhook documentation](https://www.feishu.cn/hc/zh-CN/articles/612376356355-设置接收到-webhook-时为工作流和自动化触发条件).

## Maintenance and limits

```sh
python3 path/to/installed/skill/scripts/team_usage.py status
python3 path/to/installed/skill/scripts/team_usage.py disable
python3 path/to/installed/skill/scripts/team_usage.py flush
```

`disable` stops all sending, including queued events. `flush` sends at most three pending events and only when enabled; otherwise there is no network call. Each request has a four-second timeout. Failed delivery is queued locally and retried on later invocation, without changing the original timestamp/ID. If the agent never runs again, the remaining queue is not delivered automatically. No daemon is installed.

Only the allowlisted fields above are transmitted. No content, file paths, repository names, chat text, assets, machine names, email addresses or raw task IDs are included. The receiving service can observe normal network metadata; this client does not collect extra device data. Python/agent network permissions still apply and must not be bypassed.

This is approximate, openly disclosed usage reporting, not a guaranteed execution audit. No event does not prove no usage. A run does not prove a completed page. Teammates can disable reporting, use old versions, or use agents without shell access. Public aggregate skills.sh installations remain a separate metric.
