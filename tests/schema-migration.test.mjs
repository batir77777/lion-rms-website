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
import fs from "node:fs";
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

// ---------------------------------------------------------------------------
// The News migration guarantee (Phase 5A, PR 7).
//
// PR 7 removed `sourceType` — a live enum with fixtures against it — and split
// it into `newsFormat` and `newsCategory`. Removing a field is the change most
// likely to weaken a rule silently: a check that read `sourceType` and now
// reads nothing would still pass every test that never asserted on it.
//
// These assertions pin that no rule lost its grip, and that the split actually
// achieved the thing it was for.
// ---------------------------------------------------------------------------

describe("News: the sourceType split weakened nothing", () => {
  test("sourceType is gone from the schema, the fixtures and the output", async () => {
    const mod = await import("../lib/content-schemas");
    const { news } = await import("../.velite");
    assert.ok(
      !Object.keys(mod.newsArticleSchema.shape ?? {}).includes("sourceType"),
      "sourceType is still declared on the news schema"
    );
    for (const i of news) {
      assert.equal(i.sourceType, undefined, `${i.slug} still carries sourceType`);
    }
  });

  test("both replacement axes are required, not optional", async () => {
    // If either were optional, an item could publish classified on neither
    // axis — strictly worse than the single field it replaced.
    const { news } = await import("../.velite");
    for (const i of news) {
      assert.equal(typeof i.newsFormat, "string", `${i.slug}: newsFormat missing`);
      assert.equal(typeof i.newsCategory, "string", `${i.slug}: newsCategory missing`);
    }
  });

  test("the axes are genuinely orthogonal in real content", async () => {
    // The defect being fixed was that monthly-roundup and the six subjects
    // could not co-exist. If no round-up carries a category that also appears
    // on a single item, the split has not been exercised.
    const { news } = await import("../.velite");
    const roundUpCategories = new Set(
      news.filter((i) => i.newsFormat === "monthly-roundup").map((i) => i.newsCategory)
    );
    const singleCategories = new Set(
      news.filter((i) => i.newsFormat === "single-item").map((i) => i.newsCategory)
    );
    const shared = [...roundUpCategories].filter((c) => singleCategories.has(c));
    assert.ok(
      shared.length > 0,
      "no category appears in both formats — the orthogonality is untested by content"
    );
  });

  test("prosecution survives as its own category, not folded into enforcement", async () => {
    const { NEWS_CATEGORY_DATES } = await import("../lib/editorial-rules");
    assert.ok(NEWS_CATEGORY_DATES.prosecution, "prosecution lost its own date spec");
    assert.ok(NEWS_CATEGORY_DATES.enforcement, "enforcement lost its own date spec");
    const { news } = await import("../.velite");
    assert.ok(
      news.some((i) => i.newsCategory === "prosecution"),
      "no content exercises the prosecution category"
    );
  });

  test("the news publication gate covers what sourceType never did", async () => {
    const { NEWS_PUBLICATION_GATE_FIELDS } = await import("../lib/editorial-rules");
    for (const field of ["newsFormat", "newsCategory", "sourceOrganisation", "sourceCheckedDate"]) {
      assert.ok(
        NEWS_PUBLICATION_GATE_FIELDS.includes(field),
        `${field} is not gated at publication`
      );
    }
  });

  test("news still carries no review cycle, and no staleness rule crept in", async () => {
    const { reviewCycleMonths } = await import("../lib/editorial-rules");
    assert.equal(reviewCycleMonths("news"), null);
    const src = fs.readFileSync(path.join(repoRoot, "lib/editorial-validation.ts"), "utf8");
    const fn = src.slice(src.indexOf("export function checkSourceCurrency"));
    const body = fn.slice(0, fn.indexOf("\n}"));
    assert.ok(
      !/["']news["']/.test(body),
      "checkSourceCurrency now covers news — that would age a dated report of a past event"
    );
  });

  test("relatedNews is registered as a real relation target", async () => {
    const src = fs.readFileSync(path.join(repoRoot, "lib/content-validation.ts"), "utf8");
    assert.match(src, /relatedNews: "news"/);
  });

  test("the tag registry has grown only by approved additions", async () => {
    // A ratchet on registry size, not on this PR's four tags alone. It fired as
    // designed when F2 added `safety-management-systems` and
    // `workplace-inspections`, which is the whole point: the count moves only
    // when someone deliberately edits this number alongside the registry.
    //
    // 10 at PR 3  →  14 at PR 6 (the four below)  →  16 at F2 (the two below)
    // →  17 at PR 8 (coshh-hazardous-substances, added once PR 8's own COSHH
    // standard and legislation entries gave the previously F2-rejected tag a
    // genuine, non-thin body of content to describe — see the comment in
    // lib/taxonomy.ts immediately above that entry for the full reasoning).
    const { CONTENT_TAG_SLUGS } = await import("../lib/taxonomy");
    for (const slug of ["sprinklers-suppression", "external-wall-systems", "smoke-control", "asbestos"]) {
      assert.ok(CONTENT_TAG_SLUGS.includes(slug), `${slug} missing from the registry`);
    }
    for (const slug of ["safety-management-systems", "workplace-inspections"]) {
      assert.ok(CONTENT_TAG_SLUGS.includes(slug), `${slug} missing from the registry`);
    }
    assert.ok(CONTENT_TAG_SLUGS.includes("coshh-hazardous-substances"), "coshh-hazardous-substances missing from the registry");
    assert.equal(CONTENT_TAG_SLUGS.length, 17, "the registry grew beyond the approved tags");
  });
});
