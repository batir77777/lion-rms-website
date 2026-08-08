import type { MetadataRoute } from "next";
import { SERVICE_CATEGORIES, SECTORS } from "@/lib/site";
import { CASE_STUDIES } from "@/lib/case-studies";
import { publishedGuides, lastModified } from "@/lib/guides";
import { publishedTerms, lastModified as termLastModified, GLOSSARY_PATH } from "@/lib/glossary";
import {
  publishedStandards,
  lastModified as standardLastModified,
  STANDARDS_PATH,
} from "@/lib/standards";
import {
  publishedLegislation,
  isFullyInForce,
  lastModified as legislationLastModified,
  LEGISLATION_PATH,
} from "@/lib/legislation";
import {
  publishedDownloads,
  lastModified as downloadLastModified,
  DOWNLOADS_PATH,
} from "@/lib/downloads";
import {
  publishedNews,
  archiveYears,
  newsInYear,
  lastModified as newsLastModified,
  NEWS_PATH,
} from "@/lib/news";
import { KNOWLEDGE_PATH } from "@/lib/knowledge";
import { authoredPageDate } from "@/lib/page-dates";

// ---------------------------------------------------------------------------
// The sitemap (Phase 5A, PR 10 — sitemap truthfulness).
//
// THERE IS NO BUILD TIMESTAMP IN THIS FILE. That is the whole point of PR 10,
// and it is enforced by absence rather than by discipline: `new Date()` with no
// argument does not appear anywhere below, so there is no code path that can
// produce one. Before this PR, 26 of the 78 URLs carried the moment the build
// ran, which told Google every one of them changed daily.
//
// Every `lastModified` now comes from one of three deterministic sources:
//
//   CONTENT ITEMS (52)      the item's own front-matter date.
//   AGGREGATION PAGES (9)   the newest item the page lists. A listing page
//                           genuinely changes when its newest entry does, so
//                           this needs no registry and never goes stale.
//   AUTHORED PAGES (17)     lib/page-dates.ts, which throws if a route is
//                           missing rather than falling back to anything.
//
// Two live pages are deliberately absent: /privacy and /company-information.
// The latter is noindex, and a sitemap listing a noindexed URL sends two
// contradictory instructions — the same reasoning applied to /search and to
// withdrawn downloads.
// ---------------------------------------------------------------------------

const base = "https://www.lionrms.uk";

/** Parse an ISO date, treating a missing or malformed value as an error. */
function isoDate(value: string | undefined, context: string): Date {
  const day = (value ?? "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    throw new Error(
      `Cannot build the sitemap: ${context} has no usable modification date (got ${JSON.stringify(value)}).`
    );
  }
  return new Date(`${day}T00:00:00Z`);
}

/**
 * The newest date among a set of items — the modification date of the page
 * that lists them.
 *
 * Throws on an empty set rather than substituting a date. An aggregation page
 * with nothing to aggregate is a real problem, and quietly stamping it with
 * something plausible would hide it.
 */
