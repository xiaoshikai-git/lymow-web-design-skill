# Lymow Web Design Skill

[![skills.sh installs](https://skills.sh/b/xiaoshikai-git/lymow-web-design-skill)](https://skills.sh/xiaoshikai-git/lymow-web-design-skill)
[![GitHub stars](https://img.shields.io/github/stars/xiaoshikai-git/lymow-web-design-skill?style=flat)](https://github.com/xiaoshikai-git/lymow-web-design-skill/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/xiaoshikai-git/lymow-web-design-skill?style=flat)](https://github.com/xiaoshikai-git/lymow-web-design-skill/forks)

An independent [Agent Skill](https://agentskills.io/specification) for creating and reviewing web interfaces using the visual language observed on Lymow's public website. **Unofficial: no affiliation, partnership or endorsement by Lymow is claimed.**

The validated design baseline is dated **2026-10-27**. Detailed rules are in Chinese, with English discovery metadata and English usage documentation. The original measurements and exceptions are retained rather than replaced with a generic style guide.

## What can it do?

- Guide product feature sections, landing pages, product detail pages and ordinary marketing sections.
- Apply measured typography, colors, containers, spacing, media treatment, buttons and responsive behavior.
- Distinguish technical storytelling, purchase UI, collections, editorial content and campaign-specific styling.
- Review screenshots at 1440px and 390px, with a 768px adaptation check.
- Guide reuse of existing Shopify components when source code is available. It is not a Shopify theme or a working checkout.

The entrypoint is [`skills/lymow-web-design/SKILL.md`](skills/lymow-web-design/SKILL.md); it explicitly requires the bundled [complete design reference](skills/lymow-web-design/references/design-system.md) before implementation. Prior validation evidence is preserved in a separate reference. No image library, website source archive, runtime package or hidden tracking code is bundled.

## Installation

Use a current Node.js version supported by the [official skills CLI](https://github.com/vercel-labs/skills). Current upstream documentation specifies Node.js 22.20 or newer.

From the project where you want the skill:

```sh
npx skills add xiaoshikai-git/lymow-web-design-skill
```

Choose the skill and target agent interactively, or install explicitly:

```sh
# Codex
npx skills add xiaoshikai-git/lymow-web-design-skill --skill lymow-web-design -a codex -y

# Claude Code
npx skills add xiaoshikai-git/lymow-web-design-skill --skill lymow-web-design -a claude-code -y

# Cursor
npx skills add xiaoshikai-git/lymow-web-design-skill --skill lymow-web-design -a cursor -y

# List available skills without installing
npx skills add xiaoshikai-git/lymow-web-design-skill --list
```

Installation is project-local by default. Add `-g` for a user-wide installation. The CLI manages the correct agent directory and links; do not manually copy only the Markdown file. Start a new agent session in the target project if the existing session does not refresh its skill list.

## Usage with Codex / Claude Code

Relevant Lymow design requests can select the skill automatically. Explicit invocation is useful when verifying an installation:

- **Codex:** `$lymow-web-design`
- **Claude Code:** `/lymow-web-design`
- **Cursor:** ask it to use the installed `lymow-web-design` skill.

Provide the page's purpose, confirmed product copy, available assets and existing project context. The skill does not grant rights to Lymow's media; obtain appropriate assets and permissions separately.

### Example prompts

```text
Use $lymow-web-design to build a responsive product feature section.
Use the confirmed copy and licensed images in this project. Explain the
chosen page family, and check the result at 1440px, 390px and 768px.
Do not invent product specifications, offers or reviews.
```

```text
/lymow-web-design Review this landing page against the installed rules.
Identify visible typography, spacing, media and CTA inconsistencies.
Distinguish measured rules from new layout suggestions. Do not deploy.
```

```text
Use lymow-web-design to create an ordinary product-discovery marketing
section. Use explicitly labeled test copy, without prices or discounts.
Choose a comparable official module before composing the layout.
```

For a quick text-only typography demo, explicitly request a test-only section without product photography. Such a demo checks style application, not full product-page fidelity.

## Design principles

- Open Sans and role-specific heading sizes; semantic H2 does not imply one universal visual size.
- Black technical storytelling, white purchase/editorial surfaces, and campaign skins kept separate.
- Distinct 1200px and 1400px content systems and component-specific mobile gutters.
- Green commercial CTAs and appropriate white scene-Hero CTAs, with measured capsule geometry.
- Real product evidence, responsive image composition and explicit media-resolution checks.
- Evidence labels distinguish CSS declarations, browser measurements, visual observations and design inference.

Read the full applicable recipes: these points are a guide, not replacement tokens.

## Compatibility and validation

See [VALIDATION.md](VALIDATION.md) for tested versions, actual installation results and limits. Standard Markdown and frontmatter are used, with no vendor-specific executable hooks or restricted automatic invocation. Agent support for the format does not guarantee identical generated designs.

## Limitations

- This is a dated external observation, not an official design system or a guarantee of pixel-perfect reproduction.
- The original Liquid templates, section schemas, theme configuration and purchase APIs are not provided.
- Two observed One Plus purchase templates have different rules; their routing mechanism remains unconfirmed.
- Public assets, campaign content and product claims may change. Recheck relevant sources for each real task.
- Some observed posters are too small for large high-DPR displays. No higher-resolution assets are included.
- Full checkout behavior, every locale and a complete accessibility audit have not been validated.
- Shopify conversion requires the skill's stated Shopify-specific validation and local startup checks; static screenshots are not evidence of Shopify runtime success.

## Updates and contributions

```sh
npx skills update
```

The CLI tracks installed sources for subsequent updates. Review [CHANGELOG.md](CHANGELOG.md) and source changes before adopting a new baseline. [Releases](https://github.com/xiaoshikai-git/lymow-web-design-skill/releases) identify published versions.

Report reproducible issues with a public page/module reference, viewport, observed value and expected rule. Do not attach private store exports, customer data or media you are not allowed to redistribute. Keep component-specific exceptions scoped; do not adjust a correct standard merely to make one demo pass.

## Installation statistics and privacy

| Metric | Where to look | What it means |
|---|---|---|
| Stars / forks | Repository header and badges above | Public interest and repository forks; not installs |
| Views / unique visitors | [Insights → Traffic](https://github.com/xiaoshikai-git/lymow-web-design-skill/graphs/traffic) | GitHub repository traffic, visible to users with push access |
| Clones / unique cloners | Same Traffic page | Git clones, including automation; not skill executions |
| CLI installations | Official skills.sh badge and [source page](https://skills.sh/xiaoshikai-git/lymow-web-design-skill) | Aggregate recorded CLI installations; not unique people |
| Actual AI executions | Not collected | This skill does not instrument agent execution |

GitHub Traffic shows a rolling **14-day** window for visitors and full clones; it is not a lifetime installation counter. See [GitHub's traffic documentation](https://docs.github.com/en/repositories/viewing-activity-and-data-for-your-repository/viewing-traffic-to-a-repository).

[skills.sh automatically indexes skills through CLI installation telemetry](https://skills.sh/docs/faq); no separate submission is required. Indexing can lag installation. A successful CLI install does not by itself prove a listing exists. See [VALIDATION.md](VALIDATION.md) for the last observed status, not a claimed rank or fabricated count. The [skill detail page](https://skills.sh/xiaoshikai-git/lymow-web-design-skill/lymow-web-design) has been verified. At publication, its install count is “–” and the badge says `resource not found`; public installation works, but count availability has not yet been confirmed.

The [official badge](https://skills.sh/docs) reports the source repository's installation count; this repository contains one skill. Installs with telemetry disabled will not contribute. Maintainer test installs may be included, and repeated installs are not unique users. This repository adds no analytics backend, execution hooks or custom telemetry. README badges use their stated public services. The upstream CLI has its own telemetry/security-check behavior; to opt out:

```sh
DISABLE_TELEMETRY=1 npx skills add xiaoshikai-git/lymow-web-design-skill
```

This also disables the upstream security-audit requests, as documented by the [CLI maintainers](https://github.com/vercel-labs/skills/blob/main/docs/troubleshooting.md#telemetry).

## License

[MIT](LICENSE), for the maintainers' original documentation, instructions and independently authored examples; see the [third-party scope notice](THIRD_PARTY_NOTICES.md). This grants no rights to Lymow's name, logo, images, videos, fonts, website code or other third-party assets. Public source links and measured properties are evidence, not asset licenses. No third-party media or source archives are redistributed here.

## 中文说明

这是非官方的 Lymow 网页设计 Skill，完整保留已验证的设计规则和证据标记。安装后可通过 `$lymow-web-design`（Codex）或 `/lymow-web-design`（Claude Code）调用。项目不包含品牌素材授权、不保证逐像素还原，也不把安装次数当成真实用户数或 AI 执行次数。
