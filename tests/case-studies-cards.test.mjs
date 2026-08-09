// Every case-study card must go somewhere.
//
// THE DEFECT. /case-studies rendered six cards. Three came from CASE_STUDIES
// and linked to a detail page. Three came from OTHER_CASES — RAMS &
// construction phase plans, a property management company, a consultancy firm
// — and were passed to the same CaseStudyCard with no `href`. They rendered as
// <article> rather than <a>, but kept the identical card styling INCLUDING
// `hover:-translate-y-1 hover:shadow-xl`. So they lifted under the cursor,
// could not be focused by keyboard, and led nowhere.
//
// A card that behaves like a link and is not one is worse than an absent card:
// a sighted mouse user is invited to click, and a keyboard user cannot reach
// it at all to discover that there was nothing there.
//
// The three entries stay in lib/case-studies.ts. Restoring one means writing
// its detail page and moving it into CASE_STUDIES — not rendering a
// destination-less card again, which is what these tests prevent.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CASE_STUDIES, OTHER_CASES } from "@/lib/case-studies";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join(repoRoot, ".next/server/app");
const indexHtml = () => fs.readFileSync(path.join(outDir, "case-studies.html"), "utf8");

before(() => {
  if (!fs.existsSync(outDir)) {
    throw new Error("run `npm run build` before this suite — it asserts on built HTML");
  }
});

/* The card root, whether <a> or <article>, carries this class string.
 *
 * Matched only inside a real class="…" attribute. The same markup appears a
 * second time inside the RSC flight payload as \"className\":\"…\", so a naive
 * substring count returns exactly double and every card looks unlinked — which
 * is how the first version of this file failed. */
const CARD_MARKER = "rounded-2xl border border-slate-100 bg-white p-8";
const CARD_TAG = new RegExp(`<(\\w+)\\b([^>]*\\sclass="[^"]*${CARD_MARKER}[^"]*"[^>]*)>`, "g");
const cardTags = (html) =>
  [...html.matchAll(CARD_TAG)].map((m) => ({ tag: m[1], attrs: m[2] }));

describe("Every rendered card has a destination", () => {
  test("the index renders exactly the three detailed case studies", () => {
    const html = indexHtml();
    for (const c of CASE_STUDIES) {
      assert.ok(
        html.includes(`/case-studies/${c.slug}`),
        `${c.slug} is missing from the index`
      );
    }
    const cards = cardTags(html);
    assert.equal(
      cards.length,
      CASE_STUDIES.length,
      `expected ${CASE_STUDIES.length} cards, found ${cards.length}`
    );
  });

  test("no summary-only entry is rendered", () => {
    // Matching on each entry's own title, so re-adding any one of the three is
    // caught individually rather than only as a count.
    const html = indexHtml();
    const offenders = OTHER_CASES.filter((c) => html.includes(c.title)).map((c) => c.title);
    assert.deepEqual(
      offenders,
      [],
      `\n  These have no detail page and must not be rendered as cards:\n    ${offenders.join("\n    ")}\n`
    );
  });

  test("the page component does not reference OTHER_CASES in its render", () => {
    const src = fs.readFileSync(path.join(repoRoot, "app/case-studies/page.tsx"), "utf8");
    const withoutComments = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    assert.equal(
      /OTHER_CASES/.test(withoutComments),
      false,
      "OTHER_CASES is referenced in code again"
    );
  });

  test("the data itself is retained, not deleted", () => {
    // Hiding the cards must not lose the copy — restoring one should be a
    // matter of writing its detail page, not rewriting its summary.
    assert.equal(OTHER_CASES.length, 3);
    for (const c of OTHER_CASES) {
      assert.ok(c.title && c.body && c.sector, `${c.title}: incomplete summary`);
    }
  });
});

