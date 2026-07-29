// Routing tests for the Guides vertical (Phase 5A, PR 3).
//
// Two things are checked here. First, that the routes that DO exist generate
// exactly the intended set of pages and nothing more. Second — and just as
// important — that the routes deliberately deferred out of PR 3 have not
// quietly appeared: category hubs, tag archives and the five other verticals.
// A deferral that isn't enforced is just an intention.

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

describe("Guides routing", () => {
  test("generateStaticParams returns exactly the published guides", async () => {
    const mod = await import("../app/guides/[slug]/page.tsx");
    const { publishedGuides } = await import("../lib/guides");
    const params = mod.generateStaticParams();
    assert.deepEqual(
      params.map((p) => p.slug).sort(),
      publishedGuides().map((g) => g.slug).sort()
    );
    assert.equal(params.length, 7);
  });

  test("dynamicParams is false, so an unknown slug 404s rather than rendering", async () => {
    const mod = await import("../app/guides/[slug]/page.tsx");
    assert.equal(mod.dynamicParams, false);
  });

  test("guide metadata uses seoTitle where present and always self-canonicalises", async () => {
    const mod = await import("../app/guides/[slug]/page.tsx");

    const withSeoTitle = await mod.generateMetadata({
      params: Promise.resolve({ slug: "pas-79-methodology-explained" }),
    });
    assert.equal(
      withSeoTitle.title,
      "PAS 79 methodology: how a fire risk assessment is carried out"
    );
    assert.equal(withSeoTitle.alternates.canonical, "/guides/pas-79-methodology-explained");
    assert.ok(withSeoTitle.description.length >= 120 && withSeoTitle.description.length <= 170);
    assert.equal(withSeoTitle.openGraph.type, "article");

    const withoutSeoTitle = await mod.generateMetadata({
      params: Promise.resolve({ slug: "fire-door-inspections-explained" }),
    });
    assert.equal(
      withoutSeoTitle.title,
      "Fire door inspections: what's checked and why it matters"
    );
  });

  test("every guide's effective title and description sit in the editorial ranges", async () => {
    const mod = await import("../app/guides/[slug]/page.tsx");
    const { publishedGuides } = await import("../lib/guides");
    for (const guide of publishedGuides()) {
      const meta = await mod.generateMetadata({
        params: Promise.resolve({ slug: guide.slug }),
      });
      assert.ok(
        meta.title.length >= 30 && meta.title.length <= 65,
        `${guide.slug}: effective title is ${meta.title.length} characters`
      );
      assert.ok(
        meta.description.length >= 120 && meta.description.length <= 170,
        `${guide.slug}: description is ${meta.description.length} characters`
      );
    }
  });

  test("the two routes PR 3 introduces exist", () => {
    assert.ok(exists("guides/page.tsx"));
    assert.ok(exists("guides/[slug]/page.tsx"));
  });

  test("category hubs and tag archives are not introduced", () => {
    assert.equal(exists("guides/category"), false, "category hubs are deferred past ~12 guides");
    assert.equal(exists("guides/tag"), false, "tag archives are deliberately not built");
  });

  test("no content vertical beyond Guides and Glossary is introduced", () => {
    // "glossary" left this list in Phase 5A PR 4, which launched it. The
    // remaining four are still deferred and this assertion still guards them.
    for (const route of ["news", "standards", "legislation", "downloads", "knowledge", "search"]) {
      assert.equal(exists(route), false, `/${route} must not exist yet`);
    }
  });

  test("the legacy Insights routes and module are gone", () => {
    assert.equal(exists("insights"), false);
    assert.equal(fs.existsSync(path.join(repoRoot, "lib/insights.ts")), false);
  });

  test("the sitemap lists /guides and no /insights URL", async () => {
    const { default: sitemap } = await import("../app/sitemap.ts");
    const urls = sitemap().map((e) => e.url);
    const { publishedGuides } = await import("../lib/guides");

    assert.ok(urls.includes("https://www.lionrms.uk/guides"));
    for (const g of publishedGuides()) {
      assert.ok(
        urls.includes(`https://www.lionrms.uk/guides/${g.slug}`),
        `${g.slug} missing from sitemap`
      );
    }
    for (const url of urls) {
      assert.equal(url.includes("/insights"), false, `redirecting URL in sitemap: ${url}`);
    }
    // Real per-item dates, not eight identical build timestamps.
    const guideEntry = sitemap().find(
      (e) => e.url === "https://www.lionrms.uk/guides/fire-risk-assessments-explained"
    );
    assert.equal(guideEntry.lastModified.toISOString().slice(0, 10), "2026-07-06");
  });
});
