// Guards for the Knowledge Centre hub, /search and the navigation change
// (Phase 5A, PR 9).
//
// Follows the habit established in site-quality.test.mjs: anything that is not
// visible from source is asserted against BUILT HTML. Metadata is the obvious
// case — robots and canonical tags arrive partly by inheritance from the root
// layout, so a source-level check can pass while the emitted page is wrong.
//
// The other thing asserted here is a NEGATIVE: that ordinary pages gained no
// search JavaScript. That is a property of every page except two, so it is
// checked by sweeping every built page rather than by listing the ones we
// happened to think of.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/* The transpiler double-wraps the route module's default export under the test
   runner (module.default.default), so unwrap until a callable is reached
   rather than depending on which interop layer is in play. */
import * as sitemapModule from "@/app/sitemap";

const resolveDefault = (mod) => {
  let value = mod;
  while (value && typeof value !== "function" && "default" in value) value = value.default;
  if (typeof value !== "function") throw new Error("could not resolve the sitemap function");
  return value;
};
import {
  KNOWLEDGE_PATH,
  SEARCH_PATH,
  KNOWLEDGE_SECTIONS,
  recentlyUpdated,
  totalKnowledgeItems,
} from "@/lib/knowledge";
import { KNOWLEDGE_SECTIONS as NAV_SECTIONS, SEARCH_HREF } from "@/components/KnowledgeCentreNav";
import { NAV, SITE_URL } from "@/lib/site";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join(repoRoot, ".next/server/app");

const read = (p) => fs.readFileSync(path.join(repoRoot, p), "utf8");

/*
 * React splits adjacent text nodes with empty comments, so "7 guides" is
 * emitted as "7<!-- --> <!-- -->guides". Strip them, so assertions can be
 * written about what a reader sees rather than about React's serialisation.
 */
const html = (route) =>
  fs.readFileSync(path.join(outDir, `${route}.html`), "utf8").replaceAll("<!-- -->", "");
const meta = (src, re) => src.match(re)?.[1];

/* Comments in a component describe what it deliberately does NOT do — this
   file asserts that the search UI is not a combobox, and the component says so
   in prose. Strip comments before asserting on source, or the prose satisfies
   the check the code was meant to. Same helper as site-quality.test.mjs. */
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");

const builtPages = (dir = outDir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) builtPages(full, out);
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
};

before(() => {
  if (!fs.existsSync(outDir)) {
    throw new Error("run `next build` before this suite — it asserts on built HTML");
  }
});

describe("/knowledge exists and is the hub", () => {
  test("the page is prerendered", () => {
    assert.ok(fs.existsSync(path.join(outDir, "knowledge.html")));
  });

  test("it links to all six sections", () => {
    const src = html("knowledge");
    for (const section of KNOWLEDGE_SECTIONS) {
      assert.ok(src.includes(`href="${section.path}"`), `/knowledge does not link to ${section.path}`);
    }
  });

  test("it states a count for every section, and the counts are real", () => {
    const src = html("knowledge");
    for (const section of KNOWLEDGE_SECTIONS) {
      const count = section.count();
      const noun = count === 1 ? section.noun[0] : section.noun[1];
      assert.ok(
        src.includes(`${count} ${noun}`),
        `/knowledge does not show "${count} ${noun}" for ${section.label}`
      );
    }
    assert.ok(html("knowledge").includes(String(totalKnowledgeItems())));
  });

  test("it shows six recently updated items, no more than one per section", () => {
    const updates = recentlyUpdated(6);
    assert.equal(updates.length, 6);

    const perSection = new Map();
    for (const update of updates) {
      perSection.set(update.section.segment, (perSection.get(update.section.segment) ?? 0) + 1);
    }
    // Six sections and six slots, so one each is achievable and must be achieved.
    for (const [segment, count] of perSection) {
      assert.equal(count, 1, `${segment} appears ${count} times in the recently updated list`);
    }

    const src = html("knowledge");
    for (const update of updates) {
      assert.ok(src.includes(`href="${update.href}"`), `/knowledge omits ${update.href}`);
    }
  });

  test("recently updated is ordered most recent first", () => {
    const dates = recentlyUpdated(6).map((u) => u.date);
    assert.deepEqual(dates, [...dates].sort().reverse());
  });

  test("every recently updated item carries a machine-readable date", () => {
    const src = html("knowledge");
    for (const update of recentlyUpdated(6)) {
      assert.ok(
        new RegExp(`datetime="${update.date}"`, "i").test(src),
        `/knowledge shows ${update.href} without a <time datetime> value`
      );
    }
  });
});

