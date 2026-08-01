// Legislation library — accessor, routes, metadata and structured data
// (Phase 5A, PR 6).
//
// Same three layers as tests/standards-accessor.test.mjs, and the same
// governing caution: assertions are made against Velite's OUTPUT rather than
// against the schema's intent, because the failure mode of the whole
// `s.mdx().optional()` class of defect is silence.
//
// One decision is asserted harder here than anywhere in PR 5. A repealed or
// revoked instrument stays published, stays listed, stays in the sitemap and
// stays linked. Enforcement correspondence and tribunal decisions cite
// instruments for years after they cease to have effect, and the reader
// arriving from one of those is precisely who the page exists for. A
// well-meant "hide what no longer applies" change would break exactly that
// reader, so the tests state it as a requirement rather than as behaviour.

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

const source = (p) => fs.readFileSync(path.join(appDir, p), "utf8");
const exists = (p) => fs.existsSync(path.join(appDir, p));

const EXPECTED_SLUGS = [
  "building-safety-act-2022",
  "fire-safety-act-2021",
  "fire-safety-england-regulations-2022",
  "fire-safety-residential-evacuation-plans-england-regulations-2025",
  "fire-scotland-act-2005",
  "health-and-safety-at-work-act-1974",
  "management-of-health-and-safety-at-work-regulations-1999",
  "regulatory-reform-fire-safety-order-2005",
];

