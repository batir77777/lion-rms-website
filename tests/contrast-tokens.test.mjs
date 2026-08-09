// Contrast-token regression tests (Phase 5A, PR 4).
//
// PR 4 corrected two design tokens that were failing WCAG 2.1 AA across the
// site. These tests exist to stop them coming back — not as a general
// accessibility check, but as a specific lock on two decisions that are easy to
// undo by accident, because both tokens still *look* fine to a sighted
// developer picking a colour from the existing palette.
//
// The teal rule is absolute: teal-600 never appears on a dark background
// anywhere on this site, so it always fails as text and the token is banned
// outright.
//
// The slate rule is NOT absolute, and that is the whole point of this file.
// text-slate-400 is correct and passing at 7.51:1 on the footer navy (#060e1f)
// and on the dark gradient CTA panels. A blanket ban would push someone toward
// "fixing" those and making them worse. So the rule is an explicit allowlist:
// these exact files may use it, in these exact quantities, on dark backgrounds
// only. A new light-background use fails the count assertion rather than
// slipping through.

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function sourceFiles() {
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) out.push(full);
    }
  };
  walk(path.join(repoRoot, "app"));
  walk(path.join(repoRoot, "components"));
  return out;
}

const rel = (f) => path.relative(repoRoot, f);
const count = (text, token) =>
  (text.match(new RegExp(`\\b${token.replace("-", "\\-")}\\b`, "g")) || []).length;

// ---------------------------------------------------------------------------
// Dark-background allowlist for text-slate-400.
//
// Every entry below was measured: slate-400 (#94a3b8) on the footer navy
// (#060e1f) is 7.51:1, comfortably above the 4.5:1 requirement. The dark
// gradient CTA panels use the same navy family. These uses are CORRECT and must
// not be "fixed" — changing them to slate-500 would reduce contrast.
// ---------------------------------------------------------------------------
const SLATE_400_DARK_ALLOWLIST = {
  // 17 as of repositioning PR1 (2026-08-09): 15 from Phase 5A PR 5 (the
  // fourteen existing uses plus the nested Knowledge Centre section links
  // under the Pages column), plus 2 more for the new Services column's
  // heading and link list. Same #060e1f background, same measured 7.51:1.
  "components/Footer.tsx": 17, // footer body, nav links, Services column, Knowledge Centre sections, credentials, legal line — bg #060e1f
  "app/services/[slug]/page.tsx": 1, // dark gradient CTA panel
  "app/services/page.tsx": 1, // dark gradient CTA panel
  "app/sectors/[slug]/page.tsx": 1, // dark gradient CTA panel
  "app/sectors/page.tsx": 1, // dark gradient CTA panel
  "app/guides/[slug]/page.tsx": 1, // dark gradient CTA panel
  "app/glossary/[slug]/page.tsx": 1, // dark gradient CTA panel (PR 4)
  "app/standards/[slug]/page.tsx": 1, // dark gradient CTA panel (PR 5)
  // Same CTA panel markup and same #060e1f→#0c1f3f→#082218 gradient as the
  // Standards detail page. Measured against all three gradient stops:
  // 7.51:1, 6.38:1 and 6.54:1 — the worst case passes AA for normal text.
  "app/legislation/[slug]/page.tsx": 1, // dark gradient CTA panel (PR 6)
  // Same CTA panel markup and same #060e1f→#0c1f3f→#082218 gradient again.
  // Measured against all three stops: 7.51:1, 6.38:1 and 6.54:1.
  "app/news/[slug]/page.tsx": 1, // dark gradient CTA panel (PR 7)
  // Same CTA panel markup and same #060e1f→#0c1f3f→#082218 gradient again.
  // Measured against all three stops: 7.51:1, 6.38:1 and 6.54:1.
  "app/downloads/[slug]/page.tsx": 1, // dark gradient CTA panel (PR 8A)
  "app/about/page.tsx": 1, // dark gradient CTA panel
  "app/faq/page.tsx": 1, // dark gradient CTA panel
  "app/case-studies/page.tsx": 1, // dark gradient CTA panel
  "components/CaseStudyDetail.tsx": 1, // dark gradient CTA panel
  // The ten question-helper paragraphs on /check. These sit on that page's
  // translucent overlay (#6d798c), where slate-400 measures 1.71:1 — a failure,
  // but one belonging to the deferred /check overlay cluster rather than to the
  // two tokens. Darkening it to slate-500 makes it WORSE (1.07:1), because the
  // defect is the overlay being too light, not the text being too pale. Left
  // exactly as found so the deferred cluster stays at its measured baseline.
  "components/ComplianceCheck.tsx": 1,
};

