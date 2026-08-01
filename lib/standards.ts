import {
  standards as allStandards,
  guides as allGuides,
  glossaryTerms as allTerms,
} from "@/.velite";
import type { Crumb } from "@/components/BreadcrumbJsonLd";
import { getContentCategory, getContentTag } from "@/lib/taxonomy";
import { successorsOf, predecessorsOf } from "@/lib/supersession";
import { KNOWLEDGE_PATH } from "@/lib/knowledge-sections";

// ---------------------------------------------------------------------------
// Accessor layer over the generated Standards collection (Phase 5A, PR 5).
//
// Mirrors lib/guides.ts and lib/glossary.ts: one module decides what
// "publicly visible" means, and every route, the listing, the sitemap and
// every linking surface goes through it.
//
// One thing here differs from both of those, and it is the point of the whole
// vertical: a standard that has been WITHDRAWN or SUPERSEDED is still
// published, still listed, still in the sitemap and still linked. Only the
// editorial `status` of our page decides visibility. The real-world
// `documentStatus` of the document decides what the page says about it.
//
// Filtering withdrawn documents out would remove exactly the page the reader
// arriving from a five-year-old assessment needs to find.
// ---------------------------------------------------------------------------

export type Standard = (typeof allStandards)[number];
export type Guide = (typeof allGuides)[number];
export type GlossaryTerm = (typeof allTerms)[number];

export const STANDARDS_PATH = "/standards";

/**
 * Document classes in a fixed order, most to least authoritative. The listing
 * groups by this, and the order is deliberate rather than alphabetical: a
 * reader scanning for a British Standard should not have to pass industry
 * guidance to reach it.
 */
export const DOCUMENT_CLASS_ORDER = [
  "british-standard",
  "pas",
  "statutory-guidance",
  "regulator-guidance",
  "industry-guidance",
] as const;

export type DocumentClass = (typeof DOCUMENT_CLASS_ORDER)[number];

export const DOCUMENT_CLASS_LABELS: Record<string, string> = {
  "british-standard": "British Standards",
  pas: "Publicly Available Specifications",
  "statutory-guidance": "Statutory guidance",
  "regulator-guidance": "Regulator guidance",
  "industry-guidance": "Industry guidance",
};

/**
 * Status labels. Every one is a visible text label, never colour alone —
 * status is load-bearing information here, not decoration.
 */
export const DOCUMENT_STATUS_LABELS: Record<string, string> = {
  current: "Current",
  "under-review": "Under review",
  "proposed-for-withdrawal": "Proposed for withdrawal",
  superseded: "Superseded",
  withdrawn: "Withdrawn",
};

/** True where the document itself still stands. */
export function isCurrentDocument(standard: Standard): boolean {
  return standard.documentStatus === "current";
}

/**
 * Every published standard, ordered by document class then by designation.
 *
 * Note again: no filter on `documentStatus`. Withdrawn and superseded
 * documents are included by design.
 */
export function publishedStandards(): Standard[] {
  return allStandards
    .filter((s) => s.status === "published")
    .sort((a, b) => {
      const classDelta =
        DOCUMENT_CLASS_ORDER.indexOf(a.documentClass as DocumentClass) -
        DOCUMENT_CLASS_ORDER.indexOf(b.documentClass as DocumentClass);
      if (classDelta !== 0) return classDelta;
      return a.officialReference.localeCompare(b.officialReference, "en-GB", {
        numeric: true,
      });
    });
}

export function getStandard(slug: string): Standard | undefined {
  return publishedStandards().find((s) => s.slug === slug);
}

export interface ClassGroup {
  documentClass: string;
  label: string;
  standards: Standard[];
}

/** Groups in the fixed order, with empty classes dropped. */
export function classGroups(): ClassGroup[] {
  const published = publishedStandards();
  return DOCUMENT_CLASS_ORDER.map((documentClass) => ({
    documentClass,
    label: DOCUMENT_CLASS_LABELS[documentClass] ?? documentClass,
    standards: published.filter((s) => s.documentClass === documentClass),
  })).filter((g) => g.standards.length > 0);
}

