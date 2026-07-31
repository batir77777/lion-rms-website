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
  getContentCategory,
} from "./taxonomy";
import { AUTHOR_IDS, REVIEWER_IDS } from "./people";
import { SITE_URL } from "./site";
import type { ValidationIssue, ContentItemLike } from "./content-validation";
import {
  reviewCycleMonths,
  tagsExpected,
  toDateOnly,
  addMonths,
  today,
  SEO_TITLE_MIN,
  SEO_TITLE_MAX,
  SEO_DESCRIPTION_MIN,
  SEO_DESCRIPTION_MAX,
  SUMMARY_MIN,
  SUMMARY_MAX,
  DOCUMENT_REFERENCE_COLLECTIONS,
  DOCUMENT_STATUS_COLLECTIONS,
  PUBLICATION_GATE_FIELDS,
  EDITION_REQUIRED_CLASSES,
  OFFICIAL_SOURCE_HOSTS,
  LICENCE_NOTICE_MARKERS,
  NOTICE_MIN_LENGTH,
  COMMERCIAL_QUOTE_MAX_CHARS,
  LEGISLATION_OFFICIAL_HOST,
  FORM_PERMITTED_EXTENTS,
  TERMINATION_STATUS_TIER,
} from "./editorial-rules";
import { hasCycleVia } from "./supersession";

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
    //
    // Reconciled with G1 in Phase 5A PR 5, because the two look alike and are
    // not the same check. A3 fires on `status` — OUR PAGE has been superseded
    // by another page on this site. G1 fires on `documentStatus` — the
    // EXTERNAL DOCUMENT this page describes has been superseded by another
    // document. A page can be in either state independently of the other, so
    // both rules exist; the messages name which one is being reported.
    //
    // `supersededBy` became an array in PR 5, so it is read as one here.
    if (status === "superseded") {
      const hasSuccessor =
        arr(item.supersededBy).length > 0 || arr(item.relatedArticles).length > 0;
      if (!hasSuccessor) {
        issues.push(issue(collection, item, "A3", "error",
          `"${item.slug}" has publication status "superseded" but names no successor page (supersededBy or relatedArticles).`));
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

    // C3 — untagged published content is a discoverability gap, not a defect,
    // and only in collections where tags are the load-bearing navigation axis.
    // Guides are excluded: their taxonomy is carried by category, audience and
    // document relations, so an empty tags array there is a valid editorial
    // state. See TAGS_EXPECTED_COLLECTIONS in editorial-rules.ts.
    if (
      tagsExpected(collection) &&
      str(item.status) === "published" &&
      tags.length === 0
    ) {
      issues.push(issue(collection, item, "C3", "warning",
        `published "${item.slug}" has no tags.`));
    }
  }

  return issues;
}

/**
 * C6 — a category must declare that it applies to the section using it.
 *
 * `appliesTo` has existed in the taxonomy registry since PR 1 and was, until
 * now, documentation: it described which sections a category was intended for
 * and nothing checked it. That meant the registry could quietly drift away
 * from what content actually did — a category could say "guides and news"
 * while a glossary term used it, and the only cost would be a comment that had
 * become untrue.
 *
 * Enforcing it in Phase 5A PR 5 makes the applicability decision real. Opting a
 * category into a new section is now a deliberate registry edit that has to be
 * made before content can use it, which is exactly the property the closed
 * taxonomy was built for in the first place.
 *
 * The map below translates a collection name to the section value the registry
 * uses. Collections not in the map are unconstrained, because their categories
 * were never scoped — adding one here is how a future vertical opts in.
 */
const COLLECTION_SECTIONS: Record<string, string> = {
  guides: "guide",
  news: "news",
  glossaryTerms: "glossary",
  standards: "standard",
  legislation: "legislation",
};

