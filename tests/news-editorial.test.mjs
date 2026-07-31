// N-series editorial rules for News (Phase 5A, PR 7).
//
// Pure functions over plain data with an injected `now`, so a fixture written
// today does not silently expire and turn the suite red next year.
//
// The MUST-REMAIN-VALID group is first, and one case in it matters more than
// the rest: a change announced ahead of commencement, and a consultation still
// open, both carry a FUTURE date. The first draft of rule N3 rejected exactly
// those, which would have made the most useful items in this library
// unpublishable — the same defect as PR 6's rule L10, where the only way to
// satisfy the rule was to write something untrue. If a future tightening
// reintroduces it, these tests fail.

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  checkNewsDates,
  checkNewsSource,
  checkNewsImmutability,
  checkNewsSlugShape,
  checkGovernance,
  checkTags,
} from "../lib/editorial-validation";
import {
  NEWS_CATEGORY_DATES,
  NEWS_DATE_FIELDS,
  NEWS_PUBLICATION_GATE_FIELDS,
  tagsExpected,
} from "../lib/editorial-rules";

const NOW = "2026-07-31";

/** A news item that passes every rule, so each test breaks exactly one thing. */
function item(overrides = {}) {
  return {
    id: "n1",
    slug: "an-item",
    status: "published",
    category: "fire-safety",
    tags: ["fire-doors"],
    newsFormat: "single-item",
    newsCategory: "enforcement",
    eventDate: "2026-05-01",
    sourceUrl: "https://press.hse.gov.uk/x",
    sourceOrganisation: "Health and Safety Executive",
    sourceCheckedDate: "2026-07-01",
    sourcePubliclyAccessible: true,
    immutable: false,
    changelog: [],
    body: "Plain reporting.",
    ...overrides,
  };
}

function roundUp(overrides = {}) {
  return item({
    id: "r1",
    slug: "a-round-up",
    newsFormat: "monthly-roundup",
    newsCategory: "regulatory-change",
    eventDate: undefined,
    immutable: true,
    ...overrides,
  });
}

const wrap = (...items) => ({ news: items });
const all = (c, options = { now: NOW }) => [
  ...checkNewsDates(c, options),
  ...checkNewsSource(c, options),
  ...checkNewsImmutability(c),
  ...checkNewsSlugShape(c),
];
const has = (issues, rule) => issues.some((i) => i.rule === rule);
const only = (issues, rule) => issues.filter((i) => i.rule === rule);

describe("N — the baseline fixtures are genuinely clean", () => {
  test("a published single item produces nothing from any N rule", () => {
    assert.deepEqual(all(wrap(item())), []);
  });

  test("a published round-up produces nothing either", () => {
    assert.deepEqual(all(wrap(roundUp())), []);
  });
});

describe("MUST REMAIN VALID — states no rule may reject", () => {
  test("a change announced ahead of commencement, with a future effectiveDate", () => {
    const i = item({
      newsCategory: "regulatory-change",
      eventDate: "2024-09-02",
      effectiveDate: "2026-09-30",
    });
    assert.deepEqual(all(wrap(i)), []);
  });

  test("a consultation still open, with a future closing date", () => {
    const i = item({
      newsCategory: "consultation",
      eventDate: "2026-06-01",
      consultationClosesDate: "2026-12-31",
    });
    assert.deepEqual(all(wrap(i)), []);
  });

  test("a consultation that has already closed", () => {
    const i = item({
      newsCategory: "consultation",
      eventDate: "2026-03-25",
      consultationClosesDate: "2026-07-01",
    });
    assert.deepEqual(all(wrap(i)), []);
  });

  test("an item reporting an event years before publication", () => {
    const i = item({ newsCategory: "prosecution", eventDate: "2019-04-01" });
    assert.deepEqual(all(wrap(i)), []);
  });

  test("a correctly corrected round-up", () => {
    const i = roundUp({
      publishedDate: "2026-01-01",
      updatedDate: "2026-02-01",
      correctionNote: "Corrected the commencement date, which was given as April.",
      changelog: [{ date: "2026-02-01", summary: "Commencement date corrected." }],
    });
    assert.deepEqual(all(wrap(i)), []);
    assert.deepEqual(checkGovernance(wrap(i), { now: NOW }), []);
  });

  test("a source that is not publicly accessible, with the body saying so", () => {
    const i = item({
      sourcePubliclyAccessible: false,
      body: "The notice itself sits behind a subscription paywall.",
    });
    assert.deepEqual(all(wrap(i)), []);
  });

  test("a round-up carrying a category as well as its format", () => {
    // The whole point of the split: a round-up CONTAINS subjects, so it must be
    // able to carry one. A model that forced format and category to compete
    // would be the defect this replaced.
    const i = roundUp({ newsCategory: "enforcement" });
    assert.deepEqual(all(wrap(i)), []);
  });
});

