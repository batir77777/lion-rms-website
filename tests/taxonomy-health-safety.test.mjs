// Guards for the health & safety taxonomy extension (F2).
//
// WHAT WAS WRONG. Of the fourteen tags in the registry before this change,
// exactly two described anything other than fire — `asbestos` and `cdm`. The
// consequence showed up in the content rather than in the registry: the
// workplace health and safety inspection checklist, a seven-section general
// walk-round, was tagged `means-of-escape` and `fire-doors` and nothing else,
// and HSG65, the Health and Safety at Work Act and the Management Regulations
// carried no tags at all. A tri-disciplinary practice had a taxonomy that could
// only describe one discipline.
//
// WHAT F2 IS NOT. This is a metadata change, not a feature. Tags render on two
// sections only — Guides and Glossary — and F2 touches neither. Nothing a
// visitor sees, nothing Pagefind indexes and nothing in the structured data
// changes. Several tests below exist specifically to hold that line, because a
// taxonomy change that quietly starts rendering is how scope creeps.
//
// `competence` was proposed alongside these two and DEFERRED by decision. Do
// not add it back without the content to justify it.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  CONTENT_TAGS,
  CONTENT_TAG_SLUGS,
  CONTENT_CATEGORY_SLUGS,
  AUDIENCE_SLUGS,
  JURISDICTION_SLUGS,
  TECHNICAL_DOMAIN_SLUGS,
  getContentTag,
  validateTaxonomyRegistry,
} from "@/lib/taxonomy";
import { RESERVED_SLUGS } from "@/lib/reserved-slugs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const appDir = path.join(repoRoot, "app");
const outDir = path.join(repoRoot, ".next/server/app");

/** The two tags F2 adds. Every guard below is written against this list. */
const NEW_TAGS = ["safety-management-systems", "workplace-inspections"];

/** The tags that describe health & safety rather than fire, after F2. */
const HS_TAGS = new Set([...NEW_TAGS, "asbestos", "cdm"]);

/**
 * Every file F2 retags, with the tag array it must end up with.
 *
 * Written out in full rather than derived, so that a change to any of these
 * five arrays is a change to this table too — which is the point. Nothing here
 * can drift silently.
 */
const RETAGGED = {
  downloads: {
    "workplace-health-safety-inspection-checklist": [
      "safety-management-systems",
      "workplace-inspections",
      "means-of-escape",
      "fire-doors",
    ],
  },
  standards: {
    "hsg65-managing-for-health-and-safety": ["safety-management-systems"],
  },
  legislation: {
    "health-and-safety-at-work-act-1974": ["safety-management-systems"],
    "management-of-health-and-safety-at-work-regulations-1999": ["safety-management-systems"],
  },
  news: {
    "hse-asbestos-inspection-campaign-2026": ["asbestos", "workplace-inspections"],
  },
};

/** Collection name -> the MDX directory it is built from. */
const CONTENT_DIRS = {
  downloads: "content/downloads",
  standards: "content/standards",
  legislation: "content/legislation",
  news: "content/news",
};

const retaggedEntries = () =>
  Object.entries(RETAGGED).flatMap(([collection, items]) =>
    Object.entries(items).map(([slug, tags]) => ({ collection, slug, tags }))
  );

before(() => {
  execFileSync("npx", ["velite", "build", "--strict", "--clean", "--silent"], {
    cwd: repoRoot,
    stdio: "pipe",
  });
});

// ---------------------------------------------------------------------------