describe("Legislation accessor", () => {
  test("exposes exactly the eight launch instruments, all published", async () => {
    const { publishedLegislation } = await import("../lib/legislation");
    const items = publishedLegislation();
    assert.equal(items.length, 8);
    assert.deepEqual(items.map((i) => i.slug).sort(), [...EXPECTED_SLUGS].sort());
    for (const i of items) assert.equal(i.status, "published");
  });

  test("excludes anything whose PAGE is not published", async () => {
    const { legislation: raw } = await import("../.velite");
    const { publishedLegislation } = await import("../lib/legislation");
    const visible = new Set(publishedLegislation().map((i) => i.slug));
    for (const item of raw) {
      if (item.status !== "published") assert.equal(visible.has(item.slug), false);
    }
  });

  test("does NOT filter on forceStatus — an instrument that no longer stands stays visible", async () => {
    const { publishedLegislation } = await import("../lib/legislation");
    const src = fs.readFileSync(path.join(repoRoot, "lib/legislation.ts"), "utf8");
    // Structural, so the requirement survives a change of launch content: the
    // one filter in publishedLegislation must be on our page's status.
    const fn = src.slice(src.indexOf("export function publishedLegislation"));
    const body = fn.slice(0, fn.indexOf("\n}"));
    assert.match(body, /\.filter\(\(l\) => l\.status === "published"\)/);
    assert.ok(
      !/forceStatus/.test(body),
      "publishedLegislation must not filter on forceStatus — see the module note"
    );
    assert.ok(publishedLegislation().length > 0);
  });

  test("orders by application jurisdiction, then primary before secondary, then year descending", async () => {
    const { publishedLegislation, JURISDICTION_ORDER } = await import("../lib/legislation");
    const items = publishedLegislation();
    const rank = (i) => {
      const idx = JURISDICTION_ORDER.indexOf(i.application[0]);
      return idx === -1 ? JURISDICTION_ORDER.length : idx;
    };
    for (let n = 1; n < items.length; n++) {
      const a = items[n - 1];
      const b = items[n];
      if (rank(a) !== rank(b)) {
        assert.ok(rank(a) < rank(b), `${a.slug} should not precede ${b.slug}`);
        continue;
      }
      if (a.legislationTier !== b.legislationTier) {
        assert.equal(a.legislationTier, "primary", `${a.slug} should not precede ${b.slug}`);
        continue;
      }
      if (a.year !== b.year) assert.ok(a.year >= b.year, `${a.slug} then ${b.slug}`);
    }
  });

  test("getLegislation resolves a published slug and refuses an unknown one", async () => {
    const { getLegislation } = await import("../lib/legislation");
    assert.equal(getLegislation("fire-safety-act-2021")?.shortTitle, "Fire Safety Act 2021");
    assert.equal(getLegislation("no-such-instrument"), undefined);
  });

  test("jurisdictionGroups drops empty groups and covers every published item exactly once", async () => {
    const { jurisdictionGroups, publishedLegislation } = await import("../lib/legislation");
    const groups = jurisdictionGroups();
    for (const g of groups) assert.ok(g.items.length > 0, `${g.jurisdiction} is empty`);
    const total = groups.reduce((n, g) => n + g.items.length, 0);
    assert.equal(total, publishedLegislation().length);
    const seen = new Set(groups.flatMap((g) => g.items.map((i) => i.slug)));
    assert.equal(seen.size, publishedLegislation().length);
  });

  test("usedJurisdictions counts agree with the groups they came from", async () => {
    const { usedJurisdictions, jurisdictionGroups } = await import("../lib/legislation");
    const groups = jurisdictionGroups();
    const used = usedJurisdictions();
    assert.equal(used.length, groups.length);
    for (const u of used) {
      const g = groups.find((x) => x.jurisdiction === u.slug);
      assert.equal(u.count, g.items.length);
      assert.ok(u.label.length > 0);
    }
  });

  test("every force status has a visible text label — status is never carried by colour alone", async () => {
    const { FORCE_STATUS_LABELS, forceStatusLabel, publishedLegislation } = await import(
      "../lib/legislation"
    );
    for (const value of [
      "not-yet-in-force",
      "partially-in-force",
      "in-force",
      "partially-repealed",
      "repealed",
      "revoked",
      "spent",
    ]) {
      assert.equal(typeof FORCE_STATUS_LABELS[value], "string", `${value} has no label`);
    }
    for (const i of publishedLegislation()) {
      assert.notEqual(forceStatusLabel(i), i.forceStatus, `${i.slug} fell through to the raw slug`);
    }
  });

  test("every tier, form and type in use resolves to a label", async () => {
    const { publishedLegislation, tierLabel, formLabel, typeLabel } = await import(
      "../lib/legislation"
    );
    for (const i of publishedLegislation()) {
      assert.notEqual(tierLabel(i), i.legislationTier, `${i.slug}: unlabelled tier`);
      assert.notEqual(formLabel(i), i.instrumentForm, `${i.slug}: unlabelled form`);
      assert.notEqual(typeLabel(i), i.instrumentType, `${i.slug}: unlabelled type`);
    }
  });

  test("isTerminated and isFullyInForce agree with the launch data", async () => {
    const { publishedLegislation, isTerminated, isFullyInForce } = await import(
      "../lib/legislation"
    );
    for (const i of publishedLegislation()) {
      assert.equal(isTerminated(i), i.forceStatus === "repealed" || i.forceStatus === "revoked");
      assert.equal(isFullyInForce(i), i.forceStatus === "in-force");
    }
  });

  test("extentDiffersFromApplication is true exactly where the two lists differ", async () => {
    const { publishedLegislation, extentDiffersFromApplication } = await import(
      "../lib/legislation"
    );
    let differing = 0;
    for (const i of publishedLegislation()) {
      const expected =
        i.extent.length !== i.application.length ||
        i.extent.some((e) => !i.application.includes(e));
      assert.equal(extentDiffersFromApplication(i), expected, i.slug);
      if (expected) differing++;
    }
    // The regression case the owner named. If this reaches zero, the
    // extent/application distinction has stopped being exercised by content.
    assert.ok(differing > 0, "no launch instrument exercises the extent ≠ application case");
    const regs = publishedLegislation().find(
      (i) => i.slug === "fire-safety-england-regulations-2022"
    );
    assert.equal(extentDiffersFromApplication(regs), true);
    assert.deepEqual([...regs.extent], ["england-and-wales"]);
    assert.deepEqual([...regs.application], ["england"]);
    assert.ok(regs.extentNote, "the regression case must carry an extentNote");
  });

  test("sourceTextTrailsConfirmation is true only where the source's own text is behind", async () => {
    const { publishedLegislation, sourceTextTrailsConfirmation } = await import(
      "../lib/legislation"
    );
    for (const i of publishedLegislation()) {
      const asAt = String(i.sourceTextAsAtDate).slice(0, 10);
      const confirmed = i.sourceCurrencyConfirmedDate
        ? String(i.sourceCurrencyConfirmedDate).slice(0, 10)
        : undefined;
      assert.equal(
        sourceTextTrailsConfirmation(i),
        Boolean(confirmed && asAt < confirmed),
        i.slug
      );
    }
  });

  test("breadcrumbs are Home / Knowledge Centre / Legislation / short title", async () => {
    const { getLegislation, buildLegislationBreadcrumbs } = await import("../lib/legislation");
    const item = getLegislation("building-safety-act-2022");
    const crumbs = buildLegislationBreadcrumbs(item);
    assert.equal(crumbs.length, 4);
    assert.deepEqual(crumbs[2], { name: "Legislation", path: "/legislation" });
    assert.equal(crumbs[3].name, item.shortTitle);
    assert.equal(crumbs[3].path, undefined);
  });

  test("the final crumb is the short title, not our editorial headline", async () => {
    const { publishedLegislation, buildLegislationBreadcrumbs } = await import(
      "../lib/legislation"
    );
    for (const i of publishedLegislation()) {
      const last = buildLegislationBreadcrumbs(i).at(-1);
      assert.equal(last.name, i.shortTitle);
      // PR 5's lesson: an over-long final crumb also becomes the ItemList name.
      assert.ok(last.name.length <= 75, `${i.slug}: short title is ${last.name.length} characters`);
    }
  });

  test("formatDate renders en-GB and tolerates an absent value", async () => {
    const { formatDate } = await import("../lib/legislation");
    assert.equal(formatDate("2022-05-16"), "16 May 2022");
    assert.equal(formatDate(undefined), undefined);
    assert.equal(formatDate("not-a-date"), undefined);
  });
});

