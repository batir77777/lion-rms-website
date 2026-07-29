// Per-collection Velite schemas for the Knowledge Centre content platform
// (Phase 5A, PR 1).
//
// These use Velite's own schema builder `s` (a bundled, Velite-internal
// Zod build with content-authoring extensions — `s.slug()`, `s.mdx()`,
// `s.isodate()`, etc.) rather than the project's standalone `zod` install.
// This is a deliberate, minimal choice, not an oversight: `s` is required
// for anything passed to `defineCollection()` because Velite's own
// machinery (slug uniqueness tracking, MDX compilation, image/file asset
// handling) is wired into its schema instances. The standalone `zod`
// dependency is used instead for the plain TypeScript registries
// (lib/taxonomy.ts, lib/people.ts) that never go through Velite's content
// pipeline at all. No unifying abstraction has been built over the two —
// see the PR description for the full rationale.
//
// Reserved-slug checking is deliberately NOT implemented as a `.refine()`
// chained onto `s.slug()` — that field's internal uniqueness cache is only
// initialised inside a real Velite build, so composing further validation
// directly onto it is fragile and hard to unit-test in isolation. Reserved
// words, cross-collection relation existence, and duplicate `id` detection
// are all checked separately in lib/content-validation.ts, operating on
// Velite's already-parsed output — simpler, and independently testable
// without any dependency on Velite's internal build context.

import { s } from "velite";
import { CONTENT_CATEGORY_SLUGS, CONTENT_TAG_SLUGS, AUDIENCE_SLUGS } from "./taxonomy";
import { AUTHOR_IDS, REVIEWER_IDS } from "./people";

// ---------------------------------------------------------------------------
// Shared base fields (mirrors `ContentBase` in the Phase 5A architecture
// plan, Section 5.1). Every content-type schema below spreads this object.
// ---------------------------------------------------------------------------

export const baseFields = {
  // Stable internal identifier, independent of slug — a rare future slug
  // rename should never orphan a relation or a future retrieval index.
  id: s.string().min(1),

  title: s.string().min(1),

  // Fixed at 1 for every item created under this schema generation. Not
  // load-bearing today; becomes valuable the day the schema shape changes
  // and migration tooling needs to tell old and new content apart.
  schemaVersion: s.literal(1),

  summary: s.string().min(1),

  status: s.enum(["draft", "in-review", "published", "archived", "superseded"]),

  authorId: s.enum(AUTHOR_IDS),
  reviewerId: s.enum(REVIEWER_IDS).optional(),
  complianceReviewerId: s.enum(REVIEWER_IDS).optional(),

  publishedDate: s.isodate().optional(),
  updatedDate: s.isodate().optional(),
  reviewedDate: s.isodate().optional(),
  nextReviewDue: s.isodate().optional(),

  category: s.enum(CONTENT_CATEGORY_SLUGS),
  // Constrained to the taxonomy registry (Phase 5A PR 2). Previously this was
  // a free-string array, so any typo silently created a new tag — the exact
  // sprawl that makes tag pages worthless at scale. Adding a genuinely new tag
  // is now a deliberate edit to lib/taxonomy.ts, which is the intent.
  tags: s.array(s.enum(CONTENT_TAG_SLUGS)).default([]),
  audience: s.array(s.enum(AUDIENCE_SLUGS)).default([]),

  relatedServices: s.array(s.string()).default([]),
  relatedSectors: s.array(s.string()).default([]),
  relatedCaseStudies: s.array(s.string()).default([]),
  relatedArticles: s.array(s.string()).default([]),
  relatedStandards: s.array(s.string()).default([]),
  relatedLegislation: s.array(s.string()).default([]),
  relatedGlossaryTerms: s.array(s.string()).default([]),
  relatedDownloads: s.array(s.string()).default([]),

  /**
   * Slugs of non-current standards or legislation this item references
   * DELIBERATELY, having been checked (Phase 5A, PR 5).
   *
   * Rule G5 warns when published content points at a withdrawn or superseded
   * document, because that is usually a page that has quietly gone out of
   * date. But sometimes it is the whole point — a guide explaining that PAS
   * 79-2 was withdrawn has to link to PAS 79-2.
   *
   * Without this field the only way to clear the warning would be to delete
   * the useful link, and a rule whose only remedy is to remove the right
   * answer is a rule that eventually gets switched off. Listing a slug here
   * records that the reference was reviewed and is intended.
   *
   * It cannot become a blanket silencer: rule G17 warns when an entry names a
   * document that is actually current, or one this item does not reference, so
   * a stale acknowledgement surfaces rather than sitting there indefinitely.
   */
  acknowledgedNonCurrentDocuments: s.array(s.string()).default([]),

  featuredImageSrc: s.string().optional(),
  featuredImageAlt: s.string().optional(),

  seoTitle: s.string().optional(),
  seoDescription: s.string().optional(),
  canonicalUrl: s.string().optional(),
  noindex: s.boolean().default(false),

  featured: s.boolean().default(false),

  changelog: s
    .array(s.object({ date: s.isodate(), summary: s.string().min(1) }))
    .default([]),

  aiRetrievalEligible: s.boolean().default(true),
  aiRetrievalExcludeReason: s.string().optional(),
};