describe("Metadata — /knowledge is indexable, /search is not", () => {
  test("/knowledge is index, follow", () => {
    const src = html("knowledge");
    const robots = meta(src, /<meta name="robots" content="([^"]+)"/);
    // Absent is the correct outcome: no robots tag means index, follow. An
    // explicit "index, follow" is also acceptable; "noindex" is not.
    if (robots) assert.doesNotMatch(robots, /noindex/);
  });

  test("/knowledge is self-canonical", () => {
    // Next.js resolves canonical against metadataBase, so the emitted value is
    // absolute. Asserting on the emitted form is the point of reading built HTML.
    const canonical = meta(html("knowledge"), /<link rel="canonical" href="([^"]+)"/);
    assert.equal(canonical, `${SITE_URL}${KNOWLEDGE_PATH}`);
  });

  test("/knowledge declares its own Open Graph and Twitter metadata", () => {
    const src = html("knowledge");
    for (const property of ["og:title", "og:description", "og:url", "og:image"]) {
      assert.match(src, new RegExp(`property="${property}"`), `/knowledge is missing ${property}`);
    }
    for (const name of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
      assert.match(src, new RegExp(`name="${name}"`), `/knowledge is missing ${name}`);
    }
    // Not inherited from the root layout — the defect PR 24 was opened for.
    const ogTitle = meta(src, /<meta property="og:title" content="([^"]+)"/);
    const homeOgTitle = meta(html("index"), /<meta property="og:title" content="([^"]+)"/);
    assert.notEqual(ogTitle, homeOgTitle);
  });

  test("/search is noindex, follow", () => {
    const robots = meta(html("search"), /<meta name="robots" content="([^"]+)"/);
    assert.ok(robots, "/search emits no robots directive at all");
    assert.match(robots, /noindex/);
    assert.match(robots, /follow/);
    assert.doesNotMatch(robots, /nofollow/);
  });

  test("/search is canonical to itself WITHOUT query parameters", () => {
    const canonical = meta(html("search"), /<link rel="canonical" href="([^"]+)"/);
    assert.equal(canonical, `${SITE_URL}${SEARCH_PATH}`);
    assert.ok(!canonical.includes("?"), "the /search canonical carries a query string");
  });
});

describe("Sitemap", () => {
  const sitemap = resolveDefault(sitemapModule);
  const entries = sitemap();
  const urls = entries.map((e) => e.url);

  test("/knowledge is listed exactly once", () => {
    const matches = urls.filter((u) => u.endsWith(KNOWLEDGE_PATH));
    assert.equal(matches.length, 1);
  });

  test("/search is absent — a sitemap must not list a noindexed URL", () => {
    assert.ok(!urls.some((u) => u.endsWith(SEARCH_PATH) || u.includes(`${SEARCH_PATH}?`)));
  });

  test("no existing URL was moved out of the sitemap", () => {
    // PR 9 adds a hub; it does not migrate anything. Every section landing page
    // that was listed before must still be listed.
    for (const section of KNOWLEDGE_SECTIONS) {
      assert.ok(
        urls.some((u) => u.endsWith(section.path)),
        `${section.path} has disappeared from the sitemap`
      );
    }
  });
});

