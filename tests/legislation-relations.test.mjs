// Legislation relationships, in BOTH directions (Phase 5A, PR 6).
//
// This file follows tests/standards-relations.test.mjs, and exists for the same
// reason. In PR 4 the Guide → Glossary relation was authored on all seven
// guides, correctly inverted on the term pages, and passed every accessor test
// — while the guide pages linked to no terms at all. The forward half had never
// been rendered. It took preview verification against a real deployment to
// catch, because every test in the suite was looking at the accessor rather
// than at the page.
//
// So each of the six relations PR 6 introduces or completes is asserted twice:
// once that the data inverts, and once that the ROUTE renders that direction.
// A relation that is correct in the accessor and invisible on the page is not a
// working relation.
//
// The six:
//   1. Guide          → Legislation      (and the inverse on the instrument)
//   2. Standard       → Legislation      (and the inverse on the instrument)
//   3. Legislation    → Standard         (and the inverse on the standard)
//   4. Legislation    → Glossary term    (and the inverse on the term)
//   5. Legislation    ↔ Legislation      (peer)
//   6. Legislation    → amends           (and `amended by`, derived by inversion)

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

// ---------------------------------------------------------------------------
// 1. Guide → Legislation
// ---------------------------------------------------------------------------

describe("Guide ↔ Legislation", () => {
  test("every guide references at least one instrument", async () => {
    const { publishedGuides } = await import("../lib/guides");
    for (const g of publishedGuides()) {
      assert.ok(
        (g.relatedLegislation ?? []).length > 0,
        `${g.slug} references no legislation`
      );
    }
  });

  test("every reference resolves to a published instrument", async () => {
    const { publishedGuides } = await import("../lib/guides");
    const { getLegislation } = await import("../lib/legislation");
    let total = 0;
    for (const g of publishedGuides()) {
      for (const slug of g.relatedLegislation ?? []) {
        assert.ok(getLegislation(slug), `${g.slug}: "${slug}" does not resolve`);
        total++;
      }
    }
    assert.ok(total >= 12, `expected the relation to be populated, found ${total}`);
  });

  test("the data inverts — guidesReferencing finds every declaring guide", async () => {
    const { publishedGuides } = await import("../lib/guides");
    const { guidesReferencing } = await import("../lib/legislation");
    for (const g of publishedGuides()) {
      for (const slug of g.relatedLegislation ?? []) {
        assert.ok(
          guidesReferencing(slug).some((x) => x.slug === g.slug),
          `${g.slug} declares ${slug} but does not appear on that instrument`
        );
      }
    }
  });

  test("the inverse invents nothing — every result declared the instrument", async () => {
    const { publishedLegislation, guidesReferencing } = await import("../lib/legislation");
    for (const i of publishedLegislation()) {
      for (const g of guidesReferencing(i.slug)) {
        assert.ok(
          (g.relatedLegislation ?? []).includes(i.slug),
          `${g.slug} appears on ${i.slug} without declaring it`
        );
      }
    }
  });

  test("the GUIDE route renders the forward direction", () => {
    const src = source("guides/[slug]/page.tsx");
    assert.match(src, /referencedLegislation/, "the guide route does not derive the relation");
    assert.match(src, /heading: "Legislation referenced"/);
    assert.match(src, /LEGISLATION_PATH/, "the links must resolve to real URLs");
  });

  test("the LEGISLATION route renders the inverse direction", () => {
    const src = source("legislation/[slug]/page.tsx");
    assert.match(src, /guidesReferencing\(item\.slug\)/);
    assert.match(src, /heading: "Guides that discuss this"/);
  });
});

// ---------------------------------------------------------------------------
// 2. Standard → Legislation
// ---------------------------------------------------------------------------

