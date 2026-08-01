/*
 * Build the Pagefind search index from Next.js's prerendered HTML.
 * Phase 5A, PR 9.
 *
 * Runs after `next build`, writes to public/pagefind/, and is wired into the
 * production build command so Vercel picks the output up when it collects
 * static files. public/pagefind/ is generated build output and is gitignored;
 * it must never be committed.
 *
 * Three things this does that a bare `pagefind --site` call does not:
 *
 * 1. STAGING. Next.js writes prerendered pages as FILES (`news/foo.html`), not
 *    as directories. Pagefind derives a result URL from the file path, so
 *    indexing `.next/server/app` directly yields `/news/foo.html` — a URL this
 *    site does not serve. Staging into a directory-per-route tree makes
 *    Pagefind emit `/news/foo/` natively, so no consumer has to rewrite URLs.
 *
 * 2. SCOPE. Only Knowledge Centre content pages are indexed. Everything else
 *    is excluded by construction: the allow-list is the mechanism, so a new
 *    marketing page cannot drift into the index by being forgotten.
 *
 * 3. GUARDS. The prerendered-HTML directory is an internal Next.js detail, and
 *    Pagefind will happily produce a smaller index rather than fail. Every
 *    assumption is therefore asserted, and a failed assertion exits non-zero.
 *    A search index that is quietly wrong is worse than a build that stops.
 */

import { existsSync, mkdirSync, copyFileSync, rmSync, readdirSync, statSync, readFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { execFileSync } from "node:child_process";
import { gunzipSync } from "node:zlib";

/*
 * Paths and the page floor are overridable by environment variable purely so
 * tests/search-index.test.mjs can drive the failure guards against fixture
 * directories without rewriting this file or clobbering the real index. The
 * build never sets them.
 */
const APP_DIR = process.env.SEARCH_INDEX_APP_DIR ?? ".next/server/app";
const STAGE_DIR = process.env.SEARCH_INDEX_STAGE_DIR ?? ".pagefind-stage";
const OUT_DIR = process.env.SEARCH_INDEX_OUT_DIR ?? "public/pagefind";

/*
 * The six Knowledge Centre sections. Kept as a literal rather than imported
 * from lib/knowledge.ts because this script runs as plain Node against build
 * output, with no TypeScript or module-alias resolution available — and a
 * build step that needs a transpiler to decide what to index is a build step
 * that breaks on a toolchain upgrade. The list is short, and
 * tests/search-index.test.mjs asserts it against lib/knowledge.ts so the two
 * cannot drift.
 */
const KNOWLEDGE_SECTIONS = ["guides", "glossary", "standards", "legislation", "news", "downloads"];

/*
 * Aggregation routes: section landing pages (/guides, /news) and the news year
 * archives (/news/2026). These are Knowledge Centre pages, but their text is
 * assembled from the summaries of pages that are themselves indexed, so
 * including them returns the same content two or three times over. Measured on
 * the current site: "second staircase" returned the article, /news/2026 and
 * /news — two of the three results being lists quoting the first.
 */
const isAggregation = (segments) =>
  segments.length <= 1 || (segments[0] === "news" && /^\d{4}$/.test(segments[1]));

/*
 * The floor is a tripwire, not a target. It sits well below the real page
 * count so ordinary content growth never trips it, but a structural failure —
 * the directory moving, prerendering switching off, the allow-list matching
 * nothing — cannot pass unnoticed.
 */
const MIN_PAGES = Number(process.env.SEARCH_INDEX_MIN_PAGES ?? 40);

const fail = (message) => {
  console.error(`\n  Search index build failed.\n  ${message}\n`);
  process.exit(1);
};

// --- Guard 1: the prerendered HTML must be where we expect it ---------------

if (!existsSync(APP_DIR)) {
  fail(
    `Expected prerendered HTML at "${APP_DIR}" but the directory does not exist.\n` +
      `  Run "next build" first. If the build did run, Next.js may have changed\n` +
      `  where it writes prerendered pages — update APP_DIR in this script.`
  );
}

const htmlFiles = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith(".html")) htmlFiles.push(full);
  }
};
walk(APP_DIR);

// --- Guard 2: it must actually contain something ----------------------------

if (htmlFiles.length === 0) {
  fail(`Found "${APP_DIR}" but it contains no .html files.\n  Prerendering has produced nothing to index.`);
}

// --- Stage the pages that belong in the index -------------------------------

rmSync(STAGE_DIR, { recursive: true, force: true });

const staged = [];
const excluded = [];

