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
import {
  CONTENT_CATEGORY_SLUGS,
  CONTENT_TAG_SLUGS,
  AUDIENCE_SLUGS,
  JURISDICTION_SLUGS,
} from "./taxonomy";
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
   * News items relevant to this page (Phase 5A PR 7).
   *
   * On baseFields rather than only on the News schema, for two reasons. A news
   * item needs to reference an earlier one — "the consultation we reported in
   * March has now closed" — and before this there was no field that could:
   * `relatedArticles` targets GUIDES, not news, which was the one genuine gap
   * in the relation model. And a Guide, Standard or Legislation page benefits
   * from pointing at the news that reported a change to it.
   *
   * Registered in RELATION_TARGET_COLLECTIONS in lib/content-validation.ts, so
   * every existing dangling-reference check applies with no new rule code.
   */
  relatedNews: s.array(s.string()).default([]),

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

  // -------------------------------------------------------------------------
  // Classification — two orthogonal axes (Phase 5A PR 7).
  //
  // Replaces `sourceType: monthly-roundup | hse-update | consultation |
  // enforcement-case | prosecution | product-recall | standards-revision`,
  // which was not decidable. `monthly-roundup` described the FORMAT of the
  // page; the other six described its SUBJECT. They were never alternatives —
  // a round-up CONTAINS consultations and enforcement cases — so a round-up
  // could not also be classified by topic, and a topic-classified item could
  // not be marked as a round-up.
  //
  // This is the same defect PR 6 found in `documentClass`, where Regulations
  // and Orders both being statutory instruments made three of four values
  // overlap. The fix is the same: separate the axes.
  //
  // `hse-update` also disappears, because it encoded the PUBLISHER into the
  // subject axis. HSE is one of several bodies publishing fire safety and
  // health & safety guidance — MHCLG, the Home Office and BSI all do too —
  // so publisher moves to `sourceOrganisation` where it belongs, and the
  // subject becomes `government-guidance`.
  // -------------------------------------------------------------------------

  /** How the page is shaped: one report, or a dated monthly digest. */
  newsFormat: s.enum(["single-item", "monthly-roundup"]),

  /**
   * What the item is about.
   *
   * `prosecution` is deliberately kept separate from `enforcement`
   * (owner decision, Phase 5A PR 7). An improvement notice and a Crown Court
   * conviction differ in kind, in evidential weight, and in what a duty holder
   * should take from them. Filing them together would read as though written
   * by someone who has not worked with either.
   */
  newsCategory: s.enum([
    "enforcement",
    "prosecution",
    "consultation",
    "standards-update",
    "product-recall",
    "government-guidance",
    "regulatory-change",
  ]),

  // -------------------------------------------------------------------------
  // Dates (Phase 5A PR 7).
  //
  // `publishedDate` and `updatedDate` come from baseFields and describe OUR
  // page. The three below describe the thing being reported, and they are not
  // interchangeable:
  //
  //   - an enforcement case has an event date and no effective date;
  //   - a commencement regulation has an effective date and, often, a separate
  //     announcement date;
  //   - a consultation has an opening date and a closing date, and neither is
  //     an "effective" date at all.
  //
  // One optional field could not carry this. `effectiveDate` previously tried
  // to, and using it for a sentencing date would have put a false claim into
  // the page's structured data.
  //
  // All three are optional HERE and required per-category by the N-series
  // rules in lib/editorial-validation.ts — the same split used for the
  // Standards and Legislation publication gates, so a half-written draft can
  // exist on disk but cannot be published.
  // -------------------------------------------------------------------------

  /** When the reported thing happened: sentencing, a recall notice, a launch. */
  eventDate: s.isodate().optional(),
  /** When a change takes legal or practical effect. Narrower than before. */
  effectiveDate: s.isodate().optional(),
  /** Consultation closing date — the one a reader must not miss. */
  consultationClosesDate: s.isodate().optional(),

  // -------------------------------------------------------------------------
  // Source attribution (Phase 5A PR 7)
  // -------------------------------------------------------------------------

  sourceUrl: s.string().min(1),
  /** The body that published the primary source: HSE, MHCLG, BSI, a fire and
   *  rescue service. There is no single publisher here, unlike legislation. */
  sourceOrganisation: s.string().min(1),
  /** When we last looked at the primary source. Required at publication by
   *  rule N6. Deliberately NOT subject to a staleness window: a dated report
   *  of a past event does not go stale the way a live standard does. */
  sourceCheckedDate: s.isodate(),
  /** False where the primary source sits behind a paywall or has been taken
   *  down, so the page can say so rather than offering a link that fails. */
  sourcePubliclyAccessible: s.boolean().default(true),

  // -------------------------------------------------------------------------
  // Immutability and corrections
  // -------------------------------------------------------------------------

  /**
   * Monthly round-ups are immutable historical records once published
   * (owner-approved decision). The value of a round-up is that it says what
   * was true in a given month; silently editing it destroys that.
   *
   * Rules F2/F3 already enforce the changelog side. PR 7 adds N7/N8: F4 is
   * promoted to an error here, and a corrected round-up must carry a
   * `correctionNote` that the page renders visibly.
   */
  immutable: s.boolean().default(false),
  /** Plain-English note rendered beneath the body where a correction was made.
   *  Append-only in practice: the original wording stays, this explains what
   *  changed, because a reader who acted on the original needs to see both. */
  correctionNote: s.string().optional(),

  schemaType: s.literal("NewsArticle"),
});

