# Analytics (optional, privacy-friendly)

launchfolio can measure **profile visits** and — the useful part — **click-throughs to your
connected content** (Medium, Substack, socials, CTAs). It's **off by default**: with
`provider: "none"` the site loads **zero** third-party scripts and makes no analytics requests.

It's a *pluggable* module, not a built-in tracker: you point it at a privacy-first,
cookieless provider you control. Configure it in the `analytics` block of
`config/site.config.js`, then `npm run check` to validate.

```js
analytics: {
  provider: "none",           // "none" | "plausible" | "umami" | "goatcounter"
  respectDNT: true,           // honour the visitor's Do Not Track (default on)
  trackOutboundClicks: true,  // fire an event when visitors click out to your content
  domain: "",                 // plausible
  websiteId: "",              // umami
  endpoint: "",               // goatcounter (count endpoint) / umami self-host base
  scriptUrl: "",              // optional self-hosted script URL (overrides the default)
}
```

## Providers

### Plausible
```js
analytics: { provider: "plausible", domain: "yoursite.com" }
```
Loads `plausible.io/js/script.tagged-events.js`. Self-hosting? set `scriptUrl` to your instance.

### Umami
```js
analytics: { provider: "umami", websiteId: "xxxxxxxx-....", scriptUrl: "https://your-umami/script.js" }
```
(`endpoint` may be used instead of `scriptUrl` for the script host.)

### GoatCounter
```js
analytics: { provider: "goatcounter", endpoint: "https://you.goatcounter.com/count" }
```

## What gets tracked

- **Page views** — handled by the provider's own script.
- **`outbound_click`** — fired automatically when a visitor clicks any link that leaves your
  site (writing cards, "See all posts", social links, project/repo links, CTAs). Each event
  carries:
  - `destination` — the target host + path (e.g. `medium.com/@you`)
  - `section` — where the click happened (`writing`, `contact`, `research`, `nav`, `footer`, …)
  - `label` — the visible link text

  So in your provider's dashboard you can see **which content source actually gets the clicks** —
  the whole point of the portfolio.

## Privacy

- **Off by default** — nothing loads unless you set a provider.
- **No cookies / no PII** — all three providers are cookieless and GDPR-friendly.
- **Do Not Track respected** — if the visitor sends DNT and `respectDNT` is true (default), no
  script is injected and no events fire.
- **Fails safe** — if the provider script is blocked or slow, links still work; tracking is
  best-effort and never blocks navigation.

Set `trackOutboundClicks: false` to keep page views but skip outbound events.
