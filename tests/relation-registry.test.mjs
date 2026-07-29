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

  test("content-collection relations stay empty until those collections exist", async () => {
    const { guides } = await import("../.velite");
    for (const guide of guides) {
      for (const field of [
        "relatedArticles",
        "relatedStandards",
        "relatedLegislation",
        "relatedGlossaryTerms",
        "relatedDownloads",
      ]) {
        assert.deepEqual(
          guide[field],
          [],
          `${guide.slug}: ${field} references a collection that has no content yet`
        );
      }
    }
  });
});
