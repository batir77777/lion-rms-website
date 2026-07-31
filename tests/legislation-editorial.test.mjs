// L-series editorial rules for legislation (Phase 5A, PR 6).
//
// Pure functions over plain data with an injected `now`, for the same reason as
// the G-series file: a fixture written today as "in force" must not silently
// expire and turn the suite red next year.
//
// Two groups carry most of the weight.
//
// The MUST-REMAIN-VALID group is first, because those are the legally correct
// states that a well-meant tightening of these rules would break — an Act that
// is fully in force but whose amending sections are spent, an instrument whose
// extent is wider than its application, a partially commenced Act with
// provisions still to come, and a source whose own revised text is behind our
// last check. Each of those is a real position in the launch set, and a rule
// that rejected any of them would be wrong rather than strict.
//
// The other group is the pairing rules — repeal for Acts, revocation for
// statutory instruments, and the constitutional limits on what a devolved
// legislature can legislate for. Those are the ones a reader who works with
// legislation will notice immediately if we get them wrong.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  checkLegislationRelations,
  checkLegislationCoherence,
  checkLegislationSource,
  checkLegislationReferenceCurrency,
  checkDocumentPublicationGate,
  checkDocumentProvenance,
} from "../lib/editorial-validation";
import {
  LEGISLATION_OFFICIAL_HOST,
  FORM_PERMITTED_EXTENTS,
  TERMINATION_STATUS_TIER,
  PUBLICATION_GATE_FIELDS,
} from "../lib/editorial-rules";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const NOW = "2026-07-01";

const NOTICE =
  "Contains public sector information licensed under the Open Government Licence v3.0. This page is our own commentary on the instrument.";
const DISCLAIMER =
  "This page describes legislation in general terms. It is not legal advice and is not a substitute for the official text.";

/** An instrument that passes every rule, so each test can break exactly one thing. */
function act(overrides = {}) {
  return {
    id: "a1",
    slug: "a1",
    status: "published",
    category: "compliance-legislation",
    shortTitle: "Example Act 2020",
    officialReference: "2020 c. 1",
    year: 2020,
    publisher: "The National Archives",
    legislationTier: "primary",
    instrumentForm: "uk-public-general-act",
    instrumentType: "act",
    extent: ["england-and-wales"],
    application: ["england-and-wales"],
    forceStatus: "in-force",
    supersededBy: [],
    amends: [],
    relatedLegislation: [],
    commencement: [{ date: "2021-01-01", scope: "fully" }],
    inForceDate: "2021-01-01",
    notYetInForce: [],
    amendments: [],
    outstandingEffects: [],
    outstandingEffectsChecked: true,
    sourceTextAsAtDate: "2026-06-01",
    sourceTextAsAtDateStated: true,
    sourceCurrencyConfirmedDate: "2026-06-01",
    lastCheckedDate: "2026-06-01",
    statusConfirmedDate: "2026-06-01",
    licenceConfirmedDate: "2026-06-01",
    verifiedBy: "batir-turakulov",
    sourceLicence: "open-government-licence",
    copyrightNotice: NOTICE,
    disclaimer: DISCLAIMER,
    officialSourceUrl: "https://www.legislation.gov.uk/ukpga/2020/1",
    body: "Plain commentary.",
    ...overrides,
  };
}

/** A statutory instrument that passes every rule. */
function si(overrides = {}) {
  return act({
    id: "s1",
    slug: "s1",
    shortTitle: "Example Regulations 2020",
    officialReference: "S.I. 2020/1",
    legislationTier: "secondary",
    instrumentForm: "statutory-instrument",
    instrumentType: "regulations",
    enablingPower: "section 15 of the Example Act 2019",
    officialSourceUrl: "https://www.legislation.gov.uk/uksi/2020/1",
    ...overrides,
  });
}

const wrap = (...items) => ({ legislation: items });
const all = (c, options = { now: NOW }) => [
  ...checkLegislationRelations(c, options),
  ...checkLegislationCoherence(c),
  ...checkLegislationSource(c, options),
  ...checkLegislationReferenceCurrency(c),
];
const has = (issues, rule) => issues.some((i) => i.rule === rule);
const only = (issues, rule) => issues.filter((i) => i.rule === rule);

