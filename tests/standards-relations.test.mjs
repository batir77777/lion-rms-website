// Standards relationships, in BOTH directions (Phase 5A, PR 5).
//
// This file exists because of a specific failure in PR 4.
//
// The Guide → Glossary relation there was authored on all seven guides and
// correctly inverted on the term pages, and the accessor tests passed. The
// forward half was never RENDERED: guide pages linked to no terms at all. It
// took preview verification against a real deployment to catch, because every
// test in the suite was looking at the accessor rather than at the page.
//
// So every relation added in PR 5 is asserted twice — once that the data
// inverts, and once that the ROUTE actually renders each direction. A relation
// that is correct in the accessor and invisible on the page is not a working
// relation.

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

describe("Guide ↔ Standard — data", () => {
  test("every guide references at least one standard", async () => {
    const { publishedGuides } = await import("../lib/guides");
    for (const g of publishedGuides()) {
      assert.ok(
        (g.relatedStandards ?? []).length > 0,
        `${g.slug} references no standards`
      );
    }
  });

  test("every standard is reachable from somewhere else on the site", async () => {
    // The property that actually matters is inbound reachability, not
    // specifically a Guide. HSG65 is the live case: it is the only document in
    // the launch set covering health and safety management, and all seven
    // Guides are fire-focused, so no Guide honestly references it. Forcing a
    // link would be inventing a relationship to satisfy a test.
    //
    // It is reachable from the Glossary instead, via "competent person". That
    // is a real route in, and the absence of a health-and-safety Guide is a
    // content gap to fill with a Guide rather than a link to fabricate.
    const { publishedStandards, guidesReferencing, standardsUsingTerm } = await import(
      "../lib/standards"
    );
    const { publishedTerms } = await import("../lib/glossary");

    const reachableFromGlossary = new Set(
      publishedTerms().flatMap((t) => standardsUsingTerm(t.slug).map((s) => s.slug))
    );

    for (const s of publishedStandards()) {
      const inbound =
        guidesReferencing(s.slug).length > 0 || reachableFromGlossary.has(s.slug);
      assert.ok(inbound, `${s.slug} has no inbound link from any other page`);
    }
  });

  test("only the health-and-safety document lacks a Guide, and that is recorded", async () => {
    // Pinning the exception so it cannot quietly grow. If a second standard
    // ends up with no Guide, this fails and the gap gets looked at.
    const { publishedStandards, guidesReferencing } = await import("../lib/standards");
    const withoutGuide = publishedStandards()
      .filter((s) => guidesReferencing(s.slug).length === 0)
      .map((s) => s.slug);
    assert.deepEqual(withoutGuide, ["hsg65-managing-for-health-and-safety"]);
  });

  test("every declared reference resolves to a real standard", async () => {
    const { publishedGuides } = await import("../lib/guides");
    const { getStandard } = await import("../lib/standards");
    for (const g of publishedGuides()) {
      for (const slug of g.relatedStandards ?? []) {
        assert.ok(getStandard(slug), `${g.slug} references "${slug}", which does not resolve`);
      }
    }
  });

  test("the inversion is exact in both directions", async () => {
    const { publishedGuides } = await import("../lib/guides");
    const { publishedStandards, guidesReferencing } = await import("../lib/standards");

    let forward = 0;
    for (const g of publishedGuides()) {
      for (const slug of g.relatedStandards ?? []) {
        forward += 1;
        assert.ok(
          guidesReferencing(slug).map((x) => x.slug).includes(g.slug),
          `${g.slug} declares ${slug} but does not appear on that standard`
        );
      }
    }

    let reverse = 0;
    for (const s of publishedStandards()) {
      for (const g of guidesReferencing(s.slug)) {
        reverse += 1;
        assert.ok(
          (g.relatedStandards ?? []).includes(s.slug),
          `${s.slug} claims ${g.slug} but that guide does not declare it`
        );
      }
    }

    assert.equal(forward, reverse, "forward and reverse link counts must match");
    assert.ok(forward >= 15, `expected a substantial link graph, found ${forward}`);
  });
});

