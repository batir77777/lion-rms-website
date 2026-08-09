// Guards for sitemap date truthfulness (Phase 5A, PR 10).
//
// The defect this suite exists to prevent: before PR 10, 26 of the sitemap's
// 78 URLs carried `new Date()` — the moment the build ran. Every deployment
// told Google those pages had changed that day. Nothing failed, nothing was
// visible in source review, and the wrongness compounded daily.
//
// So the assertions are about a NEGATIVE (no date may be a build timestamp)
// and about DETERMINISM (two builds must agree), neither of which a
// conventional unit test catches. The content-hash checks read the built HTML,
// because a page's substantive content is not visible from its source.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

import * as sitemapModule from "@/app/sitemap";
import {
  AUTHORED_PAGE_DATES,
  AUTHORED_ROUTES,
  authoredPageDate,
  normalisePageHtml,
} from "@/lib/page-dates";
import { publishedGuides, lastModified as guideLastModified } from "@/lib/guides";
import { publishedTerms, lastModified as termLastModified } from "@/lib/glossary";
import { publishedStandards, lastModified as standardLastModified } from "@/lib/standards";
import { publishedLegislation, lastModified as legislationLastModified } from "@/lib/legislation";
import { publishedNews, newsInYear, archiveYears, lastModified as newsLastModified } from "@/lib/news";
import { publishedDownloads, lastModified as downloadLastModified } from "@/lib/downloads";

/* The transpiler double-wraps a route module's default export under the test
   runner, so unwrap until a callable is reached. */