// ---------------------------------------------------------------------------
// Article (/guides)
// ---------------------------------------------------------------------------

export const articleSchema = s.object({
  ...baseFields,
  contentType: s.literal("guide"),
  slug: s.slug("guides"),
  body: s.mdx(),
  clusterId: s.string().optional(),
  isPillar: s.boolean().default(false),
  // "High-risk legal or technical guidance" (owner-approved review-cycle
  // amendment) is a risk tier within Guides, not a separate content type —
  // it shortens nextReviewDue to 6 months instead of the standard 12.
  riskTier: s.enum(["standard", "high-risk"]).default("standard"),
  schemaType: s.enum(["Article", "TechArticle"]),
});

// ---------------------------------------------------------------------------
// NewsArticle (/news)
// ---------------------------------------------------------------------------

export const newsArticleSchema = s.object({
  ...baseFields,
  contentType: s.literal("news"),
  slug: s.slug("news"),
  body: s.mdx(),
  sourceType: s.enum([
    "monthly-roundup",
    "hse-update",
    "consultation",
    "enforcement-case",
    "prosecution",
    "product-recall",
    "standards-revision",
  ]),
  sourceUrl: s.string().min(1),
  effectiveDate: s.isodate().optional(),
  // Monthly round-ups are immutable historical records once published
  // (owner-approved decision) — enforced editorially, this field just
  // records the fact for anyone building tooling against it later.
  immutable: s.boolean().default(false),
  schemaType: s.literal("NewsArticle"),
});

// ---------------------------------------------------------------------------
// Shared document-reference fields (Phase 5A, PR 5).
//
// StandardGuidancePage and LegislationPage are genuinely different content
// types — edition tracking has no meaning for an Act, and jurisdiction and
// in-force dates have none for a BSI standard — but they share one thing
// exactly: both describe an EXTERNAL document that this site does not own,
// that changes without warning, and whose currency the reader is relying on.
//
// These fields are that shared part. Keeping them in one object rather than
// duplicated in two schemas is what lets the G-series validation rules in
// lib/editorial-validation.ts be written once, against "any collection whose
// items carry documentStatus", and fire for Legislation in PR 6 with no rule
// changes at all.
// ---------------------------------------------------------------------------

