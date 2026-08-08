// Guards for the single-source licence statement (F1).
//
// The defect these exist to prevent: six of the seven Downloads landing pages
// rendered the licence TWICE — once from a "## Licence and permitted use"
// section in their MDX prose, once from the canonical block in the page
// template — under two <h2> headings with identical text. The six prose copies
// had drifted into five different wordings, one of which ("Free to use and
// adapt for your own premises. Not for resale or republication.") stated the
// terms considerably more loosely than the block beside it.
//
// None of that was visible from a single file. It only shows when you look at
// a built page, or at all seven MDX files at once — which is what this suite
// does.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { publishedDownloads, routableDownloads, DOWNLOADS_PATH } from "@/lib/downloads";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join(repoRoot, ".next/server/app");
const contentDir = path.join(repoRoot, "content/downloads");

const LICENCE_HEADING = "Licence and permitted use";

/* React splits adjacent text nodes with empty comments, so a sentence can be
   emitted as "fee,<!-- --> republish". Strip them before matching prose. */
const builtPage = (slug) =>
  fs.readFileSync(path.join(outDir, "downloads", `${slug}.html`), "utf8").replaceAll("<!-- -->", "");

const mdxFiles = () =>
  fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));

before(() => {
  if (!fs.existsSync(outDir)) {
    throw new Error("run `npm run build` before this suite — it asserts on built HTML");
  }
});

describe("The licence appears exactly once on every Downloads page", () => {
  test("each built landing page has exactly one licence heading", () => {
    const offenders = [];
    for (const item of routableDownloads()) {
      const count = (builtPage(item.slug).match(new RegExp(`>${LICENCE_HEADING}<`, "g")) ?? []).length;
      if (count !== 1) offenders.push(`${item.slug}: ${count}`);
    }
    assert.deepEqual(
      offenders,
      [],
      `\n  Expected exactly one "${LICENCE_HEADING}" heading per page, found:\n    ${offenders.join("\n    ")}\n`
    );
  });

  test("no Downloads MDX file carries its own licence section", () => {
    // This is the half a built-HTML check cannot express: the prose could be
    // reintroduced under a different heading level and still duplicate the
    // statement, so the source is swept too.
    const offenders = mdxFiles().filter((f) => {
      const src = fs.readFileSync(path.join(contentDir, f), "utf8");
      return new RegExp(`^#{1,6}\\s+${LICENCE_HEADING}\\s*$`, "im").test(src);
    });
    assert.deepEqual(
      offenders,
      [],
      `\n  These MDX files restate the licence; it belongs only in the page template:\n    ${offenders.join("\n    ")}\n`
    );
  });

  test("no Downloads MDX file restates the licence terms without a heading", () => {
    // Belt and braces: catches a bare paragraph reintroducing the terms.
    const markers = [/not for resale/i, /you may not resell/i, /distribution for a fee/i];
    const offenders = [];
    for (const f of mdxFiles()) {
      const body = fs.readFileSync(path.join(contentDir, f), "utf8").split(/^---$/m).slice(2).join("---");
      if (markers.some((m) => m.test(body))) offenders.push(f);
    }
    assert.deepEqual(offenders, []);
  });
});

describe("The canonical block states every approved clause", () => {
  /*
   * The approved wording, clause by clause. Asserted against BUILT HTML rather
   * than the template source, because that is what a reader and a crawler
   * actually receive — and because JSX wraps lines wherever it likes, so the
   * source is not a reliable place to match sentences.
   */
  const PERMISSIONS = [
    "You may download, print, complete and adapt this resource",
    "for use in your own premises or organisation",
    "including by your staff and contractors working on those premises",
    "No registration, payment or attribution is required for that use",
  ];
  const PROHIBITIONS = [
    "You may not resell it",
    "license it",
    "distribute it for a fee",
    "republish it elsewhere",
    "present an adapted version as our work",
    "remove the attribution",
  ];

  const licenceSection = (slug) => {
    const html = builtPage(slug);
    const match = html.match(/<section[^>]*id="licence"[\s\S]*?<\/section>/);
    assert.ok(match, `${slug} has no #licence section`);
    return match[0].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  };

  test("every landing page carries the copyright line", () => {
    for (const item of routableDownloads()) {
      assert.match(licenceSection(item.slug), /© Lion Risk Management Solutions/, item.slug);
    }
  });

  for (const clause of [...PERMISSIONS, ...PROHIBITIONS]) {
    test(`every landing page states: "${clause}"`, () => {
      for (const item of routableDownloads()) {
        assert.ok(
          licenceSection(item.slug).includes(clause),
          `${item.slug} omits "${clause}"`
        );
      }
    });
  }

  test("the wording is identical on all seven pages", () => {
    // The point of F1: one statement, not seven that happen to agree today.
    const texts = new Set(routableDownloads().map((i) => licenceSection(i.slug).trim()));
    assert.equal(texts.size, 1, `found ${texts.size} distinct licence wordings across the pages`);
  });

  test("the loose pre-F1 summary is gone from every page", () => {
    // "Free to use and adapt for your own premises. Not for resale or
    // republication." omitted licensing, paid distribution, passing an adapted
    // version off as ours, and attribution removal.
    for (const item of routableDownloads()) {
      assert.ok(
        !builtPage(item.slug).includes("Not for resale or republication"),
        `${item.slug} still shows the loose licence summary`
      );
    }
  });
});

describe("Structured data points at the one licence block", () => {
  const jsonLd = (slug) =>
    [...builtPage(slug).matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
      .map((m) => JSON.parse(m[1].replace(/\\u003c/g, "<").replace(/\\u003e/g, ">").replace(/\\u0026/g, "&")));

  test("DigitalDocument.license resolves to the page's #licence anchor", () => {
    for (const item of publishedDownloads()) {
      const doc = jsonLd(item.slug).find((o) => o["@type"] === "DigitalDocument");
      assert.ok(doc, `${item.slug} emits no DigitalDocument schema`);
      assert.equal(doc.license, `https://www.lionrms.uk${DOWNLOADS_PATH}/${item.slug}#licence`);
    }
  });

  test("the #licence anchor is unique on every page", () => {
    // A duplicate id would make the JSON-LD license URL ambiguous, and an
    // in-page link to #licence land on whichever came first.
    for (const item of routableDownloads()) {
      const ids = (builtPage(item.slug).match(/id="licence"/g) ?? []).length;
      assert.equal(ids, 1, `${item.slug} has ${ids} elements with id="licence"`);
    }
  });

  test("the licence-heading id is also unique", () => {
    for (const item of routableDownloads()) {
      const ids = (builtPage(item.slug).match(/id="licence-heading"/g) ?? []).length;
      assert.equal(ids, 1, `${item.slug} has ${ids} elements with id="licence-heading"`);
    }
  });
});
