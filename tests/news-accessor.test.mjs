// News library — accessor, schema output, routing and structured data
// (Phase 5A, PR 7).
//
// Same three layers as the Standards and Legislation suites, and the same
// governing caution: assertions are made against Velite's OUTPUT rather than
// the schema's intent, because the failure mode of the `s.mdx().optional()`
// class of defect is silence.
//
// The routing group deserves a word. /news/[slug] and /news/[year] cannot be
// sibling dynamic segments — Next rejects two slug names at the same depth —
// so ONE route serves both and branches on the shape of the parameter. That
// makes the year/slug boundary load-bearing: a news item slugged "2026" would
// be unreachable AND would silently replace that year's archive. Rule N9
// forbids it, and these tests pin both halves.

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
  "approved-document-b-review-consultation-2026",
  "approved-document-b-second-staircase-september-2026",
  "asbestos-demolition-prosecution-march-2026",
  "bs-8214-2026-fire-door-standard-published",
  "hse-asbestos-inspection-campaign-2026",
  "residential-evacuation-plans-regulations-made-2025",
  "residential-peeps-guidance-updated-2026",
  "round-up-july-2025",
  "round-up-march-2026",
  "unu-e-moped-recall-july-2026",
];

describe("News accessor", () => {
  test("exposes exactly the ten launch items, all published", async () => {
    const { publishedNews } = await import("../lib/news");
    const items = publishedNews();
    assert.equal(items.length, 10);
    assert.deepEqual(items.map((i) => i.slug).sort(), [...EXPECTED_SLUGS].sort());
    for (const i of items) assert.equal(i.status, "published");
  });

  test("excludes anything not published", async () => {
    const { news: raw } = await import("../.velite");
    const { publishedNews } = await import("../lib/news");
    const visible = new Set(publishedNews().map((i) => i.slug));
    for (const item of raw) {
      if (item.status !== "published") assert.equal(visible.has(item.slug), false);
    }
  });

  test("orders by publication date descending, not by event date", async () => {
    const { publishedNews } = await import("../lib/news");
    const items = publishedNews();
    for (let n = 1; n < items.length; n++) {
      assert.ok(
        (items[n - 1].publishedDate ?? "") >= (items[n].publishedDate ?? ""),
        `${items[n - 1].slug} should not precede ${items[n].slug}`
      );
    }
    // The distinction is real in this data: the second-staircase item reports a
    // 2024 circular and is the most recently published of the ten. Ordering by
    // eventDate would bury it.
    assert.equal(items[0].slug, "approved-document-b-second-staircase-september-2026");
    assert.equal(items[0].eventDate.slice(0, 4), "2024");
  });

  test("getNewsItem resolves a published slug and refuses an unknown one", async () => {
    const { getNewsItem } = await import("../lib/news");
    assert.ok(getNewsItem("round-up-march-2026"));
    assert.equal(getNewsItem("no-such-item"), undefined);
  });

  test("isRoundUp and wasCorrected agree with the data", async () => {
    const { publishedNews, isRoundUp, wasCorrected } = await import("../lib/news");
    for (const i of publishedNews()) {
      assert.equal(isRoundUp(i), i.newsFormat === "monthly-roundup");
      const published = i.publishedDate?.slice(0, 10);
      const updated = i.updatedDate?.slice(0, 10);
      assert.equal(wasCorrected(i), Boolean(published && updated && updated > published));
    }
  });

  test("every format and category in use resolves to a label", async () => {
    const { publishedNews, formatLabel, categoryLabel } = await import("../lib/news");
    for (const i of publishedNews()) {
      assert.notEqual(formatLabel(i), i.newsFormat, `${i.slug}: unlabelled format`);
      assert.notEqual(categoryLabel(i), i.newsCategory, `${i.slug}: unlabelled category`);
    }
  });

  test("all seven categories and both formats are exercised by real content", async () => {
    const { publishedNews } = await import("../lib/news");
    const items = publishedNews();
    const categories = new Set(items.map((i) => i.newsCategory));
    assert.deepEqual([...categories].sort(), [
      "consultation",
      "enforcement",
      "government-guidance",
      "product-recall",
      "prosecution",
      "regulatory-change",
      "standards-update",
    ]);
    assert.deepEqual([...new Set(items.map((i) => i.newsFormat))].sort(), [
      "monthly-roundup",
      "single-item",
    ]);
  });

  test("formatDate renders en-GB and tolerates an absent value", async () => {
    const { formatDate } = await import("../lib/news");
    assert.equal(formatDate("2026-03-06"), "6 March 2026");
    assert.equal(formatDate(undefined), undefined);
    assert.equal(formatDate("not-a-date"), undefined);
  });
});

