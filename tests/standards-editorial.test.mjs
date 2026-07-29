// G-series editorial rules for external document references (Phase 5A, PR 5).
//
// Pure functions over plain data with an injected `now`, for the reason set out
// at the top of tests/editorial-validation.test.mjs: a fixture written today as
// "current" must not silently expire and turn the suite red next year.
//
// Three groups of test carry most of the weight here.
//
// The MUST-REMAIN-VALID group is first, because those are the states a
// well-meant tightening of these rules would break: withdrawn-with-successor,
// published-page-about-a-withdrawn-document, and a revision project that is
// deliberately not the same claim as a formal review.
//
// The publication gate is the owner-required rule: a reference page may not go
// live without explicit evidence that its status, edition and licence were
// confirmed against the official source.
//
// And the acknowledgement rules exist so that G5 can be satisfied by reviewing
// a reference rather than only by deleting it.

import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  checkDocumentLifecycle,
  checkReferencedDocumentCurrency,
  checkDocumentProvenance,
  checkDocumentPublicationGate,
  checkCategoryApplicability,
  checkGovernance,
} from "../lib/editorial-validation";
import {
  DOCUMENT_REFERENCE_COLLECTIONS,
  EDITION_REQUIRED_CLASSES,
  OFFICIAL_SOURCE_HOSTS,
  NOTICE_MIN_LENGTH,
  TAGS_EXPECTED_COLLECTIONS,
  tagsExpected,
} from "../lib/editorial-rules";

const NOW = "2026-07-01";

const NOTICE =
  "This document is published by BSI and is protected by copyright. BSI grants no licence for commercial reproduction.";
const DISCLAIMER =
  "This page describes a published document and is not a substitute for reading it, nor is it legal advice.";

/** A standard that passes every rule, so each test can break exactly one thing. */
function standard(overrides = {}) {
  return {
    id: "s1",
    slug: "s1",
    status: "published",
    category: "fire-safety",
    documentClass: "british-standard",
    officialReference: "BS 1234:2020",
    publisher: "BSI",
    currentEdition: "2020",
    documentStatus: "current",
    supersededBy: [],
    amendments: [],
    sourceLicence: "commercial",
    copyrightNotice: NOTICE,
    disclaimer: DISCLAIMER,
    officialSourceUrl: "https://knowledge.bsigroup.com/products/example",
    lastCheckedDate: "2026-06-01",
    statusConfirmedDate: "2026-06-01",
    editionConfirmedDate: "2026-06-01",
    licenceConfirmedDate: "2026-06-01",
    verifiedBy: "batir-turakulov",
    complianceReviewerId: "batir-turakulov",
    body: "Plain commentary.",
    ...overrides,
  };
}

const wrap = (...standards) => ({ standards });
const rules = (issues) => issues.map((i) => i.rule).sort();
const has = (issues, rule) => issues.some((i) => i.rule === rule);

describe("G — the baseline fixture is genuinely clean", () => {
  test("a fully verified current standard produces nothing from any G rule", () => {
    const c = wrap(standard());
    const all = [
      ...checkDocumentLifecycle(c, { now: NOW }),
      ...checkReferencedDocumentCurrency(c),
      ...checkDocumentProvenance(c),
      ...checkDocumentPublicationGate(c, { now: NOW }),
    ];
    assert.deepEqual(all, [], "the baseline must be clean or every other test is meaningless");
  });
});

