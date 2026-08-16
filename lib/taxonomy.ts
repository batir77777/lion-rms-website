// Controlled taxonomy registry for the Knowledge Centre content platform
// (Phase 5A). Categories, tags, audiences, technical domains and
// jurisdictions are all deliberately closed vocabularies, not free text —
// this is what makes navigable category/tag pages and long-term taxonomy
// hygiene possible instead of the decorative, unbounded `tags: string[]`
// pattern used by the legacy `lib/insights.ts`, retired in Phase 5A PR 3.
//
// Any content item referencing a category/tag/audience slug that isn't
// registered here fails validation (see lib/content-validation.ts and
// velite.config.ts's `complete` hook) — this is intentional and is the
// mechanism that prevents uncontrolled taxonomy sprawl.

import { z } from "zod";

// ---------------------------------------------------------------------------
// Primary categories (Guides, News and — from Phase 5A PR 4 — Glossary)
// ---------------------------------------------------------------------------

export interface ContentCategory {
  slug: string;
  label: string;
  /** Required — powers the category hub page and prevents thin/empty
   *  category archives; every category must have real editorial framing
   *  before it's used, not just an auto-generated "posts tagged X" list. */
  description: string;
  /**
   * Which public sections may use this category. Values name sections
   * (/guides, /news, /glossary, /standards), not schema contentType literals —
   * "glossary" therefore matches the section, consistent with how "guide" and
   * "news" already work. Phase 5A PR 3 added Guides; PR 4 opted in the three
   * categories that genuinely fit the launch Glossary terms; PR 5 opted in the
   * four that fit Standards.
   *
   * From PR 5 this field is ENFORCED rather than declarative: rule C6 in
   * lib/editorial-validation.ts rejects a content item whose category does not
   * list that item's section. Before that it was documentation only, which
   * meant the registry could drift away from what content actually did without
   * anything noticing.
   */
  appliesTo: ("guide" | "news" | "glossary" | "standard" | "legislation")[];
}

export const CONTENT_CATEGORIES: ContentCategory[] = [
  {
    slug: "fire-risk-assessments",
    label: "Fire Risk Assessments",
    description:
      "Guidance on the fire risk assessment process itself — methodology, scope, what a competent assessment covers, and how to read and act on one.",
    appliesTo: ["guide", "news", "glossary", "standard", "legislation"],
  },
  {
    slug: "fire-safety",
    label: "Fire Safety",
    description:
      "Practical fire safety guidance for buildings in use — means of escape, fire doors, detection and alarm systems, evacuation planning, and day-to-day management.",
    appliesTo: ["guide", "news", "glossary", "standard", "legislation"],
  },
  {
    slug: "health-safety",
    label: "Health & Safety",
    description:
      "Wider workplace health and safety guidance beyond fire — risk assessment, compliance systems, and statutory duties under the Health and Safety at Work Act.",
    appliesTo: ["guide", "news", "standard", "legislation"],
  },
  {
    slug: "compliance-legislation",
    label: "Compliance & Legislation",
    description:
      "How fire safety and health & safety legislation applies in practice — duties, responsibilities, and what compliance actually requires of a Responsible Person or employer.",
    appliesTo: ["guide", "news", "glossary", "standard", "legislation"],
  },
  {
    slug: "business-duty-holder-guidance",
    label: "Business & Duty Holder Guidance",
    description:
      "Guidance framed around who the reader is — landlords, employers, managing agents, and other duty holders — rather than around a single technical topic.",
    appliesTo: ["guide", "news"],
  },
];

export const CONTENT_CATEGORY_SLUGS = CONTENT_CATEGORIES.map((c) => c.slug) as [string, ...string[]];

export function getContentCategory(slug: string): ContentCategory | undefined {
  return CONTENT_CATEGORIES.find((c) => c.slug === slug);
}

// ---------------------------------------------------------------------------
// Tags — controlled vocabulary, not free text. A new tag requires an
// addition here (a small, reviewable change), and near-duplicates merge via
// `synonymOf` rather than the vocabulary growing unboundedly.
// ---------------------------------------------------------------------------

export interface ContentTag {
  slug: string;
  label: string;
  /** Required only once a tag has earned its own archive page (see the
   *  thin-content threshold rule in the architecture plan, Section 6). */
  description?: string;
  /** Merges a near-duplicate tag into one canonical slug. */
  synonymOf?: string;
}

