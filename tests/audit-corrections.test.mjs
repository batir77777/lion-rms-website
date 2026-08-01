// Guards for the corrections made after the independent audit.
//
// Every assertion here exists because the thing it checks was wrong in
// production, not because it might be. Four of the six were invisible from the
// source alone — the Open Graph defect in particular looked fine in every page
// file, because the wrong tags came from the root layout by inheritance. So the
// Open Graph group asserts against BUILT HTML, not against metadata exports.

import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const read = (p) => fs.readFileSync(path.join(repoRoot, p), "utf8");

// Comments explain WHY a claim was removed, and naturally quote the removed
// wording. Asserting against raw source would therefore fail on the very
// comment that documents the fix. Same trick the PR 8A suite uses for the
// s.file() hazard note.
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");
// JSX wraps prose across lines, so a phrase in the rendered output may span a
// newline in the source. Flatten before matching on wording.
const flat = (src) => src.replace(/\s+/g, " ");
const appFiles = (dir = path.join(repoRoot, "app"), out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) appFiles(full, out);
    else if (e.name === "page.tsx") out.push(path.relative(repoRoot, full));
  }
  return out;
};

describe("Fire risk assessment type terminology", () => {
  // The two axes are independent: scope (common parts / also flats) and whether
  // the inspection is destructive. The site previously called Type 3
  // "intrusive", which conflates it with Type 4 and loses the distinction that
  // actually matters — Type 3 is what reaches inside the flats.
  const guide = () => read("content/guides/fire-risk-assessments-explained.mdx");

  test("the guide defines all four types, not just the two we sell most of", () => {
    const src = guide();
    for (const t of ["Type 1", "Type 2", "Type 3", "Type 4"]) {
      assert.ok(src.includes(`**${t}**`), `${t} is not defined`);
    }
  });

  test("Type 3 is never LABELLED intrusive or destructive", () => {
    // Deliberately narrow: it must catch "Type 3 (intrusive)" and
    // "Type 3 — destructive", but not the guide's own correct sentence
    // explaining that destructive work in the common parts is a different
    // question from a Type 3.
    const label = /Type 3\s*(\(|—\s|-\s|:\s)?\s*(is\s+)?(intrusive|destructive)/i;
    for (const file of [
      "content/guides/fire-risk-assessments-explained.mdx",
      "lib/case-studies.ts",
      "lib/site.ts",
    ]) {
      assert.ok(!label.test(read(file)), `${file} labels Type 3 as intrusive — that is Type 4`);
    }
  });

  test("the guide's table pairs each type with the right destructive flag", () => {
    const rows = guide()
      .split("\n")
      .filter((l) => /^\| \*\*Type \d\*\* \|/.test(l))
      .map((l) => l.split("|").map((c) => c.trim()));
    assert.equal(rows.length, 4, "expected a four-row type table");
    const expected = [
      ["**Type 1**", "Common parts only", "No"],
      ["**Type 2**", "Common parts only", "Yes"],
      ["**Type 3**", "Common parts and a sample of flats", "No"],
      ["**Type 4**", "Common parts and a sample of flats", "Yes"],
    ];
    rows.forEach((cells, i) => {
      assert.deepEqual([cells[1], cells[2], cells[3]], expected[i]);
    });
  });

  test("no page describes a type as intrusive without saying which", () => {
    // Guards the case-study wording that started this: "Type 3 (intrusive)".
    for (const file of ["lib/case-studies.ts", "lib/site.ts"]) {
      assert.ok(
        !/Type [13] \((intrusive|destructive)\)/i.test(read(file)),
        `${file} labels a non-destructive type as destructive`
      );
    }
  });
});

describe("Fire risk assessment qualification wording", () => {
  const CORRECT = "Level 4 Diploma in Fire Risk Assessment";
  const STALE = [/Advanced Diploma in Fire Risk Assessment/, /DipFRA Advanced/, /Level 4 DipFRA/];

  const sources = () => [
    ...appFiles(),
    "lib/site.ts",
    "components/Footer.tsx",
  ].map((p) => [p, read(p)]);

  test("no stale variant survives anywhere", () => {
    for (const [file, src] of sources()) {
      for (const pattern of STALE) {
        assert.ok(!pattern.test(src), `${file} still uses ${pattern}`);
      }
    }
  });

  test("the credentials array is the same wording the pages show", async () => {
    // CREDENTIALS feeds hasCredential in the Person JSON-LD. When it disagreed
    // with the visible pages, structured data and content made different claims.
    const src = read("lib/site.ts");
    assert.ok(src.includes(`{ name: "${CORRECT}" }`), "QUALIFICATIONS is out of step");
  });

  test("every mention of the FRA diploma uses the full standardised name", () => {
    for (const [file, src] of sources()) {
      const mentions = src.match(/[\w ]*Diploma in Fire Risk Assessment/g) ?? [];
      for (const m of mentions) {
        assert.ok(m.trim().endsWith(CORRECT), `${file}: "${m.trim()}"`);
      }
    }
  });
});

describe("Open Graph metadata is per-page, not inherited from the homepage", () => {
  // Asserted against built HTML deliberately. Reading the page files would have
  // passed before the fix, because the wrong tags were inherited rather than
  // declared.
  const outDir = path.join(repoRoot, ".next/server/app");
  const html = (name) => fs.readFileSync(path.join(outDir, `${name}.html`), "utf8");
  const ogUrl = (src) => src.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
  const ogTitle = (src) => src.match(/<meta property="og:title" content="([^"]+)"/)?.[1];

  const ROUTES = [
    ["about", "https://www.lionrms.uk/about"],
    ["services", "https://www.lionrms.uk/services"],
    ["sectors", "https://www.lionrms.uk/sectors"],
    ["contact", "https://www.lionrms.uk/contact"],
    ["faq", "https://www.lionrms.uk/faq"],
    ["privacy", "https://www.lionrms.uk/privacy"],
    ["check", "https://www.lionrms.uk/check"],
    ["case-studies", "https://www.lionrms.uk/case-studies"],
  ];

  before(() => {
    if (!fs.existsSync(outDir)) {
      throw new Error("run `next build` before this suite — it asserts on built HTML");
    }
  });

  for (const [route, expected] of ROUTES) {
    test(`/${route} declares its own og:url`, () => {
      assert.equal(ogUrl(html(route)), expected);
    });
  }

  test("no static route still advertises the homepage title", () => {
    const home = ogTitle(html("index"));
    for (const [route] of ROUTES) {
      assert.notEqual(ogTitle(html(route)), home, `/${route} inherited the homepage og:title`);
    }
  });

  test("every page.tsx declares openGraph explicitly", () => {
    for (const file of appFiles()) {
      assert.match(read(file), /openGraph/, `${file} has no openGraph block`);
    }
  });
});

