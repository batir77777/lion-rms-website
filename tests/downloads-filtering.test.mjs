// Downloads listing filters (Phase 5A, PR 8A).
//
// Decision logic lives in lib/downloads-filtering.ts rather than the component,
// so it can be tested without a render — the same pattern as Standards,
// Legislation and News.
//
// Two axes here, and the second one is the interesting choice. Format is a
// filter because a reader on this page usually has a constraint before they
// have a preference: something to print for a clipboard, or something to type
// into. Category is deliberately NOT an axis — every resource sits in fire
// safety or health and safety, so it would split the library into two piles and
// tell the reader nothing they could not already see.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  applyDownloadFilters,
  describeDownloadFilters,
  announceDownloadResults,
  NO_FILTERS,
} from "../lib/downloads-filtering";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

before(() => {
  execFileSync("npx", ["velite", "build", "--strict", "--clean", "--silent"], {
    cwd: repoRoot,
    stdio: "pipe",
  });
});

const make = (resourceType, formats) => ({ resourceType, formats });

const SAMPLE = [
  make("checklist", ["html", "pdf"]),
  make("checklist", ["pdf"]),
  make("record-form", ["pdf", "xlsx"]),
  make("logbook", ["pdf"]),
  make("inspection-form", ["pdf", "docx"]),
];

describe("applyDownloadFilters", () => {
  test("no filters returns everything, unmutated and not by reference", () => {
    const result = applyDownloadFilters(SAMPLE, NO_FILTERS);
    assert.deepEqual(result, SAMPLE);
    assert.notEqual(result, SAMPLE);
  });

  test("each axis narrows independently", () => {
    assert.equal(
      applyDownloadFilters(SAMPLE, { resourceType: "checklist", format: null }).length,
      2
    );
    assert.equal(applyDownloadFilters(SAMPLE, { resourceType: null, format: "xlsx" }).length, 1);
  });

  test("the format axis matches ANY of a resource's formats, not just the first", () => {
    // A resource offering PDF and XLSX must appear under both, or the filter
    // hides exactly the resources that are most useful.
    assert.equal(applyDownloadFilters(SAMPLE, { resourceType: null, format: "pdf" }).length, 5);
    assert.equal(applyDownloadFilters(SAMPLE, { resourceType: null, format: "docx" }).length, 1);
  });

  test("the axes compose", () => {
    const result = applyDownloadFilters(SAMPLE, { resourceType: "record-form", format: "xlsx" });
    assert.equal(result.length, 1);
  });

  test("an impossible combination returns empty rather than throwing", () => {
    assert.deepEqual(applyDownloadFilters(SAMPLE, { resourceType: "logbook", format: "docx" }), []);
  });

  test("an unknown value matches nothing rather than everything", () => {
    assert.deepEqual(applyDownloadFilters(SAMPLE, { resourceType: "poster", format: null }), []);
    assert.deepEqual(applyDownloadFilters(SAMPLE, { resourceType: null, format: "odt" }), []);
  });
});

describe("describeDownloadFilters and the live-region announcement", () => {
  test("no filters describes as null", () => {
    assert.equal(describeDownloadFilters(NO_FILTERS, {}), null);
  });

  test("one filter names itself", () => {
    assert.equal(
      describeDownloadFilters({ resourceType: "checklist", format: null }, { resourceType: "Checklist" }),
      "Checklist"
    );
  });

  test("two filters are joined in axis order", () => {
    assert.equal(
      describeDownloadFilters(
        { resourceType: "record-form", format: "xlsx" },
        { resourceType: "Record form", format: "Excel" }
      ),
      "Record form, Excel"
    );
  });

  test("a missing label falls back to the slug rather than to nothing", () => {
    assert.equal(describeDownloadFilters({ resourceType: "logbook", format: null }, {}), "logbook");
  });

  test("the announcement pluralises and names the filter", () => {
    assert.equal(announceDownloadResults(7, null), "Showing all 7 resources.");
    assert.equal(announceDownloadResults(1, null), "Showing all 1 resource.");
    assert.equal(
      announceDownloadResults(0, "Logbook, Word"),
      "Showing 0 resources: Logbook, Word."
    );
  });

  test("a reader filtering into nothing is told WHICH combination did it", () => {
    const description = describeDownloadFilters(
      { resourceType: "logbook", format: "docx" },
      { resourceType: "Logbook", format: "Word" }
    );
    const announcement = announceDownloadResults(0, description);
    assert.match(announcement, /Logbook/);
    assert.match(announcement, /Word/);
  });
});