export function checkCategoryApplicability(collections: Collections): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const { collection, item } of eachItem(collections)) {
    const section = COLLECTION_SECTIONS[collection];
    if (!section) continue;

    const slug = str(item.category);
    if (!slug) continue;

    const category = getContentCategory(slug);
    // An unknown category is already an error at parse time via the schema's
    // enum; nothing to add here.
    if (!category) continue;

    if (!category.appliesTo.includes(section as never)) {
      issues.push(issue(collection, item, "C6", "error",
        `"${item.slug}" uses category "${slug}", which is not declared as applying to the ${section} section (appliesTo: ${category.appliesTo.join(", ")}).`));
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
    // Standards joined in Phase 5A PR 5: a page that misstates what a document
    // requires carries the same professional risk as a legislation page.
    const needsComplianceReviewer =
      collection === "legislation" ||
      collection === "standards" ||
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
// G. External document references — Standards now, Legislation from PR 6.
//
// Everything in this section iterates DOCUMENT_REFERENCE_COLLECTIONS rather
// than naming "standards", so PR 6 enables the whole set for Legislation by
// adding one entry to that list.
//
// The thing these rules exist to prevent is a specific and quiet failure: a
// reference page that looks authoritative, is trusted by a professional
// reader, and is silently out of date. Nothing about a stale page looks wrong.
// ---------------------------------------------------------------------------

/** Items across every collection that describes an external document. */
function* eachDocumentItem(collections: Collections) {
  for (const collection of DOCUMENT_REFERENCE_COLLECTIONS) {
    for (const item of collections[collection] ?? []) yield { collection, item };
  }
}

/** Registrable-domain suffix match, so subdomains of an allowed host pass. */
function hostMatches(url: string, allowed: readonly string[]): boolean {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }
  return allowed.some((d) => host === d || host.endsWith(`.${d}`));
}

/**
 * G1–G4, G9–G12, G16 — lifecycle and supersession coherence.
 */
export function checkDocumentLifecycle(
  collections: Collections,
  options: EditorialOptions = {}
): ValidationIssue[] {
  const now = options.now ?? today();
  const issues: ValidationIssue[] = [];

  // G1, G9, G10, G12 and G16 read `documentStatus`, which is a BSI lifecycle
  // field. Scoped in Phase 5A PR 6 to the collections that actually carry it —
  // Legislation uses `forceStatus` and the L-series rules instead. G3 and G4
  // (self-supersession and cycles) are lifecycle-agnostic and stay universal,
  // so they run for both collections below.
  for (const collection of DOCUMENT_REFERENCE_COLLECTIONS) {
    const items = collections[collection] ?? [];
    const bySlug = new Map(items.map((i) => [i.slug, i]));
    const lifecycleApplies = DOCUMENT_STATUS_COLLECTIONS.includes(collection);

    for (const item of items) {
      const docStatus = lifecycleApplies ? str(item.documentStatus) : undefined;
      const successors = arr(item.supersededBy) as string[];
      const withdrawn = lifecycleApplies ? toDateOnly(item.withdrawnDate) : undefined;

      // G1 — a superseded document that names no successor strands the reader
      // on the one page whose entire job is to point them onward.
      if (docStatus === "superseded" && successors.length === 0) {
        issues.push(issue(collection, item, "G1", "error",
          `"${item.slug}" has documentStatus "superseded" but names no successor in supersededBy.`));
      }

      // G3 — self-supersession.
      if (successors.includes(item.slug)) {
        issues.push(issue(collection, item, "G3", "error",
          `"${item.slug}" lists itself in supersededBy.`));
      }

      // G4 — cycles. Walked ITERATIVELY with a visited set rather than
      // recursively: a cycle here must be reported, never become a stack
      // overflow during a content build.
      const seen = new Set<string>([item.slug]);
      const queue = [...successors];
      while (queue.length > 0) {
        const next = queue.shift()!;
        if (next === item.slug) {
          issues.push(issue(collection, item, "G4", "error",
            `"${item.slug}" is part of a supersession cycle.`));
          break;
        }
        if (seen.has(next)) continue;
        seen.add(next);
        const target = bySlug.get(next);
        if (target) queue.push(...(arr(target.supersededBy) as string[]));
      }

      // G9 — a withdrawal that has not happened yet.
      if (withdrawn && withdrawn > now) {
        issues.push(issue(collection, item, "G9", "error",
          `"${item.slug}" has withdrawnDate ${withdrawn}, which is in the future.`));
      }

      // G10 — withdrawn with no date. A warning, not an error: publishers do
      // not always state one, and PAS 79-2 is the live example — suspended
      // March 2021, withdrawal confirmed by BSI statement that August, with no
      // discrete withdrawal date published in the catalogue.
      if (docStatus === "withdrawn" && !withdrawn) {
        issues.push(issue(collection, item, "G10", "warning",
          `"${item.slug}" is withdrawn but records no withdrawnDate.`));
      }

      // G12 — incoherent: current documents have not been withdrawn.
      if (docStatus === "current" && withdrawn) {
        issues.push(issue(collection, item, "G12", "error",
          `"${item.slug}" has documentStatus "current" but also a withdrawnDate (${withdrawn}).`));
      }

      // G16 — an amendment dated in the future. A warning rather than an
      // error, because amendments ARE published ahead of coming into force
      // (Approved Document B's 2026 and 2029 amendment sets are exactly this),
      // but a future date in the amendments list reads as already applying.
      //
      // Phase 5A PR 6: an amendment explicitly marked `inForce: false` is a
      // deliberate record of something made but not yet commenced, which is
      // normal and important for legislation. Recording it correctly must not
      // trip a rule designed to catch a date typo.
      for (const entry of arr(item.amendments) as {
        reference?: unknown;
        date?: unknown;
        inForce?: unknown;
      }[]) {
        if (entry?.inForce === false) continue;
        const date = toDateOnly(entry?.date);
        if (date && date > now) {
          issues.push(issue(collection, item, "G16", "warning",
            `"${item.slug}" lists amendment "${String(entry?.reference ?? "?")}" dated ${date}, which is in the future — if it is not yet in force, describe it in the body rather than listing it as an amendment.`));
        }
      }
    }
  }

  return issues;
}

/**
 * G5 — a published Guide pointing at a document that is no longer current.
 *
 * The most valuable rule in this file. It catches the day a standard is
 * withdrawn and a Guide carries on recommending it — which is not a
 * hypothetical: PAS 79-2 was withdrawn in 2021 and replaced in 2025, and
 * anything still citing it as live guidance for housing is now wrong.
 *
 * A warning, not an error. A Guide may legitimately discuss a withdrawn
 * document, and often should. The rule asks for a look, not a removal.
 */
export function checkReferencedDocumentCurrency(
  collections: Collections
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const statusBy: Record<string, Map<string, string | undefined>> = {};
  for (const collection of DOCUMENT_REFERENCE_COLLECTIONS) {
    statusBy[collection] = new Map(
      (collections[collection] ?? []).map((i) => [i.slug, str(i.documentStatus)])
    );
  }

  const fieldToCollection: Record<string, string> = {
    relatedStandards: "standards",
    relatedLegislation: "legislation",
  };

  for (const { collection, item } of eachItem(collections)) {
    const acknowledged = new Set(arr(item.acknowledgedNonCurrentDocuments) as string[]);
    const referenced = new Set<string>();

    if (str(item.status) === "published") {
      for (const [field, target] of Object.entries(fieldToCollection)) {
        const statuses = statusBy[target];
        if (!statuses) continue;
        for (const ref of arr(item[field]) as string[]) {
          referenced.add(ref);
          const refStatus = statuses.get(ref);
          if (refStatus && refStatus !== "current" && !acknowledged.has(ref)) {
            issues.push(issue(collection, item, "G5", "warning",
              `published "${item.slug}" references "${ref}" via ${field}, and that document is ${refStatus} — check the page still describes the position accurately, then list the slug in acknowledgedNonCurrentDocuments to record that it was reviewed.`));
          }
        }
      }
    } else {
      for (const field of Object.keys(fieldToCollection)) {
        for (const ref of arr(item[field]) as string[]) referenced.add(ref);
      }
    }

    // G17 — keeps the acknowledgement honest. An entry that names a document
    // which has since become current again, or one this item no longer
    // references, is a silencer left lying around; both surface here rather
    // than quietly suppressing a future G5 that would have mattered.
    for (const ack of acknowledged) {
      if (!referenced.has(ack)) {
        issues.push(issue(collection, item, "G17", "warning",
          `"${item.slug}" acknowledges non-current document "${ack}" but does not reference it — remove the stale acknowledgement.`));
        continue;
      }
      const stillNonCurrent = Object.values(fieldToCollection).some((target) => {
        const status = statusBy[target]?.get(ack);
        return status !== undefined && status !== "current";
      });
      if (!stillNonCurrent) {
        issues.push(issue(collection, item, "G17", "warning",
          `"${item.slug}" acknowledges "${ack}" as non-current, but that document is current — remove the acknowledgement.`));
      }
    }
  }

  return issues;
}

/**
 * G6, G7, G8, G11 — provenance, official source and copyright integrity.
 */
export function checkDocumentProvenance(collections: Collections): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const { collection, item } of eachDocumentItem(collections)) {
    const documentClass = str(item.documentClass);

    // G6 — a BS or PAS without an edition year is not a usable reference.
    if (
      documentClass &&
      EDITION_REQUIRED_CLASSES.includes(documentClass) &&
      !str(item.currentEdition)
    ) {
      issues.push(issue(collection, item, "G6", "error",
        `"${item.slug}" is a ${documentClass} but records no currentEdition.`));
    }

    // G7 — "official source" must reach the publisher, not a reseller.
    const sourceUrl = str(item.officialSourceUrl);
    const allowedHosts = documentClass ? OFFICIAL_SOURCE_HOSTS[documentClass] : undefined;
    if (sourceUrl && allowedHosts && allowedHosts.length > 0) {
      if (!hostMatches(sourceUrl, allowedHosts)) {
        issues.push(issue(collection, item, "G7", "warning",
          `"${item.slug}" has officialSourceUrl "${sourceUrl}", which is not on a recognised publisher domain for ${documentClass} (${allowedHosts.join(", ")}).`));
      }
    }

    // G8 — the notice and the disclaimer must be real, and the notice must
    // match the licence regime. `min(1)` in the schema is satisfied by a
    // single character, which is exactly what a placeholder looks like.
    const licence = str(item.sourceLicence) ?? "commercial";
    const notice = str(item.copyrightNotice) ?? "";
    const disclaimer = str(item.disclaimer) ?? "";

    if (notice.length < NOTICE_MIN_LENGTH) {
      issues.push(issue(collection, item, "G8", "warning",
        `"${item.slug}" has a copyrightNotice of ${notice.length} characters, below the ${NOTICE_MIN_LENGTH}-character minimum for a meaningful notice.`));
    }
    if (disclaimer.length < NOTICE_MIN_LENGTH) {
      issues.push(issue(collection, item, "G8", "warning",
        `"${item.slug}" has a disclaimer of ${disclaimer.length} characters, below the ${NOTICE_MIN_LENGTH}-character minimum.`));
    }

    const markers = LICENCE_NOTICE_MARKERS[licence] ?? [];
    if (markers.length > 0 && notice.length > 0) {
      const lower = notice.toLowerCase();
      if (!markers.some((m) => lower.includes(m))) {
        issues.push(issue(collection, item, "G8", "warning",
          `"${item.slug}" declares sourceLicence "${licence}" but its copyrightNotice does not mention it.`));
      }
    }
    // The reverse, and the more dangerous direction: claiming open terms over
    // commercially licensed material.
    if (licence === "commercial" && notice.toLowerCase().includes("open government licence")) {
      issues.push(issue(collection, item, "G8", "warning",
        `"${item.slug}" declares sourceLicence "commercial" but its copyrightNotice claims Open Government Licence terms.`));
    }

    // G11 — the machine-checkable half of the copyright boundary. A long
    // verbatim block quotation from a commercially licensed source is not
    // automatically a breach, and this is not a legal test — it is a tripwire
    // that puts the question in front of a person instead of letting it pass.
    if (licence === "commercial") {
      const body = typeof item.body === "string" ? item.body : "";
      for (const match of body.matchAll(/^>\s?.*(?:\n>\s?.*)*/gm)) {
        const quote = match[0].replace(/^>\s?/gm, "");
        if (quote.length > COMMERCIAL_QUOTE_MAX_CHARS) {
          issues.push(issue(collection, item, "G11", "warning",
            `"${item.slug}" quotes ${quote.length} characters verbatim from a commercially licensed source — review against the publisher's reproduction terms.`));
          break;
        }
      }
    }
  }

  return issues;
}

