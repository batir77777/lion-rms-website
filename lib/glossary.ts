import { glossaryTerms as allTerms, guides as allGuides } from "@/.velite";
import type { Crumb } from "@/components/BreadcrumbJsonLd";
import { getContentCategory, getContentTag } from "@/lib/taxonomy";

// ---------------------------------------------------------------------------
// Accessor layer over the generated Glossary collection (Phase 5A, PR 4).
//
// Mirrors lib/guides.ts: one module decides what "publicly visible" means, and
// every route, the index, the sitemap and every linking surface goes through
// it. A status filter applied in four places and forgotten in a fifth is how
// draft content leaks into a sitemap.
//
// The one thing this module does that lib/guides.ts does not is invert the
// Guide → Glossary relation. A Guide declares `relatedGlossaryTerms`; nothing
// on a term declares the Guides that use it. Computing that inversion here at
// build time is what makes a term page a hub rather than a dead end, and it
// keeps the declaration in exactly one place.
// ---------------------------------------------------------------------------

export type GlossaryTerm = (typeof allTerms)[number];
export type Guide = (typeof allGuides)[number];

export const GLOSSARY_PATH = "/glossary";

/** Every published term, alphabetical by the name readers actually see. */
export function publishedTerms(): GlossaryTerm[] {
  return allTerms
    .filter((t) => t.status === "published")
    .sort((a, b) => displayTerm(a).localeCompare(displayTerm(b), "en-GB"));
}

export function getTerm(slug: string): GlossaryTerm | undefined {
  return publishedTerms().find((t) => t.slug === slug);
}

/**
 * The name to display and sort by. `preferredTerm` wins where an entry records
 * that industry usage has moved on; none of the launch twelve sets it.
 */
export function displayTerm(term: GlossaryTerm): string {
  return term.preferredTerm ?? term.term;
}

/** Uppercase initial letter used for A–Z grouping. */
export function initialLetter(term: GlossaryTerm): string {
  return displayTerm(term).charAt(0).toUpperCase();
}

export interface LetterGroup {
  letter: string;
  terms: GlossaryTerm[];
}

/**
 * All 26 letters, each with its terms. Letters with no terms are RETAINED with
 * an empty array rather than filtered out — the index needs to render them as
 * unlinked text, because a jump link that scrolls nowhere is worse than no
 * link, and `aria-disabled` on an anchor is widely mishandled.
 */
export function letterGroups(): LetterGroup[] {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const terms = publishedTerms();
  return alphabet.map((letter) => ({
    letter,
    terms: terms.filter((t) => initialLetter(t) === letter),
  }));
}

/** Only the letters that have at least one term — the linkable ones. */
export function activeLetters(): string[] {
  return letterGroups()
    .filter((g) => g.terms.length > 0)
    .map((g) => g.letter);
}

/**
 * Guides that declare this term in `relatedGlossaryTerms`. The inverted half of
 * the relation: declared once on the Guide, surfaced on both.
 */
export function guidesUsingTerm(slug: string): Guide[] {
  return allGuides
    .filter((g) => g.status === "published")
    .filter((g) => (g.relatedGlossaryTerms ?? []).includes(slug))
    .sort((a, b) => (b.publishedDate ?? "").localeCompare(a.publishedDate ?? ""));
}

/** Related terms, resolved to published entries and with self-references dropped. */
export function relatedTerms(term: GlossaryTerm): GlossaryTerm[] {
  return (term.relatedTerms ?? [])
    .filter((slug) => slug !== term.slug)
    .map((slug) => getTerm(slug))
    .filter((t): t is GlossaryTerm => Boolean(t));
}

/**
 * Everything a term is also known by: its synonyms plus, where it is an
 * abbreviation, the full form it stands for. Feeds `alternateName` in the
 * structured data and the searchable text on the index.
 */
export function alternateNames(term: GlossaryTerm): string[] {
  const names = [...(term.synonyms ?? [])];
  if (term.abbreviationFor) names.push(term.abbreviationFor);
  return [...new Set(names.filter(Boolean))];
}

export function categoryLabel(term: GlossaryTerm): string {
  return getContentCategory(term.category)?.label ?? term.category;
}

export function tagLabels(term: GlossaryTerm): string[] {
  return (term.tags ?? []).map((t) => getContentTag(t)?.label ?? t);
}

/**
 * Home › Knowledge Centre › Glossary › [term].
 *
 * Consumed by both the visible Breadcrumbs component and BreadcrumbJsonLd, so
 * the trail and the structured data cannot disagree. "Knowledge Centre" points
 * at /guides for now; it moves to /knowledge when that hub lands in PR 9.
 */
export function buildTermBreadcrumbs(term: GlossaryTerm): Crumb[] {
  return [
    { name: "Home", path: "/" },
    { name: "Knowledge Centre", path: "/guides" },
    { name: "Glossary", path: GLOSSARY_PATH },
    { name: displayTerm(term) },
  ];
}

export const GLOSSARY_INDEX_CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Knowledge Centre", path: "/guides" },
  { name: "Glossary" },
];

/** `updatedDate` where an editor has set one, otherwise the publication date. */
export function lastModified(term: GlossaryTerm): string | undefined {
  return term.updatedDate ?? term.publishedDate;
}