export const CONTENT_TAGS: ContentTag[] = [
  { slug: "fire-doors", label: "Fire Doors" },
  { slug: "means-of-escape", label: "Means of Escape" },
  { slug: "peeps", label: "PEEPs" },
  { slug: "fire-alarm-systems", label: "Fire Alarm Systems" },
  { slug: "emergency-lighting", label: "Emergency Lighting" },
  // "legionella" removed in Phase 5A PR 2. Legionella is not a promoted
  // service, and a tag in the registry would become a live topic page the
  // moment taxonomy routes exist. Restore this entry if Legionella content or
  // services are formally introduced.
  { slug: "cdm", label: "CDM" },
  { slug: "construction-fire-safety", label: "Construction Fire Safety" },
  { slug: "evacuation-planning", label: "Evacuation Planning" },
  // Added in Phase 5A PR 3. A technical building-fabric topic that sits
  // alongside fire-doors and means-of-escape. The only tag added during the
  // Insights migration: the other free-text tags on the legacy posts were
  // categories, audiences or document references in disguise, and are handled
  // by `category`, `audience` and the relatedStandards/relatedLegislation
  // relation fields respectively rather than by inventing tags that would
  // later compete with the /standards and /legislation pages themselves.
  { slug: "compartmentation", label: "Compartmentation" },
  { slug: "fire-extinguishers", label: "Fire Extinguishers" },
  // Added in Phase 5A PR 6 (News). Rule C3 makes tags mandatory on News, and
  // the ten tags above are all building-fabric or life-safety-system topics
  // that no enforcement notice, consultation or product recall could honestly
  // carry. Rather than weaken C3 or invent news-shaped tags, the registry
  // gains four subjects that are genuinely technical, recur across this
  // sector, and — the test of a legitimate tag — would apply just as well to
  // an existing Guide or Standard as to a news item.
  //
  // Deliberately NOT added: anything matching an existing category
  // ("enforcement", "regulatory-change"), which would duplicate `newsCategory`
  // and compete in search with the pages it was meant to classify. That was
  // the PR 3 and PR 5 conclusion and it still holds.
  { slug: "sprinklers-suppression", label: "Sprinklers & Suppression" },
  { slug: "external-wall-systems", label: "External Wall Systems" },
  { slug: "smoke-control", label: "Smoke Control" },
  { slug: "asbestos", label: "Asbestos" },
  // Added in F2 (health & safety taxonomy extension).
  //
  // THE DEFECT THIS FIXES. Of the fourteen tags above, exactly two describe
  // anything other than fire: `asbestos` and `cdm`. The other twelve are
  // building fabric, life-safety systems or evacuation. The consequence was
  // visible in the content: the workplace health and safety inspection
  // checklist — a seven-section general walk-round covering housekeeping,
  // welfare, electrical, substances, people, emergency arrangements and
  // contractors — was tagged `means-of-escape` and `fire-doors` and nothing
  // else, and HSG65, the Health and Safety at Work Act and the Management
  // Regulations carried no tags at all. This is a tri-disciplinary practice
  // whose taxonomy could only describe one of the disciplines.
  //
  // ONLY TWO ADDED, and deliberately so. Eight further candidates were
  // considered and rejected — electrical-safety, manual-handling,
  // slips-trips-falls, work-at-height, coshh-hazardous-substances,
  // welfare-facilities, risk-assessment and hse-enforcement. The first six
  // each correspond to one section of one checklist and to nothing else on the
  // site; `risk-assessment` would collide with the fire-risk-assessments
  // category, the fire-risk-assessment technical domain and the glossary term
  // of the same name; `hse-enforcement` duplicates the `enforcement` and
  // `prosecution` values of `newsCategory`, which is the pattern PR 3 and PR 5
  // both rejected. `competence` was proposed and DEFERRED at the owner's
  // decision until there is a stronger body of H&S content behind it.
  //
  // `fire-extinguishers` and `sprinklers-suppression` above are used by zero
  // content items. They are why tests/taxonomy-health-safety.test.mjs requires
  // EVERY tag added here to be in use, rather than the "at least half" bar the
  // PR 6 batch was allowed.

  // Four uses: HSG65 (Plan-Do-Check-Act), MHSWR 1999 reg 5 (arrangements),
  // HSWA 1974 s.2(3) (the safety policy duty), and the workplace inspection
  // checklist (the monitoring limb of the same cycle).
  //
  // Named for the concept, not for the section. A tag called "health-safety"
  // would duplicate the category slug of that name and compete in search with
  // the very pages it classifies. The dormant technical domain
  // `health-safety-management-systems` is the SAME idea under a longer name —
  // if that field is ever populated, these two should be reconciled, not
  // treated as two axes.
  //
  // NOT applied to the fire corpus. Fire safety is legally a subset of health
  // and safety, so this tag could be argued onto a dozen fire documents — at
  // which point it would mean "compliance" and mean nothing.
  { slug: "safety-management-systems", label: "Safety Management Systems" },

  // Two uses: the workplace inspection checklist, and the 2026 HSE asbestos
  // inspection campaign. Thin, and knowingly so — the concept is load-bearing
  // enough to carry it. The checklist devotes a whole section to the
  // distinction this tag marks: an inspection checks whether the controls you
  // already decided on are actually happening, whereas a risk assessment
  // decides what those controls should be. They are routinely confused, and
  // the taxonomy had no way to say which a document was.
  //
  // Distinct from the Downloads `resourceType` value `inspection-form`, which
  // describes a document's SHAPE rather than its subject.
  //
  // WHEN TAXONOMY ROUTES SHIP: two items is below any sensible thin-content
  // threshold for an archive page. Apply the threshold rule from the
  // architecture plan (Section 6) rather than generating a page per slug.
  { slug: "workplace-inspections", label: "Workplace Inspections" },

  // Added in PR 8 (COSHH Knowledge Centre guide).
  //
  // `coshh-hazardous-substances` was one of the eight candidates considered
  // and REJECTED at F2, on the stated ground that it "corresponds to one
  // section of one checklist and to nothing else on the site" — see the F2
  // comment above. That was true at the time: the only content touching
  // hazardous substances was the "substances and materials" section of the
  // workplace inspection checklist, one section among seven in a general
  // document.
  //
  // The factual basis has changed, not the governance rule. PR 8 adds two
  // items that are wholly and specifically about hazardous substances, not
  // one section of a general document: the L5 Approved Code of Practice
  // (standards) and the Control of Substances Hazardous to Health
  // Regulations 2002 (legislation). Two dedicated, tag-eligible items is
  // exactly the "genuinely technical, recurs across the site" bar the PR 6
  // News batch was held to, and above the F2 rejection's own stated test.
  //
  // Two uses: l5-control-of-substances-hazardous-to-health,
  // control-of-substances-hazardous-to-health-regulations-2002.
  //
  // NOT applied to the workplace inspection checklist. Retagging it here
  // would repeat the exact defect this tag was rejected for at F2 — one
  // section of a seven-section general document does not make the whole
  // document "about" hazardous substances, any more than the fire-doors
  // section makes it a document about fire doors.
  //
  // NOT applied to the COSHH guide (coshh-assessment-explained). Guides
  // carry no domain tags at all — confirmed by
  // tests/taxonomy-health-safety.test.mjs, which explicitly excludes Guides
  // from the "carries a health & safety tag" requirement and forbids tag
  // chips on Guide pages. A Guide's domain is carried by `category` alone.
  { slug: "coshh-hazardous-substances", label: "COSHH & Hazardous Substances" },
];

