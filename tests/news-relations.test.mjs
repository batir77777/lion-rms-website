// News relationships, in BOTH directions (Phase 5A, PR 7).
//
// Same discipline as the Standards and Legislation relation suites, and for
// the same reason: in PR 4 a relation was authored, correctly inverted in the
// accessor, and rendered nowhere — caught only by preview verification. So
// every direction is asserted twice, once in the data and once at the route.
//
// Six relations: News to Guides, Standards, Legislation and Glossary, News to
// News, and the derived inverse of each. The News-to-News edge is the one that
// did not exist before this PR — `relatedArticles` targets guides, so a
// follow-up item had no way to reference the item it followed up.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const appDir = path.join(repoRoot, "app");

before(() => {
  execFileSync("npx", ["velite", "build", "--strict", "--clean", "--silent"], {
    cwd: repoRoot,
    stdio: "pipe",
  });
});

const source = (p) => fs.readFileSync(path.join(appDir, p), "utf8");

describe("relatedNews is registered in the validation layer", () => {
  test("a dangling relatedNews reference is caught", async () => {
    const { checkRelations } = await import("../lib/content-validation");
    const issues = checkRelations({ news: [{ id: "a", slug: "a", relatedNews: ["ghost"] }] });
    assert.equal(issues.length, 1);
    assert.match(issues[0].message, /does not exist in the "news" collection/);
  });

  test("an item listing itself is caught", async () => {
    const { checkRelations } = await import("../lib/content-validation");
    const issues = checkRelations({ news: [{ id: "a", slug: "a", relatedNews: ["a"] }] });
    assert.equal(issues.length, 1);
    assert.match(issues[0].message, /lists itself in relatedNews/);
  });

  test("the guard reaches other collections too", async () => {
    const { checkRelations } = await import("../lib/content-validation");
    const issues = checkRelations({
      guides: [{ id: "g", slug: "g", relatedNews: ["ghost"] }],
      news: [{ id: "a", slug: "a" }],
    });
    assert.equal(issues.length, 1);
  });

  test("a valid cross-reference passes", async () => {
    const { checkRelations } = await import("../lib/content-validation");
    assert.deepEqual(
      checkRelations({ news: [{ id: "a", slug: "a", relatedNews: ["b"] }, { id: "b", slug: "b" }] }),
      []
    );
  });
});

describe("News ↔ Guide", () => {
  test("every declared guide resolves, and the relation is populated", async () => {
    const { publishedNews, guidesReferencedBy } = await import("../lib/news");
    let total = 0;
    for (const i of publishedNews()) {
      const declared = (i.relatedArticles ?? []).length;
      assert.equal(guidesReferencedBy(i).length, declared, `${i.slug}: a guide did not resolve`);
      total += declared;
    }
    assert.ok(total >= 5, `expected the relation to be populated, found ${total}`);
  });

  test("the data inverts, and invents nothing", async () => {
    const { publishedNews, newsMentioningGuide } = await import("../lib/news");
    const { publishedGuides } = await import("../lib/guides");
    for (const i of publishedNews()) {
      for (const slug of i.relatedArticles ?? []) {
        assert.ok(
          newsMentioningGuide(slug).some((x) => x.slug === i.slug),
          `${i.slug} declares ${slug} but does not appear on it`
        );
      }
    }
    for (const g of publishedGuides()) {
      for (const n of newsMentioningGuide(g.slug)) {
        assert.ok((n.relatedArticles ?? []).includes(g.slug), `${n.slug} appears without declaring`);
      }
    }
  });

  test("the NEWS route renders the forward direction", () => {
    const src = source("news/[slug]/page.tsx");
    assert.match(src, /guidesReferencedBy\(item\)/);
    assert.match(src, /heading: "Guides this affects"/);
  });

  test("the GUIDE route renders the inverse direction", () => {
    const src = source("guides/[slug]/page.tsx");
    assert.match(src, /newsMentioningGuide/);
    assert.match(src, /heading: "News about this subject"/);
  });
});