describe("Guide ↔ Standard — rendering", () => {
  test("the guide route resolves and renders the FORWARD direction", () => {
    // The exact defect from PR 4. Data alone is not enough.
    const src = source("guides/[slug]/page.tsx");
    assert.match(src, /guide\.relatedStandards/);
    assert.match(src, /referencedStandards/);
    assert.match(src, /heading: "Standards referenced"/);
  });

  test("the standard route renders the REVERSE direction", () => {
    const src = source("standards/[slug]/page.tsx");
    assert.match(src, /guidesReferencing/);
    assert.match(src, /heading: "Guides that reference this document"/);
  });
});

describe("Glossary ↔ Standard — data and rendering", () => {
  test("every glossary reference on a standard resolves to a published term", async () => {
    const { publishedStandards, termsUsedBy } = await import("../lib/standards");
    for (const s of publishedStandards()) {
      assert.equal(
        termsUsedBy(s).length,
        (s.relatedGlossaryTerms ?? []).length,
        `${s.slug}: a relatedGlossaryTerms entry did not resolve`
      );
    }
  });

  test("the inversion is exact in both directions", async () => {
    const { publishedStandards, standardsUsingTerm } = await import("../lib/standards");

    let forward = 0;
    for (const s of publishedStandards()) {
      for (const termSlug of s.relatedGlossaryTerms ?? []) {
        forward += 1;
        assert.ok(
          standardsUsingTerm(termSlug).map((x) => x.slug).includes(s.slug),
          `${s.slug} declares ${termSlug} but does not appear on that term`
        );
      }
    }

    const { publishedTerms } = await import("../lib/glossary");
    let reverse = 0;
    for (const t of publishedTerms()) {
      for (const s of standardsUsingTerm(t.slug)) {
        reverse += 1;
        assert.ok((s.relatedGlossaryTerms ?? []).includes(t.slug));
      }
    }

    assert.equal(forward, reverse);
    assert.ok(forward > 0);
  });

  test("both routes render their side of it", () => {
    const standardRoute = source("standards/[slug]/page.tsx");
    assert.match(standardRoute, /termsUsedBy/);
    assert.match(standardRoute, /heading: "Terms used on this page"/);

    const glossaryRoute = source("glossary/[slug]/page.tsx");
    assert.match(glossaryRoute, /standardsUsingTerm/);
    assert.match(glossaryRoute, /heading: "Standards that use this term"/);
  });
});

describe("Standard ↔ Standard — supersession in real content", () => {
  test("the withdrawn document names its successor and the successor derives it", async () => {
    const { getStandard, successors, predecessors } = await import("../lib/standards");

    const withdrawn = getStandard("pas-79-2-fire-risk-assessment-housing");
    const replacement = getStandard("bs-9792-fire-risk-assessment-housing");

    assert.deepEqual(
      successors(withdrawn).map((s) => s.slug),
      ["bs-9792-fire-risk-assessment-housing"]
    );
    assert.deepEqual(
      predecessors(replacement).map((s) => s.slug),
      ["pas-79-2-fire-risk-assessment-housing"]
    );

    // The successor declares nothing — the inverse is derived, never authored.
    assert.deepEqual(replacement.supersededBy, []);
  });

  test("every peer reference resolves and none is self-referential", async () => {
    const { publishedStandards, relatedStandards } = await import("../lib/standards");
    for (const s of publishedStandards()) {
      const resolved = relatedStandards(s);
      assert.equal(
        resolved.length,
        (s.relatedStandards ?? []).filter((x) => x !== s.slug).length,
        `${s.slug}: a relatedStandards entry did not resolve`
      );
      for (const r of resolved) assert.notEqual(r.slug, s.slug);
    }
  });

  test("no supersession cycle exists in real content", async () => {
    const { publishedStandards } = await import("../lib/standards");
    const { hasSupersessionCycle } = await import("../lib/supersession");
    const all = publishedStandards();
    for (const s of all) {
      assert.equal(hasSupersessionCycle(s, all), false, `${s.slug} is in a cycle`);
    }
  });

  test("the status banner renders the successor link", () => {
    const src = source("standards/[slug]/page.tsx");
    assert.match(src, /successorItems/);
    assert.match(src, /StandardStatusBanner/);
    // Before the body, so a screen-reader user meets the caveat first.
    assert.ok(
      src.indexOf("<StandardStatusBanner") < src.indexOf("<MDXContent"),
      "the status banner must precede the body in DOM order"
    );
  });
});