// ---------------------------------------------------------------------------

describe("L — the baseline fixtures are genuinely clean", () => {
  test("a fully in-force Act produces nothing from any L rule", () => {
    assert.deepEqual(all(wrap(act())), []);
  });

  test("a made-and-in-force statutory instrument produces nothing either", () => {
    assert.deepEqual(all(wrap(si())), []);
  });

  test("neither fixture trips the publication gate or the provenance rules", () => {
    const c = wrap(act(), si());
    assert.deepEqual(checkDocumentPublicationGate(c, { now: NOW }), []);
    assert.deepEqual(checkDocumentProvenance(c), []);
  });
});

describe("MUST REMAIN VALID — legally correct states no rule may reject", () => {
  test("an Act fully in force whose amending sections are spent on commencement", () => {
    // Fire Safety Act 2021: ss.1 and 3 were textual amendments exhausted on
    // commencement, s.2 is a live unexercised power. "Spent" is wrong; bare
    // "in force" is right and needs the note, not a different status.
    const item = act({
      forceStatus: "in-force",
      statusNote:
        "Sections 1 and 3 were textual amendments to the Fire Safety Order and were exhausted on commencement. Section 2 remains a live and unexercised power.",
      commencement: [
        { date: "2021-10-01", scope: "section 1", jurisdiction: "wales" },
        { date: "2022-05-16", scope: "section 1", jurisdiction: "england" },
      ],
      inForceDate: "2021-10-01",
    });
    assert.deepEqual(all(wrap(item)), []);
  });

  test("extent wider than application, explained by an extentNote", () => {
    const item = si({
      extent: ["england-and-wales"],
      application: ["england"],
      extentNote:
        "These Regulations form part of the law of England and Wales but impose duties only in England.",
    });
    assert.deepEqual(all(wrap(item)), []);
  });

  test("a partially commenced Act with provisions still to be brought in", () => {
    const item = act({
      forceStatus: "partially-in-force",
      commencement: [
        { date: "2022-06-28", scope: "sections 1 to 5" },
        { date: "2023-10-01", scope: "Part 4", broughtInBy: "S.I. 2023/993" },
      ],
      inForceDate: "2022-06-28",
      notYetInForce: [
        {
          provision: "section 156(4)",
          note: "Would insert article 9A into the Fire Safety Order. Not yet commenced.",
        },
      ],
    });
    assert.deepEqual(all(wrap(item)), []);
  });

  test("a partially repealed Act with a statusNote and no single repeal date", () => {
    const item = act({
      forceStatus: "partially-repealed",
      statusNote:
        "Part 3 (sections 53 to 79) was repealed, along with sections 61(4) and (5) and 67(2). The remainder stands.",
    });
    assert.deepEqual(all(wrap(item)), []);
  });

  test("the official source's own revised text being behind our last check", () => {
    // legislation.gov.uk states the Fire Safety (England) Regulations text is
    // current only to a date in the past. No amount of re-checking moves that,
    // so it must not be reported as a defect on our side.
    const item = si({
      sourceTextAsAtDate: "2026-04-13",
      sourceCurrencyConfirmedDate: "2026-06-25",
    });
    assert.deepEqual(all(wrap(item)), []);
  });

  test("a source that displays no currency date at all", () => {
    const item = act({
      sourceTextAsAtDate: "2026-06-20",
      sourceTextAsAtDateStated: false,
      sourceCurrencyConfirmedDate: "2026-06-20",
    });
    assert.deepEqual(all(wrap(item)), []);
  });

  test("an amendment made but not yet in force", () => {
    const item = act({
      amendments: [
        {
          reference: "Example Act 2025 s.4",
          date: "2027-04-01",
          summary: "Inserts a new section 51B. Not yet commenced.",
          inForce: false,
        },
      ],
    });
    assert.deepEqual(all(wrap(item)), []);
  });

  test("outstanding effects recorded and acknowledged in the body", () => {
    const item = act({
      outstandingEffects: [
        { effect: "Amendments by the Example (Wales) Act 2024 not yet applied", source: "legislation.gov.uk" },
      ],
      outstandingEffectsChecked: true,
      body: "The official revised text does not yet incorporate all changes: some effects are outstanding.",
    });
    assert.deepEqual(all(wrap(item)), []);
  });
});