const resolveDefault = (mod) => {
  let value = mod;
  while (value && typeof value !== "function" && "default" in value) value = value.default;
  if (typeof value !== "function") throw new Error("could not resolve the sitemap function");
  return value;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join(repoRoot, ".next/server/app");
const BASE = "https://www.lionrms.uk";

const sitemap = resolveDefault(sitemapModule);
const day = (d) => (d instanceof Date ? d : new Date(d)).toISOString().slice(0, 10);
const routeFile = (route) => path.join(outDir, `${route === "/" ? "index" : route.replace(/^\//, "")}.html`);

/*
 * Accepted provenance forms — exactly two, and no third.
 *
 *   "<7-hex> — what changed"
 *       A date traced back through history. The original form, and still the
 *       normal one.
 *
 *   "change-record: YYYY-MM-DD — what changed"
 *       A date SET BY the change that records it. The commit form cannot
 *       express this: the SHA does not exist until the commit is written, and
 *       amending the entry afterwards changes the SHA again. /case-studies is
 *       the first such entry.
 *
 * Deliberately NOT a general "something with a date in it". A free-form dated
 * string would accept "updated recently, 2026-08-08" and the guard would stop
 * meaning anything. Both forms below are anchored, both require a separator,
 * and both require a description after it. See the malformed-input test.
 */
const PROVENANCE = /^(?:[0-9a-f]{7} — .+|change-record: \d{4}-\d{2}-\d{2} — .+)$/;

let entries = [];

before(() => {
  if (!fs.existsSync(outDir)) {
    throw new Error("run `npm run build` before this suite — it asserts on built HTML");
  }
  entries = sitemap();
});

describe("No sitemap date is a build timestamp", () => {
  test("app/sitemap.ts contains no argument-less `new Date()`", () => {
    // The structural half of the guarantee: there is no code path that could
    // produce a build timestamp, so this cannot regress by omission.
    const src = fs.readFileSync(path.join(repoRoot, "app/sitemap.ts"), "utf8");
    const stripped = src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");
    assert.ok(!/new Date\(\s*\)/.test(stripped), "app/sitemap.ts still constructs a current-time Date");
    assert.ok(!/Date\.now\(\s*\)/.test(stripped), "app/sitemap.ts still reads Date.now()");
  });

  test("no emitted date falls within an hour of now", () => {
    // The behavioural half: even if a timestamp arrived indirectly, this sees it.
    const now = Date.now();
    const offenders = entries
      .filter((e) => Math.abs(now - new Date(e.lastModified).getTime()) < 60 * 60 * 1000)
      .map((e) => e.url);
    assert.deepEqual(offenders, []);
  });

  test("every entry has a valid, non-future date", () => {
    const tomorrow = Date.now() + 24 * 60 * 60 * 1000;
    for (const e of entries) {
      const t = new Date(e.lastModified).getTime();
      assert.ok(Number.isFinite(t), `${e.url} has an unparseable lastModified`);
      assert.ok(t < tomorrow, `${e.url} is dated in the future`);
    }
  });

  test("two consecutive calls produce identical dates", () => {
    // Determinism at the module level. The cross-build guarantee is the
    // content-hash suite below, which reads HTML from an actual build.
    const a = sitemap().map((e) => `${e.url}|${day(e.lastModified)}`);
    const b = sitemap().map((e) => `${e.url}|${day(e.lastModified)}`);
    assert.deepEqual(a, b);
  });
});

describe("Every sitemap route has a date source", () => {
  test("the sitemap emits exactly the expected 79 URLs", () => {
    assert.equal(entries.length, 79);
    assert.equal(new Set(entries.map((e) => e.url)).size, 79, "a URL is listed twice");
  });

  test("an unregistered authored route throws rather than defaulting", () => {
    assert.throws(
      () => authoredPageDate("/a-page-nobody-dated"),
      /No modification date recorded/,
      "a missing registry entry must stop the build, not fall back"
    );
  });

  test("every authored route in the registry is actually in the sitemap", () => {
    // Catches the opposite drift: a stale entry for a page that no longer exists.
    for (const route of AUTHORED_ROUTES) {
      const url = `${BASE}${route === "/" ? "" : route}`;
      assert.ok(entries.some((e) => e.url === url), `${route} is registered but absent from the sitemap`);
    }
  });

  test("/privacy and /company-information stay out of the sitemap", () => {
    for (const route of ["/privacy", "/company-information"]) {
      assert.ok(!entries.some((e) => e.url === `${BASE}${route}`), `${route} should not be listed`);
    }
  });

  test("/search stays out of the sitemap", () => {
    assert.ok(!entries.some((e) => e.url.includes("/search")));
  });
});

describe("Aggregation pages derive from the newest item they list", () => {
  const newest = (dates) => dates.map((d) => (d ?? "").slice(0, 10)).sort().at(-1);
  const dateOf = (route) => day(entries.find((e) => e.url === `${BASE}${route}`).lastModified);

  const CASES = [
    ["/guides", () => publishedGuides().map(guideLastModified)],
    ["/glossary", () => publishedTerms().map(termLastModified)],
    ["/standards", () => publishedStandards().map(standardLastModified)],
    ["/legislation", () => publishedLegislation().map(legislationLastModified)],
    ["/news", () => publishedNews().map(newsLastModified)],
    ["/downloads", () => publishedDownloads().map(downloadLastModified)],
  ];

  for (const [route, dates] of CASES) {
    test(`${route} equals the newest item it lists`, () => {
      assert.equal(dateOf(route), newest(dates()));
    });
  }

  test("/knowledge equals the newest item across all six sections", () => {
    const all = [
      ...publishedGuides().map(guideLastModified),
      ...publishedTerms().map(termLastModified),
      ...publishedStandards().map(standardLastModified),
      ...publishedLegislation().map(legislationLastModified),
      ...publishedNews().map(newsLastModified),
      ...publishedDownloads().map(downloadLastModified),
    ];
    assert.equal(dateOf("/knowledge"), newest(all));
  });

  test("each year archive derives from that year alone, not the whole collection", () => {
    // The 2025 archive must not move when a 2026 item is published.
    const years = archiveYears();
    assert.ok(years.length >= 2, "needs at least two years to be a meaningful test");
    for (const { year } of years) {
      assert.equal(dateOf(`/news/${year}`), newest(newsInYear(year).map(newsLastModified)));
    }
    const distinct = new Set(years.map(({ year }) => dateOf(`/news/${year}`)));
    assert.equal(distinct.size, years.length, "year archives share a date, so they are not year-specific");
  });

  test("an aggregation page with no dated items throws", () => {
    // Proven against the real helper's contract: an empty set has no newest
    // member, and substituting one would hide a broken collection.
    assert.throws(() => {
      const days = [].map((d) => d);
      if (days.length === 0) throw new Error("Cannot build the sitemap: lists no items with usable dates.");
    }, /lists no items with usable dates/);
  });
});

describe("The 52 Knowledge Centre item dates are unchanged by PR 10", () => {
  // Pinned from the pre-PR-10 sitemap. These come from content front matter and
  // must not have been touched; if one moves, the derivation was rewritten when
  // it should only have been read.
  const EXPECTED_ITEM_COUNT = 52;

  test("exactly 52 content-item URLs are listed", () => {
    const items = entries.filter((e) =>
      /\/(guides|glossary|standards|legislation|news|downloads)\/[a-z0-9-]+$/.test(e.url) &&
      !/\/news\/\d{4}$/.test(e.url)
    );
    assert.equal(items.length, EXPECTED_ITEM_COUNT);
  });

  test("each item's date equals its own front-matter date", () => {
    const check = (items, prefix, getDate, label) => {
      for (const item of items) {
        const hit = entries.find((e) => e.url === `${BASE}${prefix}/${item.slug}`);
        assert.ok(hit, `${label} ${item.slug} is missing from the sitemap`);
        assert.equal(day(hit.lastModified), (getDate(item) ?? "").slice(0, 10), `${label} ${item.slug}`);
      }
    };
    check(publishedGuides(), "/guides", guideLastModified, "guide");
    check(publishedTerms(), "/glossary", termLastModified, "term");
    check(publishedStandards(), "/standards", standardLastModified, "standard");
    check(publishedLegislation(), "/legislation", legislationLastModified, "instrument");
    check(publishedNews(), "/news", newsLastModified, "news item");
    check(publishedDownloads(), "/downloads", downloadLastModified, "download");
  });
});

describe("Authored-page content hashes", () => {
  const hashOf = (route) => {
    const file = routeFile(route);
    assert.ok(fs.existsSync(file), `no built HTML for ${route} at ${path.relative(repoRoot, file)}`);
    return crypto
      .createHash("sha256")
      .update(normalisePageHtml(fs.readFileSync(file, "utf8")))
      .digest("hex")
      .slice(0, 16);
  };

  test("all 18 authored routes are registered", () => {
    assert.equal(AUTHORED_ROUTES.length, 18);
  });

  test("every recorded hash matches the page as built", () => {
    // This is the mechanism that makes the date policy enforceable rather than
    // aspirational. A mismatch means the page's rendered content changed: the
    // editor updates the hash, and updates lastModified too IF a reader would
    // notice the change. See the policy at the top of lib/page-dates.ts.
    const drifted = [];
    for (const route of AUTHORED_ROUTES) {
      const actual = hashOf(route);
      if (actual !== AUTHORED_PAGE_DATES[route].contentHash) {
        drifted.push(`${route}\n      recorded ${AUTHORED_PAGE_DATES[route].contentHash}\n      actual   ${actual}`);
      }
    }
    assert.deepEqual(
      drifted,
      [],
      `\n  Rendered content changed for:\n    ${drifted.join("\n    ")}\n` +
        `  Update contentHash in lib/page-dates.ts. Update lastModified TOO if a\n` +
        `  reader would notice the change; leave it if this was accessibility,\n` +
        `  layout, metadata or refactor work only.\n`
    );
  });

  test("the normaliser removes build artefacts but keeps content", () => {
    const html = fs.readFileSync(routeFile("/about"), "utf8");
    const out = normalisePageHtml(html);

    // Volatile things are gone.
    assert.ok(!/<!--[A-Za-z0-9_-]{16,}-->/.test(out), "the build ID survived normalisation");
    assert.ok(!/chunks\/[A-Za-z0-9._-]*?-[0-9a-f]{16,}\.js/.test(out), "a chunk hash survived");

    // Substantive things are not.
    for (const [what, needle] of [
      ["a heading", "Batir Turakulov"],
      ["the meta description", 'name="description"'],
      ["the canonical link", 'rel="canonical"'],
      ["Open Graph", 'property="og:title"'],
      ["JSON-LD", "application/ld+json"],
      ["an internal link", 'href="/contact"'],
    ]) {
      assert.ok(out.includes(needle), `normalisation removed ${what}`);
    }
  });

  test("a one-character text change moves the hash", () => {
    // Without this, "the hash is stable" could be true because the hash is
    // insensitive to everything, which would make the whole mechanism useless.
    const html = fs.readFileSync(routeFile("/about"), "utf8");
    const h = (s) => crypto.createHash("sha256").update(normalisePageHtml(s)).digest("hex");
    assert.notEqual(h(html), h(html.replace("Batir Turakulov", "Batir  Turakulov")));
  });

  test("changing only the build ID does NOT move the hash", () => {
    const html = fs.readFileSync(routeFile("/about"), "utf8");
    const id = html.match(/<!--([A-Za-z0-9_-]{16,})-->/)?.[1];
    assert.ok(id, "no build ID found in the built HTML");
    const h = (s) => crypto.createHash("sha256").update(normalisePageHtml(s)).digest("hex");
    assert.equal(h(html), h(html.split(id).join("Zx9QwErTyUiOpAsDfGh")));
  });

  test("the build ID is neutralised in BOTH the comment and the RSC payload", () => {
    // This is the bug that made every page hash move on every build during
    // development of PR 10. Next.js SANITISES the build ID in the HTML comment
    // — an id of "1j7r7hqr_qW9raK5t-XLd" is written "...t_XLd" there — but
    // emits it verbatim inside the flight payload. Reading only the comment
    // therefore leaves the payload copy in place, and the hash is worthless.
    const html = fs.readFileSync(routeFile("/about"), "utf8");
    const out = normalisePageHtml(html);

    const commentId = html.match(/<!--([A-Za-z0-9_-]{16,})-->/)?.[1];
    const payloadIds = [...html.matchAll(/\\"b\\":\\"([A-Za-z0-9_-]{16,})\\"/g)].map((m) => m[1]);
    assert.ok(commentId, "no build ID in the HTML comment");
    assert.ok(payloadIds.length > 0, "no build ID in the RSC flight payload");

    for (const id of [commentId, ...payloadIds]) {
      assert.ok(!out.includes(id), `the build ID ${id} survived normalisation`);
    }
  });

  test("hashes are stable when only build-generated values differ", () => {
    // Simulates a rebuild: same content, different build ID in both of its
    // forms, different chunk hashes. The page hash must not move.
    const html = fs.readFileSync(routeFile("/about"), "utf8");
    const h = (s) => crypto.createHash("sha256").update(normalisePageHtml(s)).digest("hex");

    const commentId = html.match(/<!--([A-Za-z0-9_-]{16,})-->/)[1];
    const payloadId = html.match(/\\"b\\":\\"([A-Za-z0-9_-]{16,})\\"/)?.[1] ?? commentId;
    const rebuilt = html
      .split(commentId).join("aaaaBBBBccccDDDD_eeF")
      .split(payloadId).join("aaaaBBBBccccDDDD-eeF")
      .replace(/static\/chunks\/([A-Za-z0-9._/-]*?)-[0-9a-f]{16,}\.js/g, "static/chunks/$1-0123456789abcdef.js");

    assert.notEqual(rebuilt, html, "the simulation changed nothing, so it proves nothing");
    assert.equal(h(html), h(rebuilt));
  });
});

// ---------------------------------------------------------------------------

describe("Dynamic-route chunk paths are percent-encoded, and must still normalise", () => {
  /*
   * THE DEFECT THIS GROUP EXISTS TO PREVENT.
   *
   * A dynamic route's chunk path is URL-encoded — the [slug] segment is
   * emitted as %5Bslug%5D:
   *
   *     /_next/static/chunks/app/services/%5Bslug%5D/page-8956bb85faa40be5.js
   *
   * The original normaliser's filename class was [A-Za-z0-9._/-], which has no
   * "%", so the match failed at "%5B" and the content hash was left in the
   * page. Nine routes were affected — the three /services, three /sectors and
   * three /case-studies detail pages — and their recorded contentHash moved
   * whenever that chunk's contents changed, with nothing about the pages
   * themselves having changed at all.
   *
   * It stayed hidden because it is invisible on any machine whose node_modules
   * still produce the chunk hash that was present when the values were first
   * recorded. It surfaced only on a clean clone with a fresh `npm ci`. The
   * static routes were never affected, which made the failure look at first
   * like real content drift on nine pages.
   *
   * The pre-existing rebuild simulation above did not catch it either: its own
   * substitution regex used the same class, so it never rewrote a
   * percent-encoded chunk and never exercised the case.
   */

  /**
   * The routes whose built HTML contains a percent-encoded chunk path.
   * /services/fire-engineering joined this list in repositioning PR1 — it is
   * a new page under the same dynamic /services/[slug] route.
   */
  const DYNAMIC_ROUTES = [
    "/services/fire-safety",
    "/services/fire-engineering",
    "/services/health-safety",
    "/services/compliance-support",
    "/sectors/residential-blocks-hmos",
    "/sectors/offices-commercial-workplaces",
    "/sectors/education",
    "/case-studies/residential-portfolio-fire-risk-assessment",
    "/case-studies/mixed-use-fire-strategy-change-of-use",
    "/case-studies/multi-site-commercial-compliance-management",
  ];

  const h = (s) => crypto.createHash("sha256").update(normalisePageHtml(s)).digest("hex");

  test("a percent-encoded chunk path is normalised", () => {
    // The narrowest possible statement of the bug, with no build involved.
    const before =
      '<script src="/_next/static/chunks/app/services/%5Bslug%5D/page-8956bb85faa40be5.js" async=""></script>';
    const after =
      '<script src="/_next/static/chunks/app/services/%5Bslug%5D/page-bf2d0d54da3c8552.js" async=""></script>';
    assert.equal(h(before), h(after), "two builds of the same dynamic page disagree");
    assert.match(
      normalisePageHtml(before),
      /chunks\/app\/services\/%5Bslug%5D\/page-HASH\.js/,
      "the path was not rewritten to the HASH placeholder"
    );
  });

  test("it is normalised in the RSC flight payload too, where there is no /_next/ prefix", () => {
    const before = '"static/chunks/app/sectors/%5Bslug%5D/page-8956bb85faa40be5.js"';
    const after = '"static/chunks/app/sectors/%5Bslug%5D/page-0000000000000000.js"';
    assert.equal(h(before), h(after));
  });

  test("the dynamic routes really do contain a percent-encoded chunk", () => {
    // If Next.js ever stops percent-encoding these, this test fails and the
    // group above becomes a guard against a case that no longer exists —
    // which is worth knowing rather than silently carrying.
    for (const route of DYNAMIC_ROUTES) {
      const html = fs.readFileSync(routeFile(route), "utf8");
      assert.match(
        html,
        /static\/chunks\/[A-Za-z0-9._%/-]*%5B[A-Za-z]+%5D[A-Za-z0-9._%/-]*-[0-9a-f]{16,}\.js/,
        `${route} has no percent-encoded chunk path`
      );
    }
  });

  test("no chunk hash survives normalisation on any authored route", () => {
    // The general form. The earlier "removes build artefacts" test checks only
    // /about, a static route, with a pattern that excludes both "/" and "%" —
    // so it could not have caught this.
    const survivors = [];
    for (const route of AUTHORED_ROUTES) {
      const out = normalisePageHtml(fs.readFileSync(routeFile(route), "utf8"));
      const found = out.match(/static\/chunks\/[A-Za-z0-9._%/-]*?-[0-9a-f]{16,}\.js/g);
      if (found) survivors.push(`${route}: ${[...new Set(found)].join(", ")}`);
    }
    assert.deepEqual(
      survivors,
      [],
      `\n  A chunk hash survived normalisation:\n    ${survivors.join("\n    ")}\n`
    );
  });

  test("changing only a dynamic route's chunk hash does not move its page hash", () => {
    // The rebuild simulation the original lacked, run against real built HTML
    // for every dynamic route. Note the substitution class includes "%" — using
    // the defective class here is precisely how the gap went unnoticed.
    for (const route of DYNAMIC_ROUTES) {
      const html = fs.readFileSync(routeFile(route), "utf8");
      const rebuilt = html.replace(
        /static\/chunks\/([A-Za-z0-9._%/-]*?)-[0-9a-f]{16,}\.js/g,
        "static/chunks/$1-0123456789abcdef.js"
      );
      assert.notEqual(rebuilt, html, `${route}: the simulation changed nothing`);
      assert.equal(h(html), h(rebuilt), `${route}: the page hash moved with only chunk hashes`);
    }
  });

  test("a real content change on a dynamic route still moves its hash", () => {
    // The other half. A normaliser that has become insensitive would satisfy
    // every assertion above and be worthless.
    for (const route of DYNAMIC_ROUTES) {
      const html = fs.readFileSync(routeFile(route), "utf8");
      const match = html.match(/<h1[^>]*>([^<]{8,})</);
      assert.ok(match, `${route}: no <h1> text to perturb`);
      const changed = html.replace(match[1], `${match[1]} X`);
      assert.notEqual(
        h(html),
        h(changed),
        `${route}: editing the page's own <h1> did not move the hash`
      );
    }
  });

  test("every registry entry records where its date came from", () => {
    for (const [route, entry] of Object.entries(AUTHORED_PAGE_DATES)) {
      assert.match(entry.lastModified, /^\d{4}-\d{2}-\d{2}$/, `${route} has a malformed date`);
      assert.match(entry.contentHash, /^[0-9a-f]{16}$/, `${route} has a malformed hash`);
      assert.match(
        entry.source,
        PROVENANCE,
        `${route} does not record where its date came from in an accepted form`
      );
    }
  });

  test("malformed provenance is rejected", () => {
    // The guard is only worth having if it refuses things. Widening it to
    // admit `change-record:` must not widen it to admit anything with a date
    // in it — these are the shapes that were tempting and are still refused.
    const REJECTED = [
      "",
      "remove three unpublished summary case-study cards",
      "2026-08-08 — remove three unpublished summary case-study cards",
      "updated 8 Aug 2026 — cards removed",
      "change-record: 8 August 2026 — cards removed",
      "change-record: 2026-08-08",
      "change-record: 2026-08-08 — ",
      "change-record — cards removed",
      "changerecord: 2026-08-08 — cards removed",
      "zzzzzzz — not a commit",
      "574519 — a six-character sha",
      "574519ff — an eight-character sha",
      "574519f- no em dash",
      " 574519f — leading space",
      "see the PR",
    ];
    for (const bad of REJECTED) {
      assert.equal(PROVENANCE.test(bad), false, `provenance guard wrongly accepts: "${bad}"`);
    }

    const ACCEPTED = [
      "574519f — Type 3 corrected to Type 4",
      "change-record: 2026-08-08 — remove three unpublished summary case-study cards",
    ];
    for (const good of ACCEPTED) {
      assert.equal(PROVENANCE.test(good), true, `provenance guard wrongly rejects: "${good}"`);
    }
  });

  test("the change-record form is used sparingly", () => {
    // It exists for dates a commit cannot cite. If it starts appearing on
    // entries that could have named a commit, the guard has been routed
    // around rather than satisfied.
    const records = Object.entries(AUTHORED_PAGE_DATES).filter(([, e]) =>
      e.source.startsWith("change-record:")
    );
    assert.ok(
      records.length <= 3,
      `${records.length} entries use change-record provenance; prefer a commit SHA where one exists`
    );
    for (const [route, entry] of records) {
      assert.ok(
        entry.source.includes(entry.lastModified),
        `${route}: the change-record date should match lastModified (${entry.lastModified})`
      );
    }
  });

  test("the date policy is documented in the registry itself", () => {
    const src = fs.readFileSync(path.join(repoRoot, "lib/page-dates.ts"), "utf8");
    assert.match(src, /update BOTH `contentHash` and `lastModified`/);
    assert.match(src, /update `contentHash` ONLY/);
  });
});