describe("G — combinations that must remain valid", () => {
  test("withdrawn AND superseded is a legitimate state, not a contradiction", () => {
    // PAS 79-2 exactly: withdrawn by its publisher AND later replaced. A rule
    // set that treats these as mutually exclusive cannot describe reality.
    const c = wrap(
      standard({
        slug: "old",
        documentStatus: "withdrawn",
        withdrawnDate: "2021-08-06",
        supersededBy: ["new"],
      }),
      standard({ slug: "new", id: "s2" })
    );
    const issues = checkDocumentLifecycle(c, { now: NOW });
    assert.deepEqual(issues, []);
  });

  test("a published page about a withdrawn document is valid", () => {
    // status (our page) and documentStatus (the document) are orthogonal.
    const c = wrap(
      standard({
        slug: "old",
        status: "published",
        documentStatus: "withdrawn",
        withdrawnDate: "2021-08-06",
        supersededBy: ["new"],
      }),
      standard({ slug: "new", id: "s2" })
    );
    const all = [
      ...checkDocumentLifecycle(c, { now: NOW }),
      ...checkDocumentPublicationGate(c, { now: NOW }),
      ...checkDocumentProvenance(c),
    ];
    assert.deepEqual(all, []);
  });

  test("under-review with no successor and no dates is valid", () => {
    const c = wrap(standard({ documentStatus: "under-review" }));
    assert.deepEqual(checkDocumentLifecycle(c, { now: NOW }), []);
  });

  test("an open revision project does not require the under-review status", () => {
    // BS 9999 exactly: BSI lists the 2017 edition as current while a revision
    // project sits at pre-draft stage. Overstating that as a formal review
    // would be inaccurate, so the two are separate fields.
    const c = wrap(
      standard({
        documentStatus: "current",
        revisionInProgress: true,
        revisionNote: "A revision project is open at pre-draft stage.",
      })
    );
    assert.deepEqual(checkDocumentLifecycle(c, { now: NOW }), []);
  });
});

describe("G1–G4 — supersession coherence", () => {
  test("G1: superseded with no named successor is an error", () => {
    const c = wrap(standard({ documentStatus: "superseded", supersededBy: [] }));
    assert.ok(has(checkDocumentLifecycle(c, { now: NOW }), "G1"));
  });

  test("G1: superseded WITH a successor is clean", () => {
    const c = wrap(
      standard({ slug: "old", documentStatus: "superseded", supersededBy: ["new"] }),
      standard({ slug: "new", id: "s2" })
    );
    assert.ok(!has(checkDocumentLifecycle(c, { now: NOW }), "G1"));
  });

  test("G3: a document listing itself as its own successor is an error", () => {
    const c = wrap(standard({ slug: "a", supersededBy: ["a"] }));
    assert.ok(has(checkDocumentLifecycle(c, { now: NOW }), "G3"));
  });

  test("G4: a two-document cycle is an error", () => {
    const c = wrap(
      standard({ slug: "a", supersededBy: ["b"] }),
      standard({ slug: "b", id: "s2", supersededBy: ["a"] })
    );
    assert.ok(has(checkDocumentLifecycle(c, { now: NOW }), "G4"));
  });

  test("G4: a longer cycle is an error", () => {
    const c = wrap(
      standard({ slug: "a", supersededBy: ["b"] }),
      standard({ slug: "b", id: "s2", supersededBy: ["c"] }),
      standard({ slug: "c", id: "s3", supersededBy: ["a"] })
    );
    assert.ok(has(checkDocumentLifecycle(c, { now: NOW }), "G4"));
  });

  test("G4: a legitimate linear chain is not reported", () => {
    const c = wrap(
      standard({ slug: "a", documentStatus: "superseded", supersededBy: ["b"] }),
      standard({ slug: "b", id: "s2", documentStatus: "superseded", supersededBy: ["c"] }),
      standard({ slug: "c", id: "s3" })
    );
    assert.ok(!has(checkDocumentLifecycle(c, { now: NOW }), "G4"));
  });
});