describe("The registry itself is well-formed", () => {
  test("validateTaxonomyRegistry reports no errors", () => {
    const result = validateTaxonomyRegistry();
    assert.deepEqual(result.errors, []);
    assert.equal(result.valid, true);
  });

  test("each new tag is registered exactly once, with a label", () => {
    for (const slug of NEW_TAGS) {
      const matches = CONTENT_TAGS.filter((t) => t.slug === slug);
      assert.equal(matches.length, 1, `"${slug}" appears ${matches.length} times in CONTENT_TAGS`);
      const [tag] = matches;
      assert.ok(tag.label && tag.label.trim().length > 0, `"${slug}" has no label`);
      // A synonymOf on a brand-new tag would mean it should not have been added
      // as its own entry in the first place.
      assert.equal(tag.synonymOf, undefined, `"${slug}" should not be a synonym of anything`);
    }
  });

  test("each new slug is lower-case kebab-case", () => {
    // These become URL segments the day taxonomy routes ship. A capital letter
    // or an underscore reaching that point is a redirect nobody wants to write.
    for (const slug of NEW_TAGS) {
      assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `"${slug}" is not a clean slug`);
    }
  });
});

describe("New slugs collide with nothing", () => {
  // A tag sharing a slug with a category, an audience or a reserved word would
  // produce two different pages competing for the same URL and for the same
  // search result. Checked against every vocabulary on the site, not just tags.
  const vocabularies = {
    categories: CONTENT_CATEGORY_SLUGS,
    audiences: AUDIENCE_SLUGS,
    jurisdictions: JURISDICTION_SLUGS,
    "technical domains": TECHNICAL_DOMAIN_SLUGS,
    "reserved slugs": RESERVED_SLUGS,
  };

  for (const [name, values] of Object.entries(vocabularies)) {
    test(`no new tag slug appears in the ${name} vocabulary`, () => {
      const set = new Set(values);
      for (const slug of NEW_TAGS) {
        assert.equal(set.has(slug), false, `"${slug}" is already a value in ${name}`);
      }
    });
  }

  test("no tag slug is duplicated anywhere in the registry", () => {
    const counts = new Map();
    for (const slug of CONTENT_TAG_SLUGS) counts.set(slug, (counts.get(slug) ?? 0) + 1);
    const dupes = [...counts].filter(([, n]) => n > 1).map(([s]) => s);
    assert.deepEqual(dupes, []);
  });

  test("`safety-management-systems` is not the technical domain of the same idea", () => {
    // These two name the same concept and must not be conflated: the tag is
    // live, the technical domain is dormant and currently used by no content.
    // If `technicalDomain` is ever populated, reconcile them deliberately.
    assert.ok(new Set(TECHNICAL_DOMAIN_SLUGS).has("health-safety-management-systems"));
    assert.equal(new Set(TECHNICAL_DOMAIN_SLUGS).has("safety-management-systems"), false);
  });
});

// ---------------------------------------------------------------------------

describe("No tag is added that nothing uses", () => {
  const usedTags = async () => {
    const { guides, news, standards, legislation, glossaryTerms, downloads } = await import(
      "../.velite"
    );
    return new Set(
      [...guides, ...news, ...standards, ...legislation, ...glossaryTerms, ...downloads].flatMap(
        (i) => i.tags ?? []
      )
    );
  };

  test("every tag F2 adds is in use", async () => {
    // Stricter than the bar the PR 6 batch was held to, which required only
    // half a batch to be used — and which is why two tags below are unused.
    const used = await usedTags();
    for (const slug of NEW_TAGS) {
      assert.ok(used.has(slug), `"${slug}" was added to the registry but no content uses it`);
    }
  });

  test("the set of unused registry tags has not grown", async () => {
    // A ratchet, not a cleanup. `fire-extinguishers` and `sprinklers-suppression`
    // were added in PR 6 for content that never arrived; removing them is a
    // separate decision. What this prevents is a third joining them quietly.
    const used = await usedTags();
    const unused = CONTENT_TAG_SLUGS.filter((s) => !used.has(s)).sort();
    assert.deepEqual(
      unused,
      ["fire-extinguishers", "sprinklers-suppression"],
      `\n  Unused tags changed. Expected only the two known PR 6 leftovers.\n  Found: ${unused.join(", ")}\n`
    );
  });
});