describe("Standard ↔ Legislation", () => {
  test("every standard references at least one instrument, and each resolves", async () => {
    const { publishedStandards } = await import("../lib/standards");
    const { getLegislation } = await import("../lib/legislation");
    let total = 0;
    for (const s of publishedStandards()) {
      assert.ok((s.relatedLegislation ?? []).length > 0, `${s.slug} references no legislation`);
      for (const slug of s.relatedLegislation ?? []) {
        assert.ok(getLegislation(slug), `${s.slug}: "${slug}" does not resolve`);
        total++;
      }
    }
    assert.ok(total >= 8, `expected the relation to be populated, found ${total}`);
  });

  test("the data inverts, in both directions and without invention", async () => {
    const { publishedStandards } = await import("../lib/standards");
    const { publishedLegislation, standardsReferencing } = await import("../lib/legislation");
    for (const s of publishedStandards()) {
      for (const slug of s.relatedLegislation ?? []) {
        assert.ok(
          standardsReferencing(slug).some((x) => x.slug === s.slug),
          `${s.slug} declares ${slug} but does not appear on it`
        );
      }
    }
    for (const i of publishedLegislation()) {
      for (const s of standardsReferencing(i.slug)) {
        assert.ok((s.relatedLegislation ?? []).includes(i.slug), `${s.slug} appears without declaring`);
      }
    }
  });

  test("the STANDARD route renders the forward direction as real links", () => {
    // PR 5 rendered these as unlinked labels because /legislation did not
    // exist. PR 6 must have turned them into links.
    const src = source("standards/[slug]/page.tsx");
    assert.match(src, /heading: "Related legislation"/);
    assert.match(src, /LEGISLATION_PATH/, "the standard route still renders unlinked labels");
    const block = src.slice(src.indexOf("const legislationItems"));
    assert.match(
      block.slice(0, block.indexOf(";\n")),
      /href:/,
      "legislationItems must carry an href"
    );
  });

  test("the LEGISLATION route renders the inverse direction", () => {
    const src = source("legislation/[slug]/page.tsx");
    assert.match(src, /standardsReferencing\(item\.slug\)/);
    assert.match(src, /heading: "Standards that support this"/);
  });
});

// ---------------------------------------------------------------------------
// 3. Legislation → Standard
// ---------------------------------------------------------------------------

describe("Legislation ↔ Standard", () => {
  test("declared standards resolve, and the relation is populated", async () => {
    const { publishedLegislation, standardsUsedBy } = await import("../lib/legislation");
    let total = 0;
    for (const i of publishedLegislation()) {
      const declared = (i.relatedStandards ?? []).length;
      assert.equal(standardsUsedBy(i).length, declared, `${i.slug}: a standard did not resolve`);
      total += declared;
    }
    assert.ok(total >= 8, `expected the relation to be populated, found ${total}`);
  });

  test("the data inverts — legislationUsingStandard finds every declaring instrument", async () => {
    const { publishedLegislation, legislationUsingStandard } = await import("../lib/legislation");
    for (const i of publishedLegislation()) {
      for (const slug of i.relatedStandards ?? []) {
        assert.ok(
          legislationUsingStandard(slug).some((x) => x.slug === i.slug),
          `${i.slug} declares ${slug} but does not appear on it`
        );
      }
    }
  });

  test("the inverse invents nothing", async () => {
    const { publishedStandards } = await import("../lib/standards");
    const { legislationUsingStandard } = await import("../lib/legislation");
    for (const s of publishedStandards()) {
      for (const i of legislationUsingStandard(s.slug)) {
        assert.ok((i.relatedStandards ?? []).includes(s.slug), `${i.slug} appears without declaring`);
      }
    }
  });

  test("the LEGISLATION route renders the forward direction", () => {
    const src = source("legislation/[slug]/page.tsx");
    assert.match(src, /standardsUsedBy\(item\)/);
    assert.match(src, /heading: "Related standards"/);
  });

  test("the STANDARD route renders the inverse direction", () => {
    const src = source("standards/[slug]/page.tsx");
    assert.match(src, /legislationUsingThis/);
    assert.match(src, /heading: "Legislation that references this"/);
  });
});

// ---------------------------------------------------------------------------
// 4. Legislation → Glossary term
// ---------------------------------------------------------------------------

