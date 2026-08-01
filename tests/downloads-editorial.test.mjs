// R-series editorial rules for Downloads (Phase 5A, PR 8A).
//
// Pure functions over plain data with an injected `now` and an injected
// `sizeOf`, so a fixture written today does not silently expire and the suite
// never touches a filesystem.
//
// The MUST-REMAIN-VALID group is first, and it exists because of what happened
// in PR 7: the first draft of rule N3 rejected every future event-side date,
// which would have made announced-but-not-yet-effective changes and open
// consultations unpublishable — the same defect as PR 6's L10, where the only
// way to satisfy the rule was to write something untrue.
//
// The equivalent trap here is a rule that forces a placeholder file into the
// repository. A resource with no binary at all is legitimate — the migrated
// fire safety checklist is one — and any tightening that breaks that has
// reintroduced the same mistake in a new place.

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  checkDownloadDelivery,
  checkDownloadFileSize,
  checkDownloadClaims,
  checkDownloadVersioning,
  checkDownloadHtmlEquivalent,
} from "../lib/editorial-validation";
import { checkRegistryRelations } from "../lib/content-validation";

const NOW = "2026-07-31";

/** A resource that passes every rule, so each test breaks exactly one thing. */
function item(overrides = {}) {
  return {
    id: "d1",
    slug: "a-checklist",
    status: "published",
    category: "fire-safety",
    tags: ["fire-doors"],
    resourceType: "checklist",
    fileFormat: "pdf",
    fileUrl: "/static/a-checklist-abc123.pdf",
    fileSizeBytes: 240_000,
    additionalFormats: [],
    version: "1.0",
    previousVersions: [],
    changelog: [],
    accessibilityStatus: "checked-accessible",
    licence: "lion-rms-permitted-use",
    thirdPartyMaterial: false,
    printableHtml: false,
    supersededBy: [],
    summary: "A general template for a walk-round check.",
    body: "It does not replace a fire risk assessment.",
    ...overrides,
  };
}

/** The HTML-native shape: no file anywhere, delivery is the page. */
function htmlNative(overrides = {}) {
  return item({
    id: "d2",
    slug: "an-html-resource",
    fileFormat: "html",
    fileUrl: undefined,
    fileSizeBytes: undefined,
    printableHtml: true,
    accessibilityStatus: "html-native",
    ...overrides,
  });
}

const wrap = (...items) => ({ downloads: items });
const sizeOf = (map) => (url) => map[url];

const all = (c, options = {}) => [
  ...checkDownloadDelivery(c),
  ...checkDownloadFileSize(c, options),
  ...checkDownloadClaims(c),
  ...checkDownloadVersioning(c),
  ...checkDownloadHtmlEquivalent(c),
];

const has = (issues, rule) => issues.some((i) => i.rule === rule);
const only = (issues, rule) => issues.filter((i) => i.rule === rule);

describe("The baseline fixtures are genuinely clean", () => {
  test("a published file-backed resource produces nothing", () => {
    const i = item();
    const opts = { now: NOW, sizeOf: sizeOf({ [i.fileUrl]: i.fileSizeBytes }) };
    // R11 warns on a file-only resource with no stated reason, which is the
    // correct behaviour — so the baseline states one.
    assert.deepEqual(all(wrap(item({ accessibilityNotes: "Print-first by design." })), opts), []);
  });

  test("a published HTML-native resource produces nothing", () => {
    assert.deepEqual(all(wrap(htmlNative()), { now: NOW }), []);
  });
});