describe("Navigation", () => {
  test("the primary nav Knowledge Centre item points at /knowledge", () => {
    const item = NAV.find((n) => n.label === "Knowledge Centre");
    assert.ok(item, "the Knowledge Centre nav item is gone");
    assert.equal(item.href, KNOWLEDGE_PATH);
  });

  test("/guides is untouched — this is a destination change, not a URL move", () => {
    assert.ok(fs.existsSync(path.join(outDir, "guides.html")));
    const redirects = read("vercel.json");
    assert.ok(!redirects.includes('"/guides"'), "/guides has been given a redirect");
  });

  test("KnowledgeCentreNav includes /knowledge and every section", () => {
    assert.equal(NAV_SECTIONS[0].href, KNOWLEDGE_PATH);
    for (const section of KNOWLEDGE_SECTIONS) {
      assert.ok(
        NAV_SECTIONS.some((n) => n.href === section.path),
        `KnowledgeCentreNav omits ${section.path}`
      );
    }
  });

  test("KnowledgeCentreNav carries the compact search link", () => {
    assert.equal(SEARCH_HREF, SEARCH_PATH);
    assert.ok(html("guides").includes(`href="${SEARCH_PATH}"`));
  });
});

describe("Breadcrumbs point at the hub, consistently with the primary navigation", () => {
  // Before PR 9 the "Knowledge Centre" crumb pointed at /guides, because that
  // was where the header sent you too. Now the header points at /knowledge, so
  // a crumb still pointing at /guides would give one label two destinations.
  const CRUMB_MODULES = [
    ["@/lib/guides", ["buildGuideBreadcrumbs", "GUIDES_INDEX_CRUMBS"]],
    ["@/lib/glossary", ["buildTermBreadcrumbs", "GLOSSARY_INDEX_CRUMBS"]],
    ["@/lib/standards", ["buildStandardBreadcrumbs", "STANDARDS_INDEX_CRUMBS"]],
    ["@/lib/legislation", ["buildLegislationBreadcrumbs", "LEGISLATION_INDEX_CRUMBS"]],
    ["@/lib/news", ["buildNewsBreadcrumbs", "NEWS_INDEX_CRUMBS", "buildYearBreadcrumbs"]],
    ["@/lib/downloads", ["buildDownloadBreadcrumbs", "DOWNLOADS_INDEX_CRUMBS"]],
  ];

  test("no source file hardcodes /guides as the Knowledge Centre destination", () => {
    const offenders = [];
    for (const dir of ["lib", "app", "components"]) {
      const walk = (d) => {
        for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
          const full = path.join(d, entry.name);
          if (entry.isDirectory()) walk(full);
          else if (/\.tsx?$/.test(entry.name)) {
            const src = read(path.relative(repoRoot, full));
            if (src.includes('{ name: "Knowledge Centre", path: "/guides" }')) {
              offenders.push(path.relative(repoRoot, full));
            }
          }
        }
      };
      walk(path.join(repoRoot, dir));
    }
    assert.deepEqual(offenders, []);
  });

  test("every built page's visible trail links Knowledge Centre to /knowledge", () => {
    // Swept over built HTML rather than source, because the visible trail and
    // the JSON-LD are rendered from the same Crumb[] and both must agree.
    for (const file of builtPages()) {
      const src = fs.readFileSync(file, "utf8").replaceAll("<!-- -->", "");
      const route = path.relative(outDir, file).replace(/\.html$/, "");
      const trail = src.match(/<nav aria-label="Breadcrumb"[\s\S]*?<\/nav>/)?.[0];
      if (!trail || !trail.includes("Knowledge Centre")) continue;
      const linked = /href="([^"]+)"[^>]*>Knowledge Centre</.exec(trail);
      if (!linked) continue; // terminal, unlinked crumb — /knowledge itself
      assert.equal(
        linked[1],
        KNOWLEDGE_PATH,
        `${route} links its Knowledge Centre crumb to ${linked[1]}`
      );
    }
  });

  test("the BreadcrumbList structured data carries the same destination", () => {
    for (const file of builtPages()) {
      const src = fs.readFileSync(file, "utf8");
      const route = path.relative(outDir, file).replace(/\.html$/, "");
      for (const [, item] of src.matchAll(
        /"name":"Knowledge Centre","item":"([^"]+)"/g
      )) {
        assert.equal(
          item,
          `${SITE_URL}${KNOWLEDGE_PATH}`,
          `${route} has BreadcrumbList JSON-LD pointing at ${item}`
        );
      }
    }
  });

  test("every section's trail includes its own section, Guides included", async () => {
    for (const [module, exports] of CRUMB_MODULES) {
      const mod = await import(module);
      for (const name of exports) {
        assert.ok(mod[name], `${module} does not export ${name}`);
      }
    }
    // Guides was the exception until PR 9: "Knowledge Centre" WAS /guides, so
    // a Guides crumb would have been the same link twice. Now that the label
    // points at the hub, a guide page must still offer its way back.
    const { buildGuideBreadcrumbs, publishedGuides } = await import("@/lib/guides");
    const trail = buildGuideBreadcrumbs(publishedGuides()[0]);
    assert.deepEqual(
      trail.map((c) => c.path ?? null),
      ["/", KNOWLEDGE_PATH, "/guides", null]
    );
  });

  test("the terminal crumb is never a link, on the hub or anywhere else", async () => {
    const { KNOWLEDGE_INDEX_CRUMBS, SEARCH_CRUMBS } = await import("@/lib/knowledge");
    const { GUIDES_INDEX_CRUMBS } = await import("@/lib/guides");
    for (const [name, trail] of [
      ["KNOWLEDGE_INDEX_CRUMBS", KNOWLEDGE_INDEX_CRUMBS],
      ["SEARCH_CRUMBS", SEARCH_CRUMBS],
      ["GUIDES_INDEX_CRUMBS", GUIDES_INDEX_CRUMBS],
    ]) {
      assert.equal(trail.at(-1).path, undefined, `${name} ends in a linked crumb`);
    }
  });
});

