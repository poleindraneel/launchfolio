# Example prompts for your AI agent

launchfolio is built so a coding agent (Claude Code, Cursor, Codex, Copilot, Aider, Gemini
CLI, Windsurf…) can do the work. Open the repo in your agent and paste one of these. Every
prompt below assumes the agent will follow **`AGENTS.md`** — you don't need to explain the
project.

> **Tip:** start any session with *"Read AGENTS.md first."* After that the agent knows to edit
> only `config/site.config.js` and to validate with `npm run check`.

---

## 1. Set it up from scratch (the big one)
Attach or point to your résumé / CV PDF, a LinkedIn data export, or your current site.

```
Read AGENTS.md. Set up this portfolio for me from the attached résumé.
Fill config/site.config.js with my details, disable any section I don't have content for,
pick a tasteful theme, then run `npm run check` until it's clean and show me a preview.
Ask me for anything you can't find — don't invent facts.
```

No document handy? Let it interview you:

```
Read AGENTS.md, then ask me the questions you need (name, role, experience, links, etc.)
to fill out config/site.config.js, one topic at a time. Then validate and preview.
```

## 2. Change the look
```
Change the theme to a warm, minimal look — cream background, one deep-orange accent,
a serif display font. Update config/site.config.js and run `npm run check`.
```
```
Make the accent colour teal and switch the body font to Inter. Show me before/after.
```

## 3. Edit content
```
Add my new role: Staff Engineer at Globex, started 2025-03, still there — with a
2-sentence blurb about leading their platform team. Put it at the top of Experience.
```
```
I don't give talks. Turn off the Speaking section.
```
```
Reorder the sections so Writing comes before Experience.
```
```
Swap my hero photo for assets/img/me.jpg (I just added it).
```

## 4. Add a featured project with a live roadmap
```
Add a featured project called "Relaykit" — a job-relay library. Point its roadmap at my
public GitHub repo myhandle/relaykit so it syncs from the repo's Milestones. Write 3
highlight tags and a one-line tagline.
```

## 5. Connect your writing
```
Connect my writing: pull my Medium posts (handle: myhandle) into an "Engineering" track and
my Substack (handle: myletter) into an "Essays" track. Run `npm run fetch` and show the result.
```
```
Add this LinkedIn article to my Writing section as a manual post so the fetcher keeps it:
<paste title + URL + date>.
```

## 5b. Measure traffic to my content
```
Enable privacy-friendly analytics with Plausible for domain mysite.com, and turn on outbound
click tracking so I can see which of my Medium/Substack/social links people actually click.
Run `npm run check` and confirm nothing loads when it's disabled.
```

## 6. Validate & fix
```
Run `npm run check` and fix everything it reports, including clearing the leftover demo
placeholders. Tell me which fields you still need real values for.
```

## 7. Deploy
```
Deploy this to GitHub Pages. Tell me exactly what I need to click in repo settings.
```
```
Deploy to Azure — I've filled in deploy.config. Run the deploy and give me the live URL.
```

## 8. A final polish pass
```
Review my whole config/site.config.js as if you were a hiring manager skimming my portfolio.
Tighten the tagline and section copy, flag anything vague or missing, and run `npm run check`.
Keep it truthful — don't add things I didn't tell you.
```

---

**One rule to remember:** the agent should only ever edit `config/site.config.js` (and drop
images in `assets/img/`). If it starts editing `js/render.js` or `css/styles.css` to change
content, stop it and point it back at `AGENTS.md`.