describe("Legislation schema — what actually reached Velite's output", () => {
  test("every instrument carries the full identity block", async () => {
    const { legislation } = await import("../.velite");
    for (const i of legislation) {
      assert.equal(typeof i.shortTitle, "string");
      assert.ok(i.shortTitle.length > 0, `${i.slug}: empty shortTitle`);
      assert.ok(i.officialReference.length > 0, `${i.slug}: empty citation`);
      assert.equal(typeof i.year, "number");
      assert.ok(i.year >= 1200 && i.year <= 2100);
      assert.equal(typeof i.publisher, "string");
    }
  });

  test("the three classification axes are populated and orthogonal", async () => {
    const { legislation } = await import("../.velite");
    const FORMS = new Set([
      "uk-public-general-act",
      "act-of-the-scottish-parliament",
      "act-of-senedd-cymru",
      "northern-ireland-order-in-council",
      "statutory-instrument",
      "scottish-statutory-instrument",
      "welsh-statutory-instrument",
      "northern-ireland-statutory-rule",
    ]);
    const TYPES = new Set(["act", "regulations", "order", "rules", "measure"]);
    for (const i of legislation) {
      assert.ok(["primary", "secondary"].includes(i.legislationTier), i.slug);
      assert.ok(FORMS.has(i.instrumentForm), `${i.slug}: ${i.instrumentForm}`);
      assert.ok(TYPES.has(i.instrumentType), `${i.slug}: ${i.instrumentType}`);
    }
    // The axes must be genuinely independent, or the split was pointless: the
    // same form must appear with more than one type somewhere in the set.
    const byForm = new Map();
    for (const i of legislation) {
      byForm.set(i.instrumentForm, new Set([...(byForm.get(i.instrumentForm) ?? []), i.instrumentType]));
    }
    assert.ok(
      [...byForm.values()].some((types) => types.size > 1),
      "no instrument form carries more than one type — the two axes are not being exercised"
    );
  });

  test("extent and application are separate non-empty lists of valid jurisdictions", async () => {
    const { legislation } = await import("../.velite");
    const { JURISDICTIONS } = await import("../lib/taxonomy");
    for (const i of legislation) {
      assert.ok(Array.isArray(i.extent) && i.extent.length > 0, `${i.slug}: no extent`);
      assert.ok(Array.isArray(i.application) && i.application.length > 0, `${i.slug}: no application`);
      for (const j of [...i.extent, ...i.application]) {
        assert.ok(JURISDICTIONS.includes(j), `${i.slug}: unknown jurisdiction "${j}"`);
      }
    }
  });

  test("multiple extent values are supported and actually used", async () => {
    const { legislation } = await import("../.velite");
    const multi = legislation.filter((i) => i.extent.length > 1);
    assert.ok(multi.length > 0, "no instrument exercises a multi-jurisdiction extent");
  });

  test("outstandingEffectsChecked is a real boolean on every instrument", async () => {
    const { legislation } = await import("../.velite");
    for (const i of legislation) {
      assert.equal(
        typeof i.outstandingEffectsChecked,
        "boolean",
        `${i.slug}: "checked, none found" must be distinguishable from "not looked at"`
      );
    }
  });

  test("recorded outstanding effects carry an effect and a source", async () => {
    const { legislation } = await import("../.velite");
    let total = 0;
    for (const i of legislation) {
      for (const e of i.outstandingEffects) {
        assert.ok(e.effect.length > 0, `${i.slug}: empty effect`);
        assert.ok(e.source.length > 0, `${i.slug}: an effect with no source`);
        total++;
      }
    }
    assert.ok(total > 0, "no launch instrument records an outstanding effect");
  });

  test("sourceTextAsAtDate is present on every instrument and differs across the set", async () => {
    const { legislation } = await import("../.velite");
    const dates = new Set();
    for (const i of legislation) {
      const d = String(i.sourceTextAsAtDate ?? "").slice(0, 10);
      assert.match(d, /^\d{4}-\d{2}-\d{2}$/, `${i.slug}: no as-at date`);
      dates.add(d);
    }
    // A single sitewide "verified as at" date would be wrong — there is no
    // common cut-off. If this collapses to one, something has been flattened.
    assert.ok(dates.size > 1, "every instrument shares one as-at date, which cannot be right");
  });

  test("sourceTextAsAtDateStated distinguishes a stated date from our own check", async () => {
    const { legislation } = await import("../.velite");
    const stated = legislation.filter((i) => i.sourceTextAsAtDateStated);
    const inferred = legislation.filter((i) => !i.sourceTextAsAtDateStated);
    assert.ok(stated.length > 0);
    assert.ok(
      inferred.length > 0,
      "the flag exists because some instruments display no currency date; none is marked so"
    );
  });

  test("body compiled to a populated MDX function body on every page", async () => {
    const { legislation } = await import("../.velite");
    for (const i of legislation) {
      assert.equal(typeof i.body, "string", `${i.slug}: body is not a string`);
      assert.ok(i.body.length > 500, `${i.slug}: body is suspiciously short (${i.body.length})`);
    }
  });

  test("commencement events carry a date and a scope", async () => {
    const { legislation } = await import("../.velite");
    let total = 0;
    for (const i of legislation) {
      for (const c of i.commencement) {
        assert.match(String(c.date).slice(0, 10), /^\d{4}-\d{2}-\d{2}$/, i.slug);
        assert.ok(c.scope.length > 0, `${i.slug}: a commencement event with no scope`);
        total++;
      }
    }
    assert.ok(total >= 8, `expected the staged model to be exercised, found ${total} events`);
  });

  test("notYetInForce provisions carry both a provision and a note", async () => {
    const { legislation } = await import("../.velite");
    const partial = legislation.filter((i) => i.forceStatus === "partially-in-force");
    assert.ok(partial.length > 0, "no instrument exercises partially-in-force");
    for (const i of partial) {
      assert.ok(i.notYetInForce.length > 0, `${i.slug}: partially in force with nothing listed`);
      for (const n of i.notYetInForce) {
        assert.ok(n.provision.length > 0);
        assert.ok(n.note.length > 0, `${i.slug}: an uncommenced provision with no explanation`);
      }
    }
  });

  test("an amendment made but not yet in force is recordable as such", async () => {
    const { legislation } = await import("../.velite");
    for (const i of legislation) {
      for (const a of i.amendments) {
        assert.equal(typeof a.inForce, "boolean", `${i.slug}: ${a.reference} has no inForce flag`);
      }
    }
  });
});