describe("Route-level metadata", () => {
  test("the listing description sits inside the editorial band", () => {
    // content:audit checks CONTENT items. A route's own metadata is not a
    // content item, so nothing was checking it — the listing shipped at 189
    // characters until local verification caught it.
    const src = source("standards/page.tsx");
    const match = src.match(/const DESCRIPTION =\s*\n?\s*"([^"]+)"/);
    assert.ok(match, "DESCRIPTION not found");
    const length = match[1].length;
    assert.ok(length >= 120 && length <= 170, `listing description is ${length} characters`);
  });

  test("the listing declares an absolute self-canonical", () => {
    const src = source("standards/page.tsx");
    assert.match(src, /alternates: \{ canonical: STANDARDS_PATH \}/);
  });
});

describe("Knowledge Centre navigation", () => {
  test("all four sections are listed and no later vertical is", async () => {
    const src = fs.readFileSync(
      path.join(repoRoot, "components/KnowledgeCentreNav.tsx"),
      "utf8"
    );
    for (const href of ["/guides", "/glossary", "/standards", "/legislation"]) {
      assert.ok(src.includes(`href: "${href}"`), `${href} missing from the section nav`);
    }
    for (const href of ["/news", "/downloads"]) {
      assert.ok(!src.includes(`href: "${href}"`), `${href} is a later PR`);
    }
  });

  test("every Knowledge Centre index renders the shared nav", () => {
    for (const route of ["guides/page.tsx", "glossary/page.tsx", "standards/page.tsx"]) {
      assert.match(source(route), /KnowledgeCentreNav/, `${route} is missing the section nav`);
    }
  });

  test("the current section is marked, not merely styled", async () => {
    const src = fs.readFileSync(
      path.join(repoRoot, "components/KnowledgeCentreNav.tsx"),
      "utf8"
    );
    assert.match(src, /aria-current/);
  });

  test("the header is unchanged at nine items, so the 1280px collapse stays closed", async () => {
    const site = fs.readFileSync(path.join(repoRoot, "lib/site.ts"), "utf8");
    const navBlock = site.slice(site.indexOf("export const NAV"), site.indexOf("];", site.indexOf("export const NAV")));
    assert.equal((navBlock.match(/\{ label:/g) || []).length, 9);
    assert.ok(!navBlock.includes("/standards"), "Standards must not be a tenth header item");
  });

  test("the footer gives the Glossary a route in from global navigation", () => {
    // It had none between PR 4 and PR 5: not the header, and a footer carrying
    // only Sectors, Contact and Privacy.
    const footer = fs.readFileSync(path.join(repoRoot, "components/Footer.tsx"), "utf8");
    assert.match(footer, /KNOWLEDGE_SECTIONS/);
  });
});

describe("Author-triggered linking only", () => {
  test("StandardLink is exposed to MDX bodies", () => {
    const src = fs.readFileSync(path.join(repoRoot, "components/MDXContent.tsx"), "utf8");
    assert.match(src, /StandardLink/);
  });

  test("no automatic first-mention replacement was introduced", () => {
    // Render-time text substitution would have to avoid headings, existing
    // links, code, repeated occurrences and quoted titles — and every one of
    // those failures is invisible in a diff.
    const src = fs.readFileSync(path.join(repoRoot, "components/MDXContent.tsx"), "utf8");
    assert.ok(!/replace\(.*designation/i.test(src));
    assert.ok(!/autoLink|firstMention/i.test(src));
  });
});
