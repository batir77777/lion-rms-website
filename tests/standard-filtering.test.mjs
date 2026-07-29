// Standards listing filter logic (Phase 5A, PR 5).
//
// This file exists for one branch in particular.
//
// The listing has two independent filter axes, and two axes can produce a
// combination that matches nothing — which one axis cannot. With the eight
// launch documents that combination does not exist: every document class
// contains at least one current document, so clicking through the real site
// can never reach the empty state. It is implemented, and it was unobservable.
//
// Adding a ninth document purely to make it reachable would be inventing
// content to satisfy a test, which is worse than the gap. So the decision
// logic was extracted into lib/standard-filtering.ts as pure functions, and
// the empty case is exercised here against a constructed dataset. The
// component renders exactly what these functions decide.

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  applyStandardFilters,
  describeFilters,
  announceResults,
  NO_FILTERS,
} from "../lib/standard-filtering";

const doc = (slug, documentClass, isCurrent) => ({ slug, documentClass, isCurrent });

/** Mirrors the shape of the eight launch documents. */
const LAUNCH = [
  doc("bs-9792", "british-standard", true),
  doc("bs-9999", "british-standard", true),
  doc("bs-9991", "british-standard", true),
  doc("bs-5839-1", "british-standard", true),
  doc("pas-79-1", "pas", true),
  doc("pas-79-2", "pas", false),
  doc("adb", "statutory-guidance", true),
  doc("hsg65", "regulator-guidance", true),
];

describe("Filtering — the launch dataset", () => {
  test("no filters shows everything, withdrawn documents included", () => {
    const visible = applyStandardFilters(LAUNCH, NO_FILTERS);
    assert.equal(visible.length, 8);
    assert.ok(visible.some((d) => !d.isCurrent), "a withdrawn document must be visible by default");
  });

  test("the currency axis defaults to showing everything, not to hiding the withdrawn", () => {
    // The important product decision in this component. A reader looking up a
    // document cited in an old assessment must find it AND find out it has
    // been withdrawn.
    assert.equal(NO_FILTERS.currentOnly, false);
  });

  test("filtering by class narrows to that class only", () => {
    const visible = applyStandardFilters(LAUNCH, {
      documentClass: "british-standard",
      currentOnly: false,
    });
    assert.equal(visible.length, 4);
    assert.ok(visible.every((d) => d.documentClass === "british-standard"));
  });

  test("current-only drops the withdrawn document and nothing else", () => {
    const visible = applyStandardFilters(LAUNCH, { documentClass: null, currentOnly: true });
    assert.equal(visible.length, 7);
    assert.ok(!visible.some((d) => d.slug === "pas-79-2"));
  });

  test("the two axes combine conjunctively", () => {
    const visible = applyStandardFilters(LAUNCH, {
      documentClass: "pas",
      currentOnly: true,
    });
    assert.deepEqual(visible.map((d) => d.slug), ["pas-79-1"]);
  });

  test("no combination of the launch eight produces an empty result", () => {
    // Pins the reason the empty state is unreachable today. If a future launch
    // set makes it reachable, this fails and the manual check becomes possible
    // again — which is information worth having, not a test to delete.
    const classes = [...new Set(LAUNCH.map((d) => d.documentClass))];
    for (const documentClass of [null, ...classes]) {
      for (const currentOnly of [false, true]) {
        const n = applyStandardFilters(LAUNCH, { documentClass, currentOnly }).length;
        assert.ok(n > 0, `${documentClass ?? "all"} / currentOnly=${currentOnly} gave 0`);
      }
    }
  });
});

describe("Filtering — the empty state, covered deterministically", () => {
  // A dataset where one class contains ONLY withdrawn documents. This is not
  // hypothetical: it is what the library looks like the day a whole class of
  // guidance is superseded, which is exactly when a reader is most likely to be
  // filtering.
  const WITH_A_FULLY_WITHDRAWN_CLASS = [
    doc("bs-a", "british-standard", true),
    doc("pas-old-1", "pas", false),
    doc("pas-old-2", "pas", false),
  ];

  test("a class containing only withdrawn documents plus current-only gives nothing", () => {
    const visible = applyStandardFilters(WITH_A_FULLY_WITHDRAWN_CLASS, {
      documentClass: "pas",
      currentOnly: true,
    });
    assert.deepEqual(visible, []);
  });

  test("the empty result still names the combination that produced it", () => {
    // The accessibility requirement. A reader who filters into an empty page —
    // and a screen-reader user especially — must be told WHICH combination
    // produced no results, not merely that there are none.
    const description = describeFilters(
      { documentClass: "pas", currentOnly: true },
      "Publicly Available Specifications"
    );
    assert.equal(description, "Publicly Available Specifications, current documents only");
    assert.equal(
      announceResults(0, description),
      "Showing 0 documents: Publicly Available Specifications, current documents only."
    );
  });

  test("an empty library is handled as well as an empty filter result", () => {
    assert.deepEqual(applyStandardFilters([], NO_FILTERS), []);
    assert.equal(announceResults(0, null), "Showing all 0 documents.");
  });

  test("a class that does not exist in the dataset yields nothing rather than everything", () => {
    // The failure mode worth guarding: a filter that silently falls back to
    // "show all" would be worse than an empty state, because it looks correct.
    const visible = applyStandardFilters(LAUNCH, {
      documentClass: "industry-guidance",
      currentOnly: false,
    });
    assert.deepEqual(visible, []);
  });
});

describe("Filtering — the announcement text", () => {
  test("describes both axes, one axis, or neither", () => {
    assert.equal(describeFilters({ documentClass: null, currentOnly: false }, null), null);
    assert.equal(
      describeFilters({ documentClass: null, currentOnly: true }, null),
      "current documents only"
    );
    assert.equal(
      describeFilters({ documentClass: "pas", currentOnly: false }, "PAS documents"),
      "PAS documents"
    );
    assert.equal(
      describeFilters({ documentClass: "pas", currentOnly: true }, "PAS documents"),
      "PAS documents, current documents only"
    );
  });

  test("the singular is used for exactly one result", () => {
    assert.equal(announceResults(1, null), "Showing all 1 document.");
    assert.equal(announceResults(1, "PAS documents"), "Showing 1 document: PAS documents.");
    assert.equal(announceResults(2, null), "Showing all 2 documents.");
  });
});

describe("Filtering — the component delegates rather than duplicating", () => {
  test("StandardFilter uses the pure module and holds no second implementation", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("components/StandardFilter.tsx", "utf8");
    assert.match(src, /applyStandardFilters/);
    assert.match(src, /describeFilters/);
    assert.match(src, /announceResults/);
    // If the component reimplemented the predicate inline, these tests would
    // be covering something the page does not actually run.
    assert.ok(
      !src.includes("const describeFilters = () =>"),
      "the component must not carry its own copy of the description logic"
    );
  });

  test("the empty branch and its recovery affordance are still rendered", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("components/StandardFilter.tsx", "utf8");
    assert.match(src, /visible\.length === 0/);
    assert.match(src, /No documents match/);
    assert.match(src, /Show all documents/);
  });
});