describe("MUST REMAIN VALID — states no rule may reject", () => {
  test("a resource with no file at all, delivered as a printable page", () => {
    // The migrated fire safety checklist. If this ever fails, a rule has
    // started demanding a placeholder binary, which is the PR 7 mistake in a
    // new costume.
    assert.deepEqual(all(wrap(htmlNative()), { now: NOW }), []);
  });

  test("a PDF-only resource where HTML would be a poor imitation", () => {
    const i = item({
      resourceType: "logbook",
      accessibilityNotes: "A compiled logbook; the printed layout is the artefact.",
    });
    assert.deepEqual(all(wrap(i), { now: NOW, sizeOf: sizeOf({ [i.fileUrl]: i.fileSizeBytes }) }), []);
  });

  test("a withdrawn resource with no replacement at all", () => {
    const i = item({
      status: "archived",
      withdrawnDate: "2026-05-01",
      withdrawalReason: "The duty it recorded no longer exists.",
      supersededBy: [],
    });
    assert.deepEqual(all(wrap(i), { now: NOW, sizeOf: sizeOf({ [i.fileUrl]: i.fileSizeBytes }) }), []);
  });

  test("a v1.0 resource with an empty previousVersions and empty changelog", () => {
    assert.deepEqual(all(wrap(htmlNative({ version: "1.0", previousVersions: [], changelog: [] })), { now: NOW }), []);
  });

  test("a resource offering three formats from one landing page", () => {
    const i = item({
      resourceType: "record-form",
      fileFormat: "pdf",
      additionalFormats: [
        { format: "xlsx", fileUrl: "/static/x-1.xlsx", fileSizeBytes: 30_000 },
        { format: "docx", fileUrl: "/static/x-2.docx", fileSizeBytes: 40_000 },
      ],
      accessibilityNotes: "Print-first by design.",
    });
    const opts = {
      now: NOW,
      sizeOf: sizeOf({
        [i.fileUrl]: i.fileSizeBytes,
        "/static/x-1.xlsx": 30_000,
        "/static/x-2.docx": 40_000,
      }),
    };
    assert.deepEqual(all(wrap(i), opts), []);
  });

  test("a resource whose review date is years old but whose duty has not changed", () => {
    // Downloads carry a 12-month review cycle, enforced by the B-series rules.
    // No R rule may add a second, stricter opinion about age.
    const i = htmlNative({ reviewedDate: "2019-01-01" });
    assert.deepEqual(all(wrap(i), { now: NOW }), []);
  });

  test("a large file that is under the ceiling warns but never blocks", () => {
    const i = item({ fileSizeBytes: 11 * 1024 * 1024, accessibilityNotes: "Scanned original." });
    const issues = all(wrap(i), { now: NOW, sizeOf: sizeOf({ [i.fileUrl]: i.fileSizeBytes }) });
    assert.ok(has(issues, "R13"));
    for (const x of only(issues, "R13")) assert.equal(x.severity, "warning");
  });
});

describe("R1 — every published resource offers a way to obtain it", () => {
  test("neither a file nor a printable page is an error", () => {
    const issues = all(wrap(htmlNative({ printableHtml: false })), { now: NOW });
    assert.ok(has(issues, "R1"));
    assert.match(only(issues, "R1")[0].message, /no way to obtain it/);
  });

  test("a draft with neither is not gated", () => {
    const i = htmlNative({ status: "draft", printableHtml: false });
    assert.equal(has(all(wrap(i), { now: NOW }), "R1"), false);
  });

  test("a file alone satisfies it", () => {
    const i = item({ printableHtml: false, accessibilityNotes: "Print-first." });
    assert.equal(
      has(all(wrap(i), { now: NOW, sizeOf: sizeOf({ [i.fileUrl]: i.fileSizeBytes }) }), "R1"),
      false
    );
  });
});

describe("R3, R4 — format must suit the resource and match the file", () => {
  test("a logbook offered as DOCX is rejected", () => {
    const i = item({ resourceType: "logbook", fileFormat: "docx", fileUrl: "/static/x.docx" });
    assert.ok(has(all(wrap(i), { now: NOW }), "R3"));
  });

  test("a record form offered as XLSX is accepted", () => {
    const i = item({
      resourceType: "record-form",
      fileFormat: "xlsx",
      fileUrl: "/static/x.xlsx",
      accessibilityNotes: "Spreadsheet.",
    });
    assert.equal(has(all(wrap(i), { now: NOW, sizeOf: sizeOf({ "/static/x.xlsx": 240_000 }) }), "R3"), false);
  });

  test("a declared format the extension contradicts is an error", () => {
    const i = item({ fileFormat: "pdf", fileUrl: "/static/actually-a-word-file.docx" });
    const issues = all(wrap(i), { now: NOW });
    assert.ok(has(issues, "R4"));
    assert.match(only(issues, "R4")[0].message, /does not end in \.pdf/);
  });

  test("declaring html while also carrying a file is an error", () => {
    const i = htmlNative({ fileUrl: "/static/x.pdf", fileSizeBytes: 100 });
    assert.ok(has(all(wrap(i), { now: NOW }), "R4"));
  });
});