describe("G5 / G17 — referencing a document that is no longer current", () => {
  const library = () => ({
    standards: [
      standard({ slug: "live" }),
      standard({
        slug: "gone",
        id: "s2",
        documentStatus: "withdrawn",
        withdrawnDate: "2021-08-06",
        supersededBy: ["live"],
      }),
    ],
    guides: [],
  });

  test("G5: a published guide pointing at a withdrawn document warns", () => {
    const c = library();
    c.guides = [{ id: "g", slug: "g", status: "published", relatedStandards: ["gone"] }];
    const issues = checkReferencedDocumentCurrency(c);
    assert.ok(has(issues, "G5"));
    assert.equal(issues.find((i) => i.rule === "G5").severity, "warning");
  });

  test("G5: pointing at a current document does not warn", () => {
    const c = library();
    c.guides = [{ id: "g", slug: "g", status: "published", relatedStandards: ["live"] }];
    assert.ok(!has(checkReferencedDocumentCurrency(c), "G5"));
  });

  test("G5: an unpublished guide is not reported", () => {
    const c = library();
    c.guides = [{ id: "g", slug: "g", status: "draft", relatedStandards: ["gone"] }];
    assert.ok(!has(checkReferencedDocumentCurrency(c), "G5"));
  });

  test("G5: an acknowledged reference is not reported", () => {
    // The point of the acknowledgement: a guide explaining that PAS 79-2 was
    // withdrawn HAS to link to PAS 79-2. Without this the only way to clear
    // the warning would be to delete the correct link.
    const c = library();
    c.guides = [
      {
        id: "g",
        slug: "g",
        status: "published",
        relatedStandards: ["gone"],
        acknowledgedNonCurrentDocuments: ["gone"],
      },
    ];
    assert.ok(!has(checkReferencedDocumentCurrency(c), "G5"));
  });

  test("G17: acknowledging a document that is not referenced is a stale silencer", () => {
    const c = library();
    c.guides = [
      {
        id: "g",
        slug: "g",
        status: "published",
        relatedStandards: ["live"],
        acknowledgedNonCurrentDocuments: ["gone"],
      },
    ];
    assert.ok(has(checkReferencedDocumentCurrency(c), "G17"));
  });

  test("G17: acknowledging a document that is actually current is reported", () => {
    const c = library();
    c.guides = [
      {
        id: "g",
        slug: "g",
        status: "published",
        relatedStandards: ["live"],
        acknowledgedNonCurrentDocuments: ["live"],
      },
    ];
    assert.ok(has(checkReferencedDocumentCurrency(c), "G17"));
  });
});