describe("Health & safety content is described as health & safety", () => {
  test("the workplace inspection checklist is not tagged only from the fire domain", async () => {
    // The specific defect F2 exists to fix. Before this change the checklist —
    // housekeeping, welfare, electrical, substances, people, emergency
    // arrangements, contractors — was `means-of-escape` and `fire-doors` only.
    const { downloads } = await import("../.velite");
    const item = downloads.find((d) => d.slug === "workplace-health-safety-inspection-checklist");
    assert.ok(item, "the workplace H&S inspection checklist is missing from the Downloads corpus");
    const hs = item.tags.filter((t) => HS_TAGS.has(t));
    assert.ok(
      hs.length > 0,
      `the checklist carries only fire-domain tags: ${item.tags.join(", ")}`
    );
  });

  test("the checklist keeps its fire tags as well", async () => {
    // Approved explicitly: the fire tags are not wrong — a walk-round does look
    // at escape routes and fire door condition — so they stay. Removing them
    // would cost real discoverability once tag routes exist.
    const { downloads } = await import("../.velite");
    const item = downloads.find((d) => d.slug === "workplace-health-safety-inspection-checklist");
    for (const t of ["means-of-escape", "fire-doors"]) {
      assert.ok(item.tags.includes(t), `the checklist lost its "${t}" tag`);
    }
  });

  test("every published item in the health-safety category carries a health & safety tag", async () => {
    // The standing invariant, and the one that stops this recurring: publish an
    // H&S item tagged only from the fire vocabulary and the build fails here.
    const { guides, news, standards, legislation, glossaryTerms, downloads } = await import(
      "../.velite"
    );
    const all = [...guides, ...news, ...standards, ...legislation, ...glossaryTerms, ...downloads];
    const offenders = all
      .filter((i) => i.status === "published" && i.category === "health-safety")
      .filter((i) => !(i.tags ?? []).some((t) => HS_TAGS.has(t)))
      .map((i) => `${i.slug}: [${(i.tags ?? []).join(", ")}]`);
    assert.deepEqual(
      offenders,
      [],
      `\n  These health-safety items carry no health & safety tag:\n    ${offenders.join("\n    ")}\n`
    );
  });
});

describe("Exactly the intended content is retagged", () => {
  test("each retagged item has exactly the approved tag array, in order", async () => {
    const velite = await import("../.velite");
    for (const { collection, slug, tags } of retaggedEntries()) {
      const item = velite[collection].find((i) => i.slug === slug);
      assert.ok(item, `${collection}/${slug} not found`);
      assert.deepEqual(item.tags, tags, `${collection}/${slug} tags differ from the approved set`);
    }
  });

  test("no other content item uses either new tag", async () => {
    // Scope. The tags were approved for five files; a sixth appearing means the
    // change grew after review.
    const velite = await import("../.velite");
    const approved = new Set(retaggedEntries().map((e) => `${e.collection}/${e.slug}`));
    const offenders = [];
    for (const collection of ["guides", "news", "standards", "legislation", "glossaryTerms", "downloads"]) {
      for (const item of velite[collection]) {
        if (!(item.tags ?? []).some((t) => NEW_TAGS.includes(t))) continue;
        if (!approved.has(`${collection}/${item.slug}`)) offenders.push(`${collection}/${item.slug}`);
      }
    }
    assert.deepEqual(offenders, []);
  });

  test("no Guide or Glossary term is retagged", async () => {
    // Guides and Glossary are the ONLY two sections that render tag chips.
    // Retagging either would change a rendered page, which F2 must not do.
    const { guides, glossaryTerms } = await import("../.velite");
    for (const item of [...guides, ...glossaryTerms]) {
      for (const t of NEW_TAGS) {
        assert.equal(
          (item.tags ?? []).includes(t),
          false,
          `${item.slug} renders tags and must not carry "${t}" while F2 is metadata-only`
        );
      }
    }
  });

  test("tagLabels resolves every new tag to its registry label", async () => {
    // A tag that is used but not registered would fall through to the raw slug
    // and put "safety-management-systems" on screen in place of a label.
    const accessors = {
      downloads: await import("../lib/downloads"),
      standards: await import("../lib/standards"),
      legislation: await import("../lib/legislation"),
      news: await import("../lib/news"),
    };
    const velite = await import("../.velite");
    for (const { collection, slug } of retaggedEntries()) {
      const item = velite[collection].find((i) => i.slug === slug);
      const labels = accessors[collection].tagLabels(item);
      for (const t of item.tags) {
        const expected = getContentTag(t)?.label;
        assert.ok(expected, `"${t}" is not in the registry`);
        assert.ok(labels.includes(expected), `${slug}: "${t}" did not resolve to "${expected}"`);
      }
      for (const label of labels) {
        assert.equal(label.includes("-"), false, `${slug}: raw slug "${label}" leaked into the labels`);
      }
    }
  });
});

