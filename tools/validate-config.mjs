/*
 * launchfolio — config validator
 * ---------------------------------------------------------------------------
 *   node tools/validate-config.mjs      (or: npm run check)
 *
 * Validates config/site.config.js against the launchfolio contract and prints
 * precise, line-of-sight errors + warnings. This is the fast feedback loop for
 * humans AND AI agents: edit the config, run this, fix what it says. No browser.
 *
 * Zero dependencies (Node 18+). Errors -> exit 1. Warnings (e.g. leftover demo
 * placeholders) -> exit 0, but they're your to-do list before deploying.
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG = join(__dirname, "..", "config", "site.config.js");

const ICONS = ["build", "teach", "research", "ship", "spark", "pen", "mic", "code", "globe"];
const SRC_TYPES = ["medium", "substack", "devto", "rss", "linkedin", "manual"];
const YM = /^\d{4}-\d{2}$/;

const errors = [];
const warnings = [];
const err = (path, msg) => errors.push(`${path}: ${msg}`);
const warn = (path, msg) => warnings.push(`${path}: ${msg}`);

const isStr = (v) => typeof v === "string";
const isArr = Array.isArray;
const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
const nonEmpty = (v) => isStr(v) && v.trim().length > 0;
const enabled = (s) => s && s.enabled !== false;

async function loadConfig() {
  let src;
  try { src = await readFile(CONFIG, "utf8"); }
  catch { err("config/site.config.js", "file not found"); return null; }
  const win = {};
  try { new Function("window", src)(win); }
  catch (e) { err("config/site.config.js", "is not valid JavaScript — " + e.message); return null; }
  if (!win.SITE) { err("config/site.config.js", "must set window.SITE"); return null; }
  return win.SITE;
}

function validate(C) {
  // ---- meta ----
  if (!isObj(C.meta)) err("meta", "missing object");
  else {
    if (!nonEmpty(C.meta.title)) err("meta.title", "required non-empty string");
    if (!nonEmpty(C.meta.description)) warn("meta.description", "recommended for SEO");
    if (isStr(C.meta.url) && /example\.com/.test(C.meta.url)) warn("meta.url", 'still "example.com" — set your real URL');
  }

  // ---- identity ----
  if (!isObj(C.identity)) err("identity", "missing object");
  else {
    const id = C.identity;
    if (!nonEmpty(id.name)) err("identity.name", "required non-empty string");
    if (id.name === "Sam Rivera") warn("identity.name", 'still the demo name "Sam Rivera"');
    if (id.email === "hello@example.com") warn("identity.email", "still the demo email");
    if (id.avatar && /avatar\.svg$/.test(id.avatar)) warn("identity.avatar", "still the placeholder avatar (assets/img/avatar.svg)");
    if (isArr(id.ctas)) id.ctas.forEach((c, i) => {
      if (!nonEmpty(c.label)) err(`identity.ctas[${i}].label`, "required");
      if (c.style && !["solid", "ghost"].includes(c.style)) err(`identity.ctas[${i}].style`, `must be "solid" or "ghost" (got "${c.style}")`);
    });
  }

  // ---- social (warn on bare placeholder links) ----
  if (isObj(C.social)) for (const [k, v] of Object.entries(C.social)) {
    if (isStr(v) && v && /^https?:\/\/[^/]+\/?$/.test(v)) warn(`social.${k}`, `looks like a bare placeholder ("${v}") — use your full profile URL or remove it`);
  }

  // ---- theme ----
  if (isObj(C.theme)) {
    const f = C.theme.fonts;
    if (f && !nonEmpty(f.display) && !nonEmpty(f.body)) warn("theme.fonts", "no display/body font set");
  }

  // ---- analytics (optional) ----
  if (isObj(C.analytics)) {
    const an = C.analytics;
    const provs = ["none", "plausible", "umami", "goatcounter"];
    if (an.provider !== undefined && !provs.includes(an.provider)) err("analytics.provider", `must be one of: ${provs.join(", ")} (got "${an.provider}")`);
    if (an.provider === "plausible" && !nonEmpty(an.domain)) err("analytics.domain", 'required when provider is "plausible" (your data-domain)');
    if (an.provider === "umami") {
      if (!nonEmpty(an.websiteId)) err("analytics.websiteId", 'required when provider is "umami"');
      if (!nonEmpty(an.scriptUrl) && !nonEmpty(an.endpoint)) err("analytics.scriptUrl", 'umami needs "scriptUrl" or "endpoint" (where umami.js is hosted)');
    }
    if (an.provider === "goatcounter" && !nonEmpty(an.endpoint)) err("analytics.endpoint", 'required when provider is "goatcounter" (your count endpoint)');
  }

  // ---- sections ----
  if (!isObj(C.sections)) { err("sections", "missing object"); return; }
  const S = C.sections;
  const on = Object.keys(S).filter((k) => enabled(S[k]));
  if (on.length === 0) err("sections", "at least one section must be enabled");

  // about
  if (enabled(S.about) && isArr(S.about.pillars)) {
    S.about.pillars.forEach((p, i) => {
      if (!nonEmpty(p.title)) err(`sections.about.pillars[${i}].title`, "required");
      if (p.icon && !ICONS.includes(p.icon)) err(`sections.about.pillars[${i}].icon`, `unknown icon "${p.icon}". Use one of: ${ICONS.join(", ")}`);
    });
  }

  // experience
  if (enabled(S.experience) && isArr(S.experience.orgs)) {
    S.experience.orgs.forEach((o, i) => {
      if (!nonEmpty(o.org)) err(`sections.experience.orgs[${i}].org`, "required");
      if (!isArr(o.roles) || !o.roles.length) err(`sections.experience.orgs[${i}].roles`, "at least one role required");
      else o.roles.forEach((r, j) => {
        const at = `sections.experience.orgs[${i}].roles[${j}]`;
        if (!nonEmpty(r.title)) err(`${at}.title`, "required");
        if (!YM.test(r.start || "")) err(`${at}.start`, `must be "YYYY-MM" (got "${r.start}")`);
        if (r.end != null && !YM.test(r.end)) err(`${at}.end`, `must be "YYYY-MM" or null (got "${r.end}")`);
      });
    });
  }

  // research + project
  if (enabled(S.research) && isObj(S.research.project)) {
    const p = S.research.project;
    if (p.enabled !== false) {
      const hasOwner = nonEmpty(p.owner), hasRepo = nonEmpty(p.repoName);
      if (hasOwner !== hasRepo) err("sections.research.project", "set BOTH owner and repoName for live GitHub roadmap sync, or neither");
      if (isArr(p.milestones)) p.milestones.forEach((m, i) => {
        if (!nonEmpty(m.phase)) err(`…project.milestones[${i}].phase`, "required");
        if (!nonEmpty(m.title)) err(`…project.milestones[${i}].title`, "required");
        if (!["done", "active", "planned"].includes(m.status)) err(`…project.milestones[${i}].status`, `must be done|active|planned (got "${m.status}")`);
      });
    }
  }

  // writing
  if (enabled(S.writing)) {
    const tracks = S.writing.tracks;
    if (!isArr(tracks) || !tracks.length) err("sections.writing.tracks", "at least one track required");
    else {
      const ids = new Set();
      tracks.forEach((t, i) => {
        const at = `sections.writing.tracks[${i}]`;
        if (!nonEmpty(t.id)) err(`${at}.id`, "required");
        else if (ids.has(t.id)) err(`${at}.id`, `duplicate track id "${t.id}"`);
        else ids.add(t.id);
        if (!nonEmpty(t.label)) err(`${at}.label`, "required");
        if (t.accent && !["cool", "warm"].includes(t.accent)) err(`${at}.accent`, `must be "cool" or "warm" (got "${t.accent}")`);
        if (isArr(t.sources)) t.sources.forEach((s, j) => {
          if (!SRC_TYPES.includes(s.type)) err(`${at}.sources[${j}].type`, `must be one of: ${SRC_TYPES.join(", ")} (got "${s.type}")`);
          else if (["medium", "substack", "devto"].includes(s.type) && !nonEmpty(s.handle)) err(`${at}.sources[${j}]`, `type "${s.type}" needs a "handle"`);
          else if (s.type === "rss" && !nonEmpty(s.url)) err(`${at}.sources[${j}]`, 'type "rss" needs a "url"');
          if (s.handle === "samrivera") warn(`${at}.sources[${j}].handle`, 'still the demo handle "samrivera"');
        });
        if (isArr(t.posts)) t.posts.forEach((p, j) => {
          if (!nonEmpty(p.title)) err(`${at}.posts[${j}].title`, "required");
          if (!nonEmpty(p.url)) err(`${at}.posts[${j}].url`, "required");
        });
      });
    }
  }

  // speaking
  if (enabled(S.speaking) && isObj(S.speaking.featured)) {
    if (!nonEmpty(S.speaking.featured.title)) err("sections.speaking.featured.title", "required when featured is set");
  }
}

/* ---- run ---- */
const C = await loadConfig();
if (C) validate(C);

const RED = "\x1b[31m", YEL = "\x1b[33m", GRN = "\x1b[32m", DIM = "\x1b[2m", RST = "\x1b[0m";
if (errors.length) {
  console.log(`${RED}✖ ${errors.length} error${errors.length > 1 ? "s" : ""}${RST}`);
  errors.forEach((e) => console.log(`  ${RED}✖${RST} ${e}`));
}
if (warnings.length) {
  console.log(`${YEL}▲ ${warnings.length} warning${warnings.length > 1 ? "s" : ""}${RST} ${DIM}(fill these in before deploying)${RST}`);
  warnings.forEach((w) => console.log(`  ${YEL}▲${RST} ${w}`));
}
if (!errors.length && !warnings.length) console.log(`${GRN}✔ config is valid — ready to deploy.${RST}`);
else if (!errors.length) console.log(`${GRN}✔ config is valid${RST} (warnings are optional to-dos).`);

process.exit(errors.length ? 1 : 0);