describe("N1 — the date each category cannot do without", () => {
  test("the map covers every category", () => {
    for (const category of [
      "enforcement",
      "prosecution",
      "consultation",
      "standards-update",
      "product-recall",
      "government-guidance",
      "regulatory-change",
    ]) {
      assert.ok(NEWS_CATEGORY_DATES[category], `${category} has no date spec`);
      assert.ok(NEWS_CATEGORY_DATES[category].required.length > 0, category);
    }
  });

  test("every required date is genuinely required", () => {
    for (const [category, spec] of Object.entries(NEWS_CATEGORY_DATES)) {
      for (const field of spec.required) {
        const base = { newsCategory: category };
        for (const f of NEWS_DATE_FIELDS) base[f] = undefined;
        for (const f of spec.required) if (f !== field) base[f] = "2026-05-01";
        const issues = all(wrap(item(base)));
        assert.ok(has(issues, "N1"), `${category} did not require ${field}`);
      }
    }
  });

  test("enforcement without an event date is an error", () => {
    assert.ok(has(all(wrap(item({ eventDate: undefined }))), "N1"));
  });

  test("consultation without a closing date is an error", () => {
    const i = item({ newsCategory: "consultation", eventDate: "2026-05-01" });
    assert.ok(has(all(wrap(i)), "N1"));
  });
});

describe("N2 — a date that does not apply to the category", () => {
  test("an effectiveDate on a prosecution is a warning", () => {
    const i = item({ newsCategory: "prosecution", effectiveDate: "2026-05-01" });
    const issues = all(wrap(i));
    assert.ok(has(issues, "N2"));
    assert.equal(only(issues, "N2")[0].severity, "warning");
  });

  test("a consultationClosesDate on an enforcement item is a warning", () => {
    const i = item({ consultationClosesDate: "2026-12-01" });
    assert.ok(has(all(wrap(i)), "N2"));
  });

  test("a round-up carrying any event-side date is a warning", () => {
    for (const field of NEWS_DATE_FIELDS) {
      const i = roundUp({ [field]: "2026-05-01" });
      assert.ok(has(all(wrap(i)), "N2"), `${field} on a round-up should warn`);
    }
  });

  test("an optional date the category does permit is accepted", () => {
    const i = item({
      newsCategory: "government-guidance",
      eventDate: "2026-04-06",
      effectiveDate: "2026-04-06",
    });
    assert.equal(has(all(wrap(i)), "N2"), false);
  });
});

describe("N3 — only eventDate is checked for being in the future", () => {
  test("a future eventDate is an error", () => {
    const issues = all(wrap(item({ eventDate: "2027-01-01" })));
    assert.ok(has(issues, "N3"));
    assert.match(only(issues, "N3")[0].message, /cannot report something that has not happened/);
  });

  test("a future effectiveDate is NOT an error", () => {
    const i = item({ newsCategory: "regulatory-change", eventDate: undefined, effectiveDate: "2027-01-01" });
    assert.equal(has(all(wrap(i)), "N3"), false);
  });

  test("a future consultationClosesDate is NOT an error", () => {
    const i = item({ newsCategory: "consultation", eventDate: undefined, consultationClosesDate: "2027-01-01" });
    assert.equal(has(all(wrap(i)), "N3"), false);
  });

  test("an eventDate today is accepted", () => {
    assert.equal(has(all(wrap(item({ eventDate: NOW }))), "N3"), false);
  });
});

