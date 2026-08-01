// Downloads relationships, in both directions (Phase 5A, PR 8A).
//
// `relatedDownloads` has been on `baseFields` and in RELATION_TARGET_COLLECTIONS
// since PR 1 and PR 7 respectively, so the inbound half of this was already
// validated before a single resource existed. What PR 8A adds is the accessor
// and rendering layer — and the discipline that every inverse is DERIVED by
// scanning the Downloads collection, never authored on the target, so a
// Standard cannot claim a checklist that does not point back at it.
//
// The registry group at the end is the one that fixes a real defect rather than
// preventing a hypothetical one: until PR 8A an unknown service or sector slug
// was silently dropped by `.filter(Boolean)` in every page component, producing
// no link, no error and no symptom.

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

describe("Outbound relations resolve to published content", () => {
  test("every relation a resource declares resolves, or is deliberately absent", async () => {
    const {
      publishedDownloads,
      guidesReferencedBy,
      standardsReferencedBy,
      legislationReferencedBy,
      termsReferencedBy,
      newsReferencedBy,
    } = await import("../lib/downloads");

    for (const item of publishedDownloads()) {
      assert.equal(guidesReferencedBy(item).length, (item.relatedArticles ?? []).length, item.slug);
      assert.equal(
        standardsReferencedBy(item).length,
        (item.relatedStandards ?? []).length,
        item.slug
      );
      assert.equal(
        legislationReferencedBy(item).length,
        (item.relatedLegislation ?? []).length,
        item.slug
      );
      assert.equal(
        termsReferencedBy(item).length,
        (item.relatedGlossaryTerms ?? []).length,
        item.slug
      );
      assert.equal(newsReferencedBy(item).length, (item.relatedNews ?? []).length, item.slug);
    }
  });

  test("the migrated checklist reaches all four Knowledge Centre verticals it cites", async () => {
    const {
      getDownload,
      guidesReferencedBy,
      standardsReferencedBy,
      legislationReferencedBy,
      termsReferencedBy,
    } = await import("../lib/downloads");
    const item = getDownload("fire-safety-checklist");
    assert.ok(guidesReferencedBy(item).length >= 3);
    assert.ok(standardsReferencedBy(item).length >= 1);
    assert.ok(legislationReferencedBy(item).length >= 2);
    assert.ok(termsReferencedBy(item).length >= 5);
  });

  test("a self-reference in relatedDownloads is dropped rather than rendered", async () => {
    const { relatedDownloadResources } = await import("../lib/downloads");
    const fake = { slug: "x", relatedDownloads: ["x", "fire-safety-checklist"] };
    const result = relatedDownloadResources(fake);
    assert.equal(result.some((d) => d.slug === "x"), false);
  });

  test("relatedDownloads resolves only published peers", async () => {
    const { relatedDownloadResources } = await import("../lib/downloads");
    const fake = { slug: "y", relatedDownloads: ["fire-safety-checklist", "no-such-thing"] };
    assert.equal(relatedDownloadResources(fake).length, 1);
  });
});