// ---------------------------------------------------------------------------

describe("L1 — every reference must resolve", () => {
  test("a dangling relatedLegislation reference is an error", () => {
    const issues = all(wrap(act({ relatedLegislation: ["ghost"] })));
    assert.ok(has(issues, "L1"));
    assert.equal(only(issues, "L1")[0].severity, "error");
  });

  test("a dangling amends reference is an error", () => {
    assert.ok(has(all(wrap(act({ amends: ["ghost"] }))), "L1"));
  });

  test("a dangling supersededBy reference is an error", () => {
    assert.ok(has(all(wrap(act({ supersededBy: ["ghost"] }))), "L1"));
  });

  test("a reference that resolves to a sibling is accepted", () => {
    const a = act({ slug: "a", amends: ["b"] });
    const b = act({ id: "b", slug: "b" });
    assert.equal(has(all(wrap(a, b)), "L1"), false);
  });
});

describe("L2 — no cycles in either directed graph", () => {
  test("a two-instrument amends cycle is caught", () => {
    const a = act({ slug: "a", amends: ["b"] });
    const b = act({ id: "b", slug: "b", amends: ["a"] });
    assert.ok(has(all(wrap(a, b)), "L2"));
  });

  test("a three-instrument supersededBy cycle is caught", () => {
    const a = act({ slug: "a", supersededBy: ["b"] });
    const b = act({ id: "b", slug: "b", supersededBy: ["c"] });
    const c = act({ id: "c", slug: "c", supersededBy: ["a"] });
    assert.ok(has(all(wrap(a, b, c)), "L2"));
  });

  test("a chain that converges on a shared successor is not a cycle", () => {
    const a = act({ slug: "a", supersededBy: ["c"] });
    const b = act({ id: "b", slug: "b", supersededBy: ["c"] });
    const c = act({ id: "c", slug: "c" });
    assert.equal(has(all(wrap(a, b, c)), "L2"), false);
  });
});

describe("L3 — self-amendment", () => {
  test("an instrument listing itself in amends is an error", () => {
    assert.ok(has(all(wrap(act({ slug: "a", amends: ["a"] }))), "L3"));
  });
});

describe("L4 — Acts are repealed, statutory instruments are revoked", () => {
  test("the pairing table says exactly that", () => {
    assert.equal(TERMINATION_STATUS_TIER.repealed, "primary");
    assert.equal(TERMINATION_STATUS_TIER.revoked, "secondary");
  });

  test("a repealed statutory instrument is an error", () => {
    assert.ok(has(all(wrap(si({ forceStatus: "repealed", statusNote: "x" }))), "L4"));
  });

  test("a revoked Act is an error", () => {
    assert.ok(has(all(wrap(act({ forceStatus: "revoked", statusNote: "x" }))), "L4"));
  });

  test("a repealed Act and a revoked instrument are both accepted", () => {
    const a = act({ forceStatus: "repealed", repealedDate: "2024-01-01", statusNote: "Repealed in full." });
    const s = si({ forceStatus: "revoked", revokedDate: "2024-01-01", statusNote: "Revoked in full." });
    assert.equal(has(all(wrap(a)), "L4"), false);
    assert.equal(has(all(wrap(s)), "L4"), false);
  });

  test("a repealedDate on secondary legislation is an error even without the status", () => {
    assert.ok(has(all(wrap(si({ repealedDate: "2024-01-01" }))), "L4"));
  });

  test("a revokedDate on primary legislation is an error even without the status", () => {
    assert.ok(has(all(wrap(act({ revokedDate: "2024-01-01" }))), "L4"));
  });
});

describe("L5 — secondary legislation must say what power made it", () => {
  test("a statutory instrument with no enablingPower is an error", () => {
    assert.ok(has(all(wrap(si({ enablingPower: undefined }))), "L5"));
  });

  test("primary legislation is not asked for one", () => {
    assert.equal(has(all(wrap(act({ enablingPower: undefined }))), "L5"), false);
  });
});

