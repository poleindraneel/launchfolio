/*
 * launchfolio — fetch-feeds
 * -------------------------------------------------------------------------
 * Pulls your latest posts from the sources declared in config/site.config.js
 * (per writing track) and writes them to content/writing.js.
 *
 *   node tools/fetch-feeds.mjs     (or: npm run fetch)
 *
 * Supported source types: medium, substack, devto, rss.
 * "linkedin"/"manual" have no public feed — add those posts directly in the
 * config with `manual: true` and they'll be preserved here across runs.
 *
 * Zero dependencies. Needs Node 18+ (built-in fetch). See docs/SOURCES.md.
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, "..", "config", "site.config.js");
const OUT_PATH = join(__dirname, "..", "content", "writing.js");
const MAX_PER_TRACK = 12;

/* ---- load the browser-style config in Node ---- */
async function loadConfig() {
  const src = await readFile(CONFIG_PATH, "utf8");
  const win = {};
  // eslint-disable-next-line no-new-func
  new Function("window", src)(win);
  if (!win.SITE) throw new Error("config/site.config.js did not set window.SITE");
  return win.SITE;
}

function feedUrl(s) {
  switch (s.type) {
    case "medium": return `https://medium.com/feed/@${s.handle}`;
    case "substack": return `https://${s.handle}.substack.com/feed`;
    case "devto": return `https://dev.to/feed/${s.handle}`;
    case "rss": return s.url;
    default: return null; // linkedin / manual
  }
}

/* ---- minimal RSS/Atom parsing ---- */
function tag(xml, name) {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1] : "";
}
function attr(xml, name, a) {
  const m = xml.match(new RegExp(`<${name}[^>]*\\b${a}="([^"]*)"`, "i"));
  return m ? m[1] : "";
}
function clean(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    // numeric character references (covers any script, e.g. Devanagari)
    .replace(/&#x([0-9a-fA-F]+);/g, function (_, h) { try { return String.fromCodePoint(parseInt(h, 16)); } catch (e) { return ""; } })
    .replace(/&#(\d+);/g, function (_, d) { try { return String.fromCodePoint(+d); } catch (e) { return ""; } })
    .replace(/&nbsp;/g, " ").replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    .replace(/\s+/g, " ").trim();
}
function fmtDate(str) {
  const d = new Date(str);
  return isNaN(d) ? "" : d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
function manualTs(dateStr) { const t = Date.parse("1 " + dateStr) || Date.parse(dateStr); return t || 0; }

async function parseFeed(url, sourceLabel) {
  const res = await fetch(url, { headers: { "User-Agent": "launchfolio-feed-fetcher" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  const feedTitle = clean(tag(xml, "title")) || sourceLabel;
  const isAtom = /<entry[>\s]/.test(xml) && !/<item[>\s]/.test(xml);
  const chunks = isAtom ? xml.split(/<entry[>\s]/).slice(1) : xml.split(/<item[>\s]/).slice(1);
  return chunks.map((raw) => {
    const it = (isAtom ? "<entry " : "<item ") + raw;
    const link = isAtom ? attr(it, "link", "href") : clean(tag(it, "link"));
    const pub = clean(tag(it, "pubDate") || tag(it, "published") || tag(it, "updated"));
    const desc = clean(tag(it, "description") || tag(it, "content:encoded") || tag(it, "summary") || tag(it, "content")).slice(0, 160);
    return {
      title: clean(tag(it, "title")),
      date: fmtDate(pub),
      source: sourceLabel || feedTitle,
      excerpt: desc + (desc.length >= 160 ? "…" : ""),
      url: link,
      _ts: new Date(pub).getTime() || 0,
    };
  });
}

const SOURCE_LABEL = { medium: "Medium", substack: "Substack", devto: "dev.to", rss: "" };

async function collectTrack(track) {
  const out = [];
  for (const s of track.sources || []) {
    const url = feedUrl(s);
    if (!url) continue;
    try {
      const label = s.label || SOURCE_LABEL[s.type] || track.label;
      const posts = await parseFeed(url, label);
      out.push(...posts);
      console.log(`  ok   ${track.id} <- ${s.type} (${posts.length})`);
    } catch (e) {
      console.warn(`  skip ${track.id} <- ${s.type}: ${e.message}`);
    }
  }
  // preserve manually-added posts (manual: true) from config
  const manual = (track.posts || []).filter((p) => p.manual).map((p) => ({ ...p, _ts: manualTs(p.date) }));
  return [...out, ...manual]
    .filter((p) => p.title && p.url)
    .sort((a, b) => b._ts - a._ts)
    .slice(0, MAX_PER_TRACK)
    .map(({ _ts, manual, ...rest }) => rest);
}

const j = (v) => JSON.stringify(v);
function serialize(byTrack) {
  const lines = Object.keys(byTrack).map((id) => {
    const items = byTrack[id]
      .map((a) => `    { title: ${j(a.title)}, date: ${j(a.date)}, source: ${j(a.source)}, excerpt: ${j(a.excerpt)}, url: ${j(a.url)} }`)
      .join(",\n");
    return `  ${j(id)}: [\n${items}\n  ]`;
  });
  return "window.SITE_WRITING = {\n" + lines.join(",\n") + "\n};\n";
}

async function main() {
  console.log("Fetching writing feeds…");
  const cfg = await loadConfig();
  const tracks = ((cfg.sections || {}).writing || {}).tracks || [];
  if (!tracks.length) { console.error("No writing tracks in config."); process.exit(1); }

  const byTrack = {};
  let total = 0;
  for (const t of tracks) {
    const posts = await collectTrack(t);
    if (posts.length) { byTrack[t.id] = posts; total += posts.length; }
  }
  if (!total) { console.error("No posts fetched — leaving content/writing.js unchanged."); process.exit(1); }

  const header = "/* Auto-generated by tools/fetch-feeds.mjs — do not edit by hand (re-run the fetcher). */\n";
  await writeFile(OUT_PATH, header + serialize(byTrack), "utf8");
  console.log(`\nWrote content/writing.js — ${total} posts across ${Object.keys(byTrack).length} track(s).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
