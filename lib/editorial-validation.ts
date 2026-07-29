// Editorial validation for the Knowledge Centre content platform
// (Phase 5A, PR 2).
//
// PR 1 established STRUCTURAL validation: does the frontmatter parse, is the
// category known, is the slug unique and non-reserved, does a relation point
// at something that exists. This file adds the EDITORIAL layer on top: is the
// item in a coherent publication state, is it being reviewed on the agreed
// cycle, are its tags real, is it accessible, and is its governance metadata
// internally consistent.
//
// Every function here is pure over plain data and takes an injectable `now`,
// so all of it is unit tested in-memory without a Velite build — see the note
// at the top of lib/content-schemas.ts for why that matters.

import {
  CONTENT_TAG_SLUGS,
} from "./taxonomy";
import { AUTHOR_IDS, REVIEWER_IDS } from "./people";
import { SITE_URL } from "./site";
import type { ValidationIssue, ContentItemLike } from "./content-validation";
import {
  reviewCycleMonths,
  toDateOnly,
  addMonths,
  today,
  SEO_TITLE_MIN,
  SEO_TITLE_MAX,
  SEO_DESCRIPTION_MIN,
  SEO_DESCRIPTION_MAX,
  SUMMARY_MIN,
  SUMMARY_MAX,
} from "./editorial-rules";

export interface EditorialOptions {
  /** Date-only "YYYY-MM-DD". Defaults to the real clock. */
  now?: string;
}

type Collections = Record<string, ContentItemLike[]>;

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.length > 0 ? v : undefined;

const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

function issue(
  collection: string,
  item: ContentItemLike,
  rule: string,
  severity: "error" | "warning",
  message: string
): ValidationIssue {
  return { collection, slug: item.slug, id: item.id, rule, severity, message };
}

/** Iterates every item across every collection. */
function* eachItem(collections: Collections) {
  for (const [collection, items] of Object.entries(collections)) {
    for (const item of items ?? []) yield { collection, item };
  }
}

// ---------------------------------------------------------------------------
// A. Editorial workflow and status coherence
// ---------------------------------------------------------------------------

export function checkStatusCoherence(
  collections: Collections,
  options: EditorialOptions = {}
): ValidationIssue[] {
  const now = options.now ?? today();
  const issues: ValidationIssue[] = [];

  for (const { collection, item } of eachItem(collections)) {
    const status = str(item.status);
    const published = toDateOnly(item.publishedDate);
    const updated = toDateOnly(item.updatedDate);
    const reviewed = toDateOnly(item.reviewedDate);

    if (status === "published") {
      // A1
      if (!published) {
        issues.push(issue(collection, item, "A1", "error",
          `"${item.slug}" is published but has no publishedDate.`));
      }
      // A2
      if (!str(item.reviewerId)) {
        issues.push(issue(collection, item, "A2", "error",
          `"${item.slug}" is published but has no reviewerId.`));
      }
    }

    // A3 — superseded must say what superseded it.
    if (status === "superseded") {
      const hasSuccessor =
        !!str(item.supersededBy) || arr(item.relatedArticles).length > 0;
      if (!hasSuccessor) {
        issues.push(issue(collection, item, "A3", "error",
          `"${item.slug}" is superseded but names no successor (supersededBy or relatedArticles).`));
      }
    }

    // A4 — unpublished items should not carry a publication date.
    if ((status === "draft" || status === "in-review") && published) {
      issues.push(issue(collection, item, "A4", "warning",
        `"${item.slug}" is ${status} but carries a publishedDate (${published}).`));
    }

    // A5 — no scheduled publishing support in the platform.
    if (published && published > now) {
      issues.push(issue(collection, item, "A5", "warning",
        `"${item.slug}" has a publishedDate in the future (${published}); scheduled publishing is not supported.`));
    }

    // A6 / A7 — chronological coherence.
    if (published && updated && updated < published) {
      issues.push(issue(collection, item, "A6", "error",
        `"${item.slug}" has updatedDate (${updated}) before publishedDate (${published}).`));
    }
    if (published && reviewed && reviewed < published) {
      issues.push(issue(collection, item, "A7", "error",
        `"${item.slug}" has reviewedDate (${reviewed}) before publishedDate (${published}).`));
    }
  }

  return issues;
}

// A8 — a published item should not point at content that isn't live.
const RELATION_TARGETS: Record<string, string> = {
  relatedArticles: "guides",
  relatedStandards: "standards",
  relatedLegislation: "legislation",
  relatedGlossaryTerms: "glossaryTerms",
  relatedDownloads: "downloads",
};