describe("Ordinary pages gained no search JavaScript", () => {
  // The rule, swept over every built page rather than a list of the ones we
  // remembered: only /knowledge and /search may reference Pagefind or render
  // the search component.
  const ALLOWED = new Set(["knowledge", "search"]);

  test("no page outside /knowledge and /search references Pagefind", () => {
    for (const file of builtPages()) {
      const route = path.relative(outDir, file).replace(/\.html$/, "").split(path.sep).join("/");
      if (ALLOWED.has(route)) continue;
      const src = fs.readFileSync(file, "utf8");
      assert.ok(!src.includes("/pagefind/"), `${route} references the Pagefind runtime`);
    }
  });

  test("no page outside /knowledge and /search renders a search form", () => {
    for (const file of builtPages()) {
      const route = path.relative(outDir, file).replace(/\.html$/, "").split(path.sep).join("/");
      if (ALLOWED.has(route)) continue;
      const src = fs.readFileSync(file, "utf8");
      assert.ok(
        !src.includes('role="search"'),
        `${route} renders a search landmark but should not load search at all`
      );
    }
  });

  test("the search component is imported by exactly two pages", () => {
    const importers = fs
      .readdirSync(path.join(repoRoot, "app"), { recursive: true })
      .filter((p) => typeof p === "string" && p.endsWith("page.tsx"))
      .filter((p) => read(path.join("app", p)).includes("SiteSearch"));
    assert.deepEqual(importers.sort(), ["knowledge/page.tsx", "search/page.tsx"]);
  });

  test("the search component does not import the content layer", () => {
    // lib/knowledge pulls in every Velite collection. Importing it from a
    // client component shipped ~95 kB of content to the browser on the first
    // build of this PR; lib/knowledge-sections exists to prevent a repeat.
    const src = stripComments(read("components/SiteSearch.tsx"));
    assert.ok(
      !/from "@\/lib\/knowledge"/.test(src),
      "SiteSearch imports lib/knowledge, which drags the whole content corpus into the client bundle"
    );
    assert.match(src, /from "@\/lib\/knowledge-sections"/);
  });

  test("lib/knowledge-sections has no content dependency", () => {
    const src = stripComments(read("lib/knowledge-sections.ts"));
    assert.ok(!src.includes("@/.velite"), "lib/knowledge-sections imports Velite output");
    assert.ok(!/\bimport\b/.test(src), "lib/knowledge-sections has grown an import");
  });
});