describe("L6 — lifecycle and commencement must not contradict each other", () => {
  test("partially in force with nothing listed as uncommenced is an error", () => {
    const issues = all(wrap(act({ forceStatus: "partially-in-force", notYetInForce: [] })));
    assert.ok(has(issues, "L6"));
    assert.match(
      only(issues, "L6")[0].message,
      /must not imply every provision is operative/,
      "the message should say why, not merely that"
    );
  });

  test("not yet in force but recording commencement events is an error", () => {
    assert.ok(
      has(
        all(
          wrap(
            act({
              forceStatus: "not-yet-in-force",
              commencement: [{ date: "2025-01-01", scope: "fully" }],
              inForceDate: "2025-01-01",
            })
          )
        ),
        "L6"
      )
    );
  });

  test("not yet in force with no commencement events is accepted", () => {
    const item = act({
      forceStatus: "not-yet-in-force",
      commencement: [],
      inForceDate: undefined,
    });
    assert.equal(has(all(wrap(item)), "L6"), false);
  });

  test("partially repealed with neither a date nor a note is an error", () => {
    assert.ok(has(all(wrap(act({ forceStatus: "partially-repealed" }))), "L6"));
  });

  test("partially repealed with a repealedDate alone is accepted", () => {
    const item = act({ forceStatus: "partially-repealed", repealedDate: "2015-04-01" });
    assert.equal(has(all(wrap(item)), "L6"), false);
  });
});

describe("L7 — extent differing from application must be explained", () => {
  test("a difference with no extentNote is an error", () => {
    const issues = all(wrap(si({ extent: ["england-and-wales"], application: ["england"] })));
    assert.ok(has(issues, "L7"));
    assert.match(only(issues, "L7")[0].message, /needs that said/);
  });

  test("a difference in the other direction is caught too", () => {
    const item = act({ extent: ["england"], application: ["england", "wales"] });
    assert.ok(has(all(wrap(item)), "L7"));
  });

  test("identical lists in a different order are not a difference", () => {
    const item = act({
      extent: ["england-and-wales", "scotland"],
      application: ["scotland", "england-and-wales"],
    });
    assert.equal(has(all(wrap(item)), "L7"), false);
  });
});

describe("L8 — a devolved legislature cannot make law for another jurisdiction", () => {
  test("the permitted-extent table constrains the devolved forms only", () => {
    assert.deepEqual([...FORM_PERMITTED_EXTENTS["act-of-the-scottish-parliament"]], ["scotland"]);
    assert.deepEqual([...FORM_PERMITTED_EXTENTS["act-of-senedd-cymru"]], ["wales"]);
    assert.equal(FORM_PERMITTED_EXTENTS["uk-public-general-act"], undefined);
    assert.equal(FORM_PERMITTED_EXTENTS["statutory-instrument"], undefined);
  });

  test("an Act of the Scottish Parliament extending to England is an error", () => {
    const item = act({
      instrumentForm: "act-of-the-scottish-parliament",
      extent: ["england"],
      application: ["england"],
    });
    assert.ok(has(all(wrap(item)), "L8"));
  });

  test("a Northern Ireland Statutory Rule extending outside Northern Ireland is an error", () => {
    const item = si({
      instrumentForm: "northern-ireland-statutory-rule",
      extent: ["great-britain"],
      application: ["great-britain"],
    });
    assert.ok(has(all(wrap(item)), "L8"));
  });

  test("an Act of the Scottish Parliament extending to Scotland is accepted", () => {
    const item = act({
      instrumentForm: "act-of-the-scottish-parliament",
      extent: ["scotland"],
      application: ["scotland"],
    });
    assert.equal(has(all(wrap(item)), "L8"), false);
  });

  test("a UK Public General Act may extend anywhere, because its extent genuinely varies", () => {
    const item = act({
      extent: ["great-britain", "northern-ireland"],
      application: ["great-britain"],
      extentNote: "Regulation-making powers under sections 15 and 30 extend to Northern Ireland.",
    });
    assert.equal(has(all(wrap(item)), "L8"), false);
  });
});

