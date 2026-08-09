// The branded 404.
//
// WHAT WAS THERE BEFORE. No app/not-found.tsx, so Next.js fell back to its
// built-in default component. Less broken than it sounds — the status was a
// correct 404 and the root layout still supplied the header, navigation,
// footer, skip link and <main> landmark. What it lacked was everything a lost
// reader needs: the heading was the bare numeral "404", the document title was
// "404: This page could not be found." (which also bypasses the site's
// "%s | Lion Risk Management Solutions" template), and there was no
// explanation and no route onward.
//
// Two things this suite pins that are easy to get wrong later. The 404 must
// stay OUT of the sitemap — it is not a destination — and out of the Pagefind
// index, which is built from the same .next/server/app directory the 404 is
// emitted into.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { KNOWLEDGE_PATH, SEARCH_PATH } from "@/lib/knowledge-sections";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join(repoRoot, ".next/server/app");
const pagePath = path.join(repoRoot, "app/not-found.tsx");

/* React splits adjacent text nodes with empty comments. */
const html = () =>
  fs.readFileSync(path.join(outDir, "_not-found.html"), "utf8").replaceAll("<!-- -->", "");

before(() => {
  if (!fs.existsSync(outDir)) {
    throw new Error("run `npm run build` before this suite — it asserts on built HTML");
  }
});

const APPROVED_DESTINATIONS = ["/", "/services", "/sectors", KNOWLEDGE_PATH, SEARCH_PATH];

describe("The 404 exists and is ours", () => {
  test("app/not-found.tsx is present and is built", () => {
    assert.ok(fs.existsSync(pagePath), "app/not-found.tsx is missing");
    assert.ok(fs.existsSync(path.join(outDir, "_not-found.html")), "the 404 was not built");
  });

  test("Next.js's default 404 markup is gone", () => {
    const out = html();
    assert.equal(
      out.includes("This page could not be found."),
      false,
      "the built-in default 404 text is still being rendered"
    );
    assert.equal(out.includes("next-error-h1"), false, "the built-in default 404 markup survives");
  });

  test("the title follows the site template rather than bypassing it", () => {
    const title = html().match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    assert.match(title, /Page not found/);
    assert.match(title, /Lion Risk Management Solutions/);
  });

  test("it is marked noindex, and still followable", () => {
    const src = fs.readFileSync(pagePath, "utf8");
    assert.match(src, /robots:\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/);
    assert.match(html(), /<meta name="robots" content="[^"]*noindex/);
  });
});

