// Repositioning PR5 introduces construction-related content (RAMS,
// Construction Phase Plans, competent-person support) on
// /services/construction-health-safety and /services/health-safety. Lion RMS
// provides advisory support in this area — it does not act, and must never be
// described as acting, as either CDM dutyholder role: Principal Designer or
// Principal Contractor.
//
// This is a standing regression guard, not a one-off content check: it scans
// every built page on the site, not just the two construction-related pages,
// so a forbidden claim introduced anywhere in a future PR is caught here
// rather than discovered after publication.
//
// Two known, legitimate uses of this wording already exist on the site, and
// both describe someone OTHER than Lion RMS, never Lion RMS itself:
//
//   1. RECENT_PROJECTS (lib/site.ts, rendered on / only) carries the sector
//      label "Construction · Principal Contractor" for its condensed version
//      of the "RAMS & construction phase plans" project — describing who the
//      CLIENT is. (Its non-condensed twin, OTHER_CASES in
//      lib/case-studies.ts, is confirmed elsewhere — see
//      tests/case-studies-cards.test.mjs — to never be rendered at all, so it
//      does not itself appear in any built HTML.) The exact label is
//      stripped out before scanning, by name, rather than weakening the
//      pattern generally, so a future occurrence of "Principal Contractor"
//      in any OTHER wording is still caught. If that known label's wording
//      ever changes, this test's own "the known client-sector label still
//      exists" check fails first and calls out that the exclusion needs
//      revisiting — it cannot silently stop guarding anything.
//
//   2. content/guides/pas-9970-bsi-consultation-fire-safety-construction.mdx
//      describes who Lion RMS helps: "developers, principal contractors and
//      project teams". This is the PLURAL, describing multiple third
//      parties Lion RMS advises, never a singular claim that Lion RMS IS
//      one. The forbidden patterns below require the phrase NOT be
//      immediately followed by "s" (i.e. match "Principal Contractor" but
//      not "principal contractors"), which lets this sentence pass while
//      still catching the singular, self-descriptive claim this guard
//      exists to prevent — "as Principal Contractor" or "the Principal
//      Contractor" would still fail it.

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

const FORBIDDEN = [/Principal Designer(?!s)/i, /Principal Contractor(?!s)/i];

// The one known, approved occurrence of "Principal Contractor" on the site —
// see the file header. Removed (all occurrences) before the forbidden-phrase
// scan runs.
const KNOWN_CLIENT_SECTOR_LABEL = "Construction · Principal Contractor";

const builtPages = (dir = outDir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) builtPages(full, out);
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
};

describe("Lion RMS is never described as a CDM dutyholder", () => {
  const pages = builtPages();

  test("at least the two construction-related service pages were built", () => {
    const routes = pages.map((p) => path.relative(outDir, p));
    assert.ok(
      routes.some((r) => r.endsWith(path.join("services", "construction-health-safety.html"))),
      "services/construction-health-safety.html was not built",
    );
    assert.ok(
      routes.some((r) => r.endsWith(path.join("services", "health-safety.html"))),
      "services/health-safety.html was not built",
    );
  });

  test("the known client-sector label still reads exactly as expected (exclusion sanity check)", () => {
    // RECENT_PROJECTS (lib/site.ts), not OTHER_CASES — OTHER_CASES is
    // confirmed elsewhere (tests/case-studies-cards.test.mjs) to never be
    // rendered at all. RECENT_PROJECTS is its homepage-only, separately
    // condensed twin, and IS rendered, on / only.
    const homepage = builtPages().find((f) => f.endsWith(path.join("index.html")));
    assert.ok(homepage, "index.html was not built");
    const source = fs.readFileSync(homepage, "utf8");
    assert.ok(
      source.includes(KNOWN_CLIENT_SECTOR_LABEL),
      `expected the known client-sector label "${KNOWN_CLIENT_SECTOR_LABEL}" on / — if its wording changed, update KNOWN_CLIENT_SECTOR_LABEL above to match`,
    );
  });

  for (const file of pages) {
    const route = "/" + path.relative(outDir, file).replace(/\.html$/, "").split(path.sep).join("/");
    test(`${route} does not claim Lion RMS is Principal Designer or Principal Contractor`, () => {
      const source = fs.readFileSync(file, "utf8");
      // Visible body only — script/JSON-LD blocks stripped first, matching
      // the technique used elsewhere in this suite (service-architecture,
      // site-quality) — then the one known, approved client-sector label is
      // removed by exact string match before the forbidden-phrase scan.
      const bodyOnly = source
        .replace(/<script[^>]*>[\s\S]*?<\/script>/g, "")
        .split(KNOWN_CLIENT_SECTOR_LABEL)
        .join("");
      for (const pattern of FORBIDDEN) {
        assert.equal(
          pattern.test(bodyOnly),
          false,
          `${route} contains a forbidden dutyholder claim matching ${pattern}`,
        );
      }
    });
  }
});
