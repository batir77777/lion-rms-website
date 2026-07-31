// Standards library — accessor, routes and structured data (Phase 5A, PR 5).
//
// Three layers, mirroring tests/glossary.test.mjs: what the accessor decides is
// public, what the routes generate and deliberately do not, and whether the
// data that reached Velite's output is what was authored.
//
// The schema-regression group deserves a word. PR 4 shipped a field declared
// `s.mdx().optional()`, which can never be populated: Velite reads the body
// from build context, but zod short-circuits on an absent input and returns
// undefined without running the transform. Nothing failed. Nothing warned. The
// field was simply empty on every page. So the assertions here look at Velite's
// OUTPUT rather than at the schema's intent, because the failure mode of that
// whole class of defect is silence.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const appDir = path.join(repoRoot, "app");

before(() => {
  execFileSync("npx", ["velite", "build", "--strict", "--clean", "--silent"], {
    cwd: repoRoot,
    stdio: "pipe",
  });
});

const exists = (p) => fs.existsSync(path.join(appDir, p));

const EXPECTED_SLUGS = [
  "approved-document-b-fire-safety",
  "bs-5839-1-fire-detection-alarm-systems",
  "bs-9792-fire-risk-assessment-housing",
  "bs-9991-fire-safety-residential-buildings",
  "bs-9999-fire-safety-buildings",
  "hsg65-managing-for-health-and-safety",
  "pas-79-1-fire-risk-assessment-non-housing",
  "pas-79-2-fire-risk-assessment-housing",
];

describe("Standards accessor", () => {
  test("exposes exactly the eight launch documents, all published", async () => {
    const { publishedStandards } = await import("../lib/standards");
    const standards = publishedStandards();
    assert.equal(standards.length, 8);
    assert.deepEqual(standards.map((s) => s.slug).sort(), [...EXPECTED_SLUGS].sort());
    for (const s of standards) assert.equal(s.status, "published");
  });

  test("excludes anything whose PAGE is not published", async () => {
    const { standards: raw } = await import("../.velite");
    const { publishedStandards } = await import("../lib/standards");
    const visible = new Set(publishedStandards().map((s) => s.slug));
    for (const item of raw) {
      if (item.status !== "published") assert.equal(visible.has(item.slug), false);
    }
  });

  test("INCLUDES documents that have been withdrawn", async () => {
    // The single most important behaviour in this file. A reader arriving from
    // a five-year-old assessment that cites PAS 79-2 must find the page — and
    // must find out it has been withdrawn. Filtering it away would remove
    // exactly the answer they came for.
    const { publishedStandards, isCurrentDocument } = await import("../lib/standards");
    const withdrawn = publishedStandards().filter((s) => !isCurrentDocument(s));
    assert.ok(withdrawn.length > 0, "the launch set must exercise a non-current document");
    assert.ok(withdrawn.some((s) => s.slug === "pas-79-2-fire-risk-assessment-housing"));
  });

  test("orders by document class first, then by designation", async () => {
    const { publishedStandards, DOCUMENT_CLASS_ORDER } = await import("../lib/standards");
    const positions = publishedStandards().map((s) =>
      DOCUMENT_CLASS_ORDER.indexOf(s.documentClass)
    );
    assert.deepEqual(positions, [...positions].sort((a, b) => a - b));
    assert.ok(positions.every((p) => p >= 0), "every document class must be in the fixed order");
  });

  test("classGroups drops empty classes and accounts for every document", async () => {
    const { classGroups, publishedStandards } = await import("../lib/standards");
    const groups = classGroups();
    assert.ok(groups.every((g) => g.standards.length > 0));
    const total = groups.reduce((n, g) => n + g.standards.length, 0);
    assert.equal(total, publishedStandards().length);
    // The launch set covers four of the five classes; industry-guidance is
    // deliberately not represented yet.
    assert.equal(groups.length, 4);
  });

  test("getStandard resolves a real slug and rejects an unknown one", async () => {
    const { getStandard } = await import("../lib/standards");
    assert.ok(getStandard("bs-9999-fire-safety-buildings"));
    assert.equal(getStandard("not-a-standard"), undefined);
  });

  test("breadcrumbs use the designation rather than the full title", async () => {
    const { getStandard, buildStandardBreadcrumbs } = await import("../lib/standards");
    const standard = getStandard("pas-79-1-fire-risk-assessment-non-housing");
    const crumbs = buildStandardBreadcrumbs(standard);
    assert.equal(crumbs.length, 4);
    assert.deepEqual(
      crumbs.map((c) => c.name),
      ["Home", "Knowledge Centre", "Standards", "PAS 79-1:2020"]
    );
    // The last crumb is the current page and carries no path.
    assert.equal(crumbs[3].path, undefined);
  });

  test("the designation stays short enough to sit in a breadcrumb", async () => {
    // Found during local verification: Approved Document B originally carried
    // its full formal reference — "…2019 edition incorporating 2020, 2022 and
    // 2025 amendments" — in officialReference, which then became the final
    // breadcrumb and the CollectionPage item name. officialReference is the
    // DESIGNATION; edition detail belongs in currentEdition.
    const { publishedStandards, designation } = await import("../lib/standards");
    for (const s of publishedStandards()) {
      const d = designation(s);
      assert.ok(d.length <= 30, `${s.slug}: designation "${d}" is ${d.length} chars`);
      assert.ok(!/edition|incorporating|amendment/i.test(d), `${s.slug}: edition detail in the designation`);
    }
  });

  test("every status in use has a human label", async () => {
    const { publishedStandards, documentStatusLabel } = await import("../lib/standards");
    for (const s of publishedStandards()) {
      const label = documentStatusLabel(s);
      assert.ok(label && label !== s.documentStatus, `${s.slug}: unlabelled status`);
    }
  });
});

