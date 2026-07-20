/* ============================================================================
 * launchfolio — site configuration
 * ----------------------------------------------------------------------------
 * THIS IS THE ONLY FILE YOU NEED TO EDIT.
 *
 * Replace the demo content below with your own, drop your photo in assets/img/,
 * and you have a site. Nothing else requires touching HTML, CSS or JS.
 *
 * - Turn any section off with `enabled: false` (it disappears, nav link and all).
 * - Colours and fonts live in `theme`.
 * - "Writing" can pull posts automatically from Medium / Substack / dev.to / RSS
 *   — see config/../docs/SOURCES.md and run `npm run fetch`.
 *
 * Full field reference: docs/CONFIGURATION.md
 * ========================================================================== */

window.SITE = {
  /* ---- SEO / social preview ---------------------------------------------- */
  meta: {
    title: "Sam Rivera — Software Engineer & Writer",
    description:
      "Sam Rivera builds reliable backend systems and writes about the craft of software. Portfolio, experience, writing and talks.",
    url: "https://example.com/",           // your final URL (used for canonical + OG)
    ogImage: "assets/img/avatar.svg",       // 1200x630 image is ideal; avatar works as a fallback
    twitter: "@samrivera",                  // or ""
    lang: "en",
  },

  /* ---- Theme: colours + fonts -------------------------------------------- */
  theme: {
    ink: "#0E1428",          // page background (darkest)
    surface: "#131B34",      // raised sections
    surfaceAlt: "#1A2340",   // cards
    surfaceAlt2: "#222D50",  // hover / faint lines
    line: "rgba(233,231,222,0.12)",
    line2: "rgba(233,231,222,0.20)",
    text: "#ECEAE1",
    textDim: "#A7AEC2",
    paper: "#F4F1E9",
    accentWarm: "#E9A23B",   // used for one "voice" (e.g. essays) + highlights
    accentCool: "#57C4B6",   // used for the technical/primary voice
    faviconLetter: "S",      // single letter for the browser-tab icon
    faviconColor: "#E9A23B",
    fonts: {
      // Any Google Font family names. Leave `script` empty unless you want a
      // second-script wordmark/watermark (e.g. "Tiro Devanagari Marathi").
      display: "Fraunces",
      body: "Inter",
      mono: "JetBrains Mono",
      script: "",
    },
  },

  /* ---- Who you are (drives the hero) ------------------------------------- */
  identity: {
    name: "Sam Rivera",
    nameLines: ["Sam", "Rivera"],   // how the big hero title wraps
    wordmark: "Sam.Rivera",         // top-left nav logo (the dot gets the accent)
    secondaryScript: "",            // optional watermark in another script, e.g. "समीर"
    eyebrow: "Berlin · Engineer · Writer",
    // Wrap a phrase in {curly braces} to emphasise it (italic + accent).
    tagline: "I build reliable systems and write about the craft — {in plain language}.",
    location: "Berlin, Germany",
    email: "hello@example.com",
    avatar: "assets/img/avatar.svg", // your photo; leave "" to show a monogram instead
    // Short affiliation lines shown under the tagline (optional).
    chips: [
      "Senior Backend Engineer · Acme",
      "Maintainer · open-source",
      "Writer · The Systems Notebook",
    ],
    ctas: [
      { label: "Read the writing", href: "#writing", style: "solid" },
      { label: "Get in touch", href: "#contact", style: "ghost" },
    ],
    now: [
      "Leading platform reliability at Acme",
      "Writing weekly on distributed systems",
      "Learning Rust the hard way",
    ],
  },

  /* ---- Links (only the ones you fill in are shown) ----------------------- */
  social: {
    website: "",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
    medium: "https://medium.com/",
    substack: "",
    twitter: "https://x.com/",
    devto: "",
  },

  footer: {
    mark: "Sam Rivera",
    note: "Built with launchfolio — an open static portfolio template.",
  },

  /* ---- Analytics (optional, privacy-friendly, OFF by default) -------------
   * Measures profile visits AND click-throughs to your connected sources
   * (Medium/Substack/socials/CTAs → an `outbound_click` event with which
   * section + destination). No cookies, honours Do Not Track, and loads
   * nothing at all while `provider: "none"`. See docs/ANALYTICS.md.       */
  analytics: {
    provider: "none",           // "none" | "plausible" | "umami" | "goatcounter"
    respectDNT: true,           // honour the visitor's Do Not Track setting
    trackOutboundClicks: true,  // fire events when visitors click out to your content

    // Provider-specific (fill in only the one you use):
    domain: "",                 // plausible: your data-domain (e.g. "yoursite.com")
    websiteId: "",              // umami: your data-website-id
    endpoint: "",               // goatcounter: your count endpoint (e.g. https://you.goatcounter.com/count)
    scriptUrl: "",              // optional: self-hosted script URL (overrides the default)
  },

  /* ---- Sections. Reorder them in index.html; toggle them here. ----------- */
  sections: {
    about: {
      enabled: true,
      navLabel: "About",
      title: "What I do, and why",
      lead:
        "I've spent a decade building backend systems that stay up under load — and, in parallel, writing to make the hard parts legible. I like the intersection: shipping real software, and explaining clearly how and why it works.",
      pillars: [
        { icon: "build", title: "Build", text: "Distributed backends, APIs and the platform work that keeps them reliable." },
        { icon: "spark", title: "Ship", text: "Pragmatic delivery — CI/CD, observability and the boring things that matter." },
        { icon: "pen",   title: "Write", text: "Essays and deep-dives that turn hard-won lessons into something reusable." },
      ],
    },

    experience: {
      enabled: true,
      navLabel: "Work",
      title: "Experience",
      // Dates are "YYYY-MM"; end: null means "Present". Durations are computed live.
      orgs: [
        {
          org: "Acme Corp",
          location: "Berlin",
          roles: [
            { title: "Senior Backend Engineer", start: "2022-03", end: null,
              text: "Lead the reliability of a payments platform handling millions of daily transactions — event-driven services, SLOs, and on-call practice that halved incident time-to-recovery." },
            { title: "Backend Engineer", start: "2019-06", end: "2022-03",
              text: "Built and scaled core APIs; introduced contract testing and a service template that cut new-service setup from days to hours." },
          ],
        },
        {
          org: "Startup Studio",
          location: "Remote",
          roles: [
            { title: "Full-Stack Developer", start: "2016-01", end: "2019-05",
              text: "Shipped web products end to end for early-stage clients — from prototype to production on a small, fast-moving team." },
          ],
        },
      ],
    },

    research: {
      enabled: true,
      navLabel: "More",
      title: "Background & foundations",
      // The left column is an optional short statement (research, focus, or mission).
      program: "Focus — reliable distributed systems",
      school: "Independent study & open-source",
      text:
        "I care about the failure modes nobody demos: partial outages, backpressure, and the operational edges where clean architectures meet messy reality.",
      themes: ["Distributed systems", "Observability", "Developer experience"],
      education: [
        { degree: "B.Sc., Computer Science", school: "Technical University", period: "2012 — 2016" },
      ],
      certifications: ["AWS Certified Solutions Architect", "CKA — Certified Kubernetes Administrator"],
      languages: [
        { name: "English", level: "Native" },
        { name: "German", level: "Professional" },
      ],
      skills: [
        { group: "Languages", items: ["Go", "Python", "TypeScript", "Rust"] },
        { group: "Platform", items: ["Kubernetes", "Terraform", "AWS", "PostgreSQL"] },
        { group: "Practice", items: ["Observability", "CI/CD", "Incident response", "Testing"] },
      ],
      // Optional highlighted project with a roadmap. Set `owner`+`repoName` to a
      // PUBLIC GitHub repo to sync the roadmap live from its Milestones. Leave
      // them empty to keep the static roadmap below. Set enabled:false to hide.
      project: {
        enabled: true,
        eyebrow: "Featured project",
        name: "Relaykit",
        fullName: "A tiny, reliable job-relay for event-driven systems",
        tagline:
          "An open-source library for at-least-once delivery between services — outbox pattern, idempotency keys, and dead-letter handling without a broker rewrite.",
        highlights: ["Transactional outbox", "Idempotent consumers", "Dead-letter replay", "Zero-broker footprint"],
        repo: "https://github.com/",
        owner: "",       // e.g. "your-handle" — enables live GitHub milestone sync
        repoName: "",    // e.g. "relaykit"
        milestones: [
          { phase: "v0.1", title: "Core outbox", status: "done", due: "Q1", progress: null, detail: "Transactional outbox writer + relay loop with at-least-once guarantees." },
          { phase: "v0.2", title: "Idempotency", status: "active", due: "Q2", progress: null, detail: "Consumer-side idempotency keys and exactly-once effects." },
          { phase: "v0.3", title: "Dead-letter replay", status: "planned", due: null, detail: "Operator tooling to inspect and replay failed messages." },
        ],
      },
    },

    writing: {
      enabled: true,
      navLabel: "Writing",
      title: "Writing",
      intro:
        "Two shelves. One on engineering — systems, reliability and the craft. One on everything else I can't stop thinking about.",
      // Each track becomes a tab. `accent` is "cool" or "warm".
      // `sources` power `npm run fetch` (Medium/Substack/dev.to/RSS). Posts below
      // are the fallback and are shown until you run the fetcher.
      tracks: [
        {
          id: "engineering",
          label: "Engineering",
          accent: "cool",
          seeAllUrl: "https://medium.com/",
          sources: [{ type: "medium", handle: "samrivera" }],
          posts: [
            { title: "The Outbox Pattern, Without the Hype", date: "May 2024", source: "Medium", excerpt: "Reliable messaging between services doesn't need a new broker — just a table and some discipline.", url: "https://medium.com/" },
            { title: "SLOs Are a Conversation, Not a Dashboard", date: "Mar 2024", source: "Medium", excerpt: "Why the number matters less than the agreement behind it.", url: "https://medium.com/" },
            { title: "Backpressure for People Who Hate Backpressure", date: "Jan 2024", source: "Medium", excerpt: "A practical tour of load-shedding, queues and saying no gracefully.", url: "https://medium.com/" },
          ],
        },
        {
          id: "essays",
          label: "Essays",
          accent: "warm",
          seeAllUrl: "https://substack.com/",
          sources: [{ type: "substack", handle: "samrivera" }],
          posts: [
            { title: "On Doing the Boring Work", date: "Apr 2024", source: "Substack", excerpt: "The unglamorous habits that quietly compound.", url: "https://substack.com/" },
            { title: "Notes on Learning in Public", date: "Feb 2024", source: "Substack", excerpt: "What changed when I started writing before I felt ready.", url: "https://substack.com/" },
          ],
        },
      ],
    },

    speaking: {
      enabled: true,
      navLabel: "Talks",
      title: "Speaking & community",
      intro: "I speak on reliability and developer experience, and help run a local backend meetup.",
      featured: {
        title: "Designing for Failure: Reliability Patterns That Scale",
        venue: "BackendConf 2024",
        note: "A tour of the patterns — outbox, idempotency, bulkheads, backpressure — that keep systems standing when dependencies don't. Drawn from real incidents and their postmortems.",
        tags: ["Reliability", "Distributed systems", "Incident response"],
        images: [
          { src: "assets/img/talk-placeholder.svg", alt: "Sam Rivera speaking at a conference" },
        ],
      },
      more: [
        { title: "Observability on a Budget", venue: "Berlin Backend Meetup", note: "Getting 80% of the insight from 20% of the tooling." },
        { title: "Testing the Untestable", venue: "TestTalks Podcast", note: "Contract tests, fakes and taming flaky suites." },
      ],
    },

    contact: {
      enabled: true,
      navLabel: "Contact",
      eyebrow: "Get in touch",
      title: "Let's talk — building, writing, or both.",
      showSocials: true,
    },
  },
};