/**
 * G13, G14, G15 — the publication gate (owner-required, Phase 5A PR 5).
 *
 * A Standards page may not be published unless it carries explicit evidence
 * that its status, edition and licence were actively confirmed, by a named
 * person, against the official source.
 *
 * The reasoning is that this is the site's first authoritative reference
 * library, and the currency of a reference page is the whole of its value.
 * `lastCheckedDate` records that somebody looked; these fields record what
 * they actually confirmed, which is a different and stronger claim.
 *
 * Every field is optional in the schema and required HERE, so a half-verified
 * draft can exist while it is being written but can never go live.
 */
export function checkDocumentPublicationGate(
  collections: Collections,
  options: EditorialOptions = {}
): ValidationIssue[] {
  const now = options.now ?? today();
  const issues: ValidationIssue[] = [];

  for (const { collection, item } of eachDocumentItem(collections)) {
    const documentClass = str(item.documentClass);
    const editionRequired =
      !!documentClass && EDITION_REQUIRED_CLASSES.includes(documentClass);

    const confirmations: [string, string | undefined][] = [
      ["statusConfirmedDate", toDateOnly(item.statusConfirmedDate)],
      ["editionConfirmedDate", toDateOnly(item.editionConfirmedDate)],
      ["licenceConfirmedDate", toDateOnly(item.licenceConfirmedDate)],
      ["sourceCurrencyConfirmedDate", toDateOnly(item.sourceCurrencyConfirmedDate)],
    ];

    // G14 — a confirmation cannot have happened in the future. Applies
    // whatever the publication state, because a future-dated confirmation is
    // a mistake in a draft too.
    for (const [field, value] of confirmations) {
      if (value && value > now) {
        issues.push(issue(collection, item, "G14", "error",
          `"${item.slug}" has ${field} ${value}, which is in the future.`));
      }
    }

    if (str(item.status) !== "published") continue;

    // The required set is per-collection from Phase 5A PR 6, because
    // Legislation needs `forceStatus`, extent, application, source currency and
    // the outstanding-effects check rather than the Standards set. The
    // Standards entry in PUBLICATION_GATE_FIELDS is deliberately identical to
    // what was hardcoded here in PR 5, and a test pins that.
    const required = PUBLICATION_GATE_FIELDS[collection] ?? [];
    const DATE_FIELDS = new Set([
      "statusConfirmedDate",
      "editionConfirmedDate",
      "licenceConfirmedDate",
      "lastCheckedDate",
      "sourceTextAsAtDate",
    ]);

    const missing: string[] = [];
    for (const field of required) {
      const value = item[field];
      if (DATE_FIELDS.has(field)) {
        if (!toDateOnly(value)) missing.push(field);
      } else if (field === "extent" || field === "application") {
        if (arr(value).length === 0) missing.push(field);
      } else if (field === "outstandingEffectsChecked") {
        // A boolean: `false` is a legitimate value meaning "checked, none
        // found", so only absence counts as missing.
        if (typeof value !== "boolean") missing.push(field);
      } else if (!str(value)) {
        missing.push(field);
      }
    }
    // Edition is conditional on document class rather than a flat requirement,
    // so it sits outside the list.
    if (editionRequired && !str(item.currentEdition)) missing.push("currentEdition");

    if (missing.length > 0) {
      issues.push(issue(collection, item, "G13", "error",
        `published "${item.slug}" is missing required verification metadata: ${missing.join(", ")}. A reference page may not be published without explicit evidence that its status, edition and licence were confirmed against the official source.`));
    }

    // G15 — confirmations that have gone stale. Warning, consistent with B4
    // and B5: the passage of time must never break a deployment.
    const cycle = reviewCycleMonths(collection);
    if (cycle !== null) {
      for (const [field, value] of confirmations) {
        if (value && addMonths(value, cycle) < now) {
          issues.push(issue(collection, item, "G15", "warning",
            `"${item.slug}" has ${field} ${value}, beyond the ${cycle}-month currency window.`));
        }
      }
    }
  }

  return issues;
}