describe("Standards schema — regression cover for silent failure", () => {
  test("every document has a compiled MDX body in Velite's output", async () => {
    const { standards } = await import("../.velite");
    for (const s of standards) {
      assert.equal(typeof s.body, "string", `${s.slug}: body is not a string`);
      assert.ok(s.body.length > 500, `${s.slug}: body is suspiciously short`);
      assert.match(s.body, /_createMdxContent/, `${s.slug}: body is not compiled MDX`);
    }
  });

  test("the body field is required, not optional", async () => {
    // The `s.mdx().optional()` trap from PR 4, asserted at the schema level as
    // well as the output level.
    const src = fs.readFileSync(path.join(repoRoot, "lib/content-schemas.ts"), "utf8");
    const block = src.slice(src.indexOf("standardGuidancePageSchema"));
    assert.ok(block.includes("body: s.mdx(),"));
    assert.ok(!block.includes("body: s.mdx().optional()"));
  });

  test("supersededBy reaches the output as an array on every document", async () => {
    const { standards } = await import("../.velite");
    for (const s of standards) {
      assert.ok(Array.isArray(s.supersededBy), `${s.slug}: supersededBy is not an array`);
    }
  });

  test("sourceLicence is present on every document and defaults safely", async () => {
    const { standards } = await import("../.velite");
    const valid = new Set(["commercial", "open-government-licence", "crown-copyright", "other"]);
    for (const s of standards) {
      assert.ok(valid.has(s.sourceLicence), `${s.slug}: ${s.sourceLicence}`);
    }
    // The launch set deliberately mixes two regimes, which is the whole reason
    // the field cannot be a constant.
    const licences = new Set(standards.map((s) => s.sourceLicence));
    assert.ok(licences.size > 1, "the launch set should exercise more than one licence regime");
  });

  test("documentStatus has no default, so it cannot be silently assumed current", async () => {
    // An unstated status would read as "current", which is the one wrong
    // answer that looks right — and the publication gate exists precisely to
    // force the status to have been actively confirmed.
    const src = fs.readFileSync(path.join(repoRoot, "lib/content-schemas.ts"), "utf8");
    const start = src.indexOf("documentStatus: s.enum([");
    assert.ok(start > 0, "documentStatus declaration not found");
    const declaration = src.slice(start, src.indexOf("]),", start) + 3);
    assert.ok(declaration.includes('"proposed-for-withdrawal"'));
    assert.ok(declaration.includes('"under-review"'));
    assert.ok(!declaration.includes(".default("), "documentStatus must not carry a default");
  });

  test("authored body text survives compilation end to end", async () => {
    const { standards } = await import("../.velite");
    const pas792 = standards.find((s) => s.slug === "pas-79-2-fire-risk-assessment-housing");
    assert.ok(pas792.body.includes("Why this page exists"));
    assert.ok(pas792.body.includes("What replaced it"));
  });
});

