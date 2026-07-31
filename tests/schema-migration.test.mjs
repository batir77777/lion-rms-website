// The shared-schema migration guarantee (Phase 5A, PR 6).
//
// PR 6 moved three fields — documentStatus, withdrawnDate, editionConfirmedDate
// — out of the shared `documentReferenceFields` block and into
// `standardGuidancePageSchema`, and turned rule G13's single hardcoded
// required-field list into a per-collection map.
//
// Both of those are the kind of refactor that can quietly weaken the most
// important rule in the codebase: the publication gate. A field silently
// dropped from the Standards list would let a half-verified reference page go
// live, and nothing else in the suite would notice, because every existing
// Standards fixture supplies all nine fields anyway.
//
// So this file pins the guarantee directly. The Standards gate list must be
// byte-identical to PR 5's, the moved fields must still reach Velite's output
// on every Standards page with the same names and required-ness, and the
// shared block must contain only what is genuinely shared.
//
// The assertions read PR 5's list as a LITERAL rather than importing it, which
// is the entire point: importing the thing under test would make the assertion
// vacuous.

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

/** Rule G13's required-field list exactly as PR 5 hardcoded it. Do not edit. */
const PR5_STANDARDS_GATE = [
  "documentStatus",
  "statusConfirmedDate",
  "editionConfirmedDate",
  "lastCheckedDate",
  "licenceConfirmedDate",
  "verifiedBy",
  "officialReference",
  "publisher",
  "officialSourceUrl",
];

/** The three fields PR 6 moved out of the shared block. */
const MOVED_TO_STANDARDS = [
  "documentStatus",
  "withdrawnDate",
  "editionConfirmedDate",
];

describe("Publication gate — the Standards list survives the refactor intact", () => {
  test("PUBLICATION_GATE_FIELDS.standards is byte-identical to PR 5's list", async () => {
    const { PUBLICATION_GATE_FIELDS } = await import("../lib/editorial-rules");
    assert.deepEqual(
      [...PUBLICATION_GATE_FIELDS.standards],
      PR5_STANDARDS_GATE,
      "the Standards publication gate changed. It must not, unless the owner-approved " +
        "policy itself changed — this list is the reason a half-verified reference " +
        "page cannot go live."
    );
  });

  test("the gate list is ordered, not merely set-equal", async () => {
    const { PUBLICATION_GATE_FIELDS } = await import("../lib/editorial-rules");
    assert.equal(PUBLICATION_GATE_FIELDS.standards[0], "documentStatus");
    assert.equal(PUBLICATION_GATE_FIELDS.standards.length, 9);
  });

  test("Legislation has its own list and does not borrow the Standards one", async () => {
    const { PUBLICATION_GATE_FIELDS } = await import("../lib/editorial-rules");
    const leg = PUBLICATION_GATE_FIELDS.legislation;
    assert.ok(Array.isArray(leg));
    assert.ok(!leg.includes("documentStatus"), "legislation must not gate on documentStatus");
    assert.ok(!leg.includes("editionConfirmedDate"), "an instrument has no edition");
    for (const field of [
      "forceStatus",
      "extent",
      "application",
      "sourceTextAsAtDate",
      "outstandingEffectsChecked",
    ]) {
      assert.ok(leg.includes(field), `legislation gate is missing ${field}`);
    }
  });

  test("every collection with a gate list is one the gate actually runs on", async () => {
    const { PUBLICATION_GATE_FIELDS, DOCUMENT_REFERENCE_COLLECTIONS } = await import(
      "../lib/editorial-rules"
    );
    for (const collection of Object.keys(PUBLICATION_GATE_FIELDS)) {
      assert.ok(
        DOCUMENT_REFERENCE_COLLECTIONS.includes(collection),
        `${collection} has a gate list but is not a document-reference collection`
      );
    }
  });
});