// ---------------------------------------------------------------------------
// L. Legislation (Phase 5A, PR 6).
//
// Scoped to the legislation collection, because legislation has a lifecycle,
// a territorial model and a source-currency model that BSI standards do not.
// The G-series rules that read `documentStatus` are scoped away from here; the
// ones that are lifecycle-agnostic (G3 self-supersession, G4 cycles, G7/G8/G11
// provenance and copyright, G13 the publication gate) still apply.
// ---------------------------------------------------------------------------

const LEGISLATION = "legislation";

function* eachLegislation(collections: Collections) {
  for (const item of collections[LEGISLATION] ?? []) yield item;
}

/** L1–L3, L15 — relation integrity and commencement coherence. */
export function checkLegislationRelations(
  collections: Collections,
  options: EditorialOptions = {}
): ValidationIssue[] {
  const now = options.now ?? today();
  const issues: ValidationIssue[] = [];
  const items = collections[LEGISLATION] ?? [];
  const slugs = new Set(items.map((i) => i.slug));

  for (const item of items) {
    // L1 — every directed and peer reference must resolve. A dangling
    // reference on a page whose job is to place an instrument in the statutory
    // scheme is worse than no reference.
    for (const field of ["relatedLegislation", "amends", "supersededBy"]) {
      for (const ref of arr(item[field]) as string[]) {
        if (!slugs.has(ref)) {
          issues.push(issue(LEGISLATION, item, "L1", "error",
            `"${item.slug}" has ${field} referencing "${ref}", which does not exist in the legislation collection.`));
        }
      }
    }

    // L3 — self-amendment.
    if ((arr(item.amends) as string[]).includes(item.slug)) {
      issues.push(issue(LEGISLATION, item, "L3", "error",
        `"${item.slug}" lists itself in amends.`));
    }

    // L2 — cycles in either directed graph.
    for (const field of ["amends", "supersededBy"]) {
      if (hasCycleVia(item as never, field, items as never[])) {
        issues.push(issue(LEGISLATION, item, "L2", "error",
          `"${item.slug}" is part of a ${field} cycle.`));
      }
    }

    // L15 — commencement coherence.
    const events = arr(item.commencement) as { date?: unknown; scope?: unknown }[];
    for (const event of events) {
      const date = toDateOnly(event?.date);
      if (date && date > now) {
        issues.push(issue(LEGISLATION, item, "L15", "error",
          `"${item.slug}" records a commencement event dated ${date}, which is in the future.`));
      }
    }
    const declared = toDateOnly(item.inForceDate);
    const firstEvent = toDateOnly(events[0]?.date);
    if (declared && firstEvent && declared !== firstEvent) {
      issues.push(issue(LEGISLATION, item, "L15", "error",
        `"${item.slug}" has inForceDate ${declared} but its first commencement event is ${firstEvent}.`));
    }
  }

  return issues;
}