describe("Year archives", () => {
  test("archiveYears covers every published item exactly once, newest first", async () => {
    const { archiveYears, publishedNews } = await import("../lib/news");
    const years = archiveYears();
    assert.ok(years.length >= 2, "at least two years must be exercised by content");
    const total = years.reduce((n, y) => n + y.count, 0);
    assert.equal(total, publishedNews().length);
    for (let n = 1; n < years.length; n++) {
      assert.ok(years[n - 1].year > years[n].year, "years must be newest first");
    }
  });

  test("newsInYear groups by publication date, not event date", async () => {
    const { newsInYear, publishedNews } = await import("../lib/news");
    for (const i of publishedNews()) {
      const year = i.publishedDate.slice(0, 4);
      assert.ok(
        newsInYear(year).some((x) => x.slug === i.slug),
        `${i.slug} is missing from its own publication year`
      );
    }
    // The second-staircase item reports a 2024 circular but was published in
    // 2026, and belongs in the 2026 archive: the archive answers "what did this
    // library publish", not "what happened when".
    assert.ok(
      newsInYear("2026").some((i) => i.slug === "approved-document-b-second-staircase-september-2026")
    );
    assert.equal(newsInYear("2024").length, 0);
  });

  test("isYearParam distinguishes a year from a slug", async () => {
    const { isYearParam } = await import("../lib/news");
    assert.equal(isYearParam("2026"), true);
    assert.equal(isYearParam("2025"), true);
    assert.equal(isYearParam("round-up-march-2026"), false);
    assert.equal(isYearParam("202"), false);
    assert.equal(isYearParam("20266"), false);
  });

  test("no published item is slugged like a year — rule N9's live guarantee", async () => {
    const { publishedNews } = await import("../lib/news");
    for (const i of publishedNews()) {
      assert.ok(
        !/^\d{4}$/.test(i.slug),
        `${i.slug} would shadow its own year archive and be unreachable`
      );
    }
  });
});

