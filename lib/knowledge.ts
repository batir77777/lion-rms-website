import type { Crumb } from "@/components/BreadcrumbJsonLd";
import { publishedGuides, lastModified as guideLastModified } from "@/lib/guides";
import { publishedTerms, displayTerm, lastModified as termLastModified } from "@/lib/glossary";
import { publishedStandards, lastModified as standardLastModified } from "@/lib/standards";
import { publishedLegislation, lastModified as legislationLastModified } from "@/lib/legislation";
import { publishedNews, lastModified as newsLastModified } from "@/lib/news";
import { publishedDownloads, lastModified as downloadLastModified } from "@/lib/downloads";
import {
  KNOWLEDGE_SECTION_META,
  type KnowledgeSectionMeta,
  GUIDES_PATH,
  GLOSSARY_PATH,
  STANDARDS_PATH,
  LEGISLATION_PATH,
  NEWS_PATH,
  DOWNLOADS_PATH,
  KNOWLEDGE_PATH,
} from "@/lib/knowledge-sections";

// ---------------------------------------------------------------------------
// The Knowledge Centre as a thing in itself (Phase 5A, PR 9).
//
// Six sections have shipped one PR at a time — Guides, Glossary, Standards,
// Legislation, News, Downloads — and until now "Knowledge Centre" was a label
// in the header that pointed at whichever section happened to be first. This
// module is where the hub, the sitemap and the secondary navigation get their
// picture of what the Knowledge Centre contains.
//
// It imports every content accessor, so it must NOT be imported from a client
// component: lib/knowledge-sections.ts exists for that, and carries everything
// static about the sections. See the note at the top of that file for what it
// cost when the two were one module.
// ---------------------------------------------------------------------------

// Re-exported by name rather than with `export *` so that every symbol this
// module offers is visible in this file — and because a star re-export of a
// TypeScript module is resolved differently by the bundler and by the test
// runner's transpiler, which made the named imports fail at run time.
export {
  KNOWLEDGE_PATH,
  SEARCH_PATH,
  GUIDES_PATH,
  GLOSSARY_PATH,
  STANDARDS_PATH,
  LEGISLATION_PATH,
  NEWS_PATH,
  DOWNLOADS_PATH,
  KNOWLEDGE_SECTION_META,
  KNOWLEDGE_SEGMENTS,
  sectionLabelForPath,
} from "@/lib/knowledge-sections";
export type { KnowledgeSectionMeta } from "@/lib/knowledge-sections";

export interface KnowledgeSection extends KnowledgeSectionMeta {
  count: () => number;
}

const COUNTS: Record<string, () => number> = {
  guides: () => publishedGuides().length,
  glossary: () => publishedTerms().length,
  standards: () => publishedStandards().length,
  legislation: () => publishedLegislation().length,
  news: () => publishedNews().length,
  downloads: () => publishedDownloads().length,
};

export const KNOWLEDGE_SECTIONS: readonly KnowledgeSection[] = KNOWLEDGE_SECTION_META.map(
  (section) => ({ ...section, count: COUNTS[section.segment] })
);

/** Every Knowledge Centre section path, in editorial order. */
export const KNOWLEDGE_SECTION_PATHS: readonly string[] = KNOWLEDGE_SECTIONS.map((s) => s.path);

export function totalKnowledgeItems(): number {
  return KNOWLEDGE_SECTIONS.reduce((total, section) => total + section.count(), 0);
}

// ---------------------------------------------------------------------------

export interface KnowledgeUpdate {
  section: KnowledgeSection;
  title: string;
  summary: string;
  href: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
}

const dateOnly = (value: string | undefined): string => (value ?? "").slice(0, 10);

const bySegment = (segment: string) =>
  KNOWLEDGE_SECTIONS.find((s) => s.segment === segment) as KnowledgeSection;

function allUpdates(): KnowledgeUpdate[] {
  const updates: KnowledgeUpdate[] = [
    ...publishedGuides().map((g) => ({
      section: bySegment("guides"),
      title: g.title,
      summary: g.summary,
      href: `${GUIDES_PATH}/${g.slug}`,
      date: dateOnly(guideLastModified(g)),
    })),
    ...publishedTerms().map((t) => ({
      section: bySegment("glossary"),
      title: displayTerm(t),
      summary: t.shortDefinition,
      href: `${GLOSSARY_PATH}/${t.slug}`,
      date: dateOnly(termLastModified(t)),
    })),
    ...publishedStandards().map((s) => ({
      section: bySegment("standards"),
      title: s.title,
      summary: s.summary,
      href: `${STANDARDS_PATH}/${s.slug}`,
      date: dateOnly(standardLastModified(s)),
    })),
    ...publishedLegislation().map((l) => ({
      section: bySegment("legislation"),
      title: l.title,
      summary: l.summary,
      href: `${LEGISLATION_PATH}/${l.slug}`,
      date: dateOnly(legislationLastModified(l)),
    })),
    ...publishedNews().map((n) => ({
      section: bySegment("news"),
      title: n.title,
      summary: n.summary,
      href: `${NEWS_PATH}/${n.slug}`,
      date: dateOnly(newsLastModified(n)),
    })),
    ...publishedDownloads().map((d) => ({
      section: bySegment("downloads"),
      title: d.title,
      summary: d.summary,
      href: `${DOWNLOADS_PATH}/${d.slug}`,
      date: dateOnly(downloadLastModified(d)),
    })),
  ];

  /*
   * Most recent first. Ties are broken by section order and then title rather
   * than left to the sort's stability, because several items genuinely share a
   * date and an unstable order would make the hub differ between builds for no
   * reason.
   */
  const rank = new Map(KNOWLEDGE_SECTIONS.map((s, i) => [s.segment, i]));
  return updates.sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    const byRank = (rank.get(a.section.segment) ?? 0) - (rank.get(b.section.segment) ?? 0);
    return byRank !== 0 ? byRank : a.title.localeCompare(b.title);
  });
}

/**
 * The most recently updated items, spread across sections.
 *
 * A straight "six most recent" list is dominated by whichever section was
 * worked on last — publish a batch of glossary terms and the hub becomes a
 * glossary. So the first pass takes the most recent item from each section it
 * has not used yet, which is what makes the panel a map of the Knowledge Centre
 * rather than a changelog. Only if there are fewer sections than slots does a
 * second pass fill the remainder with the next most recent items, whatever
 * section they belong to — hence "where possible" rather than a hard rule.
 */
export function recentlyUpdated(limit = 6): KnowledgeUpdate[] {
  const updates = allUpdates();
  const used = new Set<string>();
  const picked: KnowledgeUpdate[] = [];

  for (const update of updates) {
    if (picked.length === limit) break;
    if (used.has(update.section.segment)) continue;
    used.add(update.section.segment);
    picked.push(update);
  }

  for (const update of updates) {
    if (picked.length === limit) break;
    if (picked.includes(update)) continue;
    picked.push(update);
  }

  return picked.slice(0, limit);
}

// ---------------------------------------------------------------------------

export const KNOWLEDGE_INDEX_CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Knowledge Centre" },
];

export const SEARCH_CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Knowledge Centre", path: KNOWLEDGE_PATH },
  { name: "Search" },
];

export function formatUpdateDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