describe("Legislation ↔ Glossary", () => {
  test("declared terms resolve, and the relation is populated", async () => {
    const { publishedLegislation, termsUsedBy } = await import("../lib/legislation");
    let total = 0;
    for (const i of publishedLegislation()) {
      const declared = (i.relatedGlossaryTerms ?? []).length;
      assert.equal(termsUsedBy(i).length, declared, `${i.slug}: a term did not resolve`);
      total += declared;
    }
    assert.ok(total >= 15, `expected the relation to be populated, found ${total}`);
  });

  test("the data inverts, and invents nothing", async () => {
    const { publishedLegislation, legislationUsingTerm } = await import("../lib/legislation");
    const { publishedTerms } = await import("../lib/glossary");
    for (const i of publishedLegislation()) {
      for (const slug of i.relatedGlossaryTerms ?? []) {
        assert.ok(
          legislationUsingTerm(slug).some((x) => x.slug === i.slug),
          `${i.slug} declares ${slug} but does not appear on that term`
        );
      }
    }
    for (const t of publishedTerms()) {
      for (const i of legislationUsingTerm(t.slug)) {
        assert.ok((i.relatedGlossaryTerms ?? []).includes(t.slug), `${i.slug} appears without declaring`);
      }
    }
  });

  test("the LEGISLATION route renders the forward direction", () => {
    const src = source("legislation/[slug]/page.tsx");
    assert.match(src, /termsUsedBy\(item\)/);
    assert.match(src, /heading: "Terms used on this page"/);
  });

  test("the GLOSSARY route renders the inverse direction", () => {
    const src = source("glossary/[slug]/page.tsx");
    assert.match(src, /legislationUsingTerm/);
    assert.match(src, /heading: "Legislation that uses this term"/);
  });
});

// ---------------------------------------------------------------------------
// 5. Legislation ↔ Legislation (peer)
// ---------------------------------------------------------------------------

describe("Legislation ↔ Legislation, as peers", () => {
  test("every peer reference resolves and no instrument references itself", async () => {
    const { publishedLegislation, relatedLegislation, getLegislation } = await import(
      "../lib/legislation"
    );
    let total = 0;
    for (const i of publishedLegislation()) {
      for (const slug of i.relatedLegislation ?? []) {
        assert.notEqual(slug, i.slug, `${i.slug} references itself`);
        assert.ok(getLegislation(slug), `${i.slug}: "${slug}" does not resolve`);
        total++;
      }
      assert.equal(
        relatedLegislation(i).length,
        (i.relatedLegislation ?? []).filter((s) => s !== i.slug).length,
        `${i.slug}: a peer reference was dropped`
      );
    }
    assert.ok(total >= 12, `expected the peer relation to be populated, found ${total}`);
  });

  test("the route renders it", () => {
    const src = source("legislation/[slug]/page.tsx");
    assert.match(src, /relatedLegislation\(item\)/);
    assert.match(src, /heading: "Related legislation"/);
  });
});

// ---------------------------------------------------------------------------
// 6. amends / amended by
// ---------------------------------------------------------------------------

