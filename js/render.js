/* ============================================================================
 * launchfolio — renderer
 * Reads window.SITE (config/site.config.js) and builds the whole page:
 * theme, SEO tags, nav, every section, and an optional live GitHub roadmap.
 * You should not need to edit this file to customise your site.
 * ========================================================================== */
(function () {
  "use strict";
  var C = window.SITE;
  if (!C) { console.error("launchfolio: window.SITE config not found."); return; }
  var T = C.theme || {}, ID = C.identity || {}, SECT = C.sections || {}, SOC = C.social || {};

  /* ---------- tiny helpers ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function emph(s) { return esc(s).replace(/\{([^}]+)\}/g, "<em>$1</em>"); } // {x} -> emphasised
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function show(id, on) { var e = document.getElementById(id); if (e) e.style.display = on ? "" : "none"; }
  function hexToRgba(hex, a) {
    var m = String(hex).replace("#", "").match(/.{2}/g);
    if (!m || m.length < 3) return hex;
    return "rgba(" + parseInt(m[0], 16) + "," + parseInt(m[1], 16) + "," + parseInt(m[2], 16) + "," + a + ")";
  }
  function enc(name) { return String(name).replace(/ /g, "+"); }

  var ANCHOR = { about: "about", experience: "work", research: "research", writing: "writing", speaking: "speaking", contact: "contact" };
  var ORDER = ["about", "experience", "research", "writing", "speaking", "contact"];

  /* ======================================================= THEME + FONTS */
  function injectHead(tag, attrs) {
    var n = document.createElement(tag);
    Object.keys(attrs).forEach(function (k) { if (k === "crossOrigin") n.crossOrigin = attrs[k]; else n.setAttribute(k, attrs[k]); });
    document.head.appendChild(n); return n;
  }
  function buildFontsHref(f) {
    var fams = [];
    if (f.display) fams.push("family=" + enc(f.display) + ":ital,wght@0,300;0,400;0,500;0,600;1,400");
    if (f.body) fams.push("family=" + enc(f.body) + ":wght@400;500;600");
    if (f.mono) fams.push("family=" + enc(f.mono) + ":wght@400;500");
    if (f.script) fams.push("family=" + enc(f.script) + ":ital@0;1");
    return fams.length ? "https://fonts.googleapis.com/css2?" + fams.join("&") + "&display=swap" : "";
  }
  function applyTheme() {
    var r = document.documentElement.style;
    var map = {
      "--ink": T.ink, "--ink-800": T.surface, "--ink-700": T.surfaceAlt, "--ink-600": T.surfaceAlt2,
      "--line": T.line, "--line-2": T.line2, "--text": T.text, "--text-dim": T.textDim, "--paper": T.paper,
      "--saffron": T.accentWarm, "--teal": T.accentCool,
    };
    Object.keys(map).forEach(function (k) { if (map[k]) r.setProperty(k, map[k]); });
    if (T.accentWarm) r.setProperty("--saffron-soft", hexToRgba(T.accentWarm, 0.14));
    if (T.accentCool) r.setProperty("--teal-soft", hexToRgba(T.accentCool, 0.14));
    r.setProperty("--accent", "var(--teal)"); r.setProperty("--accent-soft", "var(--teal-soft)");

    var f = T.fonts || {};
    if (f.display) r.setProperty("--f-display", '"' + f.display + '", Georgia, serif');
    if (f.body) r.setProperty("--f-body", '"' + f.body + '", system-ui, sans-serif');
    if (f.mono) r.setProperty("--f-mono", '"' + f.mono + '", ui-monospace, monospace');
    r.setProperty("--f-deva", f.script ? '"' + f.script + '", serif' : '"' + (f.display || "Georgia") + '", serif');

    var href = f.googleFontsHref || buildFontsHref(f);
    if (href) {
      injectHead("link", { rel: "preconnect", href: "https://fonts.googleapis.com" });
      injectHead("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" });
      injectHead("link", { rel: "stylesheet", href: href });
    }

    var letter = String(T.faviconLetter || ID.name || "•").slice(0, 1);
    var col = encodeURIComponent(T.faviconColor || T.accentWarm || "#E9A23B");
    var bg = encodeURIComponent(T.ink || "#0E1428");
    var svg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E" +
      "%3Crect width='100' height='100' rx='22' fill='" + bg + "'/%3E" +
      "%3Ctext x='50' y='71' font-family='Georgia,serif' font-size='60' fill='" + col + "' text-anchor='middle'%3E" +
      encodeURIComponent(letter) + "%3C/text%3E%3C/svg%3E";
    injectHead("link", { rel: "icon", href: svg });
  }

  /* ======================================================= META / SEO */
  function setMeta() {
    var m = C.meta || {};
    if (m.lang) document.documentElement.setAttribute("lang", m.lang);
    if (m.title) document.title = m.title;
    var setName = function (name, val) { if (!val) return; var t = document.querySelector('meta[name="' + name + '"]') || injectHead("meta", { name: name }); t.setAttribute("content", val); };
    var setProp = function (prop, val) { if (!val) return; var t = document.querySelector('meta[property="' + prop + '"]') || injectHead("meta", { property: prop }); t.setAttribute("content", val); };
    setName("description", m.description);
    if (ID.name) setName("author", ID.name);
    if (m.url) injectHead("link", { rel: "canonical", href: m.url });
    setProp("og:type", "website"); setProp("og:title", m.title); setProp("og:description", m.description);
    setProp("og:url", m.url);
    if (m.ogImage) setProp("og:image", absolute(m.ogImage, m.url));
    setName("twitter:card", "summary_large_image");
    if (m.twitter) setName("twitter:site", m.twitter);

    var sameAs = Object.keys(SOC).map(function (k) { return SOC[k]; }).filter(Boolean);
    var ld = {
      "@context": "https://schema.org", "@type": "Person", name: ID.name,
      jobTitle: (ID.roles || [])[0], url: m.url, email: ID.email,
      address: ID.location ? { "@type": "PostalAddress", addressLocality: ID.location } : undefined,
      sameAs: sameAs.length ? sameAs : undefined,
    };
    var s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
  }
  function absolute(path, base) { if (/^https?:/.test(path) || !base) return path; return base.replace(/\/$/, "") + "/" + path.replace(/^\//, ""); }

  /* ======================================================= ANALYTICS (opt-in) */
  var A = C.analytics || {};
  var ANALYTICS_ON = !!(A.provider && A.provider !== "none");
  function dntOn() {
    if (A.respectDNT === false) return false;
    var d = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
    return d === "1" || d === "yes";
  }
  function applyAnalytics() {
    if (!ANALYTICS_ON || dntOn()) { ANALYTICS_ON = false; return; } // off => zero third-party requests
    try {
      if (A.provider === "plausible") {
        // queue custom events until the script loads
        window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
        injectHead("script", { defer: "", "data-domain": A.domain || "", src: A.scriptUrl || "https://plausible.io/js/script.tagged-events.js" });
      } else if (A.provider === "umami") {
        injectHead("script", { defer: "", "data-website-id": A.websiteId || "", src: A.scriptUrl || A.endpoint || "" });
      } else if (A.provider === "goatcounter") {
        injectHead("script", { async: "", "data-goatcounter": A.endpoint || "", src: A.scriptUrl || "//gc.zgo.at/count.js" });
      }
    } catch (e) { /* analytics must never break the page */ }
  }
  function trackOutbound(destination, section, label) {
    if (!ANALYTICS_ON) return;
    try {
      if (A.provider === "plausible" && window.plausible) window.plausible("outbound_click", { props: { destination: destination, section: section, label: label } });
      else if (A.provider === "umami" && window.umami) window.umami.track("outbound_click", { destination: destination, section: section, label: label });
      else if (A.provider === "goatcounter" && window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: "outbound: " + destination, title: label, event: true });
    } catch (e) {}
  }
  function wireOutboundTracking() {
    if (!ANALYTICS_ON || A.trackOutboundClicks === false) return;
    document.addEventListener("click", function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!a) return;
      if (!/^https?:\/\//i.test(a.getAttribute("href") || "")) return;
      var u; try { u = new URL(a.href); } catch (_) { return; }
      if (u.hostname === location.hostname) return; // internal link — ignore
      var secEl = a.closest("[data-section]");
      var section = secEl ? secEl.getAttribute("data-section")
        : (a.closest("header") ? "nav" : a.closest("footer") ? "footer" : "hero");
      var label = (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80) || a.getAttribute("aria-label") || "";
      trackOutbound(u.hostname + u.pathname, section, label);
    }, { capture: true });
  }

  /* ======================================================= NAV + numbering */
  function buildNavAndSections() {
    var navLinks = $("#nav-links");
    var n = 0;
    ORDER.forEach(function (key) {
      var secEl = document.querySelector('[data-section="' + key + '"]');
      var conf = SECT[key];
      if (!secEl) return;
      if (!conf || conf.enabled === false) { secEl.parentNode.removeChild(secEl); return; }

      var idxEl = secEl.querySelector("[data-index]");
      if (idxEl) { n++; idxEl.textContent = pad(n); }
      var titleEl = secEl.querySelector("[data-title]");
      if (titleEl && conf.title) titleEl.innerHTML = esc(conf.title).replace(/\n/g, "<br>");

      var a = el("a", key === "contact" ? "nav__cta" : null, esc(conf.navLabel || conf.title || key));
      a.href = "#" + (ANCHOR[key] || key);
      navLinks.appendChild(a);

      if (RENDER[key]) RENDER[key](conf);
    });
  }

  /* ======================================================= HERO */
  function renderHero() {
    $("#hero-eyebrow").textContent = ID.eyebrow || (ID.roles || []).join(" · ");
    var lines = ID.nameLines && ID.nameLines.length ? ID.nameLines : [ID.name || ""];
    $("#hero-title").innerHTML = lines.map(esc).join("<br>");
    $("#hero-lead").innerHTML = emph(ID.tagline || "");

    var chips = $("#hero-chips");
    (ID.chips || ID.roles || []).forEach(function (c) { chips.appendChild(el("li", null, esc(c))); });

    var actions = $("#hero-actions");
    (ID.ctas || []).forEach(function (c) {
      var b = el("a", "btn " + (c.style === "ghost" ? "btn--ghost" : "btn--solid"), esc(c.label));
      b.href = c.href || "#"; actions.appendChild(b);
    });

    var portrait = $("#hero-portrait");
    var box = el("div", "portrait");
    if (ID.avatar) {
      var img = el("img"); img.src = ID.avatar; img.alt = "Portrait of " + (ID.name || "");
      img.width = 480; img.height = 480; img.setAttribute("fetchpriority", "high");
      box.appendChild(img);
    } else {
      box.classList.add("portrait--mono");
      box.appendChild(el("span", "portrait__mono", esc(initials(ID.name))));
    }
    portrait.appendChild(box);

    var wm = $("#hero-watermark");
    if (ID.secondaryScript) wm.textContent = ID.secondaryScript; else wm.style.display = "none";

    var now = $("#now-list");
    if (ID.now && ID.now.length) ID.now.forEach(function (t) { now.appendChild(el("li", null, esc(t))); });
    else { var ns = document.querySelector(".hero__now"); if (ns) ns.style.display = "none"; }
  }
  function initials(name) {
    var parts = String(name || "").trim().split(/\s+/);
    return ((parts[0] || "")[0] || "") + ((parts[1] || "")[0] || "");
  }

  /* ======================================================= ICONS (for pillars) */
  var ICONS = {
    build: '<path d="M4 7l8-4 8 4-8 4-8-4z"/><path d="M4 12l8 4 8-4"/><path d="M4 17l8 4 8-4"/>',
    teach: '<path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M21 7v6"/><path d="M7 9.5V15c0 1.4 2.2 3 5 3s5-1.6 5-3V9.5"/>',
    research: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    ship: '<path d="M3 13l9 4 9-4"/><path d="M3 13V9l9-5 9 5v4"/><path d="M12 8v9"/>',
    spark: '<path d="M12 2v6M12 16v6M2 12h6M16 12h6"/><circle cx="12" cy="12" r="2.4"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/>',
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0014 0M12 19v3"/>',
    code: '<path d="M8 6l-6 6 6 6M16 6l6 6-6 6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  };
  function iconSvg(name) {
    var body = ICONS[name] || ICONS.spark;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' + body + "</svg>";
  }

  /* ======================================================= ABOUT */
  function renderAbout(conf) {
    if (conf.lead) $("#about-lead").textContent = conf.lead; else $("#about-lead").style.display = "none";
    var host = $("#about-pillars");
    (conf.pillars || []).forEach(function (p) {
      var a = el("article", "pillar");
      a.appendChild(el("span", "pillar__icon", iconSvg(p.icon)));
      a.appendChild(el("h3", null, esc(p.title)));
      a.appendChild(el("p", null, esc(p.text)));
      host.appendChild(a);
    });
    if (!(conf.pillars || []).length) host.style.display = "none";
  }

  /* ======================================================= EXPERIENCE (live durations) */
  var MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  function ym(s) { var p = String(s).split("-"); return { y: +p[0], m: +p[1] }; }
  function nowYM() { var d = new Date(); return { y: d.getFullYear(), m: d.getMonth() + 1 }; }
  function fmtYM(s) { var t = ym(s); return MON[t.m - 1] + " " + t.y; }
  function before(a, b) { return a.y < b.y || (a.y === b.y && a.m < b.m); }
  function monthsIncl(a, b) { return (b.y - a.y) * 12 + (b.m - a.m) + 1; }
  function durLabel(mo) {
    if (mo < 1) mo = 1; var y = Math.floor(mo / 12), m = mo % 12, out = [];
    if (y) out.push(y + " yr" + (y > 1 ? "s" : "")); if (m) out.push(m + " mo" + (m > 1 ? "s" : ""));
    return out.join(" ") || "1 mo";
  }
  function rolePeriod(r) { return fmtYM(r.start) + " — " + (r.end ? fmtYM(r.end) : "Present"); }
  function orgDuration(org) {
    var earliest = ym(org.roles[0].start);
    org.roles.forEach(function (r) { var s = ym(r.start); if (before(s, earliest)) earliest = s; });
    var end, ongoing = org.roles.some(function (r) { return !r.end; });
    if (ongoing) end = nowYM();
    else { end = ym(org.roles[0].end); org.roles.forEach(function (r) { var e = ym(r.end); if (before(end, e)) end = e; }); }
    return durLabel(monthsIncl(earliest, end));
  }
  function renderExperience(conf) {
    var tl = $("#timeline");
    (conf.orgs || []).forEach(function (org) {
      var wrap = el("div", "tl-org reveal");
      var head = el("div", "tl-org__head");
      head.appendChild(el("h3", "tl-org__name", esc(org.org)));
      var meta = [];
      try { meta.push(orgDuration(org)); } catch (e) {}
      if (org.location) meta.push(esc(org.location));
      head.appendChild(el("p", "tl-org__meta", meta.join(" · ")));
      wrap.appendChild(head);
      var roles = el("div", "tl-roles");
      org.roles.forEach(function (r) {
        var role = el("div", "tl-role");
        var top = el("div", "tl-role__top");
        top.appendChild(el("span", "tl-role__title", esc(r.title)));
        top.appendChild(el("span", "tl-role__period", esc(rolePeriod(r))));
        role.appendChild(top);
        if (r.text) role.appendChild(el("p", "tl-role__text", esc(r.text)));
        roles.appendChild(role);
      });
      wrap.appendChild(roles);
      tl.appendChild(wrap);
    });
  }

  /* ======================================================= RESEARCH / BACKGROUND */
  function renderResearch(conf) {
    var lead = document.querySelector(".research__lead");
    setText("#research-program", conf.program);
    setText("#research-school", conf.school);
    setText("#research-text", conf.text);
    fillList("#research-themes", conf.themes, function (t) { return el("li", null, esc(t)); });
    if (!conf.program && !conf.text && !(conf.themes || []).length && lead) lead.style.display = "none";

    if ((conf.education || []).length) fillList("#education", conf.education, function (e) {
      var li = el("li");
      li.appendChild(el("span", "edu__degree", esc(e.degree)));
      li.appendChild(el("span", "edu__school", esc(e.school)));
      if (e.period) li.appendChild(el("span", "edu__period", esc(e.period)));
      return li;
    }); else hide("#fb-education");

    if ((conf.certifications || []).length) fillList("#certifications", conf.certifications, function (c) { return el("li", null, esc(c)); });
    else hide("#fb-certs");

    if ((conf.languages || []).length) fillList("#languages", conf.languages, function (l) {
      var li = el("li"); li.appendChild(el("span", null, esc(l.name))); li.appendChild(el("span", "langs__level", esc(l.level))); return li;
    }); else hide("#fb-langs");

    if ((conf.skills || []).length) fillList("#skills", conf.skills, function (g) {
      var grp = el("div", "skill-group"); grp.appendChild(el("h4", null, esc(g.group)));
      var ul = el("ul"); (g.items || []).forEach(function (i) { ul.appendChild(el("li", null, esc(i))); }); grp.appendChild(ul); return grp;
    }); else hide("#skills-block");

    renderProject(conf.project);
  }
  function setText(sel, val) { var e = $(sel); if (!e) return; if (val) e.textContent = val; else e.style.display = "none"; }
  function hide(sel) { var e = $(sel); if (e) e.style.display = "none"; }
  function fillList(sel, arr, make) { var host = $(sel); if (!host) return; (arr || []).forEach(function (x) { host.appendChild(make(x)); }); }

  /* ---- Featured project + roadmap (static, with optional live GitHub sync) ---- */
  function renderProject(P) {
    var host = $("#project");
    if (!host) return;
    if (!P || P.enabled === false) { host.parentNode.removeChild(host); return; }
    host.classList.add("reveal");

    var head = el("div", "halo__head");
    head.appendChild(el("span", "halo__eyebrow", esc(P.eyebrow || "Featured project")));
    var nameEl = el("h3", "halo__name");
    nameEl.appendChild(el("span", "halo__abbr", esc(P.name)));
    if (P.fullName) nameEl.appendChild(el("span", "halo__full", esc(P.fullName)));
    head.appendChild(nameEl);
    if (P.tagline) head.appendChild(el("p", "halo__desc", esc(P.tagline)));
    if ((P.highlights || []).length) {
      var tags = el("ul", "tags halo__tags");
      P.highlights.forEach(function (h) { tags.appendChild(el("li", null, esc(h))); });
      head.appendChild(tags);
    }
    if (P.repo) {
      var repo = el("a", "halo__repo");
      repo.href = P.repo; repo.target = "_blank"; repo.rel = "noopener";
      repo.innerHTML = '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg><span>View on GitHub</span>';
      head.appendChild(repo);
    }

    var road = el("div", "halo__roadmap");
    var rhead = el("div", "halo__roadmap-head");
    rhead.appendChild(el("span", "found-title", "Roadmap"));
    var liveEl = el("span", "halo__live"); rhead.appendChild(liveEl);
    road.appendChild(rhead);
    var ol = el("ol", "halo-tl"); road.appendChild(ol);

    host.appendChild(head); host.appendChild(road);

    function statusLabel(s) { return s === "done" ? "Done" : s === "active" ? "In progress" : "Planned"; }
    function draw(list, live) {
      ol.innerHTML = "";
      list.forEach(function (m) {
        var li = el("li", "halo-ms halo-ms--" + (m.status || "planned"));
        var top = el("div", "halo-ms__top");
        top.appendChild(el("span", "halo-ms__phase", esc(m.phase)));
        top.appendChild(el("span", "halo-ms__status", statusLabel(m.status)));
        li.appendChild(top);
        li.appendChild(el("h4", "halo-ms__title", esc(m.title)));
        if (m.detail) li.appendChild(el("p", "halo-ms__detail", esc(m.detail)));
        var meta = el("div", "halo-ms__meta");
        if (m.due) meta.appendChild(el("span", null, "Target " + esc(m.due)));
        if (m.progress) meta.appendChild(el("span", "halo-ms__prog", esc(m.progress) + " issues"));
        if (m.due || m.progress) li.appendChild(meta);
        ol.appendChild(li);
      });
      liveEl.textContent = live ? "live from GitHub" : "";
    }
    draw(P.milestones || [], false);

    if (P.owner && P.repoName) {
      fetch("https://api.github.com/repos/" + P.owner + "/" + P.repoName + "/milestones?state=all&per_page=100",
            { headers: { Accept: "application/vnd.github+json" } })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (data) {
          if (!Array.isArray(data) || !data.length) return;
          var mapped = data.map(function (m) {
            var parts = String(m.title).split(/\s+[—–-]\s+/);
            var phase = parts.shift();
            var num = (phase.match(/\d+/) || ["99"])[0];
            var due = ""; if (m.due_on) { var d = new Date(m.due_on); due = MON[d.getUTCMonth()] + " " + d.getUTCFullYear(); }
            var total = (m.open_issues || 0) + (m.closed_issues || 0);
            return { _n: +num, phase: phase, title: parts.join(" — ") || m.title, detail: m.description || "", state: m.state, due: due || null, progress: total ? (m.closed_issues + " / " + total) : null };
          }).sort(function (a, b) { return a._n - b._n; });
          var seen = false;
          mapped.forEach(function (m) { if (m.state === "closed") m.status = "done"; else if (!seen) { m.status = "active"; seen = true; } else m.status = "planned"; });
          draw(mapped, true);
        })
        .catch(function () {});
    }
  }

  /* ======================================================= WRITING (tabs + sources) */
  function renderWriting(conf) {
    if (conf.intro) $("#writing-intro").textContent = conf.intro; else $("#writing-intro").style.display = "none";
    var tracks = conf.tracks || [];
    var tabsHost = $("#writing-tabs");
    var panel = $("#panel-writing");
    var more = $("#writing-more");
    var fetched = window.SITE_WRITING || {};

    if (tracks.length <= 1) tabsHost.style.display = "none";

    tracks.forEach(function (tr, i) {
      var b = el("button", "tab" + (i === 0 ? " is-active" : ""));
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", i === 0 ? "true" : "false");
      b.dataset.track = tr.id;
      var lbl = el("span", "tab__label", esc(tr.label));
      if (tr.labelScript) lbl.style.fontFamily = "var(--f-deva)";
      b.appendChild(lbl);
      var srcNames = (tr.sources || []).map(function (s) { return s.type; });
      if (srcNames.length) b.appendChild(el("span", "tab__meta", esc(srcNames.join(" · "))));
      b.addEventListener("click", function () { setTrack(tr.id); });
      tabsHost.appendChild(b);
    });

    function postsFor(tr) {
      var live = fetched[tr.id];
      return (live && live.length) ? live : (tr.posts || []);
    }
    function setTrack(id) {
      var tr = tracks.filter(function (t) { return t.id === id; })[0] || tracks[0];
      Array.prototype.forEach.call(tabsHost.querySelectorAll(".tab"), function (t) {
        var on = t.dataset.track === id;
        t.classList.toggle("is-active", on); t.setAttribute("aria-selected", on ? "true" : "false");
        if (on) t.classList.add(tr.accent === "warm" ? "tab--warm" : "tab--cool");
      });
      var r = document.documentElement.style;
      if (tr.accent === "warm") { r.setProperty("--accent", "var(--saffron)"); r.setProperty("--accent-soft", "var(--saffron-soft)"); }
      else { r.setProperty("--accent", "var(--teal)"); r.setProperty("--accent-soft", "var(--teal-soft)"); }
      if (tr.seeAllUrl) { more.href = tr.seeAllUrl; more.style.display = ""; } else more.style.display = "none";
      panel.innerHTML = "";
      postsFor(tr).forEach(function (a) {
        var card = el("a", "card"); card.href = a.url || "#"; card.target = "_blank"; card.rel = "noopener";
        var top = el("div", "card__top");
        top.appendChild(el("span", "card__source", esc(a.source || tr.label)));
        if (a.date) top.appendChild(el("span", "card__date", esc(a.date)));
        card.appendChild(top);
        var title = el("h3", "card__title", esc(a.title));
        if (tr.labelScript) title.style.fontFamily = "var(--f-deva)";
        card.appendChild(title);
        if (a.excerpt) card.appendChild(el("p", "card__excerpt", esc(a.excerpt)));
        card.appendChild(el("span", "card__link", 'Read <span aria-hidden="true">→</span>'));
        panel.appendChild(card);
      });
    }
    if (tracks.length) setTrack(tracks[0].id);
  }

  /* ======================================================= SPEAKING */
  function renderSpeaking(conf) {
    if (conf.intro) $("#speaking-intro").innerHTML = emph(conf.intro); else $("#speaking-intro").style.display = "none";
    var feat = conf.featured, host = $("#talk-feature");
    if (feat) {
      host.classList.add("reveal");
      var gallery = el("div", "talk-feature__media");
      (feat.images || []).forEach(function (im) { var img = el("img"); img.src = im.src; img.alt = im.alt || feat.title; img.loading = "lazy"; gallery.appendChild(img); });
      if ((feat.images || []).length) host.appendChild(gallery);
      var body = el("div", "talk-feature__body");
      body.appendChild(el("span", "talk__venue", esc(feat.venue)));
      body.appendChild(el("h3", "talk-feature__title", esc(feat.title)));
      if (feat.note) body.appendChild(el("p", "talk__note", esc(feat.note)));
      if ((feat.tags || []).length) { var tg = el("ul", "tags"); feat.tags.forEach(function (t) { tg.appendChild(el("li", null, esc(t))); }); body.appendChild(tg); }
      host.appendChild(body);
    } else host.style.display = "none";

    var more = $("#talks-more");
    (conf.more || []).forEach(function (s) {
      var li = el("li", "talk-mini");
      li.appendChild(el("span", "talk-mini__venue", esc(s.venue)));
      li.appendChild(el("h4", "talk-mini__title", esc(s.title)));
      if (s.note) li.appendChild(el("p", "talk-mini__note", esc(s.note)));
      more.appendChild(li);
    });
    if (!(conf.more || []).length) hide("#talks-more-wrap");
  }

  /* ======================================================= CONTACT */
  var SOCIAL_LABELS = { website: "Website", github: "GitHub", linkedin: "LinkedIn", medium: "Medium", substack: "Substack", twitter: "X / Twitter", devto: "dev.to" };
  function renderContact(conf) {
    if (conf.eyebrow) $("#contact-eyebrow").textContent = conf.eyebrow;
    if (conf.title) $("#contact-title").textContent = conf.title;
    var email = conf.email || ID.email;
    var e = $("#contact-email");
    if (email) { e.textContent = email; e.href = "mailto:" + email; } else e.style.display = "none";
    var socials = $("#socials");
    if (conf.showSocials !== false) {
      Object.keys(SOCIAL_LABELS).forEach(function (k) {
        if (!SOC[k]) return;
        var a = el("a", null, esc(SOCIAL_LABELS[k])); a.href = SOC[k]; a.target = "_blank"; a.rel = "noopener";
        socials.appendChild(el("li")).appendChild(a);
      });
    }
  }

  /* ======================================================= FOOTER */
  function renderFooter() {
    var f = C.footer || {};
    if (f.mark) $("#footer-mark").textContent = f.mark; else $("#footer-mark").style.display = "none";
    $("#footer-note").textContent = f.note || "";
  }

  /* ======================================================= WORDMARK */
  function renderWordmark() {
    var w = $("#wordmark");
    var text = ID.wordmark || ID.name || "";
    var dot = text.indexOf(".");
    if (dot > -1) {
      var span = el("span", "wordmark__latin");
      span.innerHTML = esc(text.slice(0, dot)) + '<span class="wordmark__dot">.</span>' + esc(text.slice(dot + 1));
      w.appendChild(span);
    } else w.appendChild(el("span", "wordmark__latin", esc(text)));
    if (ID.secondaryScript) w.appendChild(el("span", "wordmark__deva", esc(ID.secondaryScript)));
    w.setAttribute("aria-label", (ID.name || "Home") + " — home");
  }

  var RENDER = { about: renderAbout, experience: renderExperience, research: renderResearch, writing: renderWriting, speaking: renderSpeaking, contact: renderContact };

  /* ======================================================= INTERACTIONS */
  function wireInteractions() {
    var nav = $("#nav");
    var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    var toggle = $(".nav__toggle"), links = $("#nav-links");
    toggle.addEventListener("click", function () { var o = nav.classList.toggle("is-open"); toggle.setAttribute("aria-expanded", o ? "true" : "false"); });
    links.addEventListener("click", function (e) { if (e.target.tagName === "A") { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); } });

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (ents) { ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }); }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      document.querySelectorAll(".reveal").forEach(function (n) { io.observe(n); });
    } else document.querySelectorAll(".reveal").forEach(function (n) { n.classList.add("is-in"); });
  }

  /* ======================================================= GO */
  applyTheme();
  setMeta();
  applyAnalytics();
  renderWordmark();
  renderHero();
  buildNavAndSections();
  renderFooter();
  wireInteractions();
  wireOutboundTracking();
})();