describe("L9 — the as-at date is what tells a reader how current the text is", () => {
  test("an absent as-at date is an error", () => {
    assert.ok(has(all(wrap(act({ sourceTextAsAtDate: undefined }))), "L9"));
  });

  test("a future as-at date is an error", () => {
    assert.ok(has(all(wrap(act({ sourceTextAsAtDate: "2027-01-01" }))), "L9"));
  });

  test("an as-at date on today is accepted", () => {
    assert.equal(has(all(wrap(act({ sourceTextAsAtDate: NOW }))), "L9"), false);
  });
});

describe("L10 — staleness is measured on OUR confirmation, not on the source's date", () => {
  test("a confirmation beyond the three-month window is a warning, not an error", () => {
    const issues = all(wrap(act({ sourceCurrencyConfirmedDate: "2026-01-01" })));
    assert.ok(has(issues, "L10"));
    assert.equal(only(issues, "L10")[0].severity, "warning");
  });

  test("an old source as-at date with a recent confirmation does NOT warn", () => {
    // The rule this replaced could only be cleared by writing a date the
    // source never claimed, which is a rule that gets switched off.
    const item = act({
      sourceTextAsAtDate: "2024-01-01",
      sourceCurrencyConfirmedDate: "2026-06-25",
    });
    assert.equal(has(all(wrap(item)), "L10"), false);
  });

  test("no confirmation date at all does not produce a staleness warning", () => {
    const item = act({ sourceCurrencyConfirmedDate: undefined });
    assert.equal(has(all(wrap(item)), "L10"), false);
  });
});

describe("L11 — a terminated instrument should say what took its place", () => {
  test("repealed with no successor and no note is a warning", () => {
    const issues = all(wrap(act({ forceStatus: "repealed", repealedDate: "2024-01-01" })));
    assert.ok(has(issues, "L11"));
    assert.equal(only(issues, "L11")[0].severity, "warning");
  });

  test("a named successor clears it", () => {
    const a = act({ slug: "a", forceStatus: "repealed", repealedDate: "2024-01-01", supersededBy: ["b"] });
    const b = act({ id: "b", slug: "b" });
    assert.equal(has(all(wrap(a, b)), "L11"), false);
  });

  test("a statusNote explaining why there is no successor also clears it", () => {
    const item = act({
      forceStatus: "repealed",
      repealedDate: "2024-01-01",
      statusNote: "Repealed without replacement; the regime was absorbed into the 2005 Order.",
    });
    assert.equal(has(all(wrap(item)), "L11"), false);
  });
});

describe("L12 — a structured warning nobody reads is not a warning", () => {
  test("outstanding effects absent from the body is a warning", () => {
    const item = act({
      outstandingEffects: [{ effect: "x", source: "legislation.gov.uk" }],
      body: "Commentary that never mentions the caveat.",
    });
    const issues = all(wrap(item));
    assert.ok(has(issues, "L12"));
    assert.equal(only(issues, "L12")[0].severity, "warning");
  });

  test("any of the accepted phrasings in the body clears it", () => {
    for (const body of [
      "Some effects are outstanding.",
      "Certain amendments have not yet been applied to the revised text.",
      "There are unapplied effects on the official text.",
      "Changes not yet incorporated into the published version.",
    ]) {
      const item = act({
        outstandingEffects: [{ effect: "x", source: "legislation.gov.uk" }],
        body,
      });
      assert.equal(has(all(wrap(item)), "L12"), false, `not cleared by: ${body}`);
    }
  });

  test("no recorded effects means nothing to warn about", () => {
    assert.equal(has(all(wrap(act({ body: "Nothing to see." }))), "L12"), false);
  });
});

describe("L13 — there is exactly one official source for UK legislation", () => {
  test("the host constant is legislation.gov.uk", () => {
    assert.equal(LEGISLATION_OFFICIAL_HOST, "legislation.gov.uk");
  });

  test("a link anywhere else is an ERROR, not a warning", () => {
    const issues = all(
      wrap(act({ officialSourceUrl: "https://www.gov.uk/guidance/fire-safety" }))
    );
    assert.ok(has(issues, "L13"));
    assert.equal(only(issues, "L13")[0].severity, "error");
  });

  test("a subdomain of the official host is accepted", () => {
    const item = act({ officialSourceUrl: "https://www.legislation.gov.uk/uksi/2022/547/made" });
    assert.equal(has(all(wrap(item)), "L13"), false);
  });
});

