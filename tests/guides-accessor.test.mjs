// Accessor-layer tests for the Guides vertical (Phase 5A, PR 3).
//
// lib/guides.ts is the single place that decides what "publicly visible"
// means. These tests exercise that decision directly, plus the service and
// sector derivations that service/sector detail pages depend on, and the
// breadcrumb construction shared by the visible trail and the JSON-LD.
//
// The suite reads the real generated collection, so it also acts as a smoke
// test that `velite build` produced what the migration intended.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

// The generated collection is gitignored, so a clean checkout has to build it
// before these tests can import it. Cheap, and it keeps the suite runnable
// with a bare `npm test`.
before(() => {
  execFileSync("npx", ["velite", "build", "--strict", "--clean", "--silent"], {
    cwd: repoRoot,
    stdio: "pipe",
  });
});

const EXPECTED_SLUGS = [
  "fire-risk-assessments-explained",
  "pas-79-methodology-explained",
  "fire-door-inspections-explained",
  "fire-safety-responsibilities-responsible-person",
  "commercial-fire-safety-compliance",
  "block-management-fire-safety-guidance",
  "pas-9970-bsi-consultation-fire-safety-construction",
  // PR 6: fire-compartmentation-survey-explained, a new Knowledge Centre
  // article rather than a migrated one — the seven above are all migration
  // survivors, this one is genuinely new content.
  "fire-compartmentation-survey-explained",
  // PR 7: health-and-safety-risk-assessment-explained, the Health & Safety
  // counterpart to PR6's fire guide — the first guide in the health-safety
  // category.
  "health-and-safety-risk-assessment-explained",
];

describe("Guides accessor layer", () => {
  test("exposes exactly the nine published guides", async () => {
    const { publishedGuides } = await import("../lib/guides");
    const guides = publishedGuides();
    assert.equal(guides.length, EXPECTED_SLUGS.length);
    assert.deepEqual([...guides.map((g) => g.slug)].sort(), [...EXPECTED_SLUGS].sort());
    for (const g of guides) assert.equal(g.status, "published");
  });

  test("excludes anything not published", async () => {
    const { guides: raw } = await import("../.velite");
    const { publishedGuides } = await import("../lib/guides");
    const visible = new Set(publishedGuides().map((g) => g.slug));
    for (const item of raw) {
      if (item.status !== "published") {
        assert.equal(visible.has(item.slug), false, `${item.slug} leaked into the public list`);
      }
    }
  });

  test("orders guides most recent first", async () => {
    const { publishedGuides } = await import("../lib/guides");
    const dates = publishedGuides().map((g) => g.publishedDate);
    const sorted = [...dates].sort((a, b) => b.localeCompare(a));
    assert.deepEqual(dates, sorted);
  });

  test("getGuide resolves a known slug and rejects an unknown one", async () => {
    const { getGuide } = await import("../lib/guides");
    assert.ok(getGuide("fire-door-inspections-explained"));
    assert.equal(getGuide("not-a-real-guide"), undefined);
  });

  test("category counts cover every published guide and omit unused categories", async () => {
    const { usedCategories, publishedGuides } = await import("../lib/guides");
    const cats = usedCategories();
    const total = cats.reduce((n, c) => n + c.count, 0);
    assert.equal(total, publishedGuides().length);
    for (const c of cats) assert.ok(c.count > 0, `${c.slug} has a zero count`);
    // business-duty-holder-guidance still carries no guide. health-safety did
    // not either until PR 7 added the first one.
    assert.equal(cats.some((c) => c.slug === "health-safety"), true);
  });

  test("service derivation returns the guides that declare that service", async () => {
    const { getGuidesForService, publishedGuides } = await import("../lib/guides");
    // Repositioning PR3: fire-door-inspections-explained moved from
    // fire-safety to fire-safety-consultancy — it's about fire door
    // inspections, which is Fire Safety Consultancy content, not Fire Risk
    // Assessment content, and fire-safety no longer covers it. Count drops
    // from 6 to 5; the guide reappears below under its new service.
    const fireSafety = getGuidesForService("fire-safety");
    assert.equal(fireSafety.length, 5);
    for (const g of fireSafety) assert.ok(g.relatedServices.includes("fire-safety"));

    // PR 6 adds fire-compartmentation-survey-explained under the same
    // service. publishedGuides() orders most-recent-first, so the new guide
    // (published 2026-08-12) sorts ahead of fire-door-inspections-explained
    // (published 2026-07-13).
    const fireSafetyConsultancy = getGuidesForService("fire-safety-consultancy");
    assert.deepEqual(
      fireSafetyConsultancy.map((g) => g.slug),
      ["fire-compartmentation-survey-explained", "fire-door-inspections-explained"]
    );

    const compliance = getGuidesForService("compliance-support");
    assert.deepEqual(
      compliance.map((g) => g.slug),
      ["block-management-fire-safety-guidance"]
    );

    assert.deepEqual(getGuidesForService("no-such-service"), []);
    assert.ok(fireSafety.length < publishedGuides().length);
  });

  test("sector derivation goes through the sector-to-service mapping", async () => {
    const { getGuidesForSector } = await import("../lib/guides");
    const { getSector } = await import("../lib/site");

    // Reproduces the retired getPostsForSector behaviour: a sector shows every
    // guide whose service appears in that sector's own relatedServices list.
    const sectorSlug = "residential-blocks-hmos";
    const services = getSector(sectorSlug)?.relatedServices ?? [];
    assert.ok(services.length > 0, "fixture assumption: sector declares services");

    const guides = getGuidesForSector(sectorSlug);
    assert.ok(guides.length > 0);
    for (const g of guides) {
      assert.ok(
        g.relatedServices.some((s) => services.includes(s)),
        `${g.slug} does not share a service with ${sectorSlug}`
      );
    }

    assert.deepEqual(getGuidesForSector("no-such-sector"), []);
  });

  test("breadcrumbs are Home / Knowledge Centre / Guides / title, terminal crumb unlinked", async () => {
    // Three crumbs until PR 9, when "Knowledge Centre" moved from /guides to
    // the /knowledge hub. A Guides crumb had been redundant while the label
    // and the section were the same URL; once they diverged, omitting it would
    // have left a guide page with no way back to its own section and made
    // Guides the only section whose trail skips itself.
    const { getGuide, buildGuideBreadcrumbs } = await import("../lib/guides");
    const guide = getGuide("pas-79-methodology-explained");
    const crumbs = buildGuideBreadcrumbs(guide);
    assert.equal(crumbs.length, 4);
    assert.deepEqual(crumbs[0], { name: "Home", path: "/" });
    assert.deepEqual(crumbs[1], { name: "Knowledge Centre", path: "/knowledge" });
    assert.deepEqual(crumbs[2], { name: "Guides", path: "/guides" });
    assert.equal(crumbs[3].name, guide.title);
    assert.equal(crumbs[3].path, undefined);
  });

  test("dates format as British-English long dates", async () => {
    const { formatDate } = await import("../lib/guides");
    assert.equal(formatDate("2026-07-06"), "6 July 2026");
    assert.equal(formatDate(undefined), undefined);
    assert.equal(formatDate("not-a-date"), undefined);
  });

  test("lastModified prefers updatedDate and falls back to publishedDate", async () => {
    const { lastModified } = await import("../lib/guides");
    assert.equal(lastModified({ publishedDate: "2026-01-01" }), "2026-01-01");
    assert.equal(
      lastModified({ publishedDate: "2026-01-01", updatedDate: "2026-05-05" }),
      "2026-05-05"
    );
  });
});