export function checkRelationPublicationState(
  collections: Collections
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const statusBySlug: Record<string, Record<string, string | undefined>> = {};
  for (const [collection, items] of Object.entries(collections)) {
    statusBySlug[collection] = {};
    for (const item of items ?? []) {
      statusBySlug[collection][item.slug] = str(item.status);
    }
  }

  for (const { collection, item } of eachItem(collections)) {
    if (str(item.status) !== "published") continue;
    for (const [field, target] of Object.entries(RELATION_TARGETS)) {
      const targetStatuses = statusBySlug[target];
      if (!targetStatuses) continue;
      for (const ref of arr(item[field]) as string[]) {
        const refStatus = targetStatuses[ref];
        if (refStatus === "draft" || refStatus === "archived") {
          issues.push(issue(collection, item, "A8", "warning",
            `published "${item.slug}" links via ${field} to "${ref}", which is ${refStatus}.`));
        }
      }
    }
  }

  return issues;
}

// ---------------------------------------------------------------------------
// B. Review cycles
// ---------------------------------------------------------------------------

export function checkReviewCycles(
  collections: Collections,
  options: EditorialOptions = {}
): ValidationIssue[] {
  const now = options.now ?? today();
  const issues: ValidationIssue[] = [];

  for (const { collection, item } of eachItem(collections)) {
    if (str(item.status) !== "published") continue;

    const cycle = reviewCycleMonths(collection, str(item.riskTier));
    // News has no routine cycle — dated historical records.
    if (cycle === null) continue;

    const nextDue = toDateOnly(item.nextReviewDue);

    // B1
    if (!nextDue) {
      issues.push(issue(collection, item, "B1", "error",
        `published "${item.slug}" has no nextReviewDue (${collection} cycle is ${cycle} months).`));
      continue;
    }

    // B2 — interval must not EXCEED the cycle. Shorter is always allowed,
    // because event-triggered review overrides the calendar cycle.
    const basis = toDateOnly(item.reviewedDate) ?? toDateOnly(item.publishedDate);
    if (basis) {
      const latestPermitted = addMonths(basis, cycle);
      if (nextDue > latestPermitted) {
        issues.push(issue(collection, item, "B2", "error",
          `"${item.slug}" has nextReviewDue ${nextDue}, beyond the ${cycle}-month cycle from ${basis} (latest permitted ${latestPermitted}).`));
      }
    }

    // B4 — overdue. WARNING at build time by design: content ageing must never
    // break an unrelated deployment. Escalated to a failure by content:audit.
    if (nextDue < now) {
      issues.push(issue(collection, item, "B4", "warning",
        `"${item.slug}" review is overdue — nextReviewDue was ${nextDue}.`));
    }
  }

  return issues;
}

// B5 — Standards and Legislation record when the source was last checked
// against the official publisher. Staleness there is a currency risk.
export function checkSourceCurrency(
  collections: Collections,
  options: EditorialOptions = {}
): ValidationIssue[] {
  const now = options.now ?? today();
  const issues: ValidationIssue[] = [];

  for (const collection of ["standards", "legislation"]) {
    const cycle = reviewCycleMonths(collection);
    if (cycle === null) continue;
    for (const item of collections[collection] ?? []) {
      if (str(item.status) !== "published") continue;
      const lastChecked = toDateOnly(item.lastCheckedDate);
      if (!lastChecked) continue; // schema already requires it
      const staleAfter = addMonths(lastChecked, cycle);
      if (staleAfter < now) {
        issues.push(issue(collection, item, "B5", "warning",
          `"${item.slug}" was last checked against its official source on ${lastChecked}, beyond the ${cycle}-month currency window.`));
      }
    }
  }

  return issues;
}

// ---------------------------------------------------------------------------
// C. Taxonomy integrity
// ---------------------------------------------------------------------------

export function checkTags(collections: Collections): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const known = new Set<string>(CONTENT_TAG_SLUGS as unknown as string[]);

  for (const { collection, item } of eachItem(collections)) {
    const tags = arr(item.tags) as string[];

    // C1 — no free-text tags. The Velite schema also enforces this at parse
    // time; this check keeps the pure validator meaningful when called on data
    // that did not come through a Velite build.
    for (const tag of tags) {
      if (!known.has(tag)) {
        issues.push(issue(collection, item, "C1", "error",
          `"${item.slug}" uses unknown tag "${tag}" — tags must exist in the taxonomy registry.`));
      }
    }

    // C2 — duplicates within one item.
    const seen = new Set<string>();
    for (const tag of tags) {
      if (seen.has(tag)) {
        issues.push(issue(collection, item, "C2", "error",
          `"${item.slug}" repeats tag "${tag}".`));
      }
      seen.add(tag);
    }

    // C3 — untagged published content is a discoverability gap, not a defect.
    if (str(item.status) === "published" && tags.length === 0) {
      issues.push(issue(collection, item, "C3", "warning",
        `published "${item.slug}" has no tags.`));
    }
  }

  return issues;
}