describe("documentStatus is now a Standards concept, not a shared one", () => {
  test("usesDocumentStatus is true for standards and false for legislation", async () => {
    const { usesDocumentStatus, DOCUMENT_STATUS_COLLECTIONS } = await import(
      "../lib/editorial-rules"
    );
    assert.equal(usesDocumentStatus("standards"), true);
    assert.equal(usesDocumentStatus("legislation"), false);
    assert.deepEqual([...DOCUMENT_STATUS_COLLECTIONS], ["standards"]);
  });

  test("no legislation item carries documentStatus in Velite's output", async () => {
    const { legislation } = await import("../.velite");
    for (const item of legislation) {
      assert.equal(
        item.documentStatus,
        undefined,
        `${item.slug} carries documentStatus — the BSI vocabulary must not leak into legislation`
      );
      assert.equal(item.withdrawnDate, undefined, `${item.slug} carries withdrawnDate`);
      assert.equal(
        item.editionConfirmedDate,
        undefined,
        `${item.slug} carries editionConfirmedDate`
      );
    }
  });

  test("every legislation item carries forceStatus instead", async () => {
    const { legislation } = await import("../.velite");
    const VALUES = new Set([
      "not-yet-in-force",
      "partially-in-force",
      "in-force",
      "partially-repealed",
      "repealed",
      "revoked",
      "spent",
    ]);
    for (const item of legislation) {
      assert.ok(VALUES.has(item.forceStatus), `${item.slug}: bad forceStatus ${item.forceStatus}`);
    }
  });
});

describe("The moved fields still reach Velite's output on Standards", () => {
  // The `s.mdx().optional()` lesson from PR 4: a field can be declared and
  // still be unpopulated on every item, and nothing warns. Assert the OUTPUT.
  test("all three moved fields are populated on every published standard", async () => {
    const { standards } = await import("../.velite");
    for (const s of standards.filter((x) => x.status === "published")) {
      assert.equal(
        typeof s.documentStatus,
        "string",
        `${s.slug}: documentStatus did not survive the move`
      );
      assert.equal(
        typeof s.editionConfirmedDate,
        "string",
        `${s.slug}: editionConfirmedDate did not survive the move`
      );
    }
  });

  test("withdrawnDate is still available and still optional", async () => {
    const { standards } = await import("../.velite");
    const withdrawn = standards.filter((s) => s.documentStatus === "withdrawn");
    assert.ok(withdrawn.length > 0, "the launch set should still contain a withdrawn document");
    for (const s of withdrawn) {
      assert.equal(typeof s.withdrawnDate, "string", `${s.slug}: withdrawnDate is missing`);
    }
    const current = standards.filter((s) => s.documentStatus === "current");
    for (const s of current) {
      assert.equal(s.withdrawnDate, undefined, `${s.slug}: a current document has a withdrawnDate`);
    }
  });

  test("the moved fields are absent from the shared block's own exports", async () => {
    const mod = await import("../lib/content-schemas");
    const shared = Object.keys(mod.documentReferenceFields);
    for (const field of MOVED_TO_STANDARDS) {
      assert.ok(
        !shared.includes(field),
        `${field} is still in documentReferenceFields — the move did not happen`
      );
    }
  });

  test("the shared block is exactly the five genuinely shared members", async () => {
    const mod = await import("../lib/content-schemas");
    assert.deepEqual(Object.keys(mod.documentReferenceFields).sort(), [
      "licenceConfirmedDate",
      "sourceLicence",
      "statusConfirmedDate",
      "supersededBy",
      "verifiedBy",
    ]);
  });
});

describe("The jurisdiction vocabulary migration is complete on both sides", () => {
  test("uk-wide is gone from the taxonomy and united-kingdom replaces it", async () => {
    const { JURISDICTIONS } = await import("../lib/taxonomy");
    assert.ok(!JURISDICTIONS.includes("uk-wide"), "uk-wide should have been renamed");
    assert.ok(JURISDICTIONS.includes("united-kingdom"));
    assert.ok(JURISDICTIONS.includes("great-britain"), "HSWA 1974's extent needs this");
    assert.ok(JURISDICTIONS.includes("northern-ireland"), "dropped once in PR 6; pinned here");
  });

  test("no content item anywhere still carries the old value", async () => {
    const velite = await import("../.velite");
    for (const [name, items] of Object.entries(velite)) {
      if (!Array.isArray(items)) continue;
      for (const item of items) {
        for (const field of ["jurisdiction", "extent", "application"]) {
          const value = item[field];
          const values = Array.isArray(value) ? value : value ? [value] : [];
          assert.ok(
            !values.includes("uk-wide"),
            `${name}/${item.slug}: ${field} still uses "uk-wide"`
          );
        }
      }
    }
  });

  test("the Glossary term affected by the rename carries the new value", async () => {
    const { glossaryTerms } = await import("../.velite");
    const migrated = glossaryTerms.filter((t) => t.jurisdiction === "united-kingdom");
    assert.ok(
      migrated.length > 0,
      "the rename must have moved at least one Glossary term, or the rollback note is wrong"
    );
  });
});
