// Repositioning PR1 gave /services/fire-safety two anchor-linkable
// propositions — Fire Risk Assessments and Fire Safety Consultancy — sharing
// one URL ("Option C": FRA stays at /services/fire-safety permanently; Fire
// Safety Consultancy gets its own route only in PR3).
//
// Repositioning PR3 is that route split. /services/fire-safety-consultancy
// is now a real, separate page, carved out of the section it used to share
// with FRA. /services/fire-safety keeps the #fire-safety-consultancy anchor
// it always had — not as a dead fragment, and not as a duplicate of the new
// page's content, but as a minimal one-sentence pointer (see ServicePointer
// in lib/site.ts) so a bookmark or inbound link to the old anchor still lands
// on something relevant.
//
// These tests exist so that any future edit to app/services/[slug]/page.tsx
// or lib/site.ts that silently drops an id, duplicates content across the two
// pages, or unhooks an anchor from scroll-mt-28, is caught rather than
// discovered by a broken bookmark or a dead footer link.

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

// Names/descriptions unique to the Fire Safety Consultancy content that moved
// off /services/fire-safety in PR3 — used below as a duplicate-content guard,
// so the pointer block can never silently regrow into a second copy of the
// section it replaced.
const FSC_ITEM_NAMES = [
  "Fire Door Inspections",
  "Compartmentation",
  "Fire Safety Training",
  "Advice for Landlords, Duty Holders",
];

describe("/services/fire-safety carries Fire Risk Assessments in full", () => {
  const page = html("services/fire-safety");

  test("#fire-risk-assessments exists exactly once", () => {
    const matches = page.match(/id="fire-risk-assessments"/g) ?? [];
    assert.equal(matches.length, 1, `expected exactly one element with id="fire-risk-assessments", found ${matches.length}`);
  });

  test("#fire-risk-assessments is offset for the fixed header (scroll-mt-28)", () => {
    const match = page.match(/id="fire-risk-assessments"[^>]*class="([^"]*)"/);
    assert.ok(match, `id="fire-risk-assessments" not found with a class attribute`);
    assert.match(match[1], /\bscroll-mt-28\b/, `#fire-risk-assessments is missing scroll-mt-28`);
  });

  test("the page title leads with Fire Risk Assessments", () => {
    const title = page.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    assert.match(title, /^Fire Risk Assessments/, `title does not lead with Fire Risk Assessments: "${title}"`);
  });

  test("the title no longer claims Fire Safety Consultancy on this page", () => {
    const title = page.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    assert.equal(/Fire Safety Consultancy/.test(title), false, `title still names Fire Safety Consultancy: "${title}"`);
  });
});

describe("/services/fire-safety#fire-safety-consultancy is a pointer, not a dead anchor or a duplicate", () => {
  const page = html("services/fire-safety");

  test("#fire-safety-consultancy exists exactly once", () => {
    const matches = page.match(/id="fire-safety-consultancy"/g) ?? [];
    assert.equal(matches.length, 1, `expected exactly one element with id="fire-safety-consultancy", found ${matches.length}`);
  });

  test("#fire-safety-consultancy is offset for the fixed header (scroll-mt-28)", () => {
    const match = page.match(/id="fire-safety-consultancy"[^>]*class="([^"]*)"/);
    assert.ok(match, `id="fire-safety-consultancy" not found with a class attribute`);
    assert.match(match[1], /\bscroll-mt-28\b/, `#fire-safety-consultancy is missing scroll-mt-28`);
  });

  test("Fire Risk Assessments precedes the pointer in document order", () => {
    // FRA still clearly leads the page — the pointer is a closing footnote,
    // not a competing proposition.
    const fraIndex = page.indexOf('id="fire-risk-assessments"');
    const pointerIndex = page.indexOf('id="fire-safety-consultancy"');
    assert.ok(fraIndex > -1 && pointerIndex > -1, "one or both anchors missing");
    assert.ok(fraIndex < pointerIndex, "the pointer appears before Fire Risk Assessments");
  });

  test("the pointer links to the dedicated Fire Safety Consultancy page", () => {
    assert.match(page, /href="\/services\/fire-safety-consultancy"/, "no link to /services/fire-safety-consultancy found");
  });

  test("none of the five original item names are duplicated here", () => {
    // The defect this guards against: the pointer regrowing into a second
    // copy of the section that moved to /services/fire-safety-consultancy,
    // which would make the two pages near-duplicates.
    //
    // Checked against the visible body only, with every <script> block
    // stripped first. The site-wide Person/ProfessionalService JSON-LD in
    // components/StructuredData.tsx carries a `knowsAbout` list that
    // legitimately names "Compartmentation" and other topics on every page,
    // site-wide, unrelated to this page's own rendered content — searching
    // the whole document would false-positive on that list, not catch the
    // defect this test exists for.
    const bodyOnly = page.replace(/<script[^>]*>[\s\S]*?<\/script>/g, "");
    const offenders = FSC_ITEM_NAMES.filter((name) => bodyOnly.includes(name));
    assert.deepEqual(offenders, [], `Fire Safety Consultancy item content still duplicated on fire-safety: ${offenders.join(", ")}`);
  });
});