describe("R5 — the recorded size is verified, not trusted", () => {
  test("a size that disagrees with the emitted file is an error", () => {
    const i = item({ fileSizeBytes: 240_000, accessibilityNotes: "x" });
    const issues = all(wrap(i), { now: NOW, sizeOf: sizeOf({ [i.fileUrl]: 999_999 }) });
    assert.ok(has(issues, "R5"));
    assert.match(only(issues, "R5")[0].message, /but the emitted file is 999999 bytes/);
  });

  test("a file that is not on disk at all is an error", () => {
    const i = item({ accessibilityNotes: "x" });
    const issues = all(wrap(i), { now: NOW, sizeOf: sizeOf({}) });
    assert.ok(has(issues, "R5"));
    assert.match(only(issues, "R5")[0].message, /could not be found on disk/);
  });

  test("a file with no recorded size at all is an error", () => {
    const i = item({ fileSizeBytes: undefined, accessibilityNotes: "x" });
    assert.ok(has(all(wrap(i), { now: NOW }), "R5"));
  });

  test("additional formats are checked too, not just the primary", () => {
    const i = item({
      resourceType: "record-form",
      additionalFormats: [{ format: "xlsx", fileUrl: "/static/x.xlsx", fileSizeBytes: 10 }],
      accessibilityNotes: "x",
    });
    const issues = all(wrap(i), {
      now: NOW,
      sizeOf: sizeOf({ [i.fileUrl]: i.fileSizeBytes, "/static/x.xlsx": 5000 }),
    });
    assert.ok(has(issues, "R5"));
  });

  test("without an injected sizeOf, nothing is asserted about disk", () => {
    // Unit tests and the fixture harness run with no filesystem view. The rule
    // must degrade to checking only what it can see, never to inventing a
    // failure it cannot substantiate.
    const i = item({ accessibilityNotes: "x" });
    assert.equal(has(all(wrap(i), { now: NOW }), "R5"), false);
  });
});

describe("R6, R7, R12, R15 — claims we must have checked", () => {
  test("publishing an unchecked document is an error", () => {
    const i = htmlNative({ accessibilityStatus: "unchecked" });
    assert.ok(has(all(wrap(i), { now: NOW }), "R6"));
  });

  test("a stated limitation with nothing stated is an error", () => {
    const i = htmlNative({ accessibilityStatus: "checked-limitations" });
    assert.ok(has(all(wrap(i), { now: NOW }), "R6"));
  });

  test("a stated limitation with a note is accepted", () => {
    const i = htmlNative({
      accessibilityStatus: "checked-limitations",
      accessibilityNotes: "The signature block is an image with no text alternative.",
    });
    assert.equal(has(all(wrap(i), { now: NOW }), "R6"), false);
  });

  test("a draft may be unchecked", () => {
    const i = htmlNative({ status: "draft", accessibilityStatus: "unchecked" });
    assert.equal(has(all(wrap(i), { now: NOW }), "R6"), false);
  });

  test("publishing without a licence is an error", () => {
    const i = htmlNative({ licence: undefined });
    assert.ok(has(all(wrap(i), { now: NOW }), "R7"));
  });

  test("third-party material without attribution is an error", () => {
    const i = htmlNative({ thirdPartyMaterial: true });
    assert.ok(has(all(wrap(i), { now: NOW }), "R12"));
  });

  test("third-party material with attribution is accepted", () => {
    const i = htmlNative({
      thirdPartyMaterial: true,
      thirdPartyAttribution: "Contains public sector information licensed under the Open Government Licence v3.0.",
    });
    assert.equal(has(all(wrap(i), { now: NOW }), "R12"), false);
  });

  test("a published resource that never says it is a template is an error", () => {
    const i = htmlNative({ summary: "A checklist.", body: "Some prose about fire doors." });
    const issues = all(wrap(i), { now: NOW });
    assert.ok(has(issues, "R15"));
    assert.match(only(issues, "R15")[0].message, /general template/);
  });

  test("any one of the accepted phrasings satisfies R15", () => {
    for (const body of [
      "This is a general template.",
      "Adapt it to your premises before use.",
      "It does not replace a fire risk assessment.",
      "This is not a substitute for professional advice.",
    ]) {
      const i = htmlNative({ summary: "A checklist.", body });
      assert.equal(has(all(wrap(i), { now: NOW }), "R15"), false, `not cleared by: ${body}`);
    }
  });
});