/** Document classes actually in use, for the listing filter. */
export function usedDocumentClasses(): { slug: string; label: string; count: number }[] {
  return classGroups().map((g) => ({
    slug: g.documentClass,
    label: g.label,
    count: g.standards.length,
  }));
}

// ---------------------------------------------------------------------------
// Relations. Each is authored on ONE side and derived on the other, so the
// two halves cannot drift apart.
// ---------------------------------------------------------------------------

/**
 * Guides that declare this standard in `relatedStandards`.
 *
 * The Guide side is authoritative: a Guide's author knows which documents they
 * relied on, and a standard should not need editing every time a Guide is
 * written. Same shape as guidesUsingTerm() in lib/glossary.ts.
 */
export function guidesReferencing(slug: string): Guide[] {
  return allGuides
    .filter((g) => g.status === "published")
    .filter((g) => (g.relatedStandards ?? []).includes(slug))
    .sort((a, b) => (b.publishedDate ?? "").localeCompare(a.publishedDate ?? ""));
}

/** Glossary terms this standard declares, resolved to published entries. */
export function termsUsedBy(standard: Standard): GlossaryTerm[] {
  return (standard.relatedGlossaryTerms ?? [])
    .map((slug) => allTerms.find((t) => t.slug === slug && t.status === "published"))
    .filter((t): t is GlossaryTerm => Boolean(t));
}

/**
 * The inverse: standards that declare this term. Lets a Glossary entry point
 * at the documents that define it, which is where a term like "fire resistance
 * rating" becomes materially more useful.
 */
export function standardsUsingTerm(termSlug: string): Standard[] {
  return publishedStandards().filter((s) =>
    (s.relatedGlossaryTerms ?? []).includes(termSlug)
  );
}

/** Peer standards, resolved and with self-references dropped. */
export function relatedStandards(standard: Standard): Standard[] {
  const published = publishedStandards();
  return (standard.relatedStandards ?? [])
    .filter((slug) => slug !== standard.slug)
    .map((slug) => published.find((s) => s.slug === slug))
    .filter((s): s is Standard => Boolean(s));
}

/** Documents that replaced this one. Declared here, derived on the successor. */
export function successors(standard: Standard): Standard[] {
  return successorsOf(standard, publishedStandards());
}

/** Documents this one replaced. Never authored — derived by inversion. */
export function predecessors(standard: Standard): Standard[] {
  return predecessorsOf(standard, publishedStandards());
}

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

/** The designation, which is what readers scan for and search on. */
export function designation(standard: Standard): string {
  return standard.officialReference;
}

export function documentClassLabel(standard: Standard): string {
  return DOCUMENT_CLASS_LABELS[standard.documentClass] ?? standard.documentClass;
}

export function documentStatusLabel(standard: Standard): string {
  return DOCUMENT_STATUS_LABELS[standard.documentStatus] ?? standard.documentStatus;
}

export function categoryLabel(standard: Standard): string {
  return getContentCategory(standard.category)?.label ?? standard.category;
}

export function tagLabels(standard: Standard): string[] {
  return (standard.tags ?? []).map((t) => getContentTag(t)?.label ?? t);
}

/**
 * Home › Knowledge Centre › Standards › [designation].
 *
 * Consumed by both the visible Breadcrumbs component and BreadcrumbJsonLd, so
 * the trail and the structured data cannot disagree. The final crumb uses the
 * DESIGNATION rather than the title: a four-level trail ending in a
 * sixty-character document title is unreadable.
 *
 * "Knowledge Centre" points at the /knowledge hub from PR 9 — same note as
 * lib/glossary.ts.
 */
export function buildStandardBreadcrumbs(standard: Standard): Crumb[] {
  return [
    { name: "Home", path: "/" },
    { name: "Knowledge Centre", path: KNOWLEDGE_PATH },
    { name: "Standards", path: STANDARDS_PATH },
    { name: designation(standard) },
  ];
}

export const STANDARDS_INDEX_CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Knowledge Centre", path: KNOWLEDGE_PATH },
  { name: "Standards" },
];

/** `updatedDate` where an editor has set one, otherwise the publication date. */
export function lastModified(standard: Standard): string | undefined {
  return standard.updatedDate ?? standard.publishedDate;
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
