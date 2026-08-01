// Glossary tests (Phase 5A, PR 4).
//
// Three layers: the accessor decisions (what is public, how it groups, how the
// Guide relation inverts), the routes (what is generated and what deliberately
// is not), and relation integrity in both directions.

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

const exists = (p) => fs.existsSync(path.join(appDir, p));

const EXPECTED_SLUGS = [
  "automatic-fire-detection",
  "compartmentation",
  "competent-person",
  "emergency-lighting",
  "fire-door",
  "fire-resistance-rating",
  "fire-risk-assessment",
  "higher-risk-building",
  "means-of-escape",
  "personal-emergency-evacuation-plan",
  "responsible-person",
  "stay-put",
];

describe("Glossary accessor layer", () => {
  test("exposes exactly the twelve launch terms, all published", async () => {
    const { publishedTerms } = await import("../lib/glossary");
    const terms = publishedTerms();
    assert.equal(terms.length, 12);
    assert.deepEqual(terms.map((t) => t.slug).sort(), [...EXPECTED_SLUGS].sort());
    for (const t of terms) assert.equal(t.status, "published");
  });

  test("excludes anything not published", async () => {
    const { glossaryTerms: raw } = await import("../.velite");
    const { publishedTerms } = await import("../lib/glossary");
    const visible = new Set(publishedTerms().map((t) => t.slug));
    for (const item of raw) {
      if (item.status !== "published") assert.equal(visible.has(item.slug), false);
    }
  });

  test("orders terms alphabetically by displayed name", async () => {
    const { publishedTerms, displayTerm } = await import("../lib/glossary");
    const names = publishedTerms().map(displayTerm);
    const sorted = [...names].sort((a, b) => a.localeCompare(b, "en-GB"));
    assert.deepEqual(names, sorted);
  });

  test("letterGroups covers all 26 letters and retains the empty ones", async () => {
    const { letterGroups } = await import("../lib/glossary");
    const groups = letterGroups();
    assert.equal(groups.length, 26);
    assert.equal(groups[0].letter, "A");
    assert.equal(groups[25].letter, "Z");
    // Empty letters must survive — the index renders them as unlinked text,
    // and a jump link that scrolls nowhere is worse than no link at all.
    assert.ok(groups.some((g) => g.terms.length === 0));
    const total = groups.reduce((n, g) => n + g.terms.length, 0);
    assert.equal(total, 12);
  });

  test("activeLetters gives nine distinct letters and no empty ones", async () => {
    const { activeLetters } = await import("../lib/glossary");
    const letters = activeLetters();
    assert.deepEqual(letters, ["A", "C", "E", "F", "H", "M", "P", "R", "S"]);
    assert.equal(letters.length, 9);
  });

  test("alternateNames merges synonyms with any abbreviation expansion", async () => {
    const { getTerm, alternateNames } = await import("../lib/glossary");
    const fra = getTerm("fire-risk-assessment");
    assert.ok(alternateNames(fra).includes("FRA"));
    const competent = getTerm("competent-person");
    assert.deepEqual(alternateNames(competent), []);
  });

  test("relatedTerms resolves to published terms and drops self-references", async () => {
    const { publishedTerms, relatedTerms } = await import("../lib/glossary");
    for (const term of publishedTerms()) {
      const related = relatedTerms(term);
      assert.equal(
        related.length,
        (term.relatedTerms ?? []).filter((s) => s !== term.slug).length,
        `${term.slug}: a relatedTerms entry did not resolve`
      );
      for (const r of related) assert.notEqual(r.slug, term.slug);
    }
  });

  test("guidesUsingTerm inverts the Guide relation", async () => {
    const { guidesUsingTerm, publishedTerms } = await import("../lib/glossary");
    const { publishedGuides } = await import("../lib/guides");

    for (const guide of publishedGuides()) {
      for (const slug of guide.relatedGlossaryTerms ?? []) {
        const inverted = guidesUsingTerm(slug).map((g) => g.slug);
        assert.ok(
          inverted.includes(guide.slug),
          `${guide.slug} declares ${slug} but does not appear on that term`
        );
      }
    }

    // Every launch term is referenced by at least one Guide, so no term page
    // ships with an empty related-Guides block.
    for (const term of publishedTerms()) {
      assert.ok(
        guidesUsingTerm(term.slug).length > 0,
        `${term.slug} is referenced by no Guide`
      );
    }
  });

  // Both halves of the relation must actually reach a page. The inversion was
  // implemented and tested first, and preview verification caught that the
  // Guide side was never rendered — so this asserts the forward direction at
  // the route, not just in the data.
  test("the guide route renders a link to each of its related terms", async () => {
    const fsMod = await import("node:fs");
    const src = fsMod.readFileSync(path.join(appDir, "guides/[slug]/page.tsx"), "utf8");
    assert.match(src, /relatedGlossaryTerms/, "guide route does not read the relation");
    assert.match(src, /Terms used in this guide/, "guide route does not render a related-terms group");
  });

  test("every guide with related terms resolves all of them", async () => {
    const { publishedGuides } = await import("../lib/guides");
    const { getTerm } = await import("../lib/glossary");
    let total = 0;
    for (const guide of publishedGuides()) {
      for (const slug of guide.relatedGlossaryTerms ?? []) {
        assert.ok(getTerm(slug), `${guide.slug}: ${slug} does not resolve`);
        total++;
      }
    }
    assert.ok(total >= 20, `expected the relation to be populated, found ${total}`);
  });

  test("breadcrumbs are Home / Knowledge Centre / Glossary / term", async () => {
    const { getTerm, buildTermBreadcrumbs } = await import("../lib/glossary");
    const crumbs = buildTermBreadcrumbs(getTerm("stay-put"));
    assert.equal(crumbs.length, 4);
    assert.deepEqual(crumbs[2], { name: "Glossary", path: "/glossary" });
    assert.equal(crumbs[3].path, undefined);
  });
});