describe("R2, R8, R9, R14 — versions and withdrawal", () => {
  test("a version number used twice is an error", () => {
    const i = htmlNative({
      version: "1.0",
      previousVersions: [{ version: "1.0", fileUrl: "/static/x.pdf", supersededDate: "2026-01-01" }],
      changelog: [{ date: "2026-01-01", summary: "x" }],
    });
    assert.ok(has(all(wrap(i), { now: NOW }), "R2"));
  });

  test("a superseded version with an empty changelog is an error, not a warning", () => {
    const i = htmlNative({
      version: "2.0",
      previousVersions: [{ version: "1.0", fileUrl: "/static/x.pdf", supersededDate: "2026-01-01" }],
      changelog: [],
    });
    const issues = all(wrap(i), { now: NOW });
    assert.ok(has(issues, "R8"));
    assert.equal(only(issues, "R8")[0].severity, "error");
  });

  test("fewer changelog entries than versions warns", () => {
    const i = htmlNative({
      version: "3.0",
      previousVersions: [
        { version: "1.0", fileUrl: "/static/a.pdf", supersededDate: "2026-01-01" },
        { version: "2.0", fileUrl: "/static/b.pdf", supersededDate: "2026-03-01" },
      ],
      changelog: [{ date: "2026-03-01", summary: "x" }],
    });
    const issues = all(wrap(i), { now: NOW });
    assert.ok(has(issues, "R8"));
    assert.equal(only(issues, "R8")[0].severity, "warning");
  });

  test("an archived resource must say when and why", () => {
    const i = htmlNative({ status: "archived" });
    const issues = all(wrap(i), { now: NOW });
    assert.equal(only(issues, "R9").length, 2);
  });

  test("withdrawal details on a live resource warn", () => {
    const i = htmlNative({ withdrawnDate: "2026-05-01" });
    const issues = all(wrap(i), { now: NOW });
    assert.ok(has(issues, "R9"));
    assert.equal(only(issues, "R9")[0].severity, "warning");
  });

  test("a resource cannot supersede itself", () => {
    const i = htmlNative({ supersededBy: ["an-html-resource"] });
    assert.ok(has(all(wrap(i), { now: NOW }), "R14"));
  });

  test("a bare version string is not a slug", () => {
    for (const slug of ["1.0", "v2", "2026", "1-0"]) {
      const i = htmlNative({ slug });
      assert.ok(has(all(wrap(i), { now: NOW }), "R14"), `${slug} should be rejected`);
    }
  });

  test("a slug merely containing a number is fine", () => {
    const i = htmlNative({ slug: "bs-5839-1-weekly-test-record" });
    assert.equal(has(all(wrap(i), { now: NOW }), "R14"), false);
  });
});

describe("R11 — a file-only resource with no stated reason", () => {
  test("warns rather than blocks", () => {
    const i = item();
    const issues = all(wrap(i), { now: NOW, sizeOf: sizeOf({ [i.fileUrl]: i.fileSizeBytes }) });
    assert.ok(has(issues, "R11"));
    assert.equal(only(issues, "R11")[0].severity, "warning");
  });

  test("a stated reason clears it", () => {
    const i = item({ accessibilityNotes: "A compiled logbook; the printed layout is the artefact." });
    assert.equal(
      has(all(wrap(i), { now: NOW, sizeOf: sizeOf({ [i.fileUrl]: i.fileSizeBytes }) }), "R11"),
      false
    );
  });

  test("a printable page clears it", () => {
    assert.equal(has(all(wrap(htmlNative()), { now: NOW }), "R11"), false);
  });
});

describe("G18 — service and sector slugs are validated, not silently dropped", () => {
  test("an unknown service slug is an error", () => {
    const issues = checkRegistryRelations(wrap(item({ relatedServices: ["fire-saftey"] })));
    assert.equal(issues.length, 1);
    assert.equal(issues[0].rule, "G18");
    assert.match(issues[0].message, /not a known service category/);
    assert.match(issues[0].message, /silently dropped/);
  });

  test("an unknown sector slug is an error", () => {
    const issues = checkRegistryRelations(wrap(item({ relatedSectors: ["resedential-blocks"] })));
    assert.equal(issues.length, 1);
    assert.equal(issues[0].rule, "G18");
  });

  test("known slugs pass", () => {
    const i = item({
      relatedServices: ["fire-safety", "health-safety"],
      relatedSectors: ["residential-blocks-hmos"],
    });
    assert.deepEqual(checkRegistryRelations(wrap(i)), []);
  });

  test("it applies to every collection, not only downloads", () => {
    const issues = checkRegistryRelations({
      guides: [{ id: "g", slug: "g", relatedServices: ["nope"] }],
    });
    assert.equal(issues.length, 1);
    assert.equal(issues[0].collection, "guides");
  });

  test("an empty relation array is not an error", () => {
    assert.deepEqual(checkRegistryRelations(wrap(item({ relatedServices: [] }))), []);
  });
});

describe("The real content passes every R rule", () => {
  test("the migrated checklist produces no R-series error or warning", async () => {
    const { downloads, guides, standards, legislation, glossaryTerms, news } = await import(
      "../.velite"
    );
    const c = { downloads, guides, standards, legislation, glossaryTerms, news };
    assert.deepEqual(
      all(c, {}).map((i) => `${i.rule} ${i.slug}: ${i.message}`),
      []
    );
  });

  test("no published content anywhere has an unknown service or sector slug", async () => {
    const { downloads, guides, standards, legislation, glossaryTerms, news } = await import(
      "../.velite"
    );
    const c = { downloads, guides, standards, legislation, glossaryTerms, news };
    assert.deepEqual(checkRegistryRelations(c), []);
  });
});