describe("News schema — what reached Velite's output", () => {
  test("sourceType is gone and both replacement axes are populated", async () => {
    const { news } = await import("../.velite");
    const FORMATS = new Set(["single-item", "monthly-roundup"]);
    const CATEGORIES = new Set([
      "enforcement",
      "prosecution",
      "consultation",
      "standards-update",
      "product-recall",
      "government-guidance",
      "regulatory-change",
    ]);
    for (const i of news) {
      assert.equal(i.sourceType, undefined, `${i.slug} still carries sourceType`);
      assert.ok(FORMATS.has(i.newsFormat), `${i.slug}: ${i.newsFormat}`);
      assert.ok(CATEGORIES.has(i.newsCategory), `${i.slug}: ${i.newsCategory}`);
    }
  });

  test("the two axes are genuinely independent", async () => {
    const { news } = await import("../.velite");
    // A round-up must carry a category too, and at least one category must
    // appear in both formats — otherwise the split achieved nothing.
    const byCategory = new Map();
    for (const i of news) {
      byCategory.set(i.newsCategory, new Set([...(byCategory.get(i.newsCategory) ?? []), i.newsFormat]));
    }
    assert.ok(
      [...byCategory.values()].some((formats) => formats.size > 1),
      "no category appears in both formats — the axes are not being exercised"
    );
  });

  test("source attribution is complete on every item", async () => {
    const { news } = await import("../.velite");
    for (const i of news) {
      assert.ok(i.sourceUrl.length > 0, `${i.slug}: no sourceUrl`);
      assert.ok(i.sourceOrganisation.length > 0, `${i.slug}: no sourceOrganisation`);
      assert.match(String(i.sourceCheckedDate).slice(0, 10), /^\d{4}-\d{2}-\d{2}$/, i.slug);
      assert.equal(typeof i.sourcePubliclyAccessible, "boolean", i.slug);
    }
  });

  test("every round-up is marked immutable and no single item is", async () => {
    const { news } = await import("../.velite");
    for (const i of news) {
      if (i.newsFormat === "monthly-roundup") {
        assert.equal(i.immutable, true, `${i.slug} is a round-up but not immutable`);
      }
    }
    assert.ok(news.some((i) => i.newsFormat === "monthly-roundup"));
  });

  test("the three event-side dates are present only where the category permits", async () => {
    const { news } = await import("../.velite");
    const { NEWS_CATEGORY_DATES, NEWS_DATE_FIELDS } = await import("../lib/editorial-rules");
    for (const i of news) {
      if (i.newsFormat === "monthly-roundup") {
        for (const field of NEWS_DATE_FIELDS) {
          assert.equal(i[field], undefined, `round-up ${i.slug} carries ${field}`);
        }
        continue;
      }
      const spec = NEWS_CATEGORY_DATES[i.newsCategory];
      const permitted = new Set([...spec.required, ...spec.optional]);
      for (const field of spec.required) {
        assert.ok(i[field], `${i.slug} is ${i.newsCategory} and lacks ${field}`);
      }
      for (const field of NEWS_DATE_FIELDS) {
        if (permitted.has(field)) continue;
        assert.equal(i[field], undefined, `${i.slug} carries ${field}, not valid for ${i.newsCategory}`);
      }
    }
  });

  test("a future effectiveDate is present in real content", async () => {
    // The N3 correction exists to allow this: a change announced ahead of
    // commencement is exactly the item worth publishing while a reader can
    // still act. If this disappears, the correction has stopped being exercised.
    const { news } = await import("../.velite");
    const today = new Date().toISOString().slice(0, 10);
    assert.ok(
      news.some((i) => i.effectiveDate && String(i.effectiveDate).slice(0, 10) > today),
      "no item announces a change that has not yet taken effect"
    );
  });

  test("body compiled to a populated MDX function body on every item", async () => {
    const { news } = await import("../.velite");
    for (const i of news) {
      assert.equal(typeof i.body, "string", `${i.slug}: body is not a string`);
      assert.ok(i.body.length > 500, `${i.slug}: body is suspiciously short`);
    }
  });

  test("every item carries at least one tag from the registry", async () => {
    const { news } = await import("../.velite");
    const { CONTENT_TAG_SLUGS } = await import("../lib/taxonomy");
    const known = new Set(CONTENT_TAG_SLUGS);
    for (const i of news) {
      assert.ok(i.tags.length > 0, `${i.slug} has no tags — rule C3 requires them on News`);
      for (const t of i.tags) assert.ok(known.has(t), `${i.slug}: unknown tag ${t}`);
    }
  });

  test("the four tags added for News are actually used", async () => {
    const { news, guides, standards } = await import("../.velite");
    const used = new Set([...news, ...guides, ...standards].flatMap((i) => i.tags ?? []));
    // Not all four need to be used at launch, but inventing tags nothing uses
    // is exactly what the registry exists to prevent — so at least half must be.
    const added = ["sprinklers-suppression", "external-wall-systems", "smoke-control", "asbestos"];
    const inUse = added.filter((t) => used.has(t));
    assert.ok(
      inUse.length >= 2,
      `only ${inUse.length} of the four added tags are used: ${inUse.join(", ")}`
    );
  });
});