export const documentReferenceFields = {
  /**
   * Real-world state of the EXTERNAL document.
   *
   * Deliberately orthogonal to `status`, which is the publication state of
   * OUR page. A published page about a withdrawn standard — `status:
   * "published"` with `documentStatus: "withdrawn"` — is a normal and useful
   * combination, not a contradiction: readers arrive from old assessments
   * citing withdrawn documents and need to be told the document no longer
   * stands. Conflating the two fields is the obvious failure mode here, so
   * tests assert that combination renders and stays in the sitemap.
   *
   * `withdrawn` and `superseded` are NOT mutually exclusive. PAS 79-2:2020
   * was withdrawn AND later replaced by BS 9792:2025; the honest encoding is
   * `documentStatus: "withdrawn"` with a populated `supersededBy`.
   *
   * No `.default()`. An unstated status would silently read as "current",
   * which is the one wrong answer that looks right — the whole point of rule
   * G13 is that a published page must have had its status actively confirmed.
   */
  documentStatus: s.enum([
    "current",
    "under-review",
    "proposed-for-withdrawal",
    "superseded",
    "withdrawn",
  ]),

  /**
   * Successor documents, by slug, within the SAME collection.
   *
   * An array, not a string, because supersession is genuinely one-to-many:
   * PAS 79:2012 was replaced by two documents, PAS 79-1:2020 and PAS 79-2:2020.
   *
   * The inverse ("supersedes") is never authored — it is derived by inversion
   * in lib/supersession.ts, so the chain is declared once and cannot disagree
   * with itself. Validated as a self-referencing relation in
   * lib/content-validation.ts, which is what stops a dangling successor slug
   * passing silently.
   */
  supersededBy: s.array(s.string()).default([]),

  /** Date of withdrawal where one is published. Optional: not always stated. */
  withdrawnDate: s.isodate().optional(),

  /**
   * Copyright regime of the SOURCE document — not of this page.
   *
   * Defaults to the most restrictive assumption, so an omission can never
   * widen what is permitted. BSI standards are commercially licensed and BSI
   * grants no commercial reproduction licence; Crown material under the Open
   * Government Licence may be reproduced with attribution. Because the two
   * regimes sit side by side in one collection, this cannot be a constant.
   *
   * Drives rule G8 (notice must match the regime) and rule G11 (long verbatim
   * quotation from a commercially-licensed source is flagged for review),
   * which together make the copyright policy machine-checkable rather than a
   * matter of editorial discipline alone.
   */
  sourceLicence: s
    .enum(["commercial", "open-government-licence", "crown-copyright", "other"])
    .default("commercial"),

  // -------------------------------------------------------------------------
  // Verification record (owner-required, Phase 5A PR 5).
  //
  // Every field below is optional in the schema and REQUIRED AT PUBLICATION by
  // rule G13. That split is deliberate: a half-verified draft must be able to
  // exist on disk while it is being written, but must not be publishable. The
  // rule is the gate, not the schema.
  //
  // `lastCheckedDate` (below) records that the source was looked at.
  // These three record what was actually confirmed when it was, because
  // "I opened the BSI page" and "I confirmed this edition is still current"
  // are different claims and only the second one makes the page trustworthy.
  // -------------------------------------------------------------------------

  /** When `documentStatus` was last confirmed against the publisher. */
  statusConfirmedDate: s.isodate().optional(),
  /** When `currentEdition` / `officialReference` was last confirmed. */
  editionConfirmedDate: s.isodate().optional(),
  /** When `sourceLicence` and `copyrightNotice` were last confirmed. */
  licenceConfirmedDate: s.isodate().optional(),
  /** Who carried out the verification. */
  verifiedBy: s.enum(REVIEWER_IDS).optional(),
};

// ---------------------------------------------------------------------------
// StandardGuidancePage (/standards) — separate URL namespace, content model
// and template from LegislationPage, per the owner-approved amendment.
// ---------------------------------------------------------------------------

export const standardGuidancePageSchema = s.object({
  ...baseFields,
  ...documentReferenceFields,
  contentType: s.literal("standard"),
  slug: s.slug("standards"),
  documentClass: s.enum([
    "british-standard",
    "pas",
    "statutory-guidance",
    "regulator-guidance",
    "industry-guidance",
  ]),
  officialReference: s.string().min(1),
  publisher: s.string().min(1),
  currentEdition: s.string().optional(),
  amendments: s
    .array(s.object({ reference: s.string().min(1), date: s.isodate(), summary: s.string().min(1) }))
    .default([]),
  /**
   * An open revision project at the publisher, where one exists.
   *
   * Deliberately NOT expressed as `documentStatus: "under-review"`. That value
   * is reserved for the publisher's own formal status label; a revision
   * project sitting at pre-draft stage, with nothing agreed, is a different
   * and weaker claim. BS 9999:2017 is the live case — BSI lists it as current
   * while a BS 9999:202x project is open — and overstating that as "under
   * review" on a page practitioners rely on would be inaccurate.
   */
  revisionInProgress: s.boolean().default(false),
  revisionNote: s.string().optional(),
  lastCheckedDate: s.isodate(),
  officialSourceUrl: s.string().min(1),
  copyrightNotice: s.string().min(1),
  body: s.mdx(),
  disclaimer: s.string().min(1),
  schemaType: s.enum(["Article", "TechArticle"]),
});