/** L4–L8, L11 — lifecycle, classification and territory coherence. */
export function checkLegislationCoherence(collections: Collections): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const item of eachLegislation(collections)) {
    const force = str(item.forceStatus);
    const tier = str(item.legislationTier);
    const form = str(item.instrumentForm);
    const extent = arr(item.extent) as string[];
    const application = arr(item.application) as string[];

    // L4 — Acts are repealed, statutory instruments are revoked.
    if (force && TERMINATION_STATUS_TIER[force] && tier) {
      const expected = TERMINATION_STATUS_TIER[force];
      if (expected !== tier) {
        issues.push(issue(LEGISLATION, item, "L4", "error",
          `"${item.slug}" has forceStatus "${force}", which applies to ${expected} legislation, but is declared ${tier}. Acts are repealed; statutory instruments are revoked.`));
      }
    }
    if (toDateOnly(item.repealedDate) && tier === "secondary") {
      issues.push(issue(LEGISLATION, item, "L4", "error",
        `"${item.slug}" is secondary legislation and carries a repealedDate — secondary legislation is revoked, not repealed.`));
    }
    if (toDateOnly(item.revokedDate) && tier === "primary") {
      issues.push(issue(LEGISLATION, item, "L4", "error",
        `"${item.slug}" is primary legislation and carries a revokedDate — primary legislation is repealed, not revoked.`));
    }

    // L5 — secondary legislation must say what power made it.
    if (tier === "secondary" && !str(item.enablingPower)) {
      issues.push(issue(LEGISLATION, item, "L5", "error",
        `"${item.slug}" is secondary legislation but records no enablingPower.`));
    }

    // L6 — contradictory lifecycle and commencement.
    const notYet = arr(item.notYetInForce);
    if (force === "partially-in-force" && notYet.length === 0) {
      issues.push(issue(LEGISLATION, item, "L6", "error",
        `"${item.slug}" is partially in force but lists no provisions in notYetInForce — a page must not imply every provision is operative.`));
    }
    if (force === "not-yet-in-force" && arr(item.commencement).length > 0) {
      issues.push(issue(LEGISLATION, item, "L6", "error",
        `"${item.slug}" is not yet in force but records commencement events.`));
    }
    if (
      force === "partially-repealed" &&
      !toDateOnly(item.repealedDate) &&
      !str(item.statusNote)
    ) {
      issues.push(issue(LEGISLATION, item, "L6", "error",
        `"${item.slug}" is partially repealed but records neither a repealedDate nor a statusNote explaining what was repealed and what survives.`));
    }

    // L7 — extent and application differing must be explained.
    const differs =
      extent.length !== application.length ||
      extent.some((e) => !application.includes(e));
    if (differs && !str(item.extentNote)) {
      issues.push(issue(LEGISLATION, item, "L7", "error",
        `"${item.slug}" has extent [${extent.join(", ")}] and application [${application.join(", ")}], which differ, but records no extentNote. A reader in a jurisdiction the instrument extends to but does not apply in needs that said.`));
    }

    // L8 — a devolved legislature cannot make law for another jurisdiction.
    const permitted = form ? FORM_PERMITTED_EXTENTS[form] : undefined;
    if (permitted) {
      for (const e of extent) {
        if (!permitted.includes(e)) {
          issues.push(issue(LEGISLATION, item, "L8", "error",
            `"${item.slug}" is a ${form} with extent "${e}" — that form may only extend to ${permitted.join(", ")}.`));
        }
      }
    }

    // L11 — a terminated instrument should say what took its place, or why not.
    if (
      (force === "repealed" || force === "revoked") &&
      arr(item.supersededBy).length === 0 &&
      !str(item.statusNote)
    ) {
      issues.push(issue(LEGISLATION, item, "L11", "warning",
        `"${item.slug}" is ${force} but names no successor and carries no statusNote.`));
    }
  }

  return issues;
}

