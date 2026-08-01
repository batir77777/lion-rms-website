import {
  news as allNews,
  guides as allGuides,
  standards as allStandards,
  legislation as allLegislation,
  glossaryTerms as allTerms,
} from "@/.velite";
import type { Crumb } from "@/components/BreadcrumbJsonLd";
import { getContentCategory, getContentTag } from "@/lib/taxonomy";
import { KNOWLEDGE_PATH } from "@/lib/knowledge-sections";

// ---------------------------------------------------------------------------
// Accessor layer over the generated News collection (Phase 5A, PR 7).
//
// Mirrors lib/standards.ts and lib/legislation.ts. Two things are specific to
// News and worth stating up front.
//
// ORDERING is by publishedDate descending, not by eventDate. A reader arriving
// at /news wants to know what we said most recently, not which underlying
// event happened most recently — those diverge whenever we report an older
// case or a change announced well ahead of commencement.
//
// YEAR ARCHIVES group by publishedDate for the same reason: the archive
// answers "what did this library publish in 2025", which is a question about
// our record, not about the world.
// ---------------------------------------------------------------------------

export type NewsItem = (typeof allNews)[number];
export type Guide = (typeof allGuides)[number];
export type Standard = (typeof allStandards)[number];
export type Legislation = (typeof allLegislation)[number];
export type GlossaryTerm = (typeof allTerms)[number];

export const NEWS_PATH = "/news";

/**
 * A news slug that looks like a year would shadow its own archive.
 *
 * `/news/[slug]` and `/news/[year]` cannot be sibling dynamic segments — Next
 * rejects two different slug names at the same path depth — so both are served
 * by one route that branches on the shape of the parameter. That makes a news
 * item slugged "2026" genuinely dangerous: it would be unreachable, and it
 * would silently replace the 2026 archive. Rule N9 rejects it at build time.
 */
export const YEAR_PATTERN = /^\d{4}$/;

export function isYearParam(value: string): boolean {
  return YEAR_PATTERN.test(value);
}

export const FORMAT_LABELS: Record<string, string> = {
  "single-item": "News",
  "monthly-roundup": "Monthly round-up",
};

export const CATEGORY_LABELS: Record<string, string> = {
  enforcement: "Enforcement",
  prosecution: "Prosecution",
  consultation: "Consultation",
  "standards-update": "Standards update",
  "product-recall": "Product recall",
  "government-guidance": "Government guidance",
  "regulatory-change": "Regulatory change",
};

/** Every published item, newest first by publication date. */
export function publishedNews(): NewsItem[] {
  return allNews
    .filter((n) => n.status === "published")
    .sort((a, b) => {
      const byDate = (b.publishedDate ?? "").localeCompare(a.publishedDate ?? "");
      if (byDate !== 0) return byDate;
      return a.title.localeCompare(b.title, "en-GB");
    });
}

export function getNewsItem(slug: string): NewsItem | undefined {
  return publishedNews().find((n) => n.slug === slug);
}

export function isRoundUp(item: NewsItem): boolean {
  return item.newsFormat === "monthly-roundup";
}

/** True where the item has been corrected since publication. */
export function wasCorrected(item: NewsItem): boolean {
  const published = item.publishedDate?.slice(0, 10);
  const updated = item.updatedDate?.slice(0, 10);
  return Boolean(published && updated && updated > published);
}

// ---------------------------------------------------------------------------
// Year archives
// ---------------------------------------------------------------------------

export function yearOf(item: NewsItem): string {
  return String(item.publishedDate ?? "").slice(0, 4);
}

