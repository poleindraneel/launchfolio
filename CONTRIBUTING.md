# Contributing to launchfolio

Thanks for your interest! launchfolio is a small, dependency-free static template.
The guiding principle: **a user should only ever need to edit `config/site.config.js`.**

## Ground rules
- **No build step, no runtime dependencies.** Plain HTML/CSS/vanilla JS. Node is used
  only by the optional `tools/fetch-feeds.mjs` (built-ins only).
- **Content stays in config.** If you add a feature, drive it from `config/site.config.js`
  and render it in `js/render.js`. Don't hardcode copy in `index.html`.
- **Theme via CSS custom properties.** New colours/spacing should read from `:root`
  variables so the theme block in config keeps working.
- **Accessibility & responsiveness** are table stakes: keyboard focus, `prefers-reduced-motion`,
  and mobile down to ~360px.

## Good contributions
- New content-source adapters for the fetcher (Hashnode, Bluesky, Mastodon, Ghost…).
- New deploy targets (Netlify, Cloudflare Pages, Vercel).
- Additional pillar/section icons in the `ICONS` map in `js/render.js`.
- Docs, examples, and accessibility fixes.

## Dev loop
```bash
npm run dev        # serve at http://localhost:8080
# edit config/site.config.js and refresh
node tools/fetch-feeds.mjs   # test source adapters
```

Please keep PRs focused and describe what a cloner gains. Open an issue first for
larger changes.