describe("Legislation routing", () => {
  test("generateStaticParams returns exactly the published instruments", async () => {
    const mod = await import("../app/legislation/[slug]/page.tsx");
    const params = mod.generateStaticParams();
    assert.equal(params.length, 8);
    assert.deepEqual(params.map((p) => p.slug).sort(), [...EXPECTED_SLUGS].sort());
  });

  test("dynamicParams is false", async () => {
    const mod = await import("../app/legislation/[slug]/page.tsx");
    assert.equal(mod.dynamicParams, false);
  });

  test("routes deferred to PR 9 and later are not built", () => {
    for (const route of [
      "legislation/jurisdiction",
      "legislation/category",
      "legislation/tag",
      "knowledge",
      "search",
    ]) {
      assert.equal(exists(route), false, `${route} should not exist yet`);
    }
  });

  test("every instrument's metadata sits inside the editorial ranges and self-canonicalises", async () => {
    const mod = await import("../app/legislation/[slug]/page.tsx");
    const { publishedLegislation } = await import("../lib/legislation");
    for (const item of publishedLegislation()) {
      const meta = await mod.generateMetadata({
        params: Promise.resolve({ slug: item.slug }),
      });
      assert.ok(
        meta.title.length >= 30 && meta.title.length <= 65,
        `${item.slug}: title is ${meta.title.length} characters`
      );
      assert.ok(
        meta.description.length >= 120 && meta.description.length <= 170,
        `${item.slug}: description is ${meta.description.length} characters`
      );
      assert.equal(meta.alternates.canonical, `/legislation/${item.slug}`);
      assert.equal(meta.openGraph.type, "article");
      assert.ok(meta.openGraph.images[0]);
    }
  });

  test("the listing description sits inside the editorial band", () => {
    // Route metadata is not a content item, so content:audit never sees it.
    // PR 5's listing shipped at 189 characters before local verification.
    const src = source("legislation/page.tsx");
    const match = src.match(/const DESCRIPTION =\s*\n?\s*"([^"]+)"/);
    assert.ok(match, "DESCRIPTION not found");
    const length = match[1].length;
    assert.ok(length >= 120 && length <= 170, `listing description is ${length} characters`);
  });

  test("the listing declares an absolute self-canonical", () => {
    assert.match(source("legislation/page.tsx"), /alternates: \{ canonical: LEGISLATION_PATH \}/);
  });

  test("the sitemap lists the index and every instrument, including any that no longer stands", async () => {
    const { default: sitemap } = await import("../app/sitemap.ts");
    const { publishedLegislation, isTerminated } = await import("../lib/legislation");
    const urls = sitemap().map((e) => e.url);
    assert.ok(urls.includes("https://www.lionrms.uk/legislation"));
    for (const i of publishedLegislation()) {
      assert.ok(
        urls.includes(`https://www.lionrms.uk/legislation/${i.slug}`),
        `${i.slug} is missing from the sitemap`
      );
    }
    // Structural: the sitemap must not learn to drop terminated instruments.
    const src = fs.readFileSync(path.join(appDir, "sitemap.ts"), "utf8");
    const block = src.slice(src.indexOf("legislationEntries"));
    assert.ok(
      !/isTerminated|forceStatus === "repealed"|forceStatus === "revoked"/.test(
        block.slice(0, block.indexOf("\n\n"))
      ),
      "the sitemap must not filter terminated instruments out"
    );
    assert.equal(typeof isTerminated, "function");
  });

  test("sitemap entries carry a real per-item date rather than the build timestamp", async () => {
    const { default: sitemap } = await import("../app/sitemap.ts");
    const { publishedLegislation, lastModified } = await import("../lib/legislation");
    const entries = sitemap();
    for (const i of publishedLegislation()) {
      const entry = entries.find((e) => e.url.endsWith(`/legislation/${i.slug}`));
      const expected = String(lastModified(i)).slice(0, 10);
      assert.equal(new Date(entry.lastModified).toISOString().slice(0, 10), expected, i.slug);
    }
  });

  test("in-force instruments are given a higher sitemap priority than those that are not", async () => {
    const { default: sitemap } = await import("../app/sitemap.ts");
    const { publishedLegislation, isFullyInForce } = await import("../lib/legislation");
    const entries = sitemap();
    for (const i of publishedLegislation()) {
      const entry = entries.find((e) => e.url.endsWith(`/legislation/${i.slug}`));
      assert.equal(entry.priority, isFullyInForce(i) ? 0.6 : 0.5, i.slug);
    }
  });
});

