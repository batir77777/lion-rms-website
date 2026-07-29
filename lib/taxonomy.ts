// Controlled taxonomy registry for the Knowledge Centre content platform
// (Phase 5A). Categories, tags, audiences, technical domains and
// jurisdictions are all deliberately closed vocabularies, not free text —
// this is what makes navigable category/tag pages and long-term taxonomy
// hygiene possible instead of the decorative, unbounded `tags: string[]`
// pattern used by the current `lib/insights.ts`.
//
// Any content item referencing a category/tag/audience slug that isn't
// registered here fails validation (see lib/content-validation.ts and
// velite.config.ts's `complete` hook) — this is intentional and is the
// mechanism that prevents uncontrolled taxonomy sprawl.

import { z } from "zod";

// ---------------------------------------------------------------------------
// Primary categories (Guides and News only)
// ---------------------------------------------------------------------------

export interface ContentCategory {
  slug: string;
  label: string;
  /** Required — powers the category hub page and prevents thin/empty
   *  category archives; every category must have real editorial framing
   *  before it's used, not just an auto-generated "posts tagged X" list. */
  description: string;
  appliesTo: ("guide" | "news")[];
}

export const CONTENT_CATEGORIES: ContentCategory[] = [
  {
    slug: "fire-risk-assessments",
    label: "Fire Risk Assessments",
    description:
      "Guidance on the fire risk assessment process itself — methodology, scope, what a competent assessment covers, and how to read and act on one.",
    appliesTo: ["guide", "news"],
  },
  {
    slug: "fire-safety",
    label: "Fire Safety",
    description:
      "Practical fire safety guidance for buildings in use — means of escape, fire doors, detection and alarm systems, evacuation planning, and day-to-day management.",
    appliesTo: ["guide", "news"],
  },
  {
    slug: "health-safety",
    label: "Health & Safety",
    description:
      "Wider workplace health and safety guidance beyond fire — risk assessment, compliance systems, and statutory duties under the Health and Safety at Work Act.",
    appliesTo: ["guide", "news"],
  },
  {
    slug: "compliance-legislation",
    label: "Compliance & Legislation",
    description:
      "How fire safety and health & safety legislation applies in practice — duties, responsibilities, and what compliance actually requires of a Responsible Person or employer.",
    appliesTo: ["guide", "news"],
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
  { slug: "fire-extinguishers", label: "Fire Extinguishers" },
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
  "uk-wide",
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
  appliesTo: z.array(z.enum(["guide", "news"])).min(1),
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
