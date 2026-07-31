// News listing filters (Phase 5A, PR 7).
//
// Decision logic lives in lib/news-filtering.ts rather than the component, so
// it can be tested without a render — the same pattern as Standards and
// Legislation.
//
// Two axes here rather than Legislation's three, and the omission is the
// interesting part: year is deliberately NOT a filter, because it is already a
// real route at /news/[year]. Duplicating it would give the same content two
// addresses, one of which crawlers cannot reach.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  applyNewsFilters,
  describeNewsFilters,
  announceNewsResults,
  NO_FILTERS,
} from "../lib/news-filtering";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

before(() => {
  execFileSync("npx", ["velite", "build", "--strict", "--clean", "--silent"], {
    cwd: repoRoot,
    stdio: "pipe",
  });
});

const make = (format, category) => ({ format, category });

const SAMPLE = [
  make("single-item", "enforcement"),
  make("single-item", "prosecution"),
  make("monthly-roundup", "regulatory-change"),
  make("single-item", "consultation"),
  make("monthly-roundup", "enforcement"),
];

describe("applyNewsFilters", () => {
  test("no filters returns everything, unmutated and not by reference", () => {
    const result = applyNewsFilters(SAMPLE, NO_FILTERS);
    assert.deepEqual(result, SAMPLE);
    assert.notEqual(result, SAMPLE);
  });

  test("each axis narrows independently", () => {
    assert.equal(
      applyNewsFilters(SAMPLE, { format: "monthly-roundup", category: null }).length,
      2
    );
    assert.equal(applyNewsFilters(SAMPLE, { format: null, category: "enforcement" }).length, 2);
  });

  test("the axes compose", () => {
    const result = applyNewsFilters(SAMPLE, {
      format: "monthly-roundup",
      category: "enforcement",
    });
    assert.equal(result.length, 1);
  });

  test("an impossible combination returns empty rather than throwing", () => {
    assert.deepEqual(
      applyNewsFilters(SAMPLE, { format: "monthly-roundup", category: "consultation" }),
      []
    );
  });

  test("an unknown value matches nothing rather than everything", () => {
    assert.deepEqual(applyNewsFilters(SAMPLE, { format: "podcast", category: null }), []);
  });
});

describe("describeNewsFilters and the live-region announcement", () => {
  test("no filters describes as null", () => {
    assert.equal(describeNewsFilters(NO_FILTERS, {}), null);
  });

  test("one filter names itself", () => {
    assert.equal(
      describeNewsFilters({ format: "monthly-roundup", category: null }, { format: "Monthly round-up" }),
      "Monthly round-up"
    );
  });

  test("two filters are joined in axis order", () => {
    assert.equal(
      describeNewsFilters(
        { format: "monthly-roundup", category: "enforcement" },
        { format: "Monthly round-up", category: "Enforcement" }
      ),
      "Monthly round-up, Enforcement"
    );
  });

  test("a missing label falls back to the slug rather than to nothing", () => {
    assert.equal(describeNewsFilters({ format: "single-item", category: null }, {}), "single-item");
  });

  test("the announcement pluralises and names the filter", () => {
    assert.equal(announceNewsResults(10, null), "Showing all 10 items.");
    assert.equal(announceNewsResults(1, null), "Showing all 1 item.");
    assert.equal(
      announceNewsResults(0, "Monthly round-up, Consultation"),
      "Showing 0 items: Monthly round-up, Consultation."
    );
  });

  test("a reader filtering into nothing is told WHICH combination did it", () => {
    const description = describeNewsFilters(
      { format: "monthly-roundup", category: "product-recall" },
      { format: "Monthly round-up", category: "Product recall" }
    );
    const announcement = announceNewsResults(0, description);
    assert.match(announcement, /Monthly round-up/);
    assert.match(announcement, /Product recall/);
  });
});

describe("Against the real launch data", () => {
  const cards = async () => {
    const { publishedNews } = await import("../lib/news");
    return publishedNews().map((i) => ({
      slug: i.slug,
      format: i.newsFormat,
      category: i.newsCategory,
    }));
  };

  test("no filters shows all ten", async () => {
    assert.equal(applyNewsFilters(await cards(), NO_FILTERS).length, 10);
  });

  test("the empty state is reachable by a real combination", async () => {
    const items = await cards();
    // A round-up is never a product recall in the launch set: round-ups
    // summarise a month, and a recall is reported as its own item.
    assert.deepEqual(
      applyNewsFilters(items, { format: "monthly-roundup", category: "product-recall" }),
      []
    );
  });

  test("several combinations are empty, so the branch is not a curiosity", async () => {
    const items = await cards();
    const formats = [null, "single-item", "monthly-roundup"];
    const categories = [
      null,
      "enforcement",
      "prosecution",
      "consultation",
      "standards-update",
      "product-recall",
      "government-guidance",
      "regulatory-change",
    ];
    let total = 0;
    let empty = 0;
    for (const format of formats) {
      for (const category of categories) {
        total++;
        if (applyNewsFilters(items, { format, category }).length === 0) empty++;
      }
    }
    assert.ok(empty > 0, `no combination is empty out of ${total}`);
    assert.ok(empty < total, "every combination is empty — the filter is broken");
  });

  test("every single-item category is individually reachable", async () => {
    const items = await cards();
    for (const category of [
      "enforcement",
      "prosecution",
      "consultation",
      "standards-update",
      "product-recall",
      "government-guidance",
      "regulatory-change",
    ]) {
      assert.ok(
        applyNewsFilters(items, { format: null, category }).length > 0,
        `${category} matches nothing`
      );
    }
  });
});

describe("The component wires the pure logic rather than reimplementing it", () => {
  const src = fs.readFileSync(path.join(repoRoot, "components/NewsFilter.tsx"), "utf8");

  test("it imports the decision logic instead of duplicating it", () => {
    assert.match(src, /from "@\/lib\/news-filtering"/);
    assert.match(src, /applyNewsFilters/);
  });

  test("both axes are rendered as labelled groups", () => {
    assert.match(src, /Filter by type of item/);
    assert.match(src, /Filter by subject/);
    assert.match(src, /role="group"/);
    assert.match(src, /aria-labelledby/);
  });

  test("there is no year filter — year is a route, not a facet", () => {
    assert.ok(!/Filter by year/i.test(src), "year must not be duplicated as a filter");
  });

  test("filter state is announced politely and the pressed state is exposed", () => {
    assert.match(src, /aria-live="polite"/);
    assert.match(src, /aria-pressed=\{pressed\}/);
    assert.match(src, /announceNewsResults/);
  });

  test("the empty state names the combination and offers a way out", () => {
    assert.match(src, /No items match \{description\}/);
    assert.match(src, /Show all news/);
    assert.match(src, /onClick=\{reset\}/);
  });

  test("the empty state does not claim nothing has happened", () => {
    assert.match(src, /It does not mean nothing\s*\n?\s*has happened/);
  });

  test("the listing links every archive year as a real destination", () => {
    const listing = fs.readFileSync(path.join(repoRoot, "app/news/page.tsx"), "utf8");
    assert.match(listing, /News archive by year/);
    assert.match(listing, /\$\{NEWS_PATH\}\/\$\{y\.year\}/);
  });
});