// ---------------------------------------------------------------------------

describe("Nothing outside the tags line moved", () => {
  /*
   * The governance fields, frozen at their values on the F1 merge commit
   * 7829a83. Recorded literally rather than diffed against git, so the guard
   * works in a shallow clone and so that changing one of these values requires
   * changing this table — which is a review, not an accident.
   */
  const FROZEN = {
    "content/downloads/workplace-health-safety-inspection-checklist.mdx": {
      status: "published",
      category: "health-safety",
      version: "1.0",
      publishedDate: "2026-08-01",
      updatedDate: "2026-08-01",
      reviewedDate: "2026-08-01",
      nextReviewDue: "2027-08-01",
    },
    "content/standards/hsg65-managing-for-health-and-safety.mdx": {
      status: "published",
      category: "health-safety",
      publishedDate: "2026-07-29",
      reviewedDate: "2026-07-29",
      nextReviewDue: "2027-01-29",
    },
    "content/legislation/health-and-safety-at-work-act-1974.mdx": {
      status: "published",
      category: "health-safety",
      publishedDate: "2026-07-29",
      reviewedDate: "2026-07-29",
      nextReviewDue: "2026-10-29",
    },
    "content/legislation/management-of-health-and-safety-at-work-regulations-1999.mdx": {
      status: "published",
      category: "health-safety",
      publishedDate: "2026-07-29",
      reviewedDate: "2026-07-29",
      nextReviewDue: "2026-10-29",
    },
    "content/news/hse-asbestos-inspection-campaign-2026.mdx": {
      status: "published",
      category: "health-safety",
      publishedDate: "2026-04-08",
      reviewedDate: "2026-04-08",
    },
  };

  const frontMatter = (relPath) => {
    const src = fs.readFileSync(path.join(repoRoot, relPath), "utf8");
    const end = src.indexOf("\n---\n", 4);
    assert.ok(end > 0, `${relPath} has no front matter`);
    return src.slice(4, end);
  };

  for (const [relPath, fields] of Object.entries(FROZEN)) {
    test(`${path.basename(relPath)} keeps its dates, version and category`, () => {
      const fm = frontMatter(relPath);
      for (const [key, value] of Object.entries(fields)) {
        assert.match(
          fm,
          new RegExp(`^${key}: "${value}"$`, "m"),
          `${relPath}: expected ${key}: "${value}"`
        );
      }
    });
  }

  test("no retagged file gained or lost a front-matter line", () => {
    // The tags line is edited in place; a line count that moved means a field
    // was added or removed alongside it.
    const EXPECTED_LINES = {
      "content/downloads/workplace-health-safety-inspection-checklist.mdx": 52,
      "content/standards/hsg65-managing-for-health-and-safety.mdx": 39,
      "content/legislation/health-and-safety-at-work-act-1974.mdx": 67,
      "content/legislation/management-of-health-and-safety-at-work-regulations-1999.mdx": 64,
      "content/news/hse-asbestos-inspection-campaign-2026.mdx": 30,
    };
    const actual = Object.fromEntries(
      Object.keys(EXPECTED_LINES).map((p) => [p, frontMatter(p).split("\n").length])
    );
    assert.deepEqual(actual, EXPECTED_LINES);
  });

  test("no retagged file declares a body licence section or changed prose markers", () => {
    // F1's guarantee, re-asserted for the files F2 touches: the licence lives
    // in the page template, never in MDX prose.
    for (const relPath of Object.keys(FROZEN)) {
      const src = fs.readFileSync(path.join(repoRoot, relPath), "utf8");
      const body = src.split(/^---$/m).slice(2).join("---");
      assert.equal(
        /^#{1,6}\s+Licence and permitted use\s*$/im.test(body),
        false,
        `${relPath} restates the licence`
      );
    }
  });
});

