// Editorial governance thresholds and date helpers for the Knowledge Centre
// content platform (Phase 5A, PR 2).
//
// Single source of truth for every editorial threshold in the platform. The
// check functions in lib/editorial-validation.ts read from here rather than
// hard-coding numbers, so a policy change is a one-line edit in this file and
// never a hunt through validation logic.
//
// Everything here is deliberately free of Velite imports: these are plain
// values and pure functions over date-only strings, so they can be unit tested
// directly without a content build.

/**
 * Issue severity.
 *
 * "error"   — a structural or governance defect. Fails `npm run content:build`
 *             and therefore fails the production build.
 * "warning" — an editorial observation. Reported but never fails a normal
 *             build. Escalated to a failure only under `npm run content:audit`.
 *
 * The split exists so that the passage of time can never break a deployment:
 * a review date falling due is a warning, because otherwise an unrelated
 * urgent fix could be blocked months later by content simply ageing.
 */
export type Severity = "error" | "warning";

// ---------------------------------------------------------------------------
// Review cycles — the owner-approved table.
//
// Values are maximum permitted months between `reviewedDate` and
// `nextReviewDue`. A SHORTER interval is always valid: event-triggered review
// overrides the calendar cycle, so bringing a review forward must never be
// reported as a defect.
//
// News carries `null`: monthly round-ups are dated historical records and have
// no routine review cycle.
// ---------------------------------------------------------------------------

export const REVIEW_CYCLE_MONTHS: Record<string, number | null> = {
  guides: 12,
  news: null,
  standards: 6,
  legislation: 3,
  glossaryTerms: 12,
  downloads: 12,
};

/** High-risk legal or technical guidance shortens the Guides cycle to 6 months. */
export const HIGH_RISK_GUIDE_CYCLE_MONTHS = 6;

// ---------------------------------------------------------------------------
// Which collections rule C3 ("published content has no tags") applies to.
//
// C3 exists to catch content that is invisible to tag-driven discovery. That
// only makes sense where tags are the load-bearing cross-cutting axis for a
// collection — so the rule is scoped rather than universal.
//
// Guides are excluded (Phase 5A PR 3). A Guide's taxonomy is carried by
// `category`, which is mandatory and enum-constrained, by `audience`, and by
// the relatedStandards/relatedLegislation relations that point at the documents
// it discusses. Tags there describe supplementary technical subject matter and
// are genuinely optional: several published Guides are legal-duty or
// compliance-overview pieces whose subject matter IS their category.
//
// Glossary is excluded (Phase 5A PR 4) on the same principle. Glossary
// navigation is alphabetical — an A–Z index with jump links — so a tag adds
// description but carries no discovery weight. Four of the twelve launch terms
// (Competent Person, Fire Risk Assessment, Higher-Risk Building, Responsible
// Person) have no honest match in the tag registry, and inventing tags to
// silence a warning would produce exactly the sprawl the PR 2 tag constraint
// was built to prevent.
//
// In both cases an empty tags array is a valid editorial state, not a gap.
// C1 (unknown tag) and C2 (duplicate tag) still apply to both collections, as
// does every other editorial rule. Every remaining collection keeps the
// original behaviour unchanged.
//
// Add a collection here when tags become the primary way readers navigate it.
// ---------------------------------------------------------------------------

export const TAGS_EXPECTED_COLLECTIONS: readonly string[] = [
  "news",
  "standards",
  "legislation",
  "downloads",
];

const TAGS_EXPECTED_SET = new Set(TAGS_EXPECTED_COLLECTIONS);

/**
 * True where an empty `tags` array on published content is worth reporting.
 * False for collections whose discoverability does not rest on tags.
 */
export function tagsExpected(collection: string): boolean {
  return TAGS_EXPECTED_SET.has(collection);
}

/**
 * Resolves the review cycle for a given collection and risk tier.
 * Returns null where the collection has no routine cycle (News).
 */
export function reviewCycleMonths(
  collection: string,
  riskTier?: string
): number | null {
  if (collection === "guides" && riskTier === "high-risk") {
    return HIGH_RISK_GUIDE_CYCLE_MONTHS;
  }
  const cycle = REVIEW_CYCLE_MONTHS[collection];
  return cycle === undefined ? null : cycle;
}

// ---------------------------------------------------------------------------
// Editorial heuristics for titles, descriptions and summaries.
//
// These are HEURISTICS, not published requirements. No search engine
// specifies a character limit — Google truncates on rendered pixel width, not
// character count, and the cut-off moves. These bounds encode "this is likely
// too thin to be useful" and "this is likely to be truncated in a result
// snippet". Every one of them is a warning; a production build is never failed
// because a title is a few characters long or short.
// ---------------------------------------------------------------------------

export const SEO_TITLE_MIN = 30;
export const SEO_TITLE_MAX = 65;

export const SEO_DESCRIPTION_MIN = 120;
export const SEO_DESCRIPTION_MAX = 170;

export const SUMMARY_MIN = 50;
export const SUMMARY_MAX = 300;

// ---------------------------------------------------------------------------
// Date handling.
//
// Every date field in the content schemas is `s.isodate()` — conceptually a
// calendar date, not an instant. All comparison below is therefore done on
// "YYYY-MM-DD" strings, which compare correctly lexicographically and are
// immune to the timezone bug where an item appears a day overdue depending on
// where the build machine happens to be.
// ---------------------------------------------------------------------------

/**
 * Normalises any date-ish value to a "YYYY-MM-DD" string, or undefined if it
 * isn't usable. Velite's isodate may hand back either a date-only string or a
 * full ISO timestamp depending on how the frontmatter was written, so both are
 * accepted rather than assumed.
 */
export function toDateOnly(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length < 10) return undefined;
  const candidate = value.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(candidate) ? candidate : undefined;
}

/**
 * Adds whole months to a date-only string, clamping to the end of the target
 * month. 2026-01-31 plus one month is 2026-02-28, not 2026-03-03.
 */
export function addMonths(dateOnly: string, months: number): string {
  const [y, m, d] = dateOnly.split("-").map(Number);
  const targetMonthIndex = m - 1 + months;
  const targetYear = y + Math.floor(targetMonthIndex / 12);
  const targetMonth = ((targetMonthIndex % 12) + 12) % 12;
  // Day 0 of the following month is the last day of the target month.
  const lastDayOfTargetMonth = new Date(
    Date.UTC(targetYear, targetMonth + 1, 0)
  ).getUTCDate();
  const day = Math.min(d, lastDayOfTargetMonth);
  const dt = new Date(Date.UTC(targetYear, targetMonth, day));
  return dt.toISOString().slice(0, 10);
}

/**
 * Today as a date-only string. Every validation entry point accepts an
 * injected `now` that defaults to this, so tests are deterministic and never
 * rot as fixture dates age past the real clock.
 */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
