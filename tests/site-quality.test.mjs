// Guards for the site-quality PR: company disclosure, Twitter metadata,
// /check contrast, relationship de-duplication, footer heading order and the
// primary navigation landmark.
//
// Kept separate from audit-corrections.test.mjs so each PR's guards stay
// legible. The two share one habit deliberately: anything that was invisible
// from source is asserted against BUILT HTML instead. The Twitter defect is the
// clearest example — every page file looked fine before this PR, because the
// wrong tags arrived by inheritance from the root layout.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outDir = path.join(repoRoot, ".next/server/app");

const read = (p) => fs.readFileSync(path.join(repoRoot, p), "utf8");
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");

const appFiles = (dir = path.join(repoRoot, "app"), out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) appFiles(full, out);
    else if (e.name === "page.tsx") out.push(path.relative(repoRoot, full));
  }
  return out;
};

const builtPages = (dir = outDir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) builtPages(full, out);
    else if (e.name.endsWith(".html")) out.push(full);
  }
  return out;
};

const html = (name) => fs.readFileSync(path.join(outDir, `${name}.html`), "utf8");
const meta = (src, re) => src.match(re)?.[1];

const COMPANY = {
  legalName: "LION RISK MANAGEMENT SOLUTIONS LTD",
  number: "13739074",
  jurisdiction: "England and Wales",
  registeredOffice: "Flat 18 Gloster Ridley Court, 12 St. Annes Row, London E14 7GE",
};

before(() => {
  if (!fs.existsSync(outDir)) {
    throw new Error("run `next build` before this suite — it asserts on built HTML");
  }
});

describe("Company disclosure — the particulars are right and in one place", () => {
  test("lib/site.ts carries the values verified against the register", () => {
    const src = read("lib/site.ts");
    for (const v of Object.values(COMPANY)) {
      assert.ok(src.includes(v), `COMPANY is missing ${v}`);
    }
  });

  test("the company information page states all four statutory particulars", () => {
    const src = html("company-information");
    for (const [field, value] of Object.entries(COMPANY)) {
      assert.ok(src.includes(value), `/company-information omits ${field}`);
    }
  });

  test("the registered office appears on EXACTLY ONE built page", () => {
    // The decision this test exists to enforce: the address is residential, so
    // it is disclosed once rather than repeated sitewide. If anyone later
    // pastes it into the footer, the privacy page or the Organisation JSON-LD
    // — which renders on every page — this fails loudly rather than silently
    // republishing it across the whole site.
    const hits = builtPages()
      .filter((f) => fs.readFileSync(f, "utf8").includes(COMPANY.registeredOffice))
      .map((f) => path.relative(outDir, f));
    assert.deepEqual(hits, ["company-information.html"], `address leaked into: ${hits}`);
  });

  test("the privacy policy identifies the legal entity and links onward", () => {
    const src = html("privacy");
    assert.ok(src.includes(COMPANY.legalName), "privacy page omits the registered name");
    assert.ok(src.includes(COMPANY.number), "privacy page omits the company number");
    assert.match(src, /href="\/company-information"/);
    assert.ok(
      !src.includes(COMPANY.registeredOffice),
      "the privacy page must link to the address, not repeat it"
    );
  });

  test('the inaccurate "Registered business" wording is gone', () => {
    assert.ok(!/Registered business/i.test(read("app/privacy/page.tsx")));
  });

  test("footer and privacy page read from COMPANY rather than repeating literals", () => {
    // The four qualification variants in the last PR were caused by exactly
    // this: the same fact typed in several places.
    assert.match(read("components/Footer.tsx"), /COMPANY_INFO_PATH/);
    assert.match(read("app/privacy/page.tsx"), /COMPANY\.legalName/);
    assert.match(read("app/privacy/page.tsx"), /COMPANY\.number/);
    assert.match(read("app/company-information/page.tsx"), /COMPANY\.registeredOffice/);
  });

  test("the footer links to company information on every page", () => {
    const pages = builtPages();
    assert.ok(pages.length > 20, "expected the full build");
    for (const f of pages) {
      const src = fs.readFileSync(f, "utf8");
      assert.match(
        src,
        /href="\/company-information"/,
        `${path.relative(outDir, f)} has no company information link`
      );
    }
  });
});

