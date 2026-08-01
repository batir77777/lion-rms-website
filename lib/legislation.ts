import {
  legislation as allLegislation,
  guides as allGuides,
  standards as allStandards,
  glossaryTerms as allTerms,
} from "@/.velite";
import type { Crumb } from "@/components/BreadcrumbJsonLd";
import { getContentCategory, getContentTag } from "@/lib/taxonomy";
import { relatedVia, inverseVia } from "@/lib/supersession";
import { KNOWLEDGE_PATH } from "@/lib/knowledge-sections";

// ---------------------------------------------------------------------------
// Accessor layer over the generated Legislation collection (Phase 5A, PR 6).
//
// Mirrors lib/standards.ts, with the same governing decision: a repealed or
// revoked instrument is STILL PUBLISHED, still listed, still in the sitemap and
// still linked. Only our page's editorial `status` decides visibility. The
// instrument's own `forceStatus` decides what the page says about it.
//
// Assessments, tribunal decisions and enforcement correspondence cite
// instruments for years after they cease to have effect, and the reader
// arriving from one of those is precisely who the page exists for.
// ---------------------------------------------------------------------------

export type Legislation = (typeof allLegislation)[number];
export type Guide = (typeof allGuides)[number];
export type Standard = (typeof allStandards)[number];
export type GlossaryTerm = (typeof allTerms)[number];

export const LEGISLATION_PATH = "/legislation";

/** Grouping order for the listing: where it applies, most-used first. */
export const JURISDICTION_ORDER = [
  "england-and-wales",
  "england",
  "wales",
  "great-britain",
  "united-kingdom",
  "scotland",
  "northern-ireland",
] as const;

export const JURISDICTION_LABELS: Record<string, string> = {
  england: "England",
  wales: "Wales",
  "england-and-wales": "England and Wales",
  scotland: "Scotland",
  "northern-ireland": "Northern Ireland",
  "great-britain": "Great Britain",
  "united-kingdom": "United Kingdom",
};

/**
 * Force-status labels. Every one is a visible text label — status is the most
 * consequential fact on a legal reference page and is never carried by colour.
 */
export const FORCE_STATUS_LABELS: Record<string, string> = {
  "not-yet-in-force": "Not yet in force",
  "partially-in-force": "Partially in force",
  "in-force": "In force",
  "partially-repealed": "Partially repealed",
  repealed: "Repealed",
  revoked: "Revoked",
  spent: "Spent",
};

export const TIER_LABELS: Record<string, string> = {
  primary: "Primary legislation",
  secondary: "Secondary legislation",
};

export const FORM_LABELS: Record<string, string> = {
  "uk-public-general-act": "UK Public General Act",
  "act-of-the-scottish-parliament": "Act of the Scottish Parliament",
  "act-of-senedd-cymru": "Act of Senedd Cymru",
  "northern-ireland-order-in-council": "Northern Ireland Order in Council",
  "statutory-instrument": "Statutory Instrument",
  "scottish-statutory-instrument": "Scottish Statutory Instrument",
  "welsh-statutory-instrument": "Welsh Statutory Instrument",
  "northern-ireland-statutory-rule": "Northern Ireland Statutory Rule",
};

export const TYPE_LABELS: Record<string, string> = {
  act: "Act",
  regulations: "Regulations",
  order: "Order",
  rules: "Rules",
  measure: "Measure",
};

/** Statuses meaning the instrument no longer has effect. */
export const TERMINATED_STATUSES = new Set(["repealed", "revoked"]);

/** True where the instrument is wholly and currently operative. */
export function isFullyInForce(item: Legislation): boolean {
  return item.forceStatus === "in-force";
}

/** True where it no longer stands at all. */
export function isTerminated(item: Legislation): boolean {
  return TERMINATED_STATUSES.has(item.forceStatus);
}

/**
 * Every published instrument, ordered by application jurisdiction, then
 * primary before secondary, then by year descending.
 *
 * No filter on `forceStatus` — see the module note.
 */
export function publishedLegislation(): Legislation[] {
  const rank = (item: Legislation) => {
    const first = item.application[0];
    const i = (JURISDICTION_ORDER as readonly string[]).indexOf(first);
    return i === -1 ? JURISDICTION_ORDER.length : i;
  };
  return allLegislation
    .filter((l) => l.status === "published")
    .sort((a, b) => {
      const j = rank(a) - rank(b);
      if (j !== 0) return j;
      if (a.legislationTier !== b.legislationTier) {
        return a.legislationTier === "primary" ? -1 : 1;
      }
      if (a.year !== b.year) return b.year - a.year;
      return a.shortTitle.localeCompare(b.shortTitle, "en-GB");
    });
}

export function getLegislation(slug: string): Legislation | undefined {
  return publishedLegislation().find((l) => l.slug === slug);
}

export interface JurisdictionGroup {
  jurisdiction: string;
  label: string;
  items: Legislation[];
}

/** Groups by the FIRST application jurisdiction, empty groups dropped. */
export function jurisdictionGroups(): JurisdictionGroup[] {
  const published = publishedLegislation();
  return JURISDICTION_ORDER.map((jurisdiction) => ({
    jurisdiction,
    label: JURISDICTION_LABELS[jurisdiction] ?? jurisdiction,
    items: published.filter((l) => l.application[0] === jurisdiction),
  })).filter((g) => g.items.length > 0);
}

