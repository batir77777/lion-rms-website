// ---------------------------------------------------------------------------
// Modification dates for authored pages (Phase 5A, PR 10).
//
// WHY THIS FILE EXISTS
//
// Until PR 10 the sitemap stamped 26 of its 78 URLs with `new Date()` — the
// moment the build ran. Every deployment therefore told Google that the
// homepage, every service page, every sector page and every case study had
// changed that day, whether or not a word had moved. A date that changes daily
// carries no information, and a date that is wrong every day is worse than no
// date at all.
//
// There is now no code path anywhere in app/sitemap.ts that can produce a
// build timestamp. Dates come from exactly two places:
//
//   1. CONTENT PAGES (52) — from the item's own front matter. Untouched by
//      this PR.
//   2. AGGREGATION PAGES (9) — derived from the newest item each one lists.
//      A listing page genuinely does change when its newest entry changes, so
//      this needs no registry and no maintenance.
//   3. AUTHORED PAGES (17) — this file. These have no content date anywhere
//      else, so one is recorded here.
//
// ---------------------------------------------------------------------------
// THE POLICY  (approved 8 August 2026)
// ---------------------------------------------------------------------------
//
// A substantive, user-facing content change:
//     update BOTH `contentHash` and `lastModified`.
//
// An accessibility-only, layout-only, metadata-only or refactor-only change:
//     update `contentHash` ONLY. Leave `lastModified` alone.
//
// The distinction cannot be automated, and pretending otherwise would be
// worse than stating it plainly: an aria-hidden attribute and a rewritten
// paragraph both change the rendered HTML, so the hash moves either way. What
// IS automated is that you cannot ignore the question — tests/sitemap-dates
// fails the build when a page's rendered output no longer matches its recorded
// hash, and names the page. At that point a human decides which of the two
// cases applies and edits accordingly.
//
// The homepage is the worked example. PR #28 moved four decorative step
// numerals from DOM text into CSS to clear a WCAG contrast failure. The
// rendered HTML changed, so the hash changed. Not one word a reader sees
// changed, so `lastModified` stayed at 2026-08-01.
//
// ---------------------------------------------------------------------------
// UPDATING A DATE
// ---------------------------------------------------------------------------
//
//   1. Make the change and run `npm run build`.
//   2. Run `npm test`. If the page's content changed, the sitemap-dates suite
//      fails and prints the route plus its new hash.
//   3. Paste the new hash in below.
//   4. If a reader would notice the change, set `lastModified` to today as
//      well. If they would not, leave it.
//
// `npm run sitemap:hashes` prints the current hash of every authored route,
// for when you would rather read them all than run the suite.
//
// ---------------------------------------------------------------------------
// WHERE THE INITIAL DATES CAME FROM
// ---------------------------------------------------------------------------
//
// Each was traced through git history and approved individually on 8 August
// 2026. The most recent commit touching a route was NOT used where it was
// metadata-only — every route's newest commit was a "Quality fixes: … twitter"
// or "Audit fixes: … OG" change, and taking those would have dated the whole
// site to the day the Open Graph sweep ran. The commit recorded against each
// entry is the most recent one that changed something a reader sees.
//
// ---------------------------------------------------------------------------
// WHY NINE HASHES WERE RE-RECORDED WITHOUT ANY CONTENT CHANGING
// ---------------------------------------------------------------------------
//
// The nine dynamic routes — three /services, three /sectors, three
// /case-studies detail pages — carry hashes recorded AFTER a normaliser fix,
// not after an edit. Their original values were computed by a normaliser that
// could not strip the chunk hash out of a percent-encoded path, so they had a
// build artefact baked into them. See the note on the chunk regex in
// normalisePageHtml() for the mechanism.
//
// The consequence is worth stating plainly, because it is the reason the fix
// mattered: those nine values were only ever valid on a machine whose
// node_modules happened to produce the same chunk hash. Anywhere else — a
// fresh clone, CI, a colleague's laptop — the guard reported nine pages as
// content-changed when nothing had changed, which is precisely the kind of
// false alarm that teaches people to ignore a failing test.
//
// No `lastModified` was touched. Not one word a reader sees changed; only the
// measurement did.
// ---------------------------------------------------------------------------

