// Registry-relation tests (Phase 5A, PR 3).
//
// PR 1's checkRelations validates only relation fields that point at other
// Velite collections — relatedArticles, relatedStandards, relatedLegislation,
// relatedGlossaryTerms, relatedDownloads. Registry-backed relations
// (relatedServices, relatedSectors, relatedCaseStudies) point at the TypeScript
// registries in lib/site.ts and lib/case-studies.ts instead, and a typo in one
// produced a silently dropped link rather than a build failure. Closing that
// inside PR 1's shared validator was out of scope at the time, so it was closed
// here.
//
// UPDATE, Phase 5A PR 8A: the shared validator now DOES cover them, as rule
// G18 in checkRegistryRelations — across every collection, at build time.
//
// This file said it should be retired if that ever happened. It is kept anyway,
// deliberately, because two of its assertions are not duplicated by G18 and
// should not be:
//
//   - the Guides-specific `hasPage` rule from the PR #12 hotfix. G18 must not
//     adopt it, because a sector with no page is a known entity that correctly
//     renders as plain text on other collections — requiring a page globally
//     would break the optional-link fallback rather than protect it.
//   - `relatedTerms`, which is a Glossary-only field.
//
// What IS now duplicated is the plain existence checking below, and that
// duplication is cheap and harmless: two independent statements of the same
// truth, one of which fails the build and one of which fails the suite.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

before(() => {
  execFileSync("npx", ["velite", "build", "--strict", "--clean", "--silent"], {
    cwd: repoRoot,
    stdio: "pipe",
  });
});

describe("Registry-backed relations resolve", () => {
  test("every relatedServices slug exists in SERVICE_CATEGORIES", async () => {
    const { guides } = await import("../.velite");
    const { getCategory } = await import("../lib/site");
    for (const guide of guides) {
      for (const slug of guide.relatedServices ?? []) {
        assert.ok(
          getCategory(slug),
          `${guide.slug}: relatedServices "${slug}" is not a known service`
        );
      }
    }
  });

  test("every relatedSectors slug exists in SECTORS and has a live page", async () => {
    const { guides } = await import("../.velite");
    const { getSector } = await import("../lib/site");
    for (const guide of guides) {
      for (const slug of guide.relatedSectors ?? []) {
        const sector = getSector(slug);
        assert.ok(sector, `${guide.slug}: relatedSectors "${slug}" is not a known sector`);
        // Mirrors the PR #12 hotfix rule: never link a sector without a page.
        assert.ok(
          sector.hasPage,
          `${guide.slug}: relatedSectors "${slug}" has no live page`
        );
      }
    }
  });

  test("every relatedCaseStudies slug exists in CASE_STUDIES", async () => {
    const { guides } = await import("../.velite");
    const { getCaseStudy } = await import("../lib/case-studies");
    for (const guide of guides) {
      for (const slug of guide.relatedCaseStudies ?? []) {
        assert.ok(
          getCaseStudy(slug),
          `${guide.slug}: relatedCaseStudies "${slug}" is not a known case study`
        );
      }
    }
  });

  test("relatedSectors is empty on migrated guides, preserving derived sector linking", async () => {
    const { guides } = await import("../.velite");
    for (const guide of guides) {
      assert.deepEqual(
        guide.relatedSectors,
        [],
        `${guide.slug}: populating relatedSectors would change which guides sector pages show`
      );
    }
  });

  // Phase 5A PR 4: relatedTerms points at the glossaryTerms collection but is
  // absent from PR 1's RELATION_TARGET_COLLECTIONS, so a typo would silently
  // drop a link rather than failing the build. Closed here rather than by
  // modifying the shared validator, consistent with how the registry-backed
  // relations above are handled.
  test("every relatedTerms slug resolves to a published glossary term", async () => {
    const { glossaryTerms } = await import("../.velite");
    const published = new Set(
      glossaryTerms.filter((t) => t.status === "published").map((t) => t.slug)
    );
    for (const term of glossaryTerms) {
      for (const slug of term.relatedTerms ?? []) {
        assert.ok(published.has(slug), `${term.slug}: relatedTerms "${slug}" does not resolve`);
        assert.notEqual(slug, term.slug, `${term.slug} relates to itself`);
      }
    }
  });

  test("every Guide relatedGlossaryTerms slug resolves to a published term", async () => {
    const { guides, glossaryTerms } = await import("../.velite");
    const published = new Set(
      glossaryTerms.filter((t) => t.status === "published").map((t) => t.slug)
    );
    for (const guide of guides) {
      for (const slug of guide.relatedGlossaryTerms ?? []) {
        assert.ok(
          published.has(slug),
          `${guide.slug}: relatedGlossaryTerms "${slug}" does not resolve`
        );
      }
    }
  });

  test("glossary terms carry no registry-backed relations at launch", async () => {
    const { glossaryTerms } = await import("../.velite");
    for (const term of glossaryTerms) {
      for (const field of ["relatedServices", "relatedSectors", "relatedCaseStudies"]) {
        assert.deepEqual(term[field], [], `${term.slug}: ${field} should be empty at launch`);
      }
    }
  });

  test("content-collection relations stay empty until those collections exist", async () => {
    // relatedStandards left this list in Phase 5A PR 5 and relatedLegislation
    // in PR 6, each of which populated it on every guide. The remaining two
    // point at collections that still have no content, and a reference into an
    // empty collection would resolve to nothing and render as nothing.
    const { guides } = await import("../.velite");
    for (const guide of guides) {
      for (const field of ["relatedArticles", "relatedDownloads"]) {
        assert.deepEqual(
          guide[field],
          [],
          `${guide.slug}: ${field} references a collection that has no content yet`
        );
      }
    }
  });

  test("every relatedStandards entry resolves, now that the collection exists", async () => {
    const { guides, standards } = await import("../.velite");
    const slugs = new Set(standards.map((s) => s.slug));
    for (const guide of guides) {
      assert.ok(
        (guide.relatedStandards ?? []).length > 0,
        `${guide.slug}: no standards referenced`
      );
      for (const ref of guide.relatedStandards ?? []) {
        assert.ok(slugs.has(ref), `${guide.slug}: relatedStandards "${ref}" does not resolve`);
      }
    }
  });
});