describe("Against the real launch data", () => {
  const cards = async () => {
    const { publishedDownloads, deliveryFormats, hasPrintableHtml } = await import(
      "../lib/downloads"
    );
    return publishedDownloads().map((d) => {
      const formats = deliveryFormats(d).map((f) => f.format);
      if (hasPrintableHtml(d)) formats.push("html");
      return { slug: d.slug, resourceType: d.resourceType, formats: [...new Set(formats)] };
    });
  };

  test("no filters shows everything published", async () => {
    const { publishedDownloads } = await import("../lib/downloads");
    assert.equal(
      applyDownloadFilters(await cards(), NO_FILTERS).length,
      publishedDownloads().length
    );
  });

  test("every resource is reachable by its own type", async () => {
    const items = await cards();
    for (const item of items) {
      assert.ok(
        applyDownloadFilters(items, { resourceType: item.resourceType, format: null }).some(
          (i) => i.slug === item.slug
        ),
        `${item.slug} is unreachable by its own type`
      );
    }
  });

  test("every resource is reachable by each format it offers", async () => {
    const items = await cards();
    for (const item of items) {
      for (const format of item.formats) {
        assert.ok(
          applyDownloadFilters(items, { resourceType: null, format }).some(
            (i) => i.slug === item.slug
          ),
          `${item.slug} is unreachable by its own ${format} format`
        );
      }
    }
  });

  test("the empty state is reachable by a real combination", async () => {
    // Both axes are individually populated — there are checklists, and there
    // are spreadsheets — but no checklist is offered as one. The pair was
    // logbook + Word until the fire safety logbook began offering an editable
    // copy alongside its PDF; a combination that stops being empty stops
    // testing the empty state, so it is replaced rather than propped up.
    const items = await cards();
    assert.ok(items.some((i) => i.resourceType === "checklist"));
    assert.ok(items.some((i) => i.formats.includes("xlsx")));
    assert.deepEqual(
      applyDownloadFilters(items, { resourceType: "checklist", format: "xlsx" }),
      []
    );
  });
});

describe("The component wires the pure logic rather than reimplementing it", () => {
  const src = fs.readFileSync(path.join(repoRoot, "components/DownloadFilter.tsx"), "utf8");

  test("it imports the decision logic instead of duplicating it", () => {
    assert.match(src, /from "@\/lib\/downloads-filtering"/);
    assert.match(src, /applyDownloadFilters/);
  });

  test("both axes are rendered as labelled groups", () => {
    assert.match(src, /Filter by type of resource/);
    assert.match(src, /Filter by format/);
    assert.match(src, /role="group"/);
    assert.match(src, /aria-labelledby/);
  });

  test("there is no category filter — it would split the library in two and say nothing", () => {
    assert.ok(!/Filter by subject/i.test(src), "category must not become a third axis");
    assert.ok(!/Filter by category/i.test(src));
  });

  test("filter state is announced politely and the pressed state is exposed", () => {
    assert.match(src, /aria-live="polite"/);
    assert.match(src, /aria-pressed=\{pressed\}/);
    assert.match(src, /announceDownloadResults/);
  });

  test("the empty state names the combination and offers a way out", () => {
    assert.match(src, /No resources match \{description\}/);
    assert.match(src, /Show all resources/);
    assert.match(src, /onClick=\{reset\}/);
  });

  test("the empty state points at a person rather than leaving a dead end", () => {
    assert.match(src, /ask us/);
  });
});
