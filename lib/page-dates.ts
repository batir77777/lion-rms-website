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
// PROVENANCE: TWO FORMS, AND ONLY TWO
// ---------------------------------------------------------------------------
//
// `source` normally cites the commit a date was traced to:
//
//     "574519f — Type 3 corrected to Type 4 and explanations rewritten"
//
// That form cannot express a date SET BY the change that records it. The SHA
// does not exist until the commit is written, and amending the entry
// afterwards changes the SHA again. For those, and only those, use:
//
//     "change-record: YYYY-MM-DD — what changed"
//
// /case-studies is the first. Its date is the day three summary-only cards
// were withdrawn from the index, by the change that wrote this line.
//
// tests/sitemap-dates accepts these two shapes and nothing else — not a bare
// date, not a free-form sentence with a date in it. Prefer the commit form
// wherever a commit can honestly be named.
//
// ---------------------------------------------------------------------------
// WHY ALL SEVENTEEN HASHES MOVED WHEN app/not-found.tsx WAS ADDED
// ---------------------------------------------------------------------------
//
// Adding a custom 404 changed the rendered bytes of EVERY page on the site,
// and the reason is not obvious: the root layout's `notFound` slot is
// serialised into each page's RSC flight payload. Before, that payload carried
// Next.js's built-in default 404 markup; now it carries ours. The React
// reference numbering in the payload shifts with it, which cascades through
// the rest of the document.
//
// So seventeen hashes were re-recorded and NOT ONE `lastModified` moved. The
// 404 is a new page; nothing on the other seventeen changed for a reader. That
// is the policy's second case, applied at scale.
//
// (/case-studies carries 2026-08-08 from the change before this one, where
// three summary-only cards were withdrawn. That date is not this change's.)
//
// Worth knowing before the next change of this kind: any edit to something the
// root layout renders — the header, the footer, the 404 slot — will move all
// seventeen. That is the mechanism working, not a fault, but it means the
// question "which of these did a reader actually notice?" has to be answered
// deliberately rather than by re-recording the lot and moving on.
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
// WHY FIFTEEN HASHES MOVED WHEN THE FOOTER GAINED A SERVICES COLUMN
// ---------------------------------------------------------------------------
//
// Repositioning PR1 (9 August 2026) added a Services column to the footer —
// see FOOTER_SERVICE_LINKS in lib/site.ts. The footer is rendered by the root
// layout, so — exactly as when app/not-found.tsx was added — every page's
// rendered bytes changed and every hash moved. Three routes ALSO changed
// `lastModified`, because their own content genuinely changed for a reader,
// not just their footer: `/services` (a new Fire Engineering card appeared),
// `/services/fire-safety` (retitled and restructured — see below), and the
// new `/services/fire-engineering`. The other fifteen entries below have new
// hashes and unchanged dates, for the same reason the seventeen did after the
// 404: nothing on those fifteen pages moved except the footer underneath them.
//
// `/services/fire-safety` is also the first page to carry PR1's two-section
// restructuring — see the ServiceSection type and its comment in lib/site.ts.
// Fire Risk Assessments now leads the page as a featured section; Fire Safety
// Consultancy follows as a second, separately anchored section. The two items
// that used to open the page — "Fire Engineering" and "Fire Strategies" — are
// gone from here because they moved to the new `/services/fire-engineering`,
// not because they were cut.
// ---------------------------------------------------------------------------
// WHY TWO HASHES MOVED FOR REPOSITIONING PR2 (HOMEPAGE), AND ONLY TWO
// ---------------------------------------------------------------------------
//
// PR2 rewrote the homepage's hero, trust strip, credentials-strip intro line
// and services section to present Fire Safety & Fire Engineering and Health
// & Safety & Construction Safety as co-equal disciplines. That is a
// substantive, reader-visible change, so `/` gets both a new hash and a new
// `lastModified`.
//
// `/services/health-safety` also gets a new hash, for a narrower reason: its
// "RAMS and Construction Phase Plans" item gained a stable `id` so the
// homepage's new Construction Health & Safety card can deep-link to it. The
// `id` attribute itself renders nothing a reader sees — no visible text,
// styling, or layout changed — so `lastModified` stays at 2026-07-29.
//
// Two other flat-item category pages, `/services/fire-engineering` and
// `/services/compliance-support`, share the same page component
// (app/services/[slug]/page.tsx) that gained this `id`-rendering logic, and a
// first version of the change moved their hashes too, for no reader-visible
// reason at all: React was serialising an explicit `"id":"$undefined"` into
// the RSC payload for every item without one. The fix spreads `id` in only
// when the item actually has one (see the comment at the call site), which
// keeps those two pages' hashes exactly where they were. Only the one page
// whose markup genuinely changed — health-safety, which now has a real `id`
// on one item — moved.
// ---------------------------------------------------------------------------
// WHY EVERY HASH MOVED AGAIN FOR REPOSITIONING PR3 (FIRE SAFETY CONSULTANCY
// ROUTE SEPARATION), AND WHICH THREE ALSO CHANGED DATE
// ---------------------------------------------------------------------------
//
// PR3 gives Fire Safety Consultancy its own page, `/services/fire-safety-
// consultancy`, carved out of the section it used to share with Fire Risk
// Assessments on `/services/fire-safety` (see ServiceSection, ServicePointer
// and the new SERVICE_CATEGORIES entry in lib/site.ts). Splitting it out
// changes FOOTER_SERVICE_LINKS's entry for Fire Safety Consultancy from an
// anchor into a real route. The footer renders on every page via the root
// layout, so — exactly as with the branded 404 and PR1's footer Services
// column — every authored and dynamic route's hash moves again, even though
// almost none of those pages' own visible content changed.
//
// Three routes ALSO changed `lastModified`, because a reader genuinely
// notices something different on them, not just their footer:
//
//   - `/services/fire-safety` — the Fire Safety Consultancy section (five
//     items) is gone from the page, replaced by a one-sentence pointer at the
//     anchor it used to occupy. The title, short description and intro were
//     also rewritten to lead with Fire Risk Assessments alone.
//   - `/services` — a fifth service card (Fire Safety Consultancy) appears,
//     same precedent as PR1 adding the Fire Engineering card.
//   - `/services/fire-safety-consultancy` — new page.
//
// The homepage's Fire Safety Consultancy card changes `href` (from the old
// anchor to the new page) with its title and description text unchanged —
// treated as hash-only, the same call made for the `id` attribute in PR2,
// since no visible text, styling or layout on `/` itself changed.
//
// Everything else below — every sector, case study, and the other two
// service pages — has a new hash and an UNCHANGED date: nothing on those
// pages moved except the footer underneath them.
// ---------------------------------------------------------------------------
// WHY ONLY THREE HASHES MOVED FOR REPOSITIONING PR4 (QUALIFICATIONS &
// PROFESSIONAL CREDIBILITY) — NOT EVERY PAGE, THIS TIME
// ---------------------------------------------------------------------------
//
// PR4 adds a third qualification (Level 6 Diploma in Applied Health and
// Safety) and a new "professional card" category (CSCS Professionally
// Qualified Person) — see QUALIFICATIONS and the new PROFESSIONAL_CARDS in
// lib/site.ts. Unlike PR1's footer column and PR3's footer-link change,
// neither of which could avoid touching every page, this change was
// deliberately kept out of anything the root layout renders on every route.
// ASSESSOR.bio — which feeds both PersonJsonLd's description on /about AND,
// via StructuredData.tsx, the sitewide ProfessionalService JSON-LD's
// founder.description on every page — was checked and deliberately NOT
// extended with the new credentials, precisely to avoid that cascade; see
// the comment on ASSESSOR.bio in lib/site.ts. The three pages that actually
// render CREDENTIALS/QUALIFICATIONS/PROFESSIONAL_CARDS directly are the only
// ones affected:
//
//   - `/` — the credentials strip and the AssessorSection badge row both gain
//     two new badges (the Level 6 Diploma and CSCS Professionally Qualified
//     Person). The hero eyebrow badge, hero sub-line and bottom CTA line are
//     deliberately left unchanged — kept concise, per the owner's explicit
//     instruction not to expand the hero into a long list of three diplomas.
//   - `/about` — a new paragraph on health & safety competence (naming the
//     Level 6 Diploma, CMIOSH, MIIRSM, AIEMA and CSCS Professionally
//     Qualified Person), the "Competence" value card rewritten to cover both
//     disciplines, and the credentials badge row gains the same two entries.
//     Person JSON-LD's hasCredential also gains a "Professional Card"
//     category — sourced from PROFESSIONAL_CARDS directly, not from bio.
//   - `/contact` — the "Qualifications" badge block gains the same two
//     entries.
//
// Every other authored route, and Footer.tsx itself, is untouched — verified
// by rebuilding after the ASSESSOR.bio decision above and confirming all
// sixteen other hashes matched their PR3-recorded values exactly.
//
// No award date, grade or expiry appears anywhere in this file, in
// lib/site.ts, or in any rendered page or structured data — per the owner's
// explicit instruction, only the qualification title and the card's printed
// category are recorded.
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
    lastModified: "2026-08-10",
    contentHash: "cfb5152ed716736e",
    source: "change-record: 2026-08-10 — credentials strip and AssessorSection gain the Level 6 Diploma and CSCS Professionally Qualified Person status (repositioning PR4)",
  },
  "/about": {
    lastModified: "2026-08-10",
    contentHash: "38421aad0f908d6e",
    source: "change-record: 2026-08-10 — new health & safety competence paragraph, rewritten Competence value card, new credentials (repositioning PR4)",
  },
  "/services": {
    lastModified: "2026-08-10",
    contentHash: "55f3a78d4436724f",
    source: "b9df1fa — Fire Safety Consultancy added as its own service card (repositioning PR3)",
  },
  "/services/fire-safety": {
    lastModified: "2026-08-10",
    contentHash: "a60f82e9b998a832",
    source: "b9df1fa — Fire Safety Consultancy section moved to its own page, replaced by a one-sentence pointer (repositioning PR3)",
  },
  "/services/fire-safety-consultancy": {
    lastModified: "2026-08-10",
    contentHash: "ab6ebd2d28d1c976",
    source: "b9df1fa — new page, carved out of fire-safety's former Fire Safety Consultancy section (repositioning PR3)",
  },
  "/services/fire-engineering": {
    lastModified: "2026-08-09",
    contentHash: "3c2d4b9e8da84dff",
    source: "c9c3ae9 — new page, carved out of fire-safety's former Fire Engineering and Fire Strategies items (repositioning PR1)",
  },
  "/services/health-safety": {
    lastModified: "2026-07-29",
    contentHash: "789ac90f96df8cd0",
    source: "2caa255 — service pages link related guides instead of insights",
  },
  "/services/compliance-support": {
    lastModified: "2026-07-29",
    contentHash: "7995d2690912d3f2",
    source: "2caa255 — service pages link related guides instead of insights",
  },
  "/sectors": {
    lastModified: "2026-07-26",
    contentHash: "51f00cfe3da4bebf",
    source: "04ae4c7 — page authored",
  },
  "/sectors/residential-blocks-hmos": {
    lastModified: "2026-07-29",
    contentHash: "ae09567549ceddf9",
    source: "1e19d62 — sector pages link related guides",
  },
  "/sectors/offices-commercial-workplaces": {
    lastModified: "2026-07-29",
    contentHash: "2fd5fdcbc929da3f",
    source: "1e19d62 — sector pages link related guides",
  },
  "/sectors/education": {
    lastModified: "2026-07-29",
    contentHash: "aee48874a1e76020",
    source: "1e19d62 — sector pages link related guides",
  },
  "/case-studies": {
    lastModified: "2026-08-08",
    contentHash: "86eb631bc824dad4",
    source: "change-record: 2026-08-08 — remove three unpublished summary case-study cards",
  },
  "/case-studies/residential-portfolio-fire-risk-assessment": {
    lastModified: "2026-08-01",
    contentHash: "5987edd67fa93a79",
    source: "574519f — Type 3 corrected to Type 4 and explanations rewritten",
  },
  "/case-studies/mixed-use-fire-strategy-change-of-use": {
    lastModified: "2026-08-01",
    contentHash: "1d76ac13fdfd2e13",
    source: "574519f — Type 3 corrected to Type 4 and explanations rewritten",
  },
  "/case-studies/multi-site-commercial-compliance-management": {
    lastModified: "2026-08-01",
    contentHash: "af0470cee297147d",
    source: "574519f — Type 3 corrected to Type 4 and explanations rewritten",
  },
  "/faq": {
    lastModified: "2026-08-01",
    contentHash: "3b346b013cb6f372",
    source: "574519f — FAQS Type 1-4 answer rewritten in lib/site.ts",
  },
  "/check": {
    lastModified: "2026-08-01",
    contentHash: "244780ae093b8a07",
    source: "8822620 — 'What this result is, and is not' disclaimer added",
  },
  "/contact": {
    lastModified: "2026-08-10",
    contentHash: "f6be5b7bca5bf705",
    source: "change-record: 2026-08-10 — Qualifications badge block gains the Level 6 Diploma and CSCS Professionally Qualified Person status (repositioning PR4)",
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