export const CONTENT_TAG_SLUGS = CONTENT_TAGS.map((t) => t.slug) as [string, ...string[]];

export function getContentTag(slug: string): ContentTag | undefined {
  return CONTENT_TAGS.find((t) => t.slug === slug);
}

// ---------------------------------------------------------------------------
// Audience types
// ---------------------------------------------------------------------------

export const AUDIENCES = [
  "landlords",
  "employers-duty-holders",
  "facilities-managers",
  "housing-providers-managing-agents",
  "construction-developers",
  "building-owners",
  "health-safety-officers",
] as const;

export const AUDIENCE_SLUGS = AUDIENCES as unknown as [string, ...string[]];

// ---------------------------------------------------------------------------
// Regulatory jurisdiction — a genuine content-accuracy field, not just
// taxonomic completeness: fire safety legislation differs materially by
// nation (e.g. the Fire Safety (England) Regulations 2022 vs. Scotland's
// separate regime).
// ---------------------------------------------------------------------------

export const JURISDICTIONS = [
  "england",
  "wales",
  "england-and-wales",
  "scotland",
  "northern-ireland",
  // Added in Phase 5A PR 6. England, Wales and Scotland — the extent of the
  // Health and Safety at Work etc. Act 1974 and of regulations made under it.
  // Neither "england-and-wales" nor "united-kingdom" is correct for those, and
  // until now there was no value that was.
  "great-britain",
  // Renamed from "uk-wide" in Phase 5A PR 6. From this PR the field makes legal
  // statements about territorial extent and application, and "UK-wide" is a
  // colloquialism rather than a jurisdiction. The one published Glossary term
  // using the old value is migrated in the same commit — see the rollback note
  // in the PR description: a revert must restore both the vocabulary and that
  // content value together.
  "united-kingdom",
] as const;