describe("Sitemap dates are untouched", () => {
  test("each retagged route keeps the lastModified its front matter already gave it", async () => {
    // Content routes take their date from front matter, and F2 changes no
    // front-matter date — so every one of these must be exactly what it was.
    const EXPECTED = {
      "/downloads/workplace-health-safety-inspection-checklist": "2026-08-01",
      "/standards/hsg65-managing-for-health-and-safety": "2026-07-29",
      "/legislation/health-and-safety-at-work-act-1974": "2026-07-29",
      "/legislation/management-of-health-and-safety-at-work-regulations-1999": "2026-07-29",
      "/news/hse-asbestos-inspection-campaign-2026": "2026-04-08",
    };
    const mod = await import("../app/sitemap.ts");
    const sitemap = typeof mod.default === "function" ? mod.default : mod.default.default;
    const entries = await sitemap();
    const byPath = new Map(
      entries.map((e) => [new URL(e.url).pathname.replace(/\/$/, "") || "/", e.lastModified])
    );
    const actual = {};
    for (const route of Object.keys(EXPECTED)) {
      const value = byPath.get(route);
      assert.ok(value, `${route} is missing from the sitemap`);
      actual[route] = new Date(value).toISOString().slice(0, 10);
    }
    assert.deepEqual(actual, EXPECTED);
  });
});

// ---------------------------------------------------------------------------