// ---------------------------------------------------------------------------
// Shared document-reference fields (Phase 5A, PR 5; narrowed in PR 6).
//
// StandardGuidancePage and LegislationPage both describe an EXTERNAL document
// that this site does not own, that changes without warning, and whose
// currency the reader is relying on. What follows is the part they genuinely
// share.
//
// PR 5 ALSO put `documentStatus`, `withdrawnDate` and `editionConfirmedDate`
// here, on the stated expectation that Legislation would inherit them and PR 6
// would need no new shared plumbing. **That expectation was wrong**, and PR 6
// withdraws it rather than preserving an unsuitable model because it already
// exists.
//
// A BSI lifecycle — current, under review, proposed for withdrawal, withdrawn
// — has no legislative equivalent. Legislation is repealed or revoked, never
// withdrawn; it can be partially in force or partially repealed; and "under
// review" is a publisher status with no analogue in statute. So those three
// fields moved into standardGuidancePageSchema, unchanged in name, type and
// required-ness, and Legislation declares its own `forceStatus` model instead.
//
// The move is deliberately behaviour-neutral for Standards. Every existing
// Standards test passes unmodified across it, and tests/schema-migration.test.mjs
// pins that guarantee so the refactor cannot quietly weaken the gate.
// ---------------------------------------------------------------------------