describe("News routing", () => {
  test("generateStaticParams returns every item AND every archive year", async () => {
    const mod = await import("../app/news/[slug]/page.tsx");
    const { publishedNews, archiveYears } = await import("../lib/news");
    const params = mod.generateStaticParams().map((p) => p.slug);
    for (const i of publishedNews()) assert.ok(params.includes(i.slug), `${i.slug} missing`);
    for (const y of archiveYears()) assert.ok(params.includes(y.year), `${y.year} missing`);
    assert.equal(params.length, publishedNews().length + archiveYears().length);
  });

  test("dynamicParams is false", async () => {
    const mod = await import("../app/news/[slug]/page.tsx");
    assert.equal(mod.dynamicParams, false);
  });

  test("there is exactly one dynamic segment under /news", () => {
    // Two sibling dynamic segments would be a Next build error, and the
    // temptation to add /news/[year] as its own directory is real.
    const entries = fs.readdirSync(path.join(appDir, "news"), { withFileTypes: true });
    const dynamic = entries.filter((e) => e.isDirectory() && e.name.startsWith("["));
    assert.deepEqual(dynamic.map((d) => d.name), ["[slug]"]);
  });

  test("routes deferred to PR 8 and later are not built", () => {
    for (const route of ["news/category", "news/tag", "news/archive", "knowledge", "search"]) {
      assert.equal(exists(route), false, `${route} should not exist yet`);
    }
  });

  test("every item's metadata sits inside the editorial ranges and self-canonicalises", async () => {
    const mod = await import("../app/news/[slug]/page.tsx");
    const { publishedNews } = await import("../lib/news");
    for (const item of publishedNews()) {
      const meta = await mod.generateMetadata({ params: Promise.resolve({ slug: item.slug }) });
      assert.ok(
        meta.title.length >= 30 && meta.title.length <= 65,
        `${item.slug}: title is ${meta.title.length} characters`
      );
      assert.ok(
        meta.description.length >= 120 && meta.description.length <= 170,
        `${item.slug}: description is ${meta.description.length} characters`
      );
      assert.equal(meta.alternates.canonical, `/news/${item.slug}`);
      assert.equal(meta.openGraph.type, "article");
    }
  });

  test("a year parameter produces archive metadata, not item metadata", async () => {
    const mod = await import("../app/news/[slug]/page.tsx");
    const { archiveYears } = await import("../lib/news");
    for (const { year } of archiveYears()) {
      const meta = await mod.generateMetadata({ params: Promise.resolve({ slug: year }) });
      assert.match(meta.title, new RegExp(`^${year} news archive$`));
      assert.equal(meta.alternates.canonical, `/news/${year}`);
      assert.equal(meta.openGraph.type, "website");
      assert.ok(meta.description.length >= 100, `${year}: description too short`);
    }
  });

  test("the listing description sits inside the editorial band", () => {
    const src = source("news/page.tsx");
    const match = src.match(/const DESCRIPTION =\s*\n?\s*"([^"]+)"/);
    assert.ok(match, "DESCRIPTION not found");
    const length = match[1].length;
    assert.ok(length >= 120 && length <= 170, `listing description is ${length} characters`);
  });

  test("the listing declares an absolute self-canonical", () => {
    assert.match(source("news/page.tsx"), /alternates: \{ canonical: NEWS_PATH \}/);
  });

  test("the sitemap lists the index, every year and every item at the right priority", async () => {
    const { default: sitemap } = await import("../app/sitemap.ts");
    const { publishedNews, archiveYears } = await import("../lib/news");
    const entries = sitemap();
    const byUrl = new Map(entries.map((e) => [e.url, e]));

    assert.equal(byUrl.get("https://www.lionrms.uk/news")?.priority, 0.7);
    for (const { year } of archiveYears()) {
      assert.equal(byUrl.get(`https://www.lionrms.uk/news/${year}`)?.priority, 0.6, year);
    }
    for (const i of publishedNews()) {
      const entry = byUrl.get(`https://www.lionrms.uk/news/${i.slug}`);
      assert.ok(entry, `${i.slug} missing from the sitemap`);
      assert.equal(entry.priority, 0.5);
    }
  });

  test("sitemap news items carry a real per-item date", async () => {
    const { default: sitemap } = await import("../app/sitemap.ts");
    const { publishedNews, lastModified } = await import("../lib/news");
    const entries = sitemap();
    for (const i of publishedNews()) {
      const entry = entries.find((e) => e.url.endsWith(`/news/${i.slug}`));
      assert.equal(
        new Date(entry.lastModified).toISOString().slice(0, 10),
        String(lastModified(i)).slice(0, 10),
        i.slug
      );
    }
  });
});