// ---------------------------------------------------------------------------
// LegislationPage (/legislation) — genuinely separate from Standards: Crown
// copyright/OGL treatment, jurisdiction, in-force dates have no equivalent
// in commercially-copyrighted BSI standards, and vice versa for edition
// tracking.
// ---------------------------------------------------------------------------

export const legislationPageSchema = s.object({
  ...baseFields,
  // Phase 5A PR 5: the shared external-document fields — status, supersession,
  // licence and the verification record — now come from one place, so the
  // G-series rules built for Standards apply to Legislation in PR 6 without a
  // single rule change. The collection is empty, so this costs nothing today.
  ...documentReferenceFields,
  contentType: s.literal("legislation"),
  slug: s.slug("legislation"),
  documentClass: s.enum(["act", "regulation", "statutory-instrument", "order"]),
  officialReference: s.string().min(1),
  // Added in Phase 5A PR 5 so the publication gate (rule G13) can be uniform
  // across both document-reference collections. A reference page that does not
  // say who published the document is incomplete whichever collection it sits
  // in — for UK legislation this is typically The National Archives on behalf
  // of the Crown, which is not something a reader should have to infer.
  publisher: s.string().min(1),
  jurisdiction: s.enum(["england", "wales", "england-and-wales", "scotland", "northern-ireland", "uk-wide"]),
  inForceDate: s.isodate().optional(),
  amendments: s
    .array(s.object({ reference: s.string().min(1), date: s.isodate(), summary: s.string().min(1) }))
    .default([]),
  lastCheckedDate: s.isodate(),
  officialSourceUrl: s.string().min(1),
  copyrightNotice: s.string().min(1),
  body: s.mdx(),
  disclaimer: s.string().min(1),
  schemaType: s.enum(["Article", "TechArticle"]),
});

// ---------------------------------------------------------------------------
// GlossaryTerm (/glossary)
// ---------------------------------------------------------------------------

export const glossaryTermSchema = s.object({
  ...baseFields,
  contentType: s.literal("glossary-term"),
  slug: s.slug("glossary"),
  term: s.string().min(1),
  preferredTerm: s.string().optional(),
  synonyms: s.array(s.string()).default([]),
  abbreviationFor: s.string().optional(),
  shortDefinition: s.string().min(1),
  // Phase 5A PR 4: was `s.mdx().optional()`, which could never be populated.
  // Velite's s.mdx() reads the document body from build context rather than
  // from a frontmatter key, but zod's .optional() short-circuits on an absent
  // input and returns undefined without ever running the inner transform — so
  // the field silently resolved to undefined for every term regardless of what
  // the file contained. Made required so the body is actually compiled; a term
  // with nothing more to say can still carry a short body, and shortDefinition
  // remains the field that must always stand alone.
  extendedDefinition: s.mdx(),
  relatedTerms: s.array(s.string()).default([]),
  jurisdiction: s
    .enum(["england", "wales", "england-and-wales", "scotland", "northern-ireland", "uk-wide"])
    .optional(),
  schemaType: s.literal("DefinedTerm"),
});

// ---------------------------------------------------------------------------
// DownloadResource (/downloads)
// ---------------------------------------------------------------------------

export const downloadResourceSchema = s.object({
  ...baseFields,
  contentType: s.literal("download"),
  slug: s.slug("downloads"),
  resourceType: s.enum(["checklist", "template", "inspection-form", "logbook", "guidance-document"]),
  fileFormat: s.enum(["pdf", "docx", "xlsx"]),
  fileUrl: s.string().min(1),
  version: s.string().min(1),
  previousVersions: s
    .array(s.object({ version: s.string().min(1), fileUrl: s.string().min(1), supersededDate: s.isodate() }))
    .default([]),
  gated: s.boolean().default(false),
  generationMethod: s.enum(["generated-from-template", "uploaded-document"]),
  body: s.mdx(),
});