for (const file of htmlFiles) {
  const route = relative(APP_DIR, file).replace(/\.html$/, "").split(sep).join("/");
  const segments = route === "index" ? [] : route.split("/");
  const url = segments.length ? `/${segments.join("/")}/` : "/";

  const reject = (reason) => {
    excluded.push({ url, reason });
    return true;
  };

  if (!segments.length || !KNOWLEDGE_SECTIONS.includes(segments[0])) {
    reject("outside the Knowledge Centre");
    continue;
  }
  if (isAggregation(segments)) {
    reject("aggregation page");
    continue;
  }

  /*
   * A page that tells search engines not to index it should not be in the
   * site's own search either — a withdrawn download stays at 200 so an old
   * citation resolves, but surfacing it as a live search result would undo
   * that care. Read from the built HTML rather than re-deriving the rule from
   * content metadata, so this cannot disagree with what the page declares.
   */
  const source = readFileSync(file, "utf8");
  if (/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(source)) {
    reject("declares noindex");
    continue;
  }

  const target = join(STAGE_DIR, ...segments, "index.html");
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(file, target);
  staged.push(url);
}

// --- Guard 3: enough pages to be a real index -------------------------------

if (staged.length < MIN_PAGES) {
  fail(
    `Only ${staged.length} page(s) staged for indexing; expected at least ${MIN_PAGES}.\n` +
      `  Either a large number of routes stopped being prerendered, or the\n` +
      `  Knowledge Centre allow-list in this script no longer matches the site.`
  );
}

// --- Index ------------------------------------------------------------------

rmSync(OUT_DIR, { recursive: true, force: true });

/*
 * --root-selector main confines indexing to the page's main landmark. Without
 * it the header, primary navigation and footer are indexed on every page:
 * excerpts open with navigation labels and a phone number, and every page
 * matches every menu item.
 */
execFileSync(
  "npx",
  ["--no-install", "pagefind", "--site", STAGE_DIR, "--output-path", OUT_DIR, "--root-selector", "main"],
  { stdio: "inherit" }
);

const entryPath = join(OUT_DIR, "pagefind-entry.json");
if (!existsSync(entryPath)) fail(`Pagefind reported success but wrote no index at "${entryPath}".`);

// --- Guard 4: Pagefind indexed everything that was staged -------------------

const entry = JSON.parse(readFileSync(entryPath, "utf8"));
const indexed = Object.values(entry.languages ?? {}).reduce((total, lang) => total + (lang.page_count ?? 0), 0);

if (indexed !== staged.length) {
  fail(
    `Staged ${staged.length} page(s) but Pagefind indexed ${indexed}.\n` +
      `  Some pages were skipped — most likely a page with no <main> element.`
  );
}

// --- Guard 5: every indexed URL is a real, servable route -------------------
//
// Guards 1-4 all pass if the staging step regresses to file-based paths, so
// this reads the URLs back out of the index Pagefind actually produced rather
// than trusting the list we think we staged.

const fragmentDir = join(OUT_DIR, "fragment");
const indexedUrls = readdirSync(fragmentDir).map((name) => {
  const raw = readFileSync(join(fragmentDir, name));
  /* Fragments are gzipped JSON behind a short Pagefind marker. Decompress and
     parse rather than pattern-matching the compressed bytes, which silently
     matches almost nothing and would make this guard pass by accident. */
  const text = gunzipSync(raw).toString("utf8");
  const json = JSON.parse(text.slice(text.indexOf("{")));
  return json.url;
});

if (indexedUrls.length !== indexed) {
  fail(`Pagefind reported ${indexed} page(s) but wrote ${indexedUrls.length} fragment(s).`);
}

const withHtmlSuffix = indexedUrls.filter((url) => url.includes(".html"));
if (withHtmlSuffix.length) {
  fail(
    `${withHtmlSuffix.length} indexed URL(s) contain ".html", e.g. ${withHtmlSuffix[0]}\n` +
      `  Result links would 404. The directory-per-route staging step has regressed.`
  );
}

// --- Guard 6: nothing excluded found its way in ------------------------------

const leaked = indexedUrls.filter((url) => {
  const segments = url.replace(/^\/|\/$/g, "").split("/");
  return !KNOWLEDGE_SECTIONS.includes(segments[0]) || isAggregation(segments);
});
if (leaked.length) {
  fail(
    `${leaked.length} excluded route(s) present in the index, e.g. ${leaked[0]}\n` +
      `  The Knowledge Centre allow-list is not being applied.`
  );
}

rmSync(STAGE_DIR, { recursive: true, force: true });

const bySection = KNOWLEDGE_SECTIONS.map((s) => `${s} ${staged.filter((u) => u.startsWith(`/${s}/`)).length}`).join(", ");
console.log(
  `Search index: ${indexed} pages indexed (${bySection}), ` +
    `${excluded.length} excluded, ${indexedUrls.length} fragments written.`
);