describe("G6, G7, G8, G11 — provenance and copyright integrity", () => {
  test("G6: a British Standard with no edition is an error", () => {
    const c = wrap(standard({ currentEdition: undefined }));
    assert.ok(has(checkDocumentProvenance(c), "G6"));
  });

  test("G6: a PAS with no edition is an error", () => {
    const c = wrap(standard({ documentClass: "pas", currentEdition: undefined }));
    assert.ok(has(checkDocumentProvenance(c), "G6"));
  });

  test("G6: regulator guidance with no edition is not an error", () => {
    // HSG65's "third edition, 2013" is a phrase, not a year, and plenty of
    // guidance has no edition at all. The rule is scoped to the classes where
    // an edition year is genuinely meaningful.
    assert.ok(!EDITION_REQUIRED_CLASSES.includes("regulator-guidance"));
    const c = wrap(
      standard({
        documentClass: "regulator-guidance",
        currentEdition: undefined,
        officialSourceUrl: "https://www.hse.gov.uk/pubns/books/hsg65.htm",
      })
    );
    assert.ok(!has(checkDocumentProvenance(c), "G6"));
  });

  test("G7: an official source on a reseller domain warns", () => {
    const c = wrap(standard({ officialSourceUrl: "https://some-reseller.example/bs-1234" }));
    assert.ok(has(checkDocumentProvenance(c), "G7"));
  });

  test("G7: a subdomain of the publisher passes", () => {
    assert.ok(OFFICIAL_SOURCE_HOSTS["british-standard"].includes("bsigroup.com"));
    const c = wrap(standard({ officialSourceUrl: "https://landingpage.bsigroup.com/x" }));
    assert.ok(!has(checkDocumentProvenance(c), "G7"));
  });

  test("G7: gov.uk is accepted for statutory guidance and BSI is not", () => {
    const ok = wrap(
      standard({
        documentClass: "statutory-guidance",
        officialSourceUrl: "https://www.gov.uk/government/publications/x",
      })
    );
    assert.ok(!has(checkDocumentProvenance(ok), "G7"));

    const wrong = wrap(
      standard({
        documentClass: "statutory-guidance",
        officialSourceUrl: "https://knowledge.bsigroup.com/products/x",
      })
    );
    assert.ok(has(checkDocumentProvenance(wrong), "G7"));
  });

  test("G7: industry guidance is skipped, because it has no single publisher", () => {
    const c = wrap(
      standard({
        documentClass: "industry-guidance",
        officialSourceUrl: "https://some-trade-body.example/guide",
      })
    );
    assert.ok(!has(checkDocumentProvenance(c), "G7"));
  });

  test("G8: a placeholder copyright notice is caught even though it satisfies min(1)", () => {
    const c = wrap(standard({ copyrightNotice: "BSI" }));
    assert.ok(NOTICE_MIN_LENGTH > 3);
    assert.ok(has(checkDocumentProvenance(c), "G8"));
  });

  test("G8: a placeholder disclaimer is caught", () => {
    const c = wrap(standard({ disclaimer: "See source." }));
    assert.ok(has(checkDocumentProvenance(c), "G8"));
  });

  test("G8: an OGL licence whose notice does not mention it warns", () => {
    const c = wrap(
      standard({
        documentClass: "statutory-guidance",
        officialSourceUrl: "https://www.gov.uk/x",
        sourceLicence: "open-government-licence",
        copyrightNotice: NOTICE,
      })
    );
    assert.ok(has(checkDocumentProvenance(c), "G8"));
  });

  test("G8: claiming open terms over commercially licensed material warns", () => {
    // The dangerous direction. A commercially licensed BSI document whose
    // notice claims Open Government Licence terms is a substantive error.
    const c = wrap(
      standard({
        sourceLicence: "commercial",
        copyrightNotice:
          "This material is available under the Open Government Licence v3.0 and may be reproduced freely.",
      })
    );
    assert.ok(has(checkDocumentProvenance(c), "G8"));
  });

  test("G8: a correct OGL notice passes", () => {
    const c = wrap(
      standard({
        documentClass: "statutory-guidance",
        officialSourceUrl: "https://www.gov.uk/x",
        sourceLicence: "open-government-licence",
        copyrightNotice:
          "This document is Crown copyright and is published under the Open Government Licence v3.0, which permits reuse with attribution.",
      })
    );
    assert.ok(!has(checkDocumentProvenance(c), "G8"));
  });

  test("G11: a long verbatim quotation from a commercial source is flagged", () => {
    const long = "x".repeat(400);
    const c = wrap(standard({ body: `Commentary.\n\n> ${long}\n\nMore commentary.` }));
    assert.ok(has(checkDocumentProvenance(c), "G11"));
  });

  test("G11: a short attributed quotation is not flagged", () => {
    const c = wrap(standard({ body: "Commentary.\n\n> A short quoted title.\n\nMore." }));
    assert.ok(!has(checkDocumentProvenance(c), "G11"));
  });

  test("G11: a long quotation from an openly licensed source is not flagged", () => {
    const long = "x".repeat(400);
    const c = wrap(
      standard({
        documentClass: "statutory-guidance",
        officialSourceUrl: "https://www.gov.uk/x",
        sourceLicence: "open-government-licence",
        copyrightNotice:
          "This document is Crown copyright and is published under the Open Government Licence v3.0, which permits reuse with attribution.",
        body: `Commentary.\n\n> ${long}\n\nMore.`,
      })
    );
    assert.ok(!has(checkDocumentProvenance(c), "G11"));
  });

  test("sourceLicence defaults to the most restrictive assumption", () => {
    // An omitted licence must never widen what is permitted, so the absent
    // value is treated as commercial rather than as unknown.
    const long = "x".repeat(400);
    const c = wrap(standard({ sourceLicence: undefined, body: `> ${long}` }));
    assert.ok(has(checkDocumentProvenance(c), "G11"));
  });
});