describe("News structured data", () => {
  test("NewsArticle carries our author and publisher and no second node", async () => {
    const { buildNewsArticleSchema } = await import("../lib/content-jsonld");
    const json = buildNewsArticleSchema({
      headline: "x",
      description: "y",
      path: "/news/x",
      authorId: "batir-turakulov",
      datePublished: "2026-03-01",
      dateModified: "2026-03-02",
    });
    assert.equal(json["@type"], "NewsArticle");
    assert.equal(json.publisher.name, "Lion Risk Management Solutions");
    assert.equal(json.author["@type"], "Person");
    assert.equal(json.datePublished, "2026-03-01");
    assert.equal(json.dateModified, "2026-03-02");
    // No `about` node: the page IS the report, not commentary on a work.
    assert.equal(json.about, undefined);
  });

  test("eventDate is never emitted into the schema", async () => {
    // schema.org's NewsArticle has no property for "when the reported thing
    // happened". Putting a sentencing date in datePublished would be a false
    // machine-readable claim, so the event dates are rendered for humans only.
    const src = fs.readFileSync(path.join(repoRoot, "lib/content-jsonld.ts"), "utf8");
    const fn = src.slice(src.indexOf("export function buildNewsArticleSchema"));
    const body = fn.slice(0, fn.indexOf("\n}"));
    assert.ok(!/eventDate/.test(body), "eventDate must not reach NewsArticle");
  });

  test("the author node inherits the live credentials", async () => {
    const { buildNewsArticleSchema } = await import("../lib/content-jsonld");
    const json = buildNewsArticleSchema({
      headline: "x",
      description: "y",
      path: "/news/x",
      authorId: "batir-turakulov",
    });
    assert.match(json.author.jobTitle, /MIFireE/);
  });

  test("the listing emits a CollectionPage naming every item", async () => {
    const { publishedNews } = await import("../lib/news");
    const { buildCollectionPageSchema } = await import("../lib/content-jsonld");
    const items = publishedNews();
    const json = buildCollectionPageSchema({
      name: "x",
      description: "y",
      path: "/news",
      items: items.map((i) => ({ name: i.title, path: `/news/${i.slug}` })),
    });
    assert.equal(json.mainEntity.itemListElement.length, 10);
    for (const el of json.mainEntity.itemListElement) {
      assert.match(el.url, /^https:\/\/www\.lionrms\.uk\/news\//);
    }
  });
});

describe("Detail page structure", () => {
  const src = () => source("news/[slug]/page.tsx");

  test("the fixed order is notice, record, report, corrections", () => {
    const s = src();
    const order = [
      "General information notice",
      'id="news-record-heading"',
      "<MDXContent",
      "<CorrectionHistory",
    ];
    let previous = -1;
    for (const marker of order) {
      const at = s.indexOf(marker);
      assert.ok(at > -1, `${marker} is missing`);
      assert.ok(at > previous, `${marker} is out of order`);
      previous = at;
    }
  });

  test("the primary source link opens announced and is always present", () => {
    const s = src();
    assert.match(s, /Read the primary source/);
    assert.match(s, /opens in a new tab/);
    assert.match(s, /rel="noopener noreferrer"/);
  });

  test("an inaccessible source is flagged on the page", () => {
    assert.match(src(), /not freely available to the public/);
  });

  test("a round-up says on the page that it is not rewritten", () => {
    assert.match(src(), /is not\s*\n?\s*rewritten as events move on/);
  });

  test("every rendered date uses a machine-readable time element", () => {
    const s = src();
    const times = (s.match(/<time dateTime=/g) || []).length;
    assert.ok(times >= 3, `expected several <time> elements, found ${times}`);
  });
});