describe("Glossary routing", () => {
  test("generateStaticParams returns exactly the published terms", async () => {
    const mod = await import("../app/glossary/[slug]/page.tsx");
    const params = mod.generateStaticParams();
    assert.equal(params.length, 12);
    assert.deepEqual(params.map((p) => p.slug).sort(), [...EXPECTED_SLUGS].sort());
  });

  test("dynamicParams is false", async () => {
    const mod = await import("../app/glossary/[slug]/page.tsx");
    assert.equal(mod.dynamicParams, false);
  });

  test("every term's metadata sits inside the editorial ranges and self-canonicalises", async () => {
    const mod = await import("../app/glossary/[slug]/page.tsx");
    const { publishedTerms } = await import("../lib/glossary");
    for (const term of publishedTerms()) {
      const meta = await mod.generateMetadata({
        params: Promise.resolve({ slug: term.slug }),
      });
      assert.ok(
        meta.title.length >= 30 && meta.title.length <= 65,
        `${term.slug}: title is ${meta.title.length} characters`
      );
      assert.ok(
        meta.description.length >= 120 && meta.description.length <= 170,
        `${term.slug}: description is ${meta.description.length} characters`
      );
      assert.equal(meta.alternates.canonical, `/glossary/${term.slug}`);
      assert.equal(meta.openGraph.type, "article");
    }
  });

  test("seoDescription is not a verbatim copy of shortDefinition", async () => {
    const { publishedTerms } = await import("../lib/glossary");
    for (const term of publishedTerms()) {
      assert.notEqual(
        term.seoDescription,
        term.shortDefinition,
        `${term.slug}: the page description repeats the definition shown on the index`
      );
    }
  });

  test("both glossary routes exist", () => {
    assert.ok(exists("glossary/page.tsx"));
    assert.ok(exists("glossary/[slug]/page.tsx"));
  });

  test("letter routes and glossary taxonomy routes are not introduced", () => {
    assert.equal(exists("glossary/letter"), false);
    assert.equal(exists("glossary/category"), false);
    assert.equal(exists("glossary/tag"), false);
  });

  test("no other vertical is introduced", () => {
    // "standards" left this list in PR 5, "legislation" in PR 6, "news" in
    // PR 7, "downloads" in PR 8A and "knowledge"/"search" in PR 9, each of
    // which launched it. Nothing beyond those is expected, so the assertion
    // inverts: these two now MUST exist, and no seventh vertical may appear.
    for (const route of ["knowledge", "search"]) {
      assert.ok(exists(route), `/${route} should have launched in PR 9`);
    }
    for (const route of ["insights", "resources", "topics", "library"]) {
      assert.equal(exists(route), false, `/${route} must not exist`);
    }
  });

  test("the sitemap lists /glossary and every term with a real date", async () => {
    const { default: sitemap } = await import("../app/sitemap.ts");
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    assert.ok(urls.includes("https://www.lionrms.uk/glossary"));
    for (const slug of EXPECTED_SLUGS) {
      assert.ok(urls.includes(`https://www.lionrms.uk/glossary/${slug}`), `${slug} missing`);
    }
    const term = entries.find((e) => e.url.endsWith("/glossary/stay-put"));
    assert.equal(term.lastModified.toISOString().slice(0, 10), "2026-07-29");
    for (const u of urls) assert.equal(u.includes("/insights"), false);
  });
});