describe("No card offers an interactive affordance it cannot honour", () => {
  test("every card root on the built page is an anchor with an href", () => {
    const cards = cardTags(indexHtml());
    assert.ok(cards.length > 0, "no cards found on the page");
    const unlinked = cards.filter(
      (c) => c.tag !== "a" || !/href="\/case-studies\/[a-z0-9-]+"/.test(c.attrs)
    );
    assert.deepEqual(
      unlinked.map((c) => c.tag),
      [],
      `${unlinked.length} card(s) are not links to a case study`
    );
  });

  test("no hover-lift appears on a non-anchor element", () => {
    // The specific mismatch: a lift-and-shadow that says "click me" on
    // something a keyboard cannot even focus.
    const html = indexHtml();
    const lifts = [...html.matchAll(/<(\w+)[^>]*hover:-translate-y-1[^>]*>/g)].map((m) => m[1]);
    const nonAnchor = lifts.filter((tag) => tag !== "a");
    assert.deepEqual(
      nonAnchor,
      [],
      `hover-lift found on non-interactive element(s): ${nonAnchor.join(", ")}`
    );
  });

  test("CaseStudyCard still supports an href-less card, but nothing uses one", () => {
    // The component keeps the optional prop — removing it would be a wider
    // refactor than this fix — so the guard lives at the call site above.
    const src = fs.readFileSync(path.join(repoRoot, "components/CaseStudyCard.tsx"), "utf8");
    assert.match(src, /href\?: string/);
  });
});

describe("Structured data and dates", () => {
  test("the ItemList still lists exactly the three detailed case studies", () => {
    const html = indexHtml();
    const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
      .map((m) => JSON.parse(m[1].replace(/\\u003c/g, "<").replace(/\\u003e/g, ">").replace(/\\u0026/g, "&")));
    const list = blocks.find((o) => o["@type"] === "ItemList");
    assert.ok(list, "no ItemList on the case-studies index");
    assert.equal(list.itemListElement.length, CASE_STUDIES.length);
  });

  test("/case-studies records the card removal as a reader-visible change", async () => {
    // Removing three visible cards is the policy's FIRST case: both the hash
    // and the date move. It is also the only authored-page entry this change
    // touches — asserted below, so the registry footprint cannot widen
    // unnoticed.
    const { AUTHORED_PAGE_DATES } = await import("../lib/page-dates");
    const entry = AUTHORED_PAGE_DATES["/case-studies"];
    assert.equal(entry.lastModified, "2026-08-08");
    // The hash is pinned in tests/not-found.test.mjs, which is where it last moved.
    assert.match(entry.source, /^change-record: 2026-08-08 — remove three unpublished summary case-study cards$/);
  });

  test("no other authored-page DATE is touched", async () => {
    // This pinned the other sixteen hashes as well when the card removal
    // stood alone. The branded 404 legitimately moves all seventeen — its
    // markup lives in every page's RSC payload — so the hashes are now pinned
    // in tests/not-found.test.mjs, at the values that change produced.
    //
    // What stays here is the part the 404 must NOT disturb: the dates. Only
    // /case-studies moved, and only because three visible cards went away.
    const { AUTHORED_PAGE_DATES } = await import("../lib/page-dates");
    const DATES = {
      "/": "2026-08-01",
      "/about": "2026-08-01",
      "/services": "2026-07-28",
      "/services/fire-safety": "2026-07-29",
      "/services/health-safety": "2026-07-29",
      "/services/compliance-support": "2026-07-29",
      "/sectors": "2026-07-26",
      "/sectors/residential-blocks-hmos": "2026-07-29",
      "/sectors/offices-commercial-workplaces": "2026-07-29",
      "/sectors/education": "2026-07-29",
      "/case-studies/residential-portfolio-fire-risk-assessment": "2026-08-01",
      "/case-studies/mixed-use-fire-strategy-change-of-use": "2026-08-01",
      "/case-studies/multi-site-commercial-compliance-management": "2026-08-01",
      "/faq": "2026-08-01",
      "/check": "2026-08-01",
      "/contact": "2026-08-01",
    };
    const drifted = Object.entries(DATES)
      .filter(([route, date]) => AUTHORED_PAGE_DATES[route].lastModified !== date)
      .map(([route]) => route);
    assert.deepEqual(drifted, []);
    assert.equal(Object.keys(DATES).length, 16);
  });

  test("the three detail pages keep their own dates", async () => {
    const { AUTHORED_PAGE_DATES } = await import("../lib/page-dates");
    for (const c of CASE_STUDIES) {
      assert.equal(
        AUTHORED_PAGE_DATES[`/case-studies/${c.slug}`].lastModified,
        "2026-08-01",
        `${c.slug}: a detail page date moved, which this change must not do`
      );
    }
  });
});