function newestOf(dates: readonly (string | undefined)[], context: string): Date {
  const days = dates.map((d) => (d ?? "").slice(0, 10)).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
  if (days.length === 0) {
    throw new Error(`Cannot build the sitemap: ${context} lists no items with usable dates.`);
  }
  return new Date(`${days.reduce((a, b) => (a > b ? a : b))}T00:00:00Z`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  // --- Authored pages: dates from the registry --------------------------
  //
  // Priorities and change frequencies are unchanged from before PR 10; only
  // the dates move. `authoredPageDate` throws for an unregistered route, so a
  // new page cannot reach the sitemap undated.
  const authoredRoutes = [
    "",
    "/services",
    "/about",
    "/case-studies",
    "/faq",
    "/sectors",
    "/check",
    "/contact",
    ...SERVICE_CATEGORIES.map((c) => `/services/${c.slug}`),
    ...SECTORS.filter((s) => s.hasPage).map((s) => `/sectors/${s.slug}`),
    ...CASE_STUDIES.map((c) => `/case-studies/${c.slug}`),
  ];

  const authoredEntries: MetadataRoute.Sitemap = authoredRoutes.map((route) => ({
    url: `${base}${route}`,
    lastModified: authoredPageDate(route === "" ? "/" : route),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  // --- Knowledge Centre hub ---------------------------------------------
  //
  // Derived from the newest item in ANY section: the hub's "recently updated"
  // panel shows exactly that, so the hub changes when any of the six sections
  // gains something newer.
  const allContentDates = [
    ...publishedGuides().map((g) => lastModified(g)),
    ...publishedTerms().map((t) => termLastModified(t)),
    ...publishedStandards().map((s) => standardLastModified(s)),
    ...publishedLegislation().map((l) => legislationLastModified(l)),
    ...publishedNews().map((n) => newsLastModified(n)),
    ...publishedDownloads().map((d) => downloadLastModified(d)),
  ];

  const knowledgeEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}${KNOWLEDGE_PATH}`,
      lastModified: newestOf(allContentDates, "the Knowledge Centre hub"),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ];

  // --- Guides -------------------------------------------------------------
  const guideEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}/guides`,
      lastModified: newestOf(publishedGuides().map((g) => lastModified(g)), "the guides index"),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...publishedGuides().map((g) => ({
      url: `${base}/guides/${g.slug}`,
      lastModified: isoDate(lastModified(g), `guide "${g.slug}"`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // --- Glossary -----------------------------------------------------------
  const glossaryEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}${GLOSSARY_PATH}`,
      lastModified: newestOf(publishedTerms().map((t) => termLastModified(t)), "the glossary index"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...publishedTerms().map((t) => ({
      url: `${base}${GLOSSARY_PATH}/${t.slug}`,
      lastModified: isoDate(termLastModified(t), `glossary term "${t.slug}"`),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];

  // --- Standards ----------------------------------------------------------
  //
  // Withdrawn and superseded documents STAY. They are live, canonical, useful
  // pages — removing the PAS 79-2 page would remove the answer for the reader
  // most likely to be looking for it.
  const standardEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}${STANDARDS_PATH}`,
      lastModified: newestOf(
        publishedStandards().map((s) => standardLastModified(s)),
        "the standards index"
      ),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...publishedStandards().map((s) => ({
      url: `${base}${STANDARDS_PATH}/${s.slug}`,
      lastModified: isoDate(standardLastModified(s), `standard "${s.slug}"`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  // --- Legislation --------------------------------------------------------
  //
  // Repealed and revoked instruments STAY, for the reader arriving from a 2019
  // assessment that cites one. Priority drops slightly for anything not wholly
  // in force — an honest signal of relative importance, not a suppression.
  const legislationEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}${LEGISLATION_PATH}`,
      lastModified: newestOf(
        publishedLegislation().map((l) => legislationLastModified(l)),
        "the legislation index"
      ),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    ...publishedLegislation().map((l) => ({
      url: `${base}${LEGISLATION_PATH}/${l.slug}`,
      lastModified: isoDate(legislationLastModified(l), `instrument "${l.slug}"`),
      changeFrequency: "monthly" as const,
      priority: isFullyInForce(l) ? 0.6 : 0.5,
    })),
  ];

  // --- News ---------------------------------------------------------------
  //
  // Year archives are derived from the items in that year specifically, not
  // from the whole collection: the 2025 archive does not change when a 2026
  // item is published.
  const newsEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}${NEWS_PATH}`,
      lastModified: newestOf(publishedNews().map((n) => newsLastModified(n)), "the news index"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...archiveYears().map((y) => ({
      url: `${base}${NEWS_PATH}/${y.year}`,
      lastModified: newestOf(
        newsInYear(y.year).map((n) => newsLastModified(n)),
        `the ${y.year} news archive`
      ),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...publishedNews().map((n) => ({
      url: `${base}${NEWS_PATH}/${n.slug}`,
      lastModified: isoDate(newsLastModified(n), `news item "${n.slug}"`),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];

  // --- Downloads ----------------------------------------------------------
  //
  // LANDING PAGES ONLY. No /static/ file URL ever appears here: the file is
  // what the page offers, not a destination in its own right, and it carries
  // X-Robots-Tag: noindex to match. Withdrawn resources are excluded too —
  // their pages stay at 200 so an old citation still resolves, but they are
  // noindex.
  const downloadEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}${DOWNLOADS_PATH}`,
      lastModified: newestOf(
        publishedDownloads().map((d) => downloadLastModified(d)),
        "the downloads index"
      ),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...publishedDownloads().map((d) => ({
      url: `${base}${DOWNLOADS_PATH}/${d.slug}`,
      lastModified: isoDate(downloadLastModified(d), `download "${d.slug}"`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];

  return [
    ...authoredEntries,
    ...knowledgeEntries,
    ...guideEntries,
    ...glossaryEntries,
    ...standardEntries,
    ...legislationEntries,
    ...newsEntries,
    ...downloadEntries,
  ];
}