/** L9, L10, L12, L13 — source currency, outstanding effects, official source. */
export function checkLegislationSource(
  collections: Collections,
  options: EditorialOptions = {}
): ValidationIssue[] {
  const now = options.now ?? today();
  const cycle = reviewCycleMonths(LEGISLATION);
  const issues: ValidationIssue[] = [];

  for (const item of eachLegislation(collections)) {
    // L9 — the as-at date is what tells a reader how current the official text
    // is. Required, and it cannot be in the future.
    const asAt = toDateOnly(item.sourceTextAsAtDate);
    if (!asAt) {
      issues.push(issue(LEGISLATION, item, "L9", "error",
        `"${item.slug}" records no sourceTextAsAtDate — without it a reader cannot tell how current the official text is.`));
    } else if (asAt > now) {
      issues.push(issue(LEGISLATION, item, "L9", "error",
        `"${item.slug}" has sourceTextAsAtDate ${asAt}, which is in the future.`));
    }

    // L10 — warns on OUR confirmation going stale, not on the source's own
    // as-at date being old.
    //
    // Those are different things and only one of them is actionable. The Fire
    // Safety (England) Regulations 2022 are the live case: legislation.gov.uk
    // itself states its revised text is current only to 13 April 2026. No
    // amount of re-checking on our part moves that date — it is a fact about
    // the source, and the only way to "clear" a warning based on it would be
    // to write a date the source never claimed.
    //
    // A rule whose only remedy is falsifying the answer is a rule that gets
    // switched off, which is the same lesson G5 taught in PR 5. So the warning
    // tracks what we control, and the gap between the two dates is surfaced to
    // the reader on the page instead.
    const confirmed = toDateOnly(item.sourceCurrencyConfirmedDate);
    if (cycle !== null && confirmed && addMonths(confirmed, cycle) < now) {
      issues.push(issue(LEGISLATION, item, "L10", "warning",
        `"${item.slug}" was last confirmed against the official source on ${confirmed}, beyond the ${cycle}-month currency window.`));
    }

    // L13 — there is exactly one official source for UK legislation.
    const url = str(item.officialSourceUrl);
    if (url && !hostMatches(url, [LEGISLATION_OFFICIAL_HOST])) {
      issues.push(issue(LEGISLATION, item, "L13", "error",
        `"${item.slug}" has officialSourceUrl "${url}", which is not on ${LEGISLATION_OFFICIAL_HOST}.`));
    }

    // L12 — a structured warning nobody reads is not a warning.
    const effects = arr(item.outstandingEffects) as { effect?: unknown }[];
    if (effects.length > 0) {
      const body = typeof item.body === "string" ? item.body : "";
      if (!/outstanding|not yet (been )?(applied|incorporat)|unapplied/i.test(body)) {
        issues.push(issue(LEGISLATION, item, "L12", "warning",
          `"${item.slug}" records ${effects.length} outstanding effect(s) but the body does not mention them — the reader should meet the caveat in prose as well as in the banner.`));
      }
    }
  }

  return issues;
}