describe("News ↔ Standard", () => {
  test("declared standards resolve and the relation is populated", async () => {
    const { publishedNews, standardsReferencedBy } = await import("../lib/news");
    let total = 0;
    for (const i of publishedNews()) {
      const declared = (i.relatedStandards ?? []).length;
      assert.equal(standardsReferencedBy(i).length, declared, i.slug);
      total += declared;
    }
    assert.ok(total >= 5, `found ${total}`);
  });

  test("the data inverts, and invents nothing", async () => {
    const { publishedNews, newsMentioningStandard } = await import("../lib/news");
    const { publishedStandards } = await import("../lib/standards");
    for (const i of publishedNews()) {
      for (const slug of i.relatedStandards ?? []) {
        assert.ok(newsMentioningStandard(slug).some((x) => x.slug === i.slug), `${i.slug} → ${slug}`);
      }
    }
    for (const s of publishedStandards()) {
      for (const n of newsMentioningStandard(s.slug)) {
        assert.ok((n.relatedStandards ?? []).includes(s.slug));
      }
    }
  });

  test("both routes render their direction", () => {
    assert.match(source("news/[slug]/page.tsx"), /heading: "Standards mentioned"/);
    const std = source("standards/[slug]/page.tsx");
    assert.match(std, /newsMentioningStandard/);
    assert.match(std, /heading: "News mentioning this document"/);
  });
});

describe("News ↔ Legislation", () => {
  test("declared instruments resolve and the relation is populated", async () => {
    const { publishedNews, legislationReferencedBy } = await import("../lib/news");
    let total = 0;
    for (const i of publishedNews()) {
      const declared = (i.relatedLegislation ?? []).length;
      assert.equal(legislationReferencedBy(i).length, declared, i.slug);
      total += declared;
    }
    assert.ok(total >= 8, `found ${total}`);
  });

  test("the data inverts, and invents nothing", async () => {
    const { publishedNews, newsMentioningLegislation } = await import("../lib/news");
    const { publishedLegislation } = await import("../lib/legislation");
    for (const i of publishedNews()) {
      for (const slug of i.relatedLegislation ?? []) {
        assert.ok(newsMentioningLegislation(slug).some((x) => x.slug === i.slug), `${i.slug} → ${slug}`);
      }
    }
    for (const l of publishedLegislation()) {
      for (const n of newsMentioningLegislation(l.slug)) {
        assert.ok((n.relatedLegislation ?? []).includes(l.slug));
      }
    }
  });

  test("both routes render their direction", () => {
    assert.match(source("news/[slug]/page.tsx"), /heading: "Legislation mentioned"/);
    const leg = source("legislation/[slug]/page.tsx");
    assert.match(leg, /newsMentioningLegislation/);
    assert.match(leg, /heading: "News about this instrument"/);
  });
});

describe("News ↔ Glossary", () => {
  test("declared terms resolve and the relation is populated", async () => {
    const { publishedNews, termsReferencedBy } = await import("../lib/news");
    let total = 0;
    for (const i of publishedNews()) {
      const declared = (i.relatedGlossaryTerms ?? []).length;
      assert.equal(termsReferencedBy(i).length, declared, i.slug);
      total += declared;
    }
    assert.ok(total >= 12, `found ${total}`);
  });

  test("the data inverts, and invents nothing", async () => {
    const { publishedNews, newsUsingTerm } = await import("../lib/news");
    const { publishedTerms } = await import("../lib/glossary");
    for (const i of publishedNews()) {
      for (const slug of i.relatedGlossaryTerms ?? []) {
        assert.ok(newsUsingTerm(slug).some((x) => x.slug === i.slug), `${i.slug} → ${slug}`);
      }
    }
    for (const t of publishedTerms()) {
      for (const n of newsUsingTerm(t.slug)) {
        assert.ok((n.relatedGlossaryTerms ?? []).includes(t.slug));
      }
    }
  });

  test("both routes render their direction", () => {
    assert.match(source("news/[slug]/page.tsx"), /heading: "Terms used on this page"/);
    const glo = source("glossary/[slug]/page.tsx");
    assert.match(glo, /newsUsingTerm/);
    assert.match(glo, /heading: "News that uses this term"/);
  });
});

