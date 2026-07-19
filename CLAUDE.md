@AGENTS.md

<!-- Claude Code reads CLAUDE.md; the line above imports the shared AGENTS.md, which is the
     single source of truth. A few Claude-Code-specific reminders: -->

- The fast feedback loop is `npm run check` (validates `config/site.config.js`). Use it as your
  success signal instead of rendering in a browser.
- Content lives only in `config/site.config.js`. You should not need to open `js/render.js` or
  `css/styles.css` — the schema (`config/site.schema.json`) has everything.
- Make one batched edit pass, then validate once.