export interface PageDate {
  /** ISO date, YYYY-MM-DD. The last substantive user-facing content change. */
  lastModified: string;
  /** SHA-256 of the page's normalised built HTML. See normalisePageHtml(). */
  contentHash: string;
  /** The commit the date was traced to, and what it changed. Provenance, not code. */
  source: string;
}

export const AUTHORED_PAGE_DATES: Record<string, PageDate> = {
  "/": {
    lastModified: "2026-08-01",
    contentHash: "a7415563b2f56f22",
    source: "3e0e37e — homepage credentials wording rewritten",
  },
  "/about": {
    lastModified: "2026-08-01",
    contentHash: "9d8dfca6adcb3ca9",
    source: "d43d809 — 'Advanced Diploma' corrected to 'Level 4 Diploma'",
  },
  "/services": {
    lastModified: "2026-07-28",
    contentHash: "d0b71f695d2c0688",
    source: "0a97294 — tri-disciplinary hero copy",
  },
  "/services/fire-safety": {
    lastModified: "2026-07-29",
    contentHash: "ce335f4ec7a959bd",
    source: "2caa255 — service pages link related guides instead of insights",
  },
  "/services/health-safety": {
    lastModified: "2026-07-29",
    contentHash: "d837ce62613f6503",
    source: "2caa255 — service pages link related guides instead of insights",
  },
  "/services/compliance-support": {
    lastModified: "2026-07-29",
    contentHash: "b021c847d7df14ed",
    source: "2caa255 — service pages link related guides instead of insights",
  },
  "/sectors": {
    lastModified: "2026-07-26",
    contentHash: "7b1872a3c6c174c7",
    source: "04ae4c7 — page authored",
  },
  "/sectors/residential-blocks-hmos": {
    lastModified: "2026-07-29",
    contentHash: "4c1f3b09dfe5f9b3",
    source: "1e19d62 — sector pages link related guides",
  },
  "/sectors/offices-commercial-workplaces": {
    lastModified: "2026-07-29",
    contentHash: "70f9f0ecb0a140d5",
    source: "1e19d62 — sector pages link related guides",
  },
  "/sectors/education": {
    lastModified: "2026-07-29",
    contentHash: "8e141b1155834682",
    source: "1e19d62 — sector pages link related guides",
  },
  "/case-studies": {
    lastModified: "2026-08-01",
    contentHash: "11d77e32864ccde1",
    source: "574519f — FRA type copy corrected in lib/case-studies.ts, rendered on the index",
  },
  "/case-studies/residential-portfolio-fire-risk-assessment": {
    lastModified: "2026-08-01",
    contentHash: "9689466e205cc612",
    source: "574519f — Type 3 corrected to Type 4 and explanations rewritten",
  },
  "/case-studies/mixed-use-fire-strategy-change-of-use": {
    lastModified: "2026-08-01",
    contentHash: "3189dd6b53ce695e",
    source: "574519f — Type 3 corrected to Type 4 and explanations rewritten",
  },
  "/case-studies/multi-site-commercial-compliance-management": {
    lastModified: "2026-08-01",
    contentHash: "e2e221ce9479a7e0",
    source: "574519f — Type 3 corrected to Type 4 and explanations rewritten",
  },
  "/faq": {
    lastModified: "2026-08-01",
    contentHash: "a975878eef167abc",
    source: "574519f — FAQS Type 1-4 answer rewritten in lib/site.ts",
  },
  "/check": {
    lastModified: "2026-08-01",
    contentHash: "ea65bdef39301fd5",
    source: "8822620 — 'What this result is, and is not' disclaimer added",
  },
  "/contact": {
    lastModified: "2026-08-01",
    contentHash: "7af306b0e185dc88",
    source: "238a0c5 — QR code block added",
  },
};