describe("G9, G10, G12, G16 — dates and coherence", () => {
  test("G9: a withdrawal dated in the future is an error", () => {
    const c = wrap(standard({ documentStatus: "withdrawn", withdrawnDate: "2027-01-01" }));
    assert.ok(has(checkDocumentLifecycle(c, { now: NOW }), "G9"));
  });

  test("G10: withdrawn with no date warns rather than errors", () => {
    // PAS 79-2 is the live reason this is soft: BSI published no discrete
    // withdrawal date in its catalogue.
    const c = wrap(standard({ documentStatus: "withdrawn", supersededBy: [] }));
    const issues = checkDocumentLifecycle(c, { now: NOW });
    assert.ok(has(issues, "G10"));
    assert.equal(issues.find((i) => i.rule === "G10").severity, "warning");
  });

  test("G12: current with a withdrawal date is incoherent", () => {
    const c = wrap(standard({ documentStatus: "current", withdrawnDate: "2020-01-01" }));
    assert.ok(has(checkDocumentLifecycle(c, { now: NOW }), "G12"));
  });

  test("G16: an amendment dated in the future warns", () => {
    // Approved Document B's 2026 and 2029 amendment sets are published but not
    // in force. Listing them as amendments reads as though they already apply.
    const c = wrap(
      standard({
        amendments: [{ reference: "2029 amendments", date: "2029-09-02", summary: "Future." }],
      })
    );
    const issues = checkDocumentLifecycle(c, { now: NOW });
    assert.ok(has(issues, "G16"));
    assert.equal(issues.find((i) => i.rule === "G16").severity, "warning");
  });

  test("G16: an in-force amendment is not reported", () => {
    const c = wrap(
      standard({
        amendments: [{ reference: "2025 amendments", date: "2025-03-02", summary: "In force." }],
      })
    );
    assert.ok(!has(checkDocumentLifecycle(c, { now: NOW }), "G16"));
  });
});

describe("G13, G14, G15 — the publication gate", () => {
  const REQUIRED = [
    "statusConfirmedDate",
    "editionConfirmedDate",
    "licenceConfirmedDate",
    "verifiedBy",
    "lastCheckedDate",
  ];

  for (const field of REQUIRED) {
    test(`G13: publishing without ${field} is an error`, () => {
      const c = wrap(standard({ [field]: undefined }));
      const issues = checkDocumentPublicationGate(c, { now: NOW });
      assert.ok(has(issues, "G13"), `expected G13 when ${field} is absent`);
      assert.ok(issues.find((i) => i.rule === "G13").message.includes(field));
    });
  }

  test("G13: a DRAFT missing every confirmation is allowed", () => {
    // The whole point of the split between schema and gate: half-verified work
    // in progress must be able to exist on disk, and must not be publishable.
    const c = wrap(
      standard({
        status: "draft",
        statusConfirmedDate: undefined,
        editionConfirmedDate: undefined,
        licenceConfirmedDate: undefined,
        verifiedBy: undefined,
      })
    );
    assert.ok(!has(checkDocumentPublicationGate(c, { now: NOW }), "G13"));
  });

  test("G13: publishing without an official source URL is an error", () => {
    const c = wrap(standard({ officialSourceUrl: undefined }));
    assert.ok(has(checkDocumentPublicationGate(c, { now: NOW }), "G13"));
  });

  test("G13: publishing without a publisher or reference is an error", () => {
    const c = wrap(standard({ publisher: undefined, officialReference: undefined }));
    const message = checkDocumentPublicationGate(c, { now: NOW }).find(
      (i) => i.rule === "G13"
    ).message;
    assert.ok(message.includes("publisher"));
    assert.ok(message.includes("officialReference"));
  });

  test("G13: an edition is only demanded where it is meaningful", () => {
    const c = wrap(
      standard({
        documentClass: "regulator-guidance",
        currentEdition: undefined,
        officialSourceUrl: "https://www.hse.gov.uk/pubns/books/hsg65.htm",
      })
    );
    const issues = checkDocumentPublicationGate(c, { now: NOW });
    const g13 = issues.find((i) => i.rule === "G13");
    assert.ok(!g13 || !g13.message.includes("currentEdition"));
  });

  test("G14: a confirmation dated in the future is an error, even on a draft", () => {
    const c = wrap(standard({ status: "draft", statusConfirmedDate: "2027-01-01" }));
    assert.ok(has(checkDocumentPublicationGate(c, { now: NOW }), "G14"));
  });

  test("G15: confirmations beyond the six-month window warn rather than error", () => {
    const c = wrap(
      standard({
        statusConfirmedDate: "2025-01-01",
        editionConfirmedDate: "2025-01-01",
        licenceConfirmedDate: "2025-01-01",
      })
    );
    const issues = checkDocumentPublicationGate(c, { now: NOW });
    assert.ok(has(issues, "G15"));
    // A warning, so the passage of time can never break a deployment — the
    // same principle as B4 and B5.
    assert.ok(issues.filter((i) => i.rule === "G15").every((i) => i.severity === "warning"));
  });
});