describe("One descriptive heading, in words", () => {
  test("exactly one <h1>", () => {
    const count = (html().match(/<h1[\s>]/g) ?? []).length;
    assert.equal(count, 1, `expected one <h1>, found ${count}`);
  });

  test("the heading is a sentence, not a number", () => {
    // "404" is announced as a bare numeral by a screen reader and means
    // nothing to most readers. The numeral is kept as a small decorative
    // eyebrow above it, not as the heading.
    const h1 = html().match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "";
    assert.ok(h1.length > 12, `the <h1> is too terse to be useful: "${h1}"`);
    assert.equal(/^\d+$/.test(h1), false, "the <h1> is a bare number");
    assert.match(h1, /could not find that page/i);
  });

  test("heading order does not skip a level", () => {
    const levels = [...html().matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
    const inMain = levels.filter((n) => n <= 3);
    for (let i = 1; i < inMain.length; i += 1) {
      assert.ok(inMain[i] - inMain[i - 1] <= 1, `heading jumped from h${inMain[i - 1]} to h${inMain[i]}`);
    }
  });
});

describe("All five approved destinations are present and resolve", () => {
  for (const href of APPROVED_DESTINATIONS) {
    test(`links to ${href}`, () => {
      assert.match(
        html(),
        new RegExp(`href="${href.replace(/\//g, "\\/")}"`),
        `the 404 has no link to ${href}`
      );
    });
  }

  test("each destination is a real built route", () => {
    const routeFile = (r) => path.join(outDir, `${r === "/" ? "index" : r.replace(/^\//, "")}.html`);
    for (const href of APPROVED_DESTINATIONS) {
      assert.ok(fs.existsSync(routeFile(href)), `${href} is not a built page`);
    }
  });

  test("the search component itself is not embedded", () => {
    // Deliberate: rendering the search client here would download a search
    // engine and its index for someone who mistyped a URL. A link costs one
    // click.
    //
    // Comments are stripped first. The page's own comment explains why the
    // component is absent, and would otherwise satisfy a test for its absence
    // — a description of the decision passing as evidence of it.
    const src = fs
      .readFileSync(pagePath, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    assert.equal(/SiteSearch/.test(src), false, "the 404 embeds the search component");
    assert.equal(/pagefind/i.test(src), false, "the 404 pulls in Pagefind");
  });
});

describe("The 404 stays out of the sitemap and out of search", () => {
  test("no sitemap entry points at a 404 route", async () => {
    const mod = await import("../app/sitemap.ts");
    const fn = typeof mod.default === "function" ? mod.default : mod.default.default;
    const entries = await fn();
    assert.equal(entries.length, 79, `the sitemap should still list 79 URLs, found ${entries.length}`);
    const offenders = entries
      .map((e) => new URL(e.url).pathname)
      .filter((p) => /not-found|404/.test(p));
    assert.deepEqual(offenders, []);
  });

  test("_not-found is not registered as an authored route", async () => {
    const { AUTHORED_ROUTES } = await import("../lib/page-dates");
    assert.equal(AUTHORED_ROUTES.length, 18);
    assert.equal(
      AUTHORED_ROUTES.some((r) => /not-found|404/.test(r)),
      false
    );
  });

  test("_not-found is excluded from the Pagefind index", () => {
    const fragmentDir = path.join(repoRoot, "public/pagefind/fragment");
    assert.ok(fs.existsSync(fragmentDir), "run `npm run build` — the Pagefind index is missing");
    const leaked = fs
      .readdirSync(fragmentDir)
      .filter((f) => /not-found/i.test(fs.readFileSync(path.join(fragmentDir, f)).toString("latin1")));
    assert.deepEqual(leaked, [], "the 404 reached the search index");
  });

  test("the 404 moved every authored hash and not one date", async () => {
    /*
     * Adding a custom 404 changes the rendered bytes of EVERY page: the root
     * layout's `notFound` slot is serialised into each page's RSC flight
     * payload, and the React reference numbering shifts with it. So all
     * seventeen hashes moved at the time — and no `lastModified` did, because
     * nothing a reader sees on those seventeen pages changed. The 404 is a
     * new page.
     *
     * Repositioning PR1 (2026-08-09) moved every hash again, for a different
     * reason: the footer gained a Services column, and the root layout
     * renders the footer on every page. It also added an eighteenth authored
     * route, /services/fire-engineering. See the change-record comments in
     * lib/page-dates.ts.
     *
     * Repositioning PR2 (2026-08-09) moved two more, on its own: `/` was
     * rewritten to present both disciplines as co-equal (date moved too),
     * and `/services/health-safety` gained a stable anchor id on one item
     * so the homepage's new Construction Health & Safety card could
     * deep-link to it (date did not move — nothing a reader sees changed).
     * See the "WHY TWO HASHES MOVED FOR REPOSITIONING PR2" comment in
     * lib/page-dates.ts.
     *
     * The table is written out in full so that a future change which moves
     * one of these has to say which, rather than re-recording the lot.
     */
    const { AUTHORED_PAGE_DATES, AUTHORED_ROUTES } = await import("../lib/page-dates");
    const EXPECTED = {
      "/": ["2026-08-09", "a4a37f76909319a3"],
      "/about": ["2026-08-01", "2f84329cc3f1c7c4"],
      "/services": ["2026-08-09", "898dc6eaad92c78c"],
      "/services/fire-safety": ["2026-08-09", "ea93070bf29da32f"],
      "/services/fire-engineering": ["2026-08-09", "7a6b1a8db081d303"],
      "/services/health-safety": ["2026-07-29", "26ac271507408cef"],
      "/services/compliance-support": ["2026-07-29", "2fde28de9bcf493e"],
      "/sectors": ["2026-07-26", "cce0c3648c7eecd7"],
      "/sectors/residential-blocks-hmos": ["2026-07-29", "00b99fafd9f83bd5"],
      "/sectors/offices-commercial-workplaces": ["2026-07-29", "7059ab794e295340"],
      "/sectors/education": ["2026-07-29", "21fb2808b98ff9eb"],
      // 2026-08-08 arrived with the card removal, not with this change.
      "/case-studies": ["2026-08-08", "e2af93cff03c5603"],
      "/case-studies/residential-portfolio-fire-risk-assessment": ["2026-08-01", "209d6c60e284006b"],
      "/case-studies/mixed-use-fire-strategy-change-of-use": ["2026-08-01", "c67ecad0553b7f12"],
      "/case-studies/multi-site-commercial-compliance-management": ["2026-08-01", "2d2114a8255d8d5e"],
      "/faq": ["2026-08-01", "4857d13ee7dc83c0"],
      "/check": ["2026-08-01", "0be1d5880c15ee63"],
      "/contact": ["2026-08-01", "583cbdf107740266"],
    };
    assert.equal(Object.keys(EXPECTED).length, 18);
    assert.equal(AUTHORED_ROUTES.length, 18);

    const wrong = [];
    for (const [route, [date, hash]] of Object.entries(EXPECTED)) {
      const e = AUTHORED_PAGE_DATES[route];
      if (e.lastModified !== date) wrong.push(`${route}: date ${e.lastModified} != ${date}`);
      if (e.contentHash !== hash) wrong.push(`${route}: hash ${e.contentHash} != ${hash}`);
    }
    assert.deepEqual(wrong, []);
  });

  test("no date in the registry is today's build date by accident", async () => {
    // The failure mode PR 10 exists to prevent, re-asserted at the point a
    // bulk hash update makes it tempting to "just set them all to today".
    const { AUTHORED_PAGE_DATES } = await import("../lib/page-dates");
    const dates = new Set(Object.values(AUTHORED_PAGE_DATES).map((e) => e.lastModified));
    assert.ok(dates.size >= 4, "the registry has collapsed to too few distinct dates");
  });

  test("the index still holds exactly 52 pages", () => {
    // The 404 is emitted into the same directory the index is built from, so
    // this is the number that would move if the allow-list ever stopped
    // filtering it.
    const fragments = fs.readdirSync(path.join(repoRoot, "public/pagefind/fragment"));
    assert.equal(fragments.length, 52, `expected 52 indexed pages, found ${fragments.length}`);
  });
});
