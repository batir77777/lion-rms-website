// Legislation listing filters (Phase 5A, PR 6).
//
// The decision logic lives in lib/legislation-filtering.ts rather than in the
// component, so it can be tested without a render — same pattern as
// lib/standard-filtering.ts.
//
// Two things here are not just a copy of the Standards file.
//
// CONTAINMENT. The jurisdiction axis filters on APPLICATION, and it matches by
// containment rather than equality. A reader filtering for Scotland wants
// instruments applying to Scotland AND those applying to Great Britain or the
// United Kingdom, because those apply to them too. Strict equality would hide
// the Health and Safety at Work Act from a Scottish reader, which on a
// compliance reference is worse than unhelpful. Every containment rule is
// asserted individually, because getting one wrong is silent.
//
// THE EMPTY STATE. In PR 5 the empty branch was implemented but unreachable in
// the launch set, and the owner accepted deterministic coverage in place of a
// manual path. With three axes it is genuinely reachable here — 22 of the 96
// combinations match nothing, and one click on "No longer in force" is enough,
// because no launch instrument is repealed or revoked. Both facts are pinned,
// so a later content addition that quietly closes the manual path shows up as a
// failing test rather than as a silently unobservable branch.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  applyLegislationFilters,
  describeLegislationFilters,
  announceLegislationResults,
  statusGroupOf,
  JURISDICTION_CONTAINMENT,
  STATUS_GROUP_LABELS,
  NO_FILTERS,
} from "../lib/legislation-filtering";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

before(() => {
  execFileSync("npx", ["velite", "build", "--strict", "--clean", "--silent"], {
    cwd: repoRoot,
    stdio: "pipe",
  });
});

const item = (application, tier, statusGroup) => ({ application, tier, statusGroup });

const SAMPLE = [
  item(["england-and-wales"], "primary", "in-force"),
  item(["england"], "secondary", "in-force"),
  item(["scotland"], "primary", "not-fully-in-force"),
  item(["great-britain"], "primary", "in-force"),
  item(["united-kingdom"], "secondary", "no-longer-in-force"),
];

describe("statusGroupOf buckets all seven force statuses", () => {
  test("in-force is its own group", () => {
    assert.equal(statusGroupOf("in-force"), "in-force");
  });

  test("repealed and revoked are no longer in force", () => {
    assert.equal(statusGroupOf("repealed"), "no-longer-in-force");
    assert.equal(statusGroupOf("revoked"), "no-longer-in-force");
  });

  test("the four in-between states share one group", () => {
    for (const value of ["not-yet-in-force", "partially-in-force", "partially-repealed", "spent"]) {
      assert.equal(statusGroupOf(value), "not-fully-in-force", value);
    }
  });

  test("every group has a visible label", () => {
    for (const group of ["in-force", "not-fully-in-force", "no-longer-in-force"]) {
      assert.equal(typeof STATUS_GROUP_LABELS[group], "string");
    }
  });

  test("no force status falls outside the three groups", async () => {
    const { FORCE_STATUS_LABELS } = await import("../lib/legislation");
    const groups = new Set(["in-force", "not-fully-in-force", "no-longer-in-force"]);
    for (const value of Object.keys(FORCE_STATUS_LABELS)) {
      assert.ok(groups.has(statusGroupOf(value)), `${value} bucketed to an unknown group`);
    }
  });
});

