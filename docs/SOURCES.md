# Connecting content sources

The **Writing** section is organised into *tracks* (each becomes a tab). A track can pull
posts automatically from your publishing platforms, or list them by hand — or both.

```js
writing: {
  enabled: true,
  title: "Writing",
  intro: "…",
  tracks: [
    {
      id: "engineering",          // unique id
      label: "Engineering",       // tab label
      accent: "cool",             // "cool" or "warm" (colours the tab + accents)
      seeAllUrl: "https://…",     // "See all posts →" link
      sources: [                  // pulled by `npm run fetch`
        { type: "medium",   handle: "yourhandle" },
        { type: "devto",    handle: "yourhandle" },
      ],
      posts: [ /* fallback / manual — see below */ ],
    },
  ],
}
```

## Supported source types
| `type` | Needs | Feed used |
|--------|-------|-----------|
| `medium` | `handle` | `https://medium.com/feed/@handle` |
| `substack` | `handle` | `https://handle.substack.com/feed` |
| `devto` | `handle` | `https://dev.to/feed/handle` |
| `rss` | `url` | any RSS/Atom feed URL |
| `linkedin` / `manual` | — | no public feed; add posts by hand (below) |

## Pulling posts
```bash
npm run fetch      # = node tools/fetch-feeds.mjs
```
This reads your config, fetches each track's sources, and writes `content/writing.js`
(`window.SITE_WRITING`). The site prefers those posts and falls back to each track's
inline `posts` array when a track hasn't been fetched. Re-run it whenever you publish.

> Browsers can't fetch these feeds directly (CORS), which is why this runs at author time.
> To keep it automatic, the included **`.github/workflows/refresh-feeds.yml`** runs it
> weekly and commits the result.

## LinkedIn & other manual posts
LinkedIn has no public feed. Add those posts to the track's `posts` array and mark them
`manual: true` so the fetcher **keeps** them alongside fetched posts:

```js
posts: [
  { title: "My LinkedIn article", date: "May 2024", source: "LinkedIn",
    excerpt: "…", url: "https://www.linkedin.com/pulse/…", manual: true },
]
```
Use a parseable `date` (e.g. `"May 2024"`) so manual posts sort correctly by date.

## One track or many
- One track → the tab bar hides automatically; posts show directly.
- Multiple tracks → a tab switcher appears; each track's `accent` recolours the section.