/** L14 — Guides and Standards left pointing at legislation that no longer stands. */
export function checkLegislationReferenceCurrency(
  collections: Collections
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const STALE = new Set(["repealed", "revoked", "not-yet-in-force"]);
  const forceBySlug = new Map(
    (collections[LEGISLATION] ?? []).map((i) => [i.slug, str(i.forceStatus)])
  );

  for (const { collection, item } of eachItem(collections)) {
    if (collection === LEGISLATION) continue;
    if (str(item.status) !== "published") continue;
    const acknowledged = new Set(arr(item.acknowledgedNonCurrentDocuments) as string[]);
    for (const ref of arr(item.relatedLegislation) as string[]) {
      const force = forceBySlug.get(ref);
      if (force && STALE.has(force) && !acknowledged.has(ref)) {
        issues.push(issue(collection, item, "L14", "warning",
          `published "${item.slug}" references "${ref}" via relatedLegislation, and that instrument is ${force} — check the page still describes the position accurately, then list the slug in acknowledgedNonCurrentDocuments to record that it was reviewed.`));
      }
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
    ...checkCategoryApplicability(collections),
    ...checkPeopleReferences(collections),
    ...checkEditorialHeuristics(collections),
    ...checkAccessibility(collections),
    ...checkGovernance(collections, options),
    ...checkDocumentLifecycle(collections, options),
    ...checkReferencedDocumentCurrency(collections),
    ...checkDocumentProvenance(collections),
    ...checkDocumentPublicationGate(collections, options),
    ...checkLegislationRelations(collections, options),
    ...checkLegislationCoherence(collections),
    ...checkLegislationSource(collections, options),
    ...checkLegislationReferenceCurrency(collections),
  ];
}