describe("L14 — content left pointing at legislation that no longer stands", () => {
  const repealed = act({ slug: "old", forceStatus: "repealed", repealedDate: "2024-01-01", statusNote: "x" });

  test("a published Guide referencing a repealed instrument is a warning", () => {
    const c = {
      legislation: [repealed],
      guides: [{ id: "g", slug: "g", status: "published", relatedLegislation: ["old"] }],
    };
    const issues = checkLegislationReferenceCurrency(c);
    assert.ok(has(issues, "L14"));
    assert.equal(only(issues, "L14")[0].severity, "warning");
    assert.equal(only(issues, "L14")[0].collection, "guides");
  });

  test("a Standard referencing a not-yet-in-force instrument is also flagged", () => {
    const pending = act({ slug: "new", forceStatus: "not-yet-in-force", commencement: [], inForceDate: undefined });
    const c = {
      legislation: [pending],
      standards: [{ id: "s", slug: "s", status: "published", relatedLegislation: ["new"] }],
    };
    assert.ok(has(checkLegislationReferenceCurrency(c), "L14"));
  });

  test("acknowledging the slug records the review and clears the warning", () => {
    const c = {
      legislation: [repealed],
      guides: [
        {
          id: "g",
          slug: "g",
          status: "published",
          relatedLegislation: ["old"],
          acknowledgedNonCurrentDocuments: ["old"],
        },
      ],
    };
    assert.deepEqual(checkLegislationReferenceCurrency(c), []);
  });

  test("an unpublished page is not nagged about", () => {
    const c = {
      legislation: [repealed],
      guides: [{ id: "g", slug: "g", status: "draft", relatedLegislation: ["old"] }],
    };
    assert.deepEqual(checkLegislationReferenceCurrency(c), []);
  });

  test("the rule does not fire on legislation referencing legislation", () => {
    const c = { legislation: [repealed, act({ slug: "b", relatedLegislation: ["old"] })] };
    assert.deepEqual(checkLegislationReferenceCurrency(c), []);
  });

  test("an in-force reference is never flagged", () => {
    const c = {
      legislation: [act({ slug: "live" })],
      guides: [{ id: "g", slug: "g", status: "published", relatedLegislation: ["live"] }],
    };
    assert.deepEqual(checkLegislationReferenceCurrency(c), []);
  });
});

describe("L15 — commencement coherence", () => {
  test("a commencement event dated in the future is an error", () => {
    const item = act({
      commencement: [{ date: "2027-01-01", scope: "fully" }],
      inForceDate: "2027-01-01",
    });
    assert.ok(has(all(wrap(item)), "L15"));
  });

  test("inForceDate disagreeing with the first commencement event is an error", () => {
    const item = act({
      commencement: [{ date: "2021-01-01", scope: "fully" }],
      inForceDate: "2020-06-01",
    });
    assert.ok(has(all(wrap(item)), "L15"));
  });

  test("inForceDate absent with staged commencement is accepted", () => {
    const item = act({
      forceStatus: "partially-in-force",
      commencement: [
        { date: "2022-06-28", scope: "Part 1" },
        { date: "2023-10-01", scope: "Part 4" },
      ],
      inForceDate: undefined,
      notYetInForce: [{ provision: "section 156(4)", note: "Not yet commenced." }],
    });
    assert.equal(has(all(wrap(item)), "L15"), false);
  });

  test("a provision not yet in force is not treated as a future commencement event", () => {
    // The distinction matters: something uncommenced belongs in notYetInForce,
    // and recording it there must not trip the future-date rule.
    const item = act({
      forceStatus: "partially-in-force",
      notYetInForce: [{ provision: "section 156(4)", note: "No commencement date has been set." }],
    });
    assert.equal(has(all(wrap(item)), "L15"), false);
  });
});

