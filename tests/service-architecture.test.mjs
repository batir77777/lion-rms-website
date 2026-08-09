// Repositioning PR1: /services/fire-safety carries two propositions —
// Fire Risk Assessments and Fire Safety Consultancy — at stable anchors
// while they share one URL (see the SEO migration note, "Option C": FRA
// stays at /services/fire-safety permanently; Fire Safety Consultancy gets
// its own route only in PR3). These tests exist so that any future edit to
// app/services/[slug]/page.tsx or lib/site.ts that silently drops an id, or
// unhooks it from scroll-mt-28, is caught rather than discovered by a broken
// bookmark or a dead footer link.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join(repoRoot, ".next/server/app");

before(() => {
  if (!fs.existsSync(outDir)) {
    throw new Error("run `npm run build` before this suite — it asserts on built HTML");
  }
});

const html = (route) => {
  const file = path.join(outDir, `${route.replace(/^\//, "")}.html`);
  assert.ok(fs.existsSync(file), `no built HTML for ${route} at ${path.relative(repoRoot, file)}`);
  return fs.readFileSync(file, "utf8");
};

const ANCHORS = ["fire-risk-assessments", "fire-safety-consultancy"];

describe("/services/fire-safety carries both discipline anchors", () => {
  const page = html("services/fire-safety");

  for (const id of ANCHORS) {
    test(`#${id} exists exactly once`, () => {
      const matches = page.match(new RegExp(`id="${id}"`, "g")) ?? [];
      assert.equal(matches.length, 1, `expected exactly one element with id="${id}", found ${matches.length}`);
    });

    test(`#${id} is offset for the fixed header (scroll-mt-28)`, () => {
      // Same convention as components/MDXContent.tsx: without a scroll-margin
      // class, the fixed header would cover the heading a browser jumps to.
      const match = page.match(new RegExp(`id="${id}"[^>]*class="([^"]*)"`));
      assert.ok(match, `id="${id}" not found with a class attribute`);
      assert.match(match[1], /\bscroll-mt-28\b/, `#${id} is missing scroll-mt-28`);
    });
  }

  test("Fire Risk Assessments precedes Fire Safety Consultancy in document order", () => {
    // "FRA clearly leads" per the routing decision — enforced structurally,
    // not just by eyeballing the page.
    const fraIndex = page.indexOf('id="fire-risk-assessments"');
    const consultancyIndex = page.indexOf('id="fire-safety-consultancy"');
    assert.ok(fraIndex > -1 && consultancyIndex > -1, "one or both anchors missing");
    assert.ok(fraIndex < consultancyIndex, "Fire Safety Consultancy appears before Fire Risk Assessments");
  });

  test("the page title leads with Fire Risk Assessments", () => {
    const title = page.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    assert.match(title, /^Fire Risk Assessments/, `title does not lead with Fire Risk Assessments: "${title}"`);
  });
});

describe("Footer links resolve to real anchors or a real page", () => {
  test("the footer's Fire Risk Assessments and Fire Safety Consultancy links point at anchors that exist on the built page", async () => {
    const { FOOTER_SERVICE_LINKS } = await import("../lib/site.ts");
    const page = html("services/fire-safety");
    for (const link of FOOTER_SERVICE_LINKS) {
      if (!link.href.startsWith("/services/fire-safety#")) continue;
      const id = link.href.split("#")[1];
      assert.match(page, new RegExp(`id="${id}"`), `footer links to #${id}, which is not on /services/fire-safety`);
    }
  });

  test("every non-anchor footer service link is a real built route", async () => {
    const { FOOTER_SERVICE_LINKS } = await import("../lib/site.ts");
    for (const link of FOOTER_SERVICE_LINKS) {
      if (link.href.includes("#")) continue;
      const file = path.join(outDir, `${link.href.replace(/^\//, "")}.html`);
      assert.ok(fs.existsSync(file), `footer links to ${link.href}, which was not built`);
    }
  });
});

describe("/services/fire-engineering is a real, separate, indexable page", () => {
  const page = html("services/fire-engineering");

  test("it is not the same document as /services/fire-safety", () => {
    const fireSafety = html("services/fire-safety");
    assert.notEqual(page, fireSafety);
  });

  test("its canonical URL self-references", () => {
    assert.match(page, /<link rel="canonical" href="https:\/\/www\.lionrms\.uk\/services\/fire-engineering"/);
  });

  test("it is not marked noindex", () => {
    const robots = page.match(/name="robots" content="([^"]*)"/)?.[1] ?? "";
    assert.equal(/noindex/.test(robots), false, `robots meta unexpectedly restrictive: "${robots}"`);
  });
});