/**
 * Reduce a built HTML page to the part of it that is actually content.
 *
 * WHAT IS REMOVED, and nothing else:
 *
 *  - The Next.js build ID. It is regenerated every build and appears twice:
 *    once as an HTML comment, once inside the RSC flight payload. It is
 *    extracted from the comment and every occurrence of that exact string is
 *    replaced, rather than pattern-matched — so this can only ever remove the
 *    build ID and never something that happens to look like one.
 *  - Content hashes in chunk and stylesheet filenames. These move whenever any
 *    shared JavaScript changes, which would otherwise mark every page on the
 *    site as modified because one component was refactored.
 *
 * WHAT SURVIVES: all visible text, headings, links, attributes, meta tags,
 * canonical URLs, Open Graph, and JSON-LD. Verified two ways in
 * tests/sitemap-dates.test.mjs — two consecutive builds produce identical
 * hashes, and inserting a single space into a heading changes them.
 */
export function normalisePageHtml(html: string): string {
  /*
   * The build ID appears in two places and NOT in the same form. Next.js
   * sanitises it inside the HTML comment — a build ID of "1j7r7hqr_qW9raK5t-XLd"
   * is written as "...t_XLd" there — while the RSC flight payload carries it
   * verbatim. Reading only the comment therefore misses the payload copy, and
   * every page hash moves on every build. Both are collected and each is
   * replaced wherever it occurs.
   */
  const candidates = new Set<string>();
  const comment = html.match(/<!--([A-Za-z0-9_-]{16,})-->/)?.[1];
  if (comment) candidates.add(comment);
  for (const m of html.matchAll(/\\"b\\":\\"([A-Za-z0-9_-]{16,})\\"/g)) candidates.add(m[1]);

  let out = html;
  for (const id of candidates) out = out.split(id).join("BUILD_ID");

  return out
    /*
     * Chunk paths appear in two shapes: as "/_next/static/chunks/..." in the
     * <script> tags, and as bare "static/chunks/..." inside the RSC flight
     * payload. The "/_next/" prefix is therefore optional. Names may also be
     * nested — "chunks/app/about/page-<hash>.js" as well as
     * "chunks/255-<hash>.js" — so the name part admits slashes.
     *
     * The name part also admits "%", because a DYNAMIC route's chunk path is
     * percent-encoded: the [slug] segment is emitted as
     *
     *     static/chunks/app/services/%5Bslug%5D/page-<hash>.js
     *
     * Without "%" in the class the match failed at "%5B", the hash was left in
     * place, and the recorded contentHash for every dynamic route moved
     * whenever that chunk's contents changed — nine routes in all: the three
     * /services, three /sectors and three /case-studies detail pages. This was
     * invisible on any machine whose node_modules still produced the chunk
     * hash present when the values were first recorded, and only surfaced on a
     * clean clone with a fresh `npm ci`, where the chunk hash differed. The
     * static routes were never affected, which is what made it look for a
     * while like a content change rather than a normalisation gap.
     */
    .replace(/(\/_next\/)?static\/chunks\/([A-Za-z0-9._%/-]*?)-[0-9a-f]{16,}\.js/g, "$1static/chunks/$2-HASH.js")
    .replace(/(\/_next\/)?static\/css\/[0-9a-f]{8,}\.css/g, "$1static/css/HASH.css");
}

/** Every route this registry covers, in declaration order. */
export const AUTHORED_ROUTES: readonly string[] = Object.keys(AUTHORED_PAGE_DATES);

/**
 * The recorded date for an authored route.
 *
 * Throws rather than falling back. A missing entry means a page reached the
 * sitemap without anyone deciding when it last changed, and the honest
 * response is to stop the build — the alternative is silently reintroducing
 * the build-timestamp problem this PR exists to remove.
 */
export function authoredPageDate(route: string): Date {
  const entry = AUTHORED_PAGE_DATES[route];
  if (!entry) {
    throw new Error(
      `No modification date recorded for the sitemap route "${route}".\n` +
        `Add an entry to lib/page-dates.ts with the date of its last substantive\n` +
        `content change and the hash of its built HTML. Do not use today's date\n` +
        `unless the page genuinely changed today.`
    );
  }
  return new Date(`${entry.lastModified}T00:00:00Z`);
}
