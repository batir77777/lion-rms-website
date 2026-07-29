// Registry-relation tests (Phase 5A, PR 3).
//
// PR 1's checkRelations validates only relation fields that point at other
// Velite collections — relatedArticles, relatedStandards, relatedLegislation,
// relatedGlossaryTerms, relatedDownloads. It deliberately does not validate
// relatedServices, relatedSectors or relatedCaseStudies, which point at the
// TypeScript registries in lib/site.ts and lib/case-studies.ts.
//
// That leaves a real gap: a typo in one of those fields produces a silently
// dropped related link rather than a build failure. Closing it inside PR 1's
// shared validator is out of this PR's approved scope, so it is closed here
// instead — same protection, no change to shipped validation code.
//
// If a future PR does extend the shared validator to cover registry-backed
// relations, this file becomes redundant and should be retired with it.

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
    // relatedStandards left this list in Phase 5A PR 5, which populated it on
    // every guide. The remaining three point at collections that still have no
    // content, and a reference into an empty collection would resolve to
    // nothing and render as nothing.
    const { guides } = await import("../.velite");
    for (const guide of guides) {
      for (const field of ["relatedArticles", "relatedLegislation", "relatedDownloads"]) {
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
