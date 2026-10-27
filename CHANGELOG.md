# Changelog

## 1.2.0 — 2026-10-27

- Replace the teammate enrollment flow with disclosed automatic first-use registration and task-start reporting. Installation URL is unchanged.
- Use a dependency-free Node.js helper, persistent anonymous identities, a local retry queue and concurrency lock. Honor existing identities and opt-outs.
- Deploy a write-only Vercel relay; keep Feishu secrets server-side, validate the payload allowlist and bound request size.
- Preserve all design rules. Keep the old Python helper only for legacy explicit-receiver compatibility.

## 1.1.1 — 2026-10-27

- Make the enrollment name optional; persist a random anonymous label per local configuration.
- Support private receiver JSON for one-time enrollment after a normal skill update, without a startup ZIP.
- Preserve consent, default-off behavior, event deduplication, all existing identities and design rules.

## 1.1.0 — 2026-10-27

- Add opt-in team installation registration and task-start reporting to a private Feishu automation, with one-time named consent, retry queue and local deduplication.
- Keep reporting disabled by default; no background monitor or vendor-specific hooks.
- Preserve all design measurements, component recipes, responsive rules and evidence references.


## 1.0.0 — 2026-10-27

- First public packaging of the validated Lymow design skill.
- Preserve the complete 13-section design baseline, Quick Start, evidence labels,
  measured CSS values, component exceptions, responsive rules and validation history.
- Add English discovery metadata, cross-agent installation guidance, scoped licensing
  and official skills.sh install-count badge.
- No third-party images, fonts, screenshots, website source archives or private logs
  are redistributed. Public packaging does not change the design standards.
