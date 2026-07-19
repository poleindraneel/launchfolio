# AGENTS.md — how to work on a launchfolio site

You are helping someone turn this template into **their** portfolio. This file tells you how
to do it correctly, fast, and cheaply. Read it fully — it's short on purpose.

## The golden rule
**To change anything a visitor sees, edit exactly ONE file: `config/site.config.js`.**
Everything — identity, sections, theme, links, writing, projects — is data in that file.
A dependency-free renderer (`js/render.js`) turns it into the page.

**Do NOT read or edit** `js/render.js`, `css/styles.css`, or `index.html` for content or
theme changes. If a request seems to need them, it almost certainly maps to a config field —
check `config/site.schema.json` first. (Only touch those files if the user explicitly asks to
change rendering logic or add new visual structure.)

## What to read (and nothing else)
1. **This file.**
2. **`config/site.config.js`** — the current values you'll edit.
3. **`config/site.schema.json`** — the contract (types, required fields, allowed values).

That's the whole context you need for ~all tasks. Don't crawl the repo.

## Allowed values (so you never have to grep the code)
- Pillar `icon`: `build, teach, research, ship, spark, pen, mic, code, globe`
- Writing `source.type`: `medium, substack, devto, rss, linkedin, manual`
  - `medium`/`substack`/`devto` need `handle`; `rss` needs `url`; `linkedin`/`manual` = added by hand.
- Writing track `accent`: `cool` | `warm`
- Milestone `status`: `done` | `active` | `planned`
- CTA `style`: `solid` | `ghost`
- Experience dates: `"YYYY-MM"` strings; `end: null` means "Present". Durations are computed for you.
- Colours: any CSS colour (hex fine). Fonts: Google Font family names.

## The loop (your success signal — no browser needed)
After editing the config:
```bash
npm run check      # validates config/site.config.js against the contract
```
- **Errors → exit 1.** Fix exactly what it names, re-run.
- **Warnings → exit 0.** These are leftover demo placeholders = your to-do list of what still
  needs the user's real content. Resolve them before deploying.
- Optionally `npm run dev` (→ http://localhost:8080) if the user wants to see it. Prefer
  `npm run check` over rendering; validate once after a single batched edit pass.

## Setting up a new site (the common request)
1. Gather the user's details — from their **resume, LinkedIn export, or existing site** if
   provided, otherwise ask. You need: name, roles, one-line tagline, location, email, social
   links, experience (org / title / start / end / blurb), education, skills, writing sources,
   and optionally one featured project.
2. **Never invent facts.** If you don't have something, ask, or leave it blank / disable that section.
3. Edit `config/site.config.js`:
   - Fill `meta`, `identity`, `social`, `footer`.
   - For each section, set real content or `enabled: false` (disabling also removes its nav link).
   - Set `theme` colours/fonts to taste.
   - Put images in `assets/img/` and point `identity.avatar` at one (or set `avatar: ""` for a monogram).
4. `npm run check` → fix errors → clear the placeholder warnings.
5. Offer to deploy (see below).

## Recipes (each = a config edit + maybe one command)
- **Identity/theme:** edit `identity.*` and `theme.*`. Emphasise a phrase in `tagline` with
  `{curly braces}`.
- **Toggle a section:** `sections.<name>.enabled = false` (nav updates itself).
- **Reorder sections:** reorder the `<section data-section="…">` blocks in `index.html`
  (this is the one content task that touches HTML; order there = order on page).
- **Add experience:** append to `sections.experience.orgs[].roles[]` with `start`/`end` = `"YYYY-MM"`.
- **Featured project + live roadmap:** fill `sections.research.project`. To sync the roadmap
  from a **public** GitHub repo's Milestones, set BOTH `owner` and `repoName`; otherwise leave
  both `""` and the static `milestones[]` are shown.
- **Connect writing:** add `sources` to a `writing.tracks[]` entry, then `npm run fetch`
  (pulls Medium/Substack/dev.to/RSS into `content/writing.js`). See `docs/SOURCES.md`.
- **Add a LinkedIn/manual post:** add to a track's `posts[]` with `manual: true` (the fetcher
  preserves those; use a real `date` like `"May 2024"`).
- **Swap the photo:** drop a file in `assets/img/`, set `identity.avatar`.

## Deploy (when asked)
- **GitHub Pages:** push; ensure Settings → Pages → Source = "GitHub Actions" (workflow included).
- **Azure:** `npm run deploy:azure` · **AWS:** `npm run deploy:aws` — both read `deploy.config`
  (copy `deploy.config.example` first). Details in `docs/DEPLOY.md`.

## Guardrails
- **No dependencies, ever.** Keep it static HTML/CSS/vanilla JS. Don't add a framework or build step.
- Keep `config/site.config.js` valid JavaScript (it assigns `window.SITE = { … }`).
- Batch your edits, then validate once. Don't spin up a browser to check what `npm run check` can tell you.
- Don't publish someone else's data or fabricate credentials/experience.

## One-prompt starter (share this with your user)
> "Read AGENTS.md, then set up this portfolio for me from the attached resume / my LinkedIn
> export. Fill `config/site.config.js`, disable sections I have no content for, run
> `npm run check` until it's clean, and show me a preview."

More copy-paste prompts for humans (theming, adding content, connecting writing, deploying):
**`docs/AGENT-PROMPTS.md`**.