describe("Accessibility corrections", () => {
  test("a skip link is the first focusable element, targeting main", () => {
    const layout = read("app/layout.tsx");
    assert.match(layout, /href="#main-content"/);
    assert.match(layout, /Skip to main content/);
    assert.match(layout, /<main id="main-content"/);
    const skipAt = layout.indexOf('href="#main-content"');
    const headerAt = layout.indexOf("<Header />");
    assert.ok(skipAt < headerAt, "the skip link must precede the header in the DOM");
  });

  test("the skip link is hidden until focused, not hidden from everyone", () => {
    const layout = read("app/layout.tsx");
    assert.match(layout, /sr-only focus:not-sr-only/);
    assert.ok(!/hidden\s+focus:/.test(layout), "display:none would hide it from keyboard users too");
  });

  test("the compliance-check email field has a real label, not a placeholder", () => {
    const src = read("components/ComplianceCheck.tsx");
    assert.match(src, /<label htmlFor="check-result-email"/);
    assert.match(src, /id="check-result-email"/);
    const input = src.match(/<input\s+id="check-result-email"[\s\S]*?\/>/)?.[0] ?? "";
    assert.match(input, /type="email"/);
  });
});

describe("Claims the site makes about itself", () => {
  test("the compliance check result carries a disclaimer", () => {
    const src = flat(read("components/ComplianceCheck.tsx"));
    assert.match(src, /not a fire risk assessment/i);
    assert.match(src, /indicative/i);
    assert.match(src, /competent person/i);
    assert.match(src, /does not mean your duties are satisfied/i);
  });

  test("the disclaimer sits with the result, not further down the page", () => {
    const src = read("components/ComplianceCheck.tsx");
    const body = src.indexOf("{result.body}");
    const disclaimer = src.indexOf("What this result is, and is not");
    assert.ok(body !== -1 && disclaimer > body, "disclaimer must follow the result immediately");
    // and before the email capture, so it is read before anything is submitted
    assert.ok(disclaimer < src.indexOf("check-result-email"));
  });

  test("no UK hosting claim anywhere", () => {
    // The site is statically served from a global edge network and forms go to
    // a third-party processor. There is no UK-hosted component to point at.
    for (const file of ["components/Footer.tsx", ...appFiles()]) {
      assert.ok(!/UK Hosted/i.test(stripComments(read(file))), `${file} claims UK hosting`);
    }
  });

  test("no bare UK GDPR compliance badge", () => {
    assert.ok(
      !/UK GDPR Compliant/i.test(stripComments(read("components/Footer.tsx"))),
      "self-declared compliance must not sit in the credential row"
    );
  });

  test("the footer still routes people to the privacy policy", () => {
    const src = stripComments(read("components/Footer.tsx"));
    assert.match(src, /href="\/privacy"/);
    assert.match(src, /how we handle your data/i);
  });
});