/** Application jurisdictions actually in use, for the listing filter. */
export function usedJurisdictions(): { slug: string; label: string; count: number }[] {
  return jurisdictionGroups().map((g) => ({
    slug: g.jurisdiction,
    label: g.label,
    count: g.items.length,
  }));
}

// ---------------------------------------------------------------------------
// Relations. Authored on one side, derived on the other.
// ---------------------------------------------------------------------------

/** Guides declaring this instrument. The Guide side is authoritative. */
export function guidesReferencing(slug: string): Guide[] {
  return allGuides
    .filter((g) => g.status === "published")
    .filter((g) => (g.relatedLegislation ?? []).includes(slug))
    .sort((a, b) => (b.publishedDate ?? "").localeCompare(a.publishedDate ?? ""));
}

/** Standards declaring this instrument. The Standard side is authoritative. */
export function standardsReferencing(slug: string): Standard[] {
  return allStandards
    .filter((s) => s.status === "published")
    .filter((s) => (s.relatedLegislation ?? []).includes(slug))
    .sort((a, b) => a.officialReference.localeCompare(b.officialReference, "en-GB"));
}

/** Glossary terms this instrument declares. */
export function termsUsedBy(item: Legislation): GlossaryTerm[] {
  return (item.relatedGlossaryTerms ?? [])
    .map((slug) => allTerms.find((t) => t.slug === slug && t.status === "published"))
    .filter((t): t is GlossaryTerm => Boolean(t));
}

/** The inverse: instruments that declare a given term. */
export function legislationUsingTerm(termSlug: string): Legislation[] {
  return publishedLegislation().filter((l) =>
    (l.relatedGlossaryTerms ?? []).includes(termSlug)
  );
}

/** Standards this instrument declares. */
export function standardsUsedBy(item: Legislation): Standard[] {
  return (item.relatedStandards ?? [])
    .map((slug) => allStandards.find((s) => s.slug === slug && s.status === "published"))
    .filter((s): s is Standard => Boolean(s));
}

/** The inverse: instruments that declare a given standard. */
export function legislationUsingStandard(standardSlug: string): Legislation[] {
  return publishedLegislation().filter((l) =>
    (l.relatedStandards ?? []).includes(standardSlug)
  );
}

/** Peer instruments, self-references dropped. */
export function relatedLegislation(item: Legislation): Legislation[] {
  const published = publishedLegislation();
  return (item.relatedLegislation ?? [])
    .filter((slug) => slug !== item.slug)
    .map((slug) => published.find((l) => l.slug === slug))
    .filter((l): l is Legislation => Boolean(l));
}

/** Instruments this one amends. Declared here. */
export function amendsInstruments(item: Legislation): Legislation[] {
  return relatedVia(item as never, "amends", publishedLegislation() as never[]) as Legislation[];
}

/** Instruments that amend this one. Derived by inversion — never authored. */
export function amendedByInstruments(item: Legislation): Legislation[] {
  return inverseVia(item as never, "amends", publishedLegislation() as never[]) as Legislation[];
}

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

export function forceStatusLabel(item: Legislation): string {
  return FORCE_STATUS_LABELS[item.forceStatus] ?? item.forceStatus;
}

export function tierLabel(item: Legislation): string {
  return TIER_LABELS[item.legislationTier] ?? item.legislationTier;
}

export function formLabel(item: Legislation): string {
  return FORM_LABELS[item.instrumentForm] ?? item.instrumentForm;
}

export function typeLabel(item: Legislation): string {
  return TYPE_LABELS[item.instrumentType] ?? item.instrumentType;
}

export function jurisdictionList(values: readonly string[]): string {
  return values.map((v) => JURISDICTION_LABELS[v] ?? v).join(", ");
}

/**
 * True where extent and application differ — the state that needs explaining,
 * and the one rule L7 requires an `extentNote` for.
 */
export function extentDiffersFromApplication(item: Legislation): boolean {
  const a = item.extent;
  const b = item.application;
  return a.length !== b.length || a.some((x) => !b.includes(x));
}

/** True where the official source's own revised text predates our confirmation
 *  by a material margin, so the page should say the source itself is behind. */
export function sourceTextTrailsConfirmation(item: Legislation): boolean {
  const asAt = item.sourceTextAsAtDate?.slice(0, 10);
  const confirmed = item.sourceCurrencyConfirmedDate?.slice(0, 10);
  if (!asAt || !confirmed) return false;
  return asAt < confirmed;
}

export function categoryLabel(item: Legislation): string {
  return getContentCategory(item.category)?.label ?? item.category;
}

export function tagLabels(item: Legislation): string[] {
  return (item.tags ?? []).map((t) => getContentTag(t)?.label ?? t);
}

/**
 * Home › Knowledge Centre › Legislation › [short title].
 *
 * The final crumb is the SHORT TITLE — the legal name a reader searches for —
 * not our editorial headline, which is far too long for a trail.
 */
export function buildLegislationBreadcrumbs(item: Legislation): Crumb[] {
  return [
    { name: "Home", path: "/" },
    { name: "Knowledge Centre", path: KNOWLEDGE_PATH },
    { name: "Legislation", path: LEGISLATION_PATH },
    { name: item.shortTitle },
  ];
}

export const LEGISLATION_INDEX_CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Knowledge Centre", path: KNOWLEDGE_PATH },
  { name: "Legislation" },
];

export function lastModified(item: Legislation): string | undefined {
  return item.updatedDate ?? item.publishedDate;
}

export function formatDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