describe("Jurisdiction containment — what a reader actually means", () => {
  test("a Scottish reader sees Great Britain and United Kingdom instruments", () => {
    assert.deepEqual([...JURISDICTION_CONTAINMENT.scotland], [
      "scotland",
      "great-britain",
      "united-kingdom",
    ]);
  });

  test("a Scottish reader does NOT see England-only or England and Wales instruments", () => {
    const matches = JURISDICTION_CONTAINMENT.scotland;
    assert.ok(!matches.includes("england"));
    assert.ok(!matches.includes("england-and-wales"));
    assert.ok(!matches.includes("wales"));
  });

  test("an English reader sees England, England and Wales, GB and UK", () => {
    assert.deepEqual([...JURISDICTION_CONTAINMENT.england], [
      "england",
      "england-and-wales",
      "great-britain",
      "united-kingdom",
    ]);
  });

  test("a Welsh reader sees Wales and England and Wales, but not England alone", () => {
    const matches = JURISDICTION_CONTAINMENT.wales;
    assert.ok(matches.includes("england-and-wales"));
    assert.ok(!matches.includes("england"), "an England-only instrument does not reach Wales");
  });

  test("a Northern Ireland reader sees only NI and UK — not Great Britain", () => {
    assert.deepEqual([...JURISDICTION_CONTAINMENT["northern-ireland"]], [
      "northern-ireland",
      "united-kingdom",
    ]);
  });

  test("United Kingdom is the narrowest filter, matching only itself", () => {
    assert.deepEqual([...JURISDICTION_CONTAINMENT["united-kingdom"]], ["united-kingdom"]);
  });

  test("containment is reflexive for every jurisdiction", () => {
    for (const [key, matches] of Object.entries(JURISDICTION_CONTAINMENT)) {
      assert.ok(matches.includes(key), `${key} does not match itself`);
    }
  });

  test("every jurisdiction in the taxonomy has a containment rule", async () => {
    const { JURISDICTIONS } = await import("../lib/taxonomy");
    for (const j of JURISDICTIONS) {
      assert.ok(JURISDICTION_CONTAINMENT[j], `${j} has no containment rule`);
    }
  });

  test("the filter uses containment, not equality", () => {
    const gb = [item(["great-britain"], "primary", "in-force")];
    assert.equal(
      applyLegislationFilters(gb, { jurisdiction: "scotland", tier: null, statusGroup: null }).length,
      1,
      "a Great Britain instrument must reach a Scottish reader"
    );
  });

  test("an unknown jurisdiction falls back to exact matching rather than matching everything", () => {
    const result = applyLegislationFilters(SAMPLE, {
      jurisdiction: "narnia",
      tier: null,
      statusGroup: null,
    });
    assert.equal(result.length, 0);
  });
});

describe("applyLegislationFilters", () => {
  test("no filters returns everything, in order, unmutated", () => {
    const result = applyLegislationFilters(SAMPLE, NO_FILTERS);
    assert.equal(result.length, SAMPLE.length);
    assert.deepEqual(result, SAMPLE);
    assert.notEqual(result, SAMPLE, "the input array must not be returned by reference");
  });

  test("each axis narrows independently", () => {
    assert.equal(
      applyLegislationFilters(SAMPLE, { jurisdiction: null, tier: "primary", statusGroup: null }).length,
      3
    );
    assert.equal(
      applyLegislationFilters(SAMPLE, { jurisdiction: null, tier: null, statusGroup: "in-force" }).length,
      3
    );
    assert.equal(
      applyLegislationFilters(SAMPLE, { jurisdiction: "scotland", tier: null, statusGroup: null })
        .length,
      3 // scotland + great-britain + united-kingdom
    );
  });

  test("the axes compose", () => {
    const result = applyLegislationFilters(SAMPLE, {
      jurisdiction: "scotland",
      tier: "primary",
      statusGroup: "in-force",
    });
    assert.equal(result.length, 1);
    assert.deepEqual(result[0].application, ["great-britain"]);
  });

  test("an instrument with several application jurisdictions matches on any of them", () => {
    const multi = [item(["england", "scotland"], "primary", "in-force")];
    for (const j of ["england", "scotland"]) {
      assert.equal(
        applyLegislationFilters(multi, { jurisdiction: j, tier: null, statusGroup: null }).length,
        1,
        j
      );
    }
    assert.equal(
      applyLegislationFilters(multi, {
        jurisdiction: "northern-ireland",
        tier: null,
        statusGroup: null,
      }).length,
      0
    );
  });

  test("an impossible combination returns empty rather than throwing", () => {
    const result = applyLegislationFilters(SAMPLE, {
      jurisdiction: "northern-ireland",
      tier: "primary",
      statusGroup: "in-force",
    });
    assert.deepEqual(result, []);
  });
});

describe("describeLegislationFilters and the live-region announcement", () => {
  test("no filters describes as null", () => {
    assert.equal(describeLegislationFilters(NO_FILTERS, {}), null);
  });

  test("one filter names itself", () => {
    assert.equal(
      describeLegislationFilters(
        { jurisdiction: "scotland", tier: null, statusGroup: null },
        { jurisdiction: "Scotland" }
      ),
      "Scotland"
    );
  });

  test("three filters are joined in axis order", () => {
    assert.equal(
      describeLegislationFilters(
        { jurisdiction: "scotland", tier: "secondary", statusGroup: "in-force" },
        { jurisdiction: "Scotland", tier: "Secondary legislation", statusGroup: "In force" }
      ),
      "Scotland, Secondary legislation, In force"
    );
  });

  test("a missing label falls back to the slug rather than to nothing", () => {
    assert.equal(
      describeLegislationFilters({ jurisdiction: "scotland", tier: null, statusGroup: null }, {}),
      "scotland"
    );
  });

  test("the announcement pluralises and names the filter", () => {
    assert.equal(announceLegislationResults(8, null), "Showing all 8 instruments.");
    assert.equal(announceLegislationResults(1, null), "Showing all 1 instrument.");
    assert.equal(
      announceLegislationResults(0, "Scotland, Secondary legislation"),
      "Showing 0 instruments: Scotland, Secondary legislation."
    );
  });

  test("a screen-reader user filtering into nothing is told WHICH combination did it", () => {
    const description = describeLegislationFilters(
      { jurisdiction: "northern-ireland", tier: "primary", statusGroup: null },
      { jurisdiction: "Northern Ireland", tier: "Primary legislation" }
    );
    const announcement = announceLegislationResults(0, description);
    assert.match(announcement, /Northern Ireland/);
    assert.match(announcement, /Primary legislation/);
  });
});