export const JURISDICTION_SLUGS = JURISDICTIONS as unknown as [string, ...string[]];

// ---------------------------------------------------------------------------
// Technical domains
// ---------------------------------------------------------------------------

export const TECHNICAL_DOMAINS = [
  "fire-risk-assessment",
  "fire-detection-alarm",
  "means-of-escape",
  "fire-doors-compartmentation",
  "emergency-lighting",
  "fire-fighting-equipment",
  "health-safety-management-systems",
  "legionella-water-hygiene",
  "construction-phase-fire-safety",
  "building-safety-act-higher-risk-buildings",
] as const;

export const TECHNICAL_DOMAIN_SLUGS = TECHNICAL_DOMAINS as unknown as [string, ...string[]];

// ---------------------------------------------------------------------------
// Reused, not duplicated: building/premises type is deliberately NOT a new
// taxonomy axis here — it reuses the existing SECTORS taxonomy from
// lib/site.ts via each content item's `relatedSectors` relation field, per
// the architecture plan's explicit recommendation against a second,
// competing classification system.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Lightweight runtime validation for the registries themselves — these are
// plain hand-authored TS files, not MDX content, so they don't go through
// Velite's `s` builder; this standalone Zod schema is what PR 1's build-time
// validation script uses to confirm the registries themselves are
// well-formed (no duplicate slugs, no dangling `synonymOf` references).
// ---------------------------------------------------------------------------

const categorySchema = z.object({
  slug: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1),
  appliesTo: z.array(z.enum(["guide", "news", "glossary", "standard", "legislation"])).min(1),
});

const tagSchema = z.object({
  slug: z.string().min(1),
  label: z.string().min(1),
  description: z.string().min(1).optional(),
  synonymOf: z.string().min(1).optional(),
});

export interface TaxonomyValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateTaxonomyRegistry(): TaxonomyValidationResult {
  const errors: string[] = [];

  for (const category of CONTENT_CATEGORIES) {
    const result = categorySchema.safeParse(category);
    if (!result.success) {
      errors.push(`Invalid category "${category.slug}": ${result.error.message}`);
    }
  }
  const categorySlugSet = new Set<string>();
  for (const category of CONTENT_CATEGORIES) {
    if (categorySlugSet.has(category.slug)) {
      errors.push(`Duplicate category slug: "${category.slug}"`);
    }
    categorySlugSet.add(category.slug);
  }

  const tagSlugSet = new Set<string>();
  for (const tag of CONTENT_TAGS) {
    const result = tagSchema.safeParse(tag);
    if (!result.success) {
      errors.push(`Invalid tag "${tag.slug}": ${result.error.message}`);
    }
    if (tagSlugSet.has(tag.slug)) {
      errors.push(`Duplicate tag slug: "${tag.slug}"`);
    }
    tagSlugSet.add(tag.slug);
    if (tag.synonymOf && !CONTENT_TAGS.some((t) => t.slug === tag.synonymOf)) {
      errors.push(`Tag "${tag.slug}" has synonymOf "${tag.synonymOf}" which does not exist in the registry`);
    }
  }

  return { valid: errors.length === 0, errors };
}
