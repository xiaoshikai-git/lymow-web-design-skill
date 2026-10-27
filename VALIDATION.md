# Release validation

Validation date: 2026-10-27. Installation, agent execution and directory indexing are separate checks.

## Baseline preservation and publication review

- The final phase-two project skill is identical to the reviewed ZIP version.
- Source SHA-256: `9c94671a7e5bc61d8d18f33d65df934c7d9e0b72bfdbc03e7fec33db30768318`.
- Original body SHA-256: `3d83e9584d0754b827d8220488092954d9334aba73717dec9c673f31e2ca10e5`.
- Exact reconstruction from the entrypoint and two references preserves all 13 original sections, including numbers, CSS examples, evidence labels, exceptions and validation history. Two packaging-location sentences now point to the bundled references; public-distribution notes and discovery metadata were added. No design values changed.
- The entrypoint is 139 lines. Detailed design rules are required reading. The baseline remains in Chinese to avoid translation drift.
- Documentation-only publication: no local absolute paths, credentials, private customer data, media binaries, screenshots, raw website archives or installation logs are committed. Linked third-party resources are not bundled or relicensed.
- Original-content and third-party license boundaries are stated in the skill and LICENSE.

## Validation results

| Check | Result |
|---|---|
| Agent Skills metadata | Passed official `skills-ref`, no errors |
| Local CLI discovery | `skills@1.7.4` found exactly one skill |
| Isolated local CLI install | Passed for Codex, Claude Code and Cursor target paths |
| Codex discovery | Actual app-server `skills/list`: one entry, `scope=repo`, `enabled=true`, no errors |
| Claude Code runtime | Not tested: executable unavailable; CLI installation and file layout only |
| Cursor runtime | Not tested; CLI installation and shared skill path only |
| Public GitHub installation | Pending first push and remote verification |
| Codex-generated demo | In progress; no success claimed yet |
| skills.sh indexing | Not yet verified; CLI discovery alone does not imply indexing |

Versions: Node.js 22.23.1; skills CLI 1.7.4; Codex CLI 0.164.0-alpha.11.1.
The official validator was installed from `agentskills/agentskills` commit `69ef37e9424c0a7ea9dd2293b559e43ec8176379` (`skills-ref` 0.1.0). The older local skill-creator validator rejects the current specification's `compatibility` field; current official validation was used instead of changing valid metadata to satisfy that older allowlist.

Local development installs disabled upstream telemetry. A public install verification may contribute to the official aggregate count; tests are not independent users.

## Repeat the checks

In an empty temporary project:

```sh
npx skills add xiaoshikai-git/lymow-web-design-skill --list
npx skills add xiaoshikai-git/lymow-web-design-skill --skill lymow-web-design -a codex claude-code cursor -y
npx skills list
npx skills check
```

Start a new Codex session there and ask it to use `$lymow-web-design` for a clearly labeled text-only typography/CTA demo. Confirm it reads `references/design-system.md`, then inspect the rendered result at 1440px, 390px and 768px. Supply appropriately licensed fonts and media. Do not infer a working Shopify store from this demo.