describe("Search interface accessibility", () => {
  const src = () => stripComments(read("components/SiteSearch.tsx"));

  test("it is a search landmark with a labelled field, not an ARIA combobox", () => {
    const source = src();
    assert.match(source, /role="search"/);
    assert.match(source, /aria-label="Search the Knowledge Centre"/);
    assert.match(source, /<label htmlFor=\{inputId\}/);
    for (const antipattern of ["role=\"combobox\"", "aria-activedescendant", "aria-autocomplete", "role=\"listbox\"", "role=\"option\""]) {
      assert.ok(!source.includes(antipattern), `the search UI uses ${antipattern}`);
    }
  });

  test("result counts and the empty state are announced", () => {
    const source = src();
    assert.match(source, /aria-live="polite"/);
    assert.match(source, /aria-live="assertive"/);
    assert.match(source, /countMessage/);
    assert.match(source, /No results for/);
  });

  test("the visible result count is hidden from assistive technology, so it is not read twice", () => {
    // The live region already announces it. Without aria-hidden on the visible
    // copy a screen reader reaches the same sentence again on the next line.
    assert.match(src(), /\{total\} \{total === 1 \? "result" : "results"\}\n\s*\{hasMore/);
    assert.match(src(), /aria-hidden>\n\s*\{total\}/);
  });

  test("results are ordinary links, so keyboard use needs no custom handling", () => {
    const source = src();
    assert.match(source, /<ul className/);
    assert.match(source, /<Link\n\s+href=\{result\.url\}/);
    assert.ok(!source.includes("onKeyDown"), "the result list adds custom key handling");
  });

  test("every interactive element has a visible focus style", () => {
    const source = src();
    // One focus style per interactive element: the field, the submit button
    // and each result link. Counted rather than matched element-by-element,
    // because a regex that tries to delimit a JSX element gets cut short by
    // the first ">" inside an inline arrow function.
    const elements = (source.match(/<(input|button|Link)\b/g) ?? []).length;
    const focusStyles = (source.match(/focus-visible:outline\b/g) ?? []).length;
    assert.ok(
      focusStyles >= elements,
      `${elements} interactive element(s) but only ${focusStyles} focus style(s)`
    );
  });

  test("excerpt HTML is reduced to <mark> before it is injected", () => {
    const source = src();
    assert.match(source, /const markOnly =/);
    assert.match(source, /dangerouslySetInnerHTML=\{\{ __html: result\.excerpt \}\}/);
    assert.match(source, /excerpt: markOnly\(d\.excerpt\)/);
  });
});

describe("Heading order", () => {
  const headings = (src) =>
    [...src.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));

  for (const route of ["knowledge", "search"]) {
    test(`/${route} has exactly one h1 and never skips a level`, () => {
      const levels = headings(html(route));
      assert.equal(levels.filter((l) => l === 1).length, 1, `/${route} does not have exactly one h1`);
      assert.equal(levels[0], 1, `/${route} does not open with its h1`);
      for (let i = 1; i < levels.length; i += 1) {
        assert.ok(
          levels[i] <= levels[i - 1] + 1,
          `/${route} skips from h${levels[i - 1]} to h${levels[i]}`
        );
      }
    });
  }
});