/** Years that actually have published content, newest first. */
export function archiveYears(): { year: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const item of publishedNews()) {
    const year = yearOf(item);
    if (!year) continue;
    counts.set(year, (counts.get(year) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year.localeCompare(a.year));
}

export function newsInYear(year: string): NewsItem[] {
  return publishedNews().filter((n) => yearOf(n) === year);
}

// ---------------------------------------------------------------------------
// Relations. Authored on the News side, derived everywhere else — the same
// discipline as PR 5 and PR 6, so the two halves cannot disagree.
// ---------------------------------------------------------------------------

export function guidesReferencedBy(item: NewsItem): Guide[] {
  return (item.relatedArticles ?? [])
    .map((slug) => allGuides.find((g) => g.slug === slug && g.status === "published"))
    .filter((g): g is Guide => Boolean(g));
}

export function standardsReferencedBy(item: NewsItem): Standard[] {
  return (item.relatedStandards ?? [])
    .map((slug) => allStandards.find((s) => s.slug === slug && s.status === "published"))
    .filter((s): s is Standard => Boolean(s));
}

export function legislationReferencedBy(item: NewsItem): Legislation[] {
  return (item.relatedLegislation ?? [])
    .map((slug) => allLegislation.find((l) => l.slug === slug && l.status === "published"))
    .filter((l): l is Legislation => Boolean(l));
}

export function termsReferencedBy(item: NewsItem): GlossaryTerm[] {
  return (item.relatedGlossaryTerms ?? [])
    .map((slug) => allTerms.find((t) => t.slug === slug && t.status === "published"))
    .filter((t): t is GlossaryTerm => Boolean(t));
}

/** Peer news items, self-references dropped. */
export function relatedNewsItems(item: NewsItem): NewsItem[] {
  const published = publishedNews();
  return (item.relatedNews ?? [])
    .filter((slug) => slug !== item.slug)
    .map((slug) => published.find((n) => n.slug === slug))
    .filter((n): n is NewsItem => Boolean(n));
}

// The inverses. Each is derived by scanning the News collection, never
// authored on the target, so a Guide cannot claim news coverage it does not
// have.

export function newsMentioningGuide(slug: string): NewsItem[] {
  return publishedNews().filter((n) => (n.relatedArticles ?? []).includes(slug));
}

export function newsMentioningStandard(slug: string): NewsItem[] {
  return publishedNews().filter((n) => (n.relatedStandards ?? []).includes(slug));
}

export function newsMentioningLegislation(slug: string): NewsItem[] {
  return publishedNews().filter((n) => (n.relatedLegislation ?? []).includes(slug));
}

export function newsUsingTerm(slug: string): NewsItem[] {
  return publishedNews().filter((n) => (n.relatedGlossaryTerms ?? []).includes(slug));
}

/** Items that reference this one. Derived by inversion — never authored. */
export function newsReferencing(slug: string): NewsItem[] {
  return publishedNews().filter((n) => (n.relatedNews ?? []).includes(slug));
}

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

export function formatLabel(item: NewsItem): string {
  return FORMAT_LABELS[item.newsFormat] ?? item.newsFormat;
}

export function categoryLabel(item: NewsItem): string {
  return CATEGORY_LABELS[item.newsCategory] ?? item.newsCategory;
}

export function sectionLabel(item: NewsItem): string {
  return getContentCategory(item.category)?.label ?? item.category;
}

export function tagLabels(item: NewsItem): string[] {
  return (item.tags ?? []).map((t) => getContentTag(t)?.label ?? t);
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

export interface DatedFact {
  label: string;
  value: string;
  iso: string;
}

/**
 * The event-side dates this item actually carries, with the label that is true
 * for its category.
 *
 * "Takes effect" and "Closes" are not interchangeable labels, and neither is
 * "Reported" — which is why the label comes from the category rather than from
 * the field name alone.
 */
export function datedFacts(item: NewsItem): DatedFact[] {
  const out: DatedFact[] = [];
  const push = (label: string, raw?: string) => {
    const iso = raw?.slice(0, 10);
    const value = formatDate(raw);
    if (iso && value) out.push({ label, value, iso });
  };

  if (item.newsCategory === "consultation") {
    push("Opened", item.eventDate);
    push("Closes", item.consultationClosesDate);
  } else if (item.newsCategory === "prosecution") {
    push("Sentenced", item.eventDate);
  } else if (item.newsCategory === "product-recall") {
    push("Recall issued", item.eventDate);
  } else {
    push("Announced", item.eventDate);
  }
  if (item.newsCategory !== "consultation") push("Takes effect", item.effectiveDate);
  return out;
}

export function buildNewsBreadcrumbs(item: NewsItem): Crumb[] {
  const year = yearOf(item);
  return [
    { name: "Home", path: "/" },
    { name: "Knowledge Centre", path: KNOWLEDGE_PATH },
    { name: "News", path: NEWS_PATH },
    ...(year ? [{ name: year, path: `${NEWS_PATH}/${year}` }] : []),
    { name: item.title },
  ];
}

export const NEWS_INDEX_CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Knowledge Centre", path: KNOWLEDGE_PATH },
  { name: "News" },
];

export function buildYearBreadcrumbs(year: string): Crumb[] {
  return [
    { name: "Home", path: "/" },
    { name: "Knowledge Centre", path: KNOWLEDGE_PATH },
    { name: "News", path: NEWS_PATH },
    { name: year },
  ];
}

export function lastModified(item: NewsItem): string | undefined {
  return item.updatedDate ?? item.publishedDate;
}