describe("The publication gate on legislation", () => {
  const gate = (overrides) =>
    checkDocumentPublicationGate(wrap(act(overrides)), { now: NOW }).filter(
      (i) => i.rule === "G13"
    );

  test("every field on the legislation list is genuinely required", () => {
    for (const field of PUBLICATION_GATE_FIELDS.legislation) {
      const issues = gate({ [field]: undefined });
      assert.equal(issues.length, 1, `removing ${field} did not fail the gate`);
      assert.match(issues[0].message, new RegExp(field));
    }
  });

  test("extent or application present but empty also fails", () => {
    assert.equal(gate({ extent: [] }).length, 1);
    assert.equal(gate({ application: [] }).length, 1);
  });

  test("outstandingEffectsChecked: false is a valid answer, not a missing one", () => {
    assert.deepEqual(gate({ outstandingEffectsChecked: false }), []);
  });

  test("a draft is not gated", () => {
    assert.deepEqual(gate({ status: "draft", forceStatus: undefined }), []);
  });

  test("no edition is ever demanded of an instrument", () => {
    const issues = checkDocumentPublicationGate(wrap(act({ currentEdition: undefined })), {
      now: NOW,
    });
    assert.deepEqual(issues, []);
  });
});

describe("The G-series rules that read documentStatus are scoped away from legislation", () => {
  test("no G-rule complains about an instrument having no documentStatus", async () => {
    const { checkDocumentLifecycle, checkReferencedDocumentCurrency } = await import(
      "../lib/editorial-validation"
    );
    const c = wrap(act(), si());
    assert.deepEqual(checkDocumentLifecycle(c, { now: NOW }), []);
    assert.deepEqual(checkReferencedDocumentCurrency(c), []);
  });

  test("G16 does not fire on an amendment correctly recorded as not yet in force", async () => {
    const { checkDocumentLifecycle } = await import("../lib/editorial-validation");
    const item = act({
      amendments: [
        { reference: "future", date: "2027-04-01", summary: "Not yet commenced.", inForce: false },
      ],
    });
    assert.deepEqual(checkDocumentLifecycle(wrap(item), { now: NOW }), []);
  });

  test("G16 still fires on an amendment claimed to be in force in the future", async () => {
    const { checkDocumentLifecycle } = await import("../lib/editorial-validation");
    const item = act({
      amendments: [
        { reference: "typo", date: "2027-04-01", summary: "Dated wrong.", inForce: true },
      ],
    });
    assert.ok(
      checkDocumentLifecycle(wrap(item), { now: NOW }).some((i) => i.rule === "G16"),
      "the exemption must not switch the rule off wholesale"
    );
  });
});

// ---------------------------------------------------------------------------
// Lifecycle and commencement, exercised through a REAL Velite build.
//
// The in-memory fixtures above bypass Velite entirely, which means they prove
// the rules and not the schema. Nothing in the launch set is repealed or
// revoked, and the owner's instruction was explicit that a page must not be
// added to the live library solely to exercise a lifecycle value — so these
// states are exercised by a dedicated fixture scenario instead.
//
// What this proves that the object fixtures cannot: that the schema ACCEPTS
// forceStatus repealed and revoked, that repealedDate and revokedDate survive
// to Velite's output on the correct tier, that staged commencement across two
// dates and two jurisdictions round-trips, and that an amendment recorded as
// not yet in force keeps its false flag rather than picking up the default.
// ---------------------------------------------------------------------------

