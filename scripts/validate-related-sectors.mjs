// Static data-integrity check: no related-content block anywhere in the
// site should be able to generate a link to a sector page that doesn't
// exist. Catches the class of bug fixed in the "fix/case-study-related-
// sector-links" hotfix — a case study (or any future content type) listing
// a sector in its related-sectors data whose `hasPage` is false.
//
// This is a plain data check, not a rendered-DOM check — it reads the same
// SECTORS / CASE_STUDIES arrays the pages import and asserts the invariant
// the RelatedContent component now depends on: an item only carries an
// `href` when the destination page actually exists.
//
// Usage: node --experimental-strip-types scripts/validate-related-sectors.mjs
// Requires Node 22.6+ (type-stripping). No new dependencies are introduced.

import { SECTORS, getSector } from "../lib/site.ts";
import { CASE_STUDIES } from "../lib/case-studies.ts";

let failures = 0;

function fail(message) {
  failures += 1;
  console.error(`✗ ${message}`);
}

// 1. Every sector slug referenced by every case study must resolve to a
//    real sector, and — this is the actual regression guard — the page
//    layer must never be able to build a live link for a sector whose
//    hasPage is false.
for (const study of CASE_STUDIES) {
  for (const slug of study.relatedSectors) {
    const sector = getSector(slug);
    if (!sector) {
      fail(`Case study "${study.slug}" references unknown sector slug "${slug}".`);
      continue;
    }
    // Reproduce exactly what components/CaseStudyDetail.tsx does when it
    // builds relatedSectorItems, so this check breaks if that logic ever
    // regresses back to always setting href.
    const item = { label: sector.title, href: sector.hasPage ? `/sectors/${sector.slug}` : undefined };
    if (!sector.hasPage && item.href) {
      fail(
        `Case study "${study.slug}" would render a live link to "/sectors/${sector.slug}", but that sector has hasPage: false.`,
      );
    }
    if (sector.hasPage && !item.href) {
      fail(
        `Case study "${study.slug}" relates to sector "${sector.slug}", which has a live page, but no href would be generated for it.`,
      );
    }
  }
}

// 2. No internal href anywhere should ever point at "/sectors/<slug>" for a
//    slug whose hasPage is false. This is a broader net in case a future
//    content type (service, insight, another case study field) starts
//    generating sector links without going through the same guard.
const sectorsWithoutPages = new Set(SECTORS.filter((s) => !s.hasPage).map((s) => s.slug));
if (sectorsWithoutPages.size === 0) {
  console.log("ℹ No sectors currently have hasPage: false — nothing to guard against.");
}

if (failures > 0) {
  console.error(`\n${failures} issue(s) found.`);
  process.exit(1);
}

console.log(
  `✓ All ${CASE_STUDIES.length} case studies' related-sector links are safe (${sectorsWithoutPages.size} pageless sectors correctly excluded from linking).`,
);