// Named author/reviewer must exist in the registry. Deliberately NOT paired
// with any rule requiring them to be different people: while there is a single
// approved reviewer, Batir is validly both author and reviewer.
export function checkPeopleReferences(collections: Collections): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const authors = new Set<string>(AUTHOR_IDS as unknown as string[]);
  const reviewers = new Set<string>(REVIEWER_IDS as unknown as string[]);

  for (const { collection, item } of eachItem(collections)) {
    const authorId = str(item.authorId);
    if (authorId && !authors.has(authorId)) {
      issues.push(issue(collection, item, "C4", "error",
        `"${item.slug}" names authorId "${authorId}", which is not in the author registry.`));
    }
    for (const field of ["reviewerId", "complianceReviewerId"]) {
      const value = str(item[field]);
      if (value && !reviewers.has(value)) {
        issues.push(issue(collection, item, "C5", "error",
          `"${item.slug}" names ${field} "${value}", which is not in the reviewer registry.`));
      }
    }
  }

  return issues;
}

// ---------------------------------------------------------------------------
// D. Editorial heuristics for titles, descriptions and summaries.
// All warnings — see the note in lib/editorial-rules.ts.
// ---------------------------------------------------------------------------

export function checkEditorialHeuristics(collections: Collections): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const { collection, item } of eachItem(collections)) {
    // D1 — the title a search result would actually show.
    const effectiveTitle = str(item.seoTitle) ?? str(item.title);
    if (effectiveTitle) {
      const n = effectiveTitle.length;
      if (n < SEO_TITLE_MIN) {
        issues.push(issue(collection, item, "D1", "warning",
          `"${item.slug}" title is ${n} characters, below the ${SEO_TITLE_MIN}-character editorial guideline.`));
      } else if (n > SEO_TITLE_MAX) {
        issues.push(issue(collection, item, "D1", "warning",
          `"${item.slug}" title is ${n} characters, above the ${SEO_TITLE_MAX}-character editorial guideline and likely to be truncated.`));
      }
    }

    // D2 — meta description.
    const desc = str(item.seoDescription);
    if (desc) {
      const n = desc.length;
      if (n < SEO_DESCRIPTION_MIN) {
        issues.push(issue(collection, item, "D2", "warning",
          `"${item.slug}" seoDescription is ${n} characters, below the ${SEO_DESCRIPTION_MIN}-character editorial guideline.`));
      } else if (n > SEO_DESCRIPTION_MAX) {
        issues.push(issue(collection, item, "D2", "warning",
          `"${item.slug}" seoDescription is ${n} characters, above the ${SEO_DESCRIPTION_MAX}-character editorial guideline and likely to be truncated.`));
      }
    }

    // D3 — summary drives cards and listings.
    const summary = str(item.summary);
    if (summary) {
      const n = summary.length;
      if (n < SUMMARY_MIN || n > SUMMARY_MAX) {
        issues.push(issue(collection, item, "D3", "warning",
          `"${item.slug}" summary is ${n} characters, outside the ${SUMMARY_MIN}–${SUMMARY_MAX} editorial guideline.`));
      }
    }

    // D6 — a wrong canonical is an active SEO hazard, so this one is an error.
    const canonical = str(item.canonicalUrl);
    if (canonical && !canonical.startsWith(SITE_URL)) {
      issues.push(issue(collection, item, "D6", "error",
        `"${item.slug}" has canonicalUrl "${canonical}", which is not an absolute URL on ${SITE_URL}.`));
    }

    // D7 — deliberate, but worth surfacing.
    if (item.noindex === true && str(item.status) === "published") {
      issues.push(issue(collection, item, "D7", "warning",
        `published "${item.slug}" is marked noindex.`));
    }
  }

  // D4 / D5 — duplicates within a collection.
  for (const [collection, items] of Object.entries(collections)) {
    const byTitle = new Map<string, string>();
    const byDesc = new Map<string, string>();
    for (const item of items ?? []) {
      const title = str(item.title);
      if (title) {
        const key = title.trim().toLowerCase();
        const first = byTitle.get(key);
        if (first) {
          issues.push(issue(collection, item, "D4", "warning",
            `"${item.slug}" duplicates the title of "${first}".`));
        } else byTitle.set(key, item.slug);
      }
      const desc = str(item.seoDescription) ?? str(item.summary);
      if (desc) {
        const key = desc.trim().toLowerCase();
        const first = byDesc.get(key);
        if (first) {
          issues.push(issue(collection, item, "D5", "warning",
            `"${item.slug}" duplicates the description/summary of "${first}".`));
        } else byDesc.set(key, item.slug);
      }
    }
  }

  return issues;
}