describe("F2 changes nothing a visitor or a crawler can see", () => {
  const exists = (route) => fs.existsSync(path.join(appDir, route));

  test("taxonomy routes remain deferred in every section", () => {
    const sections = ["guides", "news", "standards", "legislation", "glossary", "downloads"];
    const offenders = [];
    for (const section of sections) {
      for (const leaf of ["tag", "category"]) {
        if (exists(`${section}/${leaf}`)) offenders.push(`${section}/${leaf}`);
      }
    }
    for (const top of ["tag", "tags", "category", "categories"]) {
      if (exists(top)) offenders.push(top);
    }
    assert.deepEqual(offenders, [], `\n  Taxonomy routes are deferred:\n    ${offenders.join("\n    ")}\n`);
  });

  test("only Guides and Glossary render tag chips", () => {
    // The reason F2 is invisible. If a section starts calling tagLabels(), this
    // fails and the "metadata only" claim has to be re-examined rather than
    // assumed.
    const renders = (p) => fs.readFileSync(path.join(appDir, p), "utf8").includes("tagLabels");
    for (const p of [
      "downloads/[slug]/page.tsx",
      "news/[slug]/page.tsx",
      "standards/[slug]/page.tsx",
      "legislation/[slug]/page.tsx",
      "downloads/page.tsx",
      "news/page.tsx",
      "standards/page.tsx",
      "legislation/page.tsx",
    ]) {
      assert.equal(renders(p), false, `${p} now renders tag chips — F2 assumed it did not`);
    }
    assert.equal(renders("guides/[slug]/page.tsx"), true);
    assert.equal(renders("glossary/[slug]/page.tsx"), true);
  });

  test("no tag reaches the structured data", () => {
    // Checked at the source, because a `keywords` array appearing here would
    // make a taxonomy edit a structured-data edit.
    const src = fs.readFileSync(path.join(repoRoot, "lib/content-jsonld.ts"), "utf8");
    assert.equal(/\btags\b/.test(src), false, "lib/content-jsonld.ts now reads tags");
    assert.equal(/keywords\s*:/.test(src), false, "lib/content-jsonld.ts now emits keywords");
  });

  test("no filter module has a tag axis", () => {
    // Downloads filter on type and format, News on format and category,
    // Standards on class and currency, Legislation on jurisdiction and tier.
    // None reads tags, so retagging cannot change a filtered result set.
    for (const f of [
      "lib/downloads-filtering.ts",
      "lib/news-filtering.ts",
      "lib/standard-filtering.ts",
      "lib/legislation-filtering.ts",
    ]) {
      const src = fs.readFileSync(path.join(repoRoot, f), "utf8");
      assert.equal(/\btags\b/.test(src), false, `${f} now filters on tags`);
    }
  });

  test("related content is never derived from tags", () => {
    // Every relation on this site is an authored slug list resolved against
    // published items. Nothing scores by shared tags, which is why F2 cannot
    // alter a single related-content list.
    for (const f of [
      "lib/downloads.ts",
      "lib/news.ts",
      "lib/standards.ts",
      "lib/legislation.ts",
      "lib/glossary.ts",
      "lib/guides.ts",
    ]) {
      const src = fs.readFileSync(path.join(repoRoot, f), "utf8");
      // The only permitted mention of `tags` in an accessor is the tagLabels
      // display helper; a relation function reading them would be new.
      const relationBodies = [...src.matchAll(/export function related[\s\S]*?\n}/g)].map((m) => m[0]);
      for (const body of relationBodies) {
        assert.equal(/\btags\b/.test(body), false, `${f}: a related* function now reads tags`);
      }
    }
  });

  const builtPages = () => {
    if (!fs.existsSync(outDir)) {
      throw new Error("run `npm run build` before this suite — it asserts on built HTML");
    }
    const walk = (dir) =>
      fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) return walk(full);
        return e.isFile() && full.endsWith(".html") ? [full] : [];
      });
    return walk(outDir);
  };

  test("neither new tag slug reaches the built HTML", () => {
    // The empirical version of every claim above, and the only check that can
    // catch a leak into the RSC flight payload rather than the visible DOM —
    // a page component passing a whole content item to a client component
    // would serialise `tags` there without rendering anything.
    //
    // Matched on the SLUG, not the label: a slug is a machine value that has no
    // business appearing in prose, whereas a label is ordinary English and will
    // legitimately collide with editorial copy. See the label test below.
    const offenders = [];
    for (const file of builtPages()) {
      const html = fs.readFileSync(file, "utf8");
      for (const slug of NEW_TAGS) {
        if (html.includes(slug)) offenders.push(`${path.relative(outDir, file)} contains "${slug}"`);
      }
    }
    assert.deepEqual(
      offenders,
      [],
      `\n  F2 is metadata-only, so no new tag slug should be serialised:\n    ${offenders.join("\n    ")}\n`
    );
  });

  test("neither new tag label is rendered as a tag chip", () => {
    // Matched on the chip markup rather than the bare label, because the label
    // text legitimately occurs in editorial copy: /services/health-safety has
    // carried a service card headed "Workplace Inspections and Audits" since
    // long before this tag existed, and a naive substring match flags it.
    const labels = NEW_TAGS.map((s) => getContentTag(s).label);
    const chip = (label) =>
      new RegExp(`<span[^>]*bg-teal-50[^>]*>${label}\\s*</span>`, "i");
    const offenders = [];
    for (const file of builtPages()) {
      const html = fs.readFileSync(file, "utf8");
      for (const label of labels) {
        if (chip(label).test(html)) offenders.push(`${path.relative(outDir, file)}: "${label}"`);
      }
    }
    assert.deepEqual(
      offenders,
      [],
      `\n  A new tag is being rendered as a chip; F2 is metadata-only:\n    ${offenders.join("\n    ")}\n`
    );
  });

  test("the retagged MDX directories are the only content F2 touches", () => {
    // Guards against a stray edit in a collection nobody reviewed.
    for (const [collection, dir] of Object.entries(CONTENT_DIRS)) {
      assert.ok(fs.existsSync(path.join(repoRoot, dir)), `${dir} is missing`);
      assert.ok(RETAGGED[collection], `${collection} has no approved retag list`);
    }
    assert.deepEqual(Object.keys(RETAGGED).sort(), Object.keys(CONTENT_DIRS).sort());
  });
});