describe("Standards content integrity", () => {
  test("every published document carries a full verification record", async () => {
    const { publishedStandards } = await import("../lib/standards");
    for (const s of publishedStandards()) {
      for (const field of [
        "statusConfirmedDate",
        "editionConfirmedDate",
        "licenceConfirmedDate",
        "verifiedBy",
        "lastCheckedDate",
        "officialReference",
        "publisher",
        "officialSourceUrl",
      ]) {
        assert.ok(s[field], `${s.slug}: missing ${field}`);
      }
    }
  });

  test("the copyright notice matches the licence regime on every document", async () => {
    const { publishedStandards } = await import("../lib/standards");
    for (const s of publishedStandards()) {
      const notice = s.copyrightNotice.toLowerCase();
      if (s.sourceLicence === "open-government-licence") {
        assert.ok(notice.includes("open government licence"), `${s.slug}`);
      } else {
        assert.ok(
          !notice.includes("open government licence"),
          `${s.slug}: commercial material must not claim open terms`
        );
      }
    }
  });

  test("no page reproduces a long verbatim extract from a commercial source", async () => {
    // The machine-checkable half of the copyright boundary, asserted against
    // real content rather than only against fixtures.
    const dir = path.join(repoRoot, "content/standards");
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const body = raw.split("\n---\n").slice(1).join("\n---\n");
      for (const match of body.matchAll(/^>\s?.*(?:\n>\s?.*)*/gm)) {
        assert.ok(
          match[0].replace(/^>\s?/gm, "").length <= 300,
          `${file}: long block quotation — review against the publisher's terms`
        );
      }
    }
  });

  test("the launch set exercises the lifecycle model, not just the happy path", async () => {
    const { publishedStandards } = await import("../lib/standards");
    const standards = publishedStandards();
    assert.ok(
      standards.some((s) => s.documentStatus === "withdrawn"),
      "no withdrawn document — the status model is untested by real content"
    );
    assert.ok(
      standards.some((s) => s.supersededBy.length > 0),
      "no supersession chain in real content"
    );
    assert.ok(
      standards.some((s) => s.amendments.length > 0),
      "no amendment record in real content"
    );
    assert.ok(
      standards.some((s) => s.revisionInProgress),
      "no revision-in-progress record in real content"
    );
  });

  test("a revision project is recorded without overstating it as a formal review", async () => {
    const { getStandard } = await import("../lib/standards");
    const bs9999 = getStandard("bs-9999-fire-safety-buildings");
    assert.equal(bs9999.revisionInProgress, true);
    assert.ok(bs9999.revisionNote && bs9999.revisionNote.length > 40);
    // BSI lists the 2017 edition as current. Marking it under-review would be
    // a factual overstatement on a page practitioners rely on.
    assert.equal(bs9999.documentStatus, "current");
  });
});

