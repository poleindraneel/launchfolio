# Changelog

All notable changes to launchfolio are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project
aims to follow [Semantic Versioning](https://semver.org/).

## [1.0.1]
### Added
- **Privacy-friendly analytics module (opt-in, off by default)** — a config `analytics` block
  that plugs into Plausible, Umami or GoatCounter. Cookieless, honours Do Not Track, and loads
  nothing while `provider: "none"`.
- **Outbound click-through tracking** — an `outbound_click` event fires when visitors click out
  to your connected content (writing cards, social links, CTAs, repo links), carrying
  `{ destination, section, label }` so you can see which sources actually get traffic.
- Validated by `npm run check`; documented in `docs/ANALYTICS.md` + config schema + AGENTS.md.
  Resolves #9.

## [1.0.0] — 2026-07-19
First public release.

### Added — agent-native
- **`AGENTS.md`** — the cross-tool guide agents read (golden rule, read-map, inline enums,
  task recipes, validate loop, one-prompt setup). Thin wrappers: `CLAUDE.md` (`@AGENTS.md`
  import), `.cursor/rules/launchfolio.mdc`, `.github/copilot-instructions.md`.
- **`config/site.schema.json`** — machine-readable contract for the config (types, required
  fields, allowed values) + IDE autocomplete.
- **`tools/validate-config.mjs`** and **`npm run check`** — zero-dependency validator that
  reports precise errors and a to-do list of leftover placeholders (the agent's success signal).
- **`llms.txt`** — concise LLM-facing map of the repo.

### Added — template
- **Single-file configuration** (`config/site.config.js`): identity, theme, links and every
  section come from one `window.SITE` object; rendered by dependency-free vanilla JS.
- **Toggleable, config-driven sections** — hero, about, experience, research/background,
  writing, speaking, contact. Disabling a section also removes its nav link and re-numbers.
- **Live experience durations** computed from start/end dates.
- **Multi-source Writing hub** with tabs; `tools/fetch-feeds.mjs` pulls posts from
  **Medium, Substack, dev.to and RSS** (zero dependencies, Node 18+). Manual/LinkedIn posts
  preserved via `manual: true`.
- **Featured project with a live roadmap** synced from a public GitHub repo's Milestones,
  with a static fallback.
- **Theme via config** — colours + Google Fonts written to CSS custom properties at runtime;
  generated favicon; monogram fallback when no avatar is set.
- **SEO/social** — title, description, Open Graph, Twitter card and JSON-LD `Person` from config.
- **One-command deploys** — GitHub Pages (Actions workflow), Azure App Service
  (`scripts/deploy-azure.sh`), AWS S3 + CloudFront (`scripts/deploy-aws.sh`).
- **Weekly feed-refresh** GitHub Action.
- Docs: configuration, sources and deploy guides; MIT license; contributing guide.

[1.0.0]: https://github.com/poleindraneel/launchfolio/releases/tag/v1.0.0