describe("/services/fire-safety-consultancy is a real, separate, indexable page", () => {
  const page = html("services/fire-safety-consultancy");

  test("it is not the same document as /services/fire-safety", () => {
    const fireSafety = html("services/fire-safety");
    assert.notEqual(page, fireSafety);
  });

  test("its canonical URL self-references", () => {
    assert.match(page, /<link rel="canonical" href="https:\/\/www\.lionrms\.uk\/services\/fire-safety-consultancy"/);
  });

  test("it is not marked noindex", () => {
    const robots = page.match(/name="robots" content="([^"]*)"/)?.[1] ?? "";
    assert.equal(/noindex/.test(robots), false, `robots meta unexpectedly restrictive: "${robots}"`);
  });

  test("the title leads with Fire Safety Consultancy", () => {
    const title = page.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    assert.match(title, /^Fire Safety Consultancy/, `title does not lead with Fire Safety Consultancy: "${title}"`);
  });

  test("all five original items are present in full", () => {
    for (const name of FSC_ITEM_NAMES) {
      assert.ok(page.includes(name), `expected "${name}" on the dedicated page, not found`);
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

describe("Footer links resolve to real anchors or a real page", () => {
  test("the footer's Fire Risk Assessments link points at an anchor that exists on the built page", async () => {
    const { FOOTER_SERVICE_LINKS } = await import("../lib/site.ts");
    const page = html("services/fire-safety");
    for (const link of FOOTER_SERVICE_LINKS) {
      if (!link.href.startsWith("/services/fire-safety#")) continue;
      const id = link.href.split("#")[1];
      assert.match(page, new RegExp(`id="${id}"`), `footer links to #${id}, which is not on /services/fire-safety`);
    }
  });

  test("the footer's Fire Safety Consultancy link is a real route, not an anchor", async () => {
    const { FOOTER_SERVICE_LINKS } = await import("../lib/site.ts");
    const link = FOOTER_SERVICE_LINKS.find((l) => l.label === "Fire Safety Consultancy");
    assert.ok(link, "no Fire Safety Consultancy entry in FOOTER_SERVICE_LINKS");
    assert.equal(link.href, "/services/fire-safety-consultancy");
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

describe("The homepage's Fire Safety Consultancy card points at the dedicated page", () => {
  test("HOMEPAGE_SERVICE_CLUSTERS links straight to /services/fire-safety-consultancy", async () => {
    const { HOMEPAGE_SERVICE_CLUSTERS } = await import("../lib/site.ts");
    const allCards = HOMEPAGE_SERVICE_CLUSTERS.flatMap((cluster) => cluster.cards);
    const card = allCards.find((c) => c.title === "Fire Safety Consultancy");
    assert.ok(card, "no Fire Safety Consultancy card found on the homepage");
    assert.equal(card.href, "/services/fire-safety-consultancy");
  });

  test("the built homepage links to the dedicated page, not the old anchor", () => {
    const page = html("index");
    assert.match(page, /href="\/services\/fire-safety-consultancy"/);
    assert.equal(
      page.includes('href="/services/fire-safety#fire-safety-consultancy"'),
      false,
      "homepage still links to the retired anchor"
    );
  });
});

describe("Guides and downloads about Fire Safety Consultancy content follow it to its new page", () => {
  test("the fire door inspections guide is tagged to fire-safety-consultancy, not fire-safety", async () => {
    const { getGuidesForService } = await import("../lib/guides.ts");
    const fscGuides = getGuidesForService("fire-safety-consultancy").map((g) => g.slug);
    assert.ok(
      fscGuides.includes("fire-door-inspections-explained"),
      "fire-door-inspections-explained is not related to fire-safety-consultancy"
    );
    const fraGuides = getGuidesForService("fire-safety").map((g) => g.slug);
    assert.equal(
      fraGuides.includes("fire-door-inspections-explained"),
      false,
      "fire-door-inspections-explained is still related to fire-safety (FRA), which no longer covers it"
    );
  });
});
