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
// StandardGuidancePage (/standards) — separate URL namespace, content model
// and template from LegislationPage, per the owner-approved amendment.
// ---------------------------------------------------------------------------

export const standardGuidancePageSchema = s.object({
  ...baseFields,
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
  documentStatus: s.enum(["current", "withdrawn", "superseded"]).default("current"),
  supersededBy: s.string().optional(),
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
  contentType: s.literal("legislation"),
  slug: s.slug("legislation"),
  documentClass: s.enum(["act", "regulation", "statutory-instrument", "order"]),
  officialReference: s.string().min(1),
  jurisdiction: s.enum(["england", "wales", "england-and-wales", "scotland", "northern-ireland", "uk-wide"]),
  inForceDate: s.isodate().optional(),
  amendments: s
    .array(s.object({ reference: s.string().min(1), date: s.isodate(), summary: s.string().min(1) }))
    .default([]),
  documentStatus: s.enum(["current", "withdrawn", "superseded"]).default("current"),
  supersededBy: s.string().optional(),
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
  extendedDefinition: s.mdx().optional(),
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