// Files corrected in PR 4 — these previously used slate-400 on a light
// background and must never use it again.
const SLATE_400_CORRECTED = [
  "app/page.tsx",
  "components/AuthorityStrip.tsx",
  "app/contact/page.tsx",
];

describe("Contrast token regressions", () => {
  test("teal-600 is not used anywhere — it fails AA on every background this site uses", () => {
    const offenders = [];
    for (const file of sourceFiles()) {
      const text = fs.readFileSync(file, "utf8");
      for (const token of ["text-teal-600", "bg-teal-600", "outline-teal-600"]) {
        if (count(text, token) > 0) offenders.push(`${rel(file)}: ${token}`);
      }
    }
    assert.deepEqual(
      offenders,
      [],
      "teal-600 measured 3.58–3.74:1 against every background in use; teal-700 gives 5.2–5.5:1"
    );
  });

  test("teal-700 is actually in use, so the ban above is not vacuous", () => {
    const total = sourceFiles().reduce(
      (n, f) => n + count(fs.readFileSync(f, "utf8"), "text-teal-700"),
      0
    );
    assert.ok(total > 40, `expected the corrected token to be widely used, found ${total}`);
  });

  test("the files fully corrected in PR 4 no longer use slate-400 at all", () => {
    for (const f of SLATE_400_CORRECTED) {
      const text = fs.readFileSync(path.join(repoRoot, f), "utf8");
      assert.equal(
        count(text, "text-slate-400"),
        0,
        `${f} previously failed at 2.45–2.56:1 on a light background`
      );
    }
  });

  test("slate-400 survives only in the measured dark-background allowlist", () => {
    const found = {};
    for (const file of sourceFiles()) {
      const n = count(fs.readFileSync(file, "utf8"), "text-slate-400");
      if (n > 0) found[rel(file)] = n;
    }
    assert.deepEqual(
      found,
      SLATE_400_DARK_ALLOWLIST,
      "a new text-slate-400 use appeared, or an allowlisted dark-background use changed count. " +
        "If the new use is on a light background it must be slate-500. If it is genuinely on a " +
        "dark background, measure it and add it to the allowlist with its ratio."
    );
  });

  test("ComplianceCheck is corrected only where the failure is on white", () => {
    const text = fs.readFileSync(path.join(repoRoot, "components/ComplianceCheck.tsx"), "utf8");
    // Progress label — axe measures its spans against white at 2.56:1. Corrected.
    assert.equal(count(text, "text-slate-500"), 2);
    // Question-helper paragraphs — measured against the /check overlay, part of
    // the deferred cluster. Darkening them made 10 nodes worse, so they stay.
    assert.equal(count(text, "text-slate-400"), 1);
  });

  test("the allowlist preserves the footer, which is the case most likely to be broken by a blanket fix", () => {
    const footer = fs.readFileSync(path.join(repoRoot, "components/Footer.tsx"), "utf8");
    assert.ok(footer.includes("#060e1f"), "footer background colour changed — re-measure the allowlist");
    assert.equal(count(footer, "text-slate-400"), 17);
    assert.equal(count(footer, "text-slate-500"), 0, "slate-500 on #060e1f would be worse, not better");
  });
});
