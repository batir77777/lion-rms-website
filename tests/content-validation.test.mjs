// Test suite for the Phase 5A, PR 1 content foundation.
//
// Two layers, matching how lib/content-validation.ts was deliberately
// designed: pure, in-memory unit tests for the cross-collection validation
// functions (no Velite build needed — they operate on plain data), and
// full end-to-end fixture tests that run a real, isolated `velite build`
// per scenario via a child process. The child-process approach is
// deliberate, not incidental: s.slug() (used by every content-type schema)
// depends on Velite's internal build context and cannot be unit-tested via
// a bare schema.safeParse() call outside a real build — see the comment at
// the top of lib/content-schemas.ts. Running each scenario as its own
// process also gives full isolation between scenarios (no shared
// slug-uniqueness cache) and mirrors exactly how `npm run content:build`
// is actually invoked, rather than approximating it.
//
// Run with: node --experimental-strip-types --test tests/

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { checkReservedSlugs, checkDuplicateIds, checkRelations, validateContentCollections } from "../lib/content-validation";
import { validateTaxonomyRegistry } from "../lib/taxonomy";
import { validatePeopleRegistry } from "../lib/people";
import { isReservedSlug } from "../lib/reserved-slugs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function runVeliteFixture(scenario) {
  const configPath = path.join("tests", "fixtures-config", `${scenario}.velite.config.ts`);
  try {
    const output = execFileSync(
      "npx",
      ["velite", "build", "--config", configPath, "--strict", "--clean", "--silent"],
      { cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
    );
    return { success: true, output };
  } catch (error) {
    return { success: false, output: (error.stdout || "") + (error.stderr || ""), error };
  }
}

// ---------------------------------------------------------------------------
// End-to-end fixture scenarios (real Velite builds, isolated per process)
// ---------------------------------------------------------------------------

describe("Velite fixture build scenarios (PR 1 required tests)", () => {
  test("valid fixture passes", () => {
    const result = runVeliteFixture("valid");
    assert.equal(result.success, true, `expected the valid fixture set to build cleanly, got:\n${result.output}`);
  });

  test("malformed frontmatter fails", () => {
    const result = runVeliteFixture("malformed-frontmatter");
    assert.equal(result.success, false, "expected a guide fixture missing the required `summary` field to fail the build");
  });

  test("unknown category fails", () => {
    const result = runVeliteFixture("unknown-category");
    assert.equal(result.success, false, "expected a guide fixture referencing an unregistered category slug to fail the build");
  });

  test("duplicate slug fails", () => {
    const result = runVeliteFixture("duplicate-slug");
    assert.equal(result.success, false, "expected two guide fixtures sharing the same slug to fail the build");
  });

  test("invalid relation fails where target collection exists", () => {
    const result = runVeliteFixture("invalid-relation");
    assert.equal(
      result.success,
      false,
      "expected a guide fixture referencing a non-existent glossary term (while the glossary collection itself is present) to fail the build"
    );
  });

  // Not one of the seven PR 1 test requirements verbatim, but explicitly
  // requested by the owner alongside the reserved-slug registry itself —
  // included here for the same end-to-end rigour as the others.
  test("reserved slug fails", () => {
    const result = runVeliteFixture("reserved-slug");
    assert.equal(result.success, false, 'expected a guide fixture using the reserved slug "search" to fail the build');
  });
});

// ---------------------------------------------------------------------------
// Pure unit tests for the cross-collection validation framework
// (lib/content-validation.ts) — no Velite build involved.
// ---------------------------------------------------------------------------

describe("lib/content-validation.ts (pure, in-memory)", () => {
  test("checkReservedSlugs flags a reserved slug and ignores a normal one", () => {
    const issues = checkReservedSlugs({
      guides: [
        { id: "a", slug: "search" },
        { id: "b", slug: "a-perfectly-normal-guide" },
      ],
    });
    assert.equal(issues.length, 1);
    assert.equal(issues[0].slug, "search");
  });

  test("checkDuplicateIds flags a repeated id within one collection", () => {
    const issues = checkDuplicateIds({
      guides: [
        { id: "same-id", slug: "guide-one" },
        { id: "same-id", slug: "guide-two" },
      ],
    });
    assert.equal(issues.length, 1);
    assert.match(issues[0].message, /Duplicate id "same-id"/);
  });

  test("checkDuplicateIds allows the same id to repeat across different collections", () => {
    // Only within-collection duplication is invalid; ids are not required
    // to be globally unique across every collection.
    const issues = checkDuplicateIds({
      guides: [{ id: "shared-id", slug: "guide-one" }],
      news: [{ id: "shared-id", slug: "news-one" }],
    });
    assert.equal(issues.length, 0);
  });

  test("checkRelations flags a relation pointing at a slug that doesn't exist in its target collection", () => {
    const issues = checkRelations({
      guides: [{ id: "g1", slug: "guide-one", relatedGlossaryTerms: ["missing-term"] }],
      glossaryTerms: [{ id: "t1", slug: "real-term" }],
    });
    assert.equal(issues.length, 1);
    assert.match(issues[0].message, /referencing "missing-term"/);
  });

  test("checkRelations passes when the referenced slug exists in the target collection", () => {
    const issues = checkRelations({
      guides: [{ id: "g1", slug: "guide-one", relatedGlossaryTerms: ["real-term"] }],
      glossaryTerms: [{ id: "t1", slug: "real-term" }],
    });
    assert.equal(issues.length, 0);
  });

  test("checkRelations does not flag a relation whose target collection is absent from this build", () => {
    // An empty/absent target collection means "not built yet" (PR 1's
    // fixture-only / empty-collection reality), not "every reference to it
    // is wrong" — see the comment in lib/content-validation.ts.
    const issues = checkRelations({
      guides: [{ id: "g1", slug: "guide-one", relatedGlossaryTerms: ["anything"] }],
    });
    assert.equal(issues.length, 0);
  });

  test("validateContentCollections aggregates all three checks", () => {
    const result = validateContentCollections({
      guides: [{ id: "g1", slug: "search", relatedGlossaryTerms: ["missing"] }],
    });
    assert.equal(result.valid, false);
    assert.ok(result.issues.length >= 1);
  });
});

// ---------------------------------------------------------------------------
// Registry sanity checks — the real taxonomy/people/reserved-slug registries
// shipped in this PR should themselves be well-formed.
// ---------------------------------------------------------------------------

describe("Registry sanity checks", () => {
  test("the real taxonomy registry is internally valid", () => {
    const result = validateTaxonomyRegistry();
    assert.equal(result.valid, true, result.errors.join("\n"));
  });

  test("the real people registry is internally valid", () => {
    const result = validatePeopleRegistry();
    assert.equal(result.valid, true, result.errors.join("\n"));
  });

  test("isReservedSlug is case-insensitive", () => {
    assert.equal(isReservedSlug("Search"), true);
    assert.equal(isReservedSlug("SEARCH"), true);
    assert.equal(isReservedSlug("a-normal-guide-slug"), false);
  });
});
