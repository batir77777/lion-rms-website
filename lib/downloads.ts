import {
  downloads as allDownloads,
  guides as allGuides,
  standards as allStandards,
  legislation as allLegislation,
  glossaryTerms as allTerms,
  news as allNews,
} from "@/.velite";
import type { Crumb } from "@/components/BreadcrumbJsonLd";
import { getContentCategory, getContentTag } from "@/lib/taxonomy";
import { KNOWLEDGE_PATH } from "@/lib/knowledge-sections";

// ---------------------------------------------------------------------------
// Accessor layer over the generated Downloads collection (Phase 5A, PR 8A).
//
// Mirrors lib/standards.ts, lib/legislation.ts and lib/news.ts. Two things are
// specific to Downloads and worth stating up front.
//
// WITHDRAWN RESOURCES ARE STILL REACHABLE. `publishedDownloads()` drives the
// listing and excludes them, but `getDownload()` resolves them, because a
// withdrawn resource keeps its landing page at 200 forever. A completed weekly
// alarm test record in a client's fire safety file cites the version it was
// printed from; making that URL disappear would destroy the record rather than
// correct it. The page explains its own withdrawal instead, and goes noindex.
//
// DELIVERY IS NOT THE SAME AS A FILE. A resource may be delivered as a file, as
// a printable landing page, or as both. `deliveryFormats()` is the single place
// that knows this, so no route has to reason about it twice.
// ---------------------------------------------------------------------------

export type DownloadResource = (typeof allDownloads)[number];
export type Guide = (typeof allGuides)[number];
export type Standard = (typeof allStandards)[number];
export type Legislation = (typeof allLegislation)[number];
export type GlossaryTerm = (typeof allTerms)[number];
export type NewsItem = (typeof allNews)[number];

export const DOWNLOADS_PATH = "/downloads";

export const RESOURCE_TYPE_LABELS: Record<string, string> = {
  checklist: "Checklist",
  template: "Template",
  "inspection-form": "Inspection form",
  "record-form": "Record form",
  logbook: "Logbook",
  "guidance-document": "Guidance",
};

export const FORMAT_LABELS: Record<string, string> = {
  pdf: "PDF",
  docx: "Word",
  xlsx: "Excel",
  html: "Web page",
};

// ---------------------------------------------------------------------------
// Selection
// ---------------------------------------------------------------------------

/** Everything a reader should be offered, most recently updated first. */
export function publishedDownloads(): DownloadResource[] {
  return allDownloads
    .filter((d) => d.status === "published")
    .sort((a, b) => {
      const byDate = String(lastModified(b)).localeCompare(String(lastModified(a)));
      if (byDate !== 0) return byDate;
      return a.title.localeCompare(b.title, "en-GB");
    });
}

/** Withdrawn resources, which keep their pages but leave the listing. */
export function withdrawnDownloads(): DownloadResource[] {
  return allDownloads.filter((d) => d.status === "archived");
}

/**
 * Resolves a slug for the detail route.
 *
 * Deliberately includes withdrawn resources — see the note at the top of this
 * file. Drafts and in-review items are excluded, because those have never been
 * public and no citation can exist.
 */
export function getDownload(slug: string): DownloadResource | undefined {
  return allDownloads.find(
    (d) => d.slug === slug && (d.status === "published" || d.status === "archived")
  );
}

/** Every slug the route must build: live resources and withdrawn ones alike. */
export function routableDownloads(): DownloadResource[] {
  return [...publishedDownloads(), ...withdrawnDownloads()];
}

export function isWithdrawn(item: DownloadResource): boolean {
  return item.status === "archived";
}

export function wasRevised(item: DownloadResource): boolean {
  return (item.previousVersions ?? []).length > 0;
}

export function lastModified(item: DownloadResource): string | undefined {
  return item.updatedDate ?? item.publishedDate;
}

// ---------------------------------------------------------------------------
// Delivery
// ---------------------------------------------------------------------------

export interface DeliveryFormat {
  format: string;
  label: string;
  url: string;
  sizeBytes: number;
  sizeLabel: string;
}

/**
 * Every file this resource can be taken away as, primary format first.
 *
 * An HTML-native resource returns an empty array. That is not a defect and
 * callers must not treat it as one: its delivery is the landing page itself,
 * which `printableHtml` marks. Rule R1 guarantees that at least one of the two
 * exists on anything published.
 */
export function deliveryFormats(item: DownloadResource): DeliveryFormat[] {
  const out: DeliveryFormat[] = [];

  if (item.fileUrl && item.fileFormat !== "html") {
    out.push({
      format: item.fileFormat,
      label: FORMAT_LABELS[item.fileFormat] ?? item.fileFormat.toUpperCase(),
      url: item.fileUrl,
      sizeBytes: item.fileSizeBytes ?? 0,
      sizeLabel: formatBytes(item.fileSizeBytes),
    });
  }

  for (const extra of item.additionalFormats ?? []) {
    out.push({
      format: extra.format,
      label: FORMAT_LABELS[extra.format] ?? extra.format.toUpperCase(),
      url: extra.fileUrl,
      sizeBytes: extra.fileSizeBytes,
      sizeLabel: formatBytes(extra.fileSizeBytes),
    });
  }

  return out;
}

export function hasPrintableHtml(item: DownloadResource): boolean {
  return item.printableHtml === true;
}

/**
 * Human file size.
 *
 * kB and MB rather than KiB and MiB: this number appears next to a download
 * link for a facilities manager, not in a systems readout, and it exists to
 * answer "will this be slow on my phone".
 */
export function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1000) return `${bytes} bytes`;
  if (bytes < 1000 * 1000) return `${Math.round(bytes / 1000)} kB`;
  return `${(bytes / (1000 * 1000)).toFixed(1)} MB`;
}