// ---------------------------------------------------------------------------
// E. Accessibility
// ---------------------------------------------------------------------------

const ALT_TEXT_ANTIPATTERN = /^(image|picture|photo|graphic)\s+of\b/i;
const LOOKS_LIKE_FILENAME = /^[\w\-./]+\.(png|jpe?g|gif|webp|svg|avif)$/i;

export function checkAccessibility(collections: Collections): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const { collection, item } of eachItem(collections)) {
    const src = str(item.featuredImageSrc);
    if (!src) continue;

    const alt = str(item.featuredImageAlt);
    // E1
    if (!alt || alt.trim().length === 0) {
      issues.push(issue(collection, item, "E1", "error",
        `"${item.slug}" sets featuredImageSrc but has no featuredImageAlt.`));
      continue;
    }
    // E2
    if (LOOKS_LIKE_FILENAME.test(alt.trim())) {
      issues.push(issue(collection, item, "E2", "warning",
        `"${item.slug}" alt text looks like a filename ("${alt}").`));
    } else if (ALT_TEXT_ANTIPATTERN.test(alt.trim())) {
      issues.push(issue(collection, item, "E2", "warning",
        `"${item.slug}" alt text opens with a redundant phrase ("${alt}").`));
    }
  }

  return issues;
}

// ---------------------------------------------------------------------------
// F. Governance and integrity
// ---------------------------------------------------------------------------

export function checkGovernance(
  collections: Collections,
  options: EditorialOptions = {}
): ValidationIssue[] {
  const now = options.now ?? today();
  const issues: ValidationIssue[] = [];

  for (const { collection, item } of eachItem(collections)) {
    // F1 — excluding content from retrieval is a decision that needs a reason
    // on the record.
    if (item.aiRetrievalEligible === false && !str(item.aiRetrievalExcludeReason)) {
      issues.push(issue(collection, item, "F1", "error",
        `"${item.slug}" sets aiRetrievalEligible false without aiRetrievalExcludeReason.`));
    }

    const published = toDateOnly(item.publishedDate);
    const updated = toDateOnly(item.updatedDate);
    const changelog = arr(item.changelog) as { date?: unknown; summary?: unknown }[];

    // F2 — monthly round-ups are immutable historical records except for
    // documented corrections. The changelog entry IS the documentation.
    if (item.immutable === true && published && updated && updated > published) {
      const hasCorrection = changelog.some((e) => toDateOnly(e?.date));
      if (!hasCorrection) {
        issues.push(issue(collection, item, "F2", "error",
          `immutable "${item.slug}" was updated on ${updated} after publication (${published}) with no changelog entry documenting the correction.`));
      }
    }

    // F3 — changelog must be chronological and not claim the future.
    let previous: string | undefined;
    for (const entry of changelog) {
      const date = toDateOnly(entry?.date);
      if (!date) continue;
      if (date > now) {
        issues.push(issue(collection, item, "F3", "error",
          `"${item.slug}" has a changelog entry dated in the future (${date}).`));
      }
      if (previous && date < previous) {
        issues.push(issue(collection, item, "F3", "error",
          `"${item.slug}" has a non-chronological changelog (${date} follows ${previous}).`));
      }
      previous = date ?? previous;
    }

    // F4
    if (published && updated && updated > published && changelog.length === 0) {
      issues.push(issue(collection, item, "F4", "warning",
        `"${item.slug}" was updated after publication but has an empty changelog.`));
    }

    // F5 — legal/technical content benefits from a named compliance reviewer.
    const needsComplianceReviewer =
      collection === "legislation" ||
      (collection === "guides" && str(item.riskTier) === "high-risk");
    if (
      needsComplianceReviewer &&
      str(item.status) === "published" &&
      !str(item.complianceReviewerId)
    ) {
      issues.push(issue(collection, item, "F5", "warning",
        `published "${item.slug}" has no complianceReviewerId.`));
    }
  }

  return issues;
}

// ---------------------------------------------------------------------------
// Aggregate
// ---------------------------------------------------------------------------

export function validateEditorialRules(
  collections: Collections,
  options: EditorialOptions = {}
): ValidationIssue[] {
  return [
    ...checkStatusCoherence(collections, options),
    ...checkRelationPublicationState(collections),
    ...checkReviewCycles(collections, options),
    ...checkSourceCurrency(collections, options),
    ...checkTags(collections),
    ...checkPeopleReferences(collections),
    ...checkEditorialHeuristics(collections),
    ...checkAccessibility(collections),
    ...checkGovernance(collections, options),
  ];
}