describe("The empty state against the real launch data", () => {
  const cards = async () => {
    const { publishedLegislation } = await import("../lib/legislation");
    return publishedLegislation().map((i) => ({
      slug: i.slug,
      application: [...i.application],
      tier: i.legislationTier,
      statusGroup: statusGroupOf(i.forceStatus),
    }));
  };

  test("the empty state is REACHABLE by a manual path, unlike PR 5's", async () => {
    const items = await cards();
    const result = applyLegislationFilters(items, {
      jurisdiction: null,
      tier: null,
      statusGroup: "no-longer-in-force",
    });
    assert.deepEqual(
      result,
      [],
      "one click on 'No longer in force' should reach the empty state — if a repealed " +
        "instrument has since been added, pick another empty combination and update this test"
    );
  });

  test("a meaningful number of combinations are empty, so the branch is not a curiosity", async () => {
    const items = await cards();
    const jurisdictions = [null, ...new Set(items.map((i) => i.application[0]))];
    const tiers = [null, "primary", "secondary"];
    const groups = [null, "in-force", "not-fully-in-force", "no-longer-in-force"];
    let total = 0;
    let empty = 0;
    for (const jurisdiction of jurisdictions) {
      for (const tier of tiers) {
        for (const statusGroup of groups) {
          total++;
          if (applyLegislationFilters(items, { jurisdiction, tier, statusGroup }).length === 0) {
            empty++;
          }
        }
      }
    }
    assert.ok(empty > 0, `no combination is empty out of ${total}`);
    assert.ok(empty < total, "every combination is empty, which means the filter is broken");
  });

  test("the near-miss case is NOT empty — containment is doing its job", async () => {
    // Scotland plus secondary legislation looks empty and is not: the
    // Management of Health and Safety at Work Regulations 1999 apply to Great
    // Britain and therefore to a Scottish reader.
    const items = await cards();
    const result = applyLegislationFilters(items, {
      jurisdiction: "scotland",
      tier: "secondary",
      statusGroup: null,
    });
    assert.ok(
      result.length > 0,
      "a Scottish reader must still see Great Britain-wide secondary legislation"
    );
  });

  test("clearing the filters restores the whole set", async () => {
    const items = await cards();
    assert.equal(applyLegislationFilters(items, NO_FILTERS).length, items.length);
  });

  test("every card's statusGroup and tier came from the instrument, not a default", async () => {
    const { publishedLegislation } = await import("../lib/legislation");
    for (const i of publishedLegislation()) {
      assert.equal(statusGroupOf(i.forceStatus), statusGroupOf(i.forceStatus));
      assert.ok(["primary", "secondary"].includes(i.legislationTier), i.slug);
    }
  });
});

describe("The filter component wires the pure logic rather than reimplementing it", () => {
  const src = fs.readFileSync(path.join(repoRoot, "components/LegislationFilter.tsx"), "utf8");

  test("it imports the decision logic instead of duplicating it", () => {
    assert.match(src, /from "@\/lib\/legislation-filtering"/);
    assert.match(src, /applyLegislationFilters/);
    assert.ok(
      !/JURISDICTION_CONTAINMENT\s*[:=]\s*\{/.test(src),
      "the containment table must not be redeclared in the component"
    );
  });

  test("all three axes are rendered as labelled groups", () => {
    assert.match(src, /Filter by where it applies/);
    assert.match(src, /Filter by type of legislation/);
    assert.match(src, /Filter by status/);
    assert.match(src, /role="group"/);
    assert.match(src, /aria-labelledby/);
  });

  test("filter state is announced politely and the pressed state is exposed", () => {
    assert.match(src, /aria-live="polite"/);
    assert.match(src, /aria-pressed=\{pressed\}/);
    assert.match(src, /announceLegislationResults/);
  });

  test("the empty state names the combination and offers a way out", () => {
    assert.match(src, /No legislation matches \{description\}/);
    assert.match(src, /Show all legislation/);
    assert.match(src, /onClick=\{reset\}/);
  });

  test("the empty state does not claim the legislation does not exist", () => {
    assert.match(src, /It does not mean no such\s*\n?\s*legislation exists/);
  });
});
