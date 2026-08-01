import { guides as allGuides } from "@/.velite";
import type { Crumb } from "@/components/BreadcrumbJsonLd";
import { getContentCategory, getContentTag } from "@/lib/taxonomy";
import { getSector } from "@/lib/site";
import { KNOWLEDGE_PATH, GUIDES_PATH } from "@/lib/knowledge-sections";

// ---------------------------------------------------------------------------
// Accessor layer over the generated Guides collection (Phase 5A, PR 3).
//
// This is the single place that decides what "publicly visible" means. Every
// route, the index, the sitemap and every internal-linking surface goes through
// `publishedGuides()` — a status filter applied in four places and forgotten in
// a fifth is exactly how draft content leaks into a sitemap.
//
// It also replaces lib/insights.ts, which is retired in this PR. The service
// and sector derivations below deliberately reproduce the previous
// `getPostsForService` / `getPostsForSector` behaviour so that service and
// sector pages show the same related articles they showed before the
// migration — the only change being the /guides URL prefix.
// ---------------------------------------------------------------------------

export type Guide = (typeof allGuides)[number];

/**
 * Every guide that is genuinely public: published status only, most recent
 * first. Draft, in-review, archived and superseded items are excluded here and
 * therefore everywhere downstream.
 */
export function publishedGuides(): Guide[] {
  return allGuides
    .filter((g) => g.status === "published")
    .sort((a, b) => (b.publishedDate ?? "").localeCompare(a.publishedDate ?? ""));
}

export function getGuide(slug: string): Guide | undefined {
  return publishedGuides().find((g) => g.slug === slug);
}

export function getGuidesByCategory(categorySlug: string): Guide[] {
  return publishedGuides().filter((g) => g.category === categorySlug);
}

/**
 * Categories actually in use, with counts, in the registry's own order.
 * Drives the index filter. Categories with no published guide are omitted —
 * an empty filter button is a dead control.
 */
export function usedCategories(): { slug: string; label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const g of publishedGuides()) {
    counts.set(g.category, (counts.get(g.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({
      slug,
      label: getContentCategory(slug)?.label ?? slug,
      count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Guides related to a service. Matches the previous `getPostsForService`
 * behaviour, adapted from the old single-valued `relatedService` field to the
 * schema's `relatedServices` array.
 */
export function getGuidesForService(serviceSlug: string): Guide[] {
  return publishedGuides().filter((g) => g.relatedServices.includes(serviceSlug));
}

/**
 * Guides related to a sector, derived through the sector's own service list
 * exactly as `getPostsForSector` did. `relatedSectors` is deliberately left
 * empty on migrated content: populating it directly would change which guides
 * appear on sector pages, which is a separate editorial decision rather than
 * part of a URL migration.
 */
export function getGuidesForSector(sectorSlug: string): Guide[] {
  const services = getSector(sectorSlug)?.relatedServices ?? [];
  if (services.length === 0) return [];
  return publishedGuides().filter((g) =>
    g.relatedServices.some((s) => services.includes(s))
  );
}

export function categoryLabel(guide: Guide): string {
  return getContentCategory(guide.category)?.label ?? guide.category;
}

export function tagLabels(guide: Guide): string[] {
  return guide.tags.map((t) => getContentTag(t)?.label ?? t);
}

/**
 * One trail, consumed by both the visible Breadcrumbs component and
 * BreadcrumbJsonLd, so the two cannot disagree.
 *
 * The trail is Home › Knowledge Centre › Guides › [title]. It does not include
 * a category level: category hub routes are deferred out of PR 3, and a crumb
 * pointing at a route that returns 404 would be worse than no crumb.
 *
 * PR 9 added the Guides level. Until then "Knowledge Centre" pointed at
 * /guides, so a separate Guides crumb would have been the same link twice.
 * Now that the label points at the /knowledge hub, dropping the Guides crumb
 * would leave a guide page with no way back to the section it belongs to —
 * and would make Guides the only section whose trail skips itself, while
 * Glossary, Standards, Legislation, News and Downloads all carry theirs.
 */
export function buildGuideBreadcrumbs(guide: Guide): Crumb[] {
  return [
    { name: "Home", path: "/" },
    { name: "Knowledge Centre", path: KNOWLEDGE_PATH },
    { name: "Guides", path: GUIDES_PATH },
    { name: guide.title },
  ];
}

/** Home › Knowledge Centre › Guides — the trail for the section index. */
export const GUIDES_INDEX_CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Knowledge Centre", path: KNOWLEDGE_PATH },
  { name: "Guides" },
];

/** Formats an ISO date as a British-English long date, e.g. "6 July 2026". */
export function formatDate(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return undefined;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

/** `updatedDate` where an editor has set one, otherwise the publication date. */
export function lastModified(guide: Guide): string | undefined {
  return guide.updatedDate ?? guide.publishedDate;
}