describe("Scoping — the rules reach Legislation without being rewritten", () => {
  test("legislation is a document-reference collection", () => {
    assert.ok(DOCUMENT_REFERENCE_COLLECTIONS.includes("standards"));
    assert.ok(DOCUMENT_REFERENCE_COLLECTIONS.includes("legislation"));
  });

  test("the same rules fire for a legislation item with no rule changes", () => {
    const item = standard({
      documentClass: "act",
      documentStatus: "superseded",
      supersededBy: [],
      officialSourceUrl: "https://www.legislation.gov.uk/x",
    });
    const issues = checkDocumentLifecycle({ legislation: [item] }, { now: NOW });
    assert.ok(has(issues, "G1"));
  });

  test("guides are not treated as a document-reference collection", () => {
    const issues = checkDocumentPublicationGate(
      { guides: [{ id: "g", slug: "g", status: "published" }] },
      { now: NOW }
    );
    assert.deepEqual(issues, []);
  });
});

describe("C3 scoping and F5 — changes to existing rules", () => {
  test("standards no longer expect tags", () => {
    assert.ok(!TAGS_EXPECTED_COLLECTIONS.includes("standards"));
    assert.equal(tagsExpected("standards"), false);
  });

  test("collections where tags are load-bearing still expect them", () => {
    assert.equal(tagsExpected("news"), true);
    assert.equal(tagsExpected("downloads"), true);
  });

  test("guides and glossary remain excluded", () => {
    assert.equal(tagsExpected("guides"), false);
    assert.equal(tagsExpected("glossaryTerms"), false);
  });

  test("F5: a published standard with no compliance reviewer warns", () => {
    const c = wrap(standard({ complianceReviewerId: undefined, publishedDate: "2026-01-01" }));
    const issues = checkGovernance(c, { now: NOW });
    assert.ok(issues.some((i) => i.rule === "F5"));
  });

  test("F5: a published standard WITH a compliance reviewer is clean", () => {
    const c = wrap(standard({ publishedDate: "2026-01-01" }));
    assert.ok(!checkGovernance(c, { now: NOW }).some((i) => i.rule === "F5"));
  });
});

describe("C6 — appliesTo is enforced rather than decorative", () => {
  test("a category not declared for the standard section is an error", () => {
    // business-duty-holder-guidance is deliberately NOT opted in: it frames
    // content by who the reader is, which is not what a published document is.
    const c = wrap(standard({ category: "business-duty-holder-guidance" }));
    assert.ok(has(checkCategoryApplicability(c), "C6"));
  });

  test("an opted-in category passes", () => {
    for (const category of [
      "fire-risk-assessments",
      "fire-safety",
      "compliance-legislation",
      "health-safety",
    ]) {
      const c = wrap(standard({ category }));
      assert.ok(!has(checkCategoryApplicability(c), "C6"), `${category} should apply to standards`);
    }
  });

  test("the rule also protects the sections that existed before PR 5", () => {
    const c = {
      glossaryTerms: [
        { id: "t", slug: "t", status: "published", category: "health-safety" },
      ],
    };
    // health-safety is opted in for guides, news and standards — not glossary.
    assert.ok(has(checkCategoryApplicability(c), "C6"));
  });

  test("a collection with no declared section is unconstrained", () => {
    const c = { downloads: [{ id: "d", slug: "d", category: "health-safety" }] };
    assert.deepEqual(checkCategoryApplicability(c), []);
  });
});