describe("News ↔ News — the edge that did not exist before PR 7", () => {
  test("the relation is populated and no item references itself", async () => {
    const { publishedNews, relatedNewsItems } = await import("../lib/news");
    let total = 0;
    for (const i of publishedNews()) {
      for (const slug of i.relatedNews ?? []) {
        assert.notEqual(slug, i.slug, `${i.slug} references itself`);
        total++;
      }
      assert.equal(
        relatedNewsItems(i).length,
        (i.relatedNews ?? []).filter((s) => s !== i.slug).length,
        `${i.slug}: a reference was dropped`
      );
    }
    assert.ok(total >= 4, `expected the relation to be exercised, found ${total}`);
  });

  test("newsReferencing is the exact inverse", async () => {
    const { publishedNews, relatedNewsItems, newsReferencing } = await import("../lib/news");
    for (const i of publishedNews()) {
      for (const target of relatedNewsItems(i)) {
        assert.ok(
          newsReferencing(target.slug).some((x) => x.slug === i.slug),
          `${i.slug} references ${target.slug} but does not appear on it`
        );
      }
      for (const referrer of newsReferencing(i.slug)) {
        assert.ok((referrer.relatedNews ?? []).includes(i.slug), `${referrer.slug} appears without declaring`);
      }
    }
  });

  test("the inverse surfaces later items on an earlier one", async () => {
    // The July 2025 Regulations item does not know about the April 2026
    // guidance item or the July 2025 round-up. Both must still appear on it.
    const { newsReferencing } = await import("../lib/news");
    const referrers = newsReferencing("residential-evacuation-plans-regulations-made-2025").map(
      (n) => n.slug
    );
    assert.ok(referrers.includes("residential-peeps-guidance-updated-2026"));
    assert.ok(referrers.includes("round-up-july-2025"));
  });

  test("the route renders both directions with different headings", () => {
    const src = source("news/[slug]/page.tsx");
    assert.match(src, /relatedNewsItems\(item\)/);
    assert.match(src, /newsReferencing\(item\.slug\)/);
    assert.match(src, /heading: "Related news"/);
    assert.match(src, /heading: "Later items referring to this"/);
  });

  test("a round-up links every item it covers", async () => {
    const { getNewsItem, relatedNewsItems } = await import("../lib/news");
    const march = getNewsItem("round-up-march-2026");
    assert.ok(relatedNewsItems(march).length >= 3, "a round-up should link the items it summarises");
  });
});

describe("Reachability and navigation", () => {
  test("every news item is reachable from somewhere other than the listing", async () => {
    const { publishedNews, newsReferencing, archiveYears, yearOf } = await import("../lib/news");
    const years = new Set(archiveYears().map((y) => y.year));
    for (const i of publishedNews()) {
      const inbound = newsReferencing(i.slug).length;
      // A year archive is a real inbound route even where nothing links the item.
      assert.ok(inbound > 0 || years.has(yearOf(i)), `${i.slug} has no inbound route`);
    }
  });

  test("the Knowledge Centre nav lists News alongside the other four", () => {
    const src = fs.readFileSync(path.join(repoRoot, "components/KnowledgeCentreNav.tsx"), "utf8");
    for (const href of ["/guides", "/glossary", "/standards", "/legislation", "/news"]) {
      assert.ok(src.includes(`href: "${href}"`), `${href} missing`);
    }
    assert.match(src, /aria-current/);
  });

  test("the listing renders the shared nav and marks itself current", () => {
    const src = source("news/page.tsx");
    assert.match(src, /KnowledgeCentreNav/);
    assert.match(src, /current=\{NEWS_PATH\}/);
  });

  test("the site header is unchanged, so the 1280px collapse stays closed", () => {
    const src = fs.readFileSync(path.join(repoRoot, "components/Header.tsx"), "utf8");
    assert.ok(!src.includes('"/news"'), "News belongs in the Knowledge Centre nav, not the header");
  });

  test("MDXContent exposes NewsLink so prose can cite an item inline", () => {
    const src = fs.readFileSync(path.join(repoRoot, "components/MDXContent.tsx"), "utf8");
    assert.match(src, /NewsLink/);
  });
});
