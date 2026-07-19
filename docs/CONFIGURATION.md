# Configuration reference

Everything on the site comes from **`config/site.config.js`**, which sets a single
`window.SITE` object. Edit it, refresh the browser — no build step. This page documents
every field. (Anything you leave blank is simply hidden.)

## `meta` — SEO & social preview
| Field | What it does |
|-------|--------------|
| `title` | Browser tab + `<title>` + Open Graph title |
| `description` | Meta description + OG/Twitter description |
| `url` | Canonical URL (also used to absolutize `ogImage`) |
| `ogImage` | Social share image (1200×630 ideal); falls back to your avatar |
| `twitter` | Twitter/X handle, e.g. `@you` |
| `lang` | Document language, e.g. `en` |

## `theme` — colours & fonts
Colours are hex (or any CSS colour). They're written to CSS custom properties at load.
- `ink`, `surface`, `surfaceAlt`, `surfaceAlt2` — background layers (darkest → cards)
- `line`, `line2` — hairline borders
- `text`, `textDim`, `paper`
- `accentWarm`, `accentCool` — the two accents (writing tabs switch between them)
- `faviconLetter`, `faviconColor` — the generated tab icon
- `fonts.display` / `fonts.body` / `fonts.mono` — **Google Font family names**
- `fonts.script` — optional second-script font (e.g. `Tiro Devanagari Marathi`); leave `""`
- `fonts.googleFontsHref` — advanced: a full Google Fonts URL to use verbatim instead

## `identity` — the hero
- `name`, `nameLines` (array controlling how the big title wraps)
- `wordmark` — nav logo text; a `.` in it gets the accent colour
- `secondaryScript` — optional large watermark behind the hero (another script/word); `""` hides it
- `eyebrow` — the small mono line above the name
- `tagline` — supports emphasis: wrap a phrase in `{curly braces}` to italicise + accent it
- `location`, `email`, `avatar` (`""` → a monogram is drawn instead)
- `chips` — short affiliation lines under the tagline
- `ctas` — buttons: `{ label, href, style: "solid" | "ghost" }`
- `now` — the "Now" strip lines (current focus); empty array hides the strip

## `social`
Any of `website, github, linkedin, medium, substack, twitter, devto`. Only the ones you
fill in appear (in the Contact section and in the JSON-LD `sameAs`).

## `footer`
`mark` (small wordmark) and `note`.

## `sections`
Each section has `enabled` (set `false` to remove it **and** its nav link) and a
`navLabel`. Section order on the page is the order in `index.html`; toggling here never
leaves gaps in the auto-numbering.

- **about** — `title`, `lead`, `pillars: [{ icon, title, text }]`. `icon` is one of:
  `build, teach, research, ship, spark, pen, mic, code, globe`.
- **experience** — `title`, `orgs: [{ org, location, roles: [{ title, start, end, text }] }]`.
  Dates are `"YYYY-MM"`; `end: null` = "Present". **Durations are computed live** from today.
- **research** (a flexible "background" block) — `program`, `school`, `text`, `themes[]`,
  `education: [{degree, school, period}]`, `certifications: []`, `languages: [{name, level}]`,
  `skills: [{group, items[]}]`, and an optional **`project`** (below).
- **writing** — `title`, `intro`, `tracks[]` (see `SOURCES.md`).
- **speaking** — `title`, `intro`, optional `featured: {title, venue, note, tags[], images[]}`,
  and `more: [{title, venue, note}]`.
- **contact** — `eyebrow`, `title`, `email` (defaults to `identity.email`), `showSocials`.

### `sections.research.project` — featured project + roadmap
- `enabled` — `false` hides the block.
- `name`, `fullName`, `tagline`, `highlights[]`, `repo` (link shown as "View on GitHub").
- `milestones: [{ phase, title, status: "done"|"active"|"planned", due, progress, detail }]`.
- **Live sync (optional):** set `owner` and `repoName` to a **public** GitHub repo and the
  roadmap refreshes from that repo's Milestones on load (status from open/closed, issue
  counts, due dates). If the fetch fails, your static `milestones` stay. Leave both `""`
  to keep it purely static.