// ---------------------------------------------------------------------------
// Relations. Authored on the Downloads side, derived everywhere else — the same
// discipline as PRs 5 to 7, so the two halves cannot disagree.
// ---------------------------------------------------------------------------

export function guidesReferencedBy(item: DownloadResource): Guide[] {
  return (item.relatedArticles ?? [])
    .map((slug) => allGuides.find((g) => g.slug === slug && g.status === "published"))
    .filter((g): g is Guide => Boolean(g));
}

export function standardsReferencedBy(item: DownloadResource): Standard[] {
  return (item.relatedStandards ?? [])
    .map((slug) => allStandards.find((s) => s.slug === slug && s.status === "published"))
    .filter((s): s is Standard => Boolean(s));
}

export function legislationReferencedBy(item: DownloadResource): Legislation[] {
  return (item.relatedLegislation ?? [])
    .map((slug) => allLegislation.find((l) => l.slug === slug && l.status === "published"))
    .filter((l): l is Legislation => Boolean(l));
}

export function termsReferencedBy(item: DownloadResource): GlossaryTerm[] {
  return (item.relatedGlossaryTerms ?? [])
    .map((slug) => allTerms.find((t) => t.slug === slug && t.status === "published"))
    .filter((t): t is GlossaryTerm => Boolean(t));
}

export function newsReferencedBy(item: DownloadResource): NewsItem[] {
  return (item.relatedNews ?? [])
    .map((slug) => allNews.find((n) => n.slug === slug && n.status === "published"))
    .filter((n): n is NewsItem => Boolean(n));
}

/** Peer resources, self-references dropped and withdrawn ones excluded. */
export function relatedDownloadResources(item: DownloadResource): DownloadResource[] {
  const live = publishedDownloads();
  return (item.relatedDownloads ?? [])
    .filter((slug) => slug !== item.slug)
    .map((slug) => live.find((d) => d.slug === slug))
    .filter((d): d is DownloadResource => Boolean(d));
}

/**
 * The replacement for a withdrawn resource.
 *
 * Returns published successors only. A withdrawal pointing at another withdrawn
 * resource would send a reader from one dead end to the next, which is worse
 * than saying plainly that there is no replacement.
 */
export function successorsOf(item: DownloadResource): DownloadResource[] {
  const live = publishedDownloads();
  return (item.supersededBy ?? [])
    .map((slug) => live.find((d) => d.slug === slug))
    .filter((d): d is DownloadResource => Boolean(d));
}

// The inverses. Derived by scanning the Downloads collection, never authored on
// the target, so a Standard cannot claim a resource that does not point back.

export function downloadsForGuide(slug: string): DownloadResource[] {
  return publishedDownloads().filter((d) => (d.relatedArticles ?? []).includes(slug));
}

export function downloadsForStandard(slug: string): DownloadResource[] {
  return publishedDownloads().filter((d) => (d.relatedStandards ?? []).includes(slug));
}

export function downloadsForLegislation(slug: string): DownloadResource[] {
  return publishedDownloads().filter((d) => (d.relatedLegislation ?? []).includes(slug));
}

export function downloadsForTerm(slug: string): DownloadResource[] {
  return publishedDownloads().filter((d) => (d.relatedGlossaryTerms ?? []).includes(slug));
}

export function downloadsForNews(slug: string): DownloadResource[] {
  return publishedDownloads().filter((d) => (d.relatedNews ?? []).includes(slug));
}

/** Resources that reference this one. Derived by inversion — never authored. */
export function downloadsReferencing(slug: string): DownloadResource[] {
  return publishedDownloads().filter((d) => (d.relatedDownloads ?? []).includes(slug));
}

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

export function resourceTypeLabel(item: DownloadResource): string {
  return RESOURCE_TYPE_LABELS[item.resourceType] ?? item.resourceType;
}

export function sectionLabel(item: DownloadResource): string {
  return getContentCategory(item.category)?.label ?? item.category;
}

export function tagLabels(item: DownloadResource): string[] {
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

export interface RecordFact {
  label: string;
  value: string;
  iso?: string;
}

/**
 * "The record" block on the landing page.
 *
 * Version and review dates sit here rather than in prose because they are the
 * facts a reader checks before trusting a template — and the facts they will
 * need again in a year, when the completed form is in a folder and the question
 * is which version it came from.
 */
export function recordFacts(item: DownloadResource): RecordFact[] {
  const out: RecordFact[] = [];
  const pushDate = (label: string, raw?: string) => {
    const iso = raw?.slice(0, 10);
    const value = formatDate(raw);
    if (iso && value) out.push({ label, value, iso });
  };

  out.push({ label: "Version", value: item.version });
  pushDate("Published", item.publishedDate);
  if (item.updatedDate && item.updatedDate !== item.publishedDate) {
    pushDate("Last updated", item.updatedDate);
  }
  pushDate("Last reviewed", item.reviewedDate);
  if (!isWithdrawn(item)) pushDate("Next review due", item.nextReviewDue);
  if (isWithdrawn(item)) pushDate("Withdrawn", item.withdrawnDate);
  if (item.pageCount) {
    out.push({ label: "Length", value: `${item.pageCount} page${item.pageCount === 1 ? "" : "s"}` });
  }

  return out;
}

export function buildDownloadBreadcrumbs(item: DownloadResource): Crumb[] {
  return [
    { name: "Home", path: "/" },
    { name: "Knowledge Centre", path: KNOWLEDGE_PATH },
    { name: "Downloads", path: DOWNLOADS_PATH },
    { name: item.title },
  ];
}

export const DOWNLOADS_INDEX_CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Knowledge Centre", path: KNOWLEDGE_PATH },
  { name: "Downloads" },
];