export const documentReferenceFields = {
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

  // -------------------------------------------------------------------------
  // Moved here from documentReferenceFields in Phase 5A PR 6, unchanged in
  // name, type and required-ness. These are BSI lifecycle concepts, not shared
  // ones — see the note on that block above.
  // -------------------------------------------------------------------------

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
  /** Date of withdrawal where one is published. Optional: not always stated. */
  withdrawnDate: s.isodate().optional(),
  /** When `currentEdition` / `officialReference` was last confirmed. */
  editionConfirmedDate: s.isodate().optional(),

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
  ...documentReferenceFields,
  contentType: s.literal("legislation"),
  slug: s.slug("legislation"),

  // -------------------------------------------------------------------------
  // Identity
  // -------------------------------------------------------------------------

  /**
   * The legal short title — "Fire Safety Act 2021". Distinct from `title`,
   * which is our editorial headline for the page. The short title is what a
   * reader searches for and what belongs in a breadcrumb.
   */
  shortTitle: s.string().min(1),
  /** Official citation exactly as legislation.gov.uk writes it:
   *  "2021 c. 24" · "S.I. 2022/547" · "2005 asp 5". */
  officialReference: s.string().min(1),
  year: s.number().int().min(1200).max(2100),
  publisher: s.string().min(1),

  // -------------------------------------------------------------------------
  // Classification — three orthogonal axes (Phase 5A PR 6).
  //
  // Replaces `documentClass: act | regulation | statutory-instrument | order`,
  // which was not decidable: Regulations ARE statutory instruments, and so are
  // Orders, so three of those four values overlapped. The axis also could not
  // express an Act of the Scottish Parliament, which is why the Fire (Scotland)
  // Act 2005 could not have been filed correctly under it.
  // -------------------------------------------------------------------------

  legislationTier: s.enum(["primary", "secondary"]),
  /** WHO made it, and under what constitutional form. */
  instrumentForm: s.enum([
    "uk-public-general-act",
    "act-of-the-scottish-parliament",
    "act-of-senedd-cymru",
    "northern-ireland-order-in-council",
    "statutory-instrument",
    "scottish-statutory-instrument",
    "welsh-statutory-instrument",
    "northern-ireland-statutory-rule",
  ]),
  /** WHAT KIND of instrument it is. Deliberately a separate axis from
   *  `instrumentForm`: an Order and a set of Regulations are both statutory
   *  instruments, so these concepts cannot compete inside one enum. */
  instrumentType: s.enum(["act", "regulations", "order", "rules", "measure"]),
  /** The provision secondary legislation was made under, e.g. "article 24 of
   *  the Regulatory Reform (Fire Safety) Order 2005". Required for secondary
   *  legislation by rule L5: an instrument that does not say what power it was
   *  made under cannot be placed in the statutory scheme. */
  enablingPower: s.string().optional(),

  // -------------------------------------------------------------------------
  // Territory — extent and application are DIFFERENT THINGS (Phase 5A PR 6).
  //
  // Extent is the jurisdiction whose law the instrument forms part of.
  // Application is where it actually imposes duties. The Fire Safety (England)
  // Regulations 2022 extend to England and Wales and apply only in England — a
  // reader in Cardiff needs to know that a regulation technically part of their
  // law does not bite on their building. One field could not say this.
  // -------------------------------------------------------------------------

  extent: s.array(s.enum(JURISDICTION_SLUGS)).min(1),
  application: s.array(s.enum(JURISDICTION_SLUGS)).min(1),
  /** Required by rule L7 wherever extent and application differ, and used for
   *  positions the enums cannot carry on their own — HSWA 1974's narrow
   *  Northern Ireland extent for regulation-making under ss.15 and 30, or
   *  application extended offshore by Order in Council. */
  extentNote: s.string().optional(),

  // -------------------------------------------------------------------------
  // Lifecycle (Phase 5A PR 6).
  //
  // Legislation-specific, replacing the BSI `documentStatus` vocabulary, which
  // has no legislative equivalent. "Amended" is deliberately NOT a status:
  // virtually all long-standing in-force legislation has been amended, so as a
  // flag it would be true of almost every page and tell a reader nothing.
  // legislation.gov.uk does not offer it either. Amendments are recorded below
  // as dated effects saying WHAT CHANGED, which is the only useful form.
  // -------------------------------------------------------------------------

  forceStatus: s.enum([
    "not-yet-in-force",
    "partially-in-force",
    "in-force",
    "partially-repealed",
    "repealed",
    "revoked",
    "spent",
  ]),
  /**
   * Prose for the cases where the enum alone would mislead.
   *
   * The Fire Safety Act 2021 is the live example: fully in force, but ss.1 and
   * 3 were textual amendments to the Fire Safety Order and were exhausted on
   * commencement, while s.2 remains a live and unexercised power. "Spent" is
   * wrong; bare "in force" is technically right and practically misleading.
   *
   * Same pattern as `revisionNote` on Standards: the structured field carries
   * the defensible fact, the prose carries the nuance, and neither pretends to
   * be the other.
   */
  statusNote: s.string().optional(),
  /** Acts are REPEALED. Rule L4 rejects this on secondary legislation. */
  repealedDate: s.isodate().optional(),
  /** Statutory instruments are REVOKED. Rule L4 rejects this on primary. */
  revokedDate: s.isodate().optional(),

  // -------------------------------------------------------------------------
  // Commencement (Phase 5A PR 6).
  //
  // One `inForceDate` could not describe the Building Safety Act 2022, which
  // commenced in stages across 2022–2024 with provisions still uncommenced —
  // including s.156(4), which would insert article 9A into the Fire Safety
  // Order. A page must not imply every provision is operative because part of
  // an Act has commenced.
  // -------------------------------------------------------------------------

  /** Retained for the simple case only. Derived from commencement[0] when absent. */
  inForceDate: s.isodate().optional(),
  commencement: s
    .array(
      s.object({
        date: s.isodate(),
        /** "fully" · "articles 1 and 52(1)(a)" · "section 1" */
        scope: s.string().min(1),
        /** Commencement can differ by nation: Fire Safety Act 2021 s.1
         *  commenced in Wales on 1 October 2021 and in England on 16 May 2022. */
        jurisdiction: s.enum(JURISDICTION_SLUGS).optional(),
        /** The commencing instrument, e.g. "S.I. 2022/544". */
        broughtInBy: s.string().optional(),
      })
    )
    .default([]),
  /** Provisions that have NOT commenced. Required by rule L6 where
   *  `forceStatus` is `partially-in-force`. */
  notYetInForce: s
    .array(s.object({ provision: s.string().min(1), note: s.string().min(1) }))
    .default([]),
  /** Qualifications on the commencement record — including, where true, that
   *  it is what we have verified rather than an exhaustive consolidated list. */
  commencementNote: s.string().optional(),

  // -------------------------------------------------------------------------
  // Amendments and outstanding effects (Phase 5A PR 6)
  // -------------------------------------------------------------------------

  amendments: s
    .array(
      s.object({
        reference: s.string().min(1),
        date: s.isodate(),
        summary: s.string().min(1),
        /** false = made but not yet in force. Normal for legislation, and
         *  exempted from rule G16 so recording it correctly does not trip a
         *  rule designed to catch a date typo on a standard. */
        inForce: s.boolean().default(true),
      })
    )
    .default([]),
  /** Instruments THIS one amends. The inverse (`amendedBy`) is derived by
   *  inversion in lib/supersession.ts and never authored — same discipline as
   *  `supersededBy`, so the two halves cannot disagree. */
  amends: s.array(s.string()).default([]),

  /**
   * legislation.gov.uk's warning that the revised text is KNOWN not to reflect
   * all changes — the single most important caution on a legal reference page,
   * because the text a reader is looking at is then demonstrably incomplete.
   *
   * Structured rather than prose so it can be rendered prominently above the
   * body and validated, per the owner requirement that it must not be treated
   * as ordinary commentary or hidden in the body.
   */
  outstandingEffects: s
    .array(
      s.object({
        effect: s.string().min(1),
        source: s.string().min(1),
        note: s.string().optional(),
      })
    )
    .default([]),
  /** Explicit, so "checked, none found" is distinguishable from "not looked
   *  at". A boolean with no default: required at publication by rule G13. */
  outstandingEffectsChecked: s.boolean(),

  // -------------------------------------------------------------------------
  // Source currency
  // -------------------------------------------------------------------------

  /** The date legislation.gov.uk states its revised text is current to. These
   *  DIFFER between instruments — there is no common cut-off, and presenting a
   *  single sitewide "verified as at" date would be wrong. */
  sourceTextAsAtDate: s.isodate(),
  /**
   * Whether that date was STATED BY THE SOURCE, or is our own check date
   * standing in for it.
   *
   * legislation.gov.uk shows an "up to date with all changes known to be in
   * force on or before X" line on most instruments but not all. Where it does
   * not, recording our check date silently in `sourceTextAsAtDate` would let a
   * reader believe the source vouched for a currency it never claimed. This
   * flag keeps the two apart, and the page says which it is.
   */
  sourceTextAsAtDateStated: s.boolean().default(true),
  /** When we last confirmed that as-at date against the source. */
  sourceCurrencyConfirmedDate: s.isodate().optional(),
  lastCheckedDate: s.isodate(),
  officialSourceUrl: s.string().min(1),

  // -------------------------------------------------------------------------
  // Editorial
  // -------------------------------------------------------------------------

  copyrightNotice: s.string().min(1),
  disclaimer: s.string().min(1),
  body: s.mdx(),
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
    .enum(JURISDICTION_SLUGS)
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