describe("Inverse relations are derived, never authored", () => {
  test("each inverse agrees exactly with the forward relation that produced it", async () => {
    const {
      publishedDownloads,
      downloadsForGuide,
      downloadsForStandard,
      downloadsForLegislation,
      downloadsForTerm,
      downloadsForNews,
    } = await import("../lib/downloads");

    const check = (inverse, field) => {
      for (const item of publishedDownloads()) {
        for (const slug of item[field] ?? []) {
          assert.ok(
            inverse(slug).some((d) => d.slug === item.slug),
            `${item.slug} declares ${field} "${slug}" but the inverse does not return it`
          );
        }
      }
    };

    check(downloadsForGuide, "relatedArticles");
    check(downloadsForStandard, "relatedStandards");
    check(downloadsForLegislation, "relatedLegislation");
    check(downloadsForTerm, "relatedGlossaryTerms");
    check(downloadsForNews, "relatedNews");
  });

  test("an inverse never returns a resource that did not declare the relation", async () => {
    const { downloadsForStandard } = await import("../lib/downloads");
    const { standards } = await import("../.velite");
    for (const s of standards) {
      for (const d of downloadsForStandard(s.slug)) {
        assert.ok(
          (d.relatedStandards ?? []).includes(s.slug),
          `${d.slug} was returned for ${s.slug} without declaring it`
        );
      }
    }
  });

  test("an inverse for an unknown slug is empty, not everything", async () => {
    const { downloadsForGuide, downloadsForStandard } = await import("../lib/downloads");
    assert.deepEqual(downloadsForGuide("no-such-guide"), []);
    assert.deepEqual(downloadsForStandard("no-such-standard"), []);
  });

  test("withdrawn resources never appear in an inverse", async () => {
    const { withdrawnDownloads, downloadsForGuide } = await import("../lib/downloads");
    for (const w of withdrawnDownloads()) {
      for (const slug of w.relatedArticles ?? []) {
        assert.equal(
          downloadsForGuide(slug).some((d) => d.slug === w.slug),
          false,
          `${w.slug} is withdrawn and must not be recommended`
        );
      }
    }
  });
});

describe("Every collection renders its related downloads", () => {
  const cases = [
    ["guides/[slug]/page.tsx", "downloadsForGuide"],
    ["standards/[slug]/page.tsx", "downloadsForStandard"],
    ["legislation/[slug]/page.tsx", "downloadsForLegislation"],
    ["glossary/[slug]/page.tsx", "downloadsForTerm"],
    ["news/[slug]/page.tsx", "downloadsForNews"],
  ];

  for (const [route, accessor] of cases) {
    test(`${route} imports and renders ${accessor}`, () => {
      const src = source(route);
      assert.match(src, new RegExp(accessor), `${route} does not use ${accessor}`);
      assert.match(src, /from "@\/lib\/downloads"/, `${route} does not import the accessor layer`);
      assert.match(src, /Checklists and templates/, `${route} has no heading for the group`);
    });
  }

  test("the downloads landing page renders every inbound and outbound group", () => {
    const src = source("downloads/[slug]/page.tsx");
    for (const heading of [
      "Guides this supports",
      "Standards referenced",
      "Legislation referenced",
      "Related news",
      "Related resources",
      "Resources referring to this",
      "Terms used on this page",
      "Related service",
      "Related sector",
    ]) {
      assert.ok(src.includes(heading), `missing group: ${heading}`);
    }
  });
});

describe("Registry relations — services, sectors and case studies", () => {
  test("relatedServices and relatedSectors are validated, not just filtered", async () => {
    const { checkRegistryRelations } = await import("../lib/content-validation");
    const bad = { downloads: [{ id: "d", slug: "d", relatedServices: ["fire-safty"] }] };
    const issues = checkRegistryRelations(bad);
    assert.equal(issues.length, 1);
    assert.equal(issues[0].rule, "G18");
  });

  test("the page components keep their runtime filter as defence in depth", () => {
    // Validation stops a typo reaching production; the filter stops a
    // half-built render if one ever did. Removing either would be a regression.
    for (const route of ["guides/[slug]/page.tsx", "downloads/[slug]/page.tsx"]) {
      assert.match(source(route), /\.filter\(\(s\): s is NonNullable<typeof s> => Boolean\(s\)\)/);
    }
  });

  test("every published item's service and sector slugs resolve", async () => {
    const { checkRegistryRelations } = await import("../lib/content-validation");
    const { downloads, guides, standards, legislation, glossaryTerms, news } = await import(
      "../.velite"
    );
    assert.deepEqual(
      checkRegistryRelations({ downloads, guides, standards, legislation, glossaryTerms, news }),
      []
    );
  });

  test("relatedDownloads is registered so every collection's references are checked", async () => {
    const src = fs.readFileSync(path.join(repoRoot, "lib/content-validation.ts"), "utf8");
    assert.match(src, /relatedDownloads:\s*"downloads"/);
  });
});