describe("Legislation structured data", () => {
  test("the outer node is our commentary and the inner node is the instrument", async () => {
    const { buildLegislationSchema } = await import("../lib/content-jsonld");
    const json = buildLegislationSchema({
      headline: "Fire Safety Act 2021 explained",
      description: "What it changed.",
      path: "/legislation/fire-safety-act-2021",
      authorId: "batir-turakulov",
      instrument: {
        name: "Fire Safety Act 2021",
        identifier: "2021 c. 24",
        legislationType: "Act",
        jurisdiction: "England and Wales",
        legalForce: "InForce",
        publisher: "The National Archives",
        url: "https://www.legislation.gov.uk/ukpga/2021/24",
      },
    });
    assert.equal(json["@type"], "TechArticle");
    assert.equal(json.about["@type"], "Legislation");
    assert.equal(json.about.legislationIdentifier, "2021 c. 24");
    assert.equal(json.about.legislationJurisdiction, "England and Wales");
    assert.equal(json.about.legislationLegalForce, "InForce");
    // The two publisher fields carrying different values is the point.
    assert.equal(json.publisher.name, "Lion Risk Management Solutions");
    assert.equal(json.about.publisher.name, "The National Archives");
    assert.notEqual(json.publisher.name, json.about.publisher.name);
  });

  test("legislationLegalForce is omitted rather than guessed where no value fits", async () => {
    const { buildLegislationSchema } = await import("../lib/content-jsonld");
    const json = buildLegislationSchema({
      headline: "x",
      description: "y",
      path: "/legislation/x",
      authorId: "batir-turakulov",
      instrument: {
        name: "x",
        identifier: "y",
        jurisdiction: "Scotland",
        publisher: "The National Archives",
        url: "https://www.legislation.gov.uk/asp/2005/5",
      },
    });
    assert.ok(!("legislationLegalForce" in json.about));
    assert.ok(!("legislationType" in json.about));
  });

  test("the route maps partially-repealed and spent to no legal force at all", () => {
    const src = source("legislation/[slug]/page.tsx");
    const fn = src.slice(src.indexOf("function schemaLegalForce"));
    const body = fn.slice(0, fn.indexOf("\n}"));
    assert.ok(!/partially-repealed/.test(body), "partially-repealed must fall through to undefined");
    assert.ok(!/"spent"/.test(body), "spent must fall through to undefined");
    assert.match(body, /return undefined/);
  });

  test("the route passes APPLICATION as the jurisdiction, not extent", () => {
    const src = source("legislation/[slug]/page.tsx");
    assert.match(src, /jurisdiction: jurisdictionList\(item\.application\)/);
    assert.ok(
      !/jurisdiction: jurisdictionList\(item\.extent\)/.test(src),
      "extent would mislead exactly the reader the distinction protects"
    );
  });

  test("the listing emits a CollectionPage naming every instrument by short title", async () => {
    const { publishedLegislation } = await import("../lib/legislation");
    const { buildCollectionPageSchema } = await import("../lib/content-jsonld");
    const items = publishedLegislation();
    const json = buildCollectionPageSchema({
      name: "x",
      description: "y",
      path: "/legislation",
      items: items.map((i) => ({ name: i.shortTitle, path: `/legislation/${i.slug}` })),
    });
    assert.equal(json.mainEntity.itemListElement.length, 8);
    for (const el of json.mainEntity.itemListElement) {
      assert.ok(el.name.length > 0 && el.name.length <= 75, `over-long ItemList name: ${el.name}`);
      assert.match(el.url, /^https:\/\/www\.lionrms\.uk\/legislation\//);
    }
  });
});

describe("Detail page structure — the caveats come before the substance", () => {
  const src = () => source("legislation/[slug]/page.tsx");

  test("the fixed DOM order is legal-advice notice, status banner, outstanding effects, record, body", () => {
    const s = src();
    const order = [
      "<LegalAdviceNotice",
      "<LegislationStatusBanner",
      "<OutstandingEffectsNotice",
      'id="legislation-metadata-heading"',
      "<MDXContent",
    ];
    let previous = -1;
    for (const marker of order) {
      const at = s.indexOf(marker);
      assert.ok(at > -1, `${marker} is missing from the detail page`);
      assert.ok(at > previous, `${marker} is out of order`);
      previous = at;
    }
  });

  test("the verified official record is a description list, separate from our commentary", () => {
    const s = src();
    assert.match(s, /Verified official record/);
    assert.match(s, /<dl/);
    assert.ok(
      s.indexOf("Verified official record") < s.indexOf("<MDXContent"),
      "the verified record must precede our commentary"
    );
  });

  test("extent and application are always shown as separate glossed rows", () => {
    const s = src();
    assert.match(s, /Extent \(part of the law of\)/);
    assert.match(s, /Applies in/);
    assert.match(s, /jurisdictionList\(item\.extent\)/);
    assert.match(s, /jurisdictionList\(item\.application\)/);
  });

  test("the as-at row says whether the source stated the date or we inferred it", () => {
    const s = src();
    assert.match(s, /Official text current to/);
    assert.match(s, /Position verified on/);
    assert.match(s, /sourceTextAsAtDateStated/);
  });

  test("the official source link is the only outbound source and opens announced", () => {
    const s = src();
    assert.match(s, /legislation\.gov\.uk/);
    assert.match(s, /opens in a new tab/);
    assert.match(s, /rel="noopener noreferrer"/);
  });
});