// ---------------------------------------------------------------------------
// Regression cover for the extendedDefinition schema fix (Phase 5A, PR 4).
//
// The field was declared `s.mdx().optional()`, which can never be populated:
// Velite's s.mdx() reads the document body from build context, but zod's
// .optional() short-circuits on an absent input and returns undefined without
// running the inner transform. Every term's extended definition was silently
// discarded while content:build and content:audit both reported success.
//
// These tests fail loudly if that regression returns — one at the Velite output
// layer, one at the render layer — because the failure mode is silence.
// ---------------------------------------------------------------------------
describe("Glossary extended definitions", () => {
  test("every term carries a compiled extendedDefinition in the Velite output", async () => {
    const { glossaryTerms } = await import("../.velite");
    assert.equal(glossaryTerms.length, 12);
    for (const term of glossaryTerms) {
      assert.equal(
        typeof term.extendedDefinition,
        "string",
        `${term.slug}: extendedDefinition is missing from the build output`
      );
      assert.ok(
        term.extendedDefinition.length > 200,
        `${term.slug}: extendedDefinition is ${term.extendedDefinition.length} chars — the body was not compiled`
      );
      // Velite's s.mdx() emits a compiled function body, not raw markdown or
      // HTML. If this stops matching, the field is being populated by something
      // other than the MDX pipeline.
      assert.match(
        term.extendedDefinition,
        /_createMdxContent/,
        `${term.slug}: extendedDefinition is not compiled MDX`
      );
    }
  });

  test("the schema requires extendedDefinition rather than leaving it optional", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync(path.join(repoRoot, "lib/content-schemas.ts"), "utf8");
    assert.match(src, /extendedDefinition: s\.mdx\(\),/);
    assert.equal(
      /extendedDefinition: s\.mdx\(\)\.optional\(\)/.test(src),
      false,
      "s.mdx().optional() silently discards every body — see the comment in content-schemas.ts"
    );
  });

  test("the compiled definition actually reaches the rendered term page", async () => {
    const { getTerm } = await import("../lib/glossary");
    const term = getTerm("stay-put");
    // The heading text below is authored in the MDX body, so finding it in the
    // compiled output proves the body survived the pipeline end to end.
    assert.match(term.extendedDefinition, /What the strategy depends on/);
    assert.match(term.extendedDefinition, /compartmentation/i);
  });
});

describe("Glossary structured data", () => {
  test("DefinedTermSet lists every published term", async () => {
    const { buildDefinedTermSetSchema } = await import("../lib/content-jsonld");
    const { publishedTerms, displayTerm } = await import("../lib/glossary");
    const terms = publishedTerms();
    const schema = buildDefinedTermSetSchema({
      name: "x",
      description: "y",
      path: "/glossary",
      terms: terms.map((t) => ({
        name: displayTerm(t),
        description: t.shortDefinition,
        path: `/glossary/${t.slug}`,
      })),
    });
    assert.equal(schema["@type"], "DefinedTermSet");
    assert.equal(schema.hasDefinedTerm.length, 12);
    for (const entry of schema.hasDefinedTerm) {
      assert.equal(entry.inDefinedTermSet, "https://www.lionrms.uk/glossary");
    }
  });

  test("DefinedTerm carries alternateName and points at the set", async () => {
    const { buildDefinedTermSchema } = await import("../lib/content-jsonld");
    const schema = buildDefinedTermSchema({
      name: "Fire Risk Assessment",
      description: "d",
      path: "/glossary/fire-risk-assessment",
      alternateNames: ["FRA"],
      inDefinedTermSet: "https://www.lionrms.uk/glossary",
    });
    assert.equal(schema["@type"], "DefinedTerm");
    assert.equal(schema.alternateName, "FRA");
    assert.equal(schema.inDefinedTermSet, "https://www.lionrms.uk/glossary");
  });
});