describe("Lifecycle and commencement — a real Velite build", () => {
  const OUT = path.join(
    repoRoot,
    "tests/fixtures-config/.velite-test-output/legislation-lifecycle/legislation.json"
  );
  let built;

  before(() => {
    execFileSync(
      "npx",
      [
        "velite",
        "build",
        "--config",
        path.join("tests", "fixtures-config", "legislation-lifecycle.velite.config.ts"),
        "--strict",
        "--clean",
        "--silent",
      ],
      { cwd: repoRoot, stdio: "pipe" }
    );
    built = JSON.parse(fs.readFileSync(OUT, "utf8"));
  });

  const get = (slug) => built.find((i) => i.slug === slug);

  test("the fixture set builds cleanly under --strict", () => {
    assert.equal(built.length, 2);
  });

  test("a repealed Act keeps its status and its repeal date", () => {
    const item = get("fixture-repealed-act");
    assert.equal(item.forceStatus, "repealed");
    assert.equal(String(item.repealedDate).slice(0, 10), "2005-04-01");
    assert.equal(item.revokedDate, undefined);
    assert.equal(item.legislationTier, "primary");
  });

  test("a revoked statutory instrument keeps its status and its revocation date", () => {
    const item = get("fixture-revoked-regulations");
    assert.equal(item.forceStatus, "revoked");
    assert.equal(String(item.revokedDate).slice(0, 10), "2020-01-01");
    assert.equal(item.repealedDate, undefined);
    assert.equal(item.legislationTier, "secondary");
  });

  test("staged commencement round-trips with its scope, jurisdiction and commencing instrument", () => {
    const events = get("fixture-repealed-act").commencement;
    assert.equal(events.length, 2);
    assert.equal(events[0].scope, "sections 1 to 10");
    assert.equal(events[0].broughtInBy, "S.I. 1990/9999");
    assert.equal(events[0].jurisdiction, undefined);
    assert.equal(events[1].jurisdiction, "scotland");
  });

  test("an amendment recorded as not yet in force keeps the false flag", () => {
    const [amendment] = get("fixture-revoked-regulations").amendments;
    assert.equal(amendment.inForce, false);
    // And the default still applies where the author says nothing.
    assert.equal(get("fixture-repealed-act").amendments[0].inForce, true);
  });

  test("sourceTextAsAtDateStated: false survives, and true is the default", () => {
    assert.equal(get("fixture-revoked-regulations").sourceTextAsAtDateStated, false);
    assert.equal(get("fixture-repealed-act").sourceTextAsAtDateStated, true);
  });

  test("extent wider than application survives with its explanatory note", () => {
    const item = get("fixture-repealed-act");
    assert.deepEqual(item.extent, ["great-britain", "northern-ireland"]);
    assert.deepEqual(item.application, ["great-britain"]);
    assert.ok(item.extentNote.length > 0);
  });

  test("the amends relation resolves across the fixture pair", () => {
    assert.deepEqual(get("fixture-revoked-regulations").amends, ["fixture-repealed-act"]);
    assert.deepEqual(get("fixture-repealed-act").supersededBy, ["fixture-revoked-regulations"]);
  });

  test("the whole fixture set passes every L rule, errors and warnings alike", () => {
    const issues = all({ legislation: built }, { now: "2026-07-01" });
    assert.deepEqual(
      issues.map((i) => `${i.rule}: ${i.message}`),
      [],
      "the lifecycle fixture is meant to be a legally coherent pair, not a broken one"
    );
  });

  test("and passes the publication gate and the G-series document rules", async () => {
    const { checkDocumentLifecycle } = await import("../lib/editorial-validation");
    const c = { legislation: built };
    assert.deepEqual(checkDocumentPublicationGate(c, { now: "2026-07-01" }), []);
    assert.deepEqual(checkDocumentProvenance(c), []);
    assert.deepEqual(checkDocumentLifecycle(c, { now: "2026-07-01" }), []);
  });
});

describe("The real content passes every L rule", () => {
  test("the eight launch instruments produce no L-series error", async () => {
    const { legislation, guides, standards, glossaryTerms, news, downloads } = await import(
      "../.velite"
    );
    const c = { legislation, guides, standards, glossaryTerms, news, downloads };
    const issues = all(c, {});
    const errors = issues.filter((i) => i.severity === "error");
    assert.deepEqual(
      errors.map((i) => `${i.rule} ${i.slug ?? ""}: ${i.message}`),
      []
    );
  });

  test("and no L-series warning either, so the audit gate stays green", async () => {
    const { legislation, guides, standards, glossaryTerms, news, downloads } = await import(
      "../.velite"
    );
    const c = { legislation, guides, standards, glossaryTerms, news, downloads };
    assert.deepEqual(
      all(c, {}).map((i) => `${i.rule}: ${i.message}`),
      []
    );
  });
});