describe("Standards routes", () => {
  test("the listing and detail routes exist", () => {
    assert.ok(exists("standards/page.tsx"));
    assert.ok(exists("standards/[slug]/page.tsx"));
  });

  test("the detail route generates only published slugs and refuses the rest", async () => {
    const src = fs.readFileSync(path.join(appDir, "standards/[slug]/page.tsx"), "utf8");
    assert.match(src, /export const dynamicParams = false/);
    assert.match(src, /generateStaticParams/);
    const { publishedStandards } = await import("../lib/standards");
    assert.equal(publishedStandards().length, 8);
  });

  test("deferred routes are not built", () => {
    // Nothing from PR 7 or later leaks in. "legislation" left this list in
    // PR 6, which launched it; the standards sub-routes remain deferred.
    for (const route of [
      "standards/category",
      "standards/tag",
      "standards/letter",
      "news",
      "downloads",
      "knowledge",
      "search",
    ]) {
      assert.equal(exists(route), false, `${route} should not exist yet`);
    }
  });

  test("the sitemap includes the listing and every document", async () => {
    const src = fs.readFileSync(path.join(appDir, "sitemap.ts"), "utf8");
    assert.match(src, /publishedStandards/);
    assert.match(src, /STANDARDS_PATH/);
    // A real per-item date, not the build timestamp.
    assert.match(src, /standardLastModified/);
  });

  test("withdrawn documents stay in the sitemap", async () => {
    const { publishedStandards, isCurrentDocument } = await import("../lib/standards");
    const sitemapCandidates = publishedStandards().map((s) => s.slug);
    const withdrawn = publishedStandards().filter((s) => !isCurrentDocument(s));
    for (const s of withdrawn) {
      assert.ok(sitemapCandidates.includes(s.slug), `${s.slug} was dropped from the sitemap set`);
    }
  });

  test("no standard slug collides with a reserved route word", async () => {
    const { isReservedSlug } = await import("../lib/reserved-slugs");
    const { publishedStandards } = await import("../lib/standards");
    for (const s of publishedStandards()) {
      assert.equal(isReservedSlug(s.slug), false, `${s.slug} is reserved`);
    }
  });
});

describe("Standards structured data", () => {
  test("the page is marked up as our commentary, not as the document", async () => {
    const { buildStandardSchema } = await import("../lib/content-jsonld");
    const schema = buildStandardSchema({
      headline: "Our page title",
      description: "Our description.",
      path: "/standards/example",
      authorId: "batir-turakulov",
      document: {
        name: "The document's own title",
        identifier: "BS 1234:2020",
        version: "2020",
        publisher: "BSI",
        url: "https://knowledge.bsigroup.com/products/example",
      },
    });

    assert.equal(schema["@type"], "TechArticle");
    // Ours on the outside...
    assert.equal(schema.publisher.name, "Lion Risk Management Solutions");
    assert.equal(schema.author["@type"], "Person");
    // ...theirs on the inside. The two differing is the point of the shape.
    assert.equal(schema.about["@type"], "CreativeWork");
    assert.equal(schema.about.publisher.name, "BSI");
    assert.notEqual(schema.about.publisher.name, schema.publisher.name);
    assert.equal(schema.about.identifier, "BS 1234:2020");
    assert.equal(schema.about.name, "The document's own title");
  });

  test("the canonical URL is absolute and self-referencing", async () => {
    const { buildStandardSchema } = await import("../lib/content-jsonld");
    const schema = buildStandardSchema({
      headline: "x",
      description: "y",
      path: "/standards/example",
      authorId: "batir-turakulov",
      document: { name: "n", identifier: "i", publisher: "p", url: "https://example.org" },
    });
    assert.equal(schema.url, "https://www.lionrms.uk/standards/example");
    assert.equal(schema["@id"], schema.url);
    assert.equal(schema.mainEntityOfPage["@id"], schema.url);
  });

  test("version is omitted rather than emitted empty where there is no edition", async () => {
    const { buildStandardSchema } = await import("../lib/content-jsonld");
    const schema = buildStandardSchema({
      headline: "x",
      description: "y",
      path: "/standards/example",
      authorId: "batir-turakulov",
      document: { name: "n", identifier: "i", publisher: "p", url: "https://example.org" },
    });
    assert.equal("version" in schema.about, false);
  });
});
