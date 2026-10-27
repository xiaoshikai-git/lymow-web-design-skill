# Release validation

Validation date: 2026-10-27. Installation, agent execution and directory indexing are separate checks.

## Baseline preservation and publication review

- The final phase-two project skill is identical to the reviewed ZIP version.
- Source SHA-256: `9c94671a7e5bc61d8d18f33d65df934c7d9e0b72bfdbc03e7fec33db30768318`.
- Original body SHA-256: `3d83e9584d0754b827d8220488092954d9334aba73717dec9c673f31e2ca10e5`.
- Exact reconstruction from the entrypoint and two references preserves all 13 original sections, including numbers, CSS examples, evidence labels, exceptions and validation history. Whitespace at split-file boundaries was normalized. Two packaging-location sentences now point to the bundled references; public-distribution notes and discovery metadata were added. No design values changed.
- The v1.0 entrypoint was 139 lines. Detailed design rules are required reading. The baseline remains in Chinese to avoid translation drift.
- The v1.0 documentation-only publication: no local absolute paths, credentials, private customer data, media binaries, screenshots, raw website archives or installation logs are committed. Linked third-party resources are not bundled or relicensed.
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
| Public GitHub installation | Passed: remote `--list` found one skill; clean install downloaded it for all three target agents; Codex `skills/list` recognized that remote installation |
| Update workflow | Remote installation updated successfully and all three installed skill files matched the release source byte-for-byte |
| Codex-generated demo | Passed: a real `codex exec` run read the installed entrypoint and required design reference, produced a new text-only HTML demo; independently rendered at 1440/768/390 |
| skills.sh indexing | Detail page resolves and displays the actual skill and install command; Installs is still “–”. Official source badge currently returns an SVG saying `resource not found`. Counts are not yet available |

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

## Demo observations

The actual generated demo selected the documented One Plus scene-Hero role, not generic homepage chapter typography. It read the complete required design reference and used local Open Sans 400/600/700 files supplied only to the private test workspace.

| Viewport | Heading size / line height / weight | White CTA height / radius |
|---|---|---|
| 1440 | 58px / 81.2px / 700 | 59.97px / 60px |
| 768 | 40px / 56px / 700 | 59.97px / 60px |
| 390 | 32px / 44.8px / 700 | 54.39px / 60px |

All three fonts loaded at each viewport; no horizontal overflow or browser page/request errors occurred. Keyboard activation opened the local test disclosure and focus had a visible 2px outline. The generation agent itself could not preview local files through its browser tool and reported that limit; a separate Chrome/Playwright run performed the actual rendering checks above. The demo makes no product claims and is explicitly text-only, so it is not a product-photo fidelity test or a Shopify runtime test. No demo fonts or media are redistributed.

## Public directory and statistics status

Verified detail page: https://skills.sh/xiaoshikai-git/lymow-web-design-skill/lymow-web-design

The page returned HTTP 200 with the actual skill name, content and installation command. Its install count was unavailable (“–”); an HTTP 200 badge response still contained `resource not found`, so HTTP status alone was not treated as a working count. This is a dated observation, not a claim of any installation total or rank. The README uses the officially documented badge endpoint and links to the public source page. No separate registration, synthetic installation traffic or custom analytics was added.

CLI behavior note: in the tested skills 1.7.4 build, `skills check` actually performed an available update, despite current upstream documentation describing it as a check. `skills update lymow-web-design -y` subsequently reported up to date. Use a clean project and review changes when running either command; the README uses the unambiguous update command. GitHub Traffic views and clones endpoints were also accessible to the maintainer; no counts are presented here as usage evidence.

## v1.1 opt-in reporting validation (2026-10-27)

- Python 3.9.6: five unit tests passed, covering consent/default-off behavior, event deduplication, field allowlist, retry stability, URL restrictions and response validation.
- A private Feishu Base was configured with nine fields and a week → person → event grouped view. Bearer verification is enabled. No receiver credentials or user data are included in this repository.
- End-to-end test identity `TEST-联调`: one installation registration, two different task-start events, and a repeated invocation of the first task. The actual table and grouped view showed exactly **1 install + 2 run**. These are integration test records, not colleague usage.
- The minimal receiver appends records. Local repeats are deduplicated; ambiguous network retries can still duplicate remote rows. Task-start reporting depends on the agent following instructions and having Python/network access.
- The detailed design-system and validation-history references are byte-for-byte unchanged from v1.0. All numbered entrypoint design sections are unchanged. No new design study or rendering standard was introduced.
- The earlier directory/badge observations above describe v1.0 publication time. A later check that day showed badge count 4; it is not a live usage or user count.
- v1.1 package recheck: official skills-ref returned no errors; skills CLI 1.7.4 installed the complete package in an isolated project for Codex and Claude Code. Actual Codex app-server skills/list returned one enabled repo skill with no errors. Claude Code runtime and Windows onboarding were not executed.

## v1.1.1 anonymous identity validation (2026-10-27)

Seven unit tests passed. New tests cover stable anonymous labels across repeated setup and multiple tasks, separate identities for fresh local configurations, explicit-name preservation, private receiver-file loading and no enrollment without consent. HTTP calls in these tests were mocked; no synthetic anonymous colleagues were added to the live table. The existing person/text receiver mapping is unchanged. The numbered design baseline and both design references remain byte-identical to v1.1.0.
