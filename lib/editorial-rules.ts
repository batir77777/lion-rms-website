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

// Standards are excluded (Phase 5A PR 5), on the same principle and for a
// reason established by evidence rather than by analogy. A standard's
// navigation axes are its designation and its document class, both of which
// are mandatory and enum-constrained, plus the relations that connect it to
// the Guides and terms that use it. Tags add description but carry no
// discovery weight.
//
// The decisive evidence is the launch set itself: four of the eight — PAS 79-1,
// PAS 79-2, BS 9792 and HSG65 — have no honest match in the tag registry,
// because they are about the assessment process or about management systems
// rather than about fire doors or alarm panels. Satisfying C3 would mean
// inventing a `fire-risk-assessment` tag that duplicates an existing category
// AND an existing technical-domain slug, and that would then compete in search
// with the very standard pages it was invented to classify.
//
// That is the same conclusion reached in PR 3, where PAS 79, RRO 2005, the
// Building Safety Act and Responsible Person were deliberately NOT made tags,
// precisely to avoid competing with the future /standards and /legislation
// pages. Excluding Standards here is the consistent application of a decision
// already on the record, not a new exception.
//
// Tags remain available and are used where honest: BS 5839-1 carries
// `fire-alarm-systems`, BS 9999 and BS 9991 carry `means-of-escape` and
// `compartmentation`. They simply stop being mandatory.
//
// Legislation is excluded too (Phase 5A PR 6), on the evidence PR 5 said would
// decide it. Of the eight launch instruments only the Fire Safety (England)
// Regulations 2022 and the 2025 Evacuation Plans Regulations map cleanly onto
// existing tags. The Fire Safety Order, the Fire Safety Act, the Building
// Safety Act, HSWA, MHSWR and the Fire (Scotland) Act have no honest match —
// they are general duty regimes, not technical topics. Legislation navigates by
// jurisdiction, tier and citation, all mandatory and enum-constrained.
export const TAGS_EXPECTED_COLLECTIONS: readonly string[] = [
  "news",
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
// External-document reference thresholds (Phase 5A, PR 5).
//
// These govern the Standards library and, from PR 6, Legislation. They are
// gathered here rather than inline in the rules for the same reason as
// everything above: a policy change should be a one-line edit in this file.
// ---------------------------------------------------------------------------

/**
 * Collections whose items describe an EXTERNAL document — one this site does
 * not own, that changes without warning, and whose currency a reader is
 * relying on. The G-series rules iterate this list rather than naming
 * "standards", so PR 6 enables every rule for Legislation by adding one entry.
 */
export const DOCUMENT_REFERENCE_COLLECTIONS: readonly string[] = [
  "standards",
  "legislation",
];

export function isDocumentReferenceCollection(collection: string): boolean {
  return DOCUMENT_REFERENCE_COLLECTIONS.includes(collection);
}

/**
 * Collections whose items carry `documentStatus` — the BSI lifecycle field
 * (Phase 5A, PR 6).
 *
 * Rules G1, G9, G10, G12 and G16 were written in PR 5 against every
 * document-reference collection, on the expectation that Legislation would use
 * the same lifecycle vocabulary. It does not: legislation is repealed or
 * revoked rather than withdrawn, can be partially in force or partially
 * repealed, and has no notion of a publisher "review". Legislation uses
 * `forceStatus` and the L-series rules instead.
 *
 * Scoping those five rules here rather than deleting them keeps Standards
 * behaviour byte-identical while letting Legislation have a model that fits.
 */
export const DOCUMENT_STATUS_COLLECTIONS: readonly string[] = ["standards"];

export function usesDocumentStatus(collection: string): boolean {
  return DOCUMENT_STATUS_COLLECTIONS.includes(collection);
}

/**
 * Per-collection required-field lists for the publication gate (rule G13).
 *
 * Was a single hardcoded list in PR 5. Legislation requires a different set —
 * `forceStatus` rather than `documentStatus`, plus extent, application, source
 * currency and the outstanding-effects check — so the gate takes the list from
 * here.
 *
 * The Standards entry is deliberately identical to PR 5's hardcoded list, and
 * tests/schema-migration.test.mjs pins that, so the most important rule in the
 * codebase cannot be quietly weakened by a refactor.
 */
export const PUBLICATION_GATE_FIELDS: Record<string, readonly string[]> = {
  standards: [
    "documentStatus",
    "statusConfirmedDate",
    "editionConfirmedDate",
    "lastCheckedDate",
    "licenceConfirmedDate",
    "verifiedBy",
    "officialReference",
    "publisher",
    "officialSourceUrl",
  ],
  legislation: [
    "forceStatus",
    "statusConfirmedDate",
    "extent",
    "application",
    "sourceTextAsAtDate",
    "outstandingEffectsChecked",
    "lastCheckedDate",
    "licenceConfirmedDate",
    "verifiedBy",
    "officialReference",
    "publisher",
    "officialSourceUrl",
  ],
};

/** Document classes for which an edition year is meaningful and required. */
export const EDITION_REQUIRED_CLASSES: readonly string[] = [
  "british-standard",
  "pas",
];

/**
 * Recognised official-source hosts per document class.
 *
 * The point is to catch a link to a reseller, an aggregator or somebody's blog
 * where the publisher's own page belongs. A reader following "official source"
 * from a compliance reference must land on the publisher, not on a shop.
 *
 * Matched on the registrable-domain suffix, so subdomains such as
 * knowledge.bsigroup.com and assets.publishing.service.gov.uk both pass.
 */
export const OFFICIAL_SOURCE_HOSTS: Record<string, readonly string[]> = {
  "british-standard": ["bsigroup.com"],
  pas: ["bsigroup.com"],
  "statutory-guidance": ["gov.uk", "legislation.gov.uk"],
  "regulator-guidance": ["gov.uk", "hse.gov.uk", "legislation.gov.uk"],
  // Industry guidance has no single publisher — trade bodies, fire and rescue
  // services and professional institutions all publish it — so there is
  // nothing honest to check against and the rule deliberately skips it.
  "industry-guidance": [],
  act: ["legislation.gov.uk"],
  regulation: ["legislation.gov.uk"],
  "statutory-instrument": ["legislation.gov.uk"],
  order: ["legislation.gov.uk"],
};

/**
 * Wording that must appear in the copyright notice for each licence regime.
 * Checked case-insensitively by rule G8 — a page claiming Open Government
 * Licence terms over commercially licensed BSI material, or the reverse, is a
 * substantive error rather than a typo.
 */
export const LICENCE_NOTICE_MARKERS: Record<string, readonly string[]> = {
  "open-government-licence": ["open government licence"],
  "crown-copyright": ["crown copyright"],
  // Commercial and "other" carry no required phrase: there is no single form
  // of words, and inventing one would produce false positives.
  commercial: [],
  other: [],
};

/** Below this, a copyright notice or disclaimer is almost certainly a placeholder. */
export const NOTICE_MIN_LENGTH = 40;

/**
 * Longest verbatim block quotation tolerated from a commercially licensed
 * source before rule G11 asks for a human look. Not a legal threshold — no
 * such number exists — but a tripwire: past this length the question "is this
 * still fair dealing" needs answering by a person rather than assumed.
 */
export const COMMERCIAL_QUOTE_MAX_CHARS = 300;

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

// ---------------------------------------------------------------------------
// Legislation-specific constants (Phase 5A, PR 6).
// ---------------------------------------------------------------------------

/**
 * The one official source for UK legislation.
 *
 * Rule L13 makes this an ERROR rather than G7's warning: on a page about legal
 * duties there is exactly one authoritative source, so a link to anywhere else
 * is a defect rather than an observation.
 */
export const LEGISLATION_OFFICIAL_HOST = "legislation.gov.uk";

/**
 * Territorial extents each instrument form may legitimately have.
 *
 * A devolved legislature cannot make law for another jurisdiction, so an Act of
 * the Scottish Parliament extending to England, or a Northern Ireland Statutory
 * Rule extending outside Northern Ireland, is a data error rather than an
 * unusual case. Forms absent from this map — UK Public General Acts and UK
 * statutory instruments — are unconstrained, because their extent genuinely
 * varies and is set provision by provision.
 */
export const FORM_PERMITTED_EXTENTS: Record<string, readonly string[]> = {
  "act-of-the-scottish-parliament": ["scotland"],
  "scottish-statutory-instrument": ["scotland"],
  "act-of-senedd-cymru": ["wales"],
  "welsh-statutory-instrument": ["wales"],
  "northern-ireland-order-in-council": ["northern-ireland"],
  "northern-ireland-statutory-rule": ["northern-ireland"],
};

/**
 * Which legislative tier each terminating `forceStatus` value belongs to.
 *
 * Acts are REPEALED; statutory instruments are REVOKED. The distinction is a
 * drafting convention rather than a difference in legal effect, but a reference
 * library that mixes them reads as though written by someone who does not work
 * with legislation. Rule L4 enforces the pairing in both directions.
 */
export const TERMINATION_STATUS_TIER: Record<string, "primary" | "secondary"> = {
  repealed: "primary",
  revoked: "secondary",
};

// ---------------------------------------------------------------------------
// News constants (Phase 5A, PR 7).
// ---------------------------------------------------------------------------

/**
 * Which of the three event-side dates each news category must carry, and which
 * it may optionally carry.
 *
 * The three dates are not interchangeable — an enforcement case has an event
 * date and no effective date; a commencement regulation has an effective date
 * and often a separate announcement date; a consultation has an opening and a
 * closing date and neither is an "effective" date at all. Requiring all three
 * everywhere would force authors to invent facts; requiring none would let a
 * consultation publish without the one date a reader must not miss.
 *
 * Monthly round-ups are absent from this map deliberately: a round-up covers a
 * period, and forcing a single event date onto it would be a false claim. The
 * period comes from publishedDate and the title.
 */
export const NEWS_CATEGORY_DATES: Record<
  string,
  { required: readonly string[]; optional: readonly string[] }
> = {
  enforcement: { required: ["eventDate"], optional: [] },
  prosecution: { required: ["eventDate"], optional: [] },
  consultation: {
    required: ["consultationClosesDate"],
    optional: ["eventDate"],
  },
  "standards-update": { required: ["effectiveDate"], optional: ["eventDate"] },
  "product-recall": { required: ["eventDate"], optional: [] },
  "government-guidance": { required: ["eventDate"], optional: ["effectiveDate"] },
  "regulatory-change": { required: ["effectiveDate"], optional: ["eventDate"] },
};

/** Every event-side date field, for the "not applicable to this category" check. */
export const NEWS_DATE_FIELDS: readonly string[] = [
  "eventDate",
  "effectiveDate",
  "consultationClosesDate",
];

/**
 * Fields a published news item must carry, whatever its category.
 *
 * `sourceCheckedDate` is here rather than in a staleness rule on purpose. News
 * carries no routine review cycle (REVIEW_CYCLE_MONTHS.news is null), and that
 * is correct: a dated report of a past prosecution does not go stale the way a
 * live standard does. What matters is that somebody looked at the primary
 * source and recorded when — so the date is required at publication and
 * checked for being in the future, but never for age.
 */
export const NEWS_PUBLICATION_GATE_FIELDS: readonly string[] = [
  "newsFormat",
  "newsCategory",
  "sourceUrl",
  "sourceOrganisation",
  "sourceCheckedDate",
];

// ---------------------------------------------------------------------------
// Downloads constants (Phase 5A, PR 8A).
//
// The rule prefix is R, not D. D1-D7 were taken in PR 2 by the editorial
// heuristics that apply to EVERY collection (title and description length,
// duplicate titles, canonical shape, noindex), and reusing the letter would
// make "which D3 failed?" an ambiguous question in audit output.
// ---------------------------------------------------------------------------

/**
 * Which delivery formats make sense for each kind of resource.
 *
 * This is a deliberate narrowing, not a taxonomy. A logbook delivered as a bare
 * DOCX is a worse artefact than a laid-out PDF, and a record form delivered
 * only as HTML cannot do the job it exists for — being filled in on paper,
 * repeatedly, and kept. Where a format is genuinely useful as a COMPANION it
 * belongs in `additionalFormats`, which this map also governs.
 */
export const RESOURCE_TYPE_FORMATS: Record<string, readonly string[]> = {
  checklist: ["pdf", "html", "docx"],
  template: ["pdf", "docx", "html"],
  "inspection-form": ["pdf", "docx"],
  "record-form": ["pdf", "xlsx", "docx"],
  logbook: ["pdf", "xlsx"],
  "guidance-document": ["pdf", "html"],
};

/** Maps a declared format to the file extension it must actually have. */
export const FORMAT_EXTENSIONS: Record<string, string> = {
  pdf: ".pdf",
  docx: ".docx",
  xlsx: ".xlsx",
};

/**
 * Hard ceiling, in bytes. An error, not a warning.
 *
 * A resource above this is not merely large: on a phone, on site, on a poor
 * connection — which is exactly where a fire door checklist gets opened — it is
 * effectively undeliverable. 15 MB is generous for a text-and-tables document
 * and small enough that exceeding it means something has gone wrong, usually an
 * unoptimised image.
 */
export const DOWNLOAD_MAX_BYTES = 15 * 1024 * 1024;

/** Above this, worth a look; below the ceiling, never blocking. */
export const DOWNLOAD_WARN_BYTES = 10 * 1024 * 1024;

/** Accessibility states a published resource may hold. */
export const PUBLISHABLE_ACCESSIBILITY_STATUSES: readonly string[] = [
  "html-native",
  "checked-accessible",
  "checked-limitations",
];

/**
 * Phrases that satisfy the mandatory adaptation statement (rule R15).
 *
 * Every resource in this library is a general template, and the single most
 * likely way it causes harm is being treated as premises-specific professional
 * advice — a completed checklist mistaken for a suitable and sufficient fire
 * risk assessment. That framing is not left to authorial memory: R15 fails the
 * build without it.
 *
 * Matching is on any ONE of these, so the wording can suit the document rather
 * than being boilerplate stamped identically onto seven pages.
 */
export const ADAPTATION_STATEMENT_PATTERNS: readonly RegExp[] = [
  /general template/i,
  /adapt(ed|ation)?\s+(it\s+)?to\s+(your|the|their)\s+(own\s+)?premises/i,
  /does not replace/i,
  /is not a substitute for/i,
];