describe("N4-N6 — source attribution", () => {
  test("every field on the gate is genuinely required", () => {
    for (const field of NEWS_PUBLICATION_GATE_FIELDS) {
      const issues = all(wrap(item({ [field]: undefined })));
      assert.ok(has(issues, "N4"), `removing ${field} did not fail the gate`);
    }
  });

  test("a draft is not gated", () => {
    const i = item({ status: "draft", sourceOrganisation: undefined });
    assert.equal(has(all(wrap(i)), "N4"), false);
  });

  test("a future sourceCheckedDate is an error even on a draft", () => {
    const i = item({ status: "draft", sourceCheckedDate: "2027-01-01" });
    assert.ok(has(all(wrap(i)), "N6"));
  });

  test("there is NO staleness window on sourceCheckedDate", () => {
    // News carries no review cycle by design: a dated report of a past
    // prosecution does not go stale the way a live standard does. A check date
    // years old must not warn.
    const i = item({ sourceCheckedDate: "2019-01-01" });
    assert.deepEqual(all(wrap(i)), []);
  });

  test("an inaccessible source unexplained in the body is a warning", () => {
    const issues = all(wrap(item({ sourcePubliclyAccessible: false })));
    assert.ok(has(issues, "N5"));
    assert.equal(only(issues, "N5")[0].severity, "warning");
  });

  test("any of the accepted explanations clears N5", () => {
    for (const body of [
      "The report is behind a paywall.",
      "Access requires a subscription.",
      "The notice is not publicly available.",
      "The page has been withdrawn from the regulator's site.",
    ]) {
      const i = item({ sourcePubliclyAccessible: false, body });
      assert.equal(has(all(wrap(i)), "N5"), false, `not cleared by: ${body}`);
    }
  });
});

describe("N7-N8 — immutability and corrections", () => {
  test("a round-up not marked immutable is an error", () => {
    assert.ok(has(all(wrap(roundUp({ immutable: false }))), "N7"));
  });

  test("a single item is never required to be immutable", () => {
    assert.equal(has(all(wrap(item({ immutable: false }))), "N7"), false);
  });

  test("a corrected round-up with no correctionNote is an error", () => {
    const i = roundUp({
      publishedDate: "2026-01-01",
      updatedDate: "2026-02-01",
      changelog: [{ date: "2026-02-01", summary: "x" }],
    });
    assert.ok(has(all(wrap(i)), "N8"));
  });

  test("a corrected round-up with an empty changelog is an error, not a warning", () => {
    // F4 warns for ordinary content. On a historical record an undocumented
    // edit destroys the thing that made the record worth keeping.
    const i = roundUp({
      publishedDate: "2026-01-01",
      updatedDate: "2026-02-01",
      correctionNote: "Corrected.",
      changelog: [],
    });
    const issues = all(wrap(i));
    assert.ok(has(issues, "N8"));
    for (const x of only(issues, "N8")) assert.equal(x.severity, "error");
  });

  test("an uncorrected round-up needs neither", () => {
    const i = roundUp({ publishedDate: "2026-01-01" });
    assert.deepEqual(all(wrap(i)), []);
  });

  test("F2 still fires alongside, so the two records stay in step", () => {
    const i = roundUp({ publishedDate: "2026-01-01", updatedDate: "2026-02-01", correctionNote: "x" });
    assert.ok(checkGovernance(wrap(i), { now: NOW }).some((x) => x.rule === "F2"));
  });
});

describe("N9 — a news slug must not look like a year", () => {
  test("a four-digit slug is an error", () => {
    const issues = checkNewsSlugShape(wrap(item({ slug: "2026" })));
    assert.equal(issues.length, 1);
    assert.match(issues[0].message, /shadow the \/news\/2026 archive/);
  });

  test("a slug merely containing a year is fine", () => {
    assert.deepEqual(checkNewsSlugShape(wrap(item({ slug: "round-up-march-2026" }))), []);
  });
});

describe("Tags remain mandatory for News", () => {
  test("tagsExpected is true for news", () => {
    assert.equal(tagsExpected("news"), true);
  });

  test("an untagged published news item is reported", () => {
    const issues = checkTags(wrap(item({ tags: [] })));
    assert.ok(issues.some((i) => i.rule === "C3"));
  });
});

describe("The real content passes every N rule", () => {
  test("the ten launch items produce no N-series error or warning", async () => {
    const { news, guides, standards, legislation, glossaryTerms, downloads } = await import(
      "../.velite"
    );
    const c = { news, guides, standards, legislation, glossaryTerms, downloads };
    assert.deepEqual(
      all(c, {}).map((i) => `${i.rule} ${i.slug}: ${i.message}`),
      []
    );
  });
});