describe("Legislation ↔ Legislation, as amendment", () => {
  test("the relation is authored on one side only and is populated", async () => {
    const { publishedLegislation } = await import("../lib/legislation");
    const total = publishedLegislation().reduce((n, i) => n + (i.amends ?? []).length, 0);
    assert.ok(total > 0, "no instrument amends another — the relation is not exercised");
    for (const i of publishedLegislation()) {
      assert.equal(i.amendedBy, undefined, `${i.slug} authors the derived side`);
    }
  });

  test("amendedBy is the exact inverse of amends", async () => {
    const { publishedLegislation, amendsInstruments, amendedByInstruments } = await import(
      "../lib/legislation"
    );
    const items = publishedLegislation();
    for (const i of items) {
      for (const target of amendsInstruments(i)) {
        assert.ok(
          amendedByInstruments(target).some((x) => x.slug === i.slug),
          `${i.slug} amends ${target.slug} but does not appear on it`
        );
      }
      for (const amender of amendedByInstruments(i)) {
        assert.ok(
          (amender.amends ?? []).includes(i.slug),
          `${amender.slug} appears on ${i.slug} without declaring it`
        );
      }
    }
  });

  test("no instrument amends itself, and there is no amendment cycle", async () => {
    const { publishedLegislation } = await import("../lib/legislation");
    const { hasCycleVia } = await import("../lib/supersession");
    const items = publishedLegislation();
    for (const i of items) {
      assert.ok(!(i.amends ?? []).includes(i.slug), `${i.slug} amends itself`);
      assert.equal(hasCycleVia(i, "amends", items), false, `${i.slug} is in an amends cycle`);
      assert.equal(hasCycleVia(i, "supersededBy", items), false, `${i.slug} is in a supersession cycle`);
    }
  });

  test("the route renders both directions, and labels them differently", () => {
    const src = source("legislation/[slug]/page.tsx");
    assert.match(src, /amendsInstruments\(item\)/);
    assert.match(src, /amendedByInstruments\(item\)/);
    assert.match(src, /heading: "Amends"/);
    assert.match(src, /heading: "Amended by"/);
  });

  test("the generalised relation helpers work over any directed field", async () => {
    const { relatedVia, inverseVia, hasCycleVia } = await import("../lib/supersession");
    const items = [
      { slug: "a", amends: ["b"] },
      { slug: "b", amends: [] },
      { slug: "c", amends: ["b"] },
    ];
    assert.deepEqual(relatedVia(items[0], "amends", items).map((i) => i.slug), ["b"]);
    assert.deepEqual(inverseVia(items[1], "amends", items).map((i) => i.slug), ["a", "c"]);
    assert.equal(hasCycleVia(items[0], "amends", items), false);
    const cyclic = [
      { slug: "x", amends: ["y"] },
      { slug: "y", amends: ["x"] },
    ];
    assert.equal(hasCycleVia(cyclic[0], "amends", cyclic), true);
  });
});

// ---------------------------------------------------------------------------

describe("Reachability — no instrument is an island", () => {
  test("every instrument is reachable from somewhere other than the listing", async () => {
    const { publishedLegislation, guidesReferencing, standardsReferencing } = await import(
      "../lib/legislation"
    );
    for (const i of publishedLegislation()) {
      const inbound =
        guidesReferencing(i.slug).length +
        standardsReferencing(i.slug).length +
        publishedLegislation().filter((x) => (x.relatedLegislation ?? []).includes(i.slug)).length;
      assert.ok(inbound > 0, `${i.slug} has no inbound link from any other page`);
    }
  });

  test("the Knowledge Centre nav lists Legislation alongside the other three sections", () => {
    const src = fs.readFileSync(path.join(repoRoot, "components/KnowledgeCentreNav.tsx"), "utf8");
    for (const href of ["/guides", "/glossary", "/standards", "/legislation"]) {
      assert.ok(src.includes(`href: "${href}"`), `${href} missing from the section nav`);
    }
    assert.match(src, /aria-current/, "the current section must be marked, not merely styled");
  });

  test("the listing renders the shared nav and marks itself current", () => {
    const src = source("legislation/page.tsx");
    assert.match(src, /KnowledgeCentreNav/);
    assert.match(src, /current=\{LEGISLATION_PATH\}/);
  });

  test("the header is unchanged, so the 1280px collapse stays closed", () => {
    const src = fs.readFileSync(path.join(repoRoot, "components/Header.tsx"), "utf8");
    assert.ok(
      !src.includes('"/legislation"'),
      "Legislation belongs in the Knowledge Centre nav, not the site header"
    );
  });

  test("MDXContent exposes LegislationLink so prose can cite an instrument inline", () => {
    const src = fs.readFileSync(path.join(repoRoot, "components/MDXContent.tsx"), "utf8");
    assert.match(src, /LegislationLink/);
  });
});