describe("Company disclosure — indexing treatment", () => {
  test("/company-information is noindex, follow", () => {
    const robots = meta(html("company-information"), /name="robots" content="([^"]+)"/);
    assert.ok(robots, "no robots directive emitted");
    assert.match(robots, /noindex/);
    assert.match(robots, /follow/);
    assert.ok(!/nofollow/.test(robots), "follow must be preserved");
  });

  test("it carries a self-referencing canonical", () => {
    assert.equal(
      meta(html("company-information"), /rel="canonical" href="([^"]+)"/),
      "https://www.lionrms.uk/company-information"
    );
  });

  test("it is absent from the sitemap", () => {
    // Listing a noindexed URL in a sitemap is a contradictory signal. /privacy
    // is already omitted, so this follows the existing house pattern.
    const sitemap = fs.readFileSync(path.join(outDir, "sitemap.xml.body"), "utf8");
    assert.ok(!sitemap.includes("/company-information"), "noindexed route is in the sitemap");
  });

  test("robots.txt does not disallow it — a crawler must fetch it to see noindex", () => {
    const robots = fs.readFileSync(path.join(outDir, "robots.txt.body"), "utf8");
    assert.ok(!/Disallow:\s*\/company-information/i.test(robots));
  });
});

describe("The registered name stays out of marketing copy", () => {
  test("SITE.name is the trading name", () => {
    assert.match(read("lib/site.ts"), /name: "Lion Risk Management Solutions"/);
  });

  test('no page title, og:title or twitter:title contains "LTD"', () => {
    for (const f of builtPages()) {
      const src = fs.readFileSync(f, "utf8");
      const where = path.relative(outDir, f);
      for (const [label, re] of [
        ["<title>", /<title>([^<]*)<\/title>/],
        ["og:title", /property="og:title" content="([^"]+)"/],
        ["twitter:title", /name="twitter:title" content="([^"]+)"/],
      ]) {
        const v = meta(src, re);
        if (v) assert.ok(!/\bLTD\b/i.test(v), `${where} ${label} contains Ltd: ${v}`);
      }
    }
  });

  test("the legal name appears only where the entity is identified", () => {
    const allowed = new Set(["company-information.html", "privacy.html"]);
    const stray = builtPages()
      .filter((f) => {
        const src = fs.readFileSync(f, "utf8");
        // legalName also reaches every page via the Organisation JSON-LD,
        // which is intended — exclude script blocks before judging.
        return src.replace(/<script[\s\S]*?<\/script>/g, " ").includes(COMPANY.legalName);
      })
      .map((f) => path.relative(outDir, f))
      .filter((f) => !allowed.has(f));
    assert.deepEqual(stray, [], `legal name in visible copy of: ${stray}`);
  });
});

describe("Structured data identifies the entity without republishing the address", () => {
  const orgNode = () => {
    const src = html("index");
    for (const m of src.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try {
        const j = JSON.parse(m[1]);
        if (j["@type"] === "ProfessionalService") return j;
      } catch {
        /* not the node we want */
      }
    }
    return null;
  };

  test("legalName is the registered name and name is the trading name", () => {
    const node = orgNode();
    assert.ok(node, "no ProfessionalService node found");
    assert.equal(node.legalName, COMPANY.legalName);
    assert.equal(node.name, "Lion Risk Management Solutions");
  });

  test("the company number is carried as a PropertyValue identifier", () => {
    const node = orgNode();
    assert.equal(node.identifier?.["@type"], "PropertyValue");
    assert.equal(node.identifier?.value, COMPANY.number);
  });

  test("the PostalAddress does NOT carry the registered office", () => {
    // This node renders on every page; a street address here would republish
    // the residential address sitewide.
    assert.ok(!JSON.stringify(orgNode().address).includes("Gloster Ridley"));
  });
});

describe("Twitter metadata is per-page, not inherited from the homepage", () => {
  const ROUTES = [
    "about", "services", "sectors", "case-studies", "check", "contact", "faq",
    "privacy", "company-information", "guides", "glossary", "standards",
    "legislation", "news", "downloads",
  ];

  test("every page.tsx declares a twitter block", () => {
    for (const f of appFiles()) {
      assert.match(read(f), /twitter/, `${f} has no twitter block`);
    }
  });

  for (const route of ROUTES) {
    test(`/${route} declares its own twitter:title`, () => {
      const home = meta(html("index"), /name="twitter:title" content="([^"]+)"/);
      const own = meta(html(route), /name="twitter:title" content="([^"]+)"/);
      assert.ok(own, `/${route} emits no twitter:title`);
      assert.notEqual(own, home, `/${route} inherited the homepage twitter:title`);
    });
  }

  test("twitter:description is also per-page", () => {
    const home = meta(html("index"), /name="twitter:description" content="([^"]+)"/);
    for (const route of ROUTES) {
      const own = meta(html(route), /name="twitter:description" content="([^"]+)"/);
      assert.notEqual(own, home, `/${route} inherited the homepage twitter:description`);
    }
  });

  test("the homepage's own twitter:title matches its title, not the layout default", () => {
    const src = html("index");
    assert.equal(
      meta(src, /name="twitter:title" content="([^"]+)"/),
      meta(src, /property="og:title" content="([^"]+)"/)
    );
  });
});

describe("Relationship groups are disjoint", () => {
  // Generic outbound and derived inverse groups both contain an item when the
  // relationship is genuinely two-way. The specific group is authoritative, so
  // the generic one drops the duplicate.
  const pairs = [
    ["app/standards/[slug]/page.tsx", "legislationItems", "legislationUsingThis"],
    ["app/legislation/[slug]/page.tsx", "standardItems", "standardsReferencingItems"],
    ["app/downloads/[slug]/page.tsx", "peerItems", "referringItems"],
    ["app/news/[slug]/page.tsx", "peerItems", "followUpItems"],
  ];

  for (const [file, generic, specific] of pairs) {
    test(`${file} subtracts ${specific} from ${generic}`, () => {
      const src = read(file);
      assert.match(
        src,
        new RegExp(`const ${generic} = withoutDuplicatesOf\\(${generic}Raw, ${specific}\\)`),
        `${file} does not de-duplicate`
      );
      // const is not hoisted — the specific list must exist first or this
      // throws at render. Caught exactly this way during implementation.
      assert.ok(
        src.indexOf(`const ${specific} =`) < src.indexOf(`const ${generic} = withoutDuplicatesOf`),
        `${file}: ${specific} is declared after it is used`
      );
    });
  }

  test("no built Standards page lists the same legislation twice", () => {
    const dir = path.join(outDir, "standards");
    const pages = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".html") && f !== "page.html");
    assert.ok(pages.length >= 5, "expected the built standards pages");
    for (const f of pages) {
      const src = fs.readFileSync(path.join(dir, f), "utf8");
      const start = src.indexOf("Legislation this standard supports");
      if (start < 0) continue;
      const region = src.slice(start, start + 6000);
      const split = region.indexOf("Other legislation that cites this standard");
      if (split < 0) continue;
      const grab = (seg) => [
        ...new Set([...seg.matchAll(/href="\/legislation\/([a-z0-9-]+)"/g)].map((m) => m[1])),
      ];
      const supports = grab(region.slice(0, split));
      const cites = grab(region.slice(split));
      const overlap = supports.filter((s) => cites.includes(s));
      assert.deepEqual(overlap, [], `${f} repeats: ${overlap}`);
    }
  });

  test("the two headings are distinguishable from each other", () => {
    const src = read("app/standards/[slug]/page.tsx");
    assert.match(src, /Legislation this standard supports/);
    assert.match(src, /Other legislation that cites this standard/);
    assert.ok(!/heading: "Related legislation"/.test(src), "generic heading still ambiguous");
  });
});

describe("Accessibility corrections", () => {
  test("footer column headings are h2, so pages without an h2 do not skip a level", () => {
    const src = read("components/Footer.tsx");
    assert.equal((src.match(/<h2 /g) ?? []).length, 3);
    assert.ok(!/<h3/.test(src), "a footer heading is still h3");
  });

  test("no built page jumps from h1 straight to h3", () => {
    for (const f of builtPages()) {
      const src = fs.readFileSync(f, "utf8");
      const levels = [...src.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
      for (let i = 1; i < levels.length; i++) {
        assert.ok(
          levels[i] - levels[i - 1] <= 1,
          `${path.relative(outDir, f)} skips h${levels[i - 1]} → h${levels[i]}`
        );
      }
    }
  });

  test("the primary navigation landmark has an accessible name", () => {
    const raw = read("components/Header.tsx");
    assert.match(raw, /<nav aria-label="Primary"/);
    // Strip comments first: the comment explaining this fix mentions <nav>,
    // and asserting against raw source fails on the note documenting the fix.
    const navs = [...stripComments(raw).matchAll(/<nav\b([^>]*)>/g)];
    assert.ok(navs.length >= 2, "expected the desktop and mobile navs");
    for (const [, attrs] of navs) {
      assert.match(attrs, /aria-label/, "a nav landmark is still unnamed");
    }
  });

  test("every rendered nav landmark on a built page is named", () => {
    // The source check above covers Header.tsx; this covers the whole site,
    // including the Knowledge Centre pages that carry three landmarks.
    for (const f of builtPages()) {
      const src = fs.readFileSync(f, "utf8");
      for (const [, attrs] of src.matchAll(/<nav\b([^>]*)>/g)) {
        assert.match(
          attrs,
          /aria-label|aria-labelledby/,
          `${path.relative(outDir, f)} has an unnamed nav landmark`
        );
      }
    }
  });

  test("the /check question cards use an opaque surface", () => {
    // Translucent dark panels over the white /check wrapper composited to
    // roughly #6d798c, failing AA on 50 nodes. Opacity is the fix, not
    // lightening the text.
    const src = stripComments(read("components/ComplianceCheck.tsx"));
    assert.ok(!/bg-navy-\d+\/\d+/.test(src), "a translucent navy surface remains");
    assert.match(src, /bg-navy-900 p-5/);
  });
});
